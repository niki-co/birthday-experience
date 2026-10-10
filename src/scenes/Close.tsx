import { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../lib/store'
import { Petals, Seal } from '../components/Motifs'

export default function Close() {
  const { advance } = useStore()
  const [closing, setClosing] = useState(false)

  return (
    <div className="stage">
      <Petals count={6} />
      <div className="wrap flex flex-col items-center gap-8 text-center">
        <p className="eyebrow">The end</p>

        <div className="relative flex flex-col items-center" style={{ width: 240, height: 260 }}>
          {/* top rod */}
          <motion.div
            className="z-10"
            style={{ width: 264, height: 14, borderRadius: 8, background: 'linear-gradient(180deg,#e3b23c,#b98a24)' }}
            animate={{ y: closing ? 92 : 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* the sheet, rolling up */}
          <motion.div
            className="scroll-paper rounded-sm flex items-center justify-center overflow-hidden"
            style={{ width: 220, originY: 0 }}
            initial={{ height: 220 }}
            animate={{ height: closing ? 4 : 220 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="display text-2xl"
              style={{ color: '#3a2c1a' }}
              animate={{ opacity: closing ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              For [Name]
            </motion.span>
          </motion.div>
          {/* bottom rod */}
          <motion.div
            style={{ width: 264, height: 14, borderRadius: 8, background: 'linear-gradient(180deg,#e3b23c,#b98a24)' }}
            animate={{ y: closing ? -92 : 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* the ribbon, tying it shut */}
          <motion.div
            className="absolute"
            style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: closing ? 1 : 0, scale: closing ? 1 : 0 }}
            transition={{ delay: 1.05, type: 'spring', stiffness: 260, damping: 14 }}
          >
            <div className="flex items-center gap-2">
              <div style={{ width: 84, height: 6, borderRadius: 3, background: '#c8102e' }} />
              <Seal text="囍" size={40} rotate={0} />
              <div style={{ width: 84, height: 6, borderRadius: 3, background: '#c8102e' }} />
            </div>
          </motion.div>
        </div>

        {!closing ? (
          <button className="btn-red btn" onClick={() => setClosing(true)}>
            Tie it closed
          </button>
        ) : (
          <motion.button
            className="btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            onClick={advance}
          >
            Wait… something arrived
          </motion.button>
        )}
      </div>
    </div>
  )
}
