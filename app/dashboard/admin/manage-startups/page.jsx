'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FiCheck, FiTrash2 } from 'react-icons/fi'
import { api } from '../../../../src/lib/api'
import Loader from '../../../../src/components/Loader'
import StatusBadge from '../../../../src/components/StatusBadge'

export default function ManageStartups() {
  const queryClient = useQueryClient()

  const { data: startups, isLoading } = useQuery({
    queryKey: ['admin-startups'],
    queryFn: async () => (await api.get('/startups/all')).data,
  })

  const approve = async (id) => {
    try {
      await api.patch(`/startups/${id}/approve`)
      toast.success('Startup approved')
      queryClient.invalidateQueries({ queryKey: ['admin-startups'] })
    } catch {
      toast.error('Action failed')
    }
  }

  const remove = async (id) => {
    if (!confirm('Remove this startup?')) return
    try {
      await api.delete(`/startups/${id}`)
      toast.success('Startup removed')
      queryClient.invalidateQueries({ queryKey: ['admin-startups'] })
    } catch {
      toast.error('Action failed')
    }
  }

  if (isLoading) return <Loader />

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Manage Startups</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Approve or remove submitted startups</p>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
            <tr>
              <th className="p-4">Startup</th>
              <th className="p-4">Industry</th>
              <th className="p-4">Founder</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(startups || []).map((s) => (
              <tr key={s._id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={s.logo || '/forge.svg'} alt="" className="h-9 w-9 rounded-lg object-cover" />
                    <span className="font-semibold">{s.startup_name}</span>
                  </div>
                </td>
                <td className="p-4">{s.industry}</td>
                <td className="p-4">{s.founder_email}</td>
                <td className="p-4"><StatusBadge status={s.status} /></td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    {s.status !== 'approved' && (
                      <button onClick={() => approve(s._id)} className="btn bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5">
                        <FiCheck /> Approve
                      </button>
                    )}
                    <button onClick={() => remove(s._id)} className="btn-danger px-3 py-1.5"><FiTrash2 /> Remove</button>
                  </div>
                </td>
              </tr>
            ))}
            {!startups?.length && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">No startups submitted yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
