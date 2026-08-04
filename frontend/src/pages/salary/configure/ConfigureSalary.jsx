import React, { useState } from 'react';
import { Edit3, Check, Save } from 'lucide-react';
import SalaryPolicyCard from './SalaryPolicyCard';
import DeductionRuleCard from './DeductionRuleCard';
import AttendanceRuleCard from './AttendanceRuleCard';
import PayrollRuleCard from './PayrollRuleCard';
import BudgetRuleCard from './BudgetRuleCard';
import NotificationRuleCard from './NotificationRuleCard';

export default function ConfigureSalary() {
  const [salaryPolicy, setSalaryPolicy] = useState({
    id: 1,
    working_days: 26,
    salary_policy: 'working_days',
    half_day_rule: '50_percent',
    late_policy: 'deduct_after_3',
    pf_percentage: 10,
    tax_percentage: 5,
    warning_percentage: 90,
    critical_percentage: 100,
    currency: 'BDT',
    payroll_date: 25,
    lock_date: 30,
    auto_lock: true,
    allow_regeneration: false,
    block_payroll: 'YES',
    created_by: 'Super Admin (Tariqul Islam)',
    updated_by: 'Super Admin (Tariqul Islam)'
  });

  const [activeEditCard, setActiveEditCard] = useState(null); // 'policy' | 'deduction' | null

  const handleSave = (e) => {
    if (e) e.preventDefault();
    alert("Salary Configuration updated in salary_settings database schema!");
    setActiveEditCard(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      
      {/* Overview Header */}
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-text)', margin: 0 }}>
          Configure Salary & System Rules
        </h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)', margin: '0.25rem 0 0 0' }}>
          Backend Pipeline: <code style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>SalarySettingController ➔ SalarySettingService ➔ SalarySettingRepository ➔ salary_settings</code>
        </p>
      </div>

      {/* SUMMARY CARDS SPECIFICATION (Flowchart Spec) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Salary Policy Summary Card */}
        <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-border)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, margin: 0 }}>Salary Policy</h3>
            <button
              onClick={() => setActiveEditCard(activeEditCard === 'policy' ? null : 'policy')}
              className="btn btn-ghost"
              style={{ fontSize: '0.75rem', color: 'var(--primary)', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Edit3 size={14} /> Edit ✎
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-muted)' }}>Working Days</span>
              <strong style={{ color: '#0F172A' }}>{salaryPolicy.working_days}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-muted)' }}>Salary Policy</span>
              <strong style={{ color: '#0F172A', textTransform: 'capitalize' }}>{salaryPolicy.salary_policy.replace('_', ' ')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-muted)' }}>Half Day Rule</span>
              <strong style={{ color: '#0F172A' }}>{salaryPolicy.half_day_rule === '50_percent' ? '50%' : 'No Deduction'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-muted)' }}>Currency</span>
              <strong style={{ color: '#0F172A' }}>{salaryPolicy.currency}</strong>
            </div>
          </div>
        </div>

        {/* Deduction Rules Summary Card */}
        <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid #DC2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-border)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, margin: 0 }}>Deduction Rules</h3>
            <button
              onClick={() => setActiveEditCard(activeEditCard === 'deduction' ? null : 'deduction')}
              className="btn btn-ghost"
              style={{ fontSize: '0.75rem', color: '#DC2626', padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Edit3 size={14} /> Edit ✎
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-muted)' }}>PF</span>
              <strong style={{ color: '#DC2626' }}>{salaryPolicy.pf_percentage}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-muted)' }}>Tax</span>
              <strong style={{ color: '#DC2626' }}>{salaryPolicy.tax_percentage}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-muted)' }}>Late Rule</span>
              <strong style={{ color: '#0F172A' }}>After 3 lates</strong>
            </div>
          </div>
        </div>
      </div>

      {/* FULL MODULAR CONFIGURATION CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <SalaryPolicyCard salaryPolicy={salaryPolicy} setSalaryPolicy={setSalaryPolicy} onSave={handleSave} />
        <DeductionRuleCard salaryPolicy={salaryPolicy} setSalaryPolicy={setSalaryPolicy} onSave={handleSave} />
        <AttendanceRuleCard />
        <PayrollRuleCard salaryPolicy={salaryPolicy} setSalaryPolicy={setSalaryPolicy} onSave={handleSave} />
        <BudgetRuleCard salaryPolicy={salaryPolicy} setSalaryPolicy={setSalaryPolicy} onSave={handleSave} />
        <NotificationRuleCard />
      </div>
    </div>
  );
}
