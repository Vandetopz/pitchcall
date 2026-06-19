const BADGE_EMOJIS = ['🩸', '🔥', '👁️', '🔮', '🏆']

export default function SeasonScreen({ profile, streak, leaderboard, currentUserId, lang }) {
  const myRank = leaderboard.findIndex(e => e.user_id === currentUserId || e.telegram_id === currentUserId) + 1
  const hitRate = profile?.hit_rate ? `${Math.round(profile.hit_rate * 100)}%` : '—'
  const badgeNames = [lang.b1, lang.b2, lang.b3, lang.b4, lang.b5]

  const stats = [
    { label: lang.points, value: profile?.total_points ?? 0 },
    { label: lang.hitRate, value: hitRate },
    { label: lang.dayStreak, value: streak?.current_streak ?? 0 },
    { label: lang.globalRank, value: myRank > 0 ? `#${myRank}` : '—' },
  ]

  return (
    <div style={{ padding: '16px 16px 80px' }}>
      <div style={{ fontFamily: 'Oswald', fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
        {lang.yourSeason}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14,
            padding: 16, textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'Oswald', fontSize: 30, fontWeight: 700, color: 'var(--gold)' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--chalk-dim)', marginTop: 4, fontWeight: 500 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: 'Oswald', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
        {lang.badges}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {BADGE_EMOJIS.map((emoji, i) => {
          const locked = i >= 3
          return (
            <div key={i} style={{
              flex: 1, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12,
              padding: '14px 6px', textAlign: 'center',
              opacity: locked ? 0.35 : 1,
              filter: locked ? 'grayscale(1)' : 'none',
            }}>
              <div style={{ fontSize: 22 }}>{emoji}</div>
              <div style={{ fontSize: 9, color: 'var(--chalk-dim)', marginTop: 4, fontWeight: 500, lineHeight: 1.2 }}>
                {badgeNames[i]}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
