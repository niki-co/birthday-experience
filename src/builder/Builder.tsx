import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import base from '../content.json'
import { Lantern, Petals } from '../components/Motifs'

type C = any
const deep = (o: any): C => JSON.parse(JSON.stringify(o))

function readFiles(files: FileList | null): Promise<string[]> {
  if (!files || !files.length) return Promise.resolve([])
  return Promise.all(
    Array.from(files).map(
      (f) =>
        new Promise<string>((res) => {
          const r = new FileReader()
          r.onload = () => res(String(r.result))
          r.readAsDataURL(f)
        }),
    ),
  )
}

type Kind = 'text' | 'number' | 'datetime' | 'photos' | 'photo' | 'audio' | 'video' | 'list'
type Step = {
  key: string
  q: string
  hint?: string
  kind: Kind
  fields?: { key: string; label: string }[]
  commit: (d: C, v: any) => void
}

const STEPS: Step[] = [
  { key: 'name', kind: 'text', q: "Hi — let's make something lovely. What's their name?", commit: (d, v) => { d.meta.name = v; d.invitation.title = `For ${v}` } },
  { key: 'from', kind: 'text', q: 'And what should they call you?', commit: (d, v) => { d.meta.from = v; d.gifts[0].from = v } },
  { key: 'turning', kind: 'number', q: 'How old are they turning?', hint: 'a number, e.g. 20', commit: (d, v) => { d.meta.turning = Number(v) || 20; d.celebration.candleCount = Number(v) || 20 } },
  { key: 'unlock', kind: 'datetime', q: 'When should it unlock?', hint: 'leave blank to open right away', commit: (d, v) => { d.invitation.unlockISO = v ? new Date(v).toISOString() : '' } },
  { key: 'pw', kind: 'text', q: 'Pick a password — the year they were born works well.', commit: (d, v) => { d.password.answer = v } },
  { key: 'welcome', kind: 'text', q: 'A short welcome line for the sealed letter.', commit: (d, v) => { d.invitation.message = v } },
  { key: 'tvphotos', kind: 'photos', q: 'Add a few photos for the little TV beside the letter.', hint: 'optional — you can skip', commit: (d, v) => { d.invitation.photos = v } },
  { key: 'cakephoto', kind: 'photo', q: 'A photo to reveal at the cake.', hint: 'optional', commit: (d, v) => { d.celebration.photo = v } },
  { key: 'stars', kind: 'list', q: 'Gift 1 — the Jar of Stars. Add a note, a wish, or a dare.', hint: 'add as many as you like', fields: [{ key: 'type', label: 'type (note / wish / dare)' }, { key: 'text', label: 'the words' }], commit: (d, v) => { d.gifts[0].stars = v.map((x: any) => ({ type: x.type || 'note', text: x.text || '' })) } },
  { key: 'cert', kind: 'text', q: 'Gift 2 — the certificate. What funny thing does it award?', commit: (d, v) => { d.gifts[1].body = v } },
  { key: 'cd', kind: 'photos', q: 'Gift 3 — the mixtape. Add her photos for the disc.', hint: 'optional', commit: (d, v) => { d.gifts[2].photos = v } },
  { key: 'song', kind: 'audio', q: 'Add the song for the mixtape.', hint: 'optional', commit: (d, v) => { d.gifts[2].song = { title: 'Our song', artist: '', src: v || '' } } },
  { key: 'booth', kind: 'photos', q: 'Gift 4 — the photo booth. Add four photos.', hint: 'optional', commit: (d, v) => { d.gifts[3].photos = v } },
  { key: 'mag', kind: 'photos', q: 'Gift 5 — the magazine. Add her photos for the pages.', hint: 'optional', commit: (d, v) => { d.gifts[4].pages = v.map((src: string) => ({ title: '', text: '', image: src })) } },
  { key: 'reel', kind: 'video', q: 'Gift 6 — the highlight reel. Add a video.', hint: 'optional', commit: (d, v) => { d.gifts[5].clips = v ? [{ type: 'video', src: v }] : [] } },
  { key: 'coupons', kind: 'list', q: 'Gift 7 — the coupons. Add the ones you promise.', hint: 'optional', fields: [{ key: 'name', label: 'coupon name' }, { key: 'detail', label: 'what it gets them' }], commit: (d, v) => { d.gifts[6].coupons = v } },
  { key: 'archive', kind: 'list', q: 'Gift 8 — the archive. Add names and their "secrets".', hint: 'optional', fields: [{ key: 'name', label: 'name' }, { key: 'text', label: 'the secret' }], commit: (d, v) => { d.gifts[7].entries = v } },
  { key: 'stickers', kind: 'photos', q: 'Gift 9 — the sticker pack. Add funny photos.', hint: 'optional', commit: (d, v) => { d.gifts[8].stickers = v } },
  { key: 'spinner', kind: 'list', q: 'Gift 10 — the future teller. Add the outcomes.', hint: 'optional', fields: [{ key: 'text', label: 'outcome' }], commit: (d, v) => { d.gifts[9].options = v.map((x: any) => x.text || '') } },
  { key: 'notes', kind: 'list', q: 'Any personal notes before the goodbye?', hint: 'optional', fields: [{ key: 'text', label: 'note' }], commit: (d, v) => { d.notes.items = v.map((x: any) => ({ text: x.text || '' })) } },
  { key: 'goodbye', kind: 'text', q: 'And the final goodbye line?', commit: (d, v) => { d.notes.goodbye = v } },
]

function exportPage(data: C) {
  const clone = document.documentElement.cloneNode(true) as HTMLElement
  const root = clone.querySelector('#root')
  if (root) root.innerHTML = ''
  let s = clone.querySelector('#bd-content') as HTMLElement | null
  if (!s) {
    s = document.createElement('script')
    s.id = 'bd-content'
    clone.querySelector('body')?.prepend(s)
  }
  s.textContent = `window.__BIRTHDAY_CONTENT__ = ${JSON.stringify(data)};`
  const html = '<!doctype html>\n' + clone.outerHTML
  const blob = new Blob([html], { type: 'text/html' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${(data.meta?.name || 'birthday').replace(/\s+/g, '-')}-birthday.html`
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function Builder() {
  const [data, setData] = useState<C>(() => deep(base))
  const [i, setI] = useState(0)
  const [log, setLog] = useState<{ q: string; a: string }[]>([])
  const [text, setText] = useState('')
  const [files, setFiles] = useState<string[]>([])
  const [list, setList] = useState<any[]>([])
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const step = STEPS[i]
  const done = i >= STEPS.length

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: 'smooth' })
  }, [i, log.length])

  function summary(kind: Kind, v: any): string {
    if (kind === 'photos') return `${v.length} photo${v.length === 1 ? '' : 's'} added`
    if (kind === 'photo' || kind === 'audio' || kind === 'video') return v ? 'file added' : 'skipped'
    if (kind === 'list') return `${v.length} added`
    return String(v)
  }

  function commit(v: any) {
    const next = deep(data)
    step.commit(next, v)
    setData(next)
    setLog((l) => [...l, { q: step.q, a: summary(step.kind, v) }])
    setText('')
    setFiles([])
    setList([])
    setI((n) => n + 1)
  }

  function reset() {
    setData(deep(base))
    setI(0)
    setLog([])
    setText('')
    setFiles([])
    setList([])
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>, multi: boolean) {
    setBusy(true)
    const urls = await readFiles(e.target.files)
    setFiles(multi ? [...files, ...urls] : urls.slice(0, 1))
    setBusy(false)
  }

  const canNext =
    step?.kind === 'photos'
      ? true
      : step?.kind === 'photo' || step?.kind === 'audio' || step?.kind === 'video'
        ? true
        : step?.kind === 'list'
          ? true
          : step?.kind === 'number' || step?.kind === 'datetime'
            ? true
            : text.trim().length > 0

  return (
    <div className="stage" style={{ justifyContent: 'flex-start' }}>
      <Petals count={6} />
      <div className="wrap flex flex-col gap-4" style={{ minHeight: '100dvh', paddingTop: 8 }}>
        <div className="flex items-center gap-3">
          <Lantern delay={0} scale={0.7} />
          <div>
            <p className="eyebrow">The maker</p>
            <h1 className="display text-2xl text-moon">Let's build their birthday</h1>
          </div>
          <span className="ml-auto text-xs opacity-60">
            {Math.min(i + 1, STEPS.length)}/{STEPS.length}
          </span>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1"
          style={{ maxHeight: '62dvh' }}
        >
          {log.map((m, k) => (
            <div key={k} className="flex flex-col gap-1">
              <div className="self-end max-w-[85%] card px-3 py-2 text-sm text-gold-soft">{m.a}</div>
              <div className="self-start max-w-[85%] text-sm opacity-80">{m.q}</div>
            </div>
          ))}

          {!done && (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="self-start max-w-[90%] card px-4 py-3"
            >
              <p className="text-sm text-moon">{step.q}</p>
              {step.hint && <p className="text-xs opacity-60 mt-1">{step.hint}</p>}
            </motion.div>
          )}

          {done && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-5 text-center flex flex-col gap-3">
              <span className="brush text-3xl" style={{ color: '#e0505f' }}>
                好了
              </span>
              <h2 className="display text-2xl text-moon">It's ready.</h2>
              <p className="text-sm opacity-75">
                Download the page, then send it — or host it. Everything you entered is inside the
                one file.
              </p>
              <button className="btn-red btn" onClick={() => exportPage(data)}>
                Download {data.meta?.name || 'their'}'s page
              </button>
              <button className="btn-ghost btn text-sm" onClick={reset}>
                Start over
              </button>
            </motion.div>
          )}
        </div>

        {!done && (
          <div className="card p-3 flex flex-col gap-3">
            {(step.kind === 'text' || step.kind === 'number') && (
              <div className="flex gap-2">
                <input
                  autoFocus
                  inputMode={step.kind === 'number' ? 'numeric' : 'text'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && canNext && commit(text.trim())}
                  placeholder="type here…"
                  className="flex-1 px-3 py-2 rounded-lg outline-none text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(227,178,60,0.3)' }}
                />
                <button className="btn text-sm" disabled={!canNext} onClick={() => commit(text.trim())}>
                  Next
                </button>
              </div>
            )}

            {step.kind === 'datetime' && (
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg outline-none text-sm"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(227,178,60,0.3)', color: '#f6f0e4' }}
                />
                <button className="btn text-sm" onClick={() => commit(text)}>
                  Next
                </button>
              </div>
            )}

            {(step.kind === 'photos' || step.kind === 'photo' || step.kind === 'audio' || step.kind === 'video') && (
              <div className="flex flex-col gap-2">
                <label className="btn-ghost btn text-sm text-center cursor-pointer">
                  {busy ? 'reading…' : step.kind === 'photos' ? 'Choose photos' : step.kind === 'video' ? 'Choose a video' : step.kind === 'audio' ? 'Choose a song' : 'Choose a photo'}
                  <input
                    type="file"
                    hidden
                    accept={step.kind === 'video' ? 'video/*' : step.kind === 'audio' ? 'audio/*' : 'image/*'}
                    multiple={step.kind === 'photos'}
                    onChange={(e) => onFiles(e, step.kind === 'photos')}
                  />
                </label>
                {files.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {files.slice(0, 8).map((f, k) =>
                      f.startsWith('data:image') ? (
                        <img key={k} src={f} alt="" style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 8 }} />
                      ) : (
                        <span key={k} className="text-xs opacity-70">file added</span>
                      ),
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <button className="btn text-sm" onClick={() => commit(step.kind === 'photos' ? files : files[0] || '')}>
                    Next
                  </button>
                  <button className="btn-ghost btn text-sm" onClick={() => commit(step.kind === 'photos' ? [] : '')}>
                    Skip
                  </button>
                </div>
              </div>
            )}

            {step.kind === 'list' && (
              <div className="flex flex-col gap-2">
                {list.map((row, k) => (
                  <div key={k} className="flex gap-2 items-center">
                    {step.fields?.map((f) => (
                      <input
                        key={f.key}
                        placeholder={f.label}
                        value={row[f.key] || ''}
                        onChange={(e) => setList((l) => l.map((r, ri) => (ri === k ? { ...r, [f.key]: e.target.value } : r)))}
                        className="flex-1 px-2 py-1.5 rounded-md outline-none text-xs"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(227,178,60,0.25)' }}
                      />
                    ))}
                    <button className="text-xs opacity-70" onClick={() => setList((l) => l.filter((_, ri) => ri !== k))}>
                      ✕
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    className="btn-ghost btn text-sm"
                    onClick={() => setList((l) => [...l, Object.fromEntries((step.fields || []).map((f) => [f.key, '']))])}
                  >
                    + Add one
                  </button>
                  <button className="btn text-sm" onClick={() => commit(list)}>
                    Next
                  </button>
                  <button className="btn-ghost btn text-sm" onClick={() => commit([])}>
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
