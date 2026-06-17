import { useState } from 'react'
import { Coins, Globe, Link2, Plane, Plus } from 'lucide-react'
import { GroupDetailSectionTitle } from './GroupDetailSectionTitle.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { formatCurrency } from '@/design-system/utils/formatCurrency.js'
import {
  formatGroupTripDate,
  getExpenseCategoryLabel,
  mergeTripMemberColumns,
  calcularSaldosViagem,
} from '@/utils/groupDetailUtils.js'
import {
  getTripExpenseCategoryColor,
  getTripExpenseCategoryIcon,
} from '@/utils/tripExpenseCategories.js'
import { formatGrupoMembroDisplayNome } from '@/utils/groupFormat.js'
import { GroupTripTransportChips } from './GroupTripTransportChips.jsx'

export function GroupDetailTripCard({
  grupoId,
  viagem,
  membros = [],
  onLinkTrip,
  onAddExpense,
  onEditExpense,
}) {
  const [modoDivisao, setModoDivisao] = useState('PRETENSAO')

  const handleAdd = () => {
    if (!viagem) return
    onAddExpense?.()
  }

  const colunas = viagem ? mergeTripMemberColumns(membros, viagem.membros) : []
  const saldos = viagem ? calcularSaldosViagem(colunas, viagem.totalGrupo, modoDivisao) : []
  const temPretencoes = colunas.some((membro) => membro.despesas.length > 0)
  const memberCount = colunas.length
  const manyMembers = memberCount > 3
  const balanceScroll = memberCount > 3
  const gridClassName =
    memberCount > 1
      ? 'group-detail-trip__grid group-detail-trip__grid--scroll'
      : 'group-detail-trip__grid group-detail-trip__grid--cols-1'

  const renderExpenseCard = (despesa, canEdit) => {
    const Icon = getTripExpenseCategoryIcon(despesa.categoria)
    const color = getTripExpenseCategoryColor(despesa.categoria)

    const content = (
      <>
        <span
          className="group-detail-trip__expense-icon"
          style={{ '--expense-tone': color }}
          aria-hidden
        >
          <Icon size={12} />
        </span>
        <div className="group-detail-trip__expense-body">
          <div className="group-detail-trip__expense-head">
            <strong>{getExpenseCategoryLabel(despesa.categoria)}</strong>
            <em>{formatCurrency(despesa.valorEstimado)}</em>
          </div>
          {despesa.descricao ? (
            <span className="group-detail-trip__expense-desc">{despesa.descricao}</span>
          ) : null}
        </div>
      </>
    )

    if (canEdit) {
      return (
        <button
          type="button"
          className="group-detail-trip__expense-card group-detail-trip__expense-card--editable"
          onClick={() => onEditExpense(despesa)}
        >
          {content}
        </button>
      )
    }

    return <div className="group-detail-trip__expense-card">{content}</div>
  }

  return (
    <section className="group-detail-card group-detail-card--trip">
      <header className="group-detail-card__header">
        <GroupDetailSectionTitle icon={Plane}>Viagem do grupo</GroupDetailSectionTitle>
      </header>

      {!viagem ? (
        <EmptyState
          className="group-detail-card__empty"
          size="compact"
          bordered
          icon={<Plane size={20} strokeWidth={1.75} />}
          title="Nenhuma viagem vinculada"
          description="Crie ou vincule uma viagem para planejar os gastos do grupo em conjunto."
          action={{
            label: 'Vincular viagem',
            variant: 'secondary',
            onClick: onLinkTrip,
            leftIcon: <Link2 size={14} aria-hidden />,
          }}
        />
      ) : (
        <div className="group-detail-trip">
          <div className="group-detail-trip__meta">
            <p className="group-detail-trip__meta-title">
              <Globe size={15} aria-hidden className="group-detail-trip__meta-icon" />
              <span>
                Viagem: <strong className="group-detail-trip__destino">{viagem.destino}</strong>
              </span>
            </p>
            {grupoId ? (
              <div className="group-detail-trip__meta-transport">
                <GroupTripTransportChips grupoId={grupoId} />
              </div>
            ) : null}
            <p className="group-detail-trip__meta-sub">
              <span>{formatGroupTripDate(viagem.dataPrevista)}</span>
              <span className="group-detail-trip__dot" aria-hidden />
              <span>Moeda: {viagem.moeda}</span>
            </p>
          </div>

          {temPretencoes && colunas.length > 0 ? (
            <div className={gridClassName}>
              {colunas.map((membro) => {
                const displayNome = formatGrupoMembroDisplayNome(membro.nome, membro.souEu)
                const expensesClassName =
                  membro.despesas.length > 4
                    ? 'group-detail-trip__expenses group-detail-trip__expenses--scroll'
                    : 'group-detail-trip__expenses'

                return (
                  <article key={membro.usuarioId} className="group-detail-trip__member-col">
                    <header className="group-detail-trip__member-head">
                      <Avatar
                        name={displayNome}
                        src={membro.urlAvatar}
                        size="xs"
                        fallback="color"
                      />
                      <span className="group-detail-trip__member-name">{displayNome}</span>
                    </header>

                    {membro.despesas.length > 0 ? (
                      <ul className={expensesClassName}>
                        {membro.despesas.map((despesa) => (
                          <li key={despesa.id}>
                            {renderExpenseCard(despesa, membro.souEu && onEditExpense)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="group-detail-trip__member-empty">Sem pretensões</p>
                    )}
                  </article>
                )
              })}
            </div>
          ) : null}

          {manyMembers && temPretencoes ? (
            <p className="group-detail-trip__grid-hint">Deslize para ver todos os membros →</p>
          ) : null}

          {!temPretencoes ? (
            <p className="group-detail-trip__empty-hint">
              Nenhuma pretensão cadastrada ainda.{' '}
              <button type="button" className="group-detail-trip__empty-link" onClick={handleAdd}>
                Adicionar agora →
              </button>
            </p>
          ) : null}

          <footer className="group-detail-trip__footer">
            <div
              className={`group-detail-trip__summary${balanceScroll ? ' group-detail-trip__summary--scrollable' : ''}`}
            >
              <div className="group-detail-trip__total-block">
                <Coins size={22} aria-hidden className="group-detail-trip__total-icon" />
                <div>
                  <span className="group-detail-trip__total-label">TOTAL DO GRUPO</span>
                  <strong className="group-detail-trip__total-value">
                    {formatCurrency(viagem.totalGrupo)}
                  </strong>
                </div>
              </div>

              {saldos.length > 0 ? (
                <div
                  className={`group-detail-trip__balances${balanceScroll ? ' group-detail-trip__balances--scroll' : ''}`}
                >
                  <div className="group-detail-trip__divisao-toggle" role="tablist" aria-label="Modo de divisão">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={modoDivisao === 'PRETENSAO'}
                      className={modoDivisao === 'PRETENSAO' ? 'is-active' : ''}
                      onClick={() => setModoDivisao('PRETENSAO')}
                    >
                      Por pretensão
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={modoDivisao === 'IGUAL'}
                      className={modoDivisao === 'IGUAL' ? 'is-active' : ''}
                      onClick={() => setModoDivisao('IGUAL')}
                    >
                      Divisão igual
                    </button>
                  </div>

                  {saldos.map((membro) => {
                    const displayNome = formatGrupoMembroDisplayNome(membro.nome, membro.souEu)
                    const firstName = displayNome.split(' ')[0]
                    const valorExibir = modoDivisao === 'IGUAL' ? membro.saldoAbs : membro.saldo

                    return (
                      <span key={membro.usuarioId} className="group-detail-trip__balance">
                        <Avatar
                          name={displayNome}
                          src={membro.urlAvatar}
                          size="xs"
                          fallback="color"
                        />
                        <span className="group-detail-trip__balance-text">
                          <span className="group-detail-trip__balance-name">{firstName}</span>
                          {' '}
                          <span className="group-detail-trip__balance-label">{membro.labelSaldo}:</span>
                          {' '}
                          <strong
                            className={`group-detail-trip__balance-value${membro.tipoSaldo === 'credito' ? ' group-detail-trip__balance-value--credit' : ''}`}
                          >
                            {formatCurrency(valorExibir)}
                          </strong>
                        </span>
                      </span>
                    )
                  })}
                </div>
              ) : null}
            </div>

            <Button
              type="button"
              variant="secondary"
              fullWidth
              className="group-detail-card__action group-detail-card__outline-btn group-detail-trip__cta"
              leftIcon={<Plus size={14} />}
              onClick={handleAdd}
            >
              Adicionar minha pretensão
            </Button>
          </footer>
        </div>
      )}
    </section>
  )
}
