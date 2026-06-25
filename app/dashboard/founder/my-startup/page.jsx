'use client';

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi'
import { api } from '../../../../src/lib/api'
import { uploadImage } from '../../../../src/lib/imgbb'
import { useAuth } from '../../../../src/context/AuthContext'
import Loader from '../../../../src/components/Loader'
import StatusBadge from '../../../../src/components/StatusBadge'

const INDUSTRIES = ['Fintech', 'Healthtech', 'Edtech', 'E-commerce', 'SaaS', 'AI/ML', 'Gaming', 'Other']
const STAGES = ['Idea', 'Pre-seed', 'Seed', 'Series A', 'Bootstrapped']

export default function MyStartup() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(null) // null | 'new' | startup object
  const [saving, setSaving] = useState(false)

  const { data: startups, isLoading } = useQuery({
    queryKey: ['my-startups'],
    queryFn: async () => (await api.get('/startups/mine')).data,
  })

  const { register, handleSubmit, reset } = useForm()

  const openForm = (startup) => {
    setEditing(startup || 'new')
    reset(
      startup || { startup_name: '', industry: INDUSTRIES[0], funding_stage: STAGES[0], description: '', logo: '' }
    )
  }

  const onSubmit = async (values) => {
    setSaving(true)
    try {
      let logo = values.logo || ''
      if (values.logoFile?.[0]) {
        toast.loading('Uploading logo...', { id: 'logo' })
        logo = await uploadImage(values.logoFile[0])
        toast.dismiss('logo')
      }
      const payload = {
        startup_name: values.startup_name,
        logo,
        industry: values.industry,
        description: values.description,
        funding_stage: values.funding_stage,
      }
      if (editing === 'new') {
        if (!logo) return toast.error('Logo is required')
        await api.post('/startups', payload)
        toast.success('Startup created — pending admin approval')
      } else {
        await api.put(`/startups/${editing._id}`, payload)
        toast.success('Startup updated')
      }
      queryClient.invalidateQueries({ queryKey: ['my-startups'] })
      setEditing(null)
    } catch (err) {
      toast.dismiss('logo')
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this startup? This cannot be undone.')) return
    try {
      await api.delete(`/startups/${id}`)
      toast.success('Startup deleted')
      queryClient.invalidateQueries({ queryKey: ['my-startups'] })
    } catch {
      toast.error('Delete failed')
    }
  }

  if (isLoading) return <Loader />

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">My Startup</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Create and manage your startup profile</p>
        </div>
        {!editing && (
          <button onClick={() => openForm(null)} className="btn-primary">
            <FiPlus /> Create Startup
          </button>
        )}
      </div>

      {editing && (
        <div className="card mt-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">{editing === 'new' ? 'Create Startup' : 'Edit Startup'}</h2>
            <button onClick={() => setEditing(null)} className="btn-ghost p-2"><FiX /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Startup Name</label>
              <input className="input" {...register('startup_name', { required: true })} />
            </div>
            <div>
              <label className="label">Industry</label>
              <select className="input" {...register('industry')}>
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Funding Stage</label>
              <select className="input" {...register('funding_stage')}>
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Logo (upload as file)</label>
              <input type="file" accept="image/*" className="input" {...register('logoFile')} />
              {editing !== 'new' && <p className="mt-1 text-xs text-slate-400">Leave empty to keep current logo.</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea rows={4} className="input" {...register('description')} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Founder Email</label>
              <input className="input bg-slate-100 dark:bg-slate-800" value={profile?.email || ''} disabled />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : editing === 'new' ? 'Create' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {(startups || []).map((s) => (
          <div key={s._id} className="card p-5">
            <div className="flex items-start gap-4">
              <img src={s.logo || '/forge.svg'} alt={s.startup_name} className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{s.startup_name}</h3>
                  <StatusBadge status={s.status} />
                </div>
                <p className="text-sm text-brand-600">{s.industry} · {s.funding_stage}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{s.description}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => openForm(s)} className="btn-outline flex-1"><FiEdit2 /> Edit</button>
              <button onClick={() => handleDelete(s._id)} className="btn-danger flex-1"><FiTrash2 /> Delete</button>
            </div>
          </div>
        ))}
        {!startups?.length && !editing && (
          <p className="text-slate-500">You haven't created a startup yet.</p>
        )}
      </div>
    </div>
  )
}
