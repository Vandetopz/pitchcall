import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useFixtures() {
  const [fixtures, setFixtures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFixtures() {
      const { data, error } = await supabase
        .from('fixtures')
        .select('*')
        .order('kickoff')
      console.log('[useFixtures] data:', data)
      console.log('[useFixtures] error:', error)
      if (data?.[0]) console.log('[useFixtures] COLUMN NAMES:', Object.keys(data[0]))
      if (data) setFixtures(data)
      setLoading(false)
    }
    fetchFixtures()
  }, [])

  return { fixtures, loading }
}
