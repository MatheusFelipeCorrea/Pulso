import { afterEach, describe, expect, it } from 'vitest'

import { loadLoginPrefs, saveLoginPrefs } from '@/utils/loginPrefs.js'

describe('utils/loginPrefs', () => {
    afterEach(() => {
        localStorage.clear()
    })

    it('retorna defaults quando não há prefs', () => {
        expect(loadLoginPrefs()).toEqual({
            identificador: '',
            lembrarMe: false,
        })
    })

    it('salva e restaura identificador quando lembrarMe=true', () => {
        saveLoginPrefs({ identificador: ' tester@mail.com ', lembrarMe: true })
        expect(loadLoginPrefs()).toEqual({
            identificador: 'tester@mail.com',
            lembrarMe: true,
        })
    })

    it('limpa prefs quando lembrarMe=false', () => {
        saveLoginPrefs({ identificador: 'a@b.com', lembrarMe: true })
        saveLoginPrefs({ identificador: 'a@b.com', lembrarMe: false })
        expect(loadLoginPrefs()).toEqual({
            identificador: '',
            lembrarMe: false,
        })
    })

    it('ignora JSON corrompido', () => {
        localStorage.setItem('pulso_login_prefs', '{broken')
        expect(loadLoginPrefs()).toEqual({
            identificador: '',
            lembrarMe: false,
        })
    })
})
