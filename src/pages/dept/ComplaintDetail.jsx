import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Train, Calendar, MapPin,
  Clock, CheckCircle, TrendingUp, XCircle,
  User, Phone, MessageSquare, Save
} from 'lucide-react'
import toast from 'react-hot-toast'

const statusConfig = {
  pending:     { label: 'Pending',     bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-4 h-4" />       },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100',   text: 'text-blue-800',   icon: <TrendingUp className="w-4 h-4" />  },
  resolved:    { label: 'Resolved',    bg: 'bg-green-100',  text: 'text-green-800',  icon: <CheckCircle className="w-4 h-4" /> },
  rejected:    { label: 'Rejected',    bg: 'bg-red-100',    text: 'text-red-800',    icon: <XCircle className="w-4 h-4" />     },
}

const ComplaintDetail = () => {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)

  const [status, setStatus] = useState('pending')
  const [remarks, setRemarks] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchComplaint = async () => {
      try {
        const token = localStorage.getItem(
          "railconnect_officer_token"
        )
        const res = await axios.get(
          `http://127.0.0.1:8000/officer-complaint/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        const data = res.data

        const formattedComplaint = {
          id: data.complaint_id,
          title: data.complaint_text,
          category: data.department || "Department",
          status: data.status.toLowerCase().replace(" ", "_"),
          priority: data.priority.toLowerCase(),
          date: new Date(
            data.created_at
          ).toLocaleDateString(),
          train: data.train_no,
          from: data.source_station,
          to: data.destination_station,
          coach: "N/A",
          passenger: data.passenger_email,
          passengerPhone: "N/A",
          description: data.complaint_text,
          media: data.media,
          timeline: [
            {
              status: "Complaint Filed",
              date: new Date(
                data.created_at
              ).toLocaleString(),
              done: true
            },
            {
              status: data.status,
              date: "",
              done: data.status !== "Pending"
            }
          ]
        }

        setComplaint(
          formattedComplaint
        )

        setStatus(
          formattedComplaint.status
        )
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchComplaint()
  }, [id])

  if (!complaint) {
    return (
      <div className="min-h-screen bg-dept-bg flex items-center justify-center">
        <div className="text-center">
          <p className="font-syne font-bold text-dept-blue text-2xl mb-2">Complaint Not Found</p>
          <Link to="/dept/complaints" className="text-dept-mid font-dm text-sm hover:underline">
            ← Back to Complaints
          </Link>
        </div>
      </div>
    )
  }

  const s = statusConfig[status]

  const handleSave = async () => {
    if (!remarks.trim()) {
      toast.error('Please add remarks before updating!')
      return
    }
    setSaving(true)
    try {
      const token = localStorage.getItem(
        "railconnect_officer_token"
      )
      const formData = new FormData()
      formData.append("status", status)
      formData.append("remarks", remarks)
      await axios.put(
        `http://127.0.0.1:8000/update-complaint-status/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      toast.success(
        `Complaint updated to ${s.label}`
      )
      setComplaint({
        ...complaint,
        status: status
      })
      setRemarks('')
    } catch (err) {
      console.log(err)
      toast.error(
        'Failed to update complaint'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-dept-bg py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Back */}
        <Link
          to="/dept/complaints"
          className="flex items-center gap-2 text-dept-gray hover:text-dept-blue font-dm text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Complaints
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-dept-gray bg-gray-100 px-2 py-0.5 rounded">
                  #{complaint.id}
                </span>
                <span className="text-xs text-dept-gray bg-gray-100 px-2 py-0.5 rounded">
                  {complaint.category}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  complaint.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {complaint.priority === 'high' ? '🔴 High' : '🟢 Normal'} Priority
                </span>
              </div>
              <h1 className="font-syne font-bold text-dept-blue text-xl">{complaint.title}</h1>
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0 ${s.bg} ${s.text}`}>
              {s.icon} {s.label}
            </span>
          </div>

          {/* Journey Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-dept-bg rounded-xl">
            {[
              { icon: <Train className="w-3.5 h-3.5" />,       label: 'Train', value: complaint.train },
              { icon: <MapPin className="w-3.5 h-3.5" />,      label: 'Route', value: `${complaint.from} → ${complaint.to}` },
              { icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'Coach', value: complaint.coach },
              { icon: <Calendar className="w-3.5 h-3.5" />,    label: 'Filed', value: complaint.date  },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center gap-1 text-dept-gray mb-1">
                  {item.icon}
                  <span className="text-xs">{item.label}</span>
                </div>
                <p className="text-sm font-medium text-dept-blue font-dm">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Passenger Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h2 className="font-syne font-bold text-dept-blue mb-4">Passenger Details</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-dept-light rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-dept-mid" />
            </div>
            <div>
              <p className="font-semibold text-dept-blue font-dm">{complaint.passenger}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h2 className="font-syne font-bold text-dept-blue mb-3">Complaint Description</h2>
          <p className="text-sm text-gray-600 font-dm leading-relaxed">{complaint.description}</p>
        </div>

        {/* Media */}
        {complaint.media?.length > 0 && (

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">

            <h2 className="font-syne font-bold text-dept-blue mb-4">
              Attached Media
            </h2>

            <div className="space-y-4">

              {complaint.media.map((m, index) => (

                <div key={index}>

                  {/* IMAGE */}
                  {m.media_type === "image" && (
                    <img
                      src={m.media_url}
                      alt="Complaint Media"
                      className="w-full max-h-[500px] object-contain rounded-xl border"
                    />
                  )}

                  {/* VIDEO */}
                  {m.media_type === "video" && (
                    <video
                      controls
                      className="w-full rounded-xl border"
                    >
                      <source src={m.media_url} />
                    </video>
                  )}

                  {/* AUDIO */}
                  {m.media_type === "audio" && (
                    <audio
                      controls
                      className="w-full"
                    >
                      <source src={m.media_url} />
                    </audio>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h2 className="font-syne font-bold text-dept-blue mb-5">Timeline</h2>
          <div className="flex flex-col">
            {complaint.timeline.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.done ? 'bg-dept-green text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.done ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  {i < complaint.timeline.length - 1 && (
                    <div className={`w-0.5 h-8 ${step.done ? 'bg-dept-green' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="pb-6">
                  <p className={`text-sm font-semibold font-dm ${step.done ? 'text-dept-blue' : 'text-gray-400'}`}>
                    {step.status}
                  </p>
                  <p className={`text-xs mt-0.5 font-dm ${step.done ? 'text-dept-gray' : 'text-gray-300'}`}>
                    {step.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Update Status — KEY FEATURE */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6">
          <h2 className="font-syne font-bold text-dept-blue mb-5">
            Update Complaint Status
          </h2>

          {/* Status Selector */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Change Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(statusConfig).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setStatus(key)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-dm font-semibold border-2 transition-all ${
                    status === key
                      ? `${val.bg} ${val.text} border-current`
                      : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {val.icon} {val.label}
                </button>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Remarks / Action Taken
            </label>
            <textarea
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="Describe the action taken or reason for status change..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-dept-mid transition-all resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-dept-blue hover:bg-dept-mid text-white font-dm font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50"
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save className="w-4 h-4" />
            }
            {saving ? 'Updating...' : 'Update Complaint Status'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ComplaintDetail