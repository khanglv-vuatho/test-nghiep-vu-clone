import { PrimaryButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import WrapperBottom from '@/components/WrapperBottom'
import { ArrowDown, TickCircle } from 'iconsax-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const KYC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const handleKYC = () => {
    setIsLoading(true)
    window.postMessage('directToEkyc')
  }
  return (
    <div className='flex h-[calc(100dvh-128px)] items-center justify-center bg-primary-light-blue'>
      <div className='flex flex-col items-center gap-4 px-4'>
        <div className='size-[200px]'>
          <ImageFallback src='/kyc.png' alt='kyc' width={400} height={400} className='size-full' />
        </div>
        <p className='text-center text-2xl font-bold'>Chỉ còn một bước cuối để bắt đầu làm việc</p>
        <div className='flex w-full items-center gap-2 rounded-2xl border border-primary-green bg-primary-light-green p-4 font-bold text-primary-green'>
          <span>
            <TickCircle variant='Bold' />
          </span>
          <p>Thêm nghiệp vụ</p>
        </div>
        <div className=''>
          <span>
            <ArrowDown className='text-primary-blue' />
          </span>
        </div>
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
          <p>eKYC - Xác minh danh tính</p>
        </motion.div>
      </div>
      <WrapperBottom className='p-4'>
        <div className='flex flex-col gap-2'>
          <p className='text-center text-sm'>Việc xác minh danh tính (KYC) là bước quan trọng để đảm bảo an toàn cho cả bạn và khách hàng.</p>
          <PrimaryButton className='h-12 rounded-full' isLoading={isLoading} onPress={handleKYC}>
            Xác minh ngay
          </PrimaryButton>
        </div>
      </WrapperBottom>
    </div>
  )
}

export default KYC
