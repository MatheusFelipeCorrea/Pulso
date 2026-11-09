import { Bot } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * Balão flutuante do dashboard → abre o Pulso Assistente (RF-015 / FEAT-011).
 */
export function DashboardChatbotFab({ modo = 'chat' }) {
    const navigate = useNavigate()

    return (
        <button
            type="button"
            className="dashboard-chatbot-fab"
            aria-label="Abrir Pulso Assistente"
            title="Pulso Assistente"
            onClick={() => navigate(modo === 'quick_add' ? '/chatbot?modo=quick_add' : '/chatbot')}
        >
            <Bot size={26} strokeWidth={1.75} aria-hidden />
            <span className="dashboard-chatbot-fab__pulse" aria-hidden />
        </button>
    )
}
