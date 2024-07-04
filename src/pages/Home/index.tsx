import { useSelector } from 'react-redux'

import DefaultLayout from '@/layouts/default'
import Step1 from '@/pages/Home/Step1'
import Step2 from '@/pages/Home/Step2'
import Step2End from '@/pages/Home/Step2End'
import Step3 from '@/pages/Home/Step3'
import { TInitState } from '@/store'

export default function Home() {
  const currentStep = useSelector((state: TInitState) => state.currentStep)

  const steps = [<Step1 />, <Step2 />, <Step3 />, <Step2End />]

  const isNotStep2End = currentStep < 3

  return (
    <DefaultLayout>
      {currentStep < 3 && (
        <div className='flex items-center justify-center p-4'>
          <div className='grid w-full grid-cols-3 gap-2'>
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <div key={index} className={`h-1 rounded-[4px] ${currentStep === index ? 'bg-primary-blue' : 'bg-[#E4E4E4]'}`} />
              ))}
          </div>
        </div>
      )}
      <div className={`px-6 ${isNotStep2End ? 'h-full' : 'h-[calc(100dvh-56px)] p-4 pb-2'}`}>{steps[currentStep]}</div>
    </DefaultLayout>
  )
}
