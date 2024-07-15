import BottomhandlePrevNext from '@/components/BottomhandlePrevNext'
import ImageFallback from '@/components/ImageFallback'
import { status } from '@/constants'
import { translate } from '@/context/translationProvider'
import instance from '@/services/axiosConfig'
import { TInitState, ActionTypes } from '@/store'
import { handleAddLangInUrl, capitalizeWords } from '@/utils'
import { useState, useEffect, memo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Step3 = () => {
  const s = translate('Home.Step3')

  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search)

  const step1 = useSelector((state: TInitState) => state.step1)
  const lang = queryParams?.get('lang') || 'vi'
  const dispatch = useDispatch()
  const currentStep = useSelector((state: TInitState) => state.currentStep)

  let token
  if (import.meta.env.MODE === 'development') {
    token = queryParams?.get('token') || ''
  } else {
    token = useSelector((state: TInitState) => state.token)
  }

  const [onFetchingTest, setOnFetchingTest] = useState(false)
  const [onFetchingDetail, setOnFetchingDetail] = useState(false)

  const [dataTesting, setDataTesting] = useState<any>({})

  const handleNextStep = useCallback(() => {
    setOnFetchingTest(true)
  }, [])

  const handlePrevStep = useCallback(() => {
    dispatch({
      type: ActionTypes.CURRENT_STEP,
      payload: currentStep - 1
    })
  }, [])

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
        type: ActionTypes.TEST_DETAIL,
        payload: data
      })

      dispatch({
        type: ActionTypes.IS_START_AGAIN,
        payload: data?.status == status.failed
      })

      dispatch({
        type: ActionTypes.DIRECTION,
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
      <div className='flex h-full flex-col gap-4'>
        <div className='mx-auto'>
          <div className='size-[200px]'>
            <ImageFallback src={step1?.thumb} alt={step1?.thumb} height={400} width={400} className='size-full' />
          </div>
        </div>
        <div className='flex flex-col items-center gap-2'>
          <p className='text-center text-2xl font-bold text-primary-blue'>{capitalizeWords(step1?.title)}</p>
          <p className='text-base-black text-center text-base'>{s?.text1}</p>
        </div>
      </div>
      <BottomhandlePrevNext handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} isNextLoading={onFetchingTest} />
    </div>
  )
}

export default memo(Step3)
