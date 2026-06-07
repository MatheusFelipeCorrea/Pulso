import { Lock } from 'lucide-react'

export function VtBlockedScreen() {
  return (
    <div className="vt-blocked">
      <div className="vt-blocked__icon" aria-hidden>
        <Lock size={40} strokeWidth={1.5} />
      </div>
      <h2 className="vt-blocked__title">Funcionalidade indisponível</h2>
      <p className="vt-blocked__message">
        Esta funcionalidade está disponível apenas para Estagiários e CLT. Caso você tenha acordo
        com sua empresa que inclui Vale Transporte, entre em contato com o suporte para habilitar.
      </p>
      <a className="vt-blocked__cta" href="mailto:suporte@pulso.app">
        Falar com suporte
      </a>
    </div>
  )
}
