import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Train, Bell, LogOut, User, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { NAV_LINKS } from '../../constants'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = user
    ? NAV_LINKS[user.role] || NAV_LINKS.public
    : NAV_LINKS.public

  return (
    <nav className="bg-rail-blue sticky top-0 z-50 shadow-lg">
      {/* Orange top stripe */}
      <div className="h-1 bg-rail-accent w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-rail-accent p-1.5 rounded-lg">
              <Train className="w-5 h-5 text-white" />
            </div>
            <span className="font-syne font-bold text-white text-xl">
              Rail<span className="text-rail-accent">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                to={link.path}
                className="text-blue-200 hover:text-white font-dm text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to={`/${user.role}/notifications`}>
                  <div className="relative">
                    <Bell className="w-5 h-5 text-white" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-rail-accent rounded-full" />
                  </div>
                </Link>
                <Link
                  to={`/${user.role}/profile`}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
                >
                  <User className="w-4 h-4 text-white" />
                  <span className="text-sm font-dm text-white">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-blue-200 hover:text-white font-dm text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-blue-200 hover:text-white font-dm text-sm transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-rail-accent hover:bg-orange-500 text-white font-dm text-sm font-medium px-4 py-1.5 rounded-lg transition-all"
                >
                  Register
                </Link>
              </>
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
        <div className="md:hidden bg-rail-blue border-t border-white/10 px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="text-blue-200 hover:text-white font-dm text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="text-left text-blue-200 hover:text-white font-dm text-sm transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="text-blue-200 hover:text-white font-dm text-sm">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="text-blue-200 hover:text-white font-dm text-sm">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar