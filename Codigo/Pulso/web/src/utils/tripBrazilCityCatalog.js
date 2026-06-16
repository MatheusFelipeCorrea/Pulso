/**
 * Catálogo de cidades BR para imagens e Wikipedia (frontend).
 * Manter keywords alinhadas com api/src/constants/tripBrazilDestinations.js
 */
const IMAGE_SIZE = 'w=320&h=420&fit=crop&q=80'
const unsplash = (id) => `https://images.unsplash.com/photo-${id}?${IMAGE_SIZE}`

export const TRIP_BRAZIL_CITY_ENTRIES = [
  {
    keywords: ['sao paulo', 'são paulo'],
    url: unsplash('1555881400-74d7acaacd8b'),
    wikiTitles: ['São Paulo', 'São Paulo (cidade)'],
  },
  {
    keywords: ['rio de janeiro'],
    url: unsplash('1483729558449-99ef09a8c325'),
    wikiTitles: ['Rio de Janeiro'],
  },
  {
    keywords: ['macae', 'macaé'],
    url: unsplash('1483729558449-99ef09a8c325'),
    wikiTitles: ['Macaé'],
  },
  {
    keywords: ['belo horizonte'],
    url: unsplash('1577761260323-02e0f7c75e66'),
    wikiTitles: ['Belo Horizonte'],
  },
  {
    keywords: ['vitoria', 'vitória', 'espirito santo', 'espírito santo', 'vila velha'],
    url: unsplash('1571019613454-1cb2f99b2d8b'),
    wikiTitles: ['Vitória, Espírito Santo', 'Vitória (Espírito Santo)'],
  },
  {
    keywords: ['brasilia', 'brasília'],
    url: unsplash('1544986581-efac024faf62'),
    wikiTitles: ['Brasília'],
  },
  {
    keywords: ['salvador'],
    url: unsplash('1555881400-74d7acaacd8b'),
    wikiTitles: ['Salvador (Bahia)', 'Salvador, Bahia'],
  },
  {
    keywords: ['recife'],
    url: unsplash('1585208733896-02b1ebfd1f05'),
    wikiTitles: ['Recife'],
  },
  {
    keywords: ['fortaleza'],
    url: unsplash('1585208733896-02b1ebfd1f05'),
    wikiTitles: ['Fortaleza'],
  },
  {
    keywords: ['curitiba'],
    url: unsplash('1596484552834-725a8f8d2efb'),
    wikiTitles: ['Curitiba'],
  },
  {
    keywords: ['porto alegre'],
    url: unsplash('1585208733896-02b1ebfd1f05'),
    wikiTitles: ['Porto Alegre'],
  },
  {
    keywords: ['florianopolis', 'florianópolis', 'floripa'],
    url: unsplash('1596484552834-725a8f8d2efb'),
    wikiTitles: ['Florianópolis'],
  },
  {
    keywords: ['manaus'],
    url: unsplash('1516026672322-bc52d61a55d5'),
    wikiTitles: ['Manaus'],
  },
  {
    keywords: ['natal'],
    url: unsplash('1585208733896-02b1ebfd1f05'),
    wikiTitles: ['Natal (Rio Grande do Norte)', 'Natal, Rio Grande do Norte'],
  },
  {
    keywords: ['goiania', 'goiânia'],
    url: unsplash('1544986581-efac024faf62'),
    wikiTitles: ['Goiânia'],
  },
  {
    keywords: ['campinas'],
    url: unsplash('1555881400-74d7acaacd8b'),
    wikiTitles: ['Campinas'],
  },
  {
    keywords: ['belem', 'belém'],
    url: unsplash('1516026672322-bc52d61a55d5'),
    wikiTitles: ['Belém (Pará)', 'Belém, Pará'],
  },
  {
    keywords: ['maceio', 'maceió'],
    url: unsplash('1585208733896-02b1ebfd1f05'),
    wikiTitles: ['Maceió'],
  },
  {
    keywords: ['joao pessoa', 'joão pessoa'],
    url: unsplash('1585208733896-02b1ebfd1f05'),
    wikiTitles: ['João Pessoa'],
  },
]

/** Imagem genérica Brasil — não usar foto do Rio como fallback universal */
export const TRIP_BRAZIL_GENERIC_IMAGE = unsplash('1516026672322-bc52d61a55d5')
