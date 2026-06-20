import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useFixturesFeed() {
  const [liveFixtures, setLiveFixtures]   = useState([])
  const [feedFixtures, setFeedFixtures]   = useState([]) // next 3 calendar days in UTC

  useEffect(() => {
    const now = new Date().toISOString()
    // +3 days covers today+tomorrow regardless of user timezone offset
    const end = new Date(Date.now() + 3 * 86_400_000).toISOString()

    async function fetchLive() {
      const { data } = await supabase
        .from('fixtures')
        .select('*')
        .in('status', ['in_play', 'paused'])
        .order('kickoff')
      setLiveFixtures(data ?? [])
    }

    async function fetchFeed() {
      const { data } = await supabase
        .from('fixtures')
        .select('*')
        .gte('kickoff', now)
        .lte('kickoff', end)
        .order('kickoff')
      setFeedFixtures(data ?? [])
    }

    fetchLive()
    fetchFeed()
  }, [])

  return { liveFixtures, feedFixtures }
}
