import React, { useState } from 'react';
import { TIMELINE_DATA } from '../data/businessDefaults';
import { formatINR, formatLakh } from '../utils/finance';
import { 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Target, 
  AlertCircle,
  Flag,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const GrowthRoadmap: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(1);

  const activeMonthData = TIMELINE_DATA.find((m) => m.month === selectedMonth) || TIMELINE_DATA[0];

  const phases = [
    { label: "Phase 1: Launch & Reviews", months: [1, 2], range: "M1–M2", status: "Breakeven" },
    { label: "Phase 2: Compounding Word-of-Mouth", months: [3, 4], range: "M3–M4", status: "₹40k–70k Profit" },
    { label: "Phase 3: Clinic Steady State", months: [5, 6, 7], range: "M5–M7", status: "₹1.0L–1.3L Profit" },
    { label: "Phase 4: Home-Care Rollout", months: [8, 9], range: "M8–M9", status: "₹1.5L–1.8L Profit" },
    { label: "Phase 5: Target Attained", months: [10, 11, 12], range: "M10–M12", status: "₹2.0L+ Profit Target" }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>Realistic 12-Month Business Progression</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              The Honest Path to ₹2 Lakh / Month Profit
            </h2>
            <p className="text-stone-300 text-sm max-w-2xl mt-1 leading-relaxed">
              Healthcare clinic trust builds gradually through clinical outcomes, word of mouth, 
              and verified patient reviews. Month 10–12 is the realistic target for stabilized ₹2L+ profit, 
              not month one.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-stone-800 p-3 rounded-xl border border-stone-700">
            <Target className="w-8 h-8 text-teal-400 shrink-0" />
            <div>
              <div className="text-xs text-stone-400">Target Benchmark</div>
              <div className="text-lg font-bold text-teal-300">₹2,00,000+ Net Profit / mo</div>
              <div className="text-[11px] text-stone-400">Achieved: Month 10 to 12</div>
            </div>
          </div>
        </div>

        {/* Phase progress timeline bar */}
        <div className="mt-6 pt-5 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {phases.map((p, idx) => {
            const isCurrentPhase = p.months.includes(selectedMonth);
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border transition-all ${
                  isCurrentPhase
                    ? 'bg-teal-950/80 border-teal-500 text-teal-200'
                    : 'bg-stone-800/60 border-stone-700 text-stone-400'
                }`}
              >
                <div className="flex justify-between font-bold text-[11px] mb-1">
                  <span>{p.range}</span>
                  <span className="text-stone-300">{p.status}</span>
                </div>
                <div className="text-[10px] truncate">{p.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Month Selector Pills */}
      <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
        <span className="text-xs font-bold text-stone-500 uppercase px-2 shrink-0">Select Month:</span>
        {TIMELINE_DATA.map((m) => {
          const isSelected = m.month === selectedMonth;
          return (
            <button
              key={m.month}
              onClick={() => setSelectedMonth(m.month)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-xs font-bold'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              Month {m.month}
            </button>
          );
        })}
      </div>

      {/* Active Month Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Month deep dive (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-start justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">
                Month {activeMonthData.month} Deep Dive
              </span>
              <h3 className="text-xl font-bold text-stone-900 mt-0.5">
                {activeMonthData.phase}
              </h3>
              <p className="text-xs text-stone-500 mt-1 italic">
                "{activeMonthData.focus}"
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
              {activeMonthData.month <= 2
                ? 'Phase 1: Launch'
                : activeMonthData.month <= 4
                ? 'Phase 2: Compounding'
                : activeMonthData.month <= 7
                ? 'Phase 3: Steady Clinic'
                : activeMonthData.month <= 9
                ? 'Phase 4: Home Care Added'
                : 'Phase 5: Target Attainment'}
            </span>
          </div>

          {/* Key Metrics grid for this month */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
              <span className="text-[10px] uppercase font-semibold text-stone-400">Monthly Revenue</span>
              <div className="text-sm font-bold text-stone-900 mt-0.5">
                {formatINR(activeMonthData.projectedRevenueMin)} - {formatINR(activeMonthData.projectedRevenueMax)}
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <span className="text-[10px] uppercase font-semibold text-emerald-700">Net Profit</span>
              <div className="text-sm font-bold text-emerald-800 mt-0.5">
                {formatINR(activeMonthData.projectedProfitMin)} - {formatINR(activeMonthData.projectedProfitMax)}
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
              <span className="text-[10px] uppercase font-semibold text-stone-400">Clinic Patients</span>
              <div className="text-sm font-bold text-stone-900 mt-0.5">
                {activeMonthData.patientsPerDay} / day
              </div>
              <span className="text-[10px] text-stone-400">~{activeMonthData.patientsPerDay * 25} sessions</span>
            </div>

            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
              <span className="text-[10px] uppercase font-semibold text-stone-400">Home Visits</span>
              <div className="text-sm font-bold text-teal-800 mt-0.5">
                {activeMonthData.homeVisitsPerDay > 0 ? `${activeMonthData.homeVisitsPerDay} / day` : 'Not Active'}
              </div>
              <span className="text-[10px] text-stone-400">
                {activeMonthData.homeVisitsPerDay > 0 ? `~${activeMonthData.homeVisitsPerDay * 25} visits` : 'Launches M7-8'}
              </span>
            </div>
          </div>

          {/* Key Operational Milestones */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center">
              <Flag className="w-3.5 h-3.5 mr-1 text-teal-600" />
              Key Operational Milestones for Month {activeMonthData.month}
            </h4>
            <div className="space-y-2">
              {activeMonthData.keyMilestones.map((milestone, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 text-xs text-stone-700 bg-stone-50/70 p-2.5 rounded-lg border border-stone-200/80">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{milestone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 12-Month Macro Overview Chart Table (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1.5 text-teal-600" />
              Full 12-Month Revenue & Profit Trajectory
            </h3>
            <span className="text-[10px] text-stone-400 font-semibold uppercase">Base Model</span>
          </div>

          <div className="space-y-2 text-xs">
            {TIMELINE_DATA.map((m) => {
              const isSelected = m.month === selectedMonth;
              const maxRev = 1050000;
              const revPercent = (m.projectedRevenueMax / maxRev) * 100;

              return (
                <div
                  key={m.month}
                  onClick={() => setSelectedMonth(m.month)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-400 shadow-2xs'
                      : 'hover:bg-stone-50 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-stone-800">
                      Month {m.month}: {m.phase}
                    </span>
                    <span className={`font-bold ${m.projectedProfitMax >= 200000 ? 'text-emerald-700' : 'text-stone-700'}`}>
                      {formatINR(m.projectedProfitMax)} profit
                    </span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all ${
                        m.month >= 10 ? 'bg-emerald-600' : m.month >= 8 ? 'bg-teal-600' : 'bg-teal-700'
                      }`}
                      style={{ width: `${revPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                    <span>Rev: {formatINR(m.projectedRevenueMin)} - {formatINR(m.projectedRevenueMax)}</span>
                    <span>{m.patientsPerDay} pts{m.homeVisitsPerDay > 0 ? ` + ${m.homeVisitsPerDay} home` : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
