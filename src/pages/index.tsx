import { Button, Chip, CircularProgress, Image, Input } from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import BottomhandlePrevNext from '@/components/BottomhandlePrevNext'
import { PrimaryButton, PrimaryOutlineButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import { RadioSelectRole } from '@/components/RadioGroupCustom'
import ToastComponent from '@/components/ToastComponent'
import { keyPossmessage, status } from '@/constants'
import { translate } from '@/context/translationProvider'
import DefaultLayout from '@/layouts/default'
import instance from '@/services/axiosConfig'
import { TInitState } from '@/store'
import { capitalizeWords, handleAddLangInUrl, postMessageCustom, useDebounce, useUnfocusItem } from '@/utils'
import { ArrowLeft2 } from 'iconsax-react'

type Step = {
  setActiveStep: any
}

export default function Home() {
  const t = translate('Home.Step1')

  const [activeStep, setActiveStep] = useState(0)

  const steps = [<Step1 setActiveStep={setActiveStep} />, <Step2 setActiveStep={setActiveStep} />, <Step3 setActiveStep={setActiveStep} />, <Step2End />]

  const isNotStep2End = activeStep < 3
  const isStep1 = activeStep === 0
  const isStep2 = activeStep === 1
  const isStep3 = activeStep === 2

  const handleCloseWebview = () => {
    postMessageCustom({ message: keyPossmessage.CAN_POP })
  }

  useEffect(() => {
    if (isStep1 || isStep3) {
      window.scrollTo(0, 0)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [activeStep])

  return (
    <DefaultLayout>
      <div className='sticky left-0 right-0 top-0 z-50 flex w-full flex-col gap-4 bg-white'>
        <Button disableRipple startContent={<ArrowLeft2 />} onPress={handleCloseWebview} className='h-14 justify-start rounded-none bg-transparent px-4 text-base font-bold text-primary-black'>
          {t?.text9}
        </Button>
      </div>
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
      <div className={`px-6 ${isStep2 ? '' : 'h-full'} ${isNotStep2End ? '' : 'p-4 pb-2'}`}>{steps[activeStep]}</div>
    </DefaultLayout>
  )
}

const Step1 = ({ setActiveStep }: Step) => {
  const s = translate('Home.Step1')

  const step1 = useSelector((state: TInitState) => state.step1)
  const queryParams = new URLSearchParams(location.search)

  const lang = queryParams?.get('lang') || 'vi'
  const token = queryParams?.get('token') || ''

  const [searchValue, setSearchValue] = useState(step1?.title)
  const [searchTempValue, setSearchTempValue] = useState(step1?.title)
  const [errorJob, setErrorJob] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [dataJob, setDataJob] = useState([])
  const [onSearching, setOnSearching] = useState(false)
  const [onSendingRequest, setOnSendingRequest] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTempValue, 300) // Adjust the delay as needed

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const itemRef: any = useRef(null)

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
    if (item?.is_added) {
      ToastComponent({
        message: s?.text1,
        type: 'error'
      })
      return
    }

    const title = item?.name?.[lang]
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
    if (searchValue.trim() === '') return

    if (step1.title.trim() === '') {
      setShowResult(false)
      setErrorJob(true)
    } else {
      setActiveStep(1)
    }
  }
  //
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

    itemRef?.current?.focus()
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

      return navigate(handleAddLangInUrl({ mainUrl: '/request-new-job', lang, token }))
      // khang
    } catch (error) {
      console.log(error)
    } finally {
      setOnSendingRequest(false)
    }
  }

  const handleRequestNewJob = () => {
    if (searchValue.trim() === '') return

    dispatch({
      type: 'searchValue',
      payload: searchValue
    })
    // khang

    if (searchValue.length <= 4) return navigate(handleAddLangInUrl({ mainUrl: '/request-new-job', lang, token }))

    setOnSendingRequest(true)
  }

  const shoudleRenderResult = () => {
    return onSearching ? (
      <div className='flex w-full justify-center'>
        <CircularProgress
          classNames={{
            svg: 'h-8 w-8 text-primary-blue'
          }}
        />
      </div>
    ) : (
      <p className='text-center'>{s?.text2}</p>
    )
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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        itemRef?.current?.blur()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <div className='flex max-h-dvh flex-col justify-between'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-center text-xl font-bold text-primary-black'>{s?.text3}</h1>
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
            placeholder={s?.text4}
            classNames={{
              input: 'text-primary-black placeholder:text-primary-gray',
              inputWrapper: `border-[1px] h-14 ${errorJob ? 'group-data-[focus=true]:border-primary-red border-primary-red' : 'group-data-[focus=true]:border-primary-blue'}`
            }}
            onFocus={handleFocusInput}
          />
          {searchValue?.length > 0 && showResult && (
            <div className='z-20 flex max-h-[250px] flex-col gap-2 overflow-auto rounded-xl bg-white p-4 shadow-[8px_8px_16px_0px_#0000000A]'>
              {dataJob?.length > 0
                ? dataJob?.map((item: any) => {
                    return (
                      <button key={item?.id} onClick={() => handleSelectItem(item)} className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <div className='size-[48px] rounded-full bg-neutral-50'>
                            <ImageFallback src={item?.icon?.url} alt='baove' height={200} width={200} className='size-full' />{' '}
                          </div>
                          <div className='flex flex-col gap-1'>
                            <p className='text-left'>{item?.name?.[lang]}</p>
                            <div dangerouslySetInnerHTML={{ __html: item?.description?.[lang] }} />
                          </div>
                        </div>
                        {item?.is_added && <Chip className='h-6 bg-primary-green text-xs text-white *:px-1.5'>{s?.text5}</Chip>}
                      </button>
                    )
                  })
                : shoudleRenderResult()}
            </div>
          )}
          {errorJob && <span className='text-center text-sm text-[#FF3131]'>{s?.text6}</span>}
        </div>
        {errorJob && (
          <div className='flex items-center justify-center gap-2'>
            <PrimaryOutlineButton className='h-12 rounded-full px-6' onPress={handleReset}>
              {s?.text7}
            </PrimaryOutlineButton>
            <PrimaryButton isLoading={onSendingRequest} onPress={handleRequestNewJob} className='h-12 rounded-full px-6'>
              {s?.text8}
            </PrimaryButton>
          </div>
        )}
      </div>
      <BottomhandlePrevNext isHideBackButton={true} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} />
    </div>
  )
}

const Step2 = ({ setActiveStep }: Step) => {
  const s = translate('Home.Step2')

  const step2 = useSelector((state: TInitState) => state.step2)

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
    <div>
      <div className='flex flex-col gap-4'>
        <h1 className='text-center text-xl font-bold text-primary-black'>{s?.text9}</h1>
        <RadioSelectRole options={options} activeRadio={activeRadio} setActiveRadio={setActiveRadio} />
      </div>
      <BottomhandlePrevNext isDisableNextButton={activeRadio === null} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} />
    </div>
  )
}

const Step2End = () => {
  const s = translate('Home.Step2')
  const [isLoading, setIsLoading] = useState(false)
  const handleCloseWebView = () => {
    setIsLoading(true)
    postMessageCustom({ message: keyPossmessage.CAN_POP })
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
          <p className='px-4 text-center text-2xl font-bold'>{s?.text10}</p>
          <p className='text-center'>{s?.text11}</p>
        </div>
      </div>
      <div className='fixed bottom-0 left-0 right-0 p-4 pb-6'>
        <Button isLoading={isLoading} onPress={handleCloseWebView} className='h-12 w-full rounded-full bg-primary-blue text-base text-white'>
          {s?.text12}
        </Button>
      </div>
    </div>
  )
}
const Step3 = ({ setActiveStep }: Step) => {
  const s = translate('Home.Step3')

  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search)

  const step1 = useSelector((state: TInitState) => state.step1)
  const lang = queryParams?.get('lang') || 'vi'
  const dispatch = useDispatch()

  let token
  if (import.meta.env.MODE === 'development') {
    token = queryParams?.get('token') || ''
  } else {
    token = useSelector((state: TInitState) => state.token)
  }

  const [onFetchingTest, setOnFetchingTest] = useState(false)
  const [onFetchingDetail, setOnFetchingDetail] = useState(false)

  const [dataTesting, setDataTesting] = useState<any>({})

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

      dispatch({
        type: 'direction',
        payload: 'left'
      })

      navigate(handleAddLangInUrl({ mainUrl: '/testing', lang, token }))

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
    <div className='flex h-full flex-col justify-between'>
      <div className='flex flex-col gap-4'>
        <div className='mx-auto'>
          <div className='size-[200px]'>
            <ImageFallback src={step1?.thumb} alt={step1?.thumb} height={400} width={400} className='size-full' />
          </div>
        </div>
        <div className='flex flex-col items-center gap-2'>
          <p className='text-center text-2xl font-bold text-primary-blue'>{capitalizeWords(step1?.title)}</p>
          <p className='text-base-black text-center text-sm'>{s?.text1}</p>
        </div>
      </div>
      <BottomhandlePrevNext handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} isNextLoading={onFetchingTest} />
    </div>
  )
}
