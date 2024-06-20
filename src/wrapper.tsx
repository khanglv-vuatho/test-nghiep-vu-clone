import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

const Wrapper = ({ children, token, userAgent }: { children: React.ReactNode; token: string; userAgent: string }) => {
  const location = useLocation()
  const dispatch = useDispatch()
  console.log({ userAgent })
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

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      dispatch({
        type: 'token',
        payload: token
      })
    }
  }, [token])

  return (
    <>
      {token}123:{children}
    </>
  )
}

export default Wrapper
