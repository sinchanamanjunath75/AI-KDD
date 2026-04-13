import React, { useEffect } from 'react';
import { C } from '../../theme/theme';

export const NotificationToast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: C.green,
    error: C.accent3,
    info: C.accent,
    warning: C.amber
  };

  const icon = {
    success: '✅',
    error: '❌',
    info: '📡',
    warning: '⚠️'
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: C.glass,
      backdropFilter: 'blur(16px)',
      border: `1px solid ${colors[type]}`,
      borderRadius: '12px',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      zIndex: 2000,
      animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: C.fontBody
    }}>
      <span style={{ fontSize: '18px' }}>{icon[type]}</span>
      <div style={{ color: C.text, fontSize: '14px', fontWeight: 500 }}>{message}</div>
      <button 
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '16px', marginLeft: '8px' }}
      >
        ×
      </button>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
