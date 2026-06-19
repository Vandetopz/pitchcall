import { useState } from 'react'

function initials(name) {
  return (name ?? 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

const COLORS = ['#5EEAD4', '#F5C451', '#FF6B5C', '#60a5fa', '#a78bfa', '#34d399']

export default function LeaderboardScreen({ leaderboard, currentUserId, lang }) {
  const [scope, setScope] = useState('global')

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ display: 'flex', gap: 8, padding: '16px 16px 8px' }}>
        {['global', 'friends'].map(s => (
          <button
            key={s}
            onClick={() => setScope(s)}
            style={{
              flex: 1,
              padding: '10px',
              background: scope === s ? 'var(--gold)' : 'var(--card)',
              color: scope === s ? '#05110D' : 'var(--chalk-dim)',
              border: '1px solid var(--line)',
              borderRadius: 10,
              fontFamily: 'Oswald',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {s === 'global' ? lang.global : lang.friends}
          </button>
        ))}
      </div>
      <div style={{ padding: '0 16px' }}>
        {leaderboard.map((entry, i) => {
          const isMe = entry.user_id === currentUserId || entry.telegram_id === currentUserId
          const color = COLORS[i % COLORS.length]
          return (
            <div
              key={entry.user_id ?? i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                background: 'var(--card)',
                border: isMe ? '1px solid var(--gold)' : '1px solid var(--line)',
                borderRadius: 12,
                marginBottom: 8,
              }}
            >
              <span style={{ fontFamily: 'Oswald', fontSize: 16, fontWeight: 700, color: 'var(--chalk-dim)', minWidth: 24 }}>
                {i + 1}
              </span>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Oswald', fontWeight: 700, fontSize: 13, color: '#05110D', flexShrink: 0,
              }}>
                {initials(entry.username ?? entry.first_name)}
              </div>
              <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>
                {entry.username ?? entry.first_name}
                {isMe && <span style={{ color: 'var(--gold)', fontSize: 11, marginLeft: 6 }}>({lang.you})</span>}
              </span>
              <span style={{ fontFamily: 'Oswald', fontSize: 18, fontWeight: 700, color: 'var(--mint)' }}>
                {entry.total_points ?? 0}
              </span>
            </div>
          )
        })}
        {leaderboard.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--chalk-dim)' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
            <div style={{ fontFamily: 'Oswald', fontSize: 18 }}>{lang.global}</div>
          </div>
        )}
      </div>
    </div>
  )
}
