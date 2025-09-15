import { useState, useEffect } from 'react'
import { onAuthStateChange, getCurrentUser } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    getCurrentUser().then((user) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: subscription } = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return { user, loading, isAuthenticated: !!user }
}
