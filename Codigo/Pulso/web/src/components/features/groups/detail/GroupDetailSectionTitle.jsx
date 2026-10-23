/**
 * Título de seção nos cards do detalhe do grupo — ícone + label (padrão Pulso).
 */
export function GroupDetailSectionTitle({ icon: Icon, children }) {
  return (
    <h2 className="group-detail-card__title">
      <span className="group-detail-card__title-icon" aria-hidden>
        <Icon size={15} strokeWidth={2} />
      </span>
      <span className="group-detail-card__title-text">{children}</span>
    </h2>
  )
}
