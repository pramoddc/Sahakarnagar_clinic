import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldCheck,
  Clock,
  FileText,
  HeartPulse,
  CreditCard,
  Phone,
  MessageCircle,
  Sparkles
} from 'lucide-react';

export interface FAQItem {
  id: string;
  question: string;
  category: 'Home Care & Radius' | 'Post-Surgery & Treatments' | 'Billing & Insurance' | 'Clinic Access & Hours';
  answer: string;
  highlights?: string[];
  actionLabel?: string;
  actionTarget?: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-radius',
    category: 'Home Care & Radius',
    question: 'What areas in Sahakarnagar and North Bangalore are covered for elder home visits?',
    answer:
      'We provide dedicated doorstep physiotherapy across a 3.5 km core dispatch radius centered on our 60 Feet Road clinic. This includes all Sahakarnagar Blocks (A to G), Judicial Layout, CQAL Layout, Telecom Colony, Amruthahalli, Tata Nagar, and Kodigehalli, as well as prominent apartment societies such as Alpine Pyramid, L&T Raintree Boulevard, Godrej Platinum, and Sobha Petunia.',
    highlights: [
      '10-15 minute average scooter transit time',
      'Dedicated afternoon home visit transit window (01:30 PM - 04:30 PM)',
      'Pre-visit caregiver tele-triage before departure'
    ],
    actionLabel: 'View Service Radius Map',
    actionTarget: '#service-area-map'
  },
  {
    id: 'faq-equipment',
    category: 'Home Care & Radius',
    question: 'What specialized medical equipment do your physiotherapists carry for home sessions?',
    answer:
      'Our mobile physiotherapists arrive equipped with clinic-grade portable electrotherapy units (combo TENS, IFT, and Electrical Muscle Stimulation), digital vitals monitoring tools (BP cuff, pulse oximeter, blood glucose monitor), resistance therabands, inflatable balance discs, cryo/thermal gel packs, and sterile dressing accessories.',
    highlights: [
      'Digital vitals logging (BP & SpO2) before every session',
      'Strict sanitization and disposable hygiene barrier protocols'
    ]
  },
  {
    id: 'faq-insurance',
    category: 'Billing & Insurance',
    question: 'Are physiotherapy sessions and invoices eligible for health insurance reimbursement?',
    answer:
      'Yes. Sahakar Physio generates official GST-compliant tax invoices with SAC code 999312 (Physiotherapy & Rehabilitation Services) and registration credentials of treating therapists. These invoices, accompanied by our digital clinical notes and surgeon referrals, are accepted for corporate health insurance claims, outpatient reimbursement, and third-party administrator (TPA) processing.',
    highlights: [
      'Instant digital PDF invoice download from Patient Portal',
      'Clear breakdown of individual bay sessions vs. package rates'
    ],
    actionLabel: 'Check Billing & Receipts',
    actionTarget: 'billing'
  },
  {
    id: 'faq-hours',
    category: 'Clinic Access & Hours',
    question: 'What are your clinic operating hours on 60 Feet Road?',
    answer:
      'Our clinic operates Monday through Saturday with three specialized session windows: Morning In-Clinic Bay Sessions from 08:00 AM to 01:00 PM; Dedicated Elder Home Visit Dispatch from 01:30 PM to 04:30 PM; and Evening Techie/Spine Rehabilitation from 05:00 PM to 08:30 PM. Emergency Sunday home care for post-operative patients is available by prior appointment.',
    highlights: [
      'Evening slots scheduled for Manyata Tech Park commuters',
      'No waiting times with pre-slotted appointments'
    ]
  },
  {
    id: 'faq-post-op',
    category: 'Post-Surgery & Treatments',
    question: 'How soon after knee (TKR) or hip (THR) replacement surgery should physiotherapy begin?',
    answer:
      'Home-based physiotherapy typically starts within 24 to 48 hours following discharge from hospitals like Aster CMI, Manipal Hebbal, or Baptist Hospital, once cleared by your orthopedic surgeon. Early continuous passive motion, cryotherapy, and quad-activation exercises are crucial in the first 14 days to prevent joint stiffness, deep vein thrombosis, and scar adhesion.',
    highlights: [
      'Target of 90° flexion by Day 14 and 115° by Week 6',
      'Bed-to-chair transfer and safe walker gait training'
    ],
    actionLabel: 'View Post-Op Program',
    actionTarget: 'ortho'
  },
  {
    id: 'faq-portal',
    category: 'Clinic Access & Hours',
    question: 'How do family members track exercise progress and appointment schedules?',
    answer:
      'We provide a self-service Patient & Caregiver Portal. Family members can log in using the patient’s registered mobile number to confirm upcoming sessions, view illustrated Home Exercise Programs (HEP) with video guides and repetition counts, and track functional mobility score improvements over time.',
    highlights: [
      'No app install required – mobile web friendly',
      '1-click session confirmation for next 3 appointments'
    ],
    actionLabel: 'Enter Patient Portal',
    actionTarget: 'patient-portal'
  },
  {
    id: 'faq-pricing',
    category: 'Billing & Insurance',
    question: 'What are your session charges and package discounts?',
    answer:
      'Individual clinic consultations range from ₹800 to ₹900 per session, while home visits in Sahakarnagar are ₹1,200 to ₹1,400 per visit. We offer structured recovery packages (10, 20, or 25 sessions) that provide up to 20% savings, comprehensive progress reports for your physician, and tailored home exercise charts.',
    highlights: [
      '20-Session Post-Surgical Package: ₹16,000 (Clinic)',
      '20-Session Geriatric Home Care Bundle: ₹24,000'
    ]
  },
  {
    id: 'faq-wheelchair',
    category: 'Clinic Access & Hours',
    question: 'Is the 60 Feet Road clinic wheelchair-friendly with accessible parking?',
    answer:
      'Yes. Our clinic on 60 Feet Road (F-Block, Sahakarnagar) is located on the ground floor with a dedicated wheelchair ramp, wide treatment bays, grab bars in restrooms, and direct curbside drop-off parking for patient vehicles and ambulances.',
    highlights: [
      'Zero-step wheelchair ramp entry from 60 Feet Road',
      'Dedicated assistance staff for elderly transfers'
    ]
  }
];

interface HomepageFAQSectionProps {
  onNavigateToSection?: (sectionId: string) => void;
  onSelectSpecialty?: (specialtyId: 'geriatric' | 'ortho' | 'neuro' | 'techie' | 'sports') => void;
  onOpenBookingModal?: () => void;
  highlightedFaqId?: string | null;
}

export const HomepageFAQSection: React.FC<HomepageFAQSectionProps> = ({
  onNavigateToSection,
  onSelectSpecialty,
  onOpenBookingModal,
  highlightedFaqId
}) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(highlightedFaqId || 'faq-radius');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Home Care & Radius', 'Post-Surgery & Treatments', 'Billing & Insurance', 'Clinic Access & Hours'];

  const filteredFaqs = selectedCategory === 'All'
    ? FAQ_DATA
    : FAQ_DATA.filter(f => f.category === selectedCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  const handleActionClick = (target?: string) => {
    if (!target) return;
    if (target.startsWith('#')) {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (['geriatric', 'ortho', 'neuro', 'techie', 'sports'].includes(target)) {
      if (onSelectSpecialty) {
        onSelectSpecialty(target as any);
      }
      const el = document.getElementById('specialties-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (onNavigateToSection) {
      onNavigateToSection(target);
    }
  };

  return (
    <section id="faq-section" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Clear, transparent answers regarding elder home visits, post-op timelines, insurance bills, and clinic accessibility
          </p>
        </div>

        <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800 self-start sm:self-auto">
          {FAQ_DATA.length} Common Inquiries Answered
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map(item => {
          const isOpen = openFaqId === item.id;
          const isHighlighted = highlightedFaqId === item.id;

          return (
            <div
              key={item.id}
              id={item.id}
              className={`rounded-2xl border transition-all duration-200 ${
                isHighlighted
                  ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/30 bg-amber-50/20 dark:bg-amber-950/20'
                  : isOpen
                  ? 'border-teal-300 dark:border-teal-700 bg-teal-50/30 dark:bg-teal-950/20 shadow-2xs'
                  : 'border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <button
                onClick={() => toggleFaq(item.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-3 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-start space-x-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 shrink-0 mt-0.5">
                    {item.category.split('&')[0].trim()}
                  </span>
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                    {item.question}
                  </span>
                </div>

                <div className="w-6 h-6 rounded-full bg-white dark:bg-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-300 shrink-0 shadow-2xs">
                  {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-stone-600 dark:text-stone-300 border-t border-stone-200/60 dark:border-stone-800/60 mt-1 space-y-3 animate-in fade-in-50 duration-150">
                  <p className="leading-relaxed text-stone-700 dark:text-stone-300">
                    {item.answer}
                  </p>

                  {item.highlights && item.highlights.length > 0 && (
                    <div className="p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                        Key Details:
                      </div>
                      <ul className="space-y-1">
                        {item.highlights.map((h, i) => (
                          <li key={i} className="flex items-center text-[11px] text-stone-600 dark:text-stone-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {item.actionLabel && (
                      <button
                        onClick={() => handleActionClick(item.actionTarget)}
                        className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline inline-flex items-center cursor-pointer"
                      >
                        <span>{item.actionLabel} →</span>
                      </button>
                    )}

                    {onOpenBookingModal && (
                      <button
                        onClick={onOpenBookingModal}
                        className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 hover:text-teal-700 dark:hover:text-teal-300 cursor-pointer ml-auto"
                      >
                        Have another question? Ask Reception
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
