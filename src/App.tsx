/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DEFAULT_CAPEX, 
  DEFAULT_OPERATING_PARAMS, 
  DEFAULT_HOME_CARE_PARAMS 
} from './data/businessDefaults';
import { MonthlyOperatingParams, HomeCareParams, StartupCapital } from './types';
import { Navbar } from './components/Navbar';
import { FinancialModeler } from './components/FinancialModeler';
import { GrowthRoadmap } from './components/GrowthRoadmap';
import { MarketStrategy } from './components/MarketStrategy';
import { ClinicFloorPlanner } from './components/ClinicFloorPlanner';
import { HomeCareEngine } from './components/HomeCareEngine';
import { LaunchExecutionTracker } from './components/LaunchExecutionTracker';
import { PatientManagement } from './components/PatientManagement';
import { PatientAnalytics } from './components/PatientAnalytics';
import { PatientReminderLog } from './components/PatientReminderLog';
import { BillingAndInvoices } from './components/BillingAndInvoices';
import { SmartUnifiedScheduler } from './components/SmartUnifiedScheduler';
import { StaffPerformance } from './components/StaffPerformance';
import { ExecutiveSummaryModal } from './components/ExecutiveSummaryModal';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('scheduler');
  const [params, setParams] = useState<MonthlyOperatingParams>(DEFAULT_OPERATING_PARAMS);
  const [homeCare, setHomeCare] = useState<HomeCareParams>(DEFAULT_HOME_CARE_PARAMS);
  const [capex, setCapex] = useState<StartupCapital>(DEFAULT_CAPEX);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  const handleReset = () => {
    setParams(DEFAULT_OPERATING_PARAMS);
    setHomeCare(DEFAULT_HOME_CARE_PARAMS);
    setCapex(DEFAULT_CAPEX);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-teal-100 dark:selection:bg-teal-900 selection:text-teal-900 dark:selection:text-teal-100 transition-colors duration-200">
        {/* Navigation Header */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSummary={() => setIsSummaryOpen(true)}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'financials' && (
            <FinancialModeler
              params={params}
              setParams={setParams}
              homeCare={homeCare}
              setHomeCare={setHomeCare}
              capex={capex}
              setCapex={setCapex}
              onReset={handleReset}
            />
          )}

          {activeTab === 'patients' && (
            <PatientManagement 
              onNavigateToScheduler={() => setActiveTab('scheduler')} 
              onNavigateToAnalytics={() => setActiveTab('analytics')}
              onNavigateToReminders={() => setActiveTab('reminders')}
            />
          )}

          {activeTab === 'billing' && (
            <BillingAndInvoices
              onNavigateToScheduler={() => setActiveTab('scheduler')}
              onNavigateToPatients={() => setActiveTab('patients')}
            />
          )}

          {activeTab === 'reminders' && <PatientReminderLog />}

          {activeTab === 'analytics' && (
            <PatientAnalytics
              onNavigateToScheduler={() => setActiveTab('scheduler')}
              onNavigateToPatients={() => setActiveTab('patients')}
            />
          )}

          {activeTab === 'performance' && (
            <StaffPerformance
              onNavigateToScheduler={() => setActiveTab('scheduler')}
              onNavigateToPatients={() => setActiveTab('patients')}
            />
          )}

          {activeTab === 'scheduler' && <SmartUnifiedScheduler />}

          {activeTab === 'roadmap' && <GrowthRoadmap />}

          {activeTab === 'market' && <MarketStrategy />}

          {activeTab === 'clinic' && <ClinicFloorPlanner />}

          {activeTab === 'homecare' && (
            <HomeCareEngine
              homeCare={homeCare}
              setHomeCare={setHomeCare}
              clinicParams={params}
            />
          )}

          {activeTab === 'launch' && <LaunchExecutionTracker />}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 mt-auto py-5 text-xs text-stone-500 dark:text-stone-400 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-stone-800 dark:text-stone-200">Sahakar Physio & Elder Care</span>
              <span>•</span>
              <span>Operating System for Sahakarnagar, Bangalore</span>
            </div>

            <div className="flex items-center space-x-4 text-stone-500 dark:text-stone-400">
              <span>600 sq ft Clinic</span>
              <span>•</span>
              <span>1 BPT/MPT + 1 Assistant</span>
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

