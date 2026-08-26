import { useId } from 'react';
import Input from './Input.jsx';

export default function DatePicker({ label, error, className = '', ...props }) {
  return (
    <Input
      type="date"
      label={label}
      error={error}
      className={`[color-scheme:light] ${className}`}
      {...props}
    />
  );
}
