import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import MetricsBar from './MetricsBar'
import { useState } from 'react'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <MetricsBar />

      <div className="flex">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-60' : 'ml-0'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout