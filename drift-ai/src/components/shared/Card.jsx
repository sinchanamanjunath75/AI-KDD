import React from 'react';
import { C } from '../../theme/theme';

export const Card = ({ children, variant = 'glass', style, ...props }) => {
  const baseStyle = {
    background: variant === 'glass' ? C.glass : C.bgCard,
    border: `1px solid ${C.glassBorder}`,
    borderRadius: '16px',
    padding: '24px',
    backdropFilter: variant === 'glass' ? 'blur(20px) saturate(180%)' : 'none',
    WebkitBackdropFilter: variant === 'glass' ? 'blur(20px) saturate(180%)' : 'none',
    boxShadow: variant === 'glass' ? `0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)` : 'none',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: C.fontBody,
  };

  return (
    <div 
      className="card" 
      style={{ ...baseStyle, ...style }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.borderHover;
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 15px ${C.glow}`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.glassBorder;
        e.currentTarget.style.boxShadow = baseStyle.boxShadow;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      {...props}
    >
      {/* Decorative inner glow for ultimate glass look */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, transparent, ${C.glassBorder}, transparent)`,
        opacity: 0.5
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};
