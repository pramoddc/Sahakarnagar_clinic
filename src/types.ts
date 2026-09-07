export interface StartupCapital {
  spaceDepositAndFitout: number; // ₹2.5L - 3.5L
  equipment: number; // ₹2.5L - 3L
  interiorsAndElectrical: number; // ₹1.0L - 1.5L
  licensesAndRegistration: number; // ₹30k - 40k
  bookingAndBranding: number; // ₹40k - 60k
  workingCapitalBuffer: number; // ₹2.0L - 3.0L
  totalCapital: number; // ₹40.0L
}

export interface MonthlyOperatingParams {
  patientsPerDay: number; // Default 15
  workingDaysPerMonth: number; // Default 25
  avgSessionPrice: number; // Default ₹1000
  physiotherapistSalary: number; // ₹45,000
  assistantSalary: number; // ₹15,000
  rent: number; // ₹35,000
  consumablesPercent: number; // 10% of revenue
  marketingBudget: number; // ₹15,000
  utilitiesAndSundries: number; // ₹10,000
}

export interface HomeCareParams {
  activeInMonth: boolean;
  homeVisitsPerDay: number; // e.g. 4-6 visits
  homeVisitPrice: number; // ₹1500 (premium)
  travelAllowancePerVisit: number; // ₹200
  secondPhysioHired: boolean;
  secondPhysioSalary: number; // ₹45,000
}

export interface TimelineMonth {
  month: number;
  phase: string;
  projectedRevenueMin: number;
  projectedRevenueMax: number;
  projectedProfitMin: number;
  projectedProfitMax: number;
  patientsPerDay: number;
  homeVisitsPerDay: number;
  keyMilestones: string[];
  focus: string;
}

export interface PatientPackage {
  id: string;
  name: string;
  targetDemographic: string;
  condition: string;
  recommendedSessions: number; // 10 to 25
  pricePerSession: number;
  packagePrice: number;
  recurringDurationWeeks: number;
  typicalOutcome: string;
  tag: 'Senior Elder' | 'IT Desk Worker' | 'College Athlete' | 'Post-Surgical';
}

export interface MarketSegment {
  id: string;
  title: string;
  demographic: string;
  whySahakarnagar: string;
  painPoints: string[];
  serviceOffering: string;
  expectedVolumeShare: number; // percentage
  marketingChannel: string;
  avgPackageSessions: number;
}

export interface Week1Task {
  id: string;
  category: 'PT Hiring' | 'Space Hunting' | 'Competitor Intel' | 'KPME Licensing';
  title: string;
  detail: string;
  actionableSteps: string[];
  completed: boolean;
  notes?: string;
}

export interface RiskItem {
  id: string;
  risk: string;
  severity: 'High' | 'Medium' | 'Critical';
  whyItMatters: string;
  warningSigns: string[];
  mitigationPlaybook: string[];
}

export interface FloorStation {
  id: string;
  name: string;
  sqFt: number;
  equipment: string[];
  purpose: string;
  capacityConcurrent: number;
  color: string;
}

export interface ClinicalSessionNote {
  id: string;
  sessionNumber: number;
  date: string;
  attendingPT: string;
  modalities: string[];
  painScoreVAS: number; // 0 to 10
  objectiveMeasurements: string; // e.g. "Active knee flexion: 110 deg (was 85 deg)"
  clinicalObservations: string; // SOAP notes
  homeExercisesPrescribed: string;
}

export type TreatmentType = 'Chronic' | 'Post-Surgery' | 'Sports' | 'IT/Posture';
export type ServiceLocation = 'Clinic' | 'Home';

export interface PatientRecord {
  id: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  address: string;
  area: string;
  careType: 'clinic' | 'home_care';
  treatmentType?: TreatmentType;
  injuryCategory: 'Geriatric & Joint' | 'Spine & Posture' | 'Post-Surgical' | 'Sports & Musculoskeletal' | TreatmentType;
  diagnosis: string;
  referringDoctor?: string;
  packageType: 10 | 15 | 20 | 25;
  sessionsCompleted: number;
  totalPackageFee: number;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
  amountPaid: number;
  startDate: string;
  lastSessionDate?: string;
  initialPainVAS: number; // 0 to 10
  currentPainVAS: number; // 0 to 10
  targetOutcome: string;
  status: 'Active' | 'Completed' | 'On Hold';
  notes: ClinicalSessionNote[];
}

export type ScheduleItemType = 'clinic_appointment' | 'home_visit' | 'travel_block';

export interface TravelBlockInfo {
  departureLocation: string;
  destinationLocation: string;
  transitMinutes: number;
  trafficLevel: 'Low' | 'Moderate' | 'Heavy';
  bufferStartTime: string; // HH:mm
  bufferEndTime: string;   // HH:mm
  isReturnToClinic?: boolean;
  routeAdvice?: string;
  equipmentKit?: string;
  bufferHealth: 'Safe' | 'Tight' | 'Warning';
}

export interface TherapistProfile {
  id: string;
  name: string;
  title: string;
  specialization: string;
  avatarBg: string;
  primaryZone: string;
  colorTheme: string;
}

export interface ScheduleAppointment {
  id: string;
  type: ScheduleItemType;
  patientId?: string;
  patientName: string;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other';
  serviceLocation: ServiceLocation;
  treatmentType: TreatmentType;
  therapistId: string;
  therapistName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (e.g. "09:00")
  endTime: string;   // HH:mm (e.g. "10:00")
  durationMinutes: number;
  station?: string; // e.g. "Station 1: Electrotherapy Bay", "Station 2: Active Gym", "Home Residence"
  area: string; // e.g. "Sahakarnagar Clinic", "Judicial Layout", "Tata Nagar"
  address?: string;
  diagnosis: string;
  sessionNumber?: number;
  packageTotalSessions?: number;
  status: 'Confirmed' | 'In-Progress' | 'Completed' | 'Buffer-Tight' | 'Cancelled';
  fee: number;
  paymentStatus: 'Paid' | 'Pending';
  travelBlock?: TravelBlockInfo;
  equipmentRequired?: string[];
  clinicalNotes?: string;
  contactPhone?: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

// --- Patient Reminder Log & Communication Types ---
export type ReminderChannel = 'WhatsApp' | 'SMS';
export type ReminderDeliveryStatus = 'Sent' | 'Delivered' | 'Read' | 'Failed' | 'Pending';
export type ReminderResponseStatus = 'Confirmed' | 'Pending Reply' | 'Reschedule Requested' | 'Cancelled' | 'Follow-up Needed';

export type ReminderTemplateCategory =
  | 'Three_Session_Confirmation'
  | '24h_Pre_Session'
  | '2h_Transit_Arrival'
  | 'Post_Session_Exercise'
  | 'Family_Elder_Update'
  | 'Package_Renewal_Nudge';

export interface UpcomingSessionSlot {
  sessionId: string;
  sessionNumber: number;
  totalSessions: number;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "09:00 AM"
  serviceLocation: ServiceLocation;
  therapistName: string;
  stationOrArea: string;
  confirmed: boolean;
  confirmationStatus: 'Confirmed' | 'Unconfirmed' | 'Pending Response';
}

export interface PatientReminderSeries {
  patientId: string;
  patientName: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  careType: ServiceLocation;
  diagnosis: string;
  therapistName: string;
  packageType: number;
  sessionsCompleted: number;
  upcomingSessions: UpcomingSessionSlot[];
  unconfirmedCount: number;
  hasUnconfirmedNext3: boolean; // True if next 3 upcoming sessions are unconfirmed!
  riskSeverity: 'Critical' | 'Moderate' | 'Low';
  lastReminderSentAt?: string;
  lastReminderChannel?: ReminderChannel;
  lastReminderStatus?: ReminderDeliveryStatus;
  familyCaregiverName?: string;
  familyCaregiverPhone?: string;
  notes?: string;
}

export interface ReminderLogItem {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  careType: ServiceLocation;
  channel: ReminderChannel;
  templateCategory: ReminderTemplateCategory;
  templateName: string;
  messageBody: string;
  kannadaMessageBody?: string;
  sentAt: string; // Formatted datetime string
  deliveryStatus: ReminderDeliveryStatus;
  responseStatus: ReminderResponseStatus;
  associatedSessionIds?: string[];
  sessionDatesMentioned?: string[];
  therapistName: string;
  isThreeSessionConfirmationPrompt: boolean;
  failureReason?: string;
  readAt?: string;
  patientReplyText?: string;
  actionTaken?: string;
}

// --- Staff Performance & Therapist Utilization Types ---
export type PhysicalStrainLevel = 'High' | 'Moderate' | 'Low' | 'Rest_Admin';

export type UtilizationHealthZone = 'Under-Utilized' | 'Optimal' | 'High-Workload' | 'Critical-Burnout';

export interface DailyUtilizationRecord {
  date: string; // YYYY-MM-DD
  dayName: string; // "Mon", "Tue", etc.
  therapistId: string;
  therapistName: string;
  totalShiftHours: number;       // e.g. 8.0 hrs
  availableHours: number;        // e.g. 7.5 hrs (shift minus mandatory lunch)
  clinicalDirectHours: number;   // 1-on-1 patient treatment
  adminDocumentationHours: number; // SOAP notes, discharge summaries
  bufferRestHours: number;       // Inter-session reset / hygiene
  transitTravelHours: number;    // Home care travel (0 for clinic lead)
  idleCapacityHours: number;     // Open unbooked slots
  utilizationRatePercent: number; // (clinicalDirectHours / availableHours) * 100
  effectiveUtilizationPercent: number; // ((clinicalDirectHours + adminHours) / availableHours) * 100
  scheduledSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  rescheduledSessions: number;
  highIntensityManualSessions: number;
  moderateGymSessions: number;
  lowIntensityModalitiesSessions: number;
  consecutiveSessionStreakMax: number;
  longestRestBreakMinutes: number;
  lunchBreakTakenMinutes: number;
  burnoutRiskScore: number; // 0 - 100
  burnoutStatus: UtilizationHealthZone;
  revenueGeneratedInr: number;
  patientFeedbackScore: number; // out of 5.0
  notes?: string;
}

export interface HourlyDensitySlot {
  slotId: string;
  timeRange: string; // e.g. "08:30 - 09:30"
  startMinutes: number; // mins from midnight
  durationMinutes: number;
  patientName?: string;
  patientId?: string;
  conditionDiagnosis?: string;
  status: 'Completed' | 'In-Progress' | 'Scheduled' | 'Break' | 'Admin_SOAP' | 'Available';
  treatmentType?: TreatmentType;
  strainLevel: PhysicalStrainLevel;
  manualTherapyRequired: boolean;
  assistantAssigned?: string;
  bayOrStation: string;
  burnoutRiskFlag?: string;
  suggestedAction?: string;
}

export interface BurnoutRiskFactor {
  id: string;
  category: 'Ergonomic' | 'Time-Pressure' | 'Documentation' | 'Rest-Deficit';
  title: string;
  severity: 'Low' | 'Moderate' | 'Severe';
  observedValue: string;
  recommendedThreshold: string;
  impactExplanation: string;
  mitigationRecommendation: string;
}

export interface ScheduleOptimizationGuardrails {
  enforce15MinInterSessionBuffer: boolean;
  protect45MinLunchWindow: boolean;
  capDailyManualTherapySessions: boolean;
  maxManualSessionsLimit: number;
  delegateModalityPrepToAssistant: boolean;
  lockDocumentationBlockEndDay: boolean;
  staggerEveningPeakSlots: boolean;
}

// --- Billing, Invoices & Package Balance Tracking Types ---
export type PaymentStatus = 'Paid' | 'Partial' | 'Pending' | 'Overdue';
export type PaymentMode = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash' | 'Cheque' | 'Insurance / TPA';

export interface PaymentTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  mode: PaymentMode;
  referenceNo: string;
  collectedBy: string;
  receiptNumber: string;
  notes?: string;
}

export interface PackageInstallment {
  installmentNumber: number;
  title: string;
  amount: number;
  dueDate: string;
  triggerSession: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidDate?: string;
  txnRef?: string;
}

export interface PatientInvoice {
  id: string; // e.g. "INV-2026-101"
  receiptNumber: string; // e.g. "REC-2026-101"
  patientId: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  address: string;
  area: string;
  careType: ServiceLocation;
  packageName: string;
  injuryCategory: string;
  diagnosis: string;
  attendingTherapist: string;
  packageSessionsTotal: number;
  sessionsDelivered: number;
  sessionsRemaining: number;
  grossFee: number;
  discountAmount: number;
  discountReason?: string;
  netPayable: number;
  amountPaid: number;
  balanceDue: number;
  paymentStatus: PaymentStatus;
  invoiceDate: string;
  dueDate: string;
  lastPaymentDate?: string;
  transactions: PaymentTransaction[];
  installments?: PackageInstallment[];
  hsnSacCode: string; // "999312" - Physiotherapy & Physical Well-being
  gstin: string; // "29AAFPS4892K1ZF"
  financialRisk: 'Covered' | 'Payment Due' | 'Deficit / Overdue';
  perSessionEffectiveRate: number;
  coveredSessionsCount: number;
  uncoveredDeliveredSessions: number;
  notes?: string;
}

export interface BillingFilterState {
  searchQuery: string;
  paymentStatus: 'All' | PaymentStatus;
  careType: 'All' | ServiceLocation;
  riskFilter: 'All' | 'Has-Balance' | 'Deficit-Only';
}

