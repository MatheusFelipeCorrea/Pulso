import { Link } from 'react-router-dom'

/** Stub local: widgets do dashboard (orçamento, metas, import) ainda não estão neste repo. */
export default function DashboardPage() {
    return (
        <main style={{ padding: '1.5rem' }}>
            <h1>Dashboard</h1>
            <p>Resumo completo entra depois. O núcleo de transações já está em /transactions.</p>
            <p>
                <Link to="/transactions">Ir para Transações</Link>
            </p>
        </main>
    )
}
