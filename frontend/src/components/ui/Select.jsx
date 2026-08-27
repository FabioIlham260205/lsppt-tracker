import { useId } from 'react';

const BASE =
  'w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-2 disabled:bg-slate-50';

function toOption(option) {
  return typeof option === 'object' ? option : { value: option, label: option };
}

export default function Select({
  label,
  options = [],
  placeholder = 'Select...',
  error,
  className = '',
  id,
  ...props
}) {
  const autoId = useId();
  const selectId = id || autoId;

  return (
    <div>
      {label && (
        <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`${BASE} ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
        } ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(toOption).map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
