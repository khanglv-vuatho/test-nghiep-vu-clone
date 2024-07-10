import { PrimaryButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import { keyPossmessage, statusKyc } from '@/constants'
import { translate } from '@/context/translationProvider'
import { ActionTypes, TInitState } from '@/store'
import { handleAddLangInUrl, postMessageCustom } from '@/utils'
import { Button } from '@nextui-org/react'
import { memo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Step2End = () => {
  const s = translate('Home.Step2')
  const r = translate('Result')
  const t = translate('Testing')
  const kyc_status = useSelector((state: any) => state.kyc_status.kyc_status)
  const queryParams = new URLSearchParams(location.search)

  const token = queryParams?.get('token') || ''
  const lang = queryParams?.get('lang') || 'vi'
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const IS_KYC_STATUS_APPROVED = kyc_status == statusKyc?.APPROVED
  const IS_KYC_STATUS_PENDING = kyc_status == statusKyc?.PENDING

  console.log(kyc_status)

  const [isLoading, setIsLoading] = useState(false)
  const handleCloseWebView = () => {
    setIsLoading(true)
    postMessageCustom({ message: keyPossmessage.CAN_POP })
  }

  const handleNextResult = () => {
    dispatch({
      type: ActionTypes.DIRECTION,
      payload: 'left'
    })

    if (IS_KYC_STATUS_PENDING) {
      setIsLoading(true)
      postMessageCustom({ message: keyPossmessage.FINISHED_TEST })
      return
    }
    if (IS_KYC_STATUS_APPROVED) {
      setIsLoading(true)
      postMessageCustom({ message: keyPossmessage.FINISHED_TEST })
    } else {
      navigate(handleAddLangInUrl({ mainUrl: '/kyc', lang, token }))
    }
  }

  return (
    <div className='flex h-full flex-col justify-between'>
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
      <div className='sticky bottom-0 left-0 right-0 w-full py-2'>
        <PrimaryButton isLoading={isLoading} onClick={handleNextResult} className='h-12 w-full rounded-full font-bold'>
          {IS_KYC_STATUS_PENDING ? r?.text10 : IS_KYC_STATUS_APPROVED ? t?.text26 : r?.text1}
        </PrimaryButton>
      </div>
    </div>
  )
}

export default memo(Step2End)
