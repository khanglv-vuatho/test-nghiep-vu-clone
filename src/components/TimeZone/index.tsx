import moment from 'moment'
import { useEffect, useState } from 'react'

type TTimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}
const TimeZone = ({ targetDate }: { targetDate: string }) => {
  const calculateTimeLeft = () => {
    const now = moment()
    const target = moment(targetDate)
    const duration = moment.duration(target.diff(now))

    return {
      days: Math.floor(duration.asDays()),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds()
    }
  }

  const [timeLeft, setTimeLeft] = useState<TTimeLeft>(calculateTimeLeft())

  useEffect(() => {
    if (targetDate == '') return
    if (timeLeft?.days == 0 && timeLeft?.hours == 0 && timeLeft?.minutes == 0 && timeLeft?.seconds == 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className='mx-auto grid w-fit grid-cols-4 justify-center gap-4'>
      <TimeItem timeLeft={timeLeft.hours} name={'Ngày'} keyRender={timeLeft?.days?.toString()} />
      <TimeItem timeLeft={timeLeft.hours} name={'Giờ'} keyRender={timeLeft?.hours?.toString()} />
      <TimeItem timeLeft={timeLeft.minutes} name={'Phút'} keyRender={timeLeft?.minutes?.toString()} />
      <TimeItem timeLeft={timeLeft.seconds} name={'Giây'} keyRender={timeLeft?.seconds?.toString()} />
    </div>
  )
}

const TimeItem = ({ timeLeft, name }: { timeLeft: number; name: string; keyRender: string }) => {
  return (
    <div className='flex size-12 flex-col items-center gap-2'>
      <div className='relative flex max-h-12 min-h-12 min-w-12 max-w-12 items-center justify-center rounded-lg bg-primary-light-gray p-3 font-bold'>
        <p className='z-50'>{timeLeft}</p>
      </div>
      <p className='text-xs text-[#A6A6A6]'>{name}</p>
    </div>
  )
}

export default TimeZone
