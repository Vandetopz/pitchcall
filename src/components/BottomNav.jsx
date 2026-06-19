const TABS = [
  { id: 'predict',     icon: '⚽', key: 'navPredict' },
  { id: 'leaderboard', icon: '📋', key: 'navTable' },
  { id: 'season',      icon: '📈', key: 'navSeason' },
  { id: 'pass',        icon: '⭐', key: 'navPass' },
]

export default function BottomNav({ current, onChange, lang }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 412,
      background: 'rgba(8,24,19,.92)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderTop: '1px solid rgba(234,242,236,.10)',
      display: 'flex', zIndex: 50,
    }}>
      {TABS.map(tab => {
        const active = current === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '10px 0 13px', background: 'none', border: 'none',
              color: active ? '#F5C451' : '#8FA99B',
              cursor: 'pointer', gap: 4, transition: 'color 0.18s',
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{
              fontSize: 10, fontFamily: 'Oswald',
              fontWeight: active ? 600 : 400,
              letterSpacing: 0.6,
            }}>
              {lang[tab.key]}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
