import { useEffect, useRef } from 'react'
import { ChevronRight, FileText, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { getResourceConfig } from '@/components/features/dashboard/ResourceCard/resourceConfig.js'
import {
  formatImportFormats,
  IMPORT_STATEMENT_TYPES,
  isImportFileAllowed,
} from '@/utils/importStatementTypes.js'

function FormatPills({ formats }) {
  return (
    <span className="dashboard-import-modal__formats">
      {formats.map((format) => (
        <span key={format} className="dashboard-import-modal__format-pill">
          {format}
        </span>
      ))}
    </span>
  )
}

export function ImportStatementModal({ isOpen, onClose }) {
  const toast = useToast()
  const fileInputRef = useRef(null)
  const selectedTypeRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      selectedTypeRef.current = null
    }
  }, [isOpen])

  const processFile = (file, type) => {
    if (!file || !type) return

    if (!isImportFileAllowed(file, type.id)) {
      toast.error(`Use um arquivo ${formatImportFormats(type.formats)} para ${type.label}.`)
      return
    }

    const isPdf = file.name.toLowerCase().endsWith('.pdf')
    toast.info(
      isPdf
        ? `PDF "${file.name}" recebido. A leitura de extratos em PDF será processada em breve (RF-155).`
        : `Importação de ${type.label} em desenvolvimento (RF-155). Arquivo "${file.name}" recebido — preview em breve.`
    )
    onClose?.()
  }

  const handleOptionClick = (type) => {
    selectedTypeRef.current = type
    const input = fileInputRef.current
    if (!input) return
    input.accept = type.accept
    input.value = ''
    input.click()
  }

  const handleFileInput = (event) => {
    const type = selectedTypeRef.current
    processFile(event.target.files?.[0], type)
    event.target.value = ''
    selectedTypeRef.current = null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" className="dashboard-import-modal-wrap">
      <div className="dashboard-import-modal">
        <header className="dashboard-import-modal__header">
          <div>
            <h2>Importar extrato</h2>
            <p>Escolha a origem. Aceitamos PDF — comum nos extratos dos bancos.</p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="dashboard-import-modal__body">
          <ul className="dashboard-import-modal__list">
            {IMPORT_STATEMENT_TYPES.map((type) => {
              const Icon = type.icon
              const resource = getResourceConfig(type.recurso)
              return (
                <li key={type.id}>
                  <button
                    type="button"
                    className="dashboard-import-modal__option"
                    style={{ '--import-option-color': `var(${resource.colorVar})` }}
                    onClick={() => handleOptionClick(type)}
                  >
                    <span className="dashboard-import-modal__option-icon" aria-hidden>
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <span className="dashboard-import-modal__option-body">
                      <strong>{type.label}</strong>
                      <span>{type.description}</span>
                      <FormatPills formats={type.formats} />
                    </span>
                    <ChevronRight size={16} className="dashboard-import-modal__option-chevron" aria-hidden />
                  </button>
                </li>
              )
            })}
          </ul>
          <input
            ref={fileInputRef}
            type="file"
            className="dashboard-import-modal__file-input"
            onChange={handleFileInput}
          />
        </div>

        <footer className="dashboard-import-modal__footer">
          <span className="dashboard-import-modal__footer-note">
            <FileText size={14} aria-hidden />
            PDF, planilha ou OFX
          </span>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </footer>
      </div>
    </Modal>
  )
}
