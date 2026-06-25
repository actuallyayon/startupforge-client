'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

// Guards authenticated routes. Survives refresh because it waits for the
// auth context to finish booting before deciding to redirect.
export default function PrivateRoute({ children, roles }) {
  const { user, role, loading } = useAuth()
  const location = usePathname()

  if (loading) return <Loader full label="Checking your session..." />

  if (!user) {
    // Remember intended route so login can send the user back.
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(role)) {
    return {/* Redirect happens via router or middleware: /dashboard */}
  }

  return children
}
