import { Search, Bell, Menu, User } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 h-20 bg-gradient-primary shadow-lg">
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Left: Logo + Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">H</span>
              </div>
              <span className="text-2xl font-bold text-white hidden sm:block">
                Harena
              </span>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des transactions..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
              />
            </div>
          </div>

          {/* Right: Notifications + User */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full text-white hover:bg-white/10 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-main rounded-full"></span>
            </button>

            <button className="flex items-center space-x-2 p-2 rounded-lg text-white hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <span className="hidden sm:block font-medium">John Doe</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header