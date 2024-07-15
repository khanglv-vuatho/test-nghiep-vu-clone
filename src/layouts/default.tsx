import { keyPossmessage } from '@/constants'
import { translate } from '@/context/translationProvider'
import { TInitState } from '@/store'
import { handleAddLangInUrl, postMessageCustom } from '@/utils'
import { Button } from '@nextui-org/react'
import { ArrowLeft2 } from 'iconsax-react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Fallback from '@/components/Fallback'
import Header from '@/components/Header'

const WrapperAnimation = lazy(() => import('@/components/WrapperAnimation'))

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const direction = useSelector((state: TInitState) => state.direction)
  return (
    <>
      <Header />
      123
      <Suspense fallback={<Fallback />}>
        <WrapperAnimation keyRender={direction} direction={direction}>
          <main className='h-[calc(100dvh-40px)] pt-[56px]'>{children}</main>
        </WrapperAnimation>
      </Suspense>
    </>
  )
}
