import { Settings, UserPlus, Users } from 'lucide-react'
import { GroupDetailSectionTitle } from './GroupDetailSectionTitle.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { PulsoBadgeByKind } from '@/components/badges/PulsoBadge.jsx'
import { badgeKindFromPapelGrupo } from '@/components/badges/enumMappers.js'
import { formatGrupoMembroDisplayNome } from '@/utils/groupFormat.js'

export function GroupDetailMembersCard({ grupo, onInvite, onManage }) {
  const membros = grupo.membros ?? []
  const isAdmin = grupo.meuPapel === 'ADMIN'
  const memberScroll = membros.length > 7

  return (
    <section className="group-detail-card group-detail-card--members">
      <header className="group-detail-card__header">
        <GroupDetailSectionTitle icon={Users}>Membros</GroupDetailSectionTitle>
        <span className="group-detail-card__meta">
          {membros.length} {membros.length === 1 ? 'membro' : 'membros'}
        </span>
      </header>

      <ul
        className={`group-detail-members__list${memberScroll ? ' group-detail-members__list--scroll' : ''}`}
      >
        {membros.map((membro) => {
          const kind = badgeKindFromPapelGrupo(membro.papel)
          const displayNome = formatGrupoMembroDisplayNome(membro.nome, membro.souEu)

          return (
            <li key={membro.id} className="group-detail-members__item">
              <Avatar name={displayNome} src={membro.urlAvatar} size="sm" fallback="color" />
              <span className="group-detail-members__name">{displayNome}</span>
              {kind ? (
                <span className="group-detail-members__badge">
                  <PulsoBadgeByKind kind={kind} size="sm" />
                </span>
              ) : null}
            </li>
          )
        })}
      </ul>

      <div className="group-detail-members__actions">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="group-detail-card__outline-btn"
          leftIcon={<UserPlus size={14} />}
          onClick={() => onInvite?.()}
        >
          Convidar
        </Button>
        {isAdmin ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="group-detail-card__outline-btn"
            leftIcon={<Settings size={14} />}
            onClick={() => onManage?.()}
          >
            Gerenciar
          </Button>
        ) : null}
      </div>
    </section>
  )
}
