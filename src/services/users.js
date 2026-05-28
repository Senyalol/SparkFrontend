import api from './api'

export const usersService = {
  // Получить всех пользователей
  getAllUsers: async () => {
    try {
      const response = await api.get('/users')
      return response.data
    } catch (error) {
      console.error('Get all users error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки пользователей'
    }
  },

  // Получить пользователя по ID
  getUserById: async (id) => {
    try {
      const response = await api.get('/users/id', {
        params: { id: id }
      })
      return response.data
    } catch (error) {
      console.error('Get user by id error:', error)
      throw error.response?.data?.message || 'Ошибка загрузки пользователя'
    }
  },

  // Найти пользователей по имени
  getUserByName: async (name) => {
    try {
      const response = await api.get('/users/name', {
        params: { name: name }
      })
      return response.data
    } catch (error) {
      console.error('Get user by name error:', error)
      throw error.response?.data?.message || 'Ошибка поиска по имени'
    }
  },

  // Найти пользователей по фамилии
  getUserByLastName: async (lastName) => {
    try {
      const response = await api.get('/users/lastname', {
        params: { lastName: lastName }
      })
      return response.data
    } catch (error) {
      console.error('Get user by lastname error:', error)
      throw error.response?.data?.message || 'Ошибка поиска по фамилии'
    }
  }
}