import React from 'react';
import { C } from '../../theme/theme';

export const Button = ({ children, variant = 'primary', style, ...props }) => {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  
  const baseStyle = {
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    outline: 'none',
    fontFamily: C.fontHeader,
    letterSpacing: '0.5px',
    position: 'relative',
    overflow: 'hidden'
  };

  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${C.accent}, ${C.accentHover})`,
      color: '#000',
      boxShadow: `0 4px 20px ${C.glow}`,
      textTransform: 'uppercase'
    },
    outline: {
      background: 'rgba(20, 241, 217, 0.05)',
      border: `1px solid ${C.border}`,
      color: C.accent,
      backdropFilter: 'blur(10px)',
    },
    ghost: {
      background: 'transparent',
      color: C.muted,
      padding: '8px',
      fontFamily: C.fontBody,
      fontWeight: 500
    }
  };

  return (
    <button
      style={{ ...baseStyle, ...variants[variant], ...style }}
      onMouseEnter={(e) => {
        if (isPrimary) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 8px 25px rgba(20, 241, 217, 0.4)`;
        }
        if (isOutline) {
          e.currentTarget.style.borderColor = C.accent;
          e.currentTarget.style.background = 'rgba(20, 241, 217, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (isPrimary) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = variants.primary.boxShadow;
        }
        if (isOutline) {
          e.currentTarget.style.borderColor = C.border;
          e.currentTarget.style.background = variants.outline.background;
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};
