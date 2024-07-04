import { Chip, CircularProgress, Input } from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import BottomhandlePrevNext from '@/components/BottomhandlePrevNext'
import { PrimaryButton, PrimaryOutlineButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import ToastComponent from '@/components/ToastComponent'
import { translate } from '@/context/translationProvider'
import instance from '@/services/axiosConfig'
import { ActionTypes, TInitState } from '@/store'
import { handleAddLangInUrl, useDebounce } from '@/utils'

const Step1 = () => {
  const s = translate('Home.Step1')

  const sendRef = useRef<HTMLDivElement | null>(null)

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
      type: ActionTypes.STEP1,
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
      type: ActionTypes.STEP1,
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
      if (dataJob?.length === 0) {
        setShowResult(false)
        setErrorJob(true)
      } else {
        setShowResult(true)
      }
    } else {
      dispatch({
        type: ActionTypes.CURRENT_STEP,
        payload: 1
      })
    }
  }
  //
  const handleReset = () => {
    setShowResult(false)
    setErrorJob(false)
    setSearchValue('')
    setSearchTempValue('')
    dispatch({
      type: ActionTypes.STEP1,
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
      type: ActionTypes.SEARCH_VALUE,
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
  useEffect(() => {
    // const inputEl: any = inputRef?.current
    const sendEl = sendRef.current

    // if (!inputEl) returnx
    if (!sendEl) return

    const handleClick = (e: any) => {
      if (!sendEl.contains(e.relatedTarget)) {
        alert('123')
        // inputRef?.current?.blur()
      } else {
        // inputEl?.focus()
        alert('456')
      }
    }

    document?.addEventListener('onClick', handleClick)

    return () => {
      document?.removeEventListener('onClick', handleClick)
    }
  }, [sendRef])

  return (
    <div className='flex h-full flex-col justify-between'>
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
            <div className='z-20 flex max-h-[calc(100dvh-300px)] flex-col gap-2 overflow-auto rounded-xl bg-white p-4 shadow-[8px_8px_16px_0px_#0000000A]'>
              {dataJob?.length > 0
                ? dataJob?.map((item: any) => {
                    return (
                      <button key={item?.id} onClick={() => handleSelectItem(item)} className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <div className='size-[48px] flex-shrink-0 rounded-full bg-neutral-50'>
                            <ImageFallback src={item?.icon?.url} alt='baove' height={200} width={200} className='size-full' />{' '}
                          </div>
                          <div className='flex flex-col gap-1'>
                            <div className='flex items-center gap-2'>
                              <p className='text-left text-sm font-bold'>{item?.name?.[lang]}</p>
                              {item?.is_added && <Chip className='h-5 bg-primary-green text-[10px] text-white *:px-0.5'>{s?.text5}</Chip>}
                            </div>
                            <div className='line-clamp-2 text-left text-xs text-primary-gray' dangerouslySetInnerHTML={{ __html: item?.description }} />
                          </div>
                        </div>
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
      <div ref={sendRef}>
        <BottomhandlePrevNext isHideBackButton={true} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} className='z-[100]' />
      </div>
    </div>
  )
}

export default Step1
