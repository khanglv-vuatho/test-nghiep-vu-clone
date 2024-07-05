import { PrimaryButton, PrimaryOutlineButton } from '@/components/Buttons'
import { translate } from '@/context/translationProvider'
import { memo } from 'react'
import { twMerge } from 'tailwind-merge'

type PropsBottomHandlePrevNext = {
  handlePrevStep: () => void
  handleNextStep: () => void
  isDisableNextButton?: boolean
  isNextLoading?: boolean
  isHideBackButton?: boolean
  className?: string
}

const BottomhandlePrevNext = ({ handlePrevStep, handleNextStep, isDisableNextButton = false, isNextLoading, isHideBackButton, className }: PropsBottomHandlePrevNext) => {
  const b = translate('BottomhandlePrevNext')

  return (
    <div className={twMerge(`${isHideBackButton ? '' : 'px-2'} sticky bottom-0 left-0 z-50 flex w-full items-center gap-4 bg-white py-4`, className)}>
      {!isHideBackButton && (
        <PrimaryOutlineButton className={`h-12 w-full rounded-full`} onPress={handlePrevStep}>
          {b?.text1}
        </PrimaryOutlineButton>
      )}
      <PrimaryButton isLoading={isNextLoading} isDisabled={isDisableNextButton} className='h-12 w-full rounded-full' onPress={handleNextStep}>
        {b?.text2}
      </PrimaryButton>
    </div>
  )
}
export default memo(BottomhandlePrevNext)
