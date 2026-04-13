import React, { useState, useEffect } from 'react';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { NeuralNet } from '../components/visuals/NeuralNet';
import { Globe3D } from '../components/visuals/Globe3D';
import { Waveform } from '../components/visuals/Waveform';
import { C, API_BASE } from '../theme/theme';
import { ModelChecker } from '../components/dashboard/ModelChecker';
import { DriftHistoryChart } from '../components/dashboard/DriftHistoryChart';

export const Dashboard = ({ user, setPage, notify }) => {
  const [history, setHistory] = useState([]);
  
  const fetchHistory = () => {
    if (user?.email) {
      fetch(`${API_BASE}/user/history?email=${user.email}`)
        .then(res => res.json())
        .then(setHistory)
        .catch(() => notify('Failed to fetch neural history.', 'error'));
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const avgDrift = history.length > 0 
    ? (history.reduce((acc, h) => acc + (h.score || 0), 0) / history.length).toFixed(1)
    : 0;

  return (
    <div className="page" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ color: C.green, fontSize: '12px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.green, animation: 'pulse 2s infinite' }} />
              ON-DEMAND ANALYTICS READY
            </div>
            <h1 style={{ fontFamily: C.fontHeader, fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>Mission Control</h1>
            <p style={{ color: C.muted, fontSize: '14px' }}>Welcome back, <span style={{ color: C.accent }}>{user?.name || 'Commander'}</span></p>
          </div>
          
          {/* Smart Status Summary */}
          <div style={{ 
            background: 'rgba(76, 175, 80, 0.05)', 
            border: `1px solid ${C.green}`, 
            borderRadius: '12px', 
            padding: '12px 20px',
            maxWidth: '500px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ fontSize: '20px' }}>🤖</div>
            <div style={{ fontSize: '13px', lineHeight: 1.4 }}>
              <span style={{ color: C.green, fontWeight: 700 }}>AI ADVISOR:</span> 
              {history.length === 0 ? ' Network is initialized. Please submit a model content for drift calibration.' : ` Based on your last ${history.length} checks, the average drift is ${avgDrift}%.`}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="outline" onClick={() => setPage('profile')}>View History</Button>
            <Button onClick={() => setPage('landing')}>Network Home</Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '40px' }}>
          
          {/* Left: Input & Interaction */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <ModelChecker user={user} notify={notify} onResult={fetchHistory} />
            
            <Card style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: C.fontHeader }}>Neural Drift Timeline</h3>
                <span style={{ fontSize: '12px', color: C.accent }}>HISTORICAL TRENDS</span>
              </div>
              <div style={{ padding: '24px' }}>
                <DriftHistoryChart data={history} />
              </div>
            </Card>
          </div>

          {/* Right: Visual Context & Secondary Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: C.muted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Personal Avg Drift</div>
              <div style={{ fontSize: '48px', fontWeight: 800, color: C.accent, fontFamily: C.fontHeader, marginBottom: '4px' }}>{avgDrift}%</div>
              <div style={{ fontSize: '11px', color: C.muted }}>Based on your neural session history</div>
            </Card>

            <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', alignSelf: 'flex-start', fontFamily: C.fontHeader }}>Global Node Influence</h3>
              <Globe3D />
              <div style={{ marginTop: '24px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: C.muted, marginBottom: '8px' }}>
                  <span>Network Sync Status</span>
                  <span style={{ color: C.green }}>OPTIMAL</span>
                </div>
                <Waveform color={C.accent} />
              </div>
            </Card>

            <Card>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', fontFamily: C.fontHeader }}>Recent Intelligence Traces</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history.slice(0, 3).map((h, i) => (
                  <div key={i} style={{ padding: '12px', background: C.bgCard2, borderRadius: '8px', border: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: C.text }}>{h.model_name}</span>
                      <span style={{ fontSize: '12px', color: h.score > 80 ? C.accent3 : C.green }}>{h.score}%</span>
                    </div>
                    <div style={{ fontSize: '11px', color: C.muted }}>{h.date}</div>
                  </div>
                ))}
                {history.length === 0 && <div style={{ fontSize: '12px', color: C.muted, textAlign: 'center', padding: '10px' }}>No traces recorded.</div>}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};
