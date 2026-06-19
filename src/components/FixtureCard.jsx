function TeamBadge({ name, short, color }) {
  const bg = color ?? '#164134'
  const abbr = short ?? (name ?? '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3)
  return (
    <div style={{
      width: 30, height: 30, borderRadius: 9, flexShrink: 0,
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 10, color: '#fff', letterSpacing: 0.3 }}>
        {abbr}
      </span>
    </div>
  )
}

export default function FixtureCard({ fixture, selectedPick, isCaptain, onPick, onCaptain, lang }) {
  const PICKS = [
    { key: '1', label: fixture.home },
    { key: 'X', label: 'Draw' },
    { key: '2', label: fixture.away },
  ]

  return (
    <div style={{
      background: '#12352C',
      border: '1px solid rgba(234,242,236,.10)',
      borderRadius: 16,
      padding: '14px 14px 12px',
      margin: '0 16px 10px',
    }}>
      {/* Top row: league + captain */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }}>
        <span style={{ fontSize: 11, color: '#8FA99B', fontWeight: 500, letterSpacing: 0.3 }}>
          {fixture.league ?? 'Premier League'}
        </span>
        <button
          onClick={() => onCaptain(fixture.id)}
          style={{
            background: isCaptain ? '#F5C451' : 'transparent',
            border: '1px solid rgba(234,242,236,.10)',
            borderRadius: 7,
            color: isCaptain ? '#05110D' : '#8FA99B',
            padding: '3px 9px',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Oswald',
            letterSpacing: 0.5,
            transition: 'all 0.15s',
          }}
        >
          © 2× {lang.cap ?? 'Captain'}
        </button>
      </div>

      {/* Teams row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13, padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1 }}>
          <TeamBadge name={fixture.home} short={fixture.home_short} color={fixture.home_color} />
          <span style={{ fontFamily: 'Oswald', fontSize: 15, fontWeight: 600 }}>
            {fixture.home}
          </span>
        </div>
        <span style={{ fontFamily: 'Oswald', fontSize: 13, fontWeight: 500, color: '#8FA99B', padding: '0 10px', flexShrink: 0 }}>
          VS
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1, justifyContent: 'flex-end' }}>
          <span style={{ fontFamily: 'Oswald', fontSize: 15, fontWeight: 600 }}>
            {fixture.away}
          </span>
          <TeamBadge name={fixture.away} short={fixture.away_short} color={fixture.away_color} />
        </div>
      </div>

      {/* Pick buttons */}
      <div style={{ display: 'flex', gap: 7 }}>
        {PICKS.map(p => {
          const active = selectedPick === p.key
          return (
            <button
              key={p.key}
              onClick={() => onPick(fixture.id, p.key)}
              style={{
                flex: 1,
                padding: '9px 4px 7px',
                border: active ? '1px solid #5EEAD4' : '1px solid rgba(234,242,236,.10)',
                borderRadius: 11,
                background: active ? '#5EEAD4' : 'rgba(255,255,255,.035)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              }}
            >
              <span style={{
                fontFamily: 'Oswald', fontWeight: 700, fontSize: 17,
                color: active ? '#05110D' : '#EAF2EC',
                lineHeight: 1,
              }}>
                {p.key}
              </span>
              <span style={{
                fontSize: 10,
                color: active ? '#05110D' : '#8FA99B',
                fontWeight: 500,
                lineHeight: 1,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                padding: '0 4px',
              }}>
                {p.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
