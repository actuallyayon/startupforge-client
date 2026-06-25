import axios from 'axios'

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_KEY

// Upload a File to imgbb and return the hosted image URL.
export async function uploadImage(file) {
  if (!file) return ''
  if (!IMGBB_KEY) {
    throw new Error('VITE_IMGBB_KEY is not configured')
  }
  const formData = new FormData()
  formData.append('image', file)
  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
    formData
  )
  return data?.data?.url
}
