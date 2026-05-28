import { createContext, useState, useEffect } from 'react'
import { authService } from '../services/auth'
import { tokenStorage } from '../utils/tokenStorage'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
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
      const isValid = await authService.checkAuth()
      if (isValid) {
        setIsAuthenticated(true)
        setUser(savedUser)
      } else {
        tokenStorage.clear()
      }
    }
    setLoading(false)
  }

  const login = async (userToken, login, password) => {
    setError(null)
    const result = await authService.login(userToken, login, password)
    
    if (result.success) {
      setIsAuthenticated(true)
      setUser(result.user)
      return { success: true }
    } else {
      setError(result.error)
      return { success: false, error: result.error }
    }
  }

  const register = async (userToken, login, password) => {
    setError(null)
    const result = await authService.register(userToken, login, password)
    
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
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
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