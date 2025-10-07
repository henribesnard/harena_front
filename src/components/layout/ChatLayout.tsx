import { Outlet } from 'react-router-dom'
import Header from './Header'
import MetricsBar from './MetricsBar'

const ChatLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => {}} />
      <MetricsBar />

      <div className="h-[calc(100vh-8.5rem)]">
        <Outlet />
      </div>
    </div>
  )
}

export default ChatLayout
