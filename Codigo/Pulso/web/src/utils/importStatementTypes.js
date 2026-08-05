import { Banknote, Bus, CreditCard, Utensils } from 'lucide-react'

const PDF_ACCEPT = '.pdf,application/pdf'

/** Tipos de importação de extrato em PDF (RF-155/156). */
export const IMPORT_STATEMENT_TYPES = [
  {
    id: 'CONTA',
    label: 'Extrato da conta',
    description: 'Bancos e contas digitais',
    accept: PDF_ACCEPT,
    icon: CreditCard,
    recurso: 'DINHEIRO',
  },
  {
    id: 'VT',
    label: 'Vale-Transporte',
    description: 'Qualquer operadora de VT',
    accept: PDF_ACCEPT,
    icon: Bus,
    recurso: 'VT',
  },
  {
    id: 'VA',
    label: 'Vale-Alimentação',
    description: 'Pluxee, Swile e demais operadoras',
    accept: PDF_ACCEPT,
    icon: Banknote,
    recurso: 'VA',
  },
  {
    id: 'VR',
    label: 'Vale-Refeição',
    description: 'Pluxee, Alelo e demais operadoras',
    accept: PDF_ACCEPT,
    icon: Utensils,
    recurso: 'VR',
  },
]

const EXTENSIONS_BY_TYPE = {
  CONTA: ['pdf'],
  VT: ['pdf'],
  VA: ['pdf'],
  VR: ['pdf'],
}

export function getImportStatementType(id) {
  return IMPORT_STATEMENT_TYPES.find((t) => t.id === id) ?? null
}

export function isImportFileAllowed(file, typeId) {
  if (!file || !typeId) return false
  const ext = file.name.split('.').pop()?.toLowerCase()
  return Boolean(ext && EXTENSIONS_BY_TYPE[typeId]?.includes(ext))
}

export function formatImportFormats() {
  return 'PDF'
}
