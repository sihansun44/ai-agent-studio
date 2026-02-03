export default function Tabs({ children, className = '', style = {} }) {
  return (
    <div className={`tabs ${className}`} style={style}>
      {children}
    </div>
  );
}

export function Tab({ children, active = false, onClick, className = '' }) {
  return (
    <button 
      className={`tab ${active ? 'active' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function SegmentControl({ children, className = '', style = {} }) {
  return (
    <div className={`view-switcher ${className}`} style={style}>
      {children}
    </div>
  );
}

export function SegmentItem({ children, active = false, onClick, className = '' }) {
  return (
    <button 
      className={`view-btn ${active ? 'active' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
