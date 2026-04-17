import React, { useState } from 'react';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { C, API_BASE } from '../theme/theme';

export const Signup = ({ setPage, onLogin }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', plan: 'pro' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data);
      } else {
        setError(data.error || 'Signup failed.');
      }
    } catch (err) {
      setError('Connection refused. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '24px' 
    }}>
      <Card style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: C.fontHeader, fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: C.muted, fontSize: '14px' }}>Join the DRIFT.AI documentation platform</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(255, 77, 109, 0.1)', 
            border: `1px solid ${C.accent3}`, 
            borderRadius: '8px', 
            padding: '12px', 
            marginBottom: '20px', 
            fontSize: '13px', 
            color: C.accent3 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '6px' }}>Full Name</label>
              <input 
                className="input-field" 
                placeholder="Jane Doe"
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '6px' }}>Plan</label>
              <select 
                className="input-field" 
                value={form.plan} 
                onChange={e => setForm({ ...form, plan: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text }}
              >
                <option value="free">Free</option>
                <option value="pro">Pro ($49/mo)</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          
          <div>
            <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '6px' }}>Work Email</label>
            <input 
              className="input-field" 
              type="email" 
              placeholder="jane@company.com"
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '6px' }}>Password</label>
              <input 
                className="input-field" 
                type="password" 
                placeholder="••••••••"
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '6px' }}>Confirm</label>
              <input 
                className="input-field" 
                type="password" 
                placeholder="••••••••"
                value={form.confirm} 
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text }}
              />
            </div>
          </div>
          
          <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '16px' }}>
            {loading ? 'Creating Account...' : '🚀 Start Scanning'}
          </Button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: C.muted }}>
          Already have an account?{' '}
          <span 
            style={{ color: C.accent, cursor: 'pointer', fontWeight: 600 }} 
            onClick={() => setPage('login')}
          >
            Sign in
          </span>
        </div>
      </Card>
    </div>
  );
};
