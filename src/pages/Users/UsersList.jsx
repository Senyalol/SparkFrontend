import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { useApi } from '../../hooks/useApi'
import { usersService } from '../../services/users'

const UsersList = () => {
  const navigate = useNavigate()
  const [searchType, setSearchType] = useState('all') // 'all', 'name', 'lastname'
  const [searchValue, setSearchValue] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Загрузка всех пользователей
  const loadAllUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await usersService.getAllUsers()
      setUsers(data || [])
    } catch (err) {
      setError(err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Поиск по имени
  const searchByName = async () => {
    if (!searchValue.trim()) {
      loadAllUsers()
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await usersService.getUserByName(searchValue)
      setUsers(data || [])
    } catch (err) {
      setError(err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Поиск по фамилии
  const searchByLastName = async () => {
    if (!searchValue.trim()) {
      loadAllUsers()
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await usersService.getUserByLastName(searchValue)
      setUsers(data || [])
    } catch (err) {
      setError(err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchType === 'name') {
      searchByName()
    } else if (searchType === 'lastname') {
      searchByLastName()
    } else {
      loadAllUsers()
    }
  }

  const handleReset = () => {
    setSearchValue('')
    setSearchType('all')
    loadAllUsers()
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAllUsers()
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <div>Загрузка...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
        Пользователи
      </h1>

      {/* Поиск */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Тип поиска
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              <option value="all">Все пользователи</option>
              <option value="name">По имени</option>
              <option value="lastname">По фамилии</option>
            </select>
          </div>

          {searchType !== 'all' && (
            <div style={{ flex: 2, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                {searchType === 'name' ? 'Имя' : 'Фамилия'}
              </label>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={searchType === 'name' ? 'Введите имя' : 'Введите фамилию'}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSearch}
              style={{
                padding: '8px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Поиск
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '8px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Сброс
            </button>
          </div>
        </div>
      </div>

      {/* Ошибка */}
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

      {/* Таблица пользователей */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Имя</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Фамилия</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  Пользователи не найдены
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.user_id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{user.user_id}</td>
                  <td style={{ padding: '12px' }}>{user.firstname}</td>
                  <td style={{ padding: '12px' }}>{user.lastname}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => navigate(`/users/${user.user_id}`)}
                      style={{
                        padding: '5px 15px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Подробнее
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Информация о количестве */}
      <div style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
        Найдено пользователей: {users.length}
      </div>
    </div>
  )
}

export default UsersList