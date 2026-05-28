import api from './api'
import { tokenStorage } from '../utils/tokenStorage'

// Функция для определения роли по токену
const getRoleFromToken = (token) => {
  // Если токен начинается с "ADMIN" - значит роль ADMIN
  if (token && token.toUpperCase().includes('ADMIN')) {
    return 'ADMIN'
  }
  // Иначе - ANALYST
  return 'ANALYST'
}

export const authService = {
  // Регистрация нового аналитика
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
      console.error('Error status:', error.response?.status)
      console.error('Error data:', error.response?.data)
      
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

  // Авторизация
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
      
      // После успешного входа получаем JWT токены
      if (response.data && (response.data.accessToken || response.data.token)) {
        const accessToken = response.data.accessToken || response.data.token
        tokenStorage.setAccessToken(accessToken)
        
        if (response.data.refreshToken) {
          tokenStorage.setRefreshToken(response.data.refreshToken)
        }
        
        // ОПРЕДЕЛЯЕМ РОЛЬ ПО INVITE ТОКЕНУ!
        const userRole = getRoleFromToken(userToken)
        console.log('Determined role from token:', userRole)
        
        // Сохраняем информацию о пользователе
        const userData = {
          login: login,
          role: userRole
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
      console.error('Error status:', error.response?.status)
      console.error('Error data:', error.response?.data)
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Доступ запрещен. Неверный токен, логин или пароль.'
        }
      }
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Неверный логин или пароль'
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка соединения с сервером'
      }
    }
  },

  // Получить текущего аналитика из JWT
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

  // Выход
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

  // Обновление токена
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