import { Button } from '@nextui-org/react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import ImageFallback from '@/components/ImageFallback'
import { TInitState } from '@/store'
import { postMessageCustom } from '@/utils'
import { translate } from '@/context/translationProvider'
import { keyPossmessage } from '@/constants'

const RequestNewJob = () => {
  const r = translate('RequestNewJob')

  const searchValue = useSelector((state: TInitState) => state.searchValue)

  const [isLoading, setIsLoading] = useState(false)

  const handleCloseWebView = () => {
    setIsLoading(true)
    postMessageCustom({ message: keyPossmessage.CAN_POP })
  }

  return (
    <div className='flex h-[calc(100dvh-88px)] items-center justify-center bg-primary-light-blue'>
      <div className='flex flex-col gap-4'>
        <div className='mx-auto'>
          <div className='size-[200px]'>
            <ImageFallback src='/step2End.png' alt='step2End' height={400} width={400} className='size-full' />
          </div>
        </div>
        <div className='flex flex-col gap-2 px-8'>
          <p className='px-4 text-center text-2xl font-bold'>{r?.text1}</p>
          <p className='text-center'>
            {r?.text2} "{searchValue || ''}".
          </p>
        </div>
      </div>
      <div className='fixed bottom-0 left-0 right-0 p-4 pb-6'>
        <Button isLoading={isLoading} className='h-12 w-full rounded-full bg-primary-blue text-base text-white' onPress={handleCloseWebView}>
          {r?.text3}
        </Button>
      </div>
    </div>
  )
}

export default RequestNewJob
