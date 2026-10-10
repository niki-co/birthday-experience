import { useCallback, useEffect, useRef, useState } from 'react'

// Listens to the microphone and fires onBlow when it hears a sustained puff.
// Always paired with a tap fallback, because mic permission can be refused.
export function useMic(onBlow: () => void, threshold = 0.22) {
  const [listening, setListening] = useState(false)
  const [supported] = useState(
    typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices &&
      !!navigator.mediaDevices.getUserMedia,
  )
  const ctxRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const firedRef = useRef(false)

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    ctxRef.current?.close().catch(() => {})
    ctxRef.current = null
    setListening(false)
  }, [])

  const start = useCallback(async () => {
    if (!supported || listening) return
    firedRef.current = false
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const AudioCtor =
        window.AudioContext || (window as any).webkitAudioContext
      const ctx: AudioContext = new AudioCtor()
      ctxRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      source.connect(analyser)
      const data = new Uint8Array(analyser.fftSize)
      setListening(true)

      const loop = () => {
        analyser.getByteTimeDomainData(data)
        let peak = 0
        for (let i = 0; i < data.length; i++) {
          const v = Math.abs(data[i] - 128) / 128
          if (v > peak) peak = v
        }
        if (peak > threshold && !firedRef.current) {
          firedRef.current = true
          onBlow()
          stop()
          return
        }
        rafRef.current = requestAnimationFrame(loop)
      }
      loop()
    } catch {
      setListening(false)
    }
  }, [supported, listening, threshold, onBlow, stop])

  useEffect(() => () => stop(), [stop])

  return { supported, listening, start, stop }
}
