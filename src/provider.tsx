import store from '@/store'
import { NextUIProvider } from '@nextui-org/system'
import { Provider as ReduxProvider } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Wrapper from './wrapper'
//@ts-ignore
import FastClick from 'react-fastclick-alt'

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  return (
    <NextUIProvider navigate={navigate}>
      <ReduxProvider store={store}>
        <ToastContainer />
        <Wrapper>
          <FastClick>{children}</FastClick>
        </Wrapper>
      </ReduxProvider>
    </NextUIProvider>
  )
}
