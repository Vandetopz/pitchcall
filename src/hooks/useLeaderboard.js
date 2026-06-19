import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(50)
      if (data) setLeaderboard(data)
      setLoading(false)
    }
    fetchLeaderboard()
  }, [])

  return { leaderboard, loading }
}
