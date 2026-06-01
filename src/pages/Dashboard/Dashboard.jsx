import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usersService } from '../../services/users'
import { segmentsService } from '../../services/segments'
import { anomaliesService } from '../../services/anomalies'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [usersCount, setUsersCount] = useState(0)
  const [segmentsCount, setSegmentsCount] = useState(0)
  const [anomaliesCount, setAnomaliesCount] = useState(0)
  const [recentAnomalies, setRecentAnomalies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [usersData, segmentsData, anomaliesData] = await Promise.all([
        usersService.getAllUsers(),
        segmentsService.getAllSegments(),
        anomaliesService.getAllAnomalies()
      ])
      setUsersCount(usersData?.length || 0)
      setSegmentsCount(segmentsData?.length || 0)
      setAnomaliesCount(anomaliesData?.length || 0)
      
      // Сортируем по времени и берем последние 5
      const sorted = (anomaliesData || []).sort((a, b) => {
        const timeA = new Date(a.eventTime).getTime()
        const timeB = new Date(b.eventTime).getTime()
        return timeB - timeA
      })
      setRecentAnomalies(sorted.slice(0, 5))
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

 
  const getAnomalyTypeName = (message) => {
    switch (message) {
      case 'BIGGER_THEN_AVG_CHECK':
        return 'Превышение среднего чека'
      case 'NEGATIVE_M':
        return 'Отрицательный баланс'
      case 'BIGGEST_AND_FREQUENT_CREDIT':
        return 'Частые крупные пополнения'
      case 'STRUCTURING_SMALL_TRANSACTIONS':
        return 'Структурирование (дробление)'
      case 'EXCESSIVE_REVERSAL_PATTERN':
        return 'Подозрительный возврат'
      default:
        return message?.replace(/_/g, ' ') || 'Неизвестный тип'
    }
  }

  
  const getAnomalyTypeColor = (message) => {
    switch (message) {
      case 'BIGGER_THEN_AVG_CHECK':
        return '#ff9800'
      case 'NEGATIVE_M':
        return '#f44336'
      case 'BIGGEST_AND_FREQUENT_CREDIT':
        return '#2196f3'
      case 'STRUCTURING_SMALL_TRANSACTIONS':
        return '#9c27b0'
      case 'EXCESSIVE_REVERSAL_PATTERN':
        return '#e91e63'
      default:
        return '#666'
    }
  }

  const getTransactionTypeName = (type) => {
    if (!type) return '—'
    if (type === 'Credit') return ' Пополнение'
    if (type === 'Debit') return ' Списание'
    if (type === 'DEPOSIT') return ' Депозит'
    if (type === 'WITHDRAW') return ' Вывод'
    if (type === 'REVERSAL') return ' Возврат'
    return type
  }

  const formatDateTime = (eventTime) => {
    if (!eventTime) return '—'
    try {
      const date = new Date(eventTime)
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return eventTime
    }
  }

  const stats = [
    { title: 'Пользователи', value: usersCount, color: '#007bff', link: '/users'},
    { title: 'Сегменты', value: segmentsCount, color: '#28a745', link: '/segments' },
    { title: 'Аномалии', value: anomaliesCount, color: '#dc3545', link: '/anomalies' },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: '10px', fontSize: '24px', fontWeight: 'bold' }}>
        Добро пожаловать, {user?.login || 'Аналитик'}!
      </h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Аналитическая платформа BankSpark — мониторинг транзакций и аномалий
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                {stat.title}
              </div>
              <div style={{ fontSize: '24px' }}>{stat.icon}</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>
              {loading ? '...' : stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Левая колонка - последние аномалии */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
              Последние аномалии
            </h3>
            <button
              onClick={() => navigate('/anomalies')}
              style={{
                padding: '5px 10px',
                backgroundColor: 'transparent',
                color: '#007bff',
                border: '1px solid #007bff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Все аномалии →
            </button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              Загрузка...
            </div>
          ) : recentAnomalies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              Нет аномалий
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentAnomalies.map((anomaly) => (
                <div
                  key={anomaly.anomalyId}
                  onClick={() => navigate(`/anomalies/${anomaly.anomalyId}`)}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    borderLeft: `3px solid ${getAnomalyTypeColor(anomaly.message)}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e9ecef'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: getAnomalyTypeColor(anomaly.message),
                      color: 'white'
                    }}>
                      {getAnomalyTypeName(anomaly.message)}
                    </span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {formatDateTime(anomaly.eventTime)}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#333', marginTop: '5px' }}>
                    <strong>Пользователь #{anomaly.userId}</strong> — {getTransactionTypeName(anomaly.type)}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                    Сумма: <strong>{anomaly.sum?.toFixed(2) || '0'} ₽</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Правая колонка - быстрые действия */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
             Быстрые действия
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => navigate('/users')}
              style={{
                padding: '12px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
               Управление пользователями
            </button>
            <button
              onClick={() => navigate('/segments')}
              style={{
                padding: '12px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Анализ сегментов
            </button>
            <button
              onClick={() => navigate('/anomalies')}
              style={{
                padding: '12px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Просмотр аномалий
            </button>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#666'
          }}>
            <div><strong>Что означают типы аномалий:</strong></div>
            <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
              <li><span style={{ color: '#ff9800' }}>Превышение среднего чека</span> — сумма операции значительно выше обычной</li>
              <li><span style={{ color: '#f44336' }}>Отрицательный баланс</span> — списание больше доступных средств</li>
              <li><span style={{ color: '#2196f3' }}>Частые крупные пополнения</span> — подозрительная активность</li>
              <li><span style={{ color: '#9c27b0' }}>Структурирование</span> — дробление транзакций</li>
              <li><span style={{ color: '#e91e63' }}>Подозрительный возврат</span> — депозит и сразу кредит</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard