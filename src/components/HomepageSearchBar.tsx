import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  X,
  ArrowRight,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Activity,
  Calendar,
  MapPin,
  FileText,
  CreditCard,
  HeartPulse,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  Filter,
  Layers,
  UserCheck,
  IndianRupee,
  Home,
  Award
} from 'lucide-react';
import { FAQ_DATA, FAQItem } from './HomepageFAQSection';

export type SearchCategory = 'all' | 'directory' | 'programs' | 'faq';

export interface SearchResultItem {
  id: string;
  category: 'directory' | 'programs' | 'faq';
  categoryLabel: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  actionLabel: string;
  actionType: 'section' | 'specialty' | 'faq' | 'modal' | 'external';
  actionTarget: string;
  badge?: string;
  priceInfo?: string;
}

interface HomepageSearchBarProps {
  onNavigateToSection: (sectionId: string) => void;
  onSelectSpecialty: (specialtyId: 'geriatric' | 'ortho' | 'neuro' | 'techie' | 'sports') => void;
  onOpenBookingModal: () => void;
  onOpenExecutiveSummary: () => void;
  onSelectFaqItem?: (faqId: string) => void;
}

export const HomepageSearchBar: React.FC<HomepageSearchBarProps> = ({
  onNavigateToSection,
  onSelectSpecialty,
  onOpenBookingModal,
  onOpenExecutiveSummary,
  onSelectFaqItem
}) => {
  const [query, setQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search results dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard shortcut '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      } else if (e.key === 'Escape' && isFocused) {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused]);

  // Master index of searchable entities across Directory, Programs, and FAQs
  const searchIndex: SearchResultItem[] = useMemo(() => {
    const directoryItems: SearchResultItem[] = [
      {
        id: 'dir-scheduler',
        category: 'directory',
        categoryLabel: 'Clinical Directory',
        title: 'Smart Unified Scheduler',
        subtitle: 'Bay Allocation & Home Visit Dispatch Calendar',
        description: 'Manage doctor slots, morning clinic bays, afternoon elder home visits, token queuing, and therapist appointments.',
        tags: ['scheduler', 'calendar', 'appointments', 'slots', 'timing', 'queue', 'booking'],
        actionLabel: 'Open Scheduler',
        actionType: 'section',
        actionTarget: 'scheduler',
        badge: 'Smart OS'
      },
      {
        id: 'dir-home-care',
        category: 'directory',
        categoryLabel: 'Clinical Directory',
        title: 'Home Care Logistics & Dispatch Engine',
        subtitle: 'Scooter Routes & Elder Visit Dispatch',
        description: 'Cluster-optimized dispatch for Sahakarnagar Blocks A–G, Judicial Layout, CQAL, and Kodigehalli within 3.5 km radius.',
        tags: ['home visit', 'elder care', 'scooter', 'dispatch', 'clusters', 'societies', 'transit', 'radius'],
        actionLabel: 'Open Dispatch Engine',
        actionType: 'section',
        actionTarget: 'home-care',
        badge: '3.5 km Radius'
      },
      {
        id: 'dir-billing',
        category: 'directory',
        categoryLabel: 'Clinical Directory',
        title: 'Billing, Receipts & GST Invoices',
        subtitle: 'SAC 999312 Compliant Official Invoices',
        description: 'Instant digital PDF tax receipts, package payment tracking, insurance claims documentation, and WhatsApp invoice sharing.',
        tags: ['billing', 'invoice', 'gst', 'receipts', 'sac 999312', 'insurance', 'reimbursement', 'tax', 'pdf'],
        actionLabel: 'View Billing Desk',
        actionType: 'section',
        actionTarget: 'billing',
        badge: 'Official Tax Bills'
      },
      {
        id: 'dir-patients',
        category: 'directory',
        categoryLabel: 'Clinical Directory',
        title: 'Patient Medical Records (EMR)',
        subtitle: 'Surgeon Referrals & Clinical History',
        description: 'Electronic medical records, Aster CMI and Manipal hospital referral notes, surgical post-op history, and allergy logs.',
        tags: ['emr', 'records', 'medical history', 'surgeries', 'aster', 'manipal', 'allergies', 'doctor notes'],
        actionLabel: 'Open Medical Records',
        actionType: 'section',
        actionTarget: 'patients',
        badge: 'Hospital Linked'
      },
      {
        id: 'dir-financials',
        category: 'directory',
        categoryLabel: 'Clinical Directory',
        title: 'Financial Modeler & P&L Simulator',
        subtitle: '₹40L CapEx, Levers & Operational Margins',
        description: 'Interactive sensitivity simulator for session volume, break-even months, therapist payroll, and equipment amortizations.',
        tags: ['financials', 'p&l', 'capex', 'investment', 'revenue', 'model', 'breakeven', 'costs'],
        actionLabel: 'Simulate Financials',
        actionType: 'section',
        actionTarget: 'financials',
        badge: '₹40L Model'
      },
      {
        id: 'dir-performance',
        category: 'directory',
        categoryLabel: 'Clinical Directory',
        title: 'Staff Performance & Safety Guardrails',
        subtitle: 'Therapist Load & Fatigue Caps',
        description: 'Enforces 74% safe utilization cap, transit fatigue protection between home visits, and clinical quality metrics.',
        tags: ['performance', 'staff', 'guardrails', 'utilization', 'burnout', 'safety', 'therapists'],
        actionLabel: 'View Staff Guardrails',
        actionType: 'section',
        actionTarget: 'performance',
        badge: '74% Safe Cap'
      },
      {
        id: 'dir-clinic-space',
        category: 'directory',
        categoryLabel: 'Clinical Directory',
        title: '600 sq ft Clinic Space & Bays',
        subtitle: 'Ground-floor Wheelchair Accessible Facility',
        description: 'Interactive floor plan with private treatment bays, exercise gym, electrotherapy station, and consultation room.',
        tags: ['clinic', 'space', 'floor plan', 'bays', 'gym', 'wheelchair', 'ramp', 'parking', '60ft road'],
        actionLabel: 'Explore Floor Plan',
        actionType: 'section',
        actionTarget: 'clinic',
        badge: '600 sq ft'
      },
      {
        id: 'dir-roadmap',
        category: 'directory',
        categoryLabel: 'Clinical Directory',
        title: 'Executive Operating Plan & PDF',
        subtitle: 'Strategic Roadmap & Business Blueprint',
        description: 'Comprehensive clinic blueprint, clinical protocols, marketing strategy, and downloadable executive PDF report.',
        tags: ['executive', 'roadmap', 'operating plan', 'pdf', 'strategy', 'marketing', 'blueprint'],
        actionLabel: 'Open Executive Plan',
        actionType: 'modal',
        actionTarget: 'executive_summary',
        badge: 'PDF Ready'
      },
      {
        id: 'dir-service-map',
        category: 'directory',
        categoryLabel: 'Clinical Directory',
        title: 'Interactive Service Radius & Apartment Clusters Map',
        subtitle: 'Geospatial Radar & Society Directory',
        description: 'Explore delivery zones across CQAL Layout, Judicial Layout, Alpine Pyramid, Tata Nagar, and Godrej Platinum with transit times.',
        tags: ['map', 'societies', 'apartments', 'cqal', 'judicial', 'alpine pyramid', 'tata nagar', 'godrej', 'radius'],
        actionLabel: 'View Service Map',
        actionType: 'section',
        actionTarget: 'service-map-scroll',
        badge: 'Visual Map'
      },
      {
        id: 'dir-patient-portal',
        category: 'directory',
        categoryLabel: 'Clinical Directory',
        title: 'Patient & Caregiver Portal',
        subtitle: 'Mobile Session Confirmation & Exercise Videos',
        description: 'Sign in with registered mobile number to confirm your next 3 sessions, practice home exercises (HEP), and download receipts.',
        tags: ['patient portal', 'caregiver', 'login', 'exercises', 'hep', 'confirmation', 'attendance'],
        actionLabel: 'Enter Patient Portal',
        actionType: 'section',
        actionTarget: 'patient-portal',
        badge: 'Self-Service'
      },
      {
        id: 'dir-careers',
        category: 'directory',
        categoryLabel: 'Clinical Directory',
        title: 'Join Our Team & Clinical Careers',
        subtitle: 'Physiotherapist Openings & CV Submission Form',
        description: 'Explore clinical qualifications for Lead In-Clinic Physiotherapists (MPT), Mobile Geriatric PTs (BPT/MPT), and Front Desk Operations. Submit your CV directly.',
        tags: ['careers', 'jobs', 'join our team', 'hiring', 'cv', 'resume', 'physiotherapist job', 'mpt', 'bpt', 'recruitment', 'work with us', 'vacancy', 'apply'],
        actionLabel: 'View Openings & Apply',
        actionType: 'section',
        actionTarget: 'careers',
        badge: 'We\'re Hiring'
      }
    ];

    const programItems: SearchResultItem[] = [
      {
        id: 'prog-geriatric',
        category: 'programs',
        categoryLabel: 'Clinical Programs',
        title: 'Geriatric Fall Prevention & Home Visits',
        subtitle: 'Preserving Independence for Seniors at Home',
        description: 'Tailored doorstep physical therapy for osteoporosis, Parkinson’s, dementia, and balance disorders. Includes home hazard audit and Timed Up and Go (TUG) mobility training.',
        tags: ['geriatric', 'elder', 'senior', 'fall prevention', 'home care', 'parkinson', 'dementia', 'balance', 'tug', 'osteoporosis'],
        actionLabel: 'View Program & Pricing',
        actionType: 'specialty',
        actionTarget: 'geriatric',
        badge: 'Judicial & Sahakarnagar',
        priceInfo: '₹1,200 – ₹1,400 / session • 20 Sessions: ₹24,000'
      },
      {
        id: 'prog-ortho',
        category: 'programs',
        categoryLabel: 'Clinical Programs',
        title: 'Post-Op Knee & Joint Replacement (TKR/THR)',
        subtitle: 'Evidence-Based Surgical Rehabilitation',
        description: 'Protocol-driven rehab for Total Knee Replacement (TKR), Total Hip Replacement (THR), and ACL reconstructions. Targets 115° knee flexion and safe stair climbing within 6 weeks.',
        tags: ['knee replacement', 'tkr', 'hip replacement', 'thr', 'post op', 'surgery', 'orthopedic', 'aster cmi', 'manipal', 'stair climbing', 'flexion'],
        actionLabel: 'View Program & Pricing',
        actionType: 'specialty',
        actionTarget: 'ortho',
        badge: 'Aster & Manipal Referral',
        priceInfo: '₹800 – ₹900 / clinic bay • 20 Sessions: ₹16,000'
      },
      {
        id: 'prog-techie',
        category: 'programs',
        categoryLabel: 'Clinical Programs',
        title: 'Tech-Spine & Ergonomics (Manyata Corridor)',
        subtitle: 'Relief for Prolonged Sitting & Tech Neck',
        description: 'Designed for IT professionals and corporate commuters along Outer Ring Road. Targets L4-L5 disc bulges, postural kyphosis, cervical radiculopathy, and McKenzie mechanical therapy.',
        tags: ['techie', 'spine', 'back pain', 'neck pain', 'tech neck', 'manyata', 'ergonomics', 'l4 l5', 'disc bulge', 'dry needling'],
        actionLabel: 'View Program & Pricing',
        actionType: 'specialty',
        actionTarget: 'techie',
        badge: 'Evening Slots 5:00 - 8:30 PM',
        priceInfo: '₹800 / session • 10 Sessions: ₹7,500'
      },
      {
        id: 'prog-neuro',
        category: 'programs',
        categoryLabel: 'Clinical Programs',
        title: 'Neuro & Post-Stroke Hemiparesis Rehab',
        subtitle: 'Re-wiring Neural Pathways & Motor Re-learning',
        description: 'Specialized neurodevelopmental therapy following stroke (MCA/ACA infarct), Bell’s palsy, and spinal cord lesions using task-oriented motor retraining and body-weight support harness.',
        tags: ['neuro', 'stroke', 'hemiparesis', 'paralysis', 'bell palsy', 'gait', 'harness', 'spasticity', 'motor retraining'],
        actionLabel: 'View Program & Pricing',
        actionType: 'specialty',
        actionTarget: 'neuro',
        badge: 'Neurodevelopmental Protocol',
        priceInfo: '₹900 (Clinic) / ₹1,400 (Home) • 25 Sessions: ₹21,000'
      },
      {
        id: 'prog-sports',
        category: 'programs',
        categoryLabel: 'Clinical Programs',
        title: 'Sports Injury, Tendinopathy & Dry Needling',
        subtitle: 'High-Performance Musculoskeletal Restoration',
        description: 'Rehabilitation for rotator cuff tears, plantar fasciitis, tennis elbow, Achilles tendinopathy, and ligament sprains with dry needling and return-to-sport functional symmetry testing.',
        tags: ['sports', 'tendinopathy', 'dry needling', 'rotator cuff', 'plantar fasciitis', 'tennis elbow', 'achilles', 'ligament', 'taping'],
        actionLabel: 'View Program & Pricing',
        actionType: 'specialty',
        actionTarget: 'sports',
        badge: 'Return-to-Play Testing',
        priceInfo: '₹900 / session • 12 Sessions: ₹9,800'
      }
    ];

    const faqItems: SearchResultItem[] = FAQ_DATA.map(faq => ({
      id: `faq-${faq.id}`,
      category: 'faq',
      categoryLabel: 'FAQ Answer',
      title: faq.question,
      subtitle: faq.category,
      description: faq.answer,
      tags: ['faq', 'question', ...faq.category.toLowerCase().split(' '), ...faq.question.toLowerCase().split(' ')],
      actionLabel: 'View Answer & Details',
      actionType: 'faq',
      actionTarget: faq.id,
      badge: faq.category.split('&')[0].trim()
    }));

    return [...directoryItems, ...programItems, ...faqItems];
  }, []);

  // Filter items according to search query and category
  const filteredResults = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    let items = searchIndex;
    if (activeCategory !== 'all') {
      items = items.filter(item => item.category === activeCategory);
    }

    if (!cleanQuery) {
      // Default recommended / top items when search is empty or focused
      return items.slice(0, 8);
    }

    return items.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(cleanQuery);
      const matchSubtitle = item.subtitle.toLowerCase().includes(cleanQuery);
      const matchDesc = item.description.toLowerCase().includes(cleanQuery);
      const matchTags = item.tags.some(tag => tag.toLowerCase().includes(cleanQuery));
      const matchBadge = item.badge?.toLowerCase().includes(cleanQuery);
      const matchPrice = item.priceInfo?.toLowerCase().includes(cleanQuery);

      return matchTitle || matchSubtitle || matchDesc || matchTags || matchBadge || matchPrice;
    });
  }, [query, activeCategory, searchIndex]);

  // Handle action click
  const handleItemClick = (item: SearchResultItem) => {
    setIsFocused(false);

    if (item.actionType === 'section') {
      if (item.actionTarget === 'service-map-scroll') {
        const el = document.getElementById('service-area-map');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        onNavigateToSection(item.actionTarget);
      }
    } else if (item.actionType === 'specialty') {
      onSelectSpecialty(item.actionTarget as any);
      const el = document.getElementById('specialties-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (item.actionType === 'modal') {
      if (item.actionTarget === 'executive_summary') {
        onOpenExecutiveSummary();
      } else {
        onOpenBookingModal();
      }
    } else if (item.actionType === 'faq') {
      if (onSelectFaqItem) {
        onSelectFaqItem(item.actionTarget);
      }
      const el = document.getElementById(item.actionTarget) || document.getElementById('faq-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const popularChips = [
    { label: '🏡 Elder Home Care', query: 'elder' },
    { label: '🦵 Knee Rehab (TKR)', query: 'knee' },
    { label: '💻 Techie Spine', query: 'techie' },
    { label: '💼 Join Our Team', query: 'careers' },
    { label: '📄 GST Invoices', query: 'gst' },
    { label: '⏰ Clinic Timings', query: 'hours' },
    { label: '📍 Apartment Radius', query: 'radius' }
  ];

  const getCategoryIcon = (category: 'directory' | 'programs' | 'faq') => {
    switch (category) {
      case 'directory':
        return <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'programs':
        return <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
      case 'faq':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div ref={searchContainerRef} className="relative z-30 w-full max-w-4xl mx-auto">
      {/* Search Input Bar Container */}
      <div
        className={`relative flex items-center rounded-2xl bg-white dark:bg-stone-900 border-2 transition-all duration-200 shadow-sm ${
          isFocused
            ? 'border-teal-600 dark:border-teal-400 ring-4 ring-teal-500/10 shadow-lg'
            : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
        }`}
      >
        <div className="pl-4 pr-2 text-stone-400 dark:text-stone-500 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>

        <input
          ref={inputRef}
          id="homepage-main-search-input"
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            if (!isFocused) setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder="Search clinical directory, rehab programs, FAQs, pricing, timings, or apartment societies..."
          className="w-full py-3.5 pr-24 bg-transparent text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-hidden"
          autoComplete="off"
        />

        {/* Clear Button & Keyboard Shortcut Indicator */}
        <div className="absolute right-3 flex items-center space-x-1.5">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {!isFocused && !query && (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700">
              Press /
            </kbd>
          )}

          <button
            onClick={() => onOpenBookingModal()}
            className="hidden md:inline-flex items-center px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Book
          </button>
        </div>
      </div>

      {/* Suggested Quick Filter Chips (visible below search bar) */}
      <div className="mt-2.5 flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-bold text-stone-600 dark:text-stone-300 shrink-0 flex items-center">
          <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
          Popular:
        </span>
        {popularChips.map(chip => (
          <button
            key={chip.label}
            onClick={() => {
              setQuery(chip.query);
              setIsFocused(true);
              inputRef.current?.focus();
            }}
            className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-700 dark:hover:text-teal-300 text-stone-600 dark:text-stone-400 font-medium text-[11px] transition-colors whitespace-nowrap border border-stone-200 dark:border-stone-700 cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Live Search Results Dropdown Overlay */}
      {isFocused && (
        <div
          id="homepage-search-results-dropdown"
          className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-98 duration-150 max-h-[500px] flex flex-col z-50"
        >
          {/* Category Tabs Header */}
          <div className="p-2.5 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center space-x-1 overflow-x-auto">
              {(
                [
                  { id: 'all', label: 'All Results' },
                  { id: 'directory', label: 'Clinical Directory' },
                  { id: 'programs', label: 'Programs' },
                  { id: 'faq', label: 'FAQs' }
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 shrink-0">
              {filteredResults.length} {filteredResults.length === 1 ? 'match' : 'matches'}
            </span>
          </div>

          {/* Results Scroll Area */}
          <div className="p-2 overflow-y-auto flex-1 divide-y divide-stone-100 dark:divide-stone-800/80">
            {filteredResults.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <HelpCircle className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-sm font-bold text-stone-700 dark:text-stone-300">
                  No direct matches found for "{query}"
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                  Try searching for terms like "home visit", "knee", "spine", "hours", "invoice", or ask our WhatsApp desk.
                </p>
                <button
                  onClick={() => {
                    setQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-2 text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  Reset filters & view all items
                </button>
              </div>
            ) : (
              filteredResults.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="p-3 sm:p-3.5 rounded-xl hover:bg-teal-50/70 dark:hover:bg-teal-950/40 transition-colors cursor-pointer group flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {getCategoryIcon(item.category)}
                        <span>{item.categoryLabel}</span>
                      </span>

                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-800 dark:group-hover:text-teal-300 leading-snug">
                      {item.title}
                    </h4>

                    {item.subtitle && (
                      <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
                        {item.subtitle}
                      </p>
                    )}

                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.priceInfo && (
                      <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 pt-0.5">
                        {item.priceInfo}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center space-x-1 text-xs font-bold text-teal-700 dark:text-teal-400 group-hover:translate-x-1 transition-transform self-center">
                    <span className="hidden sm:inline">{item.actionLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-2.5 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-300 shrink-0">
            <span>Click any item to open or jump directly to its section</span>
            <button
              onClick={() => setIsFocused(false)}
              className="text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-white font-bold cursor-pointer"
            >
              Close [Esc]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
