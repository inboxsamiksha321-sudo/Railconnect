export const DEPARTMENTS = [
  { id: 'cleanliness', label: 'Cleanliness',       icon: '🧹', desc: 'Dirty toilets, garbage, smell, hygiene issues'          },
  { id: 'electrical',  label: 'Electrical',         icon: '⚡', desc: 'AC not working, fan issues, charging sockets, lights'   },
  { id: 'infra',       label: 'Infrastructure',     icon: '🏗️', desc: 'Broken seats, doors, windows, coach damage'             },
  { id: 'safety',      label: 'Safety & Security',  icon: '🛡️', desc: 'Theft, fights, harassment, suspicious people'           },
  { id: 'staff',       label: 'Staff',              icon: '👮', desc: 'Rude staff, ticket checker issues, service problems'    },
  { id: 'catering',    label: 'Catering',           icon: '🍱', desc: 'Stale food, pantry complaints, water issues'            },
  { id: 'medical',     label: 'Medical',            icon: '💊', desc: 'Passenger illness, injuries, emergencies'               },
  { id: 'general',     label: 'General',            icon: '📋', desc: 'Train delay, platform info, PNR queries'               },
]

export const STATUS_CONFIG = {
  pending:     { label: 'Pending',     bg: 'bg-yellow-100', text: 'text-yellow-800' },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100',   text: 'text-blue-800'  },
  resolved:    { label: 'Resolved',    bg: 'bg-green-100',  text: 'text-green-800' },
  rejected:    { label: 'Rejected',    bg: 'bg-red-100',    text: 'text-red-800'   },
}