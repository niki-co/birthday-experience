import { useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../lib/store'
import content from '../content.json'
import { MoonGate, Petals, Seal } from '../components/Motifs'

export default function Password() {
  const { advance, unlock } = useStore()
  const [val, setVal] = useState('')
  const [wrong, setWrong] = useState(0)
  const [ok, setOk] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (val.trim() === String(content.password.answer)) {
      setOk(true)
      unlock()
      window.setTimeout(advance, 1000)
    } else {
      setWrong((w) => w + 1)
    }
  }

  return (
    <div className="stage">
      <Petals count={7} />
      <div className="wrap flex flex-col items-center text-center gap-5">
        <p className="eyebrow">{content.password.eyebrow}</p>

        <motion.h2
          key={wrong}
          className="display text-2xl text-moon max-w-xs"
          animate={wrong ? { x: [0, -10, 10, -6, 0] } : { x: 0 }}
          transition={{ duration: 0.45 }}
        >
          {ok ? 'Unlocked.' : content.password.prompt}
        </motion.h2>

        <MoonGate size={230}>
          <div className="flex flex-col items-center gap-3 px-5">
            {ok ? (
              <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Seal text="启" size={76} rotate={-6} />
              </motion.div>
            ) : (
              <form onSubmit={submit} className="flex flex-col items-center gap-3">
                <input
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  value={val}
                  onChange={(e) => setVal(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="text-center play text-3xl tracking-[0.5em] py-3 rounded-xl outline-none"
                  style={{
                    width: 148,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(227,178,60,0.4)',
                    color: '#f0d38a',
                  }}
                />
                <button className="btn-red btn text-sm" type="submit">
                  Unlock
                </button>
              </form>
            )}
          </div>
        </MoonGate>

        <p className="text-xs opacity-65 max-w-xs">{content.password.hint}</p>
        {wrong > 0 && !ok && (
          <p className="text-xs" style={{ color: '#e0505f' }}>
            Not that year. Try again — you know this one.
          </p>
        )}
      </div>
    </div>
  )
}
