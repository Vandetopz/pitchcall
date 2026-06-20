// Short display name for each league
const SHORT = {
  'Premier League':  'Premier League',
  'La Liga':         'La Liga',
  'Serie A':         'Serie A',
  'Bundesliga':      'Bundesliga',
  'Champions League':'UCL',
  'Brasileirão':     'Brasileirão',
  'FIFA World Cup':  'World Cup',
}

export default function LeagueSelector({ leagues, selected, onChange }) {
  if (!leagues.length) return null

  return (
    <div style={{
      display: 'flex',
      overflowX: 'auto',
      gap: 8,
      padding: '10px 16px 4px',
      // Hide scrollbar cross-browser
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      WebkitOverflowScrolling: 'touch',
    }}>
      {leagues.map(league => {
        const active = league === selected
        return (
          <button
            key={league}
            onClick={() => onChange(league)}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: 20,
              border: active
                ? '1px solid var(--gold)'
                : '1px solid var(--line)',
              background: active
                ? 'rgba(245,196,81,.14)'
                : 'transparent',
              color: active ? 'var(--gold)' : 'var(--chalk-dim)',
              fontSize: 12,
              fontWeight: active ? 700 : 400,
              fontFamily: 'Oswald',
              letterSpacing: active ? 0.5 : 0,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {SHORT[league] ?? league}
          </button>
        )
      })}
    </div>
  )
}
