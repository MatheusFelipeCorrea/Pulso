const { normalize } = require('./recursoCategoriaRules');
const { KEYWORD_GROUPS } = require('./importCategoryKeywordGroups');

const isOutros = (categoria) => normalize(categoria?.nome) === 'outros';

const buscarCategoriaPorNomes = (categorias, nomes = [], tipo) => {
    for (const nome of nomes) {
        const match = categorias.find(
            (cat) => cat.tipo === tipo && normalize(cat.nome) === normalize(nome)
        );
        if (match) return match;
    }
    return null;
};

const buscarCategoriaPorGrupos = (categorias, grupos = [], tipo) => {
    for (const grupo of grupos) {
        const match = categorias.find((cat) => cat.tipo === tipo && cat.grupoBeneficio === grupo);
        if (match) return match;
    }
    return null;
};

const resolveCategoriaFromGroup = (group, categorias, tipo) => {
    const porNome = buscarCategoriaPorNomes(categorias, group.nomes, tipo);
    if (porNome) return porNome;

    const porGrupo = buscarCategoriaPorGrupos(categorias, group.grupos, tipo);
    if (porGrupo) return porGrupo;

    return null;
};

const normalizeForMatch = (value) =>
    String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SPECIFIC_GROUPS_FIRST = new Set([
    'beleza',
    'saude',
    'vestuario',
    'tecnologia',
    'pet',
    'educacao',
    'viagem',
    'veiculos',
    'financas',
    'trabalho',
    'familia',
]);

const ORDERED_KEYWORD_GROUPS = [
    ...KEYWORD_GROUPS.filter((group) => SPECIFIC_GROUPS_FIRST.has(group.id)),
    ...KEYWORD_GROUPS.filter((group) => !SPECIFIC_GROUPS_FIRST.has(group.id)),
];

const matchesKeywordTerm = (texto, keyword) => {
    const term = normalizeForMatch(keyword);
    if (!term) return false;

    if (term.length <= 4 || term.includes(' ')) {
        const pattern = term.includes(' ')
            ? escapeRegex(term)
            : `(^|\\s)${escapeRegex(term)}(\\s|$)`;
        return new RegExp(pattern, 'i').test(texto);
    }

    return texto.includes(term);
};
const matchesExclude = (texto, exclude = []) =>
    exclude.some((term) => texto.includes(normalizeForMatch(term)));

const matchesSuffix = (texto, suffixes = []) =>
    suffixes.some((suffix) => texto.includes(normalizeForMatch(suffix)));

const matchesKeyword = (texto, keywords = []) =>
    keywords.some((keyword) => matchesKeywordTerm(texto, keyword));

const matchesGroup = (texto, group) => {
    if (group.exclude?.length && matchesExclude(texto, group.exclude)) {
        return false;
    }

    if (group.suffixes?.length && matchesSuffix(texto, group.suffixes)) {
        return true;
    }

    return matchesKeyword(texto, group.keywords ?? []);
};

const encontrarCategoriaPorRegra = (descricao, categorias = [], tipoTransacao = null) => {
    const texto = normalizeForMatch(descricao);
    if (!texto) return null;

    for (const group of ORDERED_KEYWORD_GROUPS) {
        if (tipoTransacao && group.tipos && !group.tipos.includes(tipoTransacao)) continue;
        if (!matchesGroup(texto, group)) continue;

        const tipo = tipoTransacao ?? group.tipos?.[0] ?? 'DESPESA';
        const categoria = resolveCategoriaFromGroup(group, categorias, tipo);
        if (categoria) return categoria.id;
    }

    return null;
};

/** Compatibilidade com testes e docs legados */
const KEYWORD_RULES = KEYWORD_GROUPS;

module.exports = {
    KEYWORD_RULES,
    KEYWORD_GROUPS,
    ORDERED_KEYWORD_GROUPS,
    encontrarCategoriaPorRegra,
    isOutros,
    matchesGroup,
    matchesKeywordTerm,
};
