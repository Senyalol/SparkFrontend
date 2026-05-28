import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usersService } from '../../services/users'
import { segmentsService } from '../../services/segments'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [usersCount, setUsersCount] = useState(0)
  const [segmentsCount, setSegmentsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [usersData, segmentsData] = await Promise.all([
        usersService.getAllUsers(),
        segmentsService.getAllSegments()
      ])
      setUsersCount(usersData?.length || 0)
      setSegmentsCount(segmentsData?.length || 0)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { title: 'Пользователи', value: usersCount, color: '#007bff', link: '/users' },
    { title: 'Сегменты', value: segmentsCount, color: '#28a745', link: '/segments' },
    { title: 'Аномалии', value: '—', color: '#dc3545', link: '/anomalies' },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: '10px', fontSize: '24px', fontWeight: 'bold' }}>
        Добро пожаловать, {user?.login || 'Аналитик'}!
      </h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Аналитическая платформа BankSpark
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => stat.link && navigate(stat.link)}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              cursor: stat.link ? 'pointer' : 'default',
              transition: 'transform 0.2s',
              borderTop: `4px solid ${stat.color}`
            }}
            onMouseEnter={(e) => {
              if (stat.link) e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              {stat.title}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>
              {loading ? '...' : stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
          Быстрые действия
        </h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/users')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📋 Пользователи
          </button>
          <button
            onClick={() => navigate('/segments')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🏷️ Сегменты
          </button>
          <button
            onClick={() => navigate('/anomalies')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ⚠️ Аномалии
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard