import { Globe, Plus } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { EmptyState } from '@/design-system/components/feedback/EmptyState/EmptyState.jsx'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { TripCard } from './TripCard.jsx'

export function TripList({
  viagens,
  loading,
  catalogMap,
  onNew,
  onDetails,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="trips-list trips-list--loading">
        <SpinnerDots center label="Carregando viagens..." />
      </div>
    )
  }

  return (
    <section className="trips-list">
      <div className="trips-list__head">
        <h2>Minhas Viagens</h2>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={onNew}>
          Nova Viagem
        </Button>
      </div>

      {!viagens?.length ? (
        <EmptyState
          icon={<Globe size={28} />}
          title="Nenhuma viagem planejada"
          description="Crie sua primeira viagem, defina a moeda local e acompanhe suas pretensões de gastos."
          action={{
            label: 'Nova Viagem',
            onClick: onNew,
            leftIcon: <Plus size={16} />,
          }}
        />
      ) : (
        <>
          <div className="trips-list__items">
            {viagens.map((viagem) => (
              <TripCard
                key={viagem.id}
                viagem={viagem}
                catalogMap={catalogMap}
                onDetails={onDetails}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
          <p className="trips-list__footer">
            Mostrando 1 a {viagens.length} de {viagens.length} viagens
          </p>
        </>
      )}
    </section>
  )
}
