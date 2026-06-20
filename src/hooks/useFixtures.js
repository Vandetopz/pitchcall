import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useFixtures(selectedLeague) {
  const [fixtures, setFixtures]   = useState([])
  const [allLeagues, setAllLeagues] = useState([])
  const [loading, setLoading]     = useState(true)

  // Fetch distinct leagues with upcoming matches sorted by nearest kickoff
  useEffect(() => {
    async function fetchLeagues() {
      const now = new Date().toISOString()
      const { data } = await supabase
        .from('fixtures')
        .select('league, kickoff')
        .gt('kickoff', now)
        .order('kickoff')
      if (!data) return

      const seen = new Set()
      const leagues = []
      for (const f of data) {
        if (!seen.has(f.league)) { seen.add(f.league); leagues.push(f.league) }
      }
      setAllLeagues(leagues)
    }
    fetchLeagues()
  }, [])

  // Fetch fixtures for the next upcoming gameweek of the selected league,
  // then enrich each fixture with standings positions for difficulty display.
  useEffect(() => {
    if (!selectedLeague) return
    setLoading(true)
    setFixtures([])

    async function fetchFixtures() {
      const now = new Date().toISOString()

      // Step 1: find next gameweek
      const { data: next } = await supabase
        .from('fixtures')
        .select('gameweek')
        .eq('league', selectedLeague)
        .gt('kickoff', now)
        .order('kickoff')
        .limit(1)
        .maybeSingle()

      if (!next) { setFixtures([]); setLoading(false); return }

      // Step 2: all fixtures in that round
      const { data } = await supabase
        .from('fixtures')
        .select('*')
        .eq('league', selectedLeague)
        .eq('gameweek', next.gameweek)
        .order('kickoff')

      if (!data) { setFixtures([]); setLoading(false); return }

      // Step 3: standings positions for teams in this round (best-effort)
      const teamIds = [...new Set(
        data.flatMap(f => [f.home_team_id, f.away_team_id].filter(Boolean))
      )]

      let posMap = {}
      if (teamIds.length) {
        const { data: sData } = await supabase
          .from('standings')
          .select('team_id, position')
          .eq('league', selectedLeague)
          .in('team_id', teamIds)
        for (const s of sData ?? []) posMap[s.team_id] = s.position
      }

      // Attach positions to fixtures so FixtureCard can compute difficulty
      const enriched = data.map(f => ({
        ...f,
        home_pos: f.home_team_id ? (posMap[f.home_team_id] ?? null) : null,
        away_pos: f.away_team_id ? (posMap[f.away_team_id] ?? null) : null,
      }))

      setFixtures(enriched)
      setLoading(false)
    }

    fetchFixtures()
  }, [selectedLeague])

  return { fixtures, allLeagues, loading }
}
