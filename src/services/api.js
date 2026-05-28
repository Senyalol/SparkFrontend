import axios from 'axios'
import { tokenStorage } from '../utils/tokenStorage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем access token в каждый запрос
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Обработка ответов и обновление токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Если 401 и не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Если уже обновляем токен, добавляем в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }
      
      originalRequest._retry = true
      isRefreshing = true
      
      try {
        const refreshToken = tokenStorage.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token')
        }
        
        // Запрос на обновление токена
        const response = await axios.post(`${API_BASE_URL}/analyst/refresh`, {
          refreshToken: refreshToken
        })
        
        if (response.data && response.data.token) {
          // Сохраняем новый access token
          tokenStorage.setAccessToken(response.data.token)
          
          // Если пришел новый refresh token, сохраняем и его
          if (response.data.refreshToken) {
            tokenStorage.setRefreshToken(response.data.refreshToken)
          }
          
          // Обрабатываем очередь запросов
          processQueue(null, response.data.token)
          
          // Повторяем оригинальный запрос
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`
          return api(originalRequest)
        } else {
          throw new Error('Failed to refresh token')
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        tokenStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    
    return Promise.reject(error)
  }
)

export default api