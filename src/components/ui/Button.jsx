const variants = {
  primary: 'bg-rail-blue hover:bg-rail-mid text-white',
  accent:  'bg-rail-accent hover:bg-orange-500 text-white',
  outline: 'border-2 border-rail-blue text-rail-blue hover:bg-rail-light',
  ghost:   'text-rail-blue hover:bg-rail-light',
  danger:  'bg-rail-red hover:bg-red-700 text-white',
  success: 'bg-rail-green hover:bg-green-700 text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
}

const Button = ({
  children,
  variant  = 'primary',
  size     = 'md',
  fullWidth = false,
  disabled  = false,
  onClick,
  type     = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        font-dm font-medium rounded-lg transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export default Button