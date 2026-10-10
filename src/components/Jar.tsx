import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export type Star = {
  type?: 'note' | 'wish' | 'dare' | 'photo' | 'sticker' | 'video'
  text?: string
  src?: string
}

const COLORS = ['#ffd23f', '#f0dca6', '#e2bd68', '#ffb703', '#ffe08a', '#e8809b', '#f4a259']

const TYPE_LABEL: Record<string, string> = {
  note: 'A note',
  wish: 'A wish',
  dare: 'A dare',
  photo: 'A memory',
  sticker: 'A sticker',
  video: 'A clip',
}

// A glass jar of folded paper stars. Tap a star and it unfolds.
export default function Jar({ stars, from }: { stars: Star[]; from?: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const active = open === null ? null : stars[open]

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <p className="hand text-2xl text-gold-soft text-center">
        {stars.length} folded stars. Tap one to unfold it.
      </p>

      <div className="relative" style={{ width: 240, height: 300 }}>
        {/* lid */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0"
          style={{
            width: 132,
            height: 26,
            borderRadius: '10px 10px 5px 5px',
            background: 'linear-gradient(180deg,#d9b45b,#9d7c2f)',
            boxShadow: '0 6px 14px rgba(0,0,0,.45)',
          }}
        />
        {/* neck */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 24,
            width: 104,
            height: 24,
            background: 'rgba(255,255,255,.07)',
            borderLeft: '1px solid rgba(247,239,225,.18)',
            borderRight: '1px solid rgba(247,239,225,.18)',
          }}
        />
        {/* glass body */}
        <div
          className="absolute left-0 right-0 bottom-0 overflow-hidden"
          style={{
            top: 46,
            borderRadius: '20px 20px 46px 46px',
            background:
              'linear-gradient(180deg, rgba(255,255,255,.20), rgba(255,255,255,.06) 45%, rgba(255,255,255,.12))',
            border: '1px solid rgba(247,239,225,.38)',
            boxShadow:
              'inset 0 0 60px rgba(255,255,255,.10), inset 0 -22px 40px rgba(255,255,255,.05), 0 22px 45px rgba(0,0,0,.45)',
          }}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              left: 10,
              right: 10,
              top: 3,
              height: 44,
              borderRadius: '50%',
              background: 'radial-gradient(60% 100% at 50% 0%, rgba(255,255,255,.30), transparent)',
            }}
          />
          <div className="absolute inset-0 overflow-y-auto" style={{ padding: 16 }}>
            <div className="flex flex-wrap gap-2 justify-center content-start">
              {stars.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setOpen(i)}
                  aria-label={`Star ${i + 1}`}
                  className="transition-transform active:scale-90"
                  style={{ transform: `rotate(${((i * 37) % 44) - 22}deg)` }}
                >
                  <span
                    style={{
                      display: 'block',
                      width: 26,
                      height: 26,
                      background: COLORS[i % COLORS.length],
                      clipPath:
                        'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
                      filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.35))',
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
          {/* glass shine */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 6,
              bottom: 6,
              left: 16,
              width: 18,
              borderRadius: 20,
              background: 'linear-gradient(90deg, rgba(255,255,255,.20), transparent)',
            }}
          />
        </div>
      </div>

      {from && <p className="text-xs opacity-60">from {from}</p>}

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(8,5,12,.8)', backdropFilter: 'blur(4px)' }}
              onClick={() => setOpen(null)}
            />
            <motion.div
              initial={{ rotateX: -80, scaleY: 0.4, opacity: 0, y: 24 }}
              animate={{ rotateX: 0, scaleY: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="paper relative w-full max-w-sm p-6"
              style={{ transformOrigin: 'top center' }}
            >
              <p
                className="text-[0.6rem] uppercase tracking-[0.3em]"
                style={{ color: '#8a6a3a' }}
              >
                {TYPE_LABEL[active.type || 'note'] || 'A note'} · star {open! + 1}
              </p>
              {active.type === 'photo' ? (
                active.src ? (
                  <img src={active.src} alt="" className="rounded-lg my-3 w-full" />
                ) : (
                  <div
                    className="my-4 h-40 rounded-lg grid place-items-center"
                    style={{ background: 'rgba(58,44,26,.12)', color: '#3a2c1a' }}
                  >
                    <span className="hand text-xl">her photo goes here</span>
                  </div>
                )
              ) : (
                <p className="hand text-3xl leading-snug my-3" style={{ color: '#3a2c1a' }}>
                  {active.text}
                </p>
              )}
              <button
                className="mt-2 text-sm px-3 py-1.5 rounded-full"
                style={{ background: '#3a2c1a', color: '#f1e5cd' }}
                onClick={() => setOpen(null)}
              >
                Fold it back
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
