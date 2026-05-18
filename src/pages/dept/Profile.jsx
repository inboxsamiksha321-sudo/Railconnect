import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  User, Mail, Phone, Building2,
  Edit2, Save, X, Lock, LogOut, CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, logout } = useAuth()

  const [editing, setEditing]   = useState(false)
  const [formData, setFormData] = useState({
    name:  user?.name       || '',
    email: user?.email      || '',
    phone: '9800001234',
    dept:  user?.department || '',
  })
  const [tempData, setTempData] = useState({ ...formData })

  const handleEdit   = () => { setTempData({ ...formData }); setEditing(true)  }
  const handleSave   = () => { setFormData({ ...tempData }); setEditing(false); toast.success('Profile updated!') }
  const handleCancel = () => { setTempData({ ...formData }); setEditing(false) }

  return (
    <div className="min-h-screen bg-dept-bg py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        <div className="mb-6">
          <h1 className="font-syne font-bold text-dept-blue text-2xl mb-1">My Profile</h1>
          <p className="text-dept-gray text-sm font-dm">Manage your department account</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 bg-dept-blue rounded-2xl flex items-center justify-center">
              <span className="font-syne font-bold text-white text-2xl">
                {formData.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="font-syne font-bold text-dept-blue text-xl">{formData.name}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <Building2 className="w-3.5 h-3.5 text-dept-accent" />
                <span className="text-sm text-dept-gray font-dm">{formData.dept}</span>
              </div>
              {user?.isHead && (
                <div className="flex items-center gap-1.5 mt-1">
                  <CheckCircle className="w-3.5 h-3.5 text-dept-green" />
                  <span className="text-xs text-dept-green font-dm font-medium">Department Head</span>
                </div>
              )}
            </div>
            {!editing ? (
              <button onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dept-blue text-dept-blue rounded-xl text-sm font-dm font-medium hover:bg-dept-light transition-all">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-2 bg-dept-green text-white rounded-xl text-sm font-dm">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={handleCancel}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-dept-gray rounded-xl text-sm font-dm">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4">
            {[
              { icon: <User className="w-4 h-4" />,      label: 'Full Name',   key: 'name',  type: 'text'  },
              { icon: <Mail className="w-4 h-4" />,      label: 'Email',       key: 'email', type: 'email' },
              { icon: <Phone className="w-4 h-4" />,     label: 'Phone',       key: 'phone', type: 'tel'   },
              { icon: <Building2 className="w-4 h-4" />, label: 'Department',  key: 'dept',  type: 'text'  },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs font-semibold text-dept-gray uppercase tracking-wide mb-1.5 block">
                  {field.label}
                </label>
                {editing && field.key !== 'dept' ? (
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dept-gray">{field.icon}</span>
                    <input
                      type={field.type}
                      value={tempData[field.key]}
                      onChange={e => setTempData({ ...tempData, [field.key]: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-dept-mid"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-dept-bg rounded-xl">
                    <span className="text-dept-gray">{field.icon}</span>
                    <span className="text-sm font-dm text-gray-700">{formData[field.key]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-4 h-4 text-dept-mid" />
            <h2 className="font-syne font-bold text-dept-blue">Security</h2>
          </div>
          <button
            onClick={() => toast.success('Password reset link sent!')}
            className="w-full flex items-center justify-between px-4 py-3 bg-dept-bg rounded-xl hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-dept-gray" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 font-dm">Change Password</p>
                <p className="text-xs text-dept-gray font-dm">Last changed 30 days ago</p>
              </div>
            </div>
            <span className="text-dept-mid text-xs font-dm font-medium">Reset →</span>
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-red-200 text-red-500 rounded-2xl font-dm font-medium hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" /> Logout from Portal
        </button>

      </div>
    </div>
  )
}

export default Profile