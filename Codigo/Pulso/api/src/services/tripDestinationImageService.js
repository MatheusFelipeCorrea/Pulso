/**
 * Resolve capa de viagem: Wikipedia (artigo do lugar) → Wikimedia Commons (busca geo) → null.
 * Chamado na API ao criar/editar viagem; URL fica em destinoMeta.coverImageUrl.
 */

const WIKI_LANGS = ['pt', 'en'];

const WIKI_USER_AGENT = 'PulsoApp/1.0 (https://github.com/MatheusFelipeCorrea/Pulso; viagens@pulso.local)';

const REJECTED_PLACE_TEXT =
    /(clube de futebol|football club|soccer club|esporte clube|time de futebol|álbum |banda |série de |filme |personagem |jogador de )/i;

const REJECT_COMMONS_FILE =
    /(flag|bandeira|logo|escudo|coat of arms|mapa|icon|seal|emblem|svg|diagram|locator|location map|heraldic|arms of)/i;

const PREFER_COMMONS_FILE =
    /(skyline|panoram|aerial|vista|beach|praia|cathedral|catedral|bridge|ponte|tower|torre|historic|centro|cityscape|landscape|waterfront|orla|costa|montanha|harbor|porto|bay|baía)/i;

/** Títulos Wikipedia desambiguados (label normalizado → títulos). */
const EXTRA_WIKI_TITLES_BY_LABEL = {
    macae: ['Macaé (Rio de Janeiro)', 'Macaé, Rio de Janeiro', 'Macae, Rio de Janeiro'],
    vitoria: ['Vitória, Espírito Santo', 'Vitória (Espírito Santo)'],
    'rio de janeiro': ['Rio de Janeiro'],
    'sao paulo': ['São Paulo', 'São Paulo (cidade)'],
    toquio: ['Tóquio', 'Tokyo', 'Tóquio, Japão'],
    tokyo: ['Tokyo', 'Tóquio'],
    paris: ['Paris', 'Paris, França'],
    londres: ['Londres', 'London'],
    london: ['London', 'Londres'],
    'nova york': ['Nova Iorque', 'New York City'],
    'new york': ['New York City', 'Nova Iorque'],
};

function normalizeLabelKey(label) {
    return String(label ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function isRejectedThumbnailUrl(url) {
    if (!url) return true;
    return /(Flag_of|flag_of|Bandeira_de|bandeira_de|Coat_of_arms|coat_of_arms|Escudo_de|Logotipo|\/flags\/)/i.test(url);
}

function isPlaceWikiSummary(data) {
    if (!data || data.type === 'disambiguation') return false;
    if (!data.thumbnail || !data.thumbnail.source) return false;
    if (isRejectedThumbnailUrl(data.thumbnail.source)) return false;

    const text = `${data.title || ''} ${data.description || ''}`;
    if (REJECTED_PLACE_TEXT.test(text)) return false;

    return true;
}

function resizeWikiThumbnail(url, maxWidth) {
    if (!url) return null;
    const match = url.match(/\/(\d+)px-/);
    if (!match || !maxWidth) return url;

    const current = Number(match[1]);
    if (maxWidth >= current) return url;

    return url.replace(/\/(\d+)px-/, `/${maxWidth}px-`);
}

const WIKI_THUMB_WIDTH = 420;

function normalizeWikiThumbWidth(url, width = WIKI_THUMB_WIDTH) {
    if (!url) return url;
    if (!/\/(\d+)px-/.test(url)) return url;
    return url.replace(/\/(\d+)px-/, `/${width}px-`);
}

function isBrokenCoverUrl(url) {
    return typeof url === 'string' && /\/420px-/.test(url);
}

function repairWikiThumbUrl(url) {
    if (!url || typeof url !== 'string') return url;
    if (!/\/420px-/.test(url)) return url;
    return url.replace(/\/420px-/, '/330px-');
}

async function fetchWikiSummary(lang, title) {
    const encodedTitle = encodeURIComponent(String(title).trim());
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`;
    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
            'User-Agent': WIKI_USER_AGENT,
        },
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!isPlaceWikiSummary(data)) return null;

    return normalizeWikiThumbWidth(data.thumbnail.source);
}

async function fetchPlaceThumbnail(title) {
    for (const lang of WIKI_LANGS) {
        try {
            const thumbnail = await fetchWikiSummary(lang, title);
            if (thumbnail) return thumbnail;
        } catch {
            // próximo idioma
        }
    }
    return null;
}

function buildWikiTitles(destinoMeta, destino) {
    const titles = [];

    if (destinoMeta && destinoMeta.label) {
        const { label, region, countryName } = destinoMeta;
        const extras = EXTRA_WIKI_TITLES_BY_LABEL[normalizeLabelKey(label)];
        if (extras) titles.push(...extras);

        if (region) {
            titles.push(`${label}, ${region}`);
            titles.push(`${label} (${region})`);
            if (countryName) titles.push(`${label}, ${region}, ${countryName}`);
        }
        if (countryName) titles.push(`${label}, ${countryName}`);

        const asciiLabel = String(label)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        if (asciiLabel !== label) {
            titles.push(asciiLabel);
            if (region) titles.push(`${asciiLabel}, ${region}`);
        }
    }

    if (destino) {
        const parts = String(destino)
            .split(/[,;/|]+/)
            .map((part) => part.trim())
            .filter(Boolean);

        for (const part of parts) {
            const extras = EXTRA_WIKI_TITLES_BY_LABEL[normalizeLabelKey(part)];
            if (extras) titles.push(...extras);
            if (part.length > 2) titles.push(part);
        }

        if (parts.length >= 2) {
            titles.push(parts.slice(0, 2).join(', '));
        }
    }

    return [...new Set(titles.filter(Boolean))];
}

function buildCommonsQueries(destinoMeta, destino) {
    const queries = [];

    if (destinoMeta?.label) {
        const parts = [destinoMeta.label, destinoMeta.region, destinoMeta.countryName].filter(Boolean);
        queries.push(parts.join(' '));
        queries.push(`${destinoMeta.label} ${destinoMeta.countryName || ''}`.trim());
        if (destinoMeta.region) {
            queries.push(`${destinoMeta.label} ${destinoMeta.region} city`);
        }
    }

    if (destino) {
        queries.push(String(destino).replace(/,/g, ' '));
    }

    return [...new Set(queries.filter(Boolean))];
}

async function searchCommonsPlaceImage(query) {
    const params = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrnamespace: '6',
        gsrsearch: `filetype:bitmap ${query}`,
        gsrlimit: '12',
        prop: 'imageinfo',
        iiprop: 'url|thumburl',
        iiurlwidth: '330',
        format: 'json',
    });

    const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
        headers: { 'User-Agent': WIKI_USER_AGENT },
    });
    if (!response.ok) return null;

    const data = await response.json();
    const pages = data && data.query && data.query.pages;
    if (!pages) return null;

    const candidates = Object.values(pages)
        .map((page) => {
            const info = page.imageinfo && page.imageinfo[0];
            return {
                title: page.title || '',
                url: (info && (info.thumburl || info.url)) || null,
            };
        })
        .filter((item) => item.url && !REJECT_COMMONS_FILE.test(item.title) && !isRejectedThumbnailUrl(item.url));

    const preferred = candidates.find((item) => PREFER_COMMONS_FILE.test(item.title));
    if (preferred && preferred.url) return preferred.url;
    if (candidates[0] && candidates[0].url) return candidates[0].url;
    return null;
}

async function resolveTripCoverImage({ destino, destinoMeta }) {
    const wikiTitles = buildWikiTitles(destinoMeta, destino);
    for (const title of wikiTitles) {
        const image = await fetchPlaceThumbnail(title);
        if (image) return image;
    }

    const commonsQueries = buildCommonsQueries(destinoMeta, destino);
    for (const query of commonsQueries) {
        const image = await searchCommonsPlaceImage(query);
        if (image) return image;
    }

    return null;
}

async function attachCoverImage(destinoMeta, destino) {
    const base = destinoMeta && typeof destinoMeta === 'object' ? destinoMeta : {};
    if (base.coverImageUrl) {
        const repaired = repairWikiThumbUrl(base.coverImageUrl);
        if (repaired !== base.coverImageUrl) {
            return { ...base, coverImageUrl: repaired };
        }
        return base;
    }

    const coverImageUrl = await resolveTripCoverImage({ destino, destinoMeta: base });
    if (!coverImageUrl) return Object.keys(base).length ? base : destinoMeta;

    return { ...base, coverImageUrl };
}

module.exports = {
    attachCoverImage,
    resolveTripCoverImage,
    buildWikiTitles,
    buildCommonsQueries,
};
