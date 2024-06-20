import instance from '@/services/axiosConfig'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'

const getCookie = (name: string) => {
  let value = '; ' + document.cookie
  let parts: any = value.split('; ' + name + '=')
  if (parts.length === 2) return parts.pop().split(';').shift()
}

const checkValidToken = async (token: string) => {
  try {
    const data: any = await instance.get(`/abc&token=${token}`)
    console.log({ data })
  } catch (error) {
    console.log(error)
  }

  return token ? token : getCookie('access_token')
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

const handleAddLangInUrl = ({ mainUrl, lang }: { mainUrl: string; lang: string }) => {
  return `${mainUrl}?lang=${lang}`
}

const formatLocalTime = (time: string) => {
  // Chuyển đổi thời gian UTC sang giờ địa phương
  const convertedLocalTime = moment.utc(time).local().format('HH:mm:ss')
  return convertedLocalTime
}

export { getCookie, checkValidToken, useUnfocusItem, capitalizeWords, useDebounce, handleAddLangInUrl, formatLocalTime }
