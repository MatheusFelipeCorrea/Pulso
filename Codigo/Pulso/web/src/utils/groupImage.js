import { getTripDestinationImage } from '@/utils/tripDestinationImages.js'
import { repairWikiThumbUrl } from '@/utils/tripWikipediaImage.js'

/** URL personalizada definida pelo admin (null = usar imagem da viagem). */
export function getGrupoUrlImagemPersonalizada(grupo) {
  return grupo?.urlImagem ?? null
}

/** URL final exibida no card/header do grupo. */
export function getGrupoImagemExibicao(grupo) {
  if (grupo?.imagemExibicao) return repairWikiThumbUrl(grupo.imagemExibicao)
  if (grupo?.urlImagem) return grupo.urlImagem

  const cover = getTripDestinationImage(
    grupo?.viagem?.destino,
    grupo?.viagem?.moeda,
    grupo?.viagem?.destinoMeta
  )
  return cover ?? null
}

export function grupoUsaImagemDaViagem(grupo) {
  return !getGrupoUrlImagemPersonalizada(grupo) && Boolean(getGrupoImagemExibicao(grupo))
}
