import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usersService } from '../../services/users'

const UserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadUser()
  }, [id])

  const loadUser = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await usersService.getUserById(id)
      setUser(data)
    } catch (err) {
      setError(err)
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

  if (error) {
    return (
      <div>
        <button
          onClick={() => navigate('/users')}
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

  if (!user) {
    return (
      <div>
        <button
          onClick={() => navigate('/users')}
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
          Пользователь не найден
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate('/users')}
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
        <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
          Информация о пользователе
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold', color: '#666' }}>ID:</div>
            <div>{user.user_id}</div>
          </div>
          
          <div style={{ display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold', color: '#666' }}>Имя:</div>
            <div>{user.firstname}</div>
          </div>
          
          <div style={{ display: 'flex', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            <div style={{ width: '150px', fontWeight: 'bold', color: '#666' }}>Фамилия:</div>
            <div>{user.lastname}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetail