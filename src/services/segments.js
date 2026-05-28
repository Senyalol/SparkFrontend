import api from './api'

export const segmentsService = {
  // Получить все сегменты
  getAllSegments: async () => {
    try {
      const response = await api.get('/segments')
      return response.data
    } catch (error) {
      console.error('Get all segments error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки сегментов'
    }
  },

  // Получить сегмент по ID
  getSegmentById: async (id) => {
    try {
      const response = await api.get('/segments/id', {
        params: { id: id }
      })
      return response.data
    } catch (error) {
      console.error('Get segment by id error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки сегмента'
    }
  },

  // Получить сегменты по ID пользователя
  getSegmentsByUserId: async (userId) => {
    try {
      const response = await api.get('/segments/user', {
        params: { userId: userId }
      })
      return response.data
    } catch (error) {
      console.error('Get segments by user id error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки сегментов пользователя'
    }
  },

  // Получить сегменты по имени пользователя
  getSegmentsByUsername: async (lastname, name = null) => {
    try {
      const params = { lastname: lastname }
      if (name) {
        params.name = name
      }
      const response = await api.get('/segments/username', { params })
      return response.data
    } catch (error) {
      console.error('Get segments by username error:', error)
      throw error.response?.data?.message || 'Ошибка поиска по имени пользователя'
    }
  },

  // Получить сегменты по типу (VIP, Standard и т.д.)
  getSegmentsByType: async (segment) => {
    try {
      const response = await api.get('/segments/type', {
        params: { segment: segment }
      })
      return response.data
    } catch (error) {
      console.error('Get segments by type error:', error)
      throw error.response?.data?.message || 'Ошибка поиска по типу сегмента'
    }
  },

  // Фильтрация по R (давности)
  getSegmentsByRMore: async (R) => {
    try {
      const response = await api.get('/segments/R/more', {
        params: { R: R }
      })
      return response.data
    } catch (error) {
      console.error('Get segments by R more error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по R >'
    }
  },

  getSegmentsByRLess: async (R) => {
    try {
      const response = await api.get('/segments/R/less', {
        params: { R: R }
      })
      return response.data
    } catch (error) {
      console.error('Get segments by R less error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по R <'
    }
  },

  getSegmentsByRRange: async (min, max) => {
    try {
      const response = await api.get('/segments/R/range', {
        params: { min: min, max: max }
      })
      return response.data
    } catch (error) {
      console.error('Get segments by R range error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по R (диапазон)'
    }
  },

  // Фильтрация по F (частоте)
  getSegmentsByFMore: async (F) => {
    try {
      const response = await api.get('/segments/F/more', {
        params: { F: F }
      })
      return response.data
    } catch (error) {
      console.error('Get segments by F more error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по F >'
    }
  },

  getSegmentsByFLess: async (F) => {
    try {
      const response = await api.get('/segments/F/less', {
        params: { F: F }
      })
      return response.data
    } catch (error) {
      console.error('Get segments by F less error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по F <'
    }
  },

  getSegmentsByFRange: async (min, max) => {
    try {
      const response = await api.get('/segments/F/range', {
        params: { min: min, max: max }
      })
      return response.data
    } catch (error) {
      console.error('Get segments by F range error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по F (диапазон)'
    }
  },

  // Фильтрация по M (денежной сумме)
  getSegmentsByMMore: async (M) => {
    try {
      const response = await api.get('/segments/M/more', {
        params: { M: M }
      })
      return response.data
    } catch (error) {
      console.error('Get segments by M more error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по M >'
    }
  },

  getSegmentsByMLess: async (M) => {
    try {
      const response = await api.get('/segments/M/less', {
        params: { M: M }
      })
      return response.data
    } catch (error) {
      console.error('Get segments by M less error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по M <'
    }
  },

  getSegmentsByMRange: async (min, max) => {
    try {
      const response = await api.get('/segments/M/range', {
        params: { min: min, max: max }
      })
      return response.data
    } catch (error) {
      console.error('Get segments by M range error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по M (диапазон)'
    }
  }
}