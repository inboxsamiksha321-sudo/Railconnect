import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Filter, FileText,
  Clock, TrendingUp, CheckCircle, XCircle
} from 'lucide-react'

const complaints = [
  {
    id: 'RC001', title: 'Dirty coach in train 12345',
    category: 'Cleanliness', status: 'pending', priority: 'normal',
    train: '12345', coach: 'S4', date: '06 Mar 2026',
  },
  {
    id: 'RC002', title: 'Rude behaviour by TTE officer',
    category: 'Staff Behaviour', status: 'in_progress', priority: 'high',
    train: '11028', coach: 'B2', date: '05 Mar 2026',
  },
  {
    id: 'RC003', title: 'Food quality issue in pantry car',
    category: 'Food & Catering', status: 'resolved', priority: 'normal',
    train: '12701', coach: 'PC', date: '03 Mar 2026',
  },
  {
    id: 'RC004', title: 'AC not working in coach B4',
    category: 'Electrical Issues', status: 'pending', priority: 'high',
    train: '12952', coach: 'B4', date: '02 Mar 2026',
  },
  {
    id: 'RC005', title: 'No water in washroom',
    category: 'Cleanliness', status: 'resolved', priority: 'normal',
    train: '11301', coach: 'S6', date: '01 Mar 2026',
  },
  {
    id: 'RC006', title: 'Overcrowding in general coach',
    category: 'Safety & Security', status: 'rejected', priority: 'high',
    train: '12123', coach: 'GEN', date: '28 Feb 2026',
  },
  {
    id: 'RC007', title: 'Wrong charge for bedroll',
    category: 'Ticketing', status: 'in_progress', priority: 'normal',
    train: '12301', coach: 'A1', date: '27 Feb 2026',
  },
  {
    id: 'RC008', title: 'Medical emergency not attended',
    category: 'Medical Assistance', status: 'resolved', priority: 'high',
    train: '12625', coach: 'S2', date: '25 Feb 2026',
  },
]

const statusConfig = {
  pending:     { label: 'Pending',     bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-3.5 h-3.5" />        },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100',   text: 'text-blue-800',   icon: <TrendingUp className="w-3.5 h-3.5" />   },
  resolved:    { label: 'Resolved',    bg: 'bg-green-100',  text: 'text-green-800',  icon: <CheckCircle className="w-3.5 h-3.5" />  },
  rejected:    { label: 'Rejected',    bg: 'bg-red-100',    text: 'text-red-800',    icon: <XCircle className="w-3.5 h-3.5" />      },
}

const priorityDot = {
  high:   'bg-red-500',
  normal: 'bg-green-500',
}

const filters = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected']

const MyComplaints = () => {
  const [search, setSearch]       = useState('')
  const [activeFilter, setFilter] = useState('All')

  const filtered = complaints.filter(c => {
    const matchSearch = (
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
    )
    const matchFilter = (
      activeFilter === 'All' ||
      c.status === activeFilter.toLowerCase().replace(' ', '_')
    )
    return matchSearch && matchFilter
  })

  const counts = {
    total:       complaints.length,
    pending:     complaints.filter(c => c.status === 'pending').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved:    complaints.filter(c => c.status === 'resolved').length,
  }

  return (
    <div className="min-h-screen bg-rail-bg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-syne font-bold text-rail-blue text-2xl mb-1">My Complaints</h1>
          <p className="text-rail-gray text-sm font-dm">Track and manage all your filed complaints</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total',       value: counts.total,       bg: 'bg-blue-50',   text: 'text-rail-blue'   },
            { label: 'Pending',     value: counts.pending,     bg: 'bg-yellow-50', text: 'text-yellow-700'  },
            { label: 'In Progress', value: counts.in_progress, bg: 'bg-blue-50',   text: 'text-blue-700'    },
            { label: 'Resolved',    value: counts.resolved,    bg: 'bg-green-50',  text: 'text-green-700'   },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-xl p-4 text-center`}>
              <p className={`font-syne font-bold text-2xl ${s.text}`}>{s.value}</p>
              <p className="text-xs text-rail-gray font-dm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-gray" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, title or category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-rail-mid transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-dm font-medium transition-all ${
                  activeFilter === f
                    ? 'bg-rail-blue text-white'
                    : 'bg-gray-100 text-rail-gray hover:bg-rail-light'
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
              <p className="text-sm text-rail-gray font-dm mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            filtered.map(c => {
              const s = statusConfig[c.status]
              return (
                <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-rail-gray bg-gray-100 px-2 py-0.5 rounded">
                          #{c.id}
                        </span>
                        <span className="text-xs text-rail-gray bg-gray-100 px-2 py-0.5 rounded">
                          {c.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${priorityDot[c.priority]}`} />
                          <span className="text-xs text-rail-gray font-dm capitalize">{c.priority}</span>
                        </div>
                      </div>
                      <h3 className="font-syne font-bold text-rail-blue mb-2">{c.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-rail-gray font-dm">
                        <span>🚂 {c.train}</span>
                        <span>💺 {c.coach}</span>
                        <span>📅 {c.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
                        {s.icon} {s.label}
                      </span>
                      <Link
                        to={`/passenger/complaints/${c.id}`}
                        className="text-xs text-rail-mid font-dm hover:text-rail-blue transition-colors"
                      >
                        View Details →
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

export default MyComplaints