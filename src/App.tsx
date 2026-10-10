import { AnimatePresence, motion } from 'motion/react'
import type { ComponentType } from 'react'
import { StoreProvider, useStore } from './lib/store'
import type { SceneId } from './lib/store'
import ProgressDots from './components/ProgressDots'
import Invitation from './scenes/Invitation'
import Password from './scenes/Password'
import Delivery from './scenes/Delivery'
import Unwrap from './scenes/Unwrap'
import Celebration from './scenes/Celebration'
import Applause from './scenes/Applause'
import Gifts from './scenes/Gifts'
import Puzzle from './scenes/Puzzle'
import Reveal from './scenes/Reveal'
import Notes from './scenes/Notes'
import Close from './scenes/Close'
import Keepsake from './scenes/Keepsake'
import Builder from './builder/Builder'

const MAP: Record<SceneId, ComponentType> = {
  invitation: Invitation,
  password: Password,
  delivery: Delivery,
  unwrap: Unwrap,
  celebration: Celebration,
  applause: Applause,
  gifts: Gifts,
  reveal: Reveal,
  notes: Notes,
  close: Close,
  keepsake: Keepsake,
}

function Journey() {
  const { scene, open } = useStore()
  const effective: SceneId = open ? scene : 'invitation'
  const Comp = MAP[effective]
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={effective}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%' }}
      >
        <Comp />
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const isBuild =
    typeof window !== 'undefined' && window.location.hash.replace('#', '') === 'build'
  if (isBuild) return <Builder />
  return (
    <StoreProvider>
      <ProgressDots />
      <Journey />
    </StoreProvider>
  )
}
