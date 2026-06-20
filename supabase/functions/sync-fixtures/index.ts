import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const COMPETITIONS = [
  { code: 'BSA', league: 'Brasileirão' },
  { code: 'PL',  league: 'Premier League' },
  { code: 'PD',  league: 'La Liga' },
  { code: 'SA',  league: 'Serie A' },
  { code: 'BL1', league: 'Bundesliga' },
  { code: 'CL',  league: 'Champions League' },
]

const UPCOMING = new Set(['TIMED', 'SCHEDULED'])
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

Deno.serve(async (_req: Request): Promise<Response> => {
  const apiKey = Deno.env.get('FOOTBALL_API_KEY')
  if (!apiKey) return Response.json({ error: 'FOOTBALL_API_KEY not set' }, { status: 500 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const results: Record<string, { upserted: number; total?: number; error?: string }> = {}

  for (let i = 0; i < COMPETITIONS.length; i++) {
    const { code, league } = COMPETITIONS[i]
    if (i > 0) await sleep(6200)

    try {
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/${code}/matches`,
        { headers: { 'X-Auth-Token': apiKey } },
      )

      console.log(`[${code}] HTTP ${res.status}  remaining=${res.headers.get('X-Requests-Available-Minute') ?? '?'}`)

      if (res.status === 429) { results[code] = { upserted: 0, error: 'rate_limited' }; continue }
      if (!res.ok) {
        results[code] = { upserted: 0, error: `HTTP ${res.status}: ${(await res.text()).slice(0, 100)}` }
        continue
      }

      const body = await res.json()
      const allMatches: any[] = body.matches ?? []
      const upcoming = allMatches.filter((m: any) => UPCOMING.has(m.status))
      console.log(`[${code}] ${allMatches.length} total, ${upcoming.length} upcoming`)

      if (!upcoming.length) { results[code] = { upserted: 0, total: allMatches.length }; continue }

      const rows = upcoming.map((m: any) => ({
        external_id:  String(m.id),
        home:         m.homeTeam.shortName ?? m.homeTeam.name,
        away:         m.awayTeam.shortName ?? m.awayTeam.name,
        home_short:   (m.homeTeam.tla ?? m.homeTeam.shortName ?? '???').slice(0, 3).toUpperCase(),
        away_short:   (m.awayTeam.tla ?? m.awayTeam.shortName ?? '???').slice(0, 3).toUpperCase(),
        home_team_id: String(m.homeTeam.id),
        away_team_id: String(m.awayTeam.id),
        kickoff:      m.utcDate,
        status:       'scheduled',
        league,
        gameweek:     m.matchday ?? 1,
      }))

      const { error } = await supabase
        .from('fixtures')
        .upsert(rows, { onConflict: 'external_id' })

      results[code] = error
        ? { upserted: 0, total: allMatches.length, error: error.message }
        : { upserted: rows.length, total: allMatches.length }
    } catch (err) {
      console.error(`[${code}]`, err)
      results[code] = { upserted: 0, error: String(err) }
    }
  }

  const total = Object.values(results).reduce((s, r) => s + r.upserted, 0)
  console.log('[sync-fixtures] done —', total, 'total upserted', results)
  return Response.json({ ok: true, total, results })
})
