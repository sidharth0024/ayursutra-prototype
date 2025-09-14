'use client'
 import { useState, useEffect } from 'react'
 import { useRouter, usePathname } from 'next/navigation'
 import { getCurrentUser, signOut } from '@/lib/supabase'
import { User, Calendar, Users, BarChart3, LogOut, Menu, X } from 'lucide-react'
 export default function Navigation() {
  const [user, setUser] = useState&lt;any&gt;(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  useEffect(() =&gt; {
    checkUser()
  }, [])
  const checkUser = async () =&gt; {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }
  const handleSignOut = async () =&gt; {
    await signOut()
    router.push('/login')
  }
  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
  ]
  const isActive = (path: string) =&gt; pathname === path
  return (
    &lt;nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50"&gt;
      <div>
        <div>
          {/* Logo */}
          <div>
            <h1>AyurSutra</h1>
          </div>
          {/* Desktop Menu */}
          <div>
            {menuItems.map((item) =&gt; {
              const Icon = item.icon
              return (
                <a href="{item.href}">
                  &lt;Icon className="h-4 w-4" /&gt;
                  <span>{item.name}</span>
                </a>
              )
            })}
          </div>
          {/* User Menu */}
          <div>
            <span>
              {user?.email}
 </span>
            &lt;button
              onClick={handleSignOut}
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px
            &gt;
              &lt;LogOut className="h-4 w-4" /&gt;
              <span>Sign Out</span>
            &lt;/button&gt;
            {/* Mobile Menu Button */}
            &lt;button
              onClick={() =&gt; setIsOpen(!isOpen)}
              className="md:hidden flex items-center justify-center p-2 rounded-md text-g
            &gt;
              {isOpen ? &lt;X className="h-6 w-6" /&gt; : &lt;Menu className="h-6 w-6" /&
            &lt;/button&gt;
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen &amp;&amp; (
        <div>
          <div>
            {menuItems.map((item) =&gt; {
              const Icon = item.icon
              return (
                <a href="{item.href}"> setIsOpen(false)}
                &gt;
                  &lt;Icon className="h-4 w-4" /&gt;
                  <span>{item.name}</span>
                </a>
              )
            })}
          </div>
        </div>
      )}
    &lt;/nav&gt;
  )
 }
