import { Button, ButtonProps } from '@nextui-org/react'
import { twMerge } from 'tailwind-merge'

type Props = {
  className?: string
  isDisabled?: boolean
  isLoading?: boolean
} & ButtonProps
export const PrimaryButton = ({ className, isLoading, isDisabled, children, ...props }: Props) => {
  return (
    <div className='relative w-full'>
      <Button
        className={twMerge(
          `data-[pressed=true]:scale-1 z-50 w-full rounded-lg bg-primary-blue font-bold text-white data-[pressed=true]:translate-y-1 data-[hover=true]:opacity-100 ${isLoading ? 'translate-y-1' : ''} ${isDisabled ? 'cursor-not-allowed' : ''}`,
          className
        )}
        isDisabled={isDisabled}
        isLoading={isLoading}
        {...props}
      >
        {children}
      </Button>
      <div className={`absolute inset-0 z-[-10] translate-y-1 rounded-full ${isDisabled ? '' : 'bg-[#2B2A4C]'}`} />
    </div>
  )
}
export const PrimaryOutlineButton = ({ className, isDisabled, isLoading, children, ...props }: Props) => {
  return (
    <div className='relative w-full'>
      <Button
        className={twMerge(
          `data-[pressed=true]:scale-1 z-50 w-full rounded-lg border border-primary-blue bg-transparent bg-white font-bold text-primary-blue data-[pressed=true]:translate-y-1 data-[hover=true]:opacity-100 ${isLoading ? 'translate-y-1' : ''}`,
          className
        )}
        isDisabled={isDisabled}
        isLoading={isLoading}
        {...props}
      >
        {children}
      </Button>
      <div className={`absolute inset-0 z-[-10] translate-y-1 rounded-full ${isDisabled ? '' : 'bg-primary-blue/80'}`} />
    </div>
  )
}

export const PrimaryLightButton = ({ className, children, ...props }: Props) => {
  return (
    <Button className={twMerge('rounded-lg bg-primary-light-blue font-bold text-primary-blue', className)} {...props}>
      {children}
    </Button>
  )
}
