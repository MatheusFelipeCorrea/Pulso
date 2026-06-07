import { useLocation } from 'react-router-dom'
import { Construction } from 'lucide-react'
import { getDevelopmentMessage, getPageTitle } from '@/config/appRoutes'

export default function InDevelopmentPage() {
  const { pathname } = useLocation()
  const title = getPageTitle(pathname)
  const message = getDevelopmentMessage(pathname)

  return (
    <div className="in-dev-page">
      <div className="in-dev-page__card">
        <div className="in-dev-page__icon" aria-hidden>
          <Construction size={40} strokeWidth={1.5} />
        </div>
        <h1 className="in-dev-page__title">{title}</h1>
        <p className="in-dev-page__message">{message}</p>
        <p className="in-dev-page__hint">
          Esta área será implementada em breve. Use o menu lateral para explorar as demais seções.
        </p>
      </div>
    </div>
  )
}
