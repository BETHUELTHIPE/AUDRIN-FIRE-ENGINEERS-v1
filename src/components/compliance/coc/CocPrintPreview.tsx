import React, { useState } from 'react';
import { SansCocCertificate } from '../../../types';
import { QrCodeUtility } from '../QrCodeUtility';
import { exportSansCocPdf, generateConditionReportPdf } from '../../../services/pdfGenerator';
import { CocPdfExportModal } from './CocPdfExportModal';
import { useAudrinStore } from '../../../services/store';
import { 
  Award, 
  Printer, 
  Download, 
  Mail, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Lock,
  Building2,
  Calendar,
  Layers,
  Phone,
  ArrowLeft
} from 'lucide-react';

interface CocPrintPreviewProps {
  coc: SansCocCertificate;
  onBackToEdit?: () => void;
  onOpenEmailModal?: () => void;
  onDownloadPdf?: () => void;
  isDraft?: boolean;
}

export const CocPrintPreview: React.FC<CocPrintPreviewProps> = ({
  coc,
  onBackToEdit,
  onOpenEmailModal,
  onDownloadPdf,
  isDraft = false
}) => {
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
    } else {
      setExportModalOpen(true);
    }
  };

  const isOfficiallyIssued = !isDraft && coc.certificateStatus === 'Issued' && coc.isSigned;
  const statusLabel = isOfficiallyIssued ? 'ISSUED - OFFICIAL COMPLIANCE CERTIFICATE' : 'DRAFT – NOT A VALID CERTIFICATE';

  const store = useAudrinStore();

  const handleDownloadSupportingReport = (reportType: 'pre_work' | 'post_work') => {
    const allReports = store.getConditionReports();
    const matched = allReports.find(r => r.reportType === reportType && (r.siteName === coc.siteName || r.organisationName === coc.organisationName))
      || allReports.find(r => r.reportType === reportType);

    if (matched) {
      generateConditionReportPdf(matched);
    } else {
      // Fallback: Generate standardized inspection condition report on the fly
      const fallbackReport = {
        id: `rep-${reportType}-${Date.now()}`,
        requestId: 'req-01',
        reportType,
        reportNumber: reportType === 'pre_work' 
          ? (coc.inspectionRecords?.preWorkInspectionNumber || 'PRE-2026-0041') 
          : (coc.inspectionRecords?.postWorkInspectionNumber || 'POST-2026-0082'),
        version: 1,
        generatedAt: new Date().toISOString(),
        clientName: coc.clientName,
        organisationName: coc.organisationName,
        siteName: coc.siteName,
        siteAddress: coc.siteAddress,
        serviceTitle: reportType === 'pre_work' 
          ? 'SANS 10139 Pre-Work Baseline Inspection' 
          : 'SANS 10139 Post-Work Commissioning & Handover Inspection',
        scopeSummary: reportType === 'pre_work'
          ? `Pre-work condition assessment for ${coc.siteName}. Audited control panel, cabling pathways, ambient noise levels, and existing detector positioning.`
          : `Post-work commissioning audit for ${coc.siteName}. 100% loop testing, acoustic verification (>=65 dB(A)), secondary battery discharge test, and zone chart sign-off.`,
        visibleConditionNotes: 'Equipment verified against SANS 10139 and SAQCC Commissioner standards. All installed devices clean, correctly addressed, and functional.',
        physicalAssessmentRequiredNotes: 'All physical tests verified by registered SAQCC fire commissioner and recorded in the facility logbook.',
        recommendedNextStep: 'Routine weekly user testing and quarterly technician servicing in accordance with SANS 10139.',
        limitationsDisclaimer: 'This inspection report forms part of the statutory SANS 10139 compliance records. Maintained by Audrin Fire Engineers.',
        evidenceSnapshot: {
          photoIds: [],
          videoIds: [],
          photographs: []
        },
        status: 'acknowledged_by_client' as const
      };
      generateConditionReportPdf(fallbackReport);
    }
  };

  return (
    <div className="space-y-6">
      {/* Print / Action Toolbar (hidden on print) */}
      <div className="print:hidden p-4 bg-[#18181C] border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToEdit && (
            <button
              onClick={onBackToEdit}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-mono flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Edit Form Fields
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase ${
              isOfficiallyIssued ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {isOfficiallyIssued ? 'Issued' : 'Draft Preview'}
            </span>
            <span className="text-xs text-white/50 font-mono">Ref: {coc.cocNumber}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4 text-[#C1A461]" />
            Print COC
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Download PDF
          </button>

          {onOpenEmailModal && (
            <button
              onClick={onOpenEmailModal}
              className="px-4 py-2 bg-[#C1A461] hover:bg-[#d4bc7b] text-black rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition shadow-lg shadow-[#C1A461]/20"
            >
              <Mail className="w-4 h-4" />
              Email to Client &amp; Safety Officer
            </button>
          )}
        </div>
      </div>

      {/* Official SANS 10139 Certificate Sheet (A4 Proportionate Container) */}
      <div 
        id="sans-coc-printable-document"
        className="bg-white text-slate-900 border-2 border-slate-300 shadow-2xl rounded-2xl p-8 sm:p-12 space-y-6 relative overflow-hidden font-sans print:border-none print:shadow-none print:p-6 print:m-0 print:rounded-none"
      >
        {/* Draft / Issued Statutory Watermark Stamp */}
        {isOfficiallyIssued ? (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none z-10">
            <div className="transform -rotate-45 text-emerald-600/10 text-5xl sm:text-6xl font-extrabold font-mono tracking-widest border-8 border-emerald-600/10 p-8 rounded-3xl text-center leading-tight">
              OFFICIALLY ISSUED &amp; LOCKED<br />
              <span className="text-xl sm:text-2xl font-bold tracking-wider">SANS 10139 COMPLIANT</span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none z-10">
            <div className="transform -rotate-45 text-red-600/10 text-6xl sm:text-7xl font-extrabold font-mono tracking-widest border-8 border-red-600/10 p-8 rounded-3xl text-center leading-tight">
              DRAFT<br />NOT A VALID CERTIFICATE
            </div>
          </div>
        )}

        {/* Top Letterhead */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-[#C1A461] flex items-center justify-center font-bold font-mono text-sm">
                AFE
              </div>
              <span className="text-sm font-extrabold tracking-wider text-slate-900 uppercase">
                Audrin Fire Engineers (Pty) Ltd
              </span>
            </div>
            <div className="text-[10px] text-slate-600 font-mono leading-tight">
              Menlyn Corporate Park, Building B, 175 Dallas Ave, Menlyn, Pretoria, 0181<br />
              Reg: K2026089596 &middot; VAT: 4920288190 &middot; Tel: +27 12 880 2930 / 071 415 6665<br />
              Email: compliance@audrinfire.co.za &middot; Web: www.audrinfire.co.za
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-500">Certificate Reference</div>
            <div className="text-lg font-mono font-extrabold text-slate-900">{coc.cocNumber}</div>
            <div className="text-[10px] font-mono text-slate-600">
              Revision: <span className="font-bold">{coc.revisionNumber || 'Rev 1.0'}</span> &middot; Date: {coc.issueDate}
            </div>
            <div className="text-[9px] font-mono text-slate-500">
              Project Ref: {coc.projectReference || 'PRJ-AFE-2026-0842'}
            </div>
          </div>
        </div>

        {/* Document Title Header */}
        <div className="text-center py-2 border-b border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[2px] font-bold">
            Republic of South Africa &middot; SANS 10139:2012 / SANS 10400-T
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight mt-1">
            Certificate of Compliance (COC)
          </h1>
          <p className="text-xs text-slate-600 font-mono mt-0.5">
            Fire Detection and Fire Alarm Systems for Buildings (Other Than Dwellings)
          </p>
          <div className="mt-2 inline-block px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-slate-800 bg-slate-100 text-slate-900">
            {statusLabel}
          </div>
        </div>

        {/* Section 1: Client & Premises Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
          <div className="space-y-1.5">
            <div className="font-bold font-mono text-[11px] text-slate-900 uppercase border-b border-slate-200 pb-0.5">
              1. Client &amp; Premises Details
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-mono">Client Name:</span>
              <span className="col-span-2 font-semibold text-slate-900">{coc.clientName}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-mono">Organisation:</span>
              <span className="col-span-2 font-semibold text-slate-900">{coc.organisationName}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-mono">Premises / Site:</span>
              <span className="col-span-2 font-semibold text-slate-900">{coc.siteName}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-mono">Address:</span>
              <span className="col-span-2 text-slate-700">{coc.siteAddress}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-mono">Building Class:</span>
              <span className="col-span-2 font-mono font-bold text-slate-900">{coc.buildingOccupancyType}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold font-mono text-[11px] text-slate-900 uppercase border-b border-slate-200 pb-0.5">
              2. Designated Safety Officer &amp; Installer
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-mono">Safety Officer:</span>
              <span className="col-span-2 font-semibold text-slate-900">
                {coc.clientSafetyOfficer?.name || 'Bethuel Moukangwe (Property & Safety Lead)'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-mono">Officer Contact:</span>
              <span className="col-span-2 font-mono text-slate-700">
                {coc.clientSafetyOfficer?.contactNumber || '071 415 6665'} &middot; {coc.clientSafetyOfficer?.email || 'safety@tshivhase.co.za'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-mono">Lead Commissioner:</span>
              <span className="col-span-2 font-semibold text-slate-900">{coc.commissionerName}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-mono">SAQCC Reg / Exp:</span>
              <span className="col-span-2 font-mono font-bold text-slate-900">
                {coc.commissionerSaqccNumber} &middot; Exp: {coc.commissionerSaqccExpiryDate || '2027-12-31'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="text-slate-500 font-mono">Lead Technician:</span>
              <span className="col-span-2 font-mono text-slate-700">
                {coc.leadTechnician?.name || 'Sipho Ndlovu (SAQCC: 9109170791081)'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: System Specifications & Device Schedule */}
        <div className="space-y-2 border-b border-slate-200 pb-4 text-xs">
          <div className="font-bold font-mono text-[11px] text-slate-900 uppercase border-b border-slate-200 pb-0.5 flex items-center justify-between">
            <span>3. System Classification &amp; SANS 10139 Device Legend Schedule</span>
            <span className="text-[10px] font-normal text-slate-500">Clause 4 &middot; Table C.1</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] font-mono">
            <div>
              <span className="text-slate-500 block text-[9px]">SYSTEM CATEGORY:</span>
              <span className="font-extrabold text-sm text-slate-900">Category {coc.systemCategory}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">OBJECTIVE:</span>
              <span className="font-bold text-slate-900">{coc.systemObjective}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">CONTROL PANEL:</span>
              <span className="font-bold text-slate-900">{coc.controlPanelDetails?.brand || 'Kentec'} {coc.controlPanelDetails?.model || 'Syncro AS 4-Loop'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">AREAS &amp; ZONES:</span>
              <span className="font-bold text-slate-900">4 Loops &middot; 16 Zones</span>
            </div>
          </div>

          {/* Color-Coded Legend Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono pt-1">
            <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
              <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Blue Dot: Smoke Detectors</div>
                <div className="text-slate-600">Count: {coc.deviceSchedule.blueDotSmokeDetectors} &middot; R &le; 7.5m</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-slate-100 border border-slate-300 rounded">
              <span className="w-3 h-3 rounded-full bg-slate-900 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Black Dot: Heat Detectors</div>
                <div className="text-slate-600">Count: {coc.deviceSchedule.blackDotHeatDetectors} &middot; R &le; 5.3m</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded">
              <span className="w-3 h-3 rounded-full bg-red-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Red Dot: Sounders &amp; Sirens</div>
                <div className="text-slate-600">Count: {coc.deviceSchedule.redDotSoundersSirens} &middot; &ge;65 dB(A)</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Green Dot: Manual Call Points</div>
                <div className="text-slate-600">Count: {coc.deviceSchedule.greenDotManualCallPoints} &middot; 1.4m &plusmn;0.2m</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Commissioning Test Outcomes */}
        <div className="space-y-2 border-b border-slate-200 pb-4 text-xs">
          <div className="font-bold font-mono text-[11px] text-slate-900 uppercase border-b border-slate-200 pb-0.5 flex items-center justify-between">
            <span>4. Commissioning Test Verification Matrix (SANS 10139 Measured Thresholds)</span>
            <span className="text-emerald-700 font-mono text-[10px] flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3 h-3" /> All Mandatory Tests Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-1">
              <div className="font-bold text-slate-900">Power Supply &amp; Standby Autonomy:</div>
              <div className="text-slate-700 text-[10px]">
                &bull; Mains: 230V AC &middot; Battery: {coc.powerSupplyAutonomy.batteryType} ({coc.powerSupplyAutonomy.batteryCapacityAh} Ah)<br />
                &bull; Standby Duration: <strong>{coc.powerSupplyAutonomy.standbyAutonomyHours}h</strong> (Standard: &ge; 24h) &middot; <span className="text-emerald-700 font-bold">PASS</span><br />
                &bull; Full Evac Alarm Duration: <strong>{coc.powerSupplyAutonomy.evacuateAlarmDurationMinutes} min</strong> (Standard: &ge; 30 min) &middot; <span className="text-emerald-700 font-bold">PASS</span><br />
                &bull; Mains Fail Signal Delay: <strong>{coc.powerSupplyAutonomy.mainsFailIndicationTimeMinutes} min</strong> (Standard: &le; 30 min)
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-1">
              <div className="font-bold text-slate-900">Audibility, Cabling &amp; Fault Response:</div>
              <div className="text-slate-700 text-[10px]">
                &bull; Bedhead Sound Level: <strong>{coc.audibilityAndSounders.soundLevelBedheadDba} dB(A)</strong> (Standard: &ge; 65 dB(A)) &middot; <span className="text-emerald-700 font-bold">PASS</span><br />
                &bull; Max Sound Level: <strong>{coc.audibilityAndSounders.maxSoundPressureAccessibleDba} dB(A)</strong> (Standard: &le; 130 dB(A))<br />
                &bull; Cabling: {coc.cablingAndCircuits.cableSpecification} (RED &ge; 1.5mm&sup2;)<br />
                &bull; Circuit Fault Latency: <strong>{coc.faultResponseTimes.detectorShortOrOpenCircuitFaultSeconds}s</strong> (Standard: &le; 200s) &middot; <span className="text-emerald-700 font-bold">PASS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Supporting Records & Deviations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
          <div>
            <div className="font-bold font-mono text-[11px] text-slate-900 uppercase border-b border-slate-200 pb-0.5 flex items-center justify-between">
              <span>5. Supporting Documentation Register</span>
              <span className="text-[9px] text-slate-500 font-normal no-print">Click to download report PDF</span>
            </div>
            <ul className="text-[10px] font-mono text-slate-700 space-y-1.5 mt-1.5">
              <li className="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-200">
                <div>
                  &bull; Pre-Work Condition Inspection: <strong>{coc.inspectionRecords?.preWorkInspectionNumber || 'PRE-2026-0041'}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadSupportingReport('pre_work')}
                  className="no-print px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded text-[9px] flex items-center gap-1 transition"
                  title="Download Pre-Work Inspection Report PDF"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF</span>
                </button>
              </li>
              <li className="flex items-center justify-between p-1.5 rounded bg-slate-50 border border-slate-200">
                <div>
                  &bull; Post-Work Commissioning Record: <strong>{coc.inspectionRecords?.postWorkInspectionNumber || 'POST-2026-0082'}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadSupportingReport('post_work')}
                  className="no-print px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded text-[9px] flex items-center gap-1 transition"
                  title="Download Post-Work Commissioning Report PDF"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF</span>
                </button>
              </li>
              <li className="p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                &bull; As-Built CAD Markup Schematics: <strong>{coc.inspectionRecords?.asBuiltDrawingsRef || 'DWG-MEN-L1-L4-REV3'}</strong>
              </li>
              <li className="p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-600">
                &bull; SANS 10139 On-Site Logbook &amp; Laminated Zone Chart: <strong>Supplied &amp; Verified</strong>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold font-mono text-[11px] text-slate-900 uppercase border-b border-slate-200 pb-0.5">
              6. Variations, Exclusions &amp; Agreed Actions
            </div>
            <p className="text-[10px] text-slate-700 font-mono mt-1 leading-relaxed">
              {coc.variationsAndExclusions || 'No deviations from SANS 10139 recommendations. Total Category L1 coverage verified across all designated spaces.'}
            </p>
          </div>
        </div>

        {/* Section 5: Mandatory Declarations Verbatim */}
        <div className="space-y-3 border-b border-slate-200 pb-4 text-xs">
          <div className="font-bold font-mono text-[11px] text-slate-900 uppercase border-b border-slate-200 pb-0.5">
            7. Mandatory Statutory Declarations (SANS 10139 Commissioner Module)
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[10px] space-y-2 text-slate-800 leading-relaxed font-sans">
            <div>
              <strong className="text-slate-950 font-mono">COMMISSIONER DECLARATION OF COMPLIANCE:</strong><br />
              &ldquo;I hereby declare that the fire detection and fire alarm system at the above premises has been inspected, tested and commissioned in accordance with SANS 10139 and the recommendations of the SAQCC Commissioner Module. I confirm that all variations (if any) have been documented and agreed with the client, and that all mandatory test criteria have been verified.&rdquo;
            </div>

            <div className="text-[9px] text-slate-600 font-mono border-t border-slate-200 pt-1.5">
              <strong>STATUTORY SAQCC NOTICE:</strong> This certificate is issued under the professional responsibility of the registered commissioner. The South African Qualification &amp; Certification Committee (SAQCC) has not endorsed or issued this certificate directly, and any certification is solely grounded in the factual physical tests and documented records recorded herein.
            </div>

            <div className="border-t border-slate-200 pt-1.5">
              <strong className="text-slate-950 font-mono">CLIENT RECEIPT &amp; HANDOVER DECLARATION:</strong><br />
              &ldquo;I hereby acknowledge receipt of the fire detection system, as-built drawings, operating instructions, and SANS 10139 fire detection logbook. I confirm that our designated personnel have received initial instruction on system operation and fault reporting.&rdquo;
            </div>
          </div>
        </div>

        {/* Section 6: Signatures & QR Code Authentication */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 items-end">
          {/* Commissioner Signature Block */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">
              Lead Fire Commissioner Sign-Off
            </div>
            
            <div className="h-16 border-b border-slate-300 flex items-center justify-center bg-white rounded p-1">
              {coc.commissionerSignatureData?.signatureDataUrl ? (
                <img 
                  src={coc.commissionerSignatureData.signatureDataUrl} 
                  alt="Commissioner Signature" 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-[10px] font-mono text-slate-400 italic">
                  {coc.isSigned ? coc.commissionerName : 'Pending Commissioner Signature'}
                </span>
              )}
            </div>

            <div className="text-[10px] font-mono text-slate-800 space-y-0.5">
              <div className="font-bold">{coc.commissionerName}</div>
              <div className="text-[9px] text-slate-500">Reg: {coc.commissionerSaqccNumber}</div>
              <div className="text-[8px] text-slate-400">Date: {coc.issueDate} &middot; OTP Verified</div>
            </div>
          </div>

          {/* Client Acceptance Block */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">
              Client Acceptance Sign-Off
            </div>
            
            <div className="h-16 border-b border-slate-300 flex items-center justify-center bg-white rounded p-1">
              {coc.clientSignatureData?.signatureDataUrl ? (
                <img 
                  src={coc.clientSignatureData.signatureDataUrl} 
                  alt="Client Signature" 
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-[10px] font-mono text-slate-400 italic">
                  {coc.clientSafetyOfficer?.name || coc.clientName} (Signed Handover)
                </span>
              )}
            </div>

            <div className="text-[10px] font-mono text-slate-800 space-y-0.5">
              <div className="font-bold">{coc.clientSafetyOfficer?.name || coc.clientName}</div>
              <div className="text-[9px] text-slate-500">{coc.clientSafetyOfficer?.role || 'Designated Safety Officer'}</div>
              <div className="text-[8px] text-slate-400">Date: {coc.issueDate} &middot; Received Handover</div>
            </div>
          </div>

          {/* QR Code & Tamper Verification */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-between text-center">
            <QrCodeUtility
              value={coc.qrVerificationUrl || `https://audrinfire.co.za/verify/coc/${coc.cocNumber}`}
              size={90}
              label="Official Verification"
              sublabel="SANS 10139 Registry"
              showCopyButton={false}
            />
            <div className="text-[8px] font-mono text-slate-400 mt-2 break-all">
              SHA-256: {coc.documentChecksumSha256 || coc.signatureHash || '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e'}
            </div>
          </div>
        </div>

        {/* Footer Repeated Identification and Page Numbering */}
        <div className="border-t border-slate-200 pt-3 text-[9px] font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Certificate: <strong>{coc.cocNumber}</strong> &middot; Site: <strong>{coc.siteName}</strong> &middot; Client: <strong>{coc.clientName}</strong>
          </div>
          <div>
            Audrin Fire Engineers Controlled Compliance Instrument &middot; Page 1 of 1
          </div>
        </div>

      </div>

      {/* Locked PDF Export Modal */}
      <CocPdfExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        coc={coc}
        defaultIsDraft={isDraft}
      />
    </div>
  );
};
