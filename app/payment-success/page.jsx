'use client';

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { api } from '../../src/lib/api'
import { useAuth } from '../../src/context/AuthContext'
import Loader from '../../src/components/Loader'

function PaymentSuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const { refreshProfile } = useAuth()
  const [state, setState] = useState('loading') // loading | success | error

  useEffect(() => {
    let active = true
    async function confirm() {
      if (!sessionId) return setState('error')
      try {
        await api.post('/payments/confirm', { session_id: sessionId })
        await refreshProfile()
        if (active) setState('success')
      } catch {
        if (active) setState('error')
      }
    }
    confirm()
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  if (state === 'loading') return <Loader full label="Confirming your payment..." />

  return (
    <div className="container-page flex min-h-screen flex-col items-center justify-center py-16 text-center">
      {state === 'success' ? (
        <>
          <FiCheckCircle className="text-emerald-500" size={72} />
          <h1 className="mt-6 text-3xl font-extrabold">Payment Successful!</h1>
          <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
            You're now a Premium founder. Your transaction has been saved and you can post unlimited
            opportunities.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/dashboard/founder/add-opportunity" className="btn-primary">Post an Opportunity</Link>
            <Link href="/dashboard" className="btn-outline">Go to Dashboard</Link>
          </div>
        </>
      ) : (
        <>
          <FiXCircle className="text-rose-500" size={72} />
          <h1 className="mt-6 text-3xl font-extrabold">Payment Not Confirmed</h1>
          <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
            We couldn't confirm your payment. If you were charged, please contact support.
          </p>
          <Link href="/dashboard" className="btn-primary mt-8">Back to Dashboard</Link>
        </>
      )}
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<Loader full label="Confirming your payment..." />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
