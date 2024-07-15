import { Button, Progress, Skeleton } from '@nextui-org/react'
import { Clock, DocumentText1, Gift, MessageQuestion } from 'iconsax-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { PrimaryButton, PrimaryLightButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import { keyPossmessage, status } from '@/constants'
import { translate } from '@/context/translationProvider'
import DefaultLayout from '@/layouts/default'
import instance from '@/services/axiosConfig'
import { ActionTypes, TInitState } from '@/store'
import { Test } from '@/types'
import { converTimeMinutes, handleAddLangInUrl, postMessageCustom } from '@/utils'
import CanRetake from './CanRetake'
import Questions from './Questions'

export default function TestingPage() {
  const t = translate('Testing')

  const step1 = useSelector((state: TInitState) => state.step1)
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

  const IS_AFTER_CURRENT_TIME = targetTime.isBefore(currentTime)

  const queryParams = new URLSearchParams(location.search)
  const IS_TEST_FAILED = statusTest == status.failed
  const lang = queryParams?.get('lang') || 'vi'
  const token = queryParams?.get('token') || ''

  const navigate = useNavigate()
  const dispatch = useDispatch()

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
        type: ActionTypes.IS_START_AGAIN,
        payload: data?.status == status.failed
      })

      setIsReady(data?.status !== status.pending)
    } catch (error) {
      console.log(error)
    } finally {
      setOnFetchingDetail(false)
    }
  }
  const handleGetListQuestions = async () => {
    try {
      const { data }: any = await instance.post(`/webview/skill-tests/${dataTesting?.id}/${IS_TEST_FAILED ? 'again' : 'start'}`)

      setListQuestions(data?.topic?.questions)
      setMeta(data?.meta)
      dispatch({
        type: ActionTypes.IS_START_AGAIN,
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
      navigate(handleAddLangInUrl({ mainUrl: '/', lang, token }))
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

    if (dataTestingTopic?.status === status.doing) {
      handleStart()
    }

    if (dataTestingTopic?.status === status.pending) {
      const interval = setInterval(() => {
        checkStatusAndRefetch()
        setIsReady(false)
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
        <CanRetake testDetail={testDetail} IS_AFTER_CURRENT_TIME={IS_AFTER_CURRENT_TIME} />
      ) : (
        <div className='flex flex-col gap-4 p-4'>
          <div className='flex flex-col items-center'>
            <div className='w-[200px]'>
              <ImageFallback src='/robot.png' alt='hero' height={400} width={400} className='size-full' />
            </div>
            {!isReady && (
              <div className='flex flex-col gap-2'>
                <p className='text-primary-blue'>{t?.text4}...</p>
                <Progress size='md' isIndeterminate aria-label='Loading...' className='max-w-md' />
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <h1 className='text-center text-2xl font-semibold text-primary-blue'>
              {t?.text5} {dataTestingTopic?.topic?.title}
            </h1>
            {!isReady ? (
              <div className='flex items-center justify-center gap-2'>
                <Skeleton className='h-12 w-[100px] rounded-lg' />
                <Skeleton className='h-12 w-[100px] rounded-lg' />
              </div>
            ) : (
              <div className='flex items-center justify-center gap-2'>
                <PrimaryLightButton disableRipple startContent={<DocumentText1 />}>
                  {dataTestingTopic?.topic?.questions_length} {t?.text6}
                </PrimaryLightButton>
                <PrimaryLightButton disableRipple disableAnimation startContent={<Clock />}>
                  {converTimeMinutes(dataTestingTopic?.topic?.time)} {t?.text7}
                </PrimaryLightButton>
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2 rounded-lg bg-primary-light-gray p-4'>
            <div className='flex items-center gap-2 font-semibold text-primary-blue'>
              <span>
                <Gift />
              </span>
              <p>{t?.text8}</p>
            </div>
            <ul className='list-inside list-disc pl-2'>
              <li>{t?.text9}</li>
              <li>{t?.text10}</li>
              <li>{t?.text11}</li>
            </ul>
          </div>
          <div className='flex flex-col gap-2 rounded-lg bg-primary-light-gray p-4'>
            <div className='flex items-center gap-2 font-semibold text-primary-blue'>
              <span>
                <MessageQuestion />
              </span>
              <p>{t?.text12}</p>
            </div>
            <ul className='list-inside list-disc pl-2'>
              <li>{t?.text13}</li>
              <li>{t?.text14}</li>
              <li>{t?.text15}</li>
              <li>{t?.text16}</li>
              <li>{t?.text17}</li>
            </ul>
          </div>
        </div>
      )}
      <div className='sticky bottom-0 min-h-[84px] w-full bg-white p-4'>
        {testDetail?.meta?.can_retake ? (
          <div className='flex flex-col gap-2'>
            <PrimaryButton isDisabled={!IS_AFTER_CURRENT_TIME} onClick={handleStart} className='h-11 w-full rounded-full'>
              {t?.text18}
            </PrimaryButton>
            <Button onClick={() => postMessageCustom({ message: keyPossmessage.CAN_POP })} className='h-11 w-full rounded-full bg-transparent text-[#A6A6A6]'>
              {t?.text19}
            </Button>
          </div>
        ) : (
          <PrimaryButton isDisabled={!isReady} isLoading={onFetchingAnswer} onClick={handleStart} className='h-12 w-full rounded-full'>
            {isStartAgain ? t?.text20 : t?.text21}
          </PrimaryButton>
        )}
      </div>
    </DefaultLayout>
  )
}
