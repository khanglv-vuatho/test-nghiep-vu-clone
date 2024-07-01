import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

type Props = {
  data: { id: number; answer: string }[]
  handleStoreAnswer: (id: number) => void
  currentAnswerId: number
  answerSheets: { id: number; answer: number[] }[]
}

const RadioGroupCustom = ({ data, handleStoreAnswer, currentAnswerId, answerSheets }: Props) => {
  const labels = ['A', 'B', 'C', 'D']
  const handleSelectAnswer = (id: number) => {
    handleStoreAnswer(id)
  }

  const currentAnswer = answerSheets.find((sheet) => sheet.id === currentAnswerId)

  return (
    <div className='flex flex-col gap-4'>
      {data.map((value, index) => {
        const label = labels[index]
        const isSelected = currentAnswer?.answer.includes(value.id)

        return (
          <div className={`relative z-50`}>
            <div
              key={value.answer}
              onClick={() => handleSelectAnswer(value.id)}
              className={`z-50 flex cursor-pointer select-none items-center gap-2 rounded-xl p-4 transition active:translate-y-1 ${isSelected ? 'bg-primary-blue text-white' : 'bg-white'}`}
            >
              <span
                className={`flex size-7 flex-shrink-0 select-none items-center justify-center rounded-full font-bold ${isSelected ? 'bg-white text-primary-blue' : 'bg-primary-light-blue text-primary-black'}`}
              >
                {label}
              </span>
              <span className={`select-none text-left ${isSelected ? 'text-white' : 'text-primary-black'}`}>{value.answer}</span>
            </div>
            <div className={`absolute inset-0 -z-10 translate-y-1 rounded-xl ${isSelected ? 'bg-[#2B2A4C]' : 'bg-primary-blue/30'} `} />
          </div>
        )
      })}
    </div>
  )
}

type PropsRadioSelectRole = {
  activeRadio: number
  setActiveRadio: React.Dispatch<React.SetStateAction<number>>
  options: {
    value: number
    label: React.ReactNode
    descripton: React.ReactNode
    comingSoon?: React.ReactNode
  }[]
}
export const RadioSelectRole = ({ options, activeRadio, setActiveRadio }: PropsRadioSelectRole) => {
  const optionRefs: any = useRef([])

  useEffect(() => {
    if (optionRefs?.current?.[activeRadio]) {
      optionRefs?.current?.[activeRadio].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [activeRadio])

  return options.map((item, index) => {
    const isActive = item.value == activeRadio
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: 100
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.15
        }}
        ref={(el) => (optionRefs.current[index] = el)}
        onClick={() => {
          setActiveRadio(item.value)
        }}
        key={item.value}
        className={`flex flex-col overflow-hidden rounded-xl border-1 ${isActive ? 'border-primary-blue bg-primary-light-blue' : 'border-transparent bg-primary-light-gray opacity-60'}`}
      >
        <div>
          {item?.comingSoon && <div>{item?.comingSoon}</div>}
          <div className='flex items-center gap-2 p-4 pb-0'>
            <div className={`flex size-5 flex-shrink-0 items-center justify-center rounded-full ring-2 transition ${isActive ? 'ring-primary-blue' : 'ring-primary-gray'}`}>
              <div className={`size-4 rounded-full transition ${isActive ? 'bg-primary-blue' : 'bg-transparent'}`}></div>
            </div>
            {item.label}
          </div>
        </div>
        {item.descripton}
      </motion.div>
    )
  })
}

export default RadioGroupCustom
