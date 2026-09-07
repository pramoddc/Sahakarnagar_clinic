import React, { useState } from 'react';
import { FLOOR_STATIONS } from '../data/businessDefaults';
import { FloorStation } from '../types';
import { formatINR } from '../utils/finance';
import { 
  LayoutGrid, 
  Clock, 
  CheckCircle2, 
  Maximize2, 
  Armchair, 
  Activity, 
  Stethoscope, 
  Dumbbell,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export const ClinicFloorPlanner: React.FC = () => {
  const [selectedStation, setSelectedStation] = useState<FloorStation>(FLOOR_STATIONS[2]);

  // Total sq ft check
  const totalSqFt = FLOOR_STATIONS.reduce((sum, s) => sum + s.sqFt, 0);

  // Daily schedule slots for 15 patients
  const scheduleSlots = [
    { time: "08:30 AM - 09:15 AM", patient: "Ramesh K. (Senior, 68)", condition: "Knee Osteoarthritis", zone: "Electrotherapy Bay" },
    { time: "09:20 AM - 10:05 AM", patient: "Padma V. (Senior, 72)", condition: "Post-TKR Gait Rehab", zone: "Active Exercise Zone" },
    { time: "10:10 AM - 10:55 AM", patient: "Kavitha M. (Manyata IT)", condition: "Cervical Spine Radiculopathy", zone: "Traction & Manual Bay" },
    { time: "11:00 AM - 11:45 AM", patient: "Arjun S. (Reva Univ)", condition: "Ankle Inversion Sprain", zone: "Active Exercise Zone" },
    { time: "11:50 AM - 12:35 PM", patient: "Venkatesh B. (Senior, 65)", condition: "Lumbar Spondylosis", zone: "Electrotherapy Bay" },
    { time: "12:40 PM - 01:25 PM", patient: "Siddharth N. (Manyata IT)", condition: "Thoracic Tech-Neck", zone: "Consultation & Manual" },
    { time: "01:30 PM - 02:30 PM", patient: "--- CLINIC LUNCH & SANITIZATION BREAK ---", condition: "Room UV Sterilization", zone: "Rest Period", isBreak: true },
    { time: "02:30 PM - 03:15 PM", patient: "Shanti R. (Gated Society)", condition: "Frozen Shoulder (Adhesive Capsulitis)", zone: "Electrotherapy Bay" },
    { time: "03:20 PM - 04:05 PM", patient: "Deepak G. (Senior, 70)", condition: "Post-Stroke Balance Ataxia", zone: "Active Exercise Zone" },
    { time: "04:10 PM - 04:55 PM", patient: "Pranathi B. (Manyata IT)", condition: "Ergonomic Lumbar Strain", zone: "Traction & Manual Bay" },
    { time: "05:00 PM - 05:45 PM", patient: "Varun T. (Ramaiah College)", condition: "Rotator Cuff Tendinitis", zone: "Active Exercise Zone" },
    { time: "05:50 PM - 06:35 PM", patient: "Girish P. (Manyata IT)", condition: "Sciatica / Disc Bulge", zone: "Electrotherapy Bay" },
    { time: "06:40 PM - 07:25 PM", patient: "Sneha R. (Manyata IT)", condition: "Postural Kyphosis", zone: "Active Exercise Zone" },
    { time: "07:30 PM - 08:15 PM", patient: "Naveen M. (Manyata IT)", condition: "Chronic Lower Back Pain", zone: "Electrotherapy Bay" },
    { time: "08:20 PM - 08:50 PM", patient: "Mahesh K. (Walk-in Consult)", condition: "New Patient Diagnostic Intake", zone: "Consultation Bay" }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <LayoutGrid className="w-4 h-4" />
              <span>Spatial Architecture & Capacity Planning</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              600 sq ft Clinic Blueprint & 15-Patient Flow
            </h2>
            <p className="text-stone-300 text-sm max-w-3xl mt-1 leading-relaxed">
              Carefully zoned for maximum clinical efficiency, elder accessibility, and privacy. 
              The layout comfortably accommodates 1 BPT/MPT physiotherapist and 1 assistant/receptionist 
              running up to 15–18 sessions a day without crowding.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-stone-800/90 p-3 rounded-xl border border-stone-700">
            <Maximize2 className="w-8 h-8 text-teal-400 shrink-0" />
            <div>
              <div className="text-xs text-stone-400">Total Built-Up Area</div>
              <div className="text-lg font-bold text-white">{totalSqFt} sq ft</div>
              <div className="text-[11px] text-teal-300">Rent Target: ₹35,000/mo</div>
            </div>
          </div>
        </div>

        {/* Station Allocation Summary */}
        <div className="mt-6 pt-4 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {FLOOR_STATIONS.map((station) => {
            const isSelected = selectedStation.id === station.id;
            return (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-950/80 border-teal-500 text-teal-200 shadow-xs'
                    : 'bg-stone-800/60 border-stone-700 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <div className="font-bold text-xs truncate">{station.name}</div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  {station.sqFt} sq ft ({Math.round((station.sqFt / totalSqFt) * 100)}%)
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Blueprint Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Floor Visualizer Layout (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Architectural Station Map (600 sq ft)
              </h3>
              <p className="text-xs text-stone-500">Click any zone to inspect equipment & clinical protocols</p>
            </div>
            <span className="text-xs text-stone-500 font-medium">Ground Floor or Lift Access Essential</span>
          </div>

          {/* Graphical Floor Plan Representation */}
          <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 bg-stone-50 space-y-3">
            {/* Entrance & Front Area */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Reception & Waiting (110 sq ft) */}
              <div
                onClick={() => setSelectedStation(FLOOR_STATIONS[0])}
                className={`sm:col-span-7 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedStation.id === 'station-reception'
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                    : 'border-amber-200 bg-amber-50/30 hover:border-amber-400'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-amber-900 flex items-center">
                    <Armchair className="w-3.5 h-3.5 mr-1" />
                    Reception & Waiting Lounge
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                    110 sq ft
                  </span>
                </div>
                <p className="text-[11px] text-amber-800/80">
                  Front entrance, booking desk, 4 elder-friendly padded chairs, water dispenser.
                </p>
              </div>

              {/* Consultation Bay (90 sq ft) */}
              <div
                onClick={() => setSelectedStation(FLOOR_STATIONS[1])}
                className={`sm:col-span-5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedStation.id === 'station-consult'
                    ? 'border-sky-500 bg-sky-50/70 shadow-xs'
                    : 'border-sky-200 bg-sky-50/30 hover:border-sky-400'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-sky-900 flex items-center">
                    <Stethoscope className="w-3.5 h-3.5 mr-1" />
                    Consultation Bay
                  </span>
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded">
                    90 sq ft
                  </span>
                </div>
                <p className="text-[11px] text-sky-800/80">
                  Private diagnostic intake, posture grid, confidential case history.
                </p>
              </div>
            </div>

            {/* Central Treatment & Therapy Area */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Electrotherapy & Manual 2-Bed Bay (220 sq ft) */}
              <div
                onClick={() => setSelectedStation(FLOOR_STATIONS[2])}
                className={`sm:col-span-7 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedStation.id === 'station-electro'
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                    : 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-400'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-emerald-900 flex items-center">
                    <Activity className="w-3.5 h-3.5 mr-1" />
                    2-Bed Electrotherapy & Manual Bay
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                    220 sq ft
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800/80">
                  Curtained privacy partitions, 2 treatment tables, Ultrasound, TENS/IFT, Lumbar traction.
                </p>
              </div>

              {/* Active Kinesiology & Exercise Rehab (130 sq ft) */}
              <div
                onClick={() => setSelectedStation(FLOOR_STATIONS[3])}
                className={`sm:col-span-5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedStation.id === 'station-exercise'
                    ? 'border-teal-500 bg-teal-50/70 shadow-xs'
                    : 'border-teal-200 bg-teal-50/30 hover:border-teal-400'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-teal-900 flex items-center">
                    <Dumbbell className="w-3.5 h-3.5 mr-1" />
                    Exercise & Gait Zone
                  </span>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">
                    130 sq ft
                  </span>
                </div>
                <p className="text-[11px] text-teal-800/80">
                  Parallel walking bars, balance wobble boards, bands, wall mirrors, gym matting.
                </p>
              </div>
            </div>

            {/* Rear Accessible Amenity Area */}
            <div
              onClick={() => setSelectedStation(FLOOR_STATIONS[4])}
              className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                selectedStation.id === 'station-amenity'
                  ? 'border-slate-500 bg-slate-100 shadow-xs'
                  : 'border-slate-300 bg-slate-50 hover:border-slate-400'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-slate-800 flex items-center">
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  Elder-Accessible Washroom, Grab Bars & Biomedical Waste Utility
                </span>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                  50 sq ft
                </span>
              </div>
            </div>
          </div>

          {/* Selected Station Deep Dive Details */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-stone-900 text-sm">{selectedStation.name}</h4>
              <span className="text-teal-700 font-bold">{selectedStation.sqFt} sq ft • Concurrent Capacity: {selectedStation.capacityConcurrent} pts</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              <strong>Clinical Purpose:</strong> {selectedStation.purpose}
            </p>
            <div>
              <span className="font-semibold text-stone-800 block mb-1">Equipment & Furniture Spec:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedStation.equipment.map((item, idx) => (
                  <span key={idx} className="bg-white border border-stone-200 px-2.5 py-1 rounded text-[11px] text-stone-700 font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Daily 15-Patient Schedule Flow (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-teal-600" />
                15 Patients / Day Slot Flow
              </h3>
              <p className="text-xs text-stone-500">Steady-state daytime utilization (08:30 AM to 08:30 PM)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              100% On Target
            </span>
          </div>

          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1 text-xs">
            {scheduleSlots.map((slot, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-xs transition-all ${
                  slot.isBreak
                    ? 'bg-amber-50 border-amber-200 text-amber-900 text-center font-bold'
                    : 'bg-white border-stone-200/80 hover:border-teal-300'
                }`}
              >
                {!slot.isBreak ? (
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-stone-900">{slot.patient}</div>
                      <div className="text-[10px] text-stone-500">{slot.condition}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-teal-700 text-[11px]">{slot.time}</div>
                      <span className="inline-block text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded mt-0.5">
                        {slot.zone}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>{slot.patient}</div>
                )}
              </div>
            ))}
          </div>

          <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
            <strong>Operational rule:</strong> Receptionist manages booking intervals and appointment reminder calls; 
            lead therapist focuses solely on clinical hands-on treatment.
          </div>
        </div>
      </div>
    </div>
  );
};
