import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Jar from './Jar'

type Gift = {
  id: string
  type: string
  title: string
  points: number
  [k: string]: any
}

function Frame({
  children,
  onClose,
}: {
  children: ReactNode
  onClose: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(8,5,12,0.78)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative card w-full max-w-md max-h-[86dvh] overflow-y-auto p-5"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full grid place-items-center"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          aria-label="Close"
        >
          ✕
        </button>
        {children}
      </motion.div>
    </motion.div>
  )
}

function Placeholder({ note }: { note: string }) {
  return (
    <div
      className="rounded-xl p-6 text-center text-sm opacity-70"
      style={{ border: '1px dashed rgba(247,239,225,0.25)' }}
    >
      {note}
    </div>
  )
}

/* ---------- individual gifts ---------- */

function Certificate({ gift }: { gift: Gift }) {
  return (
    <div className="paper p-6 text-center">
      <p className="text-[0.6rem] uppercase tracking-[0.3em]" style={{ color: '#8a6a3a' }}>
        certificate of achievement
      </p>
      <p className="display text-3xl my-4" style={{ color: '#3a2c1a' }}>
        {gift.body}
      </p>
      <p className="hand text-xl" style={{ color: '#7a5a2a' }}>
        — {gift.awardedBy}
      </p>
    </div>
  )
}

function CD({ gift }: { gift: Gift }) {
  const photos: string[] = gift.photos ?? []
  const [playing, setPlaying] = useState(false)
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="rounded-full grid place-items-center"
        style={{
          width: 150,
          height: 150,
          background:
            'conic-gradient(from 0deg,#3a2f4a,#6b5a86,#3a2f4a,#8a7aa8,#3a2f4a)',
          boxShadow: '0 16px 40px rgba(0,0,0,.5)',
        }}
        animate={{ rotate: playing ? 360 : 0 }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
      >
        <div
          className="rounded-full grid place-items-center"
          style={{
            width: 54,
            height: 54,
            background: photos[0] ? `center/cover url(${photos[0]})` : '#e2bd68',
            border: '4px solid #120d18',
          }}
        />
      </motion.div>
      <p className="text-sm opacity-70">{gift.song?.title || 'Your song goes here'}</p>
      {gift.song?.src ? (
        <audio
          controls
          src={gift.song.src}
          className="w-full"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      ) : (
        <button className="btn" onClick={() => setPlaying((p) => !p)}>
          {playing ? 'Pause' : 'Play the mixtape'}
        </button>
      )}
      {!photos.length && <Placeholder note="Add her photos here to spin on the disc." />}
    </div>
  )
}

function Photobooth({ gift }: { gift: Gift }) {
  const photos: string[] = gift.photos ?? []
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="hand text-2xl text-gold-soft">{gift.caption}</p>
      <div className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: '#f1e5cd' }}>
        {(photos.length ? photos : [1, 2, 3, 4]).map((p, i) => (
          <div
            key={i}
            className="grid place-items-center"
            style={{
              width: 150,
              height: 100,
              background:
                typeof p === 'string' ? `center/cover url(${p})` : 'rgba(58,44,26,0.12)',
              color: '#3a2c1a',
              borderRadius: 4,
            }}
          >
            {typeof p !== 'string' && <span className="hand text-lg">photo {i + 1}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function Magazine({ gift }: { gift: Gift }) {
  const pages: any[] = gift.pages ?? []
  const [i, setI] = useState(0)
  const total = pages.length || 1
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="paper p-5 w-full" style={{ minHeight: 220 }}>
        {pages.length ? (
          <div className="text-center">
            <p className="display text-2xl" style={{ color: '#3a2c1a' }}>
              {pages[i]?.title}
            </p>
            {pages[i]?.image && <img src={pages[i].image} alt="" className="rounded my-3" />}
            <p className="hand text-xl" style={{ color: '#7a5a2a' }}>
              {pages[i]?.text}
            </p>
          </div>
        ) : (
          <Placeholder note="Design her magazine pages here." />
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="btn-ghost btn text-sm" onClick={() => setI((v) => Math.max(0, v - 1))}>
          ‹
        </button>
        <span className="text-xs opacity-60">
          {i + 1} / {total}
        </span>
        <button
          className="btn-ghost btn text-sm"
          onClick={() => setI((v) => Math.min(total - 1, v + 1))}
        >
          ›
        </button>
      </div>
    </div>
  )
}

function Reel({ gift }: { gift: Gift }) {
  const clips: any[] = gift.clips ?? []
  if (!clips.length)
    return <Placeholder note="Drop in her video clips and photos here." />
  return (
    <div className="flex flex-col gap-3">
      {clips.map((c, i) =>
        c.type === 'video' ? (
          <video key={i} src={c.src} controls className="rounded-lg w-full" />
        ) : (
          <img key={i} src={c.src} alt="" className="rounded-lg w-full" />
        ),
      )}
    </div>
  )
}

function Coupons({ gift }: { gift: Gift }) {
  const coupons: any[] = gift.coupons ?? []
  return (
    <div className="flex flex-col gap-3">
      {coupons.map((c, i) => (
        <div key={i} className="paper p-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full grid place-items-center shrink-0"
            style={{ background: 'rgba(226,189,104,0.35)', color: '#3a2c1a' }}
          >
            ✦
          </div>
          <div>
            <p className="display text-lg" style={{ color: '#3a2c1a' }}>
              {c.name}
            </p>
            <p className="hand text-lg" style={{ color: '#7a5a2a' }}>
              {c.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function DarkWeb({ gift }: { gift: Gift }) {
  const entries: any[] = gift.entries ?? []
  const [q, setQ] = useState('')
  const [res, setRes] = useState<any | null>(null)
  const [miss, setMiss] = useState(false)
  const match = useMemo(
    () => entries.find((e) => e.name?.toLowerCase() === q.trim().toLowerCase()),
    [q, entries],
  )
  return (
    <div>
      <p className="hand text-2xl text-gold-soft mb-3">{gift.prompt}</p>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="type a name…"
          className="flex-1 px-3 py-2 rounded-lg outline-none text-sm"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(226,189,104,0.3)' }}
        />
        <button
          className="btn text-sm"
          onClick={() => {
            if (match) {
              setRes(match)
              setMiss(false)
            } else {
              setRes(null)
              setMiss(true)
            }
          }}
        >
          Search
        </button>
      </div>
      {res && (
        <div className="paper p-4 mt-3 text-center">
          <p className="display text-xl" style={{ color: '#3a2c1a' }}>
            {res.title || res.name}
          </p>
          {res.image && <img src={res.image} alt="" className="rounded my-2" />}
          <p className="hand text-xl" style={{ color: '#7a5a2a' }}>
            {res.text}
          </p>
        </div>
      )}
      {miss && (
        <p className="text-sm opacity-70 mt-3">
          No records found… yet. (Add people and their secrets here.)
        </p>
      )}
    </div>
  )
}

function Stickers({ gift }: { gift: Gift }) {
  const stickers: string[] = gift.stickers ?? []
  if (!stickers.length) return <Placeholder note="Add her funny sticker images here." />
  return (
    <div className="grid grid-cols-3 gap-2">
      {stickers.map((s, i) => (
        <img key={i} src={s} alt="" className="w-full rounded-lg" />
      ))}
    </div>
  )
}

function Spinner({ gift }: { gift: Gift }) {
  const options: string[] = gift.options ?? []
  const [angle, setAngle] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const n = options.length || 1

  function spin() {
    if (spinning) return
    setSpinning(true)
    setResult(null)
    const extra = 1080 + Math.floor(Math.random() * 360)
    const next = angle + extra
    setAngle(next)
    window.setTimeout(() => {
      const seg = 360 / n
      const idx = Math.floor((((next % 360) + 90) % 360) / seg) % n
      setResult(options[idx])
      setSpinning(false)
    }, 2200)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="rounded-full relative"
        style={{
          width: 180,
          height: 180,
          background: `conic-gradient(${options
            .map((_, i) => {
              const cols = ['#ff6fa5', '#ffd23f', '#4cc9f0', '#8ac926', '#9d4edd', '#ff8c42']
              return `${cols[i % 6]} ${(i * 100) / n}% ${((i + 1) * 100) / n}%`
            })
            .join(', ')})`,
          border: '6px solid rgba(226,189,104,0.6)',
        }}
        animate={{ rotate: angle }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <button className="btn" onClick={spin} disabled={spinning}>
        {spinning ? 'Spinning…' : 'Tell my future'}
      </button>
      {result && (
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="display text-2xl text-gold text-center"
        >
          {result}
        </motion.p>
      )}
    </div>
  )
}

export default function GiftView({ gift, onClose }: { gift: Gift; onClose: () => void }) {
  const body = (() => {
    switch (gift.type) {
      case 'jar':
        return <Jar stars={gift.stars ?? []} from={gift.from} />
      case 'certificate':
        return <Certificate gift={gift} />
      case 'cd':
        return <CD gift={gift} />
      case 'photobooth':
        return <Photobooth gift={gift} />
      case 'magazine':
        return <Magazine gift={gift} />
      case 'reel':
        return <Reel gift={gift} />
      case 'coupons':
        return <Coupons gift={gift} />
      case 'darkweb':
        return <DarkWeb gift={gift} />
      case 'stickers':
        return <Stickers gift={gift} />
      case 'spinner':
        return <Spinner gift={gift} />
      default:
        return <Placeholder note="Coming soon." />
    }
  })()

  return (
    <Frame onClose={onClose}>
      <p className="eyebrow mb-1">{gift.title}</p>
      <h3 className="display text-3xl text-cream mb-4">{gift.title}</h3>
      {body}
    </Frame>
  )
}
