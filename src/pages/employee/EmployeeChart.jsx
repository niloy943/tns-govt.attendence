import React from 'react';
import { useEmployees } from '../../hooks/useEmployees';

export default function EmployeeChart() {
  const { data: employees, isLoading } = useEmployees();

  if (isLoading) return <div style={{ height: '400px' }} className="skeleton-shimmer"></div>;

  const ceo = (employees || []).find(e => e.level === 'ceo') || {
    name: "Abul Kalam Azad",
    designation: "CHIEF EXECUTIVE OFFICER",
    department: "Management",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  };

  const vps = (employees || []).filter(e => e.level === 'vp' || e.level === 'director');
  const managers = (employees || []).filter(e => e.level === 'manager');
  const asstManagers = (employees || []).filter(e => e.level === 'asst_manager');
  const staffList = (employees || []).filter(e => e.level === 'staff');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Top Banner matching Image 1 */}
      <div style={{
        backgroundColor: '#8B5CF6',
        color: '#FFFFFF',
        padding: '0.875rem 1.5rem',
        borderRadius: '0.75rem',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '1rem',
        letterSpacing: '0.02em',
        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)'
      }}>
        Employee Organization Chart
      </div>

      {/* Main Hierarchy Card */}
      <div className="card-base" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* CEO Node */}
        <div style={{
          border: '2px solid #6366F1',
          borderRadius: '1rem',
          padding: '1.25rem 2rem',
          backgroundColor: '#FFFFFF',
          textAlign: 'center',
          minWidth: '240px',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.08)'
        }}>
          <img
            src={ceo.avatar}
            alt={ceo.name}
            style={{ width: '54px', height: '54px', borderRadius: '9999px', objectFit: 'cover', margin: '0 auto 0.5rem auto' }}
          />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>{ceo.name}</h3>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4338CA', textTransform: 'uppercase', marginTop: '0.125rem' }}>{ceo.designation}</p>
          <p style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.125rem' }}>{ceo.department}</p>
        </div>

        {/* Tree Line Connector */}
        <div style={{ width: '2px', height: '30px', backgroundColor: '#CBD5E1', margin: '0.25rem 0' }} />

        {/* Horizontal Connector Line for VPs */}
        <div style={{ width: '50%', height: '2px', backgroundColor: '#CBD5E1' }} />

        {/* Level 2: VPs / Directors Grid */}
        <div style={{ display: 'flex', gap: '3rem', marginTop: '0.25rem' }}>
          {vps.map((vp) => (
            <div key={vp.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '2px', height: '20px', backgroundColor: '#CBD5E1' }} />
              <div style={{
                border: '2px solid #C084FC',
                borderRadius: '1rem',
                padding: '1rem 1.5rem',
                backgroundColor: '#FFFFFF',
                textAlign: 'center',
                minWidth: '220px',
                boxShadow: '0 4px 12px rgba(192, 132, 252, 0.08)'
              }}>
                <img
                  src={vp.avatar}
                  alt={vp.name}
                  style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover', margin: '0 auto 0.375rem auto' }}
                />
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E293B' }}>{vp.name}</h4>
                <p style={{ fontSize: '0.675rem', fontWeight: 800, color: '#7E22CE', textTransform: 'uppercase', marginTop: '0.125rem' }}>{vp.designation}</p>
                <p style={{ fontSize: '0.675rem', color: '#94A3B8', marginTop: '0.125rem' }}>{vp.department}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tree Line to Manager */}
        <div style={{ width: '2px', height: '30px', backgroundColor: '#CBD5E1', marginTop: '0.5rem' }} />

        {/* Level 3: Manager Node */}
        {managers.map((mgr) => (
          <div key={mgr.id} style={{
            border: '2px solid #34D399',
            borderRadius: '1rem',
            padding: '1rem 1.75rem',
            backgroundColor: '#FFFFFF',
            textAlign: 'center',
            minWidth: '220px',
            boxShadow: '0 4px 12px rgba(52, 211, 153, 0.08)'
          }}>
            <img
              src={mgr.avatar}
              alt={mgr.name}
              style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover', margin: '0 auto 0.375rem auto' }}
            />
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E293B' }}>{mgr.name}</h4>
            <p style={{ fontSize: '0.675rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', marginTop: '0.125rem' }}>{mgr.designation}</p>
            <p style={{ fontSize: '0.675rem', color: '#94A3B8', marginTop: '0.125rem' }}>{mgr.department}</p>
          </div>
        ))}

        {/* Tree Line to Asst Managers */}
        <div style={{ width: '2px', height: '30px', backgroundColor: '#CBD5E1', marginTop: '0.25rem' }} />
        <div style={{ width: '30%', height: '2px', backgroundColor: '#CBD5E1' }} />

        {/* Level 4: Asst Managers Grid */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.25rem' }}>
          {asstManagers.map((am) => (
            <div key={am.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '2px', height: '20px', backgroundColor: '#CBD5E1' }} />
              <div style={{
                border: '2px solid #FDE047',
                borderRadius: '0.875rem',
                padding: '0.875rem 1.25rem',
                backgroundColor: '#FFFBEB',
                textAlign: 'center',
                minWidth: '190px'
              }}>
                <img
                  src={am.avatar}
                  alt={am.name}
                  style={{ width: '42px', height: '42px', borderRadius: '9999px', objectFit: 'cover', margin: '0 auto 0.375rem auto' }}
                />
                <h5 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1E293B' }}>{am.name}</h5>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', marginTop: '0.125rem' }}>{am.designation}</p>
                <p style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.125rem' }}>{am.department}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Staff & Associates Header */}
        <div style={{
          width: '100%',
          textAlign: 'center',
          margin: '2.5rem 0 1.5rem 0',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--slate-border)'
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#64748B',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            STAFF & ASSOCIATES
          </span>
        </div>

        {/* Staff Cards Grid (Matching Image 1 bottom matrix) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          width: '100%'
        }}>
          {staffList.map((stf) => (
            <div key={stf.id} style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid var(--slate-border)',
              borderRadius: '0.75rem',
              padding: '0.875rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <img
                src={stf.avatar}
                alt={stf.name}
                style={{ width: '38px', height: '38px', borderRadius: '9999px', objectFit: 'cover', marginBottom: '0.375rem' }}
              />
              <h6 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                {stf.name}
              </h6>
              <p style={{ fontSize: '0.675rem', color: 'var(--slate-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                {stf.designation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
