export const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone

export function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', {
    timeZone: userTZ, hour: '2-digit', minute: '2-digit',
  })
}

export function fmtShortDate(iso) {
  const d = new Date(iso)
  const wd = d.toLocaleDateString('en-GB', { timeZone: userTZ, weekday: 'short' })
  const dm = d.toLocaleDateString('en-GB', { timeZone: userTZ, day: 'numeric', month: 'short' })
  return `${wd} ${dm}`
}

export function fmtDeadline(iso) {
  const d = new Date(iso)
  const tz = userTZ
  const wd  = d.toLocaleDateString('en-GB', { timeZone: tz, weekday: 'short' })
  const day = d.toLocaleDateString('en-GB', { timeZone: tz, day: 'numeric', month: 'short' })
  const t   = d.toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' })
  return `${wd} ${day} · ${t}`
}

export function getLocalDateStr(iso) {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: userTZ }) // YYYY-MM-DD
}

export function getTodayStr() {
  return new Date().toLocaleDateString('en-CA', { timeZone: userTZ })
}

export function getTomorrowStr() {
  return new Date(Date.now() + 86_400_000).toLocaleDateString('en-CA', { timeZone: userTZ })
}
