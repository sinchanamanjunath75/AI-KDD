import React from 'react';
import { C } from '../../theme/theme';

export const Stars = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: -2, background: C.bg, overflow: 'hidden' }}>
    {Array.from({ length: 50 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: Math.random() > 0.8 ? '2px' : '1px',
          height: Math.random() > 0.8 ? '2px' : '1px',
          background: C.text,
          opacity: Math.random() * 0.5,
          borderRadius: '50%',
          animation: `twinkle ${2 + Math.random() * 5}s infinite alternate`
        }}
      />
    ))}
    <style>{`
      @keyframes twinkle {
        0% { opacity: 0.1; transform: scale(1); }
        100% { opacity: 0.8; transform: scale(1.2); }
      }
    `}</style>
  </div>
);

export const Scanline = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    zIndex: -1,
    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02))',
    backgroundSize: '100% 4px, 3px 100%',
    pointerEvents: 'none',
    opacity: 0.15
  }} />
);
