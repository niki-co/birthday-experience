import { motion } from 'motion/react'
import { useStore } from '../lib/store'

// A quiet tally of the points she's been collecting, shown once the gifts begin.
export default function ProgressDots() {
  const { points, maxPoints, scene } = useStore()
  const show = ['gifts', 'puzzle', 'notes', 'close', 'keepsake'].includes(scene)
  if (!show) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-3 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="card px-3.5 py-1.5 flex items-center gap-2 text-xs">
        <span className="eyebrow" style={{ letterSpacing: '0.18em' }}>
          points
        </span>
        <span className="play text-gold text-lg leading-none">{points}</span>
        <span className="opacity-45 text-[0.7rem]">/ {maxPoints}</span>
      </div>
    </motion.div>
  )
}
