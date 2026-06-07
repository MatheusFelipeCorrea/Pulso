import { periodoAtual } from '@/utils/transactionRecurrence.js'

const MS_DIA = 86400000

export function monthValueFromPeriodo(periodo) {
  const [year, month] = (periodo || periodoAtual()).split('-').map(Number)
  return { year, month }
}

export function periodoFromMonthValue(value) {
  if (!value?.year || !value?.month) return periodoAtual()
  return `${value.year}-${String(value.month).padStart(2, '0')}`
}

/** Countdown até o saldo VT resetar (início do mês seguinte ao período selecionado). */
export function calcularResetVt(periodo = periodoAtual()) {
  const [year, month] = periodo.split('-').map(Number)
  const atual = periodoAtual()
  const hoje = startOfDay(new Date())

  const inicioMes = new Date(year, month - 1, 1)
  const fimMes = new Date(year, month, 0)
  const proximoReset = new Date(year, month, 1)

  if (periodo < atual) {
    return {
      isMesAtual: false,
      encerrado: true,
      diasRestantes: 0,
      progresso: 100,
      dataReset: proximoReset,
      status: 'Período encerrado',
      descricao: `Saldo resetou em ${formatDateBR(proximoReset)}`,
    }
  }

  if (periodo > atual) {
    return {
      isMesAtual: false,
      encerrado: false,
      diasRestantes: 0,
      progresso: 0,
      dataReset: inicioMes,
      status: 'Período futuro',
      descricao: `Início em ${formatDateBR(inicioMes)}`,
    }
  }

  const totalDias = fimMes.getDate()
  const diasRestantes = Math.max(
    0,
    Math.ceil((startOfDay(proximoReset).getTime() - hoje.getTime()) / MS_DIA)
  )
  const diasDecorridos = Math.max(0, totalDias - diasRestantes)
  const progresso = Math.min(100, Math.round((diasDecorridos / totalDias) * 100))

  let status = 'Recarga hoje'
  if (diasRestantes === 1) status = 'Recarga amanhã'
  else if (diasRestantes > 1) status = `Recarga em ${diasRestantes} dias`

  return {
    isMesAtual: true,
    encerrado: false,
    diasRestantes,
    progresso,
    dataReset: proximoReset,
    status,
  }
}

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function formatDateBR(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR')
}

export function toISODate(date) {
  const d = date instanceof Date ? date : new Date(date)
  d.setHours(12, 0, 0, 0)
  return d.toISOString()
}

export const MODOS_VT_AUTOMATICOS = new Set(['ESTAGIARIO', 'CLT'])

/** Item VT visível na sidebar */
export function isVtNavVisible(modoUso, vtHabilitado) {
  if (modoUso === 'PESSOA_FISICA') return false
  if (MODOS_VT_AUTOMATICOS.has(modoUso)) return true
  if (modoUso === 'PJ') return vtHabilitado !== false
  return false
}

/** PJ ainda não respondeu se recebe VT */
export function needsVtOptIn(modoUso, vtHabilitado) {
  return modoUso === 'PJ' && vtHabilitado == null
}

/** PJ optou por não usar VT */
export function isVtDisabledByUser(modoUso, vtHabilitado) {
  return modoUso === 'PJ' && vtHabilitado === false
}

/** Pode usar saldo, vendas e usos */
export function canUseVtFeatures(modoUso, vtHabilitado) {
  if (MODOS_VT_AUTOMATICOS.has(modoUso)) return true
  if (modoUso === 'PJ') return vtHabilitado === true
  return false
}

export function filterSidebarNavForUser(navItems, user) {
  const modoUso = user?.modoUso ?? 'CLT'
  const vtHabilitado = user?.vtHabilitado

  return navItems
    .map((item) => {
      if (!item.children) return item

      const children = item.children.filter((child) => {
        if (child.id === 'vale-transporte') {
          return isVtNavVisible(modoUso, vtHabilitado)
        }
        return true
      })

      if (!children.length && !item.path) return null
      return { ...item, children }
    })
    .filter(Boolean)
}

/** @deprecated use canUseVtFeatures */
export function isModoVtPermitido(modoUso) {
  return MODOS_VT_AUTOMATICOS.has(modoUso)
}

export function formatDiferenca(valor) {
  const n = Number(valor)
  if (Number.isNaN(n)) return { text: '—', tone: 'neutral' }
  if (n > 0) return { text: `+ ${formatSigned(n)}`, tone: 'positive' }
  if (n < 0) return { text: `- ${formatSigned(Math.abs(n))}`, tone: 'negative' }
  return { text: formatSigned(0), tone: 'neutral' }
}

function formatSigned(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
