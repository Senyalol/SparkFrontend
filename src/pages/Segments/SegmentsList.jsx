import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { segmentsService } from '../../services/segments'
import { formatMinutes, formatDate } from '../../utils/dateFormatter'

const SegmentsList = () => {
  const navigate = useNavigate()
  const [segments, setSegments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Состояния для фильтров
  const [filterType, setFilterType] = useState('all')
  const [searchValue, setSearchValue] = useState('')
  const [rangeMin, setRangeMin] = useState('')
  const [rangeMax, setRangeMax] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // ========== ФУНКЦИИ ДЛЯ ДИНАМИЧЕСКОГО ТИПА ПОЛЯ ==========
  // Определяет тип поля ввода (текст или число)
  const getInputType = () => {
    if (filterType === 'userId') return 'number'      
    if (filterType === 'username') return 'text'      
    if (filterType === 'segmentType') return 'text'   
    return 'number'  // R, F, M - числа
  }

  // Определяет шаг для числовых полей
  const getInputStep = () => {
    if (filterType === 'rMore' || filterType === 'rLess') return '0.01'
    if (filterType === 'mMore' || filterType === 'mLess') return '0.01'
    return '1'
  }
  // ========== КОНЕЦ ФУНКЦИЙ ==========

  // Загрузка всех сегментов
  const loadAllSegments = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await segmentsService.getAllSegments()
      setSegments(data || [])
    } catch (err) {
      setError(err)
      setSegments([])
    } finally {
      setLoading(false)
    }
  }

  // Применение фильтров
  const applyFilter = async () => {
    setLoading(true)
    setError('')
    try {
      let data = []
      
      switch (filterType) {
        case 'userId':
          if (searchValue) {
            data = await segmentsService.getSegmentsByUserId(parseInt(searchValue))
          }
          break
        
        case 'username':
          if (searchValue && searchValue.trim()) {
            
            const parts = searchValue.trim().split(' ')
            const lastname = parts[0]
            const name = parts.length > 1 ? parts[1] : null
            data = await segmentsService.getSegmentsByUsername(lastname, name)
          }
          break
        
        case 'segmentType':
          if (searchValue && searchValue.trim()) {
            data = await segmentsService.getSegmentsByType(searchValue.trim())
          }
          break
        
        case 'rMore':
          if (searchValue) {
            const value = parseFloat(searchValue.toString().replace(',', '.'))
            data = await segmentsService.getSegmentsByRMore(value)
          }
          break
        
        case 'rLess':
          if (searchValue) {
            const value = parseFloat(searchValue.toString().replace(',', '.'))
            data = await segmentsService.getSegmentsByRLess(value)
          }
          break
        
        case 'rRange':
          if (rangeMin && rangeMax) {
            const minValue = parseFloat(rangeMin.toString().replace(',', '.'))
            const maxValue = parseFloat(rangeMax.toString().replace(',', '.'))
            
            if (isNaN(minValue) || isNaN(maxValue)) {
              setError('Введите корректные числовые значения')
              setLoading(false)
              return
            }
            if (minValue > maxValue) {
              setError('Минимальное значение не может быть больше максимального')
              setLoading(false)
              return
            }
            
            data = await segmentsService.getSegmentsByRRange(minValue, maxValue)
          }
          break
        
        case 'fMore':
          if (searchValue) {
            data = await segmentsService.getSegmentsByFMore(parseInt(searchValue))
          }
          break
        
        case 'fLess':
          if (searchValue) {
            data = await segmentsService.getSegmentsByFLess(parseInt(searchValue))
          }
          break
        
        case 'fRange':
          if (rangeMin && rangeMax) {
            data = await segmentsService.getSegmentsByFRange(
              parseInt(rangeMin), 
              parseInt(rangeMax)
            )
          }
          break
        
        case 'mMore':
          if (searchValue) {
            data = await segmentsService.getSegmentsByMMore(parseFloat(searchValue))
          }
          break
        
        case 'mLess':
          if (searchValue) {
            data = await segmentsService.getSegmentsByMLess(parseFloat(searchValue))
          }
          break
        
        case 'mRange':
          if (rangeMin && rangeMax) {
            data = await segmentsService.getSegmentsByMRange(
              parseFloat(rangeMin), 
              parseFloat(rangeMax)
            )
          }
          break
        
        default:
          data = await segmentsService.getAllSegments()
      }
      
      setSegments(data || [])
      if (data && data.length === 0 && filterType !== 'all') {
        setError('По вашему запросу ничего не найдено')
      } else {
        setError('')
      }
    } catch (err) {
      console.error('Apply filter error:', err)
      setError(typeof err === 'string' ? err : 'Ошибка при применении фильтра')
      setSegments([])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFilterType('all')
    setSearchValue('')
    setRangeMin('')
    setRangeMax('')
    loadAllSegments()
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAllSegments()
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
        Сегменты пользователей
      </h1>

      {/* Кнопка показа/скрытия фильтров */}
      <button
        onClick={() => setShowFilters(!showFilters)}
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
        {showFilters ? '▼ Скрыть фильтры' : '▶ Показать фильтры'}
      </button>

      {/* Фильтры */}
      {showFilters && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Тип фильтра
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                <option value="all">Все сегменты</option>
                <option value="userId">По ID пользователя</option>
                <option value="username">По имени/фамилии</option>
                <option value="segmentType">По типу сегмента</option>
                <optgroup label="R (давность в минутах)">
                  <option value="rMore">R {'>'} значение</option>
                  <option value="rLess">R {'<'} значение</option>
                  <option value="rRange">R в диапазоне</option>
                </optgroup>
                <optgroup label="F (частота)">
                  <option value="fMore">F {'>'} значение</option>
                  <option value="fLess">F {'<'} значение</option>
                  <option value="fRange">F в диапазоне</option>
                </optgroup>
                <optgroup label="M (сумма)">
                  <option value="mMore">M {'>'} значение</option>
                  <option value="mLess">M {'<'} значение</option>
                  <option value="mRange">M в диапазоне</option>
                </optgroup>
              </select>
            </div>

            {/* Подсказка для R фильтров */}
            {filterType.startsWith('r') && filterType !== 'all' && (
              <div style={{ flex: 2, minWidth: '200px', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '0',
                  fontSize: '11px',
                  color: '#007bff',
                  whiteSpace: 'nowrap'
                }}>
                  💡 Введите значение в минутах (например: 60, 1440, 10080)
                </div>
              </div>
            )}

            {/* Одиночное поле ввода (для всех фильтров кроме диапазонов) */}
            {!['rRange', 'fRange', 'mRange'].includes(filterType) && filterType !== 'all' && (
              <div style={{ flex: 2, minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Значение
                </label>
                <input
                  type={getInputType()}                          // ← динамический тип!
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={
                    filterType === 'userId' ? 'Введите ID пользователя' :
                    filterType === 'username' ? 'Фамилия Имя (через пробел)' :
                    filterType === 'segmentType' ? 'VIP, Standard и т.д.' :
                    filterType.startsWith('r') ? 'Введите значение в минутах' :
                    'Введите значение'
                  }
                  step={getInputStep()}                          // ← динамический шаг!
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilter()}
                />
              </div>
            )}

            {/* Диапазон (для R, F, M) */}
            {['rRange', 'fRange', 'mRange'].includes(filterType) && (
              <>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    От {filterType === 'rRange' ? '(минуты)' : ''}
                  </label>
                  <input
                    type="number"
                    value={rangeMin}
                    onChange={(e) => setRangeMin(e.target.value)}
                    placeholder={filterType === 'rRange' ? 'например: 800' : 'Мин.'}
                    step={filterType === 'rRange' ? '0.01' : '1'}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    До {filterType === 'rRange' ? '(минуты)' : ''}
                  </label>
                  <input
                    type="number"
                    value={rangeMax}
                    onChange={(e) => setRangeMax(e.target.value)}
                    placeholder={filterType === 'rRange' ? 'например: 900' : 'Макс.'}
                    step={filterType === 'rRange' ? '0.01' : '1'}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={applyFilter}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Применить
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
                Сбросить
              </button>
            </div>
          </div>

          {/* Подсказка для R фильтров */}
          {filterType.startsWith('r') && filterType !== 'all' && (
            <div style={{
              marginTop: '15px',
              padding: '8px',
              backgroundColor: '#e7f3ff',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#0066cc'
            }}>
              💡 <strong>Подсказка:</strong> Значения R фильтруются в минутах. Примеры:
              60 мин = 1 час, 1440 мин = 1 день, 10080 мин = 1 неделя
            </div>
          )}
        </div>
      )}

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

      {/* Таблица сегментов */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'auto',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID сегмента</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID пользователя</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Сегмент</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>R (давность)</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>F (частота)</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>M (сумма)</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Обновлен</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {segments.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  Сегменты не найдены
                </td>
              </tr>
            ) : (
              segments.map((segment) => (
                <tr key={segment.usegmentId} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{segment.usegmentId}</td>
                  <td style={{ padding: '12px' }}>{segment.userId}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: segment.segment === 'VIP' ? '#ffd700' : '#e0e0e0',
                      color: segment.segment === 'VIP' ? '#333' : '#666',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                      {segment.segment || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {formatMinutes(segment.rminutes)}
                  </td>
                  <td style={{ padding: '12px' }}>{segment.f || '—'}</td>
                  <td style={{ padding: '12px' }}>
                    {segment.m ? `${segment.m.toFixed(2)} ₽` : '—'}
                  </td>
                  <td style={{ padding: '12px' }}>{formatDate(segment.updatedAt)}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => navigate(`/segments/${segment.usegmentId}`)}
                      style={{
                        padding: '5px 15px',
                        backgroundColor: '#28a745',
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
                      onClick={() => navigate(`/users/${segment.userId}`)}
                      style={{
                        padding: '5px 15px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Пользователь
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
        Найдено сегментов: {segments.length}
      </div>
    </div>
  )
}

export default SegmentsList