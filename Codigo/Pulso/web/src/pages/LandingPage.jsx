import { Navigate } from 'react-router-dom'
import { useEffect } from 'react'
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
  const hasToken = Boolean(localStorage.getItem('accessToken'))

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    const timer = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => window.clearTimeout(timer)
  }, [])

  if (isAuthenticated || hasToken) {
    return <Navigate to="/dashboard" replace />
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
