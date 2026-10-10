import { useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../lib/store'
import content from '../content.json'
import GiftView from '../components/GiftView'
import { Petals } from '../components/Motifs'

export default function Gifts() {
  const { advance, giftsOpened, openGift, addPoints } = useStore()
  const [active, setActive] = useState<string | null>(null)
  const gifts = content.gifts

  function open(id: string) {
    setActive(id)
    if (!giftsOpened.includes(id)) {
      const g = gifts.find((x) => x.id === id)
      openGift(id)
      if (g) addPoints(g.points ?? 0)
    }
  }

  const openedCount = gifts.filter((g) => giftsOpened.includes(g.id)).length
  const allOpened = openedCount === gifts.length
  const current = gifts.find((g) => g.id === active) ?? null

  return (
    <div className="stage">
      <Petals count={6} />
      <div className="wrap flex flex-col items-center gap-5 text-center">
        <p className="eyebrow">The gifts</p>
        <div className="flex flex-col items-center gap-1">
          <span className="brush text-3xl" style={{ color: '#e0505f' }}>
            礼物
          </span>
          <h2 className="display text-4xl text-moon">Ten gifts. Two points each.</h2>
        </div>
        <p className="text-sm opacity-70 max-w-xs">
          Open them all — the points add up to something. {openedCount}/{gifts.length} opened.
        </p>

        <div className="grid grid-cols-2 gap-3 w-full">
          {gifts.map((g, i) => {
            const done = giftsOpened.includes(g.id)
            return (
              <motion.button
                key={g.id}
                onClick={() => open(g.id)}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative overflow-hidden rounded-2xl p-4 flex flex-col items-center gap-2"
                style={{
                  minHeight: 122,
                  background: 'linear-gradient(180deg, rgba(227,178,60,0.10), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(227,178,60,0.28)',
                  boxShadow: '0 12px 30px rgba(0,0,0,.35)',
                }}
              >
                <span
                  className="seal"
                  style={{ width: 26, height: 26, fontSize: 12, transform: 'none' }}
                >
                  <span className="brush">{i + 1}</span>
                </span>
                <span className="display text-base text-gold-soft leading-tight">{g.title}</span>
                <span
                  className="absolute top-2 right-2 text-[0.62rem] px-2 py-0.5 rounded-full"
                  style={{
                    background: done ? 'rgba(58,157,143,0.28)' : 'rgba(227,178,60,0.18)',
                    color: done ? '#bff0e6' : '#f0d38a',
                  }}
                >
                  {done ? 'opened' : '+2'}
                </span>
              </motion.button>
            )
          })}
        </div>

        <button className={allOpened ? 'btn-red btn' : 'btn-ghost btn text-sm'} onClick={advance}>
          {allOpened ? 'I have them all' : 'Skip to the end'}
        </button>
      </div>

      {current && <GiftView gift={current} onClose={() => setActive(null)} />}
    </div>
  )
}
