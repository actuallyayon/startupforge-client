'use client';

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiBriefcase, FiClock, FiMapPin, FiCalendar } from 'react-icons/fi'
import { api } from '../../../src/lib/api'
import { useAuth } from '../../../src/context/AuthContext'
import Loader from '../../../src/components/Loader'

function formatDate(d) {
  if (!d) return 'Open until filled'
  return new Date(d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function OpportunityDetails() {
  const { id } = useParams()
  const navigate = useRouter()
  const { user, role } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: opp, isLoading } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: async () => (await api.get(`/opportunities/${id}`)).data,
  })

  if (isLoading) return <Loader full />
  if (!opp) return <p className="container-page py-20 text-center">Opportunity not found.</p>

  const startup = opp.startup || {}

  const onApply = async (values) => {
    setSubmitting(true)
    try {
      await api.post('/applications', {
        opportunity_id: id,
        portfolio_link: values.portfolio_link,
        motivation: values.motivation,
      })
      toast.success('Application submitted!')
      reset()
      navigate.push('/dashboard/collaborator/my-applications')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page py-12">
      <Link href="/opportunities" className="mb-6 inline-flex items-center gap-2 text-sm text-brand-600 hover:underline">
        <FiArrowLeft /> Back to opportunities
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="card p-8">
            <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
              {opp.work_type}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold">{opp.role_title}</h1>
            <Link href={`/startups/${startup._id}`} className="mt-2 inline-flex items-center gap-2 text-brand-600 hover:underline">
              <FiBriefcase /> {startup.startup_name || 'Startup'}
            </Link>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2"><FiClock /> {opp.commitment_level}</span>
              <span className="flex items-center gap-2"><FiMapPin /> {opp.work_type}</span>
              <span className="flex items-center gap-2"><FiCalendar /> Deadline: {formatDate(opp.deadline)}</span>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold">Required Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {(opp.required_skills || []).map((s) => (
                  <span key={s} className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {startup.description && (
              <div className="mt-8">
                <h2 className="text-lg font-bold">About {startup.startup_name}</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{startup.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Apply panel */}
        <div>
          <div className="card sticky top-20 p-6">
            <h2 className="text-lg font-bold">Apply for this role</h2>
            {!user ? (
              <div className="mt-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">Log in as a collaborator to apply.</p>
                <Link href="/login" className="btn-primary mt-4 w-full">Login to apply</Link>
              </div>
            ) : role !== 'collaborator' ? (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Only collaborators can apply to opportunities.
              </p>
            ) : (
              <form onSubmit={handleSubmit(onApply)} className="mt-4 space-y-4">
                <div>
                  <label className="label">Portfolio Link</label>
                  <input
                    className="input"
                    placeholder="https://github.com/you"
                    {...register('portfolio_link', { required: 'Portfolio link is required' })}
                  />
                  {errors.portfolio_link && <p className="mt-1 text-xs text-rose-500">{errors.portfolio_link.message}</p>}
                </div>
                <div>
                  <label className="label">Motivation</label>
                  <textarea
                    rows={4}
                    className="input"
                    placeholder="Why are you a great fit?"
                    {...register('motivation', { required: 'Motivation is required' })}
                  />
                  {errors.motivation && <p className="mt-1 text-xs text-rose-500">{errors.motivation.message}</p>}
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
