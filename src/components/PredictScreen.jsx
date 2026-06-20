import GameweekBanner from './GameweekBanner'
import FixtureCard from './FixtureCard'
import LeagueSelector from './LeagueSelector'

export default function PredictScreen({
  fixtures, predictions, captain,
  onPick, onCaptain, onSubmit, lang, submitted,
  allLeagues, selectedLeague, onLeagueChange,
}) {
  const picksMap = Object.fromEntries(predictions.map(p => [p.fixture_id, p.pick]))
  const allPicked = fixtures.length > 0 && fixtures.every(f => picksMap[f.id])

  return (
    <div style={{ paddingBottom: 90 }}>
      <LeagueSelector
        leagues={allLeagues}
        selected={selectedLeague}
        onChange={onLeagueChange}
      />

      <GameweekBanner fixtures={fixtures} lang={lang} />

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

      {fixtures.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8FA99B' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚽</div>
          <div style={{ fontFamily: 'Oswald', fontSize: 18 }}>{lang.todayFix}</div>
        </div>
      )}

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
              color: submitted || allPicked ? '#05110D' : '#8FA99B',
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
    </div>
  )
}
