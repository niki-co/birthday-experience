import { motion } from 'motion/react'
import { useStore } from '../lib/store'
import { countdownTo } from '../lib/time'
import content from '../content.json'
import Envelope from '../components/Envelope'
import { DriftingClouds, Lantern, Petals } from '../components/Motifs'

function Cell({ v, l }: { v: number; l: string }) {
  return (
    <div className="card py-2 flex flex-col items-center">
      <span className="play text-2xl gold-text leading-none">{String(v).padStart(2, '0')}</span>
      <span className="text-[0.58rem] uppercase tracking-[0.18em] opacity-60 mt-1">{l}</span>
    </div>
  )
}

export default function Invitation() {
  const { now, open, advance } = useStore()
  const inv = content.invitation
  const hasDate = !!inv.unlockISO
  const cd = countdownTo(inv.unlockISO, now)

  return (
    <div className="stage">
      <DriftingClouds />
      <Petals count={9} />
      {/* a pair of lanterns framing the letter */}
      <div className="absolute top-0 left-4 right-4 flex justify-between" aria-hidden="true">
        <Lantern delay={0} />
        <Lantern delay={1.2} scale={0.85} />
      </div>

      <div className="wrap flex flex-col items-center text-center gap-5">
        <p className="eyebrow">{inv.eyebrow}</p>
        <div
          className="mt-4"
          onClick={() => open && advance()}
          style={{ cursor: open ? 'pointer' : 'default' }}
        >
          <Envelope sealed={!open} />
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="brush text-2xl" style={{ color: '#e0505f' }}>
            邀请
          </span>
          <h1 className="display text-5xl text-moon">{inv.title}</h1>
        </div>

        <p className="hand text-2xl text-gold-soft max-w-sm leading-snug">{inv.message}</p>

        {hasDate && !open && (
          <div className="grid grid-cols-4 gap-2 w-full max-w-xs mt-1">
            <Cell v={cd.days} l="days" />
            <Cell v={cd.hours} l="hrs" />
            <Cell v={cd.minutes} l="min" />
            <Cell v={cd.seconds} l="sec" />
          </div>
        )}

        {open ? (
          <motion.button className="btn-red btn mt-2" onClick={advance} whileTap={{ scale: 0.97 }}>
            It's time — open it
          </motion.button>
        ) : (
          <p className="text-xs opacity-65 mt-1">
            {hasDate ? 'Sealed until the day. No peeking.' : 'Sealed until we set the date.'}
          </p>
        )}

        <p className="text-[0.7rem] opacity-55 mt-1">venue · {inv.venue}</p>
      </div>
    </div>
  )
}
