import api from './api'

export const analystsService = {
  // Получить всех аналитиков (только ADMIN)
  getAllAnalysts: async () => {
    try {
      const response = await api.get('/analyst')
      return response.data
    } catch (error) {
      console.error('Get all analysts error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки аналитиков'
    }
  },

  // Получить аналитика по ID (только ADMIN)
  getAnalystById: async (id) => {
    try {
      const response = await api.get('/analyst/params/id', {
        params: { id: id }
      })
      return response.data
    } catch (error) {
      console.error('Get analyst by id error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки аналитика'
    }
  },

  // Получить аналитика по логину (только ADMIN)
  getAnalystByLogin: async (login) => {
    try {
      const response = await api.get('/analyst/params/login', {
        params: { login: login }
      })
      return response.data
    } catch (error) {
      console.error('Get analyst by login error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки аналитика'
    }
  },

  // Получить аналитиков по роли (только ADMIN)
  getAnalystsByRole: async (role) => {
    try {
      const response = await api.get('/analyst/params/role', {
        params: { role: role }
      })
      return response.data
    } catch (error) {
      console.error('Get analysts by role error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по роли'
    }
  },

  // Обновить аналитика (только ADMIN)
  updateAnalyst: async (analystId, updateData) => {
    try {
      const response = await api.patch('/analyst', null, {
        params: { analystId: analystId },
        data: updateData
      })
      return response.data
    } catch (error) {
      console.error('Update analyst error:', error)
      throw error.response?.data?.message || 'Ошибка обновления аналитика'
    }
  },

  // Удалить аналитика (только ADMIN)
  deleteAnalyst: async (analystId) => {
    try {
      const response = await api.delete('/analyst', {
        params: { analystId: analystId }
      })
      return response.data
    } catch (error) {
      console.error('Delete analyst error:', error)
      throw error.response?.data?.message || 'Ошибка удаления аналитика'
    }
  },

  // Получить информацию о текущем аналитике из JWT
  getCurrentAnalyst: async () => {
    try {
      const response = await api.get('/analyst/getFromJWT')
      return response.data
    } catch (error) {
      console.error('Get current analyst error:', error)
      throw error.response?.data?.message || 'Ошибка получения данных'
    }
  }
}