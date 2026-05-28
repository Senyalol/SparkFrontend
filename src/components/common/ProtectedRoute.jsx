import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { hasAdminAccess } from '../../utils/roles'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, userRole, loading } = useAuth()
  
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  if (requireAdmin && !hasAdminAccess(userRole)) {
    return <Navigate to="/dashboard" />
  }
  
  return children
}

export default ProtectedRoute