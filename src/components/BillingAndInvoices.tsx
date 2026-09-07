import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Download,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  CreditCard,
  PlusCircle,
  Eye,
  Send,
  Printer,
  ChevronDown,
  ChevronUp,
  Building,
  Home,
  FileCheck,
  Percent,
  X,
  Copy,
  Check,
  HelpCircle,
  ArrowUpRight
} from 'lucide-react';
import { PatientInvoice, PaymentStatus, PaymentMode, ServiceLocation } from '../types';
import { DEFAULT_INVOICES, CLINIC_BILLING_METADATA, calculateBillingSummary } from '../data/billingDefaults';
import { downloadReceiptPDF, generateReceiptPDF } from '../utils/receiptPdfGenerator';

interface BillingAndInvoicesProps {
  onNavigateToScheduler?: () => void;
  onNavigateToPatients?: () => void;
}

export const BillingAndInvoices: React.FC<BillingAndInvoicesProps> = ({
  onNavigateToScheduler,
  onNavigateToPatients
}) => {
  // Master Invoices State
  const [invoices, setInvoices] = useState<PatientInvoice[]>(DEFAULT_INVOICES);

  // Active View Tab inside Billing Module
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'package_balances' | 'reminders'>('invoices');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PaymentStatus>('All');
  const [careFilter, setCareFilter] = useState<'All' | ServiceLocation>('All');
  const [riskFilter, setRiskFilter] = useState<'All' | 'Has-Balance' | 'Deficit-Only'>('All');

  // Expanded Invoices state for transaction ledger
  const [expandedInvoiceIds, setExpandedInvoiceIds] = useState<Record<string, boolean>>({});

  // Modals
  const [receiptPreviewInvoice, setReceiptPreviewInvoice] = useState<PatientInvoice | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<PatientInvoice | null>(null);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [reminderModalInvoice, setReminderModalInvoice] = useState<PatientInvoice | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Form State for Recording Payment
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [paymentCollector, setPaymentCollector] = useState<string>('Front Desk / Dr. Aditi Rao');

  // Form State for Creating New Invoice
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState(45);
  const [newPatientGender, setNewPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newPatientPhone, setNewPatientPhone] = useState('+91 9');
  const [newCareType, setNewCareType] = useState<ServiceLocation>('Clinic');
  const [newPackageSessions, setNewPackageSessions] = useState<number>(15);
  const [newPackageTitle, setNewPackageTitle] = useState('15-Session Advanced Physical Rehabilitation');
  const [newGrossFee, setNewGrossFee] = useState<number>(15000);
  const [newDiscount, setNewDiscount] = useState<number>(1000);
  const [newDiscountReason, setNewDiscountReason] = useState('Upfront Multi-Session Concession');
  const [newInitialDeposit, setNewInitialDeposit] = useState<number>(7000);
  const [newInitialMode, setNewInitialMode] = useState<PaymentMode>('UPI');
  const [newDiagnosis, setNewDiagnosis] = useState('Musculoskeletal Pain / Postural Correction');
  const [newTherapist, setNewTherapist] = useState('Dr. Aditi Rao, MPT (Lead In-Clinic)');

  // Toggle invoice row accordion
  const toggleExpand = (id: string) => {
    setExpandedInvoiceIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.phone.includes(searchQuery) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.packageName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || inv.paymentStatus === statusFilter;
      const matchesCare = careFilter === 'All' || inv.careType === careFilter;

      let matchesRisk = true;
      if (riskFilter === 'Has-Balance') {
        matchesRisk = inv.balanceDue > 0;
      } else if (riskFilter === 'Deficit-Only') {
        matchesRisk = inv.uncoveredDeliveredSessions > 0;
      }

      return matchesSearch && matchesStatus && matchesCare && matchesRisk;
    });
  }, [invoices, searchQuery, statusFilter, careFilter, riskFilter]);

  // Financial KPIs
  const summary = useMemo(() => calculateBillingSummary(invoices), [invoices]);

  // Action: Open Record Payment Modal
  const handleOpenPaymentModal = (invoice: PatientInvoice) => {
    setPaymentModalInvoice(invoice);
    setPaymentAmount(invoice.balanceDue); // default to full outstanding balance
    setPaymentMode('UPI');
    setPaymentRef(`UPI-${Date.now().toString().slice(-6)}`);
    setPaymentNotes('Installment payment received at reception desk.');
  };

  // Action: Submit Payment
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice || paymentAmount <= 0) return;

    const amount = Number(paymentAmount);
    const newAmountPaid = paymentModalInvoice.amountPaid + amount;
    const newBalanceDue = Math.max(0, paymentModalInvoice.netPayable - newAmountPaid);
    const newStatus: PaymentStatus = newBalanceDue === 0 ? 'Paid' : 'Partial';

    // Recalculate covered sessions
    const perSession = paymentModalInvoice.perSessionEffectiveRate;
    const newCoveredSessions = Math.min(
      paymentModalInvoice.packageSessionsTotal,
      Math.floor(newAmountPaid / perSession)
    );
    const newUncoveredSessions = Math.max(0, paymentModalInvoice.sessionsDelivered - newCoveredSessions);

    const newTxnId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReceiptSuffix = String.fromCharCode(65 + paymentModalInvoice.transactions.length);
    const newReceiptNo = `${paymentModalInvoice.receiptNumber}-${newReceiptSuffix}`;

    const newTransaction = {
      id: newTxnId,
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      mode: paymentMode,
      referenceNo: paymentRef || `REF-${Date.now().toString().slice(-6)}`,
      collectedBy: paymentCollector,
      receiptNumber: newReceiptNo,
      notes: paymentNotes
    };

    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === paymentModalInvoice.id) {
        return {
          ...inv,
          amountPaid: newAmountPaid,
          balanceDue: newBalanceDue,
          paymentStatus: newStatus,
          lastPaymentDate: new Date().toISOString().split('T')[0],
          coveredSessionsCount: newCoveredSessions,
          uncoveredDeliveredSessions: newUncoveredSessions,
          financialRisk:
            newBalanceDue === 0
              ? ('Covered' as const)
              : newUncoveredSessions > 0
              ? ('Deficit / Overdue' as const)
              : ('Payment Due' as const),
          transactions: [...inv.transactions, newTransaction]
        };
      }
      return inv;
    });

    setInvoices(updatedInvoices);
    setPaymentModalInvoice(null);
  };

  // Action: Create New Invoice
  const handleCreateNewInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const netPayable = Math.max(0, Number(newGrossFee) - Number(newDiscount));
    const deposit = Math.min(netPayable, Math.max(0, Number(newInitialDeposit)));
    const balanceDue = netPayable - deposit;
    const status: PaymentStatus =
      deposit === 0 ? 'Pending' : balanceDue === 0 ? 'Paid' : 'Partial';

    const newIdNum = 120 + invoices.length;
    const invId = `INV-2026-${newIdNum}`;
    const recId = `REC-2026-${newIdNum}`;
    const perSession = newPackageSessions > 0 ? netPayable / newPackageSessions : netPayable;
    const coveredSessions = Math.min(newPackageSessions, Math.floor(deposit / perSession));

    const transactionsList = [];
    if (deposit > 0) {
      transactionsList.push({
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        amount: deposit,
        mode: newInitialMode,
        referenceNo: `INIT-${Date.now().toString().slice(-6)}`,
        collectedBy: newTherapist,
        receiptNumber: `${recId}-A`,
        notes: 'Initial package advance collected on enrollment.'
      });
    }

    const newInvoice: PatientInvoice = {
      id: invId,
      receiptNumber: recId,
      patientId: `pt-${Date.now().toString().slice(-4)}`,
      patientName: newPatientName,
      age: Number(newPatientAge),
      gender: newPatientGender,
      phone: newPatientPhone,
      address: 'Sahakarnagar Local Residence',
      area: newCareType === 'Home' ? 'Sahakarnagar & Judicial Layout' : 'Sahakarnagar Clinic Bay',
      careType: newCareType,
      packageName: newPackageTitle,
      injuryCategory: 'Physical Therapy Protocol',
      diagnosis: newDiagnosis,
      attendingTherapist: newTherapist,
      packageSessionsTotal: Number(newPackageSessions),
      sessionsDelivered: 0,
      sessionsRemaining: Number(newPackageSessions),
      grossFee: Number(newGrossFee),
      discountAmount: Number(newDiscount),
      discountReason: newDiscountReason,
      netPayable: netPayable,
      amountPaid: deposit,
      balanceDue: balanceDue,
      paymentStatus: status,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      lastPaymentDate: deposit > 0 ? new Date().toISOString().split('T')[0] : undefined,
      transactions: transactionsList,
      hsnSacCode: CLINIC_BILLING_METADATA.sacCode,
      gstin: CLINIC_BILLING_METADATA.gstin,
      financialRisk: deposit === 0 ? 'Payment Due' : balanceDue === 0 ? 'Covered' : 'Payment Due',
      perSessionEffectiveRate: perSession,
      coveredSessionsCount: coveredSessions,
      uncoveredDeliveredSessions: 0,
      notes: 'New patient package opened via Billing Module.'
    };

    setInvoices([newInvoice, ...invoices]);
    setIsNewInvoiceModalOpen(false);

    // Reset inputs
    setNewPatientName('');
  };

  // Helper: Copy Reminder Message
  const getReminderMessage = (inv: PatientInvoice) => {
    return `Namaste ${inv.patientName} ji,\nThis is a gentle update from Sahakar Physio & Rehabilitation Clinic regarding your ongoing *${inv.packageName}*.\n\n` +
      `• Sessions Completed: ${inv.sessionsDelivered} of ${inv.packageSessionsTotal}\n` +
      `• Total Package Fee: ₹${inv.netPayable.toLocaleString('en-IN')}\n` +
      `• Total Paid to Date: ₹${inv.amountPaid.toLocaleString('en-IN')}\n` +
      `• *Outstanding Balance Due: ₹${inv.balanceDue.toLocaleString('en-IN')}*\n` +
      (inv.uncoveredDeliveredSessions > 0
        ? `⚠️ *Important*: You have completed ${inv.sessionsDelivered} sessions, which exceeds your initial deposit coverage. Kindly clear the balance before your next session.\n\n`
        : `Kindly settle the milestone balance by ${inv.dueDate} to ensure uninterrupted continuity of your rehabilitation.\n\n`) +
      `You can pay conveniently via UPI:\n` +
      `📱 UPI VPA: *${CLINIC_BILLING_METADATA.upiId}*\n` +
      `A/C: ${CLINIC_BILLING_METADATA.accountNumber} | IFSC: ${CLINIC_BILLING_METADATA.ifscCode}\n\n` +
      `For any queries or digital receipts, feel free to contact reception at ${CLINIC_BILLING_METADATA.phone}.\nWarm regards,\nSahakar Physio Team`;
  };

  const handleCopyReminder = (inv: PatientInvoice) => {
    const text = getReminderMessage(inv);
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-teal-800 text-white flex items-center justify-center shadow-xs">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                    Billing & Patient Invoices
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800">
                    GST SAC 999312
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Manage patient payment status, generate official digital receipts in PDF format, and track unpaid session balances for multi-session packages.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => setIsNewInvoiceModalOpen(true)}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Create Package Invoice
            </button>

            {onNavigateToScheduler && (
              <button
                onClick={onNavigateToScheduler}
                className="inline-flex items-center px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs transition-colors cursor-pointer"
              >
                Scheduler
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </button>
            )}

            {onNavigateToPatients && (
              <button
                onClick={onNavigateToPatients}
                className="inline-flex items-center px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs transition-colors cursor-pointer"
              >
                Patients
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-stone-100 dark:border-stone-800">
          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200/80 dark:border-stone-700/80">
            <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block">Total Invoiced</span>
            <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              ₹{summary.totalInvoiced.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-stone-400 mt-0.5 block">{invoices.length} Packages</span>
          </div>

          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl p-3 border border-emerald-200/80 dark:border-emerald-800/80">
            <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 block">Collections Realized</span>
            <div className="text-base font-bold text-emerald-900 dark:text-emerald-100 mt-0.5">
              ₹{summary.totalCollections.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5 block">
              {summary.collectionEfficiency.toFixed(1)}% Realization
            </span>
          </div>

          <div className="bg-amber-50/70 dark:bg-amber-950/40 rounded-xl p-3 border border-amber-200/80 dark:border-amber-800/80">
            <span className="text-[11px] font-medium text-amber-800 dark:text-amber-300 block">Outstanding Balance</span>
            <div className="text-base font-bold text-amber-900 dark:text-amber-100 mt-0.5">
              ₹{summary.totalOutstanding.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5 block">
              Across {summary.countPartial + summary.countPending + summary.countOverdue} accounts
            </span>
          </div>

          <div className="bg-rose-50/70 dark:bg-rose-950/40 rounded-xl p-3 border border-rose-200/80 dark:border-rose-800/80">
            <span className="text-[11px] font-medium text-rose-800 dark:text-rose-300 block">Delivered Session Deficit</span>
            <div className="text-base font-bold text-rose-900 dark:text-rose-100 mt-0.5">
              {summary.totalUncoveredSessions} Sessions
            </div>
            <span className="text-[10px] text-rose-700 dark:text-rose-400 mt-0.5 block">
              ₹{summary.totalUncoveredValue.toLocaleString('en-IN')} Clinic Exposure
            </span>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200/80 dark:border-stone-700/80">
            <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block">Fully Paid Accounts</span>
            <div className="text-base font-bold text-stone-800 dark:text-stone-200 mt-0.5">
              {summary.countPaid} Packages
            </div>
            <span className="text-[10px] text-stone-400 mt-0.5 block">Zero outstanding</span>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 border border-stone-200/80 dark:border-stone-700/80">
            <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 block">Overdue / Action Flag</span>
            <div className="text-base font-bold text-rose-700 dark:text-rose-400 mt-0.5">
              {summary.countOverdue} Critical
            </div>
            <span className="text-[10px] text-stone-400 mt-0.5 block">Requires immediate nudge</span>
          </div>
        </div>
      </div>

      {/* Module Navigation Sub-Tabs */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 space-x-2">
        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center ${
            activeSubTab === 'invoices'
              ? 'border-teal-700 text-teal-800 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-950/20'
              : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Receipt className="w-3.5 h-3.5 mr-1.5" />
          All Invoices & Digital Receipts
          <span className="ml-2 px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold">
            {invoices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('package_balances')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center ${
            activeSubTab === 'package_balances'
              ? 'border-teal-700 text-teal-800 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-950/20'
              : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 mr-1.5" />
          Multi-Session Package Balance Tracker
          {summary.totalUncoveredSessions > 0 && (
            <span className="ml-2 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
              {summary.totalUncoveredSessions} Deficit
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('reminders')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center ${
            activeSubTab === 'reminders'
              ? 'border-teal-700 text-teal-800 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-950/20'
              : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Send className="w-3.5 h-3.5 mr-1.5" />
          Payment Nudges & UPI Reminders
        </button>
      </div>

      {/* Filter Toolbar (Visible in Invoices & Balances view) */}
      {activeSubTab !== 'reminders' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              placeholder="Search by patient, phone, invoice, or package..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
          </div>

          <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5 text-stone-400 mr-1" />
              <span className="text-stone-500 dark:text-stone-400 text-[11px]">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1.5 text-xs text-stone-800 dark:text-stone-200 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid (Full)</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-stone-500 dark:text-stone-400 text-[11px]">Care:</span>
              <select
                value={careFilter}
                onChange={(e) => setCareFilter(e.target.value as any)}
                className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1.5 text-xs text-stone-800 dark:text-stone-200 focus:outline-none"
              >
                <option value="All">All Care Modes</option>
                <option value="Clinic">In-Clinic Bay</option>
                <option value="Home">Home Visit Care</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-stone-500 dark:text-stone-400 text-[11px]">Risk:</span>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as any)}
                className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1.5 text-xs text-stone-800 dark:text-stone-200 focus:outline-none"
              >
                <option value="All">All Accounts</option>
                <option value="Has-Balance">With Outstanding Balance</option>
                <option value="Deficit-Only">Deficit / Uncovered Sessions Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: INVOICES & DIGITAL RECEIPTS LEDGER */}
      {activeSubTab === 'invoices' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
                <thead className="bg-stone-50 dark:bg-stone-800/70 text-stone-500 dark:text-stone-400 font-semibold border-b border-stone-200 dark:border-stone-700 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Invoice / Patient</th>
                    <th className="py-3 px-3">Care & Package</th>
                    <th className="py-3 px-3">Sessions Progress</th>
                    <th className="py-3 px-3">Net Fee</th>
                    <th className="py-3 px-3">Paid / Balance</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Digital Receipt & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredInvoices.map((inv) => {
                    const isExpanded = !!expandedInvoiceIds[inv.id];
                    const progressPercent = Math.min(
                      100,
                      Math.round((inv.sessionsDelivered / inv.packageSessionsTotal) * 100)
                    );
                    const paidPercent = Math.min(
                      100,
                      Math.round((inv.amountPaid / inv.netPayable) * 100)
                    );

                    return (
                      <React.Fragment key={inv.id}>
                        <tr className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors">
                          {/* Invoice & Patient */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-start space-x-2.5">
                              <button
                                onClick={() => toggleExpand(inv.id)}
                                className="mt-0.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                                title="Toggle Transaction History"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                              <div>
                                <div className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                                  {inv.patientName}
                                </div>
                                <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center space-x-1.5 mt-0.5">
                                  <span className="font-mono text-[10px] font-semibold text-teal-700 dark:text-teal-400">
                                    {inv.id}
                                  </span>
                                  <span>•</span>
                                  <span>{inv.phone}</span>
                                </div>
                                <div className="text-[10px] text-stone-400 mt-0.5">
                                  Issued: {inv.invoiceDate}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Care Mode & Package */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center space-x-1 mb-1">
                              {inv.careType === 'Home' ? (
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                  <Home className="w-2.5 h-2.5 mr-1" />
                                  Home Visit
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                                  <Building className="w-2.5 h-2.5 mr-1" />
                                  Clinic Bay
                                </span>
                              )}
                              <span className="text-[10px] text-stone-400">({inv.area.split('(')[0].trim()})</span>
                            </div>
                            <div className="font-medium text-stone-800 dark:text-stone-200 text-xs truncate max-w-xs" title={inv.packageName}>
                              {inv.packageName}
                            </div>
                            <div className="text-[10px] text-stone-400 truncate max-w-xs mt-0.5">
                              {inv.diagnosis}
                            </div>
                          </td>

                          {/* Sessions Progress */}
                          <td className="py-3.5 px-3">
                            <div className="w-36 space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-stone-600 dark:text-stone-400">
                                  Delivered: <strong className="text-stone-900 dark:text-stone-100">{inv.sessionsDelivered}</strong> / {inv.packageSessionsTotal}
                                </span>
                                <span className="font-semibold text-stone-500">{progressPercent}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-teal-700 rounded-full"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                              <div className="text-[9px] text-stone-400">
                                Covered by pay: <strong className="text-stone-700 dark:text-stone-300">{inv.coveredSessionsCount} sess</strong>
                                {inv.uncoveredDeliveredSessions > 0 && (
                                  <span className="text-rose-600 dark:text-rose-400 font-bold ml-1">
                                    (-{inv.uncoveredDeliveredSessions} deficit!)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Net Fee & Concession */}
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-stone-900 dark:text-stone-100">
                              ₹{inv.netPayable.toLocaleString('en-IN')}
                            </div>
                            {inv.discountAmount > 0 && (
                              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center mt-0.5">
                                <Percent className="w-2.5 h-2.5 mr-0.5" />
                                -₹{inv.discountAmount.toLocaleString('en-IN')} saved
                              </div>
                            )}
                            <div className="text-[9px] text-stone-400 mt-0.5">
                              ₹{inv.perSessionEffectiveRate.toFixed(0)} / session
                            </div>
                          </td>

                          {/* Paid & Balance Due */}
                          <td className="py-3.5 px-3">
                            <div className="text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                              ₹{inv.amountPaid.toLocaleString('en-IN')} paid ({paidPercent}%)
                            </div>
                            <div
                              className={`text-xs font-bold mt-0.5 ${
                                inv.balanceDue > 0
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : 'text-stone-400'
                              }`}
                            >
                              {inv.balanceDue > 0 ? (
                                <span>Due: ₹{inv.balanceDue.toLocaleString('en-IN')}</span>
                              ) : (
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">₹0 (Cleared)</span>
                              )}
                            </div>
                            {inv.balanceDue > 0 && (
                              <div className="text-[9px] text-stone-400 mt-0.5">
                                Due by: {inv.dueDate}
                              </div>
                            )}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3.5 px-3">
                            {inv.paymentStatus === 'Paid' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                                Paid in Full
                              </span>
                            )}
                            {inv.paymentStatus === 'Partial' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                                <Clock className="w-3 h-3 mr-1 text-amber-600" />
                                Partial ({paidPercent}%)
                              </span>
                            )}
                            {inv.paymentStatus === 'Pending' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-800">
                                <Clock className="w-3 h-3 mr-1 text-blue-600" />
                                Pending Initial
                              </span>
                            )}
                            {inv.paymentStatus === 'Overdue' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 animate-pulse">
                                <AlertTriangle className="w-3 h-3 mr-1 text-rose-600" />
                                Overdue
                              </span>
                            )}
                          </td>

                          {/* Actions: Download PDF, Preview, Record Payment */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* Direct Download PDF */}
                              <button
                                onClick={() => downloadReceiptPDF(inv)}
                                className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition-colors cursor-pointer"
                                title="Download Official PDF Receipt"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>

                              {/* View Digital Receipt Preview Modal */}
                              <button
                                onClick={() => setReceiptPreviewInvoice(inv)}
                                className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                                title="Preview Digital Receipt"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Record Payment if balance due */}
                              {inv.balanceDue > 0 && (
                                <button
                                  onClick={() => handleOpenPaymentModal(inv)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px] transition-colors cursor-pointer flex items-center"
                                  title="Record Payment / Settle Balance"
                                >
                                  <IndianRupee className="w-3 h-3 mr-0.5" />
                                  Collect
                                </button>
                              )}

                              {/* WhatsApp / SMS Payment Reminder */}
                              {inv.balanceDue > 0 && (
                                <button
                                  onClick={() => setReminderModalInvoice(inv)}
                                  className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
                                  title="Send Payment Nudge"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Transaction History Row */}
                        {isExpanded && (
                          <tr className="bg-stone-50/90 dark:bg-stone-800/50">
                            <td colSpan={7} className="py-3 px-6 text-xs">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-700 pb-2">
                                  <div className="flex items-center space-x-2">
                                    <FileCheck className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                                    <span className="font-bold text-stone-800 dark:text-stone-200">
                                      Transaction Ledger & Payment Milestones for {inv.patientName}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-stone-500">
                                    SAC Code: {inv.hsnSacCode} | Attending PT: {inv.attendingTherapist}
                                  </span>
                                </div>

                                {inv.transactions.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                    {inv.transactions.map((txn) => (
                                      <div
                                        key={txn.id}
                                        className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-2.5 shadow-2xs space-y-1"
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="font-mono text-[10px] font-bold text-teal-800 dark:text-teal-300">
                                            {txn.receiptNumber}
                                          </span>
                                          <span className="font-bold text-emerald-700 dark:text-emerald-400">
                                            ₹{txn.amount.toLocaleString('en-IN')}
                                          </span>
                                        </div>
                                        <div className="text-[11px] text-stone-700 dark:text-stone-300">
                                          Mode: <strong className="text-stone-900 dark:text-stone-100">{txn.mode}</strong>
                                        </div>
                                        <div className="text-[10px] text-stone-400 font-mono truncate">
                                          Ref: {txn.referenceNo}
                                        </div>
                                        <div className="text-[10px] text-stone-500 flex justify-between pt-1 border-t border-stone-100 dark:border-stone-700">
                                          <span>{txn.date}</span>
                                          <span>By: {txn.collectedBy.split('/')[0]}</span>
                                        </div>
                                        <button
                                          onClick={() => downloadReceiptPDF(inv, txn)}
                                          className="w-full mt-1.5 py-1 rounded bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 font-medium text-[10px] flex items-center justify-center transition-colors cursor-pointer"
                                        >
                                          <Download className="w-3 h-3 mr-1" />
                                          Download Receipt for this Txn
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-stone-400 italic text-[11px]">
                                    No recorded payment transactions yet. Initial deposit pending.
                                  </div>
                                )}

                                {/* Installment Milestones */}
                                {inv.installments && inv.installments.length > 0 && (
                                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex flex-wrap gap-2 items-center text-[11px]">
                                    <span className="text-stone-500 font-medium">Scheduled Milestones:</span>
                                    {inv.installments.map((inst) => (
                                      <div
                                        key={inst.installmentNumber}
                                        className={`px-2 py-1 rounded border text-[10px] flex items-center space-x-1.5 ${
                                          inst.status === 'Paid'
                                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                            : inst.status === 'Overdue'
                                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                            : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-600'
                                        }`}
                                      >
                                        <span className="font-bold">Part {inst.installmentNumber}: ₹{inst.amount.toLocaleString('en-IN')}</span>
                                        <span>•</span>
                                        <span>Due at Sess {inst.triggerSession} ({inst.dueDate})</span>
                                        <span className="font-bold">[{inst.status}]</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>

              {filteredInvoices.length === 0 && (
                <div className="py-12 text-center text-stone-400 text-xs">
                  No invoices found matching your current filter criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-SESSION PACKAGE BALANCE TRACKER */}
      {activeSubTab === 'package_balances' && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-950 dark:text-amber-100">
                Multi-Session Package Credit & Coverage Protection Rule
              </h4>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                In multi-session rehabilitation packages (10, 15, 20, or 25 sessions), patients typically pay in 1 or 2 milestone installments.
                This dashboard tracks whether completed physical therapy sessions are covered by advance payments or if the clinic is carrying unpaid treatment exposure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoices.map((inv) => {
              const perSessionRate = inv.perSessionEffectiveRate;
              const paidSessions = inv.coveredSessionsCount;
              const deliveredSessions = inv.sessionsDelivered;
              const hasDeficit = inv.uncoveredDeliveredSessions > 0;
              const sessionsLeftToCover = Math.max(0, inv.packageSessionsTotal - paidSessions);
              const isDueForNextInstallment =
                inv.balanceDue > 0 && deliveredSessions >= paidSessions - 1;

              return (
                <div
                  key={inv.id}
                  className={`bg-white dark:bg-stone-900 border rounded-2xl p-4 shadow-xs space-y-3 transition-all ${
                    hasDeficit
                      ? 'border-rose-300 dark:border-rose-800 ring-1 ring-rose-200 dark:ring-rose-950'
                      : isDueForNextInstallment
                      ? 'border-amber-300 dark:border-amber-800'
                      : 'border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-teal-700 dark:text-teal-400">
                        {inv.id}
                      </span>
                      <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                        {inv.patientName}
                      </h3>
                      <div className="text-[11px] text-stone-500">{inv.phone}</div>
                    </div>

                    <div>
                      {hasDeficit ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800">
                          Deficit Alert!
                        </span>
                      ) : inv.balanceDue === 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                          Fully Covered
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
                          Due Milestone
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-2.5 text-xs space-y-1 border border-stone-100 dark:border-stone-700">
                    <div className="font-semibold text-stone-800 dark:text-stone-200 text-xs truncate">
                      {inv.packageName}
                    </div>
                    <div className="flex justify-between text-stone-500 text-[11px]">
                      <span>Effective rate:</span>
                      <span className="font-bold text-stone-700 dark:text-stone-300">
                        ₹{perSessionRate.toFixed(0)} / session
                      </span>
                    </div>
                  </div>

                  {/* Dual Comparison Matrix */}
                  <div className="space-y-2 text-xs">
                    {/* Delivered vs Total */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-stone-600 dark:text-stone-400">Clinical Sessions Delivered:</span>
                        <span className="font-bold text-stone-900 dark:text-stone-100">
                          {deliveredSessions} / {inv.packageSessionsTotal}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-700 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (deliveredSessions / inv.packageSessionsTotal) * 100
                            )}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Paid vs Total */}
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-stone-600 dark:text-stone-400">Financial Sessions Covered:</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          {paidSessions} / {inv.packageSessionsTotal}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (paidSessions / inv.packageSessionsTotal) * 100
                            )}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial Risk Notice */}
                  {hasDeficit ? (
                    <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl p-2.5 text-xs text-rose-900 dark:text-rose-200">
                      <div className="font-bold flex items-center text-rose-700 dark:text-rose-300">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        {inv.uncoveredDeliveredSessions} Sessions Delivered Without Payment
                      </div>
                      <p className="text-[11px] text-rose-800 dark:text-rose-300 mt-0.5">
                        Clinic exposure: ₹{(inv.uncoveredDeliveredSessions * perSessionRate).toFixed(0)}. Settle balance of ₹{inv.balanceDue.toLocaleString('en-IN')} before Session {deliveredSessions + 1}.
                      </p>
                    </div>
                  ) : inv.balanceDue > 0 ? (
                    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl p-2.5 text-xs text-amber-900 dark:text-amber-200">
                      <div className="font-bold flex items-center text-amber-800 dark:text-amber-300">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Next Milestone Balance: ₹{inv.balanceDue.toLocaleString('en-IN')}
                      </div>
                      <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                        {paidSessions - deliveredSessions} prepaid sessions remaining before next payment cutoff ({inv.dueDate}).
                      </p>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl p-2.5 text-xs text-emerald-900 dark:text-emerald-200">
                      <div className="font-bold flex items-center text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Zero Financial Exposure
                      </div>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {inv.sessionsRemaining} treatment sessions ready to deliver with full upfront coverage.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <button
                      onClick={() => downloadReceiptPDF(inv)}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center transition-colors cursor-pointer"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      PDF Receipt
                    </button>

                    {inv.balanceDue > 0 ? (
                      <button
                        onClick={() => handleOpenPaymentModal(inv)}
                        className="px-3 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-colors cursor-pointer flex items-center shadow-xs"
                      >
                        <IndianRupee className="w-3 h-3 mr-0.5" />
                        Record ₹{inv.balanceDue.toLocaleString('en-IN')}
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                        <Check className="w-3.5 h-3.5 mr-0.5" /> Settled
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT REMINDERS & UPI MESSENGER */}
      {activeSubTab === 'reminders' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                  Automated Digital Payment Reminders & UPI Nudges
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Send polite, pre-formatted payment collection messages via WhatsApp or SMS to patients with unpaid package balances.
                </p>
              </div>

              <div className="flex items-center space-x-2 bg-stone-50 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
                <span className="text-stone-500">Clinic UPI VPA:</span>
                <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
                  {CLINIC_BILLING_METADATA.upiId}
                </span>
              </div>
            </div>

            <div className="divide-y divide-stone-100 dark:divide-stone-800 mt-3">
              {invoices
                .filter((inv) => inv.balanceDue > 0)
                .map((inv) => (
                  <div
                    key={inv.id}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 px-3 rounded-xl transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                          {inv.patientName}
                        </span>
                        <span className="text-xs text-stone-500">({inv.phone})</span>
                        {inv.uncoveredDeliveredSessions > 0 && (
                          <span className="px-2 py-0.2 rounded-full text-[9px] font-black uppercase bg-rose-500 text-white animate-pulse">
                            {inv.uncoveredDeliveredSessions} Sessions Deficit
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-600 dark:text-stone-300">
                        {inv.packageName} • Due Date:{' '}
                        <strong className="text-stone-900 dark:text-stone-100">{inv.dueDate}</strong>
                      </div>
                      <div className="text-xs text-stone-500 flex items-center space-x-3 pt-0.5">
                        <span>
                          Delivered: <strong>{inv.sessionsDelivered}</strong> / {inv.packageSessionsTotal}
                        </span>
                        <span>•</span>
                        <span>
                          Paid: <strong>₹{inv.amountPaid.toLocaleString('en-IN')}</strong>
                        </span>
                        <span>•</span>
                        <span className="text-rose-600 dark:text-rose-400 font-bold">
                          Balance Due: ₹{inv.balanceDue.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyReminder(inv)}
                        className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs flex items-center transition-colors cursor-pointer"
                      >
                        {copySuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            Copied Text!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-1" />
                            Copy Template
                          </>
                        )}
                      </button>

                      <a
                        href={`https://wa.me/${inv.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          getReminderMessage(inv)
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center transition-colors cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        Open WhatsApp
                      </a>

                      <button
                        onClick={() => handleOpenPaymentModal(inv)}
                        className="px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs flex items-center transition-colors cursor-pointer shadow-xs"
                      >
                        <IndianRupee className="w-3.5 h-3.5 mr-1" />
                        Record Pay
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: DIGITAL RECEIPT & INVOICE PREVIEW MODAL */}
      {receiptPreviewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden my-6">
            {/* Modal Top Bar */}
            <div className="p-4 bg-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Receipt className="w-5 h-5" />
                <span className="font-bold text-sm">
                  Digital Receipt & Tax Invoice Preview ({receiptPreviewInvoice.receiptNumber})
                </span>
              </div>
              <button
                onClick={() => setReceiptPreviewInvoice(null)}
                className="p-1 rounded-lg hover:bg-teal-700 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Digital Receipt Body */}
            <div className="p-6 space-y-6 text-xs text-stone-800 dark:text-stone-200 max-h-[75vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-stone-200 dark:border-stone-800 pb-4">
                <div>
                  <h3 className="font-black text-lg text-teal-800 dark:text-teal-300 tracking-tight">
                    {CLINIC_BILLING_METADATA.clinicName.toUpperCase()}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">{CLINIC_BILLING_METADATA.tagline}</p>
                  <p className="text-[10px] text-stone-400 mt-1 max-w-xs">{CLINIC_BILLING_METADATA.address}</p>
                  <p className="text-[10px] text-stone-400">GSTIN: {CLINIC_BILLING_METADATA.gstin} | SAC: 999312</p>
                </div>

                <div className="text-right">
                  <div className="font-black text-base text-stone-900 dark:text-stone-100">
                    TAX INVOICE & RECEIPT
                  </div>
                  <div className="font-mono text-xs font-bold text-teal-700 dark:text-teal-400 mt-0.5">
                    {receiptPreviewInvoice.receiptNumber}
                  </div>
                  <div className="text-[11px] text-stone-500">Invoice: {receiptPreviewInvoice.id}</div>
                  <div className="text-[11px] text-stone-500">
                    Date: {receiptPreviewInvoice.lastPaymentDate || receiptPreviewInvoice.invoiceDate}
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`p-2.5 rounded-xl font-bold flex justify-between items-center text-xs ${
                  receiptPreviewInvoice.paymentStatus === 'Paid'
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                }`}
              >
                <span>
                  {receiptPreviewInvoice.paymentStatus === 'Paid'
                    ? 'STATUS: PAID IN FULL - ZERO BALANCE'
                    : `STATUS: PARTIAL PAYMENT (OUTSTANDING BALANCE: ₹${receiptPreviewInvoice.balanceDue.toLocaleString('en-IN')})`}
                </span>
                <span className="text-[10px] uppercase font-semibold">
                  {receiptPreviewInvoice.careType === 'Home' ? 'Elder Home Visit' : 'In-Clinic Bay'}
                </span>
              </div>

              {/* Patient & Clinical Grid */}
              <div className="grid grid-cols-2 gap-4 bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400">Patient Details</span>
                  <div className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-0.5">
                    {receiptPreviewInvoice.patientName}
                  </div>
                  <div className="text-stone-600 dark:text-stone-300 text-[11px]">
                    {receiptPreviewInvoice.age} yrs, {receiptPreviewInvoice.gender} • {receiptPreviewInvoice.phone}
                  </div>
                  <div className="text-stone-500 text-[10px] mt-0.5">{receiptPreviewInvoice.address}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400">Clinical Package</span>
                  <div className="font-bold text-stone-900 dark:text-stone-100 text-xs mt-0.5">
                    {receiptPreviewInvoice.packageName}
                  </div>
                  <div className="text-stone-500 text-[11px] mt-0.5">
                    Diagnosis: {receiptPreviewInvoice.diagnosis}
                  </div>
                  <div className="text-stone-500 text-[10px] mt-0.5">
                    Attending: {receiptPreviewInvoice.attendingTherapist}
                  </div>
                </div>
              </div>

              {/* Line Item Breakdown */}
              <table className="w-full text-left border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
                <thead className="bg-stone-100 dark:bg-stone-800 font-bold text-[10px] uppercase text-stone-500">
                  <tr>
                    <th className="p-2.5">Service Description</th>
                    <th className="p-2.5 text-center">Sessions</th>
                    <th className="p-2.5 text-right">Rate / Sess</th>
                    <th className="p-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  <tr>
                    <td className="p-2.5">
                      <div className="font-bold">{receiptPreviewInvoice.packageName}</div>
                      <div className="text-[10px] text-stone-400">
                        Physiotherapy & Rehabilitation (SAC 999312 - GST Exempt)
                      </div>
                    </td>
                    <td className="p-2.5 text-center">{receiptPreviewInvoice.packageSessionsTotal}</td>
                    <td className="p-2.5 text-right">
                      ₹{(receiptPreviewInvoice.grossFee / receiptPreviewInvoice.packageSessionsTotal).toFixed(0)}
                    </td>
                    <td className="p-2.5 text-right font-bold">
                      ₹{receiptPreviewInvoice.grossFee.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  {receiptPreviewInvoice.discountAmount > 0 && (
                    <tr className="text-emerald-700 dark:text-emerald-400">
                      <td className="p-2.5">Package Concession / Discount ({receiptPreviewInvoice.discountReason})</td>
                      <td className="p-2.5 text-center">-</td>
                      <td className="p-2.5 text-right">-</td>
                      <td className="p-2.5 text-right font-bold">
                        -₹{receiptPreviewInvoice.discountAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Summary Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-right">
                  <div className="flex justify-between text-stone-500">
                    <span>Net Package Fee:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      ₹{receiptPreviewInvoice.netPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                    <span>Total Amount Paid:</span>
                    <span>₹{receiptPreviewInvoice.amountPaid.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-stone-200 dark:border-stone-700 pt-1.5">
                    <span className={receiptPreviewInvoice.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                      Balance Due:
                    </span>
                    <span className={receiptPreviewInvoice.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                      ₹{receiptPreviewInvoice.balanceDue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bank & UPI Settle info */}
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-[10px] text-stone-600 dark:text-stone-400">
                <div className="font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Payment Details / Settle Balance:
                </div>
                <div>UPI VPA: {CLINIC_BILLING_METADATA.upiId} | Bank: {CLINIC_BILLING_METADATA.bankName}</div>
                <div>A/C: {CLINIC_BILLING_METADATA.accountNumber} | IFSC: {CLINIC_BILLING_METADATA.ifscCode}</div>
              </div>
            </div>

            {/* Modal Footer CTAs */}
            <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 font-semibold text-xs flex items-center transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                Print Receipt
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setReceiptPreviewInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 font-medium text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => downloadReceiptPDF(receiptPreviewInvoice)}
                  className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: RECORD PAYMENT MODAL */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IndianRupee className="w-5 h-5" />
                <span className="font-bold text-sm">
                  Record Payment for {paymentModalInvoice.patientName}
                </span>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="p-1 rounded-lg hover:bg-emerald-700 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-5 space-y-4 text-xs">
              <div className="bg-stone-50 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Package:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {paymentModalInvoice.packageName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Net Fee:</span>
                  <span className="font-bold">₹{paymentModalInvoice.netPayable.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Already Paid:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    ₹{paymentModalInvoice.amountPaid.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-stone-200 dark:border-stone-700 pt-1 text-rose-600 dark:text-rose-400">
                  <span>Current Balance Due:</span>
                  <span>₹{paymentModalInvoice.balanceDue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Amount to Collect (INR)*
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="1"
                    max={paymentModalInvoice.balanceDue}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    required
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Payment Mode*
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm / BHIM)</option>
                  <option value="Credit Card">Credit Card (POS Terminal)</option>
                  <option value="Debit Card">Debit Card (POS Terminal)</option>
                  <option value="Net Banking">Net Banking (NEFT / IMPS)</option>
                  <option value="Cash">Cash at Reception</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Transaction Reference / UTR Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI-9284719284 or HDFC-POS-8821"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Collected By
                </label>
                <input
                  type="text"
                  value={paymentCollector}
                  onChange={(e) => setPaymentCollector(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Confirm & Update Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE NEW PACKAGE INVOICE */}
      {isNewInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden my-6">
            <div className="p-4 bg-teal-800 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-5 h-5" />
                <span className="font-bold text-sm">Create New Multi-Session Package Invoice</span>
              </div>
              <button
                onClick={() => setIsNewInvoiceModalOpen(false)}
                className="p-1 rounded-lg hover:bg-teal-700 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewInvoice} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Patient Full Name*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Phone Number*
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatientPhone}
                    onChange={(e) => setNewPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-teal-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Gender
                  </label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Care Mode*
                  </label>
                  <select
                    value={newCareType}
                    onChange={(e) => {
                      const mode = e.target.value as ServiceLocation;
                      setNewCareType(mode);
                      if (mode === 'Home') {
                        setNewGrossFee(newPackageSessions * 1500);
                      } else {
                        setNewGrossFee(newPackageSessions * 1000);
                      }
                    }}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-bold"
                  >
                    <option value="Clinic">In-Clinic Bay</option>
                    <option value="Home">Home Visit Care</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Package Name & Sessions*
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[10, 15, 20, 25].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => {
                        setNewPackageSessions(count);
                        const rate = newCareType === 'Home' ? 1400 : 950;
                        setNewGrossFee(count * (rate + 50));
                        setNewPackageTitle(`${count}-Session Comprehensive Physical Rehabilitation`);
                      }}
                      className={`py-1.5 rounded-lg border text-center font-bold cursor-pointer transition-colors ${
                        newPackageSessions === count
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {count} Sessions
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={newPackageTitle}
                  onChange={(e) => setNewPackageTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Clinical Diagnosis
                </label>
                <input
                  type="text"
                  value={newDiagnosis}
                  onChange={(e) => setNewDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Gross Package Fee (INR)*
                  </label>
                  <input
                    type="number"
                    value={newGrossFee}
                    onChange={(e) => setNewGrossFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Package Discount / Concession (INR)
                  </label>
                  <input
                    type="number"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Initial Advance / Deposit (INR)
                  </label>
                  <input
                    type="number"
                    value={newInitialDeposit}
                    onChange={(e) => setNewInitialDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-xl font-bold text-emerald-700"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Net: ₹{Math.max(0, newGrossFee - newDiscount)} | Remaining Due: ₹
                    {Math.max(0, newGrossFee - newDiscount - newInitialDeposit)}
                  </span>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                    Deposit Mode
                  </label>
                  <select
                    value={newInitialMode}
                    onChange={(e) => setNewInitialMode(e.target.value as PaymentMode)}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded-xl"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Generate Invoice & Open Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PAYMENT NUDGE POPUP */}
      {reminderModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="p-4 bg-amber-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5" />
                <span className="font-bold text-sm">
                  Send UPI Payment Reminder to {reminderModalInvoice.patientName}
                </span>
              </div>
              <button
                onClick={() => setReminderModalInvoice(null)}
                className="p-1 rounded-lg hover:bg-amber-600 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 font-mono text-[11px] whitespace-pre-wrap text-stone-800 dark:text-stone-200">
                {getReminderMessage(reminderModalInvoice)}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleCopyReminder(reminderModalInvoice)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold flex items-center transition-colors cursor-pointer"
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Copy Text
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/${reminderModalInvoice.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    getReminderMessage(reminderModalInvoice)
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Send on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
