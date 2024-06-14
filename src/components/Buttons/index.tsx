import { Button, ButtonProps } from '@nextui-org/react'
import { twMerge } from 'tailwind-merge'

type Props = {
  className?: string
} & ButtonProps
export const PrimaryButton = ({ className, children, ...props }: Props) => {
  return (
    <Button className={twMerge('text-white rounded-lg bg-primary-blue font-bold', className)} {...props}>
      {children}
    </Button>
  )
}
export const PrimaryOutlineButton = ({ className, children, ...props }: Props) => {
  return (
    <Button className={twMerge('bg-transparent rounded-lg border border-primary-blue font-bold text-primary-blue', className)} {...props}>
      {children}
    </Button>
  )
}

export const PrimaryLightButton = ({ className, children, ...props }: Props) => {
  return (
    <Button className={twMerge('rounded-lg bg-primary-light-blue font-bold text-primary-blue', className)} {...props}>
      {children}
    </Button>
  )
}
