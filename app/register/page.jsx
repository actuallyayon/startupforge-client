'use client';

import { useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../../src/context/AuthContext'
import { uploadImage } from '../../src/lib/imgbb'

export default function Register() {
  const { register: registerUser, loginWithGoogle } = useAuth()
  const navigate = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageMode, setImageMode] = useState('url') // 'url' | 'file'
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: 'collaborator' },
  })
  const selectedRole = watch('role')

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      let image = values.imageUrl?.trim() || ''
      if (imageMode === 'file' && values.imageFile?.[0]) {
        toast.loading('Uploading image...', { id: 'img' })
        image = await uploadImage(values.imageFile[0])
        toast.dismiss('img')
      }
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        image,
      })
      toast.success('Account created!')
      navigate.replace('/dashboard')
    } catch (err) {
      toast.dismiss('img')
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-page flex items-center justify-center py-16">
      <div className="card w-full max-w-lg p-8">
        <h1 className="text-2xl font-extrabold">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Join StartupForge as a founder or collaborator
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Role selection */}
          <div>
            <label className="label">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {['founder', 'collaborator'].map((r) => (
                <label
                  key={r}
                  className={`cursor-pointer rounded-xl border-2 p-3 text-center text-sm font-semibold capitalize transition ${
                    selectedRole === r
                      ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <input type="radio" value={r} className="sr-only" {...register('role')} />
                  {r}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Name</label>
            <input className="input" placeholder="Jane Doe" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} />
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
          </div>

          {/* Image: URL or file upload via imgbb */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="label mb-0">Profile Image</label>
              <div className="flex gap-1 text-xs">
                <button type="button" onClick={() => setImageMode('url')} className={imageMode === 'url' ? 'font-semibold text-brand-600' : 'text-slate-400'}>URL</button>
                <span className="text-slate-300">|</span>
                <button type="button" onClick={() => setImageMode('file')} className={imageMode === 'file' ? 'font-semibold text-brand-600' : 'text-slate-400'}>Upload</button>
              </div>
            </div>
            {imageMode === 'url' ? (
              <input className="input" placeholder="https://image-url.com/me.png" {...register('imageUrl')} />
            ) : (
              <input type="file" accept="image/*" className="input" {...register('imageFile')} />
            )}
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 characters' },
                validate: {
                  upper: (v) => /[A-Z]/.test(v) || 'Must include an uppercase letter',
                  lower: (v) => /[a-z]/.test(v) || 'Must include a lowercase letter',
                },
              })}
            />
            {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
            <p className="mt-1 text-xs text-slate-400">Min 6 chars, one uppercase, one lowercase.</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /> OR <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <button onClick={() => loginWithGoogle('/dashboard')} className="btn-outline w-full">
          <FcGoogle size={20} /> Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
