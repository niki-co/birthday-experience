import { motion } from 'motion/react'
import { useStore } from '../lib/store'
import content from '../content.json'
import { Petals, Seal } from '../components/Motifs'

type Keep = { label: string; href: string; kind?: 'image' | 'file' | 'link' }

async function save(item: Keep) {
  try {
    if (item.kind === 'image' && (navigator as any).share) {
      const res = await fetch(item.href)
      const blob = await res.blob()
      const file = new File([blob], item.label || 'image', { type: blob.type })
      if ((navigator as any).canShare?.({ files: [file] })) {
        await (navigator as any).share({ files: [file] })
        return
      }
    }
  } catch {
    /* fall through */
  }
  const a = document.createElement('a')
  a.href = item.href
  a.download = item.label || ''
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export default function Keepsake() {
  const { reset } = useStore()
  const k = content.keepsakes
  const items: Keep[] = k.items ?? []

  return (
    <div className="stage">
      <Petals count={9} />
      <div className="wrap flex flex-col items-center gap-6 text-center">
        <p className="eyebrow">{k.eyebrow}</p>
        <div className="flex flex-col items-center gap-1">
          <span className="brush text-3xl" style={{ color: '#e0505f' }}>
            留念
          </span>
          <h2 className="display text-4xl text-moon">{k.title}</h2>
        </div>
        <p className="text-sm opacity-70 max-w-xs">{k.message}</p>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="scroll-paper w-full rounded-lg overflow-hidden"
          style={{ borderTop: '6px solid #d9b45b', borderBottom: '6px solid #d9b45b' }}
        >
          <div className="p-4 flex flex-col gap-3">
            {items.length ? (
              items.map((it, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  onClick={() => save(it)}
                  className="flex items-center justify-between gap-3 px-3 py-3 rounded-lg text-left"
                  style={{ background: 'rgba(58,44,26,0.08)' }}
                >
                  <span className="display text-lg" style={{ color: '#3a2c1a' }}>
                    {it.label}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: '#3a2c1a', color: '#f1e5cd' }}>
                    save
                  </span>
                </motion.button>
              ))
            ) : (
              <p className="hand text-2xl" style={{ color: '#3a2c1a' }}>
                Add the files you want her to keep — the magazine, photos, videos, song, star notes,
                coupons — and each one gets its own save button here.
              </p>
            )}
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <Seal text="留" size={40} rotate={-6} />
          <p className="hand text-2xl text-gold-soft">Everything here is yours to keep.</p>
        </div>

        <button className="btn-ghost btn text-sm" onClick={reset}>
          Replay from the start
        </button>
      </div>
    </div>
  )
}
