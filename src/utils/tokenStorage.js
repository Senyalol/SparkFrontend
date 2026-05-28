const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'analyst_user'

export const tokenStorage = {
  // Access token
  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token)
    }
  },
  
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },
  
  removeAccessToken: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  },
  
  // Refresh token
  setRefreshToken: (token) => {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token)
    }
  },
  
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },
  
  removeRefreshToken: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
  
  // User data
  setUser: (user) => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  },
  
  getUser: () => {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },
  
  removeUser: () => {
    localStorage.removeItem(USER_KEY)
  },
  
  // Clean all
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}