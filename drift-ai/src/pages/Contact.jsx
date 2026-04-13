import React, { useState } from 'react';
import { Card } from '../components/shared/Card';
import { Button } from '../components/shared/Button';
import { C } from '../theme/theme';

export const Contact = ({ setPage }) => {
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontFamily: C.fontHeader, fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>Contact Intelligence</h1>
          <p style={{ color: C.muted, fontSize: '16px' }}>Need custom drift analysis or enterprise support? Connect with our neural experts.</p>
        </div>

        <Card style={{ padding: '40px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📡</div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Transmission Received</h2>
              <p style={{ color: C.muted }}>Our team will process your inquiry and respond within 2 neural cycles.</p>
              <Button style={{ marginTop: '24px' }} onClick={() => setPage('landing')}>Return to Home</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '8px' }}>Name</label>
                  <input className="input-field" placeholder="Jane Doe" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text }} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '8px' }}>Email</label>
                  <input className="input-field" type="email" placeholder="jane@acme.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text }} required />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '8px' }}>Subject</label>
                <select className="input-field" style={{ width: '100%', padding: '12px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text, appearance: 'none' }}>
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Enterprise Licensing</option>
                  <option>Partnerships</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: C.muted, display: 'block', marginBottom: '8px' }}>Message</label>
                <textarea className="input-field" rows="5" placeholder="Your transmission..." style={{ width: '100%', padding: '12px', borderRadius: '8px', background: C.bgCard2, border: `1px solid ${C.border}`, color: C.text, resize: 'none' }} required />
              </div>
              <Button type="submit" style={{ width: '100%' }}>Send Transmission</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
