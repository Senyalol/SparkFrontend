import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { analystsService } from '../../services/analysts'

const AnalystDetail = () => {
  const { login } = useParams()
  const navigate = useNavigate()
  const [analyst, setAnalyst] = useState(null)
  const [analystId, setAnalystId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    login: '',
    password: '',
    role: ''
  })
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  useEffect(() => {
    console.log('=== ANALYST DETAIL ===')
    console.log('Login from params:', login)
    if (login && login !== 'undefined') {
      // eslint-disable-next-line react-hooks/immutability
      loadAnalystData()
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('Неверный логин аналитика')
      setLoading(false)
    }
  }, [login])

  const loadAnalystData = async () => {
    setLoading(true)
    setError('')
    try {
      
      console.log('Step 1: Getting ID for login:', login)
      const id = await analystsService.getAnalystIdByLogin(login)
      console.log('Step 1 result - ID:', id, 'Type:', typeof id)
      
      if (!id || id === 'undefined' || isNaN(id)) {
        throw new Error('Не удалось получить ID аналитика')
      }
      
      setAnalystId(id)
      
      console.log('Step 2: Getting analyst data by ID:', id)
      const data = await analystsService.getAnalystById(id)
      console.log('Step 2 result - Analyst:', data)
      
      if (!data) {
        throw new Error('Аналитик не найден')
      }
      
      setAnalyst(data)
      setEditForm({
        login: data.login || '',
        password: '',
        role: data.role || 'ANALYST'
      })
    } catch (err) {
      console.error('Load error:', err)
      setError(typeof err === 'string' ? err : (err.message || 'Ошибка загрузки аналитика'))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этого аналитика?')) {
      setLoading(true)
      try {
        await analystsService.deleteAnalyst(analystId)
        navigate('/analysts')
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Ошибка удаления аналитика')
        setLoading(false)
      }
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setUpdateLoading(true)
    setUpdateError('')
    setUpdateSuccess('')

    const updateData = {}
    if (editForm.login && editForm.login !== analyst.login) updateData.login = editForm.login
    if (editForm.password) updateData.password = editForm.password
    if (editForm.role !== analyst.role) updateData.role = editForm.role

    if (Object.keys(updateData).length === 0) {
      setUpdateError('Нет изменений для сохранения')
      setUpdateLoading(false)
      return
    }

    try {
      await analystsService.updateAnalyst(analystId, updateData)
      setUpdateSuccess('Аналитик успешно обновлен')
      setTimeout(() => {
        setUpdateSuccess('')
        setIsEditing(false)
        loadAnalystData()
      }, 1500)
    } catch (err) {
      setUpdateError(typeof err === 'string' ? err : 'Ошибка обновления аналитика')
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditForm({
      login: analyst.login || '',
      password: '',
      role: analyst.role || 'ANALYST'
    })
    setUpdateError('')
    setUpdateSuccess('')
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
        <div style={{ backgroundColor: '#fee', color: '#c33', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          Ошибка: {error}
        </div>
      </div>
    )
  }

  if (!analyst) {
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
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          Аналитик не найден
        </div>
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
          <div style={{ display: 'flex', gap: '10px' }}>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Редактировать
              </button>
            )}
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
        </div>

        {updateSuccess && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {updateSuccess}
          </div>
        )}

        {updateError && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {updateError}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleEditSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>ID</div>
                <div>{analystId}</div>
              </div>

              <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>Логин</div>
                <input
                  type="text"
                  value={editForm.login}
                  onChange={(e) => setEditForm({ ...editForm, login: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>Новый пароль</div>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Оставьте пустым, чтобы не менять"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>Роль</div>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="ANALYST">ANALYST</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>Дата создания</div>
                <div>{analyst.createdAt ? new Date(analyst.createdAt).toLocaleString() : '—'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                onClick={handleEditCancel}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={updateLoading}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: updateLoading ? 'not-allowed' : 'pointer',
                  opacity: updateLoading ? 0.7 : 1
                }}
              >
                {updateLoading ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>ID</div>
              <div>{analystId}</div>
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
              <div>{analyst.createdAt ? new Date(analyst.createdAt).toLocaleString() : '—'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalystDetail