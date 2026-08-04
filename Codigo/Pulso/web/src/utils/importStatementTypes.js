import { Banknote, Bus, CreditCard, Utensils } from 'lucide-react'

/** Tipos de importação de extrato (RF-155/156 — UI pronta, backend em evolução). */
export const IMPORT_STATEMENT_TYPES = [
  {
    id: 'CONTA',
    label: 'Extrato da conta',
    description: 'Conta corrente ou poupança',
    formats: ['PDF', 'OFX', 'CSV'],
    accept: '.pdf,.ofx,.csv,.txt,application/pdf,text/csv,application/x-ofx',
    icon: CreditCard,
    recurso: 'DINHEIRO',
  },
  {
    id: 'VT',
    label: 'Vale-Transporte',
    description: 'Recargas e uso de VT',
    formats: ['PDF', 'CSV', 'XLSX'],
    accept: '.pdf,.csv,.xlsx,.xls,application/pdf,text/csv',
    icon: Bus,
    recurso: 'VT',
  },
  {
    id: 'VA',
    label: 'Vale-Alimentação',
    description: 'Compras com VA',
    formats: ['PDF', 'CSV', 'XLSX'],
    accept: '.pdf,.csv,.xlsx,.xls,application/pdf,text/csv',
    icon: Banknote,
    recurso: 'VA',
  },
  {
    id: 'VR',
    label: 'Vale-Refeição',
    description: 'Compras com VR',
    formats: ['PDF', 'CSV', 'XLSX'],
    accept: '.pdf,.csv,.xlsx,.xls,application/pdf,text/csv',
    icon: Utensils,
    recurso: 'VR',
  },
]

const EXTENSIONS_BY_TYPE = {
  CONTA: ['pdf', 'ofx', 'csv', 'txt'],
  VT: ['pdf', 'csv', 'xlsx', 'xls'],
  VA: ['pdf', 'csv', 'xlsx', 'xls'],
  VR: ['pdf', 'csv', 'xlsx', 'xls'],
}

export function getImportStatementType(id) {
  return IMPORT_STATEMENT_TYPES.find((t) => t.id === id) ?? null
}

export function isImportFileAllowed(file, typeId) {
  if (!file || !typeId) return false
  const ext = file.name.split('.').pop()?.toLowerCase()
  return Boolean(ext && EXTENSIONS_BY_TYPE[typeId]?.includes(ext))
}

export function formatImportFormats(formats = []) {
  return formats.join(' · ')
}
