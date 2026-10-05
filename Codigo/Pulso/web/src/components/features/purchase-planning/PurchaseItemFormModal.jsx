import { useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar,
  CalendarClock,
  CircleDollarSign,
  Link2,
  MessageSquare,
  Package,
  Plus,
  Target,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { InputNumber } from '@/design-system/components/inputs/InputNumber/InputNumber.jsx'
import { Textarea } from '@/design-system/components/inputs/Textarea/Textarea.jsx'
import { Toggle } from '@/design-system/components/forms/Toggle/Toggle.jsx'
import { Select } from '@/design-system/components/selects/Select/Select.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { inferirTipoMeta } from '@/utils/goalBalanceUtils.js'
import { PRIORIDADE_OPTIONS, capitalizeNomeItem } from '@/utils/purchasePlanningUtils.js'
import { PurchaseItemImagePicker } from '@/components/features/purchase-planning/PurchaseItemImagePicker.jsx'
import { PurchaseInstallmentGauge } from '@/components/features/purchase-planning/PurchaseInstallmentGauge.jsx'
import {
  GOAL_LINK_TABS,
  GoalLinkModeToggle,
} from '@/components/features/purchase-planning/GoalLinkModeToggle.jsx'
import { getGoalIcon } from '@/utils/goalIconRules.js'
import * as metaService from '@/services/metaService.js'
import * as purchasePlanningService from '@/services/purchasePlanningService.js'

const emptyForm = () => ({
  nome: '',
  valorEstimado: 0,
  prioridade: 'MEDIA',
  categoria: 'OUTROS',
  observacoes: '',
  linkProduto: '',
  imagemUrl: '',
  simularParcelas: true,
  parcelas: 0,
  vincularMeta: false,
  metaId: null,
  criarMeta: {
    nome: '',
    valorAlvo: 0,
    prazo: null,
  },
  goalTab: GOAL_LINK_TABS.EXISTING,
})

export function PurchaseItemFormModal({
  open,
  onClose,
  onSubmit,
  item = null,
  submitting = false,
  rendaMensal = 0,
}) {
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [imageFonte, setImageFonte] = useState(null)
  const [buscandoImagem, setBuscandoImagem] = useState(false)
  const [metas, setMetas] = useState([])
  const [loadingMetas, setLoadingMetas] = useState(false)
  const [error, setError] = useState('')
  const isEdit = Boolean(item)

  const carregarMetas = useCallback(async (signal) => {
    setLoadingMetas(true)
    try {
      const data = await metaService.buscarMetas(
        { status: 'ATIVA', limite: 50, pagina: 1 },
        { signal }
      )
      setMetas(data.metas ?? [])
    } catch {
      if (!signal?.aborted) setMetas([])
    } finally {
      if (!signal?.aborted) setLoadingMetas(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    setError('')

    if (item) {
      setForm({
        nome: item.nome ?? '',
        valorEstimado: Number(item.valorEstimado) || 0,
        prioridade: item.prioridade ?? 'MEDIA',
        categoria: item.categoria ?? 'OUTROS',
        observacoes: item.observacoes ?? '',
        linkProduto: item.linkProduto ?? '',
        imagemUrl: item.imagemUrl ?? '',
        simularParcelas: item.simularParcelas ?? true,
        parcelas: item.parcelas ?? 12,
        vincularMeta: false,
        metaId: null,
        criarMeta: {
          nome: item.nome ? `Comprar: ${item.nome}` : '',
          valorAlvo: Number(item.valorEstimado) || 0,
          prazo: null,
        },
        goalTab: GOAL_LINK_TABS.EXISTING,
      })
    } else {
      setForm(emptyForm())
    }
    setImageFile(null)
    setImageFonte(null)

    const controller = new AbortController()
    carregarMetas(controller.signal)
    return () => controller.abort()
  }, [open, item, carregarMetas])

  const metaOptions = useMemo(
    () =>
      metas.map((meta) => {
        const Icon = getGoalIcon(meta.nome)
        return {
          value: meta.id,
          label: meta.nome,
          icon: <Icon size={14} aria-hidden />,
          trailingText: formatCurrency(meta.valorAlvo),
        }
      }),
    [metas]
  )

  const updateForm = (patch) => setForm((prev) => ({ ...prev, ...patch }))

  const buscarImagem = async () => {
    if (!form.nome.trim() && !form.linkProduto.trim() && !form.imagemUrl.trim()) {
      setError('Informe o nome do item ou um link para buscar a imagem.')
      return
    }

    setBuscandoImagem(true)
    setError('')
    try {
      const resultado = await purchasePlanningService.resolverImagem({
        nome: form.nome.trim() || undefined,
        imagemUrl: form.imagemUrl.trim() || null,
        linkProduto: form.linkProduto.trim() || null,
        buscarNaInternet: true,
      })
      if (resultado?.imagemUrl) {
        setImageFile(null)
        updateForm({ imagemUrl: resultado.imagemUrl })
        setImageFonte(resultado.fonte)
      } else {
        setError('Não encontramos uma imagem. Tente outro link ou envie da galeria.')
      }
    } catch (err) {
      setError(err.response?.data?.message ?? 'Erro ao buscar imagem')
    } finally {
      setBuscandoImagem(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.nome.trim()) {
      setError('Informe o nome do item.')
      return
    }
    if (!form.valorEstimado || form.valorEstimado <= 0) {
      setError('Informe um valor estimado maior que zero.')
      return
    }

    if (form.vincularMeta && !isEdit) {
      if (form.goalTab === GOAL_LINK_TABS.EXISTING && !form.metaId) {
        setError('Selecione uma meta ou desative o vínculo.')
        return
      }
      if (form.goalTab === GOAL_LINK_TABS.CREATE && !form.criarMeta.prazo) {
        setError('Informe o prazo da nova meta.')
        return
      }
    }

    const link = form.linkProduto.trim()
    const imagem = form.imagemUrl.trim()

    const payload = {
      nome: capitalizeNomeItem(form.nome.trim()),
      valorEstimado: form.valorEstimado,
      prioridade: form.prioridade,
      observacoes: form.observacoes.trim() || null,
      linkProduto: link || null,
      imagemUrl: imageFile ? null : imagem || null,
      buscarImagemAuto: !imagem && !imageFile,
      simularParcelas: form.simularParcelas,
      parcelas: form.parcelas,
    }

    if (!isEdit && form.vincularMeta) {
      payload.vincularMeta = true
      if (form.goalTab === GOAL_LINK_TABS.EXISTING) {
        payload.metaId = form.metaId
      } else {
        payload.criarMeta = {
          nome: form.criarMeta.nome.trim() || `Comprar: ${form.nome.trim()}`,
          valorAlvo: form.criarMeta.valorAlvo || form.valorEstimado,
          prazo: form.criarMeta.prazo.toISOString(),
          tipo: inferirTipoMeta(form.criarMeta.prazo.toISOString()),
        }
      }
    }

    try {
      await onSubmit?.(payload, imageFile)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível salvar o item.')
    }
  }

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" className="pp-form-modal">
      <form className="pp-form" onSubmit={handleSubmit} noValidate>
        <header className="pp-form__header">
          <div>
            <h2>{isEdit ? 'Editar item' : 'Novo item desejado'}</h2>
            <p>Registre o que você quer comprar e simule o impacto no orçamento.</p>
          </div>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="pp-form__body">
          <InputText
            label={
              <FormFieldLabel icon={Package} tone="purple">
                Nome do item
              </FormFieldLabel>
            }
            value={form.nome}
            onChange={(event) => updateForm({ nome: event.target.value })}
            placeholder="Ex.: Notebook Dell Inspiron"
            required
          />

          <div className="pp-form__row">
            <InputMoney
              label={
                <FormFieldLabel icon={CircleDollarSign} tone="green">
                  Valor estimado
                </FormFieldLabel>
              }
              value={form.valorEstimado}
              onChange={(valorEstimado) => updateForm({ valorEstimado })}
              required
            />
            <Select
              label="Prioridade"
              options={PRIORIDADE_OPTIONS}
              value={form.prioridade}
              onChange={(prioridade) => updateForm({ prioridade })}
            />
          </div>

          <Textarea
            className="pp-form__notes"
            label={
              <FormFieldLabel icon={MessageSquare} tone="blue">
                Observações
              </FormFieldLabel>
            }
            value={form.observacoes}
            onChange={(event) => updateForm({ observacoes: event.target.value })}
            placeholder="Detalhes, cor, loja preferida..."
            maxLength={300}
            rows={3}
          />

          <InputText
            label="Link do produto"
            value={form.linkProduto}
            onChange={(event) => updateForm({ linkProduto: event.target.value })}
            placeholder="https://loja.com/produto..."
            type="url"
          />

          <PurchaseItemImagePicker
            nome={form.nome}
            categoria={form.categoria}
            imagemUrl={form.imagemUrl}
            onImagemUrlChange={(imagemUrl) => {
              updateForm({ imagemUrl })
              setImageFonte(null)
            }}
            file={imageFile}
            onFileChange={setImageFile}
            onBuscarImagem={buscarImagem}
            buscando={buscandoImagem}
            fonte={imageFonte}
          />

          <div className="pp-form__installment">
            <Toggle
              checked={form.simularParcelas}
              onChange={(simularParcelas) => updateForm({ simularParcelas })}
              label={
                <FormFieldLabel icon={CalendarClock} tone="yellow">
                  Simulação de parcelamento
                </FormFieldLabel>
              }
              description="Calcula o impacto das parcelas na sua renda."
            />
            {form.simularParcelas ? (
              <>
                <InputNumber
                  label="Número de parcelas"
                  value={form.parcelas}
                  onChange={(parcelas) => updateForm({ parcelas })}
                  min={1}
                  max={48}
                />
                <PurchaseInstallmentGauge
                  valorEstimado={form.valorEstimado}
                  parcelas={form.parcelas}
                  rendaMensal={rendaMensal}
                />
              </>
            ) : null}
          </div>

          {!isEdit ? (
            <div className="pp-form__goal-fields">
              <Toggle
                checked={form.vincularMeta}
                onChange={(vincularMeta) => updateForm({ vincularMeta })}
                label={
                  <FormFieldLabel icon={Link2} tone="purple">
                    Vincular a uma meta
                  </FormFieldLabel>
                }
                description="Acompanhe o progresso da compra com uma meta financeira."
              />

              {form.vincularMeta ? (
                <>
                  <GoalLinkModeToggle
                    value={form.goalTab}
                    onChange={(goalTab) => updateForm({ goalTab })}
                    existingSlot={
                      loadingMetas ? (
                        <SpinnerDots center label="Carregando metas..." />
                      ) : (
                        <Select
                          options={metaOptions}
                          value={form.metaId}
                          onChange={(metaId) => updateForm({ metaId })}
                          placeholder="Selecione uma meta ativa..."
                        />
                      )
                    }
                  />

                  {form.goalTab === GOAL_LINK_TABS.CREATE ? (
                    <>
                      <InputText
                        label={
                          <FormFieldLabel icon={Target} tone="purple">
                            Nome da meta
                          </FormFieldLabel>
                        }
                        value={form.criarMeta.nome}
                        onChange={(event) =>
                          updateForm({
                            criarMeta: { ...form.criarMeta, nome: event.target.value },
                          })
                        }
                        placeholder="Ex.: Comprar notebook"
                      />
                      <InputMoney
                        label={
                          <FormFieldLabel icon={CircleDollarSign} tone="green">
                            Valor alvo
                          </FormFieldLabel>
                        }
                        value={form.criarMeta.valorAlvo}
                        onChange={(valorAlvo) =>
                          updateForm({
                            criarMeta: { ...form.criarMeta, valorAlvo },
                          })
                        }
                      />
                      <DatePicker
                        label={
                          <FormFieldLabel icon={Calendar} tone="blue">
                            Prazo
                          </FormFieldLabel>
                        }
                        value={form.criarMeta.prazo}
                        onChange={(prazo) =>
                          updateForm({
                            criarMeta: { ...form.criarMeta, prazo },
                          })
                        }
                        minDate={new Date()}
                        placeholder="Selecione a data"
                      />
                      {form.criarMeta.prazo ? (
                        <p className="pp-form__hint">
                          Prazo:{' '}
                          {format(form.criarMeta.prazo, "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                        </p>
                      ) : null}
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
          ) : null}

          {error ? <p className="pp-form__error">{error}</p> : null}
        </div>

        <footer className="pp-form__footer">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            leftIcon={isEdit ? null : <Plus size={16} />}
          >
            {isEdit ? 'Salvar alterações' : 'Adicionar item'}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
