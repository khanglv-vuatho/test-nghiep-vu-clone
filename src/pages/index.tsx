import { PrimaryButton, PrimaryOutlineButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import { status } from '@/constants'
import DefaultLayout from '@/layouts/default'
import instance from '@/services/axiosConfig'
import { TInitState } from '@/store'

import { capitalizeWords, handleAddLangInUrl, useDebounce, useUnfocusItem } from '@/utils'
import { Button, Chip, CircularProgress, Input, Radio, RadioGroup } from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

type Step = {
  setActiveStep: any
}

export default function IndexPage() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [<Step1 setActiveStep={setActiveStep} />, <Step2 setActiveStep={setActiveStep} />, <Step3 setActiveStep={setActiveStep} />, <Step2End />]

  return (
    <DefaultLayout>
      {activeStep < 3 && (
        <div className='flex items-center justify-center p-4'>
          <div className='grid w-full grid-cols-3 gap-2'>
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <div key={index} className={`h-1 rounded-[4px] ${activeStep === index ? 'bg-primary-blue' : 'bg-[#E4E4E4]'}`} />
              ))}
          </div>
        </div>
      )}
      <div className={`h-full px-6 scrollbar-hide ${activeStep < 3 ? 'p-4 pb-2' : ''}`}>{steps[activeStep]}</div>
    </DefaultLayout>
  )
}

const Step1 = ({ setActiveStep }: Step) => {
  const step1 = useSelector((state: TInitState) => state.step1)

  const [searchValue, setSearchValue] = useState(step1?.title)
  const [searchTempValue, setSearchTempValue] = useState(step1?.title)
  const [errorJob, setErrorJob] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [dataJob, setDataJob] = useState([])
  const [onSearching, setOnSearching] = useState(false)
  const [onSendingRequest, setOnSendingRequest] = useState(false)

  const exclusionRef = useRef(null)

  const debouncedSearchTerm = useDebounce(searchTempValue, 300) // Adjust the delay as needed

  const itemRef = useUnfocusItem(() => {
    setShowResult(false)
  }, exclusionRef)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (event: any) => {
    setErrorJob(false)
    const value = event.target.value

    if (value?.length > 50) return

    setSearchValue(value)
    setSearchTempValue(value)
    dispatch({
      type: 'step1',
      payload: {
        title: '',
        thumb: ''
      }
    })
  }

  const handleFocusInput = () => {
    setShowResult(true)
  }

  const handleSelectItem = (item: any) => {
    const title = item?.name?.vi
    const thumb = item?.icon?.url
    const id = item?.id
    setSearchValue(title)
    setShowResult(false)
    setErrorJob(false)
    dispatch({
      type: 'step1',
      payload: {
        title,
        thumb,
        id
      }
    })
  }

  const handleNextStep = () => {
    if (step1.title === '') {
      setShowResult(false)
      setErrorJob(true)
    } else {
      setActiveStep(1)
    }
  }

  const handleReset = () => {
    setShowResult(false)
    setErrorJob(false)
    setSearchValue('')
    setSearchTempValue('')
    dispatch({
      type: 'step1',
      payload: {
        title: '',
        thumb: ''
      }
    })
    itemRef.current?.focus()
  }

  const handleSearchJob = async () => {
    try {
      const { data } = await instance.get(`/webview/industries?search=${searchValue}`)
      setDataJob(data)
    } catch (error) {
      console.log(error)
    } finally {
      setOnSearching(false)
    }
  }

  const handlePrevStep = () => {}

  const handleRequestJob = async () => {
    try {
      await instance.post('/webview/request-new-industry', {
        name: searchValue
      })

      navigate('/request-new-job')
    } catch (error) {
      console.log(error)
    }
  }

  const handleRequestNewJob = () => {
    dispatch({
      type: 'searchValue',
      payload: searchValue
    })
    if (searchValue.length <= 4) return navigate('/request-new-job')
    setOnSendingRequest(true)
  }

  useEffect(() => {
    if (debouncedSearchTerm) {
      setOnSearching(true)
    }
  }, [debouncedSearchTerm])

  useEffect(() => {
    onSendingRequest && handleRequestJob()
  }, [onSendingRequest])

  useEffect(() => {
    onSearching && handleSearchJob()
  }, [onSearching])

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-center text-2xl font-bold text-primary-black'>Bạn đang hoạt động trong lĩnh vực nào?</h1>
      <div className='flex flex-col gap-2'>
        <Input
          ref={itemRef}
          value={searchValue}
          onChange={handleChange}
          endContent={
            onSearching && (
              <CircularProgress
                classNames={{
                  svg: 'h-4 w-4 text-primary-blue'
                }}
              />
            )
          }
          variant='bordered'
          placeholder='Nhập ngành nghề của bạn'
          classNames={{
            input: 'text-primary-black placeholder:text-primary-gray',
            inputWrapper: `border-[1px] h-14 ${errorJob ? 'group-data-[focus=true]:border-primary-red border-primary-red' : 'group-data-[focus=true]:border-primary-blue'}`
          }}
          onFocus={handleFocusInput}
        />

        {showResult && dataJob.length > 0 && (
          <div className='z-20 flex max-h-[250px] flex-col gap-2 overflow-auto rounded-xl bg-white p-4 shadow-[8px_8px_16px_0px_#0000000A]'>
            {dataJob?.map((item: any) => {
              return (
                <button disabled={item?.is_added} key={item?.id} onClick={() => handleSelectItem(item)} className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='size-[48px]'>
                      <ImageFallback src={item?.icon?.url} alt='baove' height={200} width={200} className='size-full' />
                    </div>
                    <p className='text-left'>{item?.name?.vi}</p>
                  </div>
                  {item?.is_added && <Chip className='h-6 bg-primary-green text-xs text-white *:px-1.5'>Đã thêm</Chip>}
                </button>
              )
            })}
          </div>
        )}
        {errorJob && <span className='text-center text-sm text-[#FF3131]'>Xin lỗi! Nghề nghiệp của bạn chưa có ở Vua Thợ, bạn có muốn gửi yêu cầu cho chúng tôi?</span>}
      </div>
      {errorJob && (
        <div className='flex items-center justify-center gap-2'>
          <PrimaryOutlineButton className='h-12 rounded-full px-6' onClick={handleReset}>
            Chọn lại
          </PrimaryOutlineButton>
          <PrimaryButton isLoading={onSendingRequest} onPress={handleRequestNewJob} className='h-12 rounded-full px-6'>
            Gửi yêu cầu
          </PrimaryButton>
        </div>
      )}
      <BottomHanldePrevNext isHideBackButton={true} isShowResult={showResult} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} />
    </div>
  )
}

const Step2 = ({ setActiveStep }: Step) => {
  const step2 = useSelector((state: TInitState) => state.step2)

  const [activeRadio, setActiveRadio] = useState<any>(step2)
  const dispatch = useDispatch()

  const optionRefs: any = useRef([])
  const options = [
    {
      value: 0,
      label: <p className='font-bold text-primary-blue'>Thợ chính</p>,
      descripton: (
        <div className='flex flex-col gap-4'>
          <ul className='p-4 *:text-sm'>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span>Bắt buộc kiểm tra trình độ nghiệp vụ để kiểm định chất lượng</span>
            </li>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span>Có thể nhận công việc trực tiếp từ Khách hàng</span>
            </li>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span>Có thể đặt Thợ phụ để hỗ trợ cho công việc</span>
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
        <div className='flex w-full items-center justify-between'>
          <p className={`font-bold ${activeRadio === 1 ? 'text-primary-blue' : 'text-primary-black'}`}>Thợ phụ</p>
          <div className='rounded-lg bg-primary-red p-2 text-sm text-white'>Sắp ra mắt!!!</div>
        </div>
      ),
      descripton: (
        <div className='flex flex-col gap-4'>
          <ul className='p-4 *:text-sm'>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span>Chỉ thể nhận công việc từ Thợ chính</span>
            </li>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span>Không yêu cầu kiểm tra trình độ nghiệp vụ</span>
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
    dispatch({ type: 'step2', payload: activeRadio })

    if (activeRadio === 1) {
      // redirect to step2End
      return setActiveStep(3)
    }
    setActiveStep((prev: any) => {
      return prev + 1
    })
  }
  const handlePrevStep = () => {
    setActiveStep((prev: any) => {
      return prev - 1
    })
  }

  useEffect(() => {
    if (optionRefs?.current?.[activeRadio]) {
      optionRefs?.current?.[activeRadio].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeRadio])

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-center text-2xl font-bold text-primary-black'>Bạn muốn đăng ký làm thợ chính hay thợ phụ?</h1>
      <RadioGroup value={activeRadio?.toString()}>
        {options.map((item, index) => (
          <div
            ref={(el) => (optionRefs.current[index] = el)}
            onClick={() => {
              setActiveRadio(item.value)
            }}
            key={item.value}
            className={`flex flex-col overflow-hidden rounded-xl border-1 ${item.value === activeRadio ? 'border-primary-blue bg-primary-light-blue' : 'border-transparent bg-primary-light-gray opacity-60'}`}
          >
            <Radio
              classNames={{
                base: 'w-full right-0 m-0 pt-4 px-4 pb-0',
                label: 'w-full',
                labelWrapper: 'w-full flex-row'
              }}
              style={{
                maxWidth: '100%',
                width: '100%'
              }}
              value={item.value.toString()}
              onClick={() => {
                setActiveRadio(item.value)
              }}
            >
              {item.label}
            </Radio>
            {item.descripton}
          </div>
        ))}
      </RadioGroup>
      <BottomHanldePrevNext isDisableNextButton={activeRadio === null} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} />
    </div>
  )
}

const Step2End = () => {
  const [isLoading, setIsLoading] = useState(false)
  const handleCloseWebView = () => {
    setIsLoading(true)
    window.postMessage('canPop')
  }

  return (
    <div className='flex h-[calc(100dvh-120px)] items-center justify-center'>
      <div className='flex flex-col gap-4'>
        <div className='mx-auto'>
          <div className='size-[200px]'>
            <ImageFallback src='/step2End.png' alt='step2End' height={400} width={400} className='size-full' />
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='px-4 text-center text-2xl font-bold'>Cám ơn bạn đã lựa chọn Vua Thợ</p>
          <p className='text-center'>Chúng tôi sẽ thông báo cho bạn biết khi tính năng mới “Thợ phụ” ra mắt.</p>
        </div>
      </div>
      <div className='fixed bottom-0 left-0 right-0 p-4 pb-6'>
        <Button isLoading={isLoading} onPress={handleCloseWebView} className='h-12 w-full rounded-full bg-primary-blue text-base text-white'>
          Đã hiểu
        </Button>
      </div>
    </div>
  )
}
const Step3 = ({ setActiveStep }: Step) => {
  const navigate = useNavigate()
  const step1 = useSelector((state: TInitState) => state.step1)
  const lang = useSelector((state: TInitState) => state.lang.lang)

  const [onFetchingTest, setOnFetchingTest] = useState(false)
  const [onFetchingDetail, setOnFetchingDetail] = useState(false)

  const [dataTesting, setDataTesting] = useState<any>({})

  const dispatch = useDispatch()

  const handleNextStep = () => {
    setOnFetchingTest(true)
  }

  const handlePrevStep = () => {
    setActiveStep((prev: any) => {
      return prev - 1
    })
  }
  const handleFetchingTest = async () => {
    try {
      const { data }: any = await instance.post('/webview/request-skill-test', {
        industry_id: step1.id
      })
      setDataTesting(data)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetchingTest(false)
    }
  }

  const handleGetQuestionAndAnswerDetail = async () => {
    try {
      const { data }: any = await instance.get(`/webview/skill-tests/${dataTesting?.id}`)
      dispatch({
        type: 'testDetail',
        payload: data
      })

      dispatch({
        type: 'isStartAgain',
        payload: data?.status == status.failed
      })

      navigate(handleAddLangInUrl({ mainUrl: '/testing', lang }))

      //if failed
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetchingDetail(false)
    }
  }
  useEffect(() => {
    onFetchingTest && handleFetchingTest()
  }, [onFetchingTest])

  useEffect(() => {
    onFetchingDetail && handleGetQuestionAndAnswerDetail()
  }, [onFetchingDetail])

  useEffect(() => {
    if (!dataTesting?.id) return
    setOnFetchingDetail(true)
  }, [dataTesting])

  return (
    <div className='flex flex-col gap-4'>
      <div className='mx-auto'>
        <div className='size-[200px]'>
          <ImageFallback src={step1?.thumb} alt={step1?.thumb} height={400} width={400} className='size-full' />
        </div>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <p className='text-center text-2xl font-bold text-primary-blue'>{capitalizeWords(step1?.title)}</p>
        <p className='text-base-black text-center text-sm'>
          Đối với thợ chính, bạn cần phải làm bài kiểm tra kĩ năng trước khi bắt đầu làm việc, để đảm bảo cho khách hàng có trải nghiệm tốt và gia tăng cơ hội việc làm cho bạn.
        </p>
      </div>
      <BottomHanldePrevNext handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} isNextLoading={onFetchingTest} />
    </div>
  )
}

type PropsBottomHandlePrevNext = { handlePrevStep: () => void; handleNextStep: () => void; isDisableNextButton?: boolean; isShowResult?: boolean; isNextLoading?: boolean; isHideBackButton?: boolean }
const BottomHanldePrevNext = ({ handlePrevStep, handleNextStep, isDisableNextButton = false, isShowResult, isNextLoading, isHideBackButton }: PropsBottomHandlePrevNext) => {
  const [bottomPadding, setBottomPadding] = useState(70)

  // const step1 = useSelector((state: TInitState) => state.step1)
  const isStep1 = isShowResult
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        setBottomPadding(window.innerHeight - window.visualViewport.height)
      } else {
        setBottomPadding(70)
      }
    }
    const visualViewport = window.visualViewport
    if (visualViewport) {
      visualViewport.addEventListener('resize', handleResize)
      handleResize()

      return () => {
        visualViewport.removeEventListener('resize', handleResize)
      }
    } else {
      window.addEventListener('resize', handleResize)
      handleResize()

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return (
    <div
      className={`${isHideBackButton ? 'p-4' : 'px-8 py-4'} fixed bottom-0 left-0 z-50 flex w-full items-center gap-4 bg-white transition`}
      style={{ transform: isStep1 ? `translateY(-${bottomPadding}px)` : '' }}
    >
      {!isHideBackButton && (
        <PrimaryOutlineButton className={`h-12 w-full rounded-full`} onClick={handlePrevStep}>
          Quay lại
        </PrimaryOutlineButton>
      )}
      <PrimaryButton isLoading={isNextLoading} isDisabled={isDisableNextButton} className='h-12 w-full rounded-full' onClick={handleNextStep}>
        Tiếp tục
      </PrimaryButton>
    </div>
  )
}
