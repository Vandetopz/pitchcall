import { useState, useEffect } from 'react'
import { fmtDeadline } from '../lib/time'

const H48 = 48 * 3600 * 1000

function computeDeadline(kickoffISO, gwClosed) {
  const diff = new Date(kickoffISO) - new Date()
  if (diff <= 0) return { text: gwClosed ?? 'GW CLOSED', closed: true }
  if (diff > H48) return { text: fmtDeadline(kickoffISO), closed: false }
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return {
    text: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
    closed: false,
  }
}

export default function GameweekBanner({ fixtures, lang }) {
  const [deadline, setDeadline] = useState({ text: '–', closed: false })

  const nextFixture = fixtures.find(f => new Date(f.kickoff) > new Date())
  const nextKickoff = nextFixture?.kickoff
  const allPast     = fixtures.length > 0 && !nextFixture
  const gameweek    = fixtures[0]?.gameweek ?? 1
  const totalGw     = 38
  const progress    = Math.min(100, Math.round((gameweek / totalGw) * 100))

  useEffect(() => {
    if (allPast) {
      setDeadline({ text: lang.gwClosed ?? 'GW CLOSED', closed: true })
      return
    }
    if (!nextKickoff) return

    const diff = new Date(nextKickoff) - new Date()
    // If >48h, no need for per-second ticking
    if (diff > H48) {
      setDeadline(computeDeadline(nextKickoff, lang.gwClosed))
      return
    }
    // Countdown: tick every second
    const tick = () => setDeadline(computeDeadline(nextKickoff, lang.gwClosed))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextKickoff, allPast, lang.gwClosed])

  const isClosed = allPast || deadline.closed

  return (
    <div style={{
      background: 'linear-gradient(135deg, #164134, #12352C)',
      border: '1px solid rgba(234,242,236,.10)',
      borderRadius: 18,
      padding: '16px 18px',
      margin: '10px 16px 10px',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{
            fontFamily: 'Oswald', fontSize: 10, fontWeight: 600,
            letterSpacing: 2, color: 'var(--mint)', marginBottom: 3,
          }}>
            {lang.gwTitle?.toUpperCase() ?? 'GAMEWEEK'} {gameweek}
          </div>
          <div style={{
            fontFamily: 'Oswald', fontWeight: 700, fontSize: 22,
            letterSpacing: 0.5, textTransform: 'uppercase', lineHeight: 1, color: 'var(--chalk)',
          }}>
            {lang.submit ?? 'Lock In'}
          </div>
        </div>

        <div style={{
          background: isClosed ? 'rgba(255,107,92,.12)' : 'rgba(245,196,81,.10)',
          borderRadius: 10,
          padding: '6px 12px',
          textAlign: 'center',
          flexShrink: 0,
          marginLeft: 12,
        }}>
          <div style={{ fontSize: 9, color: 'var(--chalk-dim)', marginBottom: 2, letterSpacing: 0.5 }}>
            {lang.deadline ?? 'DEADLINE'}
          </div>
          <div style={{
            fontFamily: 'Oswald', fontWeight: 700,
            fontSize: isClosed ? 11 : 15,
            color: isClosed ? 'var(--coral)' : 'var(--gold)',
            letterSpacing: 0.5,
            whiteSpace: 'nowrap',
          }}>
            {deadline.text}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--chalk-dim)', marginBottom: 4 }}>
          <span>{lang.seasonProg ?? 'Season Progress'}</span>
          <span>{gameweek} / {totalGw}</span>
        </div>
        <div style={{ background: 'rgba(0,0,0,.3)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
          <div style={{
            background: 'linear-gradient(90deg, var(--mint), var(--gold))',
            borderRadius: 4, height: '100%',
            width: `${progress}%`,
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>
    </div>
  )
}
