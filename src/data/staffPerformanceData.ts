import {
  DailyUtilizationRecord,
  HourlyDensitySlot,
  BurnoutRiskFactor,
  ScheduleOptimizationGuardrails,
  UtilizationHealthZone
} from '../types';

export const DEFAULT_GUARDRAILS: ScheduleOptimizationGuardrails = {
  enforce15MinInterSessionBuffer: true,
  protect45MinLunchWindow: true,
  capDailyManualTherapySessions: true,
  maxManualSessionsLimit: 4,
  delegateModalityPrepToAssistant: true,
  lockDocumentationBlockEndDay: true,
  staggerEveningPeakSlots: true,
};

// Lead PT: Dr. Aditi Rao, MPT (Orthopedics) Profile
export const LEAD_THERAPIST_INFO = {
  id: 'therapist-aditi',
  name: 'Dr. Aditi Rao, MPT',
  credentials: 'MPT (Orthopedics & Sports Rehab), MIAP',
  role: 'Lead Physiotherapist & Clinical Director',
  avatarBg: 'bg-teal-700',
  colorTheme: 'teal',
  experienceYears: 9,
  specialization: 'Post-Surgical Joint Rehab, Spine Biomechanics & Manual Joint Mobilization',
  baseLocation: '600 sq ft Sahakarnagar Clinic Base',
  weeklyContractHours: 48,
  dailyShiftHours: 8.0,
  targetUtilizationMin: 65,
  targetUtilizationMax: 75,
  burnoutHazardThreshold: 82,
  maxRecommendedDailySessions: 8,
  optimalDailySessions: 6.5,
};

// Mobile PT: Dr. Vikram K., BPT Profile
export const MOBILE_THERAPIST_INFO = {
  id: 'therapist-vikram',
  name: 'Dr. Vikram K., BPT',
  credentials: 'BPT, Geriatric Rehab & Neurological Balance Specialist',
  role: 'Senior Mobile & Geriatric Care Lead',
  avatarBg: 'bg-emerald-700',
  colorTheme: 'emerald',
  experienceYears: 6,
  specialization: 'Home-Visit Geriatric Fall Prevention & Post-Stroke Mobility',
  baseLocation: 'Sahakarnagar & North Bangalore Neighborhoods (Judicial, Tata Nagar, Amruthahalli)',
  weeklyContractHours: 48,
  dailyShiftHours: 8.0,
  targetUtilizationMin: 55, // lower direct care due to unavoidable transit
  targetUtilizationMax: 65,
  burnoutHazardThreshold: 75,
  maxRecommendedDailySessions: 5,
  optimalDailySessions: 4,
};

// Past 4 Weeks & Current Week Daily Utilization History for Dr. Aditi Rao
export const DR_ADITI_DAILY_HISTORY: DailyUtilizationRecord[] = [
  // Current Week (Sep 07, 2026 week)
  {
    date: '2026-09-07',
    dayName: 'Monday (Today)',
    therapistId: 'therapist-aditi',
    therapistName: 'Dr. Aditi Rao, MPT',
    totalShiftHours: 8.5,
    availableHours: 7.75, // 8.5h minus 45m mandatory lunch
    clinicalDirectHours: 5.75,
    adminDocumentationHours: 1.0,
    bufferRestHours: 0.5,
    transitTravelHours: 0,
    idleCapacityHours: 0.5,
    utilizationRatePercent: 74.2, // 5.75 / 7.75
    effectiveUtilizationPercent: 87.1, // (5.75 + 1.0) / 7.75
    scheduledSessions: 7,
    completedSessions: 6,
    cancelledSessions: 0,
    rescheduledSessions: 1,
    highIntensityManualSessions: 3,
    moderateGymSessions: 2,
    lowIntensityModalitiesSessions: 1,
    consecutiveSessionStreakMax: 2,
    longestRestBreakMinutes: 45,
    lunchBreakTakenMinutes: 45,
    burnoutRiskScore: 34,
    burnoutStatus: 'Optimal',
    revenueGeneratedInr: 6000,
    patientFeedbackScore: 4.9,
    notes: 'Balanced workload. Assistant PT assisted with IFT and cryo pack prep in Station 1.',
  },
  {
    date: '2026-09-08',
    dayName: 'Tuesday (Tomorrow)',
    therapistId: 'therapist-aditi',
    therapistName: 'Dr. Aditi Rao, MPT',
    totalShiftHours: 8.5,
    availableHours: 7.75,
    clinicalDirectHours: 5.5,
    adminDocumentationHours: 1.25,
    bufferRestHours: 0.5,
    transitTravelHours: 0,
    idleCapacityHours: 0.5,
    utilizationRatePercent: 71.0,
    effectiveUtilizationPercent: 87.1,
    scheduledSessions: 6,
    completedSessions: 6,
    cancelledSessions: 0,
    rescheduledSessions: 0,
    highIntensityManualSessions: 2,
    moderateGymSessions: 3,
    lowIntensityModalitiesSessions: 1,
    consecutiveSessionStreakMax: 2,
    longestRestBreakMinutes: 45,
    lunchBreakTakenMinutes: 45,
    burnoutRiskScore: 28,
    burnoutStatus: 'Optimal',
    revenueGeneratedInr: 6000,
    patientFeedbackScore: 5.0,
    notes: 'Well spaced with 15m hygiene buffers between morning ACL rehab and shoulder impingement.',
  },
  {
    date: '2026-09-09',
    dayName: 'Wednesday',
    therapistId: 'therapist-aditi',
    therapistName: 'Dr. Aditi Rao, MPT',
    totalShiftHours: 8.5,
    availableHours: 7.75,
    clinicalDirectHours: 6.5,
    adminDocumentationHours: 0.75,
    bufferRestHours: 0.25,
    transitTravelHours: 0,
    idleCapacityHours: 0.25,
    utilizationRatePercent: 83.9, // Warning zone!
    effectiveUtilizationPercent: 93.5,
    scheduledSessions: 8,
    completedSessions: 8,
    cancelledSessions: 0,
    rescheduledSessions: 0,
    highIntensityManualSessions: 5, // High manual load!
    moderateGymSessions: 2,
    lowIntensityModalitiesSessions: 1,
    consecutiveSessionStreakMax: 4, // 4 in a row!
    longestRestBreakMinutes: 30,
    lunchBreakTakenMinutes: 30, // Cut short
    burnoutRiskScore: 78,
    burnoutStatus: 'High-Workload',
    revenueGeneratedInr: 8000,
    patientFeedbackScore: 4.7,
    notes: 'High strain day: 4 consecutive manual therapy slots in afternoon led to therapist forearm fatigue.',
  },
  {
    date: '2026-09-10',
    dayName: 'Thursday',
    therapistId: 'therapist-aditi',
    therapistName: 'Dr. Aditi Rao, MPT',
    totalShiftHours: 8.5,
    availableHours: 7.75,
    clinicalDirectHours: 5.25,
    adminDocumentationHours: 1.5,
    bufferRestHours: 0.5,
    transitTravelHours: 0,
    idleCapacityHours: 0.5,
    utilizationRatePercent: 67.7,
    effectiveUtilizationPercent: 87.1,
    scheduledSessions: 6,
    completedSessions: 5,
    cancelledSessions: 1,
    rescheduledSessions: 0,
    highIntensityManualSessions: 2,
    moderateGymSessions: 2,
    lowIntensityModalitiesSessions: 1,
    consecutiveSessionStreakMax: 2,
    longestRestBreakMinutes: 45,
    lunchBreakTakenMinutes: 45,
    burnoutRiskScore: 25,
    burnoutStatus: 'Optimal',
    revenueGeneratedInr: 5000,
    patientFeedbackScore: 4.9,
    notes: 'Recovery day. One patient rescheduled to Friday. Documentation completed before 6:30 PM.',
  },
  {
    date: '2026-09-11',
    dayName: 'Friday',
    therapistId: 'therapist-aditi',
    therapistName: 'Dr. Aditi Rao, MPT',
    totalShiftHours: 8.5,
    availableHours: 7.75,
    clinicalDirectHours: 6.0,
    adminDocumentationHours: 1.0,
    bufferRestHours: 0.5,
    transitTravelHours: 0,
    idleCapacityHours: 0.25,
    utilizationRatePercent: 77.4,
    effectiveUtilizationPercent: 90.3,
    scheduledSessions: 7,
    completedSessions: 7,
    cancelledSessions: 0,
    rescheduledSessions: 0,
    highIntensityManualSessions: 3,
    moderateGymSessions: 3,
    lowIntensityModalitiesSessions: 1,
    consecutiveSessionStreakMax: 3,
    longestRestBreakMinutes: 45,
    lunchBreakTakenMinutes: 45,
    burnoutRiskScore: 48,
    burnoutStatus: 'Optimal',
    revenueGeneratedInr: 7000,
    patientFeedbackScore: 4.8,
    notes: 'Moderate-high volume. Evening tech-workers from Manyata arrived on time.',
  },
  {
    date: '2026-09-12',
    dayName: 'Saturday (Half Shift)',
    therapistId: 'therapist-aditi',
    therapistName: 'Dr. Aditi Rao, MPT',
    totalShiftHours: 6.0,
    availableHours: 5.5,
    clinicalDirectHours: 4.0,
    adminDocumentationHours: 1.0,
    bufferRestHours: 0.25,
    transitTravelHours: 0,
    idleCapacityHours: 0.25,
    utilizationRatePercent: 72.7,
    effectiveUtilizationPercent: 90.9,
    scheduledSessions: 5,
    completedSessions: 5,
    cancelledSessions: 0,
    rescheduledSessions: 0,
    highIntensityManualSessions: 2,
    moderateGymSessions: 2,
    lowIntensityModalitiesSessions: 1,
    consecutiveSessionStreakMax: 2,
    longestRestBreakMinutes: 30,
    lunchBreakTakenMinutes: 30,
    burnoutRiskScore: 29,
    burnoutStatus: 'Optimal',
    revenueGeneratedInr: 5000,
    patientFeedbackScore: 5.0,
    notes: 'Weekend morning rush. Smooth flow with 100% attendance.',
  },
];

// Past 4 Weeks Aggregate Performance for Lead Physiotherapist
export const DR_ADITI_WEEKLY_AGGREGATES = [
  {
    weekLabel: 'Week 1 (Aug 10 - 15)',
    availableShiftHours: 46.5,
    clinicalHours: 31.5,
    adminHours: 6.5,
    bufferRestHours: 3.5,
    idleHours: 5.0,
    utilizationPercent: 67.7,
    sessionsCompleted: 34,
    sessionsTarget: 40,
    completionRate: 85.0,
    cancellations: 3,
    rescheduled: 2,
    avgFatigueScore: 32,
    burnoutRisk: 'Optimal',
    revenueInr: 34000,
  },
  {
    weekLabel: 'Week 2 (Aug 17 - 22)',
    availableShiftHours: 46.5,
    clinicalHours: 34.0,
    adminHours: 6.0,
    bufferRestHours: 3.0,
    idleHours: 3.5,
    utilizationPercent: 73.1,
    sessionsCompleted: 38,
    sessionsTarget: 40,
    completionRate: 95.0,
    cancellations: 1,
    rescheduled: 1,
    avgFatigueScore: 41,
    burnoutRisk: 'Optimal',
    revenueInr: 38000,
  },
  {
    weekLabel: 'Week 3 (Aug 24 - 29)',
    availableShiftHours: 46.5,
    clinicalHours: 38.5, // Unmanaged spike!
    adminHours: 4.5,
    bufferRestHours: 1.5,
    idleHours: 2.0,
    utilizationPercent: 82.8, // Critical threshold breach!
    sessionsCompleted: 44,
    sessionsTarget: 40,
    completionRate: 110.0,
    cancellations: 0,
    rescheduled: 0,
    avgFatigueScore: 76,
    burnoutRisk: 'High-Workload',
    revenueInr: 44000,
  },
  {
    weekLabel: 'Week 4 (Aug 31 - Sep 05)',
    availableShiftHours: 46.5,
    clinicalHours: 33.5, // Guardrails implemented!
    adminHours: 6.5,
    bufferRestHours: 3.5,
    idleHours: 3.0,
    utilizationPercent: 72.0, // Back to optimal!
    sessionsCompleted: 39,
    sessionsTarget: 42,
    completionRate: 92.8,
    cancellations: 2,
    rescheduled: 1,
    avgFatigueScore: 35,
    burnoutRisk: 'Optimal',
    revenueInr: 39000,
  },
];

// Today's Detailed Hourly Density & Fatigue Timeline for Dr. Aditi Rao
export const TODAY_HOURLY_SLOTS: HourlyDensitySlot[] = [
  {
    slotId: 'slot-1',
    timeRange: '08:00 - 08:30',
    startMinutes: 480,
    durationMinutes: 30,
    status: 'Admin_SOAP',
    strainLevel: 'Rest_Admin',
    manualTherapyRequired: false,
    bayOrStation: 'Consultation Desk',
    burnoutRiskFlag: 'None',
    suggestedAction: 'Morning case review & review patient VAS logs before first patient.',
  },
  {
    slotId: 'slot-2',
    timeRange: '08:30 - 09:30',
    startMinutes: 510,
    durationMinutes: 60,
    patientName: 'Lakshmi Venkataraman (68F)',
    patientId: 'pt-002',
    conditionDiagnosis: 'Bilateral Knee Osteoarthritis (Grade 3) with morning stiffness',
    status: 'Completed',
    treatmentType: 'Chronic',
    strainLevel: 'Moderate',
    manualTherapyRequired: true,
    assistantAssigned: 'Assistant PT assisted with IFT and patellar cryotherapy',
    bayOrStation: 'Station 1: Electrotherapy & Traction Bay',
    burnoutRiskFlag: 'None',
    suggestedAction: 'Delegating IFT setup saved 15m manual therapist time.',
  },
  {
    slotId: 'slot-3',
    timeRange: '09:30 - 09:45',
    startMinutes: 570,
    durationMinutes: 15,
    status: 'Break',
    strainLevel: 'Rest_Admin',
    manualTherapyRequired: false,
    bayOrStation: 'Staff Lounge',
    burnoutRiskFlag: 'Protected Buffer',
    suggestedAction: 'Hydration & hand/wrist extensor stretching.',
  },
  {
    slotId: 'slot-4',
    timeRange: '09:45 - 10:45',
    startMinutes: 585,
    durationMinutes: 60,
    patientName: 'Ananya Deshmukh (21F)',
    patientId: 'pt-004',
    conditionDiagnosis: 'Right Rotator Cuff Tendinopathy & Subacromial Impingement',
    status: 'Completed',
    treatmentType: 'Sports',
    strainLevel: 'High',
    manualTherapyRequired: true,
    bayOrStation: 'Station 3: Active Functional Gym',
    burnoutRiskFlag: 'High Physical Force',
    suggestedAction: 'Manual scapular mobilization and eccentric supraspinatus resistance.',
  },
  {
    slotId: 'slot-5',
    timeRange: '10:45 - 11:15',
    startMinutes: 645,
    durationMinutes: 30,
    status: 'Admin_SOAP',
    strainLevel: 'Rest_Admin',
    manualTherapyRequired: false,
    bayOrStation: 'Consultation Desk',
    burnoutRiskFlag: 'Protected Documentation',
    suggestedAction: 'Mid-morning SOAP charting completed immediately to prevent end-of-day backlog.',
  },
  {
    slotId: 'slot-6',
    timeRange: '11:15 - 12:15',
    startMinutes: 675,
    durationMinutes: 60,
    patientName: 'Deepa Shankaran (33F)',
    patientId: 'pt-003',
    conditionDiagnosis: 'Cervical Radiculopathy (C5-C6) & Tech-Neck Desk Posture',
    status: 'Completed',
    treatmentType: 'IT/Posture',
    strainLevel: 'High',
    manualTherapyRequired: true,
    bayOrStation: 'Station 2: Manual Mobilization Bed',
    burnoutRiskFlag: 'Consecutive High-Load Warning',
    suggestedAction: 'Second manual neck/spine session of the morning. Use mechanical traction for 15m to relieve manual hold time.',
  },
  {
    slotId: 'slot-7',
    timeRange: '12:15 - 13:00',
    startMinutes: 735,
    durationMinutes: 45,
    status: 'Available',
    strainLevel: 'Rest_Admin',
    manualTherapyRequired: false,
    bayOrStation: 'Clinic Re-set',
    burnoutRiskFlag: 'Buffer Healthy',
    suggestedAction: 'Unbooked buffer slot. Rest window utilized for phone inquiry triage.',
  },
  {
    slotId: 'slot-8',
    timeRange: '13:00 - 13:45',
    startMinutes: 780,
    durationMinutes: 45,
    status: 'Break',
    strainLevel: 'Rest_Admin',
    manualTherapyRequired: false,
    bayOrStation: 'Staff Lounge',
    burnoutRiskFlag: 'Protected Meal Lock',
    suggestedAction: 'Mandatory non-clinical meal & eye-rest period. Booking engine locked.',
  },
  {
    slotId: 'slot-9',
    timeRange: '13:45 - 14:45',
    startMinutes: 825,
    durationMinutes: 60,
    patientName: 'S. Narayanan (62M)',
    patientId: 'pt-009',
    conditionDiagnosis: 'Post-Lumbar Laminectomy & Core Muscle Inhibition',
    status: 'Completed',
    treatmentType: 'Post-Surgery',
    strainLevel: 'Moderate',
    manualTherapyRequired: false,
    assistantAssigned: 'Assistant PT guided parallel bar gait re-education',
    bayOrStation: 'Station 3: Active Functional Gym',
    burnoutRiskFlag: 'None',
    suggestedAction: 'Gentle core stabilization and functional sit-to-stand biofeedback.',
  },
  {
    slotId: 'slot-10',
    timeRange: '14:45 - 15:45',
    startMinutes: 885,
    durationMinutes: 60,
    status: 'Admin_SOAP',
    strainLevel: 'Rest_Admin',
    manualTherapyRequired: false,
    bayOrStation: 'Consultation Desk',
    burnoutRiskFlag: 'Protected Admin',
    suggestedAction: 'Writing orthopedist progress updates & reviewing WhatsApp patient exercise videos.',
  },
  {
    slotId: 'slot-11',
    timeRange: '15:45 - 16:00',
    startMinutes: 945,
    durationMinutes: 15,
    status: 'Break',
    strainLevel: 'Rest_Admin',
    manualTherapyRequired: false,
    bayOrStation: 'Clinic Base',
    burnoutRiskFlag: 'Hydration Reset',
    suggestedAction: 'Tea / green tea hydration before evening shift rush.',
  },
  {
    slotId: 'slot-12',
    timeRange: '16:00 - 17:00',
    startMinutes: 960,
    durationMinutes: 60,
    patientName: 'Ganesh Murthy (59M)',
    patientId: 'pt-006',
    conditionDiagnosis: 'Chronic Lumbar Spondylosis with L4-L5 facet arthrosis',
    status: 'In-Progress',
    treatmentType: 'Chronic',
    strainLevel: 'Moderate',
    manualTherapyRequired: true,
    bayOrStation: 'Station 1: Electrotherapy & Traction Bay',
    burnoutRiskFlag: 'None',
    suggestedAction: 'IFT 4-pole with vacuum pads + modified dead-bug core drill.',
  },
  {
    slotId: 'slot-13',
    timeRange: '17:00 - 17:30',
    startMinutes: 1020,
    durationMinutes: 30,
    status: 'Break',
    strainLevel: 'Rest_Admin',
    manualTherapyRequired: false,
    bayOrStation: 'Staff Lounge',
    burnoutRiskFlag: 'Evening Buffer',
    suggestedAction: 'Buffer between elderly chronic patient and high-intensity young athlete.',
  },
  {
    slotId: 'slot-14',
    timeRange: '17:30 - 18:30',
    startMinutes: 1050,
    durationMinutes: 60,
    patientName: 'Arvind Swamy (27M)',
    patientId: 'pt-007',
    conditionDiagnosis: 'Left Knee ACL Reconstruction (Hamstring) - Week 6 Post-Op',
    status: 'Scheduled',
    treatmentType: 'Post-Surgery',
    strainLevel: 'High',
    manualTherapyRequired: true,
    bayOrStation: 'Station 3: Active Functional Gym',
    burnoutRiskFlag: 'High Force Joint Mob',
    suggestedAction: 'Final manual therapy slot of the day. Terminal knee extension over-pressure.',
  },
  {
    slotId: 'slot-15',
    timeRange: '18:30 - 19:00',
    startMinutes: 1110,
    durationMinutes: 30,
    status: 'Admin_SOAP',
    strainLevel: 'Rest_Admin',
    manualTherapyRequired: false,
    bayOrStation: 'Consultation Desk',
    burnoutRiskFlag: 'Day Wrap & Log',
    suggestedAction: 'Final daily reconciliation, billing sign-off, clinic lock-up checklist.',
  },
];

// Clinical Ergonomic & Burnout Risk Factors Analysis
export const BURNOUT_RISK_FACTORS: BurnoutRiskFactor[] = [
  {
    id: 'factor-1',
    category: 'Ergonomic',
    title: 'Manual Joint Mobilization Volume',
    severity: 'Moderate',
    observedValue: '3 sessions today (Cap: 4)',
    recommendedThreshold: 'Max 4 high-force manual therapy cases/day',
    impactExplanation: 'Maitland Grade III/IV mobilizations and deep myofascial release produce high sustained loads on therapist carpometacarpal joints and cervical spine.',
    mitigationRecommendation: 'Utilize mobilization belts (Mulligan technique) and delegate preliminary thermal/electro-therapy prep to Assistant PT.',
  },
  {
    id: 'factor-2',
    category: 'Rest-Deficit',
    title: 'Consecutive Patient Session Clusters',
    severity: 'Low',
    observedValue: 'Max 2 consecutive sessions (with 15m gap)',
    recommendedThreshold: 'Never exceed 3 consecutive 60-min sessions without a 15-min break',
    impactExplanation: 'Consecutive sessions without micro-breaks compound musculoskeletal fatigue and degrade clinical diagnostic focus on late-afternoon patients.',
    mitigationRecommendation: 'Maintain automatic 15-minute inter-session buffer rule in Smart Scheduler booking engine.',
  },
  {
    id: 'factor-3',
    category: 'Documentation',
    title: 'End-of-Shift Charting Backlog',
    severity: 'Low',
    observedValue: '2 dedicated 30-min documentation blocks scheduled (10:45 AM & 14:45 PM)',
    recommendedThreshold: 'Document SOAP notes within 2 hours of treatment completion',
    impactExplanation: 'Accumulating 7 SOAP notes until 7:00 PM leads to late finishes, incomplete documentation, and cognitive exhaustion.',
    mitigationRecommendation: 'Preserve the mid-day and afternoon protected charting windows.',
  },
  {
    id: 'factor-4',
    category: 'Time-Pressure',
    title: 'Evening Manyata Tech-Worker Rush',
    severity: 'Moderate',
    observedValue: '2 sessions between 16:00 and 18:30',
    recommendedThreshold: 'Cap evening post-5:00 PM slots to 2 patients per therapist',
    impactExplanation: 'IT commuters leaving Manyata Business Park frequently arrive within a compressed 5:30 - 7:30 PM window, creating schedule pressure.',
    mitigationRecommendation: 'Incentivize 7:30 - 9:00 AM morning slots with express posture-reset packages to flatten peak evening demand.',
  },
];

// Comparative Staff Metrics Table
export const STAFF_COMPARATIVE_BENCHMARKS = [
  {
    therapistId: 'therapist-aditi',
    name: 'Dr. Aditi Rao, MPT (Lead In-Clinic)',
    role: 'Lead Physiotherapist',
    location: 'Clinic Base (600 sq ft)',
    weeklyContractHours: 48,
    clinicalDirectHours: 35.5,
    adminHours: 6.5,
    transitHours: 0,
    idleHours: 4.5,
    utilizationRate: 74.0, // 35.5 / 48
    effectiveProductiveRate: 87.5,
    sessionsCompleted: 39,
    avgSessionFee: 1000,
    grossWeeklyRevenue: 39000,
    burnoutRiskIndex: 34,
    statusZone: 'Optimal' as UtilizationHealthZone,
    primaryFatigueSource: 'Manual joint mobilization & thumb overuse',
  },
  {
    therapistId: 'therapist-vikram',
    name: 'Dr. Vikram K., BPT (Mobile Elder Lead)',
    role: 'Senior Mobile Specialist',
    location: 'Home Visits (Sahakarnagar & Judicial)',
    weeklyContractHours: 48,
    clinicalDirectHours: 26.0,
    adminHours: 4.5,
    transitHours: 13.5, // Significant road travel
    idleHours: 4.0,
    utilizationRate: 54.2, // Clinical only
    effectiveProductiveRate: 91.7, // (26 + 4.5 + 13.5) / 48
    sessionsCompleted: 26,
    avgSessionFee: 1500,
    grossWeeklyRevenue: 39000,
    burnoutRiskIndex: 46,
    statusZone: 'Optimal' as UtilizationHealthZone,
    primaryFatigueSource: 'Traffic congestion on Hebbal/Manyata corridor & carrying portable kits',
  },
  {
    therapistId: 'assistant-pt',
    name: 'Junior Assistant PT (Proposed Month 3)',
    role: 'Clinical Assistant & Modalities Support',
    location: 'Clinic Base & Transit Assistant',
    weeklyContractHours: 48,
    clinicalDirectHours: 18.0,
    adminHours: 8.0,
    transitHours: 6.0,
    idleHours: 16.0,
    utilizationRate: 37.5,
    effectiveProductiveRate: 66.7,
    sessionsCompleted: 24, // Setup & modality monitoring
    avgSessionFee: 500,
    grossWeeklyRevenue: 12000,
    burnoutRiskIndex: 18,
    statusZone: 'Under-Utilized' as UtilizationHealthZone,
    primaryFatigueSource: 'Station hygiene reset & equipment sterilization',
  },
];

// Helper: Calculate simulated metrics when guardrails are adjusted
export function calculateSimulatedPerformance(
  baseDay: DailyUtilizationRecord,
  guardrails: ScheduleOptimizationGuardrails
) {
  let directHours = baseDay.clinicalDirectHours;
  let adminHours = baseDay.adminDocumentationHours;
  let bufferHours = baseDay.bufferRestHours;
  let scheduled = baseDay.scheduledSessions;
  let manualCount = baseDay.highIntensityManualSessions;
  let burnoutScore = 32;

  // 1. Inter-session buffer effect
  if (guardrails.enforce15MinInterSessionBuffer) {
    bufferHours += 0.5;
    burnoutScore -= 12;
  } else {
    bufferHours -= 0.25;
    burnoutScore += 22; // High risk of fatigue
  }

  // 2. Protected lunch window
  if (guardrails.protect45MinLunchWindow) {
    burnoutScore -= 15;
  } else {
    // If lunch skipped for an extra patient
    directHours += 0.75;
    scheduled += 1;
    burnoutScore += 28;
  }

  // 3. Cap daily manual therapy sessions
  if (guardrails.capDailyManualTherapySessions && manualCount > guardrails.maxManualSessionsLimit) {
    const excess = manualCount - guardrails.maxManualSessionsLimit;
    manualCount = guardrails.maxManualSessionsLimit;
    burnoutScore -= excess * 8;
  }

  // 4. Delegate modality prep to assistant
  if (guardrails.delegateModalityPrepToAssistant) {
    // Saves 15m per modality patient (approx 0.75h) from manual holding
    burnoutScore -= 14;
    adminHours += 0.5; // Therapist can document during modality phase
  }

  // 5. Lock documentation block
  if (guardrails.lockDocumentationBlockEndDay) {
    burnoutScore -= 10;
  } else {
    burnoutScore += 18;
  }

  // Clamp burnout score 0 - 100
  burnoutScore = Math.max(5, Math.min(98, burnoutScore));

  const availableHours = baseDay.totalShiftHours - (guardrails.protect45MinLunchWindow ? 0.75 : 0.25);
  const utilization = Math.min(100, Math.round((directHours / availableHours) * 1000) / 10);
  const effectiveUtilization = Math.min(100, Math.round(((directHours + adminHours) / availableHours) * 1000) / 10);

  let status: UtilizationHealthZone = 'Optimal';
  if (utilization < 60) status = 'Under-Utilized';
  else if (utilization <= 75) status = 'Optimal';
  else if (utilization <= 82) status = 'High-Workload';
  else status = 'Critical-Burnout';

  const revenue = scheduled * 1000;

  return {
    directHours,
    adminHours,
    bufferHours,
    availableHours,
    utilization,
    effectiveUtilization,
    scheduled,
    manualCount,
    burnoutScore,
    status,
    revenue,
  };
}
