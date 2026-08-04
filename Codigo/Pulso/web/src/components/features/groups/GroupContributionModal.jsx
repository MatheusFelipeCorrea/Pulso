import { useEffect, useMemo, useState } from 'react'
import {
  Calculator,
  Calendar,
  Check,
  CircleDollarSign,
  Coins,
  PartyPopper,
  Target,
  TrendingUp,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { FormFieldLabel } from '@/design-system/components/forms/FormFieldLabel/FormFieldLabel.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar/ProgressBar.jsx'
import { InputMoney } from '@/design-system/components/inputs/InputMoney/InputMoney.jsx'
import { DatePicker } from '@/design-system/components/pickers/DatePicker/DatePicker.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import { GroupThumbnail } from '@/components/features/groups/GroupThumbnail.jsx'
import { getGrupoImagemExibicao } from '@/utils/groupImage.js'
import { mergeMetaAportes } from '@/utils/groupDetailUtils.js'
import { formatGrupoMembroDisplayNome } from '@/utils/groupFormat.js'

export function GroupContributionModal({
  open,
  onClose,
  onSubmit,
  grupo,
  metasAtivas = [],
  selectedMetaId,
  onMetaChange,
  loading,
}) {
  const [valor, setValor] = useState(0)
  const [data, setData] = useState(new Date())
  const [error, setError] = useState('')

  const meta =
    metasAtivas.find((m) => m.id === selectedMetaId) ??
    metasAtivas[0] ??
    grupo?.meta
  const membros = grupo?.membros ?? []
  const aportes = useMemo(() => mergeMetaAportes(meta, membros), [meta, membros])
  const meuAporte = useMemo(
    () => aportes.find((item) => item.souEu) ?? { total: '0.00' },
    [aportes]
  )

  const valorAtualGrupo = Number(meta?.valorAtual ?? 0)
  const valorAlvoGrupo = Number(meta?.valorAlvo ?? 0)
  const percentualAtual =
    valorAlvoGrupo > 0 ? Math.min(100, Math.round((valorAtualGrupo / valorAlvoGrupo) * 100)) : 0
  const progressoAtual = valorAlvoGrupo > 0 ? Math.min(valorAtualGrupo, valorAlvoGrupo) : 0
  const meuTotalAtual = Number(meuAporte.total ?? 0)
  const novoTotalPessoal = meuTotalAtual + Number(valor || 0)
  const novoTotalGrupo = valorAtualGrupo + Number(valor || 0)
  const novoPercentual =
    valorAlvoGrupo > 0 ? Math.min(100, Math.round((novoTotalGrupo / valorAlvoGrupo) * 100)) : 0
  const metaConcluida = valorAlvoGrupo > 0 && novoTotalGrupo >= valorAlvoGrupo
  const totalArrecadado = aportes.reduce((sum, item) => sum + Number(item.total ?? 0), 0)

  useEffect(() => {
    if (!open) return
    setValor(0)
    setData(new Date())
    setError('')
  }, [open])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!valor || valor <= 0) {
      setError('Informe um valor de aporte maior que zero.')
      return
    }
    if (!data) {
      setError('Selecione a data do aporte.')
      return
    }

    try {
      await onSubmit?.({
        valor,
        data: data.toISOString(),
        metaId: meta?.id,
      })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível registrar o aporte.')
    }
  }

  if (!grupo || !meta) return null

  return (
    <Modal isOpen={open} onClose={onClose} size="lg" className="group-contribution-modal">
      <form className="group-contribution-modal__form" onSubmit={handleSubmit} noValidate>
        <header className="group-contribution-modal__header">
          <h2>Fazer Aporte no Grupo</h2>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </header>

        <div className="group-contribution-modal__body">
          <section className="group-contribution-modal__summary" aria-label="Resumo da meta">
            <GroupThumbnail
              nome={grupo.nome}
              src={getGrupoImagemExibicao(grupo)}
              size="sm"
              className="group-contribution-modal__thumb"
            />
            <div className="group-contribution-modal__summary-copy">
              <p className="group-contribution-modal__group-name">
                <Users size={14} aria-hidden />
                <span>{grupo.nome}</span>
              </p>
              <p className="group-contribution-modal__goal-name">
                <Target size={14} aria-hidden />
                <span>Meta: {meta.nome}</span>
              </p>
              <div className="group-contribution-modal__summary-progress">
                <p className="group-contribution-modal__progress-text">
                  <span className="group-contribution-modal__progress-highlight">
                    {formatCurrency(meta.valorAtual)}
                  </span>{' '}
                  de{' '}
                  <span className="group-contribution-modal__progress-muted">
                    {formatCurrency(meta.valorAlvo)}
                  </span>{' '}
                  <span className="group-contribution-modal__progress-highlight">
                    ({percentualAtual}%)
                  </span>
                </p>
                <ProgressBar
                  value={progressoAtual}
                  max={valorAlvoGrupo || 1}
                  variant="success"
                  size="md"
                  className="group-contribution-modal__progress"
                />
              </div>
            </div>
          </section>

          <section className="group-contribution-modal__members" aria-label="Aportes dos membros">
            <h3>Aportes dos membros</h3>
            <div className="group-contribution-modal__members-box">
              <ul>
                {aportes.map((aporte) => (
                  <li key={aporte.usuarioId}>
                    <Avatar
                      name={formatGrupoMembroDisplayNome(aporte.nome, aporte.souEu)}
                      src={aporte.urlAvatar}
                      size="sm"
                      fallback="color"
                    />
                    <UserRound size={14} aria-hidden />
                    <span>{formatGrupoMembroDisplayNome(aporte.nome, aporte.souEu)}</span>
                    <strong>{formatCurrency(aporte.total)}</strong>
                    {aporte.completo ? (
                      <Check size={16} className="group-contribution-modal__check" aria-hidden />
                    ) : null}
                  </li>
                ))}
              </ul>
              <div className="group-contribution-modal__total">
                <Coins size={16} aria-hidden />
                <span>Total arrecadado:</span>
                <strong>{formatCurrency(totalArrecadado)}</strong>
              </div>
            </div>
          </section>

          <section className="group-contribution-modal__inputs" aria-label="Seu aporte">
            <h3>Seu aporte</h3>
            {metasAtivas.length > 1 ? (
              <div className="group-contribution-modal__meta-select">
                <label htmlFor="meta-aporte">Meta</label>
                <select
                  id="meta-aporte"
                  value={meta?.id ?? ''}
                  onChange={(event) => onMetaChange?.(event.target.value)}
                >
                  {metasAtivas.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="group-contribution-modal__row">
              <InputMoney
                label={
                  <FormFieldLabel icon={CircleDollarSign} tone="purple">
                    Valor do seu aporte
                  </FormFieldLabel>
                }
                value={valor}
                onChange={setValor}
              />
              <DatePicker
                label={
                  <FormFieldLabel icon={Calendar} tone="purple">
                    Data
                  </FormFieldLabel>
                }
                value={data}
                onChange={setData}
              />
            </div>
          </section>

          {valor > 0 ? (
            <section className="group-contribution-modal__preview" aria-label="Prévia do aporte">
              <div className="group-contribution-modal__preview-card">
                <div className="group-contribution-modal__preview-row">
                  <span className="group-contribution-modal__preview-icon">
                    <Calculator size={16} aria-hidden />
                  </span>
                  <p>
                    Seu total de aportes ficará:{' '}
                    <strong>
                      {formatCurrency(meuTotalAtual)} + {formatCurrency(valor)} ={' '}
                      <em>{formatCurrency(novoTotalPessoal)}</em>
                    </strong>
                  </p>
                </div>
                <div className="group-contribution-modal__preview-row">
                  <span className="group-contribution-modal__preview-icon">
                    <TrendingUp size={16} aria-hidden />
                  </span>
                  <div className="group-contribution-modal__preview-progress">
                    <p>
                      Progresso da meta do grupo:{' '}
                      <strong>
                        {formatCurrency(novoTotalGrupo)} de {formatCurrency(valorAlvoGrupo)} ({novoPercentual}%)
                      </strong>
                    </p>
                    <ProgressBar
                      value={Math.min(novoTotalGrupo, valorAlvoGrupo)}
                      max={valorAlvoGrupo}
                      variant="success"
                      size="sm"
                    />
                  </div>
                </div>
                {metaConcluida ? (
                  <div className="group-contribution-modal__preview-row group-contribution-modal__preview-row--success">
                    <span className="group-contribution-modal__preview-icon group-contribution-modal__preview-icon--success">
                      <PartyPopper size={16} aria-hidden />
                    </span>
                    <p>🎉 A meta do grupo será concluída! Parabéns! Vocês alcançarão 100% da meta.</p>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {error ? <p className="group-goals-modal__error">{error}</p> : null}
        </div>

        <footer className="group-contribution-modal__footer">
          <Button
            type="button"
            variant="ghost"
            size="md"
            className="group-contribution-modal__cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="group-contribution-modal__submit"
            loading={loading}
            disabled={!valor}
          >
            Registrar Aporte
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
