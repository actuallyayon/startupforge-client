import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Axios instance for our own API. withCredentials sends the JWT + Better Auth cookies.
export const api = axios.create({
  baseURL: `${API_URL}/api`,
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
