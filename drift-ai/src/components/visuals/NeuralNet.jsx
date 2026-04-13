import React from 'react';
import { C } from '../../theme/theme';

export const NeuralNet = () => {
  return (
    <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <svg width="100%" height="160" viewBox="0 0 400 160">
        <defs>
          <linearGradient id="netGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={C.accent} stopOpacity="0.8" />
            <stop offset="100%" stopColor={C.accent2} stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Connection Lines */}
        {Array.from({ length: 15 }).map((_, i) => (
          <line
            key={i}
            x1={50 + Math.random() * 300}
            y1={20 + Math.random() * 120}
            x2={50 + Math.random() * 300}
            y2={20 + Math.random() * 120}
            stroke="url(#netGrad)"
            strokeWidth="0.5"
            opacity="0.15"
          >
            <animate attributeName="opacity" values="0.05;0.2;0.05" dur={`${3 + Math.random() * 3}s`} repeatCount="indefinite" />
          </line>
        ))}

        {/* Nodes */}
        {[
          { x: 100, y: 40 }, { x: 150, y: 80 }, { x: 100, y: 120 },
          { x: 200, y: 40 }, { x: 250, y: 80 }, { x: 200, y: 120 },
          { x: 300, y: 40 }, { x: 300, y: 120 }
        ].map((node, i) => (
          <g key={i}>
            <circle cx={node.x} cy={node.y} r="4" fill={C.bgCard2} stroke={C.accent} strokeWidth="1" filter="url(#glow)">
              <animate attributeName="r" values="3.5;4.5;3.5" dur="3s" repeatCount="indefinite" />
            </circle>
            {i === 3 && (
              <circle cx={node.x} cy={node.y} r="8" fill="none" stroke={C.accent3} strokeWidth="1" opacity="0.6">
                <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
