import React from 'react';
import { MinusCircle, Save } from 'lucide-react';

export default function DeductionRuleCard({ salaryPolicy, setSalaryPolicy, onSave }) {
  return (
    <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MinusCircle size={20} style={{ color: '#DC2626' }} /> Itemized Deduction Rules & Rates
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>
          Configure statutory income tax, provident fund, and penalty rates
        </p>
      </div>

      <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="form-label" style={{ fontWeight: 700 }}>Income Tax %</label>
            <input
              type="number"
              className="form-input"
              value={salaryPolicy.tax_percentage || 5}
              onChange={e => setSalaryPolicy({ ...salaryPolicy, tax_percentage: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 700 }}>Provident Fund %</label>
            <input
              type="number"
              className="form-input"
              value={salaryPolicy.pf_percentage || 10}
              onChange={e => setSalaryPolicy({ ...salaryPolicy, pf_percentage: Number(e.target.value) })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="form-label" style={{ fontWeight: 700 }}>Absent Deduction Rule</label>
            <input type="text" className="form-input" disabled value="Pro-rata Daily Rate Deduction" />
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 700 }}>Late Penalty Rule</label>
            <input type="text" className="form-input" disabled value="50% Day Pay per 3 Lates" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="form-label" style={{ fontWeight: 700 }}>Housing / Vehicle Loan Installment</label>
            <input type="text" className="form-input" disabled value="Itemized Loan Amortization" />
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 700 }}>Other Miscellaneous Penalty</label>
            <input type="text" className="form-input" disabled value="Secretariat Disciplinary Penalty" />
          </div>
        </div>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--slate-border)' }}>
          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#DC2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={16} /> Save Deduction Rules
          </button>
        </div>
      </form>
    </div>
  );
}
