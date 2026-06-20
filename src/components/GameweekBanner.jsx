import { useState, useEffect } from 'react'

function getCountdown(kickoff) {
  const diff = new Date(kickoff) - new Date()
  if (diff <= 0) return null
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function GameweekBanner({ fixtures, lang }) {
  const [countdown, setCountdown] = useState('')

  // Find next future fixture — fixtures are ordered by kickoff asc
  const nextFixture = fixtures.find(f => new Date(f.kickoff) > new Date())
  const nextKickoff = nextFixture?.kickoff
  const allPast = fixtures.length > 0 && !nextFixture

  const gameweek = fixtures[0]?.gameweek ?? 12
  const totalGw = 38
  const progress = Math.round((gameweek / totalGw) * 100)

  useEffect(() => {
    if (!nextKickoff) return
    const tick = () => setCountdown(getCountdown(nextKickoff) ?? lang.gwClosed ?? 'GW CLOSED')
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextKickoff, lang.gwClosed])

  const deadlineDisplay = allPast
    ? (lang.gwClosed ?? 'GW CLOSED')
    : countdown

  return (
    <div style={{
      background: 'linear-gradient(135deg, #164134, #12352C)',
      border: '1px solid rgba(234,242,236,.10)',
      borderRadius: 18,
      padding: '18px 20px',
      margin: '14px 16px 10px',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div>
          <div style={{
            fontFamily: 'Oswald', fontSize: 11, fontWeight: 600,
            letterSpacing: 2, color: '#5EEAD4', marginBottom: 4,
          }}>
            {lang.gwTitle?.toUpperCase() ?? 'GAMEWEEK'} {gameweek} · LIVE
          </div>
          <div style={{
            fontFamily: 'Oswald', fontWeight: 700, fontSize: 26,
            letterSpacing: 0.5, textTransform: 'uppercase', lineHeight: 1,
          }}>
            Make your calls
          </div>
        </div>
        <div style={{
          background: allPast ? 'rgba(255,107,92,.10)' : 'rgba(245,196,81,.10)',
          borderRadius: 7,
          padding: '2px 10px',
          textAlign: 'center',
          flexShrink: 0,
          marginLeft: 12,
        }}>
          <div style={{ fontSize: 9, color: '#8FA99B', marginBottom: 1 }}>
            {lang.deadline ?? 'DEADLINE'}
          </div>
          <div style={{
            fontFamily: 'Oswald', fontWeight: 700, fontSize: 15,
            color: allPast ? 'var(--coral)' : '#F5C451',
          }}>
            {deadlineDisplay || '–'}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8FA99B', marginBottom: 5 }}>
          <span>{lang.seasonProg ?? 'Season Progress'}</span>
          <span>{gameweek}/{totalGw}</span>
        </div>
        <div style={{ background: 'rgba(0,0,0,.3)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
          <div style={{
            background: 'linear-gradient(90deg, #5EEAD4, #F5C451)',
            borderRadius: 4, height: '100%',
            width: `${progress}%`,
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>
    </div>
  )
}
