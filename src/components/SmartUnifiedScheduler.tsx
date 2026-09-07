import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Car,
  Building2,
  Home,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  Award,
  Sparkles,
  Info,
  X,
  Navigation,
  Check,
  Search,
  IndianRupee,
  Layers,
  Zap,
  SlidersHorizontal,
  RefreshCw,
  Phone,
  ArrowRight
} from 'lucide-react';
import {
  ScheduleAppointment,
  TherapistProfile,
  TreatmentType,
  ServiceLocation,
  ScheduleItemType
} from '../types';
import {
  DEFAULT_THERAPISTS,
  NEIGHBORHOOD_TRANSIT_ESTIMATES,
  CLINIC_STATIONS,
  INITIAL_SCHEDULE_APPOINTMENTS
} from '../data/scheduleDefaults';
import { DEFAULT_PATIENTS } from '../data/patientDefaults';

// Helper: Convert "HH:mm" to total minutes from midnight
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Helper: Convert minutes from midnight to "HH:mm"
function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// Helper: Format "HH:mm" to "8:30 AM" or "4:30 PM"
function format12Hour(time: string): string {
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${mStr} ${ampm}`;
}

// Format INR Currency
function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

// Grid layout parameters: 08:00 (480 mins) to 20:00 (1200 mins) = 12 hours
const START_HOUR = 8;
const END_HOUR = 20;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const HOUR_HEIGHT_PX = 96; // 96px per hour (1.6px per minute)

export const SmartUnifiedScheduler: React.FC = () => {
  // Persistence state initialized from localStorage
  const [appointments, setAppointments] = useState<ScheduleAppointment[]>(() => {
    try {
      const saved = localStorage.getItem('sahakar_scheduler_appointments_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load scheduler appointments:', e);
    }
    return INITIAL_SCHEDULE_APPOINTMENTS;
  });

  // Save changes to localStorage
  const persistAppointments = (newItems: ScheduleAppointment[]) => {
    setAppointments(newItems);
    try {
      localStorage.setItem('sahakar_scheduler_appointments_v1', JSON.stringify(newItems));
    } catch (e) {
      console.error('Failed to save scheduler appointments:', e);
    }
  };

  // View state
  const [currentDate, setCurrentDate] = useState<string>('2026-09-07');
  const [viewMode, setViewMode] = useState<'day_grid' | 'week_grid'>('day_grid');
  const [filterType, setFilterType] = useState<'all' | 'clinic' | 'home' | 'travel'>('all');
  const [filterTherapist, setFilterTherapist] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ScheduleAppointment | null>(null);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingMode, setBookingMode] = useState<'clinic' | 'home'>('clinic');
  const [newBooking, setNewBooking] = useState({
    patientName: '',
    selectedPatientId: '',
    age: 55,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    treatmentType: 'Chronic' as TreatmentType,
    therapistId: 'therapist-aditi',
    date: '2026-09-07',
    startTime: '10:00',
    durationMinutes: 60,
    area: 'Judicial Layout',
    diagnosis: '',
    station: 'Station 1: Electrotherapy & Traction Bay',
    fee: 1000,
    phone: '',
    preTransitMins: 20,
    postTransitMins: 20,
  });

  // Conflict state banner
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Filtered Appointments for the selected day
  const dayAppointments = useMemo(() => {
    return appointments.filter((app) => app.date === currentDate);
  }, [appointments, currentDate]);

  // Secondary filtering by Type & Therapist
  const visibleAppointments = useMemo(() => {
    return dayAppointments.filter((app) => {
      // Type Filter
      if (filterType === 'clinic' && app.type !== 'clinic_appointment') return false;
      if (filterType === 'home' && app.type !== 'home_visit') return false;
      if (filterType === 'travel' && app.type !== 'travel_block') return false;

      // Therapist Filter
      if (filterTherapist !== 'all' && app.therapistId !== filterTherapist) return false;

      return true;
    });
  }, [dayAppointments, filterType, filterTherapist]);

  // Calculate Metrics for Current Day
  const metrics = useMemo(() => {
    const clinicApps = dayAppointments.filter((a) => a.type === 'clinic_appointment');
    const homeVisits = dayAppointments.filter((a) => a.type === 'home_visit');
    const travelBlocks = dayAppointments.filter((a) => a.type === 'travel_block');

    const totalClinicRevenue = clinicApps.reduce((sum, a) => sum + (a.fee || 1000), 0);
    const totalHomeRevenue = homeVisits.reduce((sum, a) => sum + (a.fee || 1500), 0);
    const totalDayRevenue = totalClinicRevenue + totalHomeRevenue;

    const totalTransitMinutes = travelBlocks.reduce((sum, a) => sum + a.durationMinutes, 0);
    const totalClinicalHours = (
      (clinicApps.reduce((s, a) => s + a.durationMinutes, 0) +
        homeVisits.reduce((s, a) => s + a.durationMinutes, 0)) /
      60
    ).toFixed(1);

    // Buffer safety detection
    const tightBuffers = travelBlocks.filter((t) => t.travelBlock?.bufferHealth === 'Tight');

    return {
      clinicCount: clinicApps.length,
      homeCount: homeVisits.length,
      travelCount: travelBlocks.length,
      totalDayRevenue,
      totalTransitMinutes,
      totalClinicalHours,
      tightBuffersCount: tightBuffers.length,
      bufferScore: tightBuffers.length === 0 ? '100% On-Time Predictability' : 'Caution: Tight Buffers',
    };
  }, [dayAppointments]);

  // Date Navigation Handlers
  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setCurrentDate('2026-09-07');
  };

  // Format Display Date (e.g. "Monday, September 7, 2026")
  const formattedDateTitle = useMemo(() => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [currentDate]);

  // Hours array for Grid: 08:00 to 20:00
  const gridHours = useMemo(() => {
    const hours = [];
    for (let h = START_HOUR; h <= END_HOUR; h++) {
      hours.push(h);
    }
    return hours;
  }, []);

  // Handler: Select a patient from default list to auto-fill form
  const handleSelectPreFillPatient = (patientId: string) => {
    const p = DEFAULT_PATIENTS.find((item) => item.id === patientId);
    if (!p) return;
    const isHome = p.careType === 'home_care';
    const transitEstimate = NEIGHBORHOOD_TRANSIT_ESTIMATES[p.area] || { mins: 20 };

    setBookingMode(isHome ? 'home' : 'clinic');
    setNewBooking((prev) => ({
      ...prev,
      selectedPatientId: p.id,
      patientName: p.fullName,
      age: p.age,
      gender: p.gender,
      treatmentType: (p.treatmentType as TreatmentType) || 'Chronic',
      diagnosis: p.diagnosis,
      area: p.area,
      phone: p.phone,
      therapistId: isHome ? 'therapist-vikram' : 'therapist-aditi',
      fee: isHome ? 1500 : 1000,
      preTransitMins: transitEstimate.mins,
      postTransitMins: transitEstimate.mins,
      station: isHome ? 'Concierge Home Residence' : 'Station 1: Electrotherapy & Traction Bay',
    }));
  };

  // Handler: Add Appointment (and optionally auto-generate travel blocks for Home Visits)
  const handleCreateBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.patientName || !newBooking.startTime) return;

    const startMins = timeToMinutes(newBooking.startTime);
    const endMins = startMins + newBooking.durationMinutes;
    const endTime = minutesToTime(endMins);

    const therapistObj = DEFAULT_THERAPISTS.find((t) => t.id === newBooking.therapistId);
    const therapistName = therapistObj ? therapistObj.name : 'Dr. Aditi Rao, MPT';

    const newItems: ScheduleAppointment[] = [];
    const timestamp = Date.now().toString().slice(-4);

    if (bookingMode === 'home') {
      // 1. Pre-Visit Travel Block
      const preTransitDuration = newBooking.preTransitMins || 20;
      const preStartMins = Math.max(timeToMinutes('08:00'), startMins - preTransitDuration);
      const preStartTime = minutesToTime(preStartMins);
      const preEndTime = newBooking.startTime;

      const preTravelBlock: ScheduleAppointment = {
        id: `trv-pre-${timestamp}`,
        type: 'travel_block',
        patientName: `Transit to ${newBooking.area}`,
        serviceLocation: 'Home',
        treatmentType: newBooking.treatmentType,
        therapistId: newBooking.therapistId,
        therapistName: therapistName,
        date: newBooking.date,
        startTime: preStartTime,
        endTime: preEndTime,
        durationMinutes: preTransitDuration,
        area: newBooking.area,
        diagnosis: `En-route travel buffer to ${newBooking.patientName}'s residence`,
        status: 'Confirmed',
        fee: 0,
        paymentStatus: 'Paid',
        travelBlock: {
          departureLocation: 'Sahakarnagar Clinic Base',
          destinationLocation: `${newBooking.area} (Residence)`,
          transitMinutes: preTransitDuration,
          trafficLevel: preTransitDuration >= 30 ? 'Heavy' : 'Moderate',
          bufferStartTime: preStartTime,
          bufferEndTime: preEndTime,
          routeAdvice: `Via Sahakarnagar arterial route to ${newBooking.area}`,
          equipmentKit: 'Portable electrotherapy kit, assessment chart, safety gait belt',
          bufferHealth: preTransitDuration >= 20 ? 'Safe' : 'Tight',
        },
      };

      // 2. The Actual Home Visit
      const homeVisitApp: ScheduleAppointment = {
        id: `app-home-${timestamp}`,
        type: 'home_visit',
        patientId: newBooking.selectedPatientId || `pt-custom-${timestamp}`,
        patientName: newBooking.patientName,
        patientAge: newBooking.age,
        patientGender: newBooking.gender,
        serviceLocation: 'Home',
        treatmentType: newBooking.treatmentType,
        therapistId: newBooking.therapistId,
        therapistName: therapistName,
        date: newBooking.date,
        startTime: newBooking.startTime,
        endTime: endTime,
        durationMinutes: newBooking.durationMinutes,
        station: 'Concierge Home Residence',
        area: newBooking.area,
        address: `${newBooking.area}, Sahakarnagar Perimeter`,
        diagnosis: newBooking.diagnosis || 'Geriatric Functional Mobility & Fall Risk Rehabilitation',
        sessionNumber: 1,
        packageTotalSessions: 15,
        status: 'Confirmed',
        fee: newBooking.fee || 1500,
        paymentStatus: 'Paid',
        equipmentRequired: ['Portable TENS/IFT', 'Gait Belt', 'Therabands', 'Blood Pressure Cuff'],
        clinicalNotes: 'Initial home visit evaluation. Environmental safety check and mobility assessment.',
        contactPhone: newBooking.phone || '+91 98450 00000',
      };

      // 3. Post-Visit Return Travel Block
      const postTransitDuration = newBooking.postTransitMins || 20;
      const postEndMins = endMins + postTransitDuration;
      const postEndTime = minutesToTime(postEndMins);

      const postTravelBlock: ScheduleAppointment = {
        id: `trv-post-${timestamp}`,
        type: 'travel_block',
        patientName: 'Return Transit to Clinic Base',
        serviceLocation: 'Clinic',
        treatmentType: newBooking.treatmentType,
        therapistId: newBooking.therapistId,
        therapistName: therapistName,
        date: newBooking.date,
        startTime: endTime,
        endTime: postEndTime,
        durationMinutes: postTransitDuration,
        area: 'Sahakarnagar Clinic',
        diagnosis: 'Return transit for equipment recharging and clinical chart updates',
        status: 'Confirmed',
        fee: 0,
        paymentStatus: 'Paid',
        travelBlock: {
          departureLocation: `${newBooking.area}`,
          destinationLocation: 'Sahakarnagar Clinic Base',
          transitMinutes: postTransitDuration,
          trafficLevel: postTransitDuration >= 30 ? 'Heavy' : 'Moderate',
          bufferStartTime: endTime,
          bufferEndTime: postEndTime,
          isReturnToClinic: true,
          routeAdvice: 'Return via main corridor before peak school / tech commute rush',
          equipmentKit: 'Return portable kit for overnight sanitization and charging',
          bufferHealth: postTransitDuration >= 20 ? 'Safe' : 'Tight',
        },
      };

      newItems.push(preTravelBlock, homeVisitApp, postTravelBlock);
    } else {
      // Regular Clinic Appointment
      const clinicApp: ScheduleAppointment = {
        id: `app-clinic-${timestamp}`,
        type: 'clinic_appointment',
        patientId: newBooking.selectedPatientId || `pt-custom-${timestamp}`,
        patientName: newBooking.patientName,
        patientAge: newBooking.age,
        patientGender: newBooking.gender,
        serviceLocation: 'Clinic',
        treatmentType: newBooking.treatmentType,
        therapistId: newBooking.therapistId,
        therapistName: therapistName,
        date: newBooking.date,
        startTime: newBooking.startTime,
        endTime: endTime,
        durationMinutes: newBooking.durationMinutes,
        station: newBooking.station,
        area: newBooking.area || 'Sahakarnagar Clinic Base',
        address: 'Sahakarnagar Central, Bangalore',
        diagnosis: newBooking.diagnosis || 'Orthopedic & Musculoskeletal Rehabilitation',
        sessionNumber: 1,
        packageTotalSessions: 15,
        status: 'Confirmed',
        fee: newBooking.fee || 1000,
        paymentStatus: 'Paid',
        equipmentRequired: ['IFT & Ultrasound Unit', 'Manual mobilization table', 'Resistance bands'],
        clinicalNotes: 'Clinic session booked. Assessment and protocol initiated.',
        contactPhone: newBooking.phone || '+91 98450 00000',
      };

      newItems.push(clinicApp);
    }

    persistAppointments([...appointments, ...newItems]);
    setIsBookingModalOpen(false);

    // Reset form
    setNewBooking({
      patientName: '',
      selectedPatientId: '',
      age: 55,
      gender: 'Male',
      treatmentType: 'Chronic',
      therapistId: 'therapist-aditi',
      date: currentDate,
      startTime: '10:00',
      durationMinutes: 60,
      area: 'Judicial Layout',
      diagnosis: '',
      station: 'Station 1: Electrotherapy & Traction Bay',
      fee: 1000,
      phone: '',
      preTransitMins: 20,
      postTransitMins: 20,
    });
  };

  // Handler: Delete an appointment or travel block
  const handleDeleteItem = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    persistAppointments(updated);
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  // Handler: Adjust Travel Buffer (+10 mins)
  const handleExtendBuffer = (item: ScheduleAppointment) => {
    if (!item.travelBlock) return;
    const currentMins = item.durationMinutes;
    const newDuration = currentMins + 10;
    const startMins = timeToMinutes(item.startTime);
    const newEndMins = startMins + newDuration;
    const newEndTime = minutesToTime(newEndMins);

    const updated = appointments.map((a) => {
      if (a.id === item.id && a.travelBlock) {
        return {
          ...a,
          durationMinutes: newDuration,
          endTime: newEndTime,
          travelBlock: {
            ...a.travelBlock,
            transitMinutes: newDuration,
            bufferEndTime: newEndTime,
            bufferHealth: 'Safe' as const,
          },
        };
      }
      return a;
    });

    persistAppointments(updated);
    if (selectedItem?.id === item.id) {
      const updatedSelf = updated.find((a) => a.id === item.id);
      if (updatedSelf) setSelectedItem(updatedSelf);
    }
  };

  // Reset to default schedule data
  const handleResetSchedule = () => {
    if (window.confirm('Reset scheduler to default Sahakarnagar clinical timetable?')) {
      persistAppointments(INITIAL_SCHEDULE_APPOINTMENTS);
      setCurrentDate('2026-09-07');
    }
  };

  // Renderer for Appointment or Travel Block Cards
  const renderAppointmentCard = (app: ScheduleAppointment) => {
    const startMin = timeToMinutes(app.startTime);
    const topPx = ((startMin - START_HOUR * 60) * HOUR_HEIGHT_PX) / 60;
    const heightPx = Math.max(34, (app.durationMinutes * HOUR_HEIGHT_PX) / 60);

    // 1. TRAVEL BLOCK CARD (Color-Coded)
    if (app.type === 'travel_block') {
      const isHeavy = app.travelBlock?.trafficLevel === 'Heavy';
      const isTight = app.travelBlock?.bufferHealth === 'Tight';

      return (
        <div
          key={app.id}
          onClick={() => setSelectedItem(app)}
          style={{
            top: `${topPx}px`,
            height: `${heightPx}px`,
            zIndex: 10,
          }}
          className={`absolute left-1.5 right-1.5 rounded-xl border p-2.5 flex flex-col justify-between shadow-xs transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] overflow-hidden ${
            isTight
              ? 'bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-400/40'
              : isHeavy
              ? 'bg-orange-50/95 border-orange-300 text-orange-950'
              : 'bg-amber-50/95 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-start justify-between gap-1 relative z-10">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
                  isTight
                    ? 'bg-rose-600 text-white'
                    : isHeavy
                    ? 'bg-orange-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                <Car className="w-3 h-3" />
              </div>
              <div className="truncate">
                <span className="text-[10px] font-bold uppercase tracking-wide block truncate">
                  {app.travelBlock?.isReturnToClinic ? 'Return to Clinic Base' : 'Transit Buffer'}
                </span>
                <h4 className="font-extrabold text-xs leading-tight truncate">
                  {app.patientName}
                </h4>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] font-black bg-white/80 px-1.5 py-0.2 rounded border border-amber-300/50">
                {app.durationMinutes}m Buffer
              </span>
            </div>
          </div>

          {heightPx >= 50 && (
            <div className="flex items-center justify-between text-[10px] pt-1 text-stone-600 font-medium border-t border-amber-200/50 relative z-10">
              <span className="flex items-center truncate">
                <Clock className="w-3 h-3 mr-1 text-amber-700" />
                {format12Hour(app.startTime)} – {format12Hour(app.endTime)}
              </span>
              <span className="font-semibold text-amber-800 truncate">
                {app.travelBlock?.trafficLevel} Traffic
              </span>
            </div>
          )}
        </div>
      );
    }

    // 2. HOME VISIT CARD (Emerald / Green)
    if (app.type === 'home_visit') {
      return (
        <div
          key={app.id}
          onClick={() => setSelectedItem(app)}
          style={{
            top: `${topPx}px`,
            height: `${heightPx}px`,
            zIndex: 12,
          }}
          className="absolute left-1.5 right-1.5 rounded-xl border border-emerald-300 bg-emerald-50/95 text-emerald-950 p-2.5 flex flex-col justify-between shadow-xs transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] hover:border-emerald-500 overflow-hidden"
        >
          <div>
            <div className="flex items-start justify-between gap-1">
              <div className="flex items-center space-x-1.5 min-w-0">
                <span className="w-5 h-5 rounded bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <Home className="w-3 h-3" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-800 bg-emerald-100/80 px-1.5 py-0.2 rounded border border-emerald-200">
                  Home Elder Care
                </span>
                <span className="text-[10px] font-semibold text-emerald-700">
                  #{app.sessionNumber || 1} of {app.packageTotalSessions || 15}
                </span>
              </div>

              <span className="text-[11px] font-extrabold text-emerald-900 bg-white/90 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                ₹{app.fee}
              </span>
            </div>

            <h4 className="font-extrabold text-xs text-stone-900 mt-1 truncate">
              {app.patientName} {app.patientAge ? `(${app.patientAge}y)` : ''}
            </h4>

            <div className="text-[11px] text-emerald-900 font-medium truncate flex items-center mt-0.5">
              <MapPin className="w-3 h-3 mr-0.5 text-emerald-600 shrink-0" />
              <span className="truncate">{app.area}</span>
            </div>
          </div>

          {heightPx >= 65 && (
            <div className="flex items-center justify-between text-[10px] pt-1 text-stone-600 font-medium border-t border-emerald-200">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1 text-emerald-700" />
                {format12Hour(app.startTime)} – {format12Hour(app.endTime)}
              </span>
              <span className="font-semibold text-stone-800 truncate max-w-[140px]">
                {app.treatmentType}
              </span>
            </div>
          )}
        </div>
      );
    }

    // 3. CLINIC APPOINTMENT CARD (Teal / Cyan)
    return (
      <div
        key={app.id}
        onClick={() => setSelectedItem(app)}
        style={{
          top: `${topPx}px`,
          height: `${heightPx}px`,
          zIndex: 12,
        }}
        className="absolute left-1.5 right-1.5 rounded-xl border border-teal-300 bg-teal-50/95 text-teal-950 p-2.5 flex flex-col justify-between shadow-xs transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] hover:border-teal-500 overflow-hidden"
      >
        <div>
          <div className="flex items-start justify-between gap-1">
            <div className="flex items-center space-x-1.5 min-w-0">
              <span className="w-5 h-5 rounded bg-teal-700 text-white flex items-center justify-center shrink-0">
                <Building2 className="w-3 h-3" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-teal-800 bg-teal-100/80 px-1.5 py-0.2 rounded border border-teal-200">
                In-Clinic
              </span>
              <span className="text-[10px] font-semibold text-teal-700">
                #{app.sessionNumber || 1} of {app.packageTotalSessions || 15}
              </span>
            </div>

            <span className="text-[11px] font-extrabold text-teal-900 bg-white/90 px-1.5 py-0.2 rounded border border-teal-200 shrink-0">
              ₹{app.fee}
            </span>
          </div>

          <h4 className="font-extrabold text-xs text-stone-900 mt-1 truncate">
            {app.patientName} {app.patientAge ? `(${app.patientAge}y)` : ''}
          </h4>

          <div className="text-[11px] text-stone-600 font-medium truncate mt-0.5">
            {app.station || 'Station 1: Electrotherapy Bay'}
          </div>
        </div>

        {heightPx >= 65 && (
          <div className="flex items-center justify-between text-[10px] pt-1 text-stone-600 font-medium border-t border-teal-200">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1 text-teal-700" />
              {format12Hour(app.startTime)} – {format12Hour(app.endTime)}
            </span>
            <span className="font-semibold text-teal-900 px-1.5 py-0.2 bg-white rounded border border-teal-200">
              {app.treatmentType}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Title Deck */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-teal-600" />
              Smart Unified Scheduler
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Clinic + Mobile Transit Grid
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
            Integrated Clinical & Elder-Care Travel Planner
          </h2>
          <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
            Synchronizes 600 sq ft Sahakarnagar in-clinic appointments with color-coded concierge home-visit transit blocks across Judicial Layout, Tata Nagar, and Amruthahalli. Eliminates double-booking and cushions Bangalore North traffic buffers.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setBookingMode('clinic');
              setNewBooking((prev) => ({
                ...prev,
                therapistId: 'therapist-aditi',
                station: 'Station 1: Electrotherapy & Traction Bay',
                fee: 1000,
                date: currentDate,
              }));
              setIsBookingModalOpen(true);
            }}
            className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center shadow-xs transition-colors cursor-pointer"
          >
            <Building2 className="w-4 h-4 mr-1.5" />
            + Book Clinic Slot
          </button>

          <button
            onClick={() => {
              setBookingMode('home');
              setNewBooking((prev) => ({
                ...prev,
                therapistId: 'therapist-vikram',
                station: 'Concierge Home Residence',
                fee: 1500,
                date: currentDate,
              }));
              setIsBookingModalOpen(true);
            }}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center shadow-xs transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 mr-1.5" />
            + Schedule Home Visit & Buffer
          </button>

          <button
            onClick={handleResetSchedule}
            className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors"
            title="Reset to default schedule demo"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Metric 1: Clinic Sessions */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              In-Clinic Sessions
            </span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-extrabold text-stone-900">
            {metrics.clinicCount} <span className="text-xs font-semibold text-stone-500">appointments</span>
          </div>
          <div className="text-[11px] text-teal-700 font-semibold">
            {metrics.clinicCount * 60} mins clinical bed time
          </div>
        </div>

        {/* Metric 2: Home Visits */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Concierge Home Visits
            </span>
            <Home className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-800">
            {metrics.homeCount} <span className="text-xs font-semibold text-emerald-600">elder visits</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            Sahakarnagar & Judicial Layout
          </div>
        </div>

        {/* Metric 3: Travel Blocks */}
        <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs space-y-1 bg-amber-50/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
              Transit Buffers
            </span>
            <Car className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-950">
            {metrics.totalTransitMinutes} <span className="text-xs font-semibold text-amber-700">mins transit</span>
          </div>
          <div className="text-[11px] text-amber-800 font-semibold">
            {metrics.travelCount} protected road blocks
          </div>
        </div>

        {/* Metric 4: Buffer Health */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Transit Safety Score
            </span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-sm font-extrabold text-teal-900 mt-1 flex items-center">
            <CheckCircle2 className="w-4 h-4 text-teal-600 mr-1 shrink-0" />
            100% Safe Margins
          </div>
          <div className="text-[11px] text-stone-500">
            All buffers ≥ 20 mins threshold
          </div>
        </div>

        {/* Metric 5: Revenue Projection for the Day */}
        <div className="bg-white p-3.5 rounded-xl border border-teal-200 shadow-xs space-y-1 bg-teal-50/40">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-teal-900 uppercase tracking-wider">
              Today's Revenue
            </span>
            <IndianRupee className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-xl font-extrabold text-teal-950">
            {formatINR(metrics.totalDayRevenue)}
          </div>
          <div className="text-[11px] text-teal-700 font-semibold">
            Clinic ₹{metrics.clinicCount * 1000} + Home ₹{metrics.homeCount * 1500}
          </div>
        </div>
      </div>

      {/* Date Navigator, View Switchers, & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Date Picker & Prev/Next */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200">
              <button
                onClick={handlePrevDay}
                className="p-1.5 hover:bg-white text-stone-600 rounded-md transition-colors cursor-pointer"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleToday}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  currentDate === '2026-09-07' ? 'bg-white text-teal-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Today (Demo)
              </button>
              <button
                onClick={handleNextDay}
                className="p-1.5 hover:bg-white text-stone-600 rounded-md transition-colors cursor-pointer"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
              <Calendar className="w-4 h-4 text-teal-700" />
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="text-xs font-bold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
              />
            </div>

            <div className="text-sm font-bold text-stone-800 hidden sm:block">
              {formattedDateTitle}
            </div>
          </div>

          {/* View Mode Toggle: Day Grid vs Week Grid */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-stone-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setViewMode('day_grid')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center cursor-pointer ${
                  viewMode === 'day_grid'
                    ? 'bg-white text-teal-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 mr-1.5 text-teal-700" />
                Day Multi-Resource Grid
              </button>
              <button
                onClick={() => setViewMode('week_grid')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center cursor-pointer ${
                  viewMode === 'week_grid'
                    ? 'bg-white text-teal-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-teal-700" />
                Weekly Overview
              </button>
            </div>
          </div>
        </div>

        {/* Filter Row: Type & Therapist Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center space-x-1 text-stone-500 mr-1">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-semibold text-stone-700 text-[11px]">Display Mode:</span>
            </div>

            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Items ({dayAppointments.length})
            </button>

            <button
              onClick={() => setFilterType('clinic')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center cursor-pointer ${
                filterType === 'clinic'
                  ? 'bg-teal-100 text-teal-900 border border-teal-300 shadow-xs font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-teal-50 hover:text-teal-800'
              }`}
            >
              <Building2 className="w-3 h-3 mr-1 text-teal-600" />
              Clinic Appointments ({metrics.clinicCount})
            </button>

            <button
              onClick={() => setFilterType('home')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center cursor-pointer ${
                filterType === 'home'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <Home className="w-3 h-3 mr-1 text-emerald-600" />
              Home Visits ({metrics.homeCount})
            </button>

            <button
              onClick={() => setFilterType('travel')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center cursor-pointer ${
                filterType === 'travel'
                  ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-xs font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-800'
              }`}
            >
              <Car className="w-3 h-3 mr-1 text-amber-600" />
              Travel Blocks ({metrics.travelCount})
            </button>

            <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block"></div>

            {/* Therapist Filter */}
            <div className="flex items-center space-x-1">
              <span className="text-[11px] font-semibold text-stone-500">Therapist:</span>
              <select
                value={filterTherapist}
                onChange={(e) => setFilterTherapist(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-md px-2 py-0.5 text-xs text-stone-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">All Practitioners (Both Lanes)</option>
                <option value="therapist-aditi">Dr. Aditi Rao, MPT (In-Clinic Lead)</option>
                <option value="therapist-vikram">Dr. Vikram K., BPT (Mobile Elder-Care)</option>
              </select>
            </div>
          </div>

          {/* Color-Coding Guide Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-stone-600">
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded bg-teal-600 mr-1 inline-block"></span>
              Clinic Session
            </span>
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded bg-emerald-600 mr-1 inline-block"></span>
              Home Elder Care
            </span>
            <span className="flex items-center">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 mr-1 inline-block"></span>
              Travel Block (Buffer)
            </span>
          </div>
        </div>
      </div>

      {/* VIEW 1: DAY MULTI-RESOURCE GRID */}
      {viewMode === 'day_grid' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          {/* Therapist Lanes Column Headers */}
          <div className="grid grid-cols-[80px_1fr_1fr] border-b border-stone-200 bg-stone-50 sticky top-0 z-20">
            {/* Time gutter header */}
            <div className="p-3 border-r border-stone-200 text-center flex flex-col justify-center">
              <Clock className="w-4 h-4 mx-auto text-stone-400 mb-0.5" />
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Time</span>
            </div>

            {/* Lane 1: Dr. Aditi Rao */}
            <div className="p-3.5 border-r border-stone-200 bg-teal-50/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  AR
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-xs sm:text-sm flex items-center">
                    Dr. Aditi Rao, MPT
                    <span className="ml-2 px-1.5 py-0.2 bg-teal-100 text-teal-800 text-[10px] rounded font-bold">
                      Clinic Lead
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    600 sq ft Clinic Facility • 5 In-Center Sessions
                  </div>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Station Bays</span>
                <span className="text-xs font-bold text-teal-800 block">Bay 1, Bay 2 & Gym</span>
              </div>
            </div>

            {/* Lane 2: Dr. Vikram K. */}
            <div className="p-3.5 bg-emerald-50/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  VK
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-xs sm:text-sm flex items-center">
                    Dr. Vikram K., BPT
                    <span className="ml-2 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded font-bold">
                      Mobile & Evening
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Concierge Home Visits • Judicial & Tata Nagar + Evening Clinic
                  </div>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Transit Cushion</span>
                <span className="text-xs font-bold text-amber-700 block">5 Protected Buffers</span>
              </div>
            </div>
          </div>

          {/* Grid Body with Time Slots and Appointment Blocks */}
          <div className="relative grid grid-cols-[80px_1fr_1fr] select-none" style={{ height: `${TOTAL_HOURS * HOUR_HEIGHT_PX}px` }}>
            {/* Background Grid Lines for each hour */}
            <div className="absolute inset-0 grid grid-rows-12 pointer-events-none">
              {gridHours.slice(0, -1).map((h) => (
                <div key={h} className="border-b border-stone-100 flex flex-col justify-between">
                  <div className="h-1/2 border-b border-dashed border-stone-50"></div>
                </div>
              ))}
            </div>

            {/* Column 1: Time Gutter */}
            <div className="border-r border-stone-200 bg-stone-50/50 relative">
              {gridHours.map((h, idx) => (
                <div
                  key={h}
                  className="absolute right-0 pr-2 text-right -translate-y-2 text-[11px] font-semibold text-stone-400"
                  style={{ top: `${idx * HOUR_HEIGHT_PX}px` }}
                >
                  {h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`}
                </div>
              ))}
            </div>

            {/* Column 2: Dr. Aditi Rao's Appointments Lane */}
            <div className="border-r border-stone-200 relative p-1.5">
              {visibleAppointments
                .filter((app) => app.therapistId === 'therapist-aditi')
                .map((app) => renderAppointmentCard(app))}
            </div>

            {/* Column 3: Dr. Vikram K.'s Appointments & Color-Coded Travel Blocks Lane */}
            <div className="relative p-1.5">
              {visibleAppointments
                .filter((app) => app.therapistId === 'therapist-vikram')
                .map((app) => renderAppointmentCard(app))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: WEEKLY OVERVIEW GRID */}
      {viewMode === 'week_grid' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 flex items-center">
              <Calendar className="w-4 h-4 text-teal-700 mr-1.5" />
              6-Day Clinic & Mobile Capacity Matrix (Mon 7 Sep – Sat 12 Sep)
            </h3>
            <span className="text-xs text-stone-500">
              Recurring 10–25 Session Packages across Sahakarnagar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
            {['Monday (7 Sep)', 'Tuesday (8 Sep)', 'Wednesday (9 Sep)', 'Thursday (10 Sep)', 'Friday (11 Sep)', 'Saturday (12 Sep)'].map((dayName, idx) => {
              const isSelectedDay = idx === 0; // Monday 7 Sep is our focal demo day
              const dayTotalSessions = idx === 0 ? 8 : idx === 5 ? 6 : 7;
              const dayTransitMins = idx === 0 ? 150 : idx === 5 ? 90 : 120;

              return (
                <div
                  key={dayName}
                  className={`rounded-xl border p-3 flex flex-col justify-between space-y-3 transition-all ${
                    isSelectedDay
                      ? 'bg-teal-50/40 border-teal-300 ring-2 ring-teal-600/20'
                      : 'bg-stone-50/70 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-800">{dayName}</span>
                      {isSelectedDay && (
                        <span className="px-1.5 py-0.2 bg-teal-700 text-white rounded text-[10px] font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {dayTotalSessions} Clinical Sessions
                    </div>
                  </div>

                  {/* Day breakdown bars */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center bg-white p-1.5 rounded border border-stone-200/80">
                      <span className="text-stone-600 flex items-center">
                        <Building2 className="w-3 h-3 text-teal-600 mr-1" />
                        In-Clinic
                      </span>
                      <span className="font-bold text-stone-900">{idx === 0 ? 5 : 4}</span>
                    </div>

                    <div className="flex justify-between items-center bg-white p-1.5 rounded border border-stone-200/80">
                      <span className="text-stone-600 flex items-center">
                        <Home className="w-3 h-3 text-emerald-600 mr-1" />
                        Home Visits
                      </span>
                      <span className="font-bold text-emerald-700">{idx === 0 ? 3 : 2}</span>
                    </div>

                    <div className="flex justify-between items-center bg-amber-50 p-1.5 rounded border border-amber-200">
                      <span className="text-amber-900 flex items-center">
                        <Car className="w-3 h-3 text-amber-600 mr-1" />
                        Transit Buffer
                      </span>
                      <span className="font-bold text-amber-950">{dayTransitMins}m</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setViewMode('day_grid');
                      setCurrentDate('2026-09-07');
                    }}
                    className="w-full py-1 bg-stone-100 hover:bg-teal-700 hover:text-white rounded text-[11px] font-semibold text-stone-700 transition-colors text-center cursor-pointer"
                  >
                    View Day Timeline
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Smart Buffer Coordination Explainer Box */}
      <div className="bg-gradient-to-r from-stone-50 via-amber-50/30 to-teal-50/30 p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-stone-900 flex items-center">
              How the Smart Unified Scheduler protects your BPT/MPT staff from burnout
              <span className="ml-2 px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] font-bold rounded">
                Bangalore Traffic Cushion
              </span>
            </div>
            <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">
              In Bangalore, travelling from Sahakarnagar Central to Judicial Layout or Amruthahalli can fluctuate between 15 to 30 minutes due to the Kodigehalli railway gate and tech park commute traffic. The system automatically reserves color-coded <strong>Travel Blocks</strong> before and after each home visit so the therapist never arrives late or cancels an in-clinic patient.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setBookingMode('home');
            setIsBookingModalOpen(true);
          }}
          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer shrink-0"
        >
          Try Home Booking With Auto-Buffer
        </button>
      </div>

      {/* DETAIL MODAL / SLIDE-OUT DRAWER */}
      {selectedItem && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden space-y-4 p-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center ${
                      selectedItem.type === 'travel_block'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : selectedItem.type === 'home_visit'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-teal-100 text-teal-900 border border-teal-300'
                    }`}
                  >
                    {selectedItem.type === 'travel_block' ? (
                      <Car className="w-3 h-3 mr-1 text-amber-700" />
                    ) : selectedItem.type === 'home_visit' ? (
                      <Home className="w-3 h-3 mr-1 text-emerald-700" />
                    ) : (
                      <Building2 className="w-3 h-3 mr-1 text-teal-700" />
                    )}
                    {selectedItem.type === 'travel_block'
                      ? 'Transit Protection Buffer'
                      : selectedItem.type === 'home_visit'
                      ? 'Home Elder Care Session'
                      : 'In-Clinic Facility Appointment'}
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    {format12Hour(selectedItem.startTime)} – {format12Hour(selectedItem.endTime)}
                  </span>
                </div>
                <h3 className="font-extrabold text-stone-900 text-base">
                  {selectedItem.patientName}
                </h3>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content for Travel Block */}
            {selectedItem.type === 'travel_block' && selectedItem.travelBlock && (
              <div className="space-y-3 text-xs">
                <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-900 uppercase">Transit Corridor</span>
                    <span className="px-2 py-0.5 bg-white rounded border border-amber-300 text-[10px] font-bold text-amber-900">
                      {selectedItem.travelBlock.trafficLevel} Traffic Intensity
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-stone-800 font-bold">
                    <span>{selectedItem.travelBlock.departureLocation}</span>
                    <ArrowRight className="w-4 h-4 text-amber-600 mx-2 shrink-0" />
                    <span>{selectedItem.travelBlock.destinationLocation}</span>
                  </div>

                  <p className="text-[11px] text-amber-950 leading-relaxed font-medium">
                    Route Tip: {selectedItem.travelBlock.routeAdvice}
                  </p>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">
                    Vehicle Mobile Equipment Kit
                  </span>
                  <p className="text-xs text-stone-700 font-semibold">
                    {selectedItem.travelBlock.equipmentKit || 'Portable IFT/TENS, Cryo pack, safety gait belt'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => handleExtendBuffer(selectedItem)}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add +10 Mins Buffer (Rain / Traffic)
                  </button>

                  <button
                    onClick={() => handleDeleteItem(selectedItem.id)}
                    className="text-rose-600 hover:text-rose-800 text-xs font-semibold underline cursor-pointer"
                  >
                    Remove Buffer
                  </button>
                </div>
              </div>
            )}

            {/* Content for Clinic & Home Appointments */}
            {selectedItem.type !== 'travel_block' && (
              <div className="space-y-3 text-xs">
                {/* Clinical Diagnosis & Specialty */}
                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-400 uppercase">
                      Clinical Diagnosis & Protocol
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-stone-200 text-stone-800">
                      {selectedItem.treatmentType}
                    </span>
                  </div>
                  <p className="text-stone-900 font-bold text-xs">{selectedItem.diagnosis}</p>
                  <p className="text-stone-600 text-[11px] mt-1">
                    Progress: Session <strong>#{selectedItem.sessionNumber || 1}</strong> of{' '}
                    <strong>{selectedItem.packageTotalSessions || 15}</strong> package
                  </p>
                </div>

                {/* Location & Facility Station */}
                <div className="grid grid-cols-2 gap-2 text-stone-700">
                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 space-y-0.5">
                    <span className="text-[10px] text-stone-400 font-semibold block">Attending PT</span>
                    <span className="font-bold text-stone-800 text-xs truncate block">
                      {selectedItem.therapistName}
                    </span>
                  </div>

                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 space-y-0.5">
                    <span className="text-[10px] text-stone-400 font-semibold block">Facility Station</span>
                    <span className="font-bold text-stone-800 text-xs truncate block">
                      {selectedItem.station || 'Station 1: Electrotherapy'}
                    </span>
                  </div>
                </div>

                {/* Patient Contact & Address */}
                {selectedItem.address && (
                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 space-y-0.5">
                    <span className="text-[10px] text-stone-400 font-semibold block">Location / Address</span>
                    <span className="font-medium text-stone-800 text-xs flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-stone-500 shrink-0" />
                      {selectedItem.address}
                    </span>
                  </div>
                )}

                {/* Equipment Required */}
                {selectedItem.equipmentRequired && selectedItem.equipmentRequired.length > 0 && (
                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                    <span className="text-[10px] text-stone-400 font-semibold block uppercase">
                      Clinical Equipment Deployed
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.equipmentRequired.map((eq, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-white rounded border border-stone-200 text-[10px] font-semibold text-stone-700"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Billing & Action Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-semibold">Session Fee</span>
                    <span className="text-sm font-extrabold text-stone-900">
                      {formatINR(selectedItem.fee || 1000)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteItem(selectedItem.id)}
                      className="px-3 py-1.5 text-rose-700 hover:bg-rose-50 rounded-lg font-bold text-xs border border-rose-200 cursor-pointer"
                    >
                      Cancel Slot
                    </button>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-xs cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: BOOK NEW CLINIC OR HOME CARE SLOT */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">
                  {bookingMode === 'home'
                    ? 'Schedule Concierge Home Visit (+ Auto Transit Buffer)'
                    : 'Book In-Clinic Facility Appointment'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {bookingMode === 'home'
                    ? 'Automatically books travel buffer before and after the visit to cushion Bangalore traffic.'
                    : 'Reserves bed/gym capacity at the 600 sq ft Sahakarnagar clinic center.'}
                </p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Fill from Patient Roster */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Quick-Select Registered Patient (Optional)
              </label>
              <select
                onChange={(e) => handleSelectPreFillPatient(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs font-semibold text-stone-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">-- Choose patient to auto-fill record --</option>
                {DEFAULT_PATIENTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.careType === 'home_care' ? 'Home Care' : 'Clinic'} • {p.area})
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleCreateBookingSubmit} className="space-y-4 text-xs">
              {/* Patient Full Name & Age/Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-bold mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smt. Kamala Narayanan"
                    value={newBooking.patientName}
                    onChange={(e) => setNewBooking({ ...newBooking, patientName: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-semibold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Age & Gender</label>
                  <div className="flex space-x-1">
                    <input
                      type="number"
                      placeholder="Age"
                      value={newBooking.age}
                      onChange={(e) => setNewBooking({ ...newBooking, age: Number(e.target.value) })}
                      className="w-16 bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                    />
                    <select
                      value={newBooking.gender}
                      onChange={(e) => setNewBooking({ ...newBooking, gender: e.target.value as any })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-medium focus:bg-white cursor-pointer"
                    >
                      <option value="Female">F</option>
                      <option value="Male">M</option>
                      <option value="Other">O</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Treatment Type & Attending Therapist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Treatment Archetype</label>
                  <select
                    value={newBooking.treatmentType}
                    onChange={(e) => setNewBooking({ ...newBooking, treatmentType: e.target.value as TreatmentType })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-semibold focus:bg-white cursor-pointer"
                  >
                    <option value="Chronic">Chronic (Geriatric & Joint Osteoarthritis)</option>
                    <option value="Post-Surgery">Post-Surgery (TKR, THR, ORIF Rehab)</option>
                    <option value="Sports">Sports (Rotator Cuff, ACL, Ankle)</option>
                    <option value="IT/Posture">IT/Posture (Cervical, Lumbar, Tech Neck)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Attending Physiotherapist *</label>
                  <select
                    value={newBooking.therapistId}
                    onChange={(e) => setNewBooking({ ...newBooking, therapistId: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-semibold focus:bg-white cursor-pointer"
                  >
                    <option value="therapist-aditi">Dr. Aditi Rao, MPT (In-Clinic Specialist)</option>
                    <option value="therapist-vikram">Dr. Vikram K., BPT (Mobile Elder-Care Lead)</option>
                  </select>
                </div>
              </div>

              {/* Date, Time, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-semibold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newBooking.startTime}
                    onChange={(e) => setNewBooking({ ...newBooking, startTime: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-semibold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Duration</label>
                  <select
                    value={newBooking.durationMinutes}
                    onChange={(e) => setNewBooking({ ...newBooking, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-semibold focus:bg-white cursor-pointer"
                  >
                    <option value={45}>45 mins</option>
                    <option value={60}>60 mins (Standard)</option>
                    <option value={90}>90 mins (Intensive)</option>
                  </select>
                </div>
              </div>

              {/* Area & Facility Station or Travel Buffers */}
              {bookingMode === 'home' ? (
                <div className="space-y-3 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200">
                  <div className="flex items-center space-x-1.5 text-emerald-900 font-bold">
                    <Car className="w-4 h-4 text-emerald-700" />
                    <span>Home Visit Neighborhood & Travel Buffer Controls</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Neighborhood Area</label>
                      <select
                        value={newBooking.area}
                        onChange={(e) => {
                          const area = e.target.value;
                          const est = NEIGHBORHOOD_TRANSIT_ESTIMATES[area] || { mins: 20 };
                          setNewBooking({
                            ...newBooking,
                            area,
                            preTransitMins: est.mins,
                            postTransitMins: est.mins,
                          });
                        }}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900 font-semibold cursor-pointer"
                      >
                        {Object.keys(NEIGHBORHOOD_TRANSIT_ESTIMATES).map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Pre-Visit Travel Buffer</label>
                      <select
                        value={newBooking.preTransitMins}
                        onChange={(e) => setNewBooking({ ...newBooking, preTransitMins: Number(e.target.value) })}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900 font-semibold cursor-pointer"
                      >
                        <option value={15}>15 mins (Low traffic)</option>
                        <option value={20}>20 mins (Standard)</option>
                        <option value={25}>25 mins (Moderate)</option>
                        <option value={30}>30 mins (Heavy / Peak)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Post-Visit Return Buffer</label>
                      <select
                        value={newBooking.postTransitMins}
                        onChange={(e) => setNewBooking({ ...newBooking, postTransitMins: Number(e.target.value) })}
                        className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900 font-semibold cursor-pointer"
                      >
                        <option value={15}>15 mins (Quick)</option>
                        <option value={20}>20 mins (Standard)</option>
                        <option value={25}>25 mins (Moderate)</option>
                        <option value={30}>30 mins (Heavy / Peak)</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-800">
                    💡 The scheduler will inject 2 color-coded transit blocks alongside the visit, guarding the therapist from booking conflicts.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Clinic Station Bay</label>
                    <select
                      value={newBooking.station}
                      onChange={(e) => setNewBooking({ ...newBooking, station: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-semibold focus:bg-white cursor-pointer"
                    >
                      {CLINIC_STATIONS.filter((s) => s.id !== 'station-home').map((st) => (
                        <option key={st.id} value={st.name}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Patient Locality</label>
                    <input
                      type="text"
                      placeholder="e.g. Sahakarnagar D-Block / Manyata"
                      value={newBooking.area}
                      onChange={(e) => setNewBooking({ ...newBooking, area: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Diagnosis text */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">Primary Diagnosis & Condition</label>
                <input
                  type="text"
                  placeholder="e.g. Bilateral Knee Osteoarthritis or C5-C6 Disc Bulge..."
                  value={newBooking.diagnosis}
                  onChange={(e) => setNewBooking({ ...newBooking, diagnosis: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white rounded-xl font-bold transition-colors cursor-pointer flex items-center ${
                    bookingMode === 'home' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-teal-700 hover:bg-teal-800'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  {bookingMode === 'home' ? 'Confirm Visit & Buffers' : 'Confirm Clinic Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
