import axios from 'axios'
import { tokenStorage } from '../utils/tokenStorage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем access token в каждый запрос
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, token ? '✅ Token present' : '❌ NO TOKEN')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Обработка ответов
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`)
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    console.error(`[API] Error ${error.response?.status} from ${originalRequest?.url}`, error.response?.data)
    
    // Для регистрации и логина не пытаемся обновлять токен
    if (originalRequest.url?.includes('/auth') || originalRequest.url?.includes('/reg')) {
      return Promise.reject(error)
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = tokenStorage.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token')
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: refreshToken
        })
        
        if (response.data && response.data.accessToken) {
          tokenStorage.setAccessToken(response.data.accessToken)
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        console.error('[API] Refresh token failed:', refreshError)
        tokenStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default api