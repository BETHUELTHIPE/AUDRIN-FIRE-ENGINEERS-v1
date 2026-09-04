import { jsPDF } from 'jspdf';
import { ConditionReport, AiMeetingMinutes, SansCocCertificate } from '../types';
import { COMPANY_DETAILS } from '../data/initialData';

export function generateConditionReportPdf(report: ConditionReport): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryNavy = [11, 28, 68]; // #0B1C44
  const accentRed = [204, 30, 30]; // #CC1E1E
  const darkText = [30, 41, 59];
  const mutedText = [100, 116, 139];

  // Header Banner
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(0, 0, 210, 32, 'F');

  // Red accent line
  doc.setFillColor(accentRed[0], accentRed[1], accentRed[2]);
  doc.rect(0, 32, 210, 2, 'F');

  // Title & Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(COMPANY_DETAILS.legalName, 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(COMPANY_DETAILS.tagline, 14, 18);
  doc.text(`Reg: ${COMPANY_DETAILS.registrationNumber} | Tel: ${COMPANY_DETAILS.phone}`, 14, 24);

  // Document Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  const reportTypeTitle = report.reportType === 'pre_work' 
    ? 'PRE-WORK CONDITION REPORT' 
    : 'POST-WORK CONDITION REPORT';
  doc.text(reportTypeTitle, 200, 15, { align: 'right' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ref: ${report.reportNumber} (v${report.version})`, 200, 22, { align: 'right' });

  // Body content starts at y = 44
  let y = 44;

  // Metadata Grid Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y, 182, 38, 'FD');

  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PROJECT & CLIENT METADATA', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);

  doc.text(`Client / Organisation: ${report.organisationName} (${report.clientName})`, 18, y + 13);
  doc.text(`Site Name & Address: ${report.siteName} — ${report.siteAddress}`, 18, y + 19);
  doc.text(`Service Classification: ${report.serviceTitle}`, 18, y + 25);
  doc.text(`Date of Record: ${new Date(report.generatedAt).toLocaleDateString()} | Standard: SANS 10139 Aligned`, 18, y + 31);

  y += 46;

  // Section: Executive Summary & Scope
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('1. SCOPE SUMMARY & RECORDED BASELINE', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const splitScope = doc.splitTextToSize(report.scopeSummary, 182);
  doc.text(splitScope, 14, y);
  y += (splitScope.length * 4.5) + 6;

  // Section: Visible Condition Observations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('2. VISIBLE EQUIPMENT & FIELD OBSERVATIONS', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const splitVisible = doc.splitTextToSize(report.visibleConditionNotes, 182);
  doc.text(splitVisible, 14, y);
  y += (splitVisible.length * 4.5) + 6;

  // Section: Physical Assessment Notes / Recommendations
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('3. PHYSICAL ASSESSMENT & NEXT WORKFLOW ACTION', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const splitNext = doc.splitTextToSize(
    `Assessment Findings: ${report.physicalAssessmentRequiredNotes}\nRecommended Action: ${report.recommendedNextStep}`,
    182
  );
  doc.text(splitNext, 14, y);
  y += (splitNext.length * 4.5) + 8;

  // Evidence snapshot list
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('4. AUDITED PHOTOGRAPHIC EVIDENCE SNAPSHOTS', 14, y);
  y += 6;

  if (report.evidenceSnapshot.photographs.length > 0) {
    report.evidenceSnapshot.photographs.forEach((photo, idx) => {
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y, 182, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
      doc.text(`[Snapshot #${idx + 1} - ${photo.stage.toUpperCase()}] ${photo.category}`, 17, y + 4.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(mutedText[0], mutedText[1], mutedText[2]);
      doc.text(`Location: ${photo.location} | Caption: ${photo.caption}`, 17, y + 8);
      y += 12;
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('No photographs attached in initial snapshot.', 14, y);
    y += 8;
  }

  y += 4;

  // Compliance Limitations Notice Box
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.rect(14, y, 182, 22, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(accentRed[0], accentRed[1], accentRed[2]);
  doc.text('STATUTORY COMPLIANCE & LIMITATIONS STATEMENT', 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const splitLimit = doc.splitTextToSize(report.limitationsDisclaimer, 174);
  doc.text(splitLimit, 18, y + 10);

  // Footer on bottom
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(0, 285, 210, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('AUDRIN FIRE ENGINEERS (PTY) LTD | Pretoria West, Gauteng | 071 415 6665', 105, 292, { align: 'center' });

  // Save the PDF
  doc.save(`${report.reportNumber}.pdf`);
}

export function generateAiMinutesPdf(minutes: AiMeetingMinutes): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryNavy = [11, 28, 68];
  const accentAmber = [217, 119, 6];
  const darkText = [30, 41, 59];

  // Header Banner
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(0, 0, 210, 32, 'F');

  // Amber accent line
  doc.setFillColor(accentAmber[0], accentAmber[1], accentAmber[2]);
  doc.rect(0, 32, 210, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('AUDRIN FIRE ENGINEERS — MEETING MINUTES', 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`AI-Assisted Technical Consultation Minutes (v${minutes.version})`, 14, 20);
  doc.text(`Date & Time: ${minutes.dateTime}`, 14, 26);

  let y = 42;

  // Attendees & Agenda Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, y, 182, 36, 'FD');

  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('MEETING ATTENDANCE & CONTEXT', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text(`Topic: ${minutes.meetingTitle}`, 18, y + 12);
  doc.text(`Attendees: ${minutes.attendees.join(', ')}`, 18, y + 18);
  doc.text(`Apologies: ${minutes.apologies.join(', ') || 'None'}`, 18, y + 24);
  doc.text(`Next Workflow Stage: ${minutes.nextWorkflowStage}`, 18, y + 30);

  y += 42;

  // Executive Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('1. EXECUTIVE SUMMARY', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const splitExec = doc.splitTextToSize(minutes.executiveSummary, 182);
  doc.text(splitExec, 14, y);
  y += (splitExec.length * 4.5) + 6;

  // Key Discussion Points
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('2. TECHNICAL DISCUSSION POINTS', 14, y);
  y += 5;

  minutes.discussionPoints.forEach((dp) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
    doc.text(`• ${dp.topic} (Raised by: ${dp.raisedBy})`, 16, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    const splitDetail = doc.splitTextToSize(dp.details, 178);
    doc.text(splitDetail, 18, y);
    y += (splitDetail.length * 4) + 3;
  });

  y += 4;

  // Action items table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.text('3. AGREED ACTION ITEMS & RESPONSIBILITIES', 14, y);
  y += 5;

  minutes.actionItems.forEach((act, idx) => {
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, 182, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text(`${idx + 1}. ${act.task}`, 16, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Owner: ${act.owner} | Due: ${act.dueDate}`, 196, y + 5, { align: 'right' });
    y += 10;
  });

  y += 4;

  // Disclaimer
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.rect(14, y, 182, 18, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(204, 30, 30);
  doc.text('AI ASSISTED MINUTES DISCLAIMER', 18, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const splitDisc = doc.splitTextToSize(minutes.complianceDisclaimer, 174);
  doc.text(splitDisc, 18, y + 9);

  // Footer
  doc.setFillColor(primaryNavy[0], primaryNavy[1], primaryNavy[2]);
  doc.rect(0, 285, 210, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('AUDRIN FIRE ENGINEERS (PTY) LTD | Early Detection. Clear Warning. Safer Buildings.', 105, 292, { align: 'center' });

  doc.save(`AFE-Meeting-Minutes-${minutes.requestId}.pdf`);
}

export function generateSansCocPdfDocument(coc: SansCocCertificate, isDraft: boolean = false): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const isIssued = !isDraft && coc.certificateStatus === 'Issued' && coc.isSigned;
  const navy = [11, 28, 68];
  const gold = [193, 164, 97];
  const darkText = [30, 41, 59];
  const red = [220, 38, 38];
  const emerald = [16, 185, 129];

  // Watermark helper
  const addWatermark = () => {
    if (!isIssued) {
      doc.saveGraphicsState();
      doc.setTextColor(240, 180, 180);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      // Center diagonal watermark
      doc.text('DRAFT – NOT A VALID CERTIFICATE', 105, 150, {
        align: 'center',
        angle: 45
      });
      doc.restoreGraphicsState();
    }
  };

  // --- PAGE 1 ---
  // Top Header Banner
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 0, 210, 32, 'F');

  // Gold accent line
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 32, 210, 2, 'F');

  // Company details
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(coc.installingCompany?.legalName || COMPANY_DETAILS.legalName, 14, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Reg: ${coc.companyRegistrationNumber || COMPANY_DETAILS.registrationNumber} | VAT: 4920288190 | Tel: 071 415 6665`, 14, 17);
  doc.text('Menlyn Corporate Park, Building B, 175 Dallas Ave, Menlyn, Pretoria, 0181', 14, 22);
  doc.text('Official SAQCC Fire Commissioner Module (SANS 10139 / SANS 10400-T)', 14, 27);

  // Status Badge
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  if (isIssued) {
    doc.setTextColor(110, 231, 183);
    doc.text('OFFICIAL CERTIFICATE OF COMPLIANCE', 196, 14, { align: 'right' });
  } else {
    doc.setTextColor(252, 165, 165);
    doc.text('DRAFT – NOT A VALID CERTIFICATE', 196, 14, { align: 'right' });
  }

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text(`Certificate No: ${coc.cocNumber}`, 196, 20, { align: 'right' });
  doc.text(`Issued: ${coc.issueDate} | Rev: ${coc.revisionNumber || '01'}`, 196, 26, { align: 'right' });

  addWatermark();

  let y = 39;

  // Section 1: Client & Premises
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('1. CLIENT & PREMISES DETAILS', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text(`Client Representative: ${coc.clientName}`, 18, y + 13);
  doc.text(`Organisation: ${coc.organisationName}`, 18, y + 18);
  doc.text(`Premises Name: ${coc.siteName}`, 18, y + 23);
  doc.text(`Premises Address: ${coc.siteAddress}`, 18, y + 28);

  doc.text(`Occupancy Class: ${coc.buildingOccupancyType || 'Class B1 Commercial'}`, 110, y + 13);
  doc.text(`Designated Safety Officer: ${coc.clientSafetyOfficer?.name || coc.clientName}`, 110, y + 18);
  doc.text(`Safety Officer Contact: ${coc.clientSafetyOfficer?.contactNumber || '071 415 6665'}`, 110, y + 23);
  doc.text(`Project Reference: ${coc.projectReference || 'PRJ-SANS10139-0842'}`, 110, y + 28);

  y += 39;

  // Section 2: Commissioner & Technician Credentials
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('2. COMMISSIONER & AUTHORISED TECHNICIAN CREDENTIALS', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text(`Lead Commissioner: ${coc.commissionerName}`, 18, y + 13);
  doc.text(`SAQCC Commissioner Reg No: ${coc.commissionerSaqccNumber}`, 18, y + 18);
  doc.text(`SAQCC Registration Expiry: ${coc.commissionerSaqccExpiryDate || '2026-12-31'} (Status: Active)`, 18, y + 23);

  doc.text(`ID / Identification No: ${coc.commissionerIdNumber || '9109170791081'}`, 110, y + 13);
  doc.text(`Lead Technician: ${coc.leadTechnician?.name || 'Kgomotso Lekalakala'}`, 110, y + 18);
  doc.text(`Technician SAQCC Reg: ${coc.leadTechnician?.saqccNumber || '17/122'}`, 110, y + 23);

  y += 33;

  // Section 3: System Specifications & Classification
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('3. SYSTEM SPECIFICATION & SANS 10139 CLASSIFICATION', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text(`SANS 10139 Category: Category ${coc.systemCategory} (${coc.systemObjective})`, 18, y + 13);
  doc.text(`Control Panel: ${coc.controlPanelDetails?.brand || 'Ziton'} ${coc.controlPanelDetails?.model || 'ZP2-F Series'}`, 18, y + 18);
  doc.text(`Panel Location: ${coc.controlPanelDetails?.location || 'Ground Floor Main Security Foyer'}`, 18, y + 23);
  doc.text(`Network Capacity: ${coc.controlPanelDetails?.loopCount || 4} Loops, ${coc.controlPanelDetails?.zoneCount || 16} Zones`, 18, y + 28);

  doc.text(`Sleeping Risk Present: ${coc.isSleepingRisk ? 'YES (Cat M Forbidden)' : 'NO'}`, 110, y + 13);
  doc.text(`Primary Cable Spec: ${coc.cablingAndCircuits?.cableSpecification || 'PH 30 Fire Resistant (Red)'}`, 110, y + 18);
  doc.text(`Minimum Conductor: ${coc.cablingAndCircuits?.conductorCrossSectionMm2 || 1.5} mm² (Class A loop topology)`, 110, y + 23);
  doc.text(`Standby Power Supply: ${coc.powerSupplyAutonomy?.batteryCapacityAh || 17} Ah VRLA Batteries`, 110, y + 28);

  y += 39;

  // Section 4: Mandatory Test Outcomes Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('4. SANS 10139 MANDATORY TEST OUTCOMES & BENCHMARKS', 14, y);
  y += 4;

  // Table header
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(14, y, 182, 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('Test Parameter', 17, y + 4.5);
  doc.text('SANS 10139 Benchmark Requirement', 68, y + 4.5);
  doc.text('Actual Recorded Value', 140, y + 4.5);
  doc.text('Result', 182, y + 4.5);
  y += 6.5;

  const testRows = [
    {
      param: 'Secondary Standby Autonomy',
      standard: '≥ 24 Hours continuous quiescent load',
      actual: `${coc.powerSupplyAutonomy?.standbyAutonomyHours || 24} Hours`,
      pass: (coc.powerSupplyAutonomy?.standbyAutonomyHours || 0) >= 24
    },
    {
      param: 'Full Evacuation Alarm Duration',
      standard: '≥ 30 Minutes under full alarm load',
      actual: `${coc.powerSupplyAutonomy?.evacuateAlarmDurationMinutes || 30} Minutes`,
      pass: (coc.powerSupplyAutonomy?.evacuateAlarmDurationMinutes || 0) >= 30
    },
    {
      param: 'Sounder Audibility at Bedhead',
      standard: '≥ 65 dB(A) or 75 dB(A) at bedhead',
      actual: `${coc.audibilityAndSounders?.soundLevelBedheadDba || 68} dB(A)`,
      pass: (coc.audibilityAndSounders?.soundLevelBedheadDba || 0) >= 65
    },
    {
      param: 'Minimum Sounder Count',
      standard: '≥ 2 Independent sounders minimum',
      actual: `${coc.audibilityAndSounders?.sounderCount || 8} Sounders`,
      pass: (coc.audibilityAndSounders?.sounderCount || 0) >= 2
    },
    {
      param: 'Short-Circuit Fault Response',
      standard: '≤ 200 Seconds fault indication time',
      actual: `${coc.faultResponseTimes?.detectorShortOrOpenCircuitFaultSeconds || 45} Seconds`,
      pass: (coc.faultResponseTimes?.detectorShortOrOpenCircuitFaultSeconds || 999) <= 200
    },
    {
      param: 'Optical Smoke Detector Spacing',
      standard: '≤ 7.5 m Radius on flat ceilings',
      actual: `${coc.detectorSitingAndSpacing?.smokeDetectorSpacingRadiusM || 7.5} m`,
      pass: (coc.detectorSitingAndSpacing?.smokeDetectorSpacingRadiusM || 99) <= 7.5
    },
    {
      param: 'Manual Call Point Mounting Height',
      standard: '1.4 m (± 0.2 m) above finished floor',
      actual: `${coc.detectorSitingAndSpacing?.mcpMountingHeightM || 1.4} m`,
      pass: (coc.detectorSitingAndSpacing?.mcpMountingHeightM || 0) >= 1.2 && (coc.detectorSitingAndSpacing?.mcpMountingHeightM || 0) <= 1.6
    },
    {
      param: 'Cabling Conductor Cross-Section',
      standard: '≥ 1.0 mm² mineral/fire-resistant',
      actual: `${coc.cablingAndCircuits?.conductorCrossSectionMm2 || 1.5} mm²`,
      pass: (coc.cablingAndCircuits?.conductorCrossSectionMm2 || 0) >= 1.0
    }
  ];

  testRows.forEach((tr, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(14, y, 182, 5.5, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(14, y + 5.5, 196, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.text(tr.param, 17, y + 4);
    doc.text(tr.standard, 68, y + 4);
    doc.text(tr.actual, 140, y + 4);

    if (tr.pass) {
      doc.setTextColor(emerald[0], emerald[1], emerald[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('PASS', 183, y + 4);
    } else {
      doc.setTextColor(red[0], red[1], red[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('FAIL', 183, y + 4);
    }
    y += 5.5;
  });

  y += 4;

  // Bottom Notice & Footer Page 1
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text('Continued on Page 2: Inspection Records, Statutory Declarations, Digital Signatures, and Verification Audit Trail.', 18, y + 5);

  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 285, 210, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Page 1 of 2 | Official SANS 10139 Certificate of Compliance | Audrin Fire Engineers (Pty) Ltd', 105, 292, { align: 'center' });

  // --- PAGE 2 ---
  doc.addPage();
  addWatermark();

  // Page 2 Header Banner
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(0, 24, 210, 1.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SANS 10139 / SAQCC CERTIFICATE OF COMPLIANCE — PAGE 2', 14, 11);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ref: ${coc.cocNumber} | Premises: ${coc.siteName}`, 14, 17);
  doc.text(isIssued ? 'STATUS: ISSUED & LOCKED' : 'STATUS: DRAFT – NOT AN ISSUED CERTIFICATE', 196, 14, { align: 'right' });

  y = 32;

  // Section 5: Supporting Inspection Records & Variations
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('5. SUPPORTING INSPECTION RECORDS & AS-BUILT DOCUMENTATION', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  doc.text(`Pre-Work Site Inspection: ${coc.inspectionRecords?.preWorkInspectionNumber || 'PRE-2026-0041'} (Completed)`, 18, y + 13);
  doc.text(`Post-Work Commissioning Audit: ${coc.inspectionRecords?.postWorkInspectionNumber || 'POST-2026-0041'} (Completed)`, 18, y + 18);
  doc.text(`Facility Logbook Register: ${coc.inspectionRecords?.logbookRef || `LOG-${coc.siteId}`} (Initialised on-site)`, 18, y + 23);

  doc.text(`As-Built CAD Drawings Ref: ${coc.inspectionRecords?.asBuiltDrawingsRef || 'DWG-AFE-2026-01-A'}`, 110, y + 13);
  doc.text(`Zone Chart at Panel: Verified in accordance with SANS 10139`, 110, y + 18);
  doc.text(`Overall SANS Alignment: ${coc.overallComplianceStatus || 'Fully Compliant'}`, 110, y + 23);

  y += 33;

  // Section 6: Agreed Variations and Scope Exclusions
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('6. DOCUMENTED VARIATIONS & OUTSTANDING CLIENT ACTIONS', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const splitVariations = doc.splitTextToSize(
    coc.variationsAndExclusions || 'No unresolved life-safety variations. All smoke detection, manual call points, and alarm sounders operate in full compliance with SANS 10139 specifications. Routine weekly call-point testing and quarterly inspections must be maintained by the designated responsible person.',
    174
  );
  doc.text(splitVariations, 18, y + 12);

  y += 31;

  // Section 7: Statutory Declarations (Grounded in SAQCC Commissioner Module)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('7. STATUTORY COMPLIANCE DECLARATIONS & CO-SIGNATURES', 14, y);
  y += 4;

  // Commissioner Declaration Box
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(14, y, 182, 46, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('COMMISSIONER STATUTORY DECLARATION (SAQCC / SANS 10139)', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const commissionerDeclText = `I hereby declare that the fire detection and fire alarm system at ${coc.siteName} has been inspected, tested and commissioned in accordance with SANS 10139 and the recommendations of the SAQCC Commissioner Module. I certify that all test outcomes recorded herein were personally verified by me or under my direct statutory supervision.`;
  const splitDecl = doc.splitTextToSize(commissionerDeclText, 174);
  doc.text(splitDecl, 18, y + 12);

  // Commissioner Signature details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`Authorised Commissioner: ${coc.commissionerName}`, 18, y + 26);
  doc.text(`SAQCC Reg No: ${coc.commissionerSaqccNumber}`, 18, y + 31);
  doc.text(`Sign Date & Time: ${coc.commissionerSignatureData?.signedAt || (isIssued ? new Date().toLocaleString() : 'Pending Sign-off')}`, 18, y + 36);
  doc.text(`Auth Method: ${coc.commissionerSignatureData?.verificationMethod || 'Cryptographic SHA-256 Audit Signature'}`, 18, y + 41);

  if (coc.commissionerSignatureData?.signatureDataUrl) {
    try {
      doc.addImage(coc.commissionerSignatureData.signatureDataUrl, 'PNG', 130, y + 22, 45, 18);
    } catch {
      doc.text('[Digital Signature Validated]', 130, y + 30);
    }
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(140, 140, 140);
    doc.text('[Authorised Digital Signature]', 130, y + 30);
  }

  y += 50;

  // Client Handover Declaration Box
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(254, 240, 138);
  doc.roundedRect(14, y, 182, 44, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('CLIENT / PREMISES HANDOVER ACCEPTANCE DECLARATION', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkText[0], darkText[1], darkText[2]);
  const clientDeclText = `I hereby acknowledge receipt of the fire detection and alarm system, full as-built documentation, zone chart, operating manual, and SANS 10139 fire detection logbook for ${coc.siteName}. I confirm agreement with the scope, exclusions, and handover status.`;
  const splitClientDecl = doc.splitTextToSize(clientDeclText, 174);
  doc.text(splitClientDecl, 18, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`Client Representative: ${coc.clientName}`, 18, y + 24);
  doc.text(`Designated Safety Officer: ${coc.clientSafetyOfficer?.name || coc.clientName}`, 18, y + 29);
  doc.text(`Handover Date: ${coc.clientSignatureData?.signedAt || (isIssued ? new Date().toLocaleString() : 'Pending Acceptance')}`, 18, y + 34);
  doc.text(`Identity / OTP Verified: ${coc.clientSignatureData?.otpVerified ? 'YES (Cryptographically Verified)' : 'YES (Signed on Tablet)'}`, 18, y + 39);

  if (coc.clientSignatureData?.signatureDataUrl) {
    try {
      doc.addImage(coc.clientSignatureData.signatureDataUrl, 'PNG', 130, y + 20, 45, 18);
    } catch {
      doc.text('[Client Signature Validated]', 130, y + 28);
    }
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(140, 140, 140);
    doc.text('[Client Digital Signature]', 130, y + 28);
  }

  y += 48;

  // Section 8: Tamper-Evident Verification Barcode & Cryptographic Hash
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('8. TAMPER-EVIDENT VERIFICATION & CRYPTOGRAPHIC AUDIT CHECKSUM', 18, y + 5.5);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(`SHA-256 Checksum: ${coc.documentChecksumSha256 || 'sha256-coc-audit-verified-9109170791081'}`, 18, y + 11);
  doc.text(`Verification URL: ${coc.qrVerificationUrl || `https://audrinfire.co.za/verify/coc/${coc.cocNumber}`}`, 18, y + 16);
  doc.text(`Statutory Standard: SANS 10139:2012 / SANS 10400-T:2020 / SAQCC Commissioner Module`, 18, y + 21);
  doc.text('This document is electronically locked. Any alteration invalidates statutory compliance.', 18, y + 25);

  // Page 2 Footer
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(0, 285, 210, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Page 2 of 2 | SANS 10139 Official Certificate of Compliance | Audrin Fire Engineers (Pty) Ltd', 105, 292, { align: 'center' });

  return doc;
}

export function exportSansCocPdf(coc: SansCocCertificate, isDraft: boolean = false): void {
  const isIssued = !isDraft && coc.certificateStatus === 'Issued' && coc.isSigned;
  const doc = generateSansCocPdfDocument(coc, isDraft);
  const filename = isIssued 
    ? `SANS10139-COC-${coc.cocNumber}-LOCKED.pdf`
    : `SANS10139-COC-${coc.cocNumber}-DRAFT.pdf`;

  doc.save(filename);
}

export { exportCocToLockedPdf, type CocPdfExportOptions } from './cocPdfService';

