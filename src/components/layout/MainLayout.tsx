import { Outlet } from 'react-router-dom'
import ConversationSidebar from '../chat/ConversationSidebar'
import MetricsBar from './MetricsBar'
import { useState } from 'react'

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Skip links for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Aller au contenu principal
      </a>

      <div className="min-h-screen bg-gray-50">
        <MetricsBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex h-full">
          <ConversationSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main
            id="main-content"
            className="flex-1 lg:ml-64"
            tabIndex={-1}
            role="main"
            aria-label="Contenu principal"
          >
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default MainLayout
