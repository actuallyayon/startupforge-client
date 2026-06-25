'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function PrivateRoute({ children, roles }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && roles && !roles.includes(role)) {
      router.push('/dashboard');
    }
  }, [user, role, loading, router, roles]);

  if (loading || !user) return <Loader full label="Checking your session..." />;
  if (roles && !roles.includes(role)) return <Loader full label="Checking permissions..." />;

  return children;
}
