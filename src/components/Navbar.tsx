import React from 'react';
import { 
  Activity, 
  MapPin, 
  Users, 
  Calendar, 
  FileText, 
  Stethoscope,
  Phone,
  Home,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export type MainAppSection = 'home' | 'patient' | 'employee';

interface NavbarProps {
  currentSection: MainAppSection;
  setCurrentSection: (section: MainAppSection) => void;
  onOpenSummary: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  setCurrentSection,
  onOpenSummary,
}) => {
  return (
    <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-30 shadow-xs transition-colors">
      {/* Top Identity & Utility Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Location */}
        <div 
          onClick={() => setCurrentSection('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-800 transition-colors">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 tracking-tight group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                Sahakar Physio & Elder Care
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Operating System
              </span>
            </div>
            <div className="flex items-center text-xs text-stone-500 dark:text-stone-400 space-x-2 mt-0.5">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-teal-600 dark:text-teal-400" />
                60 Feet Road, Sahakarnagar, Bangalore
              </span>
              <span>•</span>
              <span>Near Aster CMI & Manyata Tech Hub</span>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <a
            href="tel:+918023628900"
            className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100"
          >
            <Phone className="w-3.5 h-3.5 mr-1.5 text-teal-600 dark:text-teal-400" />
            +91 80 2362 8900
          </a>

          <button
            onClick={onOpenSummary}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5 text-teal-600 dark:text-teal-400" />
            Executive Plan
          </button>

          {/* Low-Light Clinical Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 CORE SECTIONS NAVIGATION BAR (USER MANDATE) */}
      {/* ========================================================================= */}
      <div className="border-t border-stone-100 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/60 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* Main 3 Section Buttons */}
          <nav className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0" aria-label="Main Sections">
            {/* Section 1: General Homepage */}
            <button
              onClick={() => setCurrentSection('home')}
              id="nav-section-home"
              className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                currentSection === 'home'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              <Home className="w-4 h-4 mr-1.5" />
              <span>1) General Homepage</span>
              <span className={`ml-2 px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                currentSection === 'home' ? 'bg-teal-900 text-teal-100' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
              }`}>
                Directory & Links
              </span>
            </button>

            {/* Section 2: Login for Patients */}
            <button
              onClick={() => setCurrentSection('patient')}
              id="nav-section-patient"
              className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                currentSection === 'patient'
                  ? 'bg-amber-500 text-stone-950 shadow-xs ring-2 ring-amber-400/50'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-amber-50 dark:hover:bg-stone-700 hover:text-amber-900'
              }`}
            >
              <Users className="w-4 h-4 mr-1.5 text-amber-600 dark:text-amber-400" />
              <span>2) Login for Patients</span>
              <span className={`ml-2 px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                currentSection === 'patient' ? 'bg-stone-950 text-amber-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
              }`}>
                Caregiver Portal
              </span>
            </button>

            {/* Section 3: Login for Employees */}
            <button
              onClick={() => setCurrentSection('employee')}
              id="nav-section-employee"
              className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                currentSection === 'employee'
                  ? 'bg-teal-800 text-white shadow-xs ring-2 ring-teal-500/50'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-teal-50 dark:hover:bg-stone-700 hover:text-teal-900'
              }`}
            >
              <Stethoscope className="w-4 h-4 mr-1.5 text-teal-600 dark:text-teal-400" />
              <span>3) Login for Employees</span>
              <span className={`ml-2 px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                currentSection === 'employee' ? 'bg-teal-950 text-teal-200' : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
              }`}>
                Clinical OS
              </span>
            </button>
          </nav>

          {/* Context helper text */}
          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              {currentSection === 'home' && 'Viewing Public Portal & Quick Links Directory'}
              {currentSection === 'patient' && 'Patient & Caregiver Authentication Portal'}
              {currentSection === 'employee' && 'Clinical Operating System & Staff Hub'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
