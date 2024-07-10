import { useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import DefaultLayout from '@/layouts/default'
import { TInitState } from '@/store'
import { lazy, Suspense } from 'react'
import { CircularProgress } from '@nextui-org/react'

const Step1 = lazy(() => import('./Step1'))
const Step2 = lazy(() => import('./Step2'))
const Step3 = lazy(() => import('./Step3'))
const Step2End = lazy(() => import('./Step2End'))

export default function Home() {
  const currentStep = useSelector((state: TInitState) => state.currentStep)

  const steps = [<Step1 key='step1' />, <Step2 key='step2' />, <Step3 key='step3' />, <Step2End key='step2end' />]

  const isNotStep2End = currentStep < 3

  return (
    <DefaultLayout>
      {currentStep < 3 && (
        <div className='flex items-center justify-center p-4'>
          <div className='grid w-full grid-cols-3 gap-2'>
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <div key={index} className='relative'>
                  <motion.div layout className='absolute inset-0 h-1 rounded-[4px] bg-[#E4E4E4]' />
                  {currentStep === index && <motion.div transition={{ duration: 0.15, type: 'tween' }} layoutId='active' className='absolute inset-0 h-1 rounded-[4px] bg-primary-blue' />}
                </div>
              ))}
          </div>
        </div>
      )}
      <div className={`px-6 ${isNotStep2End ? 'h-full' : 'h-[calc(100dvh-56px)] p-4 pb-2'}`}>
        <Suspense
          fallback={
            <div className='flex w-full justify-center'>
              <CircularProgress
                classNames={{
                  svg: 'h-8 w-8 text-primary-blue'
                }}
              />
            </div>
          }
        >
          {steps[currentStep]}
        </Suspense>
      </div>
    </DefaultLayout>
  )
}
