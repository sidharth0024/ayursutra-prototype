'use client'
 import { useState } from 'react'
 import { useRouter } from 'next/navigation'
 import { signIn, signUp } from '@/lib/supabase'
 import { Button } from '@/components/ui/button'
 export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) =&gt; {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
        router.push('/dashboard')
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
        alert('Check your email for verification link!')
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <div>
        <div>
          <h1>AyurSutra</h1>
          <p>Panchakarma Management System</p>
        </div>
        &lt;form onSubmit={handleSubmit} className="space-y-6"&gt;
          <div>
            &lt;label htmlFor="email" className="block text-sm font-medium text-gray-700"
              Email
            &lt;/label&gt;
            &lt;input
              id="email"
              type="email"
              required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sh
              value={email}
              onChange={(e) =&gt; setEmail(e.target.value)}
            /&gt;
          </div>
          <div>
            &lt;label htmlFor="password" className="block text-sm font-medium text-gray-7
              Password
            &lt;/label&gt;
            &lt;input
              id="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md sh
              value={password}
              onChange={(e) =&gt; setPassword(e.target.value)}
            /&gt;
          </div>
          {error &amp;&amp; (
            <div>
              {error}
            </div>
          )}
          &lt;Button
            type="submit"
            disabled={loading}
            className="w-full"
          &gt;
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          &lt;/Button&gt;
        &lt;/form&gt;
        <div>
          &lt;button
            onClick={() =&gt; setIsLogin(!isLogin)}
            className="text-green-600 hover:text-green-500 text-sm"
          &gt;
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          &lt;/button&gt;
        </div>
      </div>
    </div>
  )
 }
