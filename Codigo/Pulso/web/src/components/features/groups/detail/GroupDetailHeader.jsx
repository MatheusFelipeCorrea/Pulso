import { LogOut, Trash2, ArrowLeft, Copy, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { PulsoBadgeByKind } from '@/components/badges/PulsoBadge.jsx'
import { badgeKindFromPapelGrupo } from '@/components/badges/enumMappers.js'
import { GroupThumbnail } from '@/components/features/groups/GroupThumbnail.jsx'
import { getGrupoImagemExibicao } from '@/utils/groupImage.js'

export function GroupDetailHeader({
  grupo,
  onCopyCode,
  onChangeImage,
  onEdit,
  isAdmin,
  onDelete,
  onLeave,
}) {
  const papelKind = badgeKindFromPapelGrupo(grupo.meuPapel)
  const canEditImage = grupo.meuPapel === 'ADMIN'
  const imagem = getGrupoImagemExibicao(grupo)

  return (
    <>
      <Link to="/groups" className="group-detail-page__back">
        <ArrowLeft size={14} aria-hidden />
        Voltar para Grupos
      </Link>

      <header className="group-detail-page__hero group-detail-page__hero-panel">
        <GroupThumbnail
          nome={grupo.nome}
          src={imagem}
          size="sm"
          className="group-detail-page__thumb"
          editable={canEditImage}
          onEdit={() => onChangeImage?.()}
        />
        <div className="group-detail-page__hero-copy">
          <div className="group-detail-page__title-row">
            <h1 className="group-detail-page__title">{grupo.nome}</h1>
            {isAdmin ? (
              <button
                type="button"
                className="group-detail-page__edit-title"
                aria-label="Editar grupo"
                onClick={() => onEdit?.()}
              >
                <Pencil size={14} aria-hidden />
              </button>
            ) : null}
            {papelKind ? <PulsoBadgeByKind kind={papelKind} size="sm" /> : null}
          </div>
          {grupo.descricao ? (
            <p className="group-detail-page__description">{grupo.descricao}</p>
          ) : null}
          <div className="group-detail-page__code-row">
            <span>Código do grupo:</span>
            <code>{grupo.codigoConvite}</code>
            <button
              type="button"
              className="group-detail-page__code-copy"
              aria-label="Copiar código do grupo"
              onClick={() => onCopyCode?.(grupo.codigoConvite)}
            >
              <Copy size={14} aria-hidden />
            </button>
          </div>
        </div>

        <div className="group-detail-page__hero-actions">
          {isAdmin ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="group-detail-page__action-btn group-detail-page__action-btn--danger"
              leftIcon={<Trash2 size={14} aria-hidden />}
              onClick={onDelete}
            >
              Excluir grupo
            </Button>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="group-detail-page__action-btn group-detail-card__outline-btn"
            leftIcon={<LogOut size={14} aria-hidden />}
            onClick={onLeave}
          >
            Sair do grupo
          </Button>
        </div>
      </header>
    </>
  )
}
