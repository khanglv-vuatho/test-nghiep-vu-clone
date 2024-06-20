import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import Cookies from 'universal-cookie'

const Wrapper = ({ children, token }: { children: React.ReactNode; token: string }) => {
  const location = useLocation()
  const dispatch = useDispatch()
  const cookies = new Cookies()

  const token123 = cookies.get('token')

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)

    // Lấy giá trị của tham số 'lang'
    const lang = queryParams.get('lang') || 'vi'

    dispatch({
      type: 'lang',
      payload: {
        lang
      }
    })
  }, [])

  return (
    <>
      test: {token123}:{token}456:{children}
    </>
  )
}

export default Wrapper
