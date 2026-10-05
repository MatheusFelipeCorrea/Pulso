/**
 * Resolve imagem de item de compra:
 * 1) URL direta de imagem
 * 2) og:image / twitter:image de página (link da loja ou URL informada)
 * 3) Wikimedia Commons / Wikipedia pelo nome do produto
 */

const WIKI_USER_AGENT = 'PulsoApp/1.0 (https://github.com/MatheusFelipeCorrea/Pulso; compras@pulso.local)';
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)(\?|$)/i;
const FETCH_TIMEOUT_MS = 9000;

const REJECT_COMMONS_FILE =
    /(flag|bandeira|logo|escudo|coat of arms|mapa|icon|seal|emblem|svg|diagram|locator|heraldic|arms of|screenshot of wikipedia)/i;

const PREFER_PRODUCT_FILE =
    /(product|produto|smartphone|iphone|laptop|notebook|headphone|fone|watch|camera|console|tablet)/i;

function decodeHtmlEntities(value) {
    return String(value ?? '')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

function isHttpUrl(value) {
    try {
        const parsed = new URL(String(value).trim());
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

function isDirectImageUrl(url) {
    if (!isHttpUrl(url)) return false;
    try {
        const { pathname } = new URL(url);
        if (IMAGE_EXT.test(pathname)) return true;
        if (/\/images?\/|\/img\/|\/media\/|\/upload\//i.test(pathname)) return true;
    } catch {
        return false;
    }
    return false;
}

async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

async function validateImageReachable(url) {
    try {
        const head = await fetchWithTimeout(url, {
            method: 'HEAD',
            headers: { 'User-Agent': WIKI_USER_AGENT },
            redirect: 'follow',
        });
        if (head.ok) {
            const type = head.headers.get('content-type') || '';
            if (type.startsWith('image/')) return url;
        }
    } catch {
        // tenta GET parcial abaixo
    }

    try {
        const get = await fetchWithTimeout(url, {
            method: 'GET',
            headers: { 'User-Agent': WIKI_USER_AGENT, Range: 'bytes=0-0' },
            redirect: 'follow',
        });
        if (!get.ok) return null;
        const type = get.headers.get('content-type') || '';
        return type.startsWith('image/') ? url : null;
    } catch {
        return null;
    }
}

function extractMetaImage(html) {
    if (!html) return null;
    const patterns = [
        /property=["']og:image:secure_url["'][^>]*content=["']([^"']+)["']/i,
        /content=["']([^"']+)["'][^>]*property=["']og:image:secure_url["']/i,
        /property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
        /content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
        /name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
        /content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
    ];

    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match?.[1]) {
            const decoded = decodeHtmlEntities(match[1]).trim();
            if (isHttpUrl(decoded)) return decoded;
        }
    }
    return null;
}

async function fetchOgImageFromPage(pageUrl) {
    if (!isHttpUrl(pageUrl)) return null;

    try {
        const response = await fetchWithTimeout(pageUrl, {
            headers: {
                Accept: 'text/html,application/xhtml+xml',
                'User-Agent': WIKI_USER_AGENT,
            },
            redirect: 'follow',
        });
        if (!response.ok) return null;

        const html = (await response.text()).slice(0, 400_000);
        const imageUrl = extractMetaImage(html);
        if (!imageUrl) return null;

        if (isDirectImageUrl(imageUrl)) {
            const valid = await validateImageReachable(imageUrl);
            return valid || imageUrl;
        }

        return imageUrl;
    } catch {
        return null;
    }
}

async function fetchWikiProductThumbnail(title) {
    const encodedTitle = encodeURIComponent(String(title).trim());
    for (const lang of ['pt', 'en']) {
        try {
            const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`;
            const response = await fetchWithTimeout(url, {
                headers: { Accept: 'application/json', 'User-Agent': WIKI_USER_AGENT },
            });
            if (!response.ok) continue;
            const data = await response.json();
            const source = data?.thumbnail?.source;
            if (source && !/(Flag_of|logo|icon)/i.test(source)) {
                return source.replace(/\/(\d+)px-/, '/330px-');
            }
        } catch {
            // próximo idioma
        }
    }
    return null;
}

async function searchCommonsProductImage(query) {
    const params = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrnamespace: '6',
        gsrsearch: query,
        gsrlimit: '10',
        prop: 'imageinfo',
        iiprop: 'url|thumburl',
        iiurlwidth: '330',
        format: 'json',
    });

    try {
        const response = await fetchWithTimeout(
            `https://commons.wikimedia.org/w/api.php?${params}`,
            { headers: { 'User-Agent': WIKI_USER_AGENT } }
        );
        if (!response.ok) return null;

        const data = await response.json();
        const pages = data?.query?.pages;
        if (!pages) return null;

        const candidates = Object.values(pages)
            .map((page) => {
                const info = page.imageinfo?.[0];
                return {
                    title: page.title || '',
                    url: info?.thumburl || info?.url || null,
                };
            })
            .filter((item) => item.url && !REJECT_COMMONS_FILE.test(item.title));

        const preferred = candidates.find((item) => PREFER_PRODUCT_FILE.test(item.title));
        return preferred?.url || candidates[0]?.url || null;
    } catch {
        return null;
    }
}

function buildProductSearchQueries(nome) {
    const base = String(nome ?? '').trim();
    if (!base) return [];

    const queries = [base, `${base} product`];
    if (/iphone|macbook|ipad|galaxy|playstation|xbox/i.test(base)) {
        queries.unshift(base);
    }
    return [...new Set(queries.filter((q) => q.length > 2))];
}

async function searchInternetProductImage(nome) {
    const queries = buildProductSearchQueries(nome);
    for (const query of queries) {
        const wiki = await fetchWikiProductThumbnail(query);
        if (wiki) return wiki;

        const commons = await searchCommonsProductImage(query);
        if (commons) return commons;
    }
    return null;
}

/**
 * @param {{ nome?: string, imagemUrl?: string|null, linkProduto?: string|null, buscarNaInternet?: boolean }} input
 * @returns {Promise<{ imagemUrl: string|null, fonte: string|null }>}
 */
async function resolvePurchaseItemImage(input = {}) {
    const nome = String(input.nome ?? '').trim();
    const imagemUrl = input.imagemUrl?.trim() || null;
    const linkProduto = input.linkProduto?.trim() || null;
    const buscarNaInternet = input.buscarNaInternet !== false;

    if (imagemUrl) {
        if (isDirectImageUrl(imagemUrl)) {
            const valid = await validateImageReachable(imagemUrl);
            return { imagemUrl: valid || imagemUrl, fonte: 'url_direta' };
        }

        const fromPage = await fetchOgImageFromPage(imagemUrl);
        if (fromPage) return { imagemUrl: fromPage, fonte: 'pagina_imagem' };
    }

    if (linkProduto) {
        const fromStore = await fetchOgImageFromPage(linkProduto);
        if (fromStore) return { imagemUrl: fromStore, fonte: 'link_produto' };
    }

    if (buscarNaInternet && nome) {
        const fromWeb = await searchInternetProductImage(nome);
        if (fromWeb) return { imagemUrl: fromWeb, fonte: 'busca_internet' };
    }

    return { imagemUrl: null, fonte: null };
}

module.exports = {
    resolvePurchaseItemImage,
    isDirectImageUrl,
    isHttpUrl,
};
