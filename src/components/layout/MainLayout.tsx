import { Outlet } from 'react-router-dom'
import Header from './Header'
import ConversationSidebar from './ConversationSidebar'
import MetricsBar from './MetricsBar'
import { useState } from 'react'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <MetricsBar />

      <div className="flex">
        <ConversationSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : 'ml-0'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout