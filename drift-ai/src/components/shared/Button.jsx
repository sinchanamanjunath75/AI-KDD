import React from 'react';
import { C } from '../../theme/theme';

export const Button = ({ children, variant = 'primary', style, ...props }) => {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  
  const baseStyle = {
    padding: '10px 20px',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    outline: 'none',
    fontFamily: C.fontBody,
  };

  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
      color: '#000',
      boxShadow: `0 4px 15px ${C.glow}`,
    },
    outline: {
      background: 'transparent',
      border: `1px solid ${C.border}`,
      color: C.text,
    },
    ghost: {
      background: 'transparent',
      color: C.muted,
      padding: '8px',
    }
  };

  return (
    <button
      style={{ ...baseStyle, ...variants[variant], ...style }}
      onMouseEnter={(e) => {
        if (isPrimary) e.currentTarget.style.transform = 'translateY(-1px)';
        if (isOutline) e.currentTarget.style.borderColor = C.accent;
      }}
      onMouseLeave={(e) => {
        if (isPrimary) e.currentTarget.style.transform = 'translateY(0)';
        if (isOutline) e.currentTarget.style.borderColor = C.border;
      }}
      {...props}
    >
      {children}
    </button>
  );
};
