import { useId } from 'react';

const BASE =
  'w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:bg-slate-50';

export default function Input({ label, error, className = '', id, ...props }) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${BASE} ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
