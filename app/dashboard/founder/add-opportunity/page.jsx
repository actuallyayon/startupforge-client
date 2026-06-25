'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { api } from '../../../../src/lib/api'
import { useAuth } from '../../../../src/context/AuthContext'
import Loader from '../../../../src/components/Loader'

const WORK_TYPES = ['Remote', 'On-site', 'Hybrid']
const COMMITMENTS = ['Full-time', 'Part-time', 'Contract', 'Volunteer']

export default function AddOpportunity() {
  const navigate = useRouter()
  const { isPremium } = useAuth()
  const [saving, setSaving] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: startups, isLoading } = useQuery({
    queryKey: ['my-startups'],
    queryFn: async () => (await api.get('/startups/mine')).data,
  })

  const startUpgrade = async () => {
    setUpgrading(true)
    try {
      const { data } = await api.post('/payments/create-checkout-session')
      window.location.href = data.url
    } catch {
      toast.error('Could not start checkout')
      setUpgrading(false)
    }
  }

  const onSubmit = async (values) => {
    setSaving(true)
    try {
      await api.post('/opportunities', {
        startup_id: values.startup_id,
        role_title: values.role_title,
        required_skills: values.required_skills,
        work_type: values.work_type,
        commitment_level: values.commitment_level,
        deadline: values.deadline,
      })
      toast.success('Opportunity posted!')
      reset()
      navigate.push('/dashboard/founder/manage-opportunities')
    } catch (err) {
      if (err.response?.data?.code === 'PREMIUM_REQUIRED') {
        toast((t) => (
          <span className="flex flex-col gap-2">
            <span>Free limit reached. Upgrade to post more.</span>
            <button
              className="btn-primary"
              onClick={() => { toast.dismiss(t.id); startUpgrade() }}
            >
              Upgrade now
            </button>
          </span>
        ), { duration: 6000 })
      } else {
        toast.error(err.response?.data?.message || 'Failed to post')
      }
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <Loader />

  if (!startups?.length) {
    return (
      <div className="card flex items-center gap-3 p-6 text-amber-700 dark:text-amber-300">
        <FiAlertCircle size={22} />
        <p>You need to create a startup before posting opportunities.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold">Add Opportunity</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Post a new role for your startup</p>

      {isPremium ? (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
          <FiCheckCircle size={16} />
          <span>Premium active — you can post unlimited opportunities.</span>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-brand-50 px-4 py-2 text-sm text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
          <span>Free plan allows up to 3 opportunities.</span>
          <button onClick={startUpgrade} disabled={upgrading} className="font-semibold underline">
            {upgrading ? 'Redirecting...' : 'Go Premium'}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 grid gap-4 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Startup</label>
          <select className="input" {...register('startup_id', { required: true })}>
            {startups.map((s) => <option key={s._id} value={s._id}>{s.startup_name}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Role Title</label>
          <input className="input" placeholder="e.g. Frontend Developer" {...register('role_title', { required: 'Required' })} />
          {errors.role_title && <p className="mt-1 text-xs text-rose-500">{errors.role_title.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="label">Required Skills (comma separated)</label>
          <input className="input" placeholder="React, TypeScript, Tailwind" {...register('required_skills', { required: 'Required' })} />
          {errors.required_skills && <p className="mt-1 text-xs text-rose-500">{errors.required_skills.message}</p>}
        </div>
        <div>
          <label className="label">Work Type</label>
          <select className="input" {...register('work_type')}>
            {WORK_TYPES.map((w) => <option key={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Commitment Level</label>
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
            {saving ? 'Posting...' : 'Post Opportunity'}
          </button>
        </div>
      </form>
    </div>
  )
}
