import ImageFallback from '@/components/ImageFallback'
import { keyPossmessage } from '@/constants'
import { translate } from '@/context/translationProvider'
import { postMessageCustom } from '@/utils'
import { Button } from '@nextui-org/react'
import { memo, useState } from 'react'

const Step2End = () => {
  const s = translate('Home.Step2')
  const [isLoading, setIsLoading] = useState(false)
  const handleCloseWebView = () => {
    setIsLoading(true)
    postMessageCustom({ message: keyPossmessage.CAN_POP })
  }

  return (
    <div className='flex h-full flex-col justify-between'>
      <div className='flex flex-col gap-4'>
        <div className='mx-auto'>
          <div className='size-[200px]'>
            <ImageFallback src='/step2End.png' alt='step2End' height={400} width={400} className='size-full' />
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='px-4 text-center text-2xl font-bold'>{s?.text10}</p>
          <p className='text-center'>{s?.text11}</p>
        </div>
      </div>
      <div className='sticky bottom-0 left-0 right-0 w-full py-2'>
        <Button isLoading={isLoading} onClick={handleCloseWebView} className='h-12 w-full rounded-full bg-primary-blue text-base text-white'>
          {s?.text12}
        </Button>
      </div>
    </div>
  )
}

export default memo(Step2End)
