import { PrimaryButton, PrimaryLightButton, PrimaryOutlineButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import { DefaultModal } from '@/components/Modal'
import RadioGroupCustom from '@/components/RadioGroupCustom'
import WrapperBottom from '@/components/WrapperBottom'
import DefaultLayout from '@/layouts/default'
import instance from '@/services/axiosConfig'
import { TInitState } from '@/store'
import { Button, Link, Progress, Skeleton } from '@nextui-org/react'
import { ArrowLeft2, Clock, DocumentText1, Gift, MessageQuestion, TickCircle } from 'iconsax-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

type Answer = {
  id: number
  answer: number[]
}

export default function TestingPage() {
  const step1 = useSelector((state: TInitState) => state.step1)

  const [onFetching, setOnFetching] = useState(false)
  const [onStart, setOnStart] = useState(false)
  const [onFetchingDetail, setOnFetchingDetail] = useState(false)
  const [dataTesting, setDataTesting] = useState<any>({})
  const [dataTestingTopic, setDataTestingTopic] = useState<any>({})
  const [isReady, setIsReady] = useState(false)

  const navigate = useNavigate()

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
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetchingDetail(false)
    }
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
      if (dataTestingTopic?.status !== 0) {
        try {
          const { data } = await instance.get(`/webview/skill-tests/${dataTesting?.id}`)
          setDataTestingTopic(data)
          setIsReady(true)
        } catch (error) {
          console.error(error)
        } finally {
          setIsReady(false)
        }
      } else {
        setIsReady(true)
      }
    }

    if (dataTestingTopic?.status !== 0) {
      const interval = setInterval(() => {
        checkStatusAndRefetch()
      }, 4000)

      return () => clearInterval(interval)
    } else {
      setIsReady(true)
    }
  }, [dataTestingTopic])

  return onStart ? (
    <Questions testId={dataTesting?.id} />
  ) : (
    <DefaultLayout>
      <div className='flex flex-col gap-4 overflow-scroll p-4'>
        <Button startContent={<ArrowLeft2 />} className='h-14 justify-start bg-transparent px-0 text-base font-bold text-primary-black' as={Link} href='/'>
          Bài kiểm tra
        </Button>
        <div className='flex flex-col items-center'>
          <div className='size-[200px]'>
            <ImageFallback src='/robot.png' alt='hero' height={400} width={400} className='size-full' />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-primary-blue'>Bộ câu hỏi đang được soạn...</p>
            <Progress size='md' isIndeterminate aria-label='Loading...' className='max-w-md' />
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <h1 className='text-center text-2xl font-semibold text-primary-blue'>Kiểm tra nghiệp vụ {dataTestingTopic?.topic?.title}</h1>
          {!isReady ? (
            <div className='flex items-center gap-2'>
              <Skeleton className='h-10 w-[100px] rounded-lg' />
              <Skeleton className='h-10 w-[100px] rounded-lg' />
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <PrimaryLightButton startContent={<DocumentText1 />}>{dataTestingTopic?.topic?.questions_length} câu</PrimaryLightButton>
              <PrimaryLightButton startContent={<Clock />}>{converTimeMinutes(dataTestingTopic?.topic?.time)} phút</PrimaryLightButton>
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
            <li className=''>Được nhận công việc liên quan đến nghề sửa chữa điện lạnh trên app Vua Thợ. </li>
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
            <li className=''>Tổng thời gian làm bài tối đa là 15 phút.</li>
            <li>Thợ cần trả lời đúng tất cả câu hỏi để hoàn thành bài test.</li>
            <li>Làm bài test theo thứ tự, có thể back chọn lại.</li>
            <li>Không thể thoát ra khỏi màn hình khi làm bài, nếu thoát ra sẽ làm lại từ đầu.</li>
            <li>Khi hết thời gian làm bài, hệ thống sẽ tự động tính điểm và thông báo kết quả.</li>
          </ul>
        </div>
      </div>
      <div className='fixed bottom-0 w-full bg-white p-4 pb-6'>
        <PrimaryButton isLoading={!isReady} onPress={() => setOnStart(true)} className='h-11 w-full rounded-full'>
          Bắt đầu làm
        </PrimaryButton>
      </div>
    </DefaultLayout>
  )
}

const Questions = ({ testId }: { testId: number }) => {
  const questionsFake = [
    {
      id: 1,
      question: 'Khi vệ sinh máy giặt, bước đầu tiên bạn cần thực hiện là gì?',
      answers: [
        {
          id: 1,
          answer: 'Rút phích cắm điện của máy giặt'
        },
        {
          id: 2,
          answer: 'Mở vòi nước và làm ướt bên trong máy'
        },
        {
          id: 3,
          answer: 'Thêm chất tẩy rửa vào ngăn đựng'
        },
        {
          id: 4,
          answer: 'Bắt đầu chọn chế độ vệ sinh tự động'
        },
        {
          id: 234,
          answer: 'Rút phích cắm điện của máy giặ  3213 213 213 21t'
        },
        {
          id: 22123,
          answer: 'Mở vòi nước và làm ướt bên trong 123 23 21  máy'
        },
        {
          id: 3321321,
          answer: 'Thêm chất tẩy rửa vào n 3213 21găn đựng'
        },
        {
          id: 4312312123,
          answer: 'Bắt đầu chọn chế độ  123 12vệ sinh tự động'
        },
        {
          id: 4543543453543,
          answer: 'Rút phích cắm điện của má35453435y giặt'
        },
        {
          id: 2543453543,
          answer: 'Mở vòi nước và làm ướt bê35445543n trong máy'
        },
        {
          id: 354534453,
          answer: 'Thêm chất tẩy 435543453rửa vào ngăn đựng'
        },
        {
          id: 45434,
          answer: 'Bắt đầu chọn543543543453 chế độ vệ sinh tự động'
        }
      ],
      number_choices: 1,
      attachments: []
    },
    {
      id: 2,
      question: 'Loại chất tẩy rửa nào là phù hợp nhất để vệ sinh lồng giặt?',
      answers: [
        {
          id: 5,
          answer: 'Chất tẩy rửa chuyên dụng cho máy giặt'
        },
        {
          id: 6,
          answer: 'Nước rửa chén'
        },
        {
          id: 7,
          answer: 'Giấm trắng'
        },
        {
          id: 8,
          answer: 'Nước tẩy quần áo'
        }
      ],
      number_choices: 1,
      attachments: []
    },
    {
      id: 3,
      question: 'Khi nào bạn nên thực hiện vệ sinh bộ lọc xơ vải của máy giặt?',
      answers: [
        {
          id: 9,
          answer: 'Sau mỗi lần giặt'
        },
        {
          id: 10,
          answer: 'Mỗi tháng một lần'
        },
        {
          id: 11,
          answer: 'Chỉ khi máy giặt có mùi'
        },
        {
          id: 12,
          answer: 'Khi máy giặt không còn hoạt động'
        }
      ],
      number_choices: 1,
      attachments: []
    },
    {
      id: 4,
      question: 'Nước xả vải có thể sử dụng trong quá trình vệ sinh máy giặt không?',
      answers: [
        {
          id: 13,
          answer: 'Có, để làm mềm và thơm lồng giặt'
        },
        {
          id: 14,
          answer: 'Không, vì nước xả vải có thể để lại cặn'
        },
        {
          id: 15,
          answer: 'Có, nhưng chỉ với lượng nhỏ'
        },
        {
          id: 16,
          answer: 'Không, trừ khi được nhà sản xuất khuyến nghị'
        }
      ],
      number_choices: 1,
      attachments: []
    },
    {
      id: 5,
      question: 'Để loại bỏ mùi hôi từ máy giặt, bạn nên sử dụng phương pháp nào?',
      answers: [
        {
          id: 17,
          answer: 'Chạy một chu trình giặt nóng với chất tẩy rửa'
        },
        {
          id: 18,
          answer: 'Phơi nắng lồng giặt'
        },
        {
          id: 19,
          answer: 'Sử dụng nước rửa chén'
        },
        {
          id: 20,
          answer: 'Dùng cồn để lau chùi'
        }
      ],
      number_choices: 1,
      attachments: []
    }
  ]
  const navigate = useNavigate()

  const [onFetching, setOnFetching] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answerSheets, setAnswerSheets] = useState<any>([])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [listQuestions, setListQuestions] = useState<any>([])
  const [meta, setMeta] = useState<any>({
    endTime: '',
    startTime: ''
  })
  console.log({ listQuestions, meta })
  //time zone
  const endTime = moment.utc('2024-06-14 02:42:45')
  const startTime = moment.utc('2024-06-14 02:32:45')
  const currentTime = moment.utc()
  const totalSecondsCountdown = endTime.diff(currentTime, 'seconds')
  const elapsedTime = currentTime.diff(startTime)
  const totalDuration = endTime.diff(startTime)

  const secondsRemaining = endTime.diff(currentTime, 'seconds')
  const [timeLeft, setTimeLeft] = useState(totalSecondsCountdown)
  const [progress, setProgress] = useState(0)

  const handleNextQuestion = () => {
    if (currentQuestion < questionsFake.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleStoreAnswer = (id: number) => {
    setAnswerSheets((prevAnswers: Answer[]) => {
      const questionId = questionsFake[currentQuestion].id
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
  }
  const handleSubmitApi = () => {
    navigate('/result')
  }

  const handleTimeEnd = () => {}

  useEffect(() => {
    // if (timeLeft <= -1) return navigate('/result')

    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(secondsRemaining)
        setProgress((elapsedTime / totalDuration) * 100)
      }, 1000)

      return () => clearInterval(timer)
    } else {
      handleTimeEnd()
    }
  }, [timeLeft, totalSecondsCountdown])

  const handleGetListQuestions = async () => {
    try {
      const { data }: any = await instance.post(`/webview/skill-tests/${testId}/start`)
      console.log({ data })

      setListQuestions(data)
      setMeta(data.meta)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetching(false)
    }
  }

  useEffect(() => {
    onFetching && handleGetListQuestions()
  }, [onFetching])

  useEffect(() => {
    setOnFetching(true)
  }, [])

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
            <Button onClick={handleSubmit} isDisabled={answerSheets.length < questionsFake.length} className='rounded-full bg-primary-blue font-bold text-white'>
              Nộp bài
            </Button>
          </div>
          <div className='flex w-full items-center gap-3 overflow-auto p-4 pt-0'>
            {questionsFake.map((question, index) => {
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
              Câu {questionsFake?.[currentQuestion]?.id}: {questionsFake?.[currentQuestion]?.question}
            </h1>
            <p className='text-primary-gray'>Hãy chọn 1 đáp án đúng</p>
          </div>
        </div>
        <div className='flex-1 overflow-y-auto bg-primary-light-blue p-4 pb-[88px]'>
          <RadioGroupCustom data={questionsFake?.[currentQuestion]?.answers} answerSheets={answerSheets} handleStoreAnswer={handleStoreAnswer} />
        </div>
      </div>
      <WrapperBottom>
        <PrimaryOutlineButton isDisabled={currentQuestion === 0} onPress={handlePrevQuestion} className='h-12 w-full rounded-full'>
          Trở về
        </PrimaryOutlineButton>
        {answerSheets.length === questionsFake.length && currentQuestion === questionsFake.length - 1 ? (
          <Button onClick={handleSubmit} className='h-12 w-full rounded-full bg-primary-blue font-bold text-white'>
            Nộp bài
          </Button>
        ) : (
          <PrimaryButton onPress={handleNextQuestion} className='h-12 w-full rounded-full'>
            Tiếp tục
          </PrimaryButton>
        )}
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
            <PrimaryButton onPress={handleSubmitApi} className='h-12 w-full rounded-full'>
              Xác nhận
            </PrimaryButton>
          </div>
        </div>
      </DefaultModal>
    </div>
  )
}
