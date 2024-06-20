type Props = {
  data: { id: number; answer: string }[]
  handleStoreAnswer: (id: number) => void
  currentAnswer: { id: number; answer: number[] }
}

const RadioGroupCustom = ({ data, handleStoreAnswer, currentAnswer }: Props) => {
  const labels = ['A', 'B', 'C', 'D']
  const handleSelectAnswer = (id: number) => {
    handleStoreAnswer(id)
  }

  return (
    <div className='relative flex flex-col gap-2'>
      {data.map((value, index) => {
        const label = labels[index]
        const isSelected = currentAnswer?.answer.includes(value.id)

        return (
          <button
            key={value.id}
            onClick={() => handleSelectAnswer(value.id)}
            className={`relative z-50 flex w-full cursor-pointer items-center gap-2 rounded-xl p-4 transition ${isSelected ? 'activeDiv bg-primary-blue text-white' : 'bg-white'}`}
          >
            <span
              className={`z-50 flex size-7 flex-shrink-0 select-none items-center justify-center rounded-full font-bold ${isSelected ? 'bg-white text-primary-blue' : 'bg-primary-light-blue text-primary-black'}`}
            >
              {label}
            </span>
            <span className={`z-50 select-none text-left ${isSelected ? 'text-white' : 'text-primary-black'}`}>{value.answer}</span>
          </button>
        )
      })}
    </div>
  )
}

export default RadioGroupCustom
