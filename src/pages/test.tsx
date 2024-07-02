import { Progress } from '@nextui-org/react'
import { useScroll, motion, useTransform } from 'framer-motion'
import { TickCircle } from 'iconsax-react'
import { useRef } from 'react'

const Test = () => {
  const refScroll = useRef(null)

  const { scrollYProgress } = useScroll({ target: refScroll })

  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.05], [1, 0.9])
  const translateX = useTransform(scrollYProgress, [0, 0.05], [0, 60])

  const listQuestions = [
    {
      id: 1,
      question: '1',
      answers: [
        { id: 1, answer: '1' },
        { id: 2, answer: '1' },
        { id: 3, answer: '1' },
        { id: 4, answer: '1' }
      ],
      number_choices: 1,
      attachments: []
    },
    {
      id: 2,
      question: '1',
      answers: [
        { id: 1, answer: '1' },
        { id: 2, answer: '1' },
        { id: 3, answer: '1' },
        { id: 4, answer: '1' }
      ],
      number_choices: 1,
      attachments: []
    },
    {
      id: 3,
      question: '1',
      answers: [
        { id: 1, answer: '1' },
        { id: 2, answer: '1' },
        { id: 3, answer: '1' },
        { id: 4, answer: '1' }
      ],
      number_choices: 1,
      attachments: []
    },
    {
      id: 4,
      question: '1',
      answers: [
        { id: 1, answer: '1' },
        { id: 2, answer: '1' },
        { id: 3, answer: '1' },
        { id: 4, answer: '1' }
      ],
      number_choices: 1,
      attachments: []
    },
    {
      id: 5,
      question: '1',
      answers: [
        { id: 1, answer: '1' },
        { id: 2, answer: '1' },
        { id: 3, answer: '1' },
        { id: 4, answer: '1' }
      ],
      number_choices: 1,
      attachments: []
    }
  ]
  return (
    <div ref={refScroll} className='flex flex-col gap-4'>
      <div className='sticky top-0 flex items-center gap-2 p-4'>
        <motion.div style={{ scale }} className='rounded-full bg-primary-light-blue px-3 py-2 font-bold text-primary-blue'>
          {'12:20'}
        </motion.div>
        <motion.div style={{ opacity }} className='w-full'>
          <Progress
            value={15}
            classNames={{
              indicator: 'bg-primary-blue',
              track: 'bg-primary-light-blue'
            }}
          />
        </motion.div>
      </div>
      <motion.div style={{ translateX, scale }} className='sticky top-3.5 z-50 flex w-fit items-center gap-3 overflow-auto p-4 pt-0'>
        {listQuestions.map((question, index) => (
          <button
            key={question.id}
            className={`relative flex size-11 flex-shrink-0 select-none items-center justify-center rounded-full border font-bold transition ${false ? 'border-primary-green text-primary-green' : 'border-primary-blue text-primary-blue'} ${true ? '!border-primary-blue !bg-primary-blue !text-white' : ''}`}
          >
            <p className='z-50'>{index + 1}</p>
            <span className='absolute bottom-0 right-0 translate-x-1/2 translate-y-[10%] text-xs font-bold'>
              <TickCircle variant='Bold' className={`transition ${false && !true ? 'text-primary-green' : 'hidden'}`} />
            </span>
          </button>
        ))}
      </motion.div>
      <div className='mt-[2000px]' />
    </div>
  )
}

export default Test
