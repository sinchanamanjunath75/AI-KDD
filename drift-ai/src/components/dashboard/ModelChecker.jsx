import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { C, API_BASE } from '../../theme/theme';
import { DriftRing } from '../visuals/DriftRing';

export const DocChecker = ({ user, notify, onResult }) => {
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!docContent || !updateContent) {
      notify('Please enter both document content and the update/changelog.', 'warning');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/drift/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_title: docTitle || 'Untitled Document',
          doc_content: docContent,
          update_content: updateContent,
          user_email: user?.email || 'anonymous'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        notify('Documentation drift analysis complete!', 'success');
        if (onResult) onResult(data);
      } else {
        notify(data.error || 'Check failed.', 'error');
      }
    } catch (err) {
      notify('Connection error. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  const severityColor = (severity) => {
    if (severity === 'high') return C.accent3;
    if (severity === 'medium') return C.amber;
    return C.muted;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', fontFamily: C.fontHeader, color: C.accent }}>
          🔍 Scan for Documentation Drift
        </h3>
        <form onSubmit={handleCheck} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Document Title</label>
            <input 
              className="input-field" 
              placeholder="e.g. API Authentication Guide, User Onboarding Docs"
              value={docTitle} 
              onChange={e => setDocTitle(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text, outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Existing Documentation</label>
            <textarea 
              className="input-field" 
              rows="4"
              placeholder="Paste the current documentation content here..."
              value={docContent} 
              onChange={e => setDocContent(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text, outline: 'none', resize: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>New Update / Changelog / Ticket</label>
            <textarea 
              className="input-field" 
              rows="4"
              placeholder="Paste the new ticket, changelog, or update to compare against..."
              value={updateContent} 
              onChange={e => setUpdateContent(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text, outline: 'none', resize: 'none' }}
            />
          </div>
          <Button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Scanning Documentation...' : '🔍 Scan for Drift'}
          </Button>
        </form>
      </Card>

      {result && (
        <Card style={{ 
          background: 'rgba(0, 212, 255, 0.05)', 
          border: `1px solid ${C.accent}`, 
          animation: 'fadeIn 0.5s ease-out' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '14px', color: C.muted, textTransform: 'uppercase', marginBottom: '4px' }}>Analysis for "{result.doc_title}"</h3>
              <div style={{ fontSize: '20px', fontWeight: 700, color: C.text }}>{result.diagnosis}</div>
            </div>
            <DriftRing score={result.score} size={80} color={result.score > 70 ? C.accent3 : result.score > 40 ? C.amber : C.green} />
          </div>
          
          {/* Flagged Sections */}
          {result.flagged_sections && result.flagged_sections.length > 0 && (
            <div style={{ marginTop: '16px', borderTop: `1px solid ${C.border}`, paddingTop: '16px' }}>
              <div style={{ fontSize: '12px', color: C.accent, fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>Flagged Issues</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.flagged_sections.map((flag, i) => (
                  <div key={i} style={{ 
                    padding: '10px 14px', 
                    background: C.bgCard2, 
                    borderRadius: '8px', 
                    borderLeft: `3px solid ${severityColor(flag.severity)}`,
                    fontSize: '13px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: C.text }}>{flag.type}</span>
                      <span style={{ fontSize: '10px', color: severityColor(flag.severity), textTransform: 'uppercase', fontWeight: 700 }}>{flag.severity}</span>
                    </div>
                    <div style={{ color: C.muted, lineHeight: 1.4 }}>{flag.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p style={{ fontSize: '13px', color: C.muted, lineHeight: 1.5, marginTop: '12px' }}>
            Scan completed on {result.date}. Result saved to your scan history.
          </p>
        </Card>
      )}
    </div>
  );
};
