// Преобразование даты из input datetime-local в формат LocalDateTime для API
export const dateToLocalDateTime = (dateString) => {
  if (!dateString) return null
  // input datetime-local возвращает "2024-01-15T10:30"
  // Добавляем секунды, если их нет
  let formatted = dateString
  if (formatted.length === 16) {
    formatted = `${formatted}:00`
  }
  console.log(`📅 Date conversion: ${dateString} -> ${formatted}`)
  return formatted
}

// Форматирование даты из строки в читаемый вид
export const formatDateTime = (timestamp) => {
  if (!timestamp) return '—'
  try {
    const date = new Date(timestamp)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return timestamp
  }
}

// Старая функция для timestamp (оставляем на всякий случай)
export const dateToTimestamp = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  const timestamp = date.getTime()
  console.log(`📅 Date conversion: ${dateString} -> ${timestamp}`)
  return timestamp
}

// Форматирует минуты в человеко-читаемый формат
export const formatMinutes = (minutes) => {
  if (!minutes) return '—'
  
  const totalMinutes = parseFloat(minutes)
  if (isNaN(totalMinutes)) return '—'
  
  if (totalMinutes < 1) {
    const seconds = (totalMinutes * 60).toFixed(0)
    return `${seconds} сек.`
  }
  
  if (totalMinutes < 60) {
    const mins = Math.floor(totalMinutes)
    return `${mins} мин.`
  }
  
  if (totalMinutes < 1440) {
    const hours = Math.floor(totalMinutes / 60)
    const remainingMins = Math.round(totalMinutes % 60)
    
    if (remainingMins === 0) {
      return `${hours} ч.`
    }
    return `${hours} ч. ${remainingMins} мин.`
  }
  
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

export const getMinutesValue = (minutes) => {
  if (!minutes) return 0
  const parsedMinutes = parseFloat(minutes)
  return isNaN(parsedMinutes) ? 0 : parsedMinutes
}

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