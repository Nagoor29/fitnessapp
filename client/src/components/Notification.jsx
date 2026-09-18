import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export const Notification = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#10b981" />;
      case 'info':
        return <Info size={18} color="#06b6d4" />;
      case 'error':
      default:
        return <AlertCircle size={18} color="#ef4444" />;
    }
  };

  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'alert alert-success';
      case 'info':
        return 'alert alert-info';
      case 'error':
      default:
        return 'alert alert-error';
    }
  };

  return (
    <div className={getAlertClass()} role="alert">
      <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon()}</div>
      <div style={{ flex: 1, wordBreak: 'break-word' }}>{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '2px',
            opacity: 0.8,
          }}
          aria-label="Close message"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Notification;
