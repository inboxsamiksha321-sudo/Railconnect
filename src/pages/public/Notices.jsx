import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../../constants'
import { Bell, Calendar, ChevronDown, ChevronUp, Info, AlertCircle, CheckCircle } from 'lucide-react'

const typeConfig = {
  important: { icon: <AlertCircle className="w-4 h-4" />, bg: 'bg-orange-100', text: 'text-orange-700', label: 'Important', dot: 'bg-orange-500' },
  info:      { icon: <Info className="w-4 h-4" />,        bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Info',      dot: 'bg-blue-500'   },
  success:   { icon: <CheckCircle className="w-4 h-4" />, bg: 'bg-green-100',  text: 'text-green-700',  label: 'Update',    dot: 'bg-green-500'  },
}

const Notices = () => {
  const [notices, setNotices]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter]     = useState('all')

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true)
      try {
        // TODO: Uncomment when backend is ready
        // const res = await axios.get(`${API_BASE_URL}/notices`)
        // setNotices(res.data)

        // TEMP: Remove below when backend is ready
        setNotices([])

      } catch (err) {
        setError('Failed to load notices')
      } finally {
        setLoading(false)
      }
    }
    fetchNotices()
  }, [])

  const filtered = notices.filter(n => filter === 'all' || n.type === filter)

  return (
    <div className="min-h-screen bg-rail-bg py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rail-blue rounded-2xl mb-4">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-syne font-bold text-rail-blue text-3xl mb-2">
            Public Notices
          </h1>
          <p className="text-rail-gray font-dm text-sm">
            Latest announcements and updates from Indian Railways
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: 'all',       label: 'All Notices' },
            { key: 'important', label: 'Important'   },
            { key: 'info',      label: 'Info'        },
            { key: 'success',   label: 'Updates'     },
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

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="animate-pulse flex gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div className="w-16 h-4 bg-gray-200 rounded-full" />
                      <div className="w-24 h-4 bg-gray-200 rounded-full" />
                    </div>
                    <div className="w-3/4 h-5 bg-gray-200 rounded" />
                    <div className="w-1/4 h-3 bg-gray-200 rounded" />
                    <div className="w-full h-3 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="font-syne font-bold text-gray-400">No notices available</p>
            <p className="text-sm text-rail-gray font-dm mt-1">
              {filter !== 'all' ? 'Try switching to All Notices' : 'Check back later for updates'}
            </p>
          </div>
        )}

        {/* Notices List */}
        {!loading && !error && (
          <div className="flex flex-col gap-4">
            {filtered.map(notice => {
              const t = typeConfig[notice.type] || typeConfig.info
              const isOpen = expanded === notice.id
              return (
                <div
                  key={notice.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : notice.id)}
                    className="w-full p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-xl flex-shrink-0 ${t.bg}`}>
                          <span className={t.text}>{t.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${t.bg} ${t.text}`}>
                              {t.label}
                            </span>
                            <span className="text-xs text-rail-gray font-dm flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {notice.date}
                            </span>
                          </div>
                          <h3 className="font-syne font-bold text-rail-blue text-base mb-1">
                            {notice.title}
                          </h3>
                          <p className="text-xs text-rail-gray font-dm">
                            {notice.department}
                          </p>
                          {!isOpen && (
                            <p className="text-sm text-gray-500 font-dm mt-2 leading-relaxed">
                              {notice.summary}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-rail-gray">
                        {isOpen
                          ? <ChevronUp className="w-5 h-5" />
                          : <ChevronDown className="w-5 h-5" />
                        }
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <p className="text-sm text-gray-600 font-dm leading-relaxed pt-4">
                        {notice.content}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-rail-gray font-dm">
                          Published by {notice.department}
                        </span>
                        <span className="text-xs text-rail-gray font-dm flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {notice.date}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

export default Notices