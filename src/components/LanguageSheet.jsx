const LANGS = [
  { code: 'EN', name: 'English' },
  { code: 'BG', name: 'Български' },
  { code: 'ES', name: 'Español' },
  { code: 'PT', name: 'Português' },
  { code: 'DE', name: 'Deutsch' },
  { code: 'FR', name: 'Français' },
  { code: 'TR', name: 'Türkçe' },
  { code: 'IT', name: 'Italiano' },
  { code: 'RU', name: 'Русский' },
  { code: 'PL', name: 'Polski' },
  { code: 'ID', name: 'Indonesia' },
]

export default function LanguageSheet({ open, currentLang, onSelect, onClose }) {
  if (!open) return null
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
      />
      <div style={{
        position: 'fixed',
        top: 62,
        right: 20,
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: 8,
        zIndex: 101,
        minWidth: 186,
        maxHeight: '70vh',
        overflowY: 'auto',
      }}>
        {LANGS.map(l => (
          <button
            key={l.code}
            onClick={() => { onSelect(l.code); onClose() }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              background: currentLang === l.code ? 'var(--card-2)' : 'transparent',
              border: 'none',
              borderRadius: 10,
              color: 'var(--chalk)',
              padding: '10px 14px',
              fontSize: 14,
              fontWeight: currentLang === l.code ? 600 : 400,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ fontFamily: 'Oswald', fontWeight: 700, color: 'var(--gold)', minWidth: 28 }}>{l.code}</span>
            <span>{l.name}</span>
          </button>
        ))}
      </div>
    </>
  )
}
