export default function FeedTabs({ active, onChange, hasLive, lang }) {
  const tabs = [
    { key: 'live',     label: lang.tabLive     ?? 'LIVE' },
    { key: 'today',    label: lang.tabToday    ?? 'TODAY' },
    { key: 'tomorrow', label: lang.tabTomorrow ?? 'TOMORROW' },
    { key: 'leagues',  label: lang.tabLeagues  ?? 'LEAGUES' },
  ]

  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid var(--line)',
      background: 'var(--pitch)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      {tabs.map(tab => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              flex: 1,
              padding: '12px 4px 10px',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent',
              color: isActive ? 'var(--gold)' : 'var(--chalk-dim)',
              fontFamily: 'Oswald',
              fontSize: 12,
              fontWeight: isActive ? 700 : 400,
              letterSpacing: 1,
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 0.15s',
            }}
          >
            {tab.label}
            {/* Red dot when there are live matches */}
            {tab.key === 'live' && hasLive && (
              <span style={{
                display: 'inline-block',
                width: 5, height: 5,
                borderRadius: '50%',
                background: 'var(--coral)',
                marginLeft: 4,
                verticalAlign: 'middle',
                marginBottom: 1,
              }} />
            )}
          </button>
        )
      })}
    </div>
  )
}
