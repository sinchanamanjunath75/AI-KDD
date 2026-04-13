import React from 'react';
import { Button } from '../shared/Button';
import { C } from '../../theme/theme';

export const Navbar = ({ page, setPage, user, onLogout }) => {
  const isAuth = page === 'login' || page === 'signup';
  const isLoggedIn = !!user;
  
  return (
    <nav style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      height: '64px', 
      background: 'rgba(5, 10, 20, 0.8)', 
      backdropFilter: 'blur(12px)', 
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 1000
    }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          cursor: 'pointer',
          fontFamily: C.fontHeader,
          fontWeight: 800,
          color: C.text,
          fontSize: '18px'
        }}
        onClick={() => setPage(isLoggedIn ? 'dashboard' : 'landing')}
      >
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '8px', 
          background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '16px'
        }}>⚡</div>
        DRIFT.AI
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {isLoggedIn ? (
          // Logged In Navigation (Streamlined)
          <>
            <span 
              onClick={() => setPage('dashboard')} 
              style={{ fontSize: '14px', color: page === 'dashboard' ? C.accent : C.muted, fontWeight: 600, cursor: 'pointer' }}
            >
              Dashboard
            </span>
            <span 
              onClick={() => setPage('profile')} 
              style={{ fontSize: '14px', color: page === 'profile' ? C.accent : C.muted, fontWeight: 600, cursor: 'pointer' }}
            >
              Profile
            </span>
            <Button variant="outline" onClick={onLogout} style={{ padding: '6px 16px' }}>Logout</Button>
          </>
        ) : (
          // Logged Out Navigation
          !isAuth && (
            <>
              <span style={{ fontSize: '14px', color: C.muted, cursor: 'pointer' }} onClick={() => setPage('updates')}>Live Feed</span>
              <span style={{ fontSize: '14px', color: C.muted, cursor: 'pointer' }} onClick={() => setPage('contact')}>Contact</span>
              <span onClick={() => setPage('login')} style={{ fontSize: '14px', color: C.muted, cursor: 'pointer' }}>Login</span>
              <Button onClick={() => setPage('signup')} style={{ padding: '6px 16px' }}>Get Started</Button>
            </>
          )
        )}
      </div>
    </nav>
  );
};
