import axios from 'axios'

// Same-origin: requests go to /api/* and Next.js (see next.config.js rewrites)
// proxies them to the API server. Talking only to our own origin keeps the JWT +
// Better Auth cookies first-party, so they work in every browser.
// withCredentials sends those cookies.
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

// Request a fresh JWT cookie (call right after login / on app boot when a session exists).
export async function requestJwt() {
  const { data } = await api.post('/jwt')
  return data
}

export async function clearJwt() {
  try {
    await api.post('/jwt/logout')
  } catch {
    // ignore — logging out client-side regardless
  }
}
