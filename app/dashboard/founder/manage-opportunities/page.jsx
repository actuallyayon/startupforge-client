'use client';

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiEdit2, FiTrash2, FiX } from 'react-icons/fi'
import { api } from '../../../../src/lib/api'
import Loader from '../../../../src/components/Loader'

const WORK_TYPES = ['Remote', 'On-site', 'Hybrid']
const COMMITMENTS = ['Full-time', 'Part-time', 'Contract', 'Volunteer']

export default function ManageOpportunities() {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const { data: opps, isLoading } = useQuery({
    queryKey: ['my-opportunities'],
    queryFn: async () => (await api.get('/opportunities/mine')).data,
  })

  const openEdit = (o) => {
    setEditing(o)
    reset({
      role_title: o.role_title,
      required_skills: (o.required_skills || []).join(', '),
      work_type: o.work_type,
      commitment_level: o.commitment_level,
      deadline: o.deadline ? new Date(o.deadline).toISOString().slice(0, 10) : '',
    })
  }

  const onSubmit = async (values) => {
    setSaving(true)
    try {
      await api.put(`/opportunities/${editing._id}`, values)
      toast.success('Opportunity updated')
      queryClient.invalidateQueries({ queryKey: ['my-opportunities'] })
      setEditing(null)
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this opportunity?')) return
    try {
      await api.delete(`/opportunities/${id}`)
      toast.success('Deleted')
      queryClient.invalidateQueries({ queryKey: ['my-opportunities'] })
    } catch {
      toast.error('Delete failed')
    }
  }

  if (isLoading) return <Loader />

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Manage Opportunities</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">View, edit, and delete your posted roles</p>

      {editing && (
        <div className="card mt-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Edit Opportunity</h2>
            <button onClick={() => setEditing(null)} className="btn-ghost p-2"><FiX /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Role Title</label>
              <input className="input" {...register('role_title', { required: true })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Required Skills</label>
              <input className="input" {...register('required_skills')} />
            </div>
            <div>
              <label className="label">Work Type</label>
              <select className="input" {...register('work_type')}>
                {WORK_TYPES.map((w) => <option key={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Commitment</label>
              <select className="input" {...register('commitment_level')}>
                {COMMITMENTS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Deadline</label>
              <input type="date" className="input" {...register('deadline')} />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
            <tr>
              <th className="p-4">Role</th>
              <th className="p-4">Work Type</th>
              <th className="p-4">Commitment</th>
              <th className="p-4">Deadline</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(opps || []).map((o) => (
              <tr key={o._id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="p-4 font-semibold">{o.role_title}</td>
                <td className="p-4">{o.work_type}</td>
                <td className="p-4">{o.commitment_level}</td>
                <td className="p-4">{o.deadline ? new Date(o.deadline).toLocaleDateString() : '—'}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(o)} className="btn-outline px-3 py-1.5"><FiEdit2 /></button>
                    <button onClick={() => handleDelete(o._id)} className="btn-danger px-3 py-1.5"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!opps?.length && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">No opportunities posted yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
