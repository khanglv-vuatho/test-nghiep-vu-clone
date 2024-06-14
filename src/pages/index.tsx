import { PrimaryButton, PrimaryOutlineButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import DefaultLayout from '@/layouts/default'
import { Button, Chip, CircularProgress, Input, Radio, RadioGroup } from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import { capitalizeWords, handleAddLangInUrl, useDebounce, useUnfocusItem } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { TInitState } from '@/store'
import instance from '@/services/axiosConfig'

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
      <div className={`h-full px-6 ${activeStep < 3 ? 'p-4 pb-2' : ''}`}>{steps[activeStep]}</div>
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

  const dispatch = useDispatch()
  const exclusionRef = useRef(null)

  const debouncedSearchTerm = useDebounce(searchTempValue, 300) // Adjust the delay as needed

  const itemRef = useUnfocusItem(() => {
    setShowResult(false)
  }, exclusionRef)

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
    console.log({ item })
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

  useEffect(() => {
    onSearching && handleSearchJob()
  }, [onSearching])

  const handlePrevStep = () => {}

  useEffect(() => {
    if (debouncedSearchTerm) {
      setOnSearching(true)
    }
  }, [debouncedSearchTerm])

  const token = useSelector((state: TInitState) => state.token)

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-center text-2xl font-bold text-primary-black'>Bạn đang hoạt động trong lĩnh vực nào?</h1>
      <p className='text-green-200'>{token}</p>
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
          placeholder='Trả lời...'
          classNames={{
            input: 'text-primary-black placeholder:text-primary-gray',
            inputWrapper: `border-[1px] h-14 ${errorJob ? 'group-data-[focus=true]:border-primary-red border-primary-red' : 'group-data-[focus=true]:border-primary-blue'}`
          }}
          onFocus={handleFocusInput}
        />

        {showResult && dataJob.length > 0 && (
          <div className='z-20 flex max-h-[250px] flex-col gap-2 overflow-auto rounded-xl bg-white p-4 shadow-[8px_8px_16px_0px_#0000000A]'>
            {dataJob?.map((item: any) => {
              // is_added
              return (
                <button disabled={item?.is_added} key={item?.id} onClick={() => handleSelectItem(item)} className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='size-[48px]'>
                      <ImageFallback src={item?.icon?.url} alt='baove' height={200} width={200} className='size-full' />
                    </div>
                    <p>{item?.name?.vi}</p>
                  </div>
                  {item?.is_added && <Chip className='h-6 bg-primary-green text-[8px] text-white *:px-1.5'>Đã thêm</Chip>}
                </button>
              )
            })}
          </div>
        )}
        {errorJob && <span className='text-center text-sm text-[#FF3131]'>Xin lỗi! Nghề nghiệp của bạn chưa có ở Vua Thợ, bạn có muốn gửi yêu cầu cho chúng tôi?</span>}
      </div>
      {errorJob && (
        <div className='flex items-center justify-center gap-2'>
          <PrimaryOutlineButton className='h-10 w-fit rounded-full px-6' onClick={handleReset}>
            Chọn lại
          </PrimaryOutlineButton>
          <PrimaryButton className='h-10 w-fit rounded-full px-6'>Gửi yêu cầu</PrimaryButton>
        </div>
      )}
      <BottomHanldePrevNext isShowResult={showResult} isDisableNextButton={step1.title === ''} IS_FINAL_STEP={false} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} />
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
          <ul className='ml-1.5 p-4'>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span>Có nhiều kinh nghiệm, đã thành thạo các kỹ năng chuyên môn.</span>
            </li>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span>Có khả năng thực hiện các công việc phức tạp, độc lập hoàn thành nhiệm vụ.</span>
            </li>
            <li className=''>
              <span className='text-2xl leading-none'>• </span>
              <span className='text-primary-green'>Có quyền tìm thêm thợ phụ để trợ giúp cho công việc cần nhiều người.</span>
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
          <div className='rounded-lg bg-primary-yellow p-2 text-sm text-white'>Sắp ra mắt!!!</div>
        </div>
      ),
      descripton: (
        <div className='flex flex-col gap-4'>
          <ul className='ml-1.5 p-4'>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span>Ít kinh nghiệm, đang trong giai đoạn học nghề hoặc mới vào nghề.</span>
            </li>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span> Thực hiện các công việc đơn giản, hỗ trợ thợ chính.</span>
            </li>
            <li>
              <span className='text-2xl leading-none'>• </span>
              <span className='text-primary-green'>Có thể nhận lời mời từ thợ chính nhưng không thể tự chủ động tìm kiếm công việc.</span>
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
      <BottomHanldePrevNext isDisableNextButton={activeRadio === null} IS_FINAL_STEP={false} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} />
    </div>
  )
}

const Step2End = () => {
  return (
    <div className='flex h-[calc(100dvh-100px)] items-center justify-center'>
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
        <Button className='h-12 w-full rounded-full bg-primary-blue text-base text-white'>Đã hiểu</Button>
      </div>
    </div>
  )
}
const Step3 = ({ setActiveStep }: Step) => {
  const navigate = useNavigate()
  const step1 = useSelector((state: TInitState) => state.step1)
  const lang = useSelector((state: TInitState) => state.lang.lang)

  const handleNextStep = () => {
    navigate(handleAddLangInUrl({ mainUrl: '/testing', lang }))
  }

  const handlePrevStep = () => {
    setActiveStep((prev: any) => {
      return prev - 1
    })
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='mx-auto'>
        <div className='size-[200px]'>
          <ImageFallback src='step3.png' alt='step-3' height={400} width={400} className='size-full' />
        </div>
      </div>
      <div className='flex flex-col items-center gap-2'>
        <p>Chỉ còn một bước cuối để trở thành thợ</p>
        <p className='text-2xl font-bold text-primary-blue'>{capitalizeWords(step1?.title)}</p>
        <p className='text-base-black text-center text-sm'>
          Đối với thợ chính, bạn cần phải làm bài kiểm tra kĩ năng trước khi bắt đầu làm việc, để đảm bảo cho khách hàng có trải nghiệm tốt và gia tăng cơ hội việc làm cho bạn.
        </p>
      </div>
      <BottomHanldePrevNext IS_FINAL_STEP={true} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} />
    </div>
  )
}

type PropsBottomHandlePrevNext = { handlePrevStep: () => void; handleNextStep: () => void; IS_FINAL_STEP: boolean; isDisableNextButton?: boolean; isShowResult?: boolean }
const BottomHanldePrevNext = ({ handlePrevStep, handleNextStep, IS_FINAL_STEP, isDisableNextButton = false, isShowResult }: PropsBottomHandlePrevNext) => {
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
    <div className='fixed bottom-0 left-0 z-50 grid w-full grid-cols-2 items-center gap-4 bg-white px-8 py-4 transition' style={{ transform: isStep1 ? `translateY(-${bottomPadding}px)` : '' }}>
      <PrimaryOutlineButton className='h-11 rounded-full' onClick={handlePrevStep}>
        Quay lại
      </PrimaryOutlineButton>
      <PrimaryButton isDisabled={isDisableNextButton} className='h-11 rounded-full' onClick={handleNextStep}>
        {IS_FINAL_STEP ? 'Hoàn thành' : 'Tiếp tục'}
      </PrimaryButton>
    </div>
  )
}
