import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Register = () => {
  const [userToken, setUserToken] = useState('')  // Уникальный токен аналитика
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Проверка токена
    if (!userToken) {
      setError('Введите ваш персональный токен')
      setLoading(false)
      return
    }

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      setLoading(false)
      return
    }

    // Проверка длины пароля
    if (password.length < 4) {
      setError('Пароль должен содержать минимум 4 символа')
      setLoading(false)
      return
    }

    const result = await register(userToken, login, password)  // Передаем токен
    
    if (result.success) {
      setSuccess('Регистрация успешна! Теперь вы можете войти')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } else {
      setError(result.error || 'Ошибка регистрации')
    }
    
    setLoading(false)
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '450px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Регистрация аналитика</h2>
        
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{
            backgroundColor: '#efe',
            color: '#3c3',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Ваш персональный токен <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              value={userToken}
              onChange={(e) => setUserToken(e.target.value)}
              placeholder="Введите ваш персональный токен (выдан администратором)"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Ваш уникальный токен для доступа к системе
            </small>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Логин</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Придумайте логин"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Придумайте пароль (минимум 4 символа)"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Подтверждение пароля</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите пароль"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/login" style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '14px'
            }}>
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register