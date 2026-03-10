const Card = ({
  children,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-gray-100 shadow-sm
        ${onClick ? 'cursor-pointer hover:shadow-md hover:border-rail-light transition-all duration-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
)

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
)

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
)

export const StatCard = ({
  icon,
  label,
  value,
  color = 'blue',
  trend,
}) => {
  const colors = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-rail-mid',    border: 'border-blue-100'   },
    yellow: { bg: 'bg-yellow-50', icon: 'text-rail-yellow', border: 'border-yellow-100' },
    orange: { bg: 'bg-orange-50', icon: 'text-rail-accent', border: 'border-orange-100' },
    green:  { bg: 'bg-green-50',  icon: 'text-rail-green',  border: 'border-green-100'  },
  }
  const c = colors[color] || colors.blue

  return (
    <div className={`bg-white rounded-xl p-5 border ${c.border} shadow-sm flex items-start gap-4`}>
      <div className={`p-2.5 rounded-lg ${c.bg}`}>
        <span className={c.icon}>{icon}</span>
      </div>
      <div>
        <p className="text-xs text-rail-gray font-dm">{label}</p>
        <p className="text-2xl font-syne font-bold text-rail-blue mt-0.5">{value}</p>
        {trend && (
          <p className="text-xs text-rail-green font-dm mt-0.5">{trend}</p>
        )}
      </div>
    </div>
  )
}

export default Card