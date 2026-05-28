import api from './api'

export const analystsService = {
  // Получить всех аналитиков
  getAllAnalysts: async () => {
    try {
      console.log('📡 [GET] /analyst')
      const response = await api.get('/analyst')
      console.log('✅ Analysts loaded:', response.data?.length || 0)
      return response.data
    } catch (error) {
      console.error('❌ Get all analysts error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки аналитиков'
    }
  },

  // Получить ID по логину
  getAnalystIdByLogin: async (login) => {
  if (!login || login === 'undefined') {
    throw new Error('Логин аналитика не указан')
  }
  try {
    console.log(`📡 [GET] /analyst/idByLogin?login=${login}`)
    const response = await api.get('/analyst/idByLogin', {
      params: { login: login }
    })
    console.log('✅ Response data:', response.data)
    console.log('✅ Response data type:', typeof response.data)
    
    // Если response.data - это объект, извлекаем ID
    let analystId = response.data
    if (typeof response.data === 'object' && response.data !== null) {
      analystId = response.data.id || response.data.analystId || Object.values(response.data)[0]
    }
    
    // Если это число или строка с числом
    if (typeof analystId === 'string') {
      analystId = parseInt(analystId, 10)
    }
    
    console.log('✅ Parsed analyst ID:', analystId)
    return analystId
  } catch (error) {
    console.error('❌ Get analyst id by login error:', error)
    throw error.response?.data?.message || 'Ошибка получения ID аналитика'
  }
},

  // Получить аналитика по ID
  getAnalystById: async (id) => {
  if (!id || id === 'undefined') {
    throw new Error('ID аналитика не указан')
  }
  try {
    console.log(`📡 [GET] /analyst/params/id?id=${id}`)
    const response = await api.get('/analyst/params/id', {
      params: { id: id }
    })
    console.log('✅ Analyst loaded:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Get analyst by id error:', error)
    throw error.response?.data?.message || 'Ошибка загрузки аналитика'
  }
},

  // Получить аналитика по логину
  getAnalystByLogin: async (login) => {
    if (!login || login === 'undefined') {
      throw new Error('Логин аналитика не указан')
    }
    try {
      console.log(`📡 [GET] /analyst/params/login?login=${login}`)
      const response = await api.get('/analyst/params/login', {
        params: { login: login }
      })
      console.log('✅ Analyst loaded:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Get analyst by login error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки аналитика'
    }
  },

  // Получить аналитиков по роли
  getAnalystsByRole: async (role) => {
    try {
      console.log(`📡 [GET] /analyst/params/role?role=${role}`)
      const response = await api.get('/analyst/params/role', {
        params: { role: role }
      })
      return response.data
    } catch (error) {
      console.error('Get analysts by role error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации по роли'
    }
  },

  // Обновить аналитика по ID
  updateAnalyst: async (analystId, updateData) => {
    if (!analystId || analystId === 'undefined') {
      throw new Error('ID аналитика не указан')
    }
    try {
      console.log(`📡 [PATCH] /analyst?analystId=${analystId}`, updateData)
      const response = await api.patch('/analyst', updateData, {
        params: { analystId: analystId }
      })
      console.log('✅ Analyst updated:', response.data)
      return response.data
    } catch (error) {
      console.error('Update analyst error:', error)
      throw error.response?.data?.message || 'Ошибка обновления аналитика'
    }
  },

  // Удалить аналитика по ID
  deleteAnalyst: async (analystId) => {
    if (!analystId || analystId === 'undefined') {
      throw new Error('ID аналитика не указан')
    }
    try {
      console.log(`📡 [DELETE] /analyst?analystId=${analystId}`)
      const response = await api.delete('/analyst', {
        params: { analystId: analystId }
      })
      console.log('✅ Analyst deleted:', response.data)
      return response.data
    } catch (error) {
      console.error('Delete analyst error:', error)
      throw error.response?.data?.message || 'Ошибка удаления аналитика'
    }
  },

  // Получить информацию о текущем аналитике из JWT
  getCurrentAnalyst: async () => {
    try {
      console.log('📡 [GET] /analyst/getFromJWT')
      const response = await api.get('/analyst/getFromJWT')
      return response.data
    } catch (error) {
      console.error('Get current analyst error:', error)
      throw error.response?.data?.message || 'Ошибка получения данных'
    }
  }
}