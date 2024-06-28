import WrapperAnimation from '@/components/WrapperAnimation'
import { TInitState } from '@/store'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()

  const direction = useSelector((state: TInitState) => state.direction)

  return (
    <WrapperAnimation keyRender={pathname} direction={direction}>
      <main className='max-h-dvh'>{children}</main>
    </WrapperAnimation>
  )
}
