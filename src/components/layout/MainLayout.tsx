import { Outlet } from 'react-router-dom'
import ConversationSidebar from '../chat/ConversationSidebar'
import MetricsBar from './MetricsBar'
import { useState } from 'react'
import { Menu } from 'lucide-react'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <MetricsBar />

      <div className="flex h-full">
        <ConversationSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 lg:ml-64">
          {/* Mobile Menu Button */}
          <div className="lg:hidden sticky top-12 z-30 bg-white border-b border-gray-200 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
