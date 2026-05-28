import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { anomaliesService } from '../../services/anomalies'
import { formatDateTime } from '../../utils/dateFormatter'

const AnomalyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [anomaly, setAnomaly] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Функции для отображения (те же что и в AnomaliesList)
  const getTransactionType = (message) => {
    if (!message) return '—'
    if (message.includes('Credit')) return 'Credit'
    if (message.includes('Debit')) return 'Debit'
    if (message.includes('DEPOSIT')) return 'DEPOSIT'
    if (message.includes('WITHDRAW')) return 'WITHDRAW'
    if (message.includes('REVERSAL')) return 'REVERSAL'
    return message
  }

  const getTransactionTypeColor = (transactionType) => {
    switch (transactionType) {
      case 'Credit':
      case 'DEPOSIT':
        return '#4caf50'
      case 'Debit':
      case 'WITHDRAW':
        return '#f44336'
      case 'REVERSAL':
        return '#ff9800'
      default:
        return '#666'
    }
  }

  const getAnomalyTypeName = (type) => {
    switch (type) {
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
        return type?.replace(/_/g, ' ') || 'Неизвестный тип'
    }
  }

  const getAnomalyTypeColor = (type) => {
    switch (type) {
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadAnomaly()
  }, [id])

  const loadAnomaly = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await anomaliesService.getAnomalyById(id)
      setAnomaly(data)
    } catch (err) {
      setError(err)
      setAnomaly(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <div>Загрузка...</div>
      </div>
    )
  }

  if (error || !anomaly) {
    return (
      <div>
        <button
          onClick={() => navigate('/anomalies')}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Назад к списку
        </button>
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          {error || 'Аномалия не найдена'}
        </div>
      </div>
    )
  }

  // 🔄 ПОМЕНЯЛИ МЕСТАМИ: 
  // Тип транзакции теперь берем из anomaly.type (было из message)
  // Тип аномалии теперь берем из anomaly.message (было из type)
  const transactionType = getTransactionType(anomaly.type)      // ← из type
  const anomalyTypeName = getAnomalyTypeName(anomaly.message)   // ← из message

  return (
    <div>
      <button
        onClick={() => navigate('/anomalies')}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Назад к списку
      </button>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          Детали аномалии #{anomaly.anomalyId}
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Левая колонка */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>ID аномалии</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{anomaly.anomalyId}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>ID пользователя</div>
              <button
                onClick={() => navigate(`/users/${anomaly.userId}`)}
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#007bff',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {anomaly.userId}
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Тип транзакции</div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '4px',
                backgroundColor: getTransactionTypeColor(transactionType),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                display: 'inline-block'
              }}>
                {transactionType}
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Тип аномалии</div>
              <span style={{
                padding: '4px 12px',
                borderRadius: '4px',
                backgroundColor: getAnomalyTypeColor(anomaly.message),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                display: 'inline-block'
              }}>
                {anomalyTypeName}
              </span>
            </div>
          </div>

          {/* Правая колонка */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Время</div>
              <div style={{ fontSize: '16px' }}>{formatDateTime(anomaly.eventTime)}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Сумма</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {anomaly.sum ? `${anomaly.sum.toFixed(2)} ₽` : '—'}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Средний чек</div>
              <div style={{ fontSize: '16px' }}>
                {anomaly.avgCheck ? `${anomaly.avgCheck.toFixed(2)} ₽` : '—'}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Сообщение</div>
              <div style={{
                fontSize: '14px',
                backgroundColor: '#f8f9fa',
                padding: '12px',
                borderRadius: '6px',
                wordBreak: 'break-word'
              }}>
                {anomaly.message || '—'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnomalyDetail