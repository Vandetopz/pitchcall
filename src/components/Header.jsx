export default function Header({ streak, lang, onLangOpen }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 20px',
      borderBottom: '1px solid rgba(234,242,236,.06)',
      position: 'sticky',
      top: 0,
      background: 'rgba(5,17,13,.92)',
      backdropFilter: 'blur(12px)',
      zIndex: 40,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 8, flexShrink: 0,
          background: 'conic-gradient(from 135deg, #F5C451, #5EEAD4, #F5C451)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 13, color: '#05110D' }}>P</span>
        </div>
        <span style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 20, letterSpacing: 0.5 }}>
          Pitch<span style={{ color: '#F5C451' }}>•</span>
          <span style={{ color: '#F5C451' }}>Call</span>
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {(streak?.current_streak > 0 || true) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(245,196,81,.12)',
            border: '1px solid rgba(245,196,81,.3)',
            borderRadius: 20, padding: '5px 10px',
          }}>
            <span style={{ fontSize: 13 }}>🔥</span>
            <span style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: 14, color: '#F5C451' }}>
              {streak?.current_streak ?? 14}
            </span>
          </div>
        )}
        <button
          onClick={onLangOpen}
          style={{
            background: '#12352C',
            border: '1px solid rgba(234,242,236,.10)',
            borderRadius: 9,
            color: '#EAF2EC',
            padding: '6px 12px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter',
          }}
        >
          {lang}
        </button>
      </div>
    </header>
  )
}
