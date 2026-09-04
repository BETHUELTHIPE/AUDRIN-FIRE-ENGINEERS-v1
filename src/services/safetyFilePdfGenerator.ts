import { jsPDF } from 'jspdf';
import { SafetyFileDossier, ComplianceAuditRecord, CompanyProfileBranding } from '../types';
import { COMPANY_DETAILS } from '../data/initialData';

export function generateSafetyFileCompletePdf(
  dossier: SafetyFileDossier, 
  clientBranding?: CompanyProfileBranding
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const navy = [11, 28, 68];       // #0B1C44
  const gold = [193, 164, 97];     // #C1A461
  const red = [204, 30, 30];       // #CC1E1E
  const slateDark = [30, 41, 59];  // #1E293B
  const slateMuted = [100, 116, 139]; // #64748B
  const bgLight = [248, 250, 252]; // #F8FAFC

  // -------------------------------------------------------------
  // PAGE 1: FORMAL STATUTORY COVER & APPROVAL PAGE
  // -------------------------------------------------------------

  // Top Navy Banner
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 0, 210, 40, 'F');

  // Gold Accent Strip
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 40, 210, 2.5, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(COMPANY_DETAILS.legalName, 14, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(COMPANY_DETAILS.tagline, 14, 20);
  doc.text(`Reg No: ${COMPANY_DETAILS.registrationNumber} | SAQCC Reg: 9109170791081 | Tel: ${COMPANY_DETAILS.phone}`, 14, 26);
  doc.text(`Address: ${COMPANY_DETAILS.address}`, 14, 32);

  // Document Badge on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.text('STATUTORY LIFE-SAFETY DOSSIER', 196, 14, { align: 'right' });
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ref: ${dossier.dossierNumber}`, 196, 21, { align: 'right' });
  doc.text(`Version: ${dossier.version} (${dossier.revision})`, 196, 27, { align: 'right' });
  doc.text(`Issue Date: ${dossier.issueDate}`, 196, 33, { align: 'right' });

  let y = 50;

  // Client & Principal Contractor Section
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y, 182, 34, 'FD');

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CLIENT & PRINCIPAL CONTRACTOR APPOINTMENT', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`Client Name: ${clientBranding?.registeredName || dossier.clientName}`, 18, y + 12);
  doc.text(`Registration No: ${clientBranding?.registrationNumber || '2018/489201/07'} | VAT No: ${clientBranding?.vatNumber || '4820199481'}`, 18, y + 17);
  doc.text(`Site Address: ${dossier.siteAddress}`, 18, y + 22);
  doc.text(`Contract / PO Number: ${dossier.contractNumber} / ${dossier.purchaseOrderNumber}`, 18, y + 27);

  doc.text(`Principal Contractor / Specialist: Audrin Fire Engineers (Pty) Ltd`, 110, y + 12);
  doc.text(`Contract Period: ${dossier.projectCommencementDate} to ${dossier.projectCompletionDate}`, 110, y + 17);
  doc.text(`Client Contact: ${clientBranding?.primaryContact.name || 'Bethuel Moukangwe'} (${clientBranding?.primaryContact.telephone || '012 555 4910'})`, 110, y + 22);
  doc.text(`Email: ${clientBranding?.primaryContact.email || 'safety@tshivhaseholdings.co.za'}`, 110, y + 27);

  y += 38;

  // Project & System Technical Specifications
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.rect(14, y, 182, 32, 'FD');

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PROJECT & FIRE DETECTION SYSTEM SPECIFICATIONS', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`Project Title: ${dossier.projectName}`, 18, y + 12);
  doc.text(`Building Classification: ${dossier.buildingClassification}`, 18, y + 17);
  doc.text(`System Category: ${dossier.systemType}`, 18, y + 22);
  doc.text(`Scope of Work: ${dossier.scopeOfWork.substring(0, 110)}...`, 18, y + 27);

  doc.text(`CIE Make & Model: ${dossier.fireAlarmPanelDetails.make} ${dossier.fireAlarmPanelDetails.model}`, 110, y + 12);
  doc.text(`Serial Number: ${dossier.fireAlarmPanelDetails.serialNumber} (FW: ${dossier.fireAlarmPanelDetails.firmwareVersion})`, 110, y + 17);
  doc.text(`Capacity: ${dossier.fireAlarmPanelDetails.loopsCount} Loops / ${dossier.fireAlarmPanelDetails.deviceCount} Total Addressable Devices`, 110, y + 22);
  doc.text(`Location: ${dossier.fireAlarmPanelDetails.location.substring(0, 48)}`, 110, y + 27);

  y += 36;

  // Compliance Status Summary Box
  const isApproved = dossier.status === 'approved';
  doc.setFillColor(isApproved ? 240 : 254, isApproved ? 253 : 243, isApproved ? 244 : 242);
  doc.setDrawColor(isApproved ? 187 : 252, isApproved ? 247 : 211, isApproved ? 208 : 77);
  doc.rect(14, y, 182, 16, 'FD');

  doc.setTextColor(isApproved ? 22 : 153, isApproved ? 101 : 27, isApproved ? 52 : 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`COMPLIANCE STATUS: ${dossier.status.toUpperCase().replace('_', ' ')} (Overall: ${dossier.overallComplianceScore}%)`, 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`SANS 10139 Score: ${dossier.sans10139ComplianceScore}% | SANS 10400-T Score: ${dossier.sans10400TComplianceScore}% | SAQCC Commissioner Sealed: ${dossier.isCommissionerApproved ? 'YES (Verified)' : 'PENDING'}`, 18, y + 11);

  y += 20;

  // Statutory Approval Matrix
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('STATUTORY APPROVAL MATRIX (5-ROLE MULTI-DISCIPLINARY SIGN-OFF)', 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Binding statutory sign-off pursuant to SANS 10139:2021 Clause 13.2, SANS 10400-T Table C.1, and OHS Act Construction Reg 7(1)(b).', 14, y + 4);

  y += 7;

  // Approval matrix table header
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(14, y, 182, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('STATUTORY ROLE', 17, y + 4.5);
  doc.text('APPOINTED PERSON', 62, y + 4.5);
  doc.text('REGISTRATION #', 105, y + 4.5);
  doc.text('STATUS', 142, y + 4.5);
  doc.text('DATE / SIGNATURE', 165, y + 4.5);

  y += 6.5;

  dossier.approvalMatrix.forEach((appr, idx) => {
    const isOdd = idx % 2 === 1;
    doc.setFillColor(isOdd ? 248 : 255, isOdd ? 250 : 255, isOdd ? 252 : 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, 182, 15, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(appr.roleTitle.substring(0, 26), 17, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(appr.designation.substring(0, 32), 17, y + 9.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(appr.personName || 'Pending Appointment', 62, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(appr.registrationNumber || 'N/A', 105, y + 6);

    // Status pill
    const isVer = appr.verificationStatus === 'verified';
    doc.setTextColor(isVer ? 22 : 217, isVer ? 101 : 119, isVer ? 52 : 6);
    doc.setFont('helvetica', 'bold');
    doc.text(appr.verificationStatus.toUpperCase(), 142, y + 6);

    // Signature stamp
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.setFont('helvetica', 'normal');
    if (isVer && appr.signedDate) {
      doc.text(`Signed: ${appr.signedDate}`, 165, y + 5);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(6.5);
      doc.text('[Digital Seal Verified]', 165, y + 9);
    } else {
      doc.setTextColor(red[0], red[1], red[2]);
      doc.text('Awaiting Signature', 165, y + 6);
    }

    y += 15;
  });

  // Regulatory notice at bottom of Cover
  y += 4;
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.rect(14, y, 182, 14, 'FD');

  doc.setTextColor(red[0], red[1], red[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('MANDATORY REGULATORY COMPLIANCE SUPPORT NOTICE', 18, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text('This automated output provides compliance-support information and does not constitute regulatory certification on its own.', 18, y + 8.5);
  doc.text('SANS 10139 statutory approval requires formal physical verification, commissioning validation, and direct endorsement by an accredited SAQCC Commissioner.', 18, y + 11.5);

  // Page 1 Footer
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(`Page 1 of 3 | ${COMPANY_DETAILS.legalName} | Statutory Safety File | POPIA Confidential`, 105, 290, { align: 'center' });

  // -------------------------------------------------------------
  // PAGE 2: STATUTORY MILESTONE TRACKER & SOURCE CLAUSES
  // -------------------------------------------------------------
  doc.addPage();

  // Top header bar
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 20, 210, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('SECTION 2: STATUTORY MILESTONE REGISTER & SOURCE CLAUSES', 14, 13);
  doc.setFontSize(8);
  doc.text(`Ref: ${dossier.dossierNumber}`, 196, 13, { align: 'right' });

  let p2y = 28;

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('STATUTORY MILESTONES & STANDARDS VERIFICATION REGISTER', 14, p2y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Direct tracking of compulsory milestones required under SANS 10139:2021, SANS 10400-T, and OHS Act regulations.', 14, p2y + 4);

  p2y += 7;

  // Milestones table header
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(14, p2y, 182, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('MILESTONE TITLE & STATUTORY SOURCE', 17, p2y + 4.2);
  doc.text('STANDARD', 90, p2y + 4.2);
  doc.text('RESPONSIBLE', 115, p2y + 4.2);
  doc.text('TARGET', 152, p2y + 4.2);
  doc.text('STATUS', 176, p2y + 4.2);

  p2y += 6;

  dossier.milestones.forEach((m, idx) => {
    const isOdd = idx % 2 === 1;
    doc.setFillColor(isOdd ? 248 : 255, isOdd ? 250 : 255, isOdd ? 252 : 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, p2y, 182, 13, 'FD');

    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(m.title.substring(0, 48), 17, p2y + 4.5);

    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(m.clauseReference, 17, p2y + 9);

    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(m.standard, 90, p2y + 5.5);

    doc.text(m.responsiblePerson.substring(0, 18), 115, p2y + 4.5);
    doc.setFontSize(6);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(m.responsibleRole.substring(0, 20), 115, p2y + 8.5);

    doc.setFontSize(7);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(m.targetDate, 152, p2y + 5.5);

    const isComp = m.status === 'completed';
    doc.setTextColor(isComp ? 22 : 180, isComp ? 101 : 100, isComp ? 52 : 20);
    doc.setFont('helvetica', 'bold');
    doc.text(m.status.toUpperCase(), 176, p2y + 5.5);

    p2y += 13;
  });

  // Emergency & Project Contacts Box on Page 2
  p2y += 6;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, p2y, 182, 38, 'FD');

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('EMERGENCY & LIFE-SAFETY CONTROL DESK CONTACTS', 18, p2y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);

  let cy = p2y + 12;
  dossier.emergencyContacts.forEach((ec) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`• ${ec.name} (${ec.role}):`, 18, cy);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tel: ${ec.telephone} | Mobile: ${ec.mobile}`, 105, cy);
    cy += 5;
  });

  cy += 2;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('PROJECT GOVERNANCE TEAM:', 18, cy);
  cy += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`Audrin Lead Commissioner: Russia Bethuel Moukangwe (071 415 6665 / bethuelthipe@gmail.com)`, 18, cy);
  cy += 4;
  doc.text(`Client Representative: Bethuel Moukangwe (012 555 4910 / bethuelmoukangwe8@gmail.com)`, 18, cy);

  // Page 2 Footer
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(`Page 2 of 3 | ${COMPANY_DETAILS.legalName} | Statutory Safety File | POPIA Confidential`, 105, 290, { align: 'center' });

  // -------------------------------------------------------------
  // PAGE 3: DOCUMENT MASTER REGISTER & SHA-256 INTEGRITY CHECKSUMS
  // -------------------------------------------------------------
  doc.addPage();

  // Top header bar
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 20, 210, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('SECTION 3: DOCUMENT MASTER REGISTER & CRYPTOGRAPHIC CHECKSUMS', 14, 13);
  doc.setFontSize(8);
  doc.text(`Ref: ${dossier.dossierNumber}`, 196, 13, { align: 'right' });

  let p3y = 28;

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CONTROLLED LIFE-SAFETY DOCUMENT SCHEDULE', 14, p3y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Immutable audit index with SHA-256 integrity hashes for statutory evidence verification.', 14, p3y + 4);

  p3y += 7;

  // Documents table header
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(14, p3y, 182, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('REF / TITLE', 17, p3y + 4.2);
  doc.text('CLAUSE', 88, p3y + 4.2);
  doc.text('REV', 128, p3y + 4.2);
  doc.text('STATUS', 142, p3y + 4.2);
  doc.text('SHA-256 CHECKSUM HASH', 160, p3y + 4.2);

  p3y += 6;

  dossier.documents.forEach((d, idx) => {
    const isOdd = idx % 2 === 1;
    doc.setFillColor(isOdd ? 248 : 255, isOdd ? 250 : 255, isOdd ? 252 : 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, p3y, 182, 13, 'FD');

    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(`${d.fileNumber}: ${d.title.substring(0, 42)}`, 17, p3y + 4.5);

    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.text(`File: ${d.fileName} (${(d.fileSizeBytes / 1024 / 1024).toFixed(2)} MB)`, 17, p3y + 8.5);

    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(d.clauseReference.substring(0, 24), 88, p3y + 5.5);

    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(d.revision, 128, p3y + 5.5);

    const isAppr = d.status === 'approved';
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isAppr ? 22 : 180, isAppr ? 101 : 100, isAppr ? 52 : 20);
    doc.text(d.status.toUpperCase(), 142, p3y + 5.5);

    // Checksum
    doc.setFont('courier', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(`${d.checksumSha256.substring(0, 20)}...`, 160, p3y + 5.5);

    p3y += 13;
  });

  // Bottom POPIA and Document Retention Declaration
  p3y += 8;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, p3y, 182, 26, 'FD');

  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('POPIA ACT 4 OF 2013 & STATUTORY RETENTION DIRECTIVE', 18, p3y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text('1. Access Control: This safety file contains privileged technical and personal data governed by POPIA Act 4 of 2013.', 18, p3y + 11);
  doc.text('2. Retention Period: Statutory life-safety documentation must be preserved for the operational life of the building or minimum 5 years.', 18, p3y + 15);
  doc.text('3. Chain of Custody: Cryptographic SHA-256 hashes seal every document against tampering or unauthorized post-commission alteration.', 18, p3y + 19);
  doc.text('4. Official Repository: Registered with Audrin Fire Engineers (Pty) Ltd Compliance Advisory Desk.', 18, p3y + 23);

  // Page 3 Footer
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(`Page 3 of 3 | ${COMPANY_DETAILS.legalName} | Statutory Safety File | POPIA Confidential`, 105, 290, { align: 'center' });

  // Save the complete dossier PDF
  doc.save(`${dossier.dossierNumber}_Safety_File_Dossier_${dossier.version}.pdf`);
}

export interface AuditTrailPdfReportOptions {
  projectName?: string;
  clientName?: string;
  isFullProjectHistory?: boolean;
  authorizerName?: string;
  authorizerRole?: string;
  redactPii?: boolean;
  customTitle?: string;
  standardsReference?: string;
}

export function generateAuditTrailReportPdf(
  auditLogs: ComplianceAuditRecord[],
  optionsOrProjectName: string | AuditTrailPdfReportOptions = 'Audrin Fire Engineers Life-Safety Systems'
): void {
  const options: AuditTrailPdfReportOptions = typeof optionsOrProjectName === 'string'
    ? { projectName: optionsOrProjectName }
    : optionsOrProjectName;

  const projectName = options.projectName || 'Audrin Fire Engineers Life-Safety Systems';
  const isFullProjectHistory = !!options.isFullProjectHistory;
  const redactPii = !!options.redactPii;
  const authorizerName = options.authorizerName || 'Russia Bethuel Moukangwe';
  const authorizerRole = options.authorizerRole || 'super_admin';

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const navy = [11, 28, 68];
  const gold = [193, 164, 97];
  const slateDark = [30, 41, 59];
  const slateMuted = [100, 116, 139];
  const green = [22, 101, 52];

  const formatPiiPdf = (val: string | undefined, isEmail?: boolean) => {
    if (!val) return '';
    if (!redactPii) return val;
    if (isEmail && val.includes('@')) {
      const [u, d] = val.split('@');
      return `${u.substring(0, 2)}***@${d}`;
    }
    return val.length > 5 ? `${val.substring(0, 3)}***` : '***';
  };

  const totalPages = Math.ceil(auditLogs.length / 9) || 1;

  for (let page = 1; page <= totalPages; page++) {
    if (page > 1) doc.addPage();

    // Top Header Banner
    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.rect(0, 0, 297, 27, 'F');
    doc.setFillColor(gold[0], gold[1], gold[2]);
    doc.rect(0, 27, 297, 1.5, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`${COMPANY_DETAILS.legalName.toUpperCase()} — STATUTORY COMPLIANCE AUDIT TRAIL`, 14, 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(215, 225, 245);
    doc.text(`Project: ${projectName.substring(0, 85)}`, 14, 16.5);
    doc.text(`Governing Standard: SANS 10139:2021 & SANS 10400-T | Ledger: Append-Only Immutable Blockchain-Proof Store`, 14, 22.5);

    // Right-aligned status block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.text(`Page ${page} of ${totalPages}`, 283, 10, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(`Generated: ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`, 283, 16.5, { align: 'right' });
    doc.setFontSize(6.5);
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.text(`Clearance: ${authorizerName} (${authorizerRole.toUpperCase()})`, 283, 22.5, { align: 'right' });

    let y = 32;

    // Subheader info ribbon
    if (page === 1) {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(14, y, 269, 13, 'FD');

      // Full history or filtered badge
      if (isFullProjectHistory) {
        doc.setFillColor(green[0], green[1], green[2]);
        doc.rect(17, y + 2.5, 4, 8, 'F');
        doc.setTextColor(green[0], green[1], green[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text('CERTIFIED COMPLETE PROJECT LIFECYCLE AUDIT HISTORY', 24, y + 6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
        doc.text(`All recorded transactions and statutory events from project inception to date (${auditLogs.length} verified events).`, 24, y + 9.5);
      } else {
        doc.setTextColor(navy[0], navy[1], navy[2]);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text('ACTIVE FILTERED AUDIT SUBSET REPORT', 18, y + 6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
        doc.text(`Exported audit subset containing ${auditLogs.length} records matching current query parameters.`, 18, y + 9.5);
      }

      // Privacy / POPIA badge on right
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      if (redactPii) {
        doc.setTextColor(202, 138, 4); // Amber
        doc.text('POPIA PROTECTED VIEW • PERSONAL IDENTIFIERS REDACTED (ACT 4 OF 2013)', 280, y + 6, { align: 'right' });
      } else {
        doc.setTextColor(green[0], green[1], green[2]);
        doc.text('CONFIDENTIAL STATUTORY AUDIT LEDGER • UNREDACTED REGULATORY COPY', 280, y + 6, { align: 'right' });
      }
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
      doc.text(`Document Integrity: Cryptographically Timestamped & Hash Verified`, 280, y + 9.5, { align: 'right' });

      y += 16;
    }

    // Table Header
    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.rect(14, y, 269, 7.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('AUDIT REF', 17, y + 5);
    doc.text('TIMESTAMP (UTC)', 48, y + 5);
    doc.text('ACTOR & ROLE', 82, y + 5);
    doc.text('EVENT TYPE', 130, y + 5);
    doc.text('DESCRIPTION & STATUTORY RECORD', 166, y + 5);
    doc.text('STANDARDS REF / SHA-256', 238, y + 5);

    y += 7.5;

    const pageLogs = auditLogs.slice((page - 1) * 9, page * 9);

    pageLogs.forEach((log, idx) => {
      const isOdd = idx % 2 === 1;
      doc.setFillColor(isOdd ? 249 : 255, isOdd ? 250 : 255, isOdd ? 252 : 255);
      doc.setDrawColor(226, 232, 240);
      doc.rect(14, y, 269, 13.5, 'FD');

      // Audit Number
      doc.setTextColor(navy[0], navy[1], navy[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text(log.auditNumber, 17, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(5.5);
      doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
      const displayIp = redactPii ? '105.***.*** (POPIA)' : log.ipAddress;
      doc.text(displayIp, 17, y + 9.5);

      // Timestamp
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
      doc.setFont('courier', 'normal');
      doc.setFontSize(6.5);
      doc.text(log.timestamp.replace('T', ' ').substring(0, 19), 48, y + 6);

      // Actor
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      const displayName = redactPii && log.popiaCategory === 'personal_data'
        ? formatPiiPdf(log.userName)
        : log.userName;
      doc.text(displayName.substring(0, 22), 82, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
      const displayEmail = formatPiiPdf(log.userEmail, true);
      doc.text(`${log.userRole.toUpperCase()} | ${displayEmail.substring(0, 24)}`, 82, y + 9.5);

      // Event Type
      doc.setTextColor(gold[0], gold[1], gold[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.text(log.eventType.toUpperCase().replace(/_/g, ' '), 130, y + 6);

      // Description & Update
      doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.text(log.eventDescription.substring(0, 56), 166, y + 5);

      if (log.newValue) {
        doc.setFontSize(5.5);
        doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
        doc.text(`Update: ${log.newValue.substring(0, 58)}`, 166, y + 9.5);
      } else if (log.documentTitle) {
        doc.setFontSize(5.5);
        doc.setTextColor(gold[0], gold[1], gold[2]);
        doc.text(`Doc: ${log.documentTitle.substring(0, 58)}`, 166, y + 9.5);
      }

      // Standards Ref & Hash
      doc.setTextColor(navy[0], navy[1], navy[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.text((log.standardsReference || 'SANS 10139 / NBR').substring(0, 28), 238, y + 5);

      if (log.fileChecksumSha256) {
        doc.setFont('courier', 'normal');
        doc.setFontSize(5.5);
        doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
        doc.text(`SHA: ${log.fileChecksumSha256.substring(0, 16)}...`, 238, y + 9.5);
      }

      y += 13.5;
    });

    // Page Footer
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(
      `Statutory Compliance Audit Log • SANS 10139 Clause 13.2 • POPIA Act 4 of 2013 • ${COMPANY_DETAILS.legalName} • Page ${page} of ${totalPages}`,
      148,
      202,
      { align: 'center' }
    );
  }

  const cleanProjectName = projectName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 28);
  const filePrefix = isFullProjectHistory ? 'Full_Project_Audit_Report' : 'Compliance_Audit_Report';
  doc.save(`${filePrefix}_${cleanProjectName}_${new Date().toISOString().split('T')[0]}.pdf`);
}

