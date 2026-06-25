'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FiSlash, FiCheckCircle } from 'react-icons/fi'
import { api } from '../../../../src/lib/api'
import Loader from '../../../../src/components/Loader'

export default function ManageUsers() {
  const queryClient = useQueryClient()

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/users')).data,
  })

  const toggleBlock = async (user) => {
    try {
      await api.patch(`/users/${user._id}/block`, { isBlocked: !user.isBlocked })
      toast.success(user.isBlocked ? 'User unblocked' : 'User blocked')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    } catch {
      toast.error('Action failed')
    }
  }

  if (isLoading) return <Loader />

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Manage Users</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Block or unblock platform members</p>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((u) => (
              <tr key={u._id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={u.image || 'https://i.ibb.co/4pDNDk1/avatar.png'} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <span className="font-semibold">{u.name}</span>
                  </div>
                </td>
                <td className="p-4">{u.email}</td>
                <td className="p-4 capitalize">{u.role}</td>
                <td className="p-4">
                  {u.isBlocked ? (
                    <span className="badge bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">Blocked</span>
                  ) : (
                    <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Active</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => toggleBlock(u)}
                      className={u.isBlocked ? 'btn bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5' : 'btn-danger px-3 py-1.5'}
                    >
                      {u.isBlocked ? <><FiCheckCircle /> Unblock</> : <><FiSlash /> Block</>}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
