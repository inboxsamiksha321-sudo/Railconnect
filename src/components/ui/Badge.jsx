import { STATUS_CONFIG } from '../../constants'

const Badge = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue:   'bg-blue-100 text-blue-800',
    green:  'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red:    'bg-red-100 text-red-800',
    gray:   'bg-gray-100 text-gray-800',
    orange: 'bg-orange-100 text-orange-800',
  }

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full
      text-xs font-medium font-dm
      ${colors[color] || colors.blue}
      ${className}
    `}>
      {children}
    </span>
  )
}

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status]
  if (!config) return null
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full
      text-xs font-medium font-dm
      ${config.bg} ${config.text}
    `}>
      {config.label}
    </span>
  )
}

export const RoleBadge = ({ role }) => {
  const colors = {
    passenger: 'bg-blue-100 text-blue-800',
    staff:     'bg-green-100 text-green-800',
    admin:     'bg-purple-100 text-purple-800',
  }
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full
      text-xs font-medium font-dm capitalize
      ${colors[role] || colors.passenger}
    `}>
      {role}
    </span>
  )
}

export default Badge