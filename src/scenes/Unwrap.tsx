import { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../lib/store'
import content from '../content.json'
import { MoonGate, Petals, Seal } from '../components/Motifs'

export default function Unwrap() {
  const { advance } = useStore()
  const [opened, setOpened] = useState(false)

  return (
    <div className="stage">
      <Petals count={8} />
      <div className="wrap flex flex-col items-center text-center gap-6">
        <p className="eyebrow">{opened ? content.magazine.eyebrow : 'It has arrived'}</p>

        {!opened ? (
          <>
            <motion.button
              onClick={() => setOpened(true)}
              whileTap={{ scale: 0.96 }}
              className="relative"
              style={{ width: 200, height: 200 }}
              aria-label="Unwrap the parcel"
            >
              <div
                className="absolute inset-0 rounded-2xl anim-float"
                style={{
                  background: 'linear-gradient(160deg,#d7263d,#9c0f24)',
                  boxShadow: '0 26px 55px rgba(0,0,0,.55), inset 0 0 0 2px rgba(240,211,138,.45)',
                }}
              />
              <div className="absolute left-1/2 top-0 bottom-0 w-6 -translate-x-1/2" style={{ background: 'linear-gradient(180deg,#f0d38a,#d9b45b)' }} />
              <div className="absolute top-1/2 left-0 right-0 h-6 -translate-y-1/2" style={{ background: 'linear-gradient(90deg,#f0d38a,#d9b45b)' }} />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Seal text="礼" size={52} rotate={0} />
              </div>
            </motion.button>
            <p className="hand text-2xl text-gold-soft">Tap to unwrap.</p>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0.7, rotateY: 40, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <MoonGate size={270}>
                <div className="paper relative flex flex-col items-center justify-between" style={{ width: 176, height: 232, padding: 16 }}>
                  <span className="text-[0.58rem] uppercase tracking-[0.3em]" style={{ color: '#8a6a3a' }}>
                    {content.magazine.coverTag}
                  </span>
                  <span className="display text-4xl" style={{ color: '#3a2c1a' }}>
                    {content.magazine.coverTitle}
                  </span>
                  <span className="hand text-2xl" style={{ color: '#7a5a2a' }}>
                    {content.magazine.coverSubtitle}
                  </span>
                </div>
              </MoonGate>
            </motion.div>
            <motion.button className="btn-red btn" whileTap={{ scale: 0.97 }} onClick={advance}>
              Open it
            </motion.button>
          </>
        )}
      </div>
    </div>
  )
}
