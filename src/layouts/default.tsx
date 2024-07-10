import { keyPossmessage } from '@/constants'
import { translate } from '@/context/translationProvider'
import { TInitState } from '@/store'
import { handleAddLangInUrl, postMessageCustom } from '@/utils'
import { Button, CircularProgress } from '@nextui-org/react'
import { ArrowLeft2 } from 'iconsax-react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const WrapperAnimation = lazy(() => import('@/components/WrapperAnimation'))

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const t = translate('Home.Step1')

  const { pathname } = useLocation()
  const tt = translate('Testing')
  const direction = useSelector((state: TInitState) => state.direction)
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token') || ''
  const lang = queryParams.get('lang') || 'vi'
  const navigate = useNavigate()

  let title = pathname.includes('testing') ? tt?.text3 : t?.text9

  const handleCloseWebview = () => {
    if (pathname.includes('testing')) {
      navigate(handleAddLangInUrl({ mainUrl: '/', lang, token }))
    } else {
      postMessageCustom({ message: keyPossmessage.CAN_POP })
    }
  }
  return (
    <>
      <header className='fixed left-0 right-0 top-0 z-50 flex w-full transform-none flex-col gap-4 bg-white'>
        <Button disableRipple startContent={<ArrowLeft2 />} onClick={handleCloseWebview} className='h-14 justify-start rounded-none bg-transparent px-4 text-base font-bold text-primary-black'>
          {title}
        </Button>
      </header>

      <Suspense
        fallback={
          <div className='flex w-full justify-center'>
            <CircularProgress
              classNames={{
                svg: 'h-8 w-8 text-primary-blue'
              }}
            />
          </div>
        }
      >
        <WrapperAnimation keyRender={pathname} direction={direction}>
          <main className='h-[calc(100dvh-40px)] pt-[56px]'>{children}</main>
        </WrapperAnimation>
      </Suspense>
    </>
  )
}
