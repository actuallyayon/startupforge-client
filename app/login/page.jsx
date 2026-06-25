'use client';

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '../../src/context/AuthContext'

export default function Login() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useRouter()
  const from = '/' // Next.js doesn't support location.state. In Next.js this requires a 'redirect' search param.
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      await login(values)
      toast.success('Welcome back!')
      navigate.replace(from)
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-page flex items-center justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-extrabold">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Log in to continue to StartupForge
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /> OR <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <button onClick={() => loginWithGoogle(from)} className="btn-outline w-full">
          <FcGoogle size={20} /> Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
