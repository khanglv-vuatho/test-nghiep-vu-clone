import { Radio, RadioGroup } from '@nextui-org/react'
import { useState } from 'react'

type Props = {
  data: { id: number; answer: string }[]
  handleStoreAnswer: (id: number) => void
  answerSheets: { id: number; answer: number[] }[]
}
const RadioGroupCustom = ({ data, handleStoreAnswer, answerSheets }: Props) => {
  const [selected, setSelected] = useState('')
  return (
    <RadioGroup
      classNames={{
        base: '1 static block',
        label: '2',
        description: '3',
        errorMessage: '4',
        wrapper: '5 gap-4 flex-auto w-full'
      }}
      value={selected}
      className=''
      onValueChange={setSelected}
    >
      {data.map((value) => {
        const isActive = selected === value.answer
        const isSelected = answerSheets.some((item) => item.answer.includes(value.id))
        return (
          <Radio
            classNames={{
              base: `6 m-0 w-full p-4 flex rounded-xl transition static ${isActive || isSelected ? 'bg-primary-blue' : 'bg-white'}`,
              label: `7 ${isActive || isSelected ? 'text-white' : 'text-primary-black'}`,
              description: '8',
              control: '9',
              labelWrapper: 'm-0',
              wrapper: 'hidden'
            }}
            style={{
              width: '100%',
              maxWidth: '100%',
              position: 'static'
            }}
            key={value.answer}
            value={value.answer}
            onChange={() => handleStoreAnswer(value.id)}
          >
            {value.answer}
          </Radio>
        )
      })}
    </RadioGroup>
  )
}

export default RadioGroupCustom
