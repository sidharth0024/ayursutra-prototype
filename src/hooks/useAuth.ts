 import { useState, useEffect } from 'react'
 import { onAuthStateChange, getCurrentUser } from '@/lib/supabase'
 export function useAuth() {
  const [user, setUser] = useState&lt;any&gt;(null)
  const [loading, setLoading] = useState(true)
  useEffect(() =&gt; {
    // Get initial user
    getCurrentUser().then((user) =&gt; {
      setUser(user)
      setLoading(false)
    })
    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((user) =&gt; {
      setUser(user)
      setLoading(false)
    })
    return () =&gt; subscription.unsubscribe()
  }, [])
  return { user, loading, isAuthenticated: !!user }
 }
