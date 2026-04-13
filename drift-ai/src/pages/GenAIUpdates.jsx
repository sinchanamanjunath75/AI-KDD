import React, { useState, useEffect } from 'react';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { C, API_BASE } from '../theme/theme';

export const GenAIUpdates = ({ user, setPage }) => {
  const [updates, setUpdates] = useState([]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    fetch(`${API_BASE}/updates`).then(res => res.json()).then(setUpdates);
  }, []);

  const filtered = updates.filter(u => 
    u.title.toLowerCase().includes(search.toLowerCase()) || 
    u.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: C.fontHeader, fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>Live Intelligence Feed</h1>
          <p style={{ color: C.muted, fontSize: '16px' }}>Streaming semantic drift detection events from the global neural network.</p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <input 
            className="input-field"
            placeholder="Search patterns, models, or events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '16px 24px', fontSize: '16px', borderRadius: '16px', background: C.bgCard, border: `1px solid ${C.border}`, color: C.text, outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px', color: C.muted }}>No matching drift events found.</div>
          ) : filtered.map((u, i) => (
            <Card key={i} style={{ borderLeft: (u.drift_score || 0) > 80 ? `4px solid ${C.accent3}` : `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '11px', color: C.accent, fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{u.category}</div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: C.text }}>{u.title}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: (u.drift_score || 0) > 80 ? C.accent3 : (u.drift_score || 0) > 50 ? C.amber : C.green, fontFamily: C.fontHeader }}>{(u.drift_score || 0)}%</div>
                  <div style={{ fontSize: '10px', color: C.muted }}>DRIFT SCORE</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: C.muted, lineHeight: 1.6, marginBottom: '16px' }}>{u.content}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: C.muted }}>
                  By <span style={{ color: C.text }}>{u.author}</span> · {u.date}
                </div>
                <Button variant="ghost" style={{ fontSize: '12px' }}>Analyze Trace →</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
