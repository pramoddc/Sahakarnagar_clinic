import React, { useState, useRef } from 'react';
import {
  Briefcase,
  GraduationCap,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  ShieldCheck,
  Send,
  X,
  Phone,
  Mail,
  User,
  Award,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Building2,
  HeartHandshake,
  FileCheck
} from 'lucide-react';

interface PositionRequirement {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  degree: string;
  councilRegistration: string;
  experience: string;
  locationAndShift: string;
  keyResponsibilities: string[];
  mandatoryQualifications: string[];
  preferredCertifications: string[];
  compensationRange: string;
}

export const CLINICAL_POSITIONS: PositionRequirement[] = [
  {
    id: 'lead-pt',
    title: 'Lead In-Clinic Physiotherapist',
    badge: 'Immediate Opening',
    badgeColor: 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200 border-teal-300 dark:border-teal-800',
    degree: 'Master of Physiotherapy (MPT) in Orthopedics, Musculoskeletal, or Sports Rehabilitation',
    councilRegistration: 'Mandatory MIAP (Indian Association of Physiotherapists) or Karnataka State Council Registration',
    experience: '3+ years of clinical experience in outpatient orthopedic rehabilitation & post-surgical management',
    locationAndShift: '600 sq ft Clinic on 60 Feet Road, Sahakarnagar (Morning 08:00 - 13:00 / Evening 17:00 - 20:30)',
    keyResponsibilities: [
      'Conduct evidence-based clinical assessments, ROM measurement, and personalized rehab roadmaps',
      'Manage post-op arthroplasty protocols (Total Knee Replacement, Total Hip Replacement, ACL reconstruction)',
      'Oversee 3 private treatment bays, electrotherapy modalities (IFT, TENS, EMS, Ultrasound), and active rehab gym',
      'Coordinate patient clinical notes and discharge reports with referring surgeons at Aster CMI and Manipal Hospitals'
    ],
    mandatoryQualifications: [
      'MPT from an UGC-recognized institution with strong grounding in biomechanics',
      'Demonstrated expertise in spinal manual therapy (Maitland, Mulligan, or McKenzie protocols)',
      'Clean council record with current professional indemnity coverage'
    ],
    preferredCertifications: [
      'Certified Dry Needling Therapist (CDNT / CMP)',
      'Kinesio-Taping (CKTP) or Instrument-Assisted Soft Tissue Mobilization (IASTM)',
      'Basic Life Support (BLS) certified'
    ],
    compensationRange: '₹45,000 - ₹55,000 / month + Session Performance Incentives + Annual CME Allowance'
  },
  {
    id: 'mobile-pt',
    title: 'Senior Mobile & Geriatric Physiotherapist',
    badge: 'Active Hiring',
    badgeColor: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800',
    degree: 'Bachelor of Physiotherapy (BPT) or MPT (Neurology / Geriatrics)',
    councilRegistration: 'State Physiotherapy Council or MIAP membership required',
    experience: '1 to 3 years in geriatric balance retraining, post-stroke hemiparesis, or home-care rehabilitation',
    locationAndShift: 'Sahakarnagar & Judicial Layout 3.5 km Doorstep Radius (Afternoon Shift 13:30 - 17:30)',
    keyResponsibilities: [
      'Deliver dignified 1-on-1 home visits for elderly seniors with osteoarthritis, Parkinson’s, and mobility deficits',
      'Perform Timed Up & Go (TUG), Berg Balance Scale, and home hazard audits to prevent senior falls',
      'Operate portable combo electrotherapy units and digital vitals monitors (BP, SpO2, blood glucose)',
      'Counsel family caregivers regarding transfer ergonomics, walker/wheelchair adjustments, and exercise compliance'
    ],
    mandatoryQualifications: [
      'Valid Two-Wheeler driving license and personal two-wheeler for local Sahakarnagar transit',
      'High clinical empathy and patience with elderly and post-operative patients',
      'Punctual schedule management adhering to pre-slotted transit windows'
    ],
    preferredCertifications: [
      'Neurodevelopmental Therapy (NDT) or Bobath concept coursework',
      'Geriatric fall prevention training',
      'Fluency in Kannada and English (Hindi is an added bonus)'
    ],
    compensationRange: '₹38,000 - ₹48,000 / month + ₹200 Fuel Allowance per visit + Performance Bonuses'
  },
  {
    id: 'consultant-pt',
    title: 'Weekend / Visiting Sports & Spine Specialist',
    badge: 'Part-Time / Locum',
    badgeColor: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 border-blue-300 dark:border-blue-800',
    degree: 'MPT in Sports Physiotherapy, Manual Therapy, or Orthopedics',
    councilRegistration: 'IAP / KAPC Registered',
    experience: '2+ years working with athletes, gym-goers, marathoners, or corporate techie spinal cases',
    locationAndShift: '60 Feet Road Clinic (Saturdays 09:00 - 14:00 or Sundays by prior booking)',
    keyResponsibilities: [
      'Handle acute sports strains, rotator cuff tendinopathy, plantar fasciitis, and running gait biomechanics',
      'Perform high-velocity low-amplitude (HVLA) mobilizations and myofascial release',
      'Design return-to-sport testing and corporate ergonomic correction programs'
    ],
    mandatoryQualifications: [
      'Proven hands-on manual therapy skills and biomechanical assessment capabilities',
      'Strong diagnostic acumen with differential diagnosis of soft tissue vs discogenic pain'
    ],
    preferredCertifications: [
      'Dry Needling, Cupping, and Athletic Taping credentials'
    ],
    compensationRange: 'Attractive Per-Session Revenue Share (₹450 - ₹600 per patient consultation)'
  },
  {
    id: 'operations-lead',
    title: 'Clinic Operations & Front Desk Lead',
    badge: 'Healthcare Admin',
    badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800',
    degree: 'BBA in Healthcare Administration, Hospital Management, or Allied Health Sciences',
    councilRegistration: 'N/A (Healthcare Operations Certificate preferred)',
    experience: '1+ years in medical clinic reception, hospital OPD desk, or wellness center administration',
    locationAndShift: 'Reception & Billing Bay, 60 Feet Road (08:00 - 17:00 Shift)',
    keyResponsibilities: [
      'Manage patient token flow, bay allocation, and phone/WhatsApp triage for incoming appointment requests',
      'Issue GST-compliant tax invoices (SAC 999312) and assist patients with corporate insurance claim paperwork',
      'Maintain daily patient registers and ensure clinical hygiene standards across treatment bays'
    ],
    mandatoryQualifications: [
      'Fluency in Kannada and English is required; Hindi is an asset',
      'Proficiency in MS Office / Google Sheets and medical scheduling software',
      'Courteous, calm telephone etiquette and customer-centric demeanor'
    ],
    preferredCertifications: [
      'Training in healthcare billing / TPA reimbursement processes'
    ],
    compensationRange: '₹18,000 - ₹24,000 / month + Annual Clinic Performance Bonus'
  }
];

interface JoinOurTeamProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const JoinOurTeamSection: React.FC<JoinOurTeamProps> = ({ onClose, isModal = false }) => {
  const [selectedPosition, setSelectedPosition] = useState<string>('lead-pt');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [applicationRef, setApplicationRef] = useState<string>('');

  // Form State
  const [candidateName, setCandidateName] = useState<string>('');
  const [candidateEmail, setCandidateEmail] = useState<string>('');
  const [candidatePhone, setCandidatePhone] = useState<string>('');
  const [candidateDegree, setCandidateDegree] = useState<string>('MPT - Orthopedics / Musculoskeletal');
  const [councilRegNo, setCouncilRegNo] = useState<string>('');
  const [experienceYears, setExperienceYears] = useState<string>('2-4 years');
  const [targetPosition, setTargetPosition] = useState<string>('Lead In-Clinic Physiotherapist');
  const [commuteStatus, setCommuteStatus] = useState<string>('Live in Sahakarnagar / North Bangalore with 2-Wheeler');
  const [linkedinOrPortfolio, setLinkedinOrPortfolio] = useState<string>('');
  const [coverNote, setCoverNote] = useState<string>('');
  const [attachedFileName, setAttachedFileName] = useState<string>('');
  const [attachedFileSize, setAttachedFileSize] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormError('File size exceeds 10 MB limit. Please attach a smaller PDF or Word document.');
        return;
      }
      setFormError(null);
      setAttachedFileName(file.name);
      const sizeInKb = Math.round(file.size / 1024);
      setAttachedFileSize(sizeInKb > 1000 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormError('File size exceeds 10 MB limit. Please attach a smaller PDF or Word document.');
        return;
      }
      setFormError(null);
      setAttachedFileName(file.name);
      const sizeInKb = Math.round(file.size / 1024);
      setAttachedFileSize(sizeInKb > 1000 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`);
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!candidateName.trim() || !candidateEmail.trim() || !candidatePhone.trim()) {
      setFormError('Please fill in your full name, email address, and active phone number.');
      return;
    }

    if (!attachedFileName && !linkedinOrPortfolio.trim()) {
      setFormError('Please either attach your CV (PDF/DOCX) or provide your LinkedIn/Portfolio link.');
      return;
    }

    setIsSubmitting(true);

    // Simulate realistic async upload and database registration
    setTimeout(() => {
      const generatedRef = `SHK-HR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setApplicationRef(generatedRef);
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 1200);
  };

  const handleResetForm = () => {
    setCandidateName('');
    setCandidateEmail('');
    setCandidatePhone('');
    setCouncilRegNo('');
    setLinkedinOrPortfolio('');
    setCoverNote('');
    setAttachedFileName('');
    setAttachedFileSize('');
    setFormSubmitted(false);
    setFormError(null);
  };

  const currentPos = CLINICAL_POSITIONS.find(p => p.id === selectedPosition) || CLINICAL_POSITIONS[0];

  return (
    <div className={isModal ? 'max-w-5xl mx-auto' : 'space-y-6'}>
      {/* Top Banner & Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-teal-900 via-stone-900 to-teal-950 text-white shadow-xl relative overflow-hidden">
        {/* Close Button if rendered inside a modal */}
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-400/20 text-teal-200 border border-teal-400/30">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            Clinical Recruitment & Careers • Sahakar Physio
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Join Our Clinical Team in Sahakarnagar
          </h1>

          <p className="text-sm text-stone-300 leading-relaxed">
            We are building North Bangalore’s premier evidence-based physiotherapy and elder rehabilitation practice. Explore our clinical prerequisites, practicing guardrails, and submit your CV directly to our clinical director.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-teal-200 font-medium">
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-teal-400" />
              74% Safe Therapist Workload Cap
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Building2 className="w-3.5 h-3.5 mr-1 text-teal-400" />
              600 sq ft Modern Clinic on 60 Feet Road
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Award className="w-3.5 h-3.5 mr-1 text-teal-400" />
              Annual CME & Skill Development Allowance
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Qualifications & Roles) vs Right Column (CV Submission Contact Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: CLINICAL QUALIFICATIONS & OPEN POSITIONS (7 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-teal-700 dark:text-teal-400" />
                Clinical Qualifications & Role Prerequisites
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Select a position to review degree requirements, council registrations, and shift hours
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {CLINICAL_POSITIONS.length} Open Profiles
            </span>
          </div>

          {/* Position Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CLINICAL_POSITIONS.map(pos => (
              <button
                key={pos.id}
                onClick={() => {
                  setSelectedPosition(pos.id);
                  setTargetPosition(pos.title);
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  selectedPosition === pos.id
                    ? 'border-teal-600 dark:border-teal-400 bg-teal-50/50 dark:bg-teal-950/40 shadow-xs ring-2 ring-teal-500/20'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border inline-block mb-1.5 ${pos.badgeColor}`}>
                  {pos.badge}
                </span>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-tight">
                  {pos.title}
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Qualifications Card for Active Selection */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5 animate-in fade-in-50 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mb-1 ${currentPos.badgeColor}`}>
                  {currentPos.badge}
                </span>
                <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                  {currentPos.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {currentPos.compensationRange.split('+')[0].trim()}
                </span>
              </div>
            </div>

            {/* Core Criteria Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 mr-1" />
                  Academic Degree
                </div>
                <div className="font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                  {currentPos.degree}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Council Registration
                </div>
                <div className="font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                  {currentPos.councilRegistration}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  Experience Required
                </div>
                <div className="font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                  {currentPos.experience}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  Location & Shift
                </div>
                <div className="font-semibold text-stone-900 dark:text-stone-100 leading-snug">
                  {currentPos.locationAndShift}
                </div>
              </div>
            </div>

            {/* Mandatory Qualifications & Technical Skills */}
            <div className="space-y-2 text-xs">
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center">
                <FileCheck className="w-4 h-4 mr-1.5 text-teal-600" />
                Mandatory Clinical Prerequisites
              </div>
              <ul className="space-y-1.5">
                {currentPos.mandatoryQualifications.map((item, idx) => (
                  <li key={idx} className="flex items-start text-stone-600 dark:text-stone-300">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Clinical Responsibilities */}
            <div className="space-y-2 text-xs">
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center">
                <Briefcase className="w-4 h-4 mr-1.5 text-teal-600" />
                Key Practice Responsibilities
              </div>
              <ul className="space-y-1.5">
                {currentPos.keyResponsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start text-stone-600 dark:text-stone-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preferred Certifications */}
            {currentPos.preferredCertifications.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80 space-y-1.5 text-xs">
                <div className="text-[11px] font-bold text-teal-900 dark:text-teal-200 flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1.5 text-teal-600 dark:text-teal-400" />
                  Valued Certifications & Skills:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentPos.preferredCertifications.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-800 text-[11px] font-medium text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clinical Culture & Therapist Well-being Commitments */}
          <div className="p-5 rounded-2xl bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs space-y-2">
            <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center">
              <HeartHandshake className="w-4 h-4 mr-1.5 text-teal-700 dark:text-teal-400" />
              Our Practitioner Well-Being Charter
            </div>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Unlike volume-driven commercial chains, Sahakar Physio caps clinical caseloads at a maximum 74% capacity (15–18 patients/day clinic-wide, 4–5 elder home visits max per mobile therapist). All mobile visits include dedicated 30-minute scooter transit buffers so you are never rushed.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: CONTACT FORM FOR SHARING CVS (5 COLS) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
                  Candidate Application & CV Submission
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Direct submission to Dr. Aditi Rao & the Clinical Hiring Committee
                </p>
              </div>
            </div>

            {formSubmitted ? (
              /* Success Screen */
              <div className="space-y-4 py-4 text-center animate-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                    Application Received
                  </span>
                  <h4 className="text-lg font-black text-stone-900 dark:text-stone-100">
                    Thank you, {candidateName}!
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
                    Your credentials and CV for the <strong className="text-stone-800 dark:text-stone-200">{targetPosition}</strong> position have been registered.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 dark:text-stone-400">Application Reference:</span>
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-400">{applicationRef}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 dark:text-stone-400">Reviewed By:</span>
                    <span className="font-medium text-stone-800 dark:text-stone-200">Dr. Aditi Rao (Lead PT)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 dark:text-stone-400">Turnaround Time:</span>
                    <span className="font-medium text-stone-800 dark:text-stone-200">Within 48 Working Hours</span>
                  </div>
                  {attachedFileName && (
                    <div className="flex items-center justify-between pt-1 border-t border-stone-200 dark:border-stone-700">
                      <span className="text-stone-500 dark:text-stone-400">Attached File:</span>
                      <span className="font-semibold text-stone-700 dark:text-stone-300 truncate max-w-[180px]">{attachedFileName}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <a
                    href={`https://wa.me/919886012345?text=${encodeURIComponent(
                      `Hello Dr. Aditi, I have submitted my CV for the ${targetPosition} position at Sahakar Physio. My Application Ref is ${applicationRef}. Name: ${candidateName}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <span>Connect on WhatsApp for Quick Review</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={handleResetForm}
                    className="w-full py-2 px-4 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Submit Another CV or Update Details
                  </button>
                </div>
              </div>
            ) : (
              /* Contact & Submission Form */
              <form onSubmit={handleSubmitApplication} className="space-y-3.5 text-xs">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Candidate Name */}
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Full Legal Name (as per Degree) *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={candidateName}
                      onChange={e => setCandidateName(e.target.value)}
                      placeholder="e.g. Dr. Rohan Deshmukh"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-600"
                    />
                  </div>
                </div>

                {/* Contact Email & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                      <input
                        type="email"
                        required
                        value={candidateEmail}
                        onChange={e => setCandidateEmail(e.target.value)}
                        placeholder="pt.rohan@gmail.com"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                      <input
                        type="tel"
                        required
                        value={candidatePhone}
                        onChange={e => setCandidatePhone(e.target.value)}
                        placeholder="+91 98860 12345"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Applying For & Qualification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Applying For Position
                    </label>
                    <select
                      value={targetPosition}
                      onChange={e => {
                        setTargetPosition(e.target.value);
                        const matched = CLINICAL_POSITIONS.find(p => p.title === e.target.value);
                        if (matched) setSelectedPosition(matched.id);
                      }}
                      className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-teal-600"
                    >
                      {CLINICAL_POSITIONS.map(p => (
                        <option key={p.id} value={p.title}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Highest Qualification
                    </label>
                    <select
                      value={candidateDegree}
                      onChange={e => setCandidateDegree(e.target.value)}
                      className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-teal-600"
                    >
                      <option value="MPT - Orthopedics / Musculoskeletal">MPT (Orthopedics / Musculoskeletal)</option>
                      <option value="MPT - Neurology / Geriatrics">MPT (Neurology / Geriatrics)</option>
                      <option value="MPT - Sports Sciences">MPT (Sports Sciences)</option>
                      <option value="BPT (Bachelor of Physiotherapy)">BPT (Bachelor of Physiotherapy)</option>
                      <option value="BBA / MHA Hospital Administration">BBA / MHA Healthcare Administration</option>
                      <option value="Other Allied Health Degree">Other Allied Health Degree</option>
                    </select>
                  </div>
                </div>

                {/* Council Registration No & Total Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Council / MIAP Reg. No.
                    </label>
                    <input
                      type="text"
                      value={councilRegNo}
                      onChange={e => setCouncilRegNo(e.target.value)}
                      placeholder="e.g. MIAP-48921 or KAPC-7812"
                      className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Clinical Experience
                    </label>
                    <select
                      value={experienceYears}
                      onChange={e => setExperienceYears(e.target.value)}
                      className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-teal-600"
                    >
                      <option value="Fresher / Internship Completing">Fresher / Intern</option>
                      <option value="1 - 2 years">1 - 2 years</option>
                      <option value="2 - 4 years">2 - 4 years</option>
                      <option value="4 - 7 years">4 - 7 years</option>
                      <option value="7+ years">7+ years (Senior Specialist)</option>
                    </select>
                  </div>
                </div>

                {/* Commute & Two-Wheeler Status */}
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Commute & Vehicle Availability
                  </label>
                  <select
                    value={commuteStatus}
                    onChange={e => setCommuteStatus(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="Live in Sahakarnagar / North Bangalore with 2-Wheeler">
                      Live in Sahakarnagar / Nearby with personal 2-wheeler
                    </option>
                    <option value="Within 5-8 km of Sahakarnagar (Yelahanka, Hebbal, Vidyaranyapura)">
                      Live within 5-8 km (Yelahanka / Hebbal / Vidyaranyapura)
                    </option>
                    <option value="Bangalore Resident (Comfortable commuting to 60 Feet Road)">
                      Bangalore Resident (Comfortable commuting to 60ft Rd)
                    </option>
                    <option value="Relocating to North Bangalore">Relocating to North Bangalore</option>
                  </select>
                </div>

                {/* CV File Upload Box (Supports Drag & Drop) */}
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Upload Your CV / Resume (PDF or DOCX, max 10MB) *
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {attachedFileName ? (
                    <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800 flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        <FileText className="w-5 h-5 text-teal-600 shrink-0" />
                        <div className="truncate">
                          <div className="font-bold text-stone-900 dark:text-stone-100 text-xs truncate">
                            {attachedFileName}
                          </div>
                          <div className="text-[10px] text-stone-500">{attachedFileSize}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAttachedFileName('');
                          setAttachedFileSize('');
                        }}
                        className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={e => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-stone-50 dark:bg-stone-800/40"
                    >
                      <Upload className="w-6 h-6 text-stone-400 dark:text-stone-500 mx-auto mb-1.5" />
                      <p className="font-semibold text-stone-700 dark:text-stone-300 text-xs">
                        Click to browse or drag & drop your CV here
                      </p>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                        PDF, DOCX up to 10MB
                      </p>
                    </div>
                  )}
                </div>

                {/* LinkedIn or Drive Link alternative */}
                <div>
                  <label className="block font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Or LinkedIn Profile / Online Portfolio Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={linkedinOrPortfolio}
                    onChange={e => setLinkedinOrPortfolio(e.target.value)}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                {/* Brief Cover Note */}
                <div>
                  <label className="block font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Brief Note on Clinical Strengths / Certifications
                  </label>
                  <textarea
                    rows={2}
                    value={coverNote}
                    onChange={e => setCoverNote(e.target.value)}
                    placeholder="e.g. Completed Dry Needling Level 2; 2 years experience with TKR rehabilitation and elderly gait training..."
                    className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-600 text-xs"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                      <span>Transmitting CV & Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application & Share CV</span>
                    </>
                  )}
                </button>

                <div className="pt-2 text-center text-[10px] text-stone-500 dark:text-stone-400">
                  <span>Questions? Email HR: </span>
                  <a href="mailto:careers@sahakarphysio.com" className="font-semibold text-teal-700 dark:text-teal-400 hover:underline">
                    careers@sahakarphysio.com
                  </a>
                  <span> • Clinic Desk: +91 98860 12345</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
