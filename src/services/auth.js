import api from './api'
import { tokenStorage } from '../utils/tokenStorage'

export const authService = {
  // Регистрация нового аналитика
  register: async (login, password, userToken) => {
    try {
      const requestData = {
        token: userToken,  // invite token
        login: login,
        password: password
      }
      console.log('📝 [REGISTER] Request:', requestData)
      
      const response = await api.post('/analyst/reg', requestData)
      
      console.log('✅ [REGISTER] Response:', response.data)
      console.log('✅ [REGISTER] Status:', response.status)
      
      if (response.status === 200 || response.status === 201) {
        return { 
          success: true, 
          message: 'Регистрация успешна! Теперь вы можете войти.',
          data: response.data
        }
      }
      
      return { 
        success: false, 
        error: response.data?.message || 'Ошибка регистрации' 
      }
    } catch (error) {
      console.error('❌ [REGISTER] Error:', error)
      console.error('❌ [REGISTER] Status:', error.response?.status)
      console.error('❌ [REGISTER] Data:', error.response?.data)
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Неверный или просроченный invite токен. Обратитесь к администратору.'
        }
      }
      
      if (error.response?.status === 400) {
        return {
          success: false,
          error: error.response?.data?.message || 'Неверные данные регистрации'
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
        token: userToken,  // invite token
        login: login,
        password: password
      }
      console.log('📝 [LOGIN] Request:', requestData)
      
      const response = await api.post('/analyst/auth', requestData)
      
      console.log('✅ [LOGIN] Response:', response.data)
      console.log('✅ [LOGIN] Status:', response.status)
      
      // Бэкенд возвращает поле "token" (JWT access token)
      if (response.data && response.data.token) {
        const accessToken = response.data.token
        tokenStorage.setAccessToken(accessToken)
        console.log('💾 [LOGIN] Access token saved')
        
        // Сохраняем refresh token если есть
        if (response.data.refreshToken) {
          tokenStorage.setRefreshToken(response.data.refreshToken)
          console.log('💾 [LOGIN] Refresh token saved')
        }
        
        // Определяем роль по invite токену
        let userRole = 'ANALYST'
        if (userToken && userToken.toUpperCase().includes('ADMIN')) {
          userRole = 'ADMIN'
        }
        console.log('🎭 [LOGIN] Role determined from invite token:', userRole)
        
        const userData = {
          login: login,
          role: userRole,
          inviteToken: userToken
        }
        tokenStorage.setUser(userData)
        console.log('💾 [LOGIN] User data saved:', userData)
        
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
      console.error('❌ [LOGIN] Error:', error)
      console.error('❌ [LOGIN] Status:', error.response?.status)
      console.error('❌ [LOGIN] Data:', error.response?.data)
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Доступ запрещен. Неверный invite токен, логин или пароль.'
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
      if (!token) {
        console.log('🔍 [GET_CURRENT] No access token found')
        return null
      }
      
      const response = await api.get('/analyst/getFromJWT')
      console.log('✅ [GET_CURRENT] Response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [GET_CURRENT] Error:', error)
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
        console.log('✅ [LOGOUT] Success')
      }
    } catch (error) {
      console.error('❌ [LOGOUT] Error:', error)
    } finally {
      tokenStorage.clear()
      console.log('🗑️ [LOGOUT] Storage cleared')
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
        console.log('✅ [REFRESH] Token refreshed')
        return { success: true }
      }
      
      return { success: false }
    } catch (error) {
      console.error('❌ [REFRESH] Error:', error)
      tokenStorage.clear()
      return { success: false }
    }
  }
}