import React, { useState } from 'react';

// Theme & Config
import { C } from './theme/theme';

// Layout & Shared
import { Navbar } from './components/shared/Navbar';
import { Stars, Scanline } from './components/visuals/BackgroundDecor';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { GenAIUpdates } from './pages/GenAIUpdates';
import { Contact } from './pages/Contact';
import { Profile } from './pages/Profile';

// UX Elements
import { NotificationToast } from './components/shared/NotificationToast';

// Global Styles (Inline)
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

  body {
    margin: 0;
    background-color: ${C.bg};
    color: ${C.text};
    font-family: ${C.fontBody};
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, .font-header {
    font-family: ${C.fontHeader};
  }

  .page {
    min-height: 100vh;
    animation: fadeIn 0.6s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.5; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.5; }
  }

  .input-field {
    transition: all 0.2s ease;
  }

  .input-field:focus {
    border-color: ${C.accent} !important;
    box-shadow: 0 0 0 2px ${C.glow};
  }
`;

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setPage('dashboard');
    notify(`Welcome back, ${userData.name}!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('landing');
    notify('Successfully logged out.', 'info');
  };

  return (
    <>
      <style>{css}</style>
      
      {/* Background Atmosphere */}
      <Stars />
      <Scanline />

      {/* Global Notifications */}
      {notification && (
        <NotificationToast 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Navigation */}
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />

      {/* Main Content Router */}
      <main>
        {page === 'landing'   && <Landing setPage={setPage} />}
        {page === 'login'     && <Login setPage={setPage} onLogin={handleLogin} notify={notify} />}
        {page === 'signup'    && <Signup setPage={setPage} onLogin={handleLogin} notify={notify} />}
        {page === 'updates'   && <GenAIUpdates user={user} setPage={setPage} notify={notify} />}
        {page === 'contact'   && <Contact setPage={setPage} notify={notify} />}
        {page === 'profile'   && (
          user ? <Profile user={user} notify={notify} /> : <Login setPage={setPage} onLogin={handleLogin} notify={notify} />
        )}
        {page === 'dashboard' && (
          user ? <Dashboard user={user} setPage={setPage} notify={notify} /> : <Login setPage={setPage} onLogin={handleLogin} notify={notify} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '60px 24px', 
        textAlign: 'center', 
        borderTop: `1px solid ${C.border}`,
        marginTop: '80px',
        color: C.muted,
        fontSize: '13px'
      }}>
        <div style={{ fontFamily: C.fontHeader, color: C.text, fontSize: '16px', marginBottom: '16px' }}>DRIFT.AI</div>
        <p>© 2026 DRIFT.AI — Documentation Intelligence Platform. All rights reserved.</p>
        <div style={{ marginTop: '16px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <span>Privacy</span>
          <span>Terms</span>
          <span>Security</span>
        </div>
      </footer>
    </>
  );
}