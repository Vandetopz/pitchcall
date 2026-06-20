import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useUser() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Tell Telegram the app is ready and expand to full height
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
    }

    const tgUser = tg?.initDataUnsafe?.user ?? {
      id: 99999,
      username: 'TestUser',
      first_name: 'Test',
    }
    setUser(tgUser)

    async function upsertProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            telegram_id: tgUser.id,
            username: tgUser.username ?? tgUser.first_name,
            first_name: tgUser.first_name,
          },
          { onConflict: 'telegram_id' }
        )
        .select()
        .single()

      if (!error && data) {
        // maybeSingle — new profiles may not appear in leaderboard yet
        const { data: lb } = await supabase
          .from('leaderboard')
          .select('total_points, predictions_made, correct_predictions')
          .eq('user_id', data.id)
          .maybeSingle()

        const hit_rate =
          lb?.predictions_made > 0
            ? lb.correct_predictions / lb.predictions_made
            : 0

        setProfile({
          ...data,
          total_points: lb?.total_points ?? 0,
          hit_rate,
        })
      }
      setLoading(false)
    }

    upsertProfile()
  }, [])

  return { user, profile, loading }
}
