import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({ 
  title = "No records found", 
  description = "There are no entries available for this view.", 
  actionLabel, 
  onAction 
}) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '4rem',
        height: '4rem',
        borderRadius: '9999px',
        backgroundColor: '#F1F5F9',
        color: '#94A3B8',
        marginBottom: '1rem'
      }}>
        <FolderOpen size={32} />
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B', marginBottom: '0.25rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#64748B', maxWidth: '24rem', margin: '0 auto 1.25rem auto' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
