import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import {
  FileText, Clock, TrendingUp, CheckCircle,
  ChevronRight, AlertCircle, Building2, User
} from 'lucide-react'


const statusConfig = {
  pending:     { label: 'Pending',     bg: 'bg-yellow-100', text: 'text-yellow-800' },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100',   text: 'text-blue-800'  },
  resolved:    { label: 'Resolved',    bg: 'bg-green-100',  text: 'text-green-800' },
  rejected:    { label: 'Rejected',    bg: 'bg-red-100',    text: 'text-red-800'   },
}

const Dashboard = () => {
  const { user } = useAuth()

  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem(
          "railconnect_officer_token"
        )
        const res = await axios.get(
          "http://127.0.0.1:8000/officer-complaints",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setComplaints(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchComplaints()
  }, [])

  const myComplaints = complaints.map(c => ({
    id: c.complaint_id,
    title: c.complaint_text,
    category: "Department",
    status: c.status.toLowerCase().replace(" ", "_"),
    priority: c.priority.toLowerCase(),
    date: new Date(c.created_at).toLocaleDateString(),
    train: c.train_no,
  }))

  const stats = [
    { label: 'Total Assigned',  value: myComplaints.length,                                          icon: <FileText className="w-5 h-5" />,   color: 'blue'   },
    { label: 'Pending',         value: myComplaints.filter(c => c.status === 'pending').length,      icon: <Clock className="w-5 h-5" />,       color: 'yellow' },
    { label: 'In Progress',     value: myComplaints.filter(c => c.status === 'in_progress').length,  icon: <TrendingUp className="w-5 h-5" />,  color: 'orange' },
    { label: 'Resolved',        value: myComplaints.filter(c => c.status === 'resolved').length,     icon: <CheckCircle className="w-5 h-5" />, color: 'green'  },
  ]

  const colorMap = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-dept-mid',    border: 'border-blue-100'   },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600',  border: 'border-yellow-100' },
    orange: { bg: 'bg-orange-50', icon: 'text-dept-accent', border: 'border-orange-100' },
    green:  { bg: 'bg-green-50',  icon: 'text-dept-green',  border: 'border-green-100'  },
  }

  const recent = [...myComplaints]
  .sort((a, b) => b.id - a.id)
  .slice(0, 5)
  const highPriority = myComplaints.filter(c => c.priority === 'high' && c.status !== 'resolved')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">
          Loading complaints...
        </p>
      </div>
    ) 
  }

  return (
    <div className="min-h-screen bg-dept-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Welcome Banner */}
        <div className="bg-dept-blue rounded-2xl p-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-blue-200 font-dm text-sm mb-1">Welcome back 👋</p>
            <h1 className="font-syne font-bold text-white text-2xl">{user?.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="w-4 h-4 text-dept-accent" />
              <p className="text-blue-200 font-dm text-sm">{user?.department}</p>
              {user?.isHead && (
                <span className="bg-dept-accent text-white text-xs px-2 py-0.5 rounded-full font-dm">
                  Department Head
                </span>
              )}
            </div>
          </div>
          <div className="hidden sm:block w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <span className="font-syne font-bold text-white text-2xl">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => {
            const c = colorMap[stat.color]
            return (
              <div key={i} className={`bg-white rounded-xl p-5 border ${c.border} shadow-sm flex items-start gap-3`}>
                <div className={`p-2 rounded-lg ${c.bg}`}>
                  <span className={c.icon}>{stat.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-dept-gray font-dm">{stat.label}</p>
                  <p className="text-2xl font-syne font-bold text-dept-blue mt-0.5">{stat.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Complaints */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne font-bold text-dept-blue">Recent Complaints</h3>
              <Link to="/dept/complaints"
                className="text-xs text-dept-mid font-dm hover:text-dept-blue transition-colors">
                View All →
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {recent.length === 0 ? (
                <p className="text-dept-gray font-dm text-sm text-center py-8">
                  No complaints assigned yet
                </p>
              ) : recent.map((c, i) => {
                const s = statusConfig[c.status]
                return (
                  <Link
                    key={i}
                    to={`/dept/complaints/${c.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-dept-bg transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-dept-gray">#{c.id}</span>
                        <span className="text-xs text-dept-gray">{c.category}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 truncate">{c.title}</p>
                      <p className="text-xs text-dept-gray font-dm mt-0.5">🚂 {c.train} · {c.date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ml-3 flex-shrink-0 ${s.bg} ${s.text}`}>
                      {s.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">

            {/* High Priority */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <h3 className="font-syne font-bold text-dept-blue">High Priority</h3>
              </div>
              {highPriority.length === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-dept-green mx-auto mb-2" />
                  <p className="text-sm text-dept-gray font-dm">All clear!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {highPriority.slice(0, 3).map((c, i) => (
                    <Link
                      key={i}
                      to={`/dept/complaints/${c.id}`}
                      className="flex items-center gap-2 p-2.5 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                      <p className="text-xs font-dm text-red-800 truncate">{c.title}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-syne font-bold text-dept-blue mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'All Complaints',  path: '/dept/complaints', icon: <FileText className="w-4 h-4" />    },
                  { label: 'My Profile',      path: '/dept/profile',    icon: <User className="w-4 h-4" />        },
                  ...(user?.isHead ? [{ label: 'Manage Staff', path: '/dept/staff', icon: <Building2 className="w-4 h-4" /> }] : []),
                ].map((action, i) => (
                  <Link
                    key={i}
                    to={action.path}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-dept-bg transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-dept-gray group-hover:text-dept-mid">{action.icon}</span>
                      <span className="text-sm font-dm text-gray-700 group-hover:text-dept-blue">{action.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-dept-mid" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard