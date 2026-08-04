import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Save, ArrowRight, ShieldCheck } from 'lucide-react';

export default function EditModalDrawer({
  isOpen,
  onClose,
  title = "Edit Record",
  recordId = "",
  validationErrors = [],
  onSave,
  onSaveAndContinue,
  children
}) {
  const [successToast, setSuccessToast] = useState("");

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave();
      setSuccessToast("Changes saved successfully!");
      setTimeout(() => {
        setSuccessToast("");
        onClose();
      }, 1200);
    }
  };

  const handleSaveAndContinue = (e) => {
    e.preventDefault();
    if (onSaveAndContinue) {
      onSaveAndContinue();
    } else if (onSave) {
      onSave();
    }
    setSuccessToast("Progress saved! You can continue editing.");
    setTimeout(() => {
      setSuccessToast("");
    }, 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div className="animate-scale-in" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '1rem',
        maxWidth: '620px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative'
      }}>
        
        {/* SUCCESS TOAST NOTIFICATION */}
        {successToast && (
          <div className="animate-fade-in" style={{
            position: 'absolute',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#059669',
            color: '#FFFFFF',
            padding: '0.625rem 1.25rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            zIndex: 10000
          }}>
            <CheckCircle2 size={18} /> {successToast}
          </div>
        )}

        {/* HEADER */}
        <div style={{
          backgroundColor: '#4F46E5',
          backgroundImage: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 100%)',
          color: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                {title}
              </h3>
              {recordId && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '0.375rem'
                }}>
                  ID: #{recordId}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', opacity: 0.9 }}
          >
            <X size={22} />
          </button>
        </div>

        {/* VALIDATION MESSAGES ALERT */}
        {validationErrors && validationErrors.length > 0 && (
          <div style={{
            backgroundColor: '#FEF2F2',
            borderBottom: '1px solid #FCA5A5',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            color: '#991B1B',
            fontSize: '0.8125rem',
            fontWeight: 600
          }}>
            <AlertCircle size={18} />
            <div>
              <strong>Validation Alert:</strong> {validationErrors.join(', ')}
            </div>
          </div>
        )}

        {/* FORM SECTIONS (BODY) */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* ACTION BUTTONS (FOOTER) */}
        <div style={{
          padding: '1rem 1.5rem',
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid var(--slate-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontSize: '0.8125rem' }}
          >
            Cancel
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleSaveAndContinue}
              className="btn btn-secondary"
              style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#4F46E5', borderColor: '#C7D2FE' }}
            >
              Save & Continue <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary"
              style={{ fontSize: '0.8125rem', backgroundColor: '#059669', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
