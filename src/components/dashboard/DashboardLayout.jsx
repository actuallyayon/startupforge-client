'use client';

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FiGrid, FiBriefcase, FiPlusCircle, FiList, FiInbox, FiUser, FiUsers,
  FiLayers, FiCreditCard, FiLogOut, FiMenu, FiX, FiHome,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Loader from '../Loader'

const menusByRole = {
  founder: [
    { to: '/dashboard', label: 'Overview', icon: FiGrid, end: true },
    { to: '/dashboard/founder/my-startup', label: 'My Startup', icon: FiBriefcase },
    { to: '/dashboard/founder/add-opportunity', label: 'Add Opportunity', icon: FiPlusCircle },
    { to: '/dashboard/founder/manage-opportunities', label: 'Manage Opportunities', icon: FiList },
    { to: '/dashboard/founder/applications', label: 'Applications', icon: FiInbox },
    { to: '/dashboard/profile', label: 'Profile', icon: FiUser },
  ],
  collaborator: [
    { to: '/dashboard', label: 'Overview', icon: FiGrid, end: true },
    { to: '/dashboard/collaborator/my-applications', label: 'My Applications', icon: FiList },
    { to: '/dashboard/profile', label: 'Profile', icon: FiUser },
  ],
  admin: [
    { to: '/dashboard', label: 'Overview', icon: FiGrid, end: true },
    { to: '/dashboard/admin/manage-users', label: 'Manage Users', icon: FiUsers },
    { to: '/dashboard/admin/manage-startups', label: 'Manage Startups', icon: FiLayers },
    { to: '/dashboard/admin/transactions', label: 'Transactions', icon: FiCreditCard },
    { to: '/dashboard/profile', label: 'Profile', icon: FiUser },
  ],
}

export default function DashboardLayout({ children }) {
  const { role, user, profile, logout, loading } = useAuth()
  const navigate = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (loading) return <Loader full label="Loading dashboard..." />

  const menu = menusByRole[role] || menusByRole.collaborator

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate.push('/')
  }

  const linkClass = (href, end) => {
    const isActive = end ? pathname === href : pathname?.startsWith(href);
    return `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? 'bg-brand-600 text-white shadow'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`
  }

  const SidebarInner = () => (
    <>
      <Link href="/" className="mb-6 flex items-center gap-2 px-2">
        <img src="/forge.svg" alt="StartupForge" className="h-8 w-8" />
        <span className="text-lg font-extrabold">
          Startup<span className="text-brand-600">Forge</span>
        </span>
      </Link>

      <div className="mb-6 flex items-center gap-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
        <img
          src={profile?.image || user?.image || 'https://i.ibb.co/4pDNDk1/avatar.png'}
          alt="profile"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{profile?.name || user?.name}</p>
          <p className="text-xs capitalize text-brand-600">{role}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {menu.map((m) => (
          <Link key={m.to} href={m.to} className={linkClass(m.to, m.end)} onClick={() => setOpen(false)}>
            <m.icon size={18} /> {m.label}
          </Link>
        ))}
      </nav>

      <div className="mt-4 flex flex-col gap-1 border-t border-slate-200 pt-4 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          <FiHome size={18} /> Back to site
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">
          <FiLogOut size={18} /> Logout
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-900">
        <Link href="/" className="flex items-center gap-2">
          <img src="/forge.svg" alt="StartupForge" className="h-7 w-7" />
          <span className="font-extrabold">StartupForge</span>
        </Link>
        <button className="btn-ghost p-2" onClick={() => setOpen(true)} aria-label="Open menu">
          <FiMenu size={22} />
        </button>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 lg:flex dark:border-slate-800 dark:bg-slate-900">
          <SidebarInner />
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white p-4 dark:bg-slate-900">
              <button className="btn-ghost mb-2 self-end p-2" onClick={() => setOpen(false)} aria-label="Close">
                <FiX size={22} />
              </button>
              <SidebarInner />
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
