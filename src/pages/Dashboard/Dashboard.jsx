import { useAuth } from '../../hooks/useAuth'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div>
      <h1>Добро пожаловать, {user?.firstName} {user?.lastName}!</h1>
      <p>Это ваша панель управления</p>
    </div>
  )
}

export default Dashboard