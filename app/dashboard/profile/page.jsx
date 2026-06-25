'use client';

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../../src/context/AuthContext'
import { api } from '../../../src/lib/api'
import { uploadImage } from '../../../src/lib/imgbb'
import Loader from '../../../src/components/Loader'

export default function Profile() {
  const { profile, refreshProfile, loading } = useAuth()
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit } = useForm({
    values: {
      name: profile?.name || '',
      image: profile?.image || '',
      skills: (profile?.skills || []).join(', '),
      bio: profile?.bio || '',
    },
  })

  if (loading) return <Loader />

  const onSubmit = async (values) => {
    setSaving(true)
    try {
      let image = values.image
      if (values.imageFile?.[0]) {
        toast.loading('Uploading...', { id: 'img' })
        image = await uploadImage(values.imageFile[0])
        toast.dismiss('img')
      }
      await api.patch('/users/me', {
        name: values.name,
        image,
        skills: values.skills,
        bio: values.bio,
      })
      await refreshProfile()
      toast.success('Profile updated')
    } catch (err) {
      toast.dismiss('img')
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold">My Profile</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400">Manage your personal information</p>

      <div className="card mt-6 p-6">
        <div className="mb-6 flex items-center gap-4">
          <img
            src={profile?.image || 'https://i.ibb.co/4pDNDk1/avatar.png'}
            alt="avatar"
            className="h-20 w-20 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-bold">{profile?.name}</p>
            <p className="text-sm text-slate-500">{profile?.email}</p>
            <span className="badge mt-1 bg-brand-50 capitalize text-brand-700 dark:bg-brand-900/40">
              {profile?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" {...register('name')} />
          </div>
          <div>
            <label className="label">Image URL</label>
            <input className="input" placeholder="https://..." {...register('image')} />
            <p className="mt-1 text-xs text-slate-400">Or upload a new one below.</p>
            <input type="file" accept="image/*" className="input mt-2" {...register('imageFile')} />
          </div>
          <div>
            <label className="label">Skills (comma separated)</label>
            <input className="input" placeholder="React, Node.js, Figma" {...register('skills')} />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea rows={4} className="input" placeholder="Tell us about yourself..." {...register('bio')} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
