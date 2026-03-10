const Input = ({
  label,
  type        = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  required    = false,
  disabled    = false,
  icon,
  className   = '',
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-rail-red ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rail-gray">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-lg border text-sm font-dm
            text-gray-800 bg-white transition-all
            focus:outline-none focus:ring-2 focus:ring-rail-mid focus:border-transparent
            hover:border-rail-mid
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-rail-red' : 'border-gray-300'}
            ${className}
          `}
        />
      </div>
      {error && (
        <p className="text-xs text-rail-red flex items-center gap-1">
          ⚠ {error}
        </p>
      )}
    </div>
  )
}

export default Input