import { ExternalLink, Link2, ListChecks, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { getObservationBadgeLabel } from '@/utils/tripObservationTypes.js'

function ObservationMeta({ observacao }) {
  const checklist = observacao.checklist ?? []
  const done = checklist.filter((item) => item.concluido).length
  const badgeLabel = getObservationBadgeLabel(observacao)

  return (
    <div className="trip-detail-page__observation-meta">
      {badgeLabel ? (
        <span className="trip-detail-page__observation-tag">{badgeLabel}</span>
      ) : null}
      {checklist.length > 0 ? (
        <span className="trip-detail-page__observation-chip">
          <ListChecks size={12} aria-hidden />
          {done}/{checklist.length} itens
        </span>
      ) : null}
      {observacao.linkUrl ? (
        <a
          href={observacao.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="trip-detail-page__observation-link"
          onClick={(event) => event.stopPropagation()}
        >
          <Link2 size={12} aria-hidden />
          Link
          <ExternalLink size={11} aria-hidden />
        </a>
      ) : null}
    </div>
  )
}

export function TripDetailObservationsSection({
  observacoes = [],
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <section className="trip-detail-page__card trip-detail-page__observations">
      <div className="trip-detail-page__section-head">
        <h2>Observações</h2>
        <Button variant="secondary" size="sm" leftIcon={<Plus size={14} />} onClick={onAdd}>
          Adicionar observação
        </Button>
      </div>

      {observacoes.length === 0 ? (
        <div className="trip-detail-page__observations-empty">
          <p>Adicionar observações sobre sua viagem, dicas ou informações importantes...</p>
        </div>
      ) : (
        <ul className="trip-detail-page__observations-list">
          {observacoes.map((observacao) => (
            <li key={observacao.id} className="trip-detail-page__observation-item">
              <button
                type="button"
                className="trip-detail-page__observation-main"
                onClick={() => onEdit?.(observacao)}
              >
                <strong>{observacao.titulo}</strong>
                {observacao.conteudo ? (
                  <p>{observacao.conteudo}</p>
                ) : null}
                <ObservationMeta observacao={observacao} />
              </button>
              <div className="trip-detail-page__row-actions">
                <IconButton
                  variant="ghost"
                  size="sm"
                  ariaLabel="Editar observação"
                  icon={<Pencil size={14} />}
                  onClick={() => onEdit?.(observacao)}
                />
                <IconButton
                  variant="ghost"
                  size="sm"
                  ariaLabel="Excluir observação"
                  icon={<Trash2 size={14} />}
                  className="trip-detail-page__delete-btn"
                  onClick={() => onDelete?.(observacao)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
