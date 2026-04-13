import React from 'react';
import { C } from '../../theme/theme';

export const Waveform = ({ color = C.accent, bars = 20 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '24px' }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '3px',
            backgroundColor: color,
            borderRadius: '2px',
            opacity: 0.3 + Math.random() * 0.7,
            animation: `waveformAnim ${1 + Math.random()}s ease-in-out infinite alternate`,
            height: '100%',
          }}
        />
      ))}
      <style>{`
        @keyframes waveformAnim {
          0% { height: 20%; opacity: 0.2; }
          100% { height: 100%; opacity: 1; }
        }
      `}</style>
    </div>
  );
};
