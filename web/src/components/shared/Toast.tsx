export default function Toast({ message, variant = 'default' }) {
  return (
    <div className={`toast toast-${variant}`}>
      {message}
    </div>
  );
}
