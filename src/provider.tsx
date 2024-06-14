import { NextUIProvider } from '@nextui-org/system'
import { useNavigate } from 'react-router-dom'
import store from '@/store'
import { Provider as ReduxProvider } from 'react-redux'
import { useEffect, useState } from 'react'
import Wrapper from './wrapper'

import Cookies from 'universal-cookie'
export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const cookies = new Cookies()
  const [mounted, setMounted] = useState(false)

  const checkSession = async () => {
    // Lấy giá trị của cookie
    const value = cookies.get('token')

    // setToken(value)

    if (!value) return navigate('/invalid')
  }

  useEffect(() => {
    // Uncomment the following line if you want to disable this effect in development mode
    if (import.meta.env.MODE === 'development') return

    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent || navigator.vendor
      // Use the correct regex string. Modify this if your regex needs to match a different pattern
      const regexString = import.meta.env.VITE_API_REGEX

      if (regexString) {
        try {
          const isAppWebView = new RegExp(regexString).test(userAgent)
          console.log('new RegExp(regexString)', new RegExp(regexString))
          console.log('User Agent:', userAgent)

          if (isAppWebView) {
            console.log('WebView detected')
            checkSession() // Ensure checkSession is defined or imported
          } else {
            console.log('Non-WebView detected')
            navigate('/invalid') // Uncomment this line to navigate to '/invalid' route
          }
        } catch (error) {
          console.error('Invalid regular expression:', regexString, error)
        }
      } else {
        console.error('VITE_API_REGEX is not defined')
      }
    }
  }, [navigate, token])

  useEffect(() => {
    const cookies = new Cookies()
    // Lấy giá trị của cookie
    const value = cookies.get('token')
    setToken(value)
    console.log({ value })
  }, [token])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <NextUIProvider navigate={navigate}>
      <ReduxProvider store={store}>
        <Wrapper token={token}>{children}</Wrapper>
      </ReduxProvider>
    </NextUIProvider>
  )
}
