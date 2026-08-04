import React from 'react';
import { AlertTriangle, Save } from 'lucide-react';

export default function BudgetRuleCard({ salaryPolicy, setSalaryPolicy, onSave }) {
  return (
    <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} style={{ color: '#D97706' }} /> Budget Warning & Over-Budget Lock Rules
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>
          Configure budget warning thresholds, critical alerts, and payroll blocking rules
        </p>
      </div>

      <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="form-label" style={{ fontWeight: 700 }}>Warning Threshold %</label>
            <input
              type="number"
              className="form-input"
              value={salaryPolicy.warning_percentage || 90}
              onChange={e => setSalaryPolicy({ ...salaryPolicy, warning_percentage: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 700 }}>Critical Threshold %</label>
            <input
              type="number"
              className="form-input"
              value={salaryPolicy.critical_percentage || 100}
              onChange={e => setSalaryPolicy({ ...salaryPolicy, critical_percentage: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="form-label" style={{ fontWeight: 700 }}>Block Payroll on Budget Exceed</label>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
              <input
                type="radio"
                name="block_payroll"
                value="YES"
                checked={salaryPolicy.block_payroll !== 'NO'}
                onChange={() => setSalaryPolicy({ ...salaryPolicy, block_payroll: 'YES' })}
              /> YES (Block Over-Budget Disbursement)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
              <input
                type="radio"
                name="block_payroll"
                value="NO"
                checked={salaryPolicy.block_payroll === 'NO'}
                onChange={() => setSalaryPolicy({ ...salaryPolicy, block_payroll: 'NO' })}
              /> NO
            </label>
          </div>
        </div>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--slate-border)' }}>
          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#D97706', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={16} /> Save Threshold Controls
          </button>
        </div>
      </form>
    </div>
  );
}
