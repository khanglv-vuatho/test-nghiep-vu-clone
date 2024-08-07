import { motion } from 'framer-motion'
import { ArrowDown, TickCircle } from 'iconsax-react'
import { useState } from 'react'

import { PrimaryButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import WrapperBottom from '@/components/WrapperBottom'
import { postMessageCustom } from '@/utils'
import { translate } from '@/context/translationProvider'
import { keyPossmessage } from '@/constants'

const KYC = () => {
  const t = translate('KYC')
  const [isLoading, setIsLoading] = useState(false)

  const handleKYC = () => {
    setIsLoading(true)
    postMessageCustom({ message: keyPossmessage.DIRECT_TO_EKYC })
  }

  return (
    <div className='flex h-dvh flex-col justify-between bg-primary-light-blue pt-10'>
      <div className='flex flex-col items-center gap-4 px-4'>
        <div className='size-[200px]'>
          <ImageFallback src='/kyc.png' alt='kyc' width={400} height={400} className='size-full' />
        </div>
        <p className='text-center text-2xl font-bold'>{t?.text1}</p>
        <div className='flex w-full flex-col items-center gap-2'>
          <div className='flex w-full items-center gap-2 rounded-2xl border border-primary-green bg-primary-light-green p-4 font-bold text-primary-green'>
            <span>
              <TickCircle variant='Bold' />
            </span>
            <p>{t?.text2}</p>
          </div>
          <span>
            <ArrowDown className='text-primary-blue' />
          </span>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{
              duration: 1,
              ease: 'easeInOut',
              repeat: Infinity
            }}
            className='flex w-full items-center gap-2 rounded-2xl border border-primary-blue bg-primary-light-blue p-4 font-bold'
          >
            <span>
              <TickCircle variant='Bold' className='text-[#E4E4E4]' />
            </span>
            <p>{t?.text3}</p>
          </motion.div>
        </div>
      </div>
      <WrapperBottom className='p-4'>
        <div className='flex flex-col gap-2'>
          <p className='text-center text-base'>{t?.text4}</p>
          <PrimaryButton className='h-12 rounded-full' isLoading={isLoading} onClick={handleKYC}>
            {t?.text5}
          </PrimaryButton>
        </div>
      </WrapperBottom>
    </div>
  )
}

export default KYC
