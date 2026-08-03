import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Users, 
  Building2, 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  Filter, 
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Calculator,
  PlusCircle,
  FileSpreadsheet,
  Download,
  Lock,
  Unlock,
  CheckCheck,
  FileText,
  Bell,
  Edit3,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  X,
  Shield,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useEmployees } from '../../hooks/useEmployees';
import { useAuth } from '../../context/AuthContext';
import { dummyMinistries } from '../../data/dummy/ministries';

// Initial Ministry Salary Budget Allocations (Monthly in BDT Taka)
const INITIAL_MINISTRY_BUDGETS = {
  1: 1500000, // BDT 15.0 Lakh / month for Ministry of Social Welfare
  2: 1200000, // BDT 12.0 Lakh / month for Ministry of Women & Children Affairs
  3: 2500000, // BDT 25.0 Lakh / month for Ministry of Public Administration
  4: 3000000, // BDT 30.0 Lakh / month for Ministry of Finance
  5: 2000000  // BDT 20.0 Lakh / month for Ministry of ICT
};

export default function Salary() {
  const { data: employees, isLoading } = useEmployees();
  const { currentUser, selectedMinistryId, setSelectedMinistryId } = useAuth();

  // PHASE 8: ROLE & PERMISSION CONTROL SIMULATION ('super_admin' | 'ministry_admin')
  const [simulatedRole, setSimulatedRole] = useState(currentUser?.role || 'super_admin');
  const isSuperAdmin = simulatedRole === 'super_admin';

  // Tab State: 'dashboard' | 'budget' | 'salary' | 'payroll' | 'reports' | 'analytics'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Filters State
  const [activeMinistryId, setActiveMinistryId] = useState(selectedMinistryId || "all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [payrollMonth, setPayrollMonth] = useState("2026-08");
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamic Budget Allocation State
  const [ministryBudgets, setMinistryBudgets] = useState(INITIAL_MINISTRY_BUDGETS);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [budgetForm, setBudgetForm] = useState({ ministryId: 1, allocatedAmount: 1500000 });

  // Payroll Status State: 'draft' | 'generated' | 'approved' | 'locked'
  const [payrollStatus, setPayrollStatus] = useState('generated');

  // Individual Officer Edit Salary Modal State
  const [selectedOfficerForSalary, setSelectedOfficerForSalary] = useState(null);

  // Sync context
  React.useEffect(() => {
    setActiveMinistryId(selectedMinistryId || "all");
  }, [selectedMinistryId]);

  const handleMinistryChange = (e) => {
    if (!isSuperAdmin) return; // Locked for Ministry Admin
    const val = e.target.value;
    setActiveMinistryId(val);
    setSelectedMinistryId(val);
  };

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    return employees.filter(emp => {
      if (activeMinistryId !== "all" && emp.ministryId !== Number(activeMinistryId)) {
        return false;
      }
      if (selectedDepartment !== "all" && emp.department !== selectedDepartment) {
        return false;
      }
      if (selectedGrade !== "all" && emp.payGrade !== selectedGrade) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const nameMatch = emp.name.toLowerCase().includes(q);
        const desigMatch = emp.designation.toLowerCase().includes(q);
        const codeMatch = emp.employeeCode.toLowerCase().includes(q);
        if (!nameMatch && !desigMatch && !codeMatch) return false;
      }
      return true;
    });
  }, [employees, activeMinistryId, selectedDepartment, selectedGrade, searchQuery]);

  // Unique Departments & Grades for filters
  const availableDepartments = useMemo(() => {
    if (!employees) return [];
    const source = activeMinistryId === "all" ? employees : employees.filter(e => e.ministryId === Number(activeMinistryId));
    return Array.from(new Set(source.map(e => e.department).filter(Boolean)));
  }, [employees, activeMinistryId]);

  const availableGrades = useMemo(() => {
    if (!employees) return [];
    return Array.from(new Set(employees.map(e => e.payGrade).filter(Boolean)));
  }, [employees]);

  // Comprehensive Overall Ministry Summaries & Budget Validation
  const ministrySummaries = useMemo(() => {
    if (!employees) return [];

    return dummyMinistries.map(m => {
      const mEmployees = employees.filter(e => e.ministryId === m.id);
      const totalSalary = mEmployees.reduce((sum, e) => sum + (e.monthlySalary || 0), 0);
      const allocatedBudget = ministryBudgets[m.id] || 1500000;
      const remainingBudget = allocatedBudget - totalSalary;
      const percentUtilized = allocatedBudget > 0 ? Number(((totalSalary / allocatedBudget) * 100).toFixed(1)) : 0;

      let status = "Healthy";
      if (percentUtilized > 100) status = "Over Budget";
      else if (percentUtilized >= 90) status = "Warning (>90%)";

      return {
        ministry: m,
        employeeCount: mEmployees.length,
        totalSalary,
        allocatedBudget,
        remainingBudget,
        percentUtilized,
        status
      };
    });
  }, [employees, ministryBudgets]);

  // Aggregated Overall Key Metrics
  const metrics = useMemo(() => {
    const totalEmployeesCount = filteredEmployees.length;
    const totalMonthlySalaryExpense = filteredEmployees.reduce((sum, e) => sum + (e.monthlySalary || 0), 0);

    let totalAllocatedBudget = 0;
    if (activeMinistryId === "all") {
      totalAllocatedBudget = Object.values(ministryBudgets).reduce((a, b) => a + b, 0);
    } else {
      totalAllocatedBudget = ministryBudgets[Number(activeMinistryId)] || 1500000;
    }

    const remainingBudget = totalAllocatedBudget - totalMonthlySalaryExpense;
    const utilizationRate = totalAllocatedBudget > 0 ? Number(((totalMonthlySalaryExpense / totalAllocatedBudget) * 100).toFixed(1)) : 0;

    let globalStatus = "Healthy";
    if (utilizationRate > 100) globalStatus = "Over Budget";
    else if (utilizationRate >= 90) globalStatus = "Warning (>90%)";

    return {
      totalEmployeesCount,
      totalMonthlySalaryExpense,
      totalAllocatedBudget,
      remainingBudget,
      utilizationRate,
      globalStatus
    };
  }, [filteredEmployees, activeMinistryId, ministryBudgets]);

  // Department-wise Salary Breakdown
  const departmentBreakdown = useMemo(() => {
    const map = {};
    filteredEmployees.forEach(e => {
      const dept = e.department || "General Administration";
      if (!map[dept]) map[dept] = { count: 0, totalSalary: 0 };
      map[dept].count += 1;
      map[dept].totalSalary += (e.monthlySalary || 0);
    });

    return Object.keys(map).map(deptName => {
      const data = map[deptName];
      const sharePercent = metrics.totalMonthlySalaryExpense > 0 
        ? ((data.totalSalary / metrics.totalMonthlySalaryExpense) * 100).toFixed(1)
        : 0;

      return {
        name: deptName,
        count: data.count,
        totalSalary: data.totalSalary,
        sharePercent
      };
    }).sort((a, b) => b.totalSalary - a.totalSalary);
  }, [filteredEmployees, metrics.totalMonthlySalaryExpense]);

  // Calculate Net Salary Components (Basic, Allowances, Deductions)
  const calculateSalaryComponents = (monthlySalary) => {
    const basic = Math.round(monthlySalary * 0.65);
    const houseRent = Math.round(monthlySalary * 0.20);
    const medical = Math.round(monthlySalary * 0.10);
    const transport = Math.round(monthlySalary * 0.05);
    const pfDeduction = Math.round(basic * 0.10);
    const taxDeduction = Math.round(monthlySalary * 0.05);
    const netSalary = basic + houseRent + medical + transport - (pfDeduction + taxDeduction);
    
    return { basic, houseRent, medical, transport, pfDeduction, taxDeduction, netSalary };
  };

  // Format currency numbers into BDT Taka
  const formatBDT = (amount) => {
    return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 })
      .format(amount)
      .replace('BDT', '৳');
  };

  // Save updated budget
  const handleSaveBudget = (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert("Permission Denied: Only Super Admin can allocate government budgets!");
      return;
    }
    setMinistryBudgets({
      ...ministryBudgets,
      [budgetForm.ministryId]: Number(budgetForm.allocatedAmount)
    });
    setIsBudgetModalOpen(false);
  };

  // Export report alert
  const handleExportReport = (type, format) => {
    alert(`Generating & Downloading ${type} Report in ${format.toUpperCase()} format...`);
  };

  if (isLoading) {
    return <div style={{ height: '500px' }} className="skeleton-shimmer"></div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }} className="animate-fade-in">
      
      {/* PHASE 8: ADVANCED PERMISSION CONTROL SWITCHER BAR */}
      <div className="card-base" style={{ padding: '0.75rem 1.25rem', backgroundColor: '#0F172A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid #38BDF8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield size={20} style={{ color: '#38BDF8' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FFFFFF' }}>Phase 8 Advanced Permission Controls</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: isSuperAdmin ? '#38BDF8' : '#10B981', color: isSuperAdmin ? '#0F172A' : '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '0.375rem' }}>
                {isSuperAdmin ? "SUPER ADMIN ACCESS" : "MINISTRY ADMIN VIEW"}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0, marginTop: '0.125rem' }}>
              {isSuperAdmin 
                ? "Full access to all ministries, budget allocation, salary editing, and global payroll approval" 
                : "Locked to assigned ministry view. Budget allocation and global payroll approval disabled."}
            </p>
          </div>
        </div>

        {/* Interactive Role Switcher Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.25rem', borderRadius: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, paddingLeft: '0.375rem' }}>Simulate Role:</span>
          <button
            onClick={() => {
              setSimulatedRole('super_admin');
              setActiveMinistryId('all');
            }}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: isSuperAdmin ? '#38BDF8' : 'transparent',
              color: isSuperAdmin ? '#0F172A' : '#94A3B8',
              transition: 'all 0.15s ease'
            }}
          >
            👑 Super Admin
          </button>
          <button
            onClick={() => {
              setSimulatedRole('ministry_admin');
              const targetId = String(currentUser?.ministryId || 2);
              setActiveMinistryId(targetId);
              setSelectedMinistryId(targetId);
            }}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: !isSuperAdmin ? '#10B981' : 'transparent',
              color: !isSuperAdmin ? '#FFFFFF' : '#94A3B8',
              transition: 'all 0.15s ease'
            }}
          >
            🏢 Ministry Admin
          </button>
        </div>
      </div>

      {/* Module Title Banner */}
      <div style={{
        backgroundColor: '#059669',
        backgroundImage: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10B981 100%)',
        color: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: '0 8px 20px rgba(5, 150, 105, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '0.625rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calculator size={26} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Salary & Budget Management Module
            </h1>
            <p style={{ fontSize: '0.8125rem', color: '#D1FAE5', margin: 0, marginTop: '0.125rem' }}>
              Government financial allocations, payroll processing engine, and departmental cost analytics
            </p>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Synced with Employee Roster">
          <ShieldCheck size={20} />
        </div>
      </div>

      {/* PHASE 7: AUTOMATIC ALERTS & NOTIFICATION BANNERS */}
      {metrics.globalStatus !== "Healthy" && (
        <div style={{
          backgroundColor: metrics.globalStatus === "Over Budget" ? "#FEF2F2" : "#FFFBEB",
          border: `1.5px solid ${metrics.globalStatus === "Over Budget" ? "#FCA5A5" : "#FDE68A"}`,
          borderRadius: '0.75rem',
          padding: '0.875rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          color: metrics.globalStatus === "Over Budget" ? "#991B1B" : "#92400E"
        }}>
          <Bell size={20} className="animate-pulse" />
          <div style={{ flex: 1, fontSize: '0.875rem', fontWeight: 600 }}>
            <strong>{metrics.globalStatus === "Over Budget" ? "CRITICAL ALERT: Budget Exceeded!" : "WARNING: Salary Budget Near Limit!"}</strong>
            <span style={{ marginLeft: '0.5rem', fontWeight: 400 }}>
              Current salary expenditure is utilizing {metrics.utilizationRate}% of the allocated budget.
            </span>
          </div>
        </div>
      )}

      {/* Control Toolbar & Global Filters */}
      <div className="card-base" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center', flex: 1 }}>
          
          {/* Payroll Month Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} style={{ color: 'var(--primary)' }} />
            <input
              type="month"
              value={payrollMonth}
              onChange={e => setPayrollMonth(e.target.value)}
              className="form-input"
              style={{ width: 'auto', fontSize: '0.875rem', fontWeight: 700 }}
            />
          </div>

          {/* Ministry Filter (Phase 8: Disabled for Ministry Admin) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} style={{ color: 'var(--emerald)' }} />
            <select
              value={activeMinistryId}
              onChange={handleMinistryChange}
              disabled={!isSuperAdmin}
              className="form-input"
              style={{
                width: 'auto',
                minWidth: '220px',
                fontSize: '0.875rem',
                fontWeight: 600,
                backgroundColor: !isSuperAdmin ? '#F1F5F9' : '#FFFFFF',
                cursor: !isSuperAdmin ? 'not-allowed' : 'pointer'
              }}
            >
              {isSuperAdmin && <option value="all">🌐 All Ministries (Central View)</option>}
              {dummyMinistries.map(m => (
                <option key={m.id} value={m.id}>📍 {m.name}</option>
              ))}
            </select>
            {!isSuperAdmin && (
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#047857', backgroundColor: '#ECFDF5', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', border: '1px solid #A7F3D0' }}>
                LOCKED TO ASSIGNED MINISTRY
              </span>
            )}
          </div>

          {/* Department Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} style={{ color: 'var(--slate-muted)' }} />
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="form-input"
              style={{ width: 'auto', minWidth: '160px', fontSize: '0.875rem' }}
            >
              <option value="all">All Departments</option>
              {availableDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Grade Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="form-input"
              style={{ width: 'auto', fontSize: '0.875rem' }}
            >
              <option value="all">All Pay Grades</option>
              {availableGrades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '200px', flex: '1 1 180px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-muted)' }} />
            <input
              type="text"
              placeholder="Search officer, grade..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
            />
          </div>
        </div>
      </div>

      {/* MODULE TAB NAVIGATION (PHASES 1-6) */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.25rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            padding: '0.625rem 1.125rem',
            borderRadius: '0.5rem 0.5rem 0 0',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'dashboard' ? '#FFFFFF' : 'var(--slate-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <BarChart3 size={16} /> Dashboard
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          style={{
            padding: '0.625rem 1.125rem',
            borderRadius: '0.5rem 0.5rem 0 0',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'budget' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'budget' ? '#FFFFFF' : 'var(--slate-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <CreditCard size={16} /> Budget Management
        </button>

        <button
          onClick={() => setActiveTab('salary')}
          style={{
            padding: '0.625rem 1.125rem',
            borderRadius: '0.5rem 0.5rem 0 0',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'salary' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'salary' ? '#FFFFFF' : 'var(--slate-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <DollarSign size={16} /> Salary Management
        </button>

        <button
          onClick={() => setActiveTab('payroll')}
          style={{
            padding: '0.625rem 1.125rem',
            borderRadius: '0.5rem 0.5rem 0 0',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'payroll' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'payroll' ? '#FFFFFF' : 'var(--slate-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Calculator size={16} /> Payroll Engine
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          style={{
            padding: '0.625rem 1.125rem',
            borderRadius: '0.5rem 0.5rem 0 0',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'reports' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'reports' ? '#FFFFFF' : 'var(--slate-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FileText size={16} /> Financial Reports
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '0.625rem 1.125rem',
            borderRadius: '0.5rem 0.5rem 0 0',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'analytics' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'analytics' ? '#FFFFFF' : 'var(--slate-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <TrendingUp size={16} /> Analytics
        </button>
      </div>

      {/* PHASE 1: DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="card-base" style={{ padding: '1.25rem', borderLeft: '4px solid #3B82F6' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Employees</p>
              <h3 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--slate-text)', margin: '0.125rem 0' }}>{metrics.totalEmployeesCount}</h3>
              <span style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: 600 }}>Active Personnel</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem', borderLeft: '4px solid #10B981' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Monthly Salary</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', margin: '0.125rem 0' }}>{formatBDT(metrics.totalMonthlySalaryExpense)}</h3>
              <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>Monthly Expense</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem', borderLeft: '4px solid #6366F1' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Salary Budget</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4F46E5', margin: '0.125rem 0' }}>{formatBDT(metrics.totalAllocatedBudget)}</h3>
              <span style={{ fontSize: '0.7rem', color: '#4F46E5', fontWeight: 600 }}>Allocated Monthly</span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem', borderLeft: `4px solid ${metrics.remainingBudget >= 0 ? '#10B981' : '#EF4444'}` }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Remaining Budget</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: metrics.remainingBudget >= 0 ? '#047857' : '#DC2626', margin: '0.125rem 0' }}>
                {formatBDT(metrics.remainingBudget)}
              </h3>
              <span style={{ fontSize: '0.7rem', color: metrics.remainingBudget >= 0 ? '#047857' : '#DC2626', fontWeight: 600 }}>
                {metrics.remainingBudget >= 0 ? `${(100 - metrics.utilizationRate).toFixed(1)}% Remaining` : "OVER BUDGET"}
              </span>
            </div>

            <div className="card-base" style={{ padding: '1.25rem', borderLeft: '4px solid #F59E0B' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Budget Utilization</p>
              <h3 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#D97706', margin: '0.125rem 0' }}>{metrics.utilizationRate}%</h3>
              <span style={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 600 }}>{metrics.globalStatus}</span>
            </div>
          </div>

          {/* Gauges & Distribution Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0 }}>Budget Utilization Gauge</h3>
                <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '0.25rem 0.625rem', borderRadius: '9999px' }}>
                  {metrics.utilizationRate}% Spent
                </span>
              </div>
              <div style={{ height: '14px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(metrics.utilizationRate, 100)}%`,
                  backgroundColor: metrics.utilizationRate > 90 ? '#EF4444' : metrics.utilizationRate > 75 ? '#F59E0B' : '#10B981',
                  height: '100%',
                  borderRadius: '9999px'
                }} />
              </div>
            </div>

            <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0 }}>Department Salary Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxHeight: '200px', overflowY: 'auto' }}>
                {departmentBreakdown.map(dept => (
                  <div key={dept.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                      <span style={{ fontWeight: 600 }}>{dept.name} ({dept.count})</span>
                      <span style={{ fontWeight: 700, color: '#4F46E5' }}>{formatBDT(dept.totalSalary)} ({dept.sharePercent}%)</span>
                    </div>
                    <div style={{ height: '8px', width: '100%', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${dept.sharePercent}%`, backgroundColor: '#6366F1', height: '100%', borderRadius: '9999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: BUDGET MANAGEMENT TAB */}
      {activeTab === 'budget' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Ministry Budget Allocation & Validation</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>Create, allocate, and validate monthly government salary budgets</p>
            </div>
            
            {/* Phase 8 Permission Control for Allocate Budget */}
            {isSuperAdmin ? (
              <button onClick={() => setIsBudgetModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlusCircle size={18} /> Allocate Ministry Budget
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F1F5F9', padding: '0.5rem 0.875rem', borderRadius: '0.5rem', color: 'var(--slate-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>
                <Lock size={16} /> Super Admin Privilege Required to Allocate Budget
              </div>
            )}
          </div>

          {/* Budget Summary Table */}
          <div className="card-base" style={{ padding: '1.5rem' }}>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ministry</th>
                    <th>Officers</th>
                    <th>Monthly Expense</th>
                    <th>Allocated Budget</th>
                    <th>Remaining Budget</th>
                    <th>Utilization</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ministrySummaries.map(m => (
                    <tr key={m.ministry.id}>
                      <td style={{ fontWeight: 700 }}>{m.ministry.name} ({m.ministry.code})</td>
                      <td style={{ fontWeight: 600 }}>{m.employeeCount} Officers</td>
                      <td style={{ fontWeight: 700, color: '#059669' }}>{formatBDT(m.totalSalary)}</td>
                      <td style={{ fontWeight: 700, color: '#4F46E5' }}>{formatBDT(m.allocatedBudget)}</td>
                      <td style={{ fontWeight: 700, color: m.remainingBudget >= 0 ? '#047857' : '#DC2626' }}>{formatBDT(m.remainingBudget)}</td>
                      <td style={{ fontWeight: 700 }}>{m.percentUtilized}%</td>
                      <td>
                        <span style={{
                          backgroundColor: m.status === 'Healthy' ? '#DCFCE7' : m.status === 'Over Budget' ? '#FEE2E2' : '#FEF3C7',
                          color: m.status === 'Healthy' ? '#15803D' : m.status === 'Over Budget' ? '#991B1B' : '#92400E',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: SALARY MANAGEMENT TAB */}
      {activeTab === 'salary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Officer Salary Roster ({filteredEmployees.length})</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)' }}>Detailed basic salary, allowances, and deduction breakdown</p>
            </div>
          </div>

          <div className="card-base" style={{ padding: '1.5rem' }}>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Officer Name</th>
                    <th>Designation & Grade</th>
                    <th>Basic Salary</th>
                    <th>Allowances</th>
                    <th>Deductions</th>
                    <th style={{ textAlign: 'right' }}>Net Monthly Salary</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(emp => {
                    const comp = calculateSalaryComponents(emp.monthlySalary || 0);
                    return (
                      <tr key={emp.id}>
                        <td style={{ fontWeight: 700, color: '#4F46E5' }}>{emp.employeeCode}</td>
                        <td style={{ fontWeight: 700 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <img src={emp.avatar} alt={emp.name} style={{ width: '32px', height: '32px', borderRadius: '9999px', objectFit: 'cover' }} />
                            <span>{emp.name}</span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <p style={{ fontWeight: 600 }}>{emp.designation}</p>
                            <span className="badge badge-info" style={{ fontSize: '0.675rem' }}>{emp.payGrade}</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{formatBDT(comp.basic)}</td>
                        <td style={{ color: '#059669', fontSize: '0.8125rem' }}>+{formatBDT(comp.houseRent + comp.medical + comp.transport)}</td>
                        <td style={{ color: '#DC2626', fontSize: '0.8125rem' }}>-{formatBDT(comp.pfDeduction + comp.taxDeduction)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: '#059669', fontSize: '0.9375rem' }}>{formatBDT(comp.netSalary)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => setSelectedOfficerForSalary(emp)} className="btn btn-ghost" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                            <Eye size={14} /> Details & Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 4: PAYROLL MANAGEMENT TAB */}
      {activeTab === 'payroll' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Payroll Calculation & Locking Engine</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)', margin: 0 }}>Month: {payrollMonth} • Status: <strong style={{ color: '#4F46E5', textTransform: 'uppercase' }}>{payrollStatus}</strong></p>
            </div>

            {/* Phase 8 Permission Control for Payroll Approval & Locking */}
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              <button onClick={() => setPayrollStatus('generated')} className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
                <Calculator size={16} /> Recalculate Payroll
              </button>
              {isSuperAdmin ? (
                <>
                  <button onClick={() => setPayrollStatus('approved')} className="btn btn-primary" style={{ fontSize: '0.8125rem', backgroundColor: '#059669' }}>
                    <CheckCheck size={16} /> Approve Payroll
                  </button>
                  <button onClick={() => setPayrollStatus('locked')} className="btn btn-secondary" style={{ fontSize: '0.8125rem', color: '#DC2626' }}>
                    <Lock size={16} /> Lock Payroll
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#F1F5F9', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-muted)' }}>
                  <Lock size={14} /> Approval Locked (Super Admin Only)
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div className="card-base" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', fontWeight: 700 }}>Total Net Payroll</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>{formatBDT(metrics.totalMonthlySalaryExpense)}</h3>
            </div>
            <div className="card-base" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', fontWeight: 700 }}>Total Officers Processed</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4F46E5' }}>{metrics.totalEmployeesCount} Officers</h3>
            </div>
            <div className="card-base" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', fontWeight: 700 }}>Approval Status</p>
              <span className="badge badge-info" style={{ fontSize: '0.875rem', textTransform: 'uppercase' }}>{payrollStatus}</span>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 5: FINANCIAL REPORTS TAB */}
      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {[
              { title: "Ministry Financial & Salary Report", desc: "Complete breakdown of ministry staff count, salary expense, and remaining budget." },
              { title: "Departmental Cost Share Report", desc: "Department-wise payroll expenditure and allowance allocations." },
              { title: "Officer Individual Salary Slip Report", desc: "Detailed basic salary, medical, house rent, and tax deductions." },
              { title: "Monthly Secretarial Payroll Report", desc: "Government payroll summary formatted for audit and secretariat clearance." }
            ].map((rep, idx) => (
              <div key={idx} className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <FileSpreadsheet size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{rep.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--slate-muted)', margin: '0.5rem 0 1rem 0' }}>{rep.desc}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.375rem', paddingTop: '0.75rem', borderTop: '1px solid var(--slate-border)' }}>
                  <button onClick={() => handleExportReport(rep.title, 'pdf')} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flex: 1 }}>PDF</button>
                  <button onClick={() => handleExportReport(rep.title, 'excel')} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flex: 1 }}>Excel</button>
                  <button onClick={() => handleExportReport(rep.title, 'csv')} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', flex: 1 }}>CSV</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 6: ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card-base" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '1rem' }}>Ministry Cost Share Analytics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ministrySummaries.map(m => (
                <div key={m.ministry.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ fontWeight: 600 }}>{m.ministry.name}</span>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{formatBDT(m.totalSalary)} ({m.percentUtilized}%)</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(m.percentUtilized, 100)}%`, backgroundColor: '#10B981', height: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-base" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '1rem' }}>Monthly Payroll Trend</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {['2026-05', '2026-06', '2026-07', '2026-08'].map(m => (
                <div key={m} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600 }}>Month {m}</span>
                  <span style={{ fontWeight: 700, color: '#4F46E5' }}>{formatBDT(metrics.totalMonthlySalaryExpense)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2 MODAL: BUDGET ALLOCATION FOR SUPER ADMIN */}
      {isBudgetModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '460px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Allocate Ministry Salary Budget</h3>
              <button onClick={() => setIsBudgetModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveBudget} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Select Ministry</label>
                <select
                  className="form-select"
                  value={budgetForm.ministryId}
                  onChange={e => setBudgetForm({ ...budgetForm, ministryId: Number(e.target.value) })}
                >
                  {dummyMinistries.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Allocated Monthly Budget (BDT Taka)</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={budgetForm.allocatedAmount}
                  onChange={e => setBudgetForm({ ...budgetForm, allocatedAmount: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Save & Allocate Budget</button>
            </form>
          </div>
        </div>
      )}

      {/* OFFICER SALARY DETAILS & UPDATE MODAL (PHASE 8 SCOPED) */}
      {selectedOfficerForSalary && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '520px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Officer Salary Details & Update</h3>
              <button onClick={() => setSelectedOfficerForSalary(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {(() => {
              const comp = calculateSalaryComponents(selectedOfficerForSalary.monthlySalary || 0);
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                    <img src={selectedOfficerForSalary.avatar} alt="" style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ margin: 0, fontWeight: 800 }}>{selectedOfficerForSalary.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#4F46E5' }}>{selectedOfficerForSalary.designation} ({selectedOfficerForSalary.payGrade})</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-muted)' }}>{selectedOfficerForSalary.ministryName}</p>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Basic Salary (65%):</span><strong>{formatBDT(comp.basic)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>House Rent Allowance (20%):</span><strong>+{formatBDT(comp.houseRent)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Medical Allowance (10%):</span><strong>+{formatBDT(comp.medical)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Transport Allowance (5%):</span><strong>+{formatBDT(comp.transport)}</strong></div>
                    <hr style={{ borderColor: '#E2E8F0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#DC2626' }}><span>Provident Fund (10% Basic):</span><strong>-{formatBDT(comp.pfDeduction)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#DC2626' }}><span>Tax Deduction (5% Total):</span><strong>-{formatBDT(comp.taxDeduction)}</strong></div>
                    <hr style={{ borderColor: '#E2E8F0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#059669', fontWeight: 800 }}>
                      <span>Net Monthly Salary:</span><span>{formatBDT(comp.netSalary)}</span>
                    </div>
                  </div>

                  {/* Edit Salary Form (Flowchart Spec: Basic, Allowances, Deductions, Auto Net Salary) */}
                  {isSuperAdmin ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: 'var(--slate-text)' }}>Edit Officer Salary Parameters</h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Basic Salary (65%)</label>
                          <input
                            type="number"
                            className="form-input"
                            style={{ fontSize: '0.8125rem' }}
                            defaultValue={comp.basic}
                            id="editBasicSalaryInput"
                            onChange={() => {
                              const b = Number(document.getElementById('editBasicSalaryInput').value || 0);
                              const a = Number(document.getElementById('editAllowancesInput').value || 0);
                              const d = Number(document.getElementById('editDeductionsInput').value || 0);
                              const net = b + a - d;
                              document.getElementById('editAutoNetSalaryDisplay').innerText = formatBDT(net);
                            }}
                          />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Total Allowances (+)</label>
                          <input
                            type="number"
                            className="form-input"
                            style={{ fontSize: '0.8125rem' }}
                            defaultValue={comp.houseRent + comp.medical + comp.transport}
                            id="editAllowancesInput"
                            onChange={() => {
                              const b = Number(document.getElementById('editBasicSalaryInput').value || 0);
                              const a = Number(document.getElementById('editAllowancesInput').value || 0);
                              const d = Number(document.getElementById('editDeductionsInput').value || 0);
                              const net = b + a - d;
                              document.getElementById('editAutoNetSalaryDisplay').innerText = formatBDT(net);
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Total Deductions (-)</label>
                          <input
                            type="number"
                            className="form-input"
                            style={{ fontSize: '0.8125rem' }}
                            defaultValue={comp.pfDeduction + comp.taxDeduction}
                            id="editDeductionsInput"
                            onChange={() => {
                              const b = Number(document.getElementById('editBasicSalaryInput').value || 0);
                              const a = Number(document.getElementById('editAllowancesInput').value || 0);
                              const d = Number(document.getElementById('editDeductionsInput').value || 0);
                              const net = b + a - d;
                              document.getElementById('editAutoNetSalaryDisplay').innerText = formatBDT(net);
                            }}
                          />
                        </div>
                        <div style={{ backgroundColor: '#ECFDF5', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #A7F3D0' }}>
                          <label className="form-label" style={{ fontSize: '0.7rem', color: '#047857', margin: 0 }}>Auto Net Salary</label>
                          <p id="editAutoNetSalaryDisplay" style={{ fontSize: '1rem', fontWeight: 800, color: '#059669', margin: '0.125rem 0 0 0' }}>
                            {formatBDT(comp.netSalary)}
                          </p>
                        </div>
                      </div>

                      {/* Modal Form Buttons */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => setSelectedOfficerForSalary(null)} className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const b = Number(document.getElementById('editBasicSalaryInput').value || 0);
                            const a = Number(document.getElementById('editAllowancesInput').value || 0);
                            const d = Number(document.getElementById('editDeductionsInput').value || 0);
                            const gross = Math.round((b + a) / 0.95);
                            selectedOfficerForSalary.monthlySalary = gross;
                            alert(`Salary parameters saved for ${selectedOfficerForSalary.name}! Net Monthly: ৳ ${(b + a - d).toLocaleString()}`);
                            setSelectedOfficerForSalary({ ...selectedOfficerForSalary, monthlySalary: gross });
                          }}
                          className="btn btn-primary"
                          style={{ fontSize: '0.8125rem', backgroundColor: '#059669', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                        >
                          <Save size={16} /> Save Salary
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '0.75rem', borderRadius: '0.5rem', color: '#92400E', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Lock size={14} /> Read-Only View: Super Admin Privilege Required to Edit Salary
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
