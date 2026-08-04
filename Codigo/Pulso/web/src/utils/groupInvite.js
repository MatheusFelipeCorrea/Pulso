export const GRUPO_CODIGO_REGEX = /^PULSO-[A-Z0-9]{4}$/

export function normalizarCodigoGrupo(value) {
  return String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
}

export function formatarCodigoGrupoInput(value) {
  const raw = normalizarCodigoGrupo(value).replace(/[^A-Z0-9-]/g, '')
  if (!raw) return ''

  const withoutPrefix = raw.startsWith('PULSO-') ? raw.slice(6) : raw.replace(/^PULSO-?/, '')
  const suffix = withoutPrefix.replace(/-/g, '').slice(0, 4)
  return suffix ? `PULSO-${suffix}` : 'PULSO-'
}

export function codigoGrupoCompleto(value) {
  return GRUPO_CODIGO_REGEX.test(normalizarCodigoGrupo(value))
}

export function codigoGrupoParcial(value) {
  const codigo = normalizarCodigoGrupo(value)
  return codigo.length > 0 && !GRUPO_CODIGO_REGEX.test(codigo)
}

export function formatGrupoCodigoDisplay(codigo) {
  return normalizarCodigoGrupo(codigo)
}

export function buildGrupoInviteLink(codigoConvite) {
  const code = normalizarCodigoGrupo(codigoConvite)
  if (!code) return ''
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/groups/join/${encodeURIComponent(code)}`
}

export function formatGrupoInviteLinkDisplay(codigoOuLink) {
  const raw = String(codigoOuLink ?? '').trim()
  if (!raw) return ''

  let host = typeof window !== 'undefined' ? window.location.host : 'pulsoapp.com'
  let code = ''

  if (!raw.includes('/') && !raw.includes('?')) {
    code = codigoGrupoCompleto(raw) ? normalizarCodigoGrupo(raw) : ''
  } else {
    try {
      const url = new URL(raw.includes('://') ? raw : `https://${raw}`)
      host = url.host
      const joinMatch = url.pathname.match(/\/groups\/join\/([^/]+)/i)
      const fromPath = joinMatch?.[1]
      const fromQuery = url.searchParams.get('convite')
      const candidate = normalizarCodigoGrupo(fromPath || fromQuery || '')
      code = codigoGrupoCompleto(candidate) ? candidate : ''
    } catch {
      code = codigoGrupoCompleto(raw) ? normalizarCodigoGrupo(raw) : ''
    }
  }

  return code ? `${host}/groups/join/${code}` : ''
}

export function groupAccentFromName(nome) {
  const palette = [
    ['#7c3aed', '#4c1d95'],
    ['#2563eb', '#1e3a8a'],
    ['#db2777', '#831843'],
    ['#059669', '#064e3b'],
    ['#d97706', '#78350f'],
    ['#0891b2', '#164e63'],
  ]
  const text = String(nome ?? 'Grupo')
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash)
  }
  return palette[Math.abs(hash) % palette.length]
}
