import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL, STATUS_CONFIG } from '../../constants'
import {
  Search, FileText,
  Clock, TrendingUp, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'

const statusConfig = {
  pending:     { ...STATUS_CONFIG.pending,     icon: <Clock className="w-3.5 h-3.5" />       },
  in_progress: { ...STATUS_CONFIG.in_progress, icon: <TrendingUp className="w-3.5 h-3.5" />  },
  resolved:    { ...STATUS_CONFIG.resolved,    icon: <CheckCircle className="w-3.5 h-3.5" /> },
  rejected:    { ...STATUS_CONFIG.rejected,    icon: <XCircle className="w-3.5 h-3.5" />     },
}

const priorityDot = {
  high:   'bg-red-500',
  normal: 'bg-green-500',
}

const filters = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected']

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [search, setSearch]         = useState('')
  const [activeFilter, setFilter]   = useState('All')

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true)
      try {
        // TODO: Uncomment when backend is ready
        // const res = await axios.get(`${API_BASE_URL}/complaints/my`)
        // setComplaints(res.data)

        // TEMP: Remove below when backend is ready
        setComplaints([])

      } catch (err) {
        setError('Failed to load complaints')
      } finally {
        setLoading(false)
      }
    }
    fetchComplaints()
  }, [])

  const filtered = complaints.filter(c => {
    const matchSearch = (
      c.id?.toLowerCase().includes(search.toLowerCase()) ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase())
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
            { label: 'Total',       value: counts.total,       bg: 'bg-blue-50',   text: 'text-rail-blue'  },
            { label: 'Pending',     value: counts.pending,     bg: 'bg-yellow-50', text: 'text-yellow-700' },
            { label: 'In Progress', value: counts.in_progress, bg: 'bg-blue-50',   text: 'text-blue-700'   },
            { label: 'Resolved',    value: counts.resolved,    bg: 'bg-green-50',  text: 'text-green-700'  },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-xl p-4 text-center`}>
              {loading
                ? <div className="w-8 h-6 bg-gray-200 rounded animate-pulse mx-auto" />
                : <p className={`font-syne font-bold text-2xl ${s.text}`}>{s.value}</p>
              }
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

          {/* Loading State */}
          {loading && (
            [1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="animate-pulse flex flex-col gap-3">
                  <div className="flex gap-2">
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="w-3/4 h-5 bg-gray-200 rounded" />
                  <div className="w-1/2 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            ))
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
              <p className="font-syne font-bold text-gray-400">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filtered.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="font-syne font-bold text-gray-400">
                {complaints.length === 0 ? 'No complaints filed yet' : 'No complaints found'}
              </p>
              <p className="text-sm text-rail-gray font-dm mt-1">
                {complaints.length === 0
                  ? <Link to="/passenger/complaints/new" className="text-rail-mid hover:underline">File your first complaint →</Link>
                  : 'Try adjusting your search or filter'
                }
              </p>
            </div>
          )}

          {/* Complaints */}
          {!loading && !error && filtered.map(c => {
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
          })}

        </div>
      </div>
    </div>
  )
}

export default MyComplaints