import { useState } from 'react'
import { I18N } from './i18n/translations'
import { useUser } from './hooks/useUser'
import { useFixtures } from './hooks/useFixtures'
import { usePredictions } from './hooks/usePredictions'
import { useLeaderboard } from './hooks/useLeaderboard'
import { useStreak } from './hooks/useStreak'
import Header from './components/Header'
import LanguageSheet from './components/LanguageSheet'
import PredictScreen from './components/PredictScreen'
import LeaderboardScreen from './components/LeaderboardScreen'
import SeasonScreen from './components/SeasonScreen'
import PassScreen from './components/PassScreen'
import BottomNav from './components/BottomNav'
import './index.css'

export default function App() {
  const [screen, setScreen] = useState('predict')
  const [lang, setLang] = useState('EN')
  const [captain, setCaptain] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const t = I18N[lang]

  const { user, profile, loading: userLoading } = useUser()
  const { fixtures } = useFixtures()
  const { predictions, savePrediction } = usePredictions(user?.id)
  const { leaderboard } = useLeaderboard()
  const { streak } = useStreak(user?.id)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  async function handlePick(fixtureId, pick) {
    await savePrediction(fixtureId, pick, captain === fixtureId)
    showToast(t.toastPick)
  }

  function handleCaptain(fixtureId) {
    setCaptain(prev => prev === fixtureId ? null : fixtureId)
  }

  function handleSubmit() {
    setSubmitted(true)
    showToast(t.toastSub)
  }

  if (userLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ fontFamily: 'Oswald', fontSize: 24, color: 'var(--chalk-dim)' }}>PitchCall…</div>
      </div>
    )
  }

  const screens = {
    predict: (
      <PredictScreen
        fixtures={fixtures}
        predictions={predictions}
        captain={captain}
        onPick={handlePick}
        onCaptain={handleCaptain}
        onSubmit={handleSubmit}
        lang={t}
        submitted={submitted}
      />
    ),
    leaderboard: (
      <LeaderboardScreen
        leaderboard={leaderboard}
        currentUserId={user?.id}
        lang={t}
      />
    ),
    season: (
      <SeasonScreen
        profile={profile}
        streak={streak}
        leaderboard={leaderboard}
        currentUserId={user?.id}
        lang={t}
      />
    ),
    pass: (
      <PassScreen
        lang={t}
        subscribed={subscribed}
        onSubscribe={() => setSubscribed(true)}
      />
    ),
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      <Header streak={streak} lang={lang} onLangOpen={() => setLangOpen(true)} />
      <LanguageSheet
        open={langOpen}
        currentLang={lang}
        onSelect={setLang}
        onClose={() => setLangOpen(false)}
      />
      <main key={screen} style={{ animation: 'fadeIn 0.2s ease' }}>
        {screens[screen]}
      </main>
      <BottomNav current={screen} onChange={setScreen} lang={t} />
      {toast && (
        <div style={{
          position: 'fixed', bottom: 82, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--card)', border: '1px solid var(--mint)', borderRadius: 12,
          padding: '10px 20px', fontSize: 14, fontWeight: 600, color: 'var(--mint)',
          zIndex: 200, animation: 'fadeIn 0.2s ease', whiteSpace: 'nowrap',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}
