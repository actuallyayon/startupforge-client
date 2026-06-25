'use client';

import { useState, useEffect } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { FiSearch, FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi'
import { api } from '../../src/lib/api'
import OpportunityCard from '../../src/components/OpportunityCard'
import Loader from '../../src/components/Loader'

const LIMIT = 6

export default function BrowseOpportunities() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [workType, setWorkType] = useState('')
  const [industry, setIndustry] = useState('')
  const [page, setPage] = useState(1)

  // Debounce the search box so each keystroke doesn't hit the server.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  // Reset to page 1 whenever a filter changes.
  useEffect(() => setPage(1), [workType, industry])

  const { data: filters } = useQuery({
    queryKey: ['opp-filters'],
    queryFn: async () => (await api.get('/opportunities/filters')).data,
  })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['opportunities', search, workType, industry, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: LIMIT })
      if (search) params.set('search', search)
      if (workType) params.set('work_type', workType)
      if (industry) params.set('industry', industry)
      return (await api.get(`/opportunities?${params.toString()}`)).data
    },
    placeholderData: keepPreviousData,
  })

  const opps = data?.data || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Browse Opportunities</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Search and filter open roles across startups
        </p>
      </div>

      {/* Controls */}
      <div className="card mb-8 grid gap-4 p-5 md:grid-cols-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search by role or skill..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <select className="input" value={workType} onChange={(e) => setWorkType(e.target.value)}>
          <option value="">All Work Types</option>
          {(filters?.workTypes || []).map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
        <select className="input" value={industry} onChange={(e) => setIndustry(e.target.value)}>
          <option value="">All Industries</option>
          {(filters?.industries || []).map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      {(workType || industry || search) && (
        <button
          onClick={() => { setSearchInput(''); setSearch(''); setWorkType(''); setIndustry('') }}
          className="mb-6 inline-flex items-center gap-2 text-sm text-brand-600 hover:underline"
        >
          <FiFilter /> Clear filters
        </button>
      )}

      {isLoading ? (
        <Loader />
      ) : opps.length ? (
        <>
          <p className="mb-4 text-sm text-slate-500">
            Showing {opps.length} of {data?.total || 0} opportunities
          </p>
          <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-60' : ''}`}>
            {opps.map((o) => (
              <OpportunityCard key={o._id} opportunity={o} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                className="btn-outline px-3"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <FiChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-10 w-10 rounded-lg text-sm font-semibold transition ${
                    p === page
                      ? 'bg-brand-600 text-white'
                      : 'border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                className="btn-outline px-3"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="py-16 text-center text-slate-500">No opportunities match your search.</p>
      )}
    </div>
  )
}
