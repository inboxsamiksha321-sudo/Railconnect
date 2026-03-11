import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../../constants'
import {
  Search, Train, Calendar, MapPin,
  Clock, CheckCircle, TrendingUp, XCircle,
  AlertCircle, FileText
} from 'lucide-react'

const statusConfig = {
  pending:     { label: 'Pending',     bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-4 h-4" />,       bar: 'w-1/4',  barColor: 'bg-yellow-400', percent: '25%'  },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100',   text: 'text-blue-800',   icon: <TrendingUp className="w-4 h-4" />,  bar: 'w-2/3',  barColor: 'bg-rail-mid',   percent: '65%'  },
  resolved:    { label: 'Resolved',    bg: 'bg-green-100',  text: 'text-green-800',  icon: <CheckCircle className="w-4 h-4" />, bar: 'w-full', barColor: 'bg-rail-green', percent: '100%' },
  rejected:    { label: 'Rejected',    bg: 'bg-red-100',    text: 'text-red-800',    icon: <XCircle className="w-4 h-4" />,     bar: 'w-full', barColor: 'bg-red-400',    percent: '0%'   },
}

const TrackComplaint = () => {
  const [query, setQuery]       = useState('')
  const [result, setResult]     = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setNotFound(false)
    setResult(null)
    setError(null)
    try {
      // TODO: Uncomment when backend is ready
      // const res = await axios.get(`${API_BASE_URL}/complaints/track/${query.toUpperCase().trim()}`)
      // setResult(res.data)

      // TEMP: Remove below when backend is ready
      setNotFound(true)

    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="min-h-screen bg-rail-bg py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rail-blue rounded-2xl mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-syne font-bold text-rail-blue text-3xl mb-2">
            Track Your Complaint
          </h1>
          <p className="text-rail-gray font-dm text-sm">
            Enter your complaint ID to check the current status
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Complaint ID
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rail-gray" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. RC001, RC002..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-dm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-rail-mid transition-all uppercase"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2 bg-rail-blue hover:bg-rail-mid text-white font-dm font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Search className="w-4 h-4" />
              }
              Track
            </button>
          </div>
          <p className="text-xs text-rail-gray font-dm mt-2">
            💡 Enter your complaint ID received after filing
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
            <p className="font-syne font-bold text-gray-700 text-lg mb-1">
              Something went wrong
            </p>
            <p className="text-sm text-rail-gray font-dm">{error}</p>
          </div>
        )}

        {/* Not Found */}
        {notFound && (
          <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-3" />
            <p className="font-syne font-bold text-gray-700 text-lg mb-1">
              Complaint Not Found
            </p>
            <p className="text-sm text-rail-gray font-dm">
              No complaint found with ID{' '}
              <span className="font-bold text-red-500">"{query}"</span>.
              Please check the ID and try again.
            </p>
          </div>
        )}

        {/* Result */}
        {result && (() => {
          const s = statusConfig[result.status] || statusConfig.pending
          return (
            <div className="flex flex-col gap-4">

              {/* Status Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-rail-gray bg-gray-100 px-2 py-0.5 rounded">
                        #{result.id}
                      </span>
                      <span className="text-xs text-rail-gray bg-gray-100 px-2 py-0.5 rounded">
                        {result.category}
                      </span>
                    </div>
                    <h2 className="font-syne font-bold text-rail-blue text-lg">
                      {result.title}
                    </h2>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${s.bg} ${s.text}`}>
                    {s.icon} {s.label}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-rail-gray font-dm">Resolution Progress</span>
                    <span className="text-xs font-semibold text-rail-blue font-dm">{s.percent}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${s.bar} ${s.barColor}`} />
                  </div>
                </div>

                {/* Journey Details */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-rail-bg rounded-xl">
                  <div>
                    <div className="flex items-center gap-1 text-rail-gray mb-1">
                      <Train className="w-3.5 h-3.5" />
                      <span className="text-xs">Train</span>
                    </div>
                    <p className="text-sm font-medium text-rail-blue font-dm">{result.train}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-rail-gray mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-xs">Route</span>
                    </div>
                    <p className="text-sm font-medium text-rail-blue font-dm">
                      {result.from} → {result.to}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-rail-gray mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs">Filed On</span>
                    </div>
                    <p className="text-sm font-medium text-rail-blue font-dm">{result.date}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-syne font-bold text-rail-blue mb-5">
                  Complaint Timeline
                </h3>
                <div className="flex flex-col">
                  {result.timeline?.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.done ? 'bg-rail-green text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {step.done
                            ? <CheckCircle className="w-4 h-4" />
                            : <Clock className="w-4 h-4" />
                          }
                        </div>
                        {i < result.timeline.length - 1 && (
                          <div className={`w-0.5 h-8 ${step.done ? 'bg-rail-green' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm font-semibold font-dm ${step.done ? 'text-rail-blue' : 'text-gray-400'}`}>
                          {step.status}
                        </p>
                        <p className={`text-xs mt-0.5 font-dm ${step.done ? 'text-rail-gray' : 'text-gray-300'}`}>
                          {step.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )
        })()}

      </div>
    </div>
  )
}

export default TrackComplaint