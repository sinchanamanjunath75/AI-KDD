import React, { useState, useEffect } from 'react';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { C, API_BASE } from '../theme/theme';

export const Profile = ({ user, notify }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const exportToCSV = () => {
    if (history.length === 0) return;
    
    const headers = ['Model', 'Score', 'Diagnosis', 'Date', 'Content'];
    const rows = history.map(h => [
      h.model_name,
      h.score,
      h.diagnosis,
      h.date,
      `"${h.content.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `drift_intel_report_${user.email.split('@')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Intel report exported successfully!', 'success');
  };

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      fetch(`${API_BASE}/user/history?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          setHistory(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="page" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            boxShadow: `0 0 20px ${C.glow}`
          }}>
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <h1 style={{ fontFamily: C.fontHeader, fontSize: '32px', fontWeight: 800, marginBottom: '4px' }}>{user?.name || 'User Profile'}</h1>
            <p style={{ color: C.accent, fontWeight: 600, fontSize: '14px' }}>{user?.email}</p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
              <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.muted }}>PRO MEMBER</span>
              <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(76, 175, 80, 0.1)', border: `1px solid ${C.green}`, color: C.green }}>ACCOUNT ACTIVE</span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Button variant="outline" onClick={exportToCSV} disabled={history.length === 0}>
              📥 Export Intel Report
            </Button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* History Section */}
          <div style={{ gridColumn: 'span 2' }}>
            <h2 style={{ fontFamily: C.fontHeader, fontSize: '18px', marginBottom: '20px' }}>Intelligence History</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {loading ? (
                <Card style={{ textAlign: 'center', padding: '40px', color: C.muted }}>Loading neural records...</Card>
              ) : history.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '40px', color: C.muted }}>No drift traces detected yet.</Card>
              ) : history.map((check, i) => (
                <Card key={i} style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: C.accent, fontWeight: 700, textTransform: 'uppercase' }}>{check.model_name}</div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: C.text }}>{check.diagnosis}</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: check.score > 80 ? C.accent3 : C.green }}>{check.score}%</div>
                      <div style={{ fontSize: '10px', color: C.muted }}>DRIFT</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: '10px' }}>
                    Analyzed on {check.date}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Settings Sidebar */}
          <div>
            <h2 style={{ fontFamily: C.fontHeader, fontSize: '18px', marginBottom: '20px' }}>Security & Config</h2>
            <Card style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '8px' }}>API Keys</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input readOnly value="dk_live_••••••••••••" style={{ flex: 1, padding: '8px', borderRadius: '4px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.muted, fontSize: '12px' }} />
                  <Button variant="ghost" style={{ fontSize: '10px' }}>RESET</Button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '8px' }}>Webhooks</label>
                <div style={{ fontSize: '12px', color: C.muted }}>0 active listeners</div>
              </div>
              <Button variant="outline" style={{ border: `1px solid ${C.accent3}`, color: C.accent3 }}>Delete Mission Data</Button>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};
