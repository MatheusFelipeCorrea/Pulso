/**
 * Normaliza nome de pessoa: trim + primeira letra de cada palavra em maiúscula.
 */
const formatPersonName = (name) => {
    if (name == null) return '';

    const trimmed = String(name).trim().replace(/\s+/g, ' ');
    if (!trimmed) return '';

    return trimmed
        .split(' ')
        .map((word) => {
            if (!word) return '';
            const lower = word.toLocaleLowerCase('pt-BR');
            return lower.charAt(0).toLocaleUpperCase('pt-BR') + lower.slice(1);
        })
        .join(' ');
};

module.exports = { formatPersonName };
