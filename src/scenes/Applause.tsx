import { motion } from 'motion/react'
import { useStore } from '../lib/store'
import content from '../content.json'
import { LanternRow, Petals } from '../components/Motifs'

export default function Applause() {
  const { advance } = useStore()
  const a = content.applause

  return (
    <div className="stage">
      <Petals count={12} />
      <div className="wrap flex flex-col items-center text-center gap-6">
        <p className="eyebrow">{a.eyebrow}</p>
        <LanternRow count={4} />

        <div className="flex flex-col items-center gap-1">
          <span className="brush text-4xl" style={{ color: '#e0505f' }}>
            掌声
          </span>
          <motion.h2
            className="display text-5xl text-moon"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14 }}
          >
            {a.title}
          </motion.h2>
        </div>

        <div className="relative" style={{ height: 130, width: 120 }}>
          <motion.div
            initial={{ y: -10, rotate: 0 }}
            animate={{ y: 60, rotate: 24 }}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeIn' }}
            className="absolute left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center">
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'linear-gradient(180deg,#5b5169,#2a2335)',
                  border: '2px solid rgba(227,178,60,0.6)',
                }}
              />
              <div style={{ width: 6, height: 46, background: '#3a3247', borderRadius: 3 }} />
            </div>
          </motion.div>
          <motion.div
            className="absolute left-1/2 bottom-0 -translate-x-1/2 rounded-full"
            style={{ border: '1px solid rgba(227,178,60,0.6)' }}
            initial={{ width: 0, height: 0, opacity: 0.9 }}
            animate={{ width: 160, height: 160, opacity: 0 }}
            transition={{ delay: 1.1, duration: 0.9 }}
          />
        </div>

        <div className="flex flex-col gap-3 max-w-sm">
          {a.lines.map((l, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.25 }}
              className="text-sm opacity-80"
            >
              {l}
            </motion.p>
          ))}
        </div>

        <motion.button
          className="btn-red btn"
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          onClick={advance}
        >
          Show me the gifts
        </motion.button>
      </div>
    </div>
  )
}
