import store from '@/store'
import { NextUIProvider } from '@nextui-org/system'
import { Provider as ReduxProvider } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Wrapper from './wrapper'
export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  return (
    <NextUIProvider navigate={navigate}>
      <ReduxProvider store={store}>
        <ToastContainer />
        <Wrapper>{children}</Wrapper>
      </ReduxProvider>
    </NextUIProvider>
  )
}
