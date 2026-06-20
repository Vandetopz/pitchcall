import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Must match the league names used in fixtures table
const COMPETITIONS = [
  { code: 'BSA', league: 'Brasileirão' },
  { code: 'PL',  league: 'Premier League' },
  { code: 'PD',  league: 'La Liga' },
  { code: 'SA',  league: 'Serie A' },
  { code: 'BL1', league: 'Bundesliga' },
  { code: 'CL',  league: 'Champions League' },
]

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

Deno.serve(async (_req: Request): Promise<Response> => {
  const apiKey = Deno.env.get('FOOTBALL_API_KEY')
  if (!apiKey) return Response.json({ error: 'FOOTBALL_API_KEY not set' }, { status: 500 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const results: Record<string, { upserted: number; error?: string }> = {}

  for (let i = 0; i < COMPETITIONS.length; i++) {
    const { code, league } = COMPETITIONS[i]
    if (i > 0) await sleep(6200)  // respect 10 req/min free tier

    try {
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/${code}/standings`,
        { headers: { 'X-Auth-Token': apiKey } },
      )

      console.log(`[${code}] HTTP ${res.status}`)

      if (res.status === 429) { results[code] = { upserted: 0, error: 'rate_limited' }; continue }
      if (!res.ok) {
        const body = await res.text()
        console.error(`[${code}]`, body.slice(0, 200))
        results[code] = { upserted: 0, error: `HTTP ${res.status}` }
        continue
      }

      const body = await res.json()
      // football-data.org returns multiple standings types (TOTAL, HOME, AWAY)
      const table = (body.standings as any[])?.find((s: any) => s.type === 'TOTAL')?.table ?? []

      if (!table.length) { results[code] = { upserted: 0 }; continue }

      const rows = table.map((e: any) => ({
        league,
        team_id:    String(e.team.id),
        team:       e.team.shortName ?? e.team.name,
        team_short: e.team.tla ?? null,
        position:   e.position,
        updated_at: new Date().toISOString(),
      }))

      const { error } = await supabase
        .from('standings')
        .upsert(rows, { onConflict: 'league,team_id' })

      results[code] = error ? { upserted: 0, error: error.message } : { upserted: rows.length }
    } catch (err) {
      console.error(`[${code}]`, err)
      results[code] = { upserted: 0, error: String(err) }
    }
  }

  const total = Object.values(results).reduce((s, r) => s + r.upserted, 0)
  console.log('[sync-standings] done —', total, 'total', results)
  return Response.json({ ok: true, total, results })
})
