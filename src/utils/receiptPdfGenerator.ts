import { jsPDF } from 'jspdf';
import { PatientInvoice, PaymentTransaction } from '../types';
import { CLINIC_BILLING_METADATA } from '../data/billingDefaults';

/**
 * Generates an authentic, high-resolution Digital Receipt & Tax Invoice PDF
 * for Sahakar Physio & Rehabilitation Clinic.
 */
export function generateReceiptPDF(
  invoice: PatientInvoice,
  activeTransaction?: PaymentTransaction
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Colors
  const primaryTeal = [15, 118, 110]; // #0f766e
  const darkTeal = [17, 94, 89];    // #115e59
  const textDark = [30, 41, 59];     // #1e293b
  const textMuted = [100, 116, 139]; // #64748b
  const lightBg = [248, 250, 252];   // #f8fafc
  const emeraldColor = [16, 185, 129];
  const amberColor = [217, 119, 6];
  const roseColor = [225, 29, 72];

  let currentY = 16;

  // Top Accent Bar
  doc.setFillColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Clinic Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.text(CLINIC_BILLING_METADATA.clinicName.toUpperCase(), margin, currentY);

  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(CLINIC_BILLING_METADATA.tagline, margin, currentY);

  currentY += 4.5;
  doc.setFontSize(8);
  doc.text(CLINIC_BILLING_METADATA.address, margin, currentY);

  currentY += 4;
  doc.text(`Phone: ${CLINIC_BILLING_METADATA.phone} | Email: ${CLINIC_BILLING_METADATA.email}`, margin, currentY);

  currentY += 4;
  doc.text(`GSTIN: ${CLINIC_BILLING_METADATA.gstin} | SAC Code: ${CLINIC_BILLING_METADATA.sacCode} (Physiotherapy Healthcare)`, margin, currentY);

  // Document Title & Badge (Right aligned)
  const headerRightX = pageWidth - margin;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text('DIGITAL RECEIPT & INVOICE', headerRightX, 16, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Receipt #: ${activeTransaction?.receiptNumber || invoice.receiptNumber}`, headerRightX, 22, { align: 'right' });
  doc.text(`Invoice Ref: ${invoice.id}`, headerRightX, 26, { align: 'right' });
  doc.text(`Date: ${activeTransaction?.date || invoice.lastPaymentDate || invoice.invoiceDate}`, headerRightX, 30, { align: 'right' });

  // Status Stamp Badge
  currentY += 5;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  // Status Pill
  const isPaid = invoice.paymentStatus === 'Paid';
  const isPartial = invoice.paymentStatus === 'Partial';
  const isOverdue = invoice.paymentStatus === 'Overdue';

  const statusLabel = isPaid
    ? 'PAID IN FULL - ZERO BALANCE'
    : isPartial
    ? `PARTIAL PAYMENT - BALANCE DUE: Rs. ${invoice.balanceDue.toLocaleString('en-IN')}`
    : isOverdue
    ? `OVERDUE - IMMEDIATE PAYMENT REQUIRED: Rs. ${invoice.balanceDue.toLocaleString('en-IN')}`
    : `PENDING PAYMENT: Rs. ${invoice.balanceDue.toLocaleString('en-IN')}`;

  const statusColor = isPaid ? emeraldColor : isPartial ? amberColor : roseColor;

  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(margin, currentY, contentWidth, 7.5, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(statusLabel, margin + 4, currentY + 5.2);
  doc.text(`Care Mode: ${invoice.careType === 'Home' ? 'HOME VISIT CARE' : 'IN-CLINIC REHAB'}`, headerRightX - 4, currentY + 5.2, { align: 'right' });

  currentY += 12;

  // Two-column layout: Patient Details & Clinical Package Summary
  const colWidth = (contentWidth - 6) / 2;
  const col2X = margin + colWidth + 6;

  // Box 1: Patient Information
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin, currentY, colWidth, 34, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, colWidth, 34, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text('PATIENT DETAILS', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(invoice.patientName, margin + 4, currentY + 11.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Age/Gender: ${invoice.age} yrs, ${invoice.gender}`, margin + 4, currentY + 16.5);
  doc.text(`Phone: ${invoice.phone}`, margin + 4, currentY + 21);
  doc.text(`Address: ${invoice.address}`, margin + 4, currentY + 25.5);
  doc.text(`Attending PT: ${invoice.attendingTherapist}`, margin + 4, currentY + 30);

  // Box 2: Package & Treatment Overview
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(col2X, currentY, colWidth, 34, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(col2X, currentY, colWidth, 34, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text('PACKAGE & CLINICAL SUMMARY', col2X + 4, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(invoice.packageName.slice(0, 42), col2X + 4, currentY + 11.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Clinical Diagnosis: ${invoice.diagnosis.slice(0, 45)}`, col2X + 4, currentY + 16.5);
  doc.text(`Total Package Sessions: ${invoice.packageSessionsTotal} Sessions`, col2X + 4, currentY + 21);
  doc.text(`Sessions Completed to Date: ${invoice.sessionsDelivered} of ${invoice.packageSessionsTotal}`, col2X + 4, currentY + 25.5);
  doc.text(`Sessions Fully Covered: ${invoice.coveredSessionsCount} of ${invoice.packageSessionsTotal}`, col2X + 4, currentY + 30);

  currentY += 39;

  // Service Line Items Table Header
  doc.setFillColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.rect(margin, currentY, contentWidth, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('DESCRIPTION OF CLINICAL SERVICES', margin + 3, currentY + 4.8);
  doc.text('SAC', margin + 98, currentY + 4.8);
  doc.text('SESSIONS', margin + 114, currentY + 4.8);
  doc.text('RATE / SESS', margin + 138, currentY + 4.8);
  doc.text('TOTAL (INR)', headerRightX - 3, currentY + 4.8, { align: 'right' });

  currentY += 7;

  // Line Item 1: Package
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, currentY, contentWidth, 12, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 12, headerRightX, currentY + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(invoice.packageName, margin + 3, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Complete personalized rehabilitation protocol under ${invoice.attendingTherapist}`, margin + 3, currentY + 9);

  doc.text(invoice.hsnSacCode, margin + 98, currentY + 6.5);
  doc.text(`${invoice.packageSessionsTotal} Sessions`, margin + 114, currentY + 6.5);
  doc.text(`Rs. ${(invoice.grossFee / invoice.packageSessionsTotal).toFixed(0)}`, margin + 138, currentY + 6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Rs. ${invoice.grossFee.toLocaleString('en-IN')}`, headerRightX - 3, currentY + 6.5, { align: 'right' });

  currentY += 12;

  // Package Discount Row (if applicable)
  if (invoice.discountAmount > 0) {
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.rect(margin, currentY, contentWidth, 8, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY + 8, headerRightX, currentY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(emeraldColor[0], emeraldColor[1], emeraldColor[2]);
    doc.text(`Less: Package Savings / Concession (${invoice.discountReason || 'Multi-Session Discount'})`, margin + 3, currentY + 5.2);

    doc.setFont('helvetica', 'bold');
    doc.text(`- Rs. ${invoice.discountAmount.toLocaleString('en-IN')}`, headerRightX - 3, currentY + 5.2, { align: 'right' });

    currentY += 8;
  }

  // Payments Received Breakdown Header
  currentY += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text('PAYMENTS RECEIVED / TRANSACTION LEDGER', margin, currentY);

  currentY += 3;
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, currentY, contentWidth, 6, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text('DATE', margin + 3, currentY + 4.2);
  doc.text('MODE', margin + 32, currentY + 4.2);
  doc.text('TRANSACTION / UTR REF', margin + 68, currentY + 4.2);
  doc.text('COLLECTED BY', margin + 118, currentY + 4.2);
  doc.text('AMOUNT PAID', headerRightX - 3, currentY + 4.2, { align: 'right' });

  currentY += 6;

  // Transactions list
  if (invoice.transactions.length > 0) {
    invoice.transactions.forEach((txn) => {
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, currentY, contentWidth, 6.5, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(margin, currentY + 6.5, headerRightX, currentY + 6.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.text(txn.date, margin + 3, currentY + 4.5);
      doc.text(txn.mode, margin + 32, currentY + 4.5);
      doc.text(txn.referenceNo.slice(0, 24), margin + 68, currentY + 4.5);
      doc.text(txn.collectedBy.slice(0, 20), margin + 118, currentY + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(emeraldColor[0], emeraldColor[1], emeraldColor[2]);
      doc.text(`Rs. ${txn.amount.toLocaleString('en-IN')}`, headerRightX - 3, currentY + 4.5, { align: 'right' });

      currentY += 6.5;
    });
  } else {
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, currentY, contentWidth, 6.5, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text('No payment recorded to date. Full invoice balance pending.', margin + 3, currentY + 4.5);
    currentY += 6.5;
  }

  currentY += 3;

  // Financial Summary Totals & Outstanding Box
  const summaryBoxWidth = 85;
  const summaryBoxX = headerRightX - summaryBoxWidth;

  // Left Note box: Multi-Session Package Health Notice
  const noticeBoxWidth = contentWidth - summaryBoxWidth - 6;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(margin, currentY, noticeBoxWidth, 32, 1.5, 1.5, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, noticeBoxWidth, 32, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text('MULTI-SESSION PACKAGE BALANCE STATUS', margin + 3, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`• Total Contracted Package: ${invoice.packageSessionsTotal} Sessions`, margin + 3, currentY + 10);
  doc.text(`• Sessions Delivered to Date: ${invoice.sessionsDelivered} Sessions`, margin + 3, currentY + 14.5);
  doc.text(`• Sessions Covered by Payments: ${invoice.coveredSessionsCount} Sessions`, margin + 3, currentY + 19);

  if (invoice.uncoveredDeliveredSessions > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(roseColor[0], roseColor[1], roseColor[2]);
    doc.text(`• ACTION REQUIRED: ${invoice.uncoveredDeliveredSessions} sessions delivered beyond paid coverage!`, margin + 3, currentY + 23.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`  Please clear balance of Rs. ${invoice.balanceDue.toLocaleString('en-IN')} prior to Session ${invoice.sessionsDelivered + 1}.`, margin + 3, currentY + 27.5);
  } else if (invoice.balanceDue > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(amberColor[0], amberColor[1], amberColor[2]);
    doc.text(`• Next Installment Due: Rs. ${invoice.balanceDue.toLocaleString('en-IN')} by ${invoice.dueDate}`, margin + 3, currentY + 23.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`  Coverage remaining: ${invoice.coveredSessionsCount - invoice.sessionsDelivered} prepaid sessions before next due.`, margin + 3, currentY + 27.5);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(emeraldColor[0], emeraldColor[1], emeraldColor[2]);
    doc.text('• Account Fully Funded: All 20 sessions covered in advance.', margin + 3, currentY + 23.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`  ${invoice.sessionsRemaining} remaining sessions available to schedule.`, margin + 3, currentY + 27.5);
  }

  // Right Summary Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(summaryBoxX, currentY, summaryBoxWidth, 32, 1.5, 1.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(summaryBoxX, currentY, summaryBoxWidth, 32, 1.5, 1.5, 'S');

  let sumY = currentY + 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Net Package Fee:', summaryBoxX + 4, sumY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`Rs. ${invoice.netPayable.toLocaleString('en-IN')}`, headerRightX - 4, sumY, { align: 'right' });

  sumY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('Total Amount Collected:', summaryBoxX + 4, sumY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(emeraldColor[0], emeraldColor[1], emeraldColor[2]);
  doc.text(`Rs. ${invoice.amountPaid.toLocaleString('en-IN')}`, headerRightX - 4, sumY, { align: 'right' });

  sumY += 5.5;
  doc.setDrawColor(226, 232, 240);
  doc.line(summaryBoxX + 3, sumY - 1, headerRightX - 3, sumY - 1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(invoice.balanceDue > 0 ? roseColor[0] : emeraldColor[0], invoice.balanceDue > 0 ? roseColor[1] : emeraldColor[1], invoice.balanceDue > 0 ? roseColor[2] : emeraldColor[2]);
  doc.text('OUTSTANDING BALANCE:', summaryBoxX + 4, sumY + 3.5);
  doc.text(`Rs. ${invoice.balanceDue.toLocaleString('en-IN')}`, headerRightX - 4, sumY + 3.5, { align: 'right' });

  sumY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Effective rate: Rs. ${invoice.perSessionEffectiveRate.toFixed(0)} / session`, summaryBoxX + 4, sumY);

  currentY += 36;

  // Bank & UPI QR Payment Guidance (Bottom section)
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text('HOW TO SETTLE BALANCE / PAYMENT DETAILS', margin + 4, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`UPI VPA: ${CLINIC_BILLING_METADATA.upiId} (Google Pay / PhonePe / Paytm / BHIM)`, margin + 4, currentY + 10);
  doc.text(`Bank Transfer: ${CLINIC_BILLING_METADATA.bankName} | A/C: ${CLINIC_BILLING_METADATA.accountNumber} | IFSC: ${CLINIC_BILLING_METADATA.ifscCode}`, margin + 4, currentY + 14.5);
  doc.text(`Beneficiary: ${CLINIC_BILLING_METADATA.accountName} | Branch: ${CLINIC_BILLING_METADATA.branch}`, margin + 4, currentY + 19);

  // Digital Signature & Clinic Seal
  const sigX = headerRightX - 52;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.text('For SAHAKAR PHYSIO & REHAB', sigX, currentY + 6);

  doc.setDrawColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.rect(sigX, currentY + 8, 48, 12, 'S');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.text('[Digitally Verified & Signed]', sigX + 7, currentY + 13);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('Authorized Billing Officer', sigX + 9, currentY + 18);

  currentY += 27;

  // Legal Footer & GST Exemption Note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('• Statutory Note: Healthcare services by a clinical establishment or an authorized medical practitioner are exempt from GST vide Notification No. 12/2017-Central Tax (Rate).', margin, currentY);
  currentY += 3.5;
  doc.text('• Package Validity: Multi-session therapy packages are non-transferable and valid for 180 days from the invoice issuance date. 24-hour advance notice required for cancellations.', margin, currentY);
  currentY += 3.5;
  doc.text(`• Computer-generated digital receipt issued by ${CLINIC_BILLING_METADATA.clinicName} • Thank you for entrusting your physical recovery to us.`, margin, currentY);

  return doc;
}

/**
 * Convenience method to trigger direct browser download of the receipt PDF
 */
export function downloadReceiptPDF(invoice: PatientInvoice, activeTransaction?: PaymentTransaction) {
  const doc = generateReceiptPDF(invoice, activeTransaction);
  const cleanName = invoice.patientName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Receipt_${invoice.receiptNumber}_${cleanName}.pdf`;
  doc.save(filename);
}
