export function Card({ children, className = '', style = {} }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', style = {} }) {
  return (
    <h3 className={`card-title ${className}`} style={style}>
      {children}
    </h3>
  );
}

export default Card;
