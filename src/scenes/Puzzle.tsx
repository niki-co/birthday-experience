import { useState } from 'react'
import type { CSSProperties } from 'react'
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { motion } from 'motion/react'
import { useStore } from '../lib/store'
import content from '../content.json'

const N = 9
const COLS = ['#ff6fa5', '#ffd23f', '#4cc9f0', '#8ac926', '#9d4edd', '#ff8c42', '#e8809b', '#e2bd68', '#5bc0be']

function Piece({ i, placed }: { i: number; placed: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `p${i}`,
    disabled: placed,
  })
  const style: CSSProperties = {
    background: COLS[i % COLS.length],
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 60 : 1,
    opacity: placed ? 0 : 1,
    touchAction: 'none',
  }
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="w-14 h-14 rounded-lg grid place-items-center play text-lg text-ink shadow-lg"
      aria-label={`Piece ${i + 1}`}
    >
      {i + 1}
    </button>
  )
}

function Slot({ i, filled }: { i: number; filled: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: `s${i}` })
  return (
    <div
      ref={setNodeRef}
      className="w-14 h-14 rounded-lg grid place-items-center transition-colors"
      style={{
        background: filled ? COLS[i % COLS.length] : 'rgba(255,255,255,0.05)',
        border: `1px ${filled ? 'solid' : 'dashed'} ${
          isOver ? 'rgba(226,189,104,0.9)' : 'rgba(247,239,225,0.22)'
        }`,
        opacity: filled ? 0.55 : 1,
      }}
    >
      {!filled && <span className="text-[0.7rem] opacity-40">{i + 1}</span>}
    </div>
  )
}

export default function Puzzle() {
  const { advance, puzzle, setPuzzle } = useStore()
  const [placed, setPlaced] = useState<number[]>(puzzle ?? [])
  const done = placed.length === N
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 80, tolerance: 8 } }),
  )

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over) return
    const piece = Number(String(active.id).slice(1))
    const slot = Number(String(over.id).slice(1))
    if (piece === slot && !placed.includes(piece)) {
      const next = [...placed, piece]
      setPlaced(next)
      setPuzzle(next)
    }
  }

  return (
    <div className="stage">
      <div className="wrap flex flex-col items-center gap-5 text-center">
        <p className="eyebrow">{content.puzzle.eyebrow}</p>
        <h2 className="display text-3xl text-cream max-w-xs">
          Put the pieces where they belong.
        </h2>

        {!done ? (
          <>
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl card">
              {Array.from({ length: N }).map((_, i) => (
                <Slot key={i} i={i} filled={placed.includes(i)} />
              ))}
            </div>

            <DndContext sensors={sensors} onDragEnd={onDragEnd}>
              <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                {Array.from({ length: N }, (_, i) => i)
                  .filter((i) => !placed.includes(i))
                  .map((i) => (
                    <Piece key={i} i={i} placed={false} />
                  ))}
              </div>
            </DndContext>
            <p className="text-xs opacity-55">
              Drag each piece onto its matching number.
            </p>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            className="card p-6 flex flex-col items-center gap-3"
          >
            <span className="display text-4xl text-gold">
              {content.puzzle.cardTitle}
            </span>
            <p className="text-sm opacity-75">{content.puzzle.clue}</p>
            <p className="hand text-2xl text-gold-soft">{content.puzzle.reveal}</p>
          </motion.div>
        )}

        {done && (
          <button className="btn" onClick={advance}>
            One last thing
          </button>
        )}
      </div>
    </div>
  )
}
