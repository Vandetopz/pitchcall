import { useState } from 'react'
import { showRewardedVideo } from '../lib/ads'

const FEATURES = [
  { emoji: '⚡', t: 'f1t', s: 'f1s' },
  { emoji: '©️', t: 'f2t', s: 'f2s' },
  { emoji: '👥', t: 'f3t', s: 'f3s' },
  { emoji: '📊', t: 'f4t', s: 'f4s' },
]

export default function PassScreen({ lang, subscribed, onSubscribe }) {
  const [rewardState, setRewardState] = useState('idle') // idle | loading | done

  async function handleRewardedVideo() {
    setRewardState('loading')
    const { earned } = await showRewardedVideo()
    setRewardState(earned ? 'done' : 'idle')
  }

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

      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--chalk-dim)', marginBottom: 20 }}>
        {lang.honest}
      </div>

      {/* Rewarded video — purely optional, cosmetic reward, game is always fully playable without it */}
      <div style={{
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{lang.watchAdTitle ?? 'Support PitchCall'}</div>
          <div style={{ fontSize: 11, color: 'var(--chalk-dim)', marginTop: 2 }}>
            {lang.watchAdSub ?? 'Watch a short video — unlock a dark theme preview'}
          </div>
        </div>
        <button
          onClick={handleRewardedVideo}
          disabled={rewardState !== 'idle'}
          style={{
            flexShrink: 0,
            padding: '8px 14px',
            background: rewardState === 'done' ? 'var(--mint)' : 'rgba(255,255,255,.07)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            color: rewardState === 'done' ? '#05110D' : 'var(--chalk)',
            fontFamily: 'Oswald',
            fontSize: 12,
            fontWeight: 700,
            cursor: rewardState === 'idle' ? 'pointer' : 'default',
            letterSpacing: 0.5,
            transition: 'all 0.2s',
          }}
        >
          {rewardState === 'loading' ? '...' : rewardState === 'done' ? '✓' : 'WATCH'}
        </button>
      </div>
    </div>
  )
}
