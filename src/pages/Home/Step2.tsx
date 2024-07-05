import BottomhandlePrevNext from '@/components/BottomhandlePrevNext'
import ImageFallback from '@/components/ImageFallback'
import { RadioSelectRole } from '@/components/RadioGroupCustom'
import { translate } from '@/context/translationProvider'
import { TInitState, ActionTypes } from '@/store'
import { useState, useRef, useEffect, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const Step2 = () => {
  const s = translate('Home.Step2')

  const step2 = useSelector((state: TInitState) => state.step2)
  const currentStep = useSelector((state: TInitState) => state.currentStep)

  const [activeRadio, setActiveRadio] = useState<any>(step2)
  const dispatch = useDispatch()

  const optionRefs: any = useRef([])

  const options = [
    {
      value: 0,
      label: <p className={`font-bold ${activeRadio === 0 ? 'text-primary-blue' : 'text-primary-black'}`}>{s?.text1}</p>,
      descripton: (
        <div className='flex flex-col gap-4'>
          <ul className='p-4 *:text-sm'>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span>{s?.text2}</span>
            </li>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span>{s?.text3}</span>
            </li>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span>{s?.text4}</span>
            </li>
          </ul>
          <div className='mx-auto'>
            <div className={`h-[100px] w-full ${activeRadio !== 0 && 'grayscale-[80%]'}`}>
              <ImageFallback className='size-full' src='step2-1.png' alt='step2-1' width={400} height={400} />
            </div>
          </div>
        </div>
      )
    },
    {
      value: 1,
      label: (
        <div className='flex w-full items-center justify-between gap-2'>
          <p className={`font-bold ${activeRadio === 1 ? 'text-primary-blue' : 'text-primary-black'}`}>{s?.text5}</p>
        </div>
      ),
      comingSoon: <div className='m-4 mb-0 mr-0 w-fit rounded-lg bg-primary-red p-2 text-sm text-white'>{s?.text6}</div>,
      descripton: (
        <div className='flex flex-col gap-4'>
          <ul className='p-4 *:text-sm'>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span>{s?.text7}</span>
            </li>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span>{s?.text8}</span>
            </li>
          </ul>
          <div className='mx-auto'>
            <div className={`h-[100px] w-full ${activeRadio !== 1 && 'grayscale-[80%]'}`}>
              <ImageFallback className='size-full' src='step2-2.png' alt='step2-2' width={400} height={400} />
            </div>
          </div>
        </div>
      )
    }
  ]

  const handleNextStep = () => {
    dispatch({ type: ActionTypes.STEP2, payload: activeRadio })

    if (activeRadio === 1) {
      // redirect to step2End
      return dispatch({
        type: ActionTypes.CURRENT_STEP,
        payload: 3
      })
    }

    dispatch({
      type: ActionTypes.CURRENT_STEP,
      payload: currentStep + 1
    })
  }

  const handlePrevStep = () => {
    dispatch({
      type: ActionTypes.CURRENT_STEP,
      payload: currentStep - 1
    })
  }

  useEffect(() => {
    if (optionRefs?.current?.[activeRadio]) {
      optionRefs?.current?.[activeRadio].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeRadio])

  return (
    <div className='flex h-full flex-col justify-between'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-center text-xl font-bold text-primary-black'>{s?.text9}</h1>
        <RadioSelectRole options={options} activeRadio={activeRadio} setActiveRadio={setActiveRadio} />
      </div>
      <BottomhandlePrevNext isDisableNextButton={activeRadio === null} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} className='bg-white py-6 pt-4' />
    </div>
  )
}

export default memo(Step2)
