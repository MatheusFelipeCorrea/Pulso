import { Link2 } from 'lucide-react'
import { Button } from '@/design-system/components/buttons/Button/Button.jsx'
import { InputText } from '@/design-system/components/inputs/InputText/InputText.jsx'
import { formatarCodigoGrupoInput } from '@/utils/groupInvite.js'

export function GroupsJoinBanner({ code, onCodeChange, onJoin }) {
  return (
    <section className="groups-page__join-banner" aria-label="Entrar em um grupo">
      <span className="groups-page__join-icon" aria-hidden>
        <Link2 size={20} />
      </span>
      <div className="groups-page__join-copy">
        <strong>Entrar em um grupo</strong>
        <p>Tem um código de convite? Cole aqui para entrar.</p>
      </div>
      <div className="groups-page__join-form">
        <InputText
          className="groups-page__join-input"
          value={code}
          onChange={(event) => onCodeChange(formatarCodigoGrupoInput(event.target.value))}
          placeholder="PULSO-XXXX"
          leftIcon={<Link2 size={16} />}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onJoin()
          }}
        />
        <Button variant="primary" onClick={onJoin}>
          Entrar
        </Button>
      </div>
    </section>
  )
}
