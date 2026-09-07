import { PatientInvoice } from '../types';

export const CLINIC_BILLING_METADATA = {
  clinicName: 'Sahakar Physio & Rehabilitation Clinic',
  clinicLegalName: 'Sahakarnagar Physical Therapy & Sports Medicine LLP',
  tagline: 'Advanced Orthopedic, Post-Surgical & Geriatric Elder Care',
  address: 'Plot #18, 1st Cross, Judicial Layout Road, Sahakarnagar, Bengaluru, Karnataka 560092',
  phone: '+91 80 2364 8920 / +91 98450 21980',
  email: 'billing@sahakarphysio.com',
  website: 'www.sahakarphysio.com',
  gstin: '29AAFPS4892K1ZF',
  sacCode: '999312', // Healthcare & Physiotherapy Services (Exempt under GST Notification 12/2017 Central Tax)
  sacDescription: 'Specialized Physiotherapy & Rehabilitation Care',
  bankName: 'ICICI Bank Ltd',
  accountName: 'Sahakar Physio & Rehab LLP',
  accountNumber: '028905008924',
  ifscCode: 'ICIC0000289',
  branch: 'Sahakarnagar F-Block Branch, Bangalore',
  upiId: 'sahakar.physio@icici',
  upiQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=sahakar.physio@icici&pn=Sahakar%20Physio&cu=INR'
};

export const DEFAULT_INVOICES: PatientInvoice[] = [
  {
    id: 'INV-2026-081',
    receiptNumber: 'REC-2026-081',
    patientId: 'pt-001',
    patientName: 'Suryanarayana Rao',
    age: 72,
    gender: 'Male',
    phone: '+91 98450 21980',
    email: 'sn.rao.blr@gmail.com',
    address: '#142, 4th Main, Judicial Layout',
    area: 'Judicial Layout',
    careType: 'Home',
    packageName: '20-Session Post-Op TKR Joint Recovery Home Care',
    injuryCategory: 'Post-Surgical',
    diagnosis: 'Left Total Knee Replacement (TKR) - Post-Op Day 14 Rehabilitation',
    attendingTherapist: 'Dr. Vikram K., BPT (Home Care Lead)',
    packageSessionsTotal: 20,
    sessionsDelivered: 14,
    sessionsRemaining: 6,
    grossFee: 28000,
    discountAmount: 2000,
    discountReason: 'Upfront 20-Session Package Discount (10% Waiver on Travel Levy)',
    netPayable: 26000,
    amountPaid: 26000,
    balanceDue: 0,
    paymentStatus: 'Paid',
    invoiceDate: '2026-08-10',
    dueDate: '2026-08-10',
    lastPaymentDate: '2026-08-10',
    transactions: [
      {
        id: 'TXN-901',
        date: '2026-08-10',
        amount: 26000,
        mode: 'Net Banking',
        referenceNo: 'HDFC-IMPS-028471928',
        collectedBy: 'Clinic Front Desk (Deepa N.)',
        receiptNumber: 'REC-2026-081',
        notes: 'Full package payment cleared upfront via NEFT/IMPS transfer.'
      }
    ],
    installments: [
      {
        installmentNumber: 1,
        title: 'Full Package Upfront Advance',
        amount: 26000,
        dueDate: '2026-08-10',
        triggerSession: 1,
        status: 'Paid',
        paidDate: '2026-08-10',
        txnRef: 'HDFC-IMPS-028471928'
      }
    ],
    hsnSacCode: '999312',
    gstin: '29AAFPS4892K1ZF',
    financialRisk: 'Covered',
    perSessionEffectiveRate: 1300,
    coveredSessionsCount: 20,
    uncoveredDeliveredSessions: 0,
    notes: 'Home care kit included. Regular clinical receipts issued.'
  },
  {
    id: 'INV-2026-088',
    receiptNumber: 'REC-2026-088',
    patientId: 'pt-002',
    patientName: 'Ananya Deshmukh',
    age: 33,
    gender: 'Female',
    phone: '+91 99002 44102',
    email: 'ananya.deshmukh@techlead.io',
    address: 'Flat 402, Alpine Pyramid, Sahakarnagar F-Block',
    area: 'Sahakarnagar F-Block',
    careType: 'Clinic',
    packageName: '15-Session IT Ergonomic Spine & Radiculopathy Rehab',
    injuryCategory: 'Spine & Posture',
    diagnosis: 'C5-C6 Cervical Radiculopathy & Upper Trap Myofascial Pain',
    attendingTherapist: 'Dr. Aditi Rao, MPT (Lead In-Clinic)',
    packageSessionsTotal: 15,
    sessionsDelivered: 11,
    sessionsRemaining: 4,
    grossFee: 15000,
    discountAmount: 1500,
    discountReason: 'Corporate Ergonomic Referral Concession (10% Off)',
    netPayable: 13500,
    amountPaid: 13500,
    balanceDue: 0,
    paymentStatus: 'Paid',
    invoiceDate: '2026-08-16',
    dueDate: '2026-08-16',
    lastPaymentDate: '2026-08-16',
    transactions: [
      {
        id: 'TXN-908',
        date: '2026-08-16',
        amount: 13500,
        mode: 'UPI',
        referenceNo: 'UPI-ICICI-62947102914',
        collectedBy: 'Dr. Aditi Rao',
        receiptNumber: 'REC-2026-088',
        notes: 'Google Pay transaction verified. Digital receipt sent to email.'
      }
    ],
    installments: [
      {
        installmentNumber: 1,
        title: 'Full Package Advance (15 Sessions)',
        amount: 13500,
        dueDate: '2026-08-16',
        triggerSession: 1,
        status: 'Paid',
        paidDate: '2026-08-16',
        txnRef: 'UPI-ICICI-62947102914'
      }
    ],
    hsnSacCode: '999312',
    gstin: '29AAFPS4892K1ZF',
    financialRisk: 'Covered',
    perSessionEffectiveRate: 900,
    coveredSessionsCount: 15,
    uncoveredDeliveredSessions: 0,
    notes: 'Clinic Station 1 & Station 3 manual therapy bay.'
  },
  {
    id: 'INV-2026-092',
    receiptNumber: 'REC-2026-092',
    patientId: 'pt-003',
    patientName: 'Kamalamma Venkatesh',
    age: 78,
    gender: 'Female',
    phone: '+91 94481 33290',
    email: 'venkatesh.family.blr@yahoo.com',
    address: '#29, 60 Feet Road, Near Ganesha Temple, CQAL Layout',
    area: 'CQAL Layout',
    careType: 'Home',
    packageName: '25-Session Geriatric Fall Prevention & Osteoarthritis Home Care',
    injuryCategory: 'Geriatric & Joint',
    diagnosis: 'Bilateral Knee Osteoarthritis (Grade 3) & High Fall Risk Mobility Decline',
    attendingTherapist: 'Dr. Vikram K., BPT (Home Care Lead)',
    packageSessionsTotal: 25,
    sessionsDelivered: 19,
    sessionsRemaining: 6,
    grossFee: 35000,
    discountAmount: 3000,
    discountReason: 'Elder Care Family Wellness Package Subsidized Rate',
    netPayable: 32000,
    amountPaid: 32000,
    balanceDue: 0,
    paymentStatus: 'Paid',
    invoiceDate: '2026-07-28',
    dueDate: '2026-07-28',
    lastPaymentDate: '2026-08-15',
    transactions: [
      {
        id: 'TXN-845',
        date: '2026-07-28',
        amount: 16000,
        mode: 'UPI',
        referenceNo: 'UPI-SBIN-8930182471',
        collectedBy: 'Dr. Vikram K.',
        receiptNumber: 'REC-2026-092-A',
        notes: 'Installment 1 of 2 paid by son (Venkatesh Babu).'
      },
      {
        id: 'TXN-899',
        date: '2026-08-15',
        amount: 16000,
        mode: 'Net Banking',
        referenceNo: 'SBI-NEFT-891024771',
        collectedBy: 'Clinic Admin',
        receiptNumber: 'REC-2026-092-B',
        notes: 'Installment 2 of 2 paid post completion of session 10.'
      }
    ],
    installments: [
      {
        installmentNumber: 1,
        title: 'Initial 50% Package Deposit (Sessions 1-12)',
        amount: 16000,
        dueDate: '2026-07-28',
        triggerSession: 1,
        status: 'Paid',
        paidDate: '2026-07-28',
        txnRef: 'UPI-SBIN-8930182471'
      },
      {
        installmentNumber: 2,
        title: 'Milestone 50% Balance (Sessions 13-25)',
        amount: 16000,
        dueDate: '2026-08-18',
        triggerSession: 10,
        status: 'Paid',
        paidDate: '2026-08-15',
        txnRef: 'SBI-NEFT-891024771'
      }
    ],
    hsnSacCode: '999312',
    gstin: '29AAFPS4892K1ZF',
    financialRisk: 'Covered',
    perSessionEffectiveRate: 1280,
    coveredSessionsCount: 25,
    uncoveredDeliveredSessions: 0,
    notes: 'Both milestone installments received on schedule. Zero balance.'
  },
  {
    id: 'INV-2026-104',
    receiptNumber: 'REC-2026-104',
    patientId: 'pt-004',
    patientName: 'Rohan Bharadwaj',
    age: 21,
    gender: 'Male',
    phone: '+91 97312 88410',
    email: 'rohan.badminton@reva.edu.in',
    address: 'Room 304, Reva University Hostel / Sahakarnagar North',
    area: 'Reva University Hub',
    careType: 'Clinic',
    packageName: '15-Session Collegiate Athlete Rotator Cuff Rehab Package',
    injuryCategory: 'Sports & Musculoskeletal',
    diagnosis: 'Right Shoulder Supraspinatus Tendinopathy & Impingement',
    attendingTherapist: 'Dr. Aditi Rao, MPT (Lead In-Clinic)',
    packageSessionsTotal: 15,
    sessionsDelivered: 8,
    sessionsRemaining: 7,
    grossFee: 15000,
    discountAmount: 1000,
    discountReason: 'Student Athlete Sports Federation Discount',
    netPayable: 14000,
    amountPaid: 8000,
    balanceDue: 6000,
    paymentStatus: 'Partial',
    invoiceDate: '2026-08-20',
    dueDate: '2026-09-08', // Due now!
    lastPaymentDate: '2026-08-20',
    transactions: [
      {
        id: 'TXN-932',
        date: '2026-08-20',
        amount: 8000,
        mode: 'UPI',
        referenceNo: 'UPI-PAYTM-40192847192',
        collectedBy: 'Dr. Aditi Rao',
        receiptNumber: 'REC-2026-104-A',
        notes: 'Initial deposit paid via PhonePe. Agreed to pay balance before session 9.'
      }
    ],
    installments: [
      {
        installmentNumber: 1,
        title: 'Initial Package Deposit (Sessions 1-8)',
        amount: 8000,
        dueDate: '2026-08-20',
        triggerSession: 1,
        status: 'Paid',
        paidDate: '2026-08-20',
        txnRef: 'UPI-PAYTM-40192847192'
      },
      {
        installmentNumber: 2,
        title: 'Stage 2 Strength & Plyometric Block (Sessions 9-15)',
        amount: 6000,
        dueDate: '2026-09-08',
        triggerSession: 9,
        status: 'Pending'
      }
    ],
    hsnSacCode: '999312',
    gstin: '29AAFPS4892K1ZF',
    financialRisk: 'Payment Due',
    perSessionEffectiveRate: 933.33,
    coveredSessionsCount: 8, // ₹8,000 / ₹933.33 = 8.57 -> 8 covered!
    uncoveredDeliveredSessions: 0, // Currently at session 8, covered. But session 9 scheduled for tomorrow!
    notes: 'Next session (Session 9) scheduled for tomorrow Sep 08. Must collect ₹6,000 balance prior to treatment.'
  },
  {
    id: 'INV-2026-108',
    receiptNumber: 'REC-2026-108',
    patientId: 'pt-005',
    patientName: 'Geetha Narayanaswamy',
    age: 58,
    gender: 'Female',
    phone: '+91 98860 11954',
    email: 'geetha.swamy58@gmail.com',
    address: '#78, 2nd Cross, E-Block, Sahakarnagar',
    area: 'Sahakarnagar E-Block',
    careType: 'Clinic',
    packageName: '20-Session Spine Traction & Core Stabilization Package',
    injuryCategory: 'Spine & Posture',
    diagnosis: 'L4-L5 Lumbar Disc Bulge with Left Sciatica',
    attendingTherapist: 'Dr. Aditi Rao, MPT (Lead In-Clinic)',
    packageSessionsTotal: 20,
    sessionsDelivered: 16,
    sessionsRemaining: 4,
    grossFee: 20000,
    discountAmount: 2000,
    discountReason: 'Senior Citizen Clinic Loyalty Discount (10%)',
    netPayable: 18000,
    amountPaid: 18000,
    balanceDue: 0,
    paymentStatus: 'Paid',
    invoiceDate: '2026-08-01',
    dueDate: '2026-08-01',
    lastPaymentDate: '2026-08-16',
    transactions: [
      {
        id: 'TXN-871',
        date: '2026-08-01',
        amount: 9000,
        mode: 'Credit Card',
        referenceNo: 'POS-HDFC-991823',
        collectedBy: 'Front Desk',
        receiptNumber: 'REC-2026-108-A',
        notes: 'Swiped on clinic HDFC POS terminal.'
      },
      {
        id: 'TXN-911',
        date: '2026-08-16',
        amount: 9000,
        mode: 'UPI',
        referenceNo: 'UPI-GPay-771928401',
        collectedBy: 'Front Desk',
        receiptNumber: 'REC-2026-108-B',
        notes: '2nd installment received via UPI.'
      }
    ],
    installments: [
      {
        installmentNumber: 1,
        title: 'Advance 50% (Sessions 1-10)',
        amount: 9000,
        dueDate: '2026-08-01',
        triggerSession: 1,
        status: 'Paid',
        paidDate: '2026-08-01',
        txnRef: 'POS-HDFC-991823'
      },
      {
        installmentNumber: 2,
        title: 'Core Retraining Milestone (Sessions 11-20)',
        amount: 9000,
        dueDate: '2026-08-16',
        triggerSession: 10,
        status: 'Paid',
        paidDate: '2026-08-16',
        txnRef: 'UPI-GPay-771928401'
      }
    ],
    hsnSacCode: '999312',
    gstin: '29AAFPS4892K1ZF',
    financialRisk: 'Covered',
    perSessionEffectiveRate: 900,
    coveredSessionsCount: 20,
    uncoveredDeliveredSessions: 0,
    notes: 'Account fully settled. Patient nearing successful discharge.'
  },
  {
    id: 'INV-2026-112',
    receiptNumber: 'REC-2026-112',
    patientId: 'pt-007',
    patientName: 'Karthik Nambiar',
    age: 41,
    gender: 'Male',
    phone: '+91 98801 55219',
    email: 'karthik.nambiar@cloudscale.net',
    address: 'Villa 14, Pebble Bay Apartments, Dollars Colony',
    area: 'Dollars Colony (Near Sahakarnagar)',
    careType: 'Clinic',
    packageName: '10-Session Acute Lumbar Spasm & Dry Needling Fast-Track',
    injuryCategory: 'Spine & Posture',
    diagnosis: 'Acute Lumbar Paraspinal Spasm & Sacroiliac Joint Dysfunction',
    attendingTherapist: 'Dr. Aditi Rao, MPT (Lead In-Clinic)',
    packageSessionsTotal: 10,
    sessionsDelivered: 7,
    sessionsRemaining: 3,
    grossFee: 11000,
    discountAmount: 1000,
    discountReason: '10-Session Bundle Promotional Rate',
    netPayable: 10000,
    amountPaid: 4000,
    balanceDue: 6000,
    paymentStatus: 'Overdue',
    invoiceDate: '2026-08-22',
    dueDate: '2026-09-01', // Past due!
    lastPaymentDate: '2026-08-22',
    transactions: [
      {
        id: 'TXN-940',
        date: '2026-08-22',
        amount: 4000,
        mode: 'UPI',
        referenceNo: 'UPI-AXIS-918273645',
        collectedBy: 'Dr. Aditi Rao',
        receiptNumber: 'REC-2026-112-A',
        notes: 'Initial token deposit paid on evaluation day.'
      }
    ],
    installments: [
      {
        installmentNumber: 1,
        title: 'Initial Evaluation & Treatment Advance',
        amount: 4000,
        dueDate: '2026-08-22',
        triggerSession: 1,
        status: 'Paid',
        paidDate: '2026-08-22',
        txnRef: 'UPI-AXIS-918273645'
      },
      {
        installmentNumber: 2,
        title: 'Full Package Balance Settlement',
        amount: 6000,
        dueDate: '2026-09-01',
        triggerSession: 4,
        status: 'Overdue'
      }
    ],
    hsnSacCode: '999312',
    gstin: '29AAFPS4892K1ZF',
    financialRisk: 'Deficit / Overdue',
    perSessionEffectiveRate: 1000,
    coveredSessionsCount: 4, // ₹4,000 / ₹1,000 = 4 sessions covered
    uncoveredDeliveredSessions: 3, // Delivered 7 sessions, only 4 covered! 3 sessions delivered on clinic credit!
    notes: 'ALERT: Patient has completed Session 7 today. 3 sessions delivered without payment coverage (₹3,000 clinic exposure). Follow-up message sent.'
  },
  {
    id: 'INV-2026-115',
    receiptNumber: 'REC-2026-115',
    patientId: 'pt-008',
    patientName: 'Meenakshi Sundaram',
    age: 69,
    gender: 'Female',
    phone: '+91 97400 33811',
    email: 'meenakshi.sundaram.blr@gmail.com',
    address: '#54, 7th Cross, Canara Bank Layout, Sahakarnagar',
    area: 'Canara Bank Layout',
    careType: 'Home',
    packageName: '20-Session Post-Stroke Hemiparesis Neuro-Rehab Home Care',
    injuryCategory: 'Geriatric & Joint',
    diagnosis: 'Left Hemiparesis secondary to Ischemic CVA - Gait & Upper Limb Neuro-Facilitation',
    attendingTherapist: 'Dr. Vikram K., BPT (Home Care Lead)',
    packageSessionsTotal: 20,
    sessionsDelivered: 4,
    sessionsRemaining: 16,
    grossFee: 30000,
    discountAmount: 2000,
    discountReason: 'Subsidized Neuro-Rehab Package Discount',
    netPayable: 28000,
    amountPaid: 14000,
    balanceDue: 14000,
    paymentStatus: 'Partial',
    invoiceDate: '2026-08-30',
    dueDate: '2026-09-15',
    lastPaymentDate: '2026-08-30',
    transactions: [
      {
        id: 'TXN-962',
        date: '2026-08-30',
        amount: 14000,
        mode: 'Net Banking',
        referenceNo: 'ICIC-NEFT-928374102',
        collectedBy: 'Clinic Admin',
        receiptNumber: 'REC-2026-115-A',
        notes: 'First 50% milestone received via NEFT from daughter.'
      }
    ],
    installments: [
      {
        installmentNumber: 1,
        title: 'Initial 50% Neuro Advance (Sessions 1-10)',
        amount: 14000,
        dueDate: '2026-08-30',
        triggerSession: 1,
        status: 'Paid',
        paidDate: '2026-08-30',
        txnRef: 'ICIC-NEFT-928374102'
      },
      {
        installmentNumber: 2,
        title: 'Midway Milestone Balance (Sessions 11-20)',
        amount: 14000,
        dueDate: '2026-09-15',
        triggerSession: 10,
        status: 'Pending'
      }
    ],
    hsnSacCode: '999312',
    gstin: '29AAFPS4892K1ZF',
    financialRisk: 'Covered',
    perSessionEffectiveRate: 1400,
    coveredSessionsCount: 10, // ₹14,000 / ₹1,400 = 10 sessions covered
    uncoveredDeliveredSessions: 0, // Currently delivered 4 sessions. Well within covered 10.
    notes: 'Home visits progressing very well. Safe balance coverage.'
  },
  {
    id: 'INV-2026-118',
    receiptNumber: 'REC-2026-118',
    patientId: 'pt-009',
    patientName: 'Devika Krishnan',
    age: 28,
    gender: 'Female',
    phone: '+91 96112 00938',
    email: 'devika.krish@techspark.com',
    address: 'Apt 203, Vaishnavi Terraces, Sahakarnagar D-Block',
    area: 'Sahakarnagar D-Block',
    careType: 'Clinic',
    packageName: '10-Session Post-Pregnancy Pelvic & Core Rehabilitation',
    injuryCategory: 'Spine & Posture',
    diagnosis: 'Postpartum Diastasis Recti (2.5 fingerbreadth) & Sacroiliac Pelvic Girdle Pain',
    attendingTherapist: 'Dr. Aditi Rao, MPT (Lead In-Clinic)',
    packageSessionsTotal: 10,
    sessionsDelivered: 2,
    sessionsRemaining: 8,
    grossFee: 11000,
    discountAmount: 1000,
    discountReason: 'Maternal Health Awareness Discount',
    netPayable: 10000,
    amountPaid: 0,
    balanceDue: 10000,
    paymentStatus: 'Pending',
    invoiceDate: '2026-09-05',
    dueDate: '2026-09-09',
    transactions: [],
    installments: [
      {
        installmentNumber: 1,
        title: 'Full Package Payment (10 Sessions)',
        amount: 10000,
        dueDate: '2026-09-09',
        triggerSession: 1,
        status: 'Pending'
      }
    ],
    hsnSacCode: '999312',
    gstin: '29AAFPS4892K1ZF',
    financialRisk: 'Payment Due',
    perSessionEffectiveRate: 1000,
    coveredSessionsCount: 0,
    uncoveredDeliveredSessions: 2, // 2 sessions delivered on goodwill, payment promised at next session
    notes: 'New patient. Trial evaluation and Session 1 done. Payment promised on next visit (Wednesday Sep 09).'
  }
];

// Helper calculation functions
export function calculateBillingSummary(invoices: PatientInvoice[]) {
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.netPayable, 0);
  const totalCollections = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const collectionEfficiency = totalInvoiced > 0 ? (totalCollections / totalInvoiced) * 100 : 0;

  // Unpaid / uncovered sessions delivered across all packages
  const totalUncoveredSessions = invoices.reduce((sum, inv) => sum + inv.uncoveredDeliveredSessions, 0);
  const totalUncoveredValue = invoices.reduce((sum, inv) => sum + (inv.uncoveredDeliveredSessions * inv.perSessionEffectiveRate), 0);

  // Status counts
  const countPaid = invoices.filter(inv => inv.paymentStatus === 'Paid').length;
  const countPartial = invoices.filter(inv => inv.paymentStatus === 'Partial').length;
  const countPending = invoices.filter(inv => inv.paymentStatus === 'Pending').length;
  const countOverdue = invoices.filter(inv => inv.paymentStatus === 'Overdue').length;

  return {
    totalInvoiced,
    totalCollections,
    totalOutstanding,
    collectionEfficiency,
    totalUncoveredSessions,
    totalUncoveredValue,
    countPaid,
    countPartial,
    countPending,
    countOverdue
  };
}
