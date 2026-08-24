export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const VARIANTS = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus-visible:outline-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
    outline:
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-blue-600',
  };

  const SIZES = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
