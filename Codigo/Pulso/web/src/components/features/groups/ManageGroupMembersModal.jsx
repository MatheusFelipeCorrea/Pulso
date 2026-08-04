import { useState } from 'react'
import { Crown, Shield, Trash2, UserMinus, Users, X } from 'lucide-react'
import { Modal } from '@/design-system/components/overlays/Modal/Modal.jsx'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { IconButton } from '@/design-system/components/buttons/IconButton/IconButton.jsx'
import { Avatar } from '@/design-system/components/data-display/Avatar/Avatar.jsx'
import { ConfirmModal } from '@/design-system/components/overlays/Modal/ConfirmModal.jsx'
import { PulsoBadgeByKind } from '@/components/badges/PulsoBadge.jsx'
import { badgeKindFromPapelGrupo } from '@/components/badges/enumMappers.js'
import { formatGrupoMembroDisplayNome } from '@/utils/groupFormat.js'

export function ManageGroupMembersModal({
  open,
  onClose,
  grupo,
  onRemoveMember,
  onChangeRole,
  loadingId = null,
}) {
  const [error, setError] = useState('')
  const [removeTarget, setRemoveTarget] = useState(null)
  const [removing, setRemoving] = useState(false)

  const membros = grupo?.membros ?? []
  const meuId = membros.find((m) => m.souEu)?.id
  const isAdmin = grupo?.meuPapel === 'ADMIN'

  const handleRole = async (membro, papel) => {
    setError('')
    try {
      await onChangeRole?.(membro.id, papel)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível alterar o papel.')
    }
  }

  const handleConfirmRemove = async () => {
    if (!removeTarget) return
    setRemoving(true)
    setError('')
    try {
      await onRemoveMember?.(removeTarget.id)
      setRemoveTarget(null)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Não foi possível remover o membro.')
    } finally {
      setRemoving(false)
    }
  }

  if (!grupo) return null

  return (
    <>
      <Modal isOpen={open} onClose={onClose} size="lg" className="group-create-modal group-manage-modal">
        <div className="group-create-modal__form">
          <header className="group-create-modal__header group-manage-modal__header">
            <div className="group-manage-modal__header-main">
              <span className="group-manage-modal__header-icon" aria-hidden>
                <Users size={20} />
              </span>
              <div>
                <h2>Gerenciar membros</h2>
                <p>{grupo.nome}</p>
              </div>
            </div>
            <IconButton variant="ghost" size="sm" ariaLabel="Fechar" icon={<X size={18} />} onClick={onClose} />
          </header>

          <div className="group-create-modal__body group-manage-modal__body">
            <div className="group-manage-modal__toolbar">
              <span className="group-manage-modal__count">
                <Users size={15} aria-hidden />
                {membros.length} {membros.length === 1 ? 'membro' : 'membros'} no grupo
              </span>
            </div>

            <ul className="group-manage-modal__list">
              {membros.map((membro) => {
                const kind = badgeKindFromPapelGrupo(membro.papel)
                const displayNome = formatGrupoMembroDisplayNome(membro.nome, membro.souEu)
                const isSelf = membro.id === meuId
                const membroAdmin = membro.papel === 'ADMIN'
                const busy = loadingId === membro.id

                return (
                  <li key={membro.id} className="group-manage-modal__item">
                    <div className="group-manage-modal__member">
                      <div className="group-manage-modal__member-leading">
                        {membroAdmin ? (
                          <Crown size={13} className="group-manage-modal__crown" aria-hidden />
                        ) : null}
                        <Avatar name={displayNome} src={membro.urlAvatar} size="sm" fallback="color" />
                      </div>
                      <div className="group-manage-modal__member-body">
                        <strong className="group-manage-modal__name">{displayNome}</strong>
                        {kind ? <PulsoBadgeByKind kind={kind} size="sm" /> : null}
                      </div>
                    </div>

                    {isSelf ? (
                      <span className="group-manage-modal__you">Você</span>
                    ) : isAdmin ? (
                      <div className="group-manage-modal__actions">
                        {membroAdmin ? (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            loading={busy}
                            leftIcon={<UserMinus size={14} />}
                            onClick={() => handleRole(membro, 'MEMBRO')}
                          >
                            Remover admin
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            loading={busy}
                            leftIcon={<Shield size={14} />}
                            onClick={() => handleRole(membro, 'ADMIN')}
                          >
                            Tornar admin
                          </Button>
                        )}
                        <IconButton
                          variant="ghost"
                          size="sm"
                          ariaLabel={`Remover ${displayNome} do grupo`}
                          className="group-manage-modal__remove-btn"
                          icon={<Trash2 size={16} />}
                          disabled={busy}
                          onClick={() => setRemoveTarget(membro)}
                        />
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ul>

            {error ? <p className="group-create-modal__error">{error}</p> : null}
          </div>

          <footer className="group-create-modal__footer group-create-modal__footer--end">
            <Button type="button" variant="ghost" className="group-create-modal__cancel" onClick={onClose}>
              Fechar
            </Button>
          </footer>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleConfirmRemove}
        title="Remover membro?"
        message={
          removeTarget
            ? `${formatGrupoMembroDisplayNome(removeTarget.nome, false)} será removido do grupo e perderá acesso às metas, viagens e chat.`
            : ''
        }
        confirmLabel="Remover"
        variant="danger"
        loading={removing}
      />
    </>
  )
}
