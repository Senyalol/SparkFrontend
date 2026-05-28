import { createContext, useState, useEffect } from 'react'
import { authService } from '../services/auth'
import { tokenStorage } from '../utils/tokenStorage'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const accessToken = tokenStorage.getAccessToken()
    const savedUser = tokenStorage.getUser()
    
    if (accessToken && savedUser) {
      try {
        const analystData = await authService.getCurrentAnalyst()
        if (analystData) {
          setIsAuthenticated(true)
          setUser(analystData)
          setUserRole(analystData.role)
          tokenStorage.setUser(analystData)
        } else {
          tokenStorage.clear()
        }
      } catch (err) {
        console.error('Check auth error:', err)
        tokenStorage.clear()
      }
    }
    setLoading(false)
  }

  const login = async (login, password, inviteToken = null) => {
    setError(null)
    const result = await authService.login(login, password, inviteToken)
    
    if (result.success) {
      setIsAuthenticated(true)
      setUser(result.user)
      setUserRole(result.user?.role)
      return { success: true }
    } else {
      setError(result.error)
      return { success: false, error: result.error }
    }
  }

  // Регистрация
  const register = async (inviteToken, login, password) => {
    setError(null)
    const result = await authService.register(login, password, inviteToken)
    
    if (result.success) {
      return { success: true, message: result.message }
    } else {
      setError(result.error)
      return { success: false, error: result.error }
    }
  }

  const logout = async () => {
    await authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    setUserRole(null)
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      userRole,
      loading,
      error,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}