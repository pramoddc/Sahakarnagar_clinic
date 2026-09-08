import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  LogOut,
  Phone,
  FileText,
  HeartPulse,
  Activity,
  Download,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Check,
  RotateCcw,
  IndianRupee,
  Home,
  Building2,
  Lock,
  Smartphone,
  ExternalLink,
  Info
} from 'lucide-react';
import { DEFAULT_PATIENTS } from '../data/patientDefaults';
import { LoggedInPatient } from '../types';

interface PatientPortalProps {
  onBackToHome: () => void;
  onNavigateToEmployee: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  onBackToHome,
  onNavigateToEmployee
}) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<LoggedInPatient | null>(null);
  const [loginInput, setLoginInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'appointments' | 'exercises' | 'progress' | 'receipts'>('appointments');

  // Interactive patient action states
  const [confirmedSessions, setConfirmedSessions] = useState<{ [key: string]: boolean }>({
    'sess-1': true,
    'sess-2': false,
    'sess-3': false
  });
  const [rescheduleRequested, setRescheduleRequested] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<{ [key: string]: boolean }>({
    'ex-1': true,
    'ex-2': false,
    'ex-3': false,
    'ex-4': true
  });
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);

  // Quick Demo Profiles
  const demoPatients: LoggedInPatient[] = [
    {
      id: 'pt-001',
      fullName: 'Suryanarayana Rao',
      age: 72,
      gender: 'Male',
      phone: '+91 98450 21980',
      email: 'sn.rao.blr@gmail.com',
      careType: 'home_care',
      attendingPT: 'Dr. Aditi Rao, MPT (Orthopedics)',
      diagnosis: 'Left Total Knee Replacement (TKR) - Post-Op Day 14',
      packageType: 20,
      sessionsCompleted: 14,
      totalPackageFee: 26000,
      amountPaid: 26000,
      paymentStatus: 'Paid',
      initialPainVAS: 8,
      currentPainVAS: 3,
      targetOutcome: 'Independent stair climbing & 115° knee flexion without walker.',
      homeExercisesPrescribed: 'Heel slides with towel (10 reps x 3 sets), Quad sets, Ice pack 15 mins post-exercise, Ankle pumps.'
    },
    {
      id: 'pt-002',
      fullName: 'Ananya Deshmukh',
      age: 34,
      gender: 'Female',
      phone: '+91 97401 88320',
      email: 'ananya.deshmukh@techcorp.in',
      careType: 'clinic',
      attendingPT: 'Dr. Aditi Rao, MPT (Spine & Biomechanics)',
      diagnosis: 'L4-L5 Lumbar Disc Bulge & Sciatic Radiculopathy',
      packageType: 12,
      sessionsCompleted: 6,
      totalPackageFee: 9600,
      amountPaid: 9600,
      paymentStatus: 'Paid',
      initialPainVAS: 7,
      currentPainVAS: 2,
      targetOutcome: 'Pain-free 8-hour ergonomic workday & Core stability.',
      homeExercisesPrescribed: 'McKenzie prone press-ups (10 reps every 2 hours), Bird-dog core holds, Pelvic bridging.'
    },
    {
      id: 'pt-003',
      fullName: 'Rukminiamma S.',
      age: 81,
      gender: 'Female',
      phone: '+91 94481 33019',
      email: 'priya.s.caregiver@gmail.com',
      careType: 'home_care',
      attendingPT: 'Dr. Vikram K., BPT (Geriatric Mobility)',
      diagnosis: 'Parkinson’s Disease & High Geriatric Fall Risk',
      packageType: 25,
      sessionsCompleted: 18,
      totalPackageFee: 24000,
      amountPaid: 24000,
      paymentStatus: 'Paid',
      initialPainVAS: 6,
      currentPainVAS: 3,
      targetOutcome: 'Safe unassisted indoor transfers & Timed Up and Go under 15 seconds.',
      homeExercisesPrescribed: 'Tandem stance balance drills, Seated weight shifts, Ankle dorsiflexion with theraband.'
    },
    {
      id: 'pt-004',
      fullName: 'Vikramaditya Kulkarni',
      age: 48,
      gender: 'Male',
      phone: '+91 99800 45211',
      email: 'vikram.kulkarni@telecom.com',
      careType: 'clinic',
      attendingPT: 'Dr. Aditi Rao, MPT (Sports & Orthopedics)',
      diagnosis: 'Right Adhesive Capsulitis (Frozen Shoulder - Freezing Stage)',
      packageType: 15,
      sessionsCompleted: 9,
      totalPackageFee: 12000,
      amountPaid: 12000,
      paymentStatus: 'Paid',
      initialPainVAS: 8,
      currentPainVAS: 4,
      targetOutcome: '160° active shoulder abduction & overhead reaching.',
      homeExercisesPrescribed: 'Codman pendulum swings (2 mins), Wand flexion assisted, Sleeper stretch, Wall finger climbs.'
    }
  ];

  // Check for dynamic patientId from QR scan or mobile link
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const pid = urlParams.get('patientId') || urlParams.get('pid');
      if (pid) {
        const found = demoPatients.find(
          p =>
            p.id.toLowerCase() === pid.toLowerCase() ||
            p.phone.replace(/[^0-9]/g, '').includes(pid.replace(/[^0-9]/g, '')) ||
            p.fullName.toLowerCase().includes(pid.toLowerCase())
        );
        if (found) {
          setCurrentUser(found);
        }
      }
    }
  }, []);

  const handleSelectDemoPatient = (p: LoggedInPatient) => {
    setCurrentUser(p);
    setLoginError(null);
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanInput = loginInput.trim().toLowerCase();
    const found = demoPatients.find(
      p =>
        p.id.toLowerCase() === cleanInput ||
        p.phone.replace(/[^0-9]/g, '').includes(cleanInput.replace(/[^0-9]/g, '')) ||
        p.fullName.toLowerCase().includes(cleanInput)
    );

    if (!otpSent) {
      if (found) {
        setOtpSent(true);
        setOtpInput('4289'); // Simulated auto-OTP
      } else {
        setLoginError('No patient record matched this ID or phone number. Try clicking one of the demo patients below.');
      }
    } else {
      if (found) {
        setCurrentUser(found);
        setOtpSent(false);
        setLoginInput('');
        setOtpInput('');
      } else {
        setLoginError('Invalid verification code.');
      }
    }
  };

  const handleConfirmSession = (sessionId: string) => {
    setConfirmedSessions(prev => ({ ...prev, [sessionId]: true }));
    setConfirmationNotice('Session confirmed! Your attendance has been logged with the clinic desk.');
    setTimeout(() => setConfirmationNotice(null), 5000);
  };

  const handleRequestReschedule = (sessionDate: string) => {
    setRescheduleRequested(sessionDate);
    setConfirmationNotice(`Reschedule request sent for ${sessionDate}. Front-desk coordinator (Pooja) will call shortly.`);
    setTimeout(() => {
      setConfirmationNotice(null);
    }, 6000);
  };

  const toggleExercise = (id: string) => {
    setCompletedExercises(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // --------------------------------------------------------------------------
  // STATE 1: PATIENT LOGIN SCREEN
  // --------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to General Homepage
          </button>

          <button
            onClick={onNavigateToEmployee}
            className="text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline cursor-pointer"
          >
            Are you a Physiotherapist or Clinic Staff? Staff Login →
          </button>
        </div>

        {/* Header Title */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
            <Users className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
            Patient & Caregiver Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            Sign In to Your Rehabilitation Care Portal
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Review your upcoming appointments, confirm scheduled sessions, check prescribed home exercises (HEP), and download official digital payment receipts.
          </p>
        </div>

        {/* Main Login Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-lg space-y-5">
            <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
              <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Secure Patient Sign-In</span>
            </div>

            <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Registered Mobile Number or Patient ID
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginInput}
                    onChange={e => setLoginInput(e.target.value)}
                    placeholder="e.g. 9845021980 or pt-001"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
                <span className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 block">
                  Family caregivers can use the phone number registered during clinic intake.
                </span>
              </div>

              {otpSent && (
                <div className="animate-in fade-in duration-200">
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    4-Digit Verification Code (OTP)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value)}
                    placeholder="Enter 4289"
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-center font-mono text-base tracking-widest focus:outline-hidden focus:border-teal-600"
                  />
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                    ✓ Simulated OTP auto-filled: <strong>4289</strong>
                  </span>
                </div>
              )}

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                id="btn-patient-submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{otpSent ? 'Verify & Access My Records' : 'Send One-Time Passcode'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
              <div className="flex items-center space-x-1.5 font-semibold text-stone-700 dark:text-stone-300">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Protected Patient Health Data (DISHA & HIPAA Compliant)</span>
              </div>
              <p>
                Need assistance? Call our clinic desk at <strong>+91 80 2362 8900</strong> or WhatsApp Dr. Aditi Rao at <strong>+91 98450 21980</strong>.
              </p>
            </div>
          </div>

          {/* Right Column: Quick Demo Profile Picker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Quick 1-Click Demo Profiles
              </span>
              <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
                Click any card to sign in instantly
              </span>
            </div>

            <div className="space-y-3">
              {demoPatients.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleSelectDemoPatient(p)}
                  className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                          {p.fullName}
                        </span>
                        <span className="text-xs text-stone-400 font-medium">
                          ({p.age}y, {p.gender})
                        </span>
                      </div>
                      <p className="text-xs font-medium text-stone-600 dark:text-stone-300 mt-1">
                        {p.diagnosis}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.careType === 'home_care'
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300'
                          : 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200 border border-teal-300'
                      }`}
                    >
                      {p.careType === 'home_care' ? 'Elder Home-Care' : 'Clinic Bay'}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span>
                      Progress: <strong>{p.sessionsCompleted}/{p.packageType}</strong> sessions completed
                    </span>
                    <span className="font-bold text-amber-700 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform inline-flex items-center">
                      Sign in as {p.fullName.split(' ')[0]} →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STATE 2: AUTHENTICATED PATIENT DASHBOARD
  // --------------------------------------------------------------------------
  const upcomingSessions = [
    {
      id: 'sess-1',
      date: 'Tomorrow, Wed 09 Sep',
      time: '10:00 AM - 10:45 AM',
      location: currentUser.careType === 'home_care' ? 'Home Visit (Judicial Layout)' : 'Clinic Bay 1 (60 Feet Road)',
      ptName: currentUser.attendingPT,
      status: confirmedSessions['sess-1'] ? 'Confirmed' : 'Pending Confirmation',
      treatment: 'Manual joint mobilization & quadriceps eccentric strengthening'
    },
    {
      id: 'sess-2',
      date: 'Fri, 11 Sep',
      time: '10:00 AM - 10:45 AM',
      location: currentUser.careType === 'home_care' ? 'Home Visit (Judicial Layout)' : 'Clinic Bay 1 (60 Feet Road)',
      ptName: currentUser.attendingPT,
      status: confirmedSessions['sess-2'] ? 'Confirmed' : 'Unconfirmed',
      treatment: 'Gait retraining, stair descent drill & balance board'
    },
    {
      id: 'sess-3',
      date: 'Mon, 14 Sep',
      time: '10:00 AM - 10:45 AM',
      location: currentUser.careType === 'home_care' ? 'Home Visit (Judicial Layout)' : 'Clinic Bay 1 (60 Feet Road)',
      ptName: currentUser.attendingPT,
      status: confirmedSessions['sess-3'] ? 'Confirmed' : 'Unconfirmed',
      treatment: 'Theraband resistance progress & independent mobility audit'
    }
  ];

  const exercises = [
    {
      id: 'ex-1',
      name: 'Heel Slides with Towel Assistance',
      sets: '3 sets of 10 repetitions',
      frequency: 'Twice daily (Morning & Evening)',
      focus: 'Knee flexion ROM & gentle hamstring engagement',
      caution: 'Do not force past sharp pain. Stop at pleasant stretch.'
    },
    {
      id: 'ex-2',
      name: 'Isometric Quadriceps Sets (Towel under Knee)',
      sets: '3 sets of 10 reps (5-second holds)',
      frequency: '3 times daily',
      focus: 'Vastus Medialis Oblique (VMO) muscle activation',
      caution: 'Ensure full knee extension lock against the towel roll.'
    },
    {
      id: 'ex-3',
      name: 'Straight Leg Raise (SLR) with Zero Lag',
      sets: '2 sets of 10 reps',
      frequency: 'Twice daily',
      focus: 'Hip flexor & anterior thigh power',
      caution: 'Keep toes pointed upwards; maintain locked straight knee.'
    },
    {
      id: 'ex-4',
      name: 'Post-Exercise Cryotherapy (Ice Pack)',
      sets: '15 minutes application',
      frequency: 'Immediately post exercise session',
      focus: 'Localized edema control & surgical tissue calming',
      caution: 'Wrap ice pack in a thin towel; never apply directly to bare skin.'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Patient Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-lg shadow-xs">
            {currentUser.fullName
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-stone-900 dark:text-stone-100">
                {currentUser.fullName}
              </h2>
              <span className="text-xs text-stone-400 font-medium">
                ({currentUser.age}y, {currentUser.gender})
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  currentUser.careType === 'home_care'
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                    : 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200'
                }`}
              >
                {currentUser.careType === 'home_care' ? 'Elder Home Care' : 'Clinic Bay 1'}
              </span>
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Attending: <strong>{currentUser.attendingPT}</strong> • Patient ID: <strong>{currentUser.id.toUpperCase()}</strong>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <a
            href={`https://wa.me/919845021980?text=Hello%20Dr.%20Aditi%2C%20this%20is%20${encodeURIComponent(
              currentUser.fullName
            )}%20(Patient%20ID%3A%20${currentUser.id}).%20I%20have%20a%20question%20about%20my%20physiotherapy%20plan.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 mr-1.5" />
            WhatsApp Attending Doctor
          </a>

          <button
            onClick={() => setCurrentUser(null)}
            className="inline-flex items-center px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Confirmation Notification Toast */}
      {confirmationNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 text-xs flex items-center justify-between shadow-md animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{confirmationNotice}</span>
          </div>
          <button onClick={() => setConfirmationNotice(null)} className="text-emerald-600 hover:text-emerald-800">
            ✕
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'appointments'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Upcoming Appointments & Confirmation
        </button>

        <button
          onClick={() => setActiveTab('exercises')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'exercises'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Prescribed Home Exercises (HEP)
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'progress'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Recovery Progress & Pain VAS
        </button>

        <button
          onClick={() => setActiveTab('receipts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'receipts'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Package Payments & Digital Receipts
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: UPCOMING APPOINTMENTS & 3-SESSION CONFIRMATION */}
      {/* ========================================================================= */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {/* Important Notice on 3-Session Confirmation */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                Protect Recovery Momentum: Confirm Your Next 3 Scheduled Sessions
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                Consistent rehabilitation frequency prevents surgical joint stiffness and muscle atrophy. Confirming your appointments locks in your therapist's travel route or clinic bay slot.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {upcomingSessions.map((s, idx) => {
              const isConfirmed = confirmedSessions[s.id];
              return (
                <div
                  key={s.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isConfirmed
                      ? 'bg-white dark:bg-stone-900 border-emerald-300 dark:border-emerald-800 shadow-xs'
                      : 'bg-amber-50/40 dark:bg-stone-900 border-amber-300 dark:border-amber-800/80 shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                          Session #{currentUser.sessionsCompleted + idx + 1} of {currentUser.packageType}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                          }`}
                        >
                          {isConfirmed ? '✓ Confirmed' : 'Action Required: Please Confirm'}
                        </span>
                      </div>

                      <div className="text-base font-black text-stone-900 dark:text-stone-100">
                        {s.date} • {s.time}
                      </div>

                      <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center space-x-2">
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-teal-600" />
                          {s.location}
                        </span>
                        <span>•</span>
                        <span>Therapist: {s.ptName}</span>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 pt-1">
                        <strong>Clinical Target:</strong> {s.treatment}
                      </p>
                    </div>

                    {/* Interactive Confirmation Actions */}
                    <div className="flex items-center space-x-2 shrink-0">
                      {!isConfirmed ? (
                        <button
                          onClick={() => handleConfirmSession(s.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm I Will Attend</span>
                        </button>
                      ) : (
                        <div className="flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                          Attendance Confirmed
                        </div>
                      )}

                      <button
                        onClick={() => handleRequestReschedule(s.date)}
                        className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium cursor-pointer"
                      >
                        Request Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRESCRIBED HOME EXERCISES (HEP) */}
      {/* ========================================================================= */}
      {activeTab === 'exercises' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Daily Home Exercise Program (Prescribed by {currentUser.attendingPT})
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Tick off exercises as you complete them today to update your recovery chart.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
              {Object.values(completedExercises).filter(Boolean).length} of {exercises.length} Done Today
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exercises.map(ex => {
              const done = completedExercises[ex.id];
              return (
                <div
                  key={ex.id}
                  onClick={() => toggleExercise(ex.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    done
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-teal-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          done
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-stone-300 dark:border-stone-600'
                        }`}
                      >
                        {done && <Check className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold ${done ? 'text-emerald-900 dark:text-emerald-200 line-through' : 'text-stone-900 dark:text-stone-100'}`}>
                          {ex.name}
                        </h4>
                        <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                          <strong>Dose:</strong> {ex.sets} • {ex.frequency}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800">
                    <strong>Focus:</strong> {ex.focus}
                  </p>

                  <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 flex items-center">
                    <Info className="w-3 h-3 mr-1 shrink-0" />
                    <span>{ex.caution}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: RECOVERY PROGRESS & PAIN VAS */}
      {/* ========================================================================= */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-bold">
                Pain Reduction (VAS 0-10)
              </span>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-black text-emerald-600">
                  {currentUser.currentPainVAS}/10
                </span>
                <span className="text-xs text-stone-400 line-through">
                  from {currentUser.initialPainVAS}/10 on Day 1
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                62.5% reduction in subjective surgical joint pain.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-bold">
                Sessions Completed
              </span>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-black text-teal-700 dark:text-teal-400">
                  {currentUser.sessionsCompleted}/{currentUser.packageType}
                </span>
                <span className="text-xs text-stone-400">
                  ({Math.round((currentUser.sessionsCompleted / currentUser.packageType) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 mt-2">
                <div
                  className="bg-teal-600 h-2 rounded-full"
                  style={{ width: `${(currentUser.sessionsCompleted / currentUser.packageType) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-bold">
                Clinical Target Outcome
              </span>
              <p className="mt-2 text-xs font-medium text-stone-700 dark:text-stone-300 leading-relaxed">
                "{currentUser.targetOutcome}"
              </p>
              <div className="text-[10px] text-emerald-600 font-bold mt-2">
                ✓ On track for milestone discharge by Session 20
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PACKAGE PAYMENTS & DIGITAL RECEIPTS */}
      {/* ========================================================================= */}
      {activeTab === 'receipts' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Official Digital Receipts & Invoices
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                GST compliant physiotherapy invoices valid for health insurance / mediclaim reimbursement.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Payment Status: {currentUser.paymentStatus}
            </span>
          </div>

          <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs text-stone-400 uppercase font-semibold">
                Invoice #SHK-2026-0489 • SAC Code 999312
              </div>
              <div className="text-lg font-black text-stone-900 dark:text-stone-100 mt-1">
                {currentUser.packageType}-Session Comprehensive Rehabilitation Package
              </div>
              <div className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                Amount Paid: <strong>₹{currentUser.amountPaid.toLocaleString('en-IN')}</strong> (via UPI Ref: 308942718921)
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Downloading official GST digital receipt for ${currentUser.fullName} (Invoice #SHK-2026-0489)...`);
              }}
              className="inline-flex items-center px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download PDF Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
