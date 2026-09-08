import React, { useState } from 'react';
import { 
  PatientRecord, 
  PatientMedicalRecord, 
  ChronicConditionItem, 
  SurgeryRecordItem, 
  AllergyRedFlagItem 
} from '../types';
import { getPatientMedicalRecords } from '../data/patientMedicalDefaults';
import { 
  ShieldAlert, 
  AlertTriangle, 
  HeartPulse, 
  Stethoscope, 
  Activity, 
  Scissors, 
  Plus, 
  Calendar, 
  Building2, 
  Pill, 
  CheckCircle2, 
  PhoneCall, 
  Clock, 
  FileText, 
  Printer, 
  X, 
  Sparkles,
  Info,
  BadgeAlert,
  Flame,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface PatientMedicalRecordsProps {
  patient: PatientRecord;
  onUpdateMedicalRecords?: (patientId: string, updatedRecords: PatientMedicalRecord) => void;
  standalone?: boolean;
}

export const PatientMedicalRecords: React.FC<PatientMedicalRecordsProps> = ({
  patient,
  onUpdateMedicalRecords,
  standalone = false,
}) => {
  // Get active medical records
  const [medicalRecord, setMedicalRecord] = useState<PatientMedicalRecord>(() => 
    getPatientMedicalRecords(patient)
  );

  // Active section filter within medical records
  const [activeSection, setActiveSection] = useState<'all' | 'chronic' | 'surgeries' | 'alerts'>('all');

  // Modal forms states
  const [showAddChronicModal, setShowAddChronicModal] = useState(false);
  const [showAddSurgeryModal, setShowAddSurgeryModal] = useState(false);
  const [showAddAlertModal, setShowAddAlertModal] = useState(false);

  // New Chronic Condition Form state
  const [newChronic, setNewChronic] = useState<Omit<ChronicConditionItem, 'id'>>({
    condition: '',
    diagnosedYear: new Date().getFullYear().toString(),
    severity: 'Moderate',
    currentMedications: [],
    physioPrecaution: '',
    status: 'Active'
  });
  const [medsInput, setMedsInput] = useState('');

  // New Surgery Form state
  const [newSurgery, setNewSurgery] = useState<Omit<SurgeryRecordItem, 'id'>>({
    procedure: '',
    surgeryDate: new Date().toISOString().split('T')[0],
    hospitalDoctor: '',
    implantsProsthetics: '',
    recoveryComplications: '',
    ptRehabSignificance: ''
  });

  // New Allergy/Red-Flag Form state
  const [newAlert, setNewAlert] = useState<Omit<AllergyRedFlagItem, 'id'>>({
    type: 'Clinical Red Flag',
    name: '',
    severity: 'Critical',
    clinicalTrigger: '',
    actionDirective: '',
    identifiedDate: new Date().toISOString().split('T')[0]
  });

  // Handlers for adding items
  const handleAddChronic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChronic.condition.trim()) return;

    const newItem: ChronicConditionItem = {
      ...newChronic,
      id: `ch-${patient.id}-${Date.now()}`,
      currentMedications: medsInput
        ? medsInput.split(',').map(m => m.trim()).filter(Boolean)
        : []
    };

    const updated: PatientMedicalRecord = {
      ...medicalRecord,
      chronicHistory: [...medicalRecord.chronicHistory, newItem],
      lastReviewedDate: new Date().toISOString().split('T')[0]
    };

    setMedicalRecord(updated);
    if (onUpdateMedicalRecords) {
      onUpdateMedicalRecords(patient.id, updated);
    }

    setNewChronic({
      condition: '',
      diagnosedYear: new Date().getFullYear().toString(),
      severity: 'Moderate',
      currentMedications: [],
      physioPrecaution: '',
      status: 'Active'
    });
    setMedsInput('');
    setShowAddChronicModal(false);
  };

  const handleAddSurgery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSurgery.procedure.trim()) return;

    const newItem: SurgeryRecordItem = {
      ...newSurgery,
      id: `ps-${patient.id}-${Date.now()}`
    };

    const updated: PatientMedicalRecord = {
      ...medicalRecord,
      previousSurgeries: [...medicalRecord.previousSurgeries, newItem],
      lastReviewedDate: new Date().toISOString().split('T')[0]
    };

    setMedicalRecord(updated);
    if (onUpdateMedicalRecords) {
      onUpdateMedicalRecords(patient.id, updated);
    }

    setNewSurgery({
      procedure: '',
      surgeryDate: new Date().toISOString().split('T')[0],
      hospitalDoctor: '',
      implantsProsthetics: '',
      recoveryComplications: '',
      ptRehabSignificance: ''
    });
    setShowAddSurgeryModal(false);
  };

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlert.name.trim()) return;

    const newItem: AllergyRedFlagItem = {
      ...newAlert,
      id: `arf-${patient.id}-${Date.now()}`
    };

    const updated: PatientMedicalRecord = {
      ...medicalRecord,
      allergyRedFlags: [newItem, ...medicalRecord.allergyRedFlags],
      lastReviewedDate: new Date().toISOString().split('T')[0]
    };

    setMedicalRecord(updated);
    if (onUpdateMedicalRecords) {
      onUpdateMedicalRecords(patient.id, updated);
    }

    setNewAlert({
      type: 'Clinical Red Flag',
      name: '',
      severity: 'Critical',
      clinicalTrigger: '',
      actionDirective: '',
      identifiedDate: new Date().toISOString().split('T')[0]
    });
    setShowAddAlertModal(false);
  };

  const criticalAlertsCount = medicalRecord.allergyRedFlags.filter(a => a.severity === 'Critical').length;
  const highAlertsCount = medicalRecord.allergyRedFlags.filter(a => a.severity === 'High').length;

  return (
    <div className={`space-y-6 ${standalone ? 'p-6 bg-white rounded-2xl border border-stone-200 shadow-xs' : ''}`}>
      {/* Top Clinical Safety & Profile Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-700 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700/80 border border-teal-500/30 flex items-center justify-center text-teal-200 shrink-0">
              <HeartPulse className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-bold text-sm sm:text-base text-white">
                  Patient Medical Records & Clinical Dossier
                </h4>
                {medicalRecord.bloodGroup && (
                  <span className="px-2 py-0.5 rounded bg-rose-900/60 border border-rose-600/40 text-rose-200 text-[10px] font-black uppercase tracking-wider">
                    {medicalRecord.bloodGroup}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-300">
                Patient: <strong className="text-white">{patient.fullName}</strong> ({patient.age}y, {patient.gender}) • KPME Reg: {patient.id}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {criticalAlertsCount > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-400 text-rose-200 text-xs font-bold flex items-center animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                {criticalAlertsCount} Critical Red Flags
              </span>
            )}
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-stone-700/80 hover:bg-stone-600 text-stone-200 text-xs font-semibold flex items-center transition-colors cursor-pointer"
              title="Print Medical Records Summary"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print Dossier
            </button>
          </div>
        </div>

        {/* Quick Meta Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-stone-700/70 text-[11px] text-stone-300">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>
              Emergency Contact: <strong className="text-white">{medicalRecord.emergencyContact?.name || 'Next of Kin'}</strong> ({medicalRecord.emergencyContact?.relationship}) • <a href={`tel:${medicalRecord.emergencyContact?.phone}`} className="text-teal-300 underline font-medium">{medicalRecord.emergencyContact?.phone}</a>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              Attending PT Review: <strong className="text-white">{medicalRecord.reviewedBy || 'Lead Physio'}</strong>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Last Clinical Review: <strong className="text-white">{medicalRecord.lastReviewedDate || 'Current'}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Section Navigation Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Medical Sections
          </button>

          <button
            onClick={() => setActiveSection('chronic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center cursor-pointer ${
              activeSection === 'chronic'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
            Chronic History ({medicalRecord.chronicHistory.length})
          </button>

          <button
            onClick={() => setActiveSection('surgeries')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center cursor-pointer ${
              activeSection === 'surgeries'
                ? 'bg-sky-100 text-sky-900 border border-sky-300 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-sky-50 hover:text-sky-800'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 mr-1.5 text-sky-600" />
            Previous Surgeries ({medicalRecord.previousSurgeries.length})
          </button>

          <button
            onClick={() => setActiveSection('alerts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center cursor-pointer ${
              activeSection === 'alerts'
                ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-rose-50 hover:text-rose-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
            Allergy / Red-Flag Alerts ({medicalRecord.allergyRedFlags.length})
          </button>
        </div>

        {/* Action Quick Add Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddAlertModal(true)}
            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold flex items-center transition-colors cursor-pointer"
            title="Log new allergy or red-flag alert"
          >
            <Plus className="w-3 h-3 mr-1" />
            + Alert / Red-Flag
          </button>
          <button
            onClick={() => setShowAddChronicModal(true)}
            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center transition-colors cursor-pointer"
            title="Add chronic medical condition"
          >
            <Plus className="w-3 h-3 mr-1" />
            + Chronic History
          </button>
          <button
            onClick={() => setShowAddSurgeryModal(true)}
            className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold flex items-center transition-colors cursor-pointer"
            title="Record previous surgery"
          >
            <Plus className="w-3 h-3 mr-1" />
            + Surgery Record
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: ALLERGY & RED-FLAG ALERTS (Displayed first for safety)         */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'alerts') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
              </div>
              <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                Allergy / Red-Flag Alerts & Clinical Contraindications
              </h5>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                {medicalRecord.allergyRedFlags.length} Alerts
              </span>
            </div>

            <button
              onClick={() => setShowAddAlertModal(true)}
              className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Safety Alert
            </button>
          </div>

          {medicalRecord.allergyRedFlags.length === 0 ? (
            <div className="p-5 rounded-xl border border-stone-200 bg-stone-50 text-center text-xs text-stone-500">
              No clinical red flags, contraindications, or allergies recorded for this patient.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {medicalRecord.allergyRedFlags.map((alert) => {
                const isCritical = alert.severity === 'Critical';
                const isHigh = alert.severity === 'High';

                return (
                  <div
                    key={alert.id}
                    className={`rounded-xl border p-4 space-y-2.5 transition-all shadow-2xs ${
                      isCritical
                        ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-400/30'
                        : isHigh
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            isCritical
                              ? 'bg-rose-600 text-white'
                              : isHigh
                              ? 'bg-amber-600 text-white'
                              : 'bg-stone-600 text-white'
                          }`}>
                            {alert.severity} • {alert.type}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            Logged: {alert.identifiedDate}
                          </span>
                        </div>
                        <h6 className="font-extrabold text-sm text-stone-900 pt-0.5">
                          {alert.name}
                        </h6>
                      </div>

                      <div className="shrink-0">
                        {isCritical ? (
                          <span className="w-7 h-7 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center font-bold animate-pulse">
                            <BadgeAlert className="w-4 h-4" />
                          </span>
                        ) : isHigh ? (
                          <span className="w-7 h-7 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold">
                            <AlertTriangle className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold">
                            <Info className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Trigger */}
                    <div className="text-[11px] text-stone-700">
                      <strong className="text-stone-900 font-semibold">Clinical Trigger / Presentation: </strong>
                      {alert.clinicalTrigger}
                    </div>

                    {/* Physical Therapy Action Directive */}
                    <div className={`p-2.5 rounded-lg text-xs leading-relaxed font-medium border ${
                      isCritical 
                        ? 'bg-white border-rose-300 text-rose-950'
                        : 'bg-white border-amber-200 text-amber-950'
                    }`}>
                      <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-rose-800 mb-1">
                        <Flame className="w-3 h-3 text-rose-600" />
                        <span>Physiotherapist Mandatory Directive</span>
                      </div>
                      {alert.actionDirective}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: CHRONIC HISTORY                                               */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'chronic') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Activity className="w-4 h-4 text-amber-700" />
              </div>
              <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                Chronic Medical History & Co-Morbidities
              </h5>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                {medicalRecord.chronicHistory.length} Conditions
              </span>
            </div>

            <button
              onClick={() => setShowAddChronicModal(true)}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Condition
            </button>
          </div>

          {medicalRecord.chronicHistory.length === 0 ? (
            <div className="p-5 rounded-xl border border-stone-200 bg-stone-50 text-center text-xs text-stone-500">
              No chronic illnesses or long-term systemic conditions reported.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {medicalRecord.chronicHistory.map((ch) => (
                <div
                  key={ch.id}
                  className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-2xs hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          ch.severity === 'Severe'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : ch.severity === 'Moderate'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : ch.severity === 'Controlled'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {ch.severity}
                        </span>
                        {ch.diagnosedYear && (
                          <span className="text-[10px] text-stone-400">
                            Diagnosed ~{ch.diagnosedYear}
                          </span>
                        )}
                      </div>
                      <h6 className="font-bold text-sm text-stone-900 pt-1">
                        {ch.condition}
                      </h6>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {ch.status}
                    </span>
                  </div>

                  {/* Medications Pills */}
                  {ch.currentMedications && ch.currentMedications.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase text-stone-500 flex items-center">
                        <Pill className="w-3 h-3 mr-1 text-teal-600" />
                        Active Prescriptions / Dosages
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {ch.currentMedications.map((med, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px] font-medium border border-stone-200"
                          >
                            {med}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Physiotherapy Clinical Precaution */}
                  {ch.physioPrecaution && (
                    <div className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-200/80 text-[11px] text-teal-950">
                      <strong className="text-teal-900 block font-bold mb-0.5">
                        Clinical Physiotherapy Precaution:
                      </strong>
                      {ch.physioPrecaution}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: PREVIOUS SURGERIES                                             */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'surgeries') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                <Scissors className="w-4 h-4 text-sky-700" />
              </div>
              <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                Previous Surgeries & Operative Interventions
              </h5>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                {medicalRecord.previousSurgeries.length} Procedures
              </span>
            </div>

            <button
              onClick={() => setShowAddSurgeryModal(true)}
              className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Surgery
            </button>
          </div>

          {medicalRecord.previousSurgeries.length === 0 ? (
            <div className="p-5 rounded-xl border border-stone-200 bg-stone-50 text-center text-xs text-stone-500">
              No surgical procedures recorded for this patient.
            </div>
          ) : (
            <div className="space-y-3">
              {medicalRecord.previousSurgeries.map((surg) => (
                <div
                  key={surg.id}
                  className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-2xs hover:border-stone-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-stone-100 pb-2.5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold">
                          Operative Record
                        </span>
                        <span className="text-xs font-semibold text-stone-500 flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-stone-400" />
                          {surg.surgeryDate}
                        </span>
                      </div>
                      <h6 className="font-bold text-sm text-stone-900 pt-1">
                        {surg.procedure}
                      </h6>
                    </div>

                    {surg.hospitalDoctor && (
                      <div className="text-right text-xs text-stone-600">
                        <div className="flex items-center sm:justify-end font-semibold text-stone-800">
                          <Building2 className="w-3.5 h-3.5 mr-1 text-stone-400" />
                          {surg.hospitalDoctor}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    {/* Implants */}
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                      <strong className="text-stone-900 block font-bold mb-0.5">
                        Prosthetics / Implants / Hardware:
                      </strong>
                      <span className="text-stone-700">
                        {surg.implantsProsthetics || 'No internal hardware recorded.'}
                      </span>
                    </div>

                    {/* Complications / Healing Notes */}
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                      <strong className="text-stone-900 block font-bold mb-0.5">
                        Post-Op Healing & Scar Integrity:
                      </strong>
                      <span className="text-stone-700">
                        {surg.recoveryComplications || 'Uncomplicated primary recovery.'}
                      </span>
                    </div>
                  </div>

                  {/* PT Rehab Significance */}
                  {surg.ptRehabSignificance && (
                    <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-200 text-xs text-sky-950">
                      <strong className="text-sky-900 font-bold block mb-0.5 flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1 text-sky-700" />
                        Rehabilitation Biomechanical Significance:
                      </strong>
                      <p className="leading-relaxed">
                        {surg.ptRehabSignificance}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD CHRONIC CONDITION                                            */}
      {/* ========================================================================= */}
      {showAddChronicModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="bg-amber-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold text-sm">Add Chronic Medical Condition</h4>
              </div>
              <button
                onClick={() => setShowAddChronicModal(false)}
                className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-amber-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChronic} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Condition / Disease Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Type-2 Diabetes Mellitus / Osteopenia / Hypertension"
                  value={newChronic.condition}
                  onChange={(e) => setNewChronic({ ...newChronic, condition: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Diagnosed Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2018"
                    value={newChronic.diagnosedYear}
                    onChange={(e) => setNewChronic({ ...newChronic, diagnosedYear: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Severity</label>
                  <select
                    value={newChronic.severity}
                    onChange={(e) => setNewChronic({ ...newChronic, severity: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-semibold focus:bg-white"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                    <option value="Controlled">Controlled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Current Medications (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Metformin 500mg BD, Telmisartan 40mg OD"
                  value={medsInput}
                  onChange={(e) => setMedsInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Physiotherapy Clinical Precaution & Exercise Guidance
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Check peripheral blood pressure before resistance sets; check foot sensation."
                  value={newChronic.physioPrecaution}
                  onChange={(e) => setNewChronic({ ...newChronic, physioPrecaution: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddChronicModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold cursor-pointer"
                >
                  Save Condition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD SURGERY RECORD                                               */}
      {/* ========================================================================= */}
      {showAddSurgeryModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="bg-sky-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-sky-300" />
                <h4 className="font-bold text-sm">Add Previous Surgical Record</h4>
              </div>
              <button
                onClick={() => setShowAddSurgeryModal(false)}
                className="p-1 rounded-lg text-sky-200 hover:text-white hover:bg-sky-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSurgery} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Surgical Procedure Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Left Total Knee Arthroplasty (TKR) / L4-L5 Microdiscectomy"
                  value={newSurgery.procedure}
                  onChange={(e) => setNewSurgery({ ...newSurgery, procedure: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Surgery Date *</label>
                  <input
                    type="date"
                    required
                    value={newSurgery.surgeryDate}
                    onChange={(e) => setNewSurgery({ ...newSurgery, surgeryDate: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Hospital & Surgeon</label>
                  <input
                    type="text"
                    placeholder="e.g. Aster CMI / Dr. M. S. Hegde"
                    value={newSurgery.hospitalDoctor}
                    onChange={(e) => setNewSurgery({ ...newSurgery, hospitalDoctor: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Prosthetics / Implants / Hardware
                </label>
                <input
                  type="text"
                  placeholder="e.g. Titanium knee prosthesis, surgical screws, metal mesh"
                  value={newSurgery.implantsProsthetics}
                  onChange={(e) => setNewSurgery({ ...newSurgery, implantsProsthetics: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Physical Therapy Rehab Significance
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Avoid high-impact loads; protect extensor mechanism; target 110° flexion."
                  value={newSurgery.ptRehabSignificance}
                  onChange={(e) => setNewSurgery({ ...newSurgery, ptRehabSignificance: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddSurgeryModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-bold cursor-pointer"
                >
                  Save Surgery Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD ALLERGY / RED-FLAG ALERT                                      */}
      {/* ========================================================================= */}
      {showAddAlertModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="bg-rose-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-300" />
                <h4 className="font-bold text-sm">Add Allergy or Clinical Red-Flag Alert</h4>
              </div>
              <button
                onClick={() => setShowAddAlertModal(false)}
                className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-rose-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAlert} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Alert Category *</label>
                  <select
                    value={newAlert.type}
                    onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-bold focus:bg-white"
                  >
                    <option value="Clinical Red Flag">Clinical Red Flag (Safety)</option>
                    <option value="Contraindication">Contraindication (PT Protocol)</option>
                    <option value="Allergy">Allergy (Medication / Material)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Severity Level *</label>
                  <select
                    value={newAlert.severity}
                    onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 font-bold focus:bg-white"
                  >
                    <option value="Critical">Critical (Immediate Stop / Danger)</option>
                    <option value="High">High (Strict Caution)</option>
                    <option value="Moderate">Moderate (Monitor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Alert Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Vein Thrombosis (DVT) Vigilance / Adhesive Tape Allergy"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Clinical Trigger / Presentation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Unilateral calf swelling >3cm, sudden local heat, tenderness"
                  value={newAlert.clinicalTrigger}
                  onChange={(e) => setNewAlert({ ...newAlert, clinicalTrigger: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Mandatory Action Directive for PT Staff *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. MANDATORY: Stop exercise, measure calf circumference, notify Dr. Hegde."
                  value={newAlert.actionDirective}
                  onChange={(e) => setNewAlert({ ...newAlert, actionDirective: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddAlertModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold cursor-pointer"
                >
                  Save Safety Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
