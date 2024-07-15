import { CircularProgress } from '@nextui-org/react'
import React, { memo } from 'react'
import { twMerge } from 'tailwind-merge'

type FallBackProps = {
  className?: string
  removeWrapper?: boolean
}

const Fallback: React.FC<FallBackProps> = ({ className, removeWrapper = false }) => {
  const circularProgressClasses = twMerge('h-8 w-8 text-primary-blue', className)

  return removeWrapper ? (
    <CircularProgress classNames={{ svg: circularProgressClasses }} />
  ) : (
    <div className='flex h-dvh w-full justify-center'>
      <CircularProgress classNames={{ svg: circularProgressClasses }} />
    </div>
  )
}

export default memo(Fallback)
