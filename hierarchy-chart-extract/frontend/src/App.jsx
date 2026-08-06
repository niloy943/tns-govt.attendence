import React from 'react';
import { AuthProvider } from './context/AuthContext';
import EmployeeChart from './pages/employee/EmployeeChart';
import GovtLogo from './components/layout/GovtLogo';
import { Network } from 'lucide-react';

export default function App() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', paddingBottom: '3rem' }}>
        {/* Navigation Bar */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <GovtLogo />
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                Government Organogram System
              </h2>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10B981', margin: 0 }}>
                People's Republic of Bangladesh
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>
            <Network size={16} color="#059669" />
            <span>STANDALONE DEMO</span>
          </div>
        </header>

        {/* Dashboard Main View Container */}
        <main style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 1.5rem' }}>
          <EmployeeChart />
        </main>
      </div>
    </AuthProvider>
  );
}
