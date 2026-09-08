import { PatientMedicalRecord, PatientRecord } from '../types';

export const PATIENT_MEDICAL_RECORDS: Record<string, PatientMedicalRecord> = {
  'pt-001': {
    bloodGroup: 'O +ve',
    emergencyContact: {
      name: 'Dr. Vikram Rao (Son)',
      relationship: 'Son / Radiologist',
      phone: '+91 98455 31102'
    },
    lastReviewedDate: '2026-09-05',
    reviewedBy: 'Dr. S. Kulkarni, MPT (Ortho) - Lead Physio',
    chronicHistory: [
      {
        id: 'ch-001-1',
        condition: 'Essential Hypertension',
        diagnosedYear: '2015',
        severity: 'Controlled',
        currentMedications: ['Amlodipine 5mg OD (Morning)', 'Telmisartan 40mg OD'],
        physioPrecaution: 'Monitor baseline BP prior to high-resistance exercise. Avoid prolonged isometric breath-holding (Valsalva).',
        status: 'Managed'
      },
      {
        id: 'ch-001-2',
        condition: 'Type-2 Diabetes Mellitus',
        diagnosedYear: '2017',
        severity: 'Controlled',
        currentMedications: ['Metformin 500mg BD', 'Glimepiride 1mg OD'],
        physioPrecaution: 'Daily inspection of surgical leg and feet for sensation changes (monofilament check). Watch for hypoglycemia during intense sessions.',
        status: 'Managed'
      },
      {
        id: 'ch-001-3',
        condition: 'Bilateral Hip Osteopenia',
        diagnosedYear: '2022',
        severity: 'Mild',
        currentMedications: ['Calcium Carbonate 500mg + Vitamin D3 60k IU weekly'],
        physioPrecaution: 'Prioritize closed-kinetic-chain axial loading exercises. Avoid high-impact or sudden torsional stress.',
        status: 'Managed'
      }
    ],
    previousSurgeries: [
      {
        id: 'ps-001-1',
        procedure: 'Left Total Knee Arthroplasty (TKR)',
        surgeryDate: '2026-07-28',
        hospitalDoctor: 'Aster CMI Hospital, Hebbal / Dr. M. S. Hegde (Orthopedics)',
        implantsProsthetics: 'Zimmer Biomet Persona PS Knee (Cruciate Sacrificing, Cobalt-Chrome, Cross-linked Polyethylene)',
        recoveryComplications: 'Uncomplicated primary recovery; staple removal on Day 14 without dehiscence.',
        ptRehabSignificance: 'Avoid forced passive knee flexion past 115° in early phase; protect extensor mechanism and focus on terminal extension (0°).'
      },
      {
        id: 'ps-001-2',
        procedure: 'Bilateral Cataract Phacoemulsification with IOL',
        surgeryDate: '2022-03-14',
        hospitalDoctor: 'Narayana Nethralaya, Bangalore / Dr. Rohit Shetty',
        implantsProsthetics: 'Foldable Monofocal Intraocular Lenses (Both Eyes)',
        recoveryComplications: 'None; 6/6 corrected vision.',
        ptRehabSignificance: 'Visual acuity restored, supporting confident obstacle navigation and tandem balance drills.'
      }
    ],
    allergyRedFlags: [
      {
        id: 'arf-001-1',
        type: 'Clinical Red Flag',
        name: 'Deep Vein Thrombosis (DVT) Vigilance Alert',
        severity: 'Critical',
        clinicalTrigger: 'Calf swelling >3cm vs contralateral, localized warmth, severe tenderness along deep posterior calf veins.',
        actionDirective: 'MANDATORY: Measure calf circumference bilaterally every session. If Wells score indicates DVT risk, immediately suspend exertion, avoid calf massage, and refer to Aster CMI ER.',
        identifiedDate: '2026-08-10'
      },
      {
        id: 'arf-001-2',
        type: 'Allergy',
        name: 'Adhesive Elastoplast & Conventional Zinc Oxide Tape Allergy',
        severity: 'High',
        clinicalTrigger: 'Direct contact with standard kinesiology tape or adhesive surgical plaster.',
        actionDirective: 'USE HYPOALLERGENIC PAPER TAPE (Microfoam/Micropore) OR SILICONE UNDERWRAP ONLY. Never apply adhesive directly over healing surgical incision.',
        identifiedDate: '2026-08-11'
      },
      {
        id: 'arf-001-3',
        type: 'Contraindication',
        name: 'High-Impact Plyometrics & Running Contraindication',
        severity: 'Moderate',
        clinicalTrigger: 'Repetitive impact ground reaction forces.',
        actionDirective: 'Contraindicated for prosthetic joint longevity. Restrict conditioning to stationary cycling, elliptical cross-trainer, and pool therapy.',
        identifiedDate: '2026-08-10'
      }
    ]
  },

  'pt-002': {
    bloodGroup: 'B +ve',
    emergencyContact: {
      name: 'Aditya Deshmukh (Spouse)',
      relationship: 'Spouse / Tech Manager',
      phone: '+91 99001 22891'
    },
    lastReviewedDate: '2026-09-06',
    reviewedBy: 'Dr. S. Kulkarni, MPT (Ortho) - Lead Physio',
    chronicHistory: [
      {
        id: 'ch-002-1',
        condition: 'Cervicogenic Migraine & Occipital Neuralgia',
        diagnosedYear: '2021',
        severity: 'Moderate',
        currentMedications: ['Naproxen 250mg PRN (SOS)', 'Magnesium Glycinate 400mg HS'],
        physioPrecaution: 'Gentle suboccipital decompression only. Discontinue if patient reports scintillating scotoma or photophobia.',
        status: 'Managed'
      },
      {
        id: 'ch-002-2',
        condition: 'Postural Forward Head Syndrome & Upper Cross Syndrome',
        diagnosedYear: '2024',
        severity: 'Moderate',
        currentMedications: ['None (Physical therapy primary intervention)'],
        physioPrecaution: 'Re-train deep cervical flexors (longus colli) with biofeedback. Reinforce 50-min screen ergonomics.',
        status: 'Active'
      }
    ],
    previousSurgeries: [
      {
        id: 'ps-002-1',
        procedure: 'Diagnostic Laparoscopy & Excision of Endometrial Implants',
        surgeryDate: '2020-11-10',
        hospitalDoctor: 'Cloudnine Hospital, Hebbal / Dr. Modhulika',
        implantsProsthetics: 'None',
        recoveryComplications: 'None; fully recovered.',
        ptRehabSignificance: 'Core stability and transverse abdominis activation fully safe for prone and quadruped spinal stabilization.'
      }
    ],
    allergyRedFlags: [
      {
        id: 'arf-002-1',
        type: 'Contraindication',
        name: 'HVLA (High-Velocity Low-Amplitude) Cervical Thrust Manipulation',
        severity: 'Critical',
        clinicalTrigger: 'End-range rapid cervical rotary thrust manipulations.',
        actionDirective: 'STRICTLY PROHIBITED. Patient has MRI-documented C5-C6 posterior disc protrusion with nerve root contact. Utilize gentle Maitland Grade I-II mobilization and mechanical traction only.',
        identifiedDate: '2026-08-16'
      },
      {
        id: 'arf-002-2',
        type: 'Clinical Red Flag',
        name: 'Cervical Myelopathy & Radicular Deterioration Alert',
        severity: 'Critical',
        clinicalTrigger: 'Bilateral hand tingling, loss of fine finger dexterity (difficulty buttoning shirt), hyperreflexia, or gait stumbling.',
        actionDirective: 'Perform Hoffman sign and inverted supinator reflex if symptoms progress. Immediate neurosurgery consult required if positive.',
        identifiedDate: '2026-08-16'
      },
      {
        id: 'arf-002-3',
        type: 'Allergy',
        name: 'Oral NSAID Gastric Sensitivity & Dyspepsia',
        severity: 'Moderate',
        clinicalTrigger: 'Oral Diclofenac or Ibuprofen tablet ingestion.',
        actionDirective: 'Do not recommend OTC NSAIDs. Rely on non-pharmacological modalities: IFT (4-pole), heat packs, and myofascial release.',
        identifiedDate: '2026-08-18'
      }
    ]
  },

  'pt-003': {
    bloodGroup: 'A +ve',
    emergencyContact: {
      name: 'Venkatesh Prasad (Son)',
      relationship: 'Son / Corporate Director',
      phone: '+91 94480 11200'
    },
    lastReviewedDate: '2026-09-04',
    reviewedBy: 'Dr. Priya Sharma, BPT - Geriatric Home-Care Lead',
    chronicHistory: [
      {
        id: 'ch-003-1',
        condition: 'Severe Senile Osteoporosis (T-Score -3.2 Spine, -2.9 Hip)',
        diagnosedYear: '2016',
        severity: 'Severe',
        currentMedications: ['Denosumab 60mg s/c injection every 6 months', 'Alfacalcidol 0.25mcg OD'],
        physioPrecaution: 'CRITICAL PRECAUTION: Absolutely avoid forward spinal flexion under load, sudden twisting, or aggressive manual pressure on thoracic spine.',
        status: 'Managed'
      },
      {
        id: 'ch-003-2',
        condition: 'Ischemic Heart Disease (Post-PCI Stent)',
        diagnosedYear: '2017',
        severity: 'Controlled',
        currentMedications: ['Aspirin 75mg OD', 'Atorvastatin 20mg HS', 'Metoprolol 25mg OD'],
        physioPrecaution: 'Limit Borg RPE to ≤12 (light exertion). Monitor for dyspnea or angina; avoid sudden posture changes.',
        status: 'Managed'
      },
      {
        id: 'ch-003-3',
        condition: 'Chronic Venous Insufficiency (Bilateral Lower Extremity)',
        diagnosedYear: '2019',
        severity: 'Moderate',
        currentMedications: ['Micronized Purified Flavonoid Fraction 500mg OD'],
        physioPrecaution: 'Elevate lower limbs on pillows for 10 minutes post-session. Teach seated ankle pumps (20 reps x 3 sets).',
        status: 'Managed'
      }
    ],
    previousSurgeries: [
      {
        id: 'ps-003-1',
        procedure: 'Coronary Angioplasty with Drug-Eluting Stent (DES) to LAD',
        surgeryDate: '2017-04-12',
        hospitalDoctor: 'Manipal Hospital, Yeshwanthpur / Dr. Ranjan Shetty',
        implantsProsthetics: 'Cobalt-Chromium Everolimus-Eluting Coronary Stent in Left Anterior Descending (LAD) artery',
        recoveryComplications: 'Stable LVEF at 52%; no restenosis.',
        ptRehabSignificance: 'High-frequency electrotherapy contraindicated over torso. Never allow breath-holding during sit-to-stand transitions.'
      },
      {
        id: 'ps-003-2',
        procedure: 'Total Abdominal Hysterectomy with Bilateral Salpingo-Oophorectomy',
        surgeryDate: '1999-06-20',
        hospitalDoctor: 'St. Martha’s Hospital, Bangalore',
        implantsProsthetics: 'None',
        recoveryComplications: 'None; historical procedure.',
        ptRehabSignificance: 'No acute active relevance to musculoskeletal lower limb program.'
      }
    ],
    allergyRedFlags: [
      {
        id: 'arf-003-1',
        type: 'Clinical Red Flag',
        name: 'High Fall Risk with Severe Fragility Fracture Vulnerability',
        severity: 'Critical',
        clinicalTrigger: 'Unassisted transfers, walking on slick tiles without gait belt, hurry to attend phone/doorbell.',
        actionDirective: 'MANDATORY 1-on-1 contact guard with clinician holding gait belt during all standing/walking drills. Family informed to keep hallway nightlights ON and clear rugs.',
        identifiedDate: '2026-07-28'
      },
      {
        id: 'arf-003-2',
        type: 'Contraindication',
        name: 'Shortwave Diathermy (SWD) & High-Frequency Electrotherapy Contraindication',
        severity: 'Critical',
        clinicalTrigger: 'Application of SWD, microwave diathermy, or ultrasound near thorax.',
        actionDirective: 'CONTRAINDICATED due to internal metallic coronary cardiac stent. Rely strictly on low-voltage TENS, superficial hot packs, and active mobilization.',
        identifiedDate: '2026-07-28'
      },
      {
        id: 'arf-003-3',
        type: 'Allergy',
        name: 'Sulfa Drugs & Co-trimoxazole Antibiotics Allergy',
        severity: 'High',
        clinicalTrigger: 'Sulfonamide group medications.',
        actionDirective: 'Marked on patient chart; triggers severe generalized urticarial rash.',
        identifiedDate: '2026-07-28'
      }
    ]
  },

  'pt-004': {
    bloodGroup: 'O -ve',
    emergencyContact: {
      name: 'Sunil Bharadwaj (Father)',
      relationship: 'Father / Engineer',
      phone: '+91 97310 99231'
    },
    lastReviewedDate: '2026-09-06',
    reviewedBy: 'Dr. S. Kulkarni, MPT (Sports) - Lead Physio',
    chronicHistory: [
      {
        id: 'ch-004-1',
        condition: 'Generalized Joint Hypermobility (Beighton Score 5/9)',
        diagnosedYear: '2022',
        severity: 'Mild',
        currentMedications: ['None'],
        physioPrecaution: 'Emphasize dynamic neuromuscular control and joint centering rather than passive stretching. Train within safe active ROM.',
        status: 'Active'
      },
      {
        id: 'ch-004-2',
        condition: 'Mild Exercise-Induced Bronchospasm',
        diagnosedYear: '2023',
        severity: 'Controlled',
        currentMedications: ['Levosalbutamol Inhaler (100mcg 2 puffs SOS before matches)'],
        physioPrecaution: 'Ensure patient brings rescue inhaler to clinic for high-velocity agility and plyometric conditioning.',
        status: 'Managed'
      }
    ],
    previousSurgeries: [],
    allergyRedFlags: [
      {
        id: 'arf-004-1',
        type: 'Clinical Red Flag',
        name: 'Anterior Glenohumeral Subluxation Apprehension Alert',
        severity: 'High',
        clinicalTrigger: 'Sudden end-range 90° abduction + 90° external rotation (late smash cocking phase).',
        actionDirective: 'Do not force passive end-range external rotation. Strengthen subscapularis, serratus anterior, and lower traps to stabilize humeral head before clearance for smash drills.',
        identifiedDate: '2026-08-20'
      },
      {
        id: 'arf-004-2',
        type: 'Allergy',
        name: 'Topical NSAID (Diclofenac / Methyl Salicylate) Contact Dermatitis',
        severity: 'Moderate',
        clinicalTrigger: 'Application of topical pain-relief ointments or liniments.',
        actionDirective: 'Avoid applying topical medicated gels. Use pure ultrasound coupling gel for therapeutic ultrasound; apply plain ice packs for post-training cryotherapy.',
        identifiedDate: '2026-08-21'
      }
    ]
  },

  'pt-005': {
    bloodGroup: 'B +ve',
    emergencyContact: {
      name: 'Dr. K. Narayanaswamy (Husband)',
      relationship: 'Spouse / Professor',
      phone: '+91 98861 22910'
    },
    lastReviewedDate: '2026-09-03',
    reviewedBy: 'Dr. S. Kulkarni, MPT - Lead Physio',
    chronicHistory: [
      {
        id: 'ch-005-1',
        condition: 'Primary Hypothyroidism',
        diagnosedYear: '2012',
        severity: 'Controlled',
        currentMedications: ['Thyronorm 75mcg OD (Fasting)'],
        physioPrecaution: 'Watch for muscular fatigue and slower connective tissue recovery; allow gradual warm-ups.',
        status: 'Managed'
      },
      {
        id: 'ch-005-2',
        condition: 'Dyslipidemia',
        diagnosedYear: '2018',
        severity: 'Controlled',
        currentMedications: ['Atorvastatin 10mg HS'],
        physioPrecaution: 'Screen for statin-related muscular aching vs true lumbar radicular symptoms.',
        status: 'Managed'
      }
    ],
    previousSurgeries: [
      {
        id: 'ps-005-1',
        procedure: 'Laparoscopic Cholecystectomy',
        surgeryDate: '2015-09-18',
        hospitalDoctor: 'Columbia Asia / Manipal Hospital Hebbal / Dr. Ravindra',
        implantsProsthetics: 'Titanium surgical clips on cystic duct',
        recoveryComplications: 'None; uneventful recovery.',
        ptRehabSignificance: 'Abdominal wall fully healed; safe for transverse abdominis recruitment and pelvic bridging.'
      }
    ],
    allergyRedFlags: [
      {
        id: 'arf-005-1',
        type: 'Clinical Red Flag',
        name: 'Cauda Equina Syndrome Emergency Warning Sign',
        severity: 'Critical',
        clinicalTrigger: 'New onset saddle anesthesia (loss of sensation in perineum/groin), sudden urinary retention/incontinence, or progressive bilateral foot drop.',
        actionDirective: 'RED-FLAG EMERGENCY PROTOCOL: Cease spinal traction immediately. Instruct family to rush patient to Aster CMI Hospital ER for emergent MRI. Document time of report.',
        identifiedDate: '2026-08-01'
      },
      {
        id: 'arf-005-2',
        type: 'Contraindication',
        name: 'Loaded Lumbar End-Range Flexion & Slump Sitting',
        severity: 'High',
        clinicalTrigger: 'Bending forward to lift buckets or slouched floor sitting.',
        actionDirective: 'Contraindicated during active disc healing phase. Reinforce McKenzie prone extension principle, use ergonomic lumbar roll, and avoid slouched chairs.',
        identifiedDate: '2026-08-01'
      }
    ]
  },

  'pt-006': {
    bloodGroup: 'AB +ve',
    emergencyContact: {
      name: 'Col. K. S. Somanna (Son)',
      relationship: 'Son / Armed Forces',
      phone: '+91 94801 88201'
    },
    lastReviewedDate: '2026-08-30',
    reviewedBy: 'Dr. Priya Sharma, BPT - Geriatric Home-Care Specialist',
    chronicHistory: [
      {
        id: 'ch-006-1',
        condition: 'Idiopathic Parkinson’s Disease (Hoehn & Yahr Stage 2)',
        diagnosedYear: '2021',
        severity: 'Moderate',
        currentMedications: ['Syndopa Plus (Levodopa/Carbidopa 100/25) 1 tab TDS', 'Pramipexole 0.5mg OD'],
        physioPrecaution: 'Schedule physical therapy specifically during "ON" medication periods (approx. 45–60 mins after Syndopa dose). Incorporate big-amplitude rotational drills.',
        status: 'Managed'
      },
      {
        id: 'ch-006-2',
        condition: 'Orthostatic / Postural Hypotension',
        diagnosedYear: '2023',
        severity: 'Moderate',
        currentMedications: ['Fludrocortisone 0.1mg OD (Morning)'],
        physioPrecaution: 'Always transition patient from lying to sitting for 30 seconds before standing. Re-check BP if lightheadedness or pallor occurs.',
        status: 'Managed'
      },
      {
        id: 'ch-006-3',
        condition: 'Benign Prostatic Hyperplasia (BPH)',
        diagnosedYear: '2015',
        severity: 'Controlled',
        currentMedications: ['Silodosin 8mg HS'],
        physioPrecaution: 'Ensure easy bathroom access during home sessions; avoid urinary urgency during balance drills.',
        status: 'Managed'
      }
    ],
    previousSurgeries: [
      {
        id: 'ps-006-1',
        procedure: 'Right Inguinal Hernia Mesh Repair (Lichtenstein technique)',
        surgeryDate: '2012-05-10',
        hospitalDoctor: 'Command Hospital (Air Force), Bangalore / Col. V. K. Nair',
        implantsProsthetics: 'Polypropylene prosthetic surgical mesh',
        recoveryComplications: 'None; well-consolidated abdominal wall.',
        ptRehabSignificance: 'No limitations on lower extremity or gait rehab.'
      },
      {
        id: 'ps-006-2',
        procedure: 'Aspiration & Drainage of Left Trochanteric Contusion Hematoma',
        surgeryDate: '2026-07-02',
        hospitalDoctor: 'Aster CMI Hospital / Dr. M. S. Hegde',
        implantsProsthetics: 'None',
        recoveryComplications: 'Resolved without deep tissue infection.',
        ptRehabSignificance: 'Avoid deep aggressive friction over left greater trochanter; focus on gentle gluteal activation and soft tissue mobility.'
      }
    ],
    allergyRedFlags: [
      {
        id: 'arf-006-1',
        type: 'Clinical Red Flag',
        name: 'Freezing of Gait (FOG) at Hallway Thresholds & Turns',
        severity: 'Critical',
        clinicalTrigger: 'Doorway transitions, narrow spaces, sudden directional turns.',
        actionDirective: 'USE VISUAL CUEING: Instruct patient to step over floor laser/tape lines and count out loud ("1-2-1-2"). NEVER pull on patient arms during a freeze event as this causes backward falls.',
        identifiedDate: '2026-07-15'
      },
      {
        id: 'arf-006-2',
        type: 'Allergy',
        name: 'Penicillin & Beta-Lactam Antibiotics Anaphylaxis',
        severity: 'Critical',
        clinicalTrigger: 'Penicillin, Amoxicillin, Ampicillin derivatives.',
        actionDirective: 'CRITICAL ALERT: Documented severe anaphylactic history. High-visibility red alert badge on patient physical record.',
        identifiedDate: '2026-07-15'
      }
    ]
  }
};

/**
 * Returns the medical records for a given patient, either from the patient object itself
 * or from the curated PATIENT_MEDICAL_RECORDS map, or a robust default fallback.
 */
export function getPatientMedicalRecords(patient: PatientRecord): PatientMedicalRecord {
  if (patient.medicalRecords && (patient.medicalRecords.chronicHistory?.length > 0 || patient.medicalRecords.allergyRedFlags?.length > 0)) {
    return patient.medicalRecords;
  }

  if (PATIENT_MEDICAL_RECORDS[patient.id]) {
    return PATIENT_MEDICAL_RECORDS[patient.id];
  }

  // Fallback for custom or newly enrolled patients
  return {
    bloodGroup: 'B +ve',
    emergencyContact: {
      name: 'Family Primary Contact',
      relationship: 'Next of Kin',
      phone: patient.phone || '+91 98450 00000'
    },
    lastReviewedDate: new Date().toISOString().split('T')[0],
    reviewedBy: 'Lead Physiotherapist (MPT) - Sahakar Physio',
    chronicHistory: [
      {
        id: `ch-${patient.id}-1`,
        condition: patient.treatmentType === 'Chronic' ? 'Geriatric Joint Osteoarthritis' : 'Musculoskeletal Strain',
        diagnosedYear: '2023',
        severity: 'Moderate',
        currentMedications: ['Analgesics PRN', 'Multivitamins'],
        physioPrecaution: 'Tailor exercise intensity to patient fatigue and daily pain baseline.',
        status: 'Active'
      }
    ],
    previousSurgeries: patient.treatmentType === 'Post-Surgery' ? [
      {
        id: `ps-${patient.id}-1`,
        procedure: patient.diagnosis,
        surgeryDate: patient.startDate,
        hospitalDoctor: patient.referringDoctor || 'Referral Hospital',
        implantsProsthetics: 'Surgical implant / prosthetic',
        recoveryComplications: 'Healing in progress',
        ptRehabSignificance: 'Adhere to orthopedic post-operative mobilization protocols.'
      }
    ] : [],
    allergyRedFlags: [
      {
        id: `arf-${patient.id}-1`,
        type: 'Clinical Red Flag',
        name: 'Pain Flare & Exacerbation Vigilance',
        severity: 'Moderate',
        clinicalTrigger: 'Sudden spike in VAS pain score > 3 points above baseline.',
        actionDirective: 'Re-evaluate biomechanical loading; reduce resistance and apply cryo/thermal therapy.',
        identifiedDate: patient.startDate
      }
    ]
  };
}
