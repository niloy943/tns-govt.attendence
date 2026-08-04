import React from 'react';
import { 
  Users, 
  UserCheck, 
  FileText, 
  AlertTriangle, 
  UserX, 
  Building2, 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart2, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEmployees } from '../../hooks/useEmployees';
import { dummyVacantPosts } from '../../data/dummy/employees';

export default function EmployeeDashboard() {
  const { data: employees = [] } = useEmployees();

  // Compute Metrics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active' || e.status === 'active').length;
  const onLeaveEmployees = employees.filter(e => e.status === 'On Leave').length;
  const suspendedEmployees = employees.filter(e => e.status === 'Suspended').length;
  const retiredEmployees = employees.filter(e => e.status === 'Retired').length;
  const vacantPostsCount = dummyVacantPosts.reduce((acc, curr) => acc + curr.vacantCount, 0);

  // Ministry Distribution Data
  const ministryDist = [
    { name: "Ministry of Women and Children Affairs", count: employees.filter(e => e.ministryId === 2).length, color: "#059669" },
    { name: "Ministry of Social Welfare", count: employees.filter(e => e.ministryId === 1).length, color: "#2563EB" },
    { name: "Ministry of Information & Broadcasting", count: 12, color: "#7C3AED" },
    { name: "Ministry of Public Administration", count: 18, color: "#D97706" }
  ];

  // Department Distribution Data
  const deptDist = [
    { name: "Administration & Operations", count: 14, percent: "35%" },
    { name: "Legal & Support Services", count: 8, percent: "20%" },
    { name: "Planning & Evaluation", count: 10, percent: "25%" },
    { name: "Maternal & Child Development", count: 8, percent: "20%" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        border: '1px solid #1E293B',
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            backgroundColor: 'rgba(5, 150, 105, 0.2)',
            border: '1px solid #059669',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={30} color="#34D399" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              Government Employee Management Dashboard
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.25rem 0 0 0' }}>
              Real-time analytics, officer counts, ministry distribution & cadre post vacancy tracker
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/employee/list" className="btn btn-primary">
            View Directory <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <KpiCard title="Total Employees" value={totalEmployees} icon={Users} color="#059669" bg="#ECFDF5" />
        <KpiCard title="Active Employees" value={activeEmployees} icon={UserCheck} color="#2563EB" bg="#EFF6FF" />
        <KpiCard title="On Leave" value={onLeaveEmployees} icon={FileText} color="#D97706" bg="#FEF3C7" />
        <KpiCard title="Suspended" value={suspendedEmployees} icon={AlertTriangle} color="#DC2626" bg="#FEE2E2" />
        <KpiCard title="Retired" value={retiredEmployees} icon={UserX} color="#6B7280" bg="#F3F4F6" />
        <KpiCard title="Vacant Posts" value={vacantPostsCount} icon={Building2} color="#7C3AED" bg="#F3E8FF" />
      </div>

      {/* Analytics & Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        
        {/* Ministry Distribution Chart */}
        <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Ministry Distribution</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: 0 }}>Officer breakdown across central ministries</p>
            </div>
            <PieIcon size={20} style={{ color: 'var(--primary)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {ministryDist.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--slate-text)' }}>{item.name}</span>
                  <span style={{ fontWeight: 800, color: item.color }}>{item.count} Officers</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (item.count / totalEmployees) * 100)}%`, height: '100%', backgroundColor: item.color, borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Distribution Chart */}
        <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Department Distribution</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: 0 }}>Workforce deployment by operational wings</p>
            </div>
            <BarChart2 size={20} style={{ color: '#2563EB' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {deptDist.map((dept, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.875rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', border: '1px solid var(--slate-border)' }}>
                <div>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 700, margin: 0 }}>{dept.name}</p>
                  <p style={{ fontSize: '0.725rem', color: 'var(--slate-muted)', margin: 0 }}>{dept.count} Officers Assigned</p>
                </div>
                <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>{dept.percent}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Employment Trend & Vacant Posts Tracker */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        
        {/* Employment Trend */}
        <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Employment & Cadre Recruitment Trend</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: 0 }}>Monthly officer onboarding & service status changes</p>
            </div>
            <TrendingUp size={20} style={{ color: '#059669' }} />
          </div>

          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.75rem', padding: '1rem 0.5rem 0 0.5rem', borderBottom: '1px solid var(--slate-border)' }}>
            {[
              { month: 'Jan', count: 32 },
              { month: 'Feb', count: 45 },
              { month: 'Mar', count: 28 },
              { month: 'Apr', count: 50 },
              { month: 'May', count: 62 },
              { month: 'Jun', count: 55 },
              { month: 'Jul', count: 70 },
              { month: 'Aug', count: 85 }
            ].map((bar, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)' }}>{bar.count}</span>
                <div style={{ width: '100%', maxWidth: '32px', height: `${(bar.count / 85) * 120}px`, backgroundColor: i === 7 ? '#059669' : '#93C5FD', borderRadius: '0.375rem 0.375rem 0 0', transition: 'height 0.4s ease' }} />
                <span style={{ fontSize: '0.725rem', color: 'var(--slate-muted)', fontWeight: 600 }}>{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vacant Cadre Posts */}
        <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Vacant Government Posts</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: 0 }}>Pending officer allocation</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {dummyVacantPosts.map(post => (
              <div key={post.id} style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #FDE68A', backgroundColor: '#FEFCE8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#B45309' }}>{post.designation}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#DC2626', backgroundColor: '#FEE2E2', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>
                    {post.vacantCount} Vacant
                  </span>
                </div>
                <p style={{ fontSize: '0.725rem', color: '#92400E', margin: '0.2rem 0 0 0', fontWeight: 600 }}>
                  {post.ministryName} ({post.grade})
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color, bg }) {
  return (
    <div className="card-base" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={24} />
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-text)', margin: '0.1rem 0 0 0' }}>{value}</h2>
      </div>
    </div>
  );
}
