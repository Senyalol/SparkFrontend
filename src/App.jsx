import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'  // ← ЭТА СТРОКА ДОЛЖНА БЫТЬ!
import Dashboard from './pages/Dashboard/Dashboard'
import UsersList from './pages/Users/UsersList'
import UserDetail from './pages/Users/UserDetail'
import SegmentsList from './pages/Segments/SegmentsList'
import AnomaliesList from './pages/Anomalies/AnomaliesList'
import SegmentDetail from './pages/Segments/SegmentDetail'
import AnomalyDetail from './pages/Anomalies/AnomalyDetail'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />  {/* ← ЭТОТ МАРШРУТ ДОЛЖЕН БЫТЬ */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UsersList />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="segments" element={<SegmentsList />} />
          <Route path="/anomalies/:id" element={<AnomalyDetail />} />
          <Route path="anomalies" element={<AnomaliesList />} />
          <Route path="segments/:id" element={<SegmentDetail />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App