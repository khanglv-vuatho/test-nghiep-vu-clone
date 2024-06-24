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
              key={value.id}
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

export default RadioGroupCustom
