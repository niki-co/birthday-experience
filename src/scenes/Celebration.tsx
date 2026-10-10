import { useCallback, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../lib/store'
import { useMic } from '../lib/useMic'
import content from '../content.json'
import { LanternRow, Petals, Seal } from '../components/Motifs'

const BALLOON_COLORS = ['#c8102e', '#e3b23c', '#e0505f', '#3a9d8f', '#e79aa8', '#f0d38a']

function Candle({ lit, i }: { lit: boolean; i: number }) {
  return (
    <div className="flex flex-col items-center" style={{ width: 8 }}>
      {lit && (
        <div
          className="rounded-full"
          style={{
            width: 7,
            height: 11,
            marginBottom: 2,
            background: 'radial-gradient(circle at 50% 70%, #fff6c9, #ffb01f 60%, #ff6a00)',
            animation: `flicker ${0.5 + (i % 4) * 0.13}s ease-in-out infinite`,
            filter: 'drop-shadow(0 0 6px rgba(255,180,40,.9))',
          }}
        />
      )}
      <div
        style={{
          width: 6,
          height: 34,
          borderRadius: 3,
          background: 'repeating-linear-gradient(45deg, #c8102e 0 4px, #f0d38a 4px 8px)',
        }}
      />
    </div>
  )
}

export default function Celebration() {
  const { advance } = useStore()
  const c = content.celebration
  const [phase, setPhase] = useState<'balloons' | 'cake'>('balloons')
  const [tries, setTries] = useState(0)
  const [blown, setBlown] = useState(false)

  useEffect(() => {
    if (phase !== 'balloons') return
    const id = window.setTimeout(() => setPhase('cake'), 2800)
    return () => window.clearTimeout(id)
  }, [phase])

  const blow = useCallback(() => {
    setTries((t) => {
      if (t >= 2) {
        setBlown(true)
        return 3
      }
      return t + 1
    })
  }, [])

  const { supported, listening, start } = useMic(blow)
  const message = blown ? c.tries[2] : tries === 0 ? c.wish : c.tries[Math.min(tries - 1, 1)]

  return (
    <div className="stage">
      <Petals count={10} />
      <div className="wrap flex flex-col items-center text-center gap-5">
        <p className="eyebrow">{c.eyebrow}</p>

        {phase === 'balloons' ? (
          <div className="relative w-full" style={{ height: 320 }}>
            {BALLOON_COLORS.map((col, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: `${8 + i * 15}%`, bottom: -40 }}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -420, opacity: 0 }}
                transition={{ duration: 2.6, delay: i * 0.12, ease: 'easeIn' }}
              >
                <div
                  style={{
                    width: 34,
                    height: 42,
                    borderRadius: '50% 50% 45% 45%',
                    background: col,
                    boxShadow: 'inset -6px -6px 12px rgba(0,0,0,.2)',
                  }}
                />
                <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,.4)', margin: '0 auto' }} />
              </motion.div>
            ))}
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex flex-col items-center gap-2">
                <span className="brush text-5xl anim-pop" style={{ color: '#e0505f' }}>
                  生日快乐
                </span>
                <h2 className="display text-3xl text-moon anim-pop">{c.title}</h2>
              </div>
            </div>
            <button
              className="absolute bottom-0 left-1/2 -translate-x-1/2 btn-ghost btn text-xs"
              onClick={() => setPhase('cake')}
            >
              skip
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-5 w-full"
          >
            <LanternRow count={3} />

            <div
              className="rounded-2xl overflow-hidden grid place-items-center"
              style={{
                width: 180,
                height: 180,
                background: c.photo ? `center/cover url(${c.photo})` : 'linear-gradient(160deg,#3a2f4a,#241a30)',
                border: '2px solid rgba(227,178,60,0.5)',
                boxShadow: '0 0 40px rgba(200,16,46,.25)',
              }}
            >
              {!c.photo && <span className="hand text-xl text-gold-soft opacity-80">her photo goes here</span>}
            </div>

            <div className="relative flex flex-col items-center">
              <div className="flex items-end gap-1 mb-1">
                {Array.from({ length: c.candleCount }).map((_, i) => (
                  <Candle key={i} lit={!blown} i={i} />
                ))}
              </div>
              <div
                style={{
                  width: 190,
                  height: 74,
                  borderRadius: '12px 12px 16px 16px',
                  background: 'linear-gradient(180deg,#f0d38a,#d9b45b)',
                  boxShadow: '0 16px 30px rgba(0,0,0,.45), inset 0 2px 0 rgba(255,255,255,.4)',
                }}
              />
            </div>

            {blown && (
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="brush text-4xl"
                style={{ color: '#e0505f' }}
              >
                生日快乐
              </motion.span>
            )}

            <p className="hand text-2xl text-gold-soft max-w-xs">{message}</p>

            {!blown && (
              <div className="flex flex-col items-center gap-3">
                {supported && (
                  <button className="btn-red btn" onClick={start} disabled={listening}>
                    {listening ? 'Listening… blow!' : 'Blow into the mic'}
                  </button>
                )}
                <button className={supported ? 'btn-ghost btn text-sm' : 'btn-red btn'} onClick={blow}>
                  {supported ? 'or tap here to blow' : 'Blow the candles'}
                </button>
                {tries > 0 && tries < 3 && (
                  <p className="text-xs opacity-60">
                    {3 - tries} {3 - tries === 1 ? 'try' : 'tries'} to go…
                  </p>
                )}
              </div>
            )}

            {blown && (
              <motion.button
                className="btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileTap={{ scale: 0.97 }}
                onClick={advance}
              >
                Wish made
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
