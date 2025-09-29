import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  Target,
  Building2,
  Settings,
  MessageSquare,
  X
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Budget', href: '/budget', icon: Target },
  { name: 'Comptes', href: '/accounts', icon: Building2 },
  { name: 'Paramètres', href: '/settings', icon: Settings },
]

const Sidebar = ({ open, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-20 left-0 z-40 h-[calc(100vh-5rem)] w-60
          bg-white border-r border-gray-200 shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600 -ml-[1px]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Chat IA (Bottom) */}
          <div className="p-3 border-t border-gray-200">
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'bg-gradient-primary text-white hover:opacity-90'
                }`
              }
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat IA</span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar