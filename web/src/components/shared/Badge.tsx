export default function Badge({ children, variant = 'default', className = '' }) {
  const variantClass = variant ? `badge-${variant}` : '';
  
  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
