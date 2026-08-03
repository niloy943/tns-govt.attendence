import React, { useState, useEffect } from 'react';
import { X, Building2, Save } from 'lucide-react';
import { useAddMinistry, useUpdateMinistry } from '../../hooks/useMinistries';

export default function MinistryForm({ isOpen, onClose, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Head Ministry',
    city: 'Dhaka',
    address: '',
    employeeCount: 0,
    headOfOfficeName: '',
    headOfOfficeTitle: 'Director',
    budgetAllocated: '৳ 50 Crore',
    contactEmail: '',
    contactPhone: '',
    status: 'active'
  });

  const addMutation = useAddMinistry();
  const updateMutation = useUpdateMinistry();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        type: initialData.type || 'Head Ministry',
        city: initialData.city || 'Dhaka',
        address: initialData.address || '',
        employeeCount: initialData.employeeCount || 0,
        headOfOfficeName: initialData.headOfOffice?.name || '',
        headOfOfficeTitle: initialData.headOfOffice?.title || 'Director',
        budgetAllocated: initialData.budgetAllocated || '৳ 50 Crore',
        contactEmail: initialData.contactEmail || '',
        contactPhone: initialData.contactPhone || '',
        status: initialData.status || 'active'
      });
    } else {
      setFormData({
        name: '',
        code: '',
        type: 'Divisional Branch',
        city: 'Dhaka',
        address: '',
        employeeCount: 0,
        headOfOfficeName: '',
        headOfOfficeTitle: 'Director',
        budgetAllocated: '৳ 50 Crore',
        contactEmail: '',
        contactPhone: '',
        status: 'active'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      headOfOffice: formData.headOfOfficeName ? {
        id: Date.now(),
        name: formData.headOfOfficeName,
        title: formData.headOfOfficeTitle
      } : null
    };

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, ...payload }, {
        onSuccess: () => onClose()
      });
    } else {
      addMutation.mutate(payload, {
        onSuccess: () => onClose()
      });
    }
  };

  const isSubmitting = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '36rem' }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--slate-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)'
            }}>
              <Building2 size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--slate-text)' }}>
                {initialData ? 'Edit Ministry / Branch' : 'Add New Ministry / Branch'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>
                Configure government entity details and leadership
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.375rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '75vh', overflowY: 'auto' }}>
          <div>
            <label className="form-label">Ministry / Branch Name *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Ministry of Social Welfare - Chittagong Branch"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Ministry Code *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. MSW-CTG"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Entity Type</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Head Ministry">Head Ministry</option>
                <option value="Divisional Directorate">Divisional Directorate</option>
                <option value="Divisional Branch">Divisional Branch</option>
                <option value="Regional Office">Regional Office</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">City / Division</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Dhaka, Chittagong, Sylhet"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Annual Budget</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ৳ 150 Crore"
                value={formData.budgetAllocated}
                onChange={(e) => setFormData({ ...formData, budgetAllocated: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Official Address</label>
            <textarea
              rows={2}
              className="form-textarea"
              placeholder="Full building address and office location"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Head of Office Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Dr. Sharmin Akter"
                value={formData.headOfOfficeName}
                onChange={(e) => setFormData({ ...formData, headOfOfficeName: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Leadership Designation</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Senior Secretary, DG, Director"
                value={formData.headOfOfficeTitle}
                onChange={(e) => setFormData({ ...formData, headOfOfficeTitle: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Official Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="office@gov.bd"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Official Phone</label>
              <input
                type="text"
                className="form-input"
                placeholder="+880 2-XXXXXXX"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--slate-border)'
          }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <Save size={18} />
              {isSubmitting ? 'Saving...' : initialData ? 'Update Entity' : 'Save Entity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
