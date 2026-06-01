import adminApi from './adminApi'

export const adminTokensService = {
  getAllTokens: async () => {
    try {
      console.log(' [GET] /admin/tokens')
      const response = await adminApi.get('/admin/tokens')  // ← используем adminApi
      console.log(' Tokens loaded:', response.data?.length || 0)
      return response.data
    } catch (error) {
      console.error(' Get all tokens error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки токенов'
    }
  },

  getTokensByUsedStatus: async (used) => {
    try {
      console.log(` [GET] /admin/tokens/used?used=${used}`)
      const response = await adminApi.get('/admin/tokens/used', {
        params: { used: used }
      })
      return response.data
    } catch (error) {
      console.error('Get tokens by used status error:', error)
      throw error.response?.data?.message || 'Ошибка фильтрации токенов'
    }
  },

  generateToken: async (role, hoursValid) => {
    try {
      const body = {}
      if (role) body.role = role
      if (hoursValid) body.hoursValid = hoursValid
      
      console.log(' [POST] /admin/tokens/generate', body)
      const response = await adminApi.post('/admin/tokens/generate', body)
      console.log(' Token generated:', response.data)
      return response.data
    } catch (error) {
      console.error(' Generate token error:', error)
      throw error.response?.data?.message || 'Ошибка генерации токена'
    }
  },

  generateDefaultToken: async () => {
    try {
      console.log(' [POST] /admin/tokens/generate/default')
      const response = await adminApi.post('/admin/tokens/generate/default')
      console.log(' Default token generated:', response.data)
      return response.data
    } catch (error) {
      console.error('Generate default token error:', error)
      throw error.response?.data?.message || 'Ошибка генерации токена'
    }
  },

  revokeToken: async (token) => {
    try {
      console.log(` [DELETE] /admin/tokens/revoke?token=${token}`)
      const response = await adminApi.delete('/admin/tokens/revoke', {
        params: { token: token }
      })
      console.log(' Token revoked:', response.data)
      return response.data
    } catch (error) {
      console.error(' Revoke token error:', error)
      throw error.response?.data?.message || 'Ошибка отмены токена'
    }
  }
}