import React, { useState, useEffect } from 'react';
import { PatientRecord, ClinicalSessionNote, TreatmentType, ServiceLocation } from '../types';
import { DEFAULT_PATIENTS } from '../data/patientDefaults';
import { formatINR } from '../utils/finance';
import { 
  Users, 
  UserPlus, 
  Activity, 
  FileText, 
  Calendar, 
  MapPin, 
  Phone, 
  Stethoscope, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  Search, 
  Printer, 
  X, 
  Plus, 
  ChevronRight, 
  TrendingDown, 
  Home, 
  Building2, 
  RotateCcw,
  Sparkles,
  ClipboardList,
  Check,
  ShieldCheck,
  Award,
  ArrowUpDown,
  SlidersHorizontal,
  ArrowDownAZ,
  ArrowUpZA,
  Tag,
  BarChart3,
  BellRing
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'sahakar_physio_patients_v1';

export type SortKey = 
  | 'treatmentType' 
  | 'serviceLocation' 
  | 'painReduction' 
  | 'progress' 
  | 'name' 
  | 'recent';

export const TREATMENT_CONFIG: Record<TreatmentType, {
  label: string;
  sublabel: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  badgeRing: string;
  dotColor: string;
  description: string;
}> = {
  'Chronic': {
    label: 'Chronic',
    sublabel: 'Geriatric & Joint Osteoarthritis',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-800',
    badgeRing: 'ring-amber-500/30',
    dotColor: 'bg-amber-500',
    description: 'Bilateral knee OA, fall risk, spinal stenosis & geriatric mobility'
  },
  'Post-Surgery': {
    label: 'Post-Surgery',
    sublabel: 'TKR, THR & Fracture Rehab',
    badgeBg: 'bg-sky-50',
    badgeBorder: 'border-sky-200',
    badgeText: 'text-sky-800',
    badgeRing: 'ring-sky-500/30',
    dotColor: 'bg-sky-500',
    description: 'Post-operative total knee/hip replacement, ORIF fracture mobilization'
  },
  'Sports': {
    label: 'Sports',
    sublabel: 'Athletic & Musculoskeletal',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-800',
    badgeRing: 'ring-emerald-500/30',
    dotColor: 'bg-emerald-500',
    description: 'Rotator cuff tendinopathy, shoulder impingement, ankle sprain & return-to-play'
  },
  'IT/Posture': {
    label: 'IT/Posture',
    sublabel: 'Tech Strain & Spine Ergonomics',
    badgeBg: 'bg-purple-50',
    badgeBorder: 'border-purple-200',
    badgeText: 'text-purple-800',
    badgeRing: 'ring-purple-500/30',
    dotColor: 'bg-purple-500',
    description: 'Cervical radiculopathy, lumbar disc bulge, sciatica & tech workstation strain'
  }
};

export function getTreatmentType(patient: PatientRecord): TreatmentType {
  if (patient.treatmentType) return patient.treatmentType;
  const cat = (patient.injuryCategory || '').toLowerCase();
  if (cat.includes('post-surg') || cat.includes('surgery')) return 'Post-Surgery';
  if (cat.includes('sport') || cat.includes('athletic')) return 'Sports';
  if (cat.includes('spine') || cat.includes('posture') || cat.includes('it strain') || cat.includes('tech') || cat.includes('cervical') || cat.includes('lumbar')) return 'IT/Posture';
  return 'Chronic';
}

export function getServiceLocation(patient: PatientRecord): ServiceLocation {
  return patient.careType === 'home_care' ? 'Home' : 'Clinic';
}

interface PatientManagementProps {
  onNavigateToScheduler?: () => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToReminders?: () => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({ 
  onNavigateToScheduler, 
  onNavigateToAnalytics,
  onNavigateToReminders 
}) => {
  // Initialize state with localStorage if available, otherwise DEFAULT_PATIENTS
  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PATIENTS;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(patients));
    } catch {
      // Ignore storage errors
    }
  }, [patients]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<'all' | ServiceLocation>('all');
  const [treatmentFilter, setTreatmentFilter] = useState<'all' | TreatmentType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Completed' | 'On Hold'>('all');

  // Sorting state
  const [sortBy, setSortBy] = useState<SortKey>('treatmentType');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal states
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showLogSessionModal, setShowLogSessionModal] = useState(false);
  const [quickLogPatientId, setQuickLogPatientId] = useState<string | null>(null);

  // New Patient Form state
  const [newPatient, setNewPatient] = useState<Partial<PatientRecord>>({
    fullName: '',
    age: 65,
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    area: 'Sahakarnagar Block-C',
    careType: 'clinic',
    treatmentType: 'Chronic',
    injuryCategory: 'Geriatric & Joint',
    diagnosis: '',
    referringDoctor: '',
    packageType: 15,
    sessionsCompleted: 1,
    totalPackageFee: 13500,
    paymentStatus: 'Paid',
    amountPaid: 13500,
    startDate: new Date().toISOString().split('T')[0],
    initialPainVAS: 8,
    currentPainVAS: 7,
    targetOutcome: '',
    status: 'Active'
  });

  // New Session Log Form state
  const [newSession, setNewSession] = useState<{
    date: string;
    attendingPT: string;
    modalities: string;
    painScoreVAS: number;
    objectiveMeasurements: string;
    clinicalObservations: string;
    homeExercisesPrescribed: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    attendingPT: 'Lead Physiotherapist (MPT)',
    modalities: 'IFT, Ultrasound, Resistance Band Rehab',
    painScoreVAS: 4,
    objectiveMeasurements: '',
    clinicalObservations: '',
    homeExercisesPrescribed: ''
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Filtered and Sorted patients
  const filteredAndSortedPatients = [...patients]
    .filter(patient => {
      const patientTreatment = getTreatmentType(patient);
      const patientLocation = getServiceLocation(patient);

      const matchesSearch = 
        patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery);

      const matchesLocation = locationFilter === 'all' || patientLocation === locationFilter;
      const matchesTreatment = treatmentFilter === 'all' || patientTreatment === treatmentFilter;
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;

      return matchesSearch && matchesLocation && matchesTreatment && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'treatmentType') {
        const typeA = getTreatmentType(a);
        const typeB = getTreatmentType(b);
        comparison = typeA.localeCompare(typeB);
      } else if (sortBy === 'serviceLocation') {
        const locA = getServiceLocation(a);
        const locB = getServiceLocation(b);
        // 'Clinic' vs 'Home'
        comparison = locA.localeCompare(locB);
      } else if (sortBy === 'painReduction') {
        const redA = a.initialPainVAS - a.currentPainVAS;
        const redB = b.initialPainVAS - b.currentPainVAS;
        comparison = redB - redA; // default higher reduction first
      } else if (sortBy === 'progress') {
        const progA = a.sessionsCompleted / a.packageType;
        const progB = b.sessionsCompleted / b.packageType;
        comparison = progB - progA; // default higher progress first
      } else if (sortBy === 'name') {
        comparison = a.fullName.localeCompare(b.fullName);
      } else if (sortBy === 'recent') {
        const dateA = a.lastSessionDate || a.startDate;
        const dateB = b.lastSessionDate || b.startDate;
        comparison = dateB.localeCompare(dateA); // default most recent first
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // KPI Calculations
  const totalPatientsCount = patients.length;
  const clinicCount = patients.filter(p => getServiceLocation(p) === 'Clinic').length;
  const homeCareCount = patients.filter(p => getServiceLocation(p) === 'Home').length;
  const activeCount = patients.filter(p => p.status === 'Active').length;

  // Counts for filters
  const countChronic = patients.filter(p => getTreatmentType(p) === 'Chronic').length;
  const countPostSurgery = patients.filter(p => getTreatmentType(p) === 'Post-Surgery').length;
  const countSports = patients.filter(p => getTreatmentType(p) === 'Sports').length;
  const countITPosture = patients.filter(p => getTreatmentType(p) === 'IT/Posture').length;

  const isFilterActive = searchQuery !== '' || locationFilter !== 'all' || treatmentFilter !== 'all' || statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationFilter('all');
    setTreatmentFilter('all');
    setStatusFilter('all');
  };
  
  const avgPainReduction = patients.length > 0
    ? (patients.reduce((acc, p) => acc + (p.initialPainVAS - p.currentPainVAS), 0) / patients.length).toFixed(1)
    : '0';

  const totalSessionsLogged = patients.reduce((acc, p) => acc + p.sessionsCompleted, 0);

  // Handler: Add Patient
  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.fullName || !newPatient.diagnosis) return;

    const chosenTreatment: TreatmentType = (newPatient.treatmentType as TreatmentType) || 'Chronic';
    const mappedCategory = 
      chosenTreatment === 'Chronic' ? 'Geriatric & Joint' :
      chosenTreatment === 'Post-Surgery' ? 'Post-Surgical' :
      chosenTreatment === 'Sports' ? 'Sports & Musculoskeletal' :
      'Spine & Posture';

    const patientToAdd: PatientRecord = {
      id: `pt-${Date.now().toString().slice(-4)}`,
      fullName: newPatient.fullName || 'Unnamed Patient',
      age: Number(newPatient.age) || 50,
      gender: newPatient.gender || 'Male',
      phone: newPatient.phone || '',
      email: newPatient.email || '',
      address: newPatient.address || '',
      area: newPatient.area || 'Sahakarnagar',
      careType: newPatient.careType || 'clinic',
      treatmentType: chosenTreatment,
      injuryCategory: mappedCategory,
      diagnosis: newPatient.diagnosis || '',
      referringDoctor: newPatient.referringDoctor || 'Self / Local Clinic Referral',
      packageType: (newPatient.packageType as 10 | 15 | 20 | 25) || 15,
      sessionsCompleted: 1,
      totalPackageFee: Number(newPatient.totalPackageFee) || 15000,
      paymentStatus: (newPatient.paymentStatus as 'Paid' | 'Partial' | 'Pending') || 'Paid',
      amountPaid: Number(newPatient.amountPaid) || Number(newPatient.totalPackageFee) || 15000,
      startDate: newPatient.startDate || new Date().toISOString().split('T')[0],
      lastSessionDate: new Date().toISOString().split('T')[0],
      initialPainVAS: Number(newPatient.initialPainVAS) || 7,
      currentPainVAS: Number(newPatient.currentPainVAS) || Number(newPatient.initialPainVAS) || 7,
      targetOutcome: newPatient.targetOutcome || 'Restoration of pain-free daily functional mobility.',
      status: 'Active',
      notes: [
        {
          id: `sn-init-${Date.now()}`,
          sessionNumber: 1,
          date: newPatient.startDate || new Date().toISOString().split('T')[0],
          attendingPT: newPatient.careType === 'home_care' ? 'Home-Care Geriatric Specialist' : 'Clinic Lead BPT/MPT',
          modalities: ['Initial Clinical Assessment', 'Postural Analysis', 'Gentle Passive Mobilization'],
          painScoreVAS: Number(newPatient.initialPainVAS) || 7,
          objectiveMeasurements: 'Baseline clinical assessment completed. Functional limitation documented.',
          clinicalObservations: 'Patient commenced structured recovery course. Patient history noted.',
          homeExercisesPrescribed: 'Gentle active-assisted ROM, ergonomic positioning, ice/heat as advised.'
        }
      ]
    };

    setPatients([patientToAdd, ...patients]);
    setShowAddPatientModal(false);
    setSelectedPatientId(patientToAdd.id);
  };

  // Handler: Log New Session
  const handleLogSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLogPatientId) return;

    const patient = patients.find(p => p.id === quickLogPatientId);
    if (!patient) return;

    const nextSessionNumber = patient.sessionsCompleted + 1;
    const isNowCompleted = nextSessionNumber >= patient.packageType;

    const newNote: ClinicalSessionNote = {
      id: `sn-${Date.now()}`,
      sessionNumber: nextSessionNumber,
      date: newSession.date,
      attendingPT: newSession.attendingPT,
      modalities: newSession.modalities.split(',').map(m => m.trim()).filter(Boolean),
      painScoreVAS: Number(newSession.painScoreVAS),
      objectiveMeasurements: newSession.objectiveMeasurements || 'Mobility reassessed. Range maintained.',
      clinicalObservations: newSession.clinicalObservations || 'Treatment administered as per ongoing rehabilitation protocol.',
      homeExercisesPrescribed: newSession.homeExercisesPrescribed || 'Continue prescribed home exercise regimen.'
    };

    setPatients(patients.map(p => {
      if (p.id === quickLogPatientId) {
        return {
          ...p,
          sessionsCompleted: nextSessionNumber,
          lastSessionDate: newSession.date,
          currentPainVAS: Number(newSession.painScoreVAS),
          status: isNowCompleted ? 'Completed' : p.status,
          notes: [...p.notes, newNote]
        };
      }
      return p;
    }));

    setShowLogSessionModal(false);
    setQuickLogPatientId(null);
  };

  const handleOpenQuickLog = (patient: PatientRecord) => {
    setQuickLogPatientId(patient.id);
    setNewSession({
      date: new Date().toISOString().split('T')[0],
      attendingPT: patient.careType === 'home_care' ? 'Home-Care Geriatric Specialist' : 'Clinic Lead BPT/MPT',
      modalities: patient.injuryCategory === 'Spine & Posture' 
        ? 'IFT, Manual Cervical Traction, Chin Tucks' 
        : patient.injuryCategory === 'Post-Surgical' 
        ? 'Ultrasound, Theraband, Gait Training' 
        : 'TENS, Passive ROM, Balance Mat Drills',
      painScoreVAS: Math.max(1, patient.currentPainVAS - 1),
      objectiveMeasurements: 'Active range of motion improved by +5° to 10°. Functional stability intact.',
      clinicalObservations: 'Patient tolerated session with minimal discomfort. Progression to next difficulty tier noted.',
      homeExercisesPrescribed: 'Repeat home mobility set 2x daily, apply thermal pack 15 mins post-activity.'
    });
    setShowLogSessionModal(true);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset patient records to the default Sahakarnagar clinic and home care cohort?')) {
      setPatients(DEFAULT_PATIENTS);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Clinical Overview */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 border border-stone-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ClipboardList className="w-4 h-4" />
              <span>Clinical Operations & Longitudinal Progress</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Patient Care & Package Outcome Management
            </h2>
            <p className="text-stone-300 text-sm max-w-3xl mt-1 leading-relaxed">
              Track patient cohorts across structured 10 to 25 session recurring courses. Monitor initial vs. current 
              VAS pain scores, session logs, functional outcome milestones, and clinical notes for both 600 sq ft clinic 
              and North Bangalore home-care visits.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {onNavigateToReminders && (
              <button
                onClick={onNavigateToReminders}
                className="px-3.5 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-xs font-bold border border-amber-600/50 shadow-xs transition-colors flex items-center cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5 mr-1.5 text-amber-400 animate-pulse" />
                Reminder Log
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-white">
                  4 Drop-Off Alerts
                </span>
              </button>
            )}
            {onNavigateToAnalytics && (
              <button
                onClick={onNavigateToAnalytics}
                className="px-3.5 py-2 rounded-xl bg-teal-900/90 hover:bg-teal-800 text-teal-100 text-xs font-bold border border-teal-600/50 shadow-xs transition-colors flex items-center cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-teal-300" />
                Demographics & Analytics
              </button>
            )}
            {onNavigateToScheduler && (
              <button
                onClick={onNavigateToScheduler}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-600/50 shadow-xs transition-colors flex items-center cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                Smart Scheduler
              </button>
            )}
            <button
              onClick={handleResetDefaults}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold border border-stone-700 transition-colors flex items-center cursor-pointer"
              title="Reload sample cohort"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset Samples
            </button>
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center cursor-pointer"
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Intake New Patient
            </button>
          </div>
        </div>

        {/* Clinical KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-800 text-xs">
          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/60">
            <span className="text-stone-400 text-[11px] block">Active Cohort</span>
            <div className="text-xl font-bold text-white mt-0.5">
              {activeCount} <span className="text-xs font-normal text-stone-400">/ {totalPatientsCount} Total</span>
            </div>
            <div className="text-[10px] text-teal-300 mt-1">
              {clinicCount} Clinic • {homeCareCount} Home Care
            </div>
          </div>

          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/60">
            <span className="text-stone-400 text-[11px] block">Sessions Delivered</span>
            <div className="text-xl font-bold text-teal-400 mt-0.5">
              {totalSessionsLogged}
            </div>
            <div className="text-[10px] text-stone-400 mt-1">
              Across 10–25 session packages
            </div>
          </div>

          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/60">
            <span className="text-stone-400 text-[11px] block">Avg. Pain Reduction</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5 flex items-center">
              <TrendingDown className="w-4 h-4 mr-1 text-emerald-400" />
              -{avgPainReduction} <span className="text-xs font-normal text-stone-300 ml-1">VAS pts</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-1">
              Visual Analogue Scale (0–10)
            </div>
          </div>

          <div className="bg-stone-800/80 p-3.5 rounded-xl border border-stone-700/60">
            <span className="text-stone-400 text-[11px] block">Clinical Adherence</span>
            <div className="text-xl font-bold text-amber-300 mt-0.5">
              91.4%
            </div>
            <div className="text-[10px] text-stone-400 mt-1">
              Package completion rate
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search & Sort Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        {/* Top Control Row: Search, Service Location Switcher & Sorting */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by patient name, condition, area (e.g. Judicial Layout)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Service Location Quick Switcher */}
            <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setLocationFilter('all')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  locationFilter === 'all' 
                    ? 'bg-white text-stone-900 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Locations ({totalPatientsCount})
              </button>
              <button
                onClick={() => setLocationFilter('Clinic')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center cursor-pointer ${
                  locationFilter === 'Clinic' 
                    ? 'bg-white text-sky-800 shadow-xs border border-sky-200' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 mr-1 text-sky-600" />
                Clinic ({clinicCount})
              </button>
              <button
                onClick={() => setLocationFilter('Home')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center cursor-pointer ${
                  locationFilter === 'Home' 
                    ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Home className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Home ({homeCareCount})
              </button>
            </div>

            {/* Sorting Controls */}
            <div className="flex items-center space-x-1.5 bg-stone-50 border border-stone-200 p-1 rounded-lg text-xs">
              <div className="flex items-center px-1.5 text-stone-500 font-medium">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-teal-700" />
                <span className="hidden sm:inline">Sort:</span>
              </div>

              {/* Sort By Field */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="bg-white border border-stone-200 rounded-md px-2 py-1 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                title="Select field to sort patients by"
              >
                <option value="treatmentType">Treatment Type (Chronic, Post-Op, Sports, IT)</option>
                <option value="serviceLocation">Service Location (Clinic vs Home)</option>
                <option value="painReduction">Pain Reduction (VAS pts drop)</option>
                <option value="progress">Package Progress (% completed)</option>
                <option value="name">Patient Name (A–Z)</option>
                <option value="recent">Most Recent Session</option>
              </select>

              {/* Sort Direction Toggle Button */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-md text-stone-700 font-semibold flex items-center transition-colors cursor-pointer"
                title={`Current sort order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}. Click to reverse.`}
              >
                {sortOrder === 'asc' ? (
                  <ArrowDownAZ className="w-3.5 h-3.5 text-teal-700 mr-1" />
                ) : (
                  <ArrowUpZA className="w-3.5 h-3.5 text-teal-700 mr-1" />
                )}
                <span className="text-[11px]">
                  {sortBy === 'treatmentType'
                    ? (sortOrder === 'asc' ? 'Chronic → Sports' : 'Sports → Chronic')
                    : sortBy === 'serviceLocation'
                    ? (sortOrder === 'asc' ? 'Clinic 1st' : 'Home 1st')
                    : sortBy === 'painReduction'
                    ? (sortOrder === 'asc' ? 'Highest Drop' : 'Lowest Drop')
                    : sortBy === 'progress'
                    ? (sortOrder === 'asc' ? 'Most Complete' : 'Least Complete')
                    : sortBy === 'name'
                    ? (sortOrder === 'asc' ? 'A → Z' : 'Z → A')
                    : (sortOrder === 'asc' ? 'Newest' : 'Oldest')}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Treatment Type & Status Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center space-x-1 text-stone-500 mr-1">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-semibold text-stone-600 text-[11px]">Treatment Type:</span>
            </div>

            {/* All Types */}
            <button
              onClick={() => setTreatmentFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                treatmentFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Types ({totalPatientsCount})
            </button>

            {/* Chronic */}
            <button
              onClick={() => setTreatmentFilter('Chronic')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center cursor-pointer ${
                treatmentFilter === 'Chronic'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-800'
              }`}
              title="Geriatric & Joint Osteoarthritis, Fall Risk"
            >
              <Activity className="w-3 h-3 mr-1 text-amber-600" />
              Chronic ({countChronic})
            </button>

            {/* Post-Surgery */}
            <button
              onClick={() => setTreatmentFilter('Post-Surgery')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center cursor-pointer ${
                treatmentFilter === 'Post-Surgery'
                  ? 'bg-sky-100 text-sky-900 border border-sky-300 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-sky-50 hover:text-sky-800'
              }`}
              title="Post-Op TKR, THR, ORIF Fracture Rehabilitation"
            >
              <ShieldCheck className="w-3 h-3 mr-1 text-sky-600" />
              Post-Surgery ({countPostSurgery})
            </button>

            {/* Sports */}
            <button
              onClick={() => setTreatmentFilter('Sports')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center cursor-pointer ${
                treatmentFilter === 'Sports'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
              title="Rotator cuff, ligament tears, athletic return-to-play"
            >
              <Award className="w-3 h-3 mr-1 text-emerald-600" />
              Sports ({countSports})
            </button>

            {/* IT/Posture */}
            <button
              onClick={() => setTreatmentFilter('IT/Posture')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center cursor-pointer ${
                treatmentFilter === 'IT/Posture'
                  ? 'bg-purple-100 text-purple-900 border border-purple-300 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-purple-50 hover:text-purple-800'
              }`}
              title="Cervical radiculopathy, lumbar disc bulge, tech neck, desk ergonomics"
            >
              <Sparkles className="w-3 h-3 mr-1 text-purple-600" />
              IT/Posture ({countITPosture})
            </button>

            <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block"></div>

            {/* Status Filters */}
            <div className="flex items-center space-x-1">
              {(['all', 'Active', 'Completed', 'On Hold'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-teal-700 text-white font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st === 'all' ? 'All Status' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Reset button if filter is active */}
          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold flex items-center transition-colors cursor-pointer"
              title="Reset all active search and filter parameters"
            >
              <RotateCcw className="w-3 h-3 mr-1 text-stone-500" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Status Bar: Results count and active sorting banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-100 text-[11px] text-stone-600">
          <div className="flex items-center space-x-2">
            <span>
              Showing <strong className="text-stone-900">{filteredAndSortedPatients.length}</strong> of <strong className="text-stone-900">{patients.length}</strong> patients
            </span>
            {locationFilter !== 'all' && (
              <span className="px-1.5 py-0.2 bg-white rounded border border-stone-200 text-[10px] text-stone-700 font-medium">
                Location: <strong>{locationFilter}</strong>
              </span>
            )}
            {treatmentFilter !== 'all' && (
              <span className="px-1.5 py-0.2 bg-white rounded border border-stone-200 text-[10px] text-stone-700 font-medium">
                Type: <strong>{treatmentFilter}</strong>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="px-1.5 py-0.2 bg-white rounded border border-stone-200 text-[10px] text-stone-700 font-medium">
                Status: <strong>{statusFilter}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1.5 text-stone-500">
            <ArrowUpDown className="w-3 h-3 text-teal-700" />
            <span>
              Sorted by: <strong className="text-stone-800">
                {sortBy === 'treatmentType' ? 'Treatment Type' :
                 sortBy === 'serviceLocation' ? 'Service Location' :
                 sortBy === 'painReduction' ? 'Pain Reduction' :
                 sortBy === 'progress' ? 'Package Progress' :
                 sortBy === 'name' ? 'Patient Name' : 'Recent Session'}
              </strong> ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
            </span>
          </div>
        </div>
      </div>

      {/* Patient List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedPatients.map((patient) => {
          const progressPercent = Math.round((patient.sessionsCompleted / patient.packageType) * 100);
          const serviceLocation = getServiceLocation(patient);
          const treatmentType = getTreatmentType(patient);
          const isHomeCare = serviceLocation === 'Home';
          const treatmentConfig = TREATMENT_CONFIG[treatmentType] || TREATMENT_CONFIG['Chronic'];

          return (
            <div
              key={patient.id}
              className={`bg-white rounded-xl border border-stone-200 shadow-xs hover:shadow-md hover:border-stone-300 transition-all flex flex-col justify-between overflow-hidden relative ${
                sortBy === 'treatmentType' && treatmentFilter === 'all'
                  ? 'hover:ring-1 hover:' + treatmentConfig.badgeRing
                  : ''
              }`}
            >
              {/* Card Header */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    {/* Badge Row: Service Location, Treatment Type, and Status */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Service Location Badge */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center ${
                        isHomeCare 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-sky-50 text-sky-800 border border-sky-200'
                      }`}>
                        {isHomeCare ? <Home className="w-3 h-3 mr-1 text-emerald-600" /> : <Building2 className="w-3 h-3 mr-1 text-sky-600" />}
                        {isHomeCare ? 'Home Care' : 'Clinic'}
                      </span>

                      {/* Treatment Type Badge */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center border ${treatmentConfig.badgeBg} ${treatmentConfig.badgeText} ${treatmentConfig.badgeBorder}`}>
                        {treatmentType === 'Chronic' && <Activity className="w-3 h-3 mr-1 text-amber-600" />}
                        {treatmentType === 'Post-Surgery' && <ShieldCheck className="w-3 h-3 mr-1 text-sky-600" />}
                        {treatmentType === 'Sports' && <Award className="w-3 h-3 mr-1 text-emerald-600" />}
                        {treatmentType === 'IT/Posture' && <Sparkles className="w-3 h-3 mr-1 text-purple-600" />}
                        {treatmentType}
                      </span>

                      {/* Patient Status */}
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        patient.status === 'Active'
                          ? 'bg-teal-50 text-teal-700'
                          : patient.status === 'Completed'
                          ? 'bg-stone-100 text-stone-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {patient.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-sm pt-0.5">
                      {patient.fullName}
                    </h3>
                    <div className="text-[11px] text-stone-500 flex items-center space-x-1.5">
                      <span>{patient.age} yrs, {patient.gender}</span>
                      <span>•</span>
                      <span className="flex items-center text-stone-600 truncate max-w-[150px]">
                        <MapPin className="w-3 h-3 mr-0.5 text-stone-400 shrink-0" />
                        {patient.area}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-stone-400 font-semibold block uppercase">Package</span>
                    <span className="text-xs font-extrabold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                      {patient.packageType} Sessions
                    </span>
                  </div>
                </div>

                {/* Diagnosis & Treatment Specialty Box */}
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-stone-400 uppercase font-semibold">Diagnosis</span>
                    <span className="text-stone-700 font-semibold flex items-center">
                      <span className={`w-1.5 h-1.5 rounded-full mr-1 ${treatmentConfig.dotColor}`}></span>
                      {treatmentConfig.sublabel}
                    </span>
                  </div>
                  <p className="text-xs text-stone-800 font-medium leading-snug line-clamp-2">
                    {patient.diagnosis}
                  </p>
                </div>

                {/* Package Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-stone-500 font-medium">
                      Course Progress: <strong className="text-stone-800">{patient.sessionsCompleted}</strong> of {patient.packageType}
                    </span>
                    <span className="font-bold text-teal-700">{progressPercent}%</span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        progressPercent >= 100
                          ? 'bg-emerald-500'
                          : isHomeCare
                          ? 'bg-emerald-600'
                          : 'bg-teal-600'
                      }`}
                      style={{ width: `${Math.min(100, progressPercent)}%` }}
                    />
                  </div>
                </div>

                {/* Pain Score (VAS) Progression Indicator */}
                <div className="flex items-center justify-between bg-stone-50/70 px-3 py-2 rounded-lg border border-stone-200/70 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Pain Score (VAS 0–10)</span>
                    <div className="flex items-center space-x-1.5 font-bold mt-0.5">
                      <span className="text-rose-600 line-through text-xs font-semibold">
                        {patient.initialPainVAS}/10
                      </span>
                      <ChevronRight className="w-3 h-3 text-stone-400" />
                      <span className="text-emerald-700 font-extrabold text-sm">
                        {patient.currentPainVAS}/10
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        -{patient.initialPainVAS - patient.currentPainVAS} pts
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block font-medium">Fee / Billing</span>
                    <span className="text-xs font-bold text-stone-800">
                      {formatINR(patient.totalPackageFee)}
                    </span>
                    <span className={`text-[10px] block font-semibold ${
                      patient.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {patient.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer / Actions */}
              <div className="p-3 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenQuickLog(patient)}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200 transition-colors flex items-center cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Log Session #{patient.sessionsCompleted + 1}
                </button>

                <button
                  onClick={() => setSelectedPatientId(patient.id)}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold transition-colors flex items-center cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 mr-1 text-teal-400" />
                  Clinical Chart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAndSortedPatients.length === 0 && (
        <div className="bg-white p-12 rounded-xl border border-stone-200 text-center space-y-3">
          <AlertCircle className="w-8 h-8 mx-auto text-stone-400" />
          <h3 className="font-bold text-stone-800 text-sm">No Patients Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            No patient records match the current filter or search criteria. Adjust filters or register a new intake.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* MODAL 1: Intake New Patient */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-base">New Patient Intake & Package Enrollment</h3>
              </div>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPatientSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kulkarni"
                    value={newPatient.fullName}
                    onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Age</label>
                    <input
                      type="number"
                      required
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({ ...newPatient, age: Number(e.target.value) })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Gender</label>
                    <select
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value as any })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Phone Contact *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98XXX XXXXX"
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Care Mode *</label>
                  <select
                    value={newPatient.careType}
                    onChange={(e) => setNewPatient({ ...newPatient, careType: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-semibold focus:bg-white"
                  >
                    <option value="clinic">In-Clinic (600 sq ft)</option>
                    <option value="home_care">Concierge Home Care (Senior)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Area / Layout</label>
                  <input
                    type="text"
                    placeholder="e.g. Sahakarnagar D-Block"
                    value={newPatient.area}
                    onChange={(e) => setNewPatient({ ...newPatient, area: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Treatment Type *</label>
                  <select
                    value={newPatient.treatmentType || 'Chronic'}
                    onChange={(e) => {
                      const tt = e.target.value as TreatmentType;
                      const cat = tt === 'Chronic' ? 'Geriatric & Joint' :
                                  tt === 'Post-Surgery' ? 'Post-Surgical' :
                                  tt === 'Sports' ? 'Sports & Musculoskeletal' :
                                  'Spine & Posture';
                      setNewPatient({ ...newPatient, treatmentType: tt, injuryCategory: cat });
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-medium focus:bg-white"
                  >
                    <option value="Chronic">Chronic (Geriatric & Joint Osteoarthritis)</option>
                    <option value="Post-Surgery">Post-Surgery (TKR, THR, Fracture Rehab)</option>
                    <option value="Sports">Sports (Athletic & Musculoskeletal)</option>
                    <option value="IT/Posture">IT/Posture (Tech Neck & Spine Ergonomics)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Referring Doctor / Clinic</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Hegde (Aster CMI) / Self"
                    value={newPatient.referringDoctor}
                    onChange={(e) => setNewPatient({ ...newPatient, referringDoctor: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Clinical Diagnosis & Medical History *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Grade 2 Medial Meniscus Tear with Left Knee Effusion and Extension Lag..."
                  value={newPatient.diagnosis}
                  onChange={(e) => setNewPatient({ ...newPatient, diagnosis: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                />
              </div>

              {/* Package & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Package Size</label>
                  <select
                    value={newPatient.packageType}
                    onChange={(e) => {
                      const size = Number(e.target.value) as 10 | 15 | 20 | 25;
                      const rate = newPatient.careType === 'home_care' ? 1400 : 900;
                      setNewPatient({ 
                        ...newPatient, 
                        packageType: size,
                        totalPackageFee: size * rate,
                        amountPaid: size * rate
                      });
                    }}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900 font-bold"
                  >
                    <option value={10}>10 Sessions (Mild / Acute)</option>
                    <option value={15}>15 Sessions (Standard Care)</option>
                    <option value={20}>20 Sessions (Post-Op / Sciatica)</option>
                    <option value={25}>25 Sessions (Geriatric Care)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Total Fee (₹)</label>
                  <input
                    type="number"
                    value={newPatient.totalPackageFee}
                    onChange={(e) => setNewPatient({ ...newPatient, totalPackageFee: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Payment Status</label>
                  <select
                    value={newPatient.paymentStatus}
                    onChange={(e) => setNewPatient({ ...newPatient, paymentStatus: e.target.value as any })}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-stone-900"
                  >
                    <option value="Paid">Paid in Full</option>
                    <option value="Partial">Partial Advance</option>
                    <option value="Pending">Pending / Per-Session</option>
                  </select>
                </div>
              </div>

              {/* Baseline VAS & Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Baseline Pain Score: VAS {newPatient.initialPainVAS} / 10
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={newPatient.initialPainVAS}
                    onChange={(e) => setNewPatient({ 
                      ...newPatient, 
                      initialPainVAS: Number(e.target.value),
                      currentPainVAS: Number(e.target.value)
                    })}
                    className="w-full accent-rose-600"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>0: No Pain</span>
                    <span>5: Moderate</span>
                    <span>10: Severe Bedridden</span>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Target Functional Outcome</label>
                  <input
                    type="text"
                    placeholder="e.g. Unassisted 1 km walk, 120° knee flexion"
                    value={newPatient.targetOutcome}
                    onChange={(e) => setNewPatient({ ...newPatient, targetOutcome: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddPatientModal(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold cursor-pointer"
                >
                  Confirm Intake & Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Quick Log Session */}
      {showLogSessionModal && quickLogPatientId && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            {(() => {
              const pt = patients.find(p => p.id === quickLogPatientId);
              if (!pt) return null;
              const nextSessionNum = pt.sessionsCompleted + 1;

              return (
                <form onSubmit={handleLogSessionSubmit}>
                  <div className="bg-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
                    <div>
                      <h3 className="font-bold text-base flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-teal-400" />
                        Log Clinical Session #{nextSessionNum} of {pt.packageType}
                      </h3>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {pt.fullName} • {pt.careType === 'home_care' ? 'Home Care Visit' : 'Clinic'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowLogSessionModal(false)}
                      className="p-1 rounded-lg text-stone-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Session Date</label>
                        <input
                          type="date"
                          required
                          value={newSession.date}
                          onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Attending Physiotherapist</label>
                        <input
                          type="text"
                          required
                          value={newSession.attendingPT}
                          onChange={(e) => setNewSession({ ...newSession, attendingPT: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900"
                        />
                      </div>
                    </div>

                    {/* VAS Pain Slider */}
                    <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-stone-700">Reported Pain Score (VAS):</span>
                        <span className="font-extrabold text-sm text-teal-800">
                          {newSession.painScoreVAS} / 10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={newSession.painScoreVAS}
                        onChange={(e) => setNewSession({ ...newSession, painScoreVAS: Number(e.target.value) })}
                        className="w-full accent-teal-700"
                      />
                      <div className="flex justify-between text-[10px] text-stone-400">
                        <span>Baseline: {pt.initialPainVAS}/10</span>
                        <span>Current Target: ≤2/10</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Modalities & Interventions Used
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ultrasound, IFT, Theraband eccentric loading, Gait training"
                        value={newSession.modalities}
                        onChange={(e) => setNewSession({ ...newSession, modalities: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Objective Measurements / ROM (Range of Motion)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Knee flexion 110°, TUG test 14s, full cervical rotation"
                        value={newSession.objectiveMeasurements}
                        onChange={(e) => setNewSession({ ...newSession, objectiveMeasurements: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Clinical Observations & Response (SOAP Note)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Patient tolerated resistance band drills well. Muscle spasm diminished."
                        value={newSession.clinicalObservations}
                        onChange={(e) => setNewSession({ ...newSession, clinicalObservations: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">
                        Home Exercise Program (HEP) Prescribed
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10 quad sets hourly, ice 15 min, posture awareness"
                        value={newSession.homeExercisesPrescribed}
                        onChange={(e) => setNewSession({ ...newSession, homeExercisesPrescribed: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-3 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setShowLogSessionModal(false)}
                        className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold cursor-pointer"
                      >
                        Save Session Log
                      </button>
                    </div>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODAL 3: Full Patient Clinical Chart & Longitudinal Notes */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            {/* Chart Header */}
            <div className="bg-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-700 flex items-center justify-center text-white">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-white">
                      {selectedPatient.fullName}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedPatient.careType === 'home_care'
                        ? 'bg-emerald-800 text-emerald-200'
                        : 'bg-teal-800 text-teal-200'
                    }`}>
                      {selectedPatient.careType === 'home_care' ? 'Home Visit' : 'Clinic'}
                    </span>
                    <span className="text-xs text-stone-400">ID: {selectedPatient.id}</span>
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5">
                    {selectedPatient.age} yrs • {selectedPatient.gender} • {selectedPatient.phone} • {selectedPatient.area}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center cursor-pointer"
                  title="Print Clinical Chart"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  Print Chart
                </button>
                <button
                  onClick={() => setSelectedPatientId(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chart Body */}
            <div className="p-6 space-y-6 text-xs text-stone-800 max-h-[80vh] overflow-y-auto">
              {/* Summary Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200 text-center">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Package Course</span>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    {selectedPatient.sessionsCompleted} of {selectedPatient.packageType} Sessions
                  </div>
                  <div className="text-[10px] text-teal-700 font-semibold mt-0.5">
                    {Math.round((selectedPatient.sessionsCompleted / selectedPatient.packageType) * 100)}% Complete
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Pain Improvement</span>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">
                    {selectedPatient.initialPainVAS} → {selectedPatient.currentPainVAS} / 10
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                    -{selectedPatient.initialPainVAS - selectedPatient.currentPainVAS} points reduction
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Care Package Fee</span>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    {formatINR(selectedPatient.totalPackageFee)}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    Status: {selectedPatient.paymentStatus}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Referring Specialist</span>
                  <div className="text-xs font-bold text-stone-800 mt-0.5 truncate">
                    {selectedPatient.referringDoctor || 'Self'}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    Started: {selectedPatient.startDate}
                  </div>
                </div>
              </div>

              {/* Diagnosis & Goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-400 uppercase">Primary Diagnosis & Pathology</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${TREATMENT_CONFIG[getTreatmentType(selectedPatient)].badgeBg} ${TREATMENT_CONFIG[getTreatmentType(selectedPatient)].badgeText} ${TREATMENT_CONFIG[getTreatmentType(selectedPatient)].badgeBorder}`}>
                      {getTreatmentType(selectedPatient)}
                    </span>
                  </div>
                  <div className="font-bold text-stone-900 text-sm">{selectedPatient.diagnosis}</div>
                  <div className="text-[11px] text-stone-600">
                    Category: {selectedPatient.injuryCategory} • {TREATMENT_CONFIG[getTreatmentType(selectedPatient)].sublabel}
                  </div>
                </div>

                <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-1">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase flex items-center">
                    <Award className="w-3.5 h-3.5 mr-1" />
                    Target Functional Outcome
                  </div>
                  <div className="text-xs text-emerald-950 leading-relaxed font-medium">
                    {selectedPatient.targetOutcome}
                  </div>
                </div>
              </div>

              {/* Session Grid Visualizer */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    Package Sessions Matrix ({selectedPatient.packageType} Total)
                  </div>
                  <button
                    onClick={() => {
                      handleOpenQuickLog(selectedPatient);
                    }}
                    className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-semibold flex items-center cursor-pointer"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Log Session #{selectedPatient.sessionsCompleted + 1}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  {Array.from({ length: selectedPatient.packageType }).map((_, idx) => {
                    const sessionNum = idx + 1;
                    const isDone = sessionNum <= selectedPatient.sessionsCompleted;
                    const isNext = sessionNum === selectedPatient.sessionsCompleted + 1;

                    return (
                      <div
                        key={sessionNum}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border transition-all ${
                          isDone
                            ? 'bg-teal-600 text-white border-teal-700 shadow-2xs'
                            : isNext
                            ? 'bg-teal-100 text-teal-800 border-teal-400 border-dashed'
                            : 'bg-white text-stone-400 border-stone-200'
                        }`}
                        title={`Session ${sessionNum} ${isDone ? '(Completed)' : isNext ? '(Next Up)' : '(Scheduled)'}`}
                      >
                        {isDone ? <Check className="w-4 h-4" /> : sessionNum}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clinical Notes Timeline */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-stone-900 uppercase tracking-wide border-b border-stone-200 pb-1">
                  Clinical Session Notes & Objective Outcomes ({selectedPatient.notes.length} Recorded)
                </div>

                <div className="space-y-3">
                  {selectedPatient.notes.slice().reverse().map((note) => (
                    <div
                      key={note.id}
                      className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-100 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-extrabold flex items-center justify-center text-xs">
                            #{note.sessionNumber}
                          </span>
                          <span className="font-bold text-stone-900 text-xs">
                            Session Note • {note.date}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            ({note.attendingPT})
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-semibold text-stone-600">Pain Score:</span>
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            VAS {note.painScoreVAS} / 10
                          </span>
                        </div>
                      </div>

                      {/* Modalities badges */}
                      <div className="flex flex-wrap gap-1">
                        {note.modalities.map((mod, i) => (
                          <span
                            key={i}
                            className="bg-stone-100 text-stone-700 text-[10px] font-medium px-2 py-0.5 rounded"
                          >
                            {mod}
                          </span>
                        ))}
                      </div>

                      {/* Objective & Clinical Observations */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700 text-[11px]">
                        <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                          <strong className="text-stone-900 block mb-0.5">Objective Metrics / ROM:</strong>
                          {note.objectiveMeasurements}
                        </div>
                        <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                          <strong className="text-stone-900 block mb-0.5">Clinical Response:</strong>
                          {note.clinicalObservations}
                        </div>
                      </div>

                      {/* Home Exercise Program */}
                      {note.homeExercisesPrescribed && (
                        <div className="text-[11px] bg-teal-50/50 p-2.5 rounded-lg border border-teal-100 text-teal-950">
                          <strong className="text-teal-900">Home Exercise Protocol (HEP): </strong>
                          {note.homeExercisesPrescribed}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart Footer */}
            <div className="bg-stone-50 px-6 py-3.5 border-t border-stone-200 flex justify-between items-center">
              <div className="text-[11px] text-stone-500">
                Sahakar Physio & Geriatric Clinic • KPME Standard Medical Records
              </div>
              <button
                onClick={() => setSelectedPatientId(null)}
                className="px-4 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer"
              >
                Close Chart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
