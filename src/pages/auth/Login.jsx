import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Train, Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { TEST_USERS } from '../../constants'
import toast from 'react-hot-toast'

const Login = () => {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [form, setForm]         = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)

  const handleSubmit = () => {
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const user = TEST_USERS.find(
        u => u.email === form.email && u.password === form.password
      )
      if (user) {
        login(user)
        toast.success(`Welcome, ${user.name}!`)
        navigate('/dept/dashboard')
      } else {
        toast.error('Invalid email or password')
      }
      setLoading(false)
    }, 800)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="min-h-screen bg-dept-bg flex">

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-dept-blue p-12">
        <div className="bg-dept-accent p-4 rounded-2xl mb-6">
          <Train className="w-12 h-12 text-white" />
        </div>
        <h1 className="font-syne font-bold text-white text-4xl mb-2 text-center">
          Rail<span className="text-dept-accent">Connect</span>
        </h1>
        <p className="text-blue-300 font-dm text-center text-lg mb-2">
          Railway Departments Portal
        </p>
        <p className="text-blue-200 font-dm text-center max-w-sm leading-relaxed text-sm">
          Manage and resolve passenger complaints assigned by AI routing system.
        </p>

        {/* Department List */}
        <div className="mt-10 w-full max-w-sm">
          <p className="text-blue-300 text-xs font-dm mb-3 uppercase tracking-wide">
            Departments
          </p>
          {[
            '🧹 Cleanliness & Hygiene',
            '🍱 Food & Catering',
            '👮 Safety & Security',
            '🎫 Ticketing',
            '💊 Medical Assistance',
            '⚡ Electrical Issues',
          ].map((dept, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/10">
              <span className="text-blue-200 text-sm font-dm">{dept}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center gap-2 mb-8">
            <div className="bg-dept-accent p-3 rounded-2xl">
              <Train className="w-8 h-8 text-white" />
            </div>
            <span className="font-syne font-bold text-dept-blue text-2xl">
              Rail<span className="text-dept-accent">Connect</span>
            </span>
            <p className="text-dept-gray font-dm text-sm">Railway Departments Portal</p>
          </div>

          <h2 className="font-syne font-bold text-dept-blue text-3xl mb-1">
            Department Login
          </h2>
          <p className="text-dept-gray font-dm text-sm mb-8">
            Sign in with your department credentials
          </p>

          {/* Test Credentials */}
          <div className="bg-dept-light border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-dept-blue mb-2 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Test Credentials:
            </p>
            {TEST_USERS.map((u, i) => (
              <button
                key={i}
                onClick={() => setForm({ email: u.email, password: u.password })}
                className="w-full text-left text-xs text-dept-gray font-dm hover:text-dept-blue transition-colors py-0.5"
              >
                <span className="font-medium">{u.name}</span> ({u.department}) → {u.email}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Department Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dept-gray" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter department email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-dept-mid transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dept-gray" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-dept-mid transition-all"
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dept-gray"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-dept-blue hover:bg-dept-mid text-white font-dm font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : null
              }
              {loading ? 'Signing in...' : 'Sign In to Portal'}
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Login