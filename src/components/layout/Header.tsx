import { Menu, LogOut, ChevronDown, Settings, LayoutDashboard } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debug log
  console.log('Header - user:', user)

  // Compute full_name
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
  console.log('Header - fullName:', fullName)
  console.log('🔥 HEADER COMPONENT RENDERED - dropdown state:', dropdownOpen)

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  // Obtenir les initiales de l'utilisateur
  const getInitials = (name: string | undefined) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-[60] h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Left: Menu + Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/chat" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">H</span>
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent hidden sm:block">
                Harena
              </span>
            </Link>
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

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999]">
                {/* DEBUG INFO */}
                <div className="px-4 py-2 bg-blue-500 text-white text-xs font-bold">
                  VERSION TEST v2.0 - {new Date().toLocaleTimeString()}
                </div>

                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{fullName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
                </div>

                {/* Menu Items - TEST VISUEL */}
                <div className="py-1 bg-yellow-100">
                  <button
                    onClick={() => {
                      navigate('/user-dashboard')
                      setDropdownOpen(false)
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>🔥 Tableau de bord TEST</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/configuration')
                      setDropdownOpen(false)
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>⚙️ Configuration TEST</span>
                  </button>
                  <div className="px-4 py-2 text-xs text-red-600 font-bold">
                    SI VOUS VOYEZ CECI = LE CODE FONCTIONNE!
                  </div>
                </div>
                <div className="py-1 border-t border-gray-200">
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
  )
}

export default Header