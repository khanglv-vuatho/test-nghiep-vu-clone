import { NextUIProvider } from '@nextui-org/system'
import { useNavigate } from 'react-router-dom'
import store from '@/store'
import { Provider as ReduxProvider } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import Wrapper from './wrapper'
import { ToastContainer } from 'react-toastify'
import Cookies from 'universal-cookie'

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const cookies = new Cookies()
  const [mounted, setMounted] = useState(false)
  const [userAgent, setUserAgent] = useState<string | null>(null)

  const checkSession = useCallback(async () => {
    // const value = cookies.get('token')
    // if (!value) return navigate('/invalid')
  }, [cookies, navigate])

  useEffect(() => {
    if (import.meta.env.MODE === 'development') return

    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || navigator.vendor
      setUserAgent(ua)
      const regexString = import.meta.env.VITE_API_REGEX
      console.log({ env: import.meta.env.VITE_API_REGEX })
      if (regexString) {
        try {
          const isAppWebView = regexString == ua
          if (isAppWebView) {
            checkSession()
          } else {
            navigate('/invalid')
          }
        } catch (error) {
          console.log({ error })
        }
      } else {
        console.error('VITE_API_REGEX is not defined')
      }
    }
  }, [navigate, token])

  useEffect(() => {
    const value = cookies.get('token')
    setToken(value)
  }, [token])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <NextUIProvider navigate={navigate}>
      <ReduxProvider store={store}>
        <ToastContainer />
        <Wrapper token={token} userAgent={userAgent as any}>
          {children}
        </Wrapper>
      </ReduxProvider>
    </NextUIProvider>
  )
}
