import { 
  ApprovedSourceDocument, 
  SourceRequirement, 
  CompanyProfileBranding, 
  AudrinIssuerSettings,
  PreWorkInspectionRecord,
  PostWorkInspectionRecord,
  DefectRecord,
  GoogleSheetsMirrorState,
  ExportJobRecord
} from '../types';

// ==========================================
// APPROVED SOURCE DOCUMENTS REGISTRY
// ==========================================
export const APPROVED_SOURCE_DOCUMENTS: ApprovedSourceDocument[] = [
  {
    id: 'src-doc-01',
    fileName: 'SANS-10400-PART-T-FIRE-PROTECTION(1).pdf',
    documentTitle: 'SANS 10400-T:2011 (Edition 3) - National Building Regulations Part T: Fire Protection',
    editionOrDate: 'Edition 3 (2011)',
    contentHash: 'a948e65897c7b80816cf6173a113bc3fc08a8a47de0a2a466a935de984e85712',
    approvalStatus: 'Approved - Controlled Technical Source',
    uploader: 'Super Administrator (Compliance Board)',
    approvalDate: '2026-08-15T09:00:00Z',
    approvedBy: 'Competent Person (Fire Engineering Advisory)',
    pageCount: 96,
    summaryScope: 'Clauses 4.31 (Occupancies requiring fire detection/alarm, category M/L mandates), 4.32 (Readiness for purpose, signage, accessibility), and Table C.1 (Regulation A19 appointment context).',
    isControlled: true
  },
  {
    id: 'src-doc-02',
    fileName: 'Sum 10139 PDF ND Ramphela(1).pdf',
    documentTitle: 'Summative POE Module SANS 10139 / SAQCC SANS 10139 Commissioner Assessment',
    editionOrDate: 'Assessor Verified (ND Ramphela, SAQCC-9109170791081)',
    contentHash: '8f72a4d96c9e0115bfae7e6dc903be617c5b651034dc8cb5d34208d13264cf23',
    approvalStatus: 'Approved - Controlled Technical Source',
    uploader: 'Noko Dina Ramphela (SAQCC Commissioner)',
    approvalDate: '2026-08-20T14:30:00Z',
    approvedBy: 'SAQCC Fire Technical Committee / Moderation Board',
    pageCount: 10,
    summaryScope: 'Questions 1-22: System objectives/categories, standby power autonomy, Class A cabling, sounder levels, detector siting radiuses, roof pitch rules, MCP mounting heights, and fault response times.',
    isControlled: true
  }
];

// ==========================================
// SOURCE REQUIREMENT REGISTER
// Every single technical question, rule, and declaration is mapped here
// ==========================================
export const SOURCE_REQUIREMENT_REGISTER: SourceRequirement[] = [
  // SANS 10400-T Requirements
  {
    id: 'req-sans10400t-4.31',
    sourceDocId: 'src-doc-01',
    sourceDocTitle: 'SANS 10400-T:2011 (Edition 3)',
    pdfPage: 49,
    clauseOrQuestion: 'Clause 4.31',
    topic: 'Occupancy Mandates & SANS 10139 Design Compliance',
    requirementTitle: 'Mandatory Fire Detection & Alarm Systems',
    approvedParaphrase: 'Any building containing specified occupancies or conditions must be equipped with an approved fire detection and alarm system designed, installed, and maintained by competent persons in accordance with SANS 10139.',
    verbatimQuote: 'Any building containing an occupancy classified as A1, A2, A3, C1, C2, E1, E2, E3, E4, F1, H1, H2, H3 or H4 shall be equipped with a fire detection and alarm system that complies with the requirements of SANS 10139.',
    category: 'occupancy_mandate',
    appliesTo: ['pre_work', 'post_work', 'coc'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-sans10400t-4.32',
    sourceDocId: 'src-doc-01',
    sourceDocTitle: 'SANS 10400-T:2011 (Edition 3)',
    pdfPage: 50,
    clauseOrQuestion: 'Clause 4.32',
    topic: 'Readiness, Visibility & Accessibility',
    requirementTitle: 'Equipment Readiness & Signage',
    approvedParaphrase: 'All fire-protection equipment, detection systems, sounders, and call points must be maintained in immediate readiness for purpose, clearly visible or signed, and unobstructed for maintenance and operation.',
    verbatimQuote: 'All fire protection equipment and installations shall be maintained in a state of readiness for its purpose at all times, be clearly visible or appropriately signposted, and be easily accessible.',
    category: 'occupancy_mandate',
    appliesTo: ['pre_work', 'post_work', 'logbook'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-sans10400t-annexc',
    sourceDocId: 'src-doc-01',
    sourceDocTitle: 'SANS 10400-T:2011 (Edition 3)',
    pdfPage: 80,
    clauseOrQuestion: 'Annex C / Table C.1',
    topic: 'Competent Person Responsibilities',
    requirementTitle: 'Regulation A19 Competent Person Appointment',
    approvedParaphrase: 'Fire detection and alarm systems require designated competent person sign-off under National Building Regulations Part A (Regulation A19) appointments.',
    verbatimQuote: 'Fire detection and fire alarm systems - Competent person (Fire Engineering) in terms of National Building Regulation A19.',
    category: 'competent_person',
    appliesTo: ['pre_work', 'post_work', 'coc'],
    mandatoryForCoc: true,
    status: 'Approved'
  },

  // Summative POE Module SANS 10139 (ND Ramphela)
  {
    id: 'req-poe-q1a',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 1,
    clauseOrQuestion: 'Question 1(a)',
    topic: 'System Objectives',
    requirementTitle: 'Primary Objectives of SANS 10139 Systems',
    approvedParaphrase: 'The primary objectives of a fire detection and fire alarm system under SANS 10139 are the protection of life (Category L), protection of property (Category P), or manual alert (Category M).',
    verbatimQuote: 'State the primary objectives of a fire detection and alarm system: Life protection (Category L), Property protection (Category P), and Manual operation (Category M).',
    category: 'occupancy_mandate',
    appliesTo: ['pre_work', 'post_work', 'coc'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q1b',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 1,
    clauseOrQuestion: 'Question 1(b)',
    topic: 'Category M Prohibition in Sleeping Risks',
    requirementTitle: 'Prohibition of Category M Alone in Sleeping Occupancies',
    approvedParaphrase: 'A Category M system (manual call points only) is not acceptable in buildings where occupants sleep; automatic fire detection (Category L) is mandatory.',
    verbatimQuote: 'A Category M system is not suitable or compliant for any building in which occupants sleep.',
    category: 'occupancy_mandate',
    appliesTo: ['pre_work', 'post_work', 'coc'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q1d-1h',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 2,
    clauseOrQuestion: 'Question 1(d) & 1(h)',
    topic: 'Fire-Resistant Cabling & Colour',
    requirementTitle: 'PH 30 Enhanced Fire Resistant Cabling (Red)',
    approvedParaphrase: 'Fire detection loop and critical signal cables must have fire resistance rating (minimum PH 30 enhanced), minimum 1.0 mm² cross-sectional conductor area, and preferably red outer sheath with distinct labelling.',
    verbatimQuote: 'Cables used for critical signal paths must possess a minimum fire resistance of PH 30, minimum cross-sectional area of 1.0 mm², and preferably have a red outer sheath to differentiate from other LV services.',
    category: 'cable_circuits',
    appliesTo: ['pre_work', 'post_work', 'coc'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q1g',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 3,
    clauseOrQuestion: 'Question 1(g)',
    topic: 'Secondary Power Supply Autonomy',
    requirementTitle: '24h Standby + 30 Min Evacuation Autonomy',
    approvedParaphrase: 'The secondary standby battery power supply must maintain the entire system in quiescent state for at least 24 hours followed by at least 30 minutes in full evacuation alarm. Mains fail indication must be signaled within 30 minutes.',
    verbatimQuote: 'Secondary power supply standby capacity must support 24 hours quiescent operation followed by 30 minutes in full alarm. Mains failure must be indicated within 30 minutes.',
    category: 'power_autonomy',
    appliesTo: ['pre_work', 'post_work', 'coc', 'logbook'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q1e',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 2,
    clauseOrQuestion: 'Question 1(e)',
    topic: 'Fault Notification Latency',
    requirementTitle: 'Detector Short/Open Circuit Response ≤ 200s',
    approvedParaphrase: 'Short circuit, open circuit, or removal of any detector or device from the circuit must generate an audible and visual fault signal at the CIE within 200 seconds.',
    verbatimQuote: 'The CIE must indicate a fault within 200 seconds of a short-circuit or open-circuit occurring on any detection circuit.',
    category: 'fault_response',
    appliesTo: ['post_work', 'coc', 'logbook'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q1j',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 3,
    clauseOrQuestion: 'Question 1(j)',
    topic: 'Dual Sounder Circuit Sheath Segregation',
    requirementTitle: 'Segregated Sounder Circuits',
    approvedParaphrase: 'Dual sounder circuits installed for system redundancy must not share a common cable sheath or conduit pathway.',
    verbatimQuote: 'Sounder circuits must not be enclosed in a common cable sheath or conduit where a single fault could disable all alarm warning in an area.',
    category: 'cable_circuits',
    appliesTo: ['post_work', 'coc'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q1n',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 4,
    clauseOrQuestion: 'Question 1(n)',
    topic: 'Single Fault Disablement Limit',
    requirementTitle: 'Single Fault Limitation ≤ 1,000 m² or 1 Zone',
    approvedParaphrase: 'A single open or short circuit fault on a detection loop must not disable automatic detection over an area exceeding 1,000 m² or more than one floor or zone.',
    verbatimQuote: 'A single fault on a circuit must not disable detection over a floor area exceeding 1,000 m².',
    category: 'cable_circuits',
    appliesTo: ['post_work', 'coc'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q1r-1s',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 4,
    clauseOrQuestion: 'Question 1(r) & 1(s)',
    topic: 'Sounder Audibility Levels & Redundancy',
    requirementTitle: '≥ 65 dB(A) at Bedhead, ≤ 130 dB(A) Maximum',
    approvedParaphrase: 'Minimum sound level for waking sleeping occupants must be at least 65 dB(A) at the bedhead with doors closed (or 75 dB(A) where specific speech clarity is needed). Maximum sound level must not exceed 130 dB(A). At least 2 sounders are required per building.',
    verbatimQuote: 'The minimum sound level for sleeping accommodation is 65 dB(A) at the bedhead. The maximum sound level shall not exceed 130 dB(A). A minimum of two sounders is required per installation.',
    category: 'sounder_audibility',
    appliesTo: ['pre_work', 'post_work', 'coc'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q8',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 5,
    clauseOrQuestion: 'Question 8',
    topic: 'Heat Detector Prohibition in Escape Routes',
    requirementTitle: 'Prohibition of Heat Detectors in Category L Escape Routes',
    approvedParaphrase: 'Heat detectors are strictly prohibited from being used along escape routes in Category L systems or where smouldering fires represent the primary risk in Category P systems.',
    verbatimQuote: 'Heat detectors shall not be used on escape routes in Category L systems as they respond too late to provide escape warning.',
    category: 'detector_siting',
    appliesTo: ['pre_work', 'post_work', 'coc', 'siting'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q9',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 5,
    clauseOrQuestion: 'Question 9',
    topic: 'Pitched Roof Spacing Calculation',
    requirementTitle: 'Pitched Roof Spacing Rule (+1% per deg, Max +25%)',
    approvedParaphrase: 'Under a pitched ceiling or roof, detector spacing along the apex may be increased by 1% for every degree of slope, up to a maximum spacing increase of 25%.',
    verbatimQuote: 'For pitched roofs or ceilings, detector spacing may be increased by 1% for each degree of slope, up to a maximum increase of 25%.',
    category: 'detector_siting',
    appliesTo: ['post_work', 'coc', 'siting'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q10',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 5,
    clauseOrQuestion: 'Question 10',
    topic: 'Roof Apex Threshold for Smoke Detectors',
    requirementTitle: 'Smoke Apex Threshold < 600 mm',
    approvedParaphrase: 'If the height difference between the apex and the eaves of a roof is less than 600 mm, the ceiling is treated as flat for smoke detector siting.',
    verbatimQuote: 'If the difference in height from apex to eaves is less than 600 mm, the roof is treated as flat for smoke detector spacing.',
    category: 'detector_siting',
    appliesTo: ['post_work', 'coc', 'siting'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q11',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 6,
    clauseOrQuestion: 'Question 11',
    topic: 'Point Detector Horizontal Coverage Radius',
    requirementTitle: 'Smoke Detector Radius ≤ 7.5 m, Heat Detector Radius ≤ 5.3 m',
    approvedParaphrase: 'On flat ceilings, point optical smoke detectors have a horizontal coverage radius of up to 7.5 metres. Point heat detectors have a horizontal coverage radius of up to 5.3 metres.',
    verbatimQuote: 'Point smoke detectors have a radius of coverage of 7.5 m. Point heat detectors have a radius of coverage of 5.3 m.',
    category: 'detector_siting',
    appliesTo: ['pre_work', 'post_work', 'coc', 'siting'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q12',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 6,
    clauseOrQuestion: 'Question 12',
    topic: 'Roof Apex Threshold for Heat Detectors',
    requirementTitle: 'Heat Apex Threshold < 150 mm',
    approvedParaphrase: 'For point heat detectors, if the apex-to-eaves height difference is less than 150 mm, the roof is treated as flat.',
    verbatimQuote: 'For heat detectors, an apex height difference of less than 150 mm is treated as a flat ceiling.',
    category: 'detector_siting',
    appliesTo: ['post_work', 'coc', 'siting'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q14',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 6,
    clauseOrQuestion: 'Question 14',
    topic: 'Aspirating System Sampling Points at Apex',
    requirementTitle: 'Aspirating Points Within 600 mm of Apex',
    approvedParaphrase: 'Sampling points for aspirating smoke detection systems under pitched roofs must be located within 600 mm of the apex.',
    verbatimQuote: 'In pitched roofs, aspirating smoke detection sampling holes must be located within 600 mm of the apex.',
    category: 'detector_siting',
    appliesTo: ['post_work', 'coc', 'siting'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q19',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 7,
    clauseOrQuestion: 'Question 19',
    topic: 'Statutory Logbook Maintenance',
    requirementTitle: 'Logbook Maintenance & Routine Event Records',
    approvedParaphrase: 'A fire detection system logbook must be kept on site to record all tests, false alarms, faults, disablements, maintenance visits, and corrective actions with responsible signatures.',
    verbatimQuote: 'A dedicated logbook must be maintained on site recording every routine test, fault, false alarm, and servicing event with technician signatures.',
    category: 'occupancy_mandate',
    appliesTo: ['logbook', 'pre_work', 'post_work', 'coc'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q20',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 8,
    clauseOrQuestion: 'Question 20',
    topic: 'Wall Mounting Clearance Limits',
    requirementTitle: 'Detector Wall Mounting Distance: 25 mm min to 600 mm max',
    approvedParaphrase: 'Where detectors are wall-mounted, the sensing element must be positioned between 25 mm minimum and 600 mm maximum below ceiling level, and at least 500 mm from any adjacent wall.',
    verbatimQuote: 'When mounted on walls, the detector top must be between 25 mm and 600 mm below the ceiling.',
    category: 'detector_siting',
    appliesTo: ['post_work', 'coc', 'siting'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q21',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 8,
    clauseOrQuestion: 'Question 21',
    topic: 'Manual Call Point Mounting Height',
    requirementTitle: 'MCP Mounting Height 1.4 m (± 0.2 m)',
    approvedParaphrase: 'Manual call points must be mounted at a height of 1.4 metres from the finished floor level (tolerance range 1.2 m to 1.6 m, or lower for wheelchair accessibility).',
    verbatimQuote: 'Manual call points shall be mounted at a height of 1.4 m above finished floor level with a tolerance of plus or minus 0.2 m.',
    category: 'mcp_siting',
    appliesTo: ['pre_work', 'post_work', 'coc', 'siting'],
    mandatoryForCoc: true,
    status: 'Approved'
  },
  {
    id: 'req-poe-q22',
    sourceDocId: 'src-doc-02',
    sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
    pdfPage: 9,
    clauseOrQuestion: 'Question 22',
    topic: 'Optical Beam Detector Siting Spacing',
    requirementTitle: 'Optical Beam Detector Coverage Radius ≤ 7.5 m',
    approvedParaphrase: 'Optical beam smoke detectors protect an area up to 7.5 metres horizontally on either side of the beam centerline.',
    verbatimQuote: 'No point in the protected area shall be greater than 7.5 m horizontally from the nearest optical beam axis.',
    category: 'detector_siting',
    appliesTo: ['post_work', 'coc', 'siting'],
    mandatoryForCoc: true,
    status: 'Approved'
  }
];

// ==========================================
// DEFAULT AUDRIN ISSUER SETTINGS
// ==========================================
export const DEFAULT_AUDRIN_ISSUER_SETTINGS: AudrinIssuerSettings = {
  legalName: 'AUDRIN FIRE ENGINEERS (PTY) LTD',
  tradingName: 'Audrin Fire Engineers',
  registrationNumber: 'K2026089596',
  vatNumber: '4920281920',
  telephone: '071 415 6665 / 072 037 8471',
  email: 'bethuelthipe@gmail.com',
  physicalAddress: '27 Tshivhase Street, Pretoria West, 0008',
  postalAddress: 'P.O. Box 4812, Pretoria West, 0008',
  serviceDescriptor: 'Fire Detection & Alarm Systems | Registered SAQCC Fire Commissioner & SANS 10139 Certified',
  leadCommissionerName: 'Russia Bethuel Moukangwe / Noko Dina Ramphela',
  leadCommissionerSaqcc: 'Registered SAQCC Fire Technician Commissioner (SAQCC-9109170791081)',
  version: 1,
  updatedAt: '2026-09-02T08:00:00Z',
  updatedBy: 'Russia Bethuel Moukangwe (Managing Director & Registered SAQCC Fire Commissioner)'
};

// ==========================================
// DEFAULT CLIENT COMPANY BRANDING PROFILES
// ==========================================
export const INITIAL_COMPANY_BRANDINGS: CompanyProfileBranding[] = [
  {
    id: 'brand-01',
    orgId: 'org-tshivhase-01',
    registeredName: 'TSHIVHASE COMMERCIAL HOLDINGS (PTY) LTD',
    tradingName: 'Tshivhase Commercial Properties',
    registrationNumber: '2018/489201/07',
    vatNumber: '4820199481',
    physicalAddress: 'Tower Block 4, 150 Atterbury Road, Menlyn, Pretoria, 0181',
    postalAddress: 'PostNet Suite 290, Private Bag X10, Menlyn, 0181',
    billingAddress: 'Accounts Payable, 150 Atterbury Road, Menlyn, Pretoria, 0181',
    primaryContact: {
      name: 'Bethuel Moukangwe',
      role: 'Head of Facilities & Life Safety',
      telephone: '012 555 4910',
      mobile: '071 415 6665',
      email: 'bethuelmoukangwe8@gmail.com'
    },
    accountsContact: {
      name: 'Lerato Baloyi',
      telephone: '012 555 4912',
      email: 'accounts@tshivhaseholdings.co.za'
    },
    emergencyContact: {
      name: 'Control Room 24/7 Dispatch',
      telephone: '012 555 0911',
      mobile: '082 911 4400'
    },
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80',
    logoFileName: 'tshivhase_commercial_logo.png',
    letterheadUrl: '',
    letterheadFileName: 'tshivhase_official_letterhead.pdf',
    letterheadType: 'header_footer',
    footerText: 'Tshivhase Commercial Holdings (Pty) Ltd · Confidential Life-Safety Records',
    website: 'https://tshivhaseholdings.co.za',
    purchaseOrderReference: 'PO-TSH-2026-8841',
    clientSpecificNotes: 'All fire alarm testing must be coordinated 48 hours in advance with building security.',
    version: 1,
    updatedAt: '2026-09-01T10:00:00Z',
    updatedBy: 'Bethuel Moukangwe'
  }
];

// ==========================================
// INITIAL PRE-WORK INSPECTION RECORDS
// ==========================================
export const INITIAL_PRE_WORK_INSPECTIONS: PreWorkInspectionRecord[] = [
  {
    id: 'pre-01',
    inspectionNumber: 'PRE-2026-0041',
    siteId: 'site-01',
    siteName: 'Menlyn Central Commercial Park - Tower A',
    clientId: 'org-tshivhase-01',
    clientName: 'Tshivhase Commercial Holdings (Pty) Ltd',
    workOrderNumber: 'WO-AFE-2026-0982',
    purchaseOrderNumber: 'PO-TSH-2026-8841',
    inspectionDateTime: '2026-09-01T08:30:00Z',
    leadTechnicianName: 'Sipho Ndlovu',
    leadTechnicianSaqcc: 'SAQCC-8812040987',
    clientRepresentativeName: 'Bethuel Moukangwe',
    personsPresent: ['Sipho Ndlovu (Audrin Tech)', 'Kagiso Mokoena (Junior Tech)', 'Bethuel Moukangwe (Client Rep)'],
    reasonForInspection: 'Quarterly SANS 10139 routine audit and expansion survey for 3rd-floor tenant fitout',
    proposedWorkScope: 'Audit existing 4-loop addressable CIE, battery capacity discharge test, loop 3 resistance diagnostics, and verify compliance of 24 new optical smoke detectors prior to hot work.',
    
    // Safety & Access
    accessPermissionGranted: true,
    siteInductionCompleted: true,
    siteHazardsIdentified: ['Live 230V AC DB panel', 'Working at height (stepladders for 3.2m ceilings)', 'Tenant occupied suites'],
    riskControlsInPlace: true,
    ppeCompliant: true,
    permitToWorkRequired: true,
    permitNumber: 'PTW-MEN-2026-041',
    highRiskAreaNotes: 'Server Room on Level 2 has FM200 gaseous suppression; ensure mechanical hold-off pins inserted during loop isolation.',
    plannedImpairmentsAgreed: true,
    escalationContactsRecorded: 'Building Control Room: 012 555 0911 / Audrin On-Call: 071 415 6665',
    
    // Existing System Condition
    panelMakeModel: 'Advanced Electronics MxPro 5 (4-Loop)',
    systemCategory: 'L1',
    panelLocation: 'Ground Floor Main Security Foyer',
    mainsSupplyNormal: true,
    batteryVoltageVdc: 27.4,
    batteryChargerOperational: true,
    activeFaultIndicators: [],
    zoneLoopCount: 4,
    disabledIsolatedPoints: [],
    detectorsPhysicalCondition: 'intact',
    manualCallPointsCondition: 'normal',
    soundersCondition: 'verified_audible',
    interfacesCondition: 'BMS interface online; HVAC trip relays energized',
    cablingCondition: 'ph30_compliant_red',
    containmentFireStoppingOk: true,
    existingLogbookAvailable: true,
    asBuiltDrawingsAvailable: true,
    zoneChartAvailable: true,
    priorCocAvailable: true,
    
    // Baseline evidence
    beforePhotos: [
      {
        id: 'photo-pre-01',
        requestId: 'req-01',
        siteId: 'site-menlyn-01',
        stage: 'before',
        category: 'panel_display',
        categoryLabel: 'Quiescent Panel State',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        caption: 'CIE Main Foyer in Quiescent Healthy State before work',
        areaLocation: 'Ground Floor Foyer',
        capturedBy: 'Sipho Ndlovu',
        capturedAt: '2026-09-01T08:35:00Z',
        hash: 'sha256-pre01-cie-quiescent-9941a'
      },
      {
        id: 'photo-pre-02',
        requestId: 'req-01',
        siteId: 'site-menlyn-01',
        stage: 'before',
        category: 'equipment',
        categoryLabel: 'Standby Battery Enclosure',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        caption: 'Battery set 2x 12V 24Ah Yuasa in healthy condition',
        areaLocation: 'Panel Enclosure',
        capturedBy: 'Sipho Ndlovu',
        capturedAt: '2026-09-01T08:42:00Z',
        hash: 'sha256-pre02-batt-quiescent-8812f'
      }
    ],
    defectsFound: [],
    agreedIsolationsStartTimestamp: '2026-09-01T09:00:00Z',
    temporaryMeasuresInPlace: 'Manual security fire watch in Level 3 fitout area during loop isolation.',
    affectedPartiesNotified: true,
    scopeConfirmationNotes: 'Work scope confirmed with client facilities head; no hot work permits requested today.',
    clientExclusions: 'Tenant demised IT server room gaseous suppression discharge testing excluded.',
    
    technicianSignature: {
      id: 'sig-tech-01',
      signerName: 'Sipho Ndlovu',
      signerRole: 'Lead Fire Detection Technician',
      signerEmail: 'technicians@audrinfire.co.za',
      signatureTimestamp: '2026-09-01T08:50:00Z',
      ipAddress: '197.229.4.18',
      deviceMetadata: 'Samsung Galaxy Tab Active 4 / Chrome 126.0 Mobile',
      documentSha256Hash: '4a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
      consentStatement: 'I confirm that the pre-work safety and system condition inspection was conducted in strict accordance with SANS 10139 and SANS 10400-T.',
      otpVerified: true,
      otpVerifiedAt: '2026-09-01T08:49:15Z'
    },
    clientSignature: {
      id: 'sig-client-01',
      signerName: 'Bethuel Moukangwe',
      signerRole: 'Head of Facilities & Life Safety',
      signerEmail: 'bethuelmoukangwe8@gmail.com',
      signatureTimestamp: '2026-09-01T08:55:00Z',
      ipAddress: '197.229.4.18',
      deviceMetadata: 'Apple iPad Pro 12.9 / Safari 17.5',
      documentSha256Hash: '4a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
      consentStatement: 'I acknowledge the pre-work condition, agreed isolations, and authorize Audrin Fire Engineers to commence work.',
      otpVerified: true,
      otpVerifiedAt: '2026-09-01T08:54:30Z'
    },
    workflowStatus: 'approved',
    sourceCoverageStatus: 'source_limited_draft',
    sourceCitations: [
      {
        sourceDocId: 'src-doc-01',
        sourceDocTitle: 'SANS 10400-T:2011 (Edition 3)',
        pdfPage: 50,
        clauseOrQuestion: 'Clause 4.32',
        approvedParaphrase: 'Equipment readiness, visibility, and unobstructed access for maintenance.'
      },
      {
        sourceDocId: 'src-doc-02',
        sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
        pdfPage: 3,
        clauseOrQuestion: 'Question 1(g)',
        approvedParaphrase: 'Standby battery voltage and charger functionality verification.'
      }
    ],
    locked: true,
    createdAt: '2026-09-01T08:30:00Z',
    updatedAt: '2026-09-01T08:55:00Z'
  }
];

// ==========================================
// INITIAL POST-WORK INSPECTION RECORDS
// ==========================================
export const INITIAL_POST_WORK_INSPECTIONS: PostWorkInspectionRecord[] = [
  {
    id: 'post-01',
    inspectionNumber: 'POST-2026-0041',
    preWorkInspectionId: 'pre-01',
    preWorkInspectionNumber: 'PRE-2026-0041',
    siteId: 'site-01',
    siteName: 'Menlyn Central Commercial Park - Tower A',
    clientId: 'org-tshivhase-01',
    clientName: 'Tshivhase Commercial Holdings (Pty) Ltd',
    workOrderNumber: 'WO-AFE-2026-0982',
    completionDateTime: '2026-09-01T15:00:00Z',
    leadTechnicianName: 'Sipho Ndlovu',
    leadTechnicianSaqcc: 'SAQCC-8812040987',
    
    // Section A
    actualWorkCompleted: 'Completed quarterly inspection, full loop 3 test with 24 addressable optical smoke detectors tested with Solo smoke aerosol, battery impedance and autonomy calculation, bedhead sounder dB(A) verification, and logbook endorsement.',
    deviationsFromScope: 'None. All tested devices passed within SANS 10139 thresholds.',
    clientExclusions: 'Tenant server room gaseous suppression remained on auto-isolate per client directive.',
    componentsInstalled: [
      {
        itemType: 'optical_smoke',
        make: 'Apollo',
        model: 'Discovery Optical Smoke (58000-600)',
        serialOrAddress: 'Loop 3 / Addr 12-35',
        location: 'Level 3 East Wing Commercial Suites',
        quantity: 24
      }
    ],
    
    // Section B: Test Results
    visualInspectionPassed: true,
    panelOperationalCheckPassed: true,
    zonesLoopsTestedCount: 4,
    alarmSounderTestedDba: 71.5, // >= 65 dB(A) pass
    sounderLevelPass: true,
    standbyAutonomyTestedHours: 24.5, // >= 24h pass
    evacuationAlarmDurationMinutes: 30, // >= 30m pass
    powerAutonomyPass: true,
    mainsFailFaultNotificationMinutes: 12, // <= 30m pass
    detectorFaultResponseSeconds: 85, // <= 200s pass
    faultResponsePass: true,
    mcpMountingHeightM: 1.4, // 1.4m pass
    mcpMountingPass: true,
    smokeDetectorRadiusM: 7.2, // <= 7.5m pass
    heatDetectorRadiusM: 4.8, // <= 5.3m pass
    detectorSitingPass: true,
    cablingPH30Verified: true,
    cablingPass: true,
    singleFaultAreaM2: 780, // <= 1000m2 pass
    singleFaultPass: true,
    
    testEquipmentUsed: [
      {
        equipmentName: 'Solo 330 Smoke Detector Aerosol Tester',
        serialNumber: 'SOLO-88412-SA',
        calibrationExpiryDate: '2027-04-15'
      },
      {
        equipmentName: 'Testo 815 Type 2 Sound Level Meter',
        serialNumber: 'TESTO-49102-CAL',
        calibrationExpiryDate: '2027-01-20'
      },
      {
        equipmentName: 'Fluke 87V Industrial Multimeter & Battery Tester',
        serialNumber: 'FLUKE-901844-ZA',
        calibrationExpiryDate: '2026-12-10'
      }
    ],
    
    // Section C: Restoration
    isolationsRemovedTimestamp: '2026-09-01T14:40:00Z',
    systemFullyRestored: true,
    outstandingImpairments: 'None. All loops and zones returned to healthy quiescent status.',
    clientDemonstrationCompleted: true,
    documentsHandedOver: ['SANS 10139 Site Logbook Entry #LB-2026-088', 'Sounder Audibility Certificate Record', 'Zone 3 Sensor As-Built Markup'],
    afterPhotos: [
      {
        id: 'photo-post-01',
        requestId: 'req-01',
        siteId: 'site-menlyn-01',
        stage: 'after',
        category: 'panel_display',
        categoryLabel: 'Quiescent Panel State',
        imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
        caption: 'CIE restored to healthy quiescent state with 0 active faults',
        areaLocation: 'Ground Floor Security Room',
        capturedBy: 'Sipho Ndlovu',
        capturedAt: '2026-09-01T14:45:00Z',
        hash: 'sha256-post01-cie-restored-4412c'
      }
    ],
    asBuiltDrawingsAttached: true,
    
    technicianDeclarationSigned: true,
    technicianSignature: {
      id: 'sig-tech-post-01',
      signerName: 'Sipho Ndlovu',
      signerRole: 'Lead Fire Detection Technician',
      signerEmail: 'technicians@audrinfire.co.za',
      signatureTimestamp: '2026-09-01T15:05:00Z',
      ipAddress: '197.229.4.18',
      deviceMetadata: 'Samsung Galaxy Tab Active 4 / Chrome 126.0 Mobile',
      documentSha256Hash: '9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b',
      consentStatement: 'I declare that the fire detection system work, tests and restoration were conducted in full accordance with SANS 10139 requirements.',
      otpVerified: true,
      otpVerifiedAt: '2026-09-01T15:04:10Z'
    },
    clientAcknowledgementSigned: true,
    clientSignature: {
      id: 'sig-client-post-01',
      signerName: 'Bethuel Moukangwe',
      signerRole: 'Head of Facilities & Life Safety',
      signerEmail: 'bethuelmoukangwe8@gmail.com',
      signatureTimestamp: '2026-09-01T15:15:00Z',
      ipAddress: '197.229.4.18',
      deviceMetadata: 'Apple iPad Pro 12.9 / Safari 17.5',
      documentSha256Hash: '9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b',
      consentStatement: 'I acknowledge that the system has been restored to fully operational quiescent condition and all handover documents received.',
      otpVerified: true,
      otpVerifiedAt: '2026-09-01T15:14:00Z'
    },
    workflowStatus: 'approved',
    sourceCoverageStatus: 'source_limited_draft',
    sourceCitations: [
      {
        sourceDocId: 'src-doc-02',
        sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
        pdfPage: 4,
        clauseOrQuestion: 'Question 1(r)',
        approvedParaphrase: 'Bedhead sound level ≥ 65 dB(A) with doors closed.'
      },
      {
        sourceDocId: 'src-doc-02',
        sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
        pdfPage: 3,
        clauseOrQuestion: 'Question 1(g)',
        approvedParaphrase: 'Standby autonomy ≥ 24h quiescent + 30 min full alarm.'
      }
    ],
    locked: true,
    createdAt: '2026-09-01T14:30:00Z',
    updatedAt: '2026-09-01T15:15:00Z'
  }
];

// ==========================================
// INITIAL DEFECTS & CORRECTIVE ACTIONS
// ==========================================
export const INITIAL_DEFECTS: DefectRecord[] = [
  {
    id: 'def-01',
    siteId: 'site-02',
    siteName: 'Centurion Logistics Hub - Warehouse C',
    clientId: 'org-tshivhase-01',
    title: 'Manual Call Point in loading bay obstructed by pallet rack',
    description: 'Green dot manual call point #MCP-L2-04 is partially obstructed by warehouse pallet shelving, preventing clear 1.4m access.',
    riskLevel: 'critical',
    blocksCocIssuance: true,
    status: 'resolved',
    remedialAction: 'Pallet rack relocated 1.5m away; clear yellow hatched walkway painted; MCP accessibility restored per SANS 10400-T Clause 4.32.',
    responsibleParty: 'Client / Property Manager',
    targetDate: '2026-09-01',
    resolvedDate: '2026-09-01T11:30:00Z',
    resolvedBy: 'Sipho Ndlovu (Audrin Tech)',
    resolutionNotes: 'Verified clear unobstructed 1.4m access to call point.',
    sourceCitation: {
      sourceDocId: 'src-doc-01',
      sourceDocTitle: 'SANS 10400-T:2011 (Edition 3)',
      pdfPage: 50,
      clauseOrQuestion: 'Clause 4.32',
      approvedParaphrase: 'Equipment readiness, visibility, and unobstructed accessibility.'
    },
    createdAt: '2026-08-30T10:00:00Z'
  },
  {
    id: 'def-02',
    siteId: 'site-01',
    siteName: 'Menlyn Central Commercial Park - Tower A',
    clientId: 'org-tshivhase-01',
    title: 'Pitched canopy detector wall clearance check on roof walkway',
    description: 'Verify point smoke detector #L4-D18 maintains min 500 mm wall clearance under exterior access overhang.',
    riskLevel: 'minor',
    blocksCocIssuance: false,
    status: 'resolved',
    remedialAction: 'Measured at 620 mm from wall; complies with SANS 10139 min 500 mm requirement.',
    responsibleParty: 'Audrin Fire Engineers',
    targetDate: '2026-09-05',
    resolvedDate: '2026-09-01T14:10:00Z',
    resolvedBy: 'Sipho Ndlovu',
    resolutionNotes: 'Laser measure confirms 620 mm clearance.',
    sourceCitation: {
      sourceDocId: 'src-doc-02',
      sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
      pdfPage: 8,
      clauseOrQuestion: 'Question 20',
      approvedParaphrase: 'Detector wall clearance minimum 500 mm from any adjacent wall.'
    },
    createdAt: '2026-08-31T09:00:00Z'
  },
  {
    id: 'def-03',
    siteId: 'site-centurion-02',
    siteName: 'Centurion Logistics & Cold Storage Hub',
    clientId: 'org-tshivhase-01',
    title: 'Standby Battery Internal Resistance High & Autonomy Failure (< 21.6V DC)',
    description: 'Secondary 24V DC battery string measured high internal impedance (1.4Ω) with terminal voltage sagging to 20.8V under 30-minute evacuation load test. Fails SANS 10139 24h standby + 30m full alarm requirement.',
    riskLevel: 'critical',
    blocksCocIssuance: true,
    status: 'open',
    remedialAction: 'Immediate replacement of 2x 12V 24Ah VRLA battery cells, calibration of float charger, and repeat full load autonomy test per SANS 10139 Clause 6.3.',
    responsibleParty: 'Audrin Fire Engineers',
    targetDate: '2026-09-02',
    sourceCitation: {
      sourceDocId: 'src-doc-02',
      sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
      pdfPage: 3,
      clauseOrQuestion: 'Question 1(g)',
      approvedParaphrase: 'Standby autonomy ≥ 24h quiescent + 30 min full alarm.'
    },
    createdAt: '2026-09-02T08:15:00Z'
  },
  {
    id: 'def-04',
    siteId: 'site-menlyn-01',
    siteName: 'Menlyn Central Corporate Tower',
    clientId: 'org-tshivhase-01',
    title: 'Loop 2 Addressable Class A Isolator Open-Circuit Fault on Level 3',
    description: 'Class A addressable loop continuity break detected between isolator base L2-ISO-08 and L2-D044. Loop running in degraded single-ended radial spur mode, jeopardizing evacuation signaling.',
    riskLevel: 'critical',
    blocksCocIssuance: true,
    status: 'open',
    remedialAction: 'Inspect electrical riser cable sleeve on Level 3 East, repair pinched PH 30 conductor, and verify return path impedance ≤ 25 ohms.',
    responsibleParty: 'Audrin Fire Engineers',
    targetDate: '2026-09-03',
    sourceCitation: {
      sourceDocId: 'src-doc-02',
      sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
      pdfPage: 2,
      clauseOrQuestion: 'Question 1(d)',
      approvedParaphrase: 'Loop integrity and short-circuit isolation prevents single-fault disabling > 1,000 m².'
    },
    createdAt: '2026-09-03T11:00:00Z'
  }
];

// ==========================================
// INITIAL GOOGLE SHEETS MIRROR STATE
// ==========================================
export const INITIAL_GOOGLE_SHEETS_STATE: GoogleSheetsMirrorState = {
  connected: true,
  accountEmail: 'bethuelmoukangwe8@gmail.com',
  spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  spreadsheetTitle: 'Audrin Fire Engineers - SANS 10139 Live Compliance Mirror',
  spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
  lastSyncTimestamp: '2026-09-02T05:30:00Z',
  syncStatus: 'idle',
  autoSyncEnabled: true,
  mirroredTabs: [
    { tabName: 'Sites', rowCount: 4, lastUpdated: '2026-09-02T05:30:00Z' },
    { tabName: 'Systems', rowCount: 4, lastUpdated: '2026-09-02T05:30:00Z' },
    { tabName: 'Assets', rowCount: 148, lastUpdated: '2026-09-02T05:30:00Z' },
    { tabName: 'Logbook Entries', rowCount: 42, lastUpdated: '2026-09-02T05:30:00Z' },
    { tabName: 'Inspections', rowCount: 16, lastUpdated: '2026-09-02T05:30:00Z' },
    { tabName: 'Defects', rowCount: 8, lastUpdated: '2026-09-02T05:30:00Z' },
    { tabName: 'Corrective Actions', rowCount: 8, lastUpdated: '2026-09-02T05:30:00Z' },
    { tabName: 'COCs', rowCount: 4, lastUpdated: '2026-09-02T05:30:00Z' },
    { tabName: 'Audit Export', rowCount: 312, lastUpdated: '2026-09-02T05:30:00Z' }
  ],
  syncQueue: []
};

// ==========================================
// INITIAL EXPORT JOBS
// ==========================================
export const INITIAL_EXPORT_JOBS: ExportJobRecord[] = [
  {
    id: 'exp-01',
    documentType: 'coc',
    documentNumber: 'COC-SANS10139-2026-0842',
    format: 'pdf',
    status: 'completed',
    requestedBy: 'Bethuel Moukangwe',
    requestedAt: '2026-09-01T15:30:00Z',
    fileSizeBytes: 2450000,
    downloadUrl: '#',
    contentHashSha256: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
    watermark: 'SOURCE-LIMITED DRAFT - NOT AN ISSUABLE CERTIFICATE'
  },
  {
    id: 'exp-02',
    documentType: 'logbook',
    documentNumber: 'LOG-MENLYN-2026-Q3',
    format: 'xlsx',
    status: 'completed',
    requestedBy: 'Bethuel Moukangwe',
    requestedAt: '2026-09-01T16:00:00Z',
    fileSizeBytes: 820000,
    downloadUrl: '#',
    contentHashSha256: '8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d',
    watermark: 'OFFICIAL CONTROLLED COPY'
  }
];
