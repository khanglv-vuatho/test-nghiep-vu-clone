import { PrimaryOutlineButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import { keyPossmessage } from '@/constants'
import { translate } from '@/context/translationProvider'
import { postMessageCustom } from '@/utils'
import { useState } from 'react'

const InvalidPage = () => {
  const i = translate('Invalid')

  const [isLoading, setIsLoading] = useState(false)

  const handleCloseWebView = () => {
    setIsLoading(true)
    postMessageCustom({ message: keyPossmessage.CAN_POP })
  }

  return (
    <div className='flex h-dvh items-center justify-center bg-primary-light-blue px-8'>
      <div className='flex w-full flex-col items-center gap-4 rounded-2xl bg-white p-4 shadow-[8px_8px_16px_0px_#0000000A]'>
        <div className='h-[122px] w-[132px]'>
          <ImageFallback src='/invalid.png' height={400} width={400} className='size-full' />
        </div>
        <p className='text-sm'>{i?.text1}</p>
        <PrimaryOutlineButton isLoading={isLoading} onClick={handleCloseWebView} className='w-full rounded-full'>
          {i?.text2} App
        </PrimaryOutlineButton>
      </div>
    </div>
  )
}

export default InvalidPage
