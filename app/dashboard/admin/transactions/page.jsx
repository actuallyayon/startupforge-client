'use client';

import { useQuery } from '@tanstack/react-query'
import { api } from '../../../../src/lib/api'
import Loader from '../../../../src/components/Loader'
import StatusBadge from '../../../../src/components/StatusBadge'

export default function Transactions() {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => (await api.get('/payments')).data,
  })

  if (isLoading) return <Loader />

  const total = (payments || []).reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Transactions</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">All premium payments on the platform</p>

      <div className="card mt-6 p-5">
        <p className="text-sm text-slate-500">Total Revenue</p>
        <p className="text-3xl font-extrabold text-brand-600">${total.toFixed(2)}</p>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {(payments || []).map((p) => (
              <tr key={p._id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="p-4 font-semibold">{p.user_email}</td>
                <td className="p-4">${p.amount}</td>
                <td className="p-4 font-mono text-xs">{p.transaction_id}</td>
                <td className="p-4">{new Date(p.paid_at).toLocaleDateString()}</td>
                <td className="p-4"><StatusBadge status={p.payment_status} /></td>
              </tr>
            ))}
            {!payments?.length && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">No transactions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
