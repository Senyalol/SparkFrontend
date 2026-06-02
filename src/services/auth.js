import api from './api'
import { tokenStorage } from '../utils/tokenStorage'

// Функция для декодирования JWT и получения роли
const getRoleFromJWT = (token) => {
  if (!token) return 'ANALYST'
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    console.log('🔐 Decoded JWT payload:', payload)
    const role = payload.role || payload.authorities || 'ANALYST'
    console.log('👑 Role from JWT:', role)
    return role
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return 'ANALYST'
  }
}

export const authService = {
  register: async (login, password, userToken) => {
    try {
      const requestData = {
        token: userToken,
        login: login,
        password: password
      }
      console.log('Register request:', requestData)
      
      const response = await api.post('/analyst/reg', requestData)
      
      console.log('Register response:', response.data)
      
      if (response.status === 200 || response.status === 201) {
        return { 
          success: true, 
          message: 'Регистрация успешна',
          data: response.data
        }
      }
      
      return { 
        success: false, 
        error: response.data?.message || 'Ошибка регистрации' 
      }
    } catch (error) {
      console.error('Registration error:', error)
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Неверный или просроченный токен. Обратитесь к администратору.'
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка соединения с сервером'
      }
    }
  },

  login: async (login, password, userToken) => {
    try {
      const requestData = {
        token: userToken,
        login: login,
        password: password
      }
      console.log('Login request:', requestData)
      
      const response = await api.post('/analyst/auth', requestData)
      
      console.log('Login response:', response.data)
      
      if (response.data && response.data.token) {
        const accessToken = response.data.token
        tokenStorage.setAccessToken(accessToken)
        console.log('Access token saved')
        
        if (response.data.refreshToken) {
          tokenStorage.setRefreshToken(response.data.refreshToken)
        }
        
        
        const userRole = getRoleFromJWT(accessToken)
        
        const userData = {
          login: login,
          role: userRole,
          inviteToken: userToken
        }
        tokenStorage.setUser(userData)
        console.log('User data saved:', userData)
        
        return { 
          success: true, 
          user: userData
        }
      }
      
      return { 
        success: false, 
        error: response.data?.message || 'Неверный логин, пароль или токен' 
      }
    } catch (error) {
      console.error('Login error:', error)
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Доступ запрещен. Неверный токен, логин или пароль.'
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка соединения с сервером'
      }
    }
  },

  getCurrentAnalyst: async () => {
    try {
      const token = tokenStorage.getAccessToken()
      if (!token) return null
      
      const response = await api.get('/analyst/getFromJWT')
      return response.data
    } catch (error) {
      console.error('Get current analyst error:', error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        tokenStorage.clear()
      }
      return null
    }
  },

  logout: async () => {
    try {
      const token = tokenStorage.getAccessToken()
      if (token) {
        await api.get('/analyst/exit')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      tokenStorage.clear()
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token')
      }
      
      const response = await api.post('/auth/refresh', {
        refreshToken: refreshToken
      })
      
      if (response.data && response.data.accessToken) {
        tokenStorage.setAccessToken(response.data.accessToken)
        if (response.data.refreshToken) {
          tokenStorage.setRefreshToken(response.data.refreshToken)
        }
        return { success: true }
      }
      
      return { success: false }
    } catch (error) {
      console.error('Refresh token error:', error)
      tokenStorage.clear()
      return { success: false }
    }
  }
}