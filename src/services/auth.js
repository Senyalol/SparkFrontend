import api from './api'
import { tokenStorage } from '../utils/tokenStorage'

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password })
      const { token, user } = response.data
      tokenStorage.setToken(token)
      tokenStorage.setUser(user)
      return { success: true, user }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка авторизации'
      }
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      tokenStorage.clear()
    }
  },

  checkAuth: async () => {
    const token = tokenStorage.getToken()
    if (!token) return false
    try {
      await api.get('/auth/verify')
      return true
    } catch {
      tokenStorage.clear()
      return false
    }
  }
}