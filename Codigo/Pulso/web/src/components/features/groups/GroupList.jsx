import { GroupCard } from '@/components/features/groups/GroupCard.jsx'

export function GroupList({ grupos, onOpen, onInvite, onCopyCode, onDelete, onLeave }) {
  if (!grupos?.length) {
    return null
  }

  return (
    <div className="groups-page__list">
      {grupos.map((grupo) => (
        <GroupCard
          key={grupo.id}
          grupo={grupo}
          onOpen={onOpen}
          onInvite={onInvite}
          onCopyCode={onCopyCode}
          onDelete={onDelete}
          onLeave={onLeave}
        />
      ))}
    </div>
  )
}
