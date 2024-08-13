import { keyPossmessage } from '@/constants'
import { translate } from '@/context/translationProvider'
import { getMobileOperatingSystem, handleAddLangInUrl, postMessageCustom } from '@/utils'
import { Button } from '@nextui-org/react'
import { ArrowLeft2 } from 'iconsax-react'
import { useLocation, useNavigate } from 'react-router-dom'

const Header = () => {
  const tt = translate('Testing')
  const t = translate('Home.Step1')

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token') || ''
  const lang = queryParams.get('lang') || 'vi'

  let title = pathname.includes('testing') ? tt?.text3 : t?.text9

  const handleCloseWebview = () => {
    getMobileOperatingSystem()
    if (pathname.includes('testing')) {
      navigate(handleAddLangInUrl({ mainUrl: '/', lang, token }))
    } else {
      // postMessageCustom({ message: keyPossmessage.CAN_POP })
    }
  }

  return (
    <header className='fixed left-0 right-0 top-0 z-50 flex w-full transform-none flex-col gap-4 bg-white'>
      <Button disableRipple startContent={<ArrowLeft2 />} onClick={handleCloseWebview} className='h-14 justify-start rounded-none bg-transparent px-4 text-base font-bold text-primary-black'>
        {title}
      </Button>
    </header>
  )
}

export default Header
