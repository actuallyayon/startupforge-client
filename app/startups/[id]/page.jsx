'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query'
import { FiArrowLeft, FiMail, FiTrendingUp, FiBriefcase } from 'react-icons/fi'
import { api } from '../../../src/lib/api'
import Loader from '../../../src/components/Loader'
import OpportunityCard from '../../../src/components/OpportunityCard'

export default function StartupDetails() {
  const { id } = useParams()

  const { data: startup, isLoading } = useQuery({
    queryKey: ['startup', id],
    queryFn: async () => (await api.get(`/startups/${id}`)).data,
  })

  const { data: oppData } = useQuery({
    queryKey: ['startup-opps', id],
    queryFn: async () => (await api.get('/opportunities?limit=50')).data.data,
    enabled: !!startup,
  })

  if (isLoading) return <Loader full />
  if (!startup) return <p className="container-page py-20 text-center">Startup not found.</p>

  const relatedOpps = (oppData || []).filter((o) => o.startup_id === id)

  return (
    <div className="container-page py-12">
      <Link href="/startups" className="mb-6 inline-flex items-center gap-2 text-sm text-brand-600 hover:underline">
        <FiArrowLeft /> Back to startups
      </Link>

      <div className="card overflow-hidden">
        <div className="flex flex-col items-center gap-6 bg-gradient-to-br from-brand-50 to-slate-100 p-8 sm:flex-row dark:from-slate-800 dark:to-slate-900">
          <img
            src={startup.logo || '/forge.svg'}
            alt={startup.startup_name}
            className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow dark:border-slate-700"
          />
          <div className="text-center sm:text-left">
            <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
              {startup.industry}
            </span>
            <h1 className="mt-2 text-3xl font-extrabold">{startup.startup_name}</h1>
            <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-slate-600 sm:justify-start dark:text-slate-300">
              <span className="flex items-center gap-1"><FiMail /> {startup.founder_email}</span>
              <span className="flex items-center gap-1"><FiTrendingUp /> {startup.funding_stage}</span>
            </div>
          </div>
        </div>
        <div className="p-8">
          <h2 className="text-lg font-bold">About</h2>
          <p className="mt-2 whitespace-pre-line text-slate-600 dark:text-slate-300">
            {startup.description || 'No description provided.'}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <FiBriefcase /> Open Roles
        </h2>
        {relatedOpps.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedOpps.map((o) => (
              <OpportunityCard key={o._id} opportunity={o} />
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No open roles for this startup right now.</p>
        )}
      </div>
    </div>
  )
}
