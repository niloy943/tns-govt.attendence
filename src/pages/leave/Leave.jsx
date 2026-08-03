import React, { useState } from 'react';
import { 
  FileText, 
  Paperclip, 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileCheck, 
  ExternalLink,
  Calendar,
  History
} from 'lucide-react';
import { useLeaveRequests, useCreateLeaveRequest, useUpdateLeaveStatus } from '../../hooks/useLeave';
import { leaveCategories } from '../../data/dummy/leaveRequests';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';
import { useAuth } from '../../context/AuthContext';

export default function Leave({ initialTab = 'apply' }) {
  const { currentUser } = useAuth();
  const { data: leaveRequests, isLoading } = useLeaveRequests();
  const createMutation = useCreateLeaveRequest();
  const statusMutation = useUpdateLeaveStatus();

  const [formData, setFormData] = useState({
    category: 'rotational',
    startDate: '',
    endDate: '',
    reason: '',
    attachmentName: null
  });

  const [filterCategory, setFilterCategory] = useState('ALL');

  if (isLoading) {
    return <div style={{ height: '300px' }} className="skeleton-shimmer"></div>;
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        attachmentName: file.name
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      alert("Please select start and end dates.");
      return;
    }

    const catObj = leaveCategories.find(c => c.value === formData.category);
    createMutation.mutate({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      designation: currentUser.roleLabel,
      ministryId: currentUser.ministryId,
      ministryName: currentUser.ministryName,
      category: formData.category,
      categoryLabel: catObj ? catObj.label : formData.category,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalDays: 5,
      reason: formData.reason,
      attachmentUrl: formData.attachmentName ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" : null,
      attachmentName: formData.attachmentName
    }, {
      onSuccess: () => {
        setFormData({
          category: 'rotational',
          startDate: '',
          endDate: '',
          reason: '',
          attachmentName: null
        });
      }
    });
  };

  const handleStatusUpdate = (id, newStatus) => {
    statusMutation.mutate({
      id,
      status: newStatus,
      approvedBy: currentUser.name
    });
  };

  const filteredRequests = (leaveRequests || []).filter(r => {
    if (filterCategory === 'ALL') return true;
    return r.category === filterCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-text)' }}>
          Ministry Leave Management & Applications
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--slate-muted)', marginTop: '0.25rem' }}>
          Official leave applications and rotational duty shifts
        </p>
      </div>

      {/* VERTICALLY STACKED SECTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        
        {/* Section 1: Apply for Leave (Rendered if initialTab is 'apply' or default) */}
        {initialTab !== 'history' && (
          <div className="card-base" style={{ padding: '1.5rem', maxWidth: '48rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <FileText size={20} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Apply for Leave</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Leave Category *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {leaveCategories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label} ({c.code} - Max {c.maxDays} days)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Reason / Justification *</label>
                <textarea
                  rows={3}
                  required
                  className="form-textarea"
                  placeholder="State official reason or rotational duty shift details..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>

              {/* Optional Attachment */}
              <div>
                <label className="form-label">
                  Attachment (Optional for Rotational / Medical Note)
                </label>
                <div style={{
                  border: '1px dashed var(--slate-border)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                    <Paperclip size={18} style={{ color: 'var(--slate-muted)' }} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {formData.attachmentName || "Upload PDF or Scanned Document"}
                    </span>
                  </div>
                  <label className="btn btn-secondary" style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                    Browse
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <button type="submit" disabled={createMutation.isPending} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <Send size={18} />
                {createMutation.isPending ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {/* Section 2: Leave History & Approvals */}
        <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Leave History & Approvals</h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>Category:</span>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.375rem 0.625rem', fontSize: '0.8125rem' }}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                {leaveCategories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Category</th>
                  <th>Dates</th>
                  <th>Attachment</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600 }}>{req.employeeName}</p>
                        <p style={{ fontSize: '0.725rem', color: 'var(--slate-muted)' }}>{req.ministryName}</p>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{req.categoryLabel || req.category}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8125rem' }}>
                        <p>{req.startDate} to {req.endDate}</p>
                        <p style={{ fontSize: '0.725rem', color: 'var(--slate-muted)' }}>{req.totalDays} Days</p>
                      </div>
                    </td>
                    <td>
                      {req.attachmentName ? (
                        <a
                          href={req.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}
                        >
                          <Paperclip size={14} /> View Document
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>None</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={req.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {req.status === 'pending' && (currentUser.role === 'super_admin' || currentUser.role === 'ministry_admin') ? (
                        <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                          <button
                            onClick={() => handleStatusUpdate(req.id, 'approved')}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', color: 'var(--emerald)', fontSize: '0.75rem' }}
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(req.id, 'rejected')}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', color: 'var(--rose)', fontSize: '0.75rem' }}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>
                          {req.approvedBy ? `By ${req.approvedBy}` : 'Completed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
