'use client'

import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import type { Header as HeaderType } from '@/payload-types'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo/Logo'
import { Menu, X } from 'lucide-react'
import axios from 'axios'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  // Get token
  useEffect(() => {
    const storedToken = Cookies.get('authtoken')
    if (storedToken) {
      setToken(storedToken ?? null)
      router.push('/home')
    }
  }, [])

  // Get user role
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/users/me', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        setRole(res.data?.user?.role || null)
      } catch (error) {
        console.error('Error fetching user role:', error)
      }
    }

    if (token) fetchUser()
  }, [token])

  const handleLogout = () => {
    Cookies.remove('authtoken')
    setToken(null)
    setRole(null)
    window.location.href = '/Login'
  }

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)

  // Admin links
  const adminLinks = [
    { href: '/home', label: 'Home' },
    { href: '/users', label: 'Users' },
    { href: '/products', label: 'Products' },
    { href: '/orders', label: 'Orders' },
    {href : 'profile', label: 'Profile'},
  ]

  // Regular user links
  const userLinks = [
    { href: '/home', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/cart', label: 'Cart' },
    { href: '/order', label: 'Orders' },
    { href: '/profile', label: 'Profile' },
  ]

  const linksToShow = role === 'admin' ? adminLinks : userLinks

  return (
    <header className="w-screen bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-screen mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2">
          <Logo loading="eager" priority="high" className="invert dark:invert-0 w-32" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-lg text-gray-700">
          {token ? (
            <>
              {linksToShow.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-primary transition"
                >
                  {item.label}
                </Link>
              ))}
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/signup">
                <Button variant="outline">Signup</Button>
              </Link>
              <Link href="/Login">
                <Button>Login</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4">
          <nav className="flex flex-col gap-4 pt-4 text-base text-gray-700">
            {token ? (
              <>
                {linksToShow.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Signup</Button>
                </Link>
                <Link href="/Login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Login</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
