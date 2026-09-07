import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Phone,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  BellRing,
  Download,
  Plus,
  X,
  FileText,
  Building2,
  Home,
  Check,
  Languages,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import {
  PatientReminderSeries,
  ReminderLogItem,
  ReminderChannel,
  ReminderResponseStatus,
  ServiceLocation
} from '../types';
import {
  INITIAL_PATIENT_SERIES,
  INITIAL_REMINDER_LOGS,
  CLINICAL_REMINDER_TEMPLATES
} from '../data/reminderDefaults';

export const PatientReminderLog: React.FC = () => {
  // --- Persistent State ---
  const [patientSeries, setPatientSeries] = useState<PatientReminderSeries[]>(() => {
    try {
      const saved = localStorage.getItem('sahakar_patient_reminder_series_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load patient reminder series:', e);
    }
    return INITIAL_PATIENT_SERIES;
  });

  const [reminderLogs, setReminderLogs] = useState<ReminderLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('sahakar_reminder_logs_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load reminder logs:', e);
    }
    return INITIAL_REMINDER_LOGS;
  });

  const persistSeries = (updated: PatientReminderSeries[]) => {
    setPatientSeries(updated);
    try {
      localStorage.setItem('sahakar_patient_reminder_series_v1', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save patient series:', e);
    }
  };

  const persistLogs = (updated: ReminderLogItem[]) => {
    setReminderLogs(updated);
    try {
      localStorage.setItem('sahakar_reminder_logs_v1', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save reminder logs:', e);
    }
  };

  // --- Active View & Filters ---
  const [activeTab, setActiveTab] = useState<'at_risk' | 'all_series' | 'logs' | 'templates'>('at_risk');
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<'ALL' | ReminderChannel>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<'ALL' | ServiceLocation>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'kn'>('en');

  // Modal State for Dispatching Reminder
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchPatientId, setDispatchPatientId] = useState<string>(patientSeries[0]?.patientId || '');
  const [dispatchChannel, setDispatchChannel] = useState<ReminderChannel>('WhatsApp');
  const [dispatchTemplateId, setDispatchTemplateId] = useState<string>(CLINICAL_REMINDER_TEMPLATES[0].id);
  const [customDispatchNote, setCustomDispatchNote] = useState<string>('');
  const [dispatchSuccessNotice, setDispatchSuccessNotice] = useState<string | null>(null);

  // Modal State for Logging Caregiver/Patient Call
  const [callModalPatient, setCallModalPatient] = useState<PatientReminderSeries | null>(null);
  const [callNotes, setCallNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState<'Confirmed' | 'Reschedule Requested' | 'No Answer'>('Confirmed');

  // --- Derived Statistics ---
  const atRiskPatients = useMemo(() => {
    return patientSeries.filter(p => p.hasUnconfirmedNext3);
  }, [patientSeries]);

  const totalUpcomingSlots = useMemo(() => {
    return patientSeries.reduce((acc, p) => acc + p.upcomingSessions.length, 0);
  }, [patientSeries]);

  const confirmedUpcomingSlots = useMemo(() => {
    return patientSeries.reduce(
      (acc, p) => acc + p.upcomingSessions.filter(s => s.confirmed).length,
      0
    );
  }, [patientSeries]);

  const confirmationRate = useMemo(() => {
    if (totalUpcomingSlots === 0) return 0;
    return Math.round((confirmedUpcomingSlots / totalUpcomingSlots) * 100);
  }, [confirmedUpcomingSlots, totalUpcomingSlots]);

  const totalRemindersToday = useMemo(() => {
    return reminderLogs.filter(l => l.sentAt.startsWith('2026-09-07')).length;
  }, [reminderLogs]);

  const whatsAppDeliveries = useMemo(() => {
    const wa = reminderLogs.filter(l => l.channel === 'WhatsApp');
    const read = wa.filter(l => l.deliveryStatus === 'Read' || l.responseStatus === 'Confirmed');
    return {
      total: wa.length,
      readOrConfirmed: read.length,
      rate: wa.length > 0 ? Math.round((read.length / wa.length) * 100) : 0
    };
  }, [reminderLogs]);

  // --- Filtered Patients ---
  const filteredPatients = useMemo(() => {
    return patientSeries.filter(p => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.patientName.toLowerCase().includes(query);
        const matchesPhone = p.phone.toLowerCase().includes(query);
        const matchesDiag = p.diagnosis.toLowerCase().includes(query);
        const matchesTherapist = p.therapistName.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesDiag && !matchesTherapist) return false;
      }
      // Location
      if (locationFilter !== 'ALL' && p.careType !== locationFilter) return false;

      // Status
      if (statusFilter === '3_UNCONFIRMED' && !p.hasUnconfirmedNext3) return false;
      if (statusFilter === 'FULLY_CONFIRMED' && p.unconfirmedCount > 0) return false;
      if (statusFilter === 'PARTIAL' && (p.hasUnconfirmedNext3 || p.unconfirmedCount === 0)) return false;

      return true;
    });
  }, [patientSeries, searchQuery, locationFilter, statusFilter]);

  // --- Filtered Logs ---
  const filteredLogs = useMemo(() => {
    return reminderLogs.filter(log => {
      // Channel
      if (channelFilter !== 'ALL' && log.channel !== channelFilter) return false;
      // Location
      if (locationFilter !== 'ALL' && log.careType !== locationFilter) return false;
      // Status
      if (statusFilter !== 'ALL') {
        if (statusFilter === '3_UNCONFIRMED' && !log.isThreeSessionConfirmationPrompt) return false;
        if (statusFilter === 'CONFIRMED' && log.responseStatus !== 'Confirmed') return false;
        if (statusFilter === 'ACTION_REQUIRED' && log.responseStatus !== 'Follow-up Needed') return false;
        if (statusFilter === 'PENDING' && log.responseStatus !== 'Pending Reply') return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesPatient = log.patientName.toLowerCase().includes(query);
        const matchesPhone = log.phone.toLowerCase().includes(query);
        const matchesMsg = log.messageBody.toLowerCase().includes(query);
        const matchesTherapist = log.therapistName.toLowerCase().includes(query);
        if (!matchesPatient && !matchesPhone && !matchesMsg && !matchesTherapist) return false;
      }
      return true;
    });
  }, [reminderLogs, channelFilter, locationFilter, statusFilter, searchQuery]);

  // --- Action: Mark All 3 Confirmed for a Patient ---
  const handleMarkAll3Confirmed = (patientId: string) => {
    const target = patientSeries.find(p => p.patientId === patientId);
    if (!target) return;

    const updatedSeries = patientSeries.map(p => {
      if (p.patientId === patientId) {
        const updatedUpcoming = p.upcomingSessions.map(s => ({
          ...s,
          confirmed: true,
          confirmationStatus: 'Confirmed' as const
        }));
        return {
          ...p,
          upcomingSessions: updatedUpcoming,
          unconfirmedCount: 0,
          hasUnconfirmedNext3: false,
          riskSeverity: 'Low' as const,
          notes: `${p.notes || ''} [All 3 upcoming sessions confirmed manually on 2026-09-07]`.trim()
        };
      }
      return p;
    });

    // Add confirmation record to reminder logs
    const newLogItem: ReminderLogItem = {
      id: `log-${Date.now()}`,
      patientId: target.patientId,
      patientName: target.patientName,
      phone: target.phone,
      careType: target.careType,
      channel: 'WhatsApp',
      templateCategory: 'Three_Session_Confirmation',
      templateName: 'Direct Confirmation Verification',
      messageBody: `Patient / Attendant directly confirmed next 3 sessions with ${target.therapistName}: ${target.upcomingSessions.map(s => `${s.date} ${s.time}`).join(', ')}.`,
      sentAt: '2026-09-07 09:30',
      deliveryStatus: 'Read',
      responseStatus: 'Confirmed',
      sessionDatesMentioned: target.upcomingSessions.map(s => s.date),
      therapistName: target.therapistName,
      isThreeSessionConfirmationPrompt: true,
      patientReplyText: 'Confirmed all 3 slots with clinic staff.',
      actionTaken: 'All 3 upcoming slots marked Confirmed in clinic schedule & therapist route sheet.'
    };

    persistSeries(updatedSeries);
    persistLogs([newLogItem, ...reminderLogs]);
    setDispatchSuccessNotice(`Marked all 3 sessions confirmed for ${target.patientName}. Recovery continuity preserved!`);
    setTimeout(() => setDispatchSuccessNotice(null), 5000);
  };

  // --- Action: Quick Send 3-Session Bulk WhatsApp Prompt ---
  const handleSend3SessionWhatsApp = (patient: PatientReminderSeries) => {
    const dates = patient.upcomingSessions.map((s, idx) => `${idx + 1}️⃣ ${s.date} at ${s.time} (${s.stationOrArea})`).join('\n');
    const waText = `Namaskara ${patient.patientName}! 🙏 Sahakar Physio & Elder Care reminder:
To maintain your recovery continuity with ${patient.therapistName}, please confirm your next 3 scheduled rehab sessions:
${dates}

👉 Reply YES to confirm all 3 sessions or tap to adjust.
📞 Helpdesk: +91 98450 21980`;

    const cleanedPhone = patient.phone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(waText)}`;

    // Open WhatsApp Web in new tab
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }

    // Add automated log entry
    const newLog: ReminderLogItem = {
      id: `log-${Date.now()}`,
      patientId: patient.patientId,
      patientName: patient.patientName,
      phone: patient.phone,
      careType: patient.careType,
      channel: 'WhatsApp',
      templateCategory: 'Three_Session_Confirmation',
      templateName: '3-Session Rehab Continuity WhatsApp Prompt (Interactive)',
      messageBody: waText,
      sentAt: '2026-09-07 09:35',
      deliveryStatus: 'Sent',
      responseStatus: 'Pending Reply',
      sessionDatesMentioned: patient.upcomingSessions.map(s => s.date),
      therapistName: patient.therapistName,
      isThreeSessionConfirmationPrompt: true,
      actionTaken: 'Dispatched 3-session commitment prompt via WhatsApp Web. Link generated.'
    };

    // Update patient series last reminder
    const updatedSeries = patientSeries.map(p => {
      if (p.patientId === patient.patientId) {
        return {
          ...p,
          lastReminderSentAt: '2026-09-07 09:35',
          lastReminderChannel: 'WhatsApp' as const,
          lastReminderStatus: 'Sent' as const
        };
      }
      return p;
    });

    persistSeries(updatedSeries);
    persistLogs([newLog, ...reminderLogs]);
    setDispatchSuccessNotice(`Dispatched 3-Session WhatsApp prompt for ${patient.patientName}.`);
    setTimeout(() => setDispatchSuccessNotice(null), 5000);
  };

  // --- Action: Quick Send SMS Reminder ---
  const handleSendSMS = (patient: PatientReminderSeries) => {
    const dates = patient.upcomingSessions.map(s => s.date).join(', ');
    const smsText = `Sahakar Physio Alert: ${patient.patientName}, please confirm your next 3 sessions with ${patient.therapistName} on ${dates}. Reply YES to confirm or call 9845021980. Prevent relapse.`;

    const newLog: ReminderLogItem = {
      id: `log-${Date.now()}`,
      patientId: patient.patientId,
      patientName: patient.patientName,
      phone: patient.phone,
      careType: patient.careType,
      channel: 'SMS',
      templateCategory: 'Three_Session_Confirmation',
      templateName: '3-Session Commitment SMS (DLT Approved)',
      messageBody: smsText,
      sentAt: '2026-09-07 09:36',
      deliveryStatus: 'Sent',
      responseStatus: 'Pending Reply',
      sessionDatesMentioned: patient.upcomingSessions.map(s => s.date),
      therapistName: patient.therapistName,
      isThreeSessionConfirmationPrompt: true,
      actionTaken: 'Dispatched through Indian Airtel DLT SMS gateway (DLT-SAHAKAR-CONF-11029).'
    };

    const updatedSeries = patientSeries.map(p => {
      if (p.patientId === patient.patientId) {
        return {
          ...p,
          lastReminderSentAt: '2026-09-07 09:36',
          lastReminderChannel: 'SMS' as const,
          lastReminderStatus: 'Sent' as const
        };
      }
      return p;
    });

    persistSeries(updatedSeries);
    persistLogs([newLog, ...reminderLogs]);
    setDispatchSuccessNotice(`Sent DLT-compliant SMS alert to ${patient.patientName} (${patient.phone}).`);
    setTimeout(() => setDispatchSuccessNotice(null), 5000);
  };

  // --- Action: Handle Call Logging Modal Submit ---
  const handleSubmitCallLog = () => {
    if (!callModalPatient) return;

    const updatedSeries = patientSeries.map(p => {
      if (p.patientId === callModalPatient.patientId) {
        if (callOutcome === 'Confirmed') {
          return {
            ...p,
            upcomingSessions: p.upcomingSessions.map(s => ({
              ...s,
              confirmed: true,
              confirmationStatus: 'Confirmed' as const
            })),
            unconfirmedCount: 0,
            hasUnconfirmedNext3: false,
            riskSeverity: 'Low' as const,
            notes: `${p.notes || ''} [Phone Call: Confirmed by ${callModalPatient.familyCaregiverName || 'patient'}. ${callNotes}]`.trim()
          };
        } else if (callOutcome === 'Reschedule Requested') {
          return {
            ...p,
            notes: `${p.notes || ''} [Phone Call: Reschedule requested. ${callNotes}]`.trim()
          };
        } else {
          return {
            ...p,
            notes: `${p.notes || ''} [Phone Call: No answer. ${callNotes}]`.trim()
          };
        }
      }
      return p;
    });

    const newLog: ReminderLogItem = {
      id: `log-${Date.now()}`,
      patientId: callModalPatient.patientId,
      patientName: callModalPatient.patientName,
      phone: callModalPatient.phone,
      careType: callModalPatient.careType,
      channel: 'SMS',
      templateCategory: 'Three_Session_Confirmation',
      templateName: 'Telephone Attendant Call Verification',
      messageBody: `Front desk voice call with ${callModalPatient.familyCaregiverName ? `${callModalPatient.familyCaregiverName} (Caregiver)` : callModalPatient.patientName}. Outcome: ${callOutcome}. Notes: ${callNotes}`,
      sentAt: '2026-09-07 09:40',
      deliveryStatus: 'Delivered',
      responseStatus: callOutcome === 'Confirmed' ? 'Confirmed' : callOutcome === 'Reschedule Requested' ? 'Reschedule Requested' : 'Follow-up Needed',
      therapistName: callModalPatient.therapistName,
      isThreeSessionConfirmationPrompt: true,
      actionTaken: callOutcome === 'Confirmed' ? 'All 3 sessions marked confirmed via phone call.' : 'Follow-up logged in reception CRM.'
    };

    persistSeries(updatedSeries);
    persistLogs([newLog, ...reminderLogs]);
    setCallModalPatient(null);
    setCallNotes('');
    setDispatchSuccessNotice(`Logged telephone follow-up for ${callModalPatient.patientName}. Outcome: ${callOutcome}`);
    setTimeout(() => setDispatchSuccessNotice(null), 5000);
  };

  // --- Action: Dispatch from Manual Modal ---
  const handleDispatchManualModal = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patientSeries.find(p => p.patientId === dispatchPatientId);
    const template = CLINICAL_REMINDER_TEMPLATES.find(t => t.id === dispatchTemplateId);
    if (!patient || !template) return;

    let body = selectedLanguage === 'kn' && template.kannadaTemplate ? template.kannadaTemplate : template.englishTemplate;
    body = body
      .replace(/{{patientName}}/g, patient.patientName)
      .replace(/{{therapistName}}/g, patient.therapistName)
      .replace(/{{date1}}/g, patient.upcomingSessions[0]?.date || 'Tomorrow')
      .replace(/{{time1}}/g, patient.upcomingSessions[0]?.time || '10:00 AM')
      .replace(/{{location1}}/g, patient.upcomingSessions[0]?.stationOrArea || 'Sahakarnagar')
      .replace(/{{date2}}/g, patient.upcomingSessions[1]?.date || 'Day After')
      .replace(/{{time2}}/g, patient.upcomingSessions[1]?.time || '10:00 AM')
      .replace(/{{location2}}/g, patient.upcomingSessions[1]?.stationOrArea || 'Sahakarnagar')
      .replace(/{{date3}}/g, patient.upcomingSessions[2]?.date || 'Follow-up')
      .replace(/{{time3}}/g, patient.upcomingSessions[2]?.time || '10:00 AM')
      .replace(/{{location3}}/g, patient.upcomingSessions[2]?.stationOrArea || 'Sahakarnagar');

    if (customDispatchNote.trim()) {
      body += `\n\n📌 Special Clinical Note: ${customDispatchNote.trim()}`;
    }

    const newLog: ReminderLogItem = {
      id: `log-${Date.now()}`,
      patientId: patient.patientId,
      patientName: patient.patientName,
      phone: patient.phone,
      careType: patient.careType,
      channel: dispatchChannel,
      templateCategory: template.category,
      templateName: template.name,
      messageBody: body,
      sentAt: '2026-09-07 09:42',
      deliveryStatus: 'Sent',
      responseStatus: 'Pending Reply',
      sessionDatesMentioned: patient.upcomingSessions.map(s => s.date),
      therapistName: patient.therapistName,
      isThreeSessionConfirmationPrompt: template.category === 'Three_Session_Confirmation',
      actionTaken: `Manual reminder dispatched via ${dispatchChannel} (${selectedLanguage.toUpperCase()})`
    };

    persistLogs([newLog, ...reminderLogs]);
    setIsDispatchModalOpen(false);
    setCustomDispatchNote('');
    setDispatchSuccessNotice(`Dispatched ${dispatchChannel} reminder to ${patient.patientName}!`);
    setTimeout(() => setDispatchSuccessNotice(null), 5000);
  };

  // --- Export Logs to CSV ---
  const handleExportCSV = () => {
    const headers = ['Log ID', 'Sent At', 'Channel', 'Patient Name', 'Phone', 'Care Type', 'Therapist', '3-Session Prompt?', 'Delivery Status', 'Response Status', 'Message Content'];
    const rows = reminderLogs.map(l => [
      l.id,
      l.sentAt,
      l.channel,
      `"${l.patientName}"`,
      l.phone,
      l.careType,
      `"${l.therapistName}"`,
      l.isThreeSessionConfirmationPrompt ? 'YES' : 'NO',
      l.deliveryStatus,
      l.responseStatus,
      `"${l.messageBody.replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sahakar_patient_reminder_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Batch Outreach to All Unconfirmed ---
  const handleBatchOutreach = () => {
    if (atRiskPatients.length === 0) return;
    atRiskPatients.forEach(p => handleSend3SessionWhatsApp(p));
    setDispatchSuccessNotice(`Triggered bulk 3-session outreach for all ${atRiskPatients.length} at-risk patients!`);
    setTimeout(() => setDispatchSuccessNotice(null), 6000);
  };

  return (
    <div className="space-y-6 pb-12" id="patient-reminder-log-module">
      {/* Toast Notification Banner */}
      {dispatchSuccessNotice && (
        <div className="bg-teal-900/90 dark:bg-teal-950 border border-teal-500 text-teal-100 px-4 py-3 rounded-xl shadow-lg flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-teal-300 shrink-0" />
            <span className="text-sm font-medium">{dispatchSuccessNotice}</span>
          </div>
          <button
            onClick={() => setDispatchSuccessNotice(null)}
            className="text-teal-300 hover:text-white text-sm font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Context */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0 shadow-xs">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                  Patient Reminder & Follow-Up Log
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  <Smartphone className="w-3 h-3 mr-1 text-emerald-600" />
                  SMS & WhatsApp Automation
                </span>
                {atRiskPatients.length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800 animate-pulse">
                    <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                    {atRiskPatients.length} High-Risk Drop-off Patients
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-3xl">
                Monitors multi-channel outreach for scheduled rehabilitation slots. Specifically flags patients who have{' '}
                <strong className="text-amber-700 dark:text-amber-400 font-semibold">not confirmed their next 3 sessions</strong> to protect recovery momentum, reduce clinic vacancy, and optimize mobile home-care travel routes in Sahakarnagar.
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleBatchOutreach}
              id="btn-batch-outreach"
              disabled={atRiskPatients.length === 0}
              title="Dispatches WhatsApp reminders to all patients with 3 unconfirmed sessions"
              className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                atRiskPatients.length > 0
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Nudge All {atRiskPatients.length} Unconfirmed
            </button>

            <button
              onClick={() => setIsDispatchModalOpen(true)}
              id="btn-manual-dispatch"
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Dispatch Reminder
            </button>

            <button
              onClick={handleExportCSV}
              id="btn-export-reminders"
              className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-medium bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
              Export CSV
            </button>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
          {/* Card 1: 3+ Unconfirmed Sessions (THE CRUCIAL HIGHLIGHT) */}
          <div
            onClick={() => {
              setActiveTab('at_risk');
              setStatusFilter('3_UNCONFIRMED');
            }}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              atRiskPatients.length > 0
                ? 'bg-amber-500/10 border-amber-300 dark:border-amber-800 hover:border-amber-400'
                : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                Next 3 Unconfirmed
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">
                Protocol Risk
              </span>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-amber-900 dark:text-amber-200">{atRiskPatients.length}</span>
              <span className="text-xs text-stone-500 dark:text-stone-400">Patients at drop-off risk</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
              {atRiskPatients.length > 0
                ? 'Action required: 3 consecutive unconfirmed sessions risk therapy lapse'
                : 'All patients have active upcoming session confirmations'}
            </p>
          </div>

          {/* Card 2: Upcoming Confirmation Rate */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
                Confirmation Rate
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                {confirmedUpcomingSlots}/{totalUpcomingSlots} Slots
              </span>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-teal-800 dark:text-teal-300">{confirmationRate}%</span>
              <span className="text-xs text-stone-500 dark:text-stone-400">Next 3 sessions confirmed</span>
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-teal-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${confirmationRate}%` }}
              />
            </div>
          </div>

          {/* Card 3: WhatsApp Engagement */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center">
                <MessageSquare className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                WhatsApp Read Rate
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Meta Business API
              </span>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                {whatsAppDeliveries.rate}%
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                ({whatsAppDeliveries.readOrConfirmed}/{whatsAppDeliveries.total} read/replied)
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
              Interactive buttons drive 4.2x faster confirmation than standard phone calls
            </p>
          </div>

          {/* Card 4: Dispatched Follow-ups Today */}
          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-teal-600" />
                Dispatched Today
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                Mon, 07 Sep
              </span>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-stone-900 dark:text-stone-100">{totalRemindersToday}</span>
              <span className="text-xs text-stone-500 dark:text-stone-400">Automated dispatches</span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
              Covers 24h pre-session alerts, 2h transit tracking, and 3-session commitment prompts
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 dark:border-stone-800 pb-3 gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {/* Tab 1: At-Risk Patients (Crucial Feature) */}
          <button
            onClick={() => {
              setActiveTab('at_risk');
              setStatusFilter('3_UNCONFIRMED');
            }}
            id="tab-at-risk"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'at_risk'
                ? 'bg-amber-500/20 text-amber-900 dark:text-amber-100 border border-amber-400/50 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Patients with 3 Unconfirmed Sessions</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-600 text-white">
              {atRiskPatients.length}
            </span>
          </button>

          {/* Tab 2: All Patients Series */}
          <button
            onClick={() => {
              setActiveTab('all_series');
              setStatusFilter('ALL');
            }}
            id="tab-all-series"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'all_series'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>All Patients 3-Session Tracker</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
              {patientSeries.length}
            </span>
          </button>

          {/* Tab 3: Detailed Follow-up Logs */}
          <button
            onClick={() => {
              setActiveTab('logs');
              setStatusFilter('ALL');
            }}
            id="tab-logs"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>SMS & WhatsApp Logs</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
              {reminderLogs.length}
            </span>
          </button>

          {/* Tab 4: Template Library */}
          <button
            onClick={() => setActiveTab('templates')}
            id="tab-templates"
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>DLT & Message Templates</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="reminder-search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search patient, phone, diagnosis..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-teal-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Care Location Filter */}
          <div className="flex items-center space-x-1 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setLocationFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                locationFilter === 'ALL'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              All Locations
            </button>
            <button
              onClick={() => setLocationFilter('Clinic')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center space-x-1 cursor-pointer ${
                locationFilter === 'Clinic'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-3 h-3 text-teal-600" />
              <span>In-Clinic</span>
            </button>
            <button
              onClick={() => setLocationFilter('Home')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center space-x-1 cursor-pointer ${
                locationFilter === 'Home'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Home className="w-3 h-3 text-emerald-600" />
              <span>Elder Home-Care</span>
            </button>
          </div>

          {/* Channel Filter for Logs */}
          {activeTab === 'logs' && (
            <div className="flex items-center space-x-1 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
              <button
                onClick={() => setChannelFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  channelFilter === 'ALL'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                All Channels
              </button>
              <button
                onClick={() => setChannelFilter('WhatsApp')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center space-x-1 cursor-pointer ${
                  channelFilter === 'WhatsApp'
                    ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                <MessageSquare className="w-3 h-3 text-emerald-600" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => setChannelFilter('SMS')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center space-x-1 cursor-pointer ${
                  channelFilter === 'SMS'
                    ? 'bg-white dark:bg-stone-700 text-blue-700 dark:text-blue-300 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                <Smartphone className="w-3 h-3 text-blue-600" />
                <span>SMS</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="text-stone-500 dark:text-stone-400 font-medium">
          Showing{' '}
          <strong className="text-stone-800 dark:text-stone-200">
            {activeTab === 'logs' ? filteredLogs.length : filteredPatients.length}
          </strong>{' '}
          {activeTab === 'logs' ? 'reminder records' : 'patient care series'}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: AT-RISK PATIENTS (3+ UNCONFIRMED SESSIONS) - PRIMARY EMPHASIS */}
      {/* ========================================================================= */}
      {(activeTab === 'at_risk' || (activeTab === 'all_series' && statusFilter === '3_UNCONFIRMED')) && (
        <div className="space-y-4">
          {/* Urgent Clinical Alert Callout */}
          <div className="bg-amber-500/10 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-bold text-amber-950 dark:text-amber-100">
                    High Drop-Off Risk Alert: Patients with 3 Unconfirmed Upcoming Sessions
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200">
                    {atRiskPatients.length} Patients Require Immediate Follow-Up
                  </span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                  In musculoskeletal and geriatric rehabilitation, missing consecutive appointments is the #1 predictor of patient drop-out, loss of joint mobility gains, and unfilled clinic time slots. Use the interactive WhatsApp or phone tools below to secure their commitments or free up therapist time blocks.
                </p>
              </div>
            </div>
          </div>

          {/* Cards for each At-Risk Patient */}
          {atRiskPatients.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8">
              <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Zero High-Risk Patients!
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
                All scheduled patients have confirmed their upcoming therapy sessions. Continue monitoring 24h pre-session check-ins.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {atRiskPatients.map(patient => (
                <div
                  key={patient.patientId}
                  id={`patient-risk-card-${patient.patientId}`}
                  className="bg-white dark:bg-stone-900 border-2 border-amber-300/80 dark:border-amber-800/80 rounded-2xl p-5 shadow-xs hover:border-amber-400 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Patient Overview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-stone-900 dark:text-stone-100">
                          {patient.patientName}
                        </span>
                        <span className="text-xs text-stone-500">
                          ({patient.age}y, {patient.gender})
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            patient.careType === 'Home'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                          }`}
                        >
                          {patient.careType === 'Home' ? (
                            <>
                              <Home className="w-3 h-3 mr-1" /> Elder Home-Care
                            </>
                          ) : (
                            <>
                              <Building2 className="w-3 h-3 mr-1" /> In-Clinic Sahakarnagar
                            </>
                          )}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                          <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                          3 Unconfirmed Sessions
                        </span>
                      </div>

                      {/* Clinical Diagnosis & Assigned Therapist */}
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-medium">
                        <strong className="text-stone-800 dark:text-stone-200">Diagnosis:</strong> {patient.diagnosis}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400 mt-1.5">
                        <span>
                          <strong>Primary PT:</strong> {patient.therapistName}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Package Progress:</strong> Session {patient.sessionsCompleted} of {patient.packageType}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Phone:</strong> {patient.phone}
                        </span>
                        {patient.familyCaregiverName && (
                          <>
                            <span>•</span>
                            <span className="text-amber-800 dark:text-amber-300 font-semibold">
                              Attendant: {patient.familyCaregiverName} ({patient.familyCaregiverPhone})
                            </span>
                          </>
                        )}
                      </div>

                      {/* Clinical Note Context */}
                      {patient.notes && (
                        <div className="mt-2 text-xs bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700/80 text-stone-600 dark:text-stone-300">
                          <span className="font-bold text-stone-700 dark:text-stone-200">Clinical Triage Note:</span>{' '}
                          {patient.notes}
                        </div>
                      )}
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 lg:w-56">
                      <button
                        onClick={() => handleSend3SessionWhatsApp(patient)}
                        id={`btn-wa-${patient.patientId}`}
                        title="Send 3-session commitment prompt via WhatsApp Web"
                        className="flex-1 lg:flex-none inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        Send 3-Session WhatsApp
                        <ArrowUpRight className="w-3 h-3 ml-1 opacity-70" />
                      </button>

                      <button
                        onClick={() => handleSendSMS(patient)}
                        id={`btn-sms-${patient.patientId}`}
                        title="Send DLT-compliant SMS commitment reminder"
                        className="flex-1 lg:flex-none inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
                      >
                        <Smartphone className="w-3.5 h-3.5 mr-1.5" />
                        Send SMS Alert
                      </button>

                      <button
                        onClick={() => {
                          setCallModalPatient(patient);
                          setCallNotes('');
                        }}
                        id={`btn-call-${patient.patientId}`}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 transition-colors cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
                        Log Call Outcome
                      </button>

                      <button
                        onClick={() => handleMarkAll3Confirmed(patient.patientId)}
                        id={`btn-confirm-all-${patient.patientId}`}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-200 border border-teal-300 dark:border-teal-700 transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 mr-1 text-teal-600" />
                        Mark All 3 Confirmed
                      </button>
                    </div>
                  </div>

                  {/* Visual Timeline of the Next 3 Unconfirmed Sessions */}
                  <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-teal-600" />
                        Scheduled Next 3 Sessions Breakdown:
                      </span>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">
                        Last reminder sent: <strong className="text-stone-700 dark:text-stone-300">{patient.lastReminderSentAt}</strong> via {patient.lastReminderChannel} ({patient.lastReminderStatus})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {patient.upcomingSessions.map((slot, idx) => (
                        <div
                          key={slot.sessionId}
                          className={`p-3 rounded-xl border flex flex-col justify-between ${
                            slot.confirmed
                              ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800'
                              : 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-300/80 dark:border-amber-800/80'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                                Session #{slot.sessionNumber} ({idx + 1} of 3)
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                  slot.confirmed
                                    ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                                    : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300'
                                }`}
                              >
                                {slot.confirmed ? 'Confirmed' : 'Unconfirmed'}
                              </span>
                            </div>
                            <div className="text-xs font-black text-stone-900 dark:text-stone-100 mt-1">
                              {slot.date} • {slot.time}
                            </div>
                            <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                              {slot.stationOrArea}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: ALL PATIENTS 3-SESSION TRACKER (FULL COHORT OVERVIEW) */}
      {/* ========================================================================= */}
      {activeTab === 'all_series' && statusFilter !== '3_UNCONFIRMED' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Active Rehab Cohort: Next 3 Sessions Confirmation Status
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Real-time confirmation status for all active package subscribers across Clinic & Home-Care
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setStatusFilter(statusFilter === '3_UNCONFIRMED' ? 'ALL' : '3_UNCONFIRMED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === '3_UNCONFIRMED'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  Filter 3 Unconfirmed ({atRiskPatients.length})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold">
                    <th className="py-3 px-4">Patient Name & Phone</th>
                    <th className="py-3 px-4">Care Type</th>
                    <th className="py-3 px-4">Primary Therapist</th>
                    <th className="py-3 px-4">Package Progress</th>
                    <th className="py-3 px-4">Next 3 Sessions Status</th>
                    <th className="py-3 px-4">Last Outreach</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {filteredPatients.map(p => (
                    <tr
                      key={p.patientId}
                      className={`hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors ${
                        p.hasUnconfirmedNext3 ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900 dark:text-stone-100">{p.patientName}</div>
                        <div className="text-[11px] text-stone-500">{p.phone}</div>
                        <div className="text-[10px] text-stone-400 truncate max-w-xs">{p.diagnosis}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.careType === 'Home'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                          }`}
                        >
                          {p.careType}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-stone-700 dark:text-stone-300 font-medium">
                        {p.therapistName}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-800 dark:text-stone-200">
                          {p.sessionsCompleted} / {p.packageType} done
                        </div>
                        <div className="w-20 bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full mt-1">
                          <div
                            className="bg-teal-600 h-1.5 rounded-full"
                            style={{ width: `${Math.round((p.sessionsCompleted / p.packageType) * 100)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          {p.upcomingSessions.map((s, idx) => (
                            <span
                              key={s.sessionId}
                              title={`${s.date} ${s.time} - ${s.confirmationStatus}`}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                s.confirmed
                                  ? 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300'
                              }`}
                            >
                              S{idx + 1}: {s.confirmed ? '✓' : '✗'}
                            </span>
                          ))}
                        </div>
                        <div className="mt-1">
                          {p.hasUnconfirmedNext3 ? (
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                              ⚠️ 0 of 3 Confirmed
                            </span>
                          ) : p.unconfirmedCount === 0 ? (
                            <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-300">
                              All 3 Confirmed
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-stone-500">
                              {3 - p.unconfirmedCount} of 3 Confirmed
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-[11px] text-stone-700 dark:text-stone-300">
                          {p.lastReminderSentAt || 'None'}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {p.lastReminderChannel} • {p.lastReminderStatus}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleSend3SessionWhatsApp(p)}
                            title="Send WhatsApp Follow-up"
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleSendSMS(p)}
                            title="Send SMS"
                            className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                          </button>
                          {p.hasUnconfirmedNext3 && (
                            <button
                              onClick={() => handleMarkAll3Confirmed(p.patientId)}
                              title="Mark Confirmed"
                              className="px-2 py-1 rounded-lg bg-teal-700 text-white font-bold text-[11px] hover:bg-teal-800 transition-colors cursor-pointer"
                            >
                              Confirm
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: SMS & WHATSAPP DETAILED REMINDER STREAM LOGS */}
      {/* ========================================================================= */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-teal-600" />
                  Real-time Automated Follow-Up Logs
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Chronological trail of outgoing SMS gateway alerts and WhatsApp interactive message events
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setStatusFilter(statusFilter === '3_UNCONFIRMED' ? 'ALL' : '3_UNCONFIRMED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === '3_UNCONFIRMED'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  3-Session Prompts Only
                </button>
              </div>
            </div>

            <div className="divide-y divide-stone-200 dark:divide-stone-800">
              {filteredLogs.map(log => (
                <div
                  key={log.id}
                  id={`reminder-log-item-${log.id}`}
                  className="p-4 sm:p-5 hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      {/* Channel Icon Badge */}
                      <div
                        className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                          log.channel === 'WhatsApp'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {log.channel === 'WhatsApp' ? (
                          <MessageSquare className="w-4 h-4" />
                        ) : (
                          <Smartphone className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                            {log.patientName}
                          </span>
                          <span className="text-xs text-stone-500 font-mono">{log.phone}</span>

                          {/* Channel Badge */}
                          <span
                            className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                              log.channel === 'WhatsApp'
                                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
                                : 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200'
                            }`}
                          >
                            {log.channel}
                          </span>

                          {/* 3-Session Confirmation Highlight Badge */}
                          {log.isThreeSessionConfirmationPrompt && (
                            <span className="px-2 py-0.2 rounded text-[10px] font-black bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300">
                              3-Session Commitment Prompt
                            </span>
                          )}

                          {/* Response Status Badge */}
                          <span
                            className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                              log.responseStatus === 'Confirmed'
                                ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                                : log.responseStatus === 'Follow-up Needed'
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                                : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                            }`}
                          >
                            Status: {log.responseStatus}
                          </span>
                        </div>

                        {/* Template and Subtitle */}
                        <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex flex-wrap items-center gap-2">
                          <span>
                            <strong>Template:</strong> {log.templateName}
                          </span>
                          <span>•</span>
                          <span>
                            <strong>Therapist:</strong> {log.therapistName}
                          </span>
                          <span>•</span>
                          <span>
                            <strong>Sent:</strong> {log.sentAt}
                          </span>
                          {log.readAt && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-600 font-semibold">
                                Read: {log.readAt} (Double Blue Tick ✓✓)
                              </span>
                            </>
                          )}
                        </div>

                        {/* Full Message Body */}
                        <div className="mt-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 whitespace-pre-line font-sans leading-relaxed">
                          {log.messageBody}
                        </div>

                        {/* Patient Reply or Staff Action */}
                        {log.patientReplyText && (
                          <div className="mt-2 p-2.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200">
                            <strong className="font-bold flex items-center mb-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-teal-600" />
                              Patient Reply Received:
                            </strong>
                            "{log.patientReplyText}"
                          </div>
                        )}

                        {log.actionTaken && (
                          <div className="mt-1.5 text-[11px] text-stone-500 dark:text-stone-400 flex items-center">
                            <Info className="w-3 h-3 mr-1 text-stone-400" />
                            <span>
                              <strong>Action Taken:</strong> {log.actionTaken}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right-hand side Quick Resend or Call */}
                    <div className="flex sm:flex-col items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          const patient = patientSeries.find(p => p.patientId === log.patientId);
                          if (patient) handleSend3SessionWhatsApp(patient);
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors flex items-center cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 mr-1 text-stone-500" />
                        Re-send
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: TEMPLATE LIBRARY & DLT COMPLIANCE */}
      {/* ========================================================================= */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-2 text-teal-600" />
                  Pre-Approved Clinical Messaging Templates & DLT Registration
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Compliant with TRAI DLT regulations in Bangalore and Meta WhatsApp Business Cloud API standards
                </p>
              </div>

              {/* Language Toggle */}
              <div className="flex items-center space-x-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
                <button
                  onClick={() => setSelectedLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedLanguage === 'en'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setSelectedLanguage('kn')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedLanguage === 'kn'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  ಕನ್ನಡ (Kannada)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {CLINICAL_REMINDER_TEMPLATES.map(tpl => (
                <div
                  key={tpl.id}
                  className="p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {tpl.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          tpl.channel === 'WhatsApp'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {tpl.channel} • {tpl.dltId}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                      {tpl.description}
                    </p>

                    <div className="mt-3 p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700/80 text-xs font-mono text-stone-800 dark:text-stone-200 whitespace-pre-line leading-relaxed">
                      {selectedLanguage === 'kn' && tpl.kannadaTemplate
                        ? tpl.kannadaTemplate
                        : tpl.englishTemplate}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-[11px] text-stone-400">
                    <span>{'Variables: {{patientName}}, {{therapistName}}, {{date1}}, {{time1}}'}</span>
                    <button
                      onClick={() => {
                        setDispatchTemplateId(tpl.id);
                        setDispatchChannel(tpl.channel);
                        setIsDispatchModalOpen(true);
                      }}
                      className="text-teal-700 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                    >
                      Use Template →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: DISPATCH MANUAL REMINDER */}
      {/* ========================================================================= */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full p-6 border border-stone-200 dark:border-stone-800 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Dispatch Patient Reminder
                </h3>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchManualModal} className="space-y-4 mt-4 text-xs">
              {/* Patient Selection */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Select Patient
                </label>
                <select
                  value={dispatchPatientId}
                  onChange={e => setDispatchPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  {patientSeries.map(p => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.patientName} ({p.careType === 'Home' ? 'Elder Home-Care' : 'Clinic'}) — {p.unconfirmedCount} unconfirmed
                    </option>
                  ))}
                </select>
              </div>

              {/* Channel Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Channel
                  </label>
                  <select
                    value={dispatchChannel}
                    onChange={e => setDispatchChannel(e.target.value as ReminderChannel)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="WhatsApp">WhatsApp (Interactive Buttons)</option>
                    <option value="SMS">SMS (Airtel DLT Gateway)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={e => setSelectedLanguage(e.target.value as 'en' | 'kn')}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="en">English</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  </select>
                </div>
              </div>

              {/* Template Selection */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Message Template
                </label>
                <select
                  value={dispatchTemplateId}
                  onChange={e => setDispatchTemplateId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  {CLINICAL_REMINDER_TEMPLATES.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.dltId})
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Clinical Addendum */}
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Optional Custom Clinical Note / Precaution
                </label>
                <textarea
                  value={customDispatchNote}
                  onChange={e => setCustomDispatchNote(e.target.value)}
                  placeholder="e.g. Please bring recent X-Ray films; ground-floor parking reserved."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-xs cursor-pointer"
                >
                  Send Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: LOG PATIENT / CAREGIVER TELEPHONE CALL */}
      {/* ========================================================================= */}
      {callModalPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 border border-stone-200 dark:border-stone-800 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Log Attendant Call
                </h3>
              </div>
              <button
                onClick={() => setCallModalPatient(null)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <div className="font-bold text-stone-900 dark:text-stone-100">
                  {callModalPatient.patientName}
                </div>
                <div className="text-stone-500 mt-0.5">
                  Phone: <strong>{callModalPatient.phone}</strong>
                </div>
                {callModalPatient.familyCaregiverName && (
                  <div className="text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
                    Family Attendant: {callModalPatient.familyCaregiverName} ({callModalPatient.familyCaregiverPhone})
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Call Outcome
                </label>
                <select
                  value={callOutcome}
                  onChange={e => setCallOutcome(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="Confirmed">✅ Confirmed All 3 Upcoming Sessions</option>
                  <option value="Reschedule Requested">📅 Reschedule Requested for 1 or more sessions</option>
                  <option value="No Answer">📞 No Answer / Call Back Later</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Front Desk Notes
                </label>
                <textarea
                  value={callNotes}
                  onChange={e => setCallNotes(e.target.value)}
                  placeholder="e.g. Spoke to daughter Priya; confirmed driver will be available at 10 AM on Wednesday."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setCallModalPatient(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitCallLog}
                  className="px-5 py-2 rounded-xl font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-xs cursor-pointer"
                >
                  Save Call Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
