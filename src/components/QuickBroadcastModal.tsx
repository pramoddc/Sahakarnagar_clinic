import React, { useState, useMemo } from 'react';
import {
  Radio,
  Send,
  Smartphone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Check,
  X,
  FileText,
  Building2,
  Home,
  Phone,
  ShieldCheck,
  Zap,
  Sparkles,
  Info,
  ExternalLink,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import {
  PatientReminderSeries,
  ReminderLogItem,
  UpcomingSessionSlot,
  ServiceLocation
} from '../types';

export interface QuickBroadcastItem {
  patientId: string;
  patientName: string;
  phone: string;
  careType: ServiceLocation;
  therapistName: string;
  familyCaregiverName?: string;
  familyCaregiverPhone?: string;
  diagnosis: string;
  pendingSession: UpcomingSessionSlot;
  allPendingIn48h: UpcomingSessionSlot[];
}

export interface BroadcastTemplate {
  id: string;
  name: string;
  dltId: string;
  category: string;
  channel: 'SMS';
  recommendedFor: 'all' | 'clinic' | 'home';
  language: 'English' | 'Kannada';
  body: string;
  description: string;
}

export const BROADCAST_SMS_TEMPLATES: BroadcastTemplate[] = [
  {
    id: 'tpl-bcast-48h-standard',
    name: '48-Hour Pre-Session Confirmation (DLT Approved)',
    dltId: 'DLT-SAHAKAR-CONF-48H-881',
    category: '24h_Pre_Session',
    channel: 'SMS',
    recommendedFor: 'all',
    language: 'English',
    description: 'Standard clinical confirmation prompt to maintain recovery continuity and reduce vacancy.',
    body: 'Sahakar Physio Alert: {{patientName}}, your scheduled session with {{therapistName}} is on {{date}} at {{time}} ({{location}}). Reply YES to confirm or call 9845021980 to reschedule. Prevent therapy lapse.'
  },
  {
    id: 'tpl-bcast-home-care',
    name: 'Elder Home-Care Transit & Route Confirmation',
    dltId: 'DLT-SAHAKAR-HOME-48H-992',
    category: '24h_Pre_Session',
    channel: 'SMS',
    recommendedFor: 'home',
    language: 'English',
    description: 'Specifically tailored for geriatric home visits to ensure attendants are present and lock mobile routes.',
    body: 'Sahakar Elder Care: {{patientName}}, home visit by {{therapistName}} is booked for {{date}} at {{time}} ({{location}}). Please reply YES so mobile transit route is locked. Ph: 9845021980.'
  },
  {
    id: 'tpl-bcast-clinic-fast',
    name: 'In-Clinic Rapid Check-In & Attire Prep SMS',
    dltId: 'DLT-SAHAKAR-CLN-48H-773',
    category: '24h_Pre_Session',
    channel: 'SMS',
    recommendedFor: 'clinic',
    language: 'English',
    description: 'Reminds clinic patients of their appointment slot, electrotherapy bay, and loose exercise attire.',
    body: 'Sahakar Physio: Hi {{patientName}}, reminding you of your in-clinic session with {{therapistName}} on {{date}} at {{time}} ({{location}}). Please wear comfortable attire. Reply YES to confirm.'
  },
  {
    id: 'tpl-bcast-kannada',
    name: 'Kannada DLT Regional Language Alert',
    dltId: 'DLT-SAHAKAR-KAN-48H-441',
    category: '24h_Pre_Session',
    channel: 'SMS',
    recommendedFor: 'all',
    language: 'Kannada',
    description: 'Regional language SMS for local Bengaluru senior citizens and family attendants.',
    body: 'ಸಹಕಾರ ಫಿಸಿಯೋ: ನಮಸ್ಕಾರ {{patientName}}, ನಿಮ್ಮ ಫಿಸಿಯೋಥೆರಪಿ ಸೆಷನ್ {{date}} ರಂದು {{time}} ಗಂಟೆಗೆ ನಿಗದಿಯಾಗಿದೆ ({{location}}). ದೃಢೀಕರಿಸಲು YES ಎಂದು SMS ಮಾಡಿ. ಹೆಲ್ಪ್‌ಲೈನ್: 9845021980.'
  }
];

// Helper: Check if session falls within 48 hours of baseDate
export function isSessionWithinNext48Hours(
  sessionDateStr: string,
  baseDateStr: string = '2026-09-08'
): boolean {
  try {
    const [bYear, bMonth, bDay] = baseDateStr.split('-').map(Number);
    const [sYear, sMonth, sDay] = sessionDateStr.split('-').map(Number);
    const base = new Date(bYear, bMonth - 1, bDay, 0, 0, 0);
    const session = new Date(sYear, sMonth - 1, sDay, 0, 0, 0);
    const diffMs = session.getTime() - base.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours >= 0 && diffHours <= 48;
  } catch (e) {
    return false;
  }
}

// Format date nicely e.g. "Tue, 08 Sep"
export function formatDisplayDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  } catch {
    return dateStr;
  }
}

// Helper: Interpolate template with patient data
export function interpolateSMS(
  templateBody: string,
  patient: PatientReminderSeries,
  session: UpcomingSessionSlot
): string {
  const dateFormatted = formatDisplayDate(session.date);
  return templateBody
    .replace(/{{patientName}}/g, patient.patientName)
    .replace(/{{therapistName}}/g, session.therapistName || patient.therapistName)
    .replace(/{{date}}/g, dateFormatted)
    .replace(/{{time}}/g, session.time)
    .replace(/{{location}}/g, session.stationOrArea || (patient.careType === 'Home' ? 'Home Residence' : 'Clinic'));
}

interface QuickBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientSeries: PatientReminderSeries[];
  onBroadcastComplete: (
    sentLogs: ReminderLogItem[],
    updatedSeries: PatientReminderSeries[],
    summaryMessage: string
  ) => void;
  onNavigateToLogs?: () => void;
  currentBaseDate?: string;
  standalone?: boolean; // When rendered inline in a tab vs modal dialog
}

export const QuickBroadcastModal: React.FC<QuickBroadcastModalProps> = ({
  isOpen,
  onClose,
  patientSeries,
  onBroadcastComplete,
  onNavigateToLogs,
  currentBaseDate = '2026-09-08',
  standalone = false
}) => {
  // Horizon filter: 48h (default) or 24h
  const [horizonHours, setHorizonHours] = useState<24 | 48>(48);
  const [locationFilter, setLocationFilter] = useState<'ALL' | 'Clinic' | 'Home'>('ALL');
  
  // Selected Template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(BROADCAST_SMS_TEMPLATES[0].id);
  const [isCustomTemplate, setIsCustomTemplate] = useState<boolean>(false);
  const [customTemplateText, setCustomTemplateText] = useState<string>(
    'Sahakar Physio Alert: {{patientName}}, your scheduled session with {{therapistName}} is on {{date}} at {{time}} ({{location}}). Please reply YES to confirm or call 9845021980.'
  );

  // Selected Patients for Broadcast (Set of patient IDs)
  const [selectedPatientIds, setSelectedPatientIds] = useState<Set<string>>(() => new Set());
  const [previewPatientId, setPreviewPatientId] = useState<string>('');

  // Dispatch state
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastProgress, setBroadcastProgress] = useState<number>(0);
  const [broadcastResultNotice, setBroadcastResultNotice] = useState<string | null>(null);

  // 1. Identify all eligible pending appointments for next 48h
  const pendingBroadcastItems = useMemo<QuickBroadcastItem[]>(() => {
    const items: QuickBroadcastItem[] = [];

    patientSeries.forEach(p => {
      // Find upcoming sessions that are in the 48h horizon and unconfirmed
      const pendingInWindow = p.upcomingSessions.filter(s => {
        if (s.confirmed) return false;
        if (horizonHours === 24) {
          // within 24h
          try {
            const [bYear, bMonth, bDay] = currentBaseDate.split('-').map(Number);
            const [sYear, sMonth, sDay] = s.date.split('-').map(Number);
            const diffHours = (new Date(sYear, sMonth - 1, sDay).getTime() - new Date(bYear, bMonth - 1, bDay).getTime()) / (1000 * 60 * 60);
            return diffHours >= 0 && diffHours <= 24;
          } catch {
            return false;
          }
        } else {
          return isSessionWithinNext48Hours(s.date, currentBaseDate);
        }
      });

      if (pendingInWindow.length > 0) {
        // Earliest pending session is primary
        items.push({
          patientId: p.patientId,
          patientName: p.patientName,
          phone: p.phone,
          careType: p.careType,
          therapistName: p.therapistName,
          familyCaregiverName: p.familyCaregiverName,
          familyCaregiverPhone: p.familyCaregiverPhone,
          diagnosis: p.diagnosis,
          pendingSession: pendingInWindow[0],
          allPendingIn48h: pendingInWindow
        });
      }
    });

    return items;
  }, [patientSeries, currentBaseDate, horizonHours]);

  // Sync default selection whenever eligible items change
  React.useEffect(() => {
    if (pendingBroadcastItems.length > 0) {
      setSelectedPatientIds(new Set(pendingBroadcastItems.map(item => item.patientId)));
      if (!previewPatientId || !pendingBroadcastItems.some(item => item.patientId === previewPatientId)) {
        setPreviewPatientId(pendingBroadcastItems[0].patientId);
      }
    } else {
      setSelectedPatientIds(new Set());
    }
  }, [pendingBroadcastItems]);

  // Filtered list by location
  const displayedItems = useMemo(() => {
    if (locationFilter === 'ALL') return pendingBroadcastItems;
    return pendingBroadcastItems.filter(item => item.careType === locationFilter);
  }, [pendingBroadcastItems, locationFilter]);

  // Current active template
  const activeTemplate = useMemo(() => {
    return BROADCAST_SMS_TEMPLATES.find(t => t.id === selectedTemplateId) || BROADCAST_SMS_TEMPLATES[0];
  }, [selectedTemplateId]);

  const templateBodyToUse = isCustomTemplate ? customTemplateText : activeTemplate.body;

  // Selected item for live preview
  const previewItem = useMemo(() => {
    return (
      pendingBroadcastItems.find(item => item.patientId === previewPatientId) ||
      pendingBroadcastItems[0] ||
      null
    );
  }, [pendingBroadcastItems, previewPatientId]);

  // Generated preview text
  const previewSmsText = useMemo(() => {
    if (!previewItem) return 'No eligible patients found for the selected time window.';
    const raw = interpolateSMS(templateBodyToUse, {
      ...previewItem,
      age: 60,
      gender: 'Other',
      packageType: 20,
      sessionsCompleted: 10,
      upcomingSessions: previewItem.allPendingIn48h,
      unconfirmedCount: previewItem.allPendingIn48h.length,
      hasUnconfirmedNext3: true,
      riskSeverity: 'Critical'
    }, previewItem.pendingSession);
    return raw;
  }, [templateBodyToUse, previewItem]);

  // Character and credit counter
  const charCount = previewSmsText.length;
  const smsCredits = Math.ceil(charCount / 160) || 1;

  // Selection toggle handlers
  const handleTogglePatient = (patientId: string) => {
    setSelectedPatientIds(prev => {
      const next = new Set(prev);
      if (next.has(patientId)) {
        next.delete(patientId);
      } else {
        next.add(patientId);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedPatientIds.size === displayedItems.length) {
      setSelectedPatientIds(new Set());
    } else {
      setSelectedPatientIds(new Set(displayedItems.map(item => item.patientId)));
    }
  };

  // Execute Quick Broadcast
  const handleExecuteBroadcast = async () => {
    if (selectedPatientIds.size === 0) return;

    setIsBroadcasting(true);
    setBroadcastProgress(10);

    const targetedItems = pendingBroadcastItems.filter(item =>
      selectedPatientIds.has(item.patientId)
    );

    // Simulate telecom gateway progress
    await new Promise(r => setTimeout(r, 400));
    setBroadcastProgress(50);
    await new Promise(r => setTimeout(r, 450));
    setBroadcastProgress(90);

    const nowFormatted = '2026-09-08 10:35';
    const generatedLogs: ReminderLogItem[] = [];

    // Create log item for each targeted patient
    targetedItems.forEach(item => {
      const msg = interpolateSMS(templateBodyToUse, {
        ...item,
        age: 60,
        gender: 'Other',
        packageType: 20,
        sessionsCompleted: 10,
        upcomingSessions: item.allPendingIn48h,
        unconfirmedCount: item.allPendingIn48h.length,
        hasUnconfirmedNext3: true,
        riskSeverity: 'Critical'
      }, item.pendingSession);

      const logItem: ReminderLogItem = {
        id: `log-bcast-${Date.now()}-${item.patientId}`,
        patientId: item.patientId,
        patientName: item.patientName,
        phone: item.phone,
        careType: item.careType,
        channel: 'SMS',
        templateCategory: (activeTemplate.category as any) || '24h_Pre_Session',
        templateName: isCustomTemplate
          ? 'Assistant Custom Quick Broadcast SMS'
          : `Quick Broadcast: ${activeTemplate.name}`,
        messageBody: msg,
        sentAt: nowFormatted,
        deliveryStatus: 'Delivered',
        responseStatus: 'Pending Reply',
        sessionDatesMentioned: item.allPendingIn48h.map(s => s.date),
        therapistName: item.pendingSession.therapistName || item.therapistName,
        isThreeSessionConfirmationPrompt: item.allPendingIn48h.length >= 3,
        actionTaken: `Quick Broadcast SMS dispatched via Airtel DLT Gateway (${activeTemplate.dltId || 'DLT-SAHAKAR'}). Next 48h appointment alert sent to ${item.phone}.`
      };

      generatedLogs.push(logItem);
    });

    // Update patient series state
    const updatedSeries = patientSeries.map(p => {
      if (selectedPatientIds.has(p.patientId)) {
        return {
          ...p,
          lastReminderSentAt: nowFormatted,
          lastReminderChannel: 'SMS' as const,
          lastReminderStatus: 'Delivered' as const,
          notes: `${p.notes || ''} [48h Broadcast SMS dispatched on 2026-09-08]`.trim()
        };
      }
      return p;
    });

    setBroadcastProgress(100);
    setIsBroadcasting(false);

    const summaryMsg = `Quick Broadcast Complete: Sent ${targetedItems.length} template-based SMS reminders for upcoming 48-hour appointments!`;
    setBroadcastResultNotice(summaryMsg);

    onBroadcastComplete(generatedLogs, updatedSeries, summaryMsg);
  };

  if (!isOpen && !standalone) return null;

  const content = (
    <div className="space-y-5 text-stone-900 dark:text-stone-100 text-xs">
      {/* Broadcast Result Toast */}
      {broadcastResultNotice && (
        <div className="bg-teal-900 border border-teal-500 text-teal-100 p-4 rounded-xl shadow-md flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-teal-300 shrink-0" />
            <div>
              <div className="font-bold text-sm">{broadcastResultNotice}</div>
              <div className="text-[11px] text-teal-200 mt-0.5">
                All dispatches have been registered in the SMS & WhatsApp audit log with Airtel DLT gateway reference IDs.
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onNavigateToLogs && (
              <button
                onClick={() => {
                  onNavigateToLogs();
                  if (!standalone) onClose();
                }}
                className="px-3 py-1 rounded-lg bg-teal-800 hover:bg-teal-700 text-teal-100 font-semibold text-xs transition-colors cursor-pointer"
              >
                View in Logs →
              </button>
            )}
            <button
              onClick={() => setBroadcastResultNotice(null)}
              className="text-teal-300 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Banner & Context */}
      <div className="bg-gradient-to-r from-teal-900 to-stone-900 text-white p-4 sm:p-5 rounded-2xl shadow-xs border border-teal-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-800/80 border border-teal-600 flex items-center justify-center text-teal-300 shrink-0 shadow-xs">
            <Radio className="w-5 h-5 text-teal-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Quick Broadcast: 48-Hour Pending Appointment Reminders
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 uppercase tracking-wider">
                Assistant Tool
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl">
              Rapidly dispatches DLT-compliant SMS notifications to patients with pending sessions in the next 48 hours. Protects clinic revenue, prevents last-minute vacancy, and confirms mobile home-care travel routes across Sahakarnagar.
            </p>
          </div>
        </div>

        {/* Quick Horizon Filter Buttons */}
        <div className="flex items-center space-x-2 shrink-0 bg-black/30 p-1.5 rounded-xl border border-teal-700/50">
          <button
            onClick={() => setHorizonHours(24)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              horizonHours === 24
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Next 24h
          </button>
          <button
            onClick={() => setHorizonHours(48)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              horizonHours === 48
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Next 48h (Recommended)
          </button>
        </div>
      </div>

      {/* Main Grid: Left side (Recipients & Filters) | Right side (Template Picker & Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Target Patients List (7 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase tracking-wider flex items-center">
                <Users className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                Target Recipients ({pendingBroadcastItems.length} Found • {selectedPatientIds.size} Selected)
              </span>
            </div>

            {/* Care Location Filter Chips */}
            <div className="flex items-center space-x-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
              <button
                onClick={() => setLocationFilter('ALL')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold cursor-pointer ${
                  locationFilter === 'ALL'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-500'
                }`}
              >
                All ({pendingBroadcastItems.length})
              </button>
              <button
                onClick={() => setLocationFilter('Clinic')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold flex items-center space-x-1 cursor-pointer ${
                  locationFilter === 'Clinic'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-500'
                }`}
              >
                <Building2 className="w-3 h-3 text-teal-600" />
                <span>Clinic</span>
              </button>
              <button
                onClick={() => setLocationFilter('Home')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold flex items-center space-x-1 cursor-pointer ${
                  locationFilter === 'Home'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-500'
                }`}
              >
                <Home className="w-3 h-3 text-emerald-600" />
                <span>Home Visit</span>
              </button>
            </div>
          </div>

          {/* Select All Checkbox bar */}
          <div className="bg-stone-50 dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 flex items-center justify-between text-stone-600 dark:text-stone-300">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={
                  displayedItems.length > 0 &&
                  displayedItems.every(i => selectedPatientIds.has(i.patientId))
                }
                onChange={handleToggleSelectAll}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-stone-300 cursor-pointer"
              />
              <span className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                Select All {displayedItems.length} Eligible Patients for Broadcast
              </span>
            </label>

            <span className="text-[11px] text-stone-500">
              Window: <strong>Tue, 08 Sep – Thu, 10 Sep</strong>
            </span>
          </div>

          {/* Patients Scrollable Card List */}
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {displayedItems.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                <p className="font-bold text-stone-700 dark:text-stone-300 text-xs">
                  All appointments in this window are confirmed!
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  No unconfirmed patient appointments detected for the next {horizonHours} hours.
                </p>
              </div>
            ) : (
              displayedItems.map(item => {
                const isSelected = selectedPatientIds.has(item.patientId);
                const isPreviewing = previewPatientId === item.patientId;
                const nextSession = item.pendingSession;

                return (
                  <div
                    key={item.patientId}
                    className={`p-3 rounded-xl border transition-all ${
                      isSelected
                        ? isPreviewing
                          ? 'bg-teal-50/90 dark:bg-teal-950/40 border-teal-500 ring-2 ring-teal-500/20'
                          : 'bg-white dark:bg-stone-800/90 border-stone-300 dark:border-stone-700'
                        : 'bg-stone-50/60 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleTogglePatient(item.patientId)}
                          className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-stone-300 mt-0.5 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                              {item.patientName}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                item.careType === 'Home'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                              }`}
                            >
                              {item.careType === 'Home' ? 'Elder Home-Care' : 'Clinic'}
                            </span>
                            {item.allPendingIn48h.length > 1 && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                                {item.allPendingIn48h.length} Sessions in 48h
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 flex flex-wrap items-center gap-x-2">
                            <span>Phone: <strong>{item.phone}</strong></span>
                            {item.familyCaregiverName && (
                              <span className="text-amber-700 dark:text-amber-400 font-medium">
                                Attendant: {item.familyCaregiverName}
                              </span>
                            )}
                          </div>

                          {/* Appointment Slot Badge */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <div className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold text-[11px] flex items-center">
                              <Clock className="w-3 h-3 mr-1 text-amber-600" />
                              {formatDisplayDate(nextSession.date)} at {nextSession.time}
                            </div>
                            <div className="text-[11px] text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-700/60 px-2 py-1 rounded-lg">
                              Therapist: <strong>{nextSession.therapistName}</strong>
                            </div>
                            <div className="text-[11px] text-stone-500 truncate max-w-[200px]">
                              {nextSession.stationOrArea}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right action: Click to Preview or Device SMS */}
                      <div className="flex flex-col items-end space-y-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewPatientId(item.patientId)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                            isPreviewing
                              ? 'bg-teal-700 text-white'
                              : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-200'
                          }`}
                        >
                          {isPreviewing ? 'Previewing SMS' : 'Preview SMS'}
                        </button>

                        <a
                          href={`sms:${item.phone.replace(/[^0-9+]/g, '')}?body=${encodeURIComponent(
                            interpolateSMS(templateBodyToUse, {
                              ...item,
                              age: 60,
                              gender: 'Other',
                              packageType: 20,
                              sessionsCompleted: 10,
                              upcomingSessions: item.allPendingIn48h,
                              unconfirmedCount: item.allPendingIn48h.length,
                              hasUnconfirmedNext3: true,
                              riskSeverity: 'Critical'
                            }, nextSession)
                          )}`}
                          title="Open native SMS messenger on this device"
                          className="text-[10px] text-stone-500 hover:text-teal-600 flex items-center underline"
                        >
                          <Smartphone className="w-3 h-3 mr-0.5 text-stone-400" />
                          Device App
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Template Selector & Live Preview (5 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase tracking-wider flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
              DLT SMS Template Selection
            </span>
            <span className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
              Airtel Telecom Gateway
            </span>
          </div>

          {/* Template Choices */}
          <div className="space-y-2">
            {BROADCAST_SMS_TEMPLATES.map(tpl => {
              const isSelected = !isCustomTemplate && selectedTemplateId === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => {
                    setIsCustomTemplate(false);
                    setSelectedTemplateId(tpl.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-600 ring-2 ring-teal-600/20'
                      : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center mr-1.5 ${
                          isSelected ? 'border-teal-700 bg-teal-700 text-white' : 'border-stone-400'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                      {tpl.name}
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 bg-stone-100 dark:bg-stone-700 px-1.5 py-0.2 rounded">
                      {tpl.dltId}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 pl-5">
                    {tpl.description}
                  </p>
                </div>
              );
            })}

            {/* Custom Template Mode */}
            <div
              onClick={() => setIsCustomTemplate(true)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isCustomTemplate
                  ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-600 ring-2 ring-teal-600/20'
                  : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center mr-1.5 ${
                      isCustomTemplate ? 'border-teal-700 bg-teal-700 text-white' : 'border-stone-400'
                    }`}
                  >
                    {isCustomTemplate && <Check className="w-2.5 h-2.5" />}
                  </div>
                  Custom Assistant Template Draft
                </div>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                  Editable
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 pl-5">
                Freely customize template text with tags: &#123;&#123;patientName&#125;&#125;, &#123;&#123;therapistName&#125;&#125;, &#123;&#123;date&#125;&#125;, &#123;&#123;time&#125;&#125;, &#123;&#123;location&#125;&#125;
              </p>
            </div>
          </div>

          {/* Custom textarea editor if custom template is picked */}
          {isCustomTemplate && (
            <div className="p-3 bg-stone-50 dark:bg-stone-800/90 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                Edit Custom SMS Text:
              </label>
              <textarea
                value={customTemplateText}
                onChange={e => setCustomTemplateText(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-teal-600"
              />
              <div className="flex flex-wrap gap-1 text-[10px]">
                {['{{patientName}}', '{{therapistName}}', '{{date}}', '{{time}}', '{{location}}'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setCustomTemplateText(prev => `${prev} ${tag}`)}
                    className="px-1.5 py-0.5 bg-stone-200 dark:bg-stone-700 rounded font-mono hover:bg-stone-300 text-stone-800 dark:text-stone-200 cursor-pointer"
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Mobile Screen SMS Preview */}
          <div className="bg-stone-900 text-white p-4 rounded-2xl border border-stone-800 shadow-md space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800 text-[11px]">
              <div className="flex items-center space-x-1.5 text-stone-300">
                <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                <span>Recipient SMS Preview:</span>
                <strong className="text-white">
                  {previewItem ? previewItem.patientName : 'None selected'}
                </strong>
              </div>
              <span className="font-mono text-[10px] text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                VM-SAHAKR
              </span>
            </div>

            {/* Bubble */}
            <div className="p-3 bg-stone-800/90 rounded-xl border border-stone-700 text-xs leading-relaxed text-stone-100 whitespace-pre-wrap font-sans">
              {previewSmsText}
            </div>

            {/* GSM Metas */}
            <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
              <span className="flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
                DLT ID: {activeTemplate.dltId}
              </span>
              <span>
                {charCount} chars • <strong>{smsCredits} SMS credit{smsCredits > 1 ? 's' : ''}</strong>
              </span>
            </div>
          </div>

          {/* Broadcast Execution Button */}
          <div className="pt-2">
            {isBroadcasting ? (
              <div className="p-3 rounded-xl bg-teal-950/80 border border-teal-700 text-teal-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center">
                    <Send className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Broadcasting SMS via Airtel DLT Gateway...
                  </span>
                  <span>{broadcastProgress}%</span>
                </div>
                <div className="w-full bg-teal-900/60 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${broadcastProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                id="btn-confirm-broadcast-sms"
                onClick={handleExecuteBroadcast}
                disabled={selectedPatientIds.size === 0}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer ${
                  selectedPatientIds.size > 0
                    ? 'bg-teal-700 hover:bg-teal-800 text-white ring-2 ring-teal-500/30'
                    : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>
                  Send SMS Broadcast to {selectedPatientIds.size} Patient{selectedPatientIds.size === 1 ? '' : 's'} (Next {horizonHours}h)
                </span>
              </button>
            )}

            <p className="text-[10px] text-center text-stone-500 mt-2">
              Dispatched through Indian telecom DLT route. Each dispatch registers in reception audit logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (standalone) {
    return <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-5xl w-full p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-2xl animate-in zoom-in-95 duration-150 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Quick Broadcast Module
              </h3>
              <p className="text-[11px] text-stone-500">
                Automated DLT SMS dispatch for all pending rehabilitation sessions in the next 48 hours
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {content}

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-200 dark:border-stone-800">
          <div className="text-[11px] text-stone-500">
            Current Clinic Horizon: <strong>{currentBaseDate}</strong> (+48 Hours)
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
