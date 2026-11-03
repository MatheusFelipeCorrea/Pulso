import { describe, expect, it } from 'vitest'
import {
    getGrupoImagemExibicao,
    getGrupoUrlImagemPersonalizada,
    grupoUsaImagemDaViagem,
} from '@/utils/groupImage.js'

describe('groupImage', () => {
    it('prioriza imagem de exibicao e repara thumb da wiki', () => {
        const grupo = {
            imagemExibicao:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a.jpg/420px-a.jpg',
            urlImagem: 'https://cdn.example/custom.jpg',
        }

        expect(getGrupoUrlImagemPersonalizada(grupo)).toBe('https://cdn.example/custom.jpg')
        expect(getGrupoImagemExibicao(grupo)).toBe(
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a.jpg/330px-a.jpg'
        )
        expect(grupoUsaImagemDaViagem(grupo)).toBe(false)
    })

    it('usa url personalizada quando nao ha imagem de exibicao', () => {
        const grupo = { urlImagem: 'https://cdn.example/capa.jpg' }

        expect(getGrupoImagemExibicao(grupo)).toBe('https://cdn.example/capa.jpg')
        expect(grupoUsaImagemDaViagem(grupo)).toBe(false)
    })

    it('cai na capa da viagem ou em null', () => {
        expect(getGrupoUrlImagemPersonalizada(null)).toBeNull()
        expect(getGrupoImagemExibicao(null)).toBeNull()
        expect(grupoUsaImagemDaViagem(null)).toBe(false)

        const daViagem = getGrupoImagemExibicao({
            viagem: { destino: 'Belo Horizonte', moeda: 'BRL' },
        })
        expect(
            grupoUsaImagemDaViagem({ viagem: { destino: 'Belo Horizonte', moeda: 'BRL' } })
        ).toBe(Boolean(daViagem))
    })
})
