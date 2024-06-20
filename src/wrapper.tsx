import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

const Wrapper = ({ children, token }: { children: React.ReactNode; token: string }) => {
  const location = useLocation()
  const dispatch = useDispatch()
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
      {token}456:{children}
    </>
  )
}

export default Wrapper
