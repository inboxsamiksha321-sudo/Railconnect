import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import { API_BASE_URL } from '../../constants'
import {
  User, Mail, Phone, Shield,
  Edit2, Save, X, Camera,
  Bell, Lock, LogOut, CheckCircle, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, logout } = useAuth()

  const [editing, setEditing]   = useState(false)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)

  const [formData, setFormData] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    phone: '',
    city:  '',
  })
  const [tempData, setTempData] = useState({ ...formData })

  const [notifications, setNotifications] = useState({
    email: true, sms: true, app: true,
  })

  const [stats, setStats] = useState({
    total: 0, resolved: 0, in_progress: 0, pending: 0
  })

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        // TODO: Uncomment when backend is ready
        // const [profileRes, statsRes] = await Promise.all([
        //   axios.get(`${API_BASE_URL}/auth/profile`),
        //   axios.get(`${API_BASE_URL}/complaints/stats`),
        // ])
        // const p = profileRes.data
        // setFormData({ name: p.name, email: p.email, phone: p.phone, city: p.city })
        // setTempData({ name: p.name, email: p.email, phone: p.phone, city: p.city })
        // setNotifications(p.notifications || { email: true, sms: true, app: true })
        // setStats(statsRes.data)

        // TEMP: Use user from AuthContext until backend ready
        setFormData({
          name:  user?.name  || '',
          email: user?.email || '',
          phone: '',
          city:  '',
        })
        setStats({ total: 0, resolved: 0, in_progress: 0, pending: 0 })

      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleEdit   = () => { setTempData({ ...formData }); setEditing(true)  }
  const handleCancel = () => { setTempData({ ...formData }); setEditing(false) }

  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: Uncomment when backend is ready
      // await axios.put(`${API_BASE_URL}/auth/profile`, tempData)
      setFormData({ ...tempData })
      setEditing(false)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationToggle = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] }
    setNotifications(updated)
    try {
      // TODO: Uncomment when backend is ready
      // await axios.put(`${API_BASE_URL}/auth/notifications`, updated)
    } catch {
      setNotifications(notifications)
      toast.error('Failed to update preferences')
    }
  }

  const handleChangePassword = async () => {
    try {
      // TODO: Uncomment when backend is ready
      // await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email: formData.email })
      toast.success('Password reset link sent to your email!')
    } catch {
      toast.error('Failed to send reset link')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-rail-bg py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="animate-pulse flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-2xl" />
                    <div className="flex-1 flex flex-col gap-2 justify-center">
                      <div className="w-1/2 h-5 bg-gray-200 rounded" />
                      <div className="w-1/3 h-4 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-rail-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
          <p className="font-syne font-bold text-rail-blue text-xl mb-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rail-bg py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        <div className="mb-6">
          <h1 className="font-syne font-bold text-rail-blue text-2xl mb-1">My Profile</h1>
          <p className="text-rail-gray text-sm font-dm">Manage your account details</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-rail-blue rounded-2xl flex items-center justify-center">
                <span className="font-syne font-bold text-white text-2xl">
                  {formData.name?.charAt(0)?.toUpperCase() || 'P'}
                </span>
              </div>
              <button
                onClick={() => toast.success('Photo upload coming soon!')}
                className="absolute -bottom-1 -right-1 bg-rail-accent text-white p-1.5 rounded-lg"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-syne font-bold text-rail-blue text-xl">{formData.name}</h2>
              <p className="text-rail-gray text-sm font-dm">{formData.email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle className="w-3.5 h-3.5 text-rail-green" />
                <span className="text-xs text-rail-green font-dm font-medium">Verified Passenger</span>
              </div>
            </div>
            {!editing ? (
              <button onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 border-2 border-rail-blue text-rail-blue rounded-xl text-sm font-dm font-medium hover:bg-rail-light transition-all">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-2 bg-rail-green text-white rounded-xl text-sm font-dm font-medium disabled:opacity-50">
                  {saving
                    ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Save className="w-3.5 h-3.5" />
                  }
                  Save
                </button>
                <button onClick={handleCancel}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-rail-gray rounded-xl text-sm font-dm">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 p-4 bg-rail-bg rounded-xl mb-6">
            {[
              { label: 'Total Filed', value: stats.total       },
              { label: 'Resolved',    value: stats.resolved    },
              { label: 'In Progress', value: stats.in_progress },
              { label: 'Pending',     value: stats.pending     },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-syne font-bold text-rail-blue text-xl">{s.value}</p>
                <p className="text-xs text-rail-gray font-dm mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4">
            {[
              { icon: <User className="w-4 h-4" />,   label: 'Full Name',     key: 'name',  type: 'text'  },
              { icon: <Mail className="w-4 h-4" />,   label: 'Email Address', key: 'email', type: 'email' },
              { icon: <Phone className="w-4 h-4" />,  label: 'Phone Number',  key: 'phone', type: 'tel'   },
              { icon: <Shield className="w-4 h-4" />, label: 'City',          key: 'city',  type: 'text'  },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs font-semibold text-rail-gray uppercase tracking-wide mb-1.5 block">
                  {field.label}
                </label>
                {editing ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rail-gray">{field.icon}</span>
                    <input
                      type={field.type}
                      value={tempData[field.key]}
                      onChange={e => setTempData({ ...tempData, [field.key]: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-rail-mid"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-rail-bg rounded-xl">
                    <span className="text-rail-gray">{field.icon}</span>
                    <span className="text-sm font-dm text-gray-700">
                      {formData[field.key] || <span className="text-gray-300 italic">Not set</span>}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-4 h-4 text-rail-mid" />
            <h2 className="font-syne font-bold text-rail-blue">Notification Preferences</h2>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Get updates via email'        },
              { key: 'sms',   label: 'SMS Notifications',   desc: 'Receive SMS alerts on mobile' },
              { key: 'app',   label: 'App Notifications',   desc: 'In-app alerts for updates'    },
            ].map(pref => (
              <div key={pref.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 font-dm">{pref.label}</p>
                  <p className="text-xs text-rail-gray font-dm">{pref.desc}</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(pref.key)}
                  className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
                    notifications[pref.key] ? 'bg-rail-green' : 'bg-gray-200'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                    notifications[pref.key] ? 'left-5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-4 h-4 text-rail-mid" />
            <h2 className="font-syne font-bold text-rail-blue">Security</h2>
          </div>
          <button
            onClick={handleChangePassword}
            className="w-full flex items-center justify-between px-4 py-3 bg-rail-bg rounded-xl hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-rail-gray" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 font-dm">Change Password</p>
                <p className="text-xs text-rail-gray font-dm">Send reset link to your email</p>
              </div>
            </div>
            <span className="text-rail-mid text-xs font-dm font-medium">Reset →</span>
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-red-200 text-red-500 rounded-2xl font-dm font-medium hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" /> Logout from RailConnect
        </button>

      </div>
    </div>
  )
}

export default Profile