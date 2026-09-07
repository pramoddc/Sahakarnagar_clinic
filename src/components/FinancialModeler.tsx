import React, { useState } from 'react';
import { 
  MonthlyOperatingParams, 
  HomeCareParams, 
  StartupCapital 
} from '../types';
import { 
  calculateMonthlyFinancials, 
  calculateCapExSummary, 
  formatINR, 
  formatLakh 
} from '../utils/finance';
import { 
  IndianRupee, 
  TrendingUp, 
  PieChart, 
  ShieldCheck, 
  Sliders, 
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Users,
  Building2,
  Car
} from 'lucide-react';

interface FinancialModelerProps {
  params: MonthlyOperatingParams;
  setParams: React.Dispatch<React.SetStateAction<MonthlyOperatingParams>>;
  homeCare: HomeCareParams;
  setHomeCare: React.Dispatch<React.SetStateAction<HomeCareParams>>;
  capex: StartupCapital;
  setCapex: React.Dispatch<React.SetStateAction<StartupCapital>>;
  onReset: () => void;
}

export const FinancialModeler: React.FC<FinancialModelerProps> = ({
  params,
  setParams,
  homeCare,
  setHomeCare,
  capex,
  setCapex,
  onReset
}) => {
  const [activeSubView, setActiveSubView] = useState<'monthly' | 'capex' | 'sensitivity'>('monthly');

  const summary = calculateMonthlyFinancials(params, homeCare);
  const capexSummary = calculateCapExSummary(capex);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md border border-stone-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Sahakarnagar Unit Economics Engine</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Steady-State Financial Simulation
            </h2>
            <p className="text-stone-300 text-sm max-w-2xl leading-relaxed">
              At steady state, 15 clinic patients/day yields ~₹3.75 Lakhs monthly revenue with a 
              lean 2-person clinical operation (1 BPT/MPT + 1 Assistant) and ₹35,000 rent. 
              Net margins exceed 45–50%, backed by ₹28+ Lakhs capital reserves.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-800/80 p-3 rounded-xl border border-stone-700/60 text-center">
            <div className="px-2 py-1">
              <div className="text-[11px] text-stone-400 uppercase font-medium">Monthly Revenue</div>
              <div className="text-lg font-bold text-teal-300">
                {formatINR(homeCare.activeInMonth ? summary.combinedRevenue : summary.monthlyRevenue)}
              </div>
            </div>
            <div className="px-2 py-1">
              <div className="text-[11px] text-stone-400 uppercase font-medium">Monthly OPEX</div>
              <div className="text-lg font-bold text-stone-200">
                {formatINR(homeCare.activeInMonth ? summary.combinedExpenses : summary.totalExpenses)}
              </div>
            </div>
            <div className="px-2 py-1">
              <div className="text-[11px] text-stone-400 uppercase font-medium">Net Monthly Profit</div>
              <div className="text-lg font-bold text-emerald-400">
                {formatINR(homeCare.activeInMonth ? summary.combinedNetProfit : summary.netProfit)}
              </div>
            </div>
            <div className="px-2 py-1">
              <div className="text-[11px] text-stone-400 uppercase font-medium">Net Profit Margin</div>
              <div className="text-lg font-bold text-amber-300">
                {(homeCare.activeInMonth ? summary.combinedMarginPercent : summary.netMarginPercent).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-stone-800">
          <button
            onClick={() => setActiveSubView('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSubView === 'monthly'
                ? 'bg-teal-600 text-white'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Monthly P&L & Volume Sliders
          </button>
          <button
            onClick={() => setActiveSubView('capex')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSubView === 'capex'
                ? 'bg-teal-600 text-white'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Startup CapEx & ₹40L Reserve Tracker
          </button>
          <button
            onClick={() => setActiveSubView('sensitivity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSubView === 'sensitivity'
                ? 'bg-teal-600 text-white'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            Break-Even & Volume Sensitivity
          </button>
          <button
            onClick={onReset}
            className="ml-auto inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset to Baseline
          </button>
        </div>
      </div>

      {/* Main View Switching */}
      {activeSubView === 'monthly' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Volume & Pricing Panel */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Clinic Patient Volume & Pricing</h3>
                    <p className="text-xs text-stone-500">Target 15 patients/day across 10–25 session packages</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  {params.patientsPerDay * params.workingDaysPerMonth} sessions / month
                </span>
              </div>

              <div className="space-y-4">
                {/* Patients per day slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                    <span>Patients Per Day (Capacity: 18-20 max single therapist)</span>
                    <span className="font-bold text-teal-700">{params.patientsPerDay} patients / day</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="22"
                    step="1"
                    value={params.patientsPerDay}
                    onChange={(e) => setParams({ ...params, patientsPerDay: Number(e.target.value) })}
                    className="w-full accent-teal-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>Month 1–2 (4-6/day)</span>
                    <span>Month 3–4 (9-11/day)</span>
                    <span className="font-semibold text-teal-700">Steady State (15/day)</span>
                    <span>Max Overtime (20/day)</span>
                  </div>
                </div>

                {/* Average session price */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                    <span>Average Session Fee (Single or Packaged blend)</span>
                    <span className="font-bold text-teal-700">{formatINR(params.avgSessionPrice)} / session</span>
                  </div>
                  <input
                    type="range"
                    min="600"
                    max="1600"
                    step="50"
                    value={params.avgSessionPrice}
                    onChange={(e) => setParams({ ...params, avgSessionPrice: Number(e.target.value) })}
                    className="w-full accent-teal-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>₹700 (Discounted pack)</span>
                    <span>₹1,000 (Standard benchmark)</span>
                    <span>₹1,400 (Specialized Spine/Neuro)</span>
                  </div>
                </div>

                {/* Working days */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                    <span>Clinic Working Days Per Month</span>
                    <span className="font-bold text-stone-800">{params.workingDaysPerMonth} days</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="28"
                    step="1"
                    value={params.workingDaysPerMonth}
                    onChange={(e) => setParams({ ...params, workingDaysPerMonth: Number(e.target.value) })}
                    className="w-full accent-teal-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Operating Expenses Panel */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Fixed & Variable Clinic OPEX</h3>
                    <p className="text-xs text-stone-500">Rent, staff salaries, clinical consumables, marketing</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full">
                  Total: {formatINR(summary.totalExpenses)} / mo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Physiotherapist Salary */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-stone-700">
                    <span>Lead Physiotherapist (BPT/MPT)</span>
                    <span className="font-bold text-stone-900">{formatINR(params.physiotherapistSalary)}</span>
                  </div>
                  <input
                    type="range"
                    min="35000"
                    max="65000"
                    step="2500"
                    value={params.physiotherapistSalary}
                    onChange={(e) => setParams({ ...params, physiotherapistSalary: Number(e.target.value) })}
                    className="w-full accent-stone-700 h-2 bg-stone-100 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10px] text-stone-400">Plan specifies ~₹45,000 for experienced clinician</p>
                </div>

                {/* Assistant / Receptionist Salary */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-stone-700">
                    <span>Assistant / Receptionist</span>
                    <span className="font-bold text-stone-900">{formatINR(params.assistantSalary)}</span>
                  </div>
                  <input
                    type="range"
                    min="12000"
                    max="22000"
                    step="1000"
                    value={params.assistantSalary}
                    onChange={(e) => setParams({ ...params, assistantSalary: Number(e.target.value) })}
                    className="w-full accent-stone-700 h-2 bg-stone-100 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10px] text-stone-400">Plan specifies ₹15,000 for front-desk & patient booking</p>
                </div>

                {/* Rent for 600 sq ft */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-stone-700">
                    <span>Sahakarnagar Rent (600 sq ft)</span>
                    <span className="font-bold text-stone-900">{formatINR(params.rent)}</span>
                  </div>
                  <input
                    type="range"
                    min="25000"
                    max="50000"
                    step="2500"
                    value={params.rent}
                    onChange={(e) => setParams({ ...params, rent: Number(e.target.value) })}
                    className="w-full accent-stone-700 h-2 bg-stone-100 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10px] text-stone-400">Plan specifies ₹35,000 (lower than Koramangala/Indiranagar)</p>
                </div>

                {/* Marketing & Acquisition */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-stone-700">
                    <span>Local Marketing & Acquisition</span>
                    <span className="font-bold text-stone-900">{formatINR(params.marketingBudget)}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="35000"
                    step="2500"
                    value={params.marketingBudget}
                    onChange={(e) => setParams({ ...params, marketingBudget: Number(e.target.value) })}
                    className="w-full accent-stone-700 h-2 bg-stone-100 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10px] text-stone-400">Local SEO, Google Ads, RWA flyers, doctor outreach</p>
                </div>

                {/* Consumables % of revenue */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-stone-700">
                    <span>Consumables ({params.consumablesPercent}% of Rev)</span>
                    <span className="font-bold text-stone-900">{formatINR(summary.consumablesCost)}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="18"
                    step="1"
                    value={params.consumablesPercent}
                    onChange={(e) => setParams({ ...params, consumablesPercent: Number(e.target.value) })}
                    className="w-full accent-stone-700 h-2 bg-stone-100 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10px] text-stone-400">Therapy gel, electrodes, sanitized sheets, resistance bands</p>
                </div>

                {/* Utilities & Maintenance */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-stone-700">
                    <span>Electricity, WiFi & Maintenance</span>
                    <span className="font-bold text-stone-900">{formatINR(params.utilitiesAndSundries)}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="20000"
                    step="1000"
                    value={params.utilitiesAndSundries}
                    onChange={(e) => setParams({ ...params, utilitiesAndSundries: Number(e.target.value) })}
                    className="w-full accent-stone-700 h-2 bg-stone-100 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10px] text-stone-400">Commercial 3-phase power, AC cooling, software subscription</p>
                </div>
              </div>
            </div>

            {/* Home-Care Expansion Toggle Panel (Month 6-8+) */}
            <div className={`p-5 rounded-xl border transition-all ${
              homeCare.activeInMonth 
                ? 'bg-teal-50/50 border-teal-300 shadow-xs' 
                : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                    homeCare.activeInMonth ? 'bg-teal-600 text-white' : 'bg-stone-200 text-stone-600'
                  }`}>
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Phase 2: Geriatric Home-Care Layer (Month 6–8+)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Home visits for elderly residents who cannot travel to the clinic, priced at a premium
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={homeCare.activeInMonth}
                    onChange={(e) => setHomeCare({ ...homeCare, activeInMonth: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {homeCare.activeInMonth && (
                <div className="mt-4 pt-3 border-t border-teal-200/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                      <span>Home Visits Per Day</span>
                      <span className="font-bold text-teal-800">{homeCare.homeVisitsPerDay} visits / day</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="1"
                      value={homeCare.homeVisitsPerDay}
                      onChange={(e) => setHomeCare({ ...homeCare, homeVisitsPerDay: Number(e.target.value) })}
                      className="w-full accent-teal-600 h-2 bg-white rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-stone-500">
                      {homeCare.homeVisitsPerDay * params.workingDaysPerMonth} monthly visits = {formatINR(summary.homeCareRevenue)} rev
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                      <span>Premium Home Visit Fee</span>
                      <span className="font-bold text-teal-800">{formatINR(homeCare.homeVisitPrice)} / visit</span>
                    </div>
                    <input
                      type="range"
                      min="1200"
                      max="2200"
                      step="100"
                      value={homeCare.homeVisitPrice}
                      onChange={(e) => setHomeCare({ ...homeCare, homeVisitPrice: Number(e.target.value) })}
                      className="w-full accent-teal-600 h-2 bg-white rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-stone-500">Plan highlights ₹1,500 premium for elder convenience</span>
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between bg-white p-3 rounded-lg border border-teal-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="secondPhysio"
                        checked={homeCare.secondPhysioHired}
                        onChange={(e) => setHomeCare({ ...homeCare, secondPhysioHired: e.target.checked })}
                        className="w-4 h-4 text-teal-600 rounded border-stone-300 focus:ring-teal-500"
                      />
                      <label htmlFor="secondPhysio" className="text-xs font-semibold text-stone-800">
                        Dedicated 2nd Physiotherapist for Home Visits (₹45,000/mo salary)
                      </label>
                    </div>
                    <span className="text-xs text-stone-500">
                      {homeCare.secondPhysioHired ? 'Full dedication' : 'Single PT split'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Column (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* P&L Statement Card */}
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-sm font-bold text-stone-900">
                  {homeCare.activeInMonth ? 'Combined Clinic + Home Care P&L' : 'Monthly Clinic P&L Breakdown'}
                </h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {(homeCare.activeInMonth ? summary.combinedMarginPercent : summary.netMarginPercent).toFixed(1)}% Net Margin
                </span>
              </div>

              <div className="divide-y divide-stone-100 text-xs">
                {/* Clinic Revenue */}
                <div className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-stone-800">Clinic Revenue</span>
                    <span className="block text-[10px] text-stone-400">
                      {params.patientsPerDay} pts/day × {params.workingDaysPerMonth} days × {formatINR(params.avgSessionPrice)}
                    </span>
                  </div>
                  <span className="font-bold text-stone-900 text-sm">{formatINR(summary.monthlyRevenue)}</span>
                </div>

                {/* Home Care Revenue (if active) */}
                {homeCare.activeInMonth && (
                  <div className="py-2.5 flex justify-between items-center text-teal-900 bg-teal-50/40 px-2 -mx-2 rounded">
                    <div>
                      <span className="font-semibold text-teal-800">+ Home Visit Revenue</span>
                      <span className="block text-[10px] text-teal-600">
                        {homeCare.homeVisitsPerDay} visits/day × {params.workingDaysPerMonth} days × {formatINR(homeCare.homeVisitPrice)}
                      </span>
                    </div>
                    <span className="font-bold text-teal-800 text-sm">+{formatINR(summary.homeCareRevenue)}</span>
                  </div>
                )}

                {/* Gross Revenue Total */}
                <div className="py-2.5 flex justify-between items-center bg-stone-50 px-2 -mx-2 rounded font-bold text-stone-900">
                  <span>Total Gross Revenue</span>
                  <span>{formatINR(homeCare.activeInMonth ? summary.combinedRevenue : summary.monthlyRevenue)}</span>
                </div>

                {/* Expenses Breakdown */}
                <div className="py-2.5 space-y-1.5 pt-3">
                  <div className="flex justify-between text-stone-600">
                    <span>Lead Physiotherapist (BPT/MPT)</span>
                    <span className="font-medium text-stone-800">{formatINR(params.physiotherapistSalary)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Assistant / Receptionist</span>
                    <span className="font-medium text-stone-800">{formatINR(params.assistantSalary)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Sahakarnagar Clinic Rent</span>
                    <span className="font-medium text-stone-800">{formatINR(params.rent)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Clinical Consumables ({params.consumablesPercent}%)</span>
                    <span className="font-medium text-stone-800">{formatINR(summary.consumablesCost)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Patient Acquisition & Marketing</span>
                    <span className="font-medium text-stone-800">{formatINR(params.marketingBudget)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Electricity, WiFi, Maintenance</span>
                    <span className="font-medium text-stone-800">{formatINR(params.utilitiesAndSundries)}</span>
                  </div>

                  {homeCare.activeInMonth && (
                    <>
                      {homeCare.secondPhysioHired && (
                        <div className="flex justify-between text-teal-700">
                          <span>Second Physio (Home-Care Lead)</span>
                          <span className="font-medium">{formatINR(homeCare.secondPhysioSalary)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-teal-700">
                        <span>Travel Stipend & Mobile Consumables</span>
                        <span className="font-medium">
                          {formatINR(
                            homeCare.homeVisitsPerDay * params.workingDaysPerMonth * homeCare.travelAllowancePerVisit +
                              Math.round(summary.homeCareRevenue * 0.05)
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Total OPEX */}
                <div className="py-2.5 flex justify-between items-center text-stone-700 font-semibold">
                  <span>Total Operating Expenses</span>
                  <span>{formatINR(homeCare.activeInMonth ? summary.combinedExpenses : summary.totalExpenses)}</span>
                </div>

                {/* Net Profit */}
                <div className="py-3 flex justify-between items-center bg-emerald-50 px-3 -mx-2 rounded-lg mt-2 border border-emerald-200">
                  <div>
                    <span className="text-xs uppercase font-bold text-emerald-800">Net Monthly Profit</span>
                    <span className="block text-[10px] text-emerald-600">
                      Founder owner cash-flow before tax
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-emerald-700">
                      {formatINR(homeCare.activeInMonth ? summary.combinedNetProfit : summary.netProfit)}
                    </span>
                    <span className="block text-[10px] font-bold text-emerald-800">
                      {(homeCare.activeInMonth ? summary.combinedMarginPercent : summary.netMarginPercent).toFixed(1)}% margin
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reality Check Card */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-amber-900">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Plan Benchmark Realities</span>
              </div>
              <ul className="list-disc pl-4 text-amber-800 space-y-1 leading-relaxed">
                <li>
                  <strong>Steady state targets:</strong> 15 patients/day generates ~₹3.75L revenue and ~₹2.3L profit (45-50% net margin).
                </li>
                <li>
                  <strong>Margin is already good on paper on day one.</strong> What actually takes time to build is the patient trust and volume.
                </li>
                <li>
                  <strong>Target for hitting ₹2.0L/month profit:</strong> 10 to 12 months, not month one.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CapEx & 40L Capital Reserve View */}
      {activeSubView === 'capex' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CapEx Sliders (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-5">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Initial Setup Cost Breakdown (₹8 to 12 Lakhs)
              </h3>
              <p className="text-xs text-stone-500">
                Deploying initial capital while preserving a safe cushion from the ₹40.0 Lakh total corpus.
              </p>
            </div>

            <div className="space-y-4">
              {/* Space Deposit & Fitout */}
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                  <span>600 sq ft Space Deposit + Basic Fitout</span>
                  <span className="font-bold text-stone-900">{formatINR(capex.spaceDepositAndFitout)}</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="400000"
                  step="10000"
                  value={capex.spaceDepositAndFitout}
                  onChange={(e) => setCapex({ ...capex, spaceDepositAndFitout: Number(e.target.value) })}
                  className="w-full accent-teal-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>₹2.0L</span>
                  <span>Plan range: ₹2.5L to ₹3.5L</span>
                  <span>₹4.0L</span>
                </div>
              </div>

              {/* Equipment */}
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                  <span>Core Equipment (Treatment tables, Ultrasound, TENS, Traction, Exercise gear)</span>
                  <span className="font-bold text-stone-900">{formatINR(capex.equipment)}</span>
                </div>
                <input
                  type="range"
                  min="200000"
                  max="350000"
                  step="10000"
                  value={capex.equipment}
                  onChange={(e) => setCapex({ ...capex, equipment: Number(e.target.value) })}
                  className="w-full accent-teal-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>₹2.0L</span>
                  <span>Plan range: ₹2.5L to ₹3.0L</span>
                  <span>₹3.5L</span>
                </div>
              </div>

              {/* Interiors & Electrical */}
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                  <span>Interiors, Partitions, Soundproofing & Electrical Wiring</span>
                  <span className="font-bold text-stone-900">{formatINR(capex.interiorsAndElectrical)}</span>
                </div>
                <input
                  type="range"
                  min="80000"
                  max="200000"
                  step="5000"
                  value={capex.interiorsAndElectrical}
                  onChange={(e) => setCapex({ ...capex, interiorsAndElectrical: Number(e.target.value) })}
                  className="w-full accent-teal-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>₹80k</span>
                  <span>Plan range: ₹1.0L to ₹1.5L</span>
                  <span>₹2.0L</span>
                </div>
              </div>

              {/* Licenses & KPME */}
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                  <span>KPME Clinical Establishment Registration, Trade License, Legal</span>
                  <span className="font-bold text-stone-900">{formatINR(capex.licensesAndRegistration)}</span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max="60000"
                  step="2500"
                  value={capex.licensesAndRegistration}
                  onChange={(e) => setCapex({ ...capex, licensesAndRegistration: Number(e.target.value) })}
                  className="w-full accent-teal-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>₹25k</span>
                  <span>Plan range: ₹30k to ₹40k</span>
                  <span>₹60k</span>
                </div>
              </div>

              {/* Branding & Booking System */}
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                  <span>Booking Software, Branding, Signboard, Local Google Launch</span>
                  <span className="font-bold text-stone-900">{formatINR(capex.bookingAndBranding)}</span>
                </div>
                <input
                  type="range"
                  min="30000"
                  max="80000"
                  step="5000"
                  value={capex.bookingAndBranding}
                  onChange={(e) => setCapex({ ...capex, bookingAndBranding: Number(e.target.value) })}
                  className="w-full accent-teal-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>₹30k</span>
                  <span>Plan range: ₹40k to ₹60k</span>
                  <span>₹80k</span>
                </div>
              </div>

              {/* Working Capital Reserve Buffer */}
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                  <span>Immediate Working Capital Buffer (First 4 Months OPEX runway)</span>
                  <span className="font-bold text-teal-700">{formatINR(capex.workingCapitalBuffer)}</span>
                </div>
                <input
                  type="range"
                  min="150000"
                  max="400000"
                  step="10000"
                  value={capex.workingCapitalBuffer}
                  onChange={(e) => setCapex({ ...capex, workingCapitalBuffer: Number(e.target.value) })}
                  className="w-full accent-teal-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>₹1.5L</span>
                  <span>Plan range: ₹2.0L to ₹3.0L</span>
                  <span>₹4.0L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reserve Health & Corpus Visualizer (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-teal-600" />
                Capital Reserves & Allocation Guardrail
              </h3>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500 font-medium">Total Available Capital</span>
                  <span className="font-bold text-stone-900">{formatLakh(capex.totalCapital)} (₹40.0 Lakhs)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500 font-medium">Allocated for Launch & 4-Mo Runway</span>
                  <span className="font-bold text-teal-700">{formatLakh(capexSummary.totalSpent)}</span>
                </div>
                <div className="flex justify-between text-xs border-t border-stone-200 pt-2 font-bold">
                  <span className="text-emerald-800">Preserved Safety Reserve</span>
                  <span className="text-emerald-700">{formatLakh(capexSummary.reserveRemaining)}</span>
                </div>
              </div>

              {/* Progress bar visual */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-stone-600 mb-1.5">
                  <span>Spent: {(100 - capexSummary.reservePercent).toFixed(1)}%</span>
                  <span className="text-emerald-700">Safety Reserve: {capexSummary.reservePercent.toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-teal-700 h-full transition-all duration-300"
                    style={{ width: `${100 - capexSummary.reservePercent}%` }}
                  />
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${capexSummary.reservePercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-600 leading-relaxed bg-teal-50/50 p-3.5 rounded-lg border border-teal-100">
                <p className="font-semibold text-teal-900">
                  Strategic Role of the ₹{ (capexSummary.reserveRemaining / 100000).toFixed(1) } Lakh Reserve:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-teal-800">
                  <li><strong>Slow Q1 cushion:</strong> Healthcare trust builds slowly; buffer eliminates cash anxiety.</li>
                  <li><strong>Month 8 Expansion:</strong> Funds portable geriatric kits and upfront salary for 2nd physiotherapist.</li>
                  <li><strong>Zero debt pressure:</strong> Clinic achieves operating breakeven organically without interest debt.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sensitivity & Break-even View */}
      {activeSubView === 'sensitivity' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Volume Sensitivity & Break-Even Matrix
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              How net profit and margin shift as patient volume ramps from early launch to full capacity.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                    <th className="py-2.5 px-3 font-semibold">Stage</th>
                    <th className="py-2.5 px-3 font-semibold">Patients/Day</th>
                    <th className="py-2.5 px-3 font-semibold">Monthly Visits</th>
                    <th className="py-2.5 px-3 font-semibold">Monthly Revenue</th>
                    <th className="py-2.5 px-3 font-semibold">OPEX</th>
                    <th className="py-2.5 px-3 font-semibold">Net Profit</th>
                    <th className="py-2.5 px-3 font-semibold">Margin</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {[
                    { label: 'Early Launch (M1)', pts: 4, desc: 'Reviews & Referrals' },
                    { label: 'Breakeven Point', pts: summary.breakEvenPatientsPerDay, desc: 'Zero Loss Benchmark' },
                    { label: 'Compounding (M3)', pts: 8, desc: 'Manyata IT & Walk-ins' },
                    { label: 'Scaling (M4-5)', pts: 12, desc: 'Package Renewals' },
                    { label: 'Steady State (Plan Target)', pts: 15, desc: 'Full Single-PT load', highlight: true },
                    { label: 'Peak Clinic Capacity', pts: 18, desc: 'Near max slot utilization' },
                  ].map((row, idx) => {
                    const rowSessions = row.pts * params.workingDaysPerMonth;
                    const rowRev = rowSessions * params.avgSessionPrice;
                    const rowConsumables = rowRev * (params.consumablesPercent / 100);
                    const rowOpex =
                      params.physiotherapistSalary +
                      params.assistantSalary +
                      params.rent +
                      rowConsumables +
                      params.marketingBudget +
                      params.utilitiesAndSundries;
                    const rowProfit = rowRev - rowOpex;
                    const rowMargin = rowRev > 0 ? (rowProfit / rowRev) * 100 : 0;

                    return (
                      <tr
                        key={idx}
                        className={`${
                          row.highlight
                            ? 'bg-teal-50/70 font-semibold text-teal-950 border-y border-teal-200'
                            : 'hover:bg-stone-50/60'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <span className="font-bold">{row.label}</span>
                          <span className="block text-[10px] text-stone-400 font-normal">{row.desc}</span>
                        </td>
                        <td className="py-2.5 px-3 font-bold">{row.pts} / day</td>
                        <td className="py-2.5 px-3">{rowSessions}</td>
                        <td className="py-2.5 px-3 font-medium">{formatINR(rowRev)}</td>
                        <td className="py-2.5 px-3 text-stone-500">{formatINR(rowOpex)}</td>
                        <td className={`py-2.5 px-3 font-bold ${rowProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {formatINR(rowProfit)}
                        </td>
                        <td className="py-2.5 px-3">{rowMargin.toFixed(1)}%</td>
                        <td className="py-2.5 px-3">
                          {rowProfit >= 200000 ? (
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Target Achieved
                            </span>
                          ) : rowProfit >= 0 ? (
                            <span className="inline-flex items-center text-[10px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                              Profitable
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              Runway Buffer
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-2">
              <div className="font-bold text-stone-900 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-teal-600" />
                Break-Even Analysis
              </div>
              <p className="text-stone-600 leading-relaxed">
                With ₹1,000 average session fee and ₹35,000 rent, your clinical operation breaks even at 
                just <strong>{summary.breakEvenPatientsPerDay} patients per day</strong> (approx {summary.breakEvenPatientsPerDay * params.workingDaysPerMonth} sessions/month or {formatINR(summary.breakEvenMonthlyRevenue)} revenue). 
                Any volume above this drops directly into owner profit at ~85% contribution margin.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-2">
              <div className="font-bold text-stone-900 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1.5 text-emerald-600" />
                Why 10–25 Session Packages Matter
              </div>
              <p className="text-stone-600 leading-relaxed">
                Instead of needing 375 separate patients every month, a steady clinic with recurring packages 
                only requires <strong>25 to 30 active ongoing patients</strong> at any time. This turns unpredictable 
                one-off clinic visits into predictable recurring cash-flow.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
