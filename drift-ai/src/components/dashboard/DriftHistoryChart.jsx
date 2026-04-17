import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { C } from '../../theme/theme';

export const DriftHistoryChart = ({ data }) => {
  // Sort data by ID to ensure chronological order
  const chartData = [...data].reverse().map(item => ({
    name: item.date.split(' ')[0], // Date only
    score: item.score,
    doc: item.doc_title
  }));

  if (chartData.length < 2) {
    return (
      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: '14px', border: `1px dashed ${C.border}`, borderRadius: '12px' }}>
        Awaiting more document scans for trend analysis...
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={C.accent} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={C.accent} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke={C.muted} 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke={C.muted} 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: C.accent }}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke={C.accent} 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorScore)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
