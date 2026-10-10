import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../lib/store'
import content from '../content.json'
import TicTacToe from '../components/TicTacToe'
import { LanternRow, Petals, Seal } from '../components/Motifs'

type Mode = 'me' | 'alone'
type Result = 'win' | 'lose' | 'draw'

const OUTCOME: Record<Result, string> = {
  win: 'You won. (As if there was any doubt.)',
  lose: 'I won this one. You still win the night.',
  draw: 'A draw. Fitting — we are a matched set.',
}

export default function Reveal() {
  const { advance } = useStore()
  const p = content.puzzle
  const [mode, setMode] = useState<Mode | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  return (
    <div className="stage">
      <Petals count={8} />
      <div className="wrap flex flex-col items-center text-center gap-5">
        <p className="eyebrow">{p.eyebrow}</p>

        {!mode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-5 w-full"
          >
            <h2 className="display text-3xl text-moon max-w-xs">
              One game before the truth.
            </h2>
            <p className="text-sm opacity-70 max-w-xs">
              Three in a row, and the cards turn over.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <motion.button
                className="btn-red btn flex items-center justify-center gap-3"
                whileTap={{ scale: 0.97 }}
                onClick={() => setMode('me')}
              >
                <span className="seal" style={{ width: 30, height: 30, fontSize: 13, transform: 'none' }}>
                  <span className="brush">丽</span>
                </span>
                Play with me
              </motion.button>
              <motion.button
                className="btn-ghost btn flex items-center justify-center gap-3"
                whileTap={{ scale: 0.97 }}
                onClick={() => setMode('alone')}
              >
                <span style={{ fontSize: 18, opacity: 0.8 }}>☹</span>
                Play alone
              </motion.button>
            </div>
          </motion.div>
        )}

        {mode && !result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-5 w-full"
          >
            <LanternRow count={2} />
            <TicTacToe onEnd={setResult} oppLabel={mode === 'me' ? 'I' : 'the house'} />
            <button className="btn-ghost btn text-xs" onClick={() => setMode(null)}>
              choose again
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-5 w-full"
            >
              <p className="hand text-2xl text-gold-soft">{OUTCOME[result]}</p>

              <div className="flex flex-col items-center gap-3">
                {/* the cards flipping over */}
                <div className="flex gap-2" style={{ perspective: 800 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: 180 }}
                      transition={{ delay: 0.3 + i * 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="paper"
                      style={{ width: 74, height: 104, backfaceVisibility: 'hidden' }}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  className="paper relative p-6 flex flex-col items-center gap-2 max-w-sm"
                >
                  <Seal text="二十" size={58} rotate={-8} />
                  <span className="brush text-4xl" style={{ color: '#c8102e' }}>
                    生日快乐
                  </span>
                  <span className="display text-3xl" style={{ color: '#3a2c1a' }}>
                    {p.cardTitle}
                  </span>
                  <p className="text-sm" style={{ color: '#6b5230' }}>
                    {p.clue}
                  </p>
                  <p className="hand text-2xl" style={{ color: '#7a5a2a' }}>
                    {p.reveal}
                  </p>
                </motion.div>
              </div>

              <motion.button
                className="btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                whileTap={{ scale: 0.97 }}
                onClick={advance}
              >
                One last thing
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
