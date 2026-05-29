import axios from 'axios'
import { tokenStorage } from '../utils/tokenStorage'

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем access token в каждый запрос
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
  console.log(`[API] Token present: ${!!token}`)
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      console.log(`[API] Token role: ${payload.role}`)
      console.log(`[API] Token subject: ${payload.sub}`)
    } catch (error) {
      console.error(`[API] Failed to decode JWT: ${error.message}`)
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  console.error(`[API] Request interceptor error: ${error.message}`)
  return Promise.reject(error)
})

// Обработка ответов
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} from ${response.config.url}`)
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    console.error(`[API] Error ${error.response?.status} from ${originalRequest?.url}`)
    console.error(`[API] Error details: ${error.response?.data?.message || error.message}`)
    
    // Для регистрации и логина не пытаемся обновлять токен
    if (originalRequest?.url?.includes('/auth') || originalRequest?.url?.includes('/reg')) {
      return Promise.reject(error)
    }
    
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = tokenStorage.getRefreshToken()
        if (!refreshToken) {
          console.error('[API] No refresh token available')
          throw new Error('No refresh token')
        }
        
        console.log('[API] Attempting to refresh token...')
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: refreshToken
        })
        
        if (response.data && response.data.accessToken) {
          tokenStorage.setAccessToken(response.data.accessToken)
          if (response.data.refreshToken) {
            tokenStorage.setRefreshToken(response.data.refreshToken)
          }
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
          console.log('[API] Token refreshed successfully')
          return api(originalRequest)
        } else {
          throw new Error('Failed to refresh token: no access token in response')
        }
      } catch (refreshError) {
        console.error(`[API] Refresh token failed: ${refreshError.message}`)
        tokenStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default api

// import axios from 'axios'
// import { tokenStorage } from '../utils/tokenStorage'

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Добавляем access token в каждый запрос
// api.interceptors.request.use((config) => {
//   const token = tokenStorage.getAccessToken()
//   console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
//   console.log(`[API] Token present: ${!!token}`)
//   if (token) {
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]))
//       console.log(`[API] Token role: ${payload.role}`)
//     // eslint-disable-next-line no-unused-vars
//     } catch(e) {
      
//     }
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// // Обработка ответов
// api.interceptors.response.use(
//   (response) => {
//     console.log(`[API] Response ${response.status} from ${response.config.url}`)
//     return response
//   },
//   async (error) => {
//     const originalRequest = error.config
    
//     console.error(`[API] Error ${error.response?.status} from ${originalRequest?.url}`, error.response?.data)
    
//     // Для регистрации и логина не пытаемся обновлять токен
//     if (originalRequest.url?.includes('/auth') || originalRequest.url?.includes('/reg')) {
//       return Promise.reject(error)
//     }
    
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true
      
//       try {
//         const refreshToken = tokenStorage.getRefreshToken()
//         if (!refreshToken) {
//           throw new Error('No refresh token')
//         }
        
//         const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
//           refreshToken: refreshToken
//         })
        
//         if (response.data && response.data.accessToken) {
//           tokenStorage.setAccessToken(response.data.accessToken)
//           originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
//           return api(originalRequest)
//         }
//       } catch (refreshError) {
//         console.error('[API] Refresh token failed:', refreshError)
//         tokenStorage.clear()
//         window.location.href = '/login'
//         return Promise.reject(refreshError)
//       }
//     }
    
//     return Promise.reject(error)
//   }
// )

// export default api