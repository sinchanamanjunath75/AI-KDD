import React from 'react';
import { C } from '../../theme/theme';

export const DriftRing = ({ score, label, color = C.accent, size = 60 }) => {
  const radius = (size / 2) - 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle 
            cx={size / 2} cy={size / 2} r={radius} 
            fill="none" stroke={C.border} strokeWidth="3" 
          />
          <circle 
            cx={size / 2} cy={size / 2} r={radius} 
            fill="none" stroke={color} strokeWidth="3" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div style={{ 
          position: 'absolute', inset: 0, display: 'flex', 
          alignItems: 'center', justifyContent: 'center', 
          fontSize: '11px', fontWeight: 800, color: color, fontFamily: C.fontHeader 
        }}>
          {score}%
        </div>
      </div>
      {label && <div style={{ fontSize: '10px', color: C.muted, textTransform: 'uppercase' }}>{label}</div>}
    </div>
  );
};
