import ToastComponent from '@/components/ToastComponent'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'

const getCookie = (name: string) => {
  let value = '; ' + document.cookie
  let parts: any = value.split('; ' + name + '=')
  if (parts.length === 2) return parts.pop().split(';').shift()
}

const useUnfocusItem = (callback: () => void, exclusionRef?: React.RefObject<HTMLElement | null>): React.RefObject<any> => {
  const itemRef = useRef<any>(null)

  useEffect(() => {
    const handleBlur = (event: Event) => {
      const clickedOutside = itemRef.current && !itemRef.current.contains(event.target as Node)

      const clickedOnExclusion = exclusionRef && exclusionRef.current && exclusionRef.current.contains(event.target as Node)

      if (clickedOutside && !clickedOnExclusion) {
        callback()
      }
    }

    document.addEventListener('click', handleBlur)

    return () => {
      document.removeEventListener('click', handleBlur)
    }
  }, [callback, exclusionRef])

  return itemRef
}

function capitalizeWords(string: string) {
  if (!string) return ''
  return string
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const handler: any = useRef(null)

  useEffect(() => {
    // Clear the timeout if value changes (cleanup function)
    if (handler.current) {
      clearTimeout(handler.current)
    }

    // Set the timeout to update debouncedValue after the specified delay
    handler.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup function to clear timeout if component unmounts or value changes
    return () => {
      if (handler.current) {
        clearTimeout(handler.current)
      }
    }
  }, [value, delay])

  return debouncedValue
}

const handleAddLangInUrl = ({ mainUrl, lang, token }: { mainUrl: string; lang: string; token: string }) => {
  return `${mainUrl}?lang=${lang}&token=${token}`
}

const formatLocalTime = (time: string) => {
  const utcMoment = moment.utc(time, 'HH:mm:ss')
  const localTime = utcMoment.local().format('HH:mm:ss')
  return localTime
}

const formatLocalTimeWithOriginType = (time: string) => {
  const utcMoment = moment.utc(time)
  const localTime = utcMoment.local()
  return localTime
}

const formatDDMMYYYY = (time: string) => {
  return moment(time).format('DD/MM/YYYY')
}

const postMessageCustom = ({ message, data = {} }: { message: string; data?: any }) => {
  //@ts-ignore
  if (window?.vuatho) {
    //@ts-ignore
    window?.vuatho?.postMessage(
      JSON.stringify({
        message,
        data
      })
    )
  } else {
    ToastComponent({ message: message || 'has bug here', type: 'error' })
  }
}
const converTimeMinutes = (time: string) => {
  return moment.duration(time).asMinutes()
}

const formatNumber = (number: number) => {
  if (isNaN(number)) {
    return 0
  }

  const result = number % 1 === 0 ? number.toString() : number.toFixed(2).replace(/\.?0+$/, '')

  return result
}

export {
  getCookie,
  useUnfocusItem,
  capitalizeWords,
  useDebounce,
  handleAddLangInUrl,
  formatLocalTime,
  formatDDMMYYYY,
  postMessageCustom,
  converTimeMinutes,
  formatNumber,
  formatLocalTimeWithOriginType
}
