import { direction } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  keyRender: string | number
  duration?: number
  direction?: direction // Optional direction prop
}

const WrapperAnimation = ({ children, keyRender, direction = 'right', duration = 0.3 }: Props) => {
  // Define initial variants based on direction
  const initialVariants = {
    left: { opacity: 0, x: '100%', y: 0, scale: 1 },
    right: { opacity: 0, x: '-100%', y: 0, scale: 1 },
    up: { opacity: 0, x: 0, y: '100%', scale: 0.8 },
    down: { opacity: 0, x: 0, y: '-100%', scale: 0.8 }
  }

  const exitVariants = {
    left: { opacity: 0, x: '-100%', y: 0, scale: 1 },
    right: { opacity: 0, x: '100%', y: 0, scale: 1 },
    up: { opacity: 0, x: 0, y: '-100%', scale: 0.8 },
    down: { opacity: 0, x: 0, y: '100%', scale: 0.8 }
  }

  return (
    <AnimatePresence mode='wait'>
      <motion.div key={keyRender} initial={initialVariants[direction]} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} exit={exitVariants[direction]} transition={{ duration: duration }}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default WrapperAnimation
