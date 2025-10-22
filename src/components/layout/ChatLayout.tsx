import { Outlet } from 'react-router-dom'
import MetricsBar from './MetricsBar'

const ChatLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="ml-64">
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
