import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  ComposedChart
} from 'recharts';
import {
  Activity,
  Award,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  FileText,
  Download,
  Info,
  ChevronRight,
  Flame,
  Coffee,
  HeartPulse,
  Sparkles,
  RefreshCw,
  Building2,
  Home,
  Zap,
  Check,
  Stethoscope,
  Maximize2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  LEAD_THERAPIST_INFO,
  MOBILE_THERAPIST_INFO,
  DR_ADITI_DAILY_HISTORY,
  DR_ADITI_WEEKLY_AGGREGATES,
  TODAY_HOURLY_SLOTS,
  BURNOUT_RISK_FACTORS,
  STAFF_COMPARATIVE_BENCHMARKS,
  DEFAULT_GUARDRAILS,
  calculateSimulatedPerformance
} from '../data/staffPerformanceData';
import {
  ScheduleOptimizationGuardrails,
  UtilizationHealthZone,
  HourlyDensitySlot
} from '../types';

interface StaffPerformanceProps {
  onNavigateToScheduler?: () => void;
  onNavigateToPatients?: () => void;
}

// Color palette for charts
const STRAIN_COLORS = {
  High: '#ef4444',     // Red-500
  Moderate: '#f59e0b', // Amber-500
  Low: '#10b981',      // Emerald-500
  Rest_Admin: '#6366f1' // Indigo-500
};

export const StaffPerformance: React.FC<StaffPerformanceProps> = ({
  onNavigateToScheduler,
  onNavigateToPatients,
}) => {
  const { isDark } = useTheme();

  // Active therapist view
  const [selectedTherapist, setSelectedTherapist] = useState<'aditi' | 'vikram' | 'comparative'>('aditi');
  
  // Date/Period filter
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

  // Interactive Guardrails State for Simulator
  const [guardrails, setGuardrails] = useState<ScheduleOptimizationGuardrails>(DEFAULT_GUARDRAILS);
  
  // Selected hourly slot for detailed inspection
  const [activeSlot, setActiveSlot] = useState<HourlyDensitySlot | null>(TODAY_HOURLY_SLOTS[3]); // Default to Ananya D.

  // Export notification toast
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Active chart view tab
  const [activeChartTab, setActiveChartTab] = useState<'weekly_hours' | 'utilization_trend' | 'intensity_mix' | 'four_week_ramp'>('weekly_hours');

  // Chart theme colors for Recharts
  const chartTheme = useMemo(() => ({
    text: isDark ? '#a8a29e' : '#57534e',
    grid: isDark ? '#292524' : '#f5f5f4',
    tooltipBg: isDark ? '#1c1917' : '#ffffff',
    tooltipBorder: isDark ? '#44403c' : '#e7e5e4',
  }), [isDark]);

  // Current Day Reference (Monday - Today)
  const todayRecord = DR_ADITI_DAILY_HISTORY[0];

  // Simulated metrics based on active guardrail settings
  const simulated = useMemo(() => {
    return calculateSimulatedPerformance(todayRecord, guardrails);
  }, [todayRecord, guardrails]);

  // Handle Guardrail Toggles
  const toggleGuardrail = (key: keyof ScheduleOptimizationGuardrails) => {
    setGuardrails(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Reset Guardrails to Recommended Defaults
  const resetToRecommended = () => {
    setGuardrails(DEFAULT_GUARDRAILS);
  };

  // Set preset: Recovery Day (Light load)
  const applyRecoveryPreset = () => {
    setGuardrails({
      enforce15MinInterSessionBuffer: true,
      protect45MinLunchWindow: true,
      capDailyManualTherapySessions: true,
      maxManualSessionsLimit: 2,
      delegateModalityPrepToAssistant: true,
      lockDocumentationBlockEndDay: true,
      staggerEveningPeakSlots: true,
    });
  };

  // Set preset: Peak Intensive Day (High volume)
  const applyPeakPreset = () => {
    setGuardrails({
      enforce15MinInterSessionBuffer: false,
      protect45MinLunchWindow: true,
      capDailyManualTherapySessions: false,
      maxManualSessionsLimit: 6,
      delegateModalityPrepToAssistant: true,
      lockDocumentationBlockEndDay: true,
      staggerEveningPeakSlots: false,
    });
  };

  // CSV Export Functionality
  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Day',
      'Therapist',
      'Shift Hours',
      'Available Hours',
      'Clinical Direct Hours',
      'SOAP & Admin Hours',
      'Buffer & Rest Hours',
      'Idle Hours',
      'Utilization Rate %',
      'Effective Productive %',
      'Completed Sessions',
      'Scheduled Sessions',
      'Manual High Intensity Sessions',
      'Burnout Risk Score (0-100)',
      'Burnout Status',
      'Gross Revenue (INR)',
      'Patient Rating'
    ];

    const rows = DR_ADITI_DAILY_HISTORY.map(d => [
      d.date,
      `"${d.dayName}"`,
      `"${d.therapistName}"`,
      d.totalShiftHours,
      d.availableHours,
      d.clinicalDirectHours,
      d.adminDocumentationHours,
      d.bufferRestHours,
      d.idleCapacityHours,
      `${d.utilizationRatePercent}%`,
      `${d.effectiveUtilizationPercent}%`,
      d.completedSessions,
      d.scheduledSessions,
      d.highIntensityManualSessions,
      d.burnoutRiskScore,
      d.burnoutStatus,
      d.revenueGeneratedInr,
      d.patientFeedbackScore
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lead_PT_Utilization_Audit_Dr_Aditi_Rao_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Utilization audit report exported successfully (CSV)!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Calculate high-strain count
  const highStrainCount = TODAY_HOURLY_SLOTS.filter(s => s.strainLevel === 'High').length;
  const completedSlotsCount = TODAY_HOURLY_SLOTS.filter(s => s.status === 'Completed').length;
  const inProgressSlotsCount = TODAY_HOURLY_SLOTS.filter(s => s.status === 'In-Progress').length;
  const scheduledSlotsCount = TODAY_HOURLY_SLOTS.filter(s => s.status === 'Scheduled').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {exportNotice && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-2 border border-emerald-600 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span className="text-xs font-semibold">{exportNotice}</span>
        </div>
      )}

      {/* Header Banner & Therapist Switcher */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black shadow-xs">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                    Staff Performance & Utilization
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800">
                    Lead PT Workload Engine
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Tracking session completion volume vs. available clinic hours, ergonomic manual therapy strain, and burnout prevention guardrails.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 transition-colors cursor-pointer"
              title="Download full utilization and session audit report"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
              Export Audit CSV
            </button>

            {onNavigateToScheduler && (
              <button
                onClick={onNavigateToScheduler}
                className="inline-flex items-center px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Live Smart Scheduler
              </button>
            )}
          </div>
        </div>

        {/* Therapist Selector Bar */}
        <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mr-1">
              Active Focus:
            </span>
            <button
              onClick={() => setSelectedTherapist('aditi')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                selectedTherapist === 'aditi'
                  ? 'bg-teal-800 text-white ring-2 ring-teal-500 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse"></span>
              <span>Dr. Aditi Rao, MPT (Lead In-Clinic)</span>
            </button>

            <button
              onClick={() => setSelectedTherapist('vikram')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                selectedTherapist === 'vikram'
                  ? 'bg-emerald-800 text-white ring-2 ring-emerald-500 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>Dr. Vikram K., BPT (Mobile Elder Lead)</span>
            </button>

            <button
              onClick={() => setSelectedTherapist('comparative')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                selectedTherapist === 'comparative'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 ring-2 ring-stone-400 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <span>Team Benchmarks</span>
            </button>
          </div>

          {/* Time View Filter */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-lg self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setSelectedPeriod('today')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                selectedPeriod === 'today'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Today (Mon, Sep 07)
            </button>
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                selectedPeriod === 'week'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Current Week (6-Day)
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                selectedPeriod === 'month'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              4-Week Trend
            </button>
          </div>
        </div>
      </div>

      {/* Lead Physiotherapist Profile Header Card */}
      {selectedTherapist === 'aditi' && (
        <div className="bg-teal-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none flex items-center justify-end pr-6">
            <HeartPulse className="w-64 h-64 text-teal-200" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-800 border-2 border-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
                AR
              </div>
              <div>
                <div className="flex items-center space-x-2.5 flex-wrap">
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {LEAD_THERAPIST_INFO.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-800 text-teal-200 border border-teal-600">
                    {LEAD_THERAPIST_INFO.role}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700">
                    4.9 / 5.0 Patient Rating
                  </span>
                </div>
                <p className="text-xs text-teal-200 mt-1 max-w-2xl">
                  {LEAD_THERAPIST_INFO.credentials} • {LEAD_THERAPIST_INFO.specialization}
                </p>
                <div className="flex items-center space-x-3 text-[11px] text-teal-300 mt-2">
                  <span className="flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-teal-400" />
                    {LEAD_THERAPIST_INFO.baseLocation}
                  </span>
                  <span>•</span>
                  <span>Weekly Contract: {LEAD_THERAPIST_INFO.weeklyContractHours}h</span>
                  <span>•</span>
                  <span className="text-emerald-300 font-bold">
                    Safe Utilization Target: {LEAD_THERAPIST_INFO.targetUtilizationMin}% - {LEAD_THERAPIST_INFO.targetUtilizationMax}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Burnout Health Status */}
            <div className="bg-teal-950/70 border border-teal-700/60 rounded-xl p-3.5 min-w-[240px]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-teal-300 font-semibold flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  Burnout Protection
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-900 text-emerald-200 border border-emerald-700">
                  Optimal & Safe
                </span>
              </div>
              <div className="w-full bg-teal-900/80 rounded-full h-2 overflow-hidden mb-1">
                <div
                  className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${todayRecord.burnoutRiskScore}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-teal-300">
                <span>Fatigue Index: {todayRecord.burnoutRiskScore}/100</span>
                <span className="text-emerald-300 font-bold">15m Buffers Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dr. Vikram K. Mobile Lead Banner */}
      {selectedTherapist === 'vikram' && (
        <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-800 border-2 border-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
                VK
              </div>
              <div>
                <div className="flex items-center space-x-2.5 flex-wrap">
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {MOBILE_THERAPIST_INFO.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-800 text-emerald-200 border border-emerald-600">
                    {MOBILE_THERAPIST_INFO.role}
                  </span>
                </div>
                <p className="text-xs text-emerald-200 mt-1 max-w-2xl">
                  {MOBILE_THERAPIST_INFO.credentials} • {MOBILE_THERAPIST_INFO.specialization}
                </p>
                <div className="flex items-center space-x-3 text-[11px] text-emerald-300 mt-2">
                  <span className="flex items-center">
                    <Home className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    {MOBILE_THERAPIST_INFO.baseLocation}
                  </span>
                  <span>•</span>
                  <span>Direct Contact: 26h/wk • Transit: 13.5h/wk</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/70 border border-emerald-700/60 rounded-xl p-3.5 min-w-[240px]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-emerald-300 font-semibold flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  Transit Workload Status
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-900 text-emerald-200 border border-emerald-700">
                  91.7% Productive
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                Home visit direct care (54%) + Road transit buffers (28%) + SOAP documentation (9%).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOP KEY METRICS CARDS (4 PRIMARY METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Clinical Direct Utilization */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4.5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Clinical Utilization Rate
            </span>
            <span className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200">
              <Activity className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {todayRecord.utilizationRatePercent}%
            </span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Optimal Zone
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
              <span>Contact: {todayRecord.clinicalDirectHours}h</span>
              <span>Available: {todayRecord.availableHours}h</span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-teal-700 h-2 rounded-full"
                style={{ width: `${Math.min(100, todayRecord.utilizationRatePercent)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-stone-400 mt-1">
              <span>Target: 65% - 75%</span>
              <span className="text-rose-500 font-semibold">Burnout: &gt;82%</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Session Volume & Target */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4.5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Session Completion Volume
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {todayRecord.completedSessions}
            </span>
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
              / {todayRecord.scheduledSessions} Scheduled
            </span>
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
              ({Math.round((todayRecord.completedSessions / todayRecord.scheduledSessions) * 100)}%)
            </span>
          </div>

          <div className="mt-3 text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Weekly Pace:</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">39 / 42 Target (92.8%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cancellation / No-Show:</span>
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">0% (1 Rescheduled)</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-stone-400">
              <span>High Manual Load: 3</span>
              <span>Gym Rehab: 2</span>
              <span>Modalities: 1</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Available vs Productive Hours Balance */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4.5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Effective Productive Hours
            </span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-200">
              <Clock className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {todayRecord.effectiveUtilizationPercent}%
            </span>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              6.75h / 7.75h
            </span>
          </div>

          <div className="mt-3 text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-teal-600 mr-1.5"></span>
                Direct 1-on-1 Care:
              </span>
              <span className="font-semibold">{todayRecord.clinicalDirectHours} hrs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"></span>
                SOAP & Charting:
              </span>
              <span className="font-semibold">{todayRecord.adminDocumentationHours} hrs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
                Buffer / Lunch Break:
              </span>
              <span className="font-semibold">45m Secured</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Burnout Risk & Ergonomic Strain Score */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4.5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Ergonomic & Burnout Index
            </span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
              <Flame className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {todayRecord.burnoutRiskScore}
            </span>
            <span className="text-xs text-stone-400">/ 100</span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              Low Fatigue Risk
            </span>
          </div>

          <div className="mt-3 text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>Max Consecutive Sessions:</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">2 (Safe Cap: 3)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Longest Continuous Stretch:</span>
              <span className="font-semibold text-stone-700 dark:text-stone-300">2h 15m (Alert at &gt;3h)</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              <span>Assistant PT Modality Delegated</span>
              <span>15m Buffers Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* CLINICAL UTILIZATION SPECTRUM & SAFE CAPACITY GAUGE */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center">
              <GaugeIcon className="w-4 h-4 mr-2 text-teal-700 dark:text-teal-400" />
              Clinical Utilization Spectrum & Sustainable Capacity Zones
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Why 65% – 75% is the gold standard for Orthopedic Lead Physiotherapists in a high-volume outpatient clinic.
            </p>
          </div>
          <div className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 self-start md:self-auto">
            Current: {todayRecord.utilizationRatePercent}% (Dr. Aditi Rao)
          </div>
        </div>

        {/* Visual Spectrum Bar */}
        <div className="mt-4">
          <div className="relative h-6 rounded-xl overflow-hidden flex shadow-inner">
            {/* Zone 1: Under-Utilized (0 - 60%) */}
            <div
              className="bg-sky-200 dark:bg-sky-950 flex items-center justify-center text-[10px] font-bold text-sky-800 dark:text-sky-300 border-r border-white dark:border-stone-900"
              style={{ width: '60%' }}
            >
              Under-Utilized (&lt;60%) • Idle Capacity
            </div>

            {/* Zone 2: Optimal Sweet Spot (60% - 75%) */}
            <div
              className="bg-emerald-500 dark:bg-emerald-600 flex items-center justify-center text-[10px] font-black text-white border-r border-white dark:border-stone-900 shadow-sm"
              style={{ width: '15%' }}
            >
              ⭐ Optimal (65-75%)
            </div>

            {/* Zone 3: High Workload Warning (75% - 82%) */}
            <div
              className="bg-amber-400 dark:bg-amber-500 flex items-center justify-center text-[10px] font-bold text-amber-950 border-r border-white dark:border-stone-900"
              style={{ width: '7%' }}
            >
              High (75-82%)
            </div>

            {/* Zone 4: Critical Burnout Hazard (>82%) */}
            <div
              className="bg-rose-500 dark:bg-rose-700 flex items-center justify-center text-[10px] font-black text-white"
              style={{ width: '18%' }}
            >
              🚨 Burnout Hazard (&gt;82%)
            </div>

            {/* Current Position Marker Indicator */}
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-stone-900 dark:bg-white shadow-lg z-10 transition-all duration-700"
              style={{ left: `${Math.min(99, Math.max(1, todayRecord.utilizationRatePercent))}%` }}
            >
              <div className="absolute -top-3.5 -left-2 text-[9px] font-black bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-1 rounded shadow">
                ▼ {todayRecord.utilizationRatePercent}%
              </div>
            </div>
          </div>

          {/* Legend Explanation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
              <span className="font-bold text-sky-700 dark:text-sky-400 block mb-0.5">
                Under-Utilized (&lt;60%)
              </span>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Excess idle gaps between appointments. Clinic rent is under-leveraged, leading to revenue shortfall.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                Optimal Sustainable (65% – 75%)
              </span>
              <p className="text-[11px] text-stone-600 dark:text-stone-300">
                The clinical sweet spot. Delivers 6–7 high-quality 60-min sessions while leaving ample time for SOAP notes, sanitization, and thumb recovery.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                High Workload (75% – 82%)
              </span>
              <p className="text-[11px] text-stone-600 dark:text-stone-300">
                Warning threshold. Rushed transitions, delayed chart documentation, and physical fatigue during evening shifts.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <span className="font-bold text-rose-800 dark:text-rose-300 block mb-0.5">
                Burnout Hazard (&gt;82%)
              </span>
              <p className="text-[11px] text-stone-600 dark:text-stone-300">
                Dangerous physical overload. High probability of therapist carpal tunnel / tendonitis, skipped meals, and patient care decline.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RECHARTS VISUAL ANALYTICS TABS */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-teal-700 dark:text-teal-400" />
              Lead Physiotherapist Utilization & Volume Analytics
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Visual breakdown of clinical contact hours, administrative charting, and fatigue trajectories.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveChartTab('weekly_hours')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartTab === 'weekly_hours'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Weekly Hours Stacked
            </button>
            <button
              onClick={() => setActiveChartTab('utilization_trend')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartTab === 'utilization_trend'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Utilization vs Redline
            </button>
            <button
              onClick={() => setActiveChartTab('intensity_mix')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartTab === 'intensity_mix'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Ergonomic Load Mix
            </button>
            <button
              onClick={() => setActiveChartTab('four_week_ramp')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartTab === 'four_week_ramp'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              4-Week Trajectory
            </button>
          </div>
        </div>

        {/* CHART 1: WEEKLY HOURS ALLOCATION (STACKED BAR) */}
        {activeChartTab === 'weekly_hours' && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                Daily Shift Hours Breakdown (Monday to Saturday)
              </span>
              <div className="flex items-center space-x-3 text-[11px] text-stone-400">
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-xs bg-teal-600 mr-1"></span>
                  Direct Clinical Care
                </span>
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500 mr-1"></span>
                  SOAP & Charting
                </span>
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 mr-1"></span>
                  Buffer & Rest
                </span>
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-xs bg-stone-300 dark:bg-stone-600 mr-1"></span>
                  Open Available
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DR_ADITI_DAILY_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                  <XAxis
                    dataKey="dayName"
                    tick={{ fill: chartTheme.text, fontSize: 11 }}
                    tickFormatter={(val: string) => val.split(' ')[0]}
                  />
                  <YAxis
                    tick={{ fill: chartTheme.text, fontSize: 11 }}
                    unit="h"
                    domain={[0, 9]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartTheme.tooltipBg,
                      borderColor: chartTheme.tooltipBorder,
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: string) => [`${val} hours`, name]}
                  />
                  <ReferenceLine
                    y={5.5}
                    stroke="#0d9488"
                    strokeDasharray="4 4"
                    label={{ value: 'Target Direct (5.5h)', fill: '#0d9488', fontSize: 10, position: 'insideTopRight' }}
                  />
                  <ReferenceLine
                    y={7.75}
                    stroke="#f43f5e"
                    strokeDasharray="3 3"
                    label={{ value: 'Shift Limit (7.75h)', fill: '#f43f5e', fontSize: 10, position: 'insideTopRight' }}
                  />
                  <Bar dataKey="clinicalDirectHours" name="Direct Clinical" stackId="a" fill="#0d9488" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="adminDocumentationHours" name="SOAP Charting" stackId="a" fill="#6366f1" />
                  <Bar dataKey="bufferRestHours" name="Buffer & Rest" stackId="a" fill="#10b981" />
                  <Bar dataKey="idleCapacityHours" name="Open Available" stackId="a" fill={isDark ? '#44403c' : '#d6d3d1'} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 flex items-start space-x-2">
              <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong>Clinical Takeaway:</strong> Wednesday had a high volume spike (6.5 direct care hours, 83.9% utilization), producing forearm strain and delaying SOAP documentation. Injecting a 15-minute buffer on Thursday restored utilization to a sustainable 67.7% with zero clinical backlog.
              </div>
            </div>
          </div>
        )}

        {/* CHART 2: DAILY UTILIZATION RATE VS BURNOUT REDLINE */}
        {activeChartTab === 'utilization_trend' && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                Daily Utilization Rate % vs. Fatigue Thresholds
              </span>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                  <span className="w-2.5 h-1 bg-emerald-500 mr-1"></span>
                  Optimal Band (65% - 75%)
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center">
                  <span className="w-2.5 h-1 bg-rose-500 mr-1"></span>
                  Burnout Alert (&gt;80%)
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={DR_ADITI_DAILY_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                  <XAxis
                    dataKey="dayName"
                    tick={{ fill: chartTheme.text, fontSize: 11 }}
                    tickFormatter={(val: string) => val.split(' ')[0]}
                  />
                  <YAxis
                    tick={{ fill: chartTheme.text, fontSize: 11 }}
                    unit="%"
                    domain={[40, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartTheme.tooltipBg,
                      borderColor: chartTheme.tooltipBorder,
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: string) => [`${val}%`, name]}
                  />
                  <ReferenceLine
                    y={80}
                    stroke="#e11d48"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    label={{ value: 'Burnout Redline (80%)', fill: '#e11d48', fontSize: 10, position: 'insideTopLeft' }}
                  />
                  <ReferenceLine
                    y={65}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    label={{ value: 'Optimal Floor (65%)', fill: '#10b981', fontSize: 10, position: 'insideBottomLeft' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="effectiveUtilizationPercent"
                    name="Effective Productive % (Inc. Admin)"
                    fill="#3b82f6"
                    stroke="#3b82f6"
                    fillOpacity={0.1}
                  />
                  <Line
                    type="monotone"
                    dataKey="utilizationRatePercent"
                    name="Direct Clinical Utilization %"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#0d9488', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800">
                <span className="text-stone-400 block text-[10px]">Weekly Average</span>
                <span className="text-sm font-bold text-teal-700 dark:text-teal-300">73.8%</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800">
                <span className="text-stone-400 block text-[10px]">Peak Utilization</span>
                <span className="text-sm font-bold text-amber-600">83.9% (Wed)</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800">
                <span className="text-stone-400 block text-[10px]">Lowest Utilization</span>
                <span className="text-sm font-bold text-sky-600">67.7% (Thu)</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800">
                <span className="text-stone-400 block text-[10px]">Fatigue Days Flagged</span>
                <span className="text-sm font-bold text-rose-500">1 / 6 Days</span>
              </div>
            </div>
          </div>
        )}

        {/* CHART 3: ERGONOMIC LOAD MIX */}
        {activeChartTab === 'intensity_mix' && (
          <div className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
                  Session Treatment Intensity Distribution (Physical Load on Lead PT)
                </span>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                  Manual joint mobilization requires 3x higher musculoskeletal exertion from the therapist compared to modalities or guided gym exercises.
                </p>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                        <span className="font-bold text-rose-900 dark:text-rose-200">
                          High Physical Strain: 43.6% (17 Sessions)
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 ml-5">
                        Post-op ACL extension overpressure, Maitland Grade III/IV knee OA glide, manual cervical spine traction.
                      </p>
                    </div>
                    <span className="text-xs font-black text-rose-700 dark:text-rose-300">Cap: 4/day</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                        <span className="font-bold text-amber-900 dark:text-amber-200">
                          Moderate Physical Strain: 35.9% (14 Sessions)
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 ml-5">
                        Active functional gym, parallel bar gait re-education, Theraband resistance supervision.
                      </p>
                    </div>
                    <span className="text-xs font-black text-amber-700 dark:text-amber-300">Safe</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span className="font-bold text-emerald-900 dark:text-emerald-200">
                          Low Strain / Modalities: 20.5% (8 Sessions)
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 ml-5">
                        IFT 4-pole, Ultrasound 1MHz, cryotherapy prep. Delegated to Assistant PT.
                      </p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">Delegated</span>
                  </div>
                </div>
              </div>

              {/* Pie Chart Representation */}
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'High Physical Strain (Manual Mob)', value: 17, color: '#ef4444' },
                        { name: 'Moderate Strain (Active Gym)', value: 14, color: '#f59e0b' },
                        { name: 'Low Strain (Modalities / Delegated)', value: 8, color: '#10b981' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#ef4444" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#10b981" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: chartTheme.tooltipBg,
                        borderColor: chartTheme.tooltipBorder,
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                      formatter={(val: any, name: string) => [`${val} sessions`, name]}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* CHART 4: 4-WEEK TRAJECTORY (RECOVERY AFTER SPIKE) */}
        {activeChartTab === 'four_week_ramp' && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                Monthly Progression: How Schedule Guardrails Rescued Dr. Aditi from Week 3 Burnout
              </span>
              <span className="text-teal-700 dark:text-teal-300 font-bold">
                Trailing 4 Weeks Aggregates
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DR_ADITI_WEEKLY_AGGREGATES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                  <XAxis dataKey="weekLabel" tick={{ fill: chartTheme.text, fontSize: 10 }} />
                  <YAxis tick={{ fill: chartTheme.text, fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartTheme.tooltipBg,
                      borderColor: chartTheme.tooltipBorder,
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="clinicalHours" name="Direct Clinical Hours" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="adminHours" name="Admin & Charting Hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgFatigueScore" name="Avg Fatigue Index (0-100)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-stone-600 dark:text-stone-300 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong>Key Management Insight:</strong> In Week 3, volume pushed to 44 sessions (82.8% utilization), causing therapist fatigue index to spike to 76/100 and generating 2 chart backlogs. Week 4 instituted automated 15-min buffers and mandatory 45-min lunch locks, bringing utilization to an optimal 72.0% while generating ₹39,000/week sustainably.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TODAY'S HOURLY SCHEDULE DENSITY & FATIGUE TIMELINE */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-teal-700 dark:text-teal-400" />
              Today's Live Hourly Schedule Density & Ergonomic Strain (Dr. Aditi Rao)
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Hour-by-hour operational timeline (08:00 to 19:00). Click any slot to inspect patient clinical notes, strain level, and buffer status.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
              {completedSlotsCount} Completed
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold text-[11px]">
              {inProgressSlotsCount} In Progress
            </span>
            <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-semibold text-[11px]">
              {scheduledSlotsCount} Scheduled
            </span>
          </div>
        </div>

        {/* Hourly Slot Interactive Grid */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Slots List Column (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
            {TODAY_HOURLY_SLOTS.map((slot) => {
              const isSelected = activeSlot?.slotId === slot.slotId;
              const isHighStrain = slot.strainLevel === 'High';
              const isBreak = slot.status === 'Break';
              const isAdmin = slot.status === 'Admin_SOAP';
              const isAvailable = slot.status === 'Available';

              return (
                <div
                  key={slot.slotId}
                  onClick={() => setActiveSlot(slot)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30 ring-2 ring-teal-500 shadow-xs'
                      : isHighStrain
                      ? 'border-rose-200 dark:border-rose-900 bg-rose-50/30 dark:bg-rose-950/20 hover:bg-rose-50/60'
                      : isBreak
                      ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20 hover:bg-emerald-50/60'
                      : isAdmin
                      ? 'border-indigo-200 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-950/20 hover:bg-indigo-50/60'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {/* Time pill */}
                    <div className="w-24 shrink-0 text-center">
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                        {slot.timeRange.split(' - ')[0]}
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        {slot.durationMinutes} mins
                      </span>
                    </div>

                    {/* Status & Strain Icon Indicator */}
                    <div className="shrink-0">
                      {isHighStrain ? (
                        <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 block" title="High Physical Strain">
                          <Flame className="w-4 h-4" />
                        </span>
                      ) : isBreak ? (
                        <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 block" title="Rest Break">
                          <Coffee className="w-4 h-4" />
                        </span>
                      ) : isAdmin ? (
                        <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 block" title="Admin & SOAP Charting">
                          <FileText className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 block" title="Moderate Clinical Session">
                          <Stethoscope className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    {/* Patient & Condition Details */}
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                          {slot.patientName || (isBreak ? 'Rest / Hydration Break' : isAdmin ? 'SOAP Charting & Case Review' : 'Open Buffer Slot')}
                        </span>
                        {slot.status === 'Completed' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            Done
                          </span>
                        )}
                        {slot.status === 'In-Progress' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white animate-pulse">
                            Active Now
                          </span>
                        )}
                        {slot.status === 'Scheduled' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                            Upcoming
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                        {slot.conditionDiagnosis || slot.bayOrStation}
                      </p>
                    </div>
                  </div>

                  {/* Strain Badge & Buffer Tag */}
                  <div className="shrink-0 flex items-center space-x-2 text-right">
                    {slot.strainLevel === 'High' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                        High Strain
                      </span>
                    )}
                    {slot.strainLevel === 'Moderate' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        Moderate
                      </span>
                    )}
                    {slot.strainLevel === 'Rest_Admin' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        Rest / Admin
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slot Detail Card (1/3 width on desktop) */}
          <div className="bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl p-4 flex flex-col justify-between">
            {activeSlot ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      Slot Inspector
                    </span>
                    <span className="font-semibold">{activeSlot.timeRange}</span>
                  </div>
                  <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {activeSlot.patientName || activeSlot.bayOrStation}
                  </h4>
                  {activeSlot.conditionDiagnosis && (
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                      {activeSlot.conditionDiagnosis}
                    </p>
                  )}
                </div>

                {/* Station & Physical Exertion */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">
                      Clinical Location & Station
                    </span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {activeSlot.bayOrStation}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">
                      Therapist Strain Assessment
                    </span>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        activeSlot.strainLevel === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : activeSlot.strainLevel === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {activeSlot.strainLevel} Physical Load
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {activeSlot.manualTherapyRequired ? 'Manual joint glide / hold' : 'Active guided / admin'}
                      </span>
                    </div>
                  </div>

                  {activeSlot.assistantAssigned && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block uppercase">
                        Assistant PT Delegation
                      </span>
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                        {activeSlot.assistantAssigned}
                      </p>
                    </div>
                  )}

                  <div className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">
                      Optimization & Recovery Advice
                    </span>
                    <p className="text-[11px] text-stone-700 dark:text-stone-300 mt-0.5">
                      {activeSlot.suggestedAction}
                    </p>
                  </div>
                </div>

                {onNavigateToScheduler && (
                  <button
                    onClick={onNavigateToScheduler}
                    className="w-full mt-2 py-2 rounded-lg bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs transition-colors flex items-center justify-center cursor-pointer"
                  >
                    View Slot in Smart Scheduler
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-4 text-xs text-stone-400">
                Click any slot on the left to inspect ergonomic strain and recommendations.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SCHEDULE OPTIMIZER & BURNOUT GUARDRAIL SIMULATOR */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-stone-800 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-5 h-5 text-teal-400" />
              <h3 className="text-lg font-bold tracking-tight text-white">
                Schedule Optimizer & Burnout Guardrail Simulator
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-800 text-teal-200 border border-teal-600">
                Live Capacity Engine
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Toggle clinical guardrails to simulate the impact on Dr. Aditi's utilization %, daily revenue, and fatigue score.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={resetToRecommended}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold border border-stone-700 transition-colors cursor-pointer"
            >
              Recommended Default
            </button>
            <button
              onClick={applyRecoveryPreset}
              className="px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 font-semibold border border-emerald-700 transition-colors cursor-pointer"
            >
              Recovery Mode
            </button>
            <button
              onClick={applyPeakPreset}
              className="px-3 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-900 text-rose-200 font-semibold border border-rose-700 transition-colors cursor-pointer"
            >
              Peak Intensive
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Guardrail Toggles (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-3">
            {/* Guardrail 1 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/80 hover:border-teal-500/50 transition-colors">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="g-buffer"
                  checked={guardrails.enforce15MinInterSessionBuffer}
                  onChange={() => toggleGuardrail('enforce15MinInterSessionBuffer')}
                  className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="g-buffer" className="text-xs font-bold text-white cursor-pointer">
                    Enforce 15-Minute Inter-Session Buffer
                  </label>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Guarantees a micro-rest interval between patients for hand stretch, hydration, and bed sanitization.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-400 shrink-0 ml-3">
                {guardrails.enforce15MinInterSessionBuffer ? '-12 Fatigue Pts' : '+22 Fatigue Hazard'}
              </span>
            </div>

            {/* Guardrail 2 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/80 hover:border-teal-500/50 transition-colors">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="g-lunch"
                  checked={guardrails.protect45MinLunchWindow}
                  onChange={() => toggleGuardrail('protect45MinLunchWindow')}
                  className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="g-lunch" className="text-xs font-bold text-white cursor-pointer">
                    Protect 45-Minute Mid-Day Lunch Window (1:00 PM - 1:45 PM)
                  </label>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Hard-locks the booking engine to prevent midday patient overlap and avoid meal-skipping burnout.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-400 shrink-0 ml-3">
                {guardrails.protect45MinLunchWindow ? '-15 Fatigue Pts' : '+28 Fatigue Hazard'}
              </span>
            </div>

            {/* Guardrail 3 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/80 hover:border-teal-500/50 transition-colors">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="g-cap-manual"
                  checked={guardrails.capDailyManualTherapySessions}
                  onChange={() => toggleGuardrail('capDailyManualTherapySessions')}
                  className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="g-cap-manual" className="text-xs font-bold text-white cursor-pointer">
                    Cap Daily High-Force Manual Therapy Cases (Max {guardrails.maxManualSessionsLimit}/Day)
                  </label>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Limits high-load joint mobilization (ACL rehab, spine traction) to protect therapist carpal joints.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-400 shrink-0 ml-3">
                {guardrails.capDailyManualTherapySessions ? 'Ergonomic Cap Active' : 'Uncapped Strain'}
              </span>
            </div>

            {/* Guardrail 4 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/80 hover:border-teal-500/50 transition-colors">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="g-delegate"
                  checked={guardrails.delegateModalityPrepToAssistant}
                  onChange={() => toggleGuardrail('delegateModalityPrepToAssistant')}
                  className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="g-delegate" className="text-xs font-bold text-white cursor-pointer">
                    Delegate Modalities & Prep to Junior Assistant PT
                  </label>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Assistant attaches IFT pads & hot packs, freeing 15 mins per patient for Dr. Aditi's SOAP charting.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-400 shrink-0 ml-3">
                +45m Charting Time
              </span>
            </div>

            {/* Guardrail 5 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/80 hover:border-teal-500/50 transition-colors">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="g-doc-block"
                  checked={guardrails.lockDocumentationBlockEndDay}
                  onChange={() => toggleGuardrail('lockDocumentationBlockEndDay')}
                  className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <div>
                  <label htmlFor="g-doc-block" className="text-xs font-bold text-white cursor-pointer">
                    Dedicated 30-Min End-of-Day Documentation Block (6:30 PM)
                  </label>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Eliminates overtime by finalizing patient notes before clinic departure.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-400 shrink-0 ml-3">
                Zero Late Overtime
              </span>
            </div>
          </div>

          {/* Real-time Simulated Outcome Dashboard */}
          <div className="bg-stone-800 border border-stone-700 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block mb-1">
                Simulated Workload Impact
              </span>
              <h4 className="text-lg font-bold text-white">
                Projected Day Metrics
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Dynamic recalculated outcomes based on your guardrail settings.
              </p>

              <div className="mt-5 space-y-4">
                {/* Simulated Utilization */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-300">Projected Utilization Rate:</span>
                    <span className="font-extrabold text-white text-base">
                      {simulated.utilization}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        simulated.status === 'Optimal'
                          ? 'bg-teal-400'
                          : simulated.status === 'High-Workload'
                          ? 'bg-amber-400'
                          : simulated.status === 'Critical-Burnout'
                          ? 'bg-rose-500'
                          : 'bg-sky-400'
                      }`}
                      style={{ width: `${Math.min(100, simulated.utilization)}%` }}
                    ></div>
                  </div>
                  <span className={`text-[11px] font-bold block mt-1 ${
                    simulated.status === 'Optimal' ? 'text-teal-300' : simulated.status === 'High-Workload' ? 'text-amber-300' : 'text-rose-400'
                  }`}>
                    Zone: {simulated.status}
                  </span>
                </div>

                {/* Simulated Fatigue Index */}
                <div className="p-3 rounded-lg bg-stone-900/80 border border-stone-700">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-stone-300">Fatigue & Burnout Score:</span>
                    <span className={`font-black text-sm ${
                      simulated.burnoutScore < 45 ? 'text-emerald-400' : simulated.burnoutScore < 70 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {simulated.burnoutScore} / 100
                    </span>
                  </div>
                  <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        simulated.burnoutScore < 45 ? 'bg-emerald-400' : simulated.burnoutScore < 70 ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${simulated.burnoutScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Projected Revenue */}
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-stone-900/80">
                  <span className="text-stone-300">Projected Daily Revenue:</span>
                  <span className="font-bold text-teal-300 text-sm">
                    ₹{simulated.revenue.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Direct Contact Hours */}
                <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-stone-900/80">
                  <span className="text-stone-300">Net Contact Care Hours:</span>
                  <span className="font-bold text-white text-sm">
                    {simulated.directHours} hrs ({simulated.scheduled} patients)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-700 text-center">
              <span className="text-[11px] text-stone-400 block">
                {simulated.status === 'Optimal' ? (
                  <span className="text-emerald-300 font-semibold">
                    ✓ Sustainable rhythm: High revenue with zero therapist fatigue.
                  </span>
                ) : (
                  <span className="text-rose-300 font-semibold">
                    ⚠️ Caution: Schedule exceeds safe ergonomic manual therapy limits.
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CLINICAL ERGONOMIC RISK RADAR & PLAYBOOK */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2 text-rose-600 dark:text-rose-400" />
              Lead Physiotherapist Burnout Prevention Playbook
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Identifying acute physical strain vectors and operational safeguards to retain senior clinical talent.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {BURNOUT_RISK_FACTORS.map((factor) => (
            <div
              key={factor.id}
              className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/50 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    factor.severity === 'Severe'
                      ? 'bg-rose-500'
                      : factor.severity === 'Moderate'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}></span>
                  {factor.title}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  factor.severity === 'Moderate'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
                }`}>
                  {factor.severity} Risk
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                  <span>Current Observation:</span>
                  <span className="font-semibold text-stone-700 dark:text-stone-300">{factor.observedValue}</span>
                </div>
                <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                  <span>Safety Threshold:</span>
                  <span className="font-semibold text-teal-700 dark:text-teal-400">{factor.recommendedThreshold}</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-600 dark:text-stone-400 pt-1 border-t border-stone-200 dark:border-stone-700/60">
                <strong>Mechanism:</strong> {factor.impactExplanation}
              </p>

              <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-[11px] text-teal-900 dark:text-teal-200 font-medium">
                <strong>Safeguard:</strong> {factor.mitigationRecommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMPARATIVE TEAM WORKLOAD BENCHMARKS */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 gap-2">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center">
              <Award className="w-4 h-4 mr-2 text-teal-700 dark:text-teal-400" />
              Staff Comparative Workload & Capacity Benchmarks
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Comparing Dr. Aditi Rao (Lead In-Clinic Ortho) vs Dr. Vikram K. (Mobile Home Care Lead) vs Junior Assistant PT.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Therapist & Role</th>
                <th className="py-2.5 px-3">Base Location</th>
                <th className="py-2.5 px-3 text-center">Contract</th>
                <th className="py-2.5 px-3 text-center">Contact Care</th>
                <th className="py-2.5 px-3 text-center">Transit</th>
                <th className="py-2.5 px-3 text-center">Clinical Util %</th>
                <th className="py-2.5 px-3 text-center">Weekly Sessions</th>
                <th className="py-2.5 px-3 text-center">Gross Revenue</th>
                <th className="py-2.5 px-3 text-center">Fatigue Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {STAFF_COMPARATIVE_BENCHMARKS.map((staff) => (
                <tr key={staff.therapistId} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-stone-900 dark:text-stone-100 block">
                      {staff.name}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {staff.primaryFatigueSource}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-stone-600 dark:text-stone-300">
                    {staff.location}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-stone-700 dark:text-stone-300">
                    {staff.weeklyContractHours}h
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-teal-700 dark:text-teal-400">
                    {staff.clinicalDirectHours}h
                  </td>
                  <td className="py-3 px-3 text-center text-stone-500">
                    {staff.transitHours > 0 ? `${staff.transitHours}h` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800">
                      {staff.utilizationRate}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-stone-900 dark:text-stone-100">
                    {staff.sessionsCompleted}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-700 dark:text-emerald-400">
                    ₹{staff.grossWeeklyRevenue.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      staff.burnoutRiskIndex < 40
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {staff.burnoutRiskIndex}/100 ({staff.statusZone})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 flex items-center justify-between">
          <span>
            <strong>Strategic Allocation:</strong> Dr. Aditi focuses on high-complexity in-clinic orthopedics (35.5h care), while Dr. Vikram commands higher-ticket home geriatric care (₹1,500/visit) where 13.5h transit is budgeted into pricing.
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper Icon
function GaugeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}
