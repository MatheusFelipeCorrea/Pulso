import { useCallback, useEffect, useRef, useState } from 'react'
import { FileText, Loader2, Upload, Wallet, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { useToast } from '@/design-system/components/feedback/Toast/useToast.js'
import { getResourceConfig } from '@/components/features/dashboard/ResourceCard/resourceConfig.js'
import { ImportColumnMappingStep } from '@/components/features/dashboard/ImportColumnMappingStep.jsx'
import { ImportManualBalanceStep } from '@/components/features/dashboard/ImportManualBalanceStep.jsx'
import { ImportPreviewStep } from '@/components/features/dashboard/ImportPreviewStep.jsx'
import { useTransactionFilterOptions } from '@/hooks/useTransactionFilterOptions.js'
import * as importService from '@/services/importService.js'
import {
  formatImportFormats,
  getImportStatementType,
  IMPORT_STATEMENT_TYPES,
  isImportFileAllowed,
} from '@/utils/importStatementTypes.js'

export function ImportStatementModal({ isOpen, onClose, onImported }) {
  const toast = useToast()
  const fileInputRef = useRef(null)
  const selectedTypeRef = useRef(null)

  const [step, setStep] = useState('pick')
  const [loading, setLoading] = useState(false)
  const [origem, setOrigem] = useState(null)
  const [arquivo, setArquivo] = useState(null)
  const [mapeamento, setMapeamento] = useState({})
  const [colunasDisponiveis, setColunasDisponiveis] = useState([])
  const [linhas, setLinhas] = useState([])
  const [resumo, setResumo] = useState(null)
  const [saldoManual, setSaldoManual] = useState(0)
  const [tipoManual, setTipoManual] = useState(null)

  const { data: opcoesFiltro } = useTransactionFilterOptions({ enabled: isOpen })
  const categorias = opcoesFiltro?.categorias ?? []

  const reset = useCallback(() => {
    setStep('pick')
    setLoading(false)
    setOrigem(null)
    setArquivo(null)
    setMapeamento({})
    setColunasDisponiveis([])
    setLinhas([])
    setResumo(null)
    setSaldoManual(0)
    setTipoManual(null)
    selectedTypeRef.current = null
  }, [])

  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen, reset])

  const analisar = async ({ file, type, mapping = {} }) => {
    setLoading(true)
    try {
      const resultado = await importService.analisarExtrato({
        arquivo: file,
        origem: type.id,
        mapeamento: Object.keys(mapping).length ? mapping : undefined,
      })

      if (resultado.precisaMapeamento) {
        setOrigem(type.id)
        setArquivo(file)
        setColunasDisponiveis(resultado.colunasDisponiveis ?? [])
        setMapeamento({})
        setStep('mapping')
        return
      }

      setOrigem(resultado.origem)
      setArquivo(file)
      setLinhas(resultado.linhas ?? [])
      setResumo({
        totalDetectadas: resultado.totalDetectadas,
        duplicatas: resultado.duplicatas,
        parser: resultado.parser,
        arquivo: resultado.arquivo,
        saldoExtrato: resultado.saldoExtrato ?? null,
      })
      setStep('preview')
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Não foi possível analisar o PDF')
    } finally {
      setLoading(false)
    }
  }

  const processFile = (file, type) => {
    if (!file || !type) return

    if (!isImportFileAllowed(file, type.id)) {
      toast.error(`Use um arquivo ${formatImportFormats()} para ${type.label}.`)
      return
    }

    setOrigem(type.id)
    setArquivo(file)
    analisar({ file, type })
  }

  const handleImportPdf = (type) => {
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

  const handleManualClick = (type) => {
    setOrigem(type.id)
    setTipoManual(type)
    setSaldoManual(0)
    setStep('manual')
  }

  const handleConfirm = async ({ saldoExtratoOverride = null } = {}) => {
    const origemImportacao =
      origem ??
      (linhas[0]?.recurso === 'DINHEIRO' ? 'CONTA' : linhas[0]?.recurso) ??
      null

    if (!origemImportacao) {
      toast.error('Origem da importação não identificada. Volte e selecione o tipo de extrato.')
      return
    }

    const saldoExtrato = saldoExtratoOverride ?? resumo?.saldoExtrato ?? null

    setLoading(true)
    try {
      const resultado = await importService.confirmarImportacao({
        origem: origemImportacao,
        linhas: saldoExtratoOverride != null && step === 'manual' ? [] : linhas,
        saldoExtrato,
      })

      const partes = []
      if (resultado.importadas > 0) {
        partes.push(
          `${resultado.importadas} transação${resultado.importadas === 1 ? '' : 'ões'} registrada${resultado.importadas === 1 ? '' : 's'}`
        )
      }
      if (resultado.ajusteSaldo) {
        partes.push(`saldo ajustado para R$ ${Number(resultado.saldoExtrato).toFixed(2).replace('.', ',')}`)
      }
      toast.success(partes.join(' · ') || 'Importação concluída')

      if (resultado.importadas > 0) {
        toast.info(
          'Para ver as movimentações importadas, amplie o período em Transações — o filtro padrão mostra só o mês atual.',
          null,
          8000
        )
      }
      onImported?.()
      onClose?.()
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Erro ao confirmar importação')
    } finally {
      setLoading(false)
    }
  }

  const modalSize =
    step === 'preview' ? 'xl' : step === 'mapping' ? 'lg' : step === 'manual' ? 'md' : 'md'
  const tipoAtual = tipoManual ?? getImportStatementType(origem)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={modalSize}
      className={`dashboard-import-modal-wrap dashboard-import-modal-wrap--${step}`}
    >
      <div className="dashboard-import-modal">
        <header className="dashboard-import-modal__header">
          <div>
            <h2>Importar extrato</h2>
            <p>
              {step === 'pick' &&
                'Escolha o recurso. Leitura automática de PDF de qualquer banco ou benefício.'}
              {step === 'mapping' && 'Mapeie as colunas do arquivo antes de continuar.'}
              {step === 'preview' && 'Confira saldo, categorias e o que entra na importação.'}
              {step === 'manual' && `Informe o saldo atual de ${tipoAtual?.label ?? 'benefício'}.`}
            </p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="dashboard-import-modal__body">
          {loading && step === 'pick' ? (
            <div className="dashboard-import-modal__loading">
              <Loader2 size={28} className="animate-spin" aria-hidden />
              <p>Analisando PDF…</p>
            </div>
          ) : null}

          {!loading && step === 'pick' ? (
            <>
              <ul className="dashboard-import-modal__list">
                {IMPORT_STATEMENT_TYPES.map((type) => {
                  const Icon = type.icon
                  const resource = getResourceConfig(type.recurso)
                  return (
                    <li
                      key={type.id}
                      className="dashboard-import-modal__card"
                      style={{ '--import-option-color': `var(${resource.colorVar})` }}
                    >
                      <div className="dashboard-import-modal__card-head">
                        <span className="dashboard-import-modal__option-icon" aria-hidden>
                          <Icon size={18} strokeWidth={2} />
                        </span>
                        <div className="dashboard-import-modal__option-body">
                          <strong>{type.label}</strong>
                          <span>{type.description}</span>
                        </div>
                      </div>
                      <div className="dashboard-import-modal__card-actions">
                        <button
                          type="button"
                          className="dashboard-import-modal__action dashboard-import-modal__action--primary"
                          onClick={() => handleImportPdf(type)}
                        >
                          <Upload size={14} aria-hidden />
                          Importar PDF
                        </button>
                        <button
                          type="button"
                          className="dashboard-import-modal__action dashboard-import-modal__action--secondary"
                          onClick={() => handleManualClick(type)}
                        >
                          <Wallet size={14} aria-hidden />
                          Informar saldo
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="dashboard-import-modal__file-input"
                onChange={handleFileInput}
              />
            </>
          ) : null}

          {step === 'mapping' ? (
            <ImportColumnMappingStep
              colunas={colunasDisponiveis}
              mapping={mapeamento}
              onChangeMapping={setMapeamento}
              loading={loading}
              onBack={reset}
              onSubmit={() => {
                const type = IMPORT_STATEMENT_TYPES.find((item) => item.id === origem)
                if (!type || !arquivo) return
                analisar({ file: arquivo, type, mapping: mapeamento })
              }}
            />
          ) : null}

          {step === 'preview' ? (
            <ImportPreviewStep
              linhas={linhas}
              categorias={categorias}
              origem={origem}
              origemLabel={getImportStatementType(origem)?.label}
              arquivoNome={resumo?.arquivo}
              onChangeLinhas={setLinhas}
              onConfirm={() => handleConfirm()}
              onBack={() => setStep('pick')}
              loading={loading}
              resumo={resumo}
              onSaldoExtratoChange={(value) =>
                setResumo((prev) => ({
                  ...(prev ?? {}),
                  saldoExtrato: value > 0 ? value : null,
                }))
              }
            />
          ) : null}

          {step === 'manual' && tipoAtual ? (
            <ImportManualBalanceStep
              type={tipoAtual}
              saldo={saldoManual}
              onSaldoChange={setSaldoManual}
              loading={loading}
              onBack={() => setStep('pick')}
              onConfirm={() => handleConfirm({ saldoExtratoOverride: saldoManual })}
            />
          ) : null}
        </div>

        {step === 'pick' && !loading ? (
          <footer className="dashboard-import-modal__footer">
            <span className="dashboard-import-modal__footer-note">
              <FileText size={14} aria-hidden />
              Apenas PDF · leitura inteligente
            </span>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </footer>
        ) : null}
      </div>
    </Modal>
  )
}
