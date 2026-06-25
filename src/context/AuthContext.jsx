'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authClient, useSession } from '../lib/authClient'
import { api, requestJwt, clearJwt } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { data: session, isPending } = useSession()
  const [profile, setProfile] = useState(null)
  const [booting, setBooting] = useState(true)

  // Pull our own user record (authoritative role, skills, bio, isPremium...).
  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await api.get('/users/me')
      setProfile(data)
      return data
    } catch {
      setProfile(null)
      return null
    }
  }, [])

  // When a Better Auth session exists, ensure a JWT cookie + load the profile.
  useEffect(() => {
    let active = true
    async function boot() {
      if (session?.user) {
        try {
          await requestJwt()
          await refreshProfile()
        } catch {
          if (active) setProfile(null)
        }
      } else {
        setProfile(null)
      }
      if (active) setBooting(false)
    }
    if (!isPending) {
      setBooting(true)
      boot()
    }
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, isPending])

  const register = async ({ name, email, password, role, image }) => {
    const res = await authClient.signUp.email({ name, email, password, role, image })
    if (res.error) throw new Error(res.error.message || 'Registration failed')
    await requestJwt()
    await refreshProfile()
    return res
  }

  const login = async ({ email, password }) => {
    const res = await authClient.signIn.email({ email, password })
    if (res.error) throw new Error(res.error.message || 'Login failed')
    await requestJwt()
    await refreshProfile()
    return res
  }

  const loginWithGoogle = async (callbackURL = '/dashboard') => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}${callbackURL}`,
    })
  }

  const logout = async () => {
    await clearJwt()
    await authClient.signOut()
    setProfile(null)
  }

  const user = session?.user || null
  const role = profile?.role || user?.role || null

  const value = {
    user,
    profile,
    role,
    isBlocked: !!profile?.isBlocked,
    isPremium: !!profile?.isPremium,
    loading: isPending || booting,
    register,
    login,
    loginWithGoogle,
    logout,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
