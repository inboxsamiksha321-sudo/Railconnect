import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Search, FileText,
  Clock, TrendingUp, CheckCircle, XCircle
} from 'lucide-react'

const allComplaints = [
  { id: 'RC001', title: 'Dirty coach in train 12345',       category: 'Cleanliness',      status: 'pending',     priority: 'normal', date: '06 Mar 2026', train: '12345', coach: 'S4',  passenger: 'Raj Patel'    },
  { id: 'RC002', title: 'Rude behaviour by TTE officer',    category: 'Staff',            status: 'in_progress', priority: 'high',   date: '05 Mar 2026', train: '11028', coach: 'B2',  passenger: 'Amit Shah'     },
  { id: 'RC003', title: 'Stale food served in pantry car',  category: 'Catering',         status: 'resolved',    priority: 'normal', date: '03 Mar 2026', train: '12701', coach: 'PC',  passenger: 'Priya Mehta'   },
  { id: 'RC004', title: 'AC not working in coach B4',       category: 'Electrical',       status: 'pending',     priority: 'high',   date: '02 Mar 2026', train: '12952', coach: 'B4',  passenger: 'Suresh Kumar'  },
  { id: 'RC005', title: 'Broken seat in coach S6',          category: 'Infrastructure',   status: 'resolved',    priority: 'normal', date: '01 Mar 2026', train: '11301', coach: 'S6',  passenger: 'Anita Roy'     },
  { id: 'RC006', title: 'Harassment by co-passenger',       category: 'Safety & Security',status: 'rejected',    priority: 'high',   date: '28 Feb 2026', train: '12123', coach: 'GEN', passenger: 'Vikram Singh'  },
  { id: 'RC007', title: 'Passenger fell ill on train',      category: 'Medical',          status: 'in_progress', priority: 'high',   date: '27 Feb 2026', train: '12301', coach: 'A1',  passenger: 'Neha Sharma'   },
  { id: 'RC008', title: 'Train delayed by 3 hours',         category: 'General',          status: 'resolved',    priority: 'normal', date: '25 Feb 2026', train: '12625', coach: 'S2',  passenger: 'Rahul Verma'   },
]

const deptMap = {
  'Cleanliness':      ['Cleanliness'],
  'Electrical':       ['Electrical'],
  'Infrastructure':   ['Infrastructure'],
  'Safety & Security':['Safety & Security'],
  'Staff':            ['Staff'],
  'Catering':         ['Catering'],
  'Medical':          ['Medical'],
  'General':          ['General'],
  'All Departments':  ['Cleanliness', 'Electrical', 'Infrastructure', 'Safety & Security', 'Staff', 'Catering', 'Medical', 'General'],
}

const statusConfig = {
  pending:     { label: 'Pending',     bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-3.5 h-3.5" />       },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100',   text: 'text-blue-800',   icon: <TrendingUp className="w-3.5 h-3.5" />  },
  resolved:    { label: 'Resolved',    bg: 'bg-green-100',  text: 'text-green-800',  icon: <CheckCircle className="w-3.5 h-3.5" /> },
  rejected:    { label: 'Rejected',    bg: 'bg-red-100',    text: 'text-red-800',    icon: <XCircle className="w-3.5 h-3.5" />     },
}

const filters = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected']

const Complaints = () => {
  const { user } = useAuth()
  const [search, setSearch]       = useState('')
  const [activeFilter, setFilter] = useState('All')

  const myCategories  = deptMap[user?.department] || []
  const myComplaints  = user?.isHead
    ? allComplaints
    : allComplaints.filter(c => myCategories.includes(c.category))

  const filtered = myComplaints.filter(c => {
    const matchSearch = (
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.passenger.toLowerCase().includes(search.toLowerCase())
    )
    const matchFilter = (
      activeFilter === 'All' ||
      c.status === activeFilter.toLowerCase().replace(' ', '_')
    )
    return matchSearch && matchFilter
  })

  const counts = {
    total:       myComplaints.length,
    pending:     myComplaints.filter(c => c.status === 'pending').length,
    in_progress: myComplaints.filter(c => c.status === 'in_progress').length,
    resolved:    myComplaints.filter(c => c.status === 'resolved').length,
  }

  return (
    <div className="min-h-screen bg-dept-bg py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-syne font-bold text-dept-blue text-2xl mb-1">
            {user?.isHead ? 'All Complaints' : `${user?.department} Complaints`}
          </h1>
          <p className="text-dept-gray text-sm font-dm">
            Manage and resolve complaints assigned to your department
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total',       value: counts.total,       bg: 'bg-blue-50',   text: 'text-dept-blue'  },
            { label: 'Pending',     value: counts.pending,     bg: 'bg-yellow-50', text: 'text-yellow-700' },
            { label: 'In Progress', value: counts.in_progress, bg: 'bg-blue-50',   text: 'text-blue-700'   },
            { label: 'Resolved',    value: counts.resolved,    bg: 'bg-green-50',  text: 'text-green-700'  },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-xl p-4 text-center`}>
              <p className={`font-syne font-bold text-2xl ${s.text}`}>{s.value}</p>
              <p className="text-xs text-dept-gray font-dm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dept-gray" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, title, category or passenger..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-dept-mid transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-dm font-medium transition-all ${
                  activeFilter === f
                    ? 'bg-dept-blue text-white'
                    : 'bg-gray-100 text-dept-gray hover:bg-dept-light'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints List */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="font-syne font-bold text-gray-400">No complaints found</p>
            </div>
          ) : (
            filtered.map(c => {
              const s = statusConfig[c.status]
              return (
                <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-dept-gray bg-gray-100 px-2 py-0.5 rounded">
                          #{c.id}
                        </span>
                        <span className="text-xs text-dept-gray bg-gray-100 px-2 py-0.5 rounded">
                          {c.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${c.priority === 'high' ? 'bg-red-500' : 'bg-green-500'}`} />
                          <span className="text-xs text-dept-gray font-dm capitalize">{c.priority}</span>
                        </div>
                      </div>
                      <h3 className="font-syne font-bold text-dept-blue mb-2">{c.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-dept-gray font-dm flex-wrap">
                        <span>🚂 {c.train}</span>
                        <span>💺 {c.coach}</span>
                        <span>👤 {c.passenger}</span>
                        <span>📅 {c.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                        {s.icon} {s.label}
                      </span>
                      <Link
                        to={`/dept/complaints/${c.id}`}
                        className="text-xs text-dept-mid font-dm hover:text-dept-blue transition-colors"
                      >
                        View & Update →
                      </Link>
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

export default Complaints