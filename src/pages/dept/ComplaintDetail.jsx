import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Train, Calendar, MapPin,
  Clock, CheckCircle, TrendingUp, XCircle,
  User, Phone, MessageSquare, Save
} from 'lucide-react'
import toast from 'react-hot-toast'

const complaints = {
  'RC001': {
    id: 'RC001', title: 'Dirty coach in train 12345',
    category: 'Cleanliness', status: 'pending', priority: 'normal',
    date: '06 Mar 2026', train: '12345', from: 'Pune', to: 'Mumbai',
    coach: 'S4', pnr: '1234567890',
    passenger: 'Raj Patel', passengerPhone: '9307794727',
    description: 'The coach S4 in train 12345 was extremely dirty. The floor was covered with garbage and the washrooms were unusable. There was no cleaning done since the start of the journey.',
    timeline: [
      { status: 'Complaint Filed',   date: '06 Mar 2026 10:32 AM', done: true  },
      { status: 'Under Review',      date: '06 Mar 2026 11:00 AM', done: true  },
      { status: 'Assigned to Staff', date: 'Pending',              done: false },
      { status: 'Resolved',          date: 'Pending',              done: false },
    ],
  },
  'RC002': {
    id: 'RC002', title: 'Rude behaviour by TTE officer',
    category: 'Staff Behaviour', status: 'in_progress', priority: 'high',
    date: '05 Mar 2026', train: '11028', from: 'Delhi', to: 'Trivandrum',
    coach: 'B2', pnr: '9876543210',
    passenger: 'Amit Shah', passengerPhone: '9876543210',
    description: 'The TTE officer was extremely rude and used inappropriate language when asked about berth allotment. He refused to show his ID card and threatened passengers.',
    timeline: [
      { status: 'Complaint Filed',   date: '05 Mar 2026 09:15 AM', done: true },
      { status: 'Under Review',      date: '05 Mar 2026 10:00 AM', done: true },
      { status: 'Assigned to Staff', date: '05 Mar 2026 02:30 PM', done: true },
      { status: 'Resolved',          date: 'In Progress',          done: false },
    ],
  },
  'RC003': {
    id: 'RC003', title: 'Food quality issue in pantry car',
    category: 'Food & Catering', status: 'resolved', priority: 'normal',
    date: '03 Mar 2026', train: '12701', from: 'Hyderabad', to: 'Mumbai',
    coach: 'PC', pnr: '1122334455',
    passenger: 'Priya Mehta', passengerPhone: '9112233445',
    description: 'The food served in the pantry car was stale and had a foul smell. The veg biryani served was not cooked properly and caused stomach issues to multiple passengers.',
    timeline: [
      { status: 'Complaint Filed',   date: '03 Mar 2026 08:00 AM', done: true },
      { status: 'Under Review',      date: '03 Mar 2026 09:30 AM', done: true },
      { status: 'Assigned to Staff', date: '03 Mar 2026 11:00 AM', done: true },
      { status: 'Resolved',          date: '04 Mar 2026 03:00 PM', done: true },
    ],
  },
  'RC004': {
    id: 'RC004', title: 'AC not working in coach B4',
    category: 'Electrical', status: 'pending', priority: 'high',
    date: '02 Mar 2026', train: '12952', from: 'Mumbai', to: 'Delhi',
    coach: 'B4', pnr: '5544332211',
    passenger: 'Suresh Kumar', passengerPhone: '9823456789',
    description: 'The air conditioning in coach B4 has not been working since the start of the journey. Despite multiple complaints to the TTE, no action has been taken.',
    timeline: [
      { status: 'Complaint Filed',   date: '02 Mar 2026 08:00 AM', done: true  },
      { status: 'Under Review',      date: '02 Mar 2026 09:00 AM', done: true  },
      { status: 'Assigned to Staff', date: 'Pending',              done: false },
      { status: 'Resolved',          date: 'Pending',              done: false },
    ],
  },
  'RC005': {
    id: 'RC005', title: 'No water in washroom',
    category: 'Cleanliness', status: 'resolved', priority: 'normal',
    date: '01 Mar 2026', train: '11301', from: 'Chennai', to: 'Bangalore',
    coach: 'S6', pnr: '9988776655',
    passenger: 'Anita Roy', passengerPhone: '9700112233',
    description: 'The washroom in coach S6 had no running water throughout the journey.',
    timeline: [
      { status: 'Complaint Filed',   date: '01 Mar 2026 07:00 AM', done: true },
      { status: 'Under Review',      date: '01 Mar 2026 08:00 AM', done: true },
      { status: 'Assigned to Staff', date: '01 Mar 2026 10:00 AM', done: true },
      { status: 'Resolved',          date: '02 Mar 2026 11:00 AM', done: true },
    ],
  },
  'RC006': {
    id: 'RC006', title: 'Overcrowding in general coach',
    category: 'Safety', status: 'rejected', priority: 'high',
    date: '28 Feb 2026', train: '12123', from: 'Pune', to: 'Nagpur',
    coach: 'GEN', pnr: '1234509876',
    passenger: 'Vikram Singh', passengerPhone: '9823456789',
    description: 'The general coach was extremely overcrowded with passengers standing in aisles and near doors.',
    timeline: [
      { status: 'Complaint Filed',   date: '28 Feb 2026 10:00 AM', done: true },
      { status: 'Under Review',      date: '28 Feb 2026 11:00 AM', done: true },
      { status: 'Assigned to Staff', date: '28 Feb 2026 02:00 PM', done: true },
      { status: 'Resolved',          date: '28 Feb 2026 05:00 PM', done: true },
    ],
  },
  'RC007': {
    id: 'RC007', title: 'Wrong charge for bedroll',
    category: 'Ticketing', status: 'in_progress', priority: 'normal',
    date: '27 Feb 2026', train: '12301', from: 'Delhi', to: 'Kolkata',
    coach: 'A1', pnr: '1122334455',
    passenger: 'Neha Sharma', passengerPhone: '9911223344',
    description: 'The TTE charged extra for bedroll which should have been included in the ticket price for AC first class.',
    timeline: [
      { status: 'Complaint Filed',   date: '27 Feb 2026 09:00 AM', done: true },
      { status: 'Under Review',      date: '27 Feb 2026 10:00 AM', done: true },
      { status: 'Assigned to Staff', date: '27 Feb 2026 01:00 PM', done: true },
      { status: 'Resolved',          date: 'In Progress',          done: false },
    ],
  },
  'RC008': {
    id: 'RC008', title: 'Medical emergency not attended',
    category: 'Medical', status: 'resolved', priority: 'high',
    date: '25 Feb 2026', train: '12625', from: 'Bangalore', to: 'Delhi',
    coach: 'S2', pnr: '5566778899',
    passenger: 'Rahul Verma', passengerPhone: '9700112233',
    description: 'A passenger had a medical emergency but the on-board staff was slow to respond.',
    timeline: [
      { status: 'Complaint Filed',   date: '25 Feb 2026 03:00 PM', done: true },
      { status: 'Under Review',      date: '25 Feb 2026 03:30 PM', done: true },
      { status: 'Assigned to Staff', date: '25 Feb 2026 04:00 PM', done: true },
      { status: 'Resolved',          date: '26 Feb 2026 10:00 AM', done: true },
    ],
  },
}

const statusConfig = {
  pending:     { label: 'Pending',     bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-4 h-4" />       },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100',   text: 'text-blue-800',   icon: <TrendingUp className="w-4 h-4" />  },
  resolved:    { label: 'Resolved',    bg: 'bg-green-100',  text: 'text-green-800',  icon: <CheckCircle className="w-4 h-4" /> },
  rejected:    { label: 'Rejected',    bg: 'bg-red-100',    text: 'text-red-800',    icon: <XCircle className="w-4 h-4" />     },
}

const ComplaintDetail = () => {
  const { id } = useParams()
  const complaint = complaints[id]

  const [status, setStatus]         = useState(complaint?.status || 'pending')
  const [remarks, setRemarks]       = useState('')
  const [saving, setSaving]         = useState(false)

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

  const handleSave = () => {
    if (!remarks.trim()) {
      toast.error('Please add remarks before updating!')
      return
    }
    setSaving(true)
    setTimeout(() => {
      toast.success(`Complaint ${id} updated to ${s.label}!`)
      setSaving(false)
      setRemarks('')
    }, 800)
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
              <div className="flex items-center gap-1.5 mt-1">
                <Phone className="w-3.5 h-3.5 text-dept-gray" />
                <span className="text-sm text-dept-gray font-dm">{complaint.passengerPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h2 className="font-syne font-bold text-dept-blue mb-3">Complaint Description</h2>
          <p className="text-sm text-gray-600 font-dm leading-relaxed">{complaint.description}</p>
        </div>

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