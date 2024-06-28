import { direction } from '@/types'
import { motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  keyRender: string | number
  duration?: number
  direction?: direction // Optional direction prop
}

const WrapperAnimation = ({ children, keyRender, direction = 'right', duration = 0.3 }: Props) => {
  const initialVariants = {
    left: { x: '100%' },
    right: { x: '-100%' },
    up: { x: 0, y: '100%' },
    down: { x: 0, y: '-100%' }
  }

  const exitVariants = {
    left: { x: '-100%' },
    right: { x: '100%' },
    up: { x: 0, y: '-100%' },
    down: { x: 0, y: '100%' }
  }

  return (
    <motion.div key={keyRender} initial={initialVariants[direction]} animate={{ opacity: 1, x: 0 }} exit={exitVariants[direction]} transition={{ duration: duration }}>
      {children}
    </motion.div>
  )
}

export default WrapperAnimation
