import { DEFAULT_AUTHENTICATED_ROUTE } from '@/config/defaultAuthenticatedRoute.js'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { PublicHeader } from '@/components/features/landing/PublicHeader.jsx'
import { LandingHero } from '@/components/features/landing/LandingHero.jsx'
import {
  LandingHighlights,
  LandingFeatures,
  LandingAudience,
  LandingBenefits,
  LandingMobile,
  LandingTestimonials,
  LandingCta,
} from '@/components/features/landing/LandingSections.jsx'
import { LandingFooter } from '@/components/features/landing/LandingFooter.jsx'

export default function LandingPage() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const sessionChecked = useAppSelector((state) => state.auth.sessionChecked)

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    const timer = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => window.clearTimeout(timer)
  }, [])

  if (sessionChecked && isAuthenticated) {
    return <Navigate to={DEFAULT_AUTHENTICATED_ROUTE} replace />
  }

  return (
    <div className="landing-page">
      <PublicHeader />
      <main>
        <LandingHero />
        <LandingHighlights />
        <LandingFeatures />
        <LandingAudience />
        <LandingBenefits />
        <LandingMobile />
        <LandingTestimonials />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  )
}
