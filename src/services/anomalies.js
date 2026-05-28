import api from './api'

export const anomaliesService = {
  // Получить все аномалии
  getAllAnomalies: async () => {
    try {
      const response = await api.get('/anomaly')
      return response.data
    } catch (error) {
      console.error('Get all anomalies error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки аномалий'
    }
  },

  // Получить аномалию по ID
  getAnomalyById: async (id) => {
    try {
      const response = await api.get('/anomaly/id', {
        params: { id: id }
      })
      return response.data
    } catch (error) {
      console.error('Get anomaly by id error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки аномалии'
    }
  },

  // Получить аномалии по типу
  getAnomaliesByType: async (type) => {
    try {
      const response = await api.get('/anomaly/type', {
        params: { type: type }
      })
      return response.data
    } catch (error) {
      console.error('Get anomalies by type error:', error)
      throw error.response?.data?.message || 'Ошибка поиска по типу аномалии'
    }
  },

  // Получить аномалии по пользователю
  getAnomaliesByUser: async (userId) => {
    try {
      const response = await api.get('/anomaly/user', {
        params: { userId: userId }
      })
      return response.data
    } catch (error) {
      console.error('Get anomalies by user error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки аномалий пользователя'
    }
  },

  // Фильтрация по сумме (sum)
  getAnomaliesBySumRange: async (min, max) => {
    try {
      const response = await api.get('/anomaly/sum/range', {
        params: { min: min, max: max }
      })
      return response.data
    } catch (error) {
      console.error('Get anomalies by sum range error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по сумме (диапазон)'
    }
  },

  getAnomaliesByMoreSum: async (sum) => {
    try {
      const response = await api.get('/anomaly/sum/more', {
        params: { sum: sum }
      })
      return response.data
    } catch (error) {
      console.error('Get anomalies by sum more error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по сумме >'
    }
  },

  getAnomaliesByLessSum: async (sum) => {
    try {
      const response = await api.get('/anomaly/sum/less', {
        params: { sum: sum }
      })
      return response.data
    } catch (error) {
      console.error('Get anomalies by sum less error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по сумме <'
    }
  },

  // Фильтрация по времени (eventTime)
  getAnomaliesByEventTimeRange: async (min, max) => {
    try {
      const response = await api.get('/anomaly/etime/range', {
        params: { min: min, max: max }
      })
      return response.data
    } catch (error) {
      console.error('Get anomalies by event time range error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по времени (диапазон)'
    }
  },

  getAnomaliesByMaxEventTime: async (max) => {
    try {
      const response = await api.get('/anomaly/etime/more', {
        params: { max: max }
      })
      return response.data
    } catch (error) {
      console.error('Get anomalies by event time more error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по времени >'
    }
  },

  getAnomaliesByMinEventTime: async (min) => {
    try {
      const response = await api.get('/anomaly/etime/less', {
        params: { min: min }
      })
      return response.data
    } catch (error) {
      console.error('Get anomalies by event time less error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по времени <'
    }
  },

  // ========== МЕТОДЫ ДЛЯ avgCheck ==========
  
  // avgCheck > значение (использует существующий /avg-check с одним параметром min)
  getAnomaliesByAvgCheckMore: async (check) => {
    try {
      const response = await api.get('/anomaly/avg-check', {
        params: { min: check }
      })
      return response.data
    } catch (error) {
      console.error('Get anomalies by avg check more error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по среднему чеку >'
    }
  },

  // avgCheck < значение (использует новый эндпоинт /avg-check/less)
  getAnomaliesByAvgCheckLess: async (check) => {
    try {
      const response = await api.get('/anomaly/avg-check/less', {
        params: { check: check }
      })
      return response.data
    } catch (error) {
      console.error('Get anomalies by avg check less error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по среднему чеку <'
    }
  },

  // avgCheck в диапазоне (использует существующий /avg-check с min и max)
  getAnomaliesByAvgCheckRange: async (min, max) => {
    try {
      const response = await api.get('/anomaly/avg-check', {
        params: { min: min, max: max }
      })
      return response.data
    } catch (error) {
      console.error('Get anomalies by avg check range error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по среднему чеку (диапазон)'
    }
  },
}