import { motion } from 'motion/react'

// A cinnabar-red sealed envelope (hongbao style). The flap lifts, the chop breaks.
export default function Envelope({ sealed }: { sealed: boolean }) {
  return (
    <div className="relative anim-float" style={{ width: 220, height: 150, perspective: 900 }}>
      {/* back */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'linear-gradient(160deg,#d7263d,#9c0f24)',
          boxShadow: '0 24px 50px rgba(0,0,0,.55), inset 0 0 0 2px rgba(240,211,138,.45)',
        }}
      />
      {/* letter peeking */}
      <motion.div
        className="absolute left-3 right-3 top-2 rounded-md"
        style={{ height: 122, background: 'linear-gradient(180deg,#fffdf6,#efe4cf)' }}
        animate={{ y: sealed ? 26 : -12, opacity: sealed ? 0 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* front pocket */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: 96,
          borderRadius: '0 0 12px 12px',
          background: 'linear-gradient(180deg,#d7263d,#b0132c)',
          clipPath: 'polygon(0 34%, 50% 0, 100% 34%, 100% 100%, 0 100%)',
          boxShadow: 'inset 0 2px 0 rgba(240,211,138,.4)',
        }}
      />
      {/* flap */}
      <motion.div
        className="absolute inset-x-0 top-0 origin-top"
        style={{
          height: 96,
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          background: 'linear-gradient(180deg,#e04256,#b0132c)',
          backfaceVisibility: 'hidden',
          boxShadow: 'inset 0 -2px 0 rgba(240,211,138,.35)',
        }}
        animate={{ rotateX: sealed ? 0 : -170 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* gold chop seal */}
      {sealed && (
        <div
          className="seal absolute left-1/2 top-[72px] -translate-x-1/2"
          style={{ width: 50, height: 50, fontSize: 20 }}
        >
          <span className="brush" style={{ lineHeight: 1 }}>
            囍
          </span>
        </div>
      )}
    </div>
  )
}
