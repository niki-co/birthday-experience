import { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../lib/store'
import content from '../content.json'
import { LanternRow, Petals } from '../components/Motifs'

export default function Delivery() {
  const { advance } = useStore()
  const [step, setStep] = useState(0)
  const lines = content.delivery.lines
  const done = step >= lines.length

  return (
    <div className="stage">
      <Petals count={7} />
      <div className="wrap flex flex-col items-center text-center gap-6">
        <p className="eyebrow">{content.delivery.eyebrow}</p>
        <LanternRow count={3} />

        <div className="relative w-full" style={{ height: 170 }}>
          <div className="absolute inset-x-6 bottom-6 h-px" style={{ background: 'rgba(227,178,60,0.35)' }} />
          <motion.div
            className="absolute bottom-7 left-0"
            initial={{ x: '-45%' }}
            animate={{ x: '58%' }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <div
                className="absolute -top-3 -right-2 w-9 h-9 rounded"
                style={{ background: 'linear-gradient(180deg,#e3b23c,#b98a24)' }}
              />
              <div
                className="w-24 h-14 rounded-xl grid place-items-center"
                style={{ background: 'linear-gradient(180deg,#d7263d,#9c0f24)', boxShadow: '0 10px 24px rgba(0,0,0,.45)' }}
              >
                <span className="brush text-2xl" style={{ color: '#f0d38a' }}>
                  送
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="card p-4 w-full">
          <p className="text-sm opacity-85">{content.delivery.courier}</p>
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="hand text-2xl text-gold-soft mt-1"
          >
            {done ? content.delivery.parcelLabel : lines[step]}
          </motion.p>
        </div>

        <motion.button
          className="btn-red btn"
          whileTap={{ scale: 0.97 }}
          onClick={() => (done ? advance() : setStep((s) => s + 1))}
        >
          {done ? 'Take the parcel' : 'Continue'}
        </motion.button>
      </div>
    </div>
  )
}
