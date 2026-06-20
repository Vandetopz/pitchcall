import { useState } from 'react'
import FeedTabs from './FeedTabs'
import FixtureRow from './FixtureRow'
import FixtureCard from './FixtureCard'
import GameweekBanner from './GameweekBanner'
import LeagueSelector from './LeagueSelector'
import { getLocalDateStr, getTodayStr, getTomorrowStr } from '../lib/time'

function groupByLeagueRound(fixtures, gwLabel) {
  const groups = new Map()
  for (const f of fixtures) {
    const key = `${f.league}||${f.gameweek}`
    if (!groups.has(key)) {
      groups.set(key, { label: `${f.league} · ${gwLabel} ${f.gameweek}`, items: [] })
    }
    groups.get(key).items.push(f)
  }
  return [...groups.values()]
}

function GroupHeader({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 6px' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      <span style={{
        fontFamily: 'Oswald', fontSize: 10, fontWeight: 600,
        letterSpacing: 1.5, color: 'var(--mint)', whiteSpace: 'nowrap',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px 40px', color: 'var(--chalk-dim)' }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>⚽</div>
      <div style={{ fontFamily: 'Oswald', fontSize: 16 }}>{message}</div>
    </div>
  )
}

function FeedList({ fixtures, gwLabel, emptyMsg }) {
  const groups = groupByLeagueRound(fixtures, gwLabel)
  if (!groups.length) return <EmptyState message={emptyMsg} />
  return (
    <div>
      {groups.map(g => (
        <div key={g.label}>
          <GroupHeader label={g.label} />
          {g.items.map(f => <FixtureRow key={f.id} fixture={f} />)}
        </div>
      ))}
    </div>
  )
}

export default function PredictScreen({
  liveFixtures, feedFixtures,
  fixtures, predictions, captain,
  onPick, onCaptain, onSubmit, submitted,
  allLeagues, selectedLeague, onLeagueChange,
  lang,
}) {
  const [feedTab, setFeedTab] = useState('leagues')

  const todayStr     = getTodayStr()
  const tomorrowStr  = getTomorrowStr()
  const todayFx      = feedFixtures.filter(f => getLocalDateStr(f.kickoff) === todayStr)
  const tomorrowFx   = feedFixtures.filter(f => getLocalDateStr(f.kickoff) === tomorrowStr)

  const picksMap  = Object.fromEntries(predictions.map(p => [p.fixture_id, p.pick]))
  const allPicked = fixtures.length > 0 && fixtures.every(f => picksMap[f.id])

  const gwLabel = lang.gwTitle ?? 'Gameweek'

  return (
    <div style={{ paddingBottom: 90 }}>
      <FeedTabs
        active={feedTab}
        onChange={setFeedTab}
        hasLive={liveFixtures.length > 0}
        lang={lang}
      />

      {/* ── LIVE ── */}
      {feedTab === 'live' && (
        <FeedList
          fixtures={liveFixtures}
          gwLabel={gwLabel}
          emptyMsg={lang.noLive ?? 'No live matches right now'}
        />
      )}

      {/* ── TODAY ── */}
      {feedTab === 'today' && (
        <FeedList
          fixtures={todayFx}
          gwLabel={gwLabel}
          emptyMsg={lang.todayFix ?? 'No matches today'}
        />
      )}

      {/* ── TOMORROW ── */}
      {feedTab === 'tomorrow' && (
        <FeedList
          fixtures={tomorrowFx}
          gwLabel={gwLabel}
          emptyMsg={lang.todayFix ?? 'No matches tomorrow'}
        />
      )}

      {/* ── LEAGUES (predict game) ── */}
      {feedTab === 'leagues' && (
        <>
          <LeagueSelector
            leagues={allLeagues}
            selected={selectedLeague}
            onChange={onLeagueChange}
          />

          <GameweekBanner fixtures={fixtures} lang={lang} />

          {fixtures.length === 0 && <EmptyState message={lang.todayFix ?? 'No fixtures'} />}

          {fixtures.map(f => (
            <FixtureCard
              key={f.id}
              fixture={f}
              selectedPick={picksMap[f.id]}
              isCaptain={captain === f.id}
              onPick={onPick}
              onCaptain={onCaptain}
              lang={lang}
            />
          ))}

          {fixtures.length > 0 && (
            <div style={{ padding: '6px 16px 16px' }}>
              <button
                onClick={onSubmit}
                disabled={!allPicked || submitted}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: submitted
                    ? 'var(--mint)'
                    : allPicked
                      ? 'linear-gradient(135deg, #F5C451, #e0a93a)'
                      : 'rgba(255,255,255,.06)',
                  color: submitted || allPicked ? '#05110D' : 'var(--chalk-dim)',
                  border: 'none',
                  borderRadius: 15,
                  fontFamily: 'Oswald',
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  cursor: submitted ? 'default' : allPicked ? 'pointer' : 'not-allowed',
                  opacity: !allPicked && !submitted ? 0.4 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {submitted ? lang.submitted : lang.submit}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
