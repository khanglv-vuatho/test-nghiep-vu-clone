import { postMessageCustom } from '@/utils'
import { Button, ButtonProps } from '@nextui-org/react'
import { twMerge } from 'tailwind-merge'

type TFrequency = {
  frequency?: 'low' | 'medium' | 'high'
}

type Props = {
  className?: string
  isDisabled?: boolean
  isLoading?: boolean
} & TFrequency &
  Omit<ButtonProps, 'onClick'>

const handlePhoneVibration = ({ frequency = 'low' }: TFrequency) => {
  postMessageCustom({ message: `vibrate-${frequency}` })
}

export function getRadiusClass(classString: string) {
  // Sử dụng regex để tìm và lấy ra giá trị của `radius-*`
  const match = classString.match(/rounded-[^\s]+/)
  return match ? match[0] : null
}

const classForDisabled = 'cursor-not-allowed bg-primary-light-gray text-[#A6A6A6]'

export const PrimaryButton = ({ className, isLoading, isDisabled, children, frequency, ...props }: Props) => {
  const radiusClass = getRadiusClass(className || '')
  return (
    <div className='relative w-full'>
      <Button
        {...props}
        className={twMerge(
          `data-[pressed=true]:scale-1 z-50 w-full select-none duration-0 ${radiusClass} bg-primary-blue font-bold text-white data-[pressed=true]:translate-y-1 data-[hover=true]:opacity-100 ${isLoading ? 'translate-y-1' : ''} ${isDisabled ? classForDisabled : ''}`,
          className
        )}
        isDisabled={isDisabled}
        isLoading={isLoading}
        onPress={(e) => {
          handlePhoneVibration({ frequency })
          props?.onPress?.(e)
        }}
      >
        {children}
      </Button>
      <div className={`absolute inset-0 z-[-10] translate-y-1 ${radiusClass} ${isDisabled ? '' : 'bg-[#2B2A4C]'}`} />
    </div>
  )
}
export const PrimaryOutlineButton = ({ className, isDisabled, isLoading, children, frequency, ...props }: Props) => {
  const radiusClass = getRadiusClass(className || '')

  return (
    <div className='relative w-full' onClick={() => handlePhoneVibration({ frequency })}>
      <Button
        {...props}
        className={twMerge(
          `data-[pressed=true]:scale-1 z-50 w-full select-none duration-0 ${radiusClass} border border-primary-blue bg-transparent bg-white font-bold text-primary-blue data-[pressed=true]:translate-y-1 data-[hover=true]:opacity-100 ${isDisabled ? classForDisabled : ''} ${isLoading ? 'translate-y-1' : ''}`,
          className
        )}
        isDisabled={isDisabled}
        isLoading={isLoading}
        onPress={(e) => {
          handlePhoneVibration({ frequency })
          props?.onPress?.(e)
        }}
      >
        {children}
      </Button>
      <div className={`absolute inset-0 z-[-10] translate-y-1 ${radiusClass} ${isDisabled ? '' : 'bg-primary-blue/80'}`} />
    </div>
  )
}

export const PrimaryLightButton = ({ className, children, frequency, ...props }: Props) => {
  const radiusClass = getRadiusClass(className || '')

  return (
    <Button
      onPress={(e) => {
        handlePhoneVibration({ frequency })
        props?.onPress?.(e)
      }}
      className={twMerge(`${radiusClass} select-none bg-primary-light-blue font-bold text-primary-blue duration-0`, className)}
      {...props}
    >
      {children}
    </Button>
  )
}
