import { useAuth } from '../../hooks/useAuth'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header style={{ 
      backgroundColor: 'white', 
      padding: '15px 20px', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2>Аналитическая платформа</h2>
      <div>
        <span style={{ marginRight: '15px' }}>
          {user?.firstName} {user?.lastName}
        </span>
        <button onClick={logout} style={{
          padding: '5px 15px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Выйти
        </button>
      </div>
    </header>
  )
}

export default Header