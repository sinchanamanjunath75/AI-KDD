import React from 'react';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { C } from '../theme/theme';

export const Landing = ({ setPage }) => {
  return (
    <div className="page" style={{ paddingTop: '100px', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ 
          fontFamily: C.fontHeader, 
          fontSize: 'clamp(32px, 8vw, 64px)', 
          fontWeight: 800, 
          marginBottom: '24px',
          background: `linear-gradient(135deg, ${C.text}, ${C.muted})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.1
        }}>
          Detect <span style={{ color: C.accent }}>Documentation Drift</span> in Real-Time
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: C.muted, 
          maxWidth: '600px', 
          margin: '0 auto 40px',
          lineHeight: 1.6
        }}>
          Compare existing docs against tickets, changelogs, and updates to flag outdated sections automatically — keeping your knowledge base accurate and trustworthy.
        </p>

        {/* Global Stats */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '40px', 
          marginBottom: '48px',
          padding: '20px',
          background: 'rgba(0, 212, 255, 0.03)',
          borderRadius: '20px',
          border: `1px solid ${C.border}`
        }}>
          {[
            { label: 'Docs Monitored', val: '12,840', color: C.accent },
            { label: 'Checks / Day', val: '1,204', color: C.accent2 },
            { label: 'Knowledge Bases', val: '85+', color: C.green }
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: C.fontHeader, fontSize: '24px', fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '11px', color: C.muted, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '64px' }}>
          <Button onClick={() => setPage('dashboard')}>Launch Doc Scanner</Button>
          <Button variant="outline" onClick={() => setPage('updates')}>View Change Feed</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {[
            { title: 'Doc Comparison', desc: 'Compare documentation against changelogs and tickets to find mismatches.', icon: '📄' },
            { title: 'Change Detection', desc: 'Detect version changes, deprecated features, and stale references.', icon: '🔍' },
            { title: 'Multi-Source', desc: 'Ingest updates from tickets, release notes, and API changelogs.', icon: '📡' }
          ].map((feature, i) => (
            <Card key={i} style={{ textAlign: 'left', padding: '32px' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{ fontFamily: C.fontHeader, fontSize: '18px', marginBottom: '12px', color: C.accent }}>{feature.title}</h3>
              <p style={{ fontSize: '14px', color: C.muted, lineHeight: 1.5 }}>{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
