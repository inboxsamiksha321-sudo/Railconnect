import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'
import {
  Users, Mail, Building2, CheckCircle,
  XCircle, Search, Shield
} from 'lucide-react'
import toast from 'react-hot-toast'

const ManageStaff = () => {
  const { user } = useAuth()

  if (!user?.isHead) return <Navigate to="/dept/dashboard" replace />

  const staffList = TEST_USERS.filter(u => !u.isHead)

  const [search, setSearch] = useState('')
  const [active, setActive] = useState(
    Object.fromEntries(staffList.map(u => [u.email, true]))
  )

  const filtered = staffList.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleActive = (email) => {
    setActive(prev => {
      const next = { ...prev, [email]: !prev[email] }
      toast.success(`${email} ${next[email] ? 'activated' : 'deactivated'}!`)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-dept-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-syne font-bold text-dept-blue text-2xl mb-1">
            Manage Staff
          </h1>
          <p className="text-dept-gray text-sm font-dm">
            View and manage all department staff members
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Staff',  value: staffList.length,                              bg: 'bg-blue-50',  text: 'text-dept-blue'  },
            { label: 'Active',       value: Object.values(active).filter(Boolean).length,  bg: 'bg-green-50', text: 'text-green-700'  },
            { label: 'Inactive',     value: Object.values(active).filter(v => !v).length,  bg: 'bg-red-50',   text: 'text-red-700'    },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-xl p-4 text-center`}>
              <p className={`font-syne font-bold text-2xl ${s.text}`}>{s.value}</p>
              <p className="text-xs text-dept-gray font-dm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dept-gray" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, department or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-dept-mid transition-all"
            />
          </div>
        </div>

        {/* Staff List */}
        <div className="flex flex-col gap-3">
          {filtered.map((staff, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-syne font-bold text-white text-lg ${
                    active[staff.email] ? 'bg-dept-blue' : 'bg-gray-300'
                  }`}>
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-syne font-bold text-dept-blue">{staff.name}</p>
                      {active[staff.email] ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-dept-accent" />
                      <span className="text-sm text-dept-gray font-dm">{staff.department}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-dept-gray" />
                      <span className="text-xs text-dept-gray font-dm">{staff.email}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(staff.email)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-dm font-medium transition-all ${
                    active[staff.email]
                      ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200'
                      : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                  }`}
                >
                  {active[staff.email]
                    ? <><XCircle className="w-4 h-4" /> Deactivate</>
                    : <><CheckCircle className="w-4 h-4" /> Activate</>
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Head Badge */}
        <div className="mt-6 bg-dept-blue rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-dept-accent rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-syne font-bold text-white">{user.name}</p>
            <p className="text-blue-200 text-sm font-dm">Department Head · All Departments</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ManageStaff