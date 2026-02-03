export function Input({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  onInput,
  type = 'text',
  disabled = false,
  required = false,
  className = '',
  style = {},
  ...props 
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onInput={onInput}
        disabled={disabled}
        required={required}
        style={style}
        {...props}
      />
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
  className = '',
  style = {},
  ...props 
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onInput={onInput}
        rows={rows}
        disabled={disabled}
        required={required}
        style={style}
        {...props}
      />
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
  className = '',
  style = {},
  ...props 
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <select
        className="form-input"
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={style}
        {...props}
      >
        {children}
      </select>
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

export default Input;
