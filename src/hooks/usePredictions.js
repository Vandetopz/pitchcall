import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function usePredictions(userId) {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    async function fetchPredictions() {
      const { data } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', userId)
      if (data) setPredictions(data)
      setLoading(false)
    }
    fetchPredictions()
  }, [userId])

  async function savePrediction(fixture_id, pick, is_captain) {
    const { data } = await supabase
      .from('predictions')
      .upsert(
        { user_id: userId, fixture_id, pick, is_captain },
        { onConflict: 'user_id,fixture_id' }
      )
      .select()
      .single()
    if (data) {
      setPredictions(prev => {
        const idx = prev.findIndex(p => p.fixture_id === fixture_id)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = data
          return next
        }
        return [...prev, data]
      })
    }
  }

  return { predictions, savePrediction, loading }
}
