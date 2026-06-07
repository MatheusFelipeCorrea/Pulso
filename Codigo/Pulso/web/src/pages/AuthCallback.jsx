import { useEffect, useRef } from 'react'

import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import { Loader2 } from 'lucide-react'

import { useDispatch } from 'react-redux'

import { AuthLayout } from '@/components/layouts/AuthLayout'

import { Button, Alert, useToast } from '@/design-system/components'

import { storeAuthTokens, getMe } from '@/services/authService'

import { setUser } from '@/store/slices/authSlice'



export default function AuthCallback() {

  const [searchParams] = useSearchParams()

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const toast = useToast()

  const handledRef = useRef(false)



  const error = searchParams.get('error')

  const message = searchParams.get('message')

  const accessToken =

    searchParams.get('accessToken') || searchParams.get('token')

  const refreshToken = searchParams.get('refreshToken')



  useEffect(() => {

    if (handledRef.current) return



    if (error || !accessToken) {

      handledRef.current = true

      return

    }



    handledRef.current = true



    const completeLogin = async () => {

      try {

        storeAuthTokens({ accessToken, refreshToken })

        const user = await getMe()

        dispatch(setUser(user))
        navigate('/dashboard', { replace: true })

      } catch {

        toast.error('Não foi possível concluir o login. Tente novamente.')

        navigate('/login', { replace: true })

      }

    }



    completeLogin()

  }, [accessToken, dispatch, error, navigate, refreshToken, toast])



  if (error) {

    return (

      <AuthLayout activeAuth="login" heroVariant="login">

        <div className="auth-card text-center">

          <h1 className="auth-card-title">Não foi possível entrar</h1>

          <p className="auth-card-subtitle">

            {message || 'A autenticação com Google não pôde ser concluída.'}

          </p>

          <div className="mt-6 text-left">

            <Alert

              type="error"

              title="O que fazer agora?"

              message="Tente novamente com Google ou faça login com email e senha."

            />

          </div>

          <Link to="/login" className="mt-8 block">

            <Button variant="primary" size="lg" fullWidth>

              Voltar ao Login

            </Button>

          </Link>

        </div>

      </AuthLayout>

    )

  }



  if (!accessToken) {

    return (

      <AuthLayout activeAuth="login" heroVariant="login">

        <div className="auth-card text-center">

          <h1 className="auth-card-title">Link inválido</h1>

          <p className="auth-card-subtitle">

            Não encontramos credenciais válidas neste link.

          </p>

          <Link to="/login" className="mt-8 block">

            <Button variant="primary" size="lg" fullWidth>

              Ir para o Login

            </Button>

          </Link>

        </div>

      </AuthLayout>

    )

  }



  return (

    <AuthLayout activeAuth="login" heroVariant="login">

      <div className="auth-card flex flex-col items-center justify-center py-12 text-center">

        <Loader2

          className="animate-spin text-[#7C3AED]"

          size={40}

          strokeWidth={1.75}

        />

        <p className="mt-4 text-sm text-[var(--ds-color-text-secondary)]">

          Entrando no Pulso...

        </p>

      </div>

    </AuthLayout>

  )

}

