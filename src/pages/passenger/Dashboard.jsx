import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  PlusCircle, FileText, Bell, Search,
  TrendingUp, CheckCircle, Clock, AlertCircle,
  ChevronRight, Sparkles, Megaphone
} from 'lucide-react'

const recentComplaints = [
  { id: 'RC001', title: 'Dirty coach in train 12345',       category: 'Cleanliness',    status: 'pending',     date: '06 Mar 2026' },
  { id: 'RC002', title: 'Rude behaviour by TTE officer',    category: 'Staff Behaviour', status: 'in_progress', date: '05 Mar 2026' },
  { id: 'RC003', title: 'Food quality issue in pantry car', category: 'Food & Catering', status: 'resolved',    date: '03 Mar 2026' },
]

const statusConfig = {
  pending:     { label: 'Pending',     bg: 'bg-yellow-100', text: 'text-yellow-800' },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100',   text: 'text-blue-800'  },
  resolved:    { label: 'Resolved',    bg: 'bg-green-100',  text: 'text-green-800' },
  rejected:    { label: 'Rejected',    bg: 'bg-red-100',    text: 'text-red-800'   },
}

const Dashboard = () => {
  const { user } = useAuth()

  const stats = [
    { label: 'Total Filed',  value: '8', icon: <FileText className="w-5 h-5" />,    color: 'blue'   },
    { label: 'Pending',      value: '3', icon: <Clock className="w-5 h-5" />,        color: 'yellow' },
    { label: 'In Progress',  value: '2', icon: <TrendingUp className="w-5 h-5" />,   color: 'orange' },
    { label: 'Resolved',     value: '3', icon: <CheckCircle className="w-5 h-5" />,  color: 'green'  },
  ]

  const colorMap = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-rail-mid',    border: 'border-blue-100'   },
    yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600',  border: 'border-yellow-100' },
    orange: { bg: 'bg-orange-50', icon: 'text-rail-accent', border: 'border-orange-100' },
    green:  { bg: 'bg-green-50',  icon: 'text-rail-green',  border: 'border-green-100'  },
  }

  return (
    <div className="min-h-screen bg-rail-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Welcome Banner */}
        <div className="bg-rail-blue rounded-2xl p-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-blue-200 font-dm text-sm mb-1">Welcome back 👋</p>
            <h1 className="font-syne font-bold text-white text-2xl">
              {user?.name || 'Passenger'}
            </h1>
            <p className="text-blue-200 font-dm text-sm mt-1">
              Passenger · RailConnect Portal
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <span className="font-syne font-bold text-white text-2xl">
                {(user?.name || 'P').charAt(0).toUpperCase()}
              </span>
            </div>
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
                  <p className="text-xs text-rail-gray font-dm">{stat.label}</p>
                  <p className="text-2xl font-syne font-bold text-rail-blue mt-0.5">{stat.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="flex flex-col gap-4">

            {/* File Complaint Button */}
            <Link
              to="/passenger/complaints/new"
              className="bg-rail-accent hover:bg-orange-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all shadow-sm group"
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-8 h-8 text-white" />
              </div>
              <p className="font-syne font-bold text-white text-lg">File New Complaint</p>
              <p className="text-orange-100 text-xs font-dm mt-1">
                AI-powered smart routing
              </p>
            </Link>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-syne font-bold text-rail-blue mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                {[
                  { icon: <FileText className="w-4 h-4" />,    label: 'View My Complaints', path: '/passenger/complaints'     },
                  { icon: <Bell className="w-4 h-4" />,        label: 'Notifications',      path: '/passenger/notifications'  },
                  { icon: <Search className="w-4 h-4" />,      label: 'Track Complaint',    path: '/track'                    },
                  { icon: <Megaphone className="w-4 h-4" />,   label: 'Public Notices',     path: '/notices'                  },
                  { icon: <AlertCircle className="w-4 h-4" />, label: 'My Profile',         path: '/passenger/profile'        },
                ].map((action, i) => (
                  <Link
                    key={i}
                    to={action.path}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-rail-bg transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-rail-gray group-hover:text-rail-mid transition-colors">
                        {action.icon}
                      </span>
                      <span className="text-sm font-dm text-gray-700 group-hover:text-rail-blue transition-colors">
                        {action.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-rail-mid transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Recent Complaints */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-syne font-bold text-rail-blue">Recent Complaints</h3>
                <Link
                  to="/passenger/complaints"
                  className="text-xs text-rail-mid font-dm hover:text-rail-blue transition-colors"
                >
                  View All →
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {recentComplaints.map((c, i) => {
                  const s = statusConfig[c.status]
                  return (
                    <Link
                      key={i}
                      to={`/passenger/complaints/${c.id}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-rail-bg transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-rail-gray">#{c.id}</span>
                          <span className="text-xs text-rail-gray">{c.category}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700 truncate">{c.title}</p>
                        <p className="text-xs text-rail-gray font-dm mt-0.5">{c.date}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ml-3 flex-shrink-0 ${s.bg} ${s.text}`}>
                        {s.label}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* AI Info Card */}
            <div className="bg-gradient-to-r from-rail-blue to-rail-mid rounded-2xl p-5 text-white">
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-syne font-bold text-white mb-1">AI-Powered Routing</h3>
                  <p className="text-blue-100 text-sm font-dm leading-relaxed">
                    Your complaints are automatically routed to the right department
                    using our trained AI model for faster resolution.
                  </p>
                </div>
              </div>
            </div>

            {/* Update Card */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-rail-green flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-syne font-bold text-green-800 mb-1">
                    Complaint RC003 Resolved!
                  </h3>
                  <p className="text-green-700 text-sm font-dm">
                    Your complaint about food quality has been resolved by the catering department.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard