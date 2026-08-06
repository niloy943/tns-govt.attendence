import React, { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useSettings, useUpdateSettings } from '../../hooks/useSettings';

export default function Settings() {
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  const [formData, setFormData] = useState(null);

  React.useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  if (isLoading || !formData) return <div style={{ height: '300px' }} className="skeleton-shimmer"></div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData, {
      onSuccess: () => alert("System Settings saved successfully.")
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '48rem' }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Settings & Control</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--slate-muted)' }}>
          Time Schedule
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, borderBottom: '1px solid var(--slate-border)', paddingBottom: '0.5rem' }}>
          Official Working Schedule
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="form-label">Office Start Time</label>
            <input
              type="text"
              className="form-input"
              value={formData?.officialWorkingHours?.start || '09:00 AM'}
              onChange={e => setFormData({
                ...formData,
                officialWorkingHours: { ...(formData?.officialWorkingHours || {}), start: e.target.value }
              })}
            />
          </div>
          <div>
            <label className="form-label">Office End Time</label>
            <input
              type="text"
              className="form-input"
              value={formData?.officialWorkingHours?.end || '05:00 PM'}
              onChange={e => setFormData({
                ...formData,
                officialWorkingHours: { ...(formData?.officialWorkingHours || {}), end: e.target.value }
              })}
            />
          </div>
        </div>

        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, borderBottom: '1px solid var(--slate-border)', paddingBottom: '0.5rem', marginTop: '0.5rem' }}>
          Leave Quota Rules
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="form-label">Max Casual Leave (Days/Year)</label>
            <input
              type="number"
              className="form-input"
              value={formData?.leaveRules?.maxCasualDaysPerYear || 14}
              onChange={e => setFormData({
                ...formData,
                leaveRules: { ...(formData?.leaveRules || {}), maxCasualDaysPerYear: Number(e.target.value) }
              })}
            />
          </div>
          <div>
            <label className="form-label">Max Rotational Shift (Days)</label>
            <input
              type="number"
              className="form-input"
              value={formData?.leaveRules?.maxRotationalDaysPerShift || 21}
              onChange={e => setFormData({
                ...formData,
                leaveRules: { ...(formData?.leaveRules || {}), maxRotationalDaysPerShift: Number(e.target.value) }
              })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" disabled={updateMutation.isPending} className="btn btn-primary">
            <Save size={18} />
            {updateMutation.isPending ? 'Saving...' : 'Save System Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
