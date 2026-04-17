import React, { useState } from 'react';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { C, API_BASE } from '../theme/theme';

export const Login = ({ setPage, onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data);
      } else {
        setError(data.error || 'Login failed.');
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
      <Card style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '16px', 
            margin: '0 auto 16px',
            background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '28px' 
          }}>📄</div>
          <h1 style={{ fontFamily: C.fontHeader, fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: C.muted, fontSize: '14px' }}>Sign in to Doc Scanner</p>
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

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Email Address</label>
            <input 
              className="input-field" 
              type="email" 
              placeholder="name@company.com"
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text, outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Password</label>
            <input 
              className="input-field" 
              type="password" 
              placeholder="••••••••"
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text, outline: 'none' }}
            />
          </div>
          
          <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </Button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: C.muted }}>
          Don't have an account?{' '}
          <span 
            style={{ color: C.accent, cursor: 'pointer', fontWeight: 600 }} 
            onClick={() => setPage('signup')}
          >
            Create one
          </span>
        </div>
      </Card>
    </div>
  );
};
