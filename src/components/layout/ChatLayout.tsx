import { Outlet, NavLink } from 'react-router-dom'
import { Menu, LogOut, ChevronDown, LayoutDashboard, Target, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'
import MetricsBar from './MetricsBar'

const ChatLayout = () => {
  const { user, logout } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const getFullName = () => {
    if (!user) return 'Utilisateur'
    if (user.full_name) return user.full_name
    const firstName = user.first_name || ''
    const lastName = user.last_name || ''
    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    } else if (firstName) {
      return firstName
    } else if (lastName) {
      return lastName
    } else {
      return user.email?.split('@')[0] || 'Utilisateur'
    }
  }

  const fullName = getFullName()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm">
        <div className="h-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            {/* Left: Menu + Logo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              <NavLink to="/chat" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-white">H</span>
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hidden sm:block">
                  Harena
                </span>
              </NavLink>
            </div>

            {/* Right: User Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {getInitials(fullName)}
                  </span>
                </div>
                <span className="hidden sm:block font-medium text-sm">
                  {fullName}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{fullName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu Overlay */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div
            ref={menuRef}
            className="fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-60 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300"
          >
            <div className="flex flex-col h-full">
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <nav className="flex-1 px-3 py-6 space-y-1 mt-8">
                <NavLink
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600 -ml-[1px]'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink
                  to="/budget"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600 -ml-[1px]'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Target className="w-5 h-5" />
                  <span>Budget</span>
                </NavLink>
              </nav>
            </div>
          </div>
        </>
      )}

      <MetricsBar />

      <div className="flex">
        <main className="flex-1 w-full">
          <div className="h-[calc(100vh-8.5rem)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default ChatLayout
