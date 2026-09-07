export type UserRole = 'customer' | 'staff' | 'content_admin' | 'ops_admin' | 'super_admin' | 'technician_applicant' | 'recruitment_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  companyName: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  receiveAllMeetingMinutes?: boolean;
}

export type SystemCategory = 'M' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'P1' | 'P2';
export type UrgencyLevel = 'routine' | 'urgent' | 'emergency_fault' | 'critical_fault';

export type ServiceCategory = 
  | 'consultation_design'
  | 'installation_commissioning'
  | 'maintenance_testing'
  | 'faults_repairs'
  | 'documentation_training';

export interface ServiceRecord {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  scope: string[];
  applicableBuildingTypes: string[];
  process: string[];
  deliverables: string[];
  clientResponsibilities: string[];
  relatedServiceSlugs: string[];
  faqs: { question: string; answer: string }[];
  featured: boolean;
  order: number;
  isPublished: boolean;
  metaTitle: string;
  metaDescription: string;
  sansStandard?: string;
}

export interface HowWeWorkStage {
  stepNumber: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  sansStandardNote: string;
  audioDurationSeconds: number;
  narrationScript: string;
}

export type RequestStatus =
  | 'Submitted'
  | 'submitted'
  | 'Under review'
  | 'under_review'
  | 'More information required'
  | 'Site survey scheduled'
  | 'Survey completed'
  | 'Quotation in preparation'
  | 'Quotation issued'
  | 'Approved'
  | 'Work scheduled'
  | 'Work in progress'
  | 'Testing and commissioning'
  | 'Documentation in preparation'
  | 'Completed'
  | 'completed'
  | 'Closed'
  | 'Cancelled';

export type RequestUrgency = 'routine' | 'urgent' | 'emergency_fault' | 'critical_fault';

export interface StatusHistoryItem {
  id: string;
  timestamp: string;
  status: RequestStatus;
  actor: string;
  actorRole: string;
  notes: string;
  isCustomerVisible: boolean;
}

export interface SiteRecord {
  id: string;
  name: string;
  siteCode?: string;
  status?: string;
  address: string;
  city: string;
  postalCode: string;
  buildingType: string;
  occupancyClass?: string;
  buildingOccupancyClass?: string;
  systemType: 'Conventional' | 'Addressable' | 'Networked' | 'Hybrid' | 'Unknown / To Survey';
  panelMakeModel: string;
  loopCount: number;
  zoneCount?: number;
  detectorCountApprox: number;
  hasAsBuiltDrawings: boolean;
  hasZoneChart: boolean;
  hasLogbook: boolean;
  lastServiceDate?: string;
  contactPerson: string;
  contactPhone: string;
  systemCategory?: string;
  latitude?: number;
  longitude?: number;
  operatingHours?: string;
  panelDetails?: {
    brand: string;
    model: string;
    loops: number;
    zones: number;
    totalDevices: number;
  };
}

export interface ServiceRequest {
  id: string;
  referenceNumber: string; // e.g. AFE-2026-0842
  userId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  organisationName: string;
  siteId: string;
  siteName: string;
  siteAddress: string;
  serviceSlug: string;
  serviceTitle: string;
  urgency: RequestUrgency;
  description: string;
  preferredVisitDate: string;
  panelBrandModel?: string;
  faultSymptoms?: string[];
  status: RequestStatus;
  statusHistory: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
  assignedEngineer?: string;
  currentStage?: number;
  beforePhotosCount: number;
  duringPhotosCount: number;
  afterPhotosCount: number;
  videosCount: number;
  documentsCount: number;
  hasPreWorkReport: boolean;
  hasPostWorkReport: boolean;
  hasPresentation: boolean;
  hasScheduledVisit: boolean;
  hasZoomMeeting: boolean;
  hasAiMinutes: boolean;
  buildingType?: string;
  serviceId?: string;
  serviceCategory?: string;
  systemCategoryTarget?: string;
  existingSystemDetails?: any;
  preferredDate?: string;
  preferredTimeSlot?: string;
  scopeDescription?: string;
  hasAsBuiltDrawings?: boolean;
  attachedDocumentUrls?: string[];
  photoEvidenceIds?: string[];
  videoEvidenceIds?: string[];
  consentScopeExclusions?: boolean;
  consentDataProcessing?: boolean;
}

export type PhotoEvidenceStage = 'before' | 'during' | 'after';
export type PhotoEvidenceCategory = 
  | 'fault_evidence'
  | 'panel_display'
  | 'equipment'
  | 'detector_device'
  | 'detector_inspection'
  | 'cable_route'
  | 'installation'
  | 'testing'
  | 'commissioning'
  | 'outstanding_item'
  | 'corrective_action'
  | 'client_concern';

export interface PhotoEvidence {
  id: string;
  requestId: string;
  siteId?: string;
  stage: PhotoEvidenceStage;
  category: PhotoEvidenceCategory | string;
  categoryLabel: string;
  caption: string;
  areaLocation: string;
  equipmentRef?: string;
  equipmentIdentifier?: string;
  imageUrl: string;
  uploadedBy?: string;
  capturedBy?: string;
  uploaderRole?: string;
  uploadedAt?: string;
  capturedAt?: string;
  reviewStatus?: 'awaiting_review' | 'approved' | 'quarantined' | 'rejected';
  includedInReport?: boolean;
  isCompliantBaseline?: boolean;
  notes?: string;
  hash: string;
  pairedAfterPhotoId?: string;
  pairedBeforePhotoId?: string;
}

export interface VideoEvidence {
  id: string;
  requestId: string;
  title?: string;
  caption: string;
  description?: string;
  location: string;
  areaLocation?: string;
  equipmentRef: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  resolution?: string;
  uploadedBy: string;
  uploadedAt: string;
  reviewStatus: 'awaiting_review' | 'approved' | 'quarantined';
  includedInReport: boolean;
  hash: string;
  fileSizeBytes: number;
  timestampMarkers: { timeSeconds: number; label: string }[];
}

export interface DocumentRecord {
  id: string;
  requestId: string;
  fileName: string;
  fileType: string;
  category: 'as_built_drawing' | 'zone_chart' | 'logbook' | 'commissioning_sheet' | 'technical_spec' | 'client_upload';
  fileSizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
  scanStatus: 'clean' | 'scanning' | 'quarantined';
  version: number;
  downloadUrl: string;
}

export interface ConditionReport {
  id: string;
  requestId: string;
  siteId?: string;
  reportType: 'pre_work' | 'post_work';
  reportNumber: string; // e.g. REP-PRE-2026-0842-V1
  version: number;
  generatedAt: string;
  generatedBy?: string;
  clientName: string;
  organisationName: string;
  siteName: string;
  siteAddress: string;
  serviceTitle: string;
  scopeSummary: string;
  visibleConditionNotes: string;
  physicalAssessmentRequiredNotes: string;
  recommendedNextStep: string;
  limitationsDisclaimer: string;
  evidenceSnapshot: {
    photoIds?: string[];
    videoIds?: string[];
    photographs: {
      caption: string;
      stage: PhotoEvidenceStage;
      category?: string;
      location?: string;
      areaLocation?: string;
      imageUrl: string;
      [key: string]: any;
    }[];
    videos?: any[];
  };
  pdfUrl?: string;
  status?: 'draft' | 'frozen_final' | 'acknowledged_by_client' | 'correction_requested';
  isLocked?: boolean;
  clientAcknowledgementNotes?: string;
}

export interface PowerPointPresentation {
  id: string;
  requestId: string;
  presentationNumber: string;
  title: string;
  slideCount: number;
  generatedAt: string;
  version?: number;
  theme: string;
  slides: {
    title: string;
    subtitle?: string;
    bullets: string[];
    imageUrls?: string[];
    callout?: string;
  }[];
  pptxUrl?: string;
}

export type AppointmentType =
  | 'consultation'
  | 'site_survey_planning'
  | 'remote_system_review'
  | 'fault_consultation'
  | 'design_review'
  | 'quotation_discussion'
  | 'progress_review'
  | 'testing_commissioning_review'
  | 'report_presentation'
  | 'handover_maintenance_planning';

export interface CalendarAppointment {
  id: string;
  requestId: string;
  requestRef: string;
  appointmentType: AppointmentType;
  appointmentTypeLabel: string;
  title: string;
  description?: string;
  date?: string;
  siteName?: string;
  engineerName?: string;
  startTime: string;
  endTime: string;
  timezone: string; // Africa/Johannesburg
  assignedStaff: string;
  assignedStaffEmail: string;
  clientName: string;
  clientEmail: string;
  locationType: 'on_site' | 'zoom_remote';
  siteAddress?: string;
  safePreparationNotes: string;
  googleCalendarEventId: string;
  syncStatus: 'synced' | 'pending_sync' | 'cancelled';
  rsvpStatus: 'accepted' | 'tentative' | 'declined' | 'needs_action';
  status?: string;
}

export interface ZoomMeetingDetails {
  id: string;
  requestId: string;
  appointmentId: string;
  meetingTopic: string;
  scheduledTime: string;
  durationMinutes: number;
  meetingIdMasked: string; // e.g. "849 **** 2940"
  meetingIdReal: string;
  passcodeMasked: string; // e.g. "******"
  passcodeReal: string;
  joinUrl: string;
  isHostReady: boolean;
  waitingRoomEnabled: boolean;
  participantConsentGiven: boolean;
  recordingStatus: 'not_started' | 'recording' | 'processing_transcript' | 'completed';
}

export interface AiMeetingMinutes {
  id: string;
  meetingId: string;
  requestId: string;
  meetingTitle: string;
  dateTime: string;
  attendees: string[];
  apologies: string[];
  agenda: string[];
  executiveSummary: string;
  discussionPoints: { topic: string; details: string; raisedBy: string }[];
  clientConcerns: string[];
  decisionsAgreed: string[];
  actionItems: {
    id: string;
    task: string;
    owner: string;
    dueDate: string;
    status: 'pending' | 'in_progress' | 'completed';
    blocker?: string;
  }[];
  nextWorkflowStage: string;
  complianceDisclaimer: string;
  version: number;
  status: 'draft_ai_generated' | 'reviewed' | 'client_acknowledged' | 'correction_requested';
  pdfDownloadUrl?: string;
}

export interface EmailLogEntry {
  id: string;
  recipientEmail: string;
  recipientName: string;
  to?: string;
  subject: string;
  serviceCategory: string;
  emailType: 'auto_reply_request' | 'fault_triage' | 'pre_work_report' | 'post_work_report' | 'appointment_invite' | 'meeting_minutes' | string;
  templateUsed?: string;
  bodyText: string;
  sentAt: string;
  deliveryStatus: 'delivered' | 'bounced' | 'queued' | 'simulated';
  status?: string;
  hasAttachment: boolean;
  attachmentName?: string;
  correlationId: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorName?: string;
  actorRole: string;
  action: string;
  recordType: string;
  recordId: string;
  entityType?: string;
  entityId?: string;
  ipAddress: string;
  details: string;
  oldValue?: string;
  newValue?: string;
}

export interface GoogleSheetRow {
  uuid: string;
  tabName: string;
  colA: string;
  colB: string;
  colC: string;
  colD: string;
  colE: string;
  colF: string;
  lastUpdated: string;
  syncStatus: 'synced' | 'pending';
}

// ==========================================
// SANS 10139 & SAQCC COMMISSIONER MODULE DATA TYPES
// Source of truth: Summative POE Module SANS 10139 / SAQCC Commissioner
// ==========================================

export type LogbookEntryType = 
  | 'daily' 
  | 'weekly' 
  | 'quarterly' 
  | 'annual' 
  | 'fault' 
  | 'false_alarm' 
  | 'remedial';

export interface SansLogbookEntry {
  id: string;
  siteId: string;
  siteName: string;
  entryType: LogbookEntryType;
  timestamp: string;
  date: string;
  time: string;
  inspectedBy: string;
  inspectorIdOrSaqcc?: string;
  notes: string;
  systemCategory?: SystemCategory;
  
  // Specific SANS 10139 check metrics
  quiescentStateOk?: boolean;
  mcpTestedRef?: string;
  soundersAudibleOk?: boolean;
  dbMeasured?: number; // min 65 dB(A) at bedhead, max 130 dB(A)
  sounderCountChecked?: number; // min 2 sounders
  batteryVoltage?: number;
  batteryAutonomyVerified?: boolean; // 24h standby + 30 min evacuation
  mainsFailTested?: boolean; // <= 30 min indication
  shortCircuitFaultTested?: boolean; // <= 200s indication
  classACircuitsVerified?: boolean;
  cableIntegrityVerified?: boolean; // PH 30 RED, >=1.0mm2, segregated conduit
  
  // Fault & incident details
  faultType?: 'short_circuit' | 'open_circuit' | 'mains_failure' | 'detector_removed' | 'earth_fault' | 'battery_low';
  deviceAddress?: string;
  zone?: string;
  faultCleared?: boolean;
  clearedTimestamp?: string;
  
  // False alarm categorization
  falseAlarmCategory?: 'environmental_dust_steam' | 'cooking' | 'contractor_work' | 'malicious_mcp' | 'equipment_drift' | 'unknown';
  correctiveAction?: string;
  
  signatureHash?: string;
}

export interface SansCocCertificate {
  id: string;
  cocNumber: string; // e.g. COC-SANS10139-2026-0842
  issueDate: string;
  siteId: string;
  siteName: string;
  siteAddress: string;
  clientName: string;
  organisationName: string;
  
  // Commissioner Credentials from POE
  commissionerName: string;
  commissionerIdNumber: string; // e.g. 9109170791081
  commissionerEmail: string; // e.g. rampheledina@gmail.com / bethuelmoukangwe8@gmail.com
  commissionerSaqccNumber: string;
  companyRegistrationNumber: string; // K2026089596
  
  // System Classification & Scope
  systemCategory: SystemCategory; // 'M' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'P1' | 'P2'
  systemObjective: 'Life Protection' | 'Property Protection' | 'Dual Protection (Life & Property)';
  isSleepingRisk: boolean; // If true, Category M is invalid per 1b
  buildingOccupancyType: string;
  
  // Technical Specifications & Verification Matrix (SANS 10139 POE Rules)
  powerSupplyAutonomy: {
    mainsVoltage: number; // nominal 230V AC
    batteryType: string;
    batteryCapacityAh: number;
    standbyAutonomyHours: number; // SANS 10139 requirement: >= 24h
    evacuateAlarmDurationMinutes: number; // SANS 10139 requirement: >= 30 min
    standbyGeneratorPresent: boolean;
    mainsFailIndicationTimeMinutes: number; // SANS 10139 requirement: <= 30 min
    passed: boolean;
  };
  
  cablingAndCircuits: {
    cableSpecification: string; // "PH 30 Enhanced Fire Resistance"
    conductorCrossSectionMm2: number; // SANS 10139 requirement: >= 1.0 mm²
    cableColour: string; // Preferably RED
    conduitSegregationVerified: boolean; // Not installed in same conduit as other services
    classACircuitsPhysicalConductors: boolean; // Addressable lines run as Class A
    singleFaultDisableLimitM2: number; // SANS 10139 requirement: <= 1,000 m²
    sounderCircuitsIsolatedInSeparateSheaths: boolean; // SANS 10139 requirement: >=2 sounder circuits not in common sheath
    passed: boolean;
  };
  
  detectorSitingAndSpacing: {
    smokeDetectorSpacingRadiusM: number; // SANS 10139 flat ceiling: <= 7.5 m
    heatDetectorSpacingRadiusM: number; // SANS 10139 flat ceiling: <= 5.3 m
    pitchedRoofSlopeDegrees: number;
    pitchedRoofSpacingAdjustmentPercent: number; // 1% per degree slope up to max 25%
    smokeApexRoofHeightThresholdMm: number; // < 600 mm treated as flat / apex within 600 mm
    heatApexRoofHeightThresholdMm: number; // < 150 mm treated as flat
    beamDetectorMaxMountingRadiusM: number; // SANS 10139: no space > 7.5 m from beam
    aspiratingSamplingPointsApexMm: number; // SANS 10139: within 600 mm of apex
    wallClearanceMm: number; // min 500 mm from wall
    ceilingClearanceRangeMm: string; // 25 mm min to 600 mm max from ceiling
    mcpMountingHeightM: number; // 1.4 m (+/- 0.2 m, range 1.2 m - 1.4 m)
    heatDetectorPlacementRulesCompliant: boolean; // Forbidden in Cat P smouldering & Cat L escape routes
    passed: boolean;
  };
  
  audibilityAndSounders: {
    soundLevelBedheadDba: number; // SANS 10139: >= 65 dB(A)
    maxSoundPressureAccessibleDba: number; // SANS 10139: <= 130 dB(A)
    sounderCount: number; // SANS 10139: >= 2 sounders minimum
    passed: boolean;
  };
  
  faultResponseTimes: {
    detectorShortOrOpenCircuitFaultSeconds: number; // SANS 10139: <= 200 seconds
    mainsDisconnectionFaultMinutes: number; // SANS 10139: <= 30 minutes
    passed: boolean;
  };
  
  deviceSchedule: {
    blueDotSmokeDetectors: number; // Blue Dot = Smoke Detector
    blackDotHeatDetectors: number; // Black Dot = Heat Detector
    redDotSoundersSirens: number; // Red Dot = Sounder / Siren
    greenDotManualCallPoints: number; // Green Dot = Manual Call Point (1.4m)
    flameDetectorsIrUv: number;
    multiSensorDetectors: number;
    aspiratingSamplingPoints: number;
    opticalBeamDetectors: number;
  };
  
  variationsAndExclusions: string;
  overallComplianceStatus: 'Fully Compliant' | 'Non-Compliant - Action Required' | 'Approved with Minor Documented Variations';
  commissionerDeclaration: string;
  isSigned: boolean;
  signatureHash: string;

  // Official SAQCC Commissioner Module Extensions
  projectReference?: string;
  clientSafetyOfficer?: {
    name: string;
    email: string;
    contactNumber: string;
    role?: string;
  };
  installingCompany?: {
    legalName: string;
    registrationNumber: string;
    vatNumber?: string;
    telephone: string;
    email: string;
    physicalAddress: string;
    postalAddress?: string;
    logoUrl?: string;
  };
  commissionerSaqccExpiryDate?: string;
  commissionerRegistrationValid?: boolean;
  leadTechnician?: {
    name: string;
    saqccNumber: string;
    expiryDate: string;
  };
  controlPanelDetails?: {
    brand: string;
    model: string;
    serialNumber: string;
    location: string;
    loopCount: number;
    zoneCount: number;
  };
  areasAndZonesCovered?: string[];
  inspectionRecords?: {
    preWorkInspectionNumber?: string;
    preWorkDate?: string;
    postWorkInspectionNumber?: string;
    postWorkDate?: string;
    asBuiltDrawingsRef?: string;
    logbookRef?: string;
    zoneChartVerified?: boolean;
  };
  deviationsAndOutstandingWork?: string;
  correctiveActionsAgreed?: string;
  clientDeclaration?: string;
  commissionerSignatureData?: DigitalSignatureData;
  clientSignatureData?: DigitalSignatureData;
  certificateStatus?: 'Draft' | 'Issued' | 'Revised' | 'Cancelled';
  revisionNumber?: string;
  applicableStandard?: string;
  moduleRevisionUsed?: string;
  documentChecksumSha256?: string;
  qrVerificationUrl?: string;
  revisionHistory?: CertificateRevisionRecord[];
  activeRevisionId?: string;
  emailDispatches?: {
    sentAt: string;
    recipients: string[];
    subject: string;
    status: 'Delivered' | 'Queued' | 'Failed';
    checksum: string;
  }[];
}

export interface CertificateRevisionRecord {
  id: string;
  cocId: string;
  cocNumber: string;
  revisionNumber: string;
  issuedAt: string;
  issuedBy: {
    name: string;
    email: string;
    role: string;
    saqccNumber?: string;
    idNumber?: string;
  };
  reasonForRevision: string;
  changeSummary?: string[];
  documentChecksumSha256: string;
  signatureHash?: string;
  systemCategory: SystemCategory;
  overallComplianceStatus: string;
  siteId: string;
  siteName: string;
  clientName: string;
  isImmutable: boolean;
  auditTrailRef: string;
  snapshot: SansCocCertificate;
}

export interface SansInspectionItem {
  id: string;
  ruleReference: string; // e.g. "1a", "1g", "1m", "10", "11", "15", "20", "21", "22"
  title: string;
  requirement: string;
  standardParameter: string;
  toleranceLimit: string;
  status: 'pass' | 'fail' | 'na' | 'attention';
  measuredValue: string;
  notes: string;
}

// ==========================================
// SOURCE-CONTROLLED FIRE DETECTION MODULE TYPES
// Binding source: SANS 10400-T (Edition 3) & Summative POE Module SANS 10139 (ND Ramphela)
// ==========================================

export interface ApprovedSourceDocument {
  id: string;
  fileName: string;
  documentTitle: string;
  editionOrDate: string;
  contentHash: string; // SHA-256
  approvalStatus: 'Approved - Controlled Technical Source' | 'Under Review' | 'Deprecated';
  uploader: string;
  approvalDate: string;
  approvedBy: string;
  pageCount: number;
  pdfUrl?: string;
  summaryScope: string;
  isControlled: boolean;
}

export interface SourceCitation {
  sourceDocId: string;
  sourceDocTitle: string;
  pdfPage: number;
  clauseOrQuestion: string;
  approvedParaphrase: string;
  verbatimQuote?: string;
}

export interface SourceRequirement {
  id: string;
  sourceDocId: string;
  sourceDocTitle: string;
  pdfPage: number;
  clauseOrQuestion: string;
  topic: string;
  requirementTitle: string;
  approvedParaphrase: string;
  verbatimQuote: string;
  category: 'occupancy_mandate' | 'power_autonomy' | 'cable_circuits' | 'detector_siting' | 'sounder_audibility' | 'fault_response' | 'mcp_siting' | 'competent_person';
  appliesTo: ('logbook' | 'pre_work' | 'post_work' | 'coc' | 'siting')[];
  mandatoryForCoc: boolean;
  status: 'Approved' | 'Source-Limited Draft';
}

export interface CompanyProfileBranding {
  id: string;
  orgId: string;
  registeredName: string;
  tradingName: string;
  registrationNumber: string;
  vatNumber?: string;
  physicalAddress: string;
  postalAddress: string;
  billingAddress: string;
  primaryContact: {
    name: string;
    role: string;
    telephone: string;
    mobile: string;
    email: string;
  };
  accountsContact: {
    name: string;
    telephone: string;
    email: string;
  };
  emergencyContact: {
    name: string;
    telephone: string;
    mobile: string;
  };
  logoUrl?: string;
  logoFileName?: string;
  letterheadUrl?: string;
  letterheadFileName?: string;
  letterheadType?: 'header_footer' | 'full_page_background';
  footerText?: string;
  website?: string;
  purchaseOrderReference?: string;
  clientSpecificNotes?: string;
  version: number;
  updatedAt: string;
  updatedBy: string;
}

export interface AudrinIssuerSettings {
  legalName: string;
  tradingName: string;
  registrationNumber: string;
  vatNumber?: string;
  telephone: string;
  email: string;
  physicalAddress: string;
  postalAddress: string;
  serviceDescriptor: string;
  leadCommissionerName: string;
  leadCommissionerSaqcc: string;
  version: number;
  updatedAt: string;
  updatedBy: string;
}

export interface DigitalSignatureData {
  id: string;
  signerName: string;
  signerRole: string;
  signerEmail: string;
  signatureTimestamp: string;
  ipAddress: string;
  deviceMetadata: string;
  documentSha256Hash: string;
  consentStatement: string;
  otpVerified: boolean;
  otpVerifiedAt?: string;
  isWitnessed?: boolean;
  witnessName?: string;
  witnessRole?: string;
  witnessReason?: string;
  signatureDataUrl?: string;
  signedAt?: string;
  verificationMethod?: string;
}

export type DocumentWorkflowStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'returned_for_correction'
  | 'approved'
  | 'issued'
  | 'superseded'
  | 'void';

export type SourceCoverageStatus = 
  | 'source_limited_draft'
  | 'fully_sans_approved';

export interface PreWorkInspectionRecord {
  id: string;
  inspectionNumber: string; // e.g. PRE-2026-0041
  siteId: string;
  siteName: string;
  clientId: string;
  clientName: string;
  workOrderNumber: string;
  purchaseOrderNumber: string;
  inspectionDateTime: string;
  leadTechnicianName: string;
  leadTechnicianSaqcc?: string;
  clientRepresentativeName: string;
  personsPresent: string[];
  reasonForInspection: string;
  proposedWorkScope: string;
  
  // Section B: Safety and Access
  accessPermissionGranted: boolean;
  siteInductionCompleted: boolean;
  siteHazardsIdentified: string[];
  riskControlsInPlace: boolean;
  ppeCompliant: boolean;
  permitToWorkRequired: boolean;
  permitNumber?: string;
  highRiskAreaNotes?: string;
  plannedImpairmentsAgreed: boolean;
  escalationContactsRecorded: string;
  
  // Section C: Existing System Condition (Grounded in SANS sources)
  panelMakeModel: string;
  systemCategory: SystemCategory;
  panelLocation: string;
  mainsSupplyNormal: boolean; // SANS POE 1g
  batteryVoltageVdc: number; // SANS POE 1g
  batteryChargerOperational: boolean; // SANS POE 1g
  activeFaultIndicators: string[]; // SANS POE 1e
  zoneLoopCount: number;
  disabledIsolatedPoints: string[]; // SANS POE 1e
  detectorsPhysicalCondition: 'intact' | 'contaminated' | 'obstructed' | 'damaged'; // SANS POE 11, 20
  manualCallPointsCondition: 'normal' | 'glass_cracked' | 'obstructed' | 'unserviceable'; // SANS POE 21
  soundersCondition: 'verified_audible' | 'untested' | 'faulty'; // SANS POE 1r, 1s
  interfacesCondition: string;
  cablingCondition: 'ph30_compliant_red' | 'non_compliant' | 'unmarked'; // SANS POE 1d, 1h, 1j
  containmentFireStoppingOk: boolean;
  existingLogbookAvailable: boolean; // SANS POE 19
  asBuiltDrawingsAvailable: boolean;
  zoneChartAvailable: boolean;
  priorCocAvailable: boolean;
  
  // Section D: Baseline evidence and authorisation
  beforePhotos: (PhotoEvidenceItem | PhotoEvidence)[];
  defectsFound: string[];
  agreedIsolationsStartTimestamp: string;
  temporaryMeasuresInPlace: string;
  affectedPartiesNotified: boolean;
  scopeConfirmationNotes: string;
  clientExclusions: string;
  
  // Signatures & Status
  technicianSignature?: DigitalSignatureData;
  clientSignature?: DigitalSignatureData;
  workflowStatus: DocumentWorkflowStatus;
  sourceCoverageStatus: SourceCoverageStatus;
  sourceCitations: SourceCitation[];
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostWorkInspectionRecord {
  id: string;
  inspectionNumber: string; // e.g. POST-2026-0041
  preWorkInspectionId: string;
  preWorkInspectionNumber: string;
  siteId: string;
  siteName: string;
  clientId: string;
  clientName: string;
  workOrderNumber: string;
  completionDateTime: string;
  leadTechnicianName: string;
  leadTechnicianSaqcc?: string;
  
  // Section A: Completion details
  actualWorkCompleted: string;
  deviationsFromScope: string;
  clientExclusions: string;
  componentsInstalled: {
    itemType: 'optical_smoke' | 'heat_detector' | 'multi_sensor' | 'manual_call_point' | 'sounder' | 'interface_module' | 'mcp' | 'panel' | 'battery' | 'module';
    make: string;
    model: string;
    serialOrAddress: string;
    location: string;
    quantity: number;
  }[];
  
  // Section B: Inspection, Tests & Results (SANS POE Benchmark Rules)
  visualInspectionPassed: boolean;
  panelOperationalCheckPassed: boolean;
  zonesLoopsTestedCount: number;
  alarmSounderTestedDba: number; // SANS POE 1r (>=65 dB(A))
  sounderLevelPass: boolean;
  standbyAutonomyTestedHours: number; // SANS POE 1g (>=24h)
  evacuationAlarmDurationMinutes: number; // SANS POE 1g (>=30 min)
  powerAutonomyPass: boolean;
  mainsFailFaultNotificationMinutes: number; // SANS POE 1g (<=30 min)
  detectorFaultResponseSeconds: number; // SANS POE 1e (<=200 sec)
  faultResponsePass: boolean;
  mcpMountingHeightM: number; // SANS POE 21 (1.4m +/- 0.2m)
  mcpMountingPass: boolean;
  smokeDetectorRadiusM: number; // SANS POE 11 (<=7.5m)
  heatDetectorRadiusM: number; // SANS POE 11 (<=5.3m)
  detectorSitingPass: boolean;
  cablingPH30Verified: boolean; // SANS POE 1d, 1h (PH 30 Red)
  cablingPass: boolean;
  singleFaultAreaM2: number; // SANS POE 1n (<=1000m2)
  singleFaultPass: boolean;
  
  testEquipmentUsed: {
    equipmentName: string;
    serialNumber: string;
    calibrationExpiryDate: string;
  }[];
  
  // Section C: Restoration & Handover
  isolationsRemovedTimestamp: string;
  systemFullyRestored: boolean;
  outstandingImpairments: string;
  clientDemonstrationCompleted: boolean;
  documentsHandedOver: string[]; // e.g. "SANS 10139 Logbook", "Zone Chart", "Operating Instructions"
  afterPhotos: (PhotoEvidenceItem | PhotoEvidence)[];
  asBuiltDrawingsAttached: boolean;
  
  // Signatures & Status
  technicianDeclarationSigned: boolean;
  technicianSignature?: DigitalSignatureData;
  clientAcknowledgementSigned: boolean;
  clientSignature?: DigitalSignatureData;
  workflowStatus: DocumentWorkflowStatus;
  sourceCoverageStatus: SourceCoverageStatus;
  sourceCitations: SourceCitation[];
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DefectRecord {
  id: string;
  siteId: string;
  siteName: string;
  clientId: string;
  relatedInspectionId?: string;
  relatedInspectionType?: 'pre_work' | 'post_work' | 'logbook';
  title: string;
  description: string;
  riskLevel: 'critical' | 'major' | 'minor';
  blocksCocIssuance: boolean; // Critical defects MUST block COC
  status: 'open' | 'in_progress' | 'resolved';
  remedialAction: string;
  responsibleParty: 'Audrin Fire Engineers' | 'Client / Property Manager' | 'Third-Party Electrical Contractor';
  targetDate: string;
  resolvedDate?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  sourceCitation?: SourceCitation;
  createdAt: string;
}

export interface CocEligibilityGateResult {
  canIssueCoc: boolean;
  overallScore: number;
  sourceCoverageNotice: string; // "SOURCE-LIMITED DRAFT - NOT AN ISSUABLE CERTIFICATE"
  isSourceLimitedDraft: boolean;
  gates: {
    id: string;
    label: string;
    passed: boolean;
    blockerReason?: string;
    sourceRef?: string;
  }[];
  openBlockers: string[];
}

export interface GoogleSheetsSyncQueueItem {
  id: string;
  tabName: string;
  recordId: string;
  recordType: string;
  action: 'insert' | 'update' | 'delete';
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  idempotencyKey: string;
  attemptCount: number;
  lastAttemptAt?: string;
  errorMessage?: string;
}

export interface GoogleSheetsMirrorState {
  connected: boolean;
  accountEmail: string;
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  lastSyncTimestamp: string;
  syncStatus: 'idle' | 'syncing' | 'error';
  autoSyncEnabled: boolean;
  mirroredTabs: {
    tabName: string;
    rowCount: number;
    lastUpdated: string;
  }[];
  syncQueue: GoogleSheetsSyncQueueItem[];
}

export interface ExportJobRecord {
  id: string;
  documentType: 'logbook' | 'pre_work' | 'post_work' | 'coc' | 'defects_summary' | 'audit_trail';
  documentNumber: string;
  format: 'pdf' | 'docx' | 'xlsx';
  status: 'completed' | 'processing' | 'failed';
  requestedBy: string;
  requestedAt: string;
  fileSizeBytes: number;
  downloadUrl: string;
  contentHashSha256: string;
  watermark: string; // "OFFICIAL ISSUED" or "SOURCE-LIMITED DRAFT - NOT AN ISSUABLE CERTIFICATE"
}

export type RoutineEventCategory = 
  | 'weekly_call_point'
  | 'monthly_battery'
  | 'quarterly_inspection'
  | 'annual_inspection'
  | 'fault_rectification'
  | 'disconnection_isolation';

export type FalseAlarmCategory = 
  | 'environmental'
  | 'user_accidental'
  | 'malicious'
  | 'equipment_fault'
  | 'unknown';

export interface LogbookEntry {
  id: string;
  siteId: string;
  siteName: string;
  clientId: string;
  entryTimestamp: string;
  eventType: 'routine_test' | 'false_alarm' | 'fault' | 'maintenance' | 'disconnection' | 'commissioning';
  eventCategory?: RoutineEventCategory;
  falseAlarmCategory?: FalseAlarmCategory;
  zoneOrDeviceLocation: string;
  triggeredDeviceAddress: string;
  summary: string;
  actionTaken: string;
  remedialActionNeeded: string;
  technicianName: string;
  technicianSaqccNumber?: string;
  isSystemFault: boolean;
  isRoutineTest: boolean;
  sourceCoverageStatus: SourceCoverageStatus;
}

export interface ComponentInstalledItem {
  itemType: 'optical_smoke' | 'heat_detector' | 'multi_sensor' | 'manual_call_point' | 'sounder' | 'interface_module' | 'battery' | 'mcp' | 'panel' | 'module';
  make: string;
  model: string;
  serialOrAddress: string;
  location: string;
  quantity: number;
}

export interface TestEquipmentItem {
  equipmentName: string;
  serialNumber: string;
  calibrationExpiryDate: string;
}

export interface PhotoEvidenceItem {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
  location: string;
  uploadedBy: string;
  tags: string[];
  isPreWork: boolean;
}

// ============================================================================
// SANS 10139 CAREERS & TECHNICIAN VACANCIES SYSTEM TYPES
// ============================================================================

export type SaqccTechnicianCategory =
  | 'cabler'
  | 'installer'
  | 'commissioner'
  | 'designer'
  | 'servicing_technician';

export type DriverLicenseCode = 'Code 8 (B)' | 'Code 10 (C1)' | 'Code 14 (EC)' | 'None';

export type ApplicationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Successful'
  | 'Unsuccessful';

export type DocumentType = 
  | 'cv'
  | 'saqcc_certificate'
  | 'id_document'
  | 'driver_license'
  | 'proof_of_address'
  | 'other_certificate'
  | 'cover_letter';

export interface DocumentUploadRecord {
  id: string;
  name: string;
  type: DocumentType;
  fileSizeBytes: number;
  mimeType: string;
  uploadedAt: string;
  malwareScanStatus: 'clean' | 'scanning' | 'flagged';
  contentHashSha256: string;
  dataUrl?: string;
  downloadUrl?: string;
}

export interface TechnicianAccount {
  id: string;
  fullName: string;
  email: string;
  cellphone: string;
  passwordHash: string;
  isEmailVerified: boolean;
  emailVerificationCode?: string;
  emailVerificationSentAt?: string;
  emailVerifiedAt?: string;
  popiaConsentAccepted: boolean;
  popiaConsentTimestamp: string;
  privacyPolicyAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  // Profile details
  residentialAddress: string;
  province: string;
  postalCode: string;
  saqccNumber: string;
  saqccExpiryDate: string;
  saqccCategories: SaqccTechnicianCategory[];
  qualifications: string[];
  sans10139ExperienceSummary: string;
  yearsOfExperience: number;
  driverLicense: DriverLicenseCode;
  availability: string; // 'Immediate' | '2 Weeks Notice' | '1 Month Notice' | 'Custom'
  preferredLocations: string[];
  documents: DocumentUploadRecord[];
  profilePhotoUrl?: string;
}

export interface VacancyScreeningQuestion {
  id: string;
  question: string;
  type: 'yes_no' | 'text' | 'years_number';
  required: boolean;
  idealAnswerNote?: string;
}

export interface VacancyRecord {
  id: string;
  referenceNumber: string; // e.g. "AFE-VAC-2026-001"
  jobTitle: string;
  location: string;
  province: string;
  employmentType: 'Permanent Full-time' | 'Fixed-Term Contract' | 'Project-based Specialist';
  department: string;
  duties: string[];
  minimumRequirements: string[];
  requiredCertifications: string[];
  requiredCategories?: SaqccTechnicianCategory[];
  closingDate: string; // YYYY-MM-DD
  isPublished: boolean;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
  screeningQuestions: VacancyScreeningQuestion[];
}

export interface InterviewDetails {
  scheduledDateTime: string;
  locationOrMeetingUrl: string;
  interviewType: 'in_person' | 'video_conference' | 'technical_site_assessment';
  interviewers: string[];
  instructions: string;
  notes?: string;
  date?: string;
  time?: string;
  location?: string;
}

export interface TechnicianJobApplication {
  id: string;
  referenceNumber: string; // e.g. "APP-2026-7842"
  vacancyId: string;
  vacancyRef: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  submittedAt: string;
  status: ApplicationStatus;
  statusHistory: {
    status: ApplicationStatus;
    timestamp: string;
    changedBy: string;
    notes?: string;
  }[];
  profileSnapshot: {
    residentialAddress: string;
    province: string;
    saqccNumber: string;
    saqccExpiryDate: string;
    saqccCategories: SaqccTechnicianCategory[];
    yearsOfExperience: number;
    driverLicense: string;
    availability: string;
    preferredLocations: string[];
    sans10139ExperienceSummary: string;
    documentsCount: number;
    cvDocumentId?: string;
    saqccDocumentId?: string;
  };
  answers: {
    questionId: string;
    questionText: string;
    answer: string;
  }[];
  additionalDocuments: DocumentUploadRecord[];
  internalNotes: {
    id: string;
    author: string;
    createdAt: string;
    text: string;
  }[];
  interviewDetails?: InterviewDetails;
  accuracyDeclarationConfirmed: boolean;
  reopenedByAdmin?: boolean;
  receiptHashSha256: string;
}

export interface EmailDispatchLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
  sentAt: string;
  type: 'email_verification' | 'application_confirmation' | 'admin_notification' | 'interview_invitation' | 'status_update';
  applicationRef?: string;
  deliveryStatus: 'delivered' | 'pending';
}

// ==========================================
// SAFETY FILE & IMMUTABLE COMPLIANCE AUDIT TYPES
// Binding Standards: SANS 10139:2021 & SANS 10400-T & OHS Act Construction Reg 7(1)(b)
// ==========================================

export type SafetyFileDocStatus = 
  | 'draft' 
  | 'awaiting_signature' 
  | 'approved' 
  | 'rejected' 
  | 'expired' 
  | 'superseded';

export type StatutoryStandard = 
  | 'SANS 10139' 
  | 'SANS 10400-T' 
  | 'OHS Act / Construction Reg' 
  | 'SANS 10287' 
  | 'SANS 322';

export interface StatutoryMilestone {
  id: string;
  title: string;
  clauseReference: string; // e.g. "SANS 10139:2021 Cl. 13.2"
  standard: StatutoryStandard;
  responsiblePerson: string;
  responsibleRole: string;
  targetDate: string; // YYYY-MM-DD
  completionDate?: string; // YYYY-MM-DD
  isOverdue: boolean;
  status: 'completed' | 'in_progress' | 'overdue' | 'pending';
  notes?: string;
  verificationEvidenceId?: string;
}

export interface SafetyFileDocument {
  id: string;
  fileNumber: string; // e.g. "SFD-01-MNT"
  title: string;
  category: 
    | 'statutory_certificate' 
    | 'as_built_drawing' 
    | 'commissioning_doc' 
    | 'maintenance_log' 
    | 'risk_assessment' 
    | 'competency_proof' 
    | 'sop_procedure' 
    | 'equipment_spec'
    | 'zone_chart';
  applicableStandard: StatutoryStandard;
  clauseReference: string;
  status: SafetyFileDocStatus;
  version: number;
  revision: string;
  issueDate: string;
  expiryDate?: string;
  uploadedAt: string;
  uploadedBy: string;
  signedBy?: string;
  signedAt?: string;
  fileSizeBytes: number;
  fileName: string;
  checksumSha256: string;
  downloadUrl?: string;
  isMandatoryForHandover: boolean;
  notes?: string;
}

export interface SafetyFileApprovalEntry {
  roleId: 'audrin_technician' | 'project_manager' | 'commissioner' | 'client_rep' | 'client_safety_officer';
  roleTitle: string;
  requiredRegistrationType?: 'SAQCC' | 'SACPCMP' | 'ECSA' | 'OHS';
  personName: string;
  designation: string;
  registrationNumber?: string;
  signatureDataUrl?: string;
  signedDate?: string; // YYYY-MM-DD
  signedTimestamp?: string; // ISO string
  verificationStatus: 'verified' | 'pending' | 'rejected';
  verificationNotes?: string;
  ipAddress?: string;
}

export interface SafetyFileDossier {
  id: string;
  dossierNumber: string; // e.g. "SF-2026-MCT-001"
  version: string; // e.g. "2.1"
  revision: string; // e.g. "Rev 04"
  issueDate: string;
  clientName: string;
  clientId: string;
  siteId: string;
  siteName: string;
  siteAddress: string;
  contractNumber: string;
  purchaseOrderNumber: string;
  projectName: string;
  projectCommencementDate: string;
  projectCompletionDate: string;
  scopeOfWork: string;
  buildingClassification: string; // e.g. "G1 / H1"
  systemType: string; // e.g. "Analogue Addressable Category L1 (Life Safety)"
  fireAlarmPanelDetails: {
    make: string;
    model: string;
    serialNumber: string;
    loopsCount: number;
    deviceCount: number;
    location: string;
    firmwareVersion: string;
    installationDate: string;
  };
  emergencyContacts: {
    name: string;
    role: string;
    telephone: string;
    mobile: string;
  }[];
  projectContacts: {
    name: string;
    role: string;
    telephone: string;
    email: string;
    company: string;
  }[];
  approvalMatrix: SafetyFileApprovalEntry[];
  milestones: StatutoryMilestone[];
  documents: SafetyFileDocument[];
  overallComplianceScore: number; // 0 - 100%
  sans10139ComplianceScore: number; // 0 - 100%
  sans10400TComplianceScore: number; // 0 - 100%
  isCommissionerApproved: boolean;
  status: 'draft' | 'awaiting_approval' | 'approved' | 'rejected' | 'superseded';
  complianceSupportNotice: string;
  updatedAt: string;
  updatedBy: string;
}

export type ComplianceAuditEventType =
  | 'document_creation'
  | 'document_upload'
  | 'status_change'
  | 'review_submission'
  | 'approval_granted'
  | 'approval_rejected'
  | 'signature_requested'
  | 'signature_verified'
  | 'dossier_download'
  | 'document_download'
  | 'print_preview'
  | 'email_dispatch'
  | 'standards_revision'
  | 'branding_update'
  | 'milestone_updated';

export interface ComplianceAuditRecord {
  id: string;
  auditNumber: string; // e.g. "AUD-2026-00941"
  timestamp: string; // ISO format
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  dossierId?: string;
  documentId?: string;
  documentTitle?: string;
  documentVersion?: string;
  eventType: ComplianceAuditEventType;
  eventDescription: string;
  userEmail: string;
  userName: string;
  userRole: UserRole | string;
  previousValue?: string;
  newValue?: string;
  emailRecipient?: string;
  emailDeliveryResult?: 'delivered' | 'bounced' | 'pending' | 'failed';
  ipAddress: string;
  deviceMetadata: string;
  fileChecksumSha256?: string;
  isImmutable: boolean;
  standardsReference?: string;
  popiaCategory: 'personal_data' | 'system_metadata' | 'statutory_record';
}

export interface ComplianceAuditLogQuery {
  page?: number;
  pageSize?: number;
  projectId?: string;
  eventType?: string;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'timestamp' | 'auditNumber' | 'eventType';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedComplianceAuditLogsResult {
  records: ComplianceAuditRecord[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  serverExecutionTimeMs: number;
  filteredCount: number;
  projectIdFilter?: string;
}

export interface ProjectHistoryExportResult {
  authorized: boolean;
  records: ComplianceAuditRecord[];
  projectName: string;
  projectId: string;
  totalRecords: number;
  exportTimestamp: string;
  authorizerName?: string;
  authorizerRole?: string;
  errorMessage?: string;
}

// ============================================================================
// HARDWARE INVENTORY & ASSET REGISTRY TYPES
// ============================================================================

export type HardwareDeviceType =
  | 'optical_smoke'
  | 'heat_detector'
  | 'sounder_siren'
  | 'manual_call_point'
  | 'multi_sensor'
  | 'optical_beam'
  | 'aspirating_point'
  | 'interface_module'
  | 'control_panel'
  | 'loop_expander'
  | 'power_supply';

export interface HardwareDeviceItem {
  id: string;
  deviceType: HardwareDeviceType;
  tag: string; // e.g. "L1-D001"
  zoneNumber: number; // e.g. 1
  zoneName: string; // e.g. "Zone 1: Ground Floor Reception"
  loopNumber: number; // e.g. 1
  addressOnLoop: number; // e.g. 1
  make: string; // e.g. "Apollo"
  model: string; // e.g. "Discovery Optical Smoke (58000-600)"
  serialNumber: string;
  locationDescription: string;
  installedDate: string;
  status: 'operational' | 'in_service' | 'isolated' | 'fault';
  lastTestedDate?: string;
  complianceCode: 'blue_dot' | 'black_dot' | 'red_dot' | 'green_dot' | 'purple_dot' | 'amber_dot' | 'cyan_dot';
}

export interface ZoneInventoryItem {
  zoneNumber: number;
  zoneName: string;
  floorOrArea: string;
  deviceCount: number;
  description?: string;
}

export interface LoopInventoryItem {
  loopNumber: number;
  loopProtocol: string;
  activeDevicesCount: number;
  maxLoopCapacity: number;
  cableLengthMeters?: number;
  classAVerified: boolean;
}

export interface ProjectHardwareInventory {
  id: string;
  projectId: string; // matches projectReference or siteId
  projectReference: string; // e.g. "PRJ-AFE-2026-0842"
  siteId: string;
  siteName: string;
  lastAuditDate: string;
  auditedBy: string;
  auditorSaqccNumber?: string;
  inventoryRef: string; // e.g. "INV-MEN-2026-0842"
  panelDetails: {
    brand: string;
    model: string;
    serialNumber: string;
    location: string;
    loopCount: number;
    zoneCount: number;
    powerSupplyModel?: string;
    standbyBatteryAh?: number;
  };
  zones: ZoneInventoryItem[];
  loops: LoopInventoryItem[];
  deviceScheduleSummary: {
    blueDotSmokeDetectors: number;
    blackDotHeatDetectors: number;
    redDotSoundersSirens: number;
    greenDotManualCallPoints: number;
    multiSensorDetectors: number;
    opticalBeamDetectors: number;
    aspiratingSamplingPoints: number;
    totalDeviceCount: number;
  };
  deviceRecords: HardwareDeviceItem[];
  notes?: string;
}

export type GlobalTheme = 'light' | 'dark';
