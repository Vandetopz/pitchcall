import { useState, useEffect } from 'react'
import { I18N } from './i18n/translations'
import { useUser } from './hooks/useUser'
import { useFixtures } from './hooks/useFixtures'
import { useFixturesFeed } from './hooks/useFixturesFeed'
import { usePredictions } from './hooks/usePredictions'
import { useLeaderboard } from './hooks/useLeaderboard'
import { useStreak } from './hooks/useStreak'
import Header from './components/Header'
import LanguageSheet from './components/LanguageSheet'
import PredictScreen from './components/PredictScreen'
import LeaderboardScreen from './components/LeaderboardScreen'
import SeasonScreen from './components/SeasonScreen'
import PassScreen from './components/PassScreen'
import AdBanner from './components/AdBanner'
import BottomNav from './components/BottomNav'
import { showInterstitialOnce } from './lib/ads'
import './index.css'

export default function App() {
  const [screen, setScreen]                 = useState('predict')
  const [lang, setLang]                     = useState(() => {
    const tgCode = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code?.toUpperCase()
    const SUPPORTED = ['EN', 'BG', 'ES', 'PT', 'DE', 'FR', 'TR', 'IT', 'RU', 'PL', 'ID']
    return SUPPORTED.includes(tgCode) ? tgCode : 'EN'
  })
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [captain, setCaptain]               = useState(null)
  const [submitted, setSubmitted]           = useState(false)
  const [subscribed, setSubscribed]         = useState(false)
  const [langOpen, setLangOpen]             = useState(false)
  const [toast, setToast]                   = useState(null)

  const t = I18N[lang]

  const { user, profile, loading: userLoading }                              = useUser()
  const { fixtures, allLeagues }                                             = useFixtures(selectedLeague)
  const { liveFixtures, feedFixtures }                                       = useFixturesFeed()
  const { predictions, savePrediction, saveCaptain, loading: predsLoading }  = usePredictions(profile?.id)
  const { leaderboard }                                                      = useLeaderboard()
  const { streak }                                                           = useStreak(profile?.id)

  const picksMap  = Object.fromEntries(predictions.map(p => [p.fixture_id, p.pick]))
  const allPicked = fixtures.length > 0 && fixtures.every(f => picksMap[f.id])

  useEffect(() => {
    if (!selectedLeague && allLeagues.length > 0) setSelectedLeague(allLeagues[0])
  }, [allLeagues, selectedLeague])

  useEffect(() => { setSubmitted(false) }, [selectedLeague])

  useEffect(() => {
    if (predsLoading) return
    const cap = predictions.find(p => p.is_captain)
    if (cap) setCaptain(cap.fixture_id)
  }, [predsLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (allPicked) setSubmitted(true) }, [allPicked])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  async function handlePick(fixtureId, pick) {
    await savePrediction(fixtureId, pick, captain === fixtureId)
  }

  async function handleCaptain(fixtureId) {
    const next = captain === fixtureId ? null : fixtureId
    setCaptain(next)
    await saveCaptain(next)
  }

  function handleSubmit() {
    setSubmitted(true)
    showToast(t.toastSub)
    // Non-intrusive interstitial: once per round, after the user locks in
    const gw = fixtures[0]?.gameweek
    if (selectedLeague && gw) {
      showInterstitialOnce(selectedLeague, gw)
    }
  }

  function handleLeagueChange(league) {
    setSelectedLeague(league)
    setCaptain(null)
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
        liveFixtures={liveFixtures}
        feedFixtures={feedFixtures}
        fixtures={fixtures}
        predictions={predictions}
        captain={captain}
        onPick={handlePick}
        onCaptain={handleCaptain}
        onSubmit={handleSubmit}
        submitted={submitted}
        allLeagues={allLeagues}
        selectedLeague={selectedLeague}
        onLeagueChange={handleLeagueChange}
        lang={t}
      />
    ),
    leaderboard: (
      <LeaderboardScreen leaderboard={leaderboard} currentUserId={profile?.id} lang={t} />
    ),
    season: (
      <SeasonScreen
        profile={profile} streak={streak}
        leaderboard={leaderboard} currentUserId={profile?.id} lang={t}
      />
    ),
    pass: (
      <PassScreen lang={t} subscribed={subscribed} onSubscribe={() => setSubscribed(true)} />
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
      <AdBanner />
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
