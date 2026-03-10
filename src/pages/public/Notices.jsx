import { useState } from 'react'
import { Bell, Calendar, ChevronDown, ChevronUp, Info, AlertCircle, CheckCircle } from 'lucide-react'

const notices = [
  {
    id: 1, type: 'important',
    title: 'New Passenger Amenity Guidelines 2026',
    date: '06 Mar 2026', department: 'Ministry of Railways',
    summary: 'Indian Railways has updated passenger amenity guidelines effective April 2026.',
    content: 'Indian Railways has issued updated guidelines for passenger amenities across all train categories. The new guidelines mandate cleaner coaches, improved food quality standards, better staff behaviour protocols, and enhanced safety measures. All zonal railways have been directed to implement these changes by April 1, 2026. Passengers can report non-compliance through the RailConnect platform.',
  },
  {
    id: 2, type: 'info',
    title: 'Scheduled Maintenance — 10 Mar 2026',
    date: '05 Mar 2026', department: 'IT Department',
    summary: 'RailConnect will undergo scheduled maintenance on 10 Mar from 2 AM to 4 AM.',
    content: 'RailConnect platform will be unavailable for scheduled maintenance on March 10, 2026 between 2:00 AM and 4:00 AM IST. During this window, complaint filing, tracking, and login services will be temporarily unavailable. We apologize for the inconvenience. All pending complaints will continue to be processed normally after maintenance.',
  },
  {
    id: 3, type: 'success',
    title: 'Complaint Resolution Rate Reaches 98%',
    date: '01 Mar 2026', department: 'Customer Service',
    summary: 'Indian Railways achieves 98% complaint resolution rate in February 2026.',
    content: 'Indian Railways is proud to announce that the complaint resolution rate for February 2026 has reached an all-time high of 98%. A total of 1.2 lakh complaints were filed through RailConnect, of which 98% were resolved within the stipulated timeframe. The average resolution time has reduced from 7 days to 3 days. This achievement is a result of our dedicated staff and improved AI-based complaint routing system.',
  },
  {
    id: 4, type: 'important',
    title: 'New Helpline Numbers Effective March 2026',
    date: '28 Feb 2026', department: 'Customer Service',
    summary: 'Updated railway helpline numbers for passenger assistance and complaint registration.',
    content: 'Indian Railways has updated its helpline numbers effective March 1, 2026. The national railway helpline number remains 139. Additional helplines have been introduced: 138 for security concerns, 182 for women safety, and 1800-111-321 for divyangjan assistance. These numbers are available 24/7 and are toll-free from all networks across India.',
  },
  {
    id: 5, type: 'info',
    title: 'E-Catering Service Expanded to 500 Stations',
    date: '25 Feb 2026', department: 'Catering Department',
    summary: 'IRCTC e-catering service now available at 500 railway stations across India.',
    content: 'IRCTC has expanded its e-catering service to 500 railway stations across India. Passengers can now order food from their preferred restaurants while travelling. Orders can be placed through the IRCTC app or website up to 2 hours before the scheduled arrival at the station. Food will be delivered directly to the passenger seat. Quality checks are conducted regularly to ensure food safety standards.',
  },
]

const typeConfig = {
  important: { icon: <AlertCircle className="w-4 h-4" />, bg: 'bg-orange-100', text: 'text-orange-700', label: 'Important', dot: 'bg-orange-500' },
  info:      { icon: <Info className="w-4 h-4" />,        bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Info',      dot: 'bg-blue-500'   },
  success:   { icon: <CheckCircle className="w-4 h-4" />, bg: 'bg-green-100',  text: 'text-green-700',  label: 'Update',    dot: 'bg-green-500'  },
}

const Notices = () => {
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter]     = useState('all')

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

        {/* Notices List */}
        <div className="flex flex-col gap-4">
          {filtered.map(notice => {
            const t = typeConfig[notice.type]
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

      </div>
    </div>
  )
}

export default Notices