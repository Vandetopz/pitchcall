import { supabase } from './supabase'

export function getOutcome(home_score, away_score) {
  if (home_score > away_score) return '1'
  if (home_score < away_score) return '2'
  return 'X'
}

/**
 * Resolve all unresolved predictions for a single finished fixture.
 * Returns { resolved, outcome, results } or { error }.
 */
export async function resolvePredictions(fixtureId) {
  const { data: fixture, error: fErr } = await supabase
    .from('fixtures')
    .select('id, home_score, away_score, status')
    .eq('id', fixtureId)
    .single()

  if (fErr || !fixture) return { error: 'Fixture not found' }
  if (fixture.status !== 'finished') return { error: 'Not finished', status: fixture.status }
  if (fixture.home_score === null || fixture.away_score === null) return { error: 'Scores missing' }

  const outcome = getOutcome(fixture.home_score, fixture.away_score)

  const { data: preds, error: pErr } = await supabase
    .from('predictions')
    .select('id, pick, is_captain')
    .eq('fixture_id', fixtureId)
    .eq('resolved', false)

  if (pErr) return { error: pErr.message }
  if (!preds || preds.length === 0) return { resolved: 0, outcome, message: 'Already resolved or no predictions' }

  const results = []
  for (const pred of preds) {
    const correct = pred.pick === outcome
    const points = correct ? (pred.is_captain ? 20 : 10) : 0
    const { error: uErr } = await supabase
      .from('predictions')
      .update({ points, resolved: true })
      .eq('id', pred.id)
    if (!uErr) results.push({ id: pred.id, pick: pred.pick, is_captain: pred.is_captain, points, correct })
  }

  console.log(`[scoring] fixture ${fixtureId} → outcome=${outcome}, resolved ${results.length} predictions`, results)
  return { resolved: results.length, outcome, results }
}

/**
 * Resolve all predictions for ALL finished fixtures.
 * Safe to call multiple times — skips already-resolved rows.
 */
export async function resolveAll() {
  const { data: fixtures, error } = await supabase
    .from('fixtures')
    .select('id, home, away, home_score, away_score, status')
    .eq('status', 'finished')

  if (error || !fixtures) return { total: 0, error: error?.message }

  let total = 0
  const log = []
  for (const f of fixtures) {
    const r = await resolvePredictions(f.id)
    log.push({ fixture: `${f.home} vs ${f.away}`, ...r })
    total += r.resolved ?? 0
  }

  console.log(`[scoring] resolveAll done — ${total} predictions resolved`, log)
  return { total, log }
}
