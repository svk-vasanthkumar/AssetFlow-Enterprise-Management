import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  confirmVariant = 'danger',
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="confirm-dialog-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className={`btn btn-${confirmVariant}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner-sm" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      }
    >
      <div className="confirm-dialog-body">
        <div className="confirm-dialog-icon">
          <AlertTriangle size={28} />
        </div>
        <p className="confirm-dialog-message">{message}</p>
      </div>
    </Modal>
  );
}
