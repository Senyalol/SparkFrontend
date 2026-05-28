import api from './api'

export const adminTokensService = {
  // Получить все токены
  getAllTokens: async () => {
    try {
      console.log('📡 [GET] /admin/tokens')
      const response = await api.get('/admin/tokens')
      console.log('✅ Tokens loaded:', response.data?.length || 0)
      return response.data
    } catch (error) {
      console.error('❌ Get all tokens error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки токенов'
    }
  },

  // Получить токены по статусу использования
  getTokensByUsedStatus: async (used) => {
    try {
      console.log(`📡 [GET] /admin/tokens/used?used=${used}`)
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
      
      console.log('📡 [POST] /admin/tokens/generate', body)
      const response = await api.post('/admin/tokens/generate', body)
      console.log('✅ Token generated:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Generate token error:', error)
      throw error.response?.data?.message || 'Ошибка генерации токена'
    }
  },

  // Сгенерировать токен с параметрами по умолчанию
  generateDefaultToken: async () => {
    try {
      console.log('📡 [POST] /admin/tokens/generate/default')
      const response = await api.post('/admin/tokens/generate/default')
      return response.data
    } catch (error) {
      console.error('Generate default token error:', error)
      throw error.response?.data?.message || 'Ошибка генерации токена'
    }
  },

  // Отменить токен
  revokeToken: async (token) => {
    try {
      console.log(`📡 [DELETE] /admin/tokens/revoke?token=${token}`)
      const response = await api.delete('/admin/tokens/revoke', {
        params: { token: token }
      })
      console.log('✅ Token revoked:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Revoke token error:', error)
      throw error.response?.data?.message || 'Ошибка отмены токена'
    }
  },

  // Очистить просроченные токены
  cleanupExpiredTokens: async () => {
    try {
      console.log('📡 [DELETE] /admin/tokens/expired')
      const response = await api.delete('/admin/tokens/expired')
      console.log('✅ Cleanup expired:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Cleanup expired tokens error:', error)
      throw error.response?.data?.message || 'Ошибка очистки токенов'
    }
  }
}