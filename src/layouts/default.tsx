import Fallback from '@/components/Fallback'
import Header from '@/components/Header'
import { TInitState } from '@/store'
import { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'

const WrapperAnimation = lazy(() => import('@/components/WrapperAnimation'))

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const direction = useSelector((state: TInitState) => state.direction)

  return (
    <>
      <Header />
      <Suspense fallback={<Fallback />}>
        <WrapperAnimation keyRender={direction} direction={direction}>
          <main className='h-[calc(100dvh-40px)] pt-[56px]'>{children}</main>
        </WrapperAnimation>
      </Suspense>
    </>
  )
}
