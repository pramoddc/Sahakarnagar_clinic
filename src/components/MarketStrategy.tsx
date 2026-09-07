import React, { useState } from 'react';
import { MARKET_SEGMENTS, PATIENT_PACKAGES } from '../data/businessDefaults';
import { PatientPackage, MarketSegment } from '../types';
import { formatINR } from '../utils/finance';
import { 
  Users, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Repeat, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Building, 
  HeartHandshake,
  Activity,
  CalendarCheck
} from 'lucide-react';

export const MarketStrategy: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<PatientPackage>(PATIENT_PACKAGES[0]);
  const [selectedSegment, setSelectedSegment] = useState<MarketSegment>(MARKET_SEGMENTS[0]);

  return (
    <div className="space-y-6">
      {/* Catchment Header */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>Bangalore North Catchment Analysis</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Why Sahakarnagar Is the Strategic Sweet Spot
            </h2>
            <p className="text-stone-300 text-sm max-w-3xl mt-1 leading-relaxed">
              Sahakarnagar offers significantly lower commercial rent (₹35,000 for 600 sq ft) compared to 
              Koramangala or Indiranagar (₹80k–1.5L+), while capturing a dense multi-segment demographic: 
              older housing residents, Manyata Tech Park IT commuters, collegiate athletes, and gated enclaves.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-stone-800/90 p-3 rounded-xl border border-stone-700/80">
            <Repeat className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs text-stone-400 font-medium">Core Revenue Model</div>
              <div className="text-sm font-bold text-white">10 to 25 Session Courses</div>
              <div className="text-[11px] text-emerald-400 font-semibold">Recurring vs Single-Visit</div>
            </div>
          </div>
        </div>

        {/* 4 Demographics Quick Pills */}
        <div className="mt-6 pt-4 border-t border-stone-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-stone-800/60 p-2.5 rounded-lg border border-stone-700/60">
            <div className="font-bold text-teal-300 flex items-center">
              <Users className="w-3.5 h-3.5 mr-1" />
              Aging Residents (35%)
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Older Sahakarnagar layouts</div>
          </div>

          <div className="bg-stone-800/60 p-2.5 rounded-lg border border-stone-700/60">
            <div className="font-bold text-teal-300 flex items-center">
              <Briefcase className="w-3.5 h-3.5 mr-1" />
              Manyata IT (30%)
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">Desk workers & tech neck</div>
          </div>

          <div className="bg-stone-800/60 p-2.5 rounded-lg border border-stone-700/60">
            <div className="font-bold text-teal-300 flex items-center">
              <Building className="w-3.5 h-3.5 mr-1" />
              Gated Apartments (20%)
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">High disposable convenience</div>
          </div>

          <div className="bg-stone-800/60 p-2.5 rounded-lg border border-stone-700/60">
            <div className="font-bold text-teal-300 flex items-center">
              <GraduationCap className="w-3.5 h-3.5 mr-1" />
              Colleges & Sports (15%)
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">RV, MS Ramaiah, Reva Univ</div>
          </div>
        </div>
      </div>

      {/* 4 Detailed Market Segments */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center">
          <Target className="w-5 h-5 mr-2 text-teal-700" />
          The 4 Pillars of Sahakarnagar Patient Demand
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MARKET_SEGMENTS.map((seg) => (
            <div
              key={seg.id}
              onClick={() => setSelectedSegment(seg)}
              className={`p-5 rounded-xl border transition-all cursor-pointer ${
                selectedSegment.id === seg.id
                  ? 'bg-teal-50/50 border-teal-400 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{seg.title}</h4>
                  <span className="text-[11px] text-stone-500 block mt-0.5">{seg.demographic}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100/70 text-teal-800 shrink-0">
                  {seg.expectedVolumeShare}% Volume
                </span>
              </div>

              <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                <strong>Why Sahakarnagar:</strong> {seg.whySahakarnagar}
              </p>

              <div className="space-y-1.5 text-xs text-stone-700 bg-stone-50/80 p-3 rounded-lg border border-stone-200/60">
                <div className="font-semibold text-stone-800 text-[11px] uppercase tracking-wide">Key Pain Points:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-stone-600">
                  {seg.painPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100 flex justify-between items-center text-[11px]">
                <span className="text-stone-500">
                  <strong>Acquisition:</strong> {seg.marketingChannel}
                </span>
                <span className="font-bold text-teal-800 shrink-0">
                  Avg {seg.avgPackageSessions} sessions
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recurring Packages vs One-Off Explainer */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              The Recurring Revenue Engine: 10 to 25 Session Packages
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Patients come for chronic pain, post-op recovery, and sports rehab. A 10-25 session course 
              transforms your revenue from sporadic one-offs into predictable recurring subscriptions.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            High Patient Retention
          </span>
        </div>

        {/* Comparison card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2">
            <div className="font-bold text-stone-800 text-sm flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-2" />
              Traditional Single-Visit Clinic Model (Fragile)
            </div>
            <ul className="space-y-1.5 text-stone-600 list-disc pl-4">
              <li>Requires <strong>375 unique new patients</strong> every single month to hit ₹3.75L revenue.</li>
              <li>Patients drop off after 1 or 2 sessions as soon as acute pain dulls slightly.</li>
              <li>High marketing churn cost and severe month-to-month cash flow volatility.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-2">
            <div className="font-bold text-teal-900 text-sm flex items-center">
              <span className="w-2 h-2 rounded-full bg-teal-600 mr-2" />
              Sahakar Physio Package Model (Predictable & Sticky)
            </div>
            <ul className="space-y-1.5 text-teal-800 list-disc pl-4">
              <li>Only requires <strong>25 to 30 active ongoing patients</strong> enrolled in a 10–25 session course.</li>
              <li>Prepaid packages guarantee clinical compliance and superior medical recovery outcomes.</li>
              <li>Predictable recurring cash flow; receptionist easily schedules 2–3 weeks in advance.</li>
            </ul>
          </div>
        </div>

        {/* Package Catalog Cards */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Standardized Clinical Care Packages
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PATIENT_PACKAGES.map((pkg) => {
              const isSelected = selectedPackage.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-50/60 border-teal-500 ring-1 ring-teal-500'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {pkg.tag}
                      </span>
                      <span className="text-xs font-bold text-teal-800">
                        {pkg.recommendedSessions} Sessions
                      </span>
                    </div>

                    <h5 className="font-bold text-stone-900 text-sm leading-tight mb-1">
                      {pkg.name}
                    </h5>
                    <p className="text-[11px] text-stone-500 mb-2">
                      Target: {pkg.targetDemographic}
                    </p>
                    <p className="text-[11px] text-stone-600 mb-3 line-clamp-2">
                      <strong>Condition:</strong> {pkg.condition}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Package Price</span>
                      <span className="font-extrabold text-stone-900 text-sm">{formatINR(pkg.packagePrice)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block">Duration</span>
                      <span className="font-medium text-stone-700">{pkg.recurringDurationWeeks} Weeks</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Package Deep Dive */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-stone-900">
            <span className="flex items-center">
              <CalendarCheck className="w-4 h-4 mr-1.5 text-teal-600" />
              Clinical Protocol Summary: {selectedPackage.name}
            </span>
            <span className="text-teal-700 font-extrabold text-sm">
              {formatINR(selectedPackage.pricePerSession)} / session ({formatINR(selectedPackage.packagePrice)} total)
            </span>
          </div>
          <p className="text-stone-600">
            <strong>Expected Patient Clinical Outcome:</strong> {selectedPackage.typicalOutcome}
          </p>
        </div>
      </div>
    </div>
  );
};
