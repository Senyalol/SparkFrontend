import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { anomaliesService } from '../../services/anomalies'
import { formatDateTime, dateToTimestamp } from '../../utils/dateFormatter'

const AnomaliesList = () => {
  const navigate = useNavigate()
  const [anomalies, setAnomalies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Состояния для фильтров
  const [filterType, setFilterType] = useState('all')
  const [searchValue, setSearchValue] = useState('')
  const [rangeMin, setRangeMin] = useState('')
  const [rangeMax, setRangeMax] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Состояния для фильтров по времени
  const [dateValue, setDateValue] = useState('')
  const [rangeMinDate, setRangeMinDate] = useState('')
  const [rangeMaxDate, setRangeMaxDate] = useState('')

  // ========== ФУНКЦИИ ДЛЯ ДИНАМИЧЕСКОГО ТИПА ПОЛЯ ==========
  const getInputType = () => {
    if (filterType === 'userId') return 'number'
    if (filterType === 'type') return 'text'
    if (filterType === 'sumMore') return 'number'
    if (filterType === 'sumLess') return 'number'
    if (filterType === 'sumRange') return 'number'
    if (filterType === 'etimeMore') return 'datetime-local'
    if (filterType === 'etimeLess') return 'datetime-local'
    if (filterType === 'etimeRange') return 'datetime-local'
    if (filterType === 'avgCheckMore') return 'number'
    if (filterType === 'avgCheckLess') return 'number'
    if (filterType === 'avgCheckRange') return 'number'
    return 'text'
  }

  const getInputStep = () => {
    if (filterType === 'sumMore' || filterType === 'sumLess') return '0.01'
    if (filterType === 'avgCheckMore' || filterType === 'avgCheckLess') return '0.01'
    if (filterType === 'sumRange') return '0.01'
    if (filterType === 'avgCheckRange') return '0.01'
    return '1'
  }

  const getPlaceholder = () => {
    switch (filterType) {
      case 'userId': return 'Введите ID пользователя'
      case 'type': return 'BIGGER_THEN_AVG_CHECK, NEGATIVE_M и т.д.'
      case 'sumMore': return 'Минимальная сумма (например: 1000)'
      case 'sumLess': return 'Максимальная сумма (например: 5000)'
      case 'etimeMore': return 'Выберите дату и время'
      case 'etimeLess': return 'Выберите дату и время'
      case 'etimeRange': return ''
      case 'avgCheckMore': return 'Минимальный средний чек'
      case 'avgCheckLess': return 'Максимальный средний чек'
      default: return 'Введите значение'
    }
  }
  // ========== КОНЕЦ ФУНКЦИЙ ==========

  // ========== ФУНКЦИИ ДЛЯ ОТОБРАЖЕНИЯ ==========
  
  // ТИП ТРАНЗАКЦИИ - берем из type (Credit/Debit)
  const getTransactionType = (type) => {
    if (!type) return '—'
    if (type.includes('Credit')) return 'Credit'
    if (type.includes('Debit')) return 'Debit'
    if (type.includes('DEPOSIT')) return 'DEPOSIT'
    if (type.includes('WITHDRAW')) return 'WITHDRAW'
    if (type.includes('REVERSAL')) return 'REVERSAL'
    return type
  }

  // Цвет для типа транзакции
  const getTransactionTypeColor = (transactionType) => {
    switch (transactionType) {
      case 'Credit':
      case 'DEPOSIT':
        return { bg: '#4caf50', color: '#fff' }
      case 'Debit':
      case 'WITHDRAW':
        return { bg: '#f44336', color: '#fff' }
      case 'REVERSAL':
        return { bg: '#ff9800', color: '#fff' }
      default:
        return { bg: '#e0e0e0', color: '#666' }
    }
  }

  // ТИП АНОМАЛИИ - берем из message (enum AnomalyType)
  const getAnomalyTypeName = (message) => {
    if (!message) return '—'
    switch (message) {
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
        return message?.replace(/_/g, ' ') || 'Неизвестный тип'
    }
  }

  // Цвет для типа аномалии
  const getAnomalyTypeColor = (message) => {
    switch (message) {
      case 'BIGGER_THEN_AVG_CHECK':
        return { bg: '#ff9800', color: '#fff' }
      case 'NEGATIVE_M':
        return { bg: '#f44336', color: '#fff' }
      case 'BIGGEST_AND_FREQUENT_CREDIT':
        return { bg: '#2196f3', color: '#fff' }
      case 'STRUCTURING_SMALL_TRANSACTIONS':
        return { bg: '#9c27b0', color: '#fff' }
      case 'EXCESSIVE_REVERSAL_PATTERN':
        return { bg: '#e91e63', color: '#fff' }
      default:
        return { bg: '#e0e0e0', color: '#666' }
    }
  }
  // ========== КОНЕЦ ФУНКЦИЙ ==========

  // Загрузка всех аномалий
  const loadAllAnomalies = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await anomaliesService.getAllAnomalies()
      setAnomalies(data || [])
    } catch (err) {
      setError(err)
      setAnomalies([])
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
            data = await anomaliesService.getAnomaliesByUser(parseInt(searchValue))
          }
          break
        
        case 'type':
          if (searchValue && searchValue.trim()) {
            data = await anomaliesService.getAnomaliesByType(searchValue.trim())
          }
          break
        
        case 'sumMore':
          if (searchValue) {
            const value = parseFloat(searchValue.toString().replace(',', '.'))
            data = await anomaliesService.getAnomaliesByMoreSum(value)
          }
          break
        
        case 'sumLess':
          if (searchValue) {
            const value = parseFloat(searchValue.toString().replace(',', '.'))
            data = await anomaliesService.getAnomaliesByLessSum(value)
          }
          break
        
        case 'sumRange':
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
            
            data = await anomaliesService.getAnomaliesBySumRange(minValue, maxValue)
          }
          break
        
        // ========== ФИЛЬТРЫ ПО ВРЕМЕНИ С DATETIME-LOCAL ==========
        case 'etimeMore':
          if (dateValue) {
            const timestamp = dateToTimestamp(dateValue)
            if (timestamp) {
              data = await anomaliesService.getAnomaliesByMaxEventTime(timestamp)
            } else {
              setError('Введите корректную дату и время')
              setLoading(false)
              return
            }
          }
          break
        
        case 'etimeLess':
          if (dateValue) {
            const timestamp = dateToTimestamp(dateValue)
            if (timestamp) {
              data = await anomaliesService.getAnomaliesByMinEventTime(timestamp)
            } else {
              setError('Введите корректную дату и время')
              setLoading(false)
              return
            }
          }
          break
        
        case 'etimeRange':
          if (rangeMinDate && rangeMaxDate) {
            const minTimestamp = dateToTimestamp(rangeMinDate)
            const maxTimestamp = dateToTimestamp(rangeMaxDate)
            if (minTimestamp && maxTimestamp) {
              if (minTimestamp > maxTimestamp) {
                setError('Начальная дата не может быть позже конечной')
                setLoading(false)
                return
              }
              data = await anomaliesService.getAnomaliesByEventTimeRange(minTimestamp, maxTimestamp)
            } else {
              setError('Введите корректные дату и время')
              setLoading(false)
              return
            }
          }
          break
        // ========== КОНЕЦ ФИЛЬТРОВ ПО ВРЕМЕНИ ==========
        
        case 'avgCheckMore':
          if (searchValue) {
            const value = parseFloat(searchValue.toString().replace(',', '.'))
            data = await anomaliesService.getAnomaliesByAvgCheckMore(value)
          }
          break

        case 'avgCheckLess':
          if (searchValue) {
            const value = parseFloat(searchValue.toString().replace(',', '.'))
            data = await anomaliesService.getAnomaliesByAvgCheckLess(value)
          }
          break

        case 'avgCheckRange':
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
            
            data = await anomaliesService.getAnomaliesByAvgCheckRange(minValue, maxValue)
          }
          break
        
        default:
          data = await anomaliesService.getAllAnomalies()
      }
      
      setAnomalies(data || [])
      if (data && data.length === 0 && filterType !== 'all') {
        setError('По вашему запросу ничего не найдено')
      } else {
        setError('')
      }
    } catch (err) {
      console.error('Apply filter error:', err)
      setError(typeof err === 'string' ? err : 'Ошибка при применении фильтра')
      setAnomalies([])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFilterType('all')
    setSearchValue('')
    setRangeMin('')
    setRangeMax('')
    setDateValue('')
    setRangeMinDate('')
    setRangeMaxDate('')
    loadAllAnomalies()
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAllAnomalies()
  }, [])

  // Функция для получения значения поля ввода в зависимости от типа фильтра
  const getInputValue = () => {
    if (filterType === 'etimeMore' || filterType === 'etimeLess') return dateValue
    return searchValue
  }

  // Функция для изменения значения поля ввода
  const handleInputChange = (e) => {
    if (filterType === 'etimeMore' || filterType === 'etimeLess') {
      setDateValue(e.target.value)
    } else {
      setSearchValue(e.target.value)
    }
  }

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
        Аномалии пользователей
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
            <div style={{ flex: 1, minWidth: '200px' }}>
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
                <option value="all">Все аномалии</option>
                <option value="userId">По ID пользователя</option>
                <option value="type">По типу аномалии</option>
                <optgroup label="Сумма (sum)">
                  <option value="sumMore">Sum {'>'} значение</option>
                  <option value="sumLess">Sum {'<'} значение</option>
                  <option value="sumRange">Sum в диапазоне</option>
                </optgroup>
                <optgroup label="Время (eventTime)">
                  <option value="etimeMore">После даты и времени</option>
                  <option value="etimeLess">До даты и времени</option>
                  <option value="etimeRange">В диапазоне дат</option>
                </optgroup>
                <optgroup label="Средний чек (avgCheck)">
                  <option value="avgCheckMore">AvgCheck {'>'} значение</option>
                  <option value="avgCheckLess">AvgCheck {'<'} значение</option>
                  <option value="avgCheckRange">AvgCheck в диапазоне</option>
                </optgroup>
              </select>
            </div>

            {/* Одиночное поле ввода */}
            {!['sumRange', 'etimeRange', 'avgCheckRange'].includes(filterType) && filterType !== 'all' && (
              <div style={{ flex: 2, minWidth: '250px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Значение
                </label>
                <input
                  type={getInputType()}
                  value={getInputValue()}
                  onChange={handleInputChange}
                  placeholder={getPlaceholder()}
                  step={getInputStep()}
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

            {/* Поля для диапазона сумм и avgCheck */}
            {(filterType === 'sumRange' || filterType === 'avgCheckRange') && (
              <>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    От
                  </label>
                  <input
                    type="number"
                    value={rangeMin}
                    onChange={(e) => setRangeMin(e.target.value)}
                    placeholder="Минимум"
                    step={filterType === 'avgCheckRange' ? '0.01' : '1'}
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
                    До
                  </label>
                  <input
                    type="number"
                    value={rangeMax}
                    onChange={(e) => setRangeMax(e.target.value)}
                    placeholder="Максимум"
                    step={filterType === 'avgCheckRange' ? '0.01' : '1'}
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

            {/* Поля для диапазона времени */}
            {filterType === 'etimeRange' && (
              <>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Дата и время (от)
                  </label>
                  <input
                    type="datetime-local"
                    value={rangeMinDate}
                    onChange={(e) => setRangeMinDate(e.target.value)}
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
                    Дата и время (до)
                  </label>
                  <input
                    type="datetime-local"
                    value={rangeMaxDate}
                    onChange={(e) => setRangeMaxDate(e.target.value)}
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

      {/* Таблица аномалий */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'auto',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID пользователя</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Тип транзакции</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Тип аномалии</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Время</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Сумма</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Средний чек</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  Аномалии не найдены
                </td>
              </tr>
            ) : (
              anomalies.map((anomaly) => {
                const transactionType = getTransactionType(anomaly.type)
                const transactionTypeStyle = getTransactionTypeColor(transactionType)
                const anomalyTypeStyle = getAnomalyTypeColor(anomaly.message)
                const anomalyTypeName = getAnomalyTypeName(anomaly.message)
                
                return (
                  <tr key={anomaly.anomalyId} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{anomaly.anomalyId}</td>
                    <td style={{ padding: '12px' }}>{anomaly.userId}</td>
                    
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: transactionTypeStyle.bg,
                        color: transactionTypeStyle.color,
                        fontWeight: 'bold',
                        fontSize: '12px',
                        display: 'inline-block',
                        whiteSpace: 'nowrap'
                      }}>
                        {transactionType}
                      </span>
                    </td>
                    
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: anomalyTypeStyle.bg,
                        color: anomalyTypeStyle.color,
                        fontWeight: 'bold',
                        fontSize: '11px',
                        display: 'inline-block',
                        whiteSpace: 'nowrap'
                      }}>
                        {anomalyTypeName}
                      </span>
                    </td>
                    
                    <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                      {formatDateTime(anomaly.eventTime)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {anomaly.sum ? `${anomaly.sum.toFixed(2)} ₽` : '—'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {anomaly.avgCheck ? `${anomaly.avgCheck.toFixed(2)} ₽` : '—'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => navigate(`/anomalies/${anomaly.anomalyId}`)}
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
                        onClick={() => navigate(`/users/${anomaly.userId}`)}
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
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Информация о количестве */}
      <div style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
        Найдено аномалий: {anomalies.length}
      </div>
    </div>
  )
}

export default AnomaliesList