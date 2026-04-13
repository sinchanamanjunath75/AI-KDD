import React from 'react';
import { C } from '../../theme/theme';

export const Globe3D = () => {
  return (
    <div style={{ width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle at 30% 30%, ${C.bgCard2}, ${C.bg})`, border: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden', boxShadow: `inset 0 0 40px rgba(0,212,255,0.1), 0 0 20px rgba(0,0,0,0.5)` }}>
      <svg width="180" height="180" viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Longitudinal Lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <ellipse
            key={i}
            cx="50" cy="50" rx={15 + i * 7} ry="48"
            fill="none" stroke={C.accent} strokeWidth="0.2" opacity="0.15"
          >
            <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${2 + i}s`} repeatCount="indefinite" />
          </ellipse>
        ))}
        {/* Latitudinal Lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={i}
            x1="0" y1={10 + i * 11.5} x2="100" y2={10 + i * 11.5}
            stroke={C.accent} strokeWidth="0.1" opacity="0.1"
          />
        ))}
        {/* Active Nodes */}
        {[
          { x: 40, y: 30 }, { x: 70, y: 50 }, { x: 30, y: 70 }, { x: 60, y: 20 }
        ].map((node, i) => (
          <circle key={i} cx={node.x} cy={node.y} r="1.5" fill={C.accent}>
            <animate attributeName="r" values="1;2;1" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
      {/* Glare effect */}
      <div style={{ position: 'absolute', top: '10%', left: '15%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)', borderRadius: '50%' }} />
    </div>
  );
};
