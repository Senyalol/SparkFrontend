import { createContext, useState, useEffect } from 'react'
import { authService } from '../services/auth'
import { tokenStorage } from '../utils/tokenStorage'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

// Функция для декодирования JWT
const getRoleFromJWT = (token) => {
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || payload.authorities || null
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return null
  }
}

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
    
    console.log('🔍 Checking auth status...')
    console.log('Access token:', accessToken ? 'present' : 'missing')
    
    if (accessToken) {
      
      const roleFromJWT = getRoleFromJWT(accessToken)
      console.log('Role from JWT during check:', roleFromJWT)
      
      if (roleFromJWT) {
        setIsAuthenticated(true)
        setUserRole(roleFromJWT)
        
        // Обновляем user data если нужно
        if (savedUser) {
          setUser({ ...savedUser, role: roleFromJWT })
        }
      } else {
        // Fallback к saved user если JWT не декодируется
        if (savedUser) {
          setIsAuthenticated(true)
          setUser(savedUser)
          setUserRole(savedUser.role)
        }
      }
    }
    setLoading(false)
  }

  const login = async (login, password, userToken) => {
    setError(null)
    const result = await authService.login(login, password, userToken)
    
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

  const register = async (login, password, userToken) => {
    setError(null)
    const result = await authService.register(login, password, userToken)
    
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