import { useState } from 'react';

export function Input({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  onInput,
  type = 'text',
  disabled = false,
  required = false,
  error = false,
  success = false,
  hint = '',
  maxLength,
  showCharCount = false,
  className = '',
  inputClassName = '',
  style = {},
  ...props 
}) {
  const inputClasses = [
    'form-input',
    error && 'error',
    success && 'success',
    inputClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onInput={onInput}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        style={style}
        {...props}
      />
      {(hint || showCharCount) && (
        <div className="form-helper-row">
          {hint && (
            <span className={`form-hint ${error ? 'error' : ''} ${success ? 'success' : ''}`}>
              {hint}
            </span>
          )}
          {showCharCount && maxLength && (
            <span className="form-char-count">
              {(value?.length || 0)}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function Textarea({ 
  label, 
  placeholder, 
  value, 
  onChange,
  onInput,
  rows = 4,
  disabled = false,
  required = false,
  error = false,
  success = false,
  hint = '',
  maxLength,
  showCharCount = false,
  className = '',
  inputClassName = '',
  style = {},
  ...props 
}) {
  const inputClasses = [
    'form-input',
    error && 'error',
    success && 'success',
    inputClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onInput={onInput}
        rows={rows}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        style={style}
        {...props}
      />
      {(hint || showCharCount) && (
        <div className="form-helper-row">
          {hint && (
            <span className={`form-hint ${error ? 'error' : ''} ${success ? 'success' : ''}`}>
              {hint}
            </span>
          )}
          {showCharCount && maxLength && (
            <span className="form-char-count">
              {(value?.length || 0)}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function Select({ 
  label, 
  value, 
  onChange,
  children,
  disabled = false,
  required = false,
  error = false,
  success = false,
  hint = '',
  className = '',
  inputClassName = '',
  style = {},
  ...props 
}) {
  const inputClasses = [
    'form-input',
    error && 'error',
    success && 'success',
    inputClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <select
        className={inputClasses}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={style}
        {...props}
      >
        {children}
      </select>
      {hint && (
        <span className={`form-hint ${error ? 'error' : ''} ${success ? 'success' : ''}`}>
          {hint}
        </span>
      )}
    </div>
  );
}

export function Option({ value, children, ...props }) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}

// Compound component for more complex form layouts
export function FormGroup({ children, className = '' }) {
  return (
    <div className={`form-group ${className}`}>
      {children}
    </div>
  );
}

export function FormLabel({ children, required = false, htmlFor }) {
  return (
    <label className="form-label" htmlFor={htmlFor}>
      {children} {required && <span className="required">*</span>}
    </label>
  );
}

export function FormHint({ children, error = false, success = false }) {
  return (
    <span className={`form-hint ${error ? 'error' : ''} ${success ? 'success' : ''}`}>
      {children}
    </span>
  );
}

export function FormHelperRow({ children }) {
  return (
    <div className="form-helper-row">
      {children}
    </div>
  );
}

export default Input;
