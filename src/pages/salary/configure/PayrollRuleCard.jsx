import React from 'react';
import { Calculator, Save } from 'lucide-react';

export default function PayrollRuleCard({ salaryPolicy, setSalaryPolicy, onSave }) {
  return (
    <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calculator size={20} style={{ color: '#4F46E5' }} /> Payroll Generation & Lock Schedule Rules
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>
          Configure monthly payroll execution, lock date, auto lock, and regeneration rules
        </p>
      </div>

      <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="form-label" style={{ fontWeight: 700 }}>Payroll Generation Date</label>
            <input
              type="number"
              className="form-input"
              value={salaryPolicy.payroll_date || 25}
              onChange={e => setSalaryPolicy({ ...salaryPolicy, payroll_date: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 700 }}>Payroll Lock Date</label>
            <input
              type="number"
              className="form-input"
              value={salaryPolicy.lock_date || 30}
              onChange={e => setSalaryPolicy({ ...salaryPolicy, lock_date: Number(e.target.value) })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="form-label" style={{ fontWeight: 700 }}>Auto Lock</label>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="auto_lock"
                  value="true"
                  checked={salaryPolicy.auto_lock === true || salaryPolicy.auto_lock === 'true'}
                  onChange={() => setSalaryPolicy({ ...salaryPolicy, auto_lock: true })}
                /> YES
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="auto_lock"
                  value="false"
                  checked={salaryPolicy.auto_lock === false || salaryPolicy.auto_lock === 'false'}
                  onChange={() => setSalaryPolicy({ ...salaryPolicy, auto_lock: false })}
                /> NO
              </label>
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: 700 }}>Allow Regeneration</label>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="allow_regeneration"
                  value="true"
                  checked={salaryPolicy.allow_regeneration === true}
                  onChange={() => setSalaryPolicy({ ...salaryPolicy, allow_regeneration: true })}
                /> YES
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="allow_regeneration"
                  value="false"
                  checked={salaryPolicy.allow_regeneration !== true}
                  onChange={() => setSalaryPolicy({ ...salaryPolicy, allow_regeneration: false })}
                /> NO
              </label>
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--slate-border)' }}>
          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#4F46E5', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={16} /> Save Payroll Schedule Rules
          </button>
        </div>
      </form>
    </div>
  );
}
