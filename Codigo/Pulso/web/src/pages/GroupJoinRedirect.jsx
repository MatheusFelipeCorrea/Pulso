import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SpinnerDots } from '@/design-system/components/feedback/Spinner/SpinnerDots.jsx'
import { formatarCodigoGrupoInput } from '@/utils/groupInvite.js'

export default function GroupJoinRedirect() {
  const { codigo } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const seed = formatarCodigoGrupoInput(codigo || '')
    navigate(seed ? `/groups?convite=${encodeURIComponent(seed)}` : '/groups', { replace: true })
  }, [codigo, navigate])

  return <SpinnerDots center label="Abrindo convite..." />
}
