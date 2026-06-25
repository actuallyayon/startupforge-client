'use client';

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiMenu, FiX, FiSun, FiMoon, FiLogOut } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/startups', label: 'Browse Startups' },
  { to: '/opportunities', label: 'Browse Opportunities' },
]

export default function Navbar() {
  const { user, profile, logout } = useAuth()
  const { theme, toggleTheme, mounted } = useTheme()
  const navigate = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate.push('/')
    setOpen(false)
  }

  const linkClass = (href) => {
    const isActive = href === '/' ? pathname === href : pathname?.startsWith(href);
    return `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/forge.svg" alt="StartupForge" className="h-8 w-8" />
          <span className="text-lg font-extrabold tracking-tight">
            Startup<span className="text-brand-600">Forge</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {publicLinks.map((l) => (
            <Link key={l.to} href={l.to} className={linkClass(l.to)}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button onClick={toggleTheme} className="btn-ghost p-2" aria-label="Toggle theme">
            {mounted ? (theme === 'dark' ? <FiSun /> : <FiMoon />) : <div className="h-4 w-4" />}
          </button>
          {user ? (
            <>
              <Link href="/dashboard" className={linkClass('/dashboard')}>
                Dashboard
              </Link>
              <Link href="/dashboard/profile" className="flex items-center gap-2">
                <img
                  src={profile?.image || user.image || 'https://i.ibb.co/4pDNDk1/avatar.png'}
                  alt="profile"
                  className="h-9 w-9 rounded-full border border-slate-200 object-cover dark:border-slate-700"
                />
              </Link>
              <button onClick={handleLogout} className="btn-outline">
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary">
              Login
            </Link>
          )}
        </div>

        <button
          className="btn-ghost p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-1">
            {publicLinks.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                className={linkClass(l.to)}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" className={linkClass('/dashboard')} onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" className={linkClass('/dashboard/profile')} onClick={() => setOpen(false)}>
                  Profile
                </Link>
                <button onClick={handleLogout} className="btn-outline mt-2 w-full">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-primary mt-2 w-full" onClick={() => setOpen(false)}>
                Login
              </Link>
            )}
            <button onClick={toggleTheme} className="btn-ghost mt-2 justify-start">
              {mounted ? (theme === 'dark' ? <FiSun /> : <FiMoon />) : <div className="h-4 w-4" />} Toggle theme
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
