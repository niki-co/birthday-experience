import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getRealNow, isUnlocked } from './time'
import content from '../content.json'

// The order of the whole journey.
export const SCENES = [
  'invitation',
  'password',
  'delivery',
  'unwrap',
  'celebration',
  'applause',
  'gifts',
  'reveal',
  'notes',
  'close',
  'keepsake',
] as const

export type SceneId = (typeof SCENES)[number]

type Persisted = {
  sceneIndex: number
  points: number
  unlocked: boolean
  completed: Record<string, boolean>
  giftsOpened: string[]
  puzzle: number[] | null
}

const KEY = 'happy20.v1'

const EMPTY: Persisted = {
  sceneIndex: 0,
  points: 0,
  unlocked: false,
  completed: {},
  giftsOpened: [],
  puzzle: null,
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw)
    return { ...EMPTY, ...parsed }
  } catch {
    return { ...EMPTY }
  }
}

type Ctx = Persisted & {
  scene: SceneId
  now: number
  timeReady: boolean
  open: boolean
  advance: () => void
  goTo: (id: SceneId) => void
  addPoints: (n: number) => void
  unlock: () => void
  openGift: (id: string) => void
  setPuzzle: (p: number[]) => void
  reset: () => void
  maxPoints: number
}

const StoreContext = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(() => load())
  const [now, setNow] = useState<number>(() => Date.now())
  const [timeReady, setTimeReady] = useState(false)

  // Fetch real time once, then tick locally every second.
  useEffect(() => {
    let alive = true
    getRealNow().then((t) => {
      if (!alive) return
      setNow(t)
      setTimeReady(true)
    })
    const id = setInterval(() => setNow((n) => n + 1000), 1000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  // Persist whenever state changes.
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore quota / private mode */
    }
  }, [state])

  const maxPoints = useMemo(
    () => content.gifts.reduce((sum, g) => sum + (g.points ?? 0), 0),
    [],
  )

  const advance = useCallback(() => {
    setState((s) => {
      const current = SCENES[s.sceneIndex]
      const nextIndex = Math.min(SCENES.length - 1, s.sceneIndex + 1)
      return {
        ...s,
        completed: { ...s.completed, [current]: true },
        sceneIndex: nextIndex,
      }
    })
  }, [])

  const goTo = useCallback((id: SceneId) => {
    const idx = SCENES.indexOf(id)
    if (idx >= 0) setState((s) => ({ ...s, sceneIndex: idx }))
  }, [])

  const addPoints = useCallback((n: number) => {
    setState((s) => ({ ...s, points: s.points + n }))
  }, [])

  const unlock = useCallback(() => {
    setState((s) => ({ ...s, unlocked: true }))
  }, [])

  const openGift = useCallback((id: string) => {
    setState((s) => {
      if (s.giftsOpened.includes(id)) return s
      return { ...s, giftsOpened: [...s.giftsOpened, id] }
    })
  }, [])

  const setPuzzle = useCallback((p: number[]) => {
    setState((s) => ({ ...s, puzzle: p }))
  }, [])

  const reset = useCallback(() => {
    setState({ ...EMPTY })
  }, [])

  const open = useMemo(
    () => state.unlocked || isUnlocked(content.invitation.unlockISO, now),
    [state.unlocked, now],
  )

  const value: Ctx = {
    ...state,
    scene: SCENES[state.sceneIndex],
    now,
    timeReady,
    open,
    advance,
    goTo,
    addPoints,
    unlock,
    openGift,
    setPuzzle,
    reset,
    maxPoints,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
