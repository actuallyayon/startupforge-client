import { createAuthClient } from 'better-auth/react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Better Auth React client. baseURL points at the server's /api/auth handler.
export const authClient = createAuthClient({
  baseURL: `${API_URL}/api/auth`,
  fetchOptions: {
    credentials: 'include',
  },
})

export const { signIn, signUp, signOut, useSession } = authClient
