import { Button } from '@nextui-org/react'
import { AddCircle, TickCircle } from 'iconsax-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'

import { PrimaryButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import WrapperBottom from '@/components/WrapperBottom'
import instance from '@/services/axiosConfig'
import { ActionTypes, TInitState } from '@/store'
import { formatNumber, handleAddLangInUrl, postMessageCustom } from '@/utils'
import DefaultLayout from '@/layouts/default'
import { translate } from '@/context/translationProvider'
import { keyPossmessage } from '@/constants'

const ResultPage = () => {
  const r = translate('Result')
  const t = translate('Testing')
  const resultTest = useSelector((state: TInitState) => state.resultTest)
  const isPass = resultTest?.percent >= 60
  const [isLoading, setIsLoading] = useState(false)
  const [isTestAgain, setIsTestAgain] = useState(false)
  const [isTestTriesMaxedOut, setIsTestTriesMaxedOut] = useState(false)
  const [isLoadingCloseWebView, setIsLoadingCloseWebView] = useState(false)

  const queryParams = new URLSearchParams(location.search)
  const token = queryParams?.get('token') || ''
  const lang = queryParams?.get('lang') || 'vi'

  const IS_KYC_STATUS = resultTest.kyc_status != 2

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleCloseWebView = () => {
    setIsLoadingCloseWebView(true)
    postMessageCustom({ message: keyPossmessage.CAN_POP })
  }

  const handleNextResult = () => {
    dispatch({
      type: ActionTypes.DIRECTION,
      payload: 'left'
    })
    if (IS_KYC_STATUS) {
      navigate(handleAddLangInUrl({ mainUrl: '/kyc', lang, token }))
    } else {
      setIsLoading(true)
      postMessageCustom({ message: keyPossmessage.FINISHED_TEST })
    }
  }

  const handleTestAgain = () => {
    setIsTestAgain(true)
  }

  const handleApiTestAgain = async () => {
    try {
      await instance.post(`/webview/skill-tests/${resultTest?.testId}/again`)
      navigate(handleAddLangInUrl({ mainUrl: '/testing', lang, token }))
    } catch (error) {
      console.log(error)
      setIsTestTriesMaxedOut(true)
    } finally {
      setIsTestAgain(false)
    }
  }
  useEffect(() => {
    isTestAgain && handleApiTestAgain()
  }, [isTestAgain])

  return (
    <DefaultLayout>
      <div className={`flex min-h-[calc(100dvh-80px)] flex-col gap-6 bg-primary-light-blue`}>
        <div>
          <p className='sticky left-0 right-0 top-0 z-50 bg-primary-light-blue py-4 text-center text-xl font-bold'>{t?.text1}</p>
          <div className='px-4'>
            <Pass />
          </div>
        </div>
        {resultTest?.percent === 100 ? null : <ResultArea />}
      </div>
      <WrapperBottom className='sticky px-4'>
        {isPass ? (
          <PrimaryButton isLoading={isLoading} onPress={handleNextResult} className='h-12 w-full rounded-full font-bold'>
            {IS_KYC_STATUS ? t?.text26 : r?.text1}
          </PrimaryButton>
        ) : (
          <div className='flex w-full flex-col gap-1'>
            {isTestTriesMaxedOut ? (
              <p className='text-center font-bold text-primary-blue'>{r?.text2}</p>
            ) : (
              <PrimaryButton isLoading={isTestAgain} className='h-12 w-full rounded-full font-bold' onPress={handleTestAgain}>
                {t?.text18}
              </PrimaryButton>
            )}
            <Button onPress={handleCloseWebView} isLoading={isLoadingCloseWebView} className='h-12 bg-transparent text-primary-gray'>
              {t?.text19}
            </Button>
          </div>
        )}
      </WrapperBottom>
    </DefaultLayout>
  )
}

const Pass = () => {
  const r = translate('Result')
  const resultTest = useSelector((state: TInitState) => state.resultTest)
  const step1 = useSelector((state: TInitState) => state.step1)

  const isPass = resultTest?.percent >= 60
  useEffect(() => {
    if (isPass) {
      const fireConfetti = (angle: number) => {
        confetti({
          angle: angle,
          spread: 30,
          particleCount: 60,
          origin: { y: 0.6 }
        })
      }

      const angles = [90, 120, 60] // Angles for left, center, and right

      // Fire confetti 3 times with 0.2 second interval from different angles
      angles.forEach((angle, index) => {
        setTimeout(() => fireConfetti(angle), (index + 1) * 200)
      })
    }
  }, [isPass])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col items-center gap-4 rounded-2xl bg-white p-4 px-8 shadow-[8px_8px_16px_0px_#0000000A]'>
        <div className='flex flex-col items-center gap-2'>
          <div className='h-[128px] w-[131px]'>
            <ImageFallback src={isPass ? '/pass.png' : '/nopass.png'} alt='pass' width={400} height={400} className='size-full' />
          </div>
          <div className='flex flex-col'>
            <p className='text-center'>
              {r?.text3} {step1?.title}
            </p>
            <p className='text-center text-3xl font-bold'>{formatNumber(resultTest?.percent)}%</p>
          </div>
        </div>
        <div className='flex flex-col items-center gap-1'>
          {isPass ? <p className='text-center font-bold text-primary-blue'>{r?.text4}</p> : <p className='text-center font-bold text-primary-red'>{r?.text5}</p>}
          <p className='text-center text-sm'>{isPass ? r?.text6 : r?.text7}</p>
        </div>
      </div>
    </div>
  )
}

const ResultArea = () => {
  const t = translate('Testing')
  const r = translate('Result')
  const resultTest = useSelector((state: TInitState) => state.resultTest)
  const questions = resultTest.questions

  return (
    <div className='flex flex-col gap-4 p-4 pt-0'>
      {questions.map((item) => {
        const correctAnswer = item.correct_answer
        const yourAnswer = item.your_answer
        return (
          <div key={item.id} className='flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[8px_8px_16px_0px_#0000000A]'>
            <p className='font-bold text-primary-blue'>
              {t?.text6} {item.id}: {item.question}
            </p>
            <div className='flex flex-col gap-2 px-2'>
              {!item.is_correct && (
                <AnswerBlock title={r?.text8} mainColor='primary-red' answerLabel={yourAnswer} icon={<AddCircle className='rotate-45 text-primary-red' variant='Bold' size={20} />} />
              )}
              <AnswerBlock title={r?.text9} mainColor='primary-green' answerLabel={correctAnswer} icon={<TickCircle className='text-primary-green' variant='Bold' size={20} />} />
            </div>
            <p className='text-sm font-light'>{item.explain_answer}</p>
          </div>
        )
      })}
    </div>
  )
}

type PropsAnswerBlock = {
  title: string
  answerLabel: {
    label: string
    letter: string
  }
  icon: JSX.Element
  mainColor: string
}

const AnswerBlock = ({ title, answerLabel, icon, mainColor }: PropsAnswerBlock) => (
  <div className='flex flex-col gap-1 text-sm'>
    <p className={`text-${mainColor}`}>{title}</p>
    <div className={`flex items-center justify-between gap-1 rounded-xl border-1.5 border-${mainColor} bg-light-${mainColor} px-2 py-3 pr-1`}>
      <div className='flex items-center gap-2'>
        <div className={`flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-${mainColor} text-white`}>{answerLabel?.letter}</div>
        <p className={`text-${mainColor}`}>{answerLabel?.label}</p>
      </div>
      <span>{icon}</span>
    </div>
  </div>
)
export default ResultPage
