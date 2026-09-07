import { PatientRecord, TreatmentType } from '../types';

export interface DemographicCohort {
  cohortKey: string;
  ageRange: string;
  label: string;
  patientCount: number;
  avgAge: number;
  maleCount: number;
  femaleCount: number;
  clinicCount: number;
  homeCareCount: number;
  dominantCondition: string;
  avgCompletionRate: number; // percentage
  avgRevenue: number;
  primaryMarketingChannel: string;
  cacInr: number;
  ltvInr: number;
  conversionRate: number;
  marketingOpportunity: string;
}

export interface InjuryTrendData {
  category: TreatmentType;
  label: string;
  count: number;
  percentage: number;
  avgInitialVAS: number;
  avgFinalVAS: number;
  avgPainReduction: number;
  clinicPatients: number;
  homePatients: number;
  topDiagnoses: string[];
  avgSessionsTaken: number;
  avgPackageSize: number;
  avgRevenuePerPatient: number;
  marketingTarget: string;
  recommendedCampaign: string;
  peakSeasonality: string;
}

export interface PackageCompletionMetric {
  packageType: 10 | 15 | 20 | 25;
  name: string;
  targetUser: string;
  enrolledCount: number;
  completedCount: number; // completed 100% of package
  avgSessionsAttended: number;
  completionRatePercent: number;
  adherenceRatePercent: number; // attended without gaps > 7 days
  dropOffStage: string;
  primaryDropOffReason: string;
  retentionIntervention: string;
  avgRevenuePerPackage: number;
  marginPercent: number;
}

export interface DropOffFunnelStage {
  milestone: string;
  sessionRange: string;
  retentionPercent: number;
  dropOffPercent: number;
  psychologicalDriver: string;
  clinicalAction: string;
}

export interface MarketingChannelPerformance {
  channel: string;
  segmentTarget: string;
  monthlySpendInr: number;
  leadsGenerated: number;
  patientsEnrolled: number;
  conversionRatePercent: number;
  cacInr: number;
  ltvInr: number;
  roiMultiple: number;
  keyAction: string;
}

// 24 Statistically Realistic Sahakarnagar Clinical Patient Records
export const ENRICHED_ANALYTICS_PATIENTS: PatientRecord[] = [
  // 18-29 Age Group (Sports & Young Active)
  {
    id: 'pt-004',
    fullName: 'Rohan Bharadwaj',
    age: 21,
    gender: 'Male',
    phone: '+91 97312 88410',
    address: 'Reva University Hub, Kattigenahalli',
    area: 'Reva University Hub',
    careType: 'clinic',
    treatmentType: 'Sports',
    injuryCategory: 'Sports & Musculoskeletal',
    diagnosis: 'Right Shoulder Supraspinatus Tendinopathy (Badminton Smash Impingement)',
    referringDoctor: 'Dr. Vivek Swamy (Sports Medicine)',
    packageType: 15,
    sessionsCompleted: 14,
    totalPackageFee: 14000,
    paymentStatus: 'Paid',
    amountPaid: 14000,
    startDate: '2026-07-20',
    lastSessionDate: '2026-08-25',
    initialPainVAS: 8,
    currentPainVAS: 2,
    targetOutcome: 'Full overhead smash clearance, return to tournament play',
    status: 'Completed',
    notes: []
  },
  {
    id: 'pt-007',
    fullName: 'Nikhil Somasekhar',
    age: 24,
    gender: 'Male',
    phone: '+91 98451 90214',
    address: '#45, 1st Cross, Kodigehalli Main Rd',
    area: 'Kodigehalli',
    careType: 'clinic',
    treatmentType: 'Sports',
    injuryCategory: 'Sports & Musculoskeletal',
    diagnosis: 'Grade II Inversion Ankle Sprain (Football Turf Injury)',
    referringDoctor: 'Walk-in / Google Maps Review',
    packageType: 10,
    sessionsCompleted: 10,
    totalPackageFee: 9500,
    paymentStatus: 'Paid',
    amountPaid: 9500,
    startDate: '2026-08-05',
    lastSessionDate: '2026-08-28',
    initialPainVAS: 8,
    currentPainVAS: 1,
    targetOutcome: 'Proprioceptive single-leg balance, sprint and cut drills without pain',
    status: 'Completed',
    notes: []
  },
  {
    id: 'pt-008',
    fullName: 'Shreya P. Deshpande',
    age: 27,
    gender: 'Female',
    phone: '+91 99803 76211',
    address: 'Sterling Park Apts, Sahakarnagar',
    area: 'Sahakarnagar F-Block',
    careType: 'clinic',
    treatmentType: 'Sports',
    injuryCategory: 'Sports & Musculoskeletal',
    diagnosis: 'Patellofemoral Pain Syndrome (Runner Knee - 10k Training)',
    referringDoctor: 'Bangalore Runners Club WhatsApp',
    packageType: 15,
    sessionsCompleted: 13,
    totalPackageFee: 13500,
    paymentStatus: 'Paid',
    amountPaid: 13500,
    startDate: '2026-08-10',
    lastSessionDate: '2026-09-02',
    initialPainVAS: 7,
    currentPainVAS: 2,
    targetOutcome: 'Pain-free 10k running, hip abductor firing symmetry',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-009',
    fullName: 'Aditya Hegde',
    age: 28,
    gender: 'Male',
    phone: '+91 97401 22891',
    address: '#102, Esteem Classic, Bellary Road',
    area: 'Bellary Road',
    careType: 'clinic',
    treatmentType: 'Sports',
    injuryCategory: 'Sports & Musculoskeletal',
    diagnosis: 'Medial Collateral Ligament (MCL) Grade I Sprain (Gym Squat Form Error)',
    referringDoctor: 'Gold Gym Sahakarnagar Trainer',
    packageType: 10,
    sessionsCompleted: 9,
    totalPackageFee: 9500,
    paymentStatus: 'Paid',
    amountPaid: 9500,
    startDate: '2026-08-15',
    lastSessionDate: '2026-09-04',
    initialPainVAS: 6,
    currentPainVAS: 1,
    targetOutcome: 'Full active terminal knee extension, safe squat biomechanics',
    status: 'Active',
    notes: []
  },

  // 30-44 Age Group (Manyata Tech Park / Corporate IT Professionals)
  {
    id: 'pt-002',
    fullName: 'Ananya Deshmukh',
    age: 33,
    gender: 'Female',
    phone: '+91 99002 44102',
    address: 'Flat 402, Alpine Pyramid, Sahakarnagar F-Block',
    area: 'Sahakarnagar F-Block',
    careType: 'clinic',
    treatmentType: 'IT/Posture',
    injuryCategory: 'Spine & Posture',
    diagnosis: 'C5-C6 Cervical Radiculopathy & Chronic Upper Trap Myofascial Strain',
    referringDoctor: 'Corporate Ergonomics Desk Camp (Manyata)',
    packageType: 15,
    sessionsCompleted: 11,
    totalPackageFee: 13500,
    paymentStatus: 'Paid',
    amountPaid: 13500,
    startDate: '2026-08-16',
    lastSessionDate: '2026-09-06',
    initialPainVAS: 7,
    currentPainVAS: 2,
    targetOutcome: 'Abolition of arm tingling, 8-hr seated endurance',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-010',
    fullName: 'Karthik Murthy',
    age: 37,
    gender: 'Male',
    phone: '+91 98452 33100',
    address: '#19, Sobha Emerald, Judicial Layout',
    area: 'Judicial Layout',
    careType: 'clinic',
    treatmentType: 'IT/Posture',
    injuryCategory: 'Spine & Posture',
    diagnosis: 'L4-L5 Disc Protrusion with Bilateral Gluteal Spasm (Long Seated Commute)',
    referringDoctor: 'Aster CMI Spine Clinic',
    packageType: 15,
    sessionsCompleted: 13,
    totalPackageFee: 14000,
    paymentStatus: 'Paid',
    amountPaid: 14000,
    startDate: '2026-08-01',
    lastSessionDate: '2026-09-01',
    initialPainVAS: 8,
    currentPainVAS: 2,
    targetOutcome: 'Centralized lumbar spine mechanics, core bracing without pain',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-011',
    fullName: 'Priya Ramanathan',
    age: 41,
    gender: 'Female',
    phone: '+91 96200 44912',
    address: 'B-604, Godrej Platinum, Hebbal',
    area: 'Hebbal Corridor',
    careType: 'clinic',
    treatmentType: 'IT/Posture',
    injuryCategory: 'Spine & Posture',
    diagnosis: 'Thoracic Outlet Syndrome & Cervicogenic Tension Headaches',
    referringDoctor: 'Google Search ("Best Physio Near Manyata")',
    packageType: 15,
    sessionsCompleted: 12,
    totalPackageFee: 13500,
    paymentStatus: 'Paid',
    amountPaid: 13500,
    startDate: '2026-08-12',
    lastSessionDate: '2026-09-05',
    initialPainVAS: 7,
    currentPainVAS: 2,
    targetOutcome: 'Relief from morning occipital headaches, scapular retraction strength',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-012',
    fullName: 'Siddharth V. Rao',
    age: 35,
    gender: 'Male',
    phone: '+91 98860 77209',
    address: '#52, 7th Cross, Sahakarnagar D-Block',
    area: 'Sahakarnagar D-Block',
    careType: 'clinic',
    treatmentType: 'IT/Posture',
    injuryCategory: 'Spine & Posture',
    diagnosis: 'Repetitive Strain Injury (RSI) Right Extensor Carpi Radialis Tendinopathy (Mouse Arm)',
    referringDoctor: 'Colleague Referral (Amazon Tech Lead)',
    packageType: 10,
    sessionsCompleted: 9,
    totalPackageFee: 9500,
    paymentStatus: 'Paid',
    amountPaid: 9500,
    startDate: '2026-08-18',
    lastSessionDate: '2026-09-03',
    initialPainVAS: 6,
    currentPainVAS: 1,
    targetOutcome: 'Ergonomic vertical mouse adaptation, painless coding sessions',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-013',
    fullName: 'Deepa Narayan',
    age: 38,
    gender: 'Female',
    phone: '+91 94480 55198',
    address: 'Villa 22, RMZ Galleria Residences, Yelahanka/Sahakar Border',
    area: 'RMZ Galleria Corridor',
    careType: 'home_care',
    treatmentType: 'IT/Posture',
    injuryCategory: 'Spine & Posture',
    diagnosis: 'Post-Partum Sacroiliac (SI) Joint Dysfunction & Lumbar Instability',
    referringDoctor: 'Dr. Chitra (Gynecologist, Cloudnine Hebbal)',
    packageType: 15,
    sessionsCompleted: 15,
    totalPackageFee: 21000,
    paymentStatus: 'Paid',
    amountPaid: 21000,
    startDate: '2026-07-25',
    lastSessionDate: '2026-08-30',
    initialPainVAS: 8,
    currentPainVAS: 1,
    targetOutcome: 'Pelvic floor & transversus abdominis co-activation, painless infant lifting',
    status: 'Completed',
    notes: []
  },

  // 45-59 Age Group (Middle-Age / Degenerative & Chronic Musculoskeletal)
  {
    id: 'pt-005',
    fullName: 'Geetha Narayanaswamy',
    age: 58,
    gender: 'Female',
    phone: '+91 98860 11954',
    address: '#78, 2nd Cross, E-Block, Sahakarnagar',
    area: 'Sahakarnagar E-Block',
    careType: 'clinic',
    treatmentType: 'IT/Posture',
    injuryCategory: 'Spine & Posture',
    diagnosis: 'L4-L5 Lumbar Disc Bulge with Left Sciatica',
    referringDoctor: 'Dr. Anand Kumar (Spine Specialist, Aster CMI)',
    packageType: 20,
    sessionsCompleted: 16,
    totalPackageFee: 18000,
    paymentStatus: 'Paid',
    amountPaid: 18000,
    startDate: '2026-08-01',
    lastSessionDate: '2026-09-03',
    initialPainVAS: 8,
    currentPainVAS: 2,
    targetOutcome: 'Centralization of leg pain, resumption of 45-min morning walks',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-014',
    fullName: 'Rajesh V. Nambiar',
    age: 52,
    gender: 'Male',
    phone: '+91 98450 66321',
    address: '#114, 5th Cross, Telecom Layout, Sahakarnagar',
    area: 'Telecom Layout',
    careType: 'clinic',
    treatmentType: 'Chronic',
    injuryCategory: 'Geriatric & Joint',
    diagnosis: 'Adhesive Capsulitis (Frozen Shoulder - Freezing Stage)',
    referringDoctor: 'Dr. Pradeep (Orthopedic Consultant)',
    packageType: 20,
    sessionsCompleted: 18,
    totalPackageFee: 18000,
    paymentStatus: 'Paid',
    amountPaid: 18000,
    startDate: '2026-07-20',
    lastSessionDate: '2026-09-02',
    initialPainVAS: 8,
    currentPainVAS: 3,
    targetOutcome: 'Glenohumeral external rotation 45 deg, pain-free overhead reaching',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-015',
    fullName: 'Sunita Krishnaswamy',
    age: 55,
    gender: 'Female',
    phone: '+91 99001 88920',
    address: '#31, 3rd Main, Judicial Layout',
    area: 'Judicial Layout',
    careType: 'clinic',
    treatmentType: 'Chronic',
    injuryCategory: 'Geriatric & Joint',
    diagnosis: 'Bilateral Plantar Fasciitis & Calcaneal Spur with Morning Heel Pain',
    referringDoctor: 'Self / Word of Mouth (Judicial Layout Residents Association)',
    packageType: 10,
    sessionsCompleted: 10,
    totalPackageFee: 9500,
    paymentStatus: 'Paid',
    amountPaid: 9500,
    startDate: '2026-08-08',
    lastSessionDate: '2026-08-31',
    initialPainVAS: 8,
    currentPainVAS: 2,
    targetOutcome: 'First-step morning weight bearing pain free, calf gastroc-soleus flexibility',
    status: 'Completed',
    notes: []
  },
  {
    id: 'pt-016',
    fullName: 'Anand G. Kulkarni',
    age: 48,
    gender: 'Male',
    phone: '+91 94481 99201',
    address: 'B-302, NCC Urban Windsor, Yelahanka Road',
    area: 'Bellary Road',
    careType: 'clinic',
    treatmentType: 'Chronic',
    injuryCategory: 'Sports & Musculoskeletal',
    diagnosis: 'Lateral Epicondylalgia (Tennis Elbow) & Wrist Extensor Overuse',
    referringDoctor: 'Bangalore Baptist Hospital OPD',
    packageType: 10,
    sessionsCompleted: 8,
    totalPackageFee: 9500,
    paymentStatus: 'Partial',
    amountPaid: 5000,
    startDate: '2026-08-22',
    lastSessionDate: '2026-09-04',
    initialPainVAS: 7,
    currentPainVAS: 3,
    targetOutcome: 'Grip strength 35 kg without lateral epicondyle sharp twinges',
    status: 'Active',
    notes: []
  },

  // 60-74 Age Group (Young Seniors / Post-Op & Early Geriatric)
  {
    id: 'pt-001',
    fullName: 'Suryanarayana Rao',
    age: 72,
    gender: 'Male',
    phone: '+91 98450 21980',
    address: '#142, 4th Main, Judicial Layout',
    area: 'Judicial Layout',
    careType: 'home_care',
    treatmentType: 'Post-Surgery',
    injuryCategory: 'Post-Surgical',
    diagnosis: 'Left Total Knee Replacement (TKR) - Post-Op Day 14 Rehabilitation',
    referringDoctor: 'Dr. M. S. Hegde (Aster CMI)',
    packageType: 20,
    sessionsCompleted: 14,
    totalPackageFee: 26000,
    paymentStatus: 'Paid',
    amountPaid: 26000,
    startDate: '2026-08-10',
    lastSessionDate: '2026-09-05',
    initialPainVAS: 8,
    currentPainVAS: 3,
    targetOutcome: 'Independent stair climbing, 115 deg knee flexion, zero walker dependence',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-017',
    fullName: 'Meenakshi Sundaram',
    age: 68,
    gender: 'Female',
    phone: '+91 94801 44012',
    address: '#66, Canara Bank Layout, Sahakarnagar',
    area: 'Canara Bank Layout',
    careType: 'home_care',
    treatmentType: 'Chronic',
    injuryCategory: 'Geriatric & Joint',
    diagnosis: 'Osteopenia & Cervical Spondylosis with Progressive Balance Hesitancy',
    referringDoctor: 'Family Physician Referral',
    packageType: 15,
    sessionsCompleted: 14,
    totalPackageFee: 21000,
    paymentStatus: 'Paid',
    amountPaid: 21000,
    startDate: '2026-08-04',
    lastSessionDate: '2026-09-03',
    initialPainVAS: 6,
    currentPainVAS: 2,
    targetOutcome: 'Confidence in unassisted community walking, vestibular-ocular gaze stabilization',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-018',
    fullName: 'Capt. K. P. Nair (Retd.)',
    age: 71,
    gender: 'Male',
    phone: '+91 98453 11802',
    address: '#89, Tata Nagar Main Road',
    area: 'Tata Nagar',
    careType: 'home_care',
    treatmentType: 'Post-Surgery',
    injuryCategory: 'Post-Surgical',
    diagnosis: 'Right Total Hip Replacement (Posterior Approach) - Day 21 Post-Op',
    referringDoctor: 'Manipal Hospital Hebbal Ortho',
    packageType: 20,
    sessionsCompleted: 19,
    totalPackageFee: 26000,
    paymentStatus: 'Paid',
    amountPaid: 26000,
    startDate: '2026-07-22',
    lastSessionDate: '2026-09-01',
    initialPainVAS: 8,
    currentPainVAS: 2,
    targetOutcome: 'Restoration of hip abductor strength (Trendelenburg negative), walking stick discharge',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-019',
    fullName: 'Dr. C. Balasubramanian',
    age: 65,
    gender: 'Male',
    phone: '+91 99000 33418',
    address: 'Flat 201, Shriram Sahaana, Amruthahalli',
    area: 'Amruthahalli',
    careType: 'clinic',
    treatmentType: 'Chronic',
    injuryCategory: 'Spine & Posture',
    diagnosis: 'Cervical Spondylotic Radiculopathy & Hand Intrinsic Weakness',
    referringDoctor: 'Retired Professor Association',
    packageType: 20,
    sessionsCompleted: 17,
    totalPackageFee: 18000,
    paymentStatus: 'Paid',
    amountPaid: 18000,
    startDate: '2026-08-02',
    lastSessionDate: '2026-09-05',
    initialPainVAS: 7,
    currentPainVAS: 2,
    targetOutcome: 'Pen grip handwriting endurance without numbness, full cervical extension',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-020',
    fullName: 'Radhika Jayaraman',
    age: 63,
    gender: 'Female',
    phone: '+91 98455 88921',
    address: '#14, 8th Main, Sahakarnagar C-Block',
    area: 'Sahakarnagar C-Block',
    careType: 'clinic',
    treatmentType: 'Post-Surgery',
    injuryCategory: 'Post-Surgical',
    diagnosis: 'Post-Distal Radius Colles Fracture (ORIF Plating) Wrist Stiffness',
    referringDoctor: 'Baptist Hospital Orthopedics',
    packageType: 15,
    sessionsCompleted: 15,
    totalPackageFee: 13500,
    paymentStatus: 'Paid',
    amountPaid: 13500,
    startDate: '2026-07-28',
    lastSessionDate: '2026-09-02',
    initialPainVAS: 7,
    currentPainVAS: 1,
    targetOutcome: 'Wrist extension 60 deg, supination 75 deg, kitchen jar opening strength',
    status: 'Completed',
    notes: []
  },

  // 75+ Age Group (Super Seniors / Geriatric Home Care & Fall Prevention)
  {
    id: 'pt-003',
    fullName: 'Kamalamma Venkatesh',
    age: 78,
    gender: 'Female',
    phone: '+91 94481 33290',
    address: '#29, 60 Feet Road, CQAL Layout',
    area: 'CQAL Layout',
    careType: 'home_care',
    treatmentType: 'Chronic',
    injuryCategory: 'Geriatric & Joint',
    diagnosis: 'Bilateral Knee Osteoarthritis (Grade 3 KL) & High Fall Risk',
    referringDoctor: 'Dr. R. K. Prasad (Consultant Geriatrician)',
    packageType: 25,
    sessionsCompleted: 19,
    totalPackageFee: 32000,
    paymentStatus: 'Paid',
    amountPaid: 32000,
    startDate: '2026-07-28',
    lastSessionDate: '2026-09-04',
    initialPainVAS: 9,
    currentPainVAS: 4,
    targetOutcome: 'Indoor sit-to-stand from low chair without arm pulling, zero falls',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-006',
    fullName: 'Major General (Retd.) K. B. Somanna',
    age: 82,
    gender: 'Male',
    phone: '+91 94800 77119',
    address: 'Bungalow #12, Defence Colony, Sahakarnagar A-Block',
    area: 'Sahakarnagar A-Block',
    careType: 'home_care',
    treatmentType: 'Chronic',
    injuryCategory: 'Geriatric & Joint',
    diagnosis: 'Post-Fall Hip Contusion & Postural Instability with Mild Parkinsonian Rigidity',
    referringDoctor: 'Dr. Col. Rajeev Menon (Command Hospital Referral)',
    packageType: 20,
    sessionsCompleted: 20,
    totalPackageFee: 28000,
    paymentStatus: 'Paid',
    amountPaid: 28000,
    startDate: '2026-07-15',
    lastSessionDate: '2026-08-30',
    initialPainVAS: 7,
    currentPainVAS: 1,
    targetOutcome: 'Safe unassisted transfers, dynamic dual-task gait retraining',
    status: 'Completed',
    notes: []
  },
  {
    id: 'pt-021',
    fullName: 'Saraswathi Bai',
    age: 85,
    gender: 'Female',
    phone: '+91 97410 55891',
    address: '#54, 2nd Main, Judicial Layout',
    area: 'Judicial Layout',
    careType: 'home_care',
    treatmentType: 'Post-Surgery',
    injuryCategory: 'Post-Surgical',
    diagnosis: 'Right Hip Hemiarthroplasty (Subcapital Femoral Neck Fracture Rehab)',
    referringDoctor: 'Aster CMI Ortho Department',
    packageType: 25,
    sessionsCompleted: 21,
    totalPackageFee: 32000,
    paymentStatus: 'Paid',
    amountPaid: 32000,
    startDate: '2026-07-10',
    lastSessionDate: '2026-09-02',
    initialPainVAS: 9,
    currentPainVAS: 2,
    targetOutcome: 'Safe walker ambulation across apartment, bed-to-commode transfers',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-022',
    fullName: 'Col. N. Acharya',
    age: 79,
    gender: 'Male',
    phone: '+91 98450 77112',
    address: '#73, Defense Officers Enclave, Tata Nagar',
    area: 'Tata Nagar',
    careType: 'home_care',
    treatmentType: 'Chronic',
    injuryCategory: 'Spine & Posture',
    diagnosis: 'Lumbar Canal Stenosis with Neurogenic Claudication (Walking Limit 50m)',
    referringDoctor: 'Senior Citizens Forum Sahakarnagar',
    packageType: 25,
    sessionsCompleted: 18,
    totalPackageFee: 32000,
    paymentStatus: 'Paid',
    amountPaid: 32000,
    startDate: '2026-07-20',
    lastSessionDate: '2026-09-03',
    initialPainVAS: 8,
    currentPainVAS: 3,
    targetOutcome: 'Claudication distance extended to 250m, flexion-biased spine mechanics',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-023',
    fullName: 'Padmavathi K.',
    age: 80,
    gender: 'Female',
    phone: '+91 98800 22194',
    address: 'Flat 104, Prakruthi Meadows, Amruthahalli',
    area: 'Amruthahalli',
    careType: 'home_care',
    treatmentType: 'Chronic',
    injuryCategory: 'Geriatric & Joint',
    diagnosis: 'Severe Bilateral Varus Knee Deformity & Sarcopenic Weakness',
    referringDoctor: 'Family Physician Dr. Shylaja',
    packageType: 20,
    sessionsCompleted: 16,
    totalPackageFee: 26000,
    paymentStatus: 'Paid',
    amountPaid: 26000,
    startDate: '2026-08-01',
    lastSessionDate: '2026-09-05',
    initialPainVAS: 8,
    currentPainVAS: 3,
    targetOutcome: 'Independent standing up from bed, reduced knee swelling with cryotherapy',
    status: 'Active',
    notes: []
  },
  {
    id: 'pt-024',
    fullName: 'Venkatesh Murthy (Sr.)',
    age: 76,
    gender: 'Male',
    phone: '+91 94480 33119',
    address: '#81, 4th Cross, Sahakarnagar G-Block',
    area: 'Sahakarnagar G-Block',
    careType: 'home_care',
    treatmentType: 'Chronic',
    injuryCategory: 'Geriatric & Joint',
    diagnosis: 'Cervical Spondylosis with Chronic Tension & Vestibular Dizziness',
    referringDoctor: 'Aster CMI Neurology',
    packageType: 15,
    sessionsCompleted: 15,
    totalPackageFee: 21000,
    paymentStatus: 'Paid',
    amountPaid: 21000,
    startDate: '2026-07-18',
    lastSessionDate: '2026-08-25',
    initialPainVAS: 6,
    currentPainVAS: 1,
    targetOutcome: 'Epley maneuver canalith repositioning relief, full neck lateral flexion',
    status: 'Completed',
    notes: []
  }
];

// Funnel and Drop-Off Analysis across Package Lifecycles
export const PACKAGE_FUNNEL_STAGES: DropOffFunnelStage[] = [
  {
    milestone: 'Sessions 1–3',
    sessionRange: 'Week 1',
    retentionPercent: 98,
    dropOffPercent: 2,
    psychologicalDriver: 'High motivation, acute pain seeking immediate relief.',
    clinicalAction: 'Clear diagnostic communication, early pain relief modalities (cryo/IFT/manual release).'
  },
  {
    milestone: 'Sessions 4–6',
    sessionRange: 'Week 2 (False Recovery Trap)',
    retentionPercent: 88,
    dropOffPercent: 10,
    psychologicalDriver: 'Pain drops from 8/10 to 3-4/10. Patient feels "cured" and considers skipping remaining sessions.',
    clinicalAction: 'Mid-package VAS reassessment + functional movement test demonstrating tissue fragility before strengthening.'
  },
  {
    milestone: 'Sessions 7–10',
    sessionRange: 'Weeks 3–4 (Strength Transition)',
    retentionPercent: 84,
    dropOffPercent: 4,
    psychologicalDriver: 'Active exercise replaces passive modalities; minor DOMS (muscle soreness) can cause hesitation.',
    clinicalAction: 'Educate on active muscle re-education vs pain; introduce gamified theraband / gym progression.'
  },
  {
    milestone: 'Sessions 11–15',
    sessionRange: 'Weeks 5–6 (Return to Function)',
    retentionPercent: 81,
    dropOffPercent: 3,
    psychologicalDriver: 'Return to sports/office work. Scheduling friction with meetings.',
    clinicalAction: 'Flexible evening/early morning slots + hybrid home-routine maintenance check.'
  },
  {
    milestone: 'Sessions 16–20+',
    sessionRange: 'Weeks 7–10 (Long-Term Independence)',
    retentionPercent: 79,
    dropOffPercent: 2,
    psychologicalDriver: 'Graduation phase or continuation for chronic elder care.',
    clinicalAction: 'Formal Graduation Certificate + monthly elder check-in subscription conversion.'
  }
];

// Marketing Channel ROI and Performance Benchmarks
export const MARKETING_CHANNELS_DATA: MarketingChannelPerformance[] = [
  {
    channel: 'Orthopedic Doctor Liaisons',
    segmentTarget: 'Post-Surgical (TKR/THR) & Severe Spine',
    monthlySpendInr: 6000,
    leadsGenerated: 18,
    patientsEnrolled: 14,
    conversionRatePercent: 77.8,
    cacInr: 428,
    ltvInr: 25400,
    roiMultiple: 59.3,
    keyAction: 'Bi-weekly clinical recovery audit reports delivered to Aster CMI & Baptist orthopedic surgeons.'
  },
  {
    channel: 'Gated Society RWA Camps',
    segmentTarget: 'Elderly 65+ Home Care & Chronic Knee OA',
    monthlySpendInr: 8000,
    leadsGenerated: 32,
    patientsEnrolled: 19,
    conversionRatePercent: 59.4,
    cacInr: 421,
    ltvInr: 28500,
    roiMultiple: 67.7,
    keyAction: 'Sunday morning Free Fall-Risk & Grip-Strength Screenings in Tata Nagar & Judicial Layout clubhouses.'
  },
  {
    channel: 'Manyata Corporate Ergonomics',
    segmentTarget: 'IT Desk Strain, Tech Neck & Spine (30–44y)',
    monthlySpendInr: 10000,
    leadsGenerated: 45,
    patientsEnrolled: 21,
    conversionRatePercent: 46.7,
    cacInr: 476,
    ltvInr: 14200,
    roiMultiple: 29.8,
    keyAction: 'Lunch-and-learn posture screen & instant 15-minute ergonomic clinic voucher distribution.'
  },
  {
    channel: 'Hyperlocal Google Maps & Reviews',
    segmentTarget: 'Local Sahakarnagar Walk-Ins & Sports (18–35y)',
    monthlySpendInr: 5000,
    leadsGenerated: 28,
    patientsEnrolled: 16,
    conversionRatePercent: 57.1,
    cacInr: 312,
    ltvInr: 12800,
    roiMultiple: 41.0,
    keyAction: 'Post-recovery Google review generation automated via WhatsApp when patient drops to VAS <= 2.'
  },
  {
    channel: 'Badminton & Turf Club Partnerships',
    segmentTarget: 'Athletes & College Students (18–28y)',
    monthlySpendInr: 4000,
    leadsGenerated: 16,
    patientsEnrolled: 10,
    conversionRatePercent: 62.5,
    cacInr: 400,
    ltvInr: 11500,
    roiMultiple: 28.7,
    keyAction: 'Official physio partner for Reva university sports fest & Sahakarnagar indoor badminton courts.'
  }
];
