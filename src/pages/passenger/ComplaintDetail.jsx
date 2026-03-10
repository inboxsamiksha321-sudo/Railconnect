import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Train, Calendar, MapPin,
  Clock, CheckCircle, TrendingUp, XCircle,
  User, Phone, MessageSquare
} from 'lucide-react'

const complaints = {
  'RC001': {
    id: 'RC001', title: 'Dirty coach in train 12345',
    category: 'Cleanliness', status: 'pending', priority: 'normal',
    date: '06 Mar 2026', train: '12345', from: 'Pune', to: 'Mumbai',
    coach: 'S4', pnr: '1234567890',
    description: 'The coach S4 in train 12345 was extremely dirty. The floor was covered with garbage and the washrooms were unusable. There was no cleaning done since the start of the journey.',
    timeline: [
      { status: 'Complaint Filed',   date: '06 Mar 2026 10:32 AM', done: true  },
      { status: 'Under Review',      date: '06 Mar 2026 11:00 AM', done: true  },
      { status: 'Assigned to Staff', date: 'Pending',              done: false },
      { status: 'Resolved',          date: 'Pending',              done: false },
    ],
    assignedTo: null,
    resolution: null,
  },
  'RC002': {
    id: 'RC002', title: 'Rude behaviour by TTE officer',
    category: 'Staff Behaviour', status: 'in_progress', priority: 'high',
    date: '05 Mar 2026', train: '11028', from: 'Delhi', to: 'Trivandrum',
    coach: 'B2', pnr: '9876543210',
    description: 'The TTE officer was extremely rude and used inappropriate language when asked about berth allotment. He refused to show his ID card and threatened passengers.',
    timeline: [
      { status: 'Complaint Filed',   date: '05 Mar 2026 09:15 AM', done: true },
      { status: 'Under Review',      date: '05 Mar 2026 10:00 AM', done: true },
      { status: 'Assigned to Staff', date: '05 Mar 2026 02:30 PM', done: true },
      { status: 'Resolved',          date: 'In Progress',          done: false },
    ],
    assignedTo: { name: 'Ramesh Kumar', role: 'Senior Inspector', phone: '9876543210' },
    resolution: null,
  },
  'RC003': {
    id: 'RC003', title: 'Food quality issue in pantry car',
    category: 'Food & Catering', status: 'resolved', priority: 'normal',
    date: '03 Mar 2026', train: '12701', from: 'Hyderabad', to: 'Mumbai',
    coach: 'PC', pnr: '1122334455',
    description: 'The food served in the pantry car was stale and had a foul smell. The veg biryani served was not cooked properly and caused stomach issues to multiple passengers.',
    timeline: [
      { status: 'Complaint Filed',   date: '03 Mar 2026 08:00 AM', done: true },
      { status: 'Under Review',      date: '03 Mar 2026 09:30 AM', done: true },
      { status: 'Assigned to Staff', date: '03 Mar 2026 11:00 AM', done: true },
      { status: 'Resolved',          date: '04 Mar 2026 03:00 PM', done: true },
    ],
    assignedTo: { name: 'Suresh Patel', role: 'Catering Inspector', phone: '9112233445' },
    resolution: 'The pantry car vendor has been warned and fined. Food quality standards have been reinforced. A full refund has been issued to affected passengers.',
  },
  'RC004': {
  id: 'RC004', title: 'AC not working in coach B4',
  category: 'Electrical Issues', status: 'pending', priority: 'high',
  date: '02 Mar 2026', train: '12952', from: 'Mumbai', to: 'Delhi',
  coach: 'B4', pnr: '5544332211',
  description: 'The air conditioning in coach B4 has not been working since the start of the journey. Despite multiple complaints to the TTE, no action has been taken. Passengers are suffering due to extreme heat.',
  timeline: [
    { status: 'Complaint Filed',   date: '02 Mar 2026 08:00 AM', done: true  },
    { status: 'Under Review',      date: '02 Mar 2026 09:00 AM', done: true  },
    { status: 'Assigned to Staff', date: 'Pending',              done: false },
    { status: 'Resolved',          date: 'Pending',              done: false },
  ],
  assignedTo: null, resolution: null,
},
'RC005': {
  id: 'RC005', title: 'No water in washroom',
  category: 'Cleanliness', status: 'resolved', priority: 'normal',
  date: '01 Mar 2026', train: '11301', from: 'Chennai', to: 'Bangalore',
  coach: 'S6', pnr: '9988776655',
  description: 'The washroom in coach S6 had no running water throughout the journey. The situation was unhygienic and inconvenient for passengers.',
  timeline: [
    { status: 'Complaint Filed',   date: '01 Mar 2026 07:00 AM', done: true },
    { status: 'Under Review',      date: '01 Mar 2026 08:00 AM', done: true },
    { status: 'Assigned to Staff', date: '01 Mar 2026 10:00 AM', done: true },
    { status: 'Resolved',          date: '02 Mar 2026 11:00 AM', done: true },
  ],
  assignedTo: { name: 'Vikram Singh', role: 'Cleanliness Inspector', phone: '9876501234' },
  resolution: 'Water supply issue has been fixed. The washroom has been cleaned and sanitized.',
},
'RC006': {
  id: 'RC006', title: 'Overcrowding in general coach',
  category: 'Safety & Security', status: 'rejected', priority: 'high',
  date: '28 Feb 2026', train: '12123', from: 'Pune', to: 'Nagpur',
  coach: 'GEN', pnr: '1234509876',
  description: 'The general coach was extremely overcrowded with passengers standing in aisles and near doors. This is a serious safety hazard.',
  timeline: [
    { status: 'Complaint Filed',   date: '28 Feb 2026 10:00 AM', done: true },
    { status: 'Under Review',      date: '28 Feb 2026 11:00 AM', done: true },
    { status: 'Assigned to Staff', date: '28 Feb 2026 02:00 PM', done: true },
    { status: 'Resolved',          date: '28 Feb 2026 05:00 PM', done: true },
  ],
  assignedTo: { name: 'Sunil Patil', role: 'Security Inspector', phone: '9823456789' },
  resolution: null,
},
'RC007': {
  id: 'RC007', title: 'Wrong charge for bedroll',
  category: 'Ticketing', status: 'in_progress', priority: 'normal',
  date: '27 Feb 2026', train: '12301', from: 'Delhi', to: 'Kolkata',
  coach: 'A1', pnr: '1122334455',
  description: 'The TTE charged extra for bedroll which should have been included in the ticket price for AC first class.',
  timeline: [
    { status: 'Complaint Filed',   date: '27 Feb 2026 09:00 AM', done: true },
    { status: 'Under Review',      date: '27 Feb 2026 10:00 AM', done: true },
    { status: 'Assigned to Staff', date: '27 Feb 2026 01:00 PM', done: true },
    { status: 'Resolved',          date: 'In Progress',          done: false },
  ],
  assignedTo: { name: 'Priya Sharma', role: 'Ticketing Inspector', phone: '9911223344' },
  resolution: null,
},
'RC008': {
  id: 'RC008', title: 'Medical emergency not attended',
  category: 'Medical Assistance', status: 'resolved', priority: 'high',
  date: '25 Feb 2026', train: '12625', from: 'Bangalore', to: 'Delhi',
  coach: 'S2', pnr: '5566778899',
  description: 'A passenger had a medical emergency but the on-board staff was slow to respond. No first aid kit was available in the coach.',
  timeline: [
    { status: 'Complaint Filed',   date: '25 Feb 2026 03:00 PM', done: true },
    { status: 'Under Review',      date: '25 Feb 2026 03:30 PM', done: true },
    { status: 'Assigned to Staff', date: '25 Feb 2026 04:00 PM', done: true },
    { status: 'Resolved',          date: '26 Feb 2026 10:00 AM', done: true },
  ],
  assignedTo: { name: 'Dr. Anita Roy', role: 'Medical Officer', phone: '9700112233' },
  resolution: 'Staff has been trained on emergency response. First aid kits have been restocked in all coaches.',
},
}

const statusConfig = {
  pending:     { label: 'Pending',     bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-4 h-4" />        },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100',   text: 'text-blue-800',   icon: <TrendingUp className="w-4 h-4" />   },
  resolved:    { label: 'Resolved',    bg: 'bg-green-100',  text: 'text-green-800',  icon: <CheckCircle className="w-4 h-4" />  },
  rejected:    { label: 'Rejected',    bg: 'bg-red-100',    text: 'text-red-800',    icon: <XCircle className="w-4 h-4" />      },
}

const ComplaintDetail = () => {
  const { id } = useParams()
  const complaint = complaints[id]

  if (!complaint) {
    return (
      <div className="min-h-screen bg-rail-bg flex items-center justify-center">
        <div className="text-center">
          <p className="font-syne font-bold text-rail-blue text-2xl mb-2">Complaint Not Found</p>
          <Link to="/passenger/complaints" className="text-rail-mid font-dm text-sm hover:underline">
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
              <div className="flex items-center gap-2 mb-2">
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
              { icon: <Train className="w-3.5 h-3.5" />,    label: 'Train',  value: complaint.train            },
              { icon: <MapPin className="w-3.5 h-3.5" />,   label: 'Route',  value: `${complaint.from} → ${complaint.to}` },
              { icon: <MessageSquare className="w-3.5 h-3.5" />, label: 'Coach', value: complaint.coach        },
              { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Filed',  value: complaint.date            },
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
            {complaint.timeline.map((step, i) => (
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
            <p className="text-sm text-green-700 font-dm leading-relaxed">{complaint.resolution}</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default ComplaintDetail