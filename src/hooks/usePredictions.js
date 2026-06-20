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

  async function savePrediction(fixture_id, pick, is_captain = false) {
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

  async function saveCaptain(newFixtureId) {
    // Clear any existing captain for this user
    await supabase
      .from('predictions')
      .update({ is_captain: false })
      .eq('user_id', userId)
      .eq('is_captain', true)

    // Set captain on the new fixture only if it already has a pick saved
    if (newFixtureId) {
      const hasPick = predictions.find(p => p.fixture_id === newFixtureId)
      if (hasPick) {
        await supabase
          .from('predictions')
          .update({ is_captain: true })
          .eq('user_id', userId)
          .eq('fixture_id', newFixtureId)
      }
    }

    // Optimistic local update — no flicker
    setPredictions(prev => prev.map(p => ({
      ...p,
      is_captain: p.fixture_id === newFixtureId,
    })))
  }

  return { predictions, savePrediction, saveCaptain, loading }
}
