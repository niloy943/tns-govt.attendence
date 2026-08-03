import React, { useState } from 'react';
import { UserPlus, Save, Building } from 'lucide-react';
import Dropdown from '../../components/common/Dropdown';
import { useAppState } from '../../context/AppStateContext';

const CreateEmployee = () => {
  const { ministries, getOfficesByMinistry, addEmployee } = useAppState();

  const [selectedMinistry, setSelectedMinistry] = useState(ministries[0]?.code || 'MOF');
  const availableOffices = getOfficesByMinistry(selectedMinistry);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    officeCode: availableOffices[0]?.code || '',
    department: 'HR & Admin',
    email: '',
    phone: '',
    salaryGrade: 'Grade 7'
  });

  const handleMinistryChange = (minCode) => {
    setSelectedMinistry(minCode);
    const offs = getOfficesByMinistry(minCode);
    setFormData({
      ...formData,
      ministryCode: minCode,
      officeCode: offs[0]?.code || ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.officeCode) return;

    addEmployee({
      ...formData,
      ministryCode: selectedMinistry
    });

    setFormData({
      name: '',
      designation: '',
      officeCode: availableOffices[0]?.code || '',
      department: 'HR & Admin',
      email: '',
      phone: '',
      salaryGrade: 'Grade 7'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Create Employee Profile</h2>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Register new personnel with Ministry & Office dynamic allocation
        </p>
      </div>

      <div className="card-base p-6 bg-white border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {/* Ministry & Dependent Office Selection */}
          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
            <h3 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Ministry & Office Organizational Linkage</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Dropdown
                label="Parent Ministry"
                required
                options={ministries.map((m) => ({ label: m.name, value: m.code }))}
                value={selectedMinistry}
                onChange={handleMinistryChange}
              />

              <Dropdown
                label="Assigned Office (Depends on Ministry)"
                required
                options={availableOffices.map((o) => ({ label: `${o.name} (${o.code})`, value: o.code }))}
                value={formData.officeCode}
                onChange={(val) => setFormData({ ...formData, officeCode: val })}
              />
            </div>
          </div>

          {/* Personal & Official Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Employee Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Golam Maula Lincoln"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Senior System Administrator"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Dropdown
                label="Department"
                options={[
                  { label: 'HR & Admin', value: 'HR & Admin' },
                  { label: 'Finance & Accounts', value: 'Finance & Accounts' },
                  { label: 'IT Infrastructure', value: 'IT Infrastructure' },
                  { label: 'Public Relations', value: 'Public Relations' },
                  { label: 'Management', value: 'Management' }
                ]}
                value={formData.department}
                onChange={(val) => setFormData({ ...formData, department: val })}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="employee@govt.gov.bd"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+880 1958-227213"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <Dropdown
                label="Pay Scale / Grade"
                options={[
                  { label: 'Grade 1 (Executive)', value: 'Grade 1' },
                  { label: 'Grade 5 (Management)', value: 'Grade 5' },
                  { label: 'Grade 7 (Senior Staff)', value: 'Grade 7' },
                  { label: 'Grade 10 (Junior Staff)', value: 'Grade 10' }
                ]}
                value={formData.salaryGrade}
                onChange={(val) => setFormData({ ...formData, salaryGrade: val })}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Employee</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployee;
