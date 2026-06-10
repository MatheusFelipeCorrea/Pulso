import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { PulsoBadge } from '@/components/badges/PulsoBadge.jsx'
import { badgeKindFromModoUso } from '@/components/badges/enumMappers'
import { useAppSelector } from '@/store/hooks'
import { getUserDisplayName } from '@/utils/userDisplayName'

export function UserInfoCard({ collapsed = false }) {
  const user = useAppSelector((state) => state.auth.user)
  const nome = getUserDisplayName(user?.nome)
  const avatarUrl = user?.urlAvatar ?? null
  const badgeKind = badgeKindFromModoUso(user?.modoUso ?? 'ESTAGIARIO') ?? 'perfil.estagiario'

  if (collapsed) {
    return (
      <div className="sidebar-user sidebar-user--collapsed">
        <Avatar src={avatarUrl} name={nome} size="md" fallback="color" />
      </div>
    )
  }

  return (
    <div className="sidebar-user">
      <Avatar src={avatarUrl} name={nome} size="md" fallback="color" className="sidebar-user__avatar" />
      <div className="sidebar-user__info">
        <p className="sidebar-user__name">{nome}</p>
        <PulsoBadge kind={badgeKind} size="md" className="sidebar-user__badge" />
      </div>
    </div>
  )
}
