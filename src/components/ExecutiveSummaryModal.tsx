import React, { useState } from 'react';
import { MonthlyOperatingParams, HomeCareParams, StartupCapital } from '../types';
import { calculateMonthlyFinancials, calculateCapExSummary, formatINR, formatLakh } from '../utils/finance';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Building2, 
  TrendingUp, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';

interface ExecutiveSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: MonthlyOperatingParams;
  homeCare: HomeCareParams;
  capex: StartupCapital;
}

export const ExecutiveSummaryModal: React.FC<ExecutiveSummaryModalProps> = ({
  isOpen,
  onClose,
  params,
  homeCare,
  capex
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const summary = calculateMonthlyFinancials(params, homeCare);
  const capexSummary = calculateCapExSummary(capex);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `SAHAKAR PHYSIO & ELDER CARE - BUSINESS OPERATING BLUEPRINT
Location: Sahakarnagar, Bangalore (CQAL & Manyata Tech Park Corridor)
Model: 600 sq ft Boutique Clinic (1 BPT/MPT + 1 Assistant) + Phase 2 Elder Home Visits

CAPITAL ALLOCATION:
- Total Available Capital: ${formatLakh(capex.totalCapital)} (₹40 Lakhs)
- Startup CapEx & 4-Month Runway: ${formatLakh(capexSummary.totalSpent)}
- Preserved Safety Reserve: ${formatLakh(capexSummary.reserveRemaining)} (${capexSummary.reservePercent.toFixed(1)}% of corpus)

STEADY STATE CLINIC ECONOMICS (15 patients/day):
- Monthly Revenue: ${formatINR(summary.monthlyRevenue)}
- Monthly Operating Expenses: ${formatINR(summary.totalExpenses)}
  * Lead Physiotherapist: ${formatINR(params.physiotherapistSalary)}
  * Receptionist / Assistant: ${formatINR(params.assistantSalary)}
  * Sahakarnagar Rent: ${formatINR(params.rent)}
  * Consumables (10%): ${formatINR(summary.consumablesCost)}
  * Marketing & Acquisition: ${formatINR(params.marketingBudget)}
  * Utilities & Sundries: ${formatINR(params.utilitiesAndSundries)}
- Net Monthly Profit: ${formatINR(summary.netProfit)} (~${summary.netMarginPercent.toFixed(1)}% net margin)
- Break-even Volume: ${summary.breakEvenPatientsPerDay} patients/day (${formatINR(summary.breakEvenMonthlyRevenue)}/mo)

PHASE 2 ELDER HOME CARE (Month 8-12+):
- Premium Home Visit Fee: ${formatINR(homeCare.homeVisitPrice)}/visit
- Projected Combined Revenue: ₹8.0 - 10.0 Lakhs / month
- Target Net Monthly Profit: ₹2,00,000+ / month achieved in Months 10–12

WEEK 1 IMMEDIATE PRIORITIES:
1. Reach out to BPT/MPT physiotherapists across Bangalore alumni & groups.
2. Scout 600 sq ft spaces on Sahakarnagar main roads (rent ≤₹35k, ground/lift access).
3. Mystery shop 2-3 competitor clinics nearby to document pricing and gaps.
4. Verify KPME (Karnataka Private Medical Establishments) registration checklist.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Executive Business Plan Brief</h2>
              <p className="text-xs text-stone-400">Sahakar Physio & Geriatric Rehabilitation Clinic</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300 transition-colors flex items-center cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300 transition-colors flex items-center cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-6 md:p-8 space-y-6 text-xs text-stone-800 max-h-[80vh] overflow-y-auto">
          {/* Executive Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200 text-center">
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Total Capital</span>
              <div className="text-base font-bold text-stone-900 mt-0.5">₹40.0 Lakhs</div>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Initial CapEx + Buffer</span>
              <div className="text-base font-bold text-teal-800 mt-0.5">{formatLakh(capexSummary.totalSpent)}</div>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Target Steady Profit</span>
              <div className="text-base font-bold text-emerald-700 mt-0.5">₹2.0L+ / month</div>
            </div>
            <div>
              <span className="text-[10px] text-stone-400 uppercase font-semibold">Timeline Target</span>
              <div className="text-base font-bold text-stone-900 mt-0.5">Months 10–12</div>
            </div>
          </div>

          {/* Section 1: Business Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-1">
              1. Business Model & Strategic Location
            </h3>
            <p className="leading-relaxed text-stone-600">
              <strong>Location:</strong> Sahakarnagar, Bangalore. A strategic sweet spot with established older housing 
              (high concentration of elderly residents with mobility/arthritic care needs), nearby gated apartment communities 
              (convenience-first families), collegiate hubs (RV, MS Ramaiah, Reva sports injuries), and tech commuters 
              heading to Manyata Tech Park dealing with desk-job spinal strain.
            </p>
            <p className="leading-relaxed text-stone-600">
              <strong>The Model:</strong> 600 sq ft boutique clinic staffed with 1 experienced, licensed BPT/MPT 
              physiotherapist and 1 receptionist. The founder runs operations, marketing, scheduling, and finance. 
              Patients enroll in structured 10 to 25 session recurring packages. In Month 6–8, concierge home visits 
              are layered on for homebound seniors at a premium (₹1,500/visit).
            </p>
          </div>

          {/* Section 2: Capital Deployment */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-1">
              2. Startup Capital Deployment & Reserve Guardrails
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-700">
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-1">
                <div className="font-bold text-stone-900">Initial Setup & Fitout: {formatLakh(capexSummary.totalSpent)}</div>
                <div className="text-[11px] text-stone-600">Space deposit & fitout: {formatINR(capex.spaceDepositAndFitout)}</div>
                <div className="text-[11px] text-stone-600">Treatment & exercise equipment: {formatINR(capex.equipment)}</div>
                <div className="text-[11px] text-stone-600">Interiors & electrical partitions: {formatINR(capex.interiorsAndElectrical)}</div>
                <div className="text-[11px] text-stone-600">KPME & medical registrations: {formatINR(capex.licensesAndRegistration)}</div>
                <div className="text-[11px] text-stone-600">Branding, website & booking software: {formatINR(capex.bookingAndBranding)}</div>
                <div className="text-[11px] text-stone-600">First 4 months working capital buffer: {formatINR(capex.workingCapitalBuffer)}</div>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 space-y-1.5">
                <div className="font-bold text-emerald-900">Safety Reserve: {formatLakh(capexSummary.reserveRemaining)}</div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  The remaining {capexSummary.reservePercent.toFixed(1)}% of your ₹40 Lakh total corpus remains intact 
                  in bank reserves to cushion the slow Q1 ramp, fund the Month 8 mobile home-care expansion, 
                  and hire a second physiotherapist without debt pressure.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Steady-State Unit Economics */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-1">
              3. Steady-State Unit Economics (Clinic Only)
            </h3>
            <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200 space-y-2">
              <div className="flex justify-between items-center font-bold text-stone-900">
                <span>Revenue at 15 patients/day (25 working days):</span>
                <span className="text-sm text-teal-800">{formatINR(summary.monthlyRevenue)} / mo</span>
              </div>
              <div className="space-y-1 text-stone-600 text-[11px]">
                <div className="flex justify-between"><span>Lead Physiotherapist (BPT/MPT):</span><span>{formatINR(params.physiotherapistSalary)}</span></div>
                <div className="flex justify-between"><span>Assistant / Receptionist:</span><span>{formatINR(params.assistantSalary)}</span></div>
                <div className="flex justify-between"><span>Sahakarnagar Clinic Rent (600 sq ft):</span><span>{formatINR(params.rent)}</span></div>
                <div className="flex justify-between"><span>Clinical Consumables ({params.consumablesPercent}% of rev):</span><span>{formatINR(summary.consumablesCost)}</span></div>
                <div className="flex justify-between"><span>Marketing & Patient Acquisition:</span><span>{formatINR(params.marketingBudget)}</span></div>
                <div className="flex justify-between"><span>Utilities & Sundries:</span><span>{formatINR(params.utilitiesAndSundries)}</span></div>
              </div>
              <div className="flex justify-between items-center font-extrabold text-emerald-800 pt-2 border-t border-stone-200 text-sm">
                <span>Net Monthly Profit:</span>
                <span>{formatINR(summary.netProfit)} ({summary.netMarginPercent.toFixed(1)}% Net Margin)</span>
              </div>
            </div>
          </div>

          {/* Section 4: 12-Month Progression */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-1">
              4. Realistic 12-Month Financial Ramp
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-stone-50 border border-stone-200">
                <div className="font-bold text-stone-900">Months 1–2</div>
                <div className="text-stone-500">Launch & Reviews</div>
                <div className="font-semibold text-teal-700 mt-1">₹1–1.5L rev</div>
                <div className="text-[10px] text-stone-500">Breakeven</div>
              </div>
              <div className="p-2.5 rounded bg-stone-50 border border-stone-200">
                <div className="font-bold text-stone-900">Months 3–4</div>
                <div className="text-stone-500">Word-of-Mouth</div>
                <div className="font-semibold text-teal-700 mt-1">₹2.5–3.5L rev</div>
                <div className="text-[10px] text-emerald-700">₹40k–70k profit</div>
              </div>
              <div className="p-2.5 rounded bg-stone-50 border border-stone-200">
                <div className="font-bold text-stone-900">Months 5–7</div>
                <div className="text-stone-500">Clinic Steady State</div>
                <div className="font-semibold text-teal-700 mt-1">₹4.0–5.0L rev</div>
                <div className="text-[10px] text-emerald-700">₹1.0–1.3L profit</div>
              </div>
              <div className="p-2.5 rounded bg-stone-50 border border-stone-200">
                <div className="font-bold text-stone-900">Months 8–9</div>
                <div className="text-stone-500">Home Care Added</div>
                <div className="font-semibold text-teal-700 mt-1">₹7.0–8.0L rev</div>
                <div className="text-[10px] text-emerald-700">₹1.5–1.8L profit</div>
              </div>
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200">
                <div className="font-bold text-emerald-900">Months 10–12</div>
                <div className="text-emerald-700">Stabilized Target</div>
                <div className="font-bold text-teal-800 mt-1">₹9.0–10.0L rev</div>
                <div className="text-[10px] font-extrabold text-emerald-800">₹2.0L+ / mo profit</div>
              </div>
            </div>
          </div>

          {/* Section 5: Week 1 Actionable Checklist */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-1">
              5. Immediate Week 1 Action Plan
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-stone-600 leading-relaxed text-[11px]">
              <li><strong>PT Hiring Outreach:</strong> Start reaching out to physiotherapists in Bangalore now via alumni networks, IAP chapters, and LinkedIn; this hire is the product.</li>
              <li><strong>Walk Sahakarnagar Main Roads:</strong> Inspect 550–650 sq ft spaces near apartment clusters and 60 Feet Road (prioritizing ground floor or functional lift access for elderly patients).</li>
              <li><strong>Mystery Shop 2-3 Local Clinics:</strong> Visit existing clinics as a back/neck patient to benchmark consultation fees (₹600–1,200), package structures, and observe service gaps.</li>
              <li><strong>Check KPME Registration:</strong> Confirm clinical establishment registration documents and local consultant support to avoid late licensing surprises.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Close Brief
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors flex items-center cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print Full Document
          </button>
        </div>
      </div>
    </div>
  );
};
