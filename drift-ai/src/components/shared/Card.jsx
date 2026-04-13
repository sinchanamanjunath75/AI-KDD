import React from 'react';
import { C } from '../../theme/theme';

export const Card = ({ children, variant = 'glass', style, ...props }) => {
  const baseStyle = {
    background: variant === 'glass' ? C.glass : C.bgCard,
    border: `1px solid ${C.glassBorder}`,
    borderRadius: '16px',
    padding: '24px',
    backdropFilter: variant === 'glass' ? 'blur(12px)' : 'none',
    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4)`,
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color 0.3s ease',
    fontFamily: C.fontBody,
  };

  return (
    <div 
      className="card" 
      style={{ ...baseStyle, ...style }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = C.accent}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = C.glassBorder}
      {...props}
    >
      {children}
    </div>
  );
};
