export function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, onClose }) {
  return (
    <div className="modal-header">
      <h2 className="modal-title">{title}</h2>
      <button className="modal-close" onClick={onClose}>×</button>
    </div>
  );
}

export function ModalBody({ children }) {
  return (
    <div className="modal-body">
      {children}
    </div>
  );
}

export function ModalFooter({ children }) {
  return (
    <div className="modal-footer">
      {children}
    </div>
  );
}

export default Modal;
