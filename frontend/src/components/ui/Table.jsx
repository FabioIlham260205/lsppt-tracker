export function Table({ className = '', ...props }) {
  return <table className={`w-full text-left text-sm ${className}`} {...props} />;
}

export function THead({ className = '', ...props }) {
  return <thead className={`border-b border-slate-200 bg-slate-50 ${className}`} {...props} />;
}

export function TBody({ className = '', ...props }) {
  return <tbody className={className} {...props} />;
}

export function Tr({ className = '', ...props }) {
  return (
    <tr
      className={`border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 ${className}`}
      {...props}
    />
  );
}

export function Th({ className = '', ...props }) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold tracking-wide text-slate-600 uppercase ${className}`}
      {...props}
    />
  );
}

export function Td({ className = '', ...props }) {
  return <td className={`px-4 py-3 text-slate-700 ${className}`} {...props} />;
}
