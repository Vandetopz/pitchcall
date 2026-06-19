import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useUser() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user ?? {
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

      if (!error && data) setProfile(data)
      setLoading(false)
    }

    upsertProfile()
  }, [])

  return { user, profile, loading }
}
