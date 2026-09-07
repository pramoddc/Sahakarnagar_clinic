import { PatientReminderSeries, ReminderLogItem } from '../types';

export const CLINICAL_REMINDER_TEMPLATES = [
  {
    id: 'tpl-3-session-whatsapp',
    category: 'Three_Session_Confirmation' as const,
    channel: 'WhatsApp' as const,
    name: '3-Session Rehab Continuity WhatsApp Prompt (Interactive)',
    dltId: 'WA-MED-3SESS-09',
    description: 'Sent when 3 upcoming care package sessions remain unconfirmed, preventing protocol drop-off.',
    englishTemplate: `Namaskara {{patientName}}! 🙏 This is Sahakar Physio & Elder Care.
To safeguard your recovery continuity with {{therapistName}}, please confirm your next 3 scheduled rehab sessions:
1️⃣ {{date1}} at {{time1}} ({{location1}})
2️⃣ {{date2}} at {{time2}} ({{location2}})
3️⃣ {{date3}} at {{time3}} ({{location3}})

👉 Quick Reply:
• Tap [✅ Confirm All 3 Sessions]
• Tap [📅 Request Reschedule]
• Tap [📞 Call Clinic Reception]`,
    kannadaTemplate: `ನಮಸ್ಕಾರ {{patientName}}! 🙏 ಸಹಕಾರ ಫಿಸಿಯೋ & ಹಿರಿಯರ ಆರೈಕೆ ಕ್ಲಿನಿಕ್‌ನಿಂದ ಸಂದೇಶ.
{{therapistName}} ಅವರೊಂದಿಗಿನ ನಿಮ್ಮ ಮುಂದಿನ 3 ಚಿಕಿತ್ಸಾ ಅವಧಿಗಳನ್ನು ದೃಢೀಕರಿಸಿ:
1️⃣ {{date1}} - {{time1}}
2️⃣ {{date2}} - {{time2}}
3️⃣ {{date3}} - {{time3}}
ದೃಢೀಕರಿಸಲು ಕೆಳಗಿನ [Confirm All 3] ಬಟನ್ ಒತ್ತಿ.`
  },
  {
    id: 'tpl-3-session-sms',
    category: 'Three_Session_Confirmation' as const,
    channel: 'SMS' as const,
    name: '3-Session Commitment SMS (DLT Approved)',
    dltId: 'DLT-SAHAKAR-CONF-11029',
    description: 'Concise DLT-compliant SMS sent to patients or elder family caregivers.',
    englishTemplate: `Sahakar Physio Alert: Please confirm your next 3 sessions with {{therapistName}} on {{date1}}, {{date2}}, & {{date3}}. Reply YES to confirm or call +91-9845021980 to reschedule. Keep recovery continuous.`,
    kannadaTemplate: `ಸಹಕಾರ ಫಿಸಿಯೋ: ನಿಮ್ಮ ಮುಂದಿನ 3 ಅವಧಿಗಳನ್ನು ದೃಢೀಕರಿಸಿ ({{date1}}, {{date2}}, {{date3}}). ದೃಢೀಕರಿಸಲು YES ಎಂದು ಉತ್ತರಿಸಿ.`
  },
  {
    id: 'tpl-24h-whatsapp',
    category: '24h_Pre_Session' as const,
    channel: 'WhatsApp' as const,
    name: '24-Hour Pre-Session WhatsApp Reminder',
    dltId: 'WA-MED-24H-01',
    description: 'Sent 24 hours prior to appointment with preparation instructions.',
    englishTemplate: `Namaskara {{patientName}}! Your scheduled physiotherapy session with {{therapistName}} is tomorrow, {{date1}} at {{time1}} at {{location1}}. Please wear comfortable exercise attire. Need to adjust time? Reply to this message.`,
    kannadaTemplate: `ನಮಸ್ಕಾರ {{patientName}}! ನಿಮ್ಮ ನಾಳೆಯ ಫಿಸಿಯೋಥೆರಪಿ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ {{time1}} ಗಂಟೆಗೆ ಇರುತ್ತದೆ. ಸಡಿಲವಾದ ಉಡುಪು ಧರಿಸಿ.`
  },
  {
    id: 'tpl-2h-transit',
    category: '2h_Transit_Arrival' as const,
    channel: 'WhatsApp' as const,
    name: 'Home-Care Transit & ETA Alert (Live Tracking)',
    dltId: 'WA-HC-TRANSIT-03',
    description: 'Sent to elder care patient or family attendant when mobile therapist begins transit.',
    englishTemplate: `Hello {{patientName}} / Family Attendant. {{therapistName}} is en route for today's Home-Visit session. Estimated arrival: {{time1}}. Modalities & portable treatment kit sanitized and ready.`,
    kannadaTemplate: `ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಮನೆ ಭೇಟಿಗಾಗಿ ಥೆರಪಿಸ್ಟ್ ಹೊರಟಿದ್ದಾರೆ. ಆಗಮನ ಸಮಯ: {{time1}}.`
  },
  {
    id: 'tpl-post-session',
    category: 'Post_Session_Exercise' as const,
    channel: 'WhatsApp' as const,
    name: 'Post-Session Home Exercise Compliance Nudge',
    dltId: 'WA-MED-POST-05',
    description: 'Sent 3 hours post session with prescribed home exercises and ice/heat guide.',
    englishTemplate: `Great effort in today's rehab session! {{therapistName}} has logged your home exercise protocol. Remember: 10 mins ice pack on the affected joint and 2 sets of active range drills before bedtime.`,
    kannadaTemplate: `ಇಂದಿನ ವ್ಯಾಯಾಮ ಉತ್ತಮವಾಗಿತ್ತು! ಮಲಗುವ ಮುನ್ನ ಶಿಫಾರಸು ಮಾಡಿದ ವ್ಯಾಯಾಮಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.`
  }
];

export const INITIAL_PATIENT_SERIES: PatientReminderSeries[] = [
  {
    patientId: 'pt-008',
    patientName: 'Col. Rajan Nambiar (Retd.)',
    phone: '+91 98450 67123',
    age: 79,
    gender: 'Male',
    careType: 'Home',
    diagnosis: 'Post-Op Right Total Hip Arthroplasty (THA Day 18) & Postural Instability',
    therapistName: 'Dr. Vikram K., BPT',
    packageType: 20,
    sessionsCompleted: 11,
    unconfirmedCount: 3,
    hasUnconfirmedNext3: true,
    riskSeverity: 'Critical',
    lastReminderSentAt: '2026-09-06 17:30',
    lastReminderChannel: 'WhatsApp',
    lastReminderStatus: 'Delivered',
    familyCaregiverName: 'Priya Nambiar (Daughter)',
    familyCaregiverPhone: '+91 98801 22340',
    notes: 'Elder patient lives with daughter in Sahakarnagar A-Block. Missed last Saturday check-in; at risk of hip flexion contracture if sessions lapse.',
    upcomingSessions: [
      {
        sessionId: 'up-rn-01',
        sessionNumber: 12,
        totalSessions: 20,
        date: '2026-09-09',
        time: '10:00 AM',
        serviceLocation: 'Home',
        therapistName: 'Dr. Vikram K., BPT',
        stationOrArea: 'Home Concierge (Bungalow #44, A-Block, Sahakarnagar)',
        confirmed: false,
        confirmationStatus: 'Unconfirmed'
      },
      {
        sessionId: 'up-rn-02',
        sessionNumber: 13,
        totalSessions: 20,
        date: '2026-09-11',
        time: '10:00 AM',
        serviceLocation: 'Home',
        therapistName: 'Dr. Vikram K., BPT',
        stationOrArea: 'Home Concierge (Bungalow #44, A-Block, Sahakarnagar)',
        confirmed: false,
        confirmationStatus: 'Unconfirmed'
      },
      {
        sessionId: 'up-rn-03',
        sessionNumber: 14,
        totalSessions: 20,
        date: '2026-09-14',
        time: '10:00 AM',
        serviceLocation: 'Home',
        therapistName: 'Dr. Vikram K., BPT',
        stationOrArea: 'Home Concierge (Bungalow #44, A-Block, Sahakarnagar)',
        confirmed: false,
        confirmationStatus: 'Unconfirmed'
      }
    ]
  },
  {
    patientId: 'pt-009',
    patientName: 'Vikramaditya Hegde',
    phone: '+91 99800 54109',
    age: 34,
    gender: 'Male',
    careType: 'Clinic',
    diagnosis: 'Acute L4-L5 Lumbar Disc Bulge with Left Sciatic Radiculopathy (IT Desk Worker)',
    therapistName: 'Dr. Aditi Rao, MPT',
    packageType: 15,
    sessionsCompleted: 6,
    unconfirmedCount: 3,
    hasUnconfirmedNext3: true,
    riskSeverity: 'Critical',
    lastReminderSentAt: '2026-09-06 20:15',
    lastReminderChannel: 'SMS',
    lastReminderStatus: 'Delivered',
    familyCaregiverName: 'Shweta Hegde (Spouse)',
    familyCaregiverPhone: '+91 99800 54110',
    notes: 'Software architect at Manyata Tech Park. High sprint workload; pain dropped from 8 to 4 VAS, leading to premature drop-off temptation.',
    upcomingSessions: [
      {
        sessionId: 'up-vh-01',
        sessionNumber: 7,
        totalSessions: 15,
        date: '2026-09-08',
        time: '06:30 PM',
        serviceLocation: 'Clinic',
        therapistName: 'Dr. Aditi Rao, MPT',
        stationOrArea: 'Station 1: Electrotherapy & Traction Bay',
        confirmed: false,
        confirmationStatus: 'Unconfirmed'
      },
      {
        sessionId: 'up-vh-02',
        sessionNumber: 8,
        totalSessions: 15,
        date: '2026-09-10',
        time: '06:30 PM',
        serviceLocation: 'Clinic',
        therapistName: 'Dr. Aditi Rao, MPT',
        stationOrArea: 'Station 1: Electrotherapy & Traction Bay',
        confirmed: false,
        confirmationStatus: 'Unconfirmed'
      },
      {
        sessionId: 'up-vh-03',
        sessionNumber: 9,
        totalSessions: 15,
        date: '2026-09-12',
        time: '11:30 AM',
        serviceLocation: 'Clinic',
        therapistName: 'Dr. Aditi Rao, MPT',
        stationOrArea: 'Station 3: Active Functional Gym',
        confirmed: false,
        confirmationStatus: 'Unconfirmed'
      }
    ]
  },
  {
    patientId: 'pt-010',
    patientName: 'Savithri Amma Natarajan',
    phone: '+91 94481 99012',
    age: 83,
    gender: 'Female',
    careType: 'Home',
    diagnosis: 'Parkinsonian Postural Instability, Freezing of Gait & Bilateral Sarcopenia',
    therapistName: 'Dr. Vikram K., BPT',
    packageType: 25,
    sessionsCompleted: 15,
    unconfirmedCount: 3,
    hasUnconfirmedNext3: true,
    riskSeverity: 'Critical',
    lastReminderSentAt: '2026-09-06 14:00',
    lastReminderChannel: 'WhatsApp',
    lastReminderStatus: 'Read',
    familyCaregiverName: 'Ramesh Natarajan (Son)',
    familyCaregiverPhone: '+91 94481 99014',
    notes: 'Home care in Judicial Layout. Caregiver son manages communications. Needs telephone follow-up if WhatsApp read without confirmation.',
    upcomingSessions: [
      {
        sessionId: 'up-sa-01',
        sessionNumber: 16,
        totalSessions: 25,
        date: '2026-09-09',
        time: '03:30 PM',
        serviceLocation: 'Home',
        therapistName: 'Dr. Vikram K., BPT',
        stationOrArea: 'Home Concierge (Judicial Layout, 3rd Cross)',
        confirmed: false,
        confirmationStatus: 'Unconfirmed'
      },
      {
        sessionId: 'up-sa-02',
        sessionNumber: 17,
        totalSessions: 25,
        date: '2026-09-11',
        time: '03:30 PM',
        serviceLocation: 'Home',
        therapistName: 'Dr. Vikram K., BPT',
        stationOrArea: 'Home Concierge (Judicial Layout, 3rd Cross)',
        confirmed: false,
        confirmationStatus: 'Unconfirmed'
      },
      {
        sessionId: 'up-sa-03',
        sessionNumber: 18,
        totalSessions: 25,
        date: '2026-09-14',
        time: '03:30 PM',
        serviceLocation: 'Home',
        therapistName: 'Dr. Vikram K., BPT',
        stationOrArea: 'Home Concierge (Judicial Layout, 3rd Cross)',
        confirmed: false,
        confirmationStatus: 'Unconfirmed'
      }
    ]
  },
  {
    patientId: 'pt-011',
    patientName: 'Priya Chandrashekar',
    phone: '+91 97422 18901',
    age: 41,
    gender: 'Female',
    careType: 'Clinic',
    diagnosis: 'Stage 2 Adhesive Capsulitis (Left Frozen Shoulder - Freezing Phase)',
    therapistName: 'Dr. Aditi Rao, MPT',
    packageType: 15,
    sessionsCompleted: 5,
    unconfirmedCount: 3,
    hasUnconfirmedNext3: true,
    riskSeverity: 'Critical',
    lastReminderSentAt: '2026-09-06 18:45',
    lastReminderChannel: 'WhatsApp',
    lastReminderStatus: 'Delivered',
    notes: 'Severe night pain. High risk of missing mobilizations because of fear of temporary post-treatment soreness.',
    upcomingSessions: [
      {
        sessionId: 'up-pc-01',
        sessionNumber: 6,
        totalSessions: 15,
        date: '2026-09-08',
        time: '11:00 AM',
        serviceLocation: 'Clinic',
        therapistName: 'Dr. Aditi Rao, MPT',
        stationOrArea: 'Station 2: Manual Mobilization Bed',
        confirmed: false,
        confirmationStatus: 'Unconfirmed'
      },
      {
        sessionId: 'up-pc-02',
        sessionNumber: 7,
        totalSessions: 15,
        date: '2026-09-10',
        time: '11:00 AM',
        serviceLocation: 'Clinic',
        therapistName: 'Dr. Aditi Rao, MPT',
        stationOrArea: 'Station 2: Manual Mobilization Bed',
        confirmed: false,
        confirmationStatus: 'Unconfirmed'
      },
      {
        sessionId: 'up-pc-03',
        sessionNumber: 8,
        totalSessions: 15,
        date: '2026-09-12',
        time: '10:00 AM',
        serviceLocation: 'Clinic',
        therapistName: 'Dr. Aditi Rao, MPT',
        stationOrArea: 'Station 3: Active Functional Gym',
        confirmed: false,
        confirmationStatus: 'Unconfirmed'
      }
    ]
  },
  {
    patientId: 'pt-001',
    patientName: 'Suryanarayana Rao',
    phone: '+91 98450 21980',
    age: 72,
    gender: 'Male',
    careType: 'Home',
    diagnosis: 'Left Total Knee Replacement (TKR) Post-Op Day 14 Rehab',
    therapistName: 'Dr. Vikram K., BPT',
    packageType: 20,
    sessionsCompleted: 14,
    unconfirmedCount: 1,
    hasUnconfirmedNext3: false,
    riskSeverity: 'Moderate',
    lastReminderSentAt: '2026-09-07 08:00',
    lastReminderChannel: 'WhatsApp',
    lastReminderStatus: 'Read',
    familyCaregiverName: 'Kavitha Rao (Wife)',
    familyCaregiverPhone: '+91 98450 21982',
    notes: '2 of 3 sessions confirmed; third session (Friday) pending patient granddaughter school pickup schedule.',
    upcomingSessions: [
      {
        sessionId: 'up-sr-01',
        sessionNumber: 15,
        totalSessions: 20,
        date: '2026-09-08',
        time: '09:00 AM',
        serviceLocation: 'Home',
        therapistName: 'Dr. Vikram K., BPT',
        stationOrArea: 'Home Concierge (Judicial Layout)',
        confirmed: true,
        confirmationStatus: 'Confirmed'
      },
      {
        sessionId: 'up-sr-02',
        sessionNumber: 16,
        totalSessions: 20,
        date: '2026-09-10',
        time: '09:00 AM',
        serviceLocation: 'Home',
        therapistName: 'Dr. Vikram K., BPT',
        stationOrArea: 'Home Concierge (Judicial Layout)',
        confirmed: true,
        confirmationStatus: 'Confirmed'
      },
      {
        sessionId: 'up-sr-03',
        sessionNumber: 17,
        totalSessions: 20,
        date: '2026-09-12',
        time: '09:00 AM',
        serviceLocation: 'Home',
        therapistName: 'Dr. Vikram K., BPT',
        stationOrArea: 'Home Concierge (Judicial Layout)',
        confirmed: false,
        confirmationStatus: 'Pending Response'
      }
    ]
  },
  {
    patientId: 'pt-002',
    patientName: 'Ananya Deshmukh',
    phone: '+91 99002 44102',
    age: 33,
    gender: 'Female',
    careType: 'Clinic',
    diagnosis: 'C5-C6 Cervical Radiculopathy & Upper Trapezius Spasm',
    therapistName: 'Dr. Aditi Rao, MPT',
    packageType: 15,
    sessionsCompleted: 11,
    unconfirmedCount: 0,
    hasUnconfirmedNext3: false,
    riskSeverity: 'Low',
    lastReminderSentAt: '2026-09-07 07:45',
    lastReminderChannel: 'WhatsApp',
    lastReminderStatus: 'Read',
    notes: 'All 3 upcoming sessions confirmed via WhatsApp interactive buttons.',
    upcomingSessions: [
      {
        sessionId: 'up-ad-01',
        sessionNumber: 12,
        totalSessions: 15,
        date: '2026-09-08',
        time: '05:30 PM',
        serviceLocation: 'Clinic',
        therapistName: 'Dr. Aditi Rao, MPT',
        stationOrArea: 'Station 2: Manual Mobilization Bed',
        confirmed: true,
        confirmationStatus: 'Confirmed'
      },
      {
        sessionId: 'up-ad-02',
        sessionNumber: 13,
        totalSessions: 15,
        date: '2026-09-10',
        time: '05:30 PM',
        serviceLocation: 'Clinic',
        therapistName: 'Dr. Aditi Rao, MPT',
        stationOrArea: 'Station 2: Manual Mobilization Bed',
        confirmed: true,
        confirmationStatus: 'Confirmed'
      },
      {
        sessionId: 'up-ad-03',
        sessionNumber: 14,
        totalSessions: 15,
        date: '2026-09-12',
        time: '04:30 PM',
        serviceLocation: 'Clinic',
        therapistName: 'Dr. Aditi Rao, MPT',
        stationOrArea: 'Station 3: Active Functional Gym',
        confirmed: true,
        confirmationStatus: 'Confirmed'
      }
    ]
  },
  {
    patientId: 'pt-003',
    patientName: 'Kamalamma Venkatesh',
    phone: '+91 94481 33290',
    age: 78,
    gender: 'Female',
    careType: 'Home',
    diagnosis: 'Bilateral Knee Osteoarthritis Grade 3 & Severe Mobility Deficit',
    therapistName: 'Dr. Vikram K., BPT',
    packageType: 25,
    sessionsCompleted: 19,
    unconfirmedCount: 0,
    hasUnconfirmedNext3: false,
    riskSeverity: 'Low',
    lastReminderSentAt: '2026-09-06 16:30',
    lastReminderChannel: 'SMS',
    lastReminderStatus: 'Delivered',
    familyCaregiverName: 'Sanjay Venkatesh (Son)',
    familyCaregiverPhone: '+91 94481 33292',
    notes: 'Caregiver son confirmed entire upcoming week schedule over WhatsApp.',
    upcomingSessions: [
      {
        sessionId: 'up-kv-01',
        sessionNumber: 20,
        totalSessions: 25,
        date: '2026-09-08',
        time: '11:30 AM',
        serviceLocation: 'Home',
        therapistName: 'Dr. Vikram K., BPT',
        stationOrArea: 'Home Concierge (CQAL Layout)',
        confirmed: true,
        confirmationStatus: 'Confirmed'
      },
      {
        sessionId: 'up-kv-02',
        sessionNumber: 21,
        totalSessions: 25,
        date: '2026-09-10',
        time: '11:30 AM',
        serviceLocation: 'Home',
        therapistName: 'Dr. Vikram K., BPT',
        stationOrArea: 'Home Concierge (CQAL Layout)',
        confirmed: true,
        confirmationStatus: 'Confirmed'
      },
      {
        sessionId: 'up-kv-03',
        sessionNumber: 22,
        totalSessions: 25,
        date: '2026-09-12',
        time: '11:30 AM',
        serviceLocation: 'Home',
        therapistName: 'Dr. Vikram K., BPT',
        stationOrArea: 'Home Concierge (CQAL Layout)',
        confirmed: true,
        confirmationStatus: 'Confirmed'
      }
    ]
  },
  {
    patientId: 'pt-004',
    patientName: 'Rohan Bharadwaj',
    phone: '+91 97312 88410',
    age: 21,
    gender: 'Male',
    careType: 'Clinic',
    diagnosis: 'Right Shoulder Supraspinatus Tendinopathy (Badminton Player)',
    therapistName: 'Dr. Aditi Rao, MPT',
    packageType: 15,
    sessionsCompleted: 8,
    unconfirmedCount: 1,
    hasUnconfirmedNext3: false,
    riskSeverity: 'Moderate',
    lastReminderSentAt: '2026-09-07 08:30',
    lastReminderChannel: 'WhatsApp',
    lastReminderStatus: 'Delivered',
    notes: 'First 2 sessions confirmed. Saturday slot pending match fixtures announcement.',
    upcomingSessions: [
      {
        sessionId: 'up-rb-01',
        sessionNumber: 9,
        totalSessions: 15,
        date: '2026-09-08',
        time: '04:00 PM',
        serviceLocation: 'Clinic',
        therapistName: 'Dr. Aditi Rao, MPT',
        stationOrArea: 'Station 3: Active Functional Gym',
        confirmed: true,
        confirmationStatus: 'Confirmed'
      },
      {
        sessionId: 'up-rb-02',
        sessionNumber: 10,
        totalSessions: 15,
        date: '2026-09-10',
        time: '04:00 PM',
        serviceLocation: 'Clinic',
        therapistName: 'Dr. Aditi Rao, MPT',
        stationOrArea: 'Station 3: Active Functional Gym',
        confirmed: true,
        confirmationStatus: 'Confirmed'
      },
      {
        sessionId: 'up-rb-03',
        sessionNumber: 11,
        totalSessions: 15,
        date: '2026-09-12',
        time: '03:00 PM',
        serviceLocation: 'Clinic',
        therapistName: 'Dr. Aditi Rao, MPT',
        stationOrArea: 'Station 3: Active Functional Gym',
        confirmed: false,
        confirmationStatus: 'Unconfirmed'
      }
    ]
  }
];

export const INITIAL_REMINDER_LOGS: ReminderLogItem[] = [
  {
    id: 'log-001',
    patientId: 'pt-008',
    patientName: 'Col. Rajan Nambiar (Retd.)',
    phone: '+91 98450 67123',
    careType: 'Home',
    channel: 'WhatsApp',
    templateCategory: 'Three_Session_Confirmation',
    templateName: '3-Session Rehab Continuity WhatsApp Prompt (Interactive)',
    messageBody: `Namaskara Col. Rajan Nambiar! 🙏 This is Sahakar Physio & Elder Care.
To safeguard your recovery continuity with Dr. Vikram K., BPT, please confirm your next 3 scheduled rehab sessions:
1️⃣ Wed, 09 Sep at 10:00 AM (Home Concierge, A-Block)
2️⃣ Fri, 11 Sep at 10:00 AM (Home Concierge, A-Block)
3️⃣ Mon, 14 Sep at 10:00 AM (Home Concierge, A-Block)

👉 Please tap [Confirm All 3] or reply if you need to adjust timings. Maintaining consecutive sessions is essential to prevent post-THA gait regression.`,
    kannadaMessageBody: `ನಮಸ್ಕಾರ ಕರ್ನಲ್ ರಾಜನ್ ನಂಬಿಯಾರ್ ಅವರೇ! ನಿಮ್ಮ ಮುಂದಿನ 3 ಮನೆ ಭೇಟಿ ಫಿಸಿಯೋಥೆರಪಿ ಸೆಷನ್‌ಗಳನ್ನು ದೃಢೀಕರಿಸಿ (ಬುಧವಾರ, ಶುಕ್ರವಾರ, ಸೋಮವಾರ 10:00 AM).`,
    sentAt: '2026-09-06 17:30',
    deliveryStatus: 'Delivered',
    responseStatus: 'Follow-up Needed',
    sessionDatesMentioned: ['2026-09-09', '2026-09-11', '2026-09-14'],
    therapistName: 'Dr. Vikram K., BPT',
    isThreeSessionConfirmationPrompt: true,
    patientReplyText: undefined,
    actionTaken: 'Sent automated WhatsApp follow-up. 0 of 3 sessions confirmed. Flagged for telephone caregiver call.'
  },
  {
    id: 'log-002',
    patientId: 'pt-009',
    patientName: 'Vikramaditya Hegde',
    phone: '+91 99800 54109',
    careType: 'Clinic',
    channel: 'SMS',
    templateCategory: 'Three_Session_Confirmation',
    templateName: '3-Session Commitment SMS (DLT Approved)',
    messageBody: `Sahakar Physio Alert: Vikramaditya, please confirm your next 3 in-clinic traction & rehab sessions with Dr. Aditi Rao on Tue 08 Sep 6:30PM, Thu 10 Sep 6:30PM & Sat 12 Sep 11:30AM. Reply YES to confirm or call 9845021980 to reschedule. Prevent disc relapse.`,
    sentAt: '2026-09-06 20:15',
    deliveryStatus: 'Delivered',
    responseStatus: 'Pending Reply',
    sessionDatesMentioned: ['2026-09-08', '2026-09-10', '2026-09-12'],
    therapistName: 'Dr. Aditi Rao, MPT',
    isThreeSessionConfirmationPrompt: true,
    actionTaken: 'Automated SMS broadcast dispatched via Airtel DLT gateway. Awaiting patient reply.'
  },
  {
    id: 'log-003',
    patientId: 'pt-010',
    patientName: 'Savithri Amma Natarajan',
    phone: '+91 94481 99012',
    careType: 'Home',
    channel: 'WhatsApp',
    templateCategory: 'Three_Session_Confirmation',
    templateName: '3-Session Rehab Continuity WhatsApp Prompt (Interactive)',
    messageBody: `Namaskara Savithri Amma / Caregiver Ramesh Natarajan. Dr. Vikram K. has planned your next 3 Parkinson's balance & gait retraining sessions:
1️⃣ Wed, 09 Sep at 03:30 PM (Home Concierge, Judicial Layout)
2️⃣ Fri, 11 Sep at 03:30 PM (Home Concierge, Judicial Layout)
3️⃣ Mon, 14 Sep at 03:30 PM (Home Concierge, Judicial Layout)
Please confirm by tapping [Confirm All 3] so travel routes from Sahakarnagar can be locked.`,
    sentAt: '2026-09-06 14:00',
    readAt: '2026-09-06 14:18',
    deliveryStatus: 'Read',
    responseStatus: 'Follow-up Needed',
    sessionDatesMentioned: ['2026-09-09', '2026-09-11', '2026-09-14'],
    therapistName: 'Dr. Vikram K., BPT',
    isThreeSessionConfirmationPrompt: true,
    actionTaken: 'Read receipt received (double blue tick) on caregiver phone, but no confirmation response logged after 20 hours.'
  },
  {
    id: 'log-004',
    patientId: 'pt-011',
    patientName: 'Priya Chandrashekar',
    phone: '+91 97422 18901',
    careType: 'Clinic',
    channel: 'WhatsApp',
    templateCategory: 'Three_Session_Confirmation',
    templateName: '3-Session Rehab Continuity WhatsApp Prompt (Interactive)',
    messageBody: `Namaskara Priya! Dr. Aditi Rao has reserved your next 3 Frozen Shoulder mobilization sessions at our Sahakarnagar clinic:
1️⃣ Tue, 08 Sep at 11:00 AM (Station 2)
2️⃣ Thu, 10 Sep at 11:00 AM (Station 2)
3️⃣ Sat, 12 Sep at 10:00 AM (Station 3 Gym)
Consistent manual therapy in the freezing phase is critical to prevent permanent capsule contracture. Tap below to confirm.`,
    sentAt: '2026-09-06 18:45',
    deliveryStatus: 'Delivered',
    responseStatus: 'Pending Reply',
    sessionDatesMentioned: ['2026-09-08', '2026-09-10', '2026-09-12'],
    therapistName: 'Dr. Aditi Rao, MPT',
    isThreeSessionConfirmationPrompt: true,
    actionTaken: 'Dispatched via WhatsApp Business Cloud API. Delivery confirmed.'
  },
  {
    id: 'log-005',
    patientId: 'pt-002',
    patientName: 'Ananya Deshmukh',
    phone: '+91 99002 44102',
    careType: 'Clinic',
    channel: 'WhatsApp',
    templateCategory: 'Three_Session_Confirmation',
    templateName: '3-Session Rehab Continuity WhatsApp Prompt (Interactive)',
    messageBody: `Namaskara Ananya! Confirming your next 3 cervical stabilization sessions with Dr. Aditi Rao:
1️⃣ Tue 08 Sep at 05:30 PM
2️⃣ Thu 10 Sep at 05:30 PM
3️⃣ Sat 12 Sep at 04:30 PM
Tap [Confirm All 3] to keep your evening tech worker slot reserved.`,
    sentAt: '2026-09-07 07:45',
    readAt: '2026-09-07 07:52',
    deliveryStatus: 'Read',
    responseStatus: 'Confirmed',
    sessionDatesMentioned: ['2026-09-08', '2026-09-10', '2026-09-12'],
    therapistName: 'Dr. Aditi Rao, MPT',
    isThreeSessionConfirmationPrompt: true,
    patientReplyText: 'Confirmed! I will be there on time for all 3 sessions. Thanks for holding my 5:30 PM slot.',
    actionTaken: 'Patient clicked [Confirm All 3] interactive button. All 3 sessions marked Confirmed in clinic scheduler.'
  },
  {
    id: 'log-006',
    patientId: 'pt-001',
    patientName: 'Suryanarayana Rao',
    phone: '+91 98450 21980',
    careType: 'Home',
    channel: 'WhatsApp',
    templateCategory: '24h_Pre_Session',
    templateName: '24-Hour Pre-Session WhatsApp Reminder',
    messageBody: `Namaskara Suryanarayana Rao sir. Your post-TKR home rehabilitation with Dr. Vikram K. is scheduled for tomorrow, Tuesday 08 Sep at 09:00 AM at your Judicial Layout residence. Please have ice pack and walker accessible.`,
    sentAt: '2026-09-07 08:00',
    readAt: '2026-09-07 08:14',
    deliveryStatus: 'Read',
    responseStatus: 'Confirmed',
    sessionDatesMentioned: ['2026-09-08'],
    therapistName: 'Dr. Vikram K., BPT',
    isThreeSessionConfirmationPrompt: false,
    patientReplyText: 'Yes, looking forward. Knee extension has improved today.',
    actionTaken: 'Confirmation logged. Dr. Vikram travel route synchronized.'
  },
  {
    id: 'log-007',
    patientId: 'pt-003',
    patientName: 'Kamalamma Venkatesh',
    phone: '+91 94481 33290',
    careType: 'Home',
    channel: 'SMS',
    templateCategory: 'Three_Session_Confirmation',
    templateName: '3-Session Commitment SMS (DLT Approved)',
    messageBody: `Sahakar Physio: Kamalamma Venkatesh, upcoming 3 home visits with Dr. Vikram K. on Tue 08 Sep, Thu 10 Sep, Sat 12 Sep 11:30AM confirmed by family attendant. Thank you.`,
    sentAt: '2026-09-06 16:30',
    deliveryStatus: 'Delivered',
    responseStatus: 'Confirmed',
    sessionDatesMentioned: ['2026-09-08', '2026-09-10', '2026-09-12'],
    therapistName: 'Dr. Vikram K., BPT',
    isThreeSessionConfirmationPrompt: true,
    actionTaken: 'Son Sanjay Venkatesh called clinic front desk and confirmed all 3 sessions.'
  },
  {
    id: 'log-008',
    patientId: 'pt-004',
    patientName: 'Rohan Bharadwaj',
    phone: '+91 97312 88410',
    careType: 'Clinic',
    channel: 'WhatsApp',
    templateCategory: 'Post_Session_Exercise',
    templateName: 'Post-Session Home Exercise Compliance Nudge',
    messageBody: `Great shoulder stability work today Rohan! Dr. Aditi Rao has prescribed: 1) Sleeper stretch for posterior capsule (3 x 30s), 2) Yellow Theraband external rotation with elbow tucked. Ice 15 mins before sleeping.`,
    sentAt: '2026-09-06 19:30',
    readAt: '2026-09-06 20:05',
    deliveryStatus: 'Read',
    responseStatus: 'Confirmed',
    therapistName: 'Dr. Aditi Rao, MPT',
    isThreeSessionConfirmationPrompt: false,
    patientReplyText: 'Done with icing! Pain is much better after ultrasound.',
    actionTaken: 'Exercise compliance logged in patient chart.'
  },
  {
    id: 'log-009',
    patientId: 'pt-005',
    patientName: 'Geetha Narayanaswamy',
    phone: '+91 98860 11954',
    careType: 'Clinic',
    channel: 'WhatsApp',
    templateCategory: '2h_Transit_Arrival',
    templateName: 'Clinic Arrival Check-in Alert',
    messageBody: `Namaskara Geetha ma'am. Your lumbar traction & mobilization bed is ready at Station 1 with Dr. Aditi Rao at 11:15 AM today. Convenient ground-floor parking is available right in front of the clinic.`,
    sentAt: '2026-09-07 09:15',
    readAt: '2026-09-07 09:19',
    deliveryStatus: 'Read',
    responseStatus: 'Confirmed',
    sessionDatesMentioned: ['2026-09-07'],
    therapistName: 'Dr. Aditi Rao, MPT',
    isThreeSessionConfirmationPrompt: false,
    patientReplyText: 'Reached Sahakarnagar main road, arriving in 5 minutes.',
    actionTaken: 'Station 1 electrotherapy unit pre-warmed.'
  }
];
