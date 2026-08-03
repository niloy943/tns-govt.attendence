import React from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function SalaryPolicyCard({ salaryPolicy, setSalaryPolicy, onSave }) {
  return (
    <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SettingsIcon size={20} style={{ color: 'var(--primary)' }} /> Salary Policy Configuration
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>
          Schema: <code style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>salary_settings</code>
        </p>
      </div>

      <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Working Days */}
        <div>
          <label className="form-label" style={{ fontWeight: 700 }}>Working Days Per Month</label>
          <input
            type="number"
            className="form-input"
            style={{ width: '120px', fontWeight: 700 }}
            value={salaryPolicy.working_days || 26}
            onChange={e => setSalaryPolicy({ ...salaryPolicy, working_days: Number(e.target.value) })}
          />
        </div>

        {/* Salary Calculation Policy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <label className="form-label" style={{ fontWeight: 700 }}>Salary Calculation Rule</label>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="radio"
                name="salary_policy"
                value="working_days"
                checked={salaryPolicy.salary_policy === 'working_days'}
                onChange={e => setSalaryPolicy({ ...salaryPolicy, salary_policy: e.target.value })}
              /> Working Days
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="radio"
                name="salary_policy"
                value="calendar_days"
                checked={salaryPolicy.salary_policy === 'calendar_days'}
                onChange={e => setSalaryPolicy({ ...salaryPolicy, salary_policy: e.target.value })}
              /> Calendar Days
            </label>
          </div>
        </div>

        {/* Half Day Rule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <label className="form-label" style={{ fontWeight: 700 }}>Half Day Rule</label>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="radio"
                name="half_day_rule"
                value="50_percent"
                checked={salaryPolicy.half_day_rule === '50_percent'}
                onChange={e => setSalaryPolicy({ ...salaryPolicy, half_day_rule: e.target.value })}
              /> 50% Deduction
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="radio"
                name="half_day_rule"
                value="no_deduction"
                checked={salaryPolicy.half_day_rule === 'no_deduction'}
                onChange={e => setSalaryPolicy({ ...salaryPolicy, half_day_rule: e.target.value })}
              /> No Deduction
            </label>
          </div>
        </div>

        {/* Late Policy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <label className="form-label" style={{ fontWeight: 700 }}>Late Policy</label>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="radio"
                name="late_policy"
                value="no_deduction"
                checked={salaryPolicy.late_policy === 'no_deduction'}
                onChange={e => setSalaryPolicy({ ...salaryPolicy, late_policy: e.target.value })}
              /> No Deduction
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="radio"
                name="late_policy"
                value="deduct_after_3"
                checked={salaryPolicy.late_policy === 'deduct_after_3'}
                onChange={e => setSalaryPolicy({ ...salaryPolicy, late_policy: e.target.value })}
              /> Deduct After 3 Lates
            </label>
          </div>
        </div>

        {/* Currency */}
        <div>
          <label className="form-label" style={{ fontWeight: 700 }}>Currency</label>
          <select
            className="form-select"
            style={{ width: '140px', fontWeight: 700 }}
            value={salaryPolicy.currency || 'BDT'}
            onChange={e => setSalaryPolicy({ ...salaryPolicy, currency: e.target.value })}
          >
            <option value="BDT">BDT (৳ Taka)</option>
            <option value="USD">USD ($ Dollar)</option>
            <option value="EUR">EUR (€ Euro)</option>
          </select>
        </div>

        {/* Save Button */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--slate-border)' }}>
          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={16} /> Save Policy Settings
          </button>
        </div>
      </form>
    </div>
  );
}
