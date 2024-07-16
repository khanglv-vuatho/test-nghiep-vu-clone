import Fallback from '@/components/Fallback'
import Header from '@/components/Header'
import { TInitState } from '@/store'
import { lazy, Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux'
import FastClick from 'fastclick'

const WrapperAnimation = lazy(() => import('@/components/WrapperAnimation'))

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const direction = useSelector((state: TInitState) => state.direction)

  useEffect(() => {
    document.addEventListener('DOMContentLoaded', () => (FastClick as any).attach(document.body), { passive: true })
  }, [])
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
