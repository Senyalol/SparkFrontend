import api from './api'
import { tokenStorage } from '../utils/tokenStorage'

export const authService = {
  // Регистрация нового аналитика
  register: async (userToken, login, password) => {
    try {
      const response = await api.post('/analyst/reg', {
        token: userToken,  // Персональный токен пользователя
        login: login,
        password: password
      })
      
      console.log('Register response:', response.data)
      
      if (response.status === 200 || response.status === 201) {
        return { 
          success: true, 
          message: response.data?.message || 'Регистрация успешна' 
        }
      }
      
      return { 
        success: false, 
        error: response.data?.message || 'Ошибка регистрации' 
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка соединения с сервером'
      }
    }
  },

  // Авторизация - получаем JWT токены
  login: async (userToken, login, password) => {
    try {
      const response = await api.post('/analyst/auth', {
        token: userToken,  // Персональный токен пользователя
        login: login,
        password: password
      })
      
      console.log('Login response:', response.data)
      
      // Сохраняем JWT токены после успешной авторизации
      if (response.data && response.data.token) {
        // Сохраняем JWT access token
        tokenStorage.setAccessToken(response.data.token)
        
        // Сохраняем JWT refresh token если есть
        if (response.data.refreshToken) {
          tokenStorage.setRefreshToken(response.data.refreshToken)
        }
        
        // Сохраняем данные пользователя
        const userData = {
          id: response.data.userId || response.data.id || login,
          login: login,
        }
        tokenStorage.setUser(userData)
        
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
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка соединения с сервером'
      }
    }
  },

  // Обновление access token по refresh token
  refreshToken: async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token')
      }
      
      // Для обновления используем только refresh token, ADMIN_TOKEN не нужен
      const response = await api.post('/analyst/refresh', {
        refreshToken: refreshToken
      })
      
      if (response.data && response.data.token) {
        tokenStorage.setAccessToken(response.data.token)
        
        if (response.data.refreshToken) {
          tokenStorage.setRefreshToken(response.data.refreshToken)
        }
        
        return { success: true }
      }
      
      return { success: false, error: 'Failed to refresh token' }
    } catch (error) {
      console.error('Refresh token error:', error)
      tokenStorage.clear()
      return { success: false, error: error.message }
    }
  },

  // Выход
  logout: async () => {
    try {
      // При выходе удаляем JWT токены
      tokenStorage.clear()
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      tokenStorage.clear()
      return { success: false, error: error.message }
    }
  },

  // Проверка валидности JWT access токена
  checkAuth: async () => {
    const token = tokenStorage.getAccessToken()
    if (!token) return false
    
    try {
      // Проверяем JWT токен
      await api.get('/analyst/verify')
      return true
    } catch (error) {
      // Если 401, пробуем обновить токен
      if (error.response?.status === 401) {
        const refreshResult = await authService.refreshToken()
        if (refreshResult.success) {
          return true
        }
      }
      tokenStorage.clear()
      return false
    }
  }
}