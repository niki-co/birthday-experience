// Real-time helper for the time lock.
// Tries a couple of public time APIs, falls back to the device clock.
// (Device clock alone is easy to cheat by changing the phone's time;
//  the API makes the seal honest when there is a connection.)

const TIME_APIS = [
  'https://worldtimeapi.org/api/timezone/Etc/UTC',
  'https://timeapi.io/api/Time/current/zone?timeZone=UTC',
]

export async function getRealNow(): Promise<number> {
  for (const url of TIME_APIS) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) continue
      const data: any = await res.json()
      const raw: string | undefined =
        data.utc_datetime || data.datetime || data.dateTime
      if (!raw) continue
      // Some APIs return UTC without a timezone suffix — assume UTC.
      const normalized = /[zZ]|[+-]\d\d:?\d\d$/.test(raw) ? raw : raw + 'Z'
      const t = Date.parse(normalized)
      if (!Number.isNaN(t)) return t
    } catch {
      // try the next source
    }
  }
  return Date.now()
}

export function isUnlocked(unlockISO: string | undefined, now: number): boolean {
  if (!unlockISO) return true // no date set yet -> open (we fill it in later)
  const t = Date.parse(unlockISO)
  if (Number.isNaN(t)) return true
  return now >= t
}

export type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

export function countdownTo(unlockISO: string | undefined, now: number): Countdown {
  if (!unlockISO) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  const target = Date.parse(unlockISO)
  const total = Math.max(0, target - now)
  const s = Math.floor(total / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    total,
  }
}
