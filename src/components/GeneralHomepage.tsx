import React, { useState } from 'react';
import {
  Activity,
  MapPin,
  Calendar,
  Clock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Users,
  Home,
  HeartPulse,
  Sparkles,
  Award,
  ChevronRight,
  CheckCircle2,
  Receipt,
  BellRing,
  IndianRupee,
  LayoutGrid,
  TrendingUp,
  UserCheck,
  ExternalLink,
  MessageCircle,
  FileText,
  AlertCircle,
  Stethoscope,
  Send,
  X,
  QrCode,
  Smartphone,
  Search
} from 'lucide-react';
import { MobileQrModal } from './MobileQrModal';
import { InteractiveServiceMap } from './InteractiveServiceMap';
import { QuickChatWhatsAppWidget } from './QuickChatWhatsAppWidget';
import { HomepageSearchBar } from './HomepageSearchBar';
import { HomepageFAQSection } from './HomepageFAQSection';
import { ClinicSocialFeed } from './ClinicSocialFeed';

interface GeneralHomepageProps {
  onNavigateToPatientLogin: () => void;
  onNavigateToEmployeeLogin: () => void;
  onNavigateToSection: (sectionId: string) => void;
  onOpenExecutiveSummary: () => void;
}

export const GeneralHomepage: React.FC<GeneralHomepageProps> = ({
  onNavigateToPatientLogin,
  onNavigateToEmployeeLogin,
  onNavigateToSection,
  onOpenExecutiveSummary,
}) => {
  const [activeSpecialty, setActiveSpecialty] = useState<'geriatric' | 'ortho' | 'neuro' | 'techie' | 'sports'>('geriatric');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    phone: '',
    careType: 'clinic',
    preferredTime: 'Morning (09:00 - 12:00)',
    condition: 'Post-Surgery (TKR / THR)',
    notes: ''
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [highlightedFaqId, setHighlightedFaqId] = useState<string | null>(null);

  const handleSelectSpecialtyFromSearch = (specialtyId: 'geriatric' | 'ortho' | 'neuro' | 'techie' | 'sports') => {
    setActiveSpecialty(specialtyId);
    const el = document.getElementById('specialties-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectFaqFromSearch = (faqId: string) => {
    setHighlightedFaqId(faqId);
    const el = document.getElementById(faqId) || document.getElementById('faq-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookHomeVisitForCluster = (clusterName?: string) => {
    setBookingFormData(prev => ({
      ...prev,
      careType: 'home',
      preferredTime: 'Afternoon (01:30 - 04:30)',
      condition: 'Senior Care / Home Visit',
      notes: clusterName ? `Home care inquiry for: ${clusterName}` : prev.notes
    }));
    setIsBookingModalOpen(true);
  };

  const specialties = [
    {
      id: 'geriatric',
      title: 'Geriatric Fall Prevention & Home Visits',
      badge: 'Judicial & Sahakarnagar',
      icon: Home,
      tagline: 'Preserving Independence for Seniors at Home',
      description:
        'Tailored physical therapy in the comfort of home for elders with osteoporosis, Parkinson’s, dementia, and balance disorders. Includes home hazard audit, Timed Up and Go (TUG) mobility training, and caregiver handling drills.',
      highlights: [
        'Doorstep home visits with portable electrotherapy & mobility aids',
        'Fall risk reduction protocol and bed-to-chair safe transfer coaching',
        'Post-fracture (hip, spine) gradual weight-bearing re-education',
        'Serving Sahakarnagar Blocks A–G, Judicial Layout, Amruthahalli & Kodigehalli'
      ],
      price: '₹1,200 – ₹1,400 / home session',
      package: '20-Session Geriatric Continuity Package: ₹24,000'
    },
    {
      id: 'ortho',
      title: 'Post-Op Knee & Joint Replacement (TKR/THR)',
      badge: 'Aster CMI & Manipal Referral Line',
      icon: HeartPulse,
      tagline: 'Evidence-Based Surgical Rehabilitation Protocols',
      description:
        'Protocol-driven rehabilitation for Total Knee Replacement (TKR), Total Hip Replacement (THR), ACL reconstructions, and shoulder arthroplasty. Fast-tracks functional range of motion and safe stair climbing within 6 weeks.',
      highlights: [
        'Continuous cryotherapy, ultrasound, and patellar mobilization',
        'Targeted 115° knee flexion with minimal extension lag',
        'Step-over-step stair climbing and quad hypertrophy progression',
        'Daily digital clinical documentation shared with orthopedic surgeons'
      ],
      price: '₹800 – ₹900 / clinic bay session',
      package: '20-Session Post-Surgical Recovery Bundle: ₹16,000'
    },
    {
      id: 'techie',
      title: 'Tech-Spine & Ergonomics (Manyata Corridor)',
      badge: 'Evening Peak Slots 5:00 - 8:30 PM',
      icon: Activity,
      tagline: 'Relief for Prolonged Sitting & Tech Neck',
      description:
        'Designed specifically for software engineers and corporate professionals commuting along Outer Ring Road and Manyata Tech Park. Targets L4-L5 disc bulges, postural kyphosis, cervical radiculopathy, and repetitive strain.',
      highlights: [
        'McKenzie mechanical spine diagnosis & core stabilization',
        'Manual myofascial release, dry needling & spinal decompression',
        'Ergonomic workstation posture correction & home exercise routines',
        'Staggered late evening appointments accommodating IT commute schedules'
      ],
      price: '₹800 / clinic session',
      package: '10-Session Spine Restoration Package: ₹7,500'
    },
    {
      id: 'neuro',
      title: 'Neuro & Post-Stroke Hemiparesis Rehab',
      badge: 'Neurodevelopmental Protocol',
      icon: Stethoscope,
      tagline: 'Re-wiring Neural Pathways & Functional Re-learning',
      description:
        'Specialized neuro-rehabilitation following stroke (MCA/ACA infarct), Bell’s palsy, traumatic brain injury, and spinal cord lesions using task-oriented motor retraining and proprioceptive neuromuscular facilitation.',
      highlights: [
        'Gait retraining with body-weight support harness assistance',
        'Spasticity management, active-assisted upper limb functional drills',
        'Fine motor dexterity training and balance recovery board work',
        'Caregiver education on positioning and pressure sore prevention'
      ],
      price: '₹900 (Clinic) / ₹1,400 (Home Care)',
      package: '25-Session Neuro Recovery Package: ₹21,000'
    },
    {
      id: 'sports',
      title: 'Sports Injury, Tendinopathy & Dry Needling',
      badge: 'Athlete Return-to-Play',
      icon: Award,
      tagline: 'High-Performance Musculoskeletal Restoration',
      description:
        'Accelerated rehab for ligament sprains, rotator cuff tears, plantar fasciitis, tennis elbow, and Achilles tendinopathy with functional return-to-sport testing and biomechanical video gait assessment.',
      highlights: [
        'Certified dry needling and instrument-assisted soft tissue mobilization (IASTM)',
        'Eccentric tendon loading protocols and agility ladder work',
        'Kinesiology sports taping and joint stability biomechanics',
        'Return-to-sport functional symmetry testing'
      ],
      price: '₹900 / clinic session',
      package: '12-Session Active Return Package: ₹9,800'
    }
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setBookingSubmitted(false);
      setIsBookingModalOpen(false);
      setBookingFormData({
        name: '',
        phone: '',
        careType: 'clinic',
        preferredTime: 'Morning (09:00 - 12:00)',
        condition: 'Post-Surgery (TKR / THR)',
        notes: ''
      });
    }, 2000);
  };

  const activeSpecialtyData = specialties.find(s => s.id === activeSpecialty)!;

  return (
    <div className="space-y-12 pb-12">
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: WELCOME TO SAHAKAR PHYSIO */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-teal-950 to-stone-950 text-white p-6 sm:p-10 lg:p-12 border border-teal-800/60 shadow-xl">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-teal-300 shrink-0" />
              <span>Sahakarnagar Premier Physiotherapy & Elder Care</span>
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-stone-800/80 text-stone-300 border border-stone-700">
              <MapPin className="w-3.5 h-3.5 mr-1 text-teal-400 shrink-0" />
              <span>60 Feet Road, Near Aster CMI & Manyata IT Hub</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Specialized Physiotherapy & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-200 to-teal-100">
              Compassionate Elder Home-Care
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base lg:text-lg text-teal-100/90 max-w-2xl leading-relaxed">
            Combining a state-of-the-art 600 sq ft clinic in Sahakarnagar with dedicated doorstep geriatric rehabilitation across North Bangalore. Tailored recovery plans for post-surgical recovery, chronic spine pain, and senior mobility.
          </p>

          {/* Quick CTA Action Row - Mobile-First Full Stack & Touch-Optimized for Senior Users */}
          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-3.5">
            {/* Primary CTA 1: Patient & Caregiver Portal */}
            <button
              onClick={onNavigateToPatientLogin}
              id="hero-btn-patient-portal"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[52px] sm:min-h-[48px] px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-[0.99] text-stone-950 font-black text-base sm:text-sm transition-all shadow-lg hover:shadow-teal-500/25 cursor-pointer touch-manipulation"
            >
              <Users className="w-5 h-5 mr-2.5 text-stone-950 shrink-0" />
              <span>Patient & Caregiver Portal</span>
              <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
            </button>

            {/* Primary CTA 2: Book Consultation / Home Visit */}
            <button
              onClick={() => setIsBookingModalOpen(true)}
              id="hero-btn-book-consult"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[52px] sm:min-h-[48px] px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-black text-base sm:text-sm border border-emerald-400/50 shadow-lg hover:shadow-emerald-600/30 transition-all cursor-pointer touch-manipulation"
            >
              <Calendar className="w-5 h-5 mr-2.5 text-emerald-200 shrink-0" />
              <span>Book Appointment / Home Visit</span>
            </button>

            {/* CTA 3: Get Mobile Link (Dynamic QR Code) */}
            <button
              onClick={() => setIsQrModalOpen(true)}
              id="hero-btn-mobile-link"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[50px] sm:min-h-[48px] px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-stone-950 font-black text-base sm:text-sm transition-all shadow-md cursor-pointer touch-manipulation"
            >
              <QrCode className="w-5 h-5 mr-2 text-stone-950 shrink-0" />
              <span>Get Mobile Link</span>
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-black uppercase rounded bg-stone-950/20 text-stone-950">
                QR Code
              </span>
            </button>

            {/* CTA 4: Staff & Employee OS */}
            <button
              onClick={onNavigateToEmployeeLogin}
              id="hero-btn-employee-portal"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-5 py-3 rounded-2xl bg-stone-800/90 hover:bg-stone-800 active:scale-[0.99] text-stone-200 font-bold text-sm border border-stone-700 hover:border-teal-500 transition-all cursor-pointer touch-manipulation"
            >
              <Stethoscope className="w-4 h-4 mr-2 text-teal-400 shrink-0" />
              <span>Staff & Clinical Login</span>
            </button>
          </div>

          {/* Mobile QR & Quick Access Strip - Touch Optimized */}
          <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 p-3.5 sm:py-2.5 sm:px-4 rounded-2xl bg-stone-900/90 border border-teal-700/50 text-xs text-teal-100/90 shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
                <QrCode className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium">Open Portal on your phone:</span>
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer inline-flex items-center ml-1 py-1"
              >
                Scan Live QR →
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-teal-800/50">
              <a
                href="#service-area-map"
                className="font-semibold text-teal-200 hover:text-white inline-flex items-center py-1 px-2.5 rounded-lg bg-teal-950/60 border border-teal-800/60 hover:bg-teal-900 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Service Radius Map ↓
              </a>

              <a
                href="#homepage-search-section"
                onClick={() => {
                  const input = document.getElementById('homepage-main-search-input');
                  input?.focus();
                }}
                className="font-semibold text-teal-200 hover:text-white inline-flex items-center py-1 px-2.5 rounded-lg bg-teal-950/60 border border-teal-800/60 hover:bg-teal-900 transition-colors"
              >
                <Search className="w-3.5 h-3.5 mr-1 text-teal-300" />
                Search Directory (/) ↓
              </a>
            </div>
          </div>

          {/* Key Stat Badges - Responsive Touch Friendly Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-6 border-t border-teal-800/40">
            <div className="p-3 rounded-2xl bg-teal-950/50 border border-teal-800/40">
              <div className="text-xl sm:text-2xl font-black text-white">600 sq ft</div>
              <div className="text-[11px] sm:text-xs text-teal-200/80 mt-0.5">Equipped Clinic Facility</div>
            </div>
            <div className="p-3 rounded-2xl bg-teal-950/50 border border-teal-800/40">
              <div className="text-xl sm:text-2xl font-black text-white">15-Min</div>
              <div className="text-[11px] sm:text-xs text-teal-200/80 mt-0.5">Home Visit Dispatch</div>
            </div>
            <div className="p-3 rounded-2xl bg-teal-950/50 border border-teal-800/40">
              <div className="text-xl sm:text-2xl font-black text-white">92%</div>
              <div className="text-[11px] sm:text-xs text-teal-200/80 mt-0.5">3-Session Continuity</div>
            </div>
            <div className="p-3 rounded-2xl bg-teal-950/50 border border-teal-800/40">
              <div className="text-xl sm:text-2xl font-black text-white">Aster & Manipal</div>
              <div className="text-[11px] sm:text-xs text-teal-200/80 mt-0.5">Surgeon Referral Line</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1B. SENIOR & CAREGIVER DIRECT HELPLINE BAR (TOUCH-OPTIMIZED FOR MOBILE)   */}
      {/* ========================================================================= */}
      <section className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-500/40 dark:border-amber-700/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs font-bold mt-0.5">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 dark:bg-amber-500/30 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded">
                Senior & Family Caregiver Support
              </span>
              <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">
                Ground Floor • No Steps
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 mt-0.5">
              Need Assistance Booking or Have Elder Mobility Questions?
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 max-w-xl leading-relaxed">
              Our front-desk care coordinator (Pooja Hegde) is available on phone & WhatsApp. In-clinic wheelchair ramp and dedicated patient parking available at 60 Feet Road.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <a
            href="tel:+918023628900"
            id="mobile-call-clinic-btn"
            className="inline-flex items-center justify-center min-h-[50px] px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm transition-all shadow-sm cursor-pointer touch-manipulation"
          >
            <Phone className="w-4 h-4 mr-2 shrink-0" />
            <span>Call Clinic: +91 80 2362 8900</span>
          </a>

          <a
            href="https://wa.me/919845021980?text=Hello%20Sahakar%20Physio%2C%20I%20am%20inquiring%20about%20elder%20care%20%2F%20physiotherapy%20sessions."
            target="_blank"
            rel="noreferrer"
            id="mobile-whatsapp-doctor-btn"
            className="inline-flex items-center justify-center min-h-[50px] px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-stone-950 font-black text-sm transition-all shadow-sm cursor-pointer touch-manipulation"
          >
            <MessageCircle className="w-4 h-4 mr-2 shrink-0" />
            <span>WhatsApp Doctor: 98450 21980</span>
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. UNIFIED SEARCH BAR: DIRECTORY, PROGRAMS & FAQ DIRECT SEARCH */}
      {/* ========================================================================= */}
      <section id="homepage-search-section" className="space-y-3 pt-1">
        <div className="text-center max-w-xl mx-auto mb-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            Smart Directory & Service Search
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight mt-1.5">
            Quickly Search Directory, Programs & FAQs
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Instant search across clinical management tools, rehabilitation packages, insurance answers, and apartment societies
          </p>
        </div>

        <HomepageSearchBar
          onNavigateToSection={onNavigateToSection}
          onSelectSpecialty={handleSelectSpecialtyFromSearch}
          onOpenBookingModal={() => setIsBookingModalOpen(true)}
          onOpenExecutiveSummary={onOpenExecutiveSummary}
          onSelectFaqItem={handleSelectFaqFromSearch}
        />
      </section>

      {/* ========================================================================= */}
      {/* 3. THREE CORE SECTION TILES: QUICK ACCESS GATEWAY */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Sahakar Operating System Gateway
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Direct access for patients, family caregivers, and clinical team members
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            3 Integrated Sections
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Public Homepage & Services (Current View) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border-2 border-teal-600/80 dark:border-teal-500 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-3.5 right-3.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                Current View
              </span>
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                1) General Homepage & Directory
              </h3>
              <p className="text-xs sm:text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                Explore specialized rehabilitation programs, clinic location on 60 Feet Road, geriatric home visit radius, transparent pricing, and instant booking links.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg text-xs sm:text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  Clinical Programs
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs sm:text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                  Service Map
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs sm:text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  Elder FAQs
                </span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => {
                  const el = document.getElementById('quick-links-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full min-h-[50px] sm:min-h-[44px] py-3 px-4 rounded-xl bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-teal-800 font-bold text-sm sm:text-xs flex items-center justify-center space-x-2 cursor-pointer touch-manipulation"
              >
                <span>Browse Directory Links ↓</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Login for Patients */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-teal-500/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                2) Patient & Caregiver Login
              </h3>
              <p className="text-xs sm:text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                Sign in with mobile number or Patient ID to check upcoming appointments, confirm your next 3 sessions, practice prescribed home exercises (HEP), and download official GST digital receipts.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg text-xs sm:text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  Upcoming Sessions
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs sm:text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  Confirm 3 Sessions
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs sm:text-[10px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                  Home Exercises
                </span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={onNavigateToPatientLogin}
                id="tile-btn-patient-login"
                className="w-full min-h-[52px] sm:min-h-[44px] py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-stone-950 font-black text-sm sm:text-xs transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer touch-manipulation"
              >
                <span>Enter Patient Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Login for Employees */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-teal-500/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                3) Employee & Clinical OS Login
              </h3>
              <p className="text-xs sm:text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                Role-based access for Lead Physiotherapist (Dr. Aditi Rao), Mobile Care Specialist (Dr. Vikram), and Operations Manager. Access Smart Scheduler, EMR, Billing, and 48h Quick Broadcast.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg text-xs sm:text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Smart Scheduler
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs sm:text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  Clinical EMR
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs sm:text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                  48h Broadcast
                </span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={onNavigateToEmployeeLogin}
                id="tile-btn-employee-login"
                className="w-full min-h-[52px] sm:min-h-[44px] py-3.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white font-black text-sm sm:text-xs transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer touch-manipulation"
              >
                <span>Launch Clinical OS (Staff)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BETTER LINKS HUB: NAVIGATION DIRECTORY (USER REQUEST HIGHLIGHT) */}
      {/* ========================================================================= */}
      <section id="quick-links-section" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <LayoutGrid className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Clinic Navigation & Quick Links Hub
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Direct shortcuts to every clinical management tool, patient service, and strategic module
            </p>
          </div>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Click any card to jump directly into the workspace
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Link 1: Smart Unified Scheduler */}
          <div
            onClick={() => onNavigateToSection('scheduler')}
            className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:border-teal-300 dark:hover:border-teal-700 active:scale-[0.99] active:bg-teal-100/60 transition-all cursor-pointer group flex flex-col justify-between min-h-[115px] touch-manipulation"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                  Live Bays
                </span>
              </div>
              <h4 className="text-base sm:text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                Smart Scheduler
              </h4>
              <p className="text-xs sm:text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Visual slot allocation across 3 clinic bays and home-care mobile routes.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-700/50 text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center min-h-[36px]">
              <span>Open Scheduler</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Link 2: Patient Reminder Log & 48h Broadcast */}
          <div
            onClick={() => onNavigateToSection('reminders')}
            className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-300 dark:hover:border-amber-700 active:scale-[0.99] active:bg-amber-100/60 transition-all cursor-pointer group flex flex-col justify-between min-h-[115px] touch-manipulation"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                  <BellRing className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                  3-Sess Alert
                </span>
              </div>
              <h4 className="text-base sm:text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                Reminders & 48h Broadcast
              </h4>
              <p className="text-xs sm:text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Automated SMS & WhatsApp outreach for unconfirmed slots and quick broadcast.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-700/50 text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center min-h-[36px]">
              <span>View Reminders</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Link 3: Billing & Invoices */}
          <div
            onClick={() => onNavigateToSection('billing')}
            className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:border-teal-300 dark:hover:border-teal-700 active:scale-[0.99] active:bg-teal-100/60 transition-all cursor-pointer group flex flex-col justify-between min-h-[115px] touch-manipulation"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-200 dark:bg-teal-900 text-teal-950 dark:text-teal-100">
                  GST Invoices
                </span>
              </div>
              <h4 className="text-base sm:text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                Billing & Digital Receipts
              </h4>
              <p className="text-xs sm:text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Single-session UPI billing, package installment plans & PDF receipts.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-700/50 text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center min-h-[36px]">
              <span>Manage Billing</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Link 4: Patient Records & EMR */}
          <div
            onClick={() => onNavigateToSection('patients')}
            className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 active:scale-[0.99] active:bg-blue-100/60 transition-all cursor-pointer group flex flex-col justify-between min-h-[115px] touch-manipulation"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200">
                  EMR & Red Flags
                </span>
              </div>
              <h4 className="text-base sm:text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                Patient Medical Records
              </h4>
              <p className="text-xs sm:text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Chronic health history, past orthopedic surgeries, and allergy alerts.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-700/50 text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center min-h-[36px]">
              <span>Open Patient Records</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Link 5: Financial Modeler & P&L */}
          <div
            onClick={() => onNavigateToSection('financials')}
            className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:border-teal-300 dark:hover:border-teal-700 active:scale-[0.99] active:bg-teal-100/60 transition-all cursor-pointer group flex flex-col justify-between min-h-[115px] touch-manipulation"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200">
                  ₹40L Model
                </span>
              </div>
              <h4 className="text-base sm:text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                Financial Modeler & P&L
              </h4>
              <p className="text-xs sm:text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Interactive sensitivity levers, operational cash burn, and breakeven.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-700/50 text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center min-h-[36px]">
              <span>Simulate Financials</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Link 6: Staff Performance & Guardrails */}
          <div
            onClick={() => onNavigateToSection('performance')}
            className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-700 active:scale-[0.99] active:bg-emerald-100/60 transition-all cursor-pointer group flex flex-col justify-between min-h-[115px] touch-manipulation"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  74% Safe Cap
                </span>
              </div>
              <h4 className="text-base sm:text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                Staff Performance & Safety
              </h4>
              <p className="text-xs sm:text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Real-time therapist utilization, transit fatigue protection & guardrails.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-700/50 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center min-h-[36px]">
              <span>View Staff Health</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Link 7: 600 sq ft Clinic Space & Floor Plan */}
          <div
            onClick={() => onNavigateToSection('clinic')}
            className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:border-teal-300 dark:hover:border-teal-700 active:scale-[0.99] active:bg-teal-100/60 transition-all cursor-pointer group flex flex-col justify-between min-h-[115px] touch-manipulation"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                  Bay Setup
                </span>
              </div>
              <h4 className="text-base sm:text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                Clinic Space & Bays
              </h4>
              <p className="text-xs sm:text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Treatment bays, exercise gym, electrotherapy unit, and reception layout.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-700/50 text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center min-h-[36px]">
              <span>Explore Floor Plan</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Link 8: Growth Roadmap & Executive Plan */}
          <div
            onClick={onOpenExecutiveSummary}
            className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:border-teal-300 dark:hover:border-teal-700 active:scale-[0.99] active:bg-teal-100/60 transition-all cursor-pointer group flex flex-col justify-between min-h-[115px] touch-manipulation"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-teal-800 text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-700 text-white">
                  Full PDF Ready
                </span>
              </div>
              <h4 className="text-base sm:text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                Executive Operating Plan
              </h4>
              <p className="text-xs sm:text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                Printable business roadmap, Capex allocation, and marketing plan.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-700/50 text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center min-h-[36px]">
              <span>View Executive Plan</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CLINICAL SPECIALTY SHOWCASE & PACKAGES */}
      {/* ========================================================================= */}
      <section id="specialties-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Clinical Programs & Rehabilitation Specialties
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Evidence-based care for seniors, surgical patients, and Manyata tech corridor workers
            </p>
          </div>

          {/* Specialty selector buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-none">
            {specialties.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSpecialty(s.id as any)}
                className={`min-h-[46px] sm:min-h-[38px] px-3.5 sm:px-3 py-2.5 sm:py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer touch-manipulation active:scale-[0.98] flex items-center justify-center ${
                  activeSpecialty === s.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {s.title.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center border border-teal-200 dark:border-teal-800 shrink-0">
                <activeSpecialtyData.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {activeSpecialtyData.badge}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                  {activeSpecialtyData.title}
                </h3>
              </div>
            </div>

            <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">
              {activeSpecialtyData.tagline}
            </p>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {activeSpecialtyData.description}
            </p>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Treatment Protocol Includes:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeSpecialtyData.highlights.map((h, i) => (
                  <div key={i} className="flex items-start text-xs text-stone-600 dark:text-stone-400">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Booking Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Pricing & Care Packages
              </span>
              <div>
                <div className="text-xl font-black text-stone-900 dark:text-stone-100">
                  {activeSpecialtyData.price}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Individual evaluated session
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-xs">
                <div className="font-bold text-teal-900 dark:text-teal-200">Recommended Bundle:</div>
                <div className="text-teal-800 dark:text-teal-300 mt-0.5 font-semibold">
                  {activeSpecialtyData.package}
                </div>
                <div className="text-[11px] text-teal-700 dark:text-teal-400 mt-1 leading-relaxed">
                  Includes initial assessment, progress re-evaluation, and home exercise charts.
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-700 space-y-2.5">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full min-h-[52px] sm:min-h-[44px] py-3.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white font-black text-sm transition-colors shadow-xs flex items-center justify-center space-x-2 cursor-pointer touch-manipulation"
              >
                <Calendar className="w-4 h-4 mr-1" />
                <span>Book Initial Evaluation</span>
              </button>
              <button
                onClick={onNavigateToPatientLogin}
                className="w-full min-h-[48px] sm:min-h-[40px] py-3 px-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-700 active:scale-[0.99] text-stone-700 dark:text-stone-300 font-bold text-xs sm:text-xs transition-colors flex items-center justify-center cursor-pointer touch-manipulation"
              >
                Existing Patient? View Your Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. INTERACTIVE SERVICE RADIUS & APARTMENT CLUSTERS MAP */}
      {/* ========================================================================= */}
      <InteractiveServiceMap
        onBookHomeVisit={handleBookHomeVisitForCluster}
        onNavigateToSection={onNavigateToSection}
      />

      {/* ========================================================================= */}
      {/* 7. INSTAGRAM SOCIAL FEED: HEALTH TIPS & ERGONOMIC ADVICE */}
      {/* ========================================================================= */}
      <ClinicSocialFeed
        onBookConsultation={() => setIsBookingModalOpen(true)}
        onNavigateToPortal={onNavigateToPatientLogin}
      />

      {/* ========================================================================= */}
      {/* 8. FREQUENTLY ASKED QUESTIONS (FAQ) SECTION */}
      {/* ========================================================================= */}
      <HomepageFAQSection
        onNavigateToSection={onNavigateToSection}
        onSelectSpecialty={handleSelectSpecialtyFromSearch}
        onOpenBookingModal={() => setIsBookingModalOpen(true)}
        highlightedFaqId={highlightedFaqId}
      />

      {/* ========================================================================= */}
      {/* 9. CLINIC LOCATION, ACCESSIBILITY & CONTACT INFO */}
      {/* ========================================================================= */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-stone-900 to-teal-950 text-white border border-stone-800 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Clinic Location */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-teal-300 font-bold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Clinic Location</span>
            </div>
            <h4 className="text-base font-bold text-white">Sahakar Physio Centre</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              #48, 60 Feet Road, F-Block, Sahakarnagar,<br />
              Bangalore - 560092 (Near Aster CMI Hospital & Columbia Asia / Manipal Hebbal)
            </p>
            <p className="text-[11px] text-teal-300/80">
              Ground-floor wheelchair ramp • Dedicated patient car & ambulance parking
            </p>
          </div>

          {/* Operating Hours */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-teal-300 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Operating Hours</span>
            </div>
            <h4 className="text-base font-bold text-white">Monday to Saturday</h4>
            <div className="text-xs text-stone-300 space-y-1">
              <div><strong>Morning Session:</strong> 08:00 AM – 01:00 PM</div>
              <div><strong>Elder Home Visits:</strong> 01:30 PM – 04:30 PM</div>
              <div><strong>Evening Session:</strong> 05:00 PM – 08:30 PM</div>
              <div className="text-[11px] text-amber-300">Sunday: Emergency post-op home care by prior appointment</div>
            </div>
          </div>

          {/* Contact & WhatsApp */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-teal-300 font-bold text-xs uppercase tracking-wider">
              <Phone className="w-4 h-4" />
              <span>Contact & Helplines</span>
            </div>
            <h4 className="text-base font-bold text-white">Direct Clinical Desk</h4>
            <div className="text-xs text-stone-300 space-y-1">
              <div>
                Reception: <a href="tel:+918023628900" className="underline hover:text-teal-300 font-bold touch-manipulation">+91 80 2362 8900</a>
              </div>
              <div>
                Doctor WhatsApp: <a href="https://wa.me/919845021980" target="_blank" rel="noreferrer" className="underline hover:text-emerald-300 font-bold touch-manipulation">+91 98450 21980</a>
              </div>
            </div>
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href="https://wa.me/919845021980?text=Hello%20Sahakar%20Physio%2C%20I%20would%20like%20to%20inquire%20about%20physiotherapy%20sessions."
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm transition-colors shadow-xs touch-manipulation"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span>WhatsApp Clinic</span>
              </a>
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold text-sm transition-colors shadow-xs cursor-pointer touch-manipulation"
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. MODAL: APPOINTMENT / HOME VISIT BOOKING INQUIRY */}
      {/* ========================================================================= */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                    Book Consultation / Home Visit
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Sahakarnagar, Bangalore (Direct Clinic Desk)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 touch-manipulation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSubmitted ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Appointment Inquiry Received!
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                  Our front-desk care coordinator (Pooja Hegde) will call you within 15 minutes to confirm your preferred slot.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Patient / Caregiver Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingFormData.name}
                    onChange={e => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                    placeholder="e.g. Suryanarayana Rao or Caregiver Priya"
                    className="w-full min-h-[48px] p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingFormData.phone}
                    onChange={e => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                    placeholder="e.g. +91 98450 21980"
                    className="w-full min-h-[48px] p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      Care Location
                    </label>
                    <select
                      value={bookingFormData.careType}
                      onChange={e => setBookingFormData({ ...bookingFormData, careType: e.target.value })}
                      className="w-full min-h-[48px] p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm"
                    >
                      <option value="clinic">In-Clinic Bay (60 Feet Road)</option>
                      <option value="home_care">Elder Home Visit (Sahakarnagar/Judicial)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      Preferred Time Window
                    </label>
                    <select
                      value={bookingFormData.preferredTime}
                      onChange={e => setBookingFormData({ ...bookingFormData, preferredTime: e.target.value })}
                      className="w-full min-h-[48px] p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm"
                    >
                      <option value="Morning">Morning (08:30 - 12:00)</option>
                      <option value="Afternoon">Afternoon Home Visits (1:30 - 4:30)</option>
                      <option value="Evening">Evening Techie Hours (5:00 - 8:30)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Primary Condition / Diagnosis
                  </label>
                  <select
                    value={bookingFormData.condition}
                    onChange={e => setBookingFormData({ ...bookingFormData, condition: e.target.value })}
                    className="w-full min-h-[48px] p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm"
                  >
                    <option value="Post-Surgery (TKR / THR)">Post-Op Joint Replacement (TKR/THR)</option>
                    <option value="Geriatric Mobility & Fall Prevention">Geriatric Mobility & Fall Prevention</option>
                    <option value="Spine Pain / Disc Bulge">Spine Pain / L4-L5 Disc Bulge (Tech Neck)</option>
                    <option value="Post-Stroke Neurological Rehab">Post-Stroke Hemiparesis / Neuro</option>
                    <option value="Frozen Shoulder & Sports Tendon">Frozen Shoulder & Sports Tendonitis</option>
                    <option value="General Pain Assessment">General Pain Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Additional Notes or Address (for Home Visits)
                  </label>
                  <textarea
                    rows={2}
                    value={bookingFormData.notes}
                    onChange={e => setBookingFormData({ ...bookingFormData, notes: e.target.value })}
                    placeholder="e.g. Patient is 74 years old, requires walker support at home in Judicial Layout."
                    className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="w-full sm:w-auto min-h-[48px] px-4 py-3 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 font-bold text-sm text-center cursor-pointer touch-manipulation"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto min-h-[52px] px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white font-bold text-sm shadow-xs flex items-center justify-center space-x-2 cursor-pointer touch-manipulation"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Dynamic QR Code Modal for Mobile Link */}
      <MobileQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onNavigateToPatientLogin={onNavigateToPatientLogin}
      />

      {/* Floating WhatsApp Quick Chat Action Button & Simulated Conversation Window */}
      <QuickChatWhatsAppWidget
        onNavigateToPatientLogin={onNavigateToPatientLogin}
        onOpenBookingModal={handleBookHomeVisitForCluster}
      />
    </div>
  );
};
