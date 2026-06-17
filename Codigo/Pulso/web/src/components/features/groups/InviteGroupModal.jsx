import { useCallback } from 'react'
import { Copy, Crown, Link2, RefreshCw, Share2, Upload, Users, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { PulsoBadgeByKind } from '@/components/badges/PulsoBadge.jsx'
import { badgeKindFromPapelGrupo } from '@/components/badges/enumMappers.js'
import {
  buildGrupoInviteLink,
  formatGrupoCodigoDisplay,
  formatGrupoInviteLinkDisplay,
} from '@/utils/groupInvite.js'
import { formatGrupoMembroDisplayNome } from '@/utils/groupFormat.js'
import { GroupThumbnail } from '@/components/features/groups/GroupThumbnail.jsx'
import { getGrupoImagemExibicao } from '@/utils/groupImage.js'
import { InstagramIcon, WhatsAppIcon } from '@/components/features/groups/GroupSocialIcons.jsx'

export function InviteGroupModal({ open, grupo, onClose, onCopyCode, isAdmin, onRegenerateCode }) {
  const membros = grupo?.membros ?? grupo?.membrosPreview ?? []
  const inviteLink = grupo?.codigoConvite ? buildGrupoInviteLink(grupo.codigoConvite) : ''
  const inviteLinkDisplay = formatGrupoInviteLinkDisplay(grupo?.codigoConvite || inviteLink)
  const memberCount = grupo?.quantidadeMembros ?? membros.length

  const copyCode = useCallback(() => {
    if (!grupo?.codigoConvite) return
    onCopyCode?.(grupo.codigoConvite)
  }, [grupo?.codigoConvite, onCopyCode])

  const copyLink = useCallback(async () => {
    if (!inviteLink) return
    try {
      await navigator.clipboard.writeText(inviteLink)
      onCopyCode?.(inviteLink, 'Link copiado!')
    } catch {
      onCopyCode?.(inviteLink, 'Não foi possível copiar')
    }
  }, [inviteLink, onCopyCode])

  const shareNative = useCallback(async () => {
    if (!grupo || !navigator.share) {
      copyLink()
      return
    }
    try {
      await navigator.share({
        title: `Convite para ${grupo.nome}`,
        text: `Entre no grupo ${grupo.nome} com o código ${grupo.codigoConvite}`,
        url: inviteLink,
      })
    } catch {
      // usuário cancelou
    }
  }, [grupo, inviteLink, copyLink])

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Entre no grupo ${grupo?.nome} no Pulso! Código: ${grupo?.codigoConvite}\n${inviteLink}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const shareInstagram = async () => {
    const text = `Entre no grupo ${grupo?.nome} no Pulso! Código: ${grupo?.codigoConvite}\n${inviteLink}`
    try {
      await navigator.clipboard.writeText(text)
      onCopyCode?.(text, 'Texto copiado! Cole no Instagram')
    } catch {
      onCopyCode?.(inviteLink, 'Não foi possível copiar')
    }
  }

  if (!grupo) return null

  return (
    <Modal isOpen={open} onClose={onClose} size="md" className="group-invite-modal">
      <header className="group-invite-modal__header">
        <div className="group-invite-modal__title-row">
          <h2>Convidar para o Grupo</h2>
          <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
        </div>

        <div className="group-invite-modal__group">
          <GroupThumbnail
            nome={grupo.nome}
            src={getGrupoImagemExibicao(grupo)}
            size="sm"
            className="group-invite-modal__group-thumb"
          />
          <div className="group-invite-modal__group-copy">
            <h3 className="group-invite-modal__group-name">
              <Users size={14} aria-hidden />
              <span>{grupo.nome}</span>
            </h3>
            <p>
              {memberCount} {memberCount === 1 ? 'membro atualmente' : 'membros atualmente'}
            </p>
          </div>
        </div>
      </header>

      <div className="group-invite-modal__body">
        <section className="group-invite-modal__block" aria-label="Código de convite">
          <span className="group-invite-modal__section-label">
            <Link2 size={16} aria-hidden />
            Código de convite
          </span>

          <div className="group-invite-modal__invite">
            <div className="group-invite-modal__code-wrap">
              <p className="group-invite-modal__code">{formatGrupoCodigoDisplay(grupo.codigoConvite)}</p>
            </div>
            <Button type="button" variant="secondary" size="sm" leftIcon={<Copy size={14} />} onClick={copyCode}>
              Copiar código
            </Button>
            {isAdmin ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                leftIcon={<RefreshCw size={14} />}
                onClick={() => onRegenerateCode?.()}
              >
                Gerar novo código
              </Button>
            ) : null}
            <p className="group-invite-modal__invite-hint">Compartilhe este código com quem deseja convidar</p>
          </div>
        </section>

        <section className="group-invite-modal__block" aria-label="Compartilhar convite">
          <span className="group-invite-modal__section-label">
            <Upload size={16} aria-hidden />
            Compartilhar
          </span>

          <Button
            type="button"
            variant="ghost"
            fullWidth
            className="group-invite-modal__share-main"
            leftIcon={<Share2 size={16} />}
            onClick={shareNative}
          >
            Compartilhar via...
          </Button>

          <div className="group-invite-modal__divider" role="presentation">
            <span>ou</span>
          </div>

          <div className="group-invite-modal__social">
            <button type="button" className="group-invite-modal__social-btn" onClick={shareWhatsApp}>
              <span className="group-invite-modal__social-icon group-invite-modal__social-icon--wa" aria-hidden>
                <WhatsAppIcon size={22} />
              </span>
              <span className="group-invite-modal__social-label">WhatsApp</span>
            </button>
            <button type="button" className="group-invite-modal__social-btn" onClick={shareInstagram}>
              <span className="group-invite-modal__social-icon group-invite-modal__social-icon--ig" aria-hidden>
                <InstagramIcon size={22} />
              </span>
              <span className="group-invite-modal__social-label">Instagram</span>
            </button>
            <button type="button" className="group-invite-modal__social-btn" onClick={copyLink}>
              <span className="group-invite-modal__social-icon group-invite-modal__social-icon--link" aria-hidden>
                <Link2 size={18} />
              </span>
              <span className="group-invite-modal__social-label">Copiar link</span>
            </button>
          </div>

          <div className="group-invite-modal__link-card">
            <span className="group-invite-modal__link-label">Link do convite</span>
            <div className="group-invite-modal__link-row">
              <p className="group-invite-modal__link-url">{inviteLinkDisplay}</p>
              <button type="button" className="group-invite-modal__link-copy" onClick={copyLink} aria-label="Copiar link">
                <Copy size={16} aria-hidden />
              </button>
            </div>
          </div>
        </section>

        <section className="group-invite-modal__members" aria-label="Membros atuais">
          <h4>
            <Users size={16} aria-hidden />
            Membros atuais:
          </h4>
          <div className="group-invite-modal__members-list">
            {membros.map((membro) => {
              const kind = badgeKindFromPapelGrupo(membro.papel)
              const isAdmin = membro.papel === 'ADMIN'
              const displayNome = formatGrupoMembroDisplayNome(membro.nome, membro.souEu)

              return (
                <div key={membro.id} className="group-invite-modal__member">
                  <div className="group-invite-modal__member-leading">
                    {isAdmin ? (
                      <Crown size={13} className="group-invite-modal__member-crown" aria-hidden />
                    ) : null}
                    <Avatar name={displayNome} src={membro.urlAvatar} size="sm" fallback="color" />
                  </div>
                  <span className="group-invite-modal__member-name">{displayNome}</span>
                  {kind ? <PulsoBadgeByKind kind={kind} size="sm" /> : null}
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <footer className="group-invite-modal__footer">
        <Button type="button" variant="ghost" fullWidth className="group-invite-modal__close" onClick={onClose}>
          Fechar
        </Button>
      </footer>
    </Modal>
  )
}
