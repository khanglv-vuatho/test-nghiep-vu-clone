import WrapperAnimation from '@/components/WrapperAnimation'
import { Link } from '@nextui-org/react'
import { useLocation } from 'react-router-dom'

const Test2 = () => {
  const { pathname } = useLocation()
  return (
    <WrapperAnimation keyRender={pathname} direction='left'>
      <div className='h-dvh bg-red-100 text-green-200'>
        <div className='flex items-center gap-4'>
          <Link href='/test1'>test1</Link>
          <Link href='/test2'>test2</Link>
          this is test2 content
        </div>
      </div>
    </WrapperAnimation>
  )
}

export default Test2
