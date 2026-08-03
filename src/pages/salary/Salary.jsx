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
  AlertCircle,
  Settings as SettingsIcon,
  Save,
  Sliders,
  MinusCircle
} from 'lucide-react';
import { useEmployees } from '../../hooks/useEmployees';
import { useAuth } from '../../context/AuthContext';
import { dummyMinistries } from '../../data/dummy/ministries';
import BarChartWidget from '../../components/charts/BarChartWidget';
import PieChartWidget from '../../components/charts/PieChartWidget';

// Initial Ministry Salary Budget Allocations
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

  // Tab State: 'dashboard' | 'budget' | 'salary' | 'payroll' | 'reports' | 'analytics' | 'policy'
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

  // Salary Policy Settings State (salary_settings schema)
  const [salaryPolicy, setSalaryPolicy] = useState({
    id: 1,
    workingDays: 26,
    salaryPolicy: 'working_days', // 'working_days' | 'calendar_days'
    halfDayPolicy: '50_percent',  // '50_percent' | 'no_deduction'
    latePolicy: 'deduct_after_3', // 'no_deduction' | 'deduct_after_3'
    currency: 'BDT',
    incomeTaxRate: 5,
    providentFundRate: 10
  });

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

  // Calculate Itemized Net Salary Components (Allowances & Deductions)
  const calculateSalaryComponents = (monthlySalary) => {
    const basic = Math.round(monthlySalary * 0.55);
    const houseRent = Math.round(monthlySalary * 0.20);
    const medical = Math.round(monthlySalary * 0.10);
    const transport = Math.round(monthlySalary * 0.05);
    const specialAllowance = Math.round(monthlySalary * 0.04);
    const festivalBonus = Math.round(monthlySalary * 0.03);
    const otherAllowance = Math.round(monthlySalary * 0.03);

    const totalAllowances = houseRent + medical + transport + specialAllowance + festivalBonus + otherAllowance;

    // Itemized Deductions (Flowchart spec)
    const pfDeduction = Math.round(basic * (salaryPolicy.providentFundRate / 100));
    const taxDeduction = Math.round(monthlySalary * (salaryPolicy.incomeTaxRate / 100));
    const absentDeduction = 0;
    const latePenalty = 0;
    const loanDeduction = 0;
    const otherDeduction = 0;

    const totalDeductions = pfDeduction + taxDeduction + absentDeduction + latePenalty + loanDeduction + otherDeduction;

    const netSalary = basic + totalAllowances - totalDeductions;
    
    return { 
      basic, 
      houseRent, 
      medical, 
      transport, 
      specialAllowance, 
      festivalBonus, 
      otherAllowance, 
      totalAllowances,
      pfDeduction, 
      taxDeduction, 
      absentDeduction,
      latePenalty,
      loanDeduction,
      otherDeduction,
      totalDeductions,
      netSalary 
    };
  };

  // Format currency numbers into BDT Taka
  const formatBDT = (amount) => {
    return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 })
      .format(amount || 0)
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

  // Save salary policy
  const handleSavePolicy = (e) => {
    e.preventDefault();
    alert("Salary Policy & Deduction Settings successfully saved!");
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
              Salary & Budget Management
            </h1>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#FFFFFF', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Synced with Employee Roster">
          <ShieldCheck size={20} />
        </div>
      </div>

      {/* Visual Chart Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <BarChartWidget title="Department Salary Expense" />
        <PieChartWidget title="Budget Allocation Breakdown" />
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

          {/* Ministry Filter */}
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

      {/* MODULE TAB NAVIGATION */}
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

        <button
          onClick={() => setActiveTab('policy')}
          style={{
            padding: '0.625rem 1.125rem',
            borderRadius: '0.5rem 0.5rem 0 0',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'policy' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'policy' ? '#FFFFFF' : 'var(--slate-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <SettingsIcon size={16} /> Salary Policy & Rules
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
                      <td style={{ fontWeight: 600 }}>{m.employeeCount}</td>
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
                        <td style={{ color: '#059669', fontSize: '0.8125rem' }}>+{formatBDT(comp.totalAllowances)}</td>
                        <td style={{ color: '#DC2626', fontSize: '0.8125rem' }}>-{formatBDT(comp.totalDeductions)}</td>
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
              <div key={idx} className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
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

      {/* SALARY POLICY & COMPONENTS SETTINGS TAB */}
      {activeTab === 'policy' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          {/* Salary Policy Form (salary_settings Schema) */}
          <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-text)', margin: 0 }}>
                Salary Policy Configuration
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>
                Schema: <code style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '0.1rem 0.4rem', borderRadius: '0.25rem' }}>salary_settings</code>
              </p>
            </div>

            <form onSubmit={handleSavePolicy} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Working Days */}
              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>Working Days Per Month</label>
                <input
                  type="number"
                  className="form-input"
                  style={{ width: '120px', fontWeight: 700 }}
                  value={salaryPolicy.workingDays}
                  onChange={e => setSalaryPolicy({ ...salaryPolicy, workingDays: Number(e.target.value) })}
                />
              </div>

              {/* Salary Calculation Policy */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Salary Calculation Rule</label>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="salaryPolicy"
                      value="working_days"
                      checked={salaryPolicy.salaryPolicy === 'working_days'}
                      onChange={e => setSalaryPolicy({ ...salaryPolicy, salaryPolicy: e.target.value })}
                    /> Working Days
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="salaryPolicy"
                      value="calendar_days"
                      checked={salaryPolicy.salaryPolicy === 'calendar_days'}
                      onChange={e => setSalaryPolicy({ ...salaryPolicy, salaryPolicy: e.target.value })}
                    /> Calendar Days
                  </label>
                </div>
              </div>

              {/* Half Day Policy */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Half Day Rule</label>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="halfDayPolicy"
                      value="50_percent"
                      checked={salaryPolicy.halfDayPolicy === '50_percent'}
                      onChange={e => setSalaryPolicy({ ...salaryPolicy, halfDayPolicy: e.target.value })}
                    /> 50% Deduction
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="halfDayPolicy"
                      value="no_deduction"
                      checked={salaryPolicy.halfDayPolicy === 'no_deduction'}
                      onChange={e => setSalaryPolicy({ ...salaryPolicy, halfDayPolicy: e.target.value })}
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
                      name="latePolicy"
                      value="no_deduction"
                      checked={salaryPolicy.latePolicy === 'no_deduction'}
                      onChange={e => setSalaryPolicy({ ...salaryPolicy, latePolicy: e.target.value })}
                    /> No Deduction
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="latePolicy"
                      value="deduct_after_3"
                      checked={salaryPolicy.latePolicy === 'deduct_after_3'}
                      onChange={e => setSalaryPolicy({ ...salaryPolicy, latePolicy: e.target.value })}
                    /> Deduct After 3 Lates
                  </label>
                </div>
              </div>

              {/* Deduction Rates Configuration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Income Tax (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={salaryPolicy.incomeTaxRate}
                    onChange={e => setSalaryPolicy({ ...salaryPolicy, incomeTaxRate: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Provident Fund (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={salaryPolicy.providentFundRate}
                    onChange={e => setSalaryPolicy({ ...salaryPolicy, providentFundRate: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Currency */}
              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>Currency</label>
                <select
                  className="form-select"
                  style={{ width: '140px', fontWeight: 700 }}
                  value={salaryPolicy.currency}
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

            {/* PAYROLL LOCK & GENERATION SCHEDULE SETTINGS FORM */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '2px solid var(--slate-border)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-text)', margin: '0 0 0.5rem 0' }}>
                Payroll Generation & Lock Schedule
              </h3>
              <form onSubmit={e => { e.preventDefault(); alert("Payroll Lock & Generation rules updated!"); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Payroll Generation Date</label>
                    <input type="text" className="form-input" defaultValue="25th of month" id="genDateInput" />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Payroll Lock Date</label>
                    <input type="text" className="form-input" defaultValue="30th of month" id="lockDateInput" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Auto Lock</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 700 }}>
                        <input type="radio" name="autoLock" defaultChecked value="YES" /> YES
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 700 }}>
                        <input type="radio" name="autoLock" value="NO" /> NO
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Allow Regeneration</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 700 }}>
                        <input type="radio" name="allowRegen" value="YES" /> YES
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 700 }}>
                        <input type="radio" name="allowRegen" defaultChecked value="NO" /> NO
                      </label>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-secondary" style={{ width: 'fit-content', fontSize: '0.8125rem' }}>
                  Save Schedule Rules
                </button>
              </form>
            </div>

            {/* BUDGET WARNING & BLOCK PAYROLL CONTROLS FORM */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '2px solid var(--slate-border)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-text)', margin: '0 0 0.5rem 0' }}>
                Budget Warning & Over-Budget Lock Rules
              </h3>
              <form onSubmit={e => { e.preventDefault(); alert("Budget Threshold & Block Payroll rules updated!"); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Warning Threshold %</label>
                    <input type="number" className="form-input" defaultValue={90} id="warnThresholdInput" />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontWeight: 700 }}>Critical Threshold %</label>
                    <input type="number" className="form-input" defaultValue={100} id="critThresholdInput" />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Block Payroll on Budget Exceed</label>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
                      <input type="radio" name="blockPayroll" defaultChecked value="YES" /> YES (Block Over-Budget Disbursement)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
                      <input type="radio" name="blockPayroll" value="NO" /> NO
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-secondary" style={{ width: 'fit-content', fontSize: '0.8125rem' }}>
                  Save Threshold Controls
                </button>
              </form>
            </div>
          </div>

          {/* ATTENDANCE-TO-SALARY DEDUCTION MATRIX TABLE */}
          <div className="card-base" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderBottom: '2px solid var(--slate-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-text)', margin: 0 }}>
                Attendance-to-Salary Deduction Matrix
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>
                Rule matrix linking attendance status to payroll deductions
              </p>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Attendance Status</th>
                    <th>Salary Calculation Effect</th>
                    <th>Policy Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { status: "Present", effect: "Full Salary", action: "100% Paid" },
                    { status: "Approved Leave", effect: "Full Salary", action: "Paid Leave" },
                    { status: "Official Duty (OD)", effect: "Full Salary", action: "Executive Duty" },
                    { status: "Government Holiday", effect: "Full Salary", action: "Gazetted Holiday" },
                    { status: "Absent", effect: "Deduct Salary", action: "Pro-rata Day Deduction" },
                    { status: "Half Day", effect: "50% Deduction", action: "50% Pay Deduction" },
                    { status: "Late", effect: "Warning", action: "Deduct after 3 Lates" }
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>{row.status}</td>
                      <td style={{ fontWeight: 700, color: row.effect.includes('Deduct') || row.effect.includes('50%') ? '#DC2626' : row.effect.includes('Warning') ? '#D97706' : '#059669' }}>
                        {row.effect}
                      </td>
                      <td style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-muted)' }}>{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Salary Components & Deductions Roster Table */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '2px solid var(--slate-border)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--slate-text)', margin: '0 0 0.75rem 0' }}>
                Salary Components & Deductions
              </h3>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Component Name</th>
                      <th>Category</th>
                      <th>Calculation Rule / Rate</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Basic Salary", type: "Base Pay", rule: "55% of Gross Salary", status: "Mandatory" },
                      { name: "House Rent", type: "Allowance", rule: "20% of Gross Salary", status: "Active" },
                      { name: "Medical", type: "Allowance", rule: "10% of Gross Salary", status: "Active" },
                      { name: "Transport", type: "Allowance", rule: "5% of Gross Salary", status: "Active" },
                      { name: "Special Allowance", type: "Allowance", rule: "4% Executive Duty", status: "Active" },
                      { name: "Festival Bonus", type: "Bonus", rule: "3% Eid/Boishakhi", status: "Active" },
                      { name: "Other Allowance", type: "Allowance", rule: "3% Miscellaneous", status: "Active" },
                      { name: "Income Tax %", type: "Deduction", rule: `${salaryPolicy.incomeTaxRate}% of Monthly Gross`, status: "Deduction" },
                      { name: "Provident Fund %", type: "Deduction", rule: `${salaryPolicy.providentFundRate}% of Basic Salary`, status: "Deduction" },
                      { name: "Absent Deduction", type: "Deduction", rule: "Pro-rata Working Days", status: "Deduction" },
                      { name: "Late Penalty", type: "Deduction", rule: "Deduct after 3 Lates", status: "Deduction" },
                      { name: "Loan Deduction", type: "Deduction", rule: "Staff Housing/Vehicle Loan", status: "Deduction" },
                      { name: "Other Deduction", type: "Deduction", rule: "Miscellaneous Penalty", status: "Deduction" }
                    ].map((comp, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700, color: '#0F172A' }}>{comp.name}</td>
                        <td>
                          <span className={`badge ${comp.type === 'Deduction' ? 'badge-warning' : 'badge-info'}`} style={{ fontSize: '0.675rem' }}>{comp.type}</span>
                        </td>
                        <td style={{ fontSize: '0.8125rem', fontWeight: 600, color: comp.type === 'Deduction' ? '#DC2626' : '#059669' }}>{comp.rule}</td>
                        <td>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: comp.type === 'Deduction' ? '#991B1B' : '#047857',
                            backgroundColor: comp.type === 'Deduction' ? '#FEE2E2' : '#ECFDF5',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '0.375rem'
                          }}>
                            {comp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2 MODAL: GOVERNMENT FINANCIAL ALLOCATION FOR SUPER ADMIN */}
      {isBudgetModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '520px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>Government Financial Allocation</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', margin: '0.125rem 0 0 0' }}>Ministry of Finance Revenue & ADP Allocation System</p>
              </div>
              <button onClick={() => setIsBudgetModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveBudget} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>Target Ministry</label>
                <select
                  className="form-select"
                  style={{ fontWeight: 700 }}
                  value={budgetForm.ministryId}
                  onChange={e => setBudgetForm({ ...budgetForm, ministryId: Number(e.target.value) })}
                >
                  {dummyMinistries.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Funding Source Category</label>
                  <select className="form-select">
                    <option value="gob">GOB Revenue Fund</option>
                    <option value="adp">ADP Development Fund</option>
                    <option value="special">Special Secretariat Grant</option>
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 700 }}>Fiscal Period</label>
                  <input type="text" className="form-input" defaultValue="FY 2026-27 Q1" />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>Government Sanction Order Ref No.</label>
                <input type="text" className="form-input" defaultValue="GO-FIN-2026-0891" />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700 }}>Allocated Monthly Budget (BDT Taka)</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}
                  value={budgetForm.allocatedAmount}
                  onChange={e => setBudgetForm({ ...budgetForm, allocatedAmount: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
                <button type="button" onClick={() => setIsBudgetModalOpen(false)} className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#059669', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Save size={16} /> Save Financial Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICER SALARY DETAILS & UPDATE MODAL */}
      {selectedOfficerForSalary && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ backgroundColor: '#FFFFFF', borderRadius: '1rem', maxWidth: '580px', width: '100%', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Officer Salary Breakdown & Itemized Deductions</h3>
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

                  {/* Itemized Components Roster */}
                  <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Basic Salary (55%):</span><strong>{formatBDT(comp.basic)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>House Rent (20%):</span><strong>+{formatBDT(comp.houseRent)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Medical (10%):</span><strong>+{formatBDT(comp.medical)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Transport (5%):</span><strong>+{formatBDT(comp.transport)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Special Allowance (4%):</span><strong>+{formatBDT(comp.specialAllowance)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Festival Bonus (3%):</span><strong>+{formatBDT(comp.festivalBonus)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Other Allowance (3%):</span><strong>+{formatBDT(comp.otherAllowance)}</strong></div>
                    <hr style={{ borderColor: '#E2E8F0', margin: '0.25rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#DC2626' }}><span>Income Tax ({salaryPolicy.incomeTaxRate}%):</span><strong>-{formatBDT(comp.taxDeduction)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#DC2626' }}><span>Provident Fund ({salaryPolicy.providentFundRate}% Basic):</span><strong>-{formatBDT(comp.pfDeduction)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#DC2626' }}><span>Absent Deduction:</span><strong>-{formatBDT(comp.absentDeduction)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#DC2626' }}><span>Late Penalty:</span><strong>-{formatBDT(comp.latePenalty)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#DC2626' }}><span>Loan Deduction:</span><strong>-{formatBDT(comp.loanDeduction)}</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#DC2626' }}><span>Other Deduction:</span><strong>-{formatBDT(comp.otherDeduction)}</strong></div>
                    <hr style={{ borderColor: '#E2E8F0', margin: '0.25rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#059669', fontWeight: 800 }}>
                      <span>Net Monthly Salary:</span><span>{formatBDT(comp.netSalary)}</span>
                    </div>
                  </div>

                  {/* Edit Salary Form */}
                  {isSuperAdmin ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: 'var(--slate-text)' }}>Edit Itemized Allowances & Deductions</h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Basic Salary</label>
                          <input
                            type="number"
                            className="form-input"
                            style={{ fontSize: '0.8125rem', fontWeight: 700 }}
                            defaultValue={comp.basic}
                            id="editBasicInput"
                          />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>House Rent</label>
                          <input
                            type="number"
                            className="form-input"
                            style={{ fontSize: '0.8125rem', fontWeight: 700 }}
                            defaultValue={comp.houseRent}
                            id="editHouseRentInput"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Medical Allowance</label>
                          <input
                            type="number"
                            className="form-input"
                            style={{ fontSize: '0.8125rem', fontWeight: 700 }}
                            defaultValue={comp.medical}
                            id="editMedicalInput"
                          />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Transport Allowance</label>
                          <input
                            type="number"
                            className="form-input"
                            style={{ fontSize: '0.8125rem', fontWeight: 700 }}
                            defaultValue={comp.transport}
                            id="editTransportInput"
                          />
                        </div>
                      </div>

                      {/* Deductions Inputs */}
                      <h5 style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem', fontWeight: 800, color: '#DC2626' }}>Itemized Deductions</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.7rem' }}>Income Tax</label>
                          <input type="number" className="form-input" style={{ fontSize: '0.75rem' }} defaultValue={comp.taxDeduction} id="editTaxInput" />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.7rem' }}>Provident Fund</label>
                          <input type="number" className="form-input" style={{ fontSize: '0.75rem' }} defaultValue={comp.pfDeduction} id="editPfInput" />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.7rem' }}>Absent Deduction</label>
                          <input type="number" className="form-input" style={{ fontSize: '0.75rem' }} defaultValue={0} id="editAbsentInput" />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.7rem' }}>Late Penalty</label>
                          <input type="number" className="form-input" style={{ fontSize: '0.75rem' }} defaultValue={0} id="editLateInput" />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.7rem' }}>Loan Deduction</label>
                          <input type="number" className="form-input" style={{ fontSize: '0.75rem' }} defaultValue={0} id="editLoanInput" />
                        </div>
                        <div>
                          <label className="form-label" style={{ fontSize: '0.7rem' }}>Other Deduction</label>
                          <input type="number" className="form-input" style={{ fontSize: '0.75rem' }} defaultValue={0} id="editOtherDedInput" />
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
                            const b = Number(document.getElementById('editBasicInput').value || 0);
                            const hr = Number(document.getElementById('editHouseRentInput').value || 0);
                            const med = Number(document.getElementById('editMedicalInput').value || 0);
                            const tr = Number(document.getElementById('editTransportInput').value || 0);

                            const tax = Number(document.getElementById('editTaxInput').value || 0);
                            const pf = Number(document.getElementById('editPfInput').value || 0);
                            const abs = Number(document.getElementById('editAbsentInput').value || 0);
                            const late = Number(document.getElementById('editLateInput').value || 0);
                            const loan = Number(document.getElementById('editLoanInput').value || 0);
                            const other = Number(document.getElementById('editOtherDedInput').value || 0);

                            const totalAllow = hr + med + tr;
                            const totalDed = tax + pf + abs + late + loan + other;
                            const net = b + totalAllow - totalDed;

                            const gross = Math.round((b + totalAllow) / 0.95);
                            selectedOfficerForSalary.monthlySalary = gross;
                            alert(`Saved itemized salary & deduction parameters for ${selectedOfficerForSalary.name}! Net Monthly: ৳ ${net.toLocaleString()}`);
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
