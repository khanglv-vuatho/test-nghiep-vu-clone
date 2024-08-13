import { translate } from '@/context/translationProvider'
import { ActionTypes } from '@/store'
import { formatLocalTimeWithOriginType } from '@/utils'
import moment from 'moment'
import { memo, useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'

type TTimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

type TimeZoneProps = { targetDate: string }

const TimeZone: React.FC<TimeZoneProps> = ({ targetDate }) => {
  const t = translate('TimeZone')
  const dispatch = useDispatch()
  const calculateTimeLeft = useCallback(() => {
    const now = moment()
    const target = formatLocalTimeWithOriginType(targetDate)
    const duration = moment.duration(target.diff(now))

    if (duration.asSeconds() < 0) {
      console.log('khang dep trai')
      dispatch({
        type: ActionTypes.CAN_RETAKE,
        payload: true
      })
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }

    return {
      days: Math.floor(duration.asDays()),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds()
    }
  }, [targetDate])

  const [timeLeft, setTimeLeft] = useState<TTimeLeft>(calculateTimeLeft())
  useEffect(() => {
    console.log({ timeLeft })
    if (targetDate === '') return
    const timer = setInterval(() => {
      if ((timeLeft.days == 0 && timeLeft.hours == 0 && timeLeft.minutes == 0 && timeLeft.seconds == 0) || timeLeft.seconds < 0) {
        console.log('co chay vao day')
        dispatch({
          type: ActionTypes.CAN_RETAKE,
          payload: true
        })
        return
      }
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, calculateTimeLeft, timeLeft])

  const { days, hours, minutes, seconds } = timeLeft

  const timeUnits = [
    { time: days, name: t?.text1 },
    { time: hours, name: t?.text2 },
    { time: minutes, name: t?.text3 },
    { time: seconds, name: t?.text4 }
  ]

  return (
    <div className='mx-auto grid w-fit grid-cols-4 justify-center gap-4'>
      {timeUnits.every((unit) => unit.time >= 0) && timeUnits.map((unit) => <TimeItem key={unit.time.toString()} timeLeft={unit.time} name={unit.name} />)}
    </div>
  )
}

const TimeItem: React.FC<{ timeLeft: number; name: string }> = ({ timeLeft, name }) => {
  return (
    <div className='flex size-12 flex-col items-center gap-2'>
      <div className='relative flex max-h-12 min-h-12 min-w-12 max-w-12 items-center justify-center rounded-lg bg-primary-light-gray p-3 font-bold'>
        <p className='z-50'>{timeLeft}</p>
      </div>
      <p className='text-xs text-[#A6A6A6]'>{name}</p>
    </div>
  )
}

export default memo(TimeZone)
