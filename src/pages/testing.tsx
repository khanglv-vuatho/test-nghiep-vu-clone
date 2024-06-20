import { PrimaryButton, PrimaryLightButton, PrimaryOutlineButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import { DefaultModal } from '@/components/Modal'
import RadioGroupCustom from '@/components/RadioGroupCustom'
import WrapperBottom from '@/components/WrapperBottom'
import { status } from '@/constants'
import DefaultLayout from '@/layouts/default'
import instance from '@/services/axiosConfig'
import { TInitState } from '@/store'
import { Test } from '@/types'
// import { formatLocalTime } from '@/utils'

import { Button, Link, Progress, Skeleton } from '@nextui-org/react'
import { ArrowLeft2, Clock, DocumentText1, Gift, MessageQuestion, TickCircle, AddCircle } from 'iconsax-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

type Answer = {
  id: number
  answer: number[]
}

export default function TestingPage() {
  const step1 = useSelector((state: TInitState) => state.step1)
  // const testDetail = useSelector((state: TInitState) => state.testDetail) as Test
  const isStartAgain = useSelector((state: TInitState) => state.isStartAgain)
  const testDetail = useSelector((state: TInitState) => state.testDetail) as Test

  const [onFetching, setOnFetching] = useState(false)
  const [onStart, setOnStart] = useState(false)
  const [onFetchingDetail, setOnFetchingDetail] = useState(false)
  const [onFetchingAnswer, setOnFetchingAnswer] = useState(false)
  const [statusTest, setStatusTest] = useState<number>()
  const [dataTesting, setDataTesting] = useState<any>({})
  const [dataTestingTopic, setDataTestingTopic] = useState<any>({})
  const [listQuestions, setListQuestions] = useState<any>([])
  const [meta, setMeta] = useState<any>({})
  const [isReady, setIsReady] = useState(false)

  const targetTime = moment.utc(testDetail?.meta?.can_retake)
  const currentTime = moment.utc()

  const isAfterCurrentTime = targetTime.isBefore(currentTime)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const converTimeMinutes = (time: string) => {
    return moment.duration(time).asMinutes()
  }

  const handleGetQuestionAndAnswer = async () => {
    try {
      const { data }: any = await instance.post('/webview/request-skill-test', {
        industry_id: step1.id
      })
      setDataTesting(data)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetching(false)
    }
  }

  const handleGetQuestionAndAnswerDetail = async () => {
    try {
      const { data }: any = await instance.get(`/webview/skill-tests/${dataTesting?.id}`)
      setDataTestingTopic(data)
      setStatusTest(data?.status)

      dispatch({
        type: 'isStartAgain',
        payload: data?.status == status.failed
      })

      setIsReady(data?.status !== status.pending)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetchingDetail(false)
    }
  }
  console.log({ testDetail })
  const handleGetListQuestions = async () => {
    try {
      const { data }: any = await instance.post(`/webview/skill-tests/${dataTesting?.id}/${statusTest == status.failed ? 'again' : 'start'}`)

      setListQuestions(data?.topic?.questions)
      setMeta(data?.meta)
      dispatch({
        type: 'isStartAgain',
        payload: data?.status == status.failed
      })

      statusTest == status.failed ? setOnFetchingDetail(true) : setOnStart(true)
    } catch (error: any) {
      console.log(error)
    } finally {
      setOnFetchingAnswer(false)
    }
  }

  const handleStart = () => {
    if (statusTest == status.failed) {
      setOnFetchingAnswer(true)
    } else {
      setOnFetchingAnswer(true)
    }
  }

  const formatDDMMYYYY = (time: string) => {
    return moment(time).format('DD/MM/YYYY')
  }

  useEffect(() => {
    onFetching && handleGetQuestionAndAnswer()
  }, [onFetching])

  useEffect(() => {
    setOnFetching(true)
  }, [])

  useEffect(() => {
    onFetchingDetail && handleGetQuestionAndAnswerDetail()
  }, [onFetchingDetail])

  useEffect(() => {
    onFetchingAnswer && handleGetListQuestions()
  }, [onFetchingAnswer])

  useEffect(() => {
    if (!dataTesting?.id) return
    setOnFetchingDetail(true)
  }, [dataTesting])

  useEffect(() => {
    if (!step1.title) {
      navigate('/')
    }
  }, [])

  useEffect(() => {
    const checkStatusAndRefetch = async () => {
      try {
        const { data } = await instance.get(`/webview/skill-tests/${dataTesting?.id}`)
        setDataTestingTopic(data)
      } catch (error) {
        console.error(error)
      }
    }

    if (dataTestingTopic?.status === status.failed) {
      return
    }

    if (dataTestingTopic?.status === status.pending) {
      const interval = setInterval(() => {
        checkStatusAndRefetch()
        setIsReady(false)
        console.log({ isReady })
      }, 4000)

      return () => clearInterval(interval)
    } else {
      setIsReady(true)
    }
  }, [dataTestingTopic])

  useEffect(() => {
    setOnFetching(true)
  }, [])

  useEffect(() => {
    // scroll to top when screen is mounted
    window.scrollTo(0, 0)
  }, [])

  return onStart ? (
    <Questions testId={dataTesting?.id} listQuestions={listQuestions} meta={meta} />
  ) : (
    <DefaultLayout>
      {testDetail?.meta?.can_retake ? (
        <div className='flex min-h-[calc(100dvh-128px)] flex-col gap-2 overflow-hidden'>
          <div className='flex items-center justify-center bg-white py-4 text-center'>
            <div className='font-bold'>Kết quả</div>
          </div>
          <div className='flex flex-col gap-4 px-4'>
            {/* <div className='flex gap-2'>{dataTestingTopic?.results?.map((_: any, index: number) => <div key={index} className='h-1 w-full rounded-[4px] bg-primary-blue' />)}</div> */}
            {testDetail?.results?.map((item: any, index: number) => (
              <div key={item} className='relative flex w-[calc(100%-4px)] items-center gap-4 rounded-2xl bg-white p-4 shadow-[8px_8px_16px_0px_#0000000A]'>
                <div className='absolute inset-0 z-[-10] translate-x-1 rounded-2xl bg-primary-red' />
                <div className='flex size-8 items-center justify-center rounded-full bg-primary-blue text-sm font-bold text-white'>{index + 1}</div>
                <div className='flex flex-1 flex-col gap-1'>
                  <p className='font-bold'>{step1?.title}</p>
                  <p>{formatDDMMYYYY(item.finish_time.split(' ')?.[0])}</p>
                </div>
                <div className='flex w-[65px] items-center justify-start gap-1'>
                  <span>
                    <AddCircle variant='Bold' className='rotate-45 text-primary-red transition' />
                  </span>
                  <p className='font-bold'>{item.percent}%</p>
                </div>
              </div>
            ))}
          </div>
          {/* <div className='flex h-full flex-1 flex-col gap-4 px-4'>
            {dataTestingTopic?.results?.map((item: any) => (
              <div key={item} className='relative flex flex-col gap-4 rounded-xl bg-white p-4 shadow-[8px_8px_16px_0px_#0000000A]'>
                <div className='absolute -bottom-[10%] -right-[3%] flex size-[72px] rotate-45 items-center justify-center rounded-full border-2 border-primary-red bg-primary-red/10 text-sm font-bold text-primary-red backdrop-blur-sm'>
                  <p>{item.percent >= 40 ? 'Gần đạt' : 'Chưa đạt'}</p>
                </div>
                <div className='flex items-center justify-between'>
                  <p className='text-2xl font-bold text-primary-blue'>{step1?.title}</p>
                  <p className='text-xl font-bold text-primary-red'>{item.percent}%</p>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-1.5'>
                    <p className='font-bold'>Lần {item.times}:</p>
                    <p className='font-bold text-primary-red'>
                      {item?.correct_answer}/{item?.total_question}
                    </p>
                  </div>
                  <p>Ngày {formatDDMMYYYY(item.finish_time.split(' ')?.[0])}</p>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      ) : (
        <>
          <div className='sticky top-0 z-50 flex flex-col gap-4 px-4'>
            <Button startContent={<ArrowLeft2 />} className='h-14 justify-start bg-transparent px-0 text-base font-bold text-primary-black' as={Link} href='/'>
              Bài kiểm tra
            </Button>
          </div>
          <div className='flex flex-col gap-4 p-4'>
            <div className='flex flex-col items-center'>
              <div className='size-[200px]'>
                <ImageFallback src='/robot.png' alt='hero' height={400} width={400} className='size-full' />
              </div>
              {!isReady && (
                <div className='flex flex-col gap-2'>
                  <p className='text-primary-blue'>Bộ câu hỏi đang được soạn...</p>
                  <Progress size='md' isIndeterminate aria-label='Loading...' className='max-w-md' />
                </div>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <h1 className='text-center text-2xl font-semibold text-primary-blue'>Kiểm tra nghiệp vụ {dataTestingTopic?.topic?.title}</h1>
              {!isReady ? (
                <div className='flex items-center justify-center gap-2'>
                  <Skeleton className='h-12 w-[100px] rounded-lg' />
                  <Skeleton className='h-12 w-[100px] rounded-lg' />
                </div>
              ) : (
                <div className='flex items-center justify-center gap-2'>
                  <PrimaryLightButton disableRipple startContent={<DocumentText1 />}>
                    {dataTestingTopic?.topic?.questions_length} câu
                  </PrimaryLightButton>
                  <PrimaryLightButton disableRipple disableAnimation startContent={<Clock />}>
                    {converTimeMinutes(dataTestingTopic?.topic?.time)} phút
                  </PrimaryLightButton>
                </div>
              )}
            </div>
            <div className='flex flex-col gap-2 rounded-lg bg-primary-light-gray p-4'>
              <div className='flex items-center gap-2 font-semibold text-primary-blue'>
                <span>
                  <Gift />
                </span>
                <p>Quyền lợi</p>
              </div>
              <ul className='list-inside list-disc pl-2'>
                <li>Được nhận công việc liên quan đến nghề sửa chữa điện lạnh trên app Vua Thợ. </li>
                <li>Được cập nhập các quy định quan trọng của Vua Thợ.</li>
                <li>Được hướng dẫn chi tiết quy trình làm việc của dịch vụ.</li>
              </ul>
            </div>
            <div className='flex flex-col gap-2 rounded-lg bg-primary-light-gray p-4'>
              <div className='flex items-center gap-2 font-semibold text-primary-blue'>
                <span>
                  <MessageQuestion />
                </span>
                <p>Hướng dẫn</p>
              </div>
              <ul className='list-inside list-disc pl-2'>
                <li>Tổng thời gian làm bài tối đa là 15 phút.</li>
                <li>Thợ cần trả lời đúng tất cả câu hỏi để hoàn thành bài test.</li>
                <li>Làm bài test theo thứ tự, có thể back chọn lại.</li>
                <li>Không thể thoát ra khỏi màn hình khi làm bài, nếu thoát ra sẽ làm lại từ đầu.</li>
                <li>Khi hết thời gian làm bài, hệ thống sẽ tự động tính điểm và thông báo kết quả.</li>
              </ul>
            </div>
          </div>
        </>
      )}
      <div className='fixed bottom-0 min-h-[84px] w-full bg-white p-4'>
        {testDetail?.meta?.can_retake ? (
          <div className='flex flex-col gap-2'>
            <PrimaryButton isDisabled={isAfterCurrentTime} className='h-11 w-full rounded-full'>
              Làm lại
            </PrimaryButton>
            <Button className='h-11 w-full rounded-full bg-transparent text-[#A6A6A6]'>Thoát</Button>
            {/* Ngày <span className='font-bold'>{moment(testDetail?.meta?.can_retake?.split(' ')?.[0]).format('DD/MM/YYYY')}</span> */}
          </div>
        ) : (
          <PrimaryButton isDisabled={!isReady} isLoading={onFetchingAnswer} onPress={handleStart} className='h-12 w-full rounded-full'>
            {isStartAgain ? 'Kiểm tra lại' : 'Bắt đầu làm'}
          </PrimaryButton>
        )}
      </div>
    </DefaultLayout>
  )
}
type TQuestions = { testId: number; listQuestions: any; meta: any }

const Questions = ({ testId, listQuestions, meta }: TQuestions) => {
  const navigate = useNavigate()

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
    }
  }

  const handleStoreAnswer = (id: number) => {
    setAnswerSheets((prevAnswers: Answer[]) => {
      const questionId = listQuestions[currentQuestion].id
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

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    setIsOpenModal(true)
    console.log({ answerSheets })
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

      const data: any = await instance.post(`/webview/skill-tests/${testId}/submit`, payload)

      if (data.status == 200) {
        navigate('/result')
        dispatch({
          type: 'resultTest',
          payload: {
            testId: testId,
            kyc_status: data?.data?.kyc_status,
            percent: data?.data?.result?.percent,
            questions: data?.data?.questions
          }
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setOnChecking(false)
    }
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
    }
  }, [timeLeft, totalSecondsCountdown, meta])

  useEffect(() => {
    if (progress > 99.4) {
      setOnChecking(true)
    }
  }, [progress])

  return (
    <div>
      <div className='flex min-h-dvh flex-col gap-4'>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-2 p-4'>
            <div className='rounded-full bg-primary-light-blue px-3 py-2 font-bold text-primary-blue'>{moment(timeLeft * 1000).format('mm:ss')}</div>
            <Progress
              value={progress}
              classNames={{
                indicator: 'bg-primary-blue',
                track: 'bg-primary-light-blue'
              }}
            />
          </div>
          <div className='flex w-full items-center gap-3 overflow-auto p-4 pt-0'>
            {listQuestions.map((question: any, index: number) => {
              const isCurrentSelect = index === currentQuestion
              const isSelected = answerSheets.some((answer: any) => answer.id == question.id)

              return (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`relative flex size-11 flex-shrink-0 select-none items-center justify-center rounded-full border font-bold transition ${isSelected ? 'border-primary-green text-primary-green' : 'border-primary-blue text-primary-blue'} ${isCurrentSelect ? '!border-primary-blue !bg-primary-blue !text-white' : ''}`}
                >
                  {index + 1}
                  <span className='absolute bottom-0 right-0 translate-x-1/2 translate-y-[10%] text-xs font-bold'>
                    <TickCircle variant='Bold' className={`transition ${isSelected && !isCurrentSelect ? 'text-primary-green' : 'hidden'}`} />
                  </span>
                </button>
              )
            })}
          </div>
          <div className='flex flex-col gap-4 p-4 py-2'>
            <h1 className='font-bold'>
              Câu {listQuestions?.[currentQuestion]?.id}: {listQuestions?.[currentQuestion]?.question}
            </h1>
            <p className='text-primary-gray'>Hãy chọn 1 đáp án đúng</p>
          </div>
        </div>
        <div className='flex-1 overflow-y-auto bg-primary-light-blue p-4 pb-[88px]'>
          <RadioGroupCustom data={listQuestions?.[currentQuestion]?.answers} currentAnswer={answerSheets?.[currentQuestion]} handleStoreAnswer={handleStoreAnswer} />
        </div>
      </div>
      <WrapperBottom>
        <PrimaryOutlineButton isDisabled={currentQuestion === 0} onPress={handlePrevQuestion} className='z-20 h-12 w-full rounded-full bg-white'>
          Trở về
        </PrimaryOutlineButton>

        <PrimaryButton onPress={handleNextQuestion} isDisabled={IS_FINAL_QUESTION && IS_FILL_FULL_QUESTION} className='h-12 w-full rounded-full'>
          {IS_FINAL_QUESTION ? 'Nộp bài' : 'Tiếp tục'}
        </PrimaryButton>
      </WrapperBottom>
      <DefaultModal isOpen={isOpenModal} onOpenChange={setIsOpenModal as any}>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col items-center justify-center gap-4'>
            <div className='h-[122px] w-[132px]'>
              <ImageFallback src='/test.png' alt='test' width={200} height={200} className='size-full' />
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-center font-bold'>Xác nhận nộp bài kiểm tra</p>
              <p className='text-center text-xs'>Bạn chắc chắn muốn nộp bài kiểm tra của bạn? Hành động này sẽ không thể hoàn tác!</p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <PrimaryOutlineButton onPress={() => setIsOpenModal(false)} className='h-12 w-full rounded-full'>
              Hủy
            </PrimaryOutlineButton>
            <PrimaryButton isLoading={onChecking} onPress={() => setOnChecking(true)} className='h-12 w-full rounded-full'>
              Xác nhận
            </PrimaryButton>
          </div>
        </div>
      </DefaultModal>
    </div>
  )
}
