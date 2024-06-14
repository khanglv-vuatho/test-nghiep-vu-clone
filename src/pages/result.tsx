import { PrimaryButton } from '@/components/Buttons'
import ImageFallback from '@/components/ImageFallback'
import WrapperBottom from '@/components/WrapperBottom'

const ResultPage = () => {
  return (
    <div className=''>
      <p className='py-4 text-center text-xl font-bold'>Kết quả</p>
      <div className='px-4'>
        <Pass precents={50} isPass={true} />
      </div>
      <WrapperBottom className='px-4'>
        <PrimaryButton className='w-full rounded-full text-base font-bold'>Xong</PrimaryButton>
      </WrapperBottom>
    </div>
  )
}

const Pass = ({ precents, isPass }: { precents: number; isPass: boolean }) => {
  return (
    <div className='flex flex-col items-center gap-4 rounded-2xl bg-white p-4 px-8 shadow-[8px_8px_16px_0px_#0000000A]'>
      <div className='flex flex-col items-center gap-2'>
        <div className='h-[128px] w-[131px]'>
          <ImageFallback src={isPass ? '/pass.png' : '/nopass.png'} alt='pass' width={400} height={400} className='size-full' />
        </div>
        <div className='flex flex-col'>
          <p className='text-center'>Kết quả bài kiểm tra</p>
          <p className='text-center text-3xl font-bold'>{precents}%</p>
        </div>
      </div>
      <div className='flex flex-col items-center gap-1'>
        {isPass ? <p className='text-center font-bold text-primary-blue'>Hoàn thành</p> : <p className='text-center font-bold text-primary-red'>Chưa đạt</p>}
        <p className='text-center text-sm'>
          {isPass
            ? 'Chúc mừng bạn đã hoàn thành bài kiểm tra! Bạn có năng lực và tiềm năng để trở thành một chuyên gia trong lĩnh vực của mình.'
            : 'Bạn chưa đạt bài kiểm tra nghiệp vụ. Hãy làm lại bài kiểm tra để cải thiện điểm nhé!'}
        </p>
      </div>
    </div>
  )
}

export default ResultPage
