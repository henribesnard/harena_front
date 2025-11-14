import { Outlet } from 'react-router-dom'
import ConversationSidebar from '../chat/ConversationSidebar'
import MetricsBar from './MetricsBar'
import { useState } from 'react'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:ml-64">
        <MetricsBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <div className="flex h-full">
        <ConversationSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
