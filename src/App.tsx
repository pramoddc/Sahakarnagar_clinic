/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DEFAULT_CAPEX, 
  DEFAULT_OPERATING_PARAMS, 
  DEFAULT_HOME_CARE_PARAMS 
} from './data/businessDefaults';
import { MonthlyOperatingParams, HomeCareParams, StartupCapital } from './types';
import { Navbar, MainAppSection } from './components/Navbar';
import { GeneralHomepage } from './components/GeneralHomepage';
import { PatientPortal } from './components/PatientPortal';
import { EmployeePortal } from './components/EmployeePortal';
import { ExecutiveSummaryModal } from './components/ExecutiveSummaryModal';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  // 3 Distinct Main Sections (User Mandate)
  // 'home' = 1) General homepage with better links
  // 'patient' = 2) Login for Patients
  // 'employee' = 3) Login for Employees
  const [currentSection, setCurrentSection] = useState<MainAppSection>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const sec = urlParams.get('section');
      if (sec === 'patient' || sec === 'employee') return sec;
      if (window.location.hash.includes('patient')) return 'patient';
      if (window.location.hash.includes('employee')) return 'employee';
    }
    return 'home';
  });
  const [employeeSubTab, setEmployeeSubTab] = useState<string>('scheduler');

  // Sync section to URL query param for easy sharing and browser bookmarking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (currentSection === 'home') {
        url.searchParams.delete('section');
      } else {
        url.searchParams.set('section', currentSection);
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, [currentSection]);

  // Business and Clinic State
  const [params, setParams] = useState<MonthlyOperatingParams>(DEFAULT_OPERATING_PARAMS);
  const [homeCare, setHomeCare] = useState<HomeCareParams>(DEFAULT_HOME_CARE_PARAMS);
  const [capex, setCapex] = useState<StartupCapital>(DEFAULT_CAPEX);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  const handleReset = () => {
    setParams(DEFAULT_OPERATING_PARAMS);
    setHomeCare(DEFAULT_HOME_CARE_PARAMS);
    setCapex(DEFAULT_CAPEX);
  };

  const handleNavigateFromHomeToSection = (sectionId: string) => {
    if (sectionId === 'patient-portal') {
      setCurrentSection('patient');
    } else {
      setCurrentSection('employee');
      setEmployeeSubTab(sectionId);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-teal-100 dark:selection:bg-teal-900 selection:text-teal-900 dark:selection:text-teal-100 transition-colors duration-200">
        {/* Navigation Header featuring the 3-Section Selector */}
        <Navbar
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          onOpenSummary={() => setIsSummaryOpen(true)}
        />

        {/* Main Content: Routed across the 3 Sections */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* SECTION 1: General Homepage with Better Links & Interactive Clinic Hub */}
          {currentSection === 'home' && (
            <GeneralHomepage
              onNavigateToPatientLogin={() => setCurrentSection('patient')}
              onNavigateToEmployeeLogin={() => setCurrentSection('employee')}
              onNavigateToSection={handleNavigateFromHomeToSection}
              onOpenExecutiveSummary={() => setIsSummaryOpen(true)}
            />
          )}

          {/* SECTION 2: Login for Patients & Caregiver Portal */}
          {currentSection === 'patient' && (
            <PatientPortal
              onBackToHome={() => setCurrentSection('home')}
              onNavigateToEmployee={() => setCurrentSection('employee')}
            />
          )}

          {/* SECTION 3: Login for Employees & Clinical Operating System */}
          {currentSection === 'employee' && (
            <EmployeePortal
              onBackToHome={() => setCurrentSection('home')}
              onNavigateToPatient={() => setCurrentSection('patient')}
              activeSubTab={employeeSubTab}
              setActiveSubTab={setEmployeeSubTab}
              params={params}
              setParams={setParams}
              homeCare={homeCare}
              setHomeCare={setHomeCare}
              capex={capex}
              setCapex={setCapex}
              onReset={handleReset}
              onOpenSummary={() => setIsSummaryOpen(true)}
            />
          )}
        </main>

        {/* Global Footer with Quick Section Access */}
        <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 mt-auto py-5 text-xs text-stone-500 dark:text-stone-400 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-stone-800 dark:text-stone-200">Sahakar Physio & Elder Care</span>
              <span>•</span>
              <span>Sahakarnagar, Bangalore (Opp. Aster CMI & Manyata Tech Park)</span>
            </div>

            <div className="flex items-center flex-wrap gap-3 text-stone-500 dark:text-stone-400">
              <button
                onClick={() => setCurrentSection('home')}
                className="hover:text-stone-800 dark:hover:text-stone-200 underline cursor-pointer"
              >
                1) Homepage & Links
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentSection('patient')}
                className="hover:text-stone-800 dark:hover:text-stone-200 underline cursor-pointer"
              >
                2) Patient Portal
              </button>
              <span>•</span>
              <button
                onClick={() => setCurrentSection('employee')}
                className="hover:text-stone-800 dark:hover:text-stone-200 underline cursor-pointer"
              >
                3) Staff Login
              </button>
              <span>•</span>
              <button
                onClick={() => setIsSummaryOpen(true)}
                className="font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 underline cursor-pointer"
              >
                Export Printable Plan
              </button>
            </div>
          </div>
        </footer>

        {/* Executive Plan Modal */}
        <ExecutiveSummaryModal
          isOpen={isSummaryOpen}
          onClose={() => setIsSummaryOpen(false)}
          params={params}
          homeCare={homeCare}
          capex={capex}
        />
      </div>
    </ThemeProvider>
  );
}
