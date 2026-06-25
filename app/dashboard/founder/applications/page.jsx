'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FiCheck, FiX, FiExternalLink } from 'react-icons/fi'
import { api } from '../../../../src/lib/api'
import Loader from '../../../../src/components/Loader'
import StatusBadge from '../../../../src/components/StatusBadge'

export default function FounderApplications() {
  const queryClient = useQueryClient()

  const { data: apps, isLoading } = useQuery({
    queryKey: ['founder-applications'],
    queryFn: async () => (await api.get('/applications/founder')).data,
  })

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/applications/${id}/status`, { status })
      toast.success(`Application ${status.toLowerCase()}`)
      queryClient.invalidateQueries({ queryKey: ['founder-applications'] })
    } catch {
      toast.error('Update failed')
    }
  }

  if (isLoading) return <Loader />

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Applications</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Review and respond to applicants</p>

      <div className="mt-6 grid gap-4">
        {(apps || []).map((a) => (
          <div key={a._id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{a.role_title}</h3>
                  <StatusBadge status={a.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Applicant: <span className="font-medium text-slate-700 dark:text-slate-200">{a.applicant_email}</span>
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{a.motivation}</p>
                {a.portfolio_link && (
                  <a href={a.portfolio_link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
                    <FiExternalLink /> Portfolio
                  </a>
                )}
                <p className="mt-2 text-xs text-slate-400">Applied {new Date(a.applied_at).toLocaleDateString()}</p>
              </div>
              {a.status === 'Pending' && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(a._id, 'Accepted')} className="btn bg-emerald-600 text-white hover:bg-emerald-700">
                    <FiCheck /> Accept
                  </button>
                  <button onClick={() => updateStatus(a._id, 'Rejected')} className="btn-danger">
                    <FiX /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {!apps?.length && <p className="text-slate-500">No applications yet.</p>}
      </div>
    </div>
  )
}
