import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Blossom } from './Motifs'

type Cell = 'X' | 'O' | null
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function winner(b: Cell[]): Cell | 'draw' | null {
  for (const [a, c, d] of LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]
  return b.every(Boolean) ? 'draw' : null
}

function bestMove(b: Cell[], me: 'X' | 'O'): number {
  const other: 'X' | 'O' = me === 'O' ? 'X' : 'O'
  function score(board: Cell[], turn: 'X' | 'O', depth: number): number {
    const w = winner(board)
    if (w === me) return 10 - depth
    if (w === other) return depth - 10
    if (w === 'draw') return 0
    let best = turn === me ? -Infinity : Infinity
    for (let i = 0; i < 9; i++) {
      if (board[i]) continue
      board[i] = turn
      const s = score(board, turn === 'X' ? 'O' : 'X', depth + 1)
      board[i] = null
      best = turn === me ? Math.max(best, s) : Math.min(best, s)
    }
    return best
  }
  let bestScore = -Infinity
  let move = -1
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue
    b[i] = me
    const s = score(b, other, 0)
    b[i] = null
    if (s > bestScore) {
      bestScore = s
      move = i
    }
  }
  return move
}

export default function TicTacToe({
  onEnd,
  oppLabel,
}: {
  onEnd: (r: 'win' | 'lose' | 'draw') => void
  oppLabel: string
}) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [turn, setTurn] = useState<'X' | 'O'>('X')
  const ended = useRef(false)

  useEffect(() => {
    const w = winner(board)
    if (w && !ended.current) {
      ended.current = true
      const r = w === 'X' ? 'win' : w === 'draw' ? 'draw' : 'lose'
      window.setTimeout(() => onEnd(r), 1000)
    }
  }, [board, onEnd])

  useEffect(() => {
    if (turn !== 'O' || ended.current) return
    const t = window.setTimeout(() => {
      setBoard((b) => {
        const nb = [...b]
        const empties = nb.map((c, i) => (c ? null : i)).filter((i): i is number => i !== null)
        if (!empties.length) return nb
        const move =
          Math.random() < 0.22 ? empties[Math.floor(Math.random() * empties.length)] : bestMove(nb, 'O')
        nb[move < 0 ? empties[0] : move] = 'O'
        return nb
      })
      setTurn('X')
    }, 560)
    return () => window.clearTimeout(t)
  }, [turn])

  function play(i: number) {
    if (board[i] || turn !== 'X' || ended.current) return
    setBoard((b) => {
      const nb = [...b]
      nb[i] = 'X'
      return nb
    })
    setTurn('O')
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs opacity-65">
        You are the blossom · {oppLabel} is the ring
      </p>
      <div
        className="grid grid-cols-3 gap-2 p-3 rounded-2xl"
        style={{
          background: 'linear-gradient(180deg,#f6efdd,#e6d5b2)',
          boxShadow: '0 20px 44px rgba(0,0,0,.5)',
        }}
      >
        {board.map((c, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            className="grid place-items-center rounded-lg"
            style={{
              width: 74,
              height: 74,
              background: 'rgba(58,44,26,0.05)',
              border: '1px solid rgba(58,44,26,0.20)',
            }}
            aria-label={`Cell ${i + 1}`}
          >
            {c === 'X' && (
              <motion.div initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <Blossom size={36} color="#c8102e" />
              </motion.div>
            )}
            {c === 'O' && (
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  border: '3px solid #e3b23c',
                  boxShadow: '0 0 12px rgba(227,178,60,.5)',
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
