const FEATURES = [
  { emoji: '⚡', t: 'f1t', s: 'f1s' },
  { emoji: '©️', t: 'f2t', s: 'f2s' },
  { emoji: '👥', t: 'f3t', s: 'f3s' },
  { emoji: '📊', t: 'f4t', s: 'f4s' },
]

export default function PassScreen({ lang, subscribed, onSubscribe }) {
  return (
    <div style={{ padding: '16px 16px 80px' }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--card) 0%, var(--card-2) 100%)',
        border: '1px solid var(--gold)',
        borderRadius: 20,
        padding: '32px 24px',
        textAlign: 'center',
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>⭐</div>
        <div style={{ fontFamily: 'Oswald', fontSize: 12, color: 'var(--gold)', fontWeight: 600, letterSpacing: 2, marginBottom: 4 }}>
          {lang.passTag.toUpperCase()}
        </div>
        <div style={{ fontFamily: 'Oswald', fontSize: 36, fontWeight: 700, marginBottom: 4 }}>PitchCall+</div>
        <div style={{ fontFamily: 'Oswald', fontSize: 30, fontWeight: 700, color: 'var(--gold)' }}>
          €4 <span style={{ fontSize: 15, color: 'var(--chalk-dim)', fontWeight: 400 }}>{lang.perSeason}</span>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        {FEATURES.map(f => (
          <div key={f.t} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12,
            padding: '14px 16px', marginBottom: 8,
          }}>
            <span style={{ fontSize: 24 }}>{f.emoji}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{lang[f.t]}</div>
              <div style={{ fontSize: 12, color: 'var(--chalk-dim)', marginTop: 2 }}>{lang[f.s]}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onSubscribe}
        disabled={subscribed}
        style={{
          width: '100%', padding: '16px',
          background: subscribed ? 'var(--card-2)' : 'var(--gold)',
          color: subscribed ? 'var(--chalk-dim)' : '#05110D',
          border: 'none', borderRadius: 14,
          fontFamily: 'Oswald', fontSize: 18, fontWeight: 700,
          cursor: subscribed ? 'default' : 'pointer',
          marginBottom: 12, letterSpacing: 1,
        }}
      >
        {subscribed ? lang.subscribed : lang.subscribe}
      </button>

      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--chalk-dim)' }}>
        {lang.honest}
      </div>
    </div>
  )
}
