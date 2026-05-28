import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', label: 'Дашборд', icon: '📊' },
    { path: '/users', label: 'Пользователи', icon: '👥' },
    { path: '/segments', label: 'Сегменты', icon: '🏷️' },
    { path: '/anomalies', label: 'Аномалии', icon: '⚠️' },
  ]

  return (
    <aside style={{
      width: '250px',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '20px'
    }}>
      <h3 style={{ marginBottom: '20px' }}>Меню</h3>
      <nav>
        {menuItems.map((item) => (
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
      </nav>
    </aside>
  )
}

export default Sidebar