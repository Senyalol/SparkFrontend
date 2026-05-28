import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ padding: '20px', backgroundColor: '#f5f5f5', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout