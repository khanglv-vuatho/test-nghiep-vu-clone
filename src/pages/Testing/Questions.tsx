import { PrimaryButton, PrimaryOutlineButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import { DefaultModal } from '@/components/Modal'
import RadioGroupCustom from '@/components/RadioGroupCustom'
import WrapperAnimation from '@/components/WrapperAnimation'
import WrapperBottom from '@/components/WrapperBottom'
import { translate } from '@/context/translationProvider'
import instance from '@/services/axiosConfig'
import { ActionTypes, TInitState } from '@/store'
import { handleAddLangInUrl } from '@/utils'
import { Progress } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { TickCircle } from 'iconsax-react'
import moment from 'moment'
import { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

type TQuestions = { testId: number; listQuestions: any; meta: any }
type Answer = {
  id: number
  answer: number[]
}

const Questions = ({ testId, listQuestions, meta }: TQuestions) => {
  const t = translate('Testing')
  const navigate = useNavigate()

  const direction = useSelector((state: TInitState) => state.direction)

  const queryParams = new URLSearchParams(location.search)
  const token = queryParams?.get('token') || ''
  const lang = queryParams?.get('lang') || 'vi'

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answerSheets, setAnswerSheets] = useState<any>([])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [onChecking, setOnChecking] = useState(false)

  //time zone
  const endTime = moment.utc(meta.end_time)
  const startTime = moment.utc(meta.start_time)
  const currentTime = moment.utc()
  const totalSecondsCountdown = endTime.diff(currentTime, 'seconds')
  const elapsedTime = currentTime.diff(startTime)
  const totalDuration = endTime.diff(startTime)

  const secondsRemaining = endTime.diff(currentTime, 'seconds')

  const [timeLeft, setTimeLeft] = useState(totalSecondsCountdown)
  const [progress, setProgress] = useState(0)

  const dispatch = useDispatch()

  const IS_FINAL_QUESTION = currentQuestion === listQuestions.length - 1
  const IS_FILL_FULL_QUESTION = answerSheets.length < listQuestions.length

  const handleNextQuestion = () => {
    if (IS_FINAL_QUESTION) {
      handleSubmit()
      return
    }
    if (currentQuestion < listQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      dispatch({
        type: ActionTypes.DIRECTION,
        payload: 'left'
      })
    }
  }

  const handleStoreAnswer = (id: number) => {
    setAnswerSheets((prevAnswers: Answer[]) => {
      const questionId = listQuestions?.[currentQuestion]?.id

      const newAnswer: Answer = {
        id: questionId,
        answer: [id]
      }

      // Check if the question is already answered
      const existingAnswerIndex = prevAnswers.findIndex((answer) => answer.id === questionId)

      if (existingAnswerIndex !== -1) {
        // Update the existing answer
        const updatedAnswers = [...prevAnswers]
        updatedAnswers[existingAnswerIndex] = newAnswer

        return updatedAnswers
      } else {
        // Add the new answer
        return [...prevAnswers, newAnswer]
      }
    })
  }
  const handleChangeQuestion = (index: number) => {
    dispatch({
      type: ActionTypes.DIRECTION,
      payload: currentQuestion < index ? 'left' : 'right'
    })
    setCurrentQuestion(index)
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      dispatch({
        type: ActionTypes.DIRECTION,
        payload: 'right'
      })
    }
  }

  const handleSubmit = () => {
    setIsOpenModal(true)
  }
  const handleSubmitApi = async () => {
    try {
      const payload = {
        type: 'submit',
        answer_sheets: answerSheets.map((item: any) => ({
          id: item.id,
          answers: item.answer
        }))
      }
      dispatch({
        type: ActionTypes.DIRECTION,
        payload: 'left'
      })
      const data: any = await instance.post(`/webview/skill-tests/${testId}/submit`, payload)

      if (data.status == 200) {
        navigate(handleAddLangInUrl({ mainUrl: '/result', lang, token }))

        dispatch({
          type: ActionTypes.RESULT_TEST,
          payload: {
            testId: testId,
            kyc_status: data?.data?.kyc_status,
            percent: data?.data?.result?.percent,
            questions: data?.data?.questions
          }
        })

        setAnswerSheets([])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setOnChecking(false)
    }
  }

  const handleChecking = () => {
    setOnChecking(true)
  }

  useEffect(() => {
    onChecking && handleSubmitApi()
  }, [onChecking])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(secondsRemaining)
        setProgress((elapsedTime / totalDuration) * 100)
      }, 1000)

      return () => clearInterval(timer)
    } else {
      handleChecking()
    }
  }, [timeLeft, totalSecondsCountdown, meta])

  useEffect(() => {
    if (progress > 99.4) {
      handleChecking()
    }
  }, [progress])

  return (
    <div className='w-full'>
      <div className='flex min-h-dvh flex-col gap-4'>
        <div className='flex flex-col gap-4'>
          <div className={`z-50 flex items-center gap-2 bg-white p-4`}>
            <motion.div className={`rounded-full bg-primary-light-blue px-3 py-2 font-bold text-primary-blue`}>{moment(timeLeft * 1000).format('mm:ss')}</motion.div>
            <motion.div className='w-full'>
              <Progress
                value={progress}
                classNames={{
                  indicator: 'bg-primary-blue',
                  track: 'bg-primary-light-blue'
                }}
              />
            </motion.div>
          </div>
          <motion.div className={`z-50 flex w-fit items-center gap-3 overflow-auto p-4 pt-0`}>
            {listQuestions.map((question: any, index: number) => {
              const isCurrentSelect = index === currentQuestion
              const isSelected = answerSheets.some((answer: any) => answer.id == question.id)

              return (
                <button
                  key={question?.id}
                  onClick={() => handleChangeQuestion(index)}
                  className={`relative flex size-11 flex-shrink-0 select-none items-center justify-center rounded-full border font-bold transition ${isSelected ? 'border-primary-green text-primary-green' : 'border-primary-blue text-primary-blue'} ${isCurrentSelect ? '!border-primary-blue !bg-primary-blue !text-white' : ''}`}
                >
                  <p className='z-50'>{index + 1}</p>
                  <span className='absolute bottom-0 right-0 translate-x-1/2 translate-y-[10%] text-xs font-bold'>
                    <TickCircle variant='Bold' className={`transition ${isSelected && !isCurrentSelect ? 'text-primary-green' : 'hidden'}`} />
                  </span>
                </button>
              )
            })}
          </motion.div>
          <WrapperAnimation keyRender={currentQuestion} direction={direction} duration={0.1}>
            <div className='flex flex-col gap-4 overflow-hidden p-4 py-2'>
              <h1 className='font-bold'>
                {t?.text22} {listQuestions?.[currentQuestion]?.id}: {listQuestions?.[currentQuestion]?.question}
              </h1>
              <p className='text-primary-gray'>{t?.text23}</p>
            </div>
          </WrapperAnimation>
        </div>

        <div className='mb-[100px] flex-1 overflow-hidden overflow-y-auto bg-primary-light-blue p-4 py-10'>
          <WrapperAnimation keyRender={currentQuestion} direction={direction} duration={0.08}>
            <RadioGroupCustom
              data={listQuestions?.[currentQuestion]?.answers}
              answerSheets={answerSheets}
              currentAnswerId={listQuestions?.[currentQuestion]?.id}
              handleStoreAnswer={handleStoreAnswer}
            />
          </WrapperAnimation>
        </div>
      </div>
      <WrapperBottom>
        <PrimaryOutlineButton isDisabled={currentQuestion === 0} onClick={handlePrevQuestion} className='z-20 h-12 w-full rounded-full bg-white'>
          {t?.text24}
        </PrimaryOutlineButton>
        <PrimaryButton onClick={handleNextQuestion} isDisabled={IS_FINAL_QUESTION && IS_FILL_FULL_QUESTION} className='h-12 w-full rounded-full'>
          {IS_FINAL_QUESTION ? t?.text25 : t?.text26}
        </PrimaryButton>
      </WrapperBottom>
      <DefaultModal isOpen={isOpenModal} onOpenChange={setIsOpenModal as any}>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-center justify-center gap-4'>
            <div className='h-[122px] w-[132px]'>
              <ImageFallback src='/test.png' alt='test' width={200} height={200} className='size-full' />
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-center font-bold'>{t?.text27}</p>
              <p className='text-center text-xs'>{t?.text28}</p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <PrimaryOutlineButton onClick={() => setIsOpenModal(false)} className='h-12 w-full rounded-full'>
              {t?.text29}
            </PrimaryOutlineButton>
            <PrimaryButton isLoading={onChecking} frequency='medium' onClick={handleChecking} className='h-12 w-full rounded-full'>
              {t?.text30}
            </PrimaryButton>
          </div>
        </div>
      </DefaultModal>
    </div>
  )
}

export default memo(Questions)
