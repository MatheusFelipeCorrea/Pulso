import { Copy, LogOut, Trash2, UserPlus } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { AvatarGroup } from '@/design-system/components/data-display/Avatar/AvatarGroup.jsx'
import { PulsoBadgeByKind } from '@/components/badges/PulsoBadge.jsx'
import { badgeKindFromPapelGrupo } from '@/components/badges/enumMappers.js'
import { formatGroupActivity, limparNomeGrupoMembro } from '@/utils/groupFormat.js'
import { getGrupoImagemExibicao } from '@/utils/groupImage.js'
import { GroupThumbnail } from '@/components/features/groups/GroupThumbnail.jsx'

function formatActivityLabel(iso) {
  return formatGroupActivity(iso).replace(/^há/i, 'Há')
}

export function GroupCard({ grupo, onOpen, onInvite, onCopyCode, onDelete, onLeave }) {
  const papelKind = badgeKindFromPapelGrupo(grupo.meuPapel)
  const isAdmin = grupo.meuPapel === 'ADMIN'
  const avatars = (grupo.membrosPreview ?? []).map((membro) => ({
    name: limparNomeGrupoMembro(membro.nome),
    src: membro.urlAvatar,
    id: membro.id,
  }))

  return (
    <article className="group-card">
      <div className="group-card__media">
        <GroupThumbnail nome={grupo.nome} src={getGrupoImagemExibicao(grupo)} />
      </div>

      <div className="group-card__body">
        <div className="group-card__header">
          <h3 className="group-card__title">{grupo.nome}</h3>
          {grupo.descricao ? (
            <p className="group-card__description">{grupo.descricao}</p>
          ) : null}
        </div>

        <div className="group-card__details">
          <div className="group-card__detail group-card__detail--avatars">
            <AvatarGroup avatars={avatars} max={3} size="sm" />
          </div>

          <div className="group-card__detail">
            <span className="group-card__detail-label">Seu papel</span>
            <div className="group-card__detail-value">
              {papelKind ? <PulsoBadgeByKind kind={papelKind} size="sm" /> : null}
            </div>
          </div>

          <div className="group-card__detail">
            <span className="group-card__detail-label">Código de convite</span>
            <div className="group-card__detail-value group-card__detail-value--code">
              <code>{grupo.codigoConvite}</code>
              <button
                type="button"
                className="group-card__copy-btn"
                aria-label="Copiar código de convite"
                onClick={() => onCopyCode?.(grupo.codigoConvite)}
              >
                <Copy size={14} aria-hidden />
              </button>
            </div>
          </div>

          <div className="group-card__detail">
            <span className="group-card__detail-label">Última atividade</span>
            <span className="group-card__detail-value">{formatActivityLabel(grupo.ultimaAtividade)}</span>
          </div>
        </div>
      </div>

      <div className="group-card__actions">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="group-card__invite-btn"
          leftIcon={<UserPlus size={14} />}
          onClick={() => onInvite?.(grupo)}
        >
          Convidar
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="group-card__open-btn"
          onClick={() => onOpen?.(grupo)}
        >
          Ver grupo →
        </Button>
        {isAdmin ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="group-card__delete-btn"
            leftIcon={<Trash2 size={14} />}
            onClick={() => onDelete?.(grupo)}
          >
            Excluir
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="group-card__leave-btn"
            leftIcon={<LogOut size={14} />}
            onClick={() => onLeave?.(grupo)}
          >
            Sair
          </Button>
        )}
      </div>
    </article>
  )
}
