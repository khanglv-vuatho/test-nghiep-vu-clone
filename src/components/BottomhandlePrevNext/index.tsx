import { PrimaryButton, PrimaryOutlineButton } from '@/components/Buttons'
import { translate } from '@/context/translationProvider'
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
    <div
      className={twMerge(`${isHideBackButton ? 'py-4' : 'px-2 py-4'} sticky bottom-0 left-0 z-50 flex w-full items-center gap-4 bg-white transition`, className)}
      // style={{ transform: isStep1 ? `translateY(-${bottomPadding}px)` : '' }}
    >
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
export default BottomhandlePrevNext
