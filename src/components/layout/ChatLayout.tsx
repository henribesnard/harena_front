import { Outlet } from 'react-router-dom'
import MetricsBar from './MetricsBar'

const ChatLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Responsive margin: none on mobile, 256px (w-64) on desktop */}
      <div className="lg:ml-64">
        <MetricsBar />

        <main className="flex-1 w-full overflow-hidden">
          <div className="h-[calc(100vh-3rem)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default ChatLayout
