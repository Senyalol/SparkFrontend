import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { analystsService } from '../../services/analysts'

const AnalystDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [analyst, setAnalyst] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadAnalyst()
  }, [id])

  const loadAnalyst = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await analystsService.getAnalystById(id)
      setAnalyst(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этого аналитика?')) {
      try {
        await analystsService.deleteAnalyst(id)
        navigate('/analysts')
      } catch (err) {
        setError(err)
      }
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>
  }

  if (error) {
    return (
      <div>
        <button
          onClick={() => navigate('/analysts')}
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
          ← Назад
        </button>
        <div style={{ color: 'red', textAlign: 'center' }}>Ошибка: {error}</div>
      </div>
    )
  }

  if (!analyst) {
    return (
      <div>
        <button onClick={() => navigate('/analysts')}>← Назад</button>
        <div style={{ textAlign: 'center' }}>Аналитик не найден</div>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate('/analysts')}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Информация об аналитике</h2>
          <button
            onClick={handleDelete}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Удалить
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>ID</div>
            <div>{analyst.id}</div>
          </div>

          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>Логин</div>
            <div>{analyst.login}</div>
          </div>

          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>Роль</div>
            <div>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: analyst.role === 'ADMIN' ? '#ffc107' : '#17a2b8',
                color: 'white',
                fontSize: '12px'
              }}>
                {analyst.role || 'ANALYST'}
              </span>
            </div>
          </div>

          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>Дата создания</div>
            <div>{new Date(analyst.createdAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalystDetail