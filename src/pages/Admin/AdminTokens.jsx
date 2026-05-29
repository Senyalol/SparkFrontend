import { useEffect, useState, useCallback } from 'react'
import { adminTokensService } from '../../services/adminTokens'

const AdminTokens = () => {
  const [tokens, setTokens] = useState([])
  const [filteredTokens, setFilteredTokens] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [newTokenRole, setNewTokenRole] = useState('ANALYST')
  const [newTokenHours, setNewTokenHours] = useState(24)
  const [generatedToken, setGeneratedToken] = useState(null)
  
  // Фильтр по использованию
  const [usedFilter, setUsedFilter] = useState('ALL') // 'ALL', 'USED', 'NOT_USED'

  const loadTokens = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await adminTokensService.getAllTokens()
      setTokens(data || [])
      setFilteredTokens(data || [])
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Ошибка загрузки токенов')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTokens()
  }, [loadTokens])

  // Применение фильтра по использованию
  useEffect(() => {
    let result = [...tokens]
    
    if (usedFilter === 'USED') {
      result = result.filter(token => token.used === true)
    } else if (usedFilter === 'NOT_USED') {
      result = result.filter(token => token.used === false)
    }
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredTokens(result)
  }, [usedFilter, tokens])

  const handleGenerateToken = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await adminTokensService.generateToken(newTokenRole, newTokenHours)
      setGeneratedToken(result)
      await loadTokens()
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Ошибка генерации токена')
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeToken = async (token) => {
    if (window.confirm('Вы уверены, что хотите отменить этот токен?')) {
      setLoading(true)
      try {
        await adminTokensService.revokeToken(token)
        await loadTokens()
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Ошибка отмены токена')
      } finally {
        setLoading(false)
      }
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Токен скопирован в буфер обмена')
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    try {
      return new Date(dateString).toLocaleString('ru-RU')
    } catch {
      return dateString
    }
  }

  if (loading && tokens.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <div>Загрузка...</div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Управление invite токенами</h1>
        <button
          onClick={() => setShowGenerateModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Создать токен
        </button>
      </div>

      {/* Фильтр по использованию */}
      <div style={{
        backgroundColor: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <label style={{ fontWeight: 'bold' }}>Статус использования:</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setUsedFilter('ALL')}
            style={{
              padding: '6px 16px',
              backgroundColor: usedFilter === 'ALL' ? '#007bff' : '#e9ecef',
              color: usedFilter === 'ALL' ? 'white' : '#495057',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Все
          </button>
          <button
            onClick={() => setUsedFilter('NOT_USED')}
            style={{
              padding: '6px 16px',
              backgroundColor: usedFilter === 'NOT_USED' ? '#28a745' : '#e9ecef',
              color: usedFilter === 'NOT_USED' ? 'white' : '#495057',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Не использован
          </button>
          <button
            onClick={() => setUsedFilter('USED')}
            style={{
              padding: '6px 16px',
              backgroundColor: usedFilter === 'USED' ? '#dc3545' : '#e9ecef',
              color: usedFilter === 'USED' ? 'white' : '#495057',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Использован
          </button>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#666' }}>
          Найдено: {filteredTokens.length} из {tokens.length}
        </div>
      </div>

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

      {/* Модальное окно создания токена */}
      {showGenerateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '450px',
            maxWidth: '90%'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Создание invite токена</h2>
            
            {!generatedToken ? (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Роль</label>
                  <select
                    value={newTokenRole}
                    onChange={(e) => setNewTokenRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="ANALYST">ANALYST</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Срок действия (часы)</label>
                  <input
                    type="number"
                    value={newTokenHours}
                    onChange={(e) => setNewTokenHours(parseInt(e.target.value))}
                    min="1"
                    max="8760"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setShowGenerateModal(false)
                      setGeneratedToken(null)
                    }}
                    style={{
                      padding: '8px 16px',
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
                    onClick={handleGenerateToken}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Создать
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  backgroundColor: '#d4edda',
                  color: '#155724',
                  padding: '15px',
                  borderRadius: '4px',
                  marginBottom: '20px'
                }}>
                  ✅ Токен успешно создан!
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Токен</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <code style={{
                      flex: 1,
                      backgroundColor: '#f5f5f5',
                      padding: '10px',
                      borderRadius: '4px',
                      wordBreak: 'break-all'
                    }}>
                      {generatedToken.token}
                    </code>
                    <button
                      onClick={() => copyToClipboard(generatedToken.token)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Копировать
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div><strong>Роль:</strong> {generatedToken.role}</div>
                  <div><strong>Истекает:</strong> {formatDate(generatedToken.expiresAt)}</div>
                </div>

                <button
                  onClick={() => {
                    setShowGenerateModal(false)
                    setGeneratedToken(null)
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Закрыть
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Таблица токенов */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'auto',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Токен</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Роль</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Создан</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Истекает</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Статус</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredTokens.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  {tokens.length === 0 ? 'Нет токенов' : 'Токены не найдены по заданным критериям'}
                </td>
              </tr>
            ) : (
              filteredTokens.map((token, index) => (
                <tr key={token.id || token.token || index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>
                    <code style={{
                      backgroundColor: '#f5f5f5',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {token.token?.substring(0, 20)}...
                    </code>
                    <button
                      onClick={() => copyToClipboard(token.token)}
                      style={{
                        marginLeft: '8px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      title="Копировать токен"
                    >
                      📋
                    </button>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: token.role === 'ADMIN' ? '#ffc107' : '#17a2b8',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      {token.role || 'ANALYST'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{formatDate(token.createdAt)}</td>
                  <td style={{ padding: '12px' }}>{formatDate(token.expiresAt)}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: token.used ? '#dc3545' : '#28a745',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      {token.used ? 'Да' : 'Нет'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {!token.used && (
                      <button
                        onClick={() => handleRevokeToken(token.token)}
                        style={{
                          padding: '5px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Отменить
                      </button>
                    )}
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

export default AdminTokens