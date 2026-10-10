import { motion } from 'motion/react'
import { useStore } from '../lib/store'
import content from '../content.json'
import { Petals } from '../components/Motifs'

export default function Notes() {
  const { advance } = useStore()
  const n = content.notes
  const items: any[] = n.items ?? []

  return (
    <div className="stage">
      <Petals count={8} />
      <div className="wrap flex flex-col items-center gap-6 text-center">
        <p className="eyebrow">{n.eyebrow}</p>
        <div className="flex flex-col items-center gap-1">
          <span className="brush text-3xl" style={{ color: '#e0505f' }}>
            寄语
          </span>
          <h2 className="display text-4xl text-moon">{n.title}</h2>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {items.length ? (
            items.map((it, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="paper p-4 text-left"
              >
                {it.image && <img src={it.image} alt="" className="rounded mb-2" />}
                <p className="hand text-2xl leading-snug" style={{ color: '#3a2c1a' }}>
                  {it.text}
                </p>
              </motion.div>
            ))
          ) : (
            <div
              className="rounded-xl p-6 text-sm opacity-70"
              style={{ border: '1px dashed rgba(246,240,228,0.25)' }}
            >
              Your notes, messages and chats go here.
            </div>
          )}
        </div>

        <motion.p
          className="hand text-3xl text-gold-soft max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {n.goodbye}
        </motion.p>

        <button className="btn-red btn" onClick={advance}>
          Close the book
        </button>
      </div>
    </div>
  )
}
