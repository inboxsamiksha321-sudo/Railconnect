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

export const TEST_USERS = [
  { email: 'cleanliness@dept.com', password: '123456', role: 'staff', department: 'Cleanliness',      name: 'Ramesh Kumar',  isHead: false },
  { email: 'electrical@dept.com',  password: '123456', role: 'staff', department: 'Electrical',        name: 'Sunil Verma',   isHead: false },
  { email: 'infra@dept.com',       password: '123456', role: 'staff', department: 'Infrastructure',    name: 'Ajay Patil',    isHead: false },
  { email: 'safety@dept.com',      password: '123456', role: 'staff', department: 'Safety & Security', name: 'Sunil Patil',   isHead: false },
  { email: 'staff@dept.com',       password: '123456', role: 'staff', department: 'Staff',             name: 'Vikram Singh',  isHead: false },
  { email: 'catering@dept.com',    password: '123456', role: 'staff', department: 'Catering',          name: 'Suresh Patel',  isHead: false },
  { email: 'medical@dept.com',     password: '123456', role: 'staff', department: 'Medical',           name: 'Dr. Anita Roy', isHead: false },
  { email: 'general@dept.com',     password: '123456', role: 'staff', department: 'General',           name: 'Neha Sharma',   isHead: false },
  { email: 'head@dept.com',        password: '123456', role: 'head',  department: 'All Departments',   name: 'Priya Sharma',  isHead: true  },
]