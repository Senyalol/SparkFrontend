import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analystsService } from '../../services/analysts'

const AnalystsList = () => {
  const navigate = useNavigate()
  const [analysts, setAnalysts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadAnalysts = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await analystsService.getAllAnalysts()
      setAnalysts(data || [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAnalysts()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого аналитика?')) {
      try {
        await analystsService.deleteAnalyst(id)
        await loadAnalysts()
      } catch (err) {
        setError(err)
      }
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>
  }

  return (
    <div>
      <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>Аналитики</h1>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          Ошибка: {error}
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'auto',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Логин</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Роль</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Создан</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {analysts.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  Нет аналитиков
                </td>
              </tr>
            ) : (
              analysts.map((analyst) => (
                <tr key={analyst.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{analyst.id}</td>
                  <td style={{ padding: '12px' }}>{analyst.login}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: analyst.role === 'ADMIN' ? '#ffc107' : '#17a2b8',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      {analyst.role || 'ANALYST'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{new Date(analyst.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => navigate(`/analysts/${analyst.id}`)}
                      style={{
                        padding: '5px 12px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '8px'
                      }}
                    >
                      Детали
                    </button>
                    <button
                      onClick={() => handleDelete(analyst.id)}
                      style={{
                        padding: '5px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AnalystsList