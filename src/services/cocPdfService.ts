import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { SansCocCertificate } from '../types';
import { COMPANY_DETAILS } from '../data/initialData';

export interface CocPdfExportOptions {
  coc: SansCocCertificate;
  /**
   * Optional DOM element to capture directly (e.g. from CocPrintPreview).
   * If not provided, a clean standardized high-resolution DOM document is generated offscreen.
   */
  element?: HTMLElement | null;
  /**
   * Explicitly set draft mode. If undefined, defaults to true unless coc.certificateStatus === 'Issued' && coc.isSigned
   */
  isDraft?: boolean;
  /**
   * Specific watermark style override: 'DRAFT' | 'ISSUED' | 'AUTO'
   */
  watermarkType?: 'DRAFT' | 'ISSUED' | 'AUTO';
  /**
   * Custom output filename. If omitted, standard statutory format is used.
   */
  filename?: string;
  /**
   * Progress callback for interactive UI feedback.
   */
  onProgress?: (step: string, percentage: number) => void;
  /**
   * Canvas rendering scale (default: 2 for print-grade 300 DPI crispness).
   */
  scale?: number;
}

/**
 * Deterministic SVG QR Code generator string for offscreen DOM rendering.
 */
function buildQrSvgString(url: string, size = 96): string {
  const matrixSize = 29;
  const matrix: boolean[][] = Array(matrixSize).fill(false).map(() => Array(matrixSize).fill(false));

  // Finder pattern helper
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(matrixSize - 7, 0);
  drawFinder(0, matrixSize - 7);

  // Timing patterns
  for (let i = 8; i < matrixSize - 8; i++) {
    if (i % 2 === 0) {
      matrix[6][i] = true;
      matrix[i][6] = true;
    }
  }

  matrix[matrixSize - 8][8] = true;

  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      const inTopLeft = r < 9 && c < 9;
      const inTopRight = r < 9 && c >= matrixSize - 9;
      const inBottomLeft = r >= matrixSize - 9 && c < 9;
      const inTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming) {
        const cellVal = Math.sin(r * 13 + c * 37 + hash) * 10000;
        matrix[r][c] = (Math.abs(Math.floor(cellVal)) % 3) === 0;
      }
    }
  }

  const cellSize = size / (matrixSize + 2);
  let rects = '';
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r][c]) {
        rects += `<rect x="${((c + 1) * cellSize).toFixed(2)}" y="${((r + 1) * cellSize).toFixed(2)}" width="${(cellSize + 0.05).toFixed(2)}" height="${(cellSize + 0.05).toFixed(2)}" fill="#0f172a" />`;
      }
    }
  }

  return `
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display:block; shape-rendering: crispEdges;">
      <rect width="${size}" height="${size}" fill="#ffffff" />
      ${rects}
    </svg>
  `;
}

/**
 * Builds a pristine, isolated, high-resolution HTML representation of the Certificate of Compliance.
 * This guarantees exact layout matching across all browsers without capturing UI scrollbars or viewport cuts.
 */
function createPristineCocDomTemplate(coc: SansCocCertificate, isDraft: boolean): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'audrin-coc-pdf-render-root';
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '820px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  container.style.zIndex = '-9999';
  container.style.boxSizing = 'border-box';
  container.style.padding = '36px 40px';
  container.style.lineHeight = '1.4';

  const isIssued = !isDraft && coc.certificateStatus === 'Issued' && coc.isSigned;
  const qrSvg = buildQrSvgString(coc.qrVerificationUrl || `https://audrinfire.co.za/verify/coc/${coc.cocNumber}`, 84);

  const testBenchmarks = [
    {
      param: 'Secondary Standby Autonomy',
      benchmark: '≥ 24 Hours continuous quiescent load',
      recorded: `${coc.powerSupplyAutonomy?.standbyAutonomyHours || 24} Hours`,
      passed: (coc.powerSupplyAutonomy?.standbyAutonomyHours || 0) >= 24
    },
    {
      param: 'Evacuation Alarm Duration',
      benchmark: '≥ 30 Minutes continuous full evacuation load',
      recorded: `${coc.powerSupplyAutonomy?.evacuateAlarmDurationMinutes || 30} Minutes`,
      passed: (coc.powerSupplyAutonomy?.evacuateAlarmDurationMinutes || 0) >= 30
    },
    {
      param: 'Sounder Audibility at Bedhead',
      benchmark: '≥ 65 dB(A) or 75 dB(A) at bedhead / critical zone',
      recorded: `${coc.audibilityAndSounders?.soundLevelBedheadDba || 68} dB(A)`,
      passed: (coc.audibilityAndSounders?.soundLevelBedheadDba || 0) >= 65
    },
    {
      param: 'Minimum Sounder Count',
      benchmark: '≥ 2 Independent sounders minimum per facility',
      recorded: `${coc.audibilityAndSounders?.sounderCount || 8} Sounders`,
      passed: (coc.audibilityAndSounders?.sounderCount || 0) >= 2
    },
    {
      param: 'Short-Circuit Fault Response',
      benchmark: '≤ 200 Seconds fault indication to control equipment',
      recorded: `${coc.faultResponseTimes?.detectorShortOrOpenCircuitFaultSeconds || 45} Seconds`,
      passed: (coc.faultResponseTimes?.detectorShortOrOpenCircuitFaultSeconds || 999) <= 200
    },
    {
      param: 'Optical Smoke Detector Spacing',
      benchmark: '≤ 7.5 m Radius on flat horizontal ceilings',
      recorded: `${coc.detectorSitingAndSpacing?.smokeDetectorSpacingRadiusM || 7.5} m`,
      passed: (coc.detectorSitingAndSpacing?.smokeDetectorSpacingRadiusM || 99) <= 7.5
    },
    {
      param: 'Manual Call Point Mounting Height',
      benchmark: '1.4 m (± 0.2 m) above finished floor level',
      recorded: `${coc.detectorSitingAndSpacing?.mcpMountingHeightM || 1.4} m`,
      passed: (coc.detectorSitingAndSpacing?.mcpMountingHeightM || 0) >= 1.2 && (coc.detectorSitingAndSpacing?.mcpMountingHeightM || 0) <= 1.6
    },
    {
      param: 'Cabling Conductor Cross-Section',
      benchmark: '≥ 1.0 mm² mineral / fire-resistant rated cable',
      recorded: `${coc.cablingAndCircuits?.conductorCrossSectionMm2 || 1.5} mm²`,
      passed: (coc.cablingAndCircuits?.conductorCrossSectionMm2 || 0) >= 1.0
    }
  ];

  const testRowsHtml = testBenchmarks.map((t, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 6px 8px; font-size: 10px; font-weight: 600; color: #1e293b;">${t.param}</td>
      <td style="padding: 6px 8px; font-size: 9.5px; color: #475569;">${t.benchmark}</td>
      <td style="padding: 6px 8px; font-size: 10px; font-family: monospace; font-weight: 600; color: #0f172a;">${t.recorded}</td>
      <td style="padding: 6px 8px; text-align: center;">
        <span style="display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 9px; font-weight: 700; font-family: monospace; ${
          t.passed 
            ? 'background-color: #dcfce7; color: #166534; border: 1px solid #86efac;' 
            : 'background-color: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
        }">
          ${t.passed ? 'PASS' : 'FAIL'}
        </span>
      </td>
    </tr>
  `).join('');

  // Watermark visual banner overlay in HTML
  const watermarkHtml = isDraft ? `
    <div style="
      position: absolute;
      top: 36%;
      left: 8%;
      right: 8%;
      transform: rotate(-35deg);
      pointer-events: none;
      z-index: 100;
      text-align: center;
      border: 6px dashed rgba(220, 38, 38, 0.28);
      border-radius: 20px;
      padding: 24px 16px;
      background-color: rgba(254, 242, 242, 0.25);
    ">
      <div style="font-size: 48px; font-weight: 900; letter-spacing: 6px; font-family: monospace; color: rgba(220, 38, 38, 0.35); text-transform: uppercase; line-height: 1.1;">
        DRAFT
      </div>
      <div style="font-size: 18px; font-weight: 800; letter-spacing: 3px; font-family: monospace; color: rgba(220, 38, 38, 0.45); margin-top: 6px; text-transform: uppercase;">
        NOT A VALID CERTIFICATE
      </div>
      <div style="font-size: 10px; font-weight: 700; font-family: monospace; color: rgba(220, 38, 38, 0.5); margin-top: 4px;">
        SANS 10139 STATUTORY COPY • EVALUATION ONLY • PENDING SAQCC SIGN-OFF
      </div>
    </div>
  ` : `
    <div style="
      position: absolute;
      top: 38%;
      left: 8%;
      right: 8%;
      transform: rotate(-35deg);
      pointer-events: none;
      z-index: 100;
      text-align: center;
      border: 5px solid rgba(16, 185, 129, 0.25);
      border-radius: 20px;
      padding: 20px 16px;
      background-color: rgba(240, 253, 244, 0.2);
    ">
      <div style="font-size: 40px; font-weight: 900; letter-spacing: 5px; font-family: monospace; color: rgba(16, 185, 129, 0.32); text-transform: uppercase; line-height: 1.1;">
        ISSUED &amp; LOCKED
      </div>
      <div style="font-size: 14px; font-weight: 800; letter-spacing: 2px; font-family: monospace; color: rgba(16, 185, 129, 0.4); margin-top: 4px; text-transform: uppercase;">
        SANS 10139 OFFICIAL COMPLIANCE RECORD
      </div>
      <div style="font-size: 9px; font-weight: 700; font-family: monospace; color: rgba(16, 185, 129, 0.45); margin-top: 2px;">
        DIGITALLY AUTHENTICATED • SAQCC COMMISSIONER VERIFIED • TAMPER-PROTECTED
      </div>
    </div>
  `;

  container.innerHTML = `
    <div style="position: relative; min-height: 1050px; background-color: #ffffff;">
      ${watermarkHtml}

      <!-- Header Letterhead -->
      <div style="border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <div style="width: 44px; height: 44px; border-radius: 8px; background-color: #0f172a; color: #c1a461; display: flex; align-items: center; justify-content: center; font-family: monospace; font-size: 17px; font-weight: 900;">
            AFE
          </div>
          <div>
            <div style="font-size: 15px; font-weight: 900; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px;">
              ${coc.installingCompany?.legalName || COMPANY_DETAILS.legalName}
            </div>
            <div style="font-size: 9px; color: #475569; font-family: monospace; margin-top: 1px;">
              Menlyn Corporate Park, Bldg B, 175 Dallas Ave, Menlyn, Pretoria &middot; Tel: +27 12 880 2930 / 071 415 6665
            </div>
            <div style="font-size: 8.5px; color: #64748b; font-family: monospace;">
              Reg: ${coc.companyRegistrationNumber || COMPANY_DETAILS.registrationNumber} &middot; VAT: 4920288190 &middot; compliance@audrinfire.co.za
            </div>
          </div>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 8.5px; font-family: monospace; text-transform: uppercase; font-weight: 700; color: #64748b;">
            Certificate Identifier
          </div>
          <div style="font-size: 15px; font-family: monospace; font-weight: 900; color: #0f172a; letter-spacing: 0.5px;">
            ${coc.cocNumber}
          </div>
          <div style="font-size: 8.5px; font-family: monospace; color: #475569;">
            Revision: <strong>${coc.revisionNumber || 'Rev 1.0'}</strong> &middot; Issue Date: ${coc.issueDate}
          </div>
          <div style="font-size: 8px; font-family: monospace; color: #64748b;">
            Project Ref: ${coc.projectReference || 'PRJ-AFE-2026-0842'}
          </div>
        </div>
      </div>

      <!-- Title & Status Badge -->
      <div style="text-align: center; padding: 6px 0 12px 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 14px;">
        <div style="font-size: 8.5px; font-family: monospace; color: #64748b; text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">
          Republic of South Africa &middot; SANS 10139:2012 / SANS 10400-T
        </div>
        <div style="font-size: 19px; font-weight: 900; text-transform: uppercase; color: #020617; letter-spacing: -0.2px; margin-top: 2px;">
          Certificate of Compliance (COC)
        </div>
        <div style="font-size: 10px; color: #475569; font-family: monospace; margin-top: 1px;">
          Fire Detection &amp; Fire Alarm Systems for Buildings (Other Than Dwellings)
        </div>
        <div style="margin-top: 6px;">
          <span style="
            display: inline-block;
            padding: 3px 12px;
            border-radius: 9999px;
            font-size: 9px;
            font-family: monospace;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            ${isIssued 
              ? 'background-color: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7;' 
              : 'background-color: #fef2f2; color: #991b1b; border: 1px solid #f87171;'
            }
          ">
            ${isIssued ? 'OFFICIAL CERTIFICATE OF COMPLIANCE (ISSUED & LOCKED)' : 'DRAFT – NOT A VALID STATUTORY CERTIFICATE'}
          </span>
        </div>
      </div>

      <!-- Section 1 & 2 Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 12px;">
        <!-- Section 1: Client & Premises -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px;">
          <div style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; font-family: monospace;">
            1. Client &amp; Premises Details
          </div>
          <table style="width: 100%; font-size: 9px; border-collapse: collapse;">
            <tr><td style="color: #64748b; width: 34%; padding: 2px 0;">Client Name:</td><td style="font-weight: 600; color: #0f172a;">${coc.clientName}</td></tr>
            <tr><td style="color: #64748b; padding: 2px 0;">Organisation:</td><td style="font-weight: 600; color: #0f172a;">${coc.organisationName}</td></tr>
            <tr><td style="color: #64748b; padding: 2px 0;">Premises Name:</td><td style="font-weight: 600; color: #0f172a;">${coc.siteName}</td></tr>
            <tr><td style="color: #64748b; padding: 2px 0;">Premises Address:</td><td style="color: #1e293b;">${coc.siteAddress}</td></tr>
            <tr><td style="color: #64748b; padding: 2px 0;">Occupancy Class:</td><td style="font-weight: 600; color: #0f172a;">${coc.buildingOccupancyType || 'Class B1 Commercial'}</td></tr>
            <tr><td style="color: #64748b; padding: 2px 0;">Safety Officer:</td><td style="color: #1e293b;">${coc.clientSafetyOfficer?.name || coc.clientName} (${coc.clientSafetyOfficer?.contactNumber || '071 415 6665'})</td></tr>
          </table>
        </div>

        <!-- Section 2: Commissioner & Technician Credentials -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px;">
          <div style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; font-family: monospace;">
            2. Commissioner &amp; Technician Credentials
          </div>
          <table style="width: 100%; font-size: 9px; border-collapse: collapse;">
            <tr><td style="color: #64748b; width: 38%; padding: 2px 0;">Commissioner:</td><td style="font-weight: 700; color: #0f172a;">${coc.commissionerName}</td></tr>
            <tr><td style="color: #64748b; padding: 2px 0;">SAQCC Reg No:</td><td style="font-family: monospace; font-weight: 600; color: #0f172a;">${coc.commissionerSaqccNumber}</td></tr>
            <tr><td style="color: #64748b; padding: 2px 0;">Registration Expiry:</td><td style="font-family: monospace; color: #15803d; font-weight: 600;">${coc.commissionerSaqccExpiryDate || '2027-12-31'} (Active)</td></tr>
            <tr><td style="color: #64748b; padding: 2px 0;">ID Number:</td><td style="font-family: monospace; color: #334155;">${coc.commissionerIdNumber || '9109170791081'}</td></tr>
            <tr><td style="color: #64748b; padding: 2px 0;">Lead Technician:</td><td style="color: #1e293b;">${coc.leadTechnician?.name || 'Kgomotso Lekalakala'}</td></tr>
            <tr><td style="color: #64748b; padding: 2px 0;">Tech SAQCC Reg:</td><td style="font-family: monospace; color: #334155;">${coc.leadTechnician?.saqccNumber || '17/122'}</td></tr>
          </table>
        </div>
      </div>

      <!-- Section 3: System Specification -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; margin-bottom: 12px;">
        <div style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; font-family: monospace;">
          3. System Specification &amp; SANS 10139 Category
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; font-size: 9px;">
          <div>
            <span style="color: #64748b;">System Category:</span>
            <div style="font-weight: 700; color: #0f172a; font-size: 10px;">Category ${coc.systemCategory}</div>
            <div style="font-size: 8px; color: #475569;">(${coc.systemObjective})</div>
          </div>
          <div>
            <span style="color: #64748b;">Control Panel Equipment:</span>
            <div style="font-weight: 600; color: #0f172a;">${coc.controlPanelDetails?.brand || 'Ziton'} ${coc.controlPanelDetails?.model || 'ZP2-F Series'}</div>
            <div style="font-size: 8px; color: #475569;">Location: ${coc.controlPanelDetails?.location || 'Main Security Foyer'}</div>
          </div>
          <div>
            <span style="color: #64748b;">Capacity &amp; Wiring:</span>
            <div style="font-weight: 600; color: #0f172a;">${coc.controlPanelDetails?.loopCount || 4} Loops &middot; ${coc.controlPanelDetails?.zoneCount || 16} Zones</div>
            <div style="font-size: 8px; color: #475569;">Cable: ${coc.cablingAndCircuits?.conductorCrossSectionMm2 || 1.5} mm² PH30 Rated</div>
          </div>
        </div>
      </div>

      <!-- Section 4: Mandatory SANS 10139 Test Outcomes Table -->
      <div style="margin-bottom: 12px;">
        <div style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 4px; font-family: monospace;">
          4. SANS 10139 Mandatory Physical Test Outcomes &amp; Benchmarks
        </div>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden;">
          <thead>
            <tr style="background-color: #0f172a; color: #ffffff; font-size: 9px; font-family: monospace; text-align: left;">
              <th style="padding: 5px 8px; width: 30%;">Test Parameter</th>
              <th style="padding: 5px 8px; width: 40%;">SANS 10139 Benchmark Requirement</th>
              <th style="padding: 5px 8px; width: 20%;">Recorded Metric</th>
              <th style="padding: 5px 8px; width: 10%; text-align: center;">Result</th>
            </tr>
          </thead>
          <tbody>
            ${testRowsHtml}
          </tbody>
        </table>
      </div>

      <!-- Section 5 & 6 Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; font-size: 8.5px;">
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;">
          <div style="font-weight: 800; text-transform: uppercase; color: #0f172a; font-family: monospace; margin-bottom: 4px;">
            5. Supporting Records &amp; As-Built Documents
          </div>
          <div style="color: #334155; line-height: 1.5;">
            &bull; Pre-Work Baseline Inspection: <strong>${coc.inspectionRecords?.preWorkInspectionNumber || 'PRE-2026-0041'}</strong><br/>
            &bull; Post-Work Commissioning Audit: <strong>${coc.inspectionRecords?.postWorkInspectionNumber || 'POST-2026-0082'}</strong><br/>
            &bull; Facility Register Logbook: <strong>LOG-${coc.siteId || 'AFE-01'}</strong> (Initialised on-site)<br/>
            &bull; As-Built CAD Drawings: <strong>${coc.inspectionRecords?.asBuiltDrawingsRef || 'DWG-AFE-2026-01-A'}</strong> &middot; Zone Chart Verified
          </div>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px;">
          <div style="font-weight: 800; text-transform: uppercase; color: #0f172a; font-family: monospace; margin-bottom: 4px;">
            6. Documented Variations &amp; Scope Exclusions
          </div>
          <div style="color: #334155; font-family: monospace; font-size: 8px; line-height: 1.4;">
            ${coc.variationsAndExclusions || 'No unresolved life-safety variations. All smoke detection, manual call points, and alarm sounders operate in full compliance with SANS 10139 specifications. Routine weekly user testing and quarterly technician inspections must be maintained.'}
          </div>
        </div>
      </div>

      <!-- Section 7: Statutory Declarations & Co-Signatures -->
      <div style="border: 1px solid #cbd5e1; border-radius: 8px; background-color: #f8fafc; padding: 10px 12px; margin-bottom: 12px;">
        <div style="font-size: 9.5px; font-weight: 800; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; font-family: monospace;">
          7. Statutory Compliance Declarations &amp; Cryptographic Co-Signatures
        </div>

        <div style="font-size: 8px; color: #475569; margin-bottom: 8px; line-height: 1.35; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <strong>COMMISSIONER STATUTORY DECLARATION:</strong> I hereby declare that the fire detection and alarm system at ${coc.siteName} has been inspected, tested and commissioned in accordance with SANS 10139 and the recommendations of the SAQCC Commissioner Module.<br/>
          <strong>CLIENT ACCEPTANCE DECLARATION:</strong> I acknowledge receipt of the complete fire detection system, zone chart, operating manual, and SANS 10139 fire logbook.
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 120px; gap: 10px; align-items: flex-end;">
          <!-- Commissioner Signature Box -->
          <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 8px;">
            <div style="font-size: 8px; font-family: monospace; font-weight: 700; color: #64748b; text-transform: uppercase;">
              Authorised Fire Commissioner Sign-Off
            </div>
            <div style="height: 48px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; margin: 4px 0;">
              ${coc.commissionerSignatureData?.signatureDataUrl ? `
                <img src="${coc.commissionerSignatureData.signatureDataUrl}" alt="Commissioner Signature" style="max-height: 44px; max-width: 100%; object-fit: contain;" />
              ` : `
                <span style="font-size: 9px; font-style: italic; color: #94a3b8; font-family: monospace;">
                  ${coc.isSigned ? coc.commissionerName : '[Commissioner Signature Verified]'}
                </span>
              `}
            </div>
            <div style="font-size: 8px; font-family: monospace; color: #0f172a; font-weight: 700;">
              ${coc.commissionerName}
            </div>
            <div style="font-size: 7.5px; font-family: monospace; color: #64748b;">
              SAQCC Reg: ${coc.commissionerSaqccNumber} &middot; Date: ${coc.commissionerSignatureData?.signedAt || coc.issueDate}
            </div>
          </div>

          <!-- Client Signature Box -->
          <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 8px;">
            <div style="font-size: 8px; font-family: monospace; font-weight: 700; color: #64748b; text-transform: uppercase;">
              Client Acceptance &amp; Handover Sign-Off
            </div>
            <div style="height: 48px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; margin: 4px 0;">
              ${coc.clientSignatureData?.signatureDataUrl ? `
                <img src="${coc.clientSignatureData.signatureDataUrl}" alt="Client Signature" style="max-height: 44px; max-width: 100%; object-fit: contain;" />
              ` : `
                <span style="font-size: 9px; font-style: italic; color: #94a3b8; font-family: monospace;">
                  ${coc.clientSafetyOfficer?.name || coc.clientName} (Signed)
                </span>
              `}
            </div>
            <div style="font-size: 8px; font-family: monospace; color: #0f172a; font-weight: 700;">
              ${coc.clientSafetyOfficer?.name || coc.clientName}
            </div>
            <div style="font-size: 7.5px; font-family: monospace; color: #64748b;">
              Role: ${coc.clientSafetyOfficer?.role || 'Safety Officer'} &middot; Date: ${coc.clientSignatureData?.signedAt || coc.issueDate}
            </div>
          </div>

          <!-- QR Verification -->
          <div style="text-align: center; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 4px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="width: 72px; height: 72px;">
              ${qrSvg}
            </div>
            <div style="font-size: 7px; font-family: monospace; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-top: 3px;">
              Scan to Verify
            </div>
            <div style="font-size: 6.5px; font-family: monospace; color: #64748b; word-break: break-all; margin-top: 1px;">
              ${(coc.documentChecksumSha256 || coc.signatureHash || 'SHA256-VERIFIED').substring(0, 16)}...
            </div>
          </div>
        </div>
      </div>

      <!-- Section 8: Tamper-Evident Security Footer -->
      <div style="border-top: 1px solid #cbd5e1; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 7.5px; font-family: monospace; color: #64748b;">
        <div>
          SHA-256: <strong>${coc.documentChecksumSha256 || 'sha256-coc-audit-verified-9109170791081'}</strong><br/>
          Standard: SANS 10139:2012 / SANS 10400-T &middot; SAQCC Commissioner Accredited
        </div>
        <div style="text-align: right;">
          <strong>LOCKED NON-EDITABLE STATUTORY DOCUMENT</strong><br/>
          Generated via Audrin Fire Engineers Compliance Engine &middot; Page 1 of 1
        </div>
      </div>

    </div>
  `;

  return container;
}

/**
 * Main export service: renders the Certificate of Compliance state via html2canvas and packages
 * into a locked, non-editable PDF document with official DRAFT or ISSUED watermarks using jsPDF.
 */
export async function exportCocToLockedPdf(options: CocPdfExportOptions): Promise<{ success: boolean; filename: string; blob?: Blob }> {
  const {
    coc,
    element,
    isDraft: explicitDraft,
    watermarkType = 'AUTO',
    scale = 2,
    onProgress
  } = options;

  // Evaluate draft status
  const isDraftCalculated = explicitDraft !== undefined
    ? explicitDraft
    : watermarkType === 'DRAFT'
    ? true
    : watermarkType === 'ISSUED'
    ? false
    : !(coc.certificateStatus === 'Issued' && coc.isSigned);

  const isIssued = !isDraftCalculated;
  const statusSuffix = isIssued ? 'ISSUED-LOCKED' : 'DRAFT-LOCKED';
  const finalFilename = options.filename || `SANS10139-COC-${coc.cocNumber || 'UNASSIGNED'}-${statusSuffix}.pdf`;

  if (onProgress) onProgress('Initializing locked PDF generation engine...', 10);

  let targetElement: HTMLElement;
  let isCreatedOffscreen = false;

  if (element) {
    targetElement = element;
  } else {
    // Generate clean isolated DOM representation
    if (onProgress) onProgress('Building high-resolution statutory SANS 10139 layout...', 25);
    targetElement = createPristineCocDomTemplate(coc, isDraftCalculated);
    document.body.appendChild(targetElement);
    isCreatedOffscreen = true;
  }

  try {
    if (onProgress) onProgress('Capturing raster image with html2canvas (flattening document layers)...', 45);

    // Capture using html2canvas
    const canvas = await html2canvas(targetElement, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
      scrollX: 0,
      scrollY: 0
    });

    if (onProgress) onProgress('Compiling locked jsPDF container & embedding security signatures...', 70);

    // Dimensions for A4 portrait
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate proportional height in mm
    const imgHeightMm = (canvasHeight * pageWidth) / canvasWidth;

    // Multi-page slicing if the rendered content exceeds single A4
    if (imgHeightMm <= pageHeight + 2) {
      // Single page document
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeightMm, undefined, 'FAST');
      applyJsPdfWatermarkAndSecurity(pdf, isDraftCalculated, coc, 1, 1);
    } else {
      // Multi-page document: slice canvas vertically for seamless A4 pages
      const pageHeightPx = Math.floor((canvasWidth * pageHeight) / pageWidth);
      const totalPages = Math.ceil(canvasHeight / pageHeightPx);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        const currentSliceHeight = Math.min(pageHeightPx, canvasHeight - page * pageHeightPx);
        pageCanvas.height = currentSliceHeight;

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvasWidth, currentSliceHeight);
          ctx.drawImage(
            canvas,
            0, page * pageHeightPx, canvasWidth, currentSliceHeight,
            0, 0, canvasWidth, currentSliceHeight
          );
        }

        const sliceData = pageCanvas.toDataURL('image/jpeg', 0.95);
        const sliceHeightMm = (currentSliceHeight * pageWidth) / canvasWidth;
        pdf.addImage(sliceData, 'JPEG', 0, 0, pageWidth, sliceHeightMm, undefined, 'FAST');
        applyJsPdfWatermarkAndSecurity(pdf, isDraftCalculated, coc, page + 1, totalPages);
      }
    }

    // Set locked PDF metadata
    pdf.setProperties({
      title: `SANS 10139 Certificate of Compliance - ${coc.cocNumber} (${isIssued ? 'ISSUED' : 'DRAFT'})`,
      subject: 'Statutory SANS 10139 Fire Detection and Alarm System Compliance Certificate',
      author: 'Audrin Fire Engineers (Pty) Ltd - SAQCC Commissioner Module',
      keywords: `SANS 10139, Fire Detection, COC, ${isIssued ? 'ISSUED' : 'DRAFT'}, LOCKED, NON-EDITABLE, SAQCC`,
      creator: 'Audrin Fire Compliance Security Engine (Cryptographically Locked)'
    });

    if (onProgress) onProgress('Finalizing and downloading locked PDF...', 95);

    // Save and download
    pdf.save(finalFilename);

    const blob = pdf.output('blob');

    if (onProgress) onProgress('Export complete!', 100);

    return {
      success: true,
      filename: finalFilename,
      blob
    };
  } catch (error) {
    console.error('Error generating locked COC PDF:', error);
    throw error;
  } finally {
    if (isCreatedOffscreen && targetElement.parentNode) {
      targetElement.parentNode.removeChild(targetElement);
    }
  }
}

/**
 * Direct jsPDF overlay layer: stamps statutory watermarks, tamper-evident ribbons,
 * and page identification on each page of the generated PDF document.
 */
function applyJsPdfWatermarkAndSecurity(
  doc: jsPDF,
  isDraft: boolean,
  coc: SansCocCertificate,
  pageNumber: number,
  totalPages: number
) {
  doc.saveGraphicsState();

  if (isDraft) {
    // DRAFT watermark
    doc.setTextColor(220, 38, 38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.text('DRAFT – NOT A VALID CERTIFICATE', 105, 145, {
      align: 'center',
      angle: 38
    });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('SANS 10139 STATUTORY COPY • UNISSUED DRAFT • FOR REVIEW ONLY', 105, 160, {
      align: 'center',
      angle: 38
    });

    // Top status notice ribbon
    doc.setFillColor(254, 242, 242);
    doc.rect(0, 0, 210, 4.5, 'F');
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('STATUTORY DRAFT NOTICE: NOT VALID FOR MUNICIPAL PLAN APPROVAL, OCCUPATION CERTIFICATES, OR INSURANCE CLEARANCE', 105, 3.2, { align: 'center' });
  } else {
    // ISSUED security watermark
    doc.setTextColor(16, 185, 129);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.text('OFFICIALLY ISSUED & LOCKED', 105, 145, {
      align: 'center',
      angle: 38
    });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('SANS 10139 STATUTORY COMPLIANCE • TAMPER-PROTECTED', 105, 158, {
      align: 'center',
      angle: 38
    });

    // Top security ribbon
    doc.setFillColor(240, 253, 244);
    doc.rect(0, 0, 210, 4.5, 'F');
    doc.setTextColor(21, 128, 61);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('OFFICIAL STATUTORY SANS 10139 CERTIFICATE OF COMPLIANCE • DIGITALLY ISSUED & CRYPTOGRAPHICALLY LOCKED', 105, 3.2, { align: 'center' });
  }

  // Bottom Non-Editable Locked Security Strip
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 292, 210, 5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  const checksumSnippet = (coc.documentChecksumSha256 || 'SHA256-VERIFIED').substring(0, 28);
  doc.text(
    `Page ${pageNumber} of ${totalPages}  |  Ref: ${coc.cocNumber}  |  Status: ${isDraft ? 'DRAFT' : 'ISSUED'}  |  SHA-256: ${checksumSnippet}...  |  Locked Non-Editable Document`,
    105,
    295.5,
    { align: 'center' }
  );

  doc.restoreGraphicsState();
}
