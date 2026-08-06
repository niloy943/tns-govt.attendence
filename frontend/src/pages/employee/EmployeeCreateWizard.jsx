import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Building2, 
  Banknote, 
  CalendarCheck, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Upload,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dummyMinistries } from '../../data/dummy/ministries';
import { employeeService } from '../../services/employeeService';

export default function EmployeeCreateWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    name: '',
    gender: 'Male',
    dob: '1990-01-15',
    bloodGroup: 'O+',
    nid: '',
    passport: '',
    email: '',
    phone: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',

    // Step 2: Government Information
    employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    govtEmployeeId: `BCS-${Math.floor(100000 + Math.random() * 900000)}`,
    cadre: 'BCS Administration Cadre',
    joiningDate: new Date().toISOString().substring(0, 10),
    employmentType: 'Permanent',
    serviceStatus: 'Active',

    // Step 3: Organization Assignment
    ministryId: 1,
    ministryName: 'Ministry of Social Welfare',
    department: 'Administration & Operations',
    wing: 'Executive Wing',
    section: 'Admin-01',
    designation: 'Assistant Director',
    reportingOfficer: 'Director General',
    level: 'manager',

    // Step 4: Salary Assignment
    payGrade: 'Grade 9',
    basicSalary: 29000,
    monthlySalary: 35500,
    salaryStatus: 'Regular Paid',

    // Step 5: Attendance Assignment
    attendanceSource: 'Biometric Device',
    attendanceDevice: 'DEV-MAIN-SECRETARIAT-01',
    assignedShift: 'General Office (09:00 AM - 05:00 PM)',

    // Step 6: Role Assignment
    role: 'Officer',
    status: 'Active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMinistryChange = (e) => {
    const mId = Number(e.target.value);
    const mObj = dummyMinistries.find(m => m.id === mId);
    setFormData(prev => ({
      ...prev,
      ministryId: mId,
      ministryName: mObj ? mObj.name : ''
    }));
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await employeeService.createEmployee(formData);
      setIsSubmitting(false);
      setIsFinished(true);
    } catch (err) {
      setIsSubmitting(false);
      alert('Error creating employee record');
    }
  };

  const steps = [
    { num: 1, title: 'Personal Information', icon: User },
    { num: 2, title: 'Government Info', icon: ShieldCheck },
    { num: 3, title: 'Organization Assignment', icon: Building2 },
    { num: 4, title: 'Salary Assignment', icon: Banknote },
    { num: 5, title: 'Attendance Assignment', icon: CalendarCheck },
    { num: 6, title: 'Role Assignment', icon: UserCheck }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      
      {/* Header Banner */}
      <div style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #1E293B'
      }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#F8FAFC' }}>
            Add New Employee 
          </h1>
          <p style={{ fontSize: '0.8125rem', color: '#94A3B8', margin: '0.15rem 0 0 0' }}>
            Bangladesh Government Officers
          </p>
        </div>
        <button onClick={() => navigate('/employee/list')} className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
          Cancel & Return
        </button>
      </div>

      {/* Wizard Progress Bar */}
      <div className="card-base" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {steps.map(s => {
            const Icon = s.icon;
            const isDone = currentStep > s.num || isFinished;
            const isCurrent = currentStep === s.num && !isFinished;
            return (
              <div 
                key={s.num} 
                onClick={() => { if (s.num < currentStep) setCurrentStep(s.num); }}
                style={{ 
                  flex: 1, 
                  minWidth: '130px',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: isCurrent ? 'var(--primary-light)' : (isDone ? '#F0FDF4' : '#F8FAFC'),
                  border: `1px solid ${isCurrent ? 'var(--primary)' : (isDone ? '#A7F3D0' : 'var(--slate-border)')}`,
                  cursor: s.num < currentStep ? 'pointer' : 'default'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '9999px',
                  backgroundColor: isDone ? '#059669' : (isCurrent ? 'var(--primary)' : '#CBD5E1'),
                  color: '#FFFFFF',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isDone ? <CheckCircle2 size={14} /> : s.num}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ fontSize: '0.725rem', fontWeight: 800, color: isCurrent ? 'var(--primary)' : 'var(--slate-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Body Card */}
      <div className="card-base" style={{ padding: '1.75rem' }}>
        
        {isFinished ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '9999px', backgroundColor: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={44} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>Officer Profile Created Successfully!</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-muted)', marginTop: '0.375rem' }}>
                Officer <strong>{formData.name}</strong> ({formData.employeeCode}) has been saved to the HRMS Directory.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => { setIsFinished(false); setCurrentStep(1); }} className="btn btn-secondary">
                <Plus size={16} /> Add Another Employee
              </button>
              <button onClick={() => navigate('/employee/list')} className="btn btn-primary">
                Go to Employee Directory
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFinish} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* STEP 1: PERSONAL INFORMATION */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: 'var(--slate-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={20} color="var(--primary)" /> Step 1: Personal Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input type="text" required name="name" className="form-input" value={formData.name} onChange={handleChange} placeholder="e.g. Dr. Md. Mahmudul Haque" />
                  </div>
                  <div>
                    <label className="form-label">Gender</label>
                    <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="dob" className="form-input" value={formData.dob} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="form-label">Blood Group</label>
                    <select name="bloodGroup" className="form-select" value={formData.bloodGroup} onChange={handleChange}>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">National ID (NID) *</label>
                    <input type="text" required name="nid" className="form-input" value={formData.nid} onChange={handleChange} placeholder="e.g. 19852691238471029" />
                  </div>
                  <div>
                    <label className="form-label">Passport Number</label>
                    <input type="text" name="passport" className="form-input" value={formData.passport} onChange={handleChange} placeholder="e.g. A09284102" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Official Email *</label>
                    <input type="email" required name="email" className="form-input" value={formData.email} onChange={handleChange} placeholder="officer@gov.bd" />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input type="text" required name="phone" className="form-input" value={formData.phone} onChange={handleChange} placeholder="01700000000" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: GOVERNMENT INFORMATION */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: 'var(--slate-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} color="var(--primary)" /> Step 2: Government Service Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Employee Code *</label>
                    <input type="text" required name="employeeCode" className="form-input" value={formData.employeeCode} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="form-label">Government Employee ID (BCS ID)</label>
                    <input type="text" name="govtEmployeeId" className="form-input" value={formData.govtEmployeeId} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Cadre Designation</label>
                    <input type="text" name="cadre" className="form-input" value={formData.cadre} onChange={handleChange} placeholder="e.g. BCS Administration Cadre" />
                  </div>
                  <div>
                    <label className="form-label">Government Joining Date</label>
                    <input type="date" name="joiningDate" className="form-input" value={formData.joiningDate} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Employment Type</label>
                    <select name="employmentType" className="form-select" value={formData.employmentType} onChange={handleChange}>
                      <option value="Permanent">Permanent</option>
                      <option value="Contractual">Contractual</option>
                      <option value="Probationary">Probationary</option>
                      <option value="Deputation">Deputation</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Service Status</label>
                    <select name="serviceStatus" className="form-select" value={formData.serviceStatus} onChange={handleChange}>
                      <option value="Active">Active Service</option>
                      <option value="Probation">Probation</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ORGANIZATION ASSIGNMENT */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: 'var(--slate-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={20} color="var(--primary)" /> Step 3: Organizational Assignment
                </h3>

                <div>
                  <label className="form-label">Assigned Ministry *</label>
                  <select name="ministryId" className="form-select" value={formData.ministryId} onChange={handleMinistryChange}>
                    {dummyMinistries.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Department *</label>
                    <input type="text" required name="department" className="form-input" value={formData.department} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="form-label">Wing</label>
                    <input type="text" name="wing" className="form-input" value={formData.wing} onChange={handleChange} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Section</label>
                    <input type="text" name="section" className="form-input" value={formData.section} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="form-label">Designation Title *</label>
                    <input type="text" required name="designation" className="form-input" value={formData.designation} onChange={handleChange} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Reporting Officer</label>
                  <input type="text" name="reportingOfficer" className="form-input" value={formData.reportingOfficer} onChange={handleChange} />
                </div>
              </div>
            )}

            {/* STEP 4: SALARY ASSIGNMENT */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: 'var(--slate-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Banknote size={20} color="var(--primary)" /> Step 4: Salary & Pay Grade Assignment
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">National Pay Grade</label>
                    <select name="payGrade" className="form-select" value={formData.payGrade} onChange={handleChange}>
                      {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Salary Status</label>
                    <select name="salaryStatus" className="form-select" value={formData.salaryStatus} onChange={handleChange}>
                      <option value="Regular Paid">Regular Paid</option>
                      <option value="Hold">Hold</option>
                      <option value="Pensioner">Pensioner</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Basic Salary (BDT)</label>
                    <input type="number" name="basicSalary" className="form-input" value={formData.basicSalary} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="form-label">Monthly Gross Salary (BDT)</label>
                    <input type="number" name="monthlySalary" className="form-input" value={formData.monthlySalary} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: ATTENDANCE ASSIGNMENT */}
            {currentStep === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: 'var(--slate-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CalendarCheck size={20} color="var(--primary)" /> Step 5: Attendance Device & Shift Assignment
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Attendance Source</label>
                    <select name="attendanceSource" className="form-select" value={formData.attendanceSource} onChange={handleChange}>
                      <option value="Biometric Device">Biometric Device</option>
                      <option value="Mobile App GPS">Mobile App GPS</option>
                      <option value="Manual Register">Manual Register</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Attendance Device Code</label>
                    <input type="text" name="attendanceDevice" className="form-input" value={formData.attendanceDevice} onChange={handleChange} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Assigned Work Shift</label>
                  <select name="assignedShift" className="form-select" value={formData.assignedShift} onChange={handleChange}>
                    <option value="General Office (09:00 AM - 05:00 PM)">General Office (09:00 AM - 05:00 PM)</option>
                    <option value="Field Shift (08:30 AM - 04:30 PM)">Field Shift (08:30 AM - 04:30 PM)</option>
                    <option value="Executive Shift (09:00 AM - 06:00 PM)">Executive Shift (09:00 AM - 06:00 PM)</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 6: ROLE ASSIGNMENT */}
            {currentStep === 6 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: 'var(--slate-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserCheck size={20} color="var(--primary)" /> Step 6: System Access Role & Final Confirmation
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">System Role Access</label>
                    <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                      <option value="Officer">Officer</option>
                      <option value="Department Head">Department Head</option>
                      <option value="Ministry Admin">Ministry Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Account Operational Status</label>
                    <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                      <option value="Active">Active</option>
                      <option value="Probation">Probation</option>
                    </select>
                  </div>
                </div>

                {/* Summary Card */}
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--slate-border)', borderRadius: '0.75rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>Registration Summary Preview</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Officer Name:</span><strong>{formData.name || 'N/A'}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Employee Code:</span><strong>{formData.employeeCode}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ministry:</span><strong>{formData.ministryName}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Designation:</span><strong>{formData.designation}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pay Grade:</span><strong>{formData.payGrade}</strong></div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--slate-border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              {currentStep > 1 ? (
                <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="btn btn-secondary">
                  <ArrowLeft size={16} /> Back
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 6 ? (
                <button type="button" onClick={() => setCurrentStep(currentStep + 1)} className="btn btn-primary">
                  Next Step <ArrowRight size={16} />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '0.625rem 2rem' }}>
                  <Save size={16} /> {isSubmitting ? 'Saving Profile...' : 'Finish & Create Employee'}
                </button>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
