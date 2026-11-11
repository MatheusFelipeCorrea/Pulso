const STORAGE_KEY = 'pulso_login_prefs'

export function loadLoginPrefs() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return { identificador: '', lembrarMe: false }
        const parsed = JSON.parse(raw)
        const lembrarMe = Boolean(parsed?.lembrarMe)
        return {
            lembrarMe,
            identificador: lembrarMe ? String(parsed?.identificador ?? '') : '',
        }
    } catch {
        return { identificador: '', lembrarMe: false }
    }
}

export function saveLoginPrefs({ identificador, lembrarMe }) {
    try {
        if (lembrarMe) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    identificador: String(identificador ?? '').trim(),
                    lembrarMe: true,
                })
            )
            return
        }
        localStorage.removeItem(STORAGE_KEY)
    } catch {
        // ignore quota / private mode
    }
}
