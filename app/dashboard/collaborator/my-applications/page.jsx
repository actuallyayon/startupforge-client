'use client';

import { useQuery } from '@tanstack/react-query'
import { api } from '../../../../src/lib/api'
import Loader from '../../../../src/components/Loader'
import StatusBadge from '../../../../src/components/StatusBadge'

export default function MyApplications() {
  const { data: apps, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => (await api.get('/applications/mine')).data,
  })

  if (isLoading) return <Loader />

  return (
    <div>
      <h1 className="text-2xl font-extrabold">My Applications</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Track the status of your applications</p>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
            <tr>
              <th className="p-4">Opportunity</th>
              <th className="p-4">Startup</th>
              <th className="p-4">Applied Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {(apps || []).map((a) => (
              <tr key={a._id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="p-4 font-semibold">{a.role_title || '—'}</td>
                <td className="p-4">{a.startup_name || '—'}</td>
                <td className="p-4">{new Date(a.applied_at).toLocaleDateString()}</td>
                <td className="p-4"><StatusBadge status={a.status} /></td>
              </tr>
            ))}
            {!apps?.length && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">You haven't applied to anything yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
