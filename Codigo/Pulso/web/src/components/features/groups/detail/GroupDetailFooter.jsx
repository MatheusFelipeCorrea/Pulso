import { LogOut, Trash2 } from 'lucide-react'

export function GroupDetailFooter({ isAdmin, onDelete, onLeave }) {
  return (
    <footer className="group-detail-page__footer">
      {isAdmin ? (
        <button type="button" className="group-detail-page__danger" onClick={onDelete}>
          <Trash2 size={15} aria-hidden />
          Excluir grupo
        </button>
      ) : (
        <span />
      )}
      <button type="button" className="group-detail-page__danger" onClick={onLeave}>
        <LogOut size={15} aria-hidden />
        Sair do grupo
      </button>
    </footer>
  )
}
