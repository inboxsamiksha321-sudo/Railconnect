import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Train, Bell, LogOut, User, Menu, X, Building2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-dept-blue sticky top-0 z-50 shadow-lg">
      <div className="h-1 bg-dept-accent w-full" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-dept-accent p-1.5 rounded-lg">
              <Train className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-syne font-bold text-white text-lg">
                Rail<span className="text-dept-accent">Connect</span>
              </span>
              <p className="text-blue-300 text-xs font-dm leading-none">
                Railway Departments Portal
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dept/dashboard"
                className="text-blue-200 hover:text-white font-dm text-sm transition-colors">
                Dashboard
              </Link>
              <Link to="/dept/complaints"
                className="text-blue-200 hover:text-white font-dm text-sm transition-colors">
                Complaints
              </Link>
              {user.isHead && (
                <Link to="/dept/staff"
                  className="text-blue-200 hover:text-white font-dm text-sm transition-colors">
                  Manage Staff
                </Link>
              )}
            </div>
          )}

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                  <Building2 className="w-4 h-4 text-dept-accent" />
                  <div>
                    <p className="text-xs font-dm text-white font-medium">{user.name}</p>
                    <p className="text-xs font-dm text-blue-300">{user.department}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-blue-200 hover:text-white font-dm text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login"
                className="bg-dept-accent hover:bg-orange-500 text-white font-dm text-sm font-medium px-4 py-1.5 rounded-lg transition-all">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-dept-blue border-t border-white/10 px-4 py-4 flex flex-col gap-3">
          {user && (
            <>
              <Link to="/dept/dashboard" onClick={() => setMenuOpen(false)}
                className="text-blue-200 font-dm text-sm">Dashboard</Link>
              <Link to="/dept/complaints" onClick={() => setMenuOpen(false)}
                className="text-blue-200 font-dm text-sm">Complaints</Link>
              {user.isHead && (
                <Link to="/dept/staff" onClick={() => setMenuOpen(false)}
                  className="text-blue-200 font-dm text-sm">Manage Staff</Link>
              )}
              <button onClick={handleLogout}
                className="text-left text-blue-200 font-dm text-sm">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar