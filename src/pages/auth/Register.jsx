import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Train, User, Mail, Phone, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const [step, setStep]         = useState(1)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]   = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    password: '', confirmPassword: '',
  })

  const handleNext = () => {
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill in all fields')
      return
    }
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error('Enter a valid 10-digit phone number')
      return
    }
    setStep(2)
  }

  const handleSubmit = () => {
    if (!form.password || !form.confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    setTimeout(() => {
      toast.success('Account created successfully!')
      navigate('/login')
      setLoading(false)
    }, 1000)
  }

  const progress = step === 1 ? 50 : 100

  return (
    <div className="min-h-screen bg-rail-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="bg-rail-accent p-2 rounded-xl">
            <Train className="w-6 h-6 text-white" />
          </div>
          <span className="font-syne font-bold text-rail-blue text-2xl">
            Rail<span className="text-rail-accent">Connect</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* Header */}
          <h2 className="font-syne font-bold text-rail-blue text-2xl mb-1">
            Create Account
          </h2>
          <p className="text-rail-gray font-dm text-sm mb-6">
            Step {step} of 2 — {step === 1 ? 'Personal Details' : 'Set Password'}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
            <div
              className="h-1.5 bg-rail-accent rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-gray" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-rail-mid transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-gray" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-rail-mid transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Phone Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-rail-gray font-dm">
                    🇮🇳 +91
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-gray" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-rail-mid transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-rail-blue hover:bg-rail-mid text-white font-dm font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-gray" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-rail-mid transition-all"
                  />
                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-rail-gray"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-gray" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-rail-mid transition-all"
                  />
                  <button
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-rail-gray"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-gray-200 text-rail-gray font-dm font-medium py-3 rounded-xl hover:border-rail-mid transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-rail-accent hover:bg-orange-500 text-white font-dm font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : null
                  }
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}

        </div>

        <p className="text-center text-sm font-dm text-rail-gray mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-rail-mid font-medium hover:text-rail-blue">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register