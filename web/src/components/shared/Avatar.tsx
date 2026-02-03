export default function Avatar({ 
  src,
  initials,
  size = 32,
  className = '',
  style = {},
  ...props 
}) {
  const sizeStyle = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${size * 0.4}px`,
    ...style
  };

  if (src) {
    return (
      <img 
        src={src}
        alt=""
        className={`avatar ${className}`}
        style={sizeStyle}
        {...props}
      />
    );
  }

  return (
    <div 
      className={`avatar avatar-initials ${className}`}
      style={sizeStyle}
      {...props}
    >
      {initials}
    </div>
  );
}
