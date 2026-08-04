import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import GovtLogo from '../components/layout/GovtLogo';

const googleAccounts = [
  {
    name: "Tariqul Islam",
    email: "superadmin@tns.gov.bd",
    desc: "System Super Admin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  },
  {
    name: "Nusrat Jahan",
    email: "admin.mof@tns.gov.bd",
    desc: "Ministry of Finance Admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  }
];

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'password'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setStep('password');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (selectedEmail) => {
    setGoogleModalOpen(false);
    setError('');
    
    // Visually fill up the inputs with the decrypted Google credentials
    setEmail(selectedEmail);
    setPassword('password');
    setStep('password');
    
    // Add a slight delay (500ms) for visual effect so the user sees the fields populated
    setLoading(true);
    setTimeout(async () => {
      try {
        await login(selectedEmail, 'password');
      } catch (err) {
        setError(err.message || 'Google authentication failed.');
        setLoading(false);
      }
    }, 500);
  };

  const handleBack = () => {
    setError('');
    setPassword('');
    setStep('email');
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      backgroundImage: 'radial-gradient(circle at top right, rgba(5, 150, 105, 0.05), transparent), radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.05), transparent)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '1.25rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '1.25rem',
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Government Seal & Brand Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem', marginBottom: '2rem', textAlign: 'center' }}>
          <GovtLogo style={{ width: '3.75rem', height: '3.75rem', border: '3px solid #006A4E', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
          <div>
            <h1 style={{ color: '#0F172A', fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '0.025em' }}>
              Attendance Maintenance Portal
            </h1>
            <p style={{ color: '#475569', fontSize: '0.75rem', margin: '0.25rem 0 0 0', fontWeight: 500 }}>
              Government of Bangladesh
            </p>
          </div>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            color: '#991B1B',
            fontSize: '0.8125rem',
            fontWeight: 500,
            marginBottom: '1.25rem',
            boxSizing: 'border-box'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === 'email' && (
          <form onSubmit={handleNextStep} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.625rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '0.5rem',
                    color: '#0F172A',
                    outline: 'none',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  placeholder="name@ministry.gov.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#059669',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s, transform 0.1s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#047857'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            >
              Next <ArrowRight size={16} />
            </button>

            {/* Social Authentication Connectors */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', margin: '0.75rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>or sign in with</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Google styled button */}
              <button
                type="button"
                onClick={() => setGoogleModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  color: '#1E293B',
                  border: '1px solid #E2E8F0',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background-color 0.2s, border-color 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                {/* SVG Google Logo */}
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.25rem' }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Password Form */}
        {step === 'password' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.625rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '0.5rem',
                    color: '#0F172A',
                    outline: 'none',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#059669',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s, opacity 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#047857'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleBack}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'transparent',
                color: '#475569',
                border: '1px solid #E2E8F0',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s, border-color 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          </form>
        )}
      </div>

      {/* Mock Google Account Chooser Modal */}
      {googleModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '1rem',
            border: '1px solid #E2E8F0',
            padding: '2rem',
            width: '100%',
            maxWidth: '380px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            {/* Google Brand Header */}
            <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '1rem' }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.25rem 0' }}>Choose an account</h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: '0 0 1.5rem 0' }}>to continue to Attendance Maintenance Portal</p>

            {/* Account List */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {googleAccounts.map((acc, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleGoogleLogin(acc.email)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B', margin: 0 }}>{acc.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden' }}>{acc.email}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => setGoogleModalOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748B',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0.5rem',
                textDecoration: 'underline'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#1E293B'}
              onMouseOut={(e) => e.currentTarget.style.color = '#64748B'}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
