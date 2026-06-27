import { createAuthClient } from 'better-auth/react'

// No baseURL → Better Auth defaults to the current origin's /api/auth, which
// Next.js proxies to the server (see next.config.js). Same-origin keeps the
// session cookie first-party so it works in every browser.
export const authClient = createAuthClient({
  fetchOptions: {
    credentials: 'include',
  },
})

export const { signIn, signUp, signOut, useSession } = authClient
