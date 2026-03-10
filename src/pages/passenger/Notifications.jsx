import { useState } from 'react'
import {
  Bell, CheckCircle, Clock, XCircle,
  TrendingUp, Info, Trash2, CheckCheck
} from 'lucide-react'

const initialNotifications = [
  {
    id: 1, type: 'resolved', read: false,
    title: 'Complaint RC003 Resolved!',
    message: 'Your complaint about food quality in pantry car has been resolved by the catering department.',
    time: '2 hours ago',
  },
  {
    id: 2, type: 'update', read: false,
    title: 'Staff Assigned to RC002',
    message: 'Ramesh Kumar (Senior Inspector) has been assigned to your complaint about TTE behaviour.',
    time: '5 hours ago',
  },
  {
    id: 3, type: 'pending', read: true,
    title: 'Complaint RC001 Under Review',
    message: 'Your complaint about dirty coach in train 12345 is currently under review by our team.',
    time: '1 day ago',
  },
  {
    id: 4, type: 'rejected', read: true,
    title: 'Complaint RC006 Rejected',
    message: 'Your complaint about overcrowding has been rejected. Reason: Insufficient evidence provided.',
    time: '2 days ago',
  },
  {
    id: 5, type: 'info', read: true,
    title: 'Welcome to RailConnect!',
    message: 'Thank you for registering. You can now file complaints and track their status in real time.',
    time: '5 days ago',
  },
  {
    id: 6, type: 'update', read: false,
    title: 'Complaint RC004 Acknowledged',
    message: 'Your complaint about AC not working in coach B4 has been acknowledged and is being processed.',
    time: '3 days ago',
  },
  {
    id: 7, type: 'resolved', read: true,
    title: 'Complaint RC005 Resolved!',
    message: 'Your complaint about no water in washroom has been resolved. The issue has been fixed.',
    time: '4 days ago',
  },
]

const typeConfig = {
  update:   { icon: <TrendingUp className="w-4 h-4" />,  bg: 'bg-blue-100',   text: 'text-blue-600',   dot: 'bg-blue-500'   },
  resolved: { icon: <CheckCircle className="w-4 h-4" />, bg: 'bg-green-100',  text: 'text-green-600',  dot: 'bg-green-500'  },
  pending:  { icon: <Clock className="w-4 h-4" />,       bg: 'bg-yellow-100', text: 'text-yellow-600', dot: 'bg-yellow-500' },
  rejected: { icon: <XCircle className="w-4 h-4" />,     bg: 'bg-red-100',    text: 'text-red-600',    dot: 'bg-red-500'    },
  info:     { icon: <Info className="w-4 h-4" />,         bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400'   },
}

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter]               = useState('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'read')   return n.read
    return true
  })

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-rail-bg py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-syne font-bold text-rail-blue text-2xl mb-1">Notifications</h1>
            <p className="text-rail-gray text-sm font-dm">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-sm text-rail-mid font-dm hover:text-rail-blue transition-colors"
            >
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { key: 'all',    label: `All (${notifications.length})`  },
            { key: 'unread', label: `Unread (${unreadCount})`         },
            { key: 'read',   label: 'Read'                            },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-dm font-medium transition-all ${
                filter === f.key
                  ? 'bg-rail-blue text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-rail-gray hover:border-rail-mid'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="font-syne font-bold text-gray-400">No notifications</p>
            </div>
          ) : (
            filtered.map(n => {
              const t = typeConfig[n.type]
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer transition-all hover:shadow-md ${
                    !n.read ? 'border-blue-100' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${t.bg}`}>
                      <span className={t.text}>{t.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {!n.read && (
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.dot}`} />
                          )}
                          <h3 className={`text-sm font-semibold font-dm ${
                            !n.read ? 'text-rail-blue' : 'text-gray-700'
                          }`}>
                            {n.title}
                          </h3>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); deleteNotification(n.id) }}
                          className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-rail-gray font-dm mt-1 leading-relaxed">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-300 font-dm mt-2">{n.time}</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

      </div>
    </div>
  )
}

export default Notifications