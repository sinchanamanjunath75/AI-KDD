import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { C, API_BASE } from '../../theme/theme';
import { DriftRing } from '../visuals/DriftRing';

export const ModelChecker = ({ user, notify, onResult }) => {
  const [model, setModel] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!model || !content) {
      notify('Please enter both model name and content.', 'warning');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/drift/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_name: model,
          content: content,
          user_email: user?.email || 'anonymous'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        notify('Drift analysis complete!', 'success');
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', fontFamily: C.fontHeader, color: C.accent }}>
          Analyze Neural Drift
        </h3>
        <form onSubmit={handleCheck} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Target Model</label>
            <input 
              className="input-field" 
              placeholder="e.g. GPT-4o, Claude 3.5, Custom-v1"
              value={model} 
              onChange={e => setModel(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text, outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Model Response Content</label>
            <textarea 
              className="input-field" 
              rows="4"
              placeholder="Paste the output you want to check for drift..."
              value={content} 
              onChange={e => setContent(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text, outline: 'none', resize: 'none' }}
            />
          </div>
          <Button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Processing Neural Traces...' : '⚡ Detect Drift'}
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
              <h3 style={{ fontSize: '14px', color: C.muted, textTransform: 'uppercase', marginBottom: '4px' }}>Analysis for {result.model_name}</h3>
              <div style={{ fontSize: '20px', fontWeight: 700, color: C.text }}>{result.diagnosis}</div>
            </div>
            <DriftRing score={result.score} size={80} color={result.score > 80 ? C.accent3 : result.score > 50 ? C.amber : C.green} />
          </div>
          <p style={{ fontSize: '13px', color: C.muted, lineHeight: 1.5 }}>
            Trace generated on {result.date}. Result has been saved to your account history.
          </p>
        </Card>
      )}
    </div>
  );
};
