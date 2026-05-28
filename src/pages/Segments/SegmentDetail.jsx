import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { segmentsService } from '../../services/segments'

const SegmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [segment, setSegment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadSegment()
  }, [id])

  const loadSegment = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await segmentsService.getSegmentById(id)
      setSegment(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('ru-RU')
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <div>Загрузка...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <button
          onClick={() => navigate('/segments')}
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
          Ошибка: {error}
        </div>
      </div>
    )
  }

  if (!segment) {
    return (
      <div>
        <button
          onClick={() => navigate('/segments')}
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
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          Сегмент не найден
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/segments')}
          style={{
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
        <button
          onClick={() => navigate(`/users/${segment.userId}`)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          👤 Перейти к пользователю
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
          Информация о сегменте
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>ID сегмента</div>
            <div>{segment.uSegmentId}</div>
          </div>
          
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>ID пользователя</div>
            <div>{segment.userId}</div>
          </div>
          
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>Тип сегмента</div>
            <div>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: segment.segment === 'VIP' ? '#ffd700' : '#e0e0e0',
                color: segment.segment === 'VIP' ? '#333' : '#666',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {segment.segment || '—'}
              </span>
            </div>
          </div>
          
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>R (давность, минуты)</div>
            <div>{segment.rMinutes || '—'}</div>
          </div>
          
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>F (частота)</div>
            <div>{segment.f || '—'}</div>
          </div>
          
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>M (сумма)</div>
            <div>{segment.m ? `${segment.m.toFixed(2)}` : '—'}</div>
          </div>
          
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>Дата обновления</div>
            <div>{formatDate(segment.updatedAt)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SegmentDetail