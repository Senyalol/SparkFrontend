import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analystsService } from '../../services/analysts'

const AnalystsList = () => {
  const navigate = useNavigate()
  const [analysts, setAnalysts] = useState([])
  const [filteredAnalysts, setFilteredAnalysts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filterRole, setFilterRole] = useState('ALL')
  const [searchLogin, setSearchLogin] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const loadAnalysts = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await analystsService.getAllAnalysts()
      console.log('Loaded analysts:', data)
      setAnalysts(data || [])
      setFilteredAnalysts(data || [])
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Ошибка загрузки аналитиков')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAnalysts()
  }, [])

  const applyFilters = () => {
    let result = [...analysts]

    if (filterRole !== 'ALL') {
      result = result.filter(a => a.role === filterRole)
    }

    if (searchLogin.trim()) {
      const searchLower = searchLogin.toLowerCase()
      result = result.filter(a => a.login?.toLowerCase().includes(searchLower))
    }

    setFilteredAnalysts(result)
  }

  const resetFilters = () => {
    setFilterRole('ALL')
    setSearchLogin('')
    setFilteredAnalysts(analysts)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    applyFilters()
  }, [filterRole, searchLogin, analysts])

  const handleDelete = async (login) => {
    console.log('Deleting analyst with login:', login)
    if (!login) {
      setError('Логин аналитика не указан')
      return
    }
    
    if (window.confirm('Вы уверены, что хотите удалить этого аналитика?')) {
      setLoading(true)
      try {
        
        const analystId = await analystsService.getAnalystIdByLogin(login)
        console.log('Found analyst ID:', analystId)
        
       
        await analystsService.deleteAnalyst(analystId)
        await loadAnalysts()
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Ошибка удаления аналитика')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleViewDetails = (login) => {
    console.log('Viewing analyst details with login:', login)
    if (!login) {
      setError('Логин аналитика не указан')
      return
    }
    navigate(`/analysts/${login}`)
  }

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Аналитики</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showFilters ? '▼ Скрыть фильтры' : '▶ Показать фильтры'}
        </button>
      </div>

      {showFilters && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Роль</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="ALL">Все</option>
                <option value="ADMIN">ADMIN</option>
                <option value="ANALYST">ANALYST</option>
              </select>
            </div>

            <div style={{ flex: 2, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Поиск по логину</label>
              <input
                type="text"
                value={searchLogin}
                onChange={(e) => setSearchLogin(e.target.value)}
                placeholder="Введите логин"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={resetFilters}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      )}

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
              <th style={{ padding: '12px', textAlign: 'left' }}>Логин</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Роль</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Создан</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnalysts.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  {analysts.length === 0 ? 'Нет аналитиков' : 'Аналитики не найдены по заданным критериям'}
                </td>
              </tr>
            ) : (
              filteredAnalysts.map((analyst) => (
                <tr key={analyst.login} style={{ borderBottom: '1px solid #eee' }}>
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
                  <td style={{ padding: '12px' }}>
                    {analyst.createdAt ? new Date(analyst.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => handleViewDetails(analyst.login)}
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
                      onClick={() => handleDelete(analyst.login)}
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
      
      <div style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
        Найдено аналитиков: {filteredAnalysts.length}
      </div>
    </div>
  )
}

export default AnalystsList