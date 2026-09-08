import React, { useState } from 'react';
import {
  Stethoscope,
  Lock,
  ArrowLeft,
  LogOut,
  Calendar,
  Receipt,
  BellRing,
  Users,
  BarChart3,
  UserCheck,
  IndianRupee,
  LayoutGrid,
  TrendingUp,
  Home,
  CheckSquare,
  Activity,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  UserPlus,
  Briefcase
} from 'lucide-react';
import { LoggedInEmployee, MonthlyOperatingParams, HomeCareParams, StartupCapital } from '../types';
import { SmartUnifiedScheduler } from './SmartUnifiedScheduler';
import { PatientManagement } from './PatientManagement';
import { BillingAndInvoices } from './BillingAndInvoices';
import { PatientReminderLog } from './PatientReminderLog';
import { PatientAnalytics } from './PatientAnalytics';
import { StaffPerformance } from './StaffPerformance';
import { FinancialModeler } from './FinancialModeler';
import { ClinicFloorPlanner } from './ClinicFloorPlanner';
import { GrowthRoadmap } from './GrowthRoadmap';
import { MarketStrategy } from './MarketStrategy';
import { HomeCareEngine } from './HomeCareEngine';
import { LaunchExecutionTracker } from './LaunchExecutionTracker';
import { JoinOurTeamSection } from './JoinOurTeamSection';

interface EmployeePortalProps {
  onBackToHome: () => void;
  onNavigateToPatient: () => void;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  params: MonthlyOperatingParams;
  setParams: React.Dispatch<React.SetStateAction<MonthlyOperatingParams>>;
  homeCare: HomeCareParams;
  setHomeCare: React.Dispatch<React.SetStateAction<HomeCareParams>>;
  capex: StartupCapital;
  setCapex: React.Dispatch<React.SetStateAction<StartupCapital>>;
  onReset: () => void;
  onOpenSummary: () => void;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({
  onBackToHome,
  onNavigateToPatient,
  activeSubTab,
  setActiveSubTab,
  params,
  setParams,
  homeCare,
  setHomeCare,
  capex,
  setCapex,
  onReset,
  onOpenSummary
}) => {
  // Staff Profiles
  const staffMembers: LoggedInEmployee[] = [
    {
      id: 'emp-01',
      name: 'Dr. Aditi Rao, MPT',
      role: 'lead_pt',
      roleTitle: 'Lead Physiotherapist & Clinical Director',
      credentials: 'MPT (Orthopedics & Sports Rehab), MIAP',
      shiftSchedule: '08:00 - 13:00 & 17:00 - 20:30 (8.0h Shift)',
      assignedLocation: '600 sq ft Sahakarnagar Clinic Base',
      email: 'dr.aditi@sahakarphysio.com'
    },
    {
      id: 'emp-02',
      name: 'Dr. Vikram K., BPT',
      role: 'mobile_pt',
      roleTitle: 'Senior Mobile & Geriatric Care Lead',
      credentials: 'BPT, Geriatric Rehab & Neurological Balance Specialist',
      shiftSchedule: '09:00 - 13:00 (Clinic) & 13:30 - 17:30 (Home Visits)',
      assignedLocation: 'Sahakarnagar & Judicial Mobile Home-Care Route',
      email: 'dr.vikram@sahakarphysio.com'
    },
    {
      id: 'emp-03',
      name: 'Pooja Hegde',
      role: 'operations',
      roleTitle: 'Clinic Operations Manager & Front Desk Lead',
      credentials: 'BBA Healthcare Operations, Certified DLT Gateway Admin',
      shiftSchedule: '08:00 - 17:00 (Continuous Desk)',
      assignedLocation: 'Reception & Billing Bay, 60 Feet Road',
      email: 'pooja.ops@sahakarphysio.com'
    },
    {
      id: 'emp-00',
      name: 'Executive Admin / Partner',
      role: 'admin',
      roleTitle: 'Clinic Founder & Financial Strategy Lead',
      credentials: 'Healthcare Management & Financial Partner',
      shiftSchedule: 'Full Access (24/7 Clinical Analytics)',
      assignedLocation: 'Sahakarnagar Executive Desk',
      email: 'admin@sahakarphysio.com'
    }
  ];

  // Current Logged-in Staff (Default to Dr. Aditi Rao for instant convenience)
  const [currentUser, setCurrentUser] = useState<LoggedInEmployee | null>(staffMembers[0]);
  const [usernameInput, setUsernameInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showJoinTeamModal, setShowJoinTeamModal] = useState<boolean>(false);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const cleanUser = usernameInput.trim().toLowerCase();
    const found = staffMembers.find(
      s =>
        s.id.toLowerCase() === cleanUser ||
        s.name.toLowerCase().includes(cleanUser) ||
        s.email.toLowerCase().includes(cleanUser)
    );

    if (found) {
      setCurrentUser(found);
      setUsernameInput('');
      setPinInput('');
    } else {
      setLoginError('Invalid Employee ID or PIN. Please select one of the 1-click clinical profiles below.');
    }
  };

  // --------------------------------------------------------------------------
  // STATE 1: EMPLOYEE LOGIN SCREEN
  // --------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to General Homepage
          </button>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => setShowJoinTeamModal(true)}
              id="btn-join-our-team-login"
              className="inline-flex items-center text-xs font-bold text-teal-900 dark:text-teal-100 bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-100 dark:hover:bg-teal-900 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 transition-all cursor-pointer shadow-xs"
            >
              <Briefcase className="w-3.5 h-3.5 mr-1.5 text-teal-600 dark:text-teal-400" />
              <span>Join Our Team (Hiring)</span>
              <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-teal-200 dark:bg-teal-800 text-teal-900 dark:text-teal-100">
                Openings
              </span>
            </button>

            <button
              onClick={onNavigateToPatient}
              className="text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline cursor-pointer"
            >
              Are you a Patient or Caregiver? Patient Portal →
            </button>
          </div>
        </div>

        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-800">
            <Stethoscope className="w-3.5 h-3.5 mr-1.5 text-teal-700" />
            Staff & Clinical Operating System
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            Sign In to Sahakar Clinical Workspace
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Access real-time bay scheduling, electronic medical records (EMR), billing & digital receipts, 48-hour Quick Broadcast SMS, and financial sensitivity modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-lg space-y-5">
            <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
              <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Staff Authentication</span>
            </div>

            <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Employee ID or Email Address
                </label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  placeholder="e.g. emp-01 or dr.aditi@sahakarphysio.com"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Security PIN / Password
                </label>
                <input
                  type="password"
                  required
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  placeholder="Enter your clinical PIN"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Log In to Clinical Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold text-stone-700 dark:text-stone-300">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Role-Based Permissions Enforced</span>
              </div>
              <p>For credentials reset or new staff onboarding, contact the Clinic Operations Desk.</p>
            </div>
          </div>

          {/* Right Column: 1-Click Demo Staff Profiles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Quick 1-Click Staff Profiles
              </span>
              <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
                Instant Demo Access
              </span>
            </div>

            <div className="space-y-3">
              {staffMembers.map(staff => (
                <div
                  key={staff.id}
                  onClick={() => {
                    setCurrentUser(staff);
                    setLoginError(null);
                  }}
                  className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-teal-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                          {staff.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                          {staff.id.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-teal-800 dark:text-teal-300 mt-0.5">
                        {staff.roleTitle}
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                        {staff.credentials}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        staff.role === 'lead_pt'
                          ? 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200'
                          : staff.role === 'mobile_pt'
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                          : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                      }`}
                    >
                      {staff.role === 'lead_pt' ? 'Lead PT' : staff.role === 'mobile_pt' ? 'Mobile PT' : 'Ops Lead'}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-teal-600" />
                      {staff.shiftSchedule.split('(')[0].trim()}
                    </span>
                    <span className="font-bold text-teal-700 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center">
                      Sign In as {staff.name.split(' ')[1] || staff.name} →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROMINENT RECRUITMENT BANNER: JOIN OUR TEAM */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-900 via-stone-900 to-teal-950 text-white border border-teal-800/80 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Clinical Recruitment & Careers</span>
            </div>
            <h3 className="text-lg font-black text-white">
              Looking to Join Our Sahakarnagar Clinical Team?
            </h3>
            <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
              We are expanding our team of Lead In-Clinic Physiotherapists (MPT Ortho/Sports), Senior Mobile Geriatric PTs (BPT/MPT), and Front Desk Operations. Review clinical qualifications and submit your CV.
            </p>
          </div>
          <button
            onClick={() => setShowJoinTeamModal(true)}
            id="btn-join-team-banner"
            className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-black text-xs flex items-center justify-center space-x-2 transition-all shadow-md shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join Our Team (View Roles & Submit CV) →</span>
          </button>
        </div>

        {/* Modal Overlay for Join Our Team */}
        {showJoinTeamModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in-50 duration-200">
            <div className="relative w-full max-w-5xl my-8">
              <JoinOurTeamSection isModal onClose={() => setShowJoinTeamModal(false)} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STATE 2: AUTHENTICATED EMPLOYEE CLINICAL OS WORKSPACE
  // --------------------------------------------------------------------------
  const employeeTabs = [
    { id: 'scheduler', label: 'Smart Scheduler', icon: Calendar, badge: 'Live Grid' },
    { id: 'reminders', label: 'Reminders & 48h Broadcast', icon: BellRing, badge: 'Alerts' },
    { id: 'billing', label: 'Billing & Invoices', icon: Receipt, badge: 'GST' },
    { id: 'patients', label: 'Patient EMR & Red Flags', icon: Users, badge: 'Records' },
    { id: 'analytics', label: 'Patient Analytics', icon: BarChart3 },
    { id: 'performance', label: 'Staff Performance', icon: UserCheck, badge: '74% Safe' },
    { id: 'financials', label: 'Financial Modeler & P&L', icon: IndianRupee, badge: '₹40L' },
    { id: 'clinic', label: '600 sq ft Clinic Space', icon: LayoutGrid },
    { id: 'careers', label: 'Join Our Team / Hiring', icon: UserPlus, badge: 'Hiring' },
    { id: 'roadmap', label: '12-Month Ramp', icon: TrendingUp },
    { id: 'homecare', label: 'Elder Home-Care', icon: Home },
    { id: 'market', label: 'Market & Packages', icon: Activity },
    { id: 'launch', label: 'Launch & Risks', icon: CheckSquare }
  ];

  return (
    <div className="space-y-6">
      {/* Employee Top Status Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {currentUser.name}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {currentUser.roleTitle}
              </span>
            </div>
            <div className="flex items-center text-xs text-stone-500 dark:text-stone-400 space-x-2 mt-0.5">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1 text-teal-600" />
                {currentUser.shiftSchedule}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-teal-600" />
                {currentUser.assignedLocation}
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions for employee */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowJoinTeamModal(true)}
            id="btn-join-team-auth-header"
            className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-800 text-xs font-bold transition-colors cursor-pointer shadow-xs"
            title="View Clinical Positions, Required Qualifications & Submit CV"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5 text-teal-600 dark:text-teal-400" />
            <span>Join Our Team</span>
            <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-teal-200 dark:bg-teal-800 text-teal-900 dark:text-teal-100">
              Hiring
            </span>
          </button>

          <button
            onClick={onOpenSummary}
            className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Export Plan
          </button>

          <button
            onClick={() => setCurrentUser(null)}
            className="inline-flex items-center px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Employee Module Navigation Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200 dark:border-stone-800">
        {employeeTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5 mr-1.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`ml-1.5 px-1.5 py-0.2 text-[9px] font-black uppercase rounded ${
                    isActive
                      ? 'bg-teal-900 text-teal-100'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Active Sub-Module */}
      <div>
        {activeSubTab === 'scheduler' && <SmartUnifiedScheduler />}

        {activeSubTab === 'reminders' && <PatientReminderLog />}

        {activeSubTab === 'billing' && (
          <BillingAndInvoices
            onNavigateToScheduler={() => setActiveSubTab('scheduler')}
            onNavigateToPatients={() => setActiveSubTab('patients')}
          />
        )}

        {activeSubTab === 'patients' && (
          <PatientManagement
            onNavigateToScheduler={() => setActiveSubTab('scheduler')}
            onNavigateToAnalytics={() => setActiveSubTab('analytics')}
            onNavigateToReminders={() => setActiveSubTab('reminders')}
          />
        )}

        {activeSubTab === 'analytics' && (
          <PatientAnalytics
            onNavigateToScheduler={() => setActiveSubTab('scheduler')}
            onNavigateToPatients={() => setActiveSubTab('patients')}
          />
        )}

        {activeSubTab === 'performance' && (
          <StaffPerformance
            onNavigateToScheduler={() => setActiveSubTab('scheduler')}
            onNavigateToPatients={() => setActiveSubTab('patients')}
          />
        )}

        {activeSubTab === 'financials' && (
          <FinancialModeler
            params={params}
            setParams={setParams}
            homeCare={homeCare}
            setHomeCare={setHomeCare}
            capex={capex}
            setCapex={setCapex}
            onReset={onReset}
          />
        )}

        {activeSubTab === 'clinic' && <ClinicFloorPlanner />}

        {activeSubTab === 'careers' && <JoinOurTeamSection />}

        {activeSubTab === 'roadmap' && <GrowthRoadmap />}

        {activeSubTab === 'homecare' && (
          <HomeCareEngine
            homeCare={homeCare}
            setHomeCare={setHomeCare}
            clinicParams={params}
          />
        )}

        {activeSubTab === 'market' && <MarketStrategy />}

        {activeSubTab === 'launch' && <LaunchExecutionTracker />}
      </div>

      {/* Modal Overlay for Join Our Team inside Authenticated Workspace */}
      {showJoinTeamModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in-50 duration-200">
          <div className="relative w-full max-w-5xl my-8">
            <JoinOurTeamSection isModal onClose={() => setShowJoinTeamModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
