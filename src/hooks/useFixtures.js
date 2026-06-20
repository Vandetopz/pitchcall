import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useFixtures(selectedLeague) {
  const [fixtures, setFixtures] = useState([])
  const [allLeagues, setAllLeagues] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch distinct leagues that have upcoming matches, sorted by nearest kickoff.
  // Runs once on mount — leagues list changes only when sync-fixtures runs.
  useEffect(() => {
    async function fetchLeagues() {
      const now = new Date().toISOString()
      const { data } = await supabase
        .from('fixtures')
        .select('league, kickoff')
        .gt('kickoff', now)
        .order('kickoff')

      if (!data) return

      // Deduplicate: first occurrence of each league = nearest upcoming kickoff
      const seen = new Set()
      const leagues = []
      for (const f of data) {
        if (!seen.has(f.league)) {
          seen.add(f.league)
          leagues.push(f.league)
        }
      }
      setAllLeagues(leagues)
    }
    fetchLeagues()
  }, [])

  // Fetch the current round for the selected league:
  // 1. Find the minimum gameweek that still has a future kickoff
  // 2. Return ALL fixtures in that (league, gameweek) pair — including
  //    already-kicked-off matches so the full round is visible
  useEffect(() => {
    if (!selectedLeague) return
    setLoading(true)
    setFixtures([])

    async function fetchFixtures() {
      const now = new Date().toISOString()

      // Cheapest way to find the next gameweek: first upcoming fixture by kickoff
      const { data: next } = await supabase
        .from('fixtures')
        .select('gameweek')
        .eq('league', selectedLeague)
        .gt('kickoff', now)
        .order('kickoff')
        .limit(1)
        .maybeSingle()

      if (!next) {
        setFixtures([])
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('fixtures')
        .select('*')
        .eq('league', selectedLeague)
        .eq('gameweek', next.gameweek)
        .order('kickoff')

      if (data) setFixtures(data)
      setLoading(false)
    }

    fetchFixtures()
  }, [selectedLeague])

  return { fixtures, allLeagues, loading }
}
