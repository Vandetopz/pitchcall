import { fmtTime, fmtShortDate } from '../lib/time'

function Badge({ short, color }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 7, flexShrink: 0,
      background: color ?? '#164134',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 9, color: '#fff', letterSpacing: 0.3 }}>
        {(short ?? '?').slice(0, 3)}
      </span>
    </div>
  )
}

export default function FixtureRow({ fixture, showDate = false }) {
  const isLive     = ['in_play', 'paused'].includes(fixture.status)
  const isFinished = fixture.status === 'finished'
  const hasScore   = fixture.home_score !== null && fixture.away_score !== null

  const timeLabel = showDate
    ? `${fmtShortDate(fixture.kickoff)} · ${fmtTime(fixture.kickoff)}`
    : fmtTime(fixture.kickoff)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      borderBottom: '1px solid var(--line)',
    }}>
      {/* Home */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
        <Badge short={fixture.home_short} color={fixture.home_color} />
        <span style={{
          fontFamily: 'Oswald', fontSize: 14, fontWeight: 600,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {fixture.home}
        </span>
      </div>

      {/* Centre: time or score */}
      <div style={{
        minWidth: 72, textAlign: 'center', flexShrink: 0, padding: '0 8px',
      }}>
        {isLive ? (
          <div>
            <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 16, color: 'var(--chalk)' }}>
              {fixture.home_score ?? 0} – {fixture.away_score ?? 0}
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--coral)', letterSpacing: 1 }}>
              LIVE
            </div>
          </div>
        ) : isFinished && hasScore ? (
          <div style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 16, color: 'var(--chalk-dim)' }}>
            {fixture.home_score} – {fixture.away_score}
          </div>
        ) : (
          <div style={{ fontFamily: 'Oswald', fontSize: 12, fontWeight: 500, color: 'var(--chalk-dim)', lineHeight: 1.3 }}>
            {timeLabel}
          </div>
        )}
      </div>

      {/* Away */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0, justifyContent: 'flex-end' }}>
        <span style={{
          fontFamily: 'Oswald', fontSize: 14, fontWeight: 600,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          textAlign: 'right',
        }}>
          {fixture.away}
        </span>
        <Badge short={fixture.away_short} color={fixture.away_color} />
      </div>
    </div>
  )
}
