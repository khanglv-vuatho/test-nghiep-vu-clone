import { AddCircle } from 'iconsax-react'
import { useSelector } from 'react-redux'

import TimeZone from '@/components/TimeZone'
import { translate } from '@/context/translationProvider'
import { TInitState } from '@/store'
import { Test } from '@/types'
import { formatDDMMYYYY, formatLocalTime } from '@/utils'
import { memo } from 'react'

const CanRetake = ({ testDetail, IS_AFTER_CURRENT_TIME }: { testDetail: Test; IS_AFTER_CURRENT_TIME: boolean }) => {
  const t = translate('Testing')
  const step1 = useSelector((state: TInitState) => state.step1)

  return (
    <div className='flex min-h-[calc(100dvh-128px)] flex-col gap-2 overflow-hidden'>
      <div className='flex items-center justify-center bg-white py-4 text-center'>
        <div className='font-bold'>{t?.text1}</div>
      </div>
      <div className='flex flex-col gap-4 px-4'>
        {testDetail?.results?.map((item: any, index: number) => {
          const isLastItem = index == testDetail?.results?.length - 1
          return (
            <div key={item?.finish_time} className={`relative flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[8px_8px_16px_0px_#0000000A] ${isLastItem ? 'w-[calc(100%-4px)]' : 'w-full'}`}>
              {isLastItem && <div className='absolute inset-0 z-[-10] translate-x-1 rounded-2xl bg-primary-red' />}
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
          )
        })}
      </div>
      {!IS_AFTER_CURRENT_TIME && (
        <div className='mt-6 flex flex-col gap-4'>
          <div className='text-center text-sm'>
            <p>{t?.text2}</p>
            <p>
              {formatLocalTime(testDetail?.meta?.can_retake?.split(' ')?.[1])} {formatDDMMYYYY(testDetail?.meta?.can_retake.split(' ')?.[0])}
            </p>
          </div>
          <TimeZone targetDate={testDetail?.meta?.can_retake} />
        </div>
      )}
    </div>
  )
}

export default memo(CanRetake)
