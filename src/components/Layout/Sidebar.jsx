import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { hasAdminAccess } from '../../utils/roles'

const Sidebar = () => {
  const { userRole } = useAuth()
  const isAdmin = hasAdminAccess(userRole)

  const commonMenuItems = [
    { path: '/dashboard', label: 'Дашборд', icon: '📊' },
    { path: '/users', label: 'Пользователи', icon: '👥' },
    { path: '/segments', label: 'Сегменты', icon: '🏷️' },
    { path: '/anomalies', label: 'Аномалии', icon: '⚠️' },
  ]

  const adminMenuItems = [
    { path: '/analysts', label: 'Аналитики', icon: '👨‍💻' },
    { path: '/admin/tokens', label: 'Токены', icon: '🔑' },
  ]

  return (
    <aside style={{
      width: '250px',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <h3 style={{ marginBottom: '20px' }}>Меню</h3>
      <nav>
        {commonMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'block',
              padding: '10px',
              marginBottom: '5px',
              backgroundColor: isActive ? '#34495e' : 'transparent',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            })}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
        
        {isAdmin && (
          <>
            <div style={{ 
              height: '1px', 
              backgroundColor: '#34495e', 
              margin: '15px 0' 
            }} />
            {adminMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '10px',
                  marginBottom: '5px',
                  backgroundColor: isActive ? '#34495e' : 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                })}
              >
                {item.icon} {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        fontSize: '12px',
        color: '#7f8c8d'
      }}>
        Роль: {userRole || '—'}
      </div>
    </aside>
  )
}

export default Sidebar