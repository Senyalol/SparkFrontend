import { createContext, useState, useEffect } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверка токена при загрузке
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    // ВРЕМЕННАЯ ЗАГЛУШКА - потом замените на реальный API
    if (username === 'admin' && password === 'admin') {
      const userData = { id: 1, firstName: 'Admin', lastName: 'User' }
      localStorage.setItem('token', 'fake-token-123')
      localStorage.setItem('user', JSON.stringify(userData))
      setIsAuthenticated(true)
      setUser(userData)
      return { success: true }
    }
    return { success: false, error: 'Неверный логин или пароль' }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}