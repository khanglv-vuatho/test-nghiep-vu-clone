import { translate } from '@/context/translationProvider'
import { formatLocalTimeWithOriginType } from '@/utils'
import moment from 'moment'
import { memo, useEffect, useState, useCallback, useMemo } from 'react'

type TTimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}
type TimeZoneProps = { targetDate: string }

const TimeZone: React.FC<TimeZoneProps> = ({ targetDate }) => {
  const t = translate('TimeZone')
  const calculateTimeLeft = useCallback(() => {
    const now = moment()
    const target = formatLocalTimeWithOriginType(targetDate)
    const duration = moment.duration(target.diff(now))

    return {
      days: Math.floor(duration.asDays()),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds()
    }
  }, [targetDate])

  const initialTimeLeft = useMemo(calculateTimeLeft, [calculateTimeLeft])

  const [timeLeft, setTimeLeft] = useState<TTimeLeft>(initialTimeLeft)

  useEffect(() => {
    if (targetDate === '') return
    if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, calculateTimeLeft])

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const { days, hours, minutes, seconds } = timeLeft

  const timeUnits = [
    { time: days, name: t?.text1 },
    { time: hours, name: t?.text2 },
    { time: minutes, name: t?.text3 },
    { time: seconds, name: t?.text4 }
  ]

  return (
    <div className='mx-auto grid w-fit grid-cols-4 justify-center gap-4'>
      {timeUnits.map((unit) => (
        <TimeItem key={unit.time.toString()} timeLeft={unit.time} name={unit.name} />
      ))}
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
