import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Exact columns confirmed from live DB:
// id, gameweek, home, away, home_short, away_short, home_color, away_color,
// kickoff, status, home_score, away_score, league, external_id
//
// We upsert only scheduling fields — color/score cols are excluded so they
// are preserved on conflict and receive DB defaults on fresh inserts.

const COMPETITIONS = [
  // Active year-round — always has upcoming matches
  { code: 'BSA', league: 'Brasileirão' },
  // European club leagues — active Aug-May
  { code: 'PL',  league: 'Premier League' },
  { code: 'PD',  league: 'La Liga' },
  { code: 'SA',  league: 'Serie A' },
  { code: 'BL1', league: 'Bundesliga' },
  { code: 'CL',  league: 'Champions League' },
]

// Statuses we want to store as upcoming fixtures
const UPCOMING = new Set(['TIMED', 'SCHEDULED'])

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

Deno.serve(async (_req: Request): Promise<Response> => {
  const apiKey = Deno.env.get('FOOTBALL_API_KEY')
  if (!apiKey) {
    return Response.json({ error: 'FOOTBALL_API_KEY not set' }, { status: 500 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const results: Record<string, { upserted: number; total?: number; error?: string }> = {}

  for (let i = 0; i < COMPETITIONS.length; i++) {
    const { code, league } = COMPETITIONS[i]

    // Free tier: 10 req/min — 6s between requests stays safely under limit
    if (i > 0) await sleep(6200)

    try {
      // No status filter — let API return full season, we filter client-side
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/${code}/matches`,
        { headers: { 'X-Auth-Token': apiKey } },
      )

      const remaining = res.headers.get('X-Requests-Available-Minute')
      console.log(`[${code}] HTTP ${res.status}  remaining=${remaining ?? '?'}`)

      if (res.status === 429) {
        console.warn(`[${code}] rate limited — skipping`)
        results[code] = { upserted: 0, error: 'rate_limited' }
        continue
      }
      if (!res.ok) {
        const errText = await res.text()
        console.error(`[${code}] error:`, errText.slice(0, 300))
        results[code] = { upserted: 0, error: `HTTP ${res.status}: ${errText.slice(0, 100)}` }
        continue
      }

      const body = await res.json()
      const allMatches: any[] = body.matches ?? []

      // Only upsert upcoming (TIMED or SCHEDULED) matches
      const upcoming = allMatches.filter((m: any) => UPCOMING.has(m.status))
      console.log(`[${code}] ${allMatches.length} total, ${upcoming.length} upcoming`)

      if (!upcoming.length) {
        results[code] = { upserted: 0, total: allMatches.length }
        continue
      }

      const rows = upcoming.map((m: any) => ({
        external_id: String(m.id),
        home:        m.homeTeam.shortName ?? m.homeTeam.name,
        away:        m.awayTeam.shortName ?? m.awayTeam.name,
        home_short:  (m.homeTeam.tla ?? m.homeTeam.shortName ?? '???').slice(0, 3).toUpperCase(),
        away_short:  (m.awayTeam.tla ?? m.awayTeam.shortName ?? '???').slice(0, 3).toUpperCase(),
        kickoff:     m.utcDate,
        status:      'scheduled',
        league,
        gameweek:    m.matchday ?? 1,
      }))

      const { error } = await supabase
        .from('fixtures')
        .upsert(rows, { onConflict: 'external_id' })

      if (error) {
        console.error(`[${code}] upsert error:`, error.message)
        results[code] = { upserted: 0, total: allMatches.length, error: error.message }
      } else {
        results[code] = { upserted: rows.length, total: allMatches.length }
      }
    } catch (err) {
      console.error(`[${code}] unexpected error:`, err)
      results[code] = { upserted: 0, error: String(err) }
    }
  }

  const total = Object.values(results).reduce((s, r) => s + r.upserted, 0)
  console.log('[sync-fixtures] done —', total, 'total upserted', results)
  return Response.json({ ok: true, total, results })
})
