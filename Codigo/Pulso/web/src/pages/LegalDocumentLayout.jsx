import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PulsoBrand } from '@/components/features/auth/PulsoBrand.jsx'

export function LegalDocumentLayout({ meta, sections }) {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <PulsoBrand to="/" />

        <Link to={meta.backTo ?? '/register'} className="legal-back">
          <ArrowLeft size={18} strokeWidth={2} />
          {meta.backLabel ?? 'Voltar ao cadastro'}
        </Link>
      </header>

      <main className="legal-main">
        <article className="legal-card">
          <header className="legal-doc-header">
            <span className="legal-doc-badge">{meta.badge ?? 'Documento legal'}</span>
            <h1 className="legal-doc-title">{meta.title}</h1>
            <p className="legal-doc-date">Última atualização: {meta.updatedAt}</p>
            <p className="legal-doc-intro">{meta.intro}</p>
          </header>

          <div className="legal-sections">
            {sections.map((section) => (
              <section key={section.title} className="legal-section" id={section.id}>
                <h2 className="legal-section-title">{section.title}</h2>
                <p className="legal-section-content">{section.content}</p>
              </section>
            ))}
          </div>

          <footer className="legal-doc-footer">
            <p className="legal-doc-footer-note">
              Dúvidas? Entre em contato pelo suporte disponível no aplicativo.
            </p>
            <nav className="legal-doc-footer-links" aria-label="Documentos relacionados">
              {meta.relatedLink && (
                <Link to={meta.relatedLink.href} className="legal-link">
                  {meta.relatedLink.label}
                </Link>
              )}
              <Link to="/register" className="legal-link">
                Criar conta
              </Link>
            </nav>
          </footer>
        </article>
      </main>
    </div>
  )
}
