import React from 'react';

interface ToggleProps {
  checked?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  [key: string]: any;
}

export default function Toggle({ 
  checked = false, 
  onChange, 
  disabled = false,
  label,
  className = '',
  ...props 
}: ToggleProps) {
  return (
    <label className={`toggle-wrapper ${className}`}>
      <input 
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="toggle-input"
        {...props}
      />
      <span className="toggle-slider"></span>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
}
