import React, { useState } from 'react';
import { HomeCareParams, MonthlyOperatingParams } from '../types';
import { formatINR } from '../utils/finance';
import { 
  Home, 
  Car, 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Heart, 
  Users, 
  IndianRupee,
  Layers
} from 'lucide-react';

interface HomeCareEngineProps {
  homeCare: HomeCareParams;
  setHomeCare: React.Dispatch<React.SetStateAction<HomeCareParams>>;
  clinicParams: MonthlyOperatingParams;
}

export const HomeCareEngine: React.FC<HomeCareEngineProps> = ({
  homeCare,
  setHomeCare,
  clinicParams
}) => {
  const [selectedCluster, setSelectedCluster] = useState<string>("sahakar-cqal");

  // Calculated home care financials
  const workingDays = clinicParams.workingDaysPerMonth;
  const monthlyVisits = homeCare.homeVisitsPerDay * workingDays;
  const monthlyHomeRev = monthlyVisits * homeCare.homeVisitPrice;
  const travelCost = monthlyVisits * homeCare.travelAllowancePerVisit;
  const therapistCost = homeCare.secondPhysioHired ? homeCare.secondPhysioSalary : 0;
  const consumables = Math.round(monthlyHomeRev * 0.05);
  const totalHomeOpex = travelCost + therapistCost + consumables;
  const netHomeProfit = monthlyHomeRev - totalHomeOpex;
  const homeMargin = monthlyHomeRev > 0 ? (netHomeProfit / monthlyHomeRev) * 100 : 0;

  const clusters = [
    {
      id: "sahakar-cqal",
      name: "Sahakarnagar Blocks A–G & CQAL Layout",
      radius: "1.2 km",
      elderDensity: "Very High",
      avgTravelTime: "8–12 mins",
      notes: "Older independent houses and bungalows with elderly couples. Easy scooter travel."
    },
    {
      id: "judicial-telecom",
      name: "Judicial Layout & Telecom Layout",
      radius: "2.4 km",
      elderDensity: "High",
      avgTravelTime: "12–15 mins",
      notes: "Retired civil servants and judges. High willingness to pay for premium convenience."
    },
    {
      id: "kodigehalli-tata",
      name: "Kodigehalli & Tata Nagar Enclave",
      radius: "2.8 km",
      elderDensity: "Medium-High",
      avgTravelTime: "15–18 mins",
      notes: "Established residential layouts with multi-generational families."
    },
    {
      id: "hebbal-gated",
      name: "Bellary Road Gated Communities (Sobha/Godrej)",
      radius: "3.5 km",
      elderDensity: "High (Living with NRI / Tech children)",
      avgTravelTime: "15–20 mins",
      notes: "High-net-worth families paying ₹1,500 - ₹1,800/session without friction."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Home className="w-4 h-4" />
              <span>Phase 2 Expansion (Month 6–8+)</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Concierge Geriatric Home-Care Layer
            </h2>
            <p className="text-stone-300 text-sm max-w-3xl mt-1 leading-relaxed">
              Older residents in Sahakarnagar frequently face stair barriers, severe osteoarthritis, 
              or post-surgical immobility. Adding home visits priced at a premium (₹1,500/visit) unlocks 
              an additional ₹3.0 to 4.5 Lakhs monthly revenue with zero additional clinic rent.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-stone-800/90 p-3 rounded-xl border border-stone-700">
            <Heart className="w-8 h-8 text-rose-400 shrink-0" />
            <div>
              <div className="text-xs text-stone-400">Home Care Pricing</div>
              <div className="text-lg font-bold text-white">₹1,500 / visit</div>
              <div className="text-[11px] text-teal-300">50% Premium for Convenience</div>
            </div>
          </div>
        </div>

        {/* Live Simulator Status Bar */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-stone-300 font-semibold">Home Care Engine Status:</span>
            <button
              onClick={() => setHomeCare({ ...homeCare, activeInMonth: !homeCare.activeInMonth })}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                homeCare.activeInMonth
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
              }`}
            >
              {homeCare.activeInMonth ? 'Active in Model' : 'Enable Phase 2 Home Care'}
            </button>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-medium">Monthly Revenue</span>
              <span className="font-bold text-teal-300">{formatINR(monthlyHomeRev)}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-medium">Net Profit Added</span>
              <span className="font-bold text-emerald-400">+{formatINR(netHomeProfit)}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-medium">Margin</span>
              <span className="font-bold text-amber-300">{homeMargin.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls & Staffing Model (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Volume and Pricing Sliders */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Car className="w-5 h-5 text-teal-700" />
                <h3 className="text-sm font-bold text-stone-900">Home Visit Capacity & Pricing</h3>
              </div>
              <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
                {monthlyVisits} visits / month
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                  <span>Home Visits Per Day (Capacity: 4–6 visits max per mobile therapist)</span>
                  <span className="font-bold text-teal-800">{homeCare.homeVisitsPerDay} visits / day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={homeCare.homeVisitsPerDay}
                  onChange={(e) => setHomeCare({ ...homeCare, homeVisitsPerDay: Number(e.target.value) })}
                  className="w-full accent-teal-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>1–2 (Pilot)</span>
                  <span className="font-bold text-teal-700">4–5 (Standard Home Load)</span>
                  <span>7–8 (Requires 2 mobile PTs)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                  <span>Home Visit Pricing (Premium for travel and undivided attention)</span>
                  <span className="font-bold text-teal-800">{formatINR(homeCare.homeVisitPrice)} / visit</span>
                </div>
                <input
                  type="range"
                  min="1200"
                  max="2000"
                  step="50"
                  value={homeCare.homeVisitPrice}
                  onChange={(e) => setHomeCare({ ...homeCare, homeVisitPrice: Number(e.target.value) })}
                  className="w-full accent-teal-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>₹1,200</span>
                  <span className="font-bold text-teal-700">₹1,500 (Plan Specified)</span>
                  <span>₹2,000 (Luxury Enclaves)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-stone-700 mb-1">
                  <span>Travel & Fuel Allowance Per Visit</span>
                  <span className="font-bold text-stone-800">{formatINR(homeCare.travelAllowancePerVisit)} / visit</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="350"
                  step="25"
                  value={homeCare.travelAllowancePerVisit}
                  onChange={(e) => setHomeCare({ ...homeCare, travelAllowancePerVisit: Number(e.target.value) })}
                  className="w-full accent-teal-600 h-2 bg-stone-100 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-stone-400">Covers two-wheeler fuel, parking, and therapist travel incentive</p>
              </div>
            </div>
          </div>

          {/* Staffing Model Choice Card */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center">
              <Users className="w-4 h-4 mr-1.5 text-teal-700" />
              Staffing Execution: Hybrid vs Dedicated 2nd Hire
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                onClick={() => setHomeCare({ ...homeCare, secondPhysioHired: false })}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  !homeCare.secondPhysioHired
                    ? 'border-teal-600 bg-teal-50/60 shadow-xs'
                    : 'border-stone-200 bg-stone-50/60 hover:border-stone-300'
                }`}
              >
                <div className="font-bold text-stone-900 mb-1">Single PT Hybrid (Months 6–7)</div>
                <p className="text-stone-600 leading-relaxed text-[11px] mb-2">
                  The clinic therapist handles 12 clinic patients during the day, plus 1–2 nearby home visits 
                  in early morning or late evening.
                </p>
                <span className="text-[10px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                  Zero Extra Fixed Payroll
                </span>
              </div>

              <div
                onClick={() => setHomeCare({ ...homeCare, secondPhysioHired: true })}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  homeCare.secondPhysioHired
                    ? 'border-teal-600 bg-teal-50/60 shadow-xs'
                    : 'border-stone-200 bg-stone-50/60 hover:border-stone-300'
                }`}
              >
                <div className="font-bold text-stone-900 mb-1">Dedicated 2nd PT Hire (Month 8+)</div>
                <p className="text-stone-600 leading-relaxed text-[11px] mb-2">
                  Hire a mobile physiotherapist (₹45,000 salary) dedicated exclusively to home care. 
                  Prevents clinic burnout and protects punctuality.
                </p>
                <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Plan Recommendation (Funded by ₹40L Reserve)
                </span>
              </div>
            </div>
          </div>

          {/* Operational Reality Box */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs space-y-1.5 text-amber-900">
            <div className="font-bold flex items-center">
              <ShieldAlert className="w-4 h-4 mr-1.5 text-amber-700" />
              Critical Operational Warning from the Plan:
            </div>
            <p className="leading-relaxed text-amber-800">
              "The home-care side is fundamentally a <strong>staffing business rather than an equipment business</strong>, 
              so margins there are thinner and staff reliability matters more than anything else." 
              Strictly cap routes within a 3.5 km radius to prevent Bangalore traffic delays.
            </p>
          </div>
        </div>

        {/* Radius Clusters & Backpack Kit (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Local Geographic Catchment Clusters */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm font-bold text-stone-900 flex items-center">
                <MapPin className="w-4 h-4 mr-1.5 text-teal-700" />
                3.5 km Local Travel Catchment
              </h3>
              <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                Sahakarnagar Hub
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {clusters.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCluster(c.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedCluster === c.id
                      ? 'bg-teal-50/70 border-teal-400 shadow-2xs'
                      : 'hover:bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-stone-900">{c.name}</span>
                    <span className="text-teal-700 font-bold text-[11px]">{c.radius}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[10px] text-stone-500 mt-1">
                    <span>Elder Density: <strong>{c.elderDensity}</strong></span>
                    <span>Transit: <strong>{c.avgTravelTime}</strong></span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1.5 leading-snug">
                    {c.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Portable Geriatric Treatment Backpack Kit */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-stone-900 flex items-center">
              <Briefcase className="w-4 h-4 mr-1.5 text-teal-700" />
              Mobile Clinical Backpack Kit Spec
            </h3>
            <p className="text-stone-500 text-[11px]">
              Procured from the startup equipment budget (~₹40,000 for mobile kit)
            </p>

            <ul className="space-y-1.5 text-stone-700">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Portable 2-Channel TENS / EMS Combo Unit (Battery operated)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Compact Ultrasound Head & Ultrasound Gel bottle</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Heavy-duty Transfer Gait Belt for safe bed-to-chair transfers</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>TheraBand progressive resistance loops & foam balance cushion</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Digital BP Monitor, Pulse Oximeter & Stethoscope</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Digital Tablet with EMR app for caregiver signature & progress notes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
