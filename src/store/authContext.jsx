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
    
    console.log(' [AUTH] Checking auth status...')
    console.log(' [AUTH] Access token:', accessToken ? 'present' : 'missing')
    console.log(' [AUTH] Saved user:', savedUser)
    
    if (accessToken && savedUser) {
      setIsAuthenticated(true)
      setUser(savedUser)
      setUserRole(savedUser.role)
      console.log(' [AUTH] User authenticated:', savedUser.login, 'Role:', savedUser.role)
    } else {
      console.log(' [AUTH] No valid auth data found')
      tokenStorage.clear()
    }
    setLoading(false)
  }

  const login = async (login, password, userToken) => {
    setError(null)
    console.log(' [AUTH] Login attempt for:', login)
    
    const result = await authService.login(login, password, userToken)
    
    if (result.success) {
      setIsAuthenticated(true)
      setUser(result.user)
      setUserRole(result.user?.role)
      console.log(' [AUTH] Login successful, role:', result.user?.role)
      return { success: true }
    } else {
      setError(result.error)
      console.log(' [AUTH] Login failed:', result.error)
      return { success: false, error: result.error }
    }
  }

  const register = async (login, password, userToken) => {
    setError(null)
    console.log(' [AUTH] Register attempt for:', login)
    
    const result = await authService.register(login, password, userToken)
    
    if (result.success) {
      console.log(' [AUTH] Register successful')
      return { success: true, message: result.message }
    } else {
      setError(result.error)
      console.log(' [AUTH] Register failed:', result.error)
      return { success: false, error: result.error }
    }
  }

  const logout = async () => {
    console.log(' [AUTH] Logout')
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