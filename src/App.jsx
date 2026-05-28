import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import UsersList from './pages/Users/UsersList'
import UserDetail from './pages/Users/UserDetail'
import SegmentsList from './pages/Segments/SegmentsList'
import SegmentDetail from './pages/Segments/SegmentDetail'
import AnomaliesList from './pages/Anomalies/AnomaliesList'
import AnomalyDetail from './pages/Anomalies/AnomalyDetail'
import AnalystsList from './pages/Analysts/AnalystsList'
import AnalystDetail from './pages/Analysts/AnalystDetail'
import AdminTokens from './pages/Admin/AdminTokens'

// Компонент для защиты маршрутов с проверкой роли администратора
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, userRole, loading } = useAuth()
  
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  // Если требуется роль ADMIN, проверяем
  if (requireAdmin && userRole !== 'ADMIN') {
    return <Navigate to="/dashboard" />
  }
  
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Защищенные маршруты */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Пользователи */}
          <Route path="users" element={<UsersList />} />
          <Route path="users/:id" element={<UserDetail />} />
          
          {/* Сегменты */}
          <Route path="segments" element={<SegmentsList />} />
          <Route path="segments/:id" element={<SegmentDetail />} />
          
          {/* Аномалии */}
          <Route path="anomalies" element={<AnomaliesList />} />
          <Route path="anomalies/:id" element={<AnomalyDetail />} />
          
          
          {/* Только для администратора */}
          <Route path="analysts" element={
            <ProtectedRoute requireAdmin>
              <AnalystsList />
            </ProtectedRoute>
          } />
          <Route path="analysts/:id" element={
            <ProtectedRoute requireAdmin>
              <AnalystDetail />
            </ProtectedRoute>
          } />
          <Route path="admin/tokens" element={
            <ProtectedRoute requireAdmin>
              <AdminTokens />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  )
}

export default App