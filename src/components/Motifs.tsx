import { motion } from 'motion/react'
import { useMemo } from 'react'

/* ---------- Xiangyun (祥云) cloud, as a soft SVG swirl ---------- */
export function Cloud({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 40" className={className} style={style} aria-hidden="true">
      <path
        d="M6 30c-4 0-6-3-6-6s2-6 6-6c0-7 6-12 13-12 3-6 9-9 15-8 5 1 9 4 11 9 2-2 5-3 8-3 7 0 12 5 13 11 6 0 10 4 10 9 0 4-3 6-7 6H6z"
        fill="currentColor"
      />
      <circle cx="40" cy="12" r="3.4" fill="currentColor" opacity="0.85" />
    </svg>
  )
}

/* ---------- Plum blossom (梅花) ---------- */
export function Blossom({ size = 18, color = '#e79aa8' }: { size?: number; color?: string }) {
  const petals = [0, 72, 144, 216, 288]
  return (
    <svg width={size} height={size} viewBox="-12 -12 24 24" aria-hidden="true">
      {petals.map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy="-6"
          rx="3.1"
          ry="5"
          fill={color}
          transform={`rotate(${a})`}
          opacity="0.95"
        />
      ))}
      <circle cx="0" cy="0" r="2" fill="#f0d38a" />
    </svg>
  )
}

/* ---------- Lantern, gently swaying ---------- */
export function Lantern({
  style,
  delay = 0,
  scale = 1,
}: {
  style?: React.CSSProperties
  delay?: number
  scale?: number
}) {
  return (
    <div
      style={{
        transformOrigin: 'top center',
        animation: `sway ${3.4 + delay}s ease-in-out infinite`,
        scale,
        ...style,
      }}
    >
      {/* string */}
      <div
        style={{
          width: 1,
          height: 26,
          margin: '0 auto',
          background: 'linear-gradient(180deg, transparent, rgba(240,211,138,0.7))',
        }}
      />
      <div className="lantern" />
      {/* tassel */}
      <div
        style={{
          width: 2,
          height: 14,
          margin: '0 auto',
          background: 'linear-gradient(180deg,#e3b23c,#b98a24)',
        }}
      />
    </div>
  )
}

/* ---------- Seal / chop (印章) ---------- */
export function Seal({
  text,
  size = 54,
  rotate = -6,
}: {
  text: string
  size?: number
  rotate?: number
}) {
  return (
    <div
      className="seal"
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)`, fontSize: size * 0.36 }}
    >
      <span className="brush" style={{ letterSpacing: '0.05em', textAlign: 'center', lineHeight: 1 }}>
        {text}
      </span>
    </div>
  )
}

/* ---------- Moon gate (月洞门): a circular lattice frame ---------- */
export function MoonGate({
  children,
  size = 260,
}: {
  children?: React.ReactNode
  size?: number
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'relative',
        padding: 10,
        background: 'linear-gradient(160deg, rgba(227,178,60,0.35), rgba(200,16,46,0.25))',
        boxShadow: '0 22px 50px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '1px solid rgba(246,240,228,0.3)',
          background: 'radial-gradient(120% 120% at 50% 0%, #2a2036, #120d1a)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* ---------- Falling plum petals ---------- */
export function Petals({ count = 10 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: (i * 97) % 100,
        delay: (i * 1.3) % 8,
        dur: 9 + ((i * 7) % 6),
        size: 10 + ((i * 5) % 12),
        color: ['#e79aa8', '#f0d38a', '#e3b23c', '#e0505f'][i % 4],
      })),
    [count],
  )
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {petals.map((p, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            animation: `fall ${p.dur}s linear ${p.delay}s infinite`,
          }}
        >
          <Blossom size={p.size} color={p.color} />
        </div>
      ))}
    </div>
  )
}

/* ---------- Drifting clouds across the top ---------- */
export function DriftingClouds() {
  return (
    <div className="absolute inset-x-0 top-6 pointer-events-none overflow-hidden" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: i * 34, color: 'rgba(240,211,138,0.14)', width: 150 }}
          initial={{ x: '-20%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 40 + i * 14, repeat: Infinity, ease: 'linear', delay: i * 6 }}
        >
          <Cloud style={{ width: 150 }} />
        </motion.div>
      ))}
    </div>
  )
}

/* ---------- Hanging lanterns in a row ---------- */
export function LanternRow({ count = 3 }: { count?: number }) {
  return (
    <div className="flex items-start justify-center gap-8 w-full" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <Lantern key={i} delay={i * 0.5} scale={i % 2 ? 0.85 : 1} />
      ))}
    </div>
  )
}
