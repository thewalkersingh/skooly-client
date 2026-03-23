import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title || 'Confirm Action'}</h3>
          <button className="modal-close" onClick={onClose}><X /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 8, background: 'var(--danger-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <AlertTriangle style={{ width: 20, height: 20, color: 'var(--danger)' }} />
          </div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-600)', paddingTop: 8 }}>
            {message || 'Are you sure you want to proceed? This action cannot be undone.'}
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
