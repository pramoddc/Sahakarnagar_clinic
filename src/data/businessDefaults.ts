import { 
  StartupCapital, 
  MonthlyOperatingParams, 
  HomeCareParams, 
  TimelineMonth, 
  PatientPackage, 
  MarketSegment, 
  Week1Task, 
  RiskItem, 
  FloorStation 
} from '../types';

export const DEFAULT_CAPEX: StartupCapital = {
  spaceDepositAndFitout: 300000, // ₹3.0 Lakh
  equipment: 280000,            // ₹2.8 Lakh (Ultrasound, TENS, Traction/Tables, Exercise gear)
  interiorsAndElectrical: 125000, // ₹1.25 Lakh (Partitions, sound insulation, electrical load)
  licensesAndRegistration: 35000, // ₹35,000 (KPME, trade license, BMW waste handling)
  bookingAndBranding: 50000,      // ₹50,000 (Software, signage, website, Google Business)
  workingCapitalBuffer: 250000,   // ₹2.5 Lakh (Covers 4 months runway)
  totalCapital: 4000000           // ₹40.0 Lakh total corpus
};

export const DEFAULT_OPERATING_PARAMS: MonthlyOperatingParams = {
  patientsPerDay: 15,
  workingDaysPerMonth: 25,
  avgSessionPrice: 1000,
  physiotherapistSalary: 45000,
  assistantSalary: 15000,
  rent: 35000,
  consumablesPercent: 10,
  marketingBudget: 15000,
  utilitiesAndSundries: 10000
};

export const DEFAULT_HOME_CARE_PARAMS: HomeCareParams = {
  activeInMonth: false,
  homeVisitsPerDay: 4,
  homeVisitPrice: 1500,
  travelAllowancePerVisit: 200,
  secondPhysioHired: true,
  secondPhysioSalary: 45000
};

export const TIMELINE_DATA: TimelineMonth[] = [
  {
    month: 1,
    phase: "Launch & Foundation",
    projectedRevenueMin: 100000,
    projectedRevenueMax: 150000,
    projectedProfitMin: -15000,
    projectedProfitMax: 15000,
    patientsPerDay: 4,
    homeVisitsPerDay: 0,
    keyMilestones: [
      "Clinic doors open in Sahakarnagar",
      "First 20 patients treated; gather initial 5-star Google reviews",
      "Launch referral outreach to nearby orthopedics & physicians"
    ],
    focus: "Building initial patient trust and establishing clinical protocol discipline."
  },
  {
    month: 2,
    phase: "Review Compounding",
    projectedRevenueMin: 125000,
    projectedRevenueMax: 160000,
    projectedProfitMin: 5000,
    projectedProfitMax: 25000,
    patientsPerDay: 6,
    homeVisitsPerDay: 0,
    keyMilestones: [
      "Google Business profile hits 35+ verified reviews",
      "First recurring package renewals (10 & 15 sessions)",
      "Breakeven reached on monthly operating cash flow"
    ],
    focus: "Conversion of walk-ins and referrals into structured recurring packages."
  },
  {
    month: 3,
    phase: "Word-of-Mouth Traction",
    projectedRevenueMin: 220000,
    projectedRevenueMax: 290000,
    projectedProfitMin: 40000,
    projectedProfitMax: 55000,
    patientsPerDay: 9,
    homeVisitsPerDay: 0,
    keyMilestones: [
      "Manyata Tech Park IT commuter campaign gains traction",
      "Local Sahakarnagar resident associations partnership",
      "Stable cash surplus achieved"
    ],
    focus: "Targeting desk posture and ergonomic chronic neck/back pain from IT corridors."
  },
  {
    month: 4,
    phase: "Compounding Growth",
    projectedRevenueMin: 280000,
    projectedRevenueMax: 350000,
    projectedProfitMin: 55000,
    projectedProfitMax: 70000,
    patientsPerDay: 11,
    homeVisitsPerDay: 0,
    keyMilestones: [
      "Patient referral rate crosses 30% of new admissions",
      "Sports injury intake from RV/MS Ramaiah/Reva collegiate teams",
      "Begin field research on elderly residents requiring home care"
    ],
    focus: "Expanding sports injury and student athlete treatment cohorts."
  },
  {
    month: 5,
    phase: "Steady-State Ramp",
    projectedRevenueMin: 380000,
    projectedRevenueMax: 440000,
    projectedProfitMin: 100000,
    projectedProfitMax: 115000,
    patientsPerDay: 13,
    homeVisitsPerDay: 0,
    keyMilestones: [
      "Clinic approaching full single-therapist daytime capacity",
      "Prepare SOPs & home-visit treatment kits for geriatric care",
      "Select second therapist candidate for home-care expansion"
    ],
    focus: "Streamlining clinic turnaround times and preparing Phase 2 expansion."
  },
  {
    month: 6,
    phase: "Clinic Steady State",
    projectedRevenueMin: 400000,
    projectedRevenueMax: 500000,
    projectedProfitMin: 110000,
    projectedProfitMax: 130000,
    patientsPerDay: 15,
    homeVisitsPerDay: 0,
    keyMilestones: [
      "Clinic reaches 15 patients/day steady utilization",
      "First physiotherapist running at optimal load with high NPS",
      "Begin soft pilot of home visits for immobile seniors"
    ],
    focus: "Locking in 45-50% clinic-only operating profit margin."
  },
  {
    month: 7,
    phase: "Home-Care Pilot",
    projectedRevenueMin: 450000,
    projectedRevenueMax: 520000,
    projectedProfitMin: 120000,
    projectedProfitMax: 135000,
    patientsPerDay: 15,
    homeVisitsPerDay: 1,
    keyMilestones: [
      "Refine portable modal equipment (portable TENS, ultrasound, bands)",
      "Test travel buffer times across Sahakarnagar blocks A-G",
      "Finalize pricing and safety checklists for elder home care"
    ],
    focus: "Validating home visit operational reliability and punctuality."
  },
  {
    month: 8,
    phase: "Home-Care Rollout",
    projectedRevenueMin: 680000,
    projectedRevenueMax: 760000,
    projectedProfitMin: 145000,
    projectedProfitMax: 165000,
    patientsPerDay: 15,
    homeVisitsPerDay: 3,
    keyMilestones: [
      "Second physiotherapist on board dedicated to home visits",
      "Elder care outreach via gated societies (Sobha, Godrej, Brigade clusters)",
      "Combined revenue climbs to ₹7 Lakhs+"
    ],
    focus: "Scaling premium elder care visits while keeping clinic occupancy full."
  },
  {
    month: 9,
    phase: "Dual-Engine Expansion",
    projectedRevenueMin: 720000,
    projectedRevenueMax: 800000,
    projectedProfitMin: 160000,
    projectedProfitMax: 180000,
    patientsPerDay: 16,
    homeVisitsPerDay: 4,
    keyMilestones: [
      "Home-visit slot utilization hits 70% in morning/evening blocks",
      "Cross-referral: Clinic patients booking home visits for elderly parents",
      "Operating margin stabilizes near 22-25% on home visits, 45%+ on clinic"
    ],
    focus: "Staff retention, route optimization, and elder caregiver satisfaction."
  },
  {
    month: 10,
    phase: "Stabilization Ramp",
    projectedRevenueMin: 850000,
    projectedRevenueMax: 930000,
    projectedProfitMin: 185000,
    projectedProfitMax: 205000,
    patientsPerDay: 16,
    homeVisitsPerDay: 5,
    keyMilestones: [
      "Combined revenue approaches ₹9 Lakhs/month",
      "Net profit approaches the benchmark ₹2 Lakh/month target",
      "Brand recognized as premier musculoskeletal and geriatric physio in North BLR"
    ],
    focus: "Tightening unit economics and maintaining clinical outcome consistency."
  },
  {
    month: 11,
    phase: "Target Attainment",
    projectedRevenueMin: 900000,
    projectedRevenueMax: 980000,
    projectedProfitMin: 200000,
    projectedProfitMax: 225000,
    patientsPerDay: 17,
    homeVisitsPerDay: 5,
    keyMilestones: [
      "Net monthly profit crosses ₹2.0 Lakhs threshold cleanly",
      "Working capital intact with ₹30L+ corpus preserved in bank",
      "Full digital patient record & package tracking in place"
    ],
    focus: "Financial audit, therapist performance bonus allocation, quality control."
  },
  {
    month: 12,
    phase: "Stabilized Powerhouse",
    projectedRevenueMin: 950000,
    projectedRevenueMax: 1050000,
    projectedProfitMin: 215000,
    projectedProfitMax: 245000,
    patientsPerDay: 17,
    homeVisitsPerDay: 6,
    keyMilestones: [
      "Dual model running like clockwork: Clinic 16-18/day + 5-6 home visits/day",
      "Annualized revenue run-rate exceeding ₹1.1 Crore",
      "Playbook documented for potential 2nd clinic opening in Jakkur / Hebbal"
    ],
    focus: "Long-term patient retention and scalable operational playbook."
  }
];

export const PATIENT_PACKAGES: PatientPackage[] = [
  {
    id: "pkg-spine-ergonomic",
    name: "Tech Spine & Ergonomic Reset",
    targetDemographic: "Manyata Tech Park IT commuters & desk workers",
    condition: "Cervical radiculopathy, chronic lumbar spasm, tech-neck, postural kyphosis",
    recommendedSessions: 12,
    pricePerSession: 950,
    packagePrice: 11400,
    recurringDurationWeeks: 4,
    typicalOutcome: "85% reduction in neck/lumbar spasm; ergonomic workstation compliance; core stability restored",
    tag: "IT Desk Worker"
  },
  {
    id: "pkg-post-op",
    name: "Post-Surgical Joint Rehabilitation",
    targetDemographic: "Post TKR (Knee replacement), THR (Hip), ACL reconstruction",
    condition: "Post-operative stiffness, muscle atrophy, gait abnormalcy",
    recommendedSessions: 20,
    pricePerSession: 900,
    packagePrice: 18000,
    recurringDurationWeeks: 7,
    typicalOutcome: "Restoration of 120° knee flexion, independent unassisted stair climbing, normal gait symmetry",
    tag: "Post-Surgical"
  },
  {
    id: "pkg-elder-mobility",
    name: "Senior Balance, Osteoarthritis & Fall Prevention",
    targetDemographic: "Older Sahakarnagar layout residents (60+ years)",
    condition: "Knee osteoarthritis Grade II/III, balance ataxia, Parkinsonian stiffness, post-fall anxiety",
    recommendedSessions: 15,
    pricePerSession: 1000,
    packagePrice: 15000,
    recurringDurationWeeks: 5,
    typicalOutcome: "Timed Up-and-Go (TUG) improved by 35%, significant joint pain drop, independent neighborhood walking",
    tag: "Senior Elder"
  },
  {
    id: "pkg-sports-youth",
    name: "Athletic Return-To-Play (RTP)",
    targetDemographic: "College students from RV, MS Ramaiah, Reva & local sports academies",
    condition: "Ankle sprains, rotator cuff impingement, hamstring tears, jumper's knee",
    recommendedSessions: 10,
    pricePerSession: 1050,
    packagePrice: 10500,
    recurringDurationWeeks: 3,
    typicalOutcome: "Full range of motion, functional agility clearance, return to competitive match fitness without reinjury",
    tag: "College Athlete"
  },
  {
    id: "pkg-elder-home-premium",
    name: "Concierge Geriatric Home-Visit Course",
    targetDemographic: "Bed-bound or frail seniors in Sahakarnagar & nearby gated communities",
    condition: "Stroke hemiparesis, severe arthritic mobility impairment, dementia-associated deconditioning",
    recommendedSessions: 15,
    pricePerSession: 1500,
    packagePrice: 22500,
    recurringDurationWeeks: 5,
    typicalOutcome: "Safe bedside transfers, bed mobility, caregiver education, prevention of pressure ulcers & joint contractures",
    tag: "Senior Elder"
  }
];

export const MARKET_SEGMENTS: MarketSegment[] = [
  {
    id: "seg-elders",
    title: "Aging Residents in Older Housing",
    demographic: "Aged 58 - 82, retired professionals, long-time Bangalore homeowners in Sahakarnagar 1st to 7th blocks",
    whySahakarnagar: "One of North Bangalore's quintessential green, established neighborhoods with high elder density who value local proximity.",
    painPoints: [
      "Cannot travel long distances in traffic to Indiranagar or Malleshwaram hospitals",
      "Knee osteoarthritis, chronic sciatica, post-stroke weakness",
      "Need personalized patience and trusted, qualified BPT/MPT care rather than rushed clinics"
    ],
    serviceOffering: "Clinic-based gentle manual therapy, electrotherapy, balance training, transitioning to premium home visits.",
    expectedVolumeShare: 35,
    marketingChannel: "Local resident associations (RWA meetings), morning walkers at Sahakarnagar parks, nearby family doctors",
    avgPackageSessions: 15
  },
  {
    id: "seg-it-tech",
    title: "Manyata Tech Park IT Commuters",
    demographic: "Age 26 - 45, software engineers, managers, product teams commuting via Outer Ring Road / Thanisandra",
    painPoints: [
      "10-12 hours desk bound causing severe lumbar strain and tech neck",
      "High disposable income, willing to pay for prompt evening/weekend appointments",
      "Hate waiting in crowded hospital OPDs"
    ],
    whySahakarnagar: "Directly adjacent to Manyata Tech Park corridor (~10 mins away) on the evening commute back home.",
    serviceOffering: "Dry needling, deep tissue release, posture re-education, ergonomic home exercises.",
    expectedVolumeShare: 30,
    marketingChannel: "Google Maps local SEO ('Physiotherapy near Manyata'), tech park corporate flyers, digital ads",
    avgPackageSessions: 12
  },
  {
    id: "seg-apartments",
    title: "Gated Apartment Families",
    demographic: "Families in Sobha, Brigade, Godrej, and luxury enclaves along Bellary Road & Sahakarnagar periphery",
    whySahakarnagar: "Convenience-first mindset. Willing to buy 15-20 session prepaid packages if service is spotless.",
    painPoints: [
      "Elderly parents living with them needing dedicated rehab",
      "Mothers dealing with post-natal pelvic girdle or postural pain",
      "Busy schedules requiring exact-time appointment slots"
    ],
    serviceOffering: "Premium structured care packages, seamless digital appointment booking, home-visit options.",
    expectedVolumeShare: 20,
    marketingChannel: "Apartment society gate apps (MyGate/NoBrokerHood), wellness workshops, pediatrician/gynecologist tie-ups",
    avgPackageSessions: 15
  },
  {
    id: "seg-colleges",
    title: "College Students & Athletes",
    demographic: "Age 18 - 25, students from RV College, MS Ramaiah, Reva University campuses nearby",
    whySahakarnagar: "Proximity to educational hubs in North Bangalore; active sports, gym injuries, crossfit strains.",
    painPoints: [
      "Gym sprains, football ligament injuries, badminton shoulder issues",
      "Need rapid recovery to return to training",
      "Looking for active kinesiology and taping rather than just heat packs"
    ],
    serviceOffering: "Sports biomechanics, strength & conditioning, resistance band rehab, kinesiology taping.",
    expectedVolumeShare: 15,
    marketingChannel: "College sports coaches, local gym partnerships (Cult, Gold's, Snap Fitness), student word of mouth",
    avgPackageSessions: 10
  }
];

export const WEEK_1_TASKS: Week1Task[] = [
  {
    id: "task-pt-hiring",
    category: "PT Hiring",
    title: "Outreach & Screening for Lead Physiotherapist (BPT/MPT)",
    detail: "The physiotherapist is effectively the product. Patient outcomes and your reputation depend entirely on them. Start reaching out now before signing the lease.",
    actionableSteps: [
      "Draft clinical role description: 3-6 yrs experience in Musculoskeletal & Neuro/Geriatric rehab, BPT/MPT degree.",
      "Post on Bangalore Physiotherapy WhatsApp groups, LinkedIn, and IAP (Indian Association of Physiotherapists) alumni boards.",
      "Screen for 3 crucial traits: Clinical empathy with seniors, clear patient communication in English & Kannada, and adherence to 10-25 session protocol plans.",
      "Structure compensation: ₹40,000 - ₹45,000 base + 5-10% session incentive bonus on patient package completions."
    ],
    completed: false
  },
  {
    id: "task-space-hunting",
    category: "Space Hunting",
    title: "Walk Sahakarnagar Main Roads for 600 sq ft Commercial Space",
    detail: "Look near apartment clusters and main accessible thoroughfares (e.g. 60 Feet Road, CQAL Layout junction) rather than just the cheapest option.",
    actionableSteps: [
      "Target size: Exactly 550 - 650 sq ft with ground floor access or a functioning passenger lift for elderly patients.",
      "Filter for budget: Rent at or below ₹35,000/month; security deposit negotiable between ₹2.5L to ₹3.5L.",
      "Verify building infrastructure: Dedicated parking for patients, 3-phase power supply (minimum 4KW for therapy gear), and clean water supply.",
      "Inspect front facade: High visibility for clear acrylic signboard to capture Manyata commuters and local evening walkers."
    ],
    completed: false
  },
  {
    id: "task-competitor-intel",
    category: "Competitor Intel",
    title: "Mystery Shop 2-3 Existing Physiotherapy Clinics Nearby",
    detail: "Book a consultation as a patient with cervical strain or back pain to experience their real pricing, setup, and service gaps.",
    actionableSteps: [
      "Visit Clinic 1 (Hospital-attached OPD or diagnostic chain in Sahakarnagar): Note consultation fee, wait time, equipment age.",
      "Visit Clinic 2 (Independent standalone physio on 60 Feet Road): Note interior cleanliness, whether packages are actively pitched, receptionist warmth.",
      "Document pricing benchmark: Single session rate (₹600 - ₹1,200), package discounts, home visit availability and rates.",
      "Identify gaps: Are they running on disorganized paper registers? Do they lack proper exercise space? How can our 600 sq ft clinic beat them?"
    ],
    completed: false
  },
  {
    id: "task-kpme-licensing",
    category: "KPME Licensing",
    title: "Verify Karnataka Clinical Establishments (KPME) Requirements",
    detail: "Clinic registration requires a qualified professional formally in charge. Confirm exact regulatory steps with a local consultant so licensing doesn't become a late surprise.",
    actionableSteps: [
      "Check KPME (Karnataka Private Medical Establishments Act) online portal requirements for Physiotherapy Establishment category.",
      "Confirm lead physiotherapist's Karnataka registration council number and degree certificate validation.",
      "Gather mandatory documents: Lease agreement, floor layout blueprint showing fire safety & washroom, biomedical waste (BMW) vendor MoU.",
      "Consult local healthcare compliance agent in Bangalore North (BBMP Yelahanka/Byatarayanapura zone) for fast-track processing (budgeted ₹35,000)."
    ],
    completed: false
  }
];

export const RISKS_DATA: RiskItem[] = [
  {
    id: "risk-pt-dependency",
    risk: "Physiotherapist is Single-Point-of-Failure & Brand Anchor",
    severity: "Critical",
    whyItMatters: "Unlike a retail store, patients form a deep emotional and physical trust bond with their specific therapist. If they leave abruptly, clinic revenue and reputation take an immediate hit.",
    warningSigns: [
      "Therapist feeling overwhelmed with administrative or non-clinical tasks",
      "Patient complaints about hurried sessions or lack of warm bedside manner",
      "Competitor clinics offering marginal salary bumps"
    ],
    mitigationPlaybook: [
      "Relieve therapist of all admin: Owner + receptionist handle billing, calls, booking, and reminders so therapist focuses 100% on patient care.",
      "Incentive structure: Performance bonus tied to package completion rates and 5-star Google review mentions.",
      "Documented treatment protocols: Standardize clinical assessment forms and exercise progression templates so patient records belong to the clinic system.",
      "Pre-screen backup candidates by Month 4 for both relief cover and Month 8 home-care expansion hire."
    ]
  },
  {
    id: "risk-slow-q1",
    risk: "Genuinely Slow First Quarter Ramp (Months 1-3)",
    severity: "High",
    whyItMatters: "Trust-based healthcare builds through personal referrals, Google reviews, and recovery stories. Initial patient flow will not happen overnight regardless of clinic decor.",
    warningSigns: [
      "Fewer than 5 patients/day in the first 6 weeks",
      "Cash flow anxiety if founder expects immediate steady state"
    ],
    mitigationPlaybook: [
      "Deploy working capital buffer: ₹2.5 Lakhs is specifically allocated to cover the first 4 months of fixed costs (rent + staff) without touching the ₹30L reserve.",
      "Offer introductory spine & joint ergonomic screenings for tech workers and apartment associations.",
      "Engage Sahakarnagar resident welfare associations (RWAs) for weekend geriatric balance & arthritis workshops.",
      "Partner with nearby orthopedic surgeons and general physicians with transparent progress report cards for their referred patients."
    ]
  },
  {
    id: "risk-homecare-staffing",
    risk: "Home-Care Reliability & Logistics Burnout",
    severity: "High",
    whyItMatters: "Home care is a staffing and logistics business, not an equipment business. Bangalore traffic, rain, travel fatigue, and punctuality failures can erode trust with elderly clients.",
    warningSigns: [
      "Therapist arriving late to senior patients' homes due to traffic bottlenecks",
      "Higher fuel/commute resistance from staff",
      "Session fatigue compromising quality"
    ],
    mitigationPlaybook: [
      "Geographic cap: Limit home visits strictly within a 3.5 km radius of Sahakarnagar (covering CQAL, Judicial Layout, Telecom Layout, Kodigehalli).",
      "Travel allowance: ₹200 per visit provided on top of salary to cover fuel and travel incentives.",
      "Dedicated Phase 2 hire: Once volume reaches 4+ daily home visits, transition home care to a dedicated mobile therapist rather than splitting clinic focus.",
      "Pre-scheduled route clustering: Morning block (8:30 AM - 11:30 AM) and late afternoon block (4:00 PM - 6:30 PM) avoiding peak Bellary Road gridlock."
    ]
  },
  {
    id: "risk-kpme-compliance",
    risk: "KPME & Regulatory Registration Hurdles",
    severity: "Medium",
    whyItMatters: "Karnataka Private Medical Establishments Act requires formal registration with a qualified clinical head. Operating without clearance risks BBMP notices or operational pauses.",
    warningSigns: [
      "Delay in obtaining landlord's commercial property tax receipt or building plan",
      "Missing biomedical waste handling agreement"
    ],
    mitigationPlaybook: [
      "Start regulatory check in Week 1 before signing any lease agreement.",
      "Ensure space lease has explicit commercial medical usage clause and landlord provides trade license NOC.",
      "Engage an experienced local Bangalore health compliance consultant who handles BBMP/KPME documentation for clinics."
    ]
  }
];

export const FLOOR_STATIONS: FloorStation[] = [
  {
    id: "station-reception",
    name: "Reception, Intake & Waiting Lounge",
    sqFt: 110,
    equipment: ["Front desk terminal", "Waiting chairs with lumbar support (4 seats)", "Digital registration iPad/PC", "Water dispenser"],
    purpose: "Welcoming patients, booking sessions, package billing, comfortable seating for elderly companions.",
    capacityConcurrent: 4,
    color: "amber"
  },
  {
    id: "station-consult",
    name: "Clinical Consultation & Assessment Bay",
    sqFt: 90,
    equipment: ["Doctor desk & ergonomic chairs", "Goniometers, reflex hammers, BP monitor", "Wall posture grid & anatomical spine models"],
    purpose: "Initial 45-min diagnostic intake, range-of-motion testing, treatment planning, confidential medical history.",
    capacityConcurrent: 2,
    color: "sky"
  },
  {
    id: "station-electro",
    name: "Electrotherapy & Manual Therapy Bay (Curtained 2 Beds)",
    sqFt: 220,
    equipment: [
      "2x Heavy-duty multi-section treatment plinths",
      "Combination Ultrasound & TENS unit",
      "Interferential Therapy (IFT) machine",
      "Cervical & Lumbar computerized traction unit",
      "Moist heat hydrocollator packs & cryotherapy kit"
    ],
    purpose: "Pain relief, soft tissue mobilization, spinal decompression, electrotherapy modalities.",
    capacityConcurrent: 2,
    color: "emerald"
  },
  {
    id: "station-exercise",
    name: "Active Kinesiology & Exercise Rehab Zone",
    sqFt: 130,
    equipment: [
      "Parallel walking bars with floor mirror",
      "Wobble balance boards & foam balance pads",
      "TheraBands, resistance loop set, dumbbells (1-5kg)",
      "Swiss stability balls & wall-mounted pulley system",
      "Non-slip high-density shock-absorbing athletic matting"
    ],
    purpose: "Gait training, balance recovery for seniors, athletic return-to-play drills, core stabilization for tech workers.",
    capacityConcurrent: 2,
    color: "teal"
  },
  {
    id: "station-amenity",
    name: "Elder-Accessible Washroom & Utility Storage",
    sqFt: 50,
    equipment: ["Grab bars for seniors", "Anti-skid flooring", "Emergency pull cord", "Biomedical waste bins (color-coded)"],
    purpose: "Mandatory compliance, hygiene, linen storage, and patient dignity.",
    capacityConcurrent: 1,
    color: "slate"
  }
];
