import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useStreak(userId) {
  const [streak, setStreak] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    async function fetchStreak() {
      const { data } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (data) setStreak(data)
      setLoading(false)
    }
    fetchStreak()
  }, [userId])

  return { streak, loading }
}
