'use client';

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../src/lib/api'
import StartupCard from '../../src/components/StartupCard'
import Loader from '../../src/components/Loader'

export default function BrowseStartups() {
  const [search, setSearch] = useState('')
  const { data: startups, isLoading } = useQuery({
    queryKey: ['startups'],
    queryFn: async () => (await api.get('/startups')).data,
  })

  const filtered = (startups || []).filter(
    (s) =>
      s.startup_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.industry?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Browse Startups</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Explore approved startups building their teams
        </p>
      </div>

      <input
        className="input mb-8 max-w-md"
        placeholder="Search by name or industry..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <Loader />
      ) : filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s) => (
            <StartupCard key={s._id} startup={s} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-slate-500">No startups found.</p>
      )}
    </div>
  )
}
