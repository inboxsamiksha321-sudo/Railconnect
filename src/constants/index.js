export const ROLES = {
  PASSENGER: 'passenger',
  STAFF:     'staff',
  ADMIN:     'admin',
}

export const STATUS = {
  PENDING:     'pending',
  IN_PROGRESS: 'in_progress',
  RESOLVED:    'resolved',
  REJECTED:    'rejected',
}

export const STATUS_CONFIG = {
  pending:     { label: 'Pending',     bg: 'bg-yellow-100', text: 'text-yellow-800' },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100',   text: 'text-blue-800'  },
  resolved:    { label: 'Resolved',    bg: 'bg-green-100',  text: 'text-green-800' },
  rejected:    { label: 'Rejected',    bg: 'bg-red-100',    text: 'text-red-800'   },
}

export const CATEGORIES = [
  'Cleanliness',
  'Electrical',
  'Infrastructure',
  'Safety & Security',
  'Staff',
  'Catering',
  'Medical',
  'General',
]

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const NAV_LINKS = {
  public: [
    { label: 'Home',           path: '/'        },
    { label: 'Track',          path: '/track'   },
    { label: 'Notices',        path: '/notices' },
    { label: 'About',          path: '/about'   },
  ],
  passenger: [
    { label: 'Dashboard',      path: '/passenger/dashboard'      },
    { label: 'File Complaint', path: '/passenger/complaints/new' },
    { label: 'My Complaints',  path: '/passenger/complaints'     },
    { label: 'Notifications',  path: '/passenger/notifications'  },
  ],
  staff: [
    { label: 'Dashboard',      path: '/staff/dashboard'          },
    { label: 'Complaints',     path: '/staff/complaints'         },
  ],
  admin: [
    { label: 'Dashboard',      path: '/admin/dashboard'          },
    { label: 'Complaints',     path: '/admin/complaints'         },
    { label: 'Staff',          path: '/admin/staff'              },
    { label: 'Reports',        path: '/admin/reports'            },
  ],
}