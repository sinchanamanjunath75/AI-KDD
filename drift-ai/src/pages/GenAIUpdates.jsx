import React, { useState, useEffect } from 'react';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { C, API_BASE } from '../theme/theme';

const DEFAULT_DOCUMENTS = [
  {
    id: 'doc-auth-1',
    title: 'Authentication Runbook',
    section: 'Login and Session Setup',
    content: 'Our app uses legacy auth with manual deployment steps and GPT-3.5 guidance in onboarding docs.',
    last_updated: '2026-03-08'
  },
  {
    id: 'doc-api-2',
    title: 'API Integration Guide',
    section: 'Endpoint Versioning',
    content: 'Client applications should call the old endpoint for stable compatibility.',
    last_updated: '2026-03-11'
  },
  {
    id: 'doc-runtime-3',
    title: 'Backend Runtime Notes',
    section: 'Environment and Versions',
    content: 'Production deployment currently targets Python 3.10. TODO: verify if any upgrades happened.',
    last_updated: '2026-03-14'
  }
];

export const GenAIUpdates = ({ user, setPage, notify }) => {
  const [updates, setUpdates] = useState([]);
  const [signals, setSignals] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    fetch(`${API_BASE}/updates`)
      .then(res => res.json())
      .then((data) => {
        setUpdates(data);
        const mappedSignals = (data || []).map((u) => ({
          id: u.id,
          type: 'change-log',
          title: u.title,
          content: u.content,
          date: u.date
        }));
        setSignals(mappedSignals);
      })
      .catch(() => notify?.('Unable to load update signals.', 'error'));
  }, []);

  const runConsistencyCheck = async () => {
    setLoadingAnalysis(true);
    try {
      const response = await fetch(`${API_BASE}/docs/consistency-check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: DEFAULT_DOCUMENTS,
          signals
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Consistency check failed');
      }
      setAnalysis(data);
      notify?.('Documentation consistency scan completed.', 'success');
    } catch (error) {
      notify?.(error.message || 'Failed to run consistency scan.', 'error');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const filtered = updates.filter(u => 
    u.title.toLowerCase().includes(search.toLowerCase()) || 
    u.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: C.fontHeader, fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>Documentation Integrity Center</h1>
          <p style={{ color: C.muted, fontSize: '16px' }}>
            Compare existing documentation against incoming tickets, change logs, and updates to catch knowledge drift.
          </p>
        </div>

        <Card style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: C.accent, fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>CONTINUOUS CONSISTENCY CHECK</div>
              <div style={{ color: C.muted, fontSize: '14px' }}>
                Analyze {DEFAULT_DOCUMENTS.length} documentation sections against {signals.length} latest update signals.
              </div>
            </div>
            <Button onClick={runConsistencyCheck} disabled={loadingAnalysis}>
              {loadingAnalysis ? 'Analyzing...' : 'Run Documentation Scan'}
            </Button>
          </div>
        </Card>

        {analysis && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            <Card>
              <div style={{ fontSize: '11px', color: C.muted, marginBottom: '8px' }}>DOCUMENTS CHECKED</div>
              <div style={{ fontSize: '32px', color: C.text, fontWeight: 800 }}>{analysis.summary.total_documents}</div>
            </Card>
            <Card>
              <div style={{ fontSize: '11px', color: C.muted, marginBottom: '8px' }}>SIGNALS COMPARED</div>
              <div style={{ fontSize: '32px', color: C.text, fontWeight: 800 }}>{analysis.summary.signals_compared}</div>
            </Card>
            <Card>
              <div style={{ fontSize: '11px', color: C.muted, marginBottom: '8px' }}>FLAGGED SECTIONS</div>
              <div style={{ fontSize: '32px', color: C.accent3, fontWeight: 800 }}>{analysis.summary.flagged_documents}</div>
            </Card>
            <Card>
              <div style={{ fontSize: '11px', color: C.muted, marginBottom: '8px' }}>AVERAGE RISK</div>
              <div style={{ fontSize: '32px', color: C.amber, fontWeight: 800 }}>{analysis.summary.average_risk}%</div>
            </Card>
          </div>
        )}

        {analysis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
            {analysis.flagged.length === 0 ? (
              <Card>
                <div style={{ color: C.green, fontWeight: 700 }}>No documentation inconsistencies were flagged in this scan.</div>
              </Card>
            ) : analysis.flagged.map((item) => (
              <Card key={item.document_id} style={{ borderLeft: `4px solid ${item.risk_score > 70 ? C.accent3 : C.amber}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', gap: '18px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: C.accent, textTransform: 'uppercase', fontWeight: 700 }}>{item.section}</div>
                    <h3 style={{ margin: '8px 0 0', fontSize: '18px' }}>{item.document_title}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: item.risk_score > 70 ? C.accent3 : C.amber, fontSize: '22px', fontWeight: 800 }}>{item.risk_score}%</div>
                    <div style={{ fontSize: '11px', color: C.muted }}>RISK SCORE</div>
                  </div>
                </div>
                {item.gaps.length > 0 && <p style={{ fontSize: '13px', color: C.muted, marginBottom: '8px' }}>{item.gaps[0]}</p>}
                <p style={{ fontSize: '13px', color: C.text, marginBottom: '12px' }}>{item.suggested_update}</p>
                <div style={{ fontSize: '12px', color: C.muted }}>
                  Signals: {item.matched_signals.map((sig) => sig.title).join(' | ')}
                </div>
              </Card>
            ))}
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <input 
            className="input-field"
            placeholder="Search updates, tickets, or change notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '16px 24px', fontSize: '16px', borderRadius: '16px', background: C.bgCard, border: `1px solid ${C.border}`, color: C.text, outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '10px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>Incoming Signals Feed</h2>
          {user && <Button variant="outline" onClick={() => setPage('dashboard')}>Back to Dashboard</Button>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px', color: C.muted }}>No matching update signals found.</div>
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
