import { CircularProgress, Input } from '@nextui-org/react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import instance from '@/services/axiosConfig'
import { translate } from '@/context/translationProvider'
import { ActionTypes, TInitState } from '@/store'
import { JobType } from '@/types'
import { handleAddLangInUrl, useDebounce } from '@/utils'
import _ from 'lodash'

import ToastComponent from '@/components/ToastComponent'
import BottomhandlePrevNext from '@/components/BottomhandlePrevNext'
import { PrimaryButton, PrimaryOutlineButton } from '@/components/Buttons'
import SearchResult from './SearchResult'

const Step1 = () => {
  const s = translate('Home.Step1')

  const step1 = useSelector((state: TInitState) => state.step1)
  const queryParams = new URLSearchParams(location.search)

  const lang = queryParams?.get('lang') || 'vi'
  const token = queryParams?.get('token') || ''

  const [searchValue, setSearchValue] = useState(step1?.title)
  const [searchTempValue, setSearchTempValue] = useState(step1?.title)
  const [errorJob, setErrorJob] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [dataJob, setDataJob] = useState<JobType[]>([])
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

  const handleSelectItem = useCallback((item: any) => {
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
  }, [])

  const handleNextStep = useCallback(() => {
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
  }, [step1])

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

  const handlePrevStep = useCallback(() => {}, [])

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
    if (searchValue.length <= 4) return navigate(handleAddLangInUrl({ mainUrl: '/request-new-job', lang, token }))

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

  const [state1, setState1] = useState(1)
  const [state2, setState2] = useState(1)

  const div1Ref = useRef(null)
  const div2Ref = useRef(null)

  useEffect(() => {
    let requestId1: any = null
    let requestId2: any = null

    const handleTouchStart1 = () => {
      if (!requestId1) {
        requestId1 = requestAnimationFrame(() => {
          setState1((prev) => prev + 1)
          requestId1 = null
        })
      }
    }

    const handleTouchEnd1 = () => {
      if (requestId1) {
        cancelAnimationFrame(requestId1)
        requestId1 = null
      }
    }

    const handleTouchStart2 = () => {
      if (!requestId2) {
        requestId2 = requestAnimationFrame(() => {
          setState2((prev) => prev + 1)
          requestId2 = null
        })
      }
    }

    const handleTouchEnd2 = () => {
      if (requestId2) {
        cancelAnimationFrame(requestId2)
        requestId2 = null
      }
    }

    const div1: any = div1Ref.current
    const div2: any = div2Ref.current

    div1.addEventListener('touchstart', handleTouchStart1)
    div1.addEventListener('touchend', handleTouchEnd1)
    div2.addEventListener('touchstart', handleTouchStart2)
    div2.addEventListener('touchend', handleTouchEnd2)

    // Cleanup event listeners on component unmount
    return () => {
      div1.removeEventListener('touchstart', handleTouchStart1)
      div1.removeEventListener('touchend', handleTouchEnd1)
      div2.removeEventListener('touchstart', handleTouchStart2)
      div2.removeEventListener('touchend', handleTouchEnd2)
    }
  }, [])
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
          {searchValue?.length > 0 && showResult && <SearchResult dataJob={dataJob} handleSelectItem={handleSelectItem} onSearching={onSearching} />}
          {errorJob && <span className='text-center text-base text-[#FF3131]'>{s?.text6}</span>}
        </div>
        {errorJob && (
          <div className='flex items-center justify-center gap-2'>
            <PrimaryOutlineButton className='h-12 rounded-full px-6' onClick={handleReset}>
              {s?.text7}
            </PrimaryOutlineButton>
            <PrimaryButton isLoading={onSendingRequest} onClick={handleRequestNewJob} className='h-12 rounded-full px-6'>
              {s?.text8}
            </PrimaryButton>
          </div>
        )}
      </div>
      <div className='items-cenrter flex gap-2'>
        <div
          style={{
            touchAction: 'manipulation'
          }}
          ref={div1Ref}
          className='h-12 w-full bg-blue-200 transition-none duration-0'
        >
          das{state1}
        </div>
        <div
          style={{
            touchAction: 'manipulation'
          }}
          ref={div2Ref}
          className='h-12 w-full bg-red-200 transition-none duration-0'
        >
          111123{state2}
        </div>
      </div>
      <BottomhandlePrevNext isHideBackButton={true} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} className='z-[100]' />
    </div>
  )
}
export default memo(Step1)
