import api from './api'

export const adminTokensService = {
  // Получить все токены
  getAllTokens: async () => {
    try {
      const response = await api.get('/admin/tokens')
      return response.data
    } catch (error) {
      console.error('Get all tokens error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки токенов'
    }
  },

  // Получить токены по статусу использования
  getTokensByUsedStatus: async (used) => {
    try {
      const response = await api.get('/admin/tokens/used', {
        params: { used: used }
      })
      return response.data
    } catch (error) {
      console.error('Get tokens by used status error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации токенов'
    }
  },

  // Сгенерировать новый токен
  generateToken: async (role, hoursValid) => {
    try {
      const body = {}
      if (role) body.role = role
      if (hoursValid) body.hoursValid = hoursValid
      
      const response = await api.post('/admin/tokens/generate', body)
      return response.data
    } catch (error) {
      console.error('Generate token error:', error)
      throw error.response?.data?.message || 'Ошибка генерации токена'
    }
  },

  // Сгенерировать токен с параметрами по умолчанию
  generateDefaultToken: async () => {
    try {
      const response = await api.post('/admin/tokens/generate/default')
      return response.data
    } catch (error) {
      console.error('Generate default token error:', error)
      throw error.response?.data?.message || 'Ошибка генерации токена'
    }
  },

  // Проверить валидность токена
  validateToken: async (token) => {
    try {
      const response = await api.get('/admin/tokens/validate', {
        params: { token: token }
      })
      return response.data
    } catch (error) {
      console.error('Validate token error:', error)
      return false
    }
  },

  // Отменить токен
  revokeToken: async (token) => {
    try {
      const response = await api.delete('/admin/tokens/revoke', {
        params: { token: token }
      })
      return response.data
    } catch (error) {
      console.error('Revoke token error:', error)
      throw error.response?.data?.message || 'Ошибка отмены токена'
    }
  },

  // Получить информацию о токене
  getTokenInfo: async (token) => {
    try {
      const response = await api.get('/admin/tokens/info', {
        params: { token: token }
      })
      return response.data
    } catch (error) {
      console.error('Get token info error:', error)
      throw error.response?.data?.message || 'Ошибка получения информации о токене'
    }
  },

  // Очистить просроченные токены
  cleanupExpiredTokens: async () => {
    try {
      const response = await api.delete('/admin/tokens/expired')
      return response.data
    } catch (error) {
      console.error('Cleanup expired tokens error:', error)
      throw error.response?.data?.message || 'Ошибка очистки токенов'
    }
  }
}