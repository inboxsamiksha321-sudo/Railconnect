import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL, STATUS_CONFIG } from '../../constants'
import {
  ArrowLeft, Train, Calendar, MapPin,
  Clock, CheckCircle, TrendingUp, XCircle,
  User, Phone, MessageSquare, AlertCircle
} from 'lucide-react'

const statusConfig = {
  pending:     { ...STATUS_CONFIG.pending,     icon: <Clock className="w-4 h-4" />       },
  in_progress: { ...STATUS_CONFIG.in_progress, icon: <TrendingUp className="w-4 h-4" />  },
  resolved:    { ...STATUS_CONFIG.resolved,    icon: <CheckCircle className="w-4 h-4" /> },
  rejected:    { ...STATUS_CONFIG.rejected,    icon: <XCircle className="w-4 h-4" />     },
}

const ComplaintDetail = () => {
  const { id } = useParams()

  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    const fetchComplaint = async () => {
      setLoading(true)
      try {
        // TODO: Uncomment when backend is ready
        // const res = await axios.get(`${API_BASE_URL}/complaints/${id}`)
        // setComplaint(res.data)

        // TEMP: Remove below when backend is ready
        setComplaint(null)
        setError('Backend not connected yet')

      } catch (err) {
        if (err.response?.status === 404) {
          setError('not_found')
        } else {
          setError('Failed to load complaint details')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchComplaint()
  }, [id])

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-rail-bg py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="animate-pulse flex flex-col gap-3">
                  <div className="flex gap-2">
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="w-3/4 h-6 bg-gray-200 rounded" />
                  <div className="w-full h-4 bg-gray-200 rounded" />
                  <div className="w-2/3 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Not Found State
  if (error === 'not_found' || !complaint) {
    return (
      <div className="min-h-screen bg-rail-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-syne font-bold text-rail-blue text-2xl mb-2">
            Complaint Not Found
          </p>
          <p className="text-rail-gray font-dm text-sm mb-4">
            {error !== 'not_found' ? error : `No complaint found with ID ${id}`}
          </p>
          <Link
            to="/passenger/complaints"
            className="text-rail-mid font-dm text-sm hover:underline"
          >
            ← Back to My Complaints
          </Link>
        </div>
      </div>
    )
  }

  const s = statusConfig[complaint.status]

  return (
    <div className="min-h-screen bg-rail-bg py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Back */}
        <Link
          to="/passenger/complaints"
          className="flex items-center gap-2 text-rail-gray hover:text-rail-blue font-dm text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Complaints
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-rail-gray bg-gray-100 px-2 py-0.5 rounded">
                  #{complaint.id}
                </span>
                <span className="text-xs text-rail-gray bg-gray-100 px-2 py-0.5 rounded">
                  {complaint.category}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  complaint.priority === 'high'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {complaint.priority === 'high' ? '🔴 High' : '🟢 Normal'} Priority
                </span>
              </div>
              <h1 className="font-syne font-bold text-rail-blue text-xl">{complaint.title}</h1>
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${s.bg} ${s.text}`}>
              {s.icon} {s.label}
            </span>
          </div>

          {/* Journey Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-rail-bg rounded-xl">
            {[
              { icon: <Train className="w-3.5 h-3.5" />,         label: 'Train', value: complaint.train                      },
              { icon: <MapPin className="w-3.5 h-3.5" />,        label: 'Route', value: `${complaint.from} → ${complaint.to}` },
              { icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'Coach', value: complaint.coach                      },
              { icon: <Calendar className="w-3.5 h-3.5" />,      label: 'Filed', value: complaint.date                       },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center gap-1 text-rail-gray mb-1">
                  {item.icon}
                  <span className="text-xs">{item.label}</span>
                </div>
                <p className="text-sm font-medium text-rail-blue font-dm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h2 className="font-syne font-bold text-rail-blue mb-3">Description</h2>
          <p className="text-sm text-gray-600 font-dm leading-relaxed">{complaint.description}</p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h2 className="font-syne font-bold text-rail-blue mb-5">Complaint Timeline</h2>
          <div className="flex flex-col">
            {complaint.timeline?.map((step, i) => (
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
                  {i < complaint.timeline.length - 1 && (
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

        {/* Assigned Staff */}
        {complaint.assignedTo && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
            <h2 className="font-syne font-bold text-rail-blue mb-4">Assigned Staff</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rail-light rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-rail-mid" />
              </div>
              <div>
                <p className="font-semibold text-rail-blue font-dm">{complaint.assignedTo.name}</p>
                <p className="text-sm text-rail-gray font-dm">{complaint.assignedTo.role}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Phone className="w-3.5 h-3.5 text-rail-gray" />
                  <span className="text-sm text-rail-gray font-dm">{complaint.assignedTo.phone}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resolution */}
        {complaint.resolution && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-rail-green" />
              <h2 className="font-syne font-bold text-green-800">Resolution</h2>
            </div>
            <p className="text-sm text-green-700 font-dm leading-relaxed">
              {complaint.resolution}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default ComplaintDetail