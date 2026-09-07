import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  MapPin, 
  LayoutGrid, 
  Home, 
  CheckSquare, 
  FileText, 
  IndianRupee, 
  ShieldAlert,
  Users,
  Calendar,
  BarChart3,
  BellRing,
  UserCheck,
  Receipt
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSummary: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenSummary }) => {
  const tabs = [
    { id: 'financials', label: 'Financial Modeler & P&L', icon: IndianRupee },
    { id: 'patients', label: 'Patient Management', icon: Users },
    { id: 'billing', label: 'Billing & Invoices', icon: Receipt },
    { id: 'reminders', label: 'Patient Reminder Log', icon: BellRing },
    { id: 'scheduler', label: 'Smart Scheduler', icon: Calendar },
    { id: 'analytics', label: 'Patient Analytics', icon: BarChart3 },
    { id: 'performance', label: 'Staff Performance', icon: UserCheck },
    { id: 'roadmap', label: '12-Month Ramp', icon: TrendingUp },
    { id: 'market', label: 'Market & Packages', icon: Activity },
    { id: 'clinic', label: '600 sq ft Clinic Space', icon: LayoutGrid },
    { id: 'homecare', label: 'Elder Home-Care', icon: Home },
    { id: 'launch', label: 'Launch & Risks', icon: CheckSquare },
  ];

  return (
    <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-30 shadow-xs transition-colors">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-xs">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                Sahakar Physio & Elder Care
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Operating System
              </span>
            </div>
            <div className="flex items-center text-xs text-stone-500 dark:text-stone-400 space-x-2 mt-0.5">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-teal-600 dark:text-teal-400" />
                Sahakarnagar, Bangalore (Manyata IT Corridor)
              </span>
              <span>•</span>
              <span className="font-medium text-stone-700 dark:text-stone-300">600 sq ft Clinic + Geriatric Home Visits</span>
            </div>
          </div>
        </div>

        {/* Highlight Metrics */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-1.5 flex flex-col">
            <span className="text-stone-400 text-[10px] uppercase font-semibold">Total Capital</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">₹40.0 Lakhs</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-1.5 flex flex-col">
            <span className="text-stone-400 text-[10px] uppercase font-semibold">Startup CapEx</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">₹8 - 12 Lakhs</span>
          </div>
          <div className="bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-lg px-3 py-1.5 flex flex-col">
            <span className="text-teal-600 dark:text-teal-400 text-[10px] uppercase font-semibold">Target Monthly Profit</span>
            <span className="font-bold text-teal-800 dark:text-teal-200">₹2.0L+ / month</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-1.5 flex flex-col">
            <span className="text-stone-400 text-[10px] uppercase font-semibold">Target Timeline</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">Months 10–12</span>
          </div>

          <button
            onClick={() => setActiveTab('billing')}
            className={`inline-flex items-center px-3 py-2 rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer ${
              activeTab === 'billing'
                ? 'bg-teal-800 text-white ring-2 ring-teal-400'
                : 'bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700 hover:bg-teal-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 mr-1.5 text-teal-600 dark:text-teal-400" />
            Billing & Invoices
          </button>

          <button
            onClick={() => setActiveTab('reminders')}
            className={`inline-flex items-center px-3 py-2 rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer ${
              activeTab === 'reminders'
                ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                : 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 hover:bg-amber-100'
            }`}
          >
            <BellRing className="w-3.5 h-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
            Reminders
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-white">
              4
            </span>
          </button>

          <button
            onClick={() => setActiveTab('scheduler')}
            className={`inline-flex items-center px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer ${
              activeTab === 'scheduler'
                ? 'bg-emerald-800 text-white ring-2 ring-emerald-500'
                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
            Smart Scheduler
          </button>

          <button
            onClick={onOpenSummary}
            className="inline-flex items-center px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Executive Plan
          </button>

          {/* Low-Light Clinical Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-100 dark:border-stone-800 flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isScheduler = tab.id === 'scheduler';
          const isReminders = tab.id === 'reminders';
          const isPerformance = tab.id === 'performance';
          const isBilling = tab.id === 'billing';
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3.5 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border-b-2 border-teal-700 font-bold'
                  : isBilling
                  ? 'text-teal-900 dark:text-teal-200 bg-teal-50/70 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50 font-bold'
                  : isPerformance
                  ? 'text-teal-800 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-950/30 hover:bg-teal-100 dark:hover:bg-teal-900/40 font-bold'
                  : isReminders
                  ? 'text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 font-bold'
                  : isScheduler
                  ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 mr-1.5 ${isActive ? 'text-teal-700 dark:text-teal-400' : isBilling ? 'text-teal-700 dark:text-teal-400' : isPerformance ? 'text-teal-600 dark:text-teal-400' : isReminders ? 'text-amber-600 dark:text-amber-400' : isScheduler ? 'text-emerald-600' : 'text-stone-400'}`} />
              {tab.label}
              {isBilling && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-teal-200 dark:bg-teal-900 text-teal-950 dark:text-teal-100 tracking-wider">
                  PDF Receipts
                </span>
              )}
              {isPerformance && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 tracking-wider">
                  74% Safe
                </span>
              )}
              {isReminders && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-amber-500 text-white tracking-wider animate-pulse">
                  3-Sess Alert
                </span>
              )}
              {isScheduler && (
                <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 tracking-wider">
                  Live Grid
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
