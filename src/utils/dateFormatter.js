/**
 * Форматирует минуты в человеко-читаемый формат
 * @param {string|number} minutes - минуты (может быть строкой "887.63" или числом)
 * @returns {string} отформатированная строка
 */
export const formatMinutes = (minutes) => {
  if (!minutes) return '—'
  
  const totalMinutes = parseFloat(minutes)
  if (isNaN(totalMinutes)) return '—'
  
  // Секунды (меньше 1 минуты)
  if (totalMinutes < 1) {
    const seconds = (totalMinutes * 60).toFixed(0)
    return `${seconds} сек.`
  }
  
  // Минуты (меньше 60)
  if (totalMinutes < 60) {
    const mins = Math.floor(totalMinutes)
    return `${mins} мин.`
  }
  
  // Часы и минуты (меньше 24 часов = 1440 минут)
  if (totalMinutes < 1440) {
    const hours = Math.floor(totalMinutes / 60)
    const remainingMins = Math.round(totalMinutes % 60)
    
    if (remainingMins === 0) {
      return `${hours} ч.`
    }
    return `${hours} ч. ${remainingMins} мин.`
  }
  
  // Дни, часы и минуты (больше 24 часов)
  const days = Math.floor(totalMinutes / 1440)
  const remainingHoursMinutes = totalMinutes % 1440
  const hours = Math.floor(remainingHoursMinutes / 60)
  const mins = Math.round(remainingHoursMinutes % 60)
  
  if (hours === 0 && mins === 0) {
    return `${days} дн.`
  }
  
  if (hours === 0) {
    return `${days} дн. ${mins} мин.`
  }
  
  if (mins === 0) {
    return `${days} дн. ${hours} ч.`
  }
  
  return `${days} дн. ${hours} ч. ${mins} мин.`
}

/**
 * Получает числовое значение минут для расчетов (фильтрации)
 * @param {string|number} minutes - минуты
 * @returns {number} число минут
 */
export const getMinutesValue = (minutes) => {
  if (!minutes) return 0
  const parsedMinutes = parseFloat(minutes)
  return isNaN(parsedMinutes) ? 0 : parsedMinutes
}

/**
 * Форматирует дату
 * @param {string} dateString - строка с датой
 * @returns {string} отформатированная дата
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—'
  try {
    const parsedDate = new Date(dateString)
    if (isNaN(parsedDate.getTime())) {
      return dateString
    }
    return parsedDate.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}