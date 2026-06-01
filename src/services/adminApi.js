import axios from 'axios'
import { tokenStorage } from '../utils/tokenStorage'

const ADMIN_API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'

const adminApi = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})


adminApi.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default adminApi