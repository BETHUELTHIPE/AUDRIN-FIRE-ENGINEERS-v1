import { useState, useEffect } from 'react';
import {
  User,
  UserRole,
  ServiceRecord,
  HowWeWorkStage,
  SiteRecord,
  ServiceRequest,
  PhotoEvidence,
  VideoEvidence,
  DocumentRecord,
  ConditionReport,
  PowerPointPresentation,
  CalendarAppointment,
  ZoomMeetingDetails,
  AiMeetingMinutes,
  EmailLogEntry,
  AuditLogEntry,
  GoogleSheetRow,
  SansLogbookEntry,
  SansCocCertificate,
  ApprovedSourceDocument,
  SourceRequirement,
  CompanyProfileBranding,
  AudrinIssuerSettings,
  PreWorkInspectionRecord,
  PostWorkInspectionRecord,
  DefectRecord,
  CocEligibilityGateResult,
  GoogleSheetsMirrorState,
  ExportJobRecord,
  VacancyRecord,
  TechnicianAccount,
  TechnicianJobApplication,
  EmailDispatchLog,
  DocumentUploadRecord,
  ApplicationStatus,
  InterviewDetails,
  SafetyFileDossier,
  SafetyFileDocument,
  SafetyFileDocStatus,
  SafetyFileApprovalEntry,
  StatutoryMilestone,
  ComplianceAuditRecord,
  ComplianceAuditEventType,
  ComplianceAuditLogQuery,
  PaginatedComplianceAuditLogsResult,
  ProjectHistoryExportResult,
  CertificateRevisionRecord
} from '../types';

import {
  INITIAL_SAFETY_FILE_DOSSIERS,
  INITIAL_COMPLIANCE_AUDIT_LOGS
} from '../data/safetyFileData';

import {
  COMPANY_DETAILS,
  HOW_WE_WORK_STAGES,
  APPROVED_SERVICES,
  SAMPLE_SITES,
  INITIAL_REQUESTS,
  INITIAL_PHOTOS,
  INITIAL_VIDEOS,
  INITIAL_APPOINTMENTS,
  INITIAL_ZOOM_MEETING,
  INITIAL_AI_MINUTES,
  INITIAL_FAQS,
  SANS_10139_RULES_BENCHMARK,
  INITIAL_SANS_LOGBOOK,
  INITIAL_SANS_COCS,
  SansRuleDefinition
} from '../data/initialData';

import {
  APPROVED_SOURCE_DOCUMENTS,
  SOURCE_REQUIREMENT_REGISTER,
  DEFAULT_AUDRIN_ISSUER_SETTINGS,
  INITIAL_COMPANY_BRANDINGS,
  INITIAL_PRE_WORK_INSPECTIONS,
  INITIAL_POST_WORK_INSPECTIONS,
  INITIAL_DEFECTS,
  INITIAL_GOOGLE_SHEETS_STATE,
  INITIAL_EXPORT_JOBS
} from '../data/sourceRequirementsData';

import {
  INITIAL_VACANCIES,
  INITIAL_TECHNICIANS,
  INITIAL_APPLICATIONS,
  INITIAL_EMAIL_LOGS
} from '../data/careersData';

export const DEFAULT_USER: User = {
  id: 'usr-customer-01',
  email: 'bethuelmoukangwe8@gmail.com',
  name: 'Bethuel Moukangwe',
  companyName: 'Tshivhase Commercial Holdings (Pty) Ltd',
  phone: '071 415 6665',
  role: 'customer',
  isVerified: true,
  receiveAllMeetingMinutes: true
};

const STORAGE_KEYS = {
  USER: 'afe_user_session',
  SERVICES: 'afe_services_records',
  SITES: 'afe_registered_sites',
  REQUESTS: 'afe_service_requests',
  PHOTOS: 'afe_photo_evidence',
  VIDEOS: 'afe_video_evidence',
  DOCUMENTS: 'afe_documents_records',
  PRE_REPORTS: 'afe_pre_reports',
  POST_REPORTS: 'afe_post_reports',
  PRESENTATIONS: 'afe_presentations',
  APPOINTMENTS: 'afe_appointments',
  ZOOM: 'afe_zoom_meeting',
  AI_MINUTES: 'afe_ai_minutes',
  EMAILS: 'afe_email_logs',
  AUDIT: 'afe_audit_logs',
  SHEETS_SYNC: 'afe_sheets_sync_state',
  SANS_LOGBOOK: 'afe_sans_logbook',
  SANS_COCS: 'afe_sans_cocs',
  CAREERS_VACANCIES: 'afe_careers_vacancies',
  CAREERS_TECHNICIANS: 'afe_careers_technicians',
  CAREERS_APPLICATIONS: 'afe_careers_applications',
  CAREERS_EMAIL_LOGS: 'afe_careers_email_logs',
  ACTIVE_TECHNICIAN_ID: 'afe_active_technician_id',
  SAFETY_FILE_DOSSIERS: 'afe_safety_file_dossiers',
  COMPLIANCE_AUDIT_RECORDS: 'afe_compliance_audit_records',
  COC_REVISIONS: 'afe_coc_revisions'
};

export class AudrinStore {
  private static instance: AudrinStore;
  private listeners: Set<() => void> = new Set();

  private user: User = DEFAULT_USER;
  private services: ServiceRecord[] = APPROVED_SERVICES;
  private stages: HowWeWorkStage[] = HOW_WE_WORK_STAGES;
  private sites: SiteRecord[] = SAMPLE_SITES;
  private requests: ServiceRequest[] = INITIAL_REQUESTS;
  private photos: PhotoEvidence[] = INITIAL_PHOTOS;
  private videos: VideoEvidence[] = INITIAL_VIDEOS;
  private sansLogbook: SansLogbookEntry[] = INITIAL_SANS_LOGBOOK;
  private sansCocs: SansCocCertificate[] = INITIAL_SANS_COCS;
  private cocRevisions: CertificateRevisionRecord[] = [];
  private sansRulesBenchmark: SansRuleDefinition[] = SANS_10139_RULES_BENCHMARK;
  private approvedSourceDocuments: ApprovedSourceDocument[] = APPROVED_SOURCE_DOCUMENTS;
  private sourceRequirements: SourceRequirement[] = SOURCE_REQUIREMENT_REGISTER;
  private companyBrandings: CompanyProfileBranding[] = INITIAL_COMPANY_BRANDINGS;
  private audrinIssuerSettings: AudrinIssuerSettings = DEFAULT_AUDRIN_ISSUER_SETTINGS;
  private preWorkInspections: PreWorkInspectionRecord[] = INITIAL_PRE_WORK_INSPECTIONS;
  private postWorkInspections: PostWorkInspectionRecord[] = INITIAL_POST_WORK_INSPECTIONS;
  private defects: DefectRecord[] = INITIAL_DEFECTS;
  private googleSheetsState: GoogleSheetsMirrorState = INITIAL_GOOGLE_SHEETS_STATE;
  private exportJobs: ExportJobRecord[] = INITIAL_EXPORT_JOBS;
  private vacancies: VacancyRecord[] = INITIAL_VACANCIES;
  private technicians: TechnicianAccount[] = INITIAL_TECHNICIANS;
  private applications: TechnicianJobApplication[] = INITIAL_APPLICATIONS;
  private careerEmailLogs: EmailDispatchLog[] = INITIAL_EMAIL_LOGS;
  private activeTechnicianId: string | null = 'tech-001';
  private safetyFileDossiers: SafetyFileDossier[] = INITIAL_SAFETY_FILE_DOSSIERS;
  private complianceAuditRecords: ComplianceAuditRecord[] = INITIAL_COMPLIANCE_AUDIT_LOGS;
  private documents: DocumentRecord[] = [
    {
      id: 'doc-01',
      requestId: 'req-01',
      fileName: 'Menlyn_Tower_L1_L4_Fire_Alarm_AsBuilt.dwg',
      fileType: 'CAD / DWG',
      category: 'as_built_drawing',
      fileSizeBytes: 14200000,
      uploadedBy: 'Sipho Ndlovu',
      uploadedAt: '2026-09-01T15:00:00Z',
      scanStatus: 'clean',
      version: 2,
      downloadUrl: '#'
    },
    {
      id: 'doc-02',
      requestId: 'req-01',
      fileName: 'SANS10139_Logbook_Menlyn_2026.pdf',
      fileType: 'PDF Document',
      category: 'logbook',
      fileSizeBytes: 3450000,
      uploadedBy: 'Bethuel Moukangwe',
      uploadedAt: '2026-09-01T08:55:00Z',
      scanStatus: 'clean',
      version: 1,
      downloadUrl: '#'
    },
    {
      id: 'doc-03',
      requestId: 'req-01',
      fileName: 'GroundFloor_ZoneChart_Laminated.pdf',
      fileType: 'PDF / CAD',
      category: 'zone_chart',
      fileSizeBytes: 5120000,
      uploadedBy: 'Sipho Ndlovu',
      uploadedAt: '2026-09-01T16:10:00Z',
      scanStatus: 'clean',
      version: 1,
      downloadUrl: '#'
    }
  ];
  private conditionReports: ConditionReport[] = [
    {
      id: 'rep-pre-01',
      requestId: 'req-01',
      reportType: 'pre_work',
      reportNumber: 'REP-PRE-2026-0842-V1',
      version: 1,
      generatedAt: '2026-09-01T09:00:00Z',
      clientName: 'Bethuel Moukangwe',
      organisationName: 'Tshivhase Commercial Holdings (Pty) Ltd',
      siteName: 'Menlyn Central Corporate Tower',
      siteAddress: '125 Dallas Avenue, Menlyn, Pretoria, 0181',
      serviceTitle: 'Planned Preventative Maintenance',
      scopeSummary: 'Pre-work inspection of 4 addressable loops, standby batteries, and Level 3 airflow return air grill detectors.',
      visibleConditionNotes: 'Panel appears in quiescent standby state with no active system faults recorded on loop 1. Loop 2 detector L2-D042 exhibits visible airborne particulate accumulation.',
      physicalAssessmentRequiredNotes: 'Requires physical battery discharge conductance test and solo aerosol smoke chamber sensitivity verification during on-site visit.',
      recommendedNextStep: 'Proceed with scheduled technician access on 10 September 2026 for point-to-point device cleaning and acoustic sounder check.',
      limitationsDisclaimer: 'This Automated Pre-Work Condition Report is compiled from client-submitted photographic evidence and initial technical triage. It does not constitute a statutory site inspection, commissioning certificate, or certificate of compliance.',
      evidenceSnapshot: {
        photoIds: ['pho-01', 'pho-02', 'pho-03'],
        videoIds: [],
        photographs: [
          {
            caption: 'Main panel status display prior to scheduled service.',
            stage: 'before',
            category: 'Main Control Panel Display',
            location: 'Ground Floor Security Control Room',
            imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
          },
          {
            caption: 'Detector unit installed adjacent to HVAC return air grille.',
            stage: 'before',
            category: 'Optical Smoke Detector in High Airflow Zone',
            location: 'Level 3 Open-Plan Accounting Wing',
            imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
          }
        ]
      },
      status: 'acknowledged_by_client',
      clientAcknowledgementNotes: 'Acknowledged by Bethuel Moukangwe on 2026-09-01.'
    },
    {
      id: 'rep-post-01',
      requestId: 'req-01',
      reportType: 'post_work',
      reportNumber: 'REP-POST-2026-0842-V1',
      version: 1,
      generatedAt: '2026-09-01T17:00:00Z',
      clientName: 'Bethuel Moukangwe',
      organisationName: 'Tshivhase Commercial Holdings (Pty) Ltd',
      siteName: 'Menlyn Central Corporate Tower',
      siteAddress: '125 Dallas Avenue, Menlyn, Pretoria, 0181',
      serviceTitle: 'Planned Preventative Maintenance',
      scopeSummary: 'Completed quarterly inspection of 4 addressable loops, optical chamber cleaning of detector L2-D042, standby battery discharge test, and Level 2 sounder audibility verification.',
      visibleConditionNotes: 'All 4 loops confirmed normal and healthy. Detector L2-D042 successfully cleaned and recalibrated. Main panel FP-01 reset to clear quiescent state. Sounder strobe test recorded 78.4 dB(A) at 3m in public corridor.',
      physicalAssessmentRequiredNotes: 'All scheduled physical verification items completed. Next quarterly service due in December 2026.',
      recommendedNextStep: 'Maintain weekly manual call point testing log and file completed service certificate in on-site SANS 10139 logbook binder.',
      limitationsDisclaimer: 'This Post-Work Condition Report records the verified physical condition of the tested fire detection equipment at the conclusion of the specified maintenance scope. Routine weekly testing remains the responsibility of the designated building occupier.',
      evidenceSnapshot: {
        photoIds: ['pho-01', 'pho-02', 'pho-04', 'pho-05', 'pho-06'],
        videoIds: ['vid-01'],
        photographs: [
          {
            caption: 'Main panel status display prior to scheduled service.',
            stage: 'before',
            category: 'Main Control Panel Display',
            location: 'Ground Floor Security Control Room',
            imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
          },
          {
            caption: 'Completed Panel Status & Reset Verification.',
            stage: 'after',
            category: 'Main Control Panel Display',
            location: 'Ground Floor Security Control Room',
            imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
          },
          {
            caption: 'Cleaned and Recalibrated Detector Unit.',
            stage: 'after',
            category: 'Optical Smoke Detector in High Airflow Zone',
            location: 'Level 3 Open-Plan Accounting Wing',
            imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
          }
        ]
      },
      status: 'acknowledged_by_client'
    }
  ];
  private presentations: PowerPointPresentation[] = [
    {
      id: 'ppt-01',
      requestId: 'req-01',
      presentationNumber: 'PPT-AFE-2026-0842',
      title: 'Executive Fire Detection Summary & Maintenance Review',
      slideCount: 6,
      generatedAt: '2026-09-01T17:15:00Z',
      theme: 'Audrin Executive Navy / Safety Crimson',
      slides: [
        {
          title: 'AUDRIN FIRE ENGINEERS — Executive Review',
          subtitle: 'Menlyn Central Corporate Tower — 4-Loop Addressable System',
          bullets: [
            'Client: Tshivhase Commercial Holdings (Pty) Ltd',
            'Service: SANS 10139 Planned Preventative Maintenance',
            'Reference: AFE-2026-0842 | Date: September 2026'
          ],
          callout: 'Tagline: Early Detection. Clear Warning. Safer Buildings.'
        },
        {
          title: 'Facility Context & Baseline Assets',
          subtitle: 'High-Rise Commercial Office Specification',
          bullets: [
            'Control Panel: Advanced Electronics Axis EN (4-Loop Addressable)',
            'Field Density: ~480 Point Detectors, Manual Call Points & Sounder VADs',
            'Previous Maintenance Date: June 2026 | Current Status: Fully Operational'
          ]
        },
        {
          title: 'Scope of Executed Works',
          subtitle: 'SANS 10139 Routine Testing Protocol',
          bullets: [
            '100% point-to-point testing of sampled loop zones (Loops 1 & 2)',
            'Optical chamber particulate decontamination on high-airflow detector L2-D042',
            'Battery internal resistance & discharge conductance evaluation',
            'Sounder acoustic level verification (Recorded 78.4 dB(A))'
          ]
        },
        {
          title: 'Before & After Photographic Evidence',
          subtitle: 'Verified Side-by-Side Equipment State',
          bullets: [
            'Before: Detector chamber exhibited particulate drift near return air grille',
            'After: Sensor restored to calibrated sensitivity thresholds and quiescent state',
            'Panel Display: Zero active trouble codes, pristine memory register'
          ],
          imageUrls: [
            'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
          ]
        },
        {
          title: 'Action Items & Outstanding Observations',
          subtitle: 'Operational Recommendations',
          bullets: [
            'Recommendation 1: Continue weekly manual call point rotation schedule',
            'Recommendation 2: Keep Level 3 return air filter clean to prevent dust drift',
            'Next Scheduled Service: December 2026 (Quarterly Maintenance Cycle)'
          ]
        },
        {
          title: 'Engineering Governance & Limitations',
          subtitle: 'Compliance Statement',
          bullets: [
            'All works performed strictly in accordance with SANS 10139 recommendations',
            'Logbook updated on-site in Ground Floor Security Control Room',
            'Audrin Fire Engineers Hotline: 071 415 6665 | Pretoria West'
          ],
          callout: 'Commercial fire-detection and alarm engineering only. No sprinkler or extinguisher scope.'
        }
      ]
    }
  ];
  private appointments: CalendarAppointment[] = INITIAL_APPOINTMENTS;
  private zoomMeeting: ZoomMeetingDetails = INITIAL_ZOOM_MEETING;
  private aiMinutes: AiMeetingMinutes = INITIAL_AI_MINUTES;
  private emailLogs: EmailLogEntry[] = [
    {
      id: 'eml-01',
      recipientEmail: 'bethuelmoukangwe8@gmail.com',
      recipientName: 'Bethuel Moukangwe',
      subject: 'Service Request Acknowledgement [Ref: AFE-2026-0842] — Planned Preventative Maintenance',
      serviceCategory: 'Planned Preventative Maintenance',
      emailType: 'auto_reply_request',
      bodyText: `Dear Bethuel Moukangwe,

Thank you for contacting AUDRIN FIRE ENGINEERS (PTY) LTD regarding Planned Preventative Maintenance for Menlyn Central Corporate Tower.

Your request has been registered under reference number: AFE-2026-0842.

Next Steps:
1. Our engineering operations desk is reviewing your 4-loop addressable system specifications.
2. An automated Pre-Work Condition Report has been generated and is available in your customer portal.
3. Your scheduled technician visit has been provisionally booked for 10 September 2026 (09:00 - 13:00).

Urgent note: If this enquiry relates to an active emergency fire alarm fault or continuous panel buzzer, our rapid technical desk is available at 071 415 6665.

AUDRIN FIRE ENGINEERS (PTY) LTD
Early Detection. Clear Warning. Safer Buildings.
Reg: K2026089596 | 27 Tshivhase Street, Pretoria West`,
      sentAt: '2026-09-01T08:31:00Z',
      deliveryStatus: 'delivered',
      hasAttachment: true,
      attachmentName: 'REP-PRE-2026-0842-V1.pdf',
      correlationId: 'corr_afe0842_ack'
    },
    {
      id: 'eml-02',
      recipientEmail: 'bethuelmoukangwe8@gmail.com',
      recipientName: 'Bethuel Moukangwe',
      subject: 'Emergency Fault Dispatch Triage [Ref: AFE-2026-0849] — Immediate Action Guidance',
      serviceCategory: 'Fault Finding, Repairs and Emergency Fault Support',
      emailType: 'fault_triage',
      bodyText: `Dear Bethuel Moukangwe,

AUDRIN FIRE ENGINEERS has received your urgent fire-alarm fault report for Pretoria West Industrial Logistics Hub (Ref: AFE-2026-0849).

Reported Fault: Intermittent loop 2 open circuit on Ziton ZP3 panel with sounding buzzer.

Immediate Safe Guidance:
- If safe to do so, silence the panel buzzer using the designated panel silence key to prevent tenant distress.
- Do NOT disable or isolate the entire loop unless instructed by our attending engineer.
- Attending Senior Engineer: Kagiso Molefe has been assigned and will contact you directly prior to arrival.

Direct Support Hotline: 071 415 6665.

AUDRIN FIRE ENGINEERS (PTY) LTD`,
      sentAt: '2026-09-02T04:16:00Z',
      deliveryStatus: 'delivered',
      hasAttachment: false,
      correlationId: 'corr_afe0849_triage'
    }
  ];
  private auditLogs: AuditLogEntry[] = [
    {
      id: 'aud-01',
      timestamp: '2026-09-01T08:30:00Z',
      actor: 'Bethuel Moukangwe (Customer)',
      actorRole: 'Customer',
      action: 'SERVICE_REQUEST_CREATED',
      recordType: 'ServiceRequest',
      recordId: 'req-01',
      ipAddress: '105.184.22.14',
      details: 'Created service request AFE-2026-0842 for Planned Preventative Maintenance at Menlyn Central.'
    },
    {
      id: 'aud-02',
      timestamp: '2026-09-01T09:00:00Z',
      actor: 'Celery / Automated Report Worker',
      actorRole: 'System',
      action: 'PRE_WORK_REPORT_GENERATED',
      recordType: 'ConditionReport',
      recordId: 'rep-pre-01',
      ipAddress: '127.0.0.1 (Worker)',
      details: 'Automated Pre-Work Condition Report generated and frozen with 3 photos snapshot.'
    },
    {
      id: 'aud-03',
      timestamp: '2026-09-01T17:00:00Z',
      actor: 'Sipho Ndlovu (Staff Engineer)',
      actorRole: 'Staff',
      action: 'POST_WORK_REPORT_APPROVED',
      recordType: 'ConditionReport',
      recordId: 'rep-post-01',
      ipAddress: '105.184.45.89',
      details: 'Approved after-work photo evidence pairs and compiled Post-Work Condition Report.'
    },
    {
      id: 'aud-04',
      timestamp: '2026-09-02T04:15:00Z',
      actor: 'Bethuel Moukangwe (Customer)',
      actorRole: 'Customer',
      action: 'EMERGENCY_FAULT_LOGGED',
      recordType: 'ServiceRequest',
      recordId: 'req-02',
      ipAddress: '105.184.22.14',
      details: 'Logged emergency fault report AFE-2026-0849 for Pretoria West Industrial Hub.'
    }
  ];

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): AudrinStore {
    if (!AudrinStore.instance) {
      AudrinStore.instance = new AudrinStore();
    }
    return AudrinStore.instance;
  }

  private loadFromStorage() {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (storedUser) this.user = JSON.parse(storedUser);

      const storedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (storedRequests) this.requests = JSON.parse(storedRequests);

      const storedSites = localStorage.getItem(STORAGE_KEYS.SITES);
      if (storedSites) this.sites = JSON.parse(storedSites);

      const storedPhotos = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      if (storedPhotos) this.photos = JSON.parse(storedPhotos);

      const storedVideos = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      if (storedVideos) this.videos = JSON.parse(storedVideos);

      const storedReports = localStorage.getItem(STORAGE_KEYS.PRE_REPORTS);
      if (storedReports) this.conditionReports = JSON.parse(storedReports);

      const storedPresentations = localStorage.getItem(STORAGE_KEYS.PRESENTATIONS);
      if (storedPresentations) this.presentations = JSON.parse(storedPresentations);

      const storedAppointments = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (storedAppointments) this.appointments = JSON.parse(storedAppointments);

      const storedEmails = localStorage.getItem(STORAGE_KEYS.EMAILS);
      if (storedEmails) this.emailLogs = JSON.parse(storedEmails);

      const storedAudit = localStorage.getItem(STORAGE_KEYS.AUDIT);
      if (storedAudit) this.auditLogs = JSON.parse(storedAudit);

      const storedSansLogbook = localStorage.getItem(STORAGE_KEYS.SANS_LOGBOOK);
      if (storedSansLogbook) this.sansLogbook = JSON.parse(storedSansLogbook);

      const storedSansCocs = localStorage.getItem(STORAGE_KEYS.SANS_COCS);
      if (storedSansCocs) this.sansCocs = JSON.parse(storedSansCocs);

      const storedVacancies = localStorage.getItem(STORAGE_KEYS.CAREERS_VACANCIES);
      if (storedVacancies) this.vacancies = JSON.parse(storedVacancies);

      const storedTechnicians = localStorage.getItem(STORAGE_KEYS.CAREERS_TECHNICIANS);
      if (storedTechnicians) this.technicians = JSON.parse(storedTechnicians);

      const storedApplications = localStorage.getItem(STORAGE_KEYS.CAREERS_APPLICATIONS);
      if (storedApplications) this.applications = JSON.parse(storedApplications);

      const storedCareerEmails = localStorage.getItem(STORAGE_KEYS.CAREERS_EMAIL_LOGS);
      if (storedCareerEmails) this.careerEmailLogs = JSON.parse(storedCareerEmails);

      const storedActiveTech = localStorage.getItem(STORAGE_KEYS.ACTIVE_TECHNICIAN_ID);
      if (storedActiveTech !== null) this.activeTechnicianId = storedActiveTech ? JSON.parse(storedActiveTech) : null;

      const storedDossiers = localStorage.getItem(STORAGE_KEYS.SAFETY_FILE_DOSSIERS);
      if (storedDossiers) this.safetyFileDossiers = JSON.parse(storedDossiers);

      const storedComplianceAudits = localStorage.getItem(STORAGE_KEYS.COMPLIANCE_AUDIT_RECORDS);
      if (storedComplianceAudits) this.complianceAuditRecords = JSON.parse(storedComplianceAudits);

      const storedCocRevisions = localStorage.getItem(STORAGE_KEYS.COC_REVISIONS);
      if (storedCocRevisions) {
        this.cocRevisions = JSON.parse(storedCocRevisions);
      } else {
        this.seedInitialCocRevisions();
      }
    } catch {
      // Storage parsing fallback
    }
  }

  private seedInitialCocRevisions() {
    const initialRevs: CertificateRevisionRecord[] = [];
    this.sansCocs.forEach((coc, idx) => {
      const revNum = coc.revisionNumber || 'Rev 1.0';
      const checksum = coc.documentChecksumSha256 || `sha256-coc-${coc.cocNumber.toLowerCase()}-seeded-01`;
      const revRecord: CertificateRevisionRecord = {
        id: `rev-${coc.id}-baseline`,
        cocId: coc.id,
        cocNumber: coc.cocNumber,
        revisionNumber: revNum,
        issuedAt: coc.issueDate ? `${coc.issueDate}T09:30:00.000Z` : '2026-08-20T09:30:00.000Z',
        issuedBy: {
          name: coc.commissionerName || 'Noko Dina Ramphela',
          email: coc.commissionerEmail || 'rampheledina@gmail.com',
          role: 'Accredited SANS 10139 Fire Detection Commissioner',
          saqccNumber: coc.commissionerSaqccNumber || 'SAQCC-SANS10139-COMM-2022/03/23',
          idNumber: coc.commissionerIdNumber || '9109170791081'
        },
        reasonForRevision: 'Initial SANS 10139 Certificate of Compliance formal issuance after full commissioning, audibility testing, and standby battery verification.',
        changeSummary: [
          `System Category: ${coc.systemCategory} (${coc.systemObjective})`,
          `Device dots verified: ${coc.deviceSchedule.blueDotSmokeDetectors} Smoke Detectors, ${coc.deviceSchedule.blackDotHeatDetectors} Heat Detectors, ${coc.deviceSchedule.greenDotManualCallPoints} MCPs`,
          `Power Autonomy: ${coc.powerSupplyAutonomy.standbyAutonomyHours}h Standby verified (SANS 10139 compliant)`,
          `Commissioner and Client digital signatures sealed`
        ],
        documentChecksumSha256: checksum,
        signatureHash: coc.signatureHash || `sig-sha256-${coc.cocNumber}`,
        systemCategory: coc.systemCategory,
        overallComplianceStatus: coc.overallComplianceStatus || 'Fully Compliant',
        siteId: coc.siteId,
        siteName: coc.siteName,
        clientName: coc.clientName,
        isImmutable: true,
        auditTrailRef: `AUD-2026-00${105 + idx}`,
        snapshot: JSON.parse(JSON.stringify(coc))
      };
      initialRevs.push(revRecord);
      coc.revisionHistory = [revRecord];
      coc.activeRevisionId = revRecord.id;
    });
    this.cocRevisions = initialRevs;
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(this.requests));
      localStorage.setItem(STORAGE_KEYS.SITES, JSON.stringify(this.sites));
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(this.photos));
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(this.videos));
      localStorage.setItem(STORAGE_KEYS.PRE_REPORTS, JSON.stringify(this.conditionReports));
      localStorage.setItem(STORAGE_KEYS.PRESENTATIONS, JSON.stringify(this.presentations));
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(this.appointments));
      localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(this.emailLogs));
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(this.auditLogs));
      localStorage.setItem(STORAGE_KEYS.SANS_LOGBOOK, JSON.stringify(this.sansLogbook));
      localStorage.setItem(STORAGE_KEYS.SANS_COCS, JSON.stringify(this.sansCocs));
      localStorage.setItem(STORAGE_KEYS.CAREERS_VACANCIES, JSON.stringify(this.vacancies));
      localStorage.setItem(STORAGE_KEYS.CAREERS_TECHNICIANS, JSON.stringify(this.technicians));
      localStorage.setItem(STORAGE_KEYS.CAREERS_APPLICATIONS, JSON.stringify(this.applications));
      localStorage.setItem(STORAGE_KEYS.CAREERS_EMAIL_LOGS, JSON.stringify(this.careerEmailLogs));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TECHNICIAN_ID, JSON.stringify(this.activeTechnicianId));
      localStorage.setItem(STORAGE_KEYS.SAFETY_FILE_DOSSIERS, JSON.stringify(this.safetyFileDossiers));
      localStorage.setItem(STORAGE_KEYS.COMPLIANCE_AUDIT_RECORDS, JSON.stringify(this.complianceAuditRecords));
      localStorage.setItem(STORAGE_KEYS.COC_REVISIONS, JSON.stringify(this.cocRevisions));
    } catch {
      // Ignore storage quota
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // User & Auth methods
  public getUser(): User {
    return this.user;
  }

  public getCurrentUser(): User {
    return this.user;
  }

  public notifyListeners(): void {
    this.notify();
  }

  public getSourceDocuments() {
    return APPROVED_SOURCE_DOCUMENTS;
  }

  public getLogbookEntries(): any[] {
    return this.sansLogbook;
  }

  public addLogbookEntry(entry: any): void {
    this.addSansLogbookEntry(entry);
  }

  public setUserRole(role: UserRole) {
    this.user = {
      ...this.user,
      role
    };
    this.logAudit('USER_ROLE_SWITCHED', 'User', this.user.id, `Switched active role to ${role}`);
    this.saveToStorage();
  }

  public updateProfile(name: string, company: string, phone: string, email: string) {
    this.user = {
      ...this.user,
      name,
      companyName: company,
      phone,
      email
    };
    this.logAudit('USER_PROFILE_UPDATED', 'User', this.user.id, 'Updated contact profile details');
    this.saveToStorage();
  }

  // Services
  public getServices(): ServiceRecord[] {
    return this.services;
  }

  public getServiceBySlug(slug: string): ServiceRecord | undefined {
    return this.services.find(s => s.slug === slug);
  }

  // Stages
  public getHowWeWorkStages(): HowWeWorkStage[] {
    return this.stages;
  }

  // Sites
  public getSites(): SiteRecord[] {
    return this.sites;
  }

  public addSite(newSite: Omit<SiteRecord, 'id'>): SiteRecord {
    const site: SiteRecord = {
      ...newSite,
      id: `site-${Date.now()}`
    };
    this.sites.push(site);
    this.logAudit('SITE_REGISTERED', 'SiteRecord', site.id, `Registered site: ${site.name}`);
    this.saveToStorage();
    return site;
  }

  // Requests
  public getRequests(): ServiceRequest[] {
    return this.requests;
  }

  public getServiceRequests(): ServiceRequest[] {
    return this.requests;
  }

  public getMeetingMinutes(): AiMeetingMinutes[] {
    return [this.aiMinutes];
  }

  public addServiceRequest(customRequest: any): ServiceRequest {
    const nextNum = Math.floor(850 + Math.random() * 150);
    const ref = customRequest.referenceNumber || `AFE-2026-0${nextNum}`;
    const requestId = customRequest.id || `req-${Date.now()}`;

    const newRequest: ServiceRequest = {
      id: requestId,
      referenceNumber: ref,
      userId: customRequest.userId || this.user.id,
      clientName: customRequest.clientName || this.user.name,
      clientEmail: customRequest.clientEmail || this.user.email,
      clientPhone: customRequest.clientPhone || this.user.phone,
      organisationName: customRequest.organisationName || this.user.companyName,
      siteId: customRequest.siteId || 'site-01',
      siteName: customRequest.siteName || 'Registered Commercial Site',
      siteAddress: customRequest.siteAddress || 'Pretoria, Gauteng',
      serviceSlug: customRequest.serviceSlug || 'routine-maintenance',
      serviceTitle: customRequest.serviceTitle || 'Commercial Fire Alarm Service',
      urgency: customRequest.urgency || 'routine',
      description: customRequest.description || customRequest.scopeDescription || 'Standard SANS 10139 fire detection service.',
      preferredVisitDate: customRequest.preferredVisitDate || customRequest.preferredDate || new Date().toISOString().split('T')[0],
      panelBrandModel: customRequest.panelBrandModel || customRequest.existingSystemDetails?.panelBrand,
      faultSymptoms: customRequest.faultSymptoms || [],
      status: customRequest.status || 'Submitted',
      currentStage: customRequest.currentStage || 1,
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: customRequest.status || 'Submitted',
          actor: customRequest.clientName || this.user.name,
          actorRole: this.user.role,
          notes: 'Service request registered in Audrin central dispatch.',
          isCustomerVisible: true
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      beforePhotosCount: customRequest.photoEvidenceIds?.length || 0,
      duringPhotosCount: 0,
      afterPhotosCount: 0,
      videosCount: customRequest.videoEvidenceIds?.length || 0,
      documentsCount: customRequest.attachedDocumentUrls?.length || 0,
      hasPreWorkReport: false,
      hasPostWorkReport: false,
      hasPresentation: false,
      hasScheduledVisit: true,
      hasZoomMeeting: false,
      hasAiMinutes: false,
      buildingType: customRequest.buildingType,
      serviceId: customRequest.serviceId,
      serviceCategory: customRequest.serviceCategory,
      systemCategoryTarget: customRequest.systemCategoryTarget,
      existingSystemDetails: customRequest.existingSystemDetails,
      preferredDate: customRequest.preferredDate,
      preferredTimeSlot: customRequest.preferredTimeSlot,
      scopeDescription: customRequest.scopeDescription,
      hasAsBuiltDrawings: customRequest.hasAsBuiltDrawings,
      attachedDocumentUrls: customRequest.attachedDocumentUrls,
      photoEvidenceIds: customRequest.photoEvidenceIds,
      videoEvidenceIds: customRequest.videoEvidenceIds,
      consentScopeExclusions: customRequest.consentScopeExclusions,
      consentDataProcessing: customRequest.consentDataProcessing
    };

    this.requests.unshift(newRequest);
    this.sendTailoredAcknowledgement(newRequest);
    this.createPreWorkConditionReport(newRequest);
    this.logAudit('SERVICE_REQUEST_REGISTERED', 'ServiceRequest', requestId, `Registered request ${ref}`);
    this.saveToStorage();
    return newRequest;
  }

  public updateRequestStage(requestId: string, currentStage: number, status?: any) {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) return;

    req.currentStage = currentStage;
    if (status) {
      req.status = status;
    }
    req.updatedAt = new Date().toISOString();
    req.statusHistory.push({
      id: `sh-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: status || req.status,
      actor: this.user.name,
      actorRole: this.user.role,
      notes: `Advanced engineering progress to Stage ${currentStage} (${HOW_WE_WORK_STAGES[currentStage - 1]?.title || 'SANS Stage'})`,
      isCustomerVisible: true
    });

    this.logAudit('STAGE_ADVANCED', 'ServiceRequest', requestId, `Advanced ${req.referenceNumber} to Stage ${currentStage}`);
    this.saveToStorage();
  }

  public addConditionReport(report: ConditionReport): ConditionReport {
    const idx = this.conditionReports.findIndex(r => r.id === report.id);
    if (idx >= 0) {
      this.conditionReports[idx] = report;
    } else {
      this.conditionReports.unshift(report);
    }

    const req = this.requests.find(r => r.id === report.requestId);
    if (req) {
      if (report.reportType === 'pre_work') req.hasPreWorkReport = true;
      if (report.reportType === 'post_work') req.hasPostWorkReport = true;
    }

    this.logAudit('CONDITION_REPORT_SAVED', 'ConditionReport', report.id, `Saved ${report.reportType} report ${report.reportNumber}`);
    this.saveToStorage();
    return report;
  }

  public getRequestById(id: string): ServiceRequest | undefined {
    return this.requests.find(r => r.id === id);
  }

  public createRequest(data: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    organisationName: string;
    siteId: string;
    siteName: string;
    siteAddress: string;
    serviceSlug: string;
    serviceTitle: string;
    urgency: 'routine' | 'urgent' | 'emergency_fault';
    description: string;
    preferredVisitDate: string;
    panelBrandModel?: string;
    faultSymptoms?: string[];
    initialPhotoUrls?: string[];
  }): ServiceRequest {
    const nextNum = Math.floor(850 + Math.random() * 150);
    const ref = `AFE-2026-0${nextNum}`;
    const requestId = `req-${Date.now()}`;

    const newRequest: ServiceRequest = {
      id: requestId,
      referenceNumber: ref,
      userId: this.user.id,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      organisationName: data.organisationName,
      siteId: data.siteId,
      siteName: data.siteName,
      siteAddress: data.siteAddress,
      serviceSlug: data.serviceSlug,
      serviceTitle: data.serviceTitle,
      urgency: data.urgency,
      description: data.description,
      preferredVisitDate: data.preferredVisitDate,
      panelBrandModel: data.panelBrandModel,
      faultSymptoms: data.faultSymptoms,
      status: 'Submitted',
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: 'Submitted',
          actor: data.clientName,
          actorRole: this.user.role,
          notes: 'Service request created through customer intake portal.',
          isCustomerVisible: true
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      beforePhotosCount: data.initialPhotoUrls?.length || 0,
      duringPhotosCount: 0,
      afterPhotosCount: 0,
      videosCount: 0,
      documentsCount: 0,
      hasPreWorkReport: false,
      hasPostWorkReport: false,
      hasPresentation: false,
      hasScheduledVisit: false,
      hasZoomMeeting: false,
      hasAiMinutes: false
    };

    this.requests.unshift(newRequest);

    // If photos provided, store as photo evidence
    if (data.initialPhotoUrls && data.initialPhotoUrls.length > 0) {
      data.initialPhotoUrls.forEach((url, i) => {
        const photo: PhotoEvidence = {
          id: `pho-${Date.now()}-${i}`,
          requestId: requestId,
          stage: 'before',
          category: 'fault_evidence',
          categoryLabel: 'Client Uploaded Before-Work Evidence',
          caption: `Initial submitted photographic evidence #${i + 1}`,
          areaLocation: data.siteName,
          equipmentRef: data.panelBrandModel || 'Control Equipment',
          imageUrl: url,
          uploadedBy: data.clientName,
          uploaderRole: 'Customer',
          uploadedAt: new Date().toISOString(),
          reviewStatus: 'awaiting_review',
          includedInReport: true,
          hash: Math.random().toString(36).substring(2, 12)
        };
        this.photos.push(photo);
      });
      newRequest.beforePhotosCount = data.initialPhotoUrls.length;
    }

    // Auto-generate Tailored Email
    this.sendTailoredAcknowledgement(newRequest);

    // Auto-create Pre-Work Report draft
    this.createPreWorkConditionReport(newRequest);

    this.logAudit('SERVICE_REQUEST_CREATED', 'ServiceRequest', requestId, `Created request ${ref} for ${data.serviceTitle}`);
    this.saveToStorage();
    return newRequest;
  }

  public updateRequestStatus(requestId: string, newStatus: any, notes: string) {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) return;

    req.status = newStatus;
    req.updatedAt = new Date().toISOString();
    req.statusHistory.push({
      id: `sh-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: newStatus,
      actor: this.user.name,
      actorRole: this.user.role,
      notes: notes || `Status updated to ${newStatus}`,
      isCustomerVisible: true
    });

    this.logAudit('REQUEST_STATUS_UPDATED', 'ServiceRequest', requestId, `Updated ${req.referenceNumber} to ${newStatus}`);
    this.saveToStorage();
  }

  // Photo & Evidence
  public getPhotos(requestId?: string): PhotoEvidence[] {
    if (requestId) {
      return this.photos.filter(p => p.requestId === requestId);
    }
    return this.photos;
  }

  public addPhoto(photo: Omit<PhotoEvidence, 'id' | 'uploadedAt' | 'hash'>): PhotoEvidence {
    const newPhoto: PhotoEvidence = {
      ...photo,
      id: `pho-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      hash: Math.random().toString(36).substring(2, 12)
    };
    this.photos.push(newPhoto);

    // Update request count
    const req = this.requests.find(r => r.id === photo.requestId);
    if (req) {
      if (photo.stage === 'before') req.beforePhotosCount++;
      if (photo.stage === 'during') req.duringPhotosCount++;
      if (photo.stage === 'after') req.afterPhotosCount++;
    }

    this.logAudit('PHOTO_EVIDENCE_UPLOADED', 'PhotoEvidence', newPhoto.id, `Uploaded ${photo.stage} photo for request ${photo.requestId}`);
    this.saveToStorage();
    return newPhoto;
  }

  public approvePhoto(photoId: string) {
    const p = this.photos.find(x => x.id === photoId);
    if (p) {
      p.reviewStatus = 'approved';
      p.includedInReport = true;
      this.logAudit('PHOTO_EVIDENCE_APPROVED', 'PhotoEvidence', photoId, `Approved photo ${photoId} for report inclusion`);
      this.saveToStorage();
    }
  }

  // Video Evidence
  public getVideos(requestId?: string): VideoEvidence[] {
    if (requestId) {
      return this.videos.filter(v => v.requestId === requestId);
    }
    return this.videos;
  }

  public addVideo(video: Omit<VideoEvidence, 'id' | 'uploadedAt' | 'hash'>): VideoEvidence {
    const newVideo: VideoEvidence = {
      ...video,
      id: `vid-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      hash: Math.random().toString(36).substring(2, 12)
    };
    this.videos.push(newVideo);

    const req = this.requests.find(r => r.id === video.requestId);
    if (req) {
      req.videosCount++;
    }

    this.logAudit('VIDEO_EVIDENCE_UPLOADED', 'VideoEvidence', newVideo.id, `Uploaded video evidence for request ${video.requestId}`);
    this.saveToStorage();
    return newVideo;
  }

  // Documents
  public getDocuments(requestId?: string): DocumentRecord[] {
    if (requestId) {
      return this.documents.filter(d => d.requestId === requestId);
    }
    return this.documents;
  }

  // Reports
  public getConditionReports(requestId?: string): ConditionReport[] {
    if (requestId) {
      return this.conditionReports.filter(r => r.requestId === requestId);
    }
    return this.conditionReports;
  }

  public createPreWorkConditionReport(req: ServiceRequest): ConditionReport {
    const relatedPhotos = this.photos.filter(p => p.requestId === req.id && p.stage === 'before');
    const report: ConditionReport = {
      id: `rep-pre-${Date.now()}`,
      requestId: req.id,
      reportType: 'pre_work',
      reportNumber: `REP-PRE-${req.referenceNumber}-V1`,
      version: 1,
      generatedAt: new Date().toISOString(),
      clientName: req.clientName,
      organisationName: req.organisationName,
      siteName: req.siteName,
      siteAddress: req.siteAddress,
      serviceTitle: req.serviceTitle,
      scopeSummary: `Initial pre-work baseline condition survey for ${req.serviceTitle}.`,
      visibleConditionNotes: req.description || 'Submitted panel display and detector images reviewed. No active burning signs.',
      physicalAssessmentRequiredNotes: 'Requires physical inspection of loop continuity, battery internal impedance, and detector chamber sensitivity on-site.',
      recommendedNextStep: 'Scheduled engineer site survey and physical point-to-point verification.',
      limitationsDisclaimer: 'This Automated Pre-Work Condition Report is compiled from submitted photographic evidence and preliminary triage. It is not an on-site statutory commissioning certificate, certificate of compliance, or approval.',
      evidenceSnapshot: {
        photoIds: relatedPhotos.map(p => p.id),
        videoIds: [],
        photographs: relatedPhotos.map(p => ({
          caption: p.caption,
          stage: p.stage,
          category: p.categoryLabel,
          location: p.areaLocation,
          imageUrl: p.imageUrl
        }))
      },
      status: 'draft'
    };

    this.conditionReports.push(report);
    req.hasPreWorkReport = true;
    return report;
  }

  public createPostWorkConditionReport(req: ServiceRequest): ConditionReport {
    const relatedPhotos = this.photos.filter(p => p.requestId === req.id);
    const relatedVideos = this.videos.filter(v => v.requestId === req.id);
    const report: ConditionReport = {
      id: `rep-post-${Date.now()}`,
      requestId: req.id,
      reportType: 'post_work',
      reportNumber: `REP-POST-${req.referenceNumber}-V1`,
      version: 1,
      generatedAt: new Date().toISOString(),
      clientName: req.clientName,
      organisationName: req.organisationName,
      siteName: req.siteName,
      siteAddress: req.siteAddress,
      serviceTitle: req.serviceTitle,
      scopeSummary: `Completed post-work engineering verification for ${req.serviceTitle}.`,
      visibleConditionNotes: 'System restored to 100% normal quiescent state. All tested detection devices and acoustic sounders confirmed functional under SANS 10139 recommendations.',
      physicalAssessmentRequiredNotes: 'Physical testing completed. All loops verified clear of earth faults, open circuits, and excessive loop resistance.',
      recommendedNextStep: 'File signed test records in facility SANS 10139 logbook and adhere to weekly call point test schedule.',
      limitationsDisclaimer: 'This Post-Work Condition Report records the verified physical condition of the tested fire detection equipment at the conclusion of the specified maintenance scope. Routine weekly testing remains the responsibility of the designated building occupier.',
      evidenceSnapshot: {
        photoIds: relatedPhotos.map(p => p.id),
        videoIds: relatedVideos.map(v => v.id),
        photographs: relatedPhotos.map(p => ({
          caption: p.caption,
          stage: p.stage,
          category: p.categoryLabel,
          location: p.areaLocation,
          imageUrl: p.imageUrl
        }))
      },
      status: 'draft'
    };

    this.conditionReports.push(report);
    req.hasPostWorkReport = true;
    this.saveToStorage();
    return report;
  }

  public acknowledgeReport(reportId: string, notes: string) {
    const rep = this.conditionReports.find(r => r.id === reportId);
    if (rep) {
      rep.status = 'acknowledged_by_client';
      rep.clientAcknowledgementNotes = notes || `Acknowledged by ${this.user.name} on ${new Date().toLocaleDateString()}`;
      this.logAudit('REPORT_ACKNOWLEDGED', 'ConditionReport', reportId, `Client acknowledged condition report ${rep.reportNumber}`);
      this.saveToStorage();
    }
  }

  // Presentations
  public getPresentations(requestId?: string): PowerPointPresentation[] {
    if (requestId) {
      return this.presentations.filter(p => p.requestId === requestId);
    }
    return this.presentations;
  }

  // Appointments & Calendar
  public getAppointments(): CalendarAppointment[] {
    return this.appointments;
  }

  public addAppointment(apt: Omit<CalendarAppointment, 'id' | 'googleCalendarEventId' | 'syncStatus'>): CalendarAppointment {
    const newApt: CalendarAppointment = {
      ...apt,
      id: `apt-${Date.now()}`,
      googleCalendarEventId: `gcal_evt_${Date.now()}`,
      syncStatus: 'synced'
    };
    this.appointments.push(newApt);
    this.logAudit('APPOINTMENT_SCHEDULED', 'CalendarAppointment', newApt.id, `Scheduled visit for ${apt.title} on ${apt.startTime}`);
    this.saveToStorage();
    return newApt;
  }

  // Zoom & AI Minutes
  public getZoomMeeting(): ZoomMeetingDetails {
    return this.zoomMeeting;
  }

  public updateZoomConsent(consent: boolean) {
    this.zoomMeeting.participantConsentGiven = consent;
    this.logAudit('ZOOM_CONSENT_UPDATED', 'ZoomMeetingDetails', this.zoomMeeting.id, `Participant consent set to ${consent}`);
    this.notify();
  }

  public getAiMinutes(): AiMeetingMinutes {
    return this.aiMinutes;
  }

  public acknowledgeMinutes(minutesId: string) {
    this.aiMinutes.status = 'client_acknowledged';
    this.logAudit('AI_MINUTES_ACKNOWLEDGED', 'AiMeetingMinutes', minutesId, 'Client acknowledged AI-assisted meeting minutes');
    this.notify();
  }

  public requestMinutesCorrection(correctionNotes: string) {
    this.aiMinutes.status = 'correction_requested';
    this.aiMinutes.version++;
    this.aiMinutes.clientConcerns.push(`Correction requested: ${correctionNotes}`);
    this.logAudit('AI_MINUTES_CORRECTION_REQUESTED', 'AiMeetingMinutes', this.aiMinutes.id, `Correction requested: ${correctionNotes}`);
    this.notify();
  }

  // Email Notification Engine
  public getEmailLogs(): EmailLogEntry[] {
    return this.emailLogs;
  }

  public addEmailLog(entry: EmailLogEntry): void {
    this.emailLogs.unshift(entry);
    if (this.emailLogs.length > 500) this.emailLogs.pop();
    this.saveToStorage();
    this.notify();
  }

  private sendTailoredAcknowledgement(req: ServiceRequest) {
    const isEmergency = req.urgency === 'emergency_fault';
    const email: EmailLogEntry = {
      id: `eml-${Date.now()}`,
      recipientEmail: req.clientEmail,
      recipientName: req.clientName,
      subject: isEmergency 
        ? `[EMERGENCY FAULT] Dispatch Notice [Ref: ${req.referenceNumber}] — ${req.siteName}`
        : `Service Request Acknowledgement [Ref: ${req.referenceNumber}] — ${req.serviceTitle}`,
      serviceCategory: req.serviceTitle,
      emailType: isEmergency ? 'fault_triage' : 'auto_reply_request',
      bodyText: `Dear ${req.clientName},

Thank you for contacting AUDRIN FIRE ENGINEERS (PTY) LTD regarding ${req.serviceTitle} for ${req.siteName}.

Your request reference number is: ${req.referenceNumber}.

Service Details:
- Site: ${req.siteName} (${req.siteAddress})
- Category: ${req.serviceTitle}
- Urgency: ${req.urgency.toUpperCase()}
- Preferred Visit Date: ${req.preferredVisitDate}

Next Steps:
1. Our technical desk is reviewing your building fire detection assets against SANS 10139 recommendations.
2. A formal scope review and scheduled technician visit confirmation will be updated in your customer portal.
3. If this enquiry involves active smoke or life-safety danger, please follow your building emergency evacuation plan and contact municipal emergency services immediately.

AUDRIN FIRE ENGINEERS (PTY) LTD
Early Detection. Clear Warning. Safer Buildings.
Registration: K2026089596
Telephone: 071 415 6665 | Email: bethuelmoukangwe8@gmail.com
Address: 27 Tshivhase Street, Pretoria West, Pretoria, 0008`,
      sentAt: new Date().toISOString(),
      deliveryStatus: 'delivered',
      hasAttachment: false,
      correlationId: `corr_${req.referenceNumber}_auto`
    };

    this.emailLogs.unshift(email);
  }

  // Google Sheets 1-Way Mirror Generator
  public getGoogleSheetsMirror(): { tabName: string; rowCount: number; rows: GoogleSheetRow[] }[] {
    const tabs = [
      'Clients',
      'Organisations',
      'Sites',
      'Service Requests',
      'Site Visits',
      'Pre-Work Reports',
      'Post-Work Reports',
      'Documents Register',
      'Photo Evidence Register',
      'Video Evidence Register',
      'Outstanding Items',
      'Completed Work',
      'Notification Status',
      'Executive Dashboard'
    ];

    return tabs.map(tab => {
      let rows: GoogleSheetRow[] = [];
      if (tab === 'Service Requests') {
        rows = this.requests.map(r => ({
          uuid: r.id,
          tabName: tab,
          colA: r.referenceNumber,
          colB: r.clientName,
          colC: r.siteName,
          colD: r.serviceTitle,
          colE: r.status,
          colF: r.createdAt.substring(0, 10),
          lastUpdated: r.updatedAt,
          syncStatus: 'synced'
        }));
      } else if (tab === 'Sites') {
        rows = this.sites.map(s => ({
          uuid: s.id,
          tabName: tab,
          colA: s.name,
          colB: s.city,
          colC: s.systemType,
          colD: s.panelMakeModel,
          colE: `${s.loopCount} Loops`,
          colF: `${s.detectorCountApprox} Detectors`,
          lastUpdated: new Date().toISOString(),
          syncStatus: 'synced'
        }));
      } else if (tab === 'Photo Evidence Register') {
        rows = this.photos.map(p => ({
          uuid: p.id,
          tabName: tab,
          colA: p.requestId,
          colB: p.stage.toUpperCase(),
          colC: p.categoryLabel,
          colD: p.areaLocation,
          colE: p.reviewStatus,
          colF: p.hash,
          lastUpdated: p.uploadedAt,
          syncStatus: 'synced'
        }));
      } else {
        rows = [
          {
            uuid: `row-${tab}-1`,
            tabName: tab,
            colA: 'AFE-2026-0842',
            colB: 'Menlyn Central Tower',
            colC: 'SANS 10139 Routine Maintenance',
            colD: 'Operational',
            colE: 'Verified',
            colF: '2026-09-02',
            lastUpdated: new Date().toISOString(),
            syncStatus: 'synced'
          }
        ];
      }

      return {
        tabName: tab,
        rowCount: rows.length,
        rows
      };
    });
  }

  // Audit Logs
  public getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }

  // ==========================================
  // SANS 10139 & SAQCC COMMISSIONER METHODS
  // ==========================================

  public getSansBenchmarkRules(): SansRuleDefinition[] {
    return this.sansRulesBenchmark;
  }

  public getSansLogbook(): SansLogbookEntry[] {
    return this.sansLogbook;
  }

  public getSansLogbookForSite(siteId: string): SansLogbookEntry[] {
    return this.sansLogbook.filter(entry => entry.siteId === siteId);
  }

  public addSansLogbookEntry(entry: SansLogbookEntry): void {
    this.sansLogbook.unshift(entry);
    this.logAudit(
      'SANS_LOGBOOK_ENTRY_RECORDED',
      'SansLogbookEntry',
      entry.id,
      `Recorded ${entry.entryType.toUpperCase()} SANS 10139 logbook entry for site ${entry.siteName} (${entry.inspectorIdOrSaqcc || 'Inspected'}).`
    );
    this.saveToStorage();
  }

  public deleteSansLogbookEntry(id: string): void {
    const entry = this.sansLogbook.find(e => e.id === id);
    this.sansLogbook = this.sansLogbook.filter(e => e.id !== id);
    if (entry) {
      this.logAudit(
        'SANS_LOGBOOK_ENTRY_DELETED',
        'SansLogbookEntry',
        id,
        `Deleted ${entry.entryType} logbook record for site ${entry.siteName}.`
      );
    }
    this.saveToStorage();
  }

  public getSansCocs(): SansCocCertificate[] {
    return this.sansCocs;
  }

  public getSansCocById(id: string): SansCocCertificate | undefined {
    return this.sansCocs.find(c => c.id === id);
  }

  public addSansCoc(coc: SansCocCertificate): void {
    this.sansCocs.unshift(coc);
    this.logAudit(
      'SANS_10139_COC_ISSUED',
      'SansCocCertificate',
      coc.id,
      `Issued SANS 10139 / SAQCC Certificate of Compliance ${coc.cocNumber} for ${coc.siteName} under Category ${coc.systemCategory}. Commissioner: ${coc.commissionerName}.`
    );
    this.saveToStorage();
  }

  public updateSansCoc(coc: SansCocCertificate): void {
    const index = this.sansCocs.findIndex(c => c.id === coc.id);
    if (index !== -1) {
      this.sansCocs[index] = coc;
      this.logAudit(
        'SANS_10139_COC_UPDATED',
        'SansCocCertificate',
        coc.id,
        `Updated SANS 10139 Certificate of Compliance ${coc.cocNumber} for ${coc.siteName}.`
      );
      this.saveToStorage();
    }
  }

  public approveSansCoc(cocId: string, notes?: string): void {
    const coc = this.sansCocs.find(c => c.id === cocId);
    if (!coc) return;
    coc.certificateStatus = 'Issued';
    coc.overallComplianceStatus = 'Fully Compliant';
    coc.isSigned = true;
    coc.signatureHash = `AFE-COC-${coc.commissionerIdNumber || '9109170791081'}-${Date.now().toString().slice(-4)}`;
    this.logAudit(
      'SANS_10139_COC_ISSUED',
      'SansCocCertificate',
      coc.id,
      `Administrator approved & issued Certificate of Compliance ${coc.cocNumber} for ${coc.siteName}. Notes: ${notes || 'Formal SANS 10139 sign-off'}.`
    );
    this.saveToStorage();
  }

  public getCocRevisions(cocId?: string): CertificateRevisionRecord[] {
    if (!cocId) return this.cocRevisions;
    return this.cocRevisions.filter(r => r.cocId === cocId || r.cocNumber === cocId);
  }

  public getCocRevisionById(revisionId: string): CertificateRevisionRecord | undefined {
    return this.cocRevisions.find(r => r.id === revisionId);
  }

  public createCocRevision(
    coc: SansCocCertificate, 
    reasonForRevision?: string, 
    changeSummary?: string[]
  ): CertificateRevisionRecord {
    const existingRevs = this.cocRevisions.filter(r => r.cocId === coc.id || r.cocNumber === coc.cocNumber);
    const revCount = existingRevs.length;
    const defaultRevNum = coc.revisionNumber || (revCount === 0 ? 'Rev 1.0' : `Rev ${revCount + 1}.0`);
    
    // Deep immutable snapshot of the certificate at issuance time
    const snapshot: SansCocCertificate = JSON.parse(JSON.stringify(coc));
    const nowIso = new Date().toISOString();
    const checksum = coc.documentChecksumSha256 || `sha256-coc-${coc.cocNumber.toLowerCase()}-${Date.now().toString(36)}`;
    
    // Automatic statutory audit trail log entry
    const auditRecord = this.logComplianceAudit({
      projectId: coc.siteId || 'site-general',
      projectName: coc.siteName,
      clientId: 'org-client',
      clientName: coc.clientName,
      documentId: coc.id,
      documentTitle: `Certificate of Compliance (${coc.cocNumber})`,
      documentVersion: defaultRevNum,
      eventType: revCount === 0 ? 'document_creation' : 'status_change',
      eventDescription: `Statutory immutable revision ${defaultRevNum} recorded for SANS 10139 COC ${coc.cocNumber} (${coc.siteName}). Category: ${coc.systemCategory}. Reason: ${reasonForRevision || 'Official statutory issuance'}. SHA-256 Checksum: ${checksum}.`,
      userEmail: this.user.email,
      userName: this.user.name,
      userRole: this.user.role,
      ipAddress: '105.187.112.55',
      deviceMetadata: 'Audrin Compliance Portal (SANS 10139 Versioning Engine)',
      standardsReference: 'SANS 10139:2012 Clause 13.2 & POPIA Act 4',
      popiaCategory: 'statutory_record'
    });

    const revisionRecord: CertificateRevisionRecord = {
      id: `rev-${coc.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      cocId: coc.id,
      cocNumber: coc.cocNumber,
      revisionNumber: defaultRevNum,
      issuedAt: nowIso,
      issuedBy: {
        name: coc.commissionerName || this.user.name,
        email: coc.commissionerEmail || this.user.email,
        role: this.user.role === 'super_admin' ? 'Super Admin / Commissioner' : 'SAQCC SANS 10139 Commissioner',
        saqccNumber: coc.commissionerSaqccNumber,
        idNumber: coc.commissionerIdNumber
      },
      reasonForRevision: reasonForRevision || (revCount === 0 ? 'Initial Statutory SANS 10139 Commissioning & Issuance' : `Statutory Revision ${defaultRevNum} re-certification`),
      changeSummary: changeSummary || [
        `Status set to: ${coc.certificateStatus || 'Issued'}`,
        `System Category: ${coc.systemCategory} (${coc.systemObjective})`,
        `Device schedule: ${coc.deviceSchedule.blueDotSmokeDetectors} Smoke, ${coc.deviceSchedule.blackDotHeatDetectors} Heat, ${coc.deviceSchedule.greenDotManualCallPoints} MCPs, ${coc.deviceSchedule.redDotSoundersSirens} Sounders`,
        `Power Autonomy: ${coc.powerSupplyAutonomy.standbyAutonomyHours}h Standby verified (SANS 10139 compliant)`,
        `Cryptographic Checksum: ${checksum.substring(0, 16)}...`
      ],
      documentChecksumSha256: checksum,
      signatureHash: coc.signatureHash || coc.commissionerSignatureData?.documentSha256Hash || checksum,
      systemCategory: coc.systemCategory,
      overallComplianceStatus: coc.overallComplianceStatus || 'Fully Compliant',
      siteId: coc.siteId,
      siteName: coc.siteName,
      clientName: coc.clientName,
      isImmutable: true,
      auditTrailRef: auditRecord.auditNumber,
      snapshot
    };

    // Prepend to immutable revisions list
    this.cocRevisions.unshift(revisionRecord);

    // Synchronize certificate record in store
    const certInStore = this.sansCocs.find(c => c.id === coc.id);
    if (certInStore) {
      if (!certInStore.revisionHistory) certInStore.revisionHistory = [];
      certInStore.revisionHistory = this.cocRevisions.filter(r => r.cocId === coc.id);
      certInStore.activeRevisionId = revisionRecord.id;
      certInStore.revisionNumber = defaultRevNum;
      certInStore.certificateStatus = 'Issued';
      certInStore.documentChecksumSha256 = checksum;
    }

    this.logAudit(
      'SANS_10139_COC_REVISION_CREATED',
      'CertificateRevisionRecord',
      revisionRecord.id,
      `Immutable revision ${revisionRecord.revisionNumber} generated for COC ${coc.cocNumber} (${coc.siteName}). Audit Ledger: ${auditRecord.auditNumber}.`
    );

    this.saveToStorage();
    return revisionRecord;
  }

  public sendCocEmail(
    coc: SansCocCertificate, 
    recipientEmails: string[], 
    subject: string, 
    ccEmails: string[] = ['admin@audrinfire.co.za', 'compliance@audrinfire.co.za']
  ): EmailLogEntry {
    const checksum = coc.documentChecksumSha256 || `sha256-coc-${coc.cocNumber.toLowerCase()}-${Date.now().toString(36)}`;
    const allRecipients = Array.from(new Set([...recipientEmails, ...ccEmails]));
    
    const emailEntry: EmailLogEntry = {
      id: `eml-coc-${Date.now()}`,
      recipientEmail: recipientEmails.join(', '),
      recipientName: `${coc.clientName} & Designated Safety Officer`,
      subject,
      serviceCategory: 'SANS 10139 Certificate of Compliance',
      emailType: 'service_report_ready',
      bodyText: `Dear ${coc.clientName} and Safety Officer,

Please find attached the official, locked PDF of the SANS 10139 Certificate of Compliance (COC) for ${coc.siteName}.

Certificate Details:
- Certificate Number: ${coc.cocNumber}
- System Category: Category ${coc.systemCategory} (${coc.systemObjective})
- Building Occupancy: ${coc.buildingOccupancyType}
- Premises Address: ${coc.siteAddress}
- Lead SAQCC Commissioner: ${coc.commissionerName} (Reg: ${coc.commissionerSaqccNumber})
- Status: ${coc.certificateStatus || (coc.isSigned ? 'Issued' : 'Draft')}
- Cryptographic SHA-256 Checksum: ${checksum}

Official Verification URL:
${coc.qrVerificationUrl || `https://audrinfire.co.za/verify/coc/${coc.cocNumber}`}

This certificate has been issued under the professional responsibility of the accredited SAQCC Fire Commissioner in accordance with SANS 10139 and South African fire safety standards.

AUDRIN FIRE ENGINEERS (PTY) LTD
Menlyn Corporate Park, Building B, 175 Dallas Ave, Menlyn, Pretoria, 0181
Reg: K2026089596 | VAT: 4920288190 | Tel: 071 415 6665`,
      sentAt: new Date().toISOString(),
      deliveryStatus: 'delivered',
      hasAttachment: true,
      correlationId: `corr_${coc.cocNumber}_dist`
    };

    this.emailLogs.unshift(emailEntry);

    // Also update COC internal dispatch records
    const updatedDispatches = [
      ...(coc.emailDispatches || []),
      {
        sentAt: new Date().toISOString(),
        recipients: allRecipients,
        subject,
        status: 'Delivered' as const,
        checksum
      }
    ];

    const updatedCoc: SansCocCertificate = {
      ...coc,
      emailDispatches: updatedDispatches
    };

    this.updateSansCoc(updatedCoc);

    this.logAudit(
      'COC_EMAILED_TO_STAKEHOLDERS',
      'SansCocCertificate',
      coc.id,
      `Dispatched SANS 10139 COC ${coc.cocNumber} to ${recipientEmails.join(', ')} with CC to ${ccEmails.join(', ')}. Checksum: ${checksum}.`
    );

    this.saveToStorage();
    return emailEntry;
  }

  // ==========================================
  // SOURCE DOCUMENTS & REQUIREMENTS METHODS
  // ==========================================
  public getApprovedSourceDocuments(): ApprovedSourceDocument[] {
    return this.approvedSourceDocuments;
  }

  public getSourceRequirements(): SourceRequirement[] {
    return this.sourceRequirements;
  }

  public getSourceRequirementById(id: string): SourceRequirement | undefined {
    return this.sourceRequirements.find(r => r.id === id);
  }

  // ==========================================
  // COMPANY BRANDING & ISSUER PROFILE METHODS
  // ==========================================
  public getCompanyBrandings(): CompanyProfileBranding[] {
    return this.companyBrandings;
  }

  public getCurrentCompanyBranding(): CompanyProfileBranding {
    return this.companyBrandings[0] || INITIAL_COMPANY_BRANDINGS[0];
  }

  public updateCompanyBranding(branding: CompanyProfileBranding): void {
    const index = this.companyBrandings.findIndex(b => b.id === branding.id);
    const updated = {
      ...branding,
      version: branding.version + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: this.user.name
    };

    if (index !== -1) {
      this.companyBrandings[index] = updated;
    } else {
      this.companyBrandings.unshift(updated);
    }

    this.logAudit(
      'COMPANY_BRANDING_UPDATED',
      'CompanyProfileBranding',
      updated.id,
      `Updated client branding and company profile for ${updated.registeredName} (v${updated.version}).`
    );
    this.saveToStorage();
  }

  public getIssuerSettings(): AudrinIssuerSettings {
    return this.audrinIssuerSettings;
  }

  public updateIssuerSettings(settings: AudrinIssuerSettings): void {
    this.audrinIssuerSettings = {
      ...settings,
      version: settings.version + 1,
      updatedAt: new Date().toISOString(),
      updatedBy: this.user.name
    };
    this.logAudit(
      'ISSUER_SETTINGS_UPDATED',
      'AudrinIssuerSettings',
      'audrin-issuer-01',
      `Updated Audrin Fire Engineers issuer settings (v${this.audrinIssuerSettings.version}).`
    );
    this.saveToStorage();
  }

  // ==========================================
  // PRE-WORK INSPECTION METHODS
  // ==========================================
  public getPreWorkInspections(): PreWorkInspectionRecord[] {
    return this.preWorkInspections;
  }

  public getPreWorkInspectionById(id: string): PreWorkInspectionRecord | undefined {
    return this.preWorkInspections.find(p => p.id === id);
  }

  public addPreWorkInspection(inspection: PreWorkInspectionRecord): void {
    this.preWorkInspections.unshift(inspection);
    this.logAudit(
      'PRE_WORK_INSPECTION_CREATED',
      'PreWorkInspectionRecord',
      inspection.id,
      `Created Pre-Work Fire Detection Inspection ${inspection.inspectionNumber} for ${inspection.siteName}. Status: ${inspection.workflowStatus}.`
    );
    this.saveToStorage();
  }

  public updatePreWorkInspection(inspection: PreWorkInspectionRecord): void {
    const index = this.preWorkInspections.findIndex(p => p.id === inspection.id);
    if (index !== -1) {
      this.preWorkInspections[index] = {
        ...inspection,
        updatedAt: new Date().toISOString()
      };
      this.logAudit(
        'PRE_WORK_INSPECTION_UPDATED',
        'PreWorkInspectionRecord',
        inspection.id,
        `Updated Pre-Work Inspection ${inspection.inspectionNumber}. Status: ${inspection.workflowStatus}.`
      );
      this.saveToStorage();
    }
  }

  // ==========================================
  // POST-WORK INSPECTION METHODS
  // ==========================================
  public getPostWorkInspections(): PostWorkInspectionRecord[] {
    return this.postWorkInspections;
  }

  public getPostWorkInspectionById(id: string): PostWorkInspectionRecord | undefined {
    return this.postWorkInspections.find(p => p.id === id);
  }

  public addPostWorkInspection(inspection: PostWorkInspectionRecord): void {
    this.postWorkInspections.unshift(inspection);
    this.logAudit(
      'POST_WORK_INSPECTION_CREATED',
      'PostWorkInspectionRecord',
      inspection.id,
      `Created Post-Work Inspection & Completion ${inspection.inspectionNumber} for ${inspection.siteName}.`
    );

    // Auto-create defects if mandatory tests failed
    if (!inspection.sounderLevelPass) {
      this.addDefect({
        id: `def-auto-${Date.now()}-1`,
        siteId: inspection.siteId,
        siteName: inspection.siteName,
        clientId: inspection.clientId,
        relatedInspectionId: inspection.id,
        relatedInspectionType: 'post_work',
        title: `Sounder level below 65 dB(A) minimum (${inspection.alarmSounderTestedDba} dB(A) recorded)`,
        description: 'Sound pressure level in sleeping/critical area failed SANS 10139 bedhead audibility rule.',
        riskLevel: 'critical',
        blocksCocIssuance: true,
        status: 'open',
        remedialAction: 'Install additional secondary sounder or adjust tap setting to achieve >= 65 dB(A).',
        responsibleParty: 'Audrin Fire Engineers',
        targetDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        sourceCitation: {
          sourceDocId: 'src-doc-02',
          sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
          pdfPage: 4,
          clauseOrQuestion: 'Question 1(r)',
          approvedParaphrase: 'Bedhead sound level ≥ 65 dB(A) with doors closed.'
        },
        createdAt: new Date().toISOString()
      });
    }

    this.saveToStorage();
  }

  public updatePostWorkInspection(inspection: PostWorkInspectionRecord): void {
    const index = this.postWorkInspections.findIndex(p => p.id === inspection.id);
    if (index !== -1) {
      this.postWorkInspections[index] = {
        ...inspection,
        updatedAt: new Date().toISOString()
      };
      this.logAudit(
        'POST_WORK_INSPECTION_UPDATED',
        'PostWorkInspectionRecord',
        inspection.id,
        `Updated Post-Work Inspection ${inspection.inspectionNumber}. Status: ${inspection.workflowStatus}.`
      );
      this.saveToStorage();
    }
  }

  // ==========================================
  // DEFECTS & CORRECTIVE ACTION METHODS
  // ==========================================
  public getDefects(): DefectRecord[] {
    return this.defects;
  }

  public addDefect(defect: DefectRecord): void {
    this.defects.unshift(defect);
    this.logAudit(
      'DEFECT_LOGGED',
      'DefectRecord',
      defect.id,
      `Logged ${defect.riskLevel.toUpperCase()} defect for ${defect.siteName}: "${defect.title}". Blocks COC: ${defect.blocksCocIssuance}.`
    );
    this.saveToStorage();
  }

  public updateDefect(defect: DefectRecord): void {
    const index = this.defects.findIndex(d => d.id === defect.id);
    if (index !== -1) {
      this.defects[index] = defect;
      this.logAudit(
        'DEFECT_UPDATED',
        'DefectRecord',
        defect.id,
        `Updated defect ${defect.id} status to ${defect.status}.`
      );
      this.saveToStorage();
    }
  }

  public resolveDefect(id: string, notes: string): void {
    const defect = this.defects.find(d => d.id === id);
    if (defect) {
      defect.status = 'resolved';
      defect.resolvedDate = new Date().toISOString();
      defect.resolvedBy = this.user.name;
      defect.resolutionNotes = notes;
      this.logAudit(
        'DEFECT_RESOLVED',
        'DefectRecord',
        id,
        `Resolved defect "${defect.title}" for ${defect.siteName}. Notes: ${notes}.`
      );
      this.saveToStorage();
    }
  }

  // ==========================================
  // COC ELIGIBILITY GATE & AUDIT ENGINE
  // ==========================================
  public checkCocEligibility(siteId: string): CocEligibilityGateResult {
    const preWork = this.preWorkInspections.find(p => p.siteId === siteId && (p.workflowStatus === 'approved' || p.workflowStatus === 'issued'));
    const postWork = this.postWorkInspections.find(p => p.siteId === siteId && (p.workflowStatus === 'approved' || p.workflowStatus === 'issued'));
    const openCriticalDefects = this.defects.filter(d => d.siteId === siteId && d.riskLevel === 'critical' && d.status !== 'resolved');
    
    const gates = [
      {
        id: 'gate-1',
        label: 'Approved Pre-Work Fire Detection Inspection Exists',
        passed: !!preWork,
        blockerReason: !preWork ? 'Missing approved pre-work inspection report with client & technician sign-off.' : undefined,
        sourceRef: 'SANS 10400-T Clause 4.32 / POE Q19'
      },
      {
        id: 'gate-2',
        label: 'Approved Post-Work & Commissioning Test Evidence Exists',
        passed: !!postWork,
        blockerReason: !postWork ? 'Missing approved post-work inspection with commissioning test records.' : undefined,
        sourceRef: 'SANS 10400-T Clause 4.31 / Table C.1'
      },
      {
        id: 'gate-3',
        label: 'Mandatory Audibility & Sounder Test (≥ 65 dB(A) Bedhead)',
        passed: postWork ? postWork.sounderLevelPass : false,
        blockerReason: postWork && !postWork.sounderLevelPass ? `Measured sound level ${postWork.alarmSounderTestedDba} dB(A) failed ≥ 65 dB(A) minimum.` : (!postWork ? 'Sounder audibility test not recorded.' : undefined),
        sourceRef: 'Summative POE Q1(r) & Q1(s)'
      },
      {
        id: 'gate-4',
        label: 'Secondary Power Supply Autonomy (≥ 24h Quiescent + 30 min Evac)',
        passed: postWork ? postWork.powerAutonomyPass : false,
        blockerReason: postWork && !postWork.powerAutonomyPass ? 'Battery calculation or discharge autonomy failed SANS 24h+30m threshold.' : (!postWork ? 'Power autonomy not verified.' : undefined),
        sourceRef: 'Summative POE Q1(g)'
      },
      {
        id: 'gate-5',
        label: 'Zero Open Critical Life-Safety Defects',
        passed: openCriticalDefects.length === 0,
        blockerReason: openCriticalDefects.length > 0 ? `${openCriticalDefects.length} critical defect(s) pending resolution: "${openCriticalDefects[0].title}".` : undefined,
        sourceRef: 'SANS 10400-T Clause 4.32'
      },
      {
        id: 'gate-6',
        label: 'Photographic & As-Built Evidence Attached',
        passed: Boolean(preWork?.beforePhotos?.length && postWork?.afterPhotos?.length && postWork?.asBuiltDrawingsAttached),
        blockerReason: (!preWork?.beforePhotos?.length || !postWork?.afterPhotos?.length) ? 'Before/after photographic evidence or as-built CAD markup missing.' : undefined,
        sourceRef: 'Summative POE Q19'
      },
      {
        id: 'gate-7',
        label: 'Technician SAQCC Registration & Digital Signature Validated',
        passed: Boolean(postWork?.technicianDeclarationSigned && postWork?.technicianSignature?.otpVerified),
        blockerReason: !postWork?.technicianDeclarationSigned ? 'Lead technician declaration signature and OTP authentication required.' : undefined,
        sourceRef: 'SANS 10400-T Table C.1 / POE Signoff'
      },
      {
        id: 'gate-8',
        label: 'Client Representative Acceptance Signed & Verified',
        passed: Boolean(postWork?.clientAcknowledgementSigned && postWork?.clientSignature?.otpVerified),
        blockerReason: !postWork?.clientAcknowledgementSigned ? 'Client handover acceptance signature and OTP verification required.' : undefined,
        sourceRef: 'Summative POE Q19 Handover'
      },
      {
        id: 'gate-9',
        label: 'Mandatory Source-Coverage Gate: Approved SANS Technical Sources',
        passed: false, // BINDING RULE: Current attachments (SANS 10400-T + Summative POE) do not contain complete SANS 10139 text!
        blockerReason: 'MANDATORY AUDIT NOTICE: Current controlled sources (SANS 10400-T Edition 3 + Summative POE) are source-limited. Must be marked SOURCE-LIMITED DRAFT - NOT AN ISSUABLE CERTIFICATE until an authorised competent person certifies full source set.',
        sourceRef: 'SANS Document Control Gate Rule'
      }
    ];

    const passedCount = gates.filter(g => g.passed).length;
    const openBlockers = gates.filter(g => !g.passed && g.blockerReason).map(g => g.blockerReason as string);
    const overallScore = Math.round((passedCount / gates.length) * 100);

    return {
      canIssueCoc: false, // Always false for official issuance under source-limited attachments
      overallScore,
      sourceCoverageNotice: 'SOURCE-LIMITED DRAFT - NOT AN ISSUABLE CERTIFICATE',
      isSourceLimitedDraft: true,
      gates,
      openBlockers
    };
  }

  // ==========================================
  // GOOGLE SHEETS & EXPORT METHODS
  // ==========================================
  public getGoogleSheetsState(): GoogleSheetsMirrorState {
    return this.googleSheetsState;
  }

  public updateGoogleSheetsState(state: GoogleSheetsMirrorState): void {
    this.googleSheetsState = state;
    this.saveToStorage();
  }

  public triggerGoogleSheetsSync(): void {
    this.googleSheetsState.syncStatus = 'syncing';
    this.notifyListeners();

    setTimeout(() => {
      this.googleSheetsState.syncStatus = 'idle';
      this.googleSheetsState.lastSyncTimestamp = new Date().toISOString();
      this.googleSheetsState.mirroredTabs = [
        { tabName: 'Sites', rowCount: this.sites.length, lastUpdated: new Date().toISOString() },
        { tabName: 'Systems', rowCount: this.sites.length, lastUpdated: new Date().toISOString() },
        { tabName: 'Assets', rowCount: 148, lastUpdated: new Date().toISOString() },
        { tabName: 'Logbook Entries', rowCount: this.sansLogbook.length, lastUpdated: new Date().toISOString() },
        { tabName: 'Inspections', rowCount: this.preWorkInspections.length + this.postWorkInspections.length, lastUpdated: new Date().toISOString() },
        { tabName: 'Defects', rowCount: this.defects.length, lastUpdated: new Date().toISOString() },
        { tabName: 'Corrective Actions', rowCount: this.defects.length, lastUpdated: new Date().toISOString() },
        { tabName: 'COCs', rowCount: this.sansCocs.length, lastUpdated: new Date().toISOString() },
        { tabName: 'Audit Export', rowCount: this.auditLogs.length, lastUpdated: new Date().toISOString() }
      ];
      this.logAudit(
        'GOOGLE_SHEETS_MIRROR_SYNCED',
        'GoogleSheetsMirrorState',
        this.googleSheetsState.spreadsheetId,
        `Synchronized ${this.googleSheetsState.mirroredTabs.length} tabs to Google Sheets mirror.`
      );
      this.saveToStorage();
    }, 1200);
  }

  public getExportJobs(): ExportJobRecord[] {
    return this.exportJobs;
  }

  public triggerExportJob(
    documentType: 'logbook' | 'pre_work' | 'post_work' | 'coc' | 'defects_summary' | 'audit_trail',
    documentNumber: string,
    format: 'pdf' | 'docx' | 'xlsx'
  ): ExportJobRecord {
    const newJob: ExportJobRecord = {
      id: `exp-${Date.now()}`,
      documentType,
      documentNumber,
      format,
      status: 'completed',
      requestedBy: this.user.name,
      requestedAt: new Date().toISOString(),
      fileSizeBytes: format === 'pdf' ? 2450000 : (format === 'docx' ? 1120000 : 750000),
      downloadUrl: '#',
      contentHashSha256: `sha256-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      watermark: 'SOURCE-LIMITED DRAFT - NOT AN ISSUABLE CERTIFICATE'
    };

    this.exportJobs.unshift(newJob);
    this.logAudit(
      'DOCUMENT_EXPORTED',
      'ExportJobRecord',
      newJob.id,
      `Exported ${documentType.toUpperCase()} (${documentNumber}) in ${format.toUpperCase()} format with anti-tamper hash.`
    );
    this.saveToStorage();
    return newJob;
  }

  // ==========================================================================
  // CAREERS & TECHNICIAN VACANCIES SYSTEM METHODS
  // ==========================================================================

  public getVacancies(): VacancyRecord[] {
    return this.vacancies;
  }

  public getPublishedVacancies(): VacancyRecord[] {
    return this.vacancies.filter(v => v.isPublished && !v.isClosed);
  }

  public getVacancyById(id: string): VacancyRecord | undefined {
    return this.vacancies.find(v => v.id === id || v.referenceNumber === id);
  }

  public saveVacancy(vacancy: VacancyRecord): void {
    const existingIndex = this.vacancies.findIndex(v => v.id === vacancy.id);
    if (existingIndex >= 0) {
      this.vacancies[existingIndex] = {
        ...vacancy,
        updatedAt: new Date().toISOString()
      };
      this.logAudit('VACANCY_UPDATED', 'VacancyRecord', vacancy.id, `Updated vacancy details for ${vacancy.jobTitle} (${vacancy.referenceNumber}).`);
    } else {
      this.vacancies.unshift({
        ...vacancy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      this.logAudit('VACANCY_CREATED', 'VacancyRecord', vacancy.id, `Created new vacancy posting ${vacancy.jobTitle} (${vacancy.referenceNumber}).`);
    }
    this.saveToStorage();
  }

  public deleteVacancy(id: string): void {
    const vac = this.vacancies.find(v => v.id === id);
    this.vacancies = this.vacancies.filter(v => v.id !== id);
    if (vac) {
      this.logAudit('VACANCY_DELETED', 'VacancyRecord', id, `Deleted vacancy posting ${vac.jobTitle} (${vac.referenceNumber}).`);
    }
    this.saveToStorage();
  }

  public toggleVacancyStatus(id: string, isClosed: boolean): void {
    const vac = this.vacancies.find(v => v.id === id);
    if (vac) {
      vac.isClosed = isClosed;
      vac.updatedAt = new Date().toISOString();
      this.logAudit(isClosed ? 'VACANCY_CLOSED' : 'VACANCY_REOPENED', 'VacancyRecord', id, `${isClosed ? 'Closed' : 'Reopened'} applications for ${vac.jobTitle}.`);
      this.saveToStorage();
    }
  }

  public toggleVacancyPublish(id: string, isPublished: boolean): void {
    const vac = this.vacancies.find(v => v.id === id);
    if (vac) {
      vac.isPublished = isPublished;
      vac.updatedAt = new Date().toISOString();
      this.logAudit(isPublished ? 'VACANCY_PUBLISHED' : 'VACANCY_UNPUBLISHED', 'VacancyRecord', id, `${isPublished ? 'Published' : 'Unpublished'} vacancy ${vac.jobTitle}.`);
      this.saveToStorage();
    }
  }

  // --- Technician Accounts & Authentication ---

  public getTechnicians(): TechnicianAccount[] {
    return this.technicians;
  }

  public getTechnicianById(id: string): TechnicianAccount | undefined {
    return this.technicians.find(t => t.id === id || t.email.toLowerCase() === id.toLowerCase());
  }

  public getActiveTechnician(): TechnicianAccount | null {
    if (!this.activeTechnicianId) return null;
    return this.technicians.find(t => t.id === this.activeTechnicianId) || null;
  }

  public setActiveTechnician(id: string | null): void {
    this.activeTechnicianId = id;
    this.saveToStorage();
  }

  public registerTechnician(data: {
    fullName: string;
    email: string;
    cellphone: string;
    password: string;
    popiaConsent: boolean;
    privacyPolicy: boolean;
  }): { success: boolean; message: string; technicianId?: string; verificationCode?: string } {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = this.technicians.find(t => t.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists. Please log in.' };
    }

    if (!data.popiaConsent || !data.privacyPolicy) {
      return { success: false, message: 'POPIA consent and Privacy Policy acceptance are strictly required to proceed.' };
    }

    // Generate six-digit email verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newTechnician: TechnicianAccount = {
      id: `tech-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: normalizedEmail,
      cellphone: data.cellphone.trim(),
      passwordHash: `sha256_${btoa(data.password).slice(0, 32)}`,
      isEmailVerified: false,
      emailVerificationCode: verificationCode,
      emailVerificationSentAt: new Date().toISOString(),
      popiaConsentAccepted: true,
      popiaConsentTimestamp: new Date().toISOString(),
      privacyPolicyAccepted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      residentialAddress: '',
      province: 'Gauteng',
      postalCode: '',
      saqccNumber: '',
      saqccExpiryDate: '',
      saqccCategories: [],
      qualifications: [],
      sans10139ExperienceSummary: '',
      yearsOfExperience: 0,
      driverLicense: 'None',
      availability: 'Immediate',
      preferredLocations: ['Gauteng'],
      documents: []
    };

    this.technicians.unshift(newTechnician);

    // Send verification email log
    this.sendCareerEmail({
      recipientEmail: normalizedEmail,
      recipientName: newTechnician.fullName,
      subject: 'Verify Your Email – Audrin Fire Engineers Careers Portal',
      body: `Dear ${newTechnician.fullName},\n\nThank you for registering on the Audrin Fire Engineers Careers Portal. Your 6-digit email verification code is:\n\n${verificationCode}\n\nPlease enter this code to verify your account. In terms of POPIA, your personal and technical registration data is securely protected.\n\nRegards,\nAudrin Fire Engineers Recruitment Team`,
      type: 'email_verification'
    });

    this.logAudit('TECHNICIAN_REGISTERED', 'TechnicianAccount', newTechnician.id, `Candidate ${newTechnician.fullName} registered account. Verification code dispatched.`);
    this.saveToStorage();

    return {
      success: true,
      message: 'Account created! Please enter the 6-digit verification code sent to your email.',
      technicianId: newTechnician.id,
      verificationCode
    };
  }

  public verifyTechnicianEmail(technicianId: string, code: string): { success: boolean; message: string } {
    const tech = this.technicians.find(t => t.id === technicianId);
    if (!tech) {
      return { success: false, message: 'Technician account not found.' };
    }

    if (tech.isEmailVerified) {
      this.activeTechnicianId = tech.id;
      this.saveToStorage();
      return { success: true, message: 'Email is already verified.' };
    }

    if (tech.emailVerificationCode !== code.trim()) {
      return { success: false, message: 'Invalid verification code. Please check your email or request a new code.' };
    }

    tech.isEmailVerified = true;
    tech.emailVerifiedAt = new Date().toISOString();
    tech.emailVerificationCode = undefined;
    tech.updatedAt = new Date().toISOString();
    this.activeTechnicianId = tech.id;

    this.logAudit('TECHNICIAN_EMAIL_VERIFIED', 'TechnicianAccount', tech.id, `Email verified for candidate ${tech.fullName} (${tech.email}).`);
    this.saveToStorage();

    return { success: true, message: 'Email verified successfully! You may now complete your profile and apply for vacancies.' };
  }

  public resendTechnicianVerificationCode(technicianId: string): { success: boolean; code: string; message: string } {
    const tech = this.technicians.find(t => t.id === technicianId);
    if (!tech) {
      return { success: false, code: '', message: 'Technician account not found.' };
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    tech.emailVerificationCode = newCode;
    tech.emailVerificationSentAt = new Date().toISOString();
    tech.updatedAt = new Date().toISOString();

    this.sendCareerEmail({
      recipientEmail: tech.email,
      recipientName: tech.fullName,
      subject: 'New Verification Code – Audrin Fire Engineers Careers Portal',
      body: `Dear ${tech.fullName},\n\nYour new 6-digit verification code is:\n\n${newCode}\n\nRegards,\nAudrin Fire Engineers Recruitment Team`,
      type: 'email_verification'
    });

    this.logAudit('VERIFICATION_CODE_RESENT', 'TechnicianAccount', tech.id, `Resent email verification code to ${tech.email}.`);
    this.saveToStorage();

    return { success: true, code: newCode, message: `New verification code sent to ${tech.email}` };
  }

  public loginTechnician(email: string, password: string): { success: boolean; message: string; technician?: TechnicianAccount } {
    const normalizedEmail = email.trim().toLowerCase();
    const tech = this.technicians.find(t => t.email.toLowerCase() === normalizedEmail);
    if (!tech) {
      return { success: false, message: 'No account found with this email. Please register first.' };
    }

    if (!tech.isEmailVerified) {
      return {
        success: false,
        message: 'Your email address is not verified yet. Please enter your verification code before logging in.',
        technician: tech
      };
    }

    // In local demo environment, verify user
    this.activeTechnicianId = tech.id;
    this.logAudit('TECHNICIAN_LOGGED_IN', 'TechnicianAccount', tech.id, `Technician ${tech.fullName} logged in.`);
    this.saveToStorage();

    return { success: true, message: 'Login successful.', technician: tech };
  }

  public logoutTechnician(): void {
    const currentId = this.activeTechnicianId;
    this.activeTechnicianId = null;
    if (currentId) {
      this.logAudit('TECHNICIAN_LOGGED_OUT', 'TechnicianAccount', currentId, 'Technician logged out.');
    }
    this.saveToStorage();
  }

  public updateTechnicianProfile(technicianId: string, updates: Partial<TechnicianAccount>): void {
    const tech = this.technicians.find(t => t.id === technicianId);
    if (tech) {
      Object.assign(tech, updates, { updatedAt: new Date().toISOString() });
      this.logAudit('TECHNICIAN_PROFILE_UPDATED', 'TechnicianAccount', technicianId, `Updated profile and qualifications for ${tech.fullName}.`);
      this.saveToStorage();
    }
  }

  public uploadTechnicianDocument(
    technicianId: string,
    doc: Omit<DocumentUploadRecord, 'id' | 'uploadedAt' | 'contentHashSha256'>
  ): DocumentUploadRecord {
    const tech = this.technicians.find(t => t.id === technicianId);
    const newDoc: DocumentUploadRecord = {
      ...doc,
      id: `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      uploadedAt: new Date().toISOString(),
      contentHashSha256: `sha256-${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 10)}`,
      malwareScanStatus: 'clean',
      downloadUrl: '#'
    };

    if (tech) {
      tech.documents.push(newDoc);
      tech.updatedAt = new Date().toISOString();
      this.logAudit('DOCUMENT_UPLOADED', 'DocumentUploadRecord', newDoc.id, `Uploaded ${newDoc.name} (${newDoc.type}) for candidate ${tech.fullName}.`);
      this.saveToStorage();
    }
    return newDoc;
  }

  public deleteTechnicianDocument(technicianId: string, docId: string): void {
    const tech = this.technicians.find(t => t.id === technicianId);
    if (tech) {
      tech.documents = tech.documents.filter(d => d.id !== docId);
      tech.updatedAt = new Date().toISOString();
      this.logAudit('DOCUMENT_DELETED', 'DocumentUploadRecord', docId, `Deleted document ${docId} for ${tech.fullName}.`);
      this.saveToStorage();
    }
  }

  // --- Job Applications ---

  public getApplications(): TechnicianJobApplication[] {
    return this.applications;
  }

  public getApplicationById(id: string): TechnicianJobApplication | undefined {
    return this.applications.find(a => a.id === id || a.referenceNumber === id);
  }

  public getApplicationsByApplicant(applicantId: string): TechnicianJobApplication[] {
    return this.applications.filter(a => a.applicantId === applicantId);
  }

  public getApplicationsByVacancy(vacancyId: string): TechnicianJobApplication[] {
    return this.applications.filter(a => a.vacancyId === vacancyId);
  }

  public hasTechnicianApplied(applicantId: string, vacancyId: string): boolean {
    return this.applications.some(a => a.applicantId === applicantId && a.vacancyId === vacancyId);
  }

  public submitJobApplication(data: {
    vacancyId: string;
    applicantId: string;
    answers: { questionId: string; questionText: string; answer: string }[];
    additionalDocuments?: DocumentUploadRecord[];
    accuracyConfirmed: boolean;
  }): { success: boolean; message: string; application?: TechnicianJobApplication } {
    const vacancy = this.vacancies.find(v => v.id === data.vacancyId);
    if (!vacancy) {
      return { success: false, message: 'Vacancy not found or has been removed.' };
    }

    if (vacancy.isClosed) {
      return { success: false, message: 'This vacancy is currently closed to new applications.' };
    }

    const technician = this.technicians.find(t => t.id === data.applicantId);
    if (!technician) {
      return { success: false, message: 'Technician account not found. Please log in.' };
    }

    if (!technician.isEmailVerified) {
      return { success: false, message: 'You must verify your email address before submitting job applications.' };
    }

    if (this.hasTechnicianApplied(data.applicantId, data.vacancyId)) {
      return { success: false, message: 'You have already submitted an application for this vacancy.' };
    }

    if (!data.accuracyConfirmed) {
      return { success: false, message: 'You must confirm the declaration of accuracy and POPIA compliance.' };
    }

    // Generate unique application reference
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `APP-2026-${randomSuffix}`;
    const timestamp = new Date().toISOString();

    const cvDoc = technician.documents.find(d => d.type === 'cv');
    const saqccDoc = technician.documents.find(d => d.type === 'saqcc_certificate');

    const newApplication: TechnicianJobApplication = {
      id: `app-${Date.now()}`,
      referenceNumber,
      vacancyId: vacancy.id,
      vacancyRef: vacancy.referenceNumber,
      jobTitle: vacancy.jobTitle,
      applicantId: technician.id,
      applicantName: technician.fullName,
      applicantEmail: technician.email,
      applicantPhone: technician.cellphone,
      submittedAt: timestamp,
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          timestamp,
          changedBy: technician.fullName,
          notes: 'Application submitted via candidate portal.'
        }
      ],
      profileSnapshot: {
        residentialAddress: technician.residentialAddress || 'Not specified',
        province: technician.province,
        saqccNumber: technician.saqccNumber || 'Not provided',
        saqccExpiryDate: technician.saqccExpiryDate || '',
        saqccCategories: [...technician.saqccCategories],
        yearsOfExperience: technician.yearsOfExperience || 0,
        driverLicense: technician.driverLicense,
        availability: technician.availability,
        preferredLocations: [...technician.preferredLocations],
        sans10139ExperienceSummary: technician.sans10139ExperienceSummary,
        documentsCount: technician.documents.length,
        cvDocumentId: cvDoc?.id,
        saqccDocumentId: saqccDoc?.id
      },
      answers: data.answers,
      additionalDocuments: data.additionalDocuments || [],
      internalNotes: [],
      accuracyDeclarationConfirmed: true,
      receiptHashSha256: `sha256-${Math.random().toString(36).substring(2, 14)}-${referenceNumber}`
    };

    this.applications.unshift(newApplication);

    // 1. Send confirmation email to candidate
    this.sendCareerEmail({
      recipientEmail: technician.email,
      recipientName: technician.fullName,
      subject: `Application Received – ${vacancy.jobTitle} (${vacancy.referenceNumber})`,
      body: `Dear ${technician.fullName},\n\nThank you for applying for the position of ${vacancy.jobTitle} at Audrin Fire Engineers. Your application was successfully received on ${new Date(timestamp).toLocaleString('en-ZA')}.\n\nApplication reference: ${referenceNumber}\n\nWe will review your SAQCC qualifications, SANS 10139 experience, and supporting documentation. You can log in to your account at any time to monitor the application status.\n\nRegards,\nAudrin Fire Engineers Recruitment Team`,
      type: 'application_confirmation',
      applicationRef: referenceNumber
    });

    // 2. Send notification email to recruitment admins
    this.sendCareerEmail({
      recipientEmail: 'careers@audrinfire.co.za',
      recipientName: 'Audrin Recruitment Administrator',
      subject: `New Application: ${technician.fullName} – ${vacancy.jobTitle} (${vacancy.referenceNumber})`,
      body: `Notification: A new technician application has been submitted.\n\nCandidate: ${technician.fullName}\nRole: ${vacancy.jobTitle}\nVacancy Reference: ${vacancy.referenceNumber}\nApplication Reference: ${referenceNumber}\nSAQCC Number: ${technician.saqccNumber || 'Not specified'}\nExperience: ${technician.yearsOfExperience} Years\n\nAccess the Recruitment Admin Dashboard to review documents and update candidate status.`,
      type: 'admin_notification',
      applicationRef: referenceNumber
    });

    this.logAudit('APPLICATION_SUBMITTED', 'TechnicianJobApplication', newApplication.id, `Application ${referenceNumber} submitted by ${technician.fullName} for ${vacancy.jobTitle}.`);
    this.saveToStorage();

    return {
      success: true,
      message: `Application submitted successfully! Reference: ${referenceNumber}`,
      application: newApplication
    };
  }

  public updateApplicationStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    notes?: string,
    changedBy: string = 'Recruitment Team'
  ): void {
    const app = this.applications.find(a => a.id === applicationId);
    if (!app) return;

    app.status = newStatus;
    app.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      changedBy,
      notes: notes || undefined
    });

    // If status changed to Unsuccessful or Shortlisted, send status email
    this.sendCareerEmail({
      recipientEmail: app.applicantEmail,
      recipientName: app.applicantName,
      subject: `Status Update: Application ${app.referenceNumber} – ${app.jobTitle}`,
      body: `Dear ${app.applicantName},\n\nThe status of your application for ${app.jobTitle} (${app.vacancyRef}) has been updated to: ${newStatus.toUpperCase()}.${notes ? `\n\nNotes from Recruitment Committee:\n${notes}` : ''}\n\nLog in to your candidate dashboard for full details.\n\nRegards,\nAudrin Fire Engineers Recruitment Team`,
      type: 'status_update',
      applicationRef: app.referenceNumber
    });

    this.logAudit('APPLICATION_STATUS_CHANGED', 'TechnicianJobApplication', applicationId, `Status changed to ${newStatus} for application ${app.referenceNumber}.`);
    this.saveToStorage();
  }

  public addApplicationInternalNote(applicationId: string, text: string, author: string = 'Recruitment Reviewer'): void {
    const app = this.applications.find(a => a.id === applicationId);
    if (app && text.trim()) {
      app.internalNotes.push({
        id: `note-${Date.now()}`,
        author,
        createdAt: new Date().toISOString(),
        text: text.trim()
      });
      this.logAudit('INTERNAL_NOTE_ADDED', 'TechnicianJobApplication', applicationId, `Internal note added by ${author} for application ${app.referenceNumber}.`);
      this.saveToStorage();
    }
  }

  public scheduleInterview(
    applicationId: string,
    details: InterviewDetails,
    sendEmailInvitation: boolean = true
  ): void {
    const app = this.applications.find(a => a.id === applicationId);
    if (!app) return;

    app.interviewDetails = details;
    app.status = 'Interview Scheduled';
    app.statusHistory.push({
      status: 'Interview Scheduled',
      timestamp: new Date().toISOString(),
      changedBy: 'Recruitment Committee',
      notes: `Interview scheduled for ${new Date(details.scheduledDateTime).toLocaleString('en-ZA')} (${details.interviewType.replace('_', ' ')}).`
    });

    if (sendEmailInvitation) {
      this.sendCareerEmail({
        recipientEmail: app.applicantEmail,
        recipientName: app.applicantName,
        subject: `Interview Invitation – ${app.jobTitle} (${app.referenceNumber})`,
        body: `Dear ${app.applicantName},\n\nWe are pleased to invite you for an interview regarding your application for ${app.jobTitle}.\n\nDate & Time: ${new Date(details.scheduledDateTime).toLocaleString('en-ZA')}\nFormat/Location: ${details.locationOrMeetingUrl}\nInterview Panel: ${details.interviewers.join(', ')}\n\nInstructions:\n${details.instructions}\n\nPlease reply or log in to confirm your attendance.\n\nRegards,\nAudrin Fire Engineers Recruitment Team`,
        type: 'interview_invitation',
        applicationRef: app.referenceNumber
      });
    }

    this.logAudit('INTERVIEW_SCHEDULED', 'TechnicianJobApplication', applicationId, `Interview scheduled for application ${app.referenceNumber} on ${details.scheduledDateTime}.`);
    this.saveToStorage();
  }

  public reopenApplication(applicationId: string, reason?: string): void {
    const app = this.applications.find(a => a.id === applicationId);
    if (app) {
      app.reopenedByAdmin = true;
      app.status = 'Under Review';
      app.statusHistory.push({
        status: 'Under Review',
        timestamp: new Date().toISOString(),
        changedBy: 'Admin (Reopened)',
        notes: reason || 'Application reopened for secondary compliance review.'
      });
      this.logAudit('APPLICATION_REOPENED', 'TechnicianJobApplication', applicationId, `Application ${app.referenceNumber} reopened by admin.`);
      this.saveToStorage();
    }
  }

  // --- Vacancy Management ---

  public addVacancy(data: Omit<VacancyRecord, 'id' | 'createdAt' | 'updatedAt'>): VacancyRecord {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newVacancy: VacancyRecord = {
      ...data,
      id: `vac-${Date.now()}`,
      referenceNumber: data.referenceNumber || `AFE-VAC-2026-${randomNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.vacancies.unshift(newVacancy);
    this.logAudit('VACANCY_CREATED', 'VacancyRecord', newVacancy.id, `Created vacancy: ${newVacancy.jobTitle} (${newVacancy.referenceNumber})`);
    this.saveToStorage();
    return newVacancy;
  }

  public updateVacancy(id: string, updates: Partial<VacancyRecord>): VacancyRecord | undefined {
    const vacancy = this.vacancies.find(v => v.id === id);
    if (!vacancy) return undefined;
    Object.assign(vacancy, updates, { updatedAt: new Date().toISOString() });
    this.logAudit('VACANCY_UPDATED', 'VacancyRecord', id, `Updated vacancy ${vacancy.referenceNumber}`);
    this.saveToStorage();
    return vacancy;
  }

  public toggleVacancyClosed(id: string): boolean {
    const vacancy = this.vacancies.find(v => v.id === id);
    if (!vacancy) return false;
    vacancy.isClosed = !vacancy.isClosed;
    vacancy.updatedAt = new Date().toISOString();
    this.logAudit('VACANCY_STATUS_TOGGLED', 'VacancyRecord', id, `Vacancy ${vacancy.referenceNumber} marked ${vacancy.isClosed ? 'CLOSED' : 'OPEN'}`);
    this.saveToStorage();
    return vacancy.isClosed;
  }

  public getJobApplications(): TechnicianJobApplication[] {
    return this.applications;
  }

  public getTechnicianApplications(applicantId?: string): TechnicianJobApplication[] {
    if (applicantId) {
      return this.applications.filter(a => a.applicantId === applicantId);
    }
    const currentTech = this.getActiveTechnician();
    if (currentTech) {
      return this.applications.filter(a => a.applicantId === currentTech.id);
    }
    return this.applications;
  }

  public getSentEmails(): EmailDispatchLog[] {
    return this.careerEmailLogs;
  }

  public addApplicationNote(applicationId: string, text: string, author: string = 'Recruitment Reviewer'): void {
    this.addApplicationInternalNote(applicationId, text, author);
  }

  public scheduleApplicationInterview(
    applicationId: string,
    details: InterviewDetails,
    sendEmailInvitation: boolean = true
  ): void {
    this.scheduleInterview(applicationId, details, sendEmailInvitation);
  }

  public getRecruitmentStats() {
    const certifiedCount = this.technicians.filter(t => t.saqccCategories && t.saqccCategories.length > 0).length;
    return {
      totalVacancies: this.vacancies.length,
      activeVacancies: this.vacancies.filter(v => v.isPublished && !v.isClosed).length,
      totalApplications: this.applications.length,
      totalApplicants: this.applications.length,
      saqccCertifiedPercent: this.technicians.length > 0 ? Math.round((certifiedCount / this.technicians.length) * 100) : 100,
      underReview: this.applications.filter(a => a.status === 'Under Review' || a.status === 'Submitted').length,
      shortlisted: this.applications.filter(a => a.status === 'Shortlisted').length,
      interviews: this.applications.filter(a => a.status === 'Interview Scheduled').length,
      interviewsScheduled: this.applications.filter(a => a.status === 'Interview Scheduled').length,
      successful: this.applications.filter(a => a.status === 'Successful').length,
      registeredTechnicians: this.technicians.length,
      verifiedTechnicians: this.technicians.filter(t => t.isEmailVerified).length
    };
  }

  // --- Email Notifications & Logs ---

  public getCareerEmailLogs(): EmailDispatchLog[] {
    return this.careerEmailLogs;
  }

  public sendCareerEmail(log: Omit<EmailDispatchLog, 'id' | 'sentAt' | 'deliveryStatus'>): EmailDispatchLog {
    const newLog: EmailDispatchLog = {
      ...log,
      id: `em-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sentAt: new Date().toISOString(),
      deliveryStatus: 'delivered'
    };
    this.careerEmailLogs.unshift(newLog);
    if (this.careerEmailLogs.length > 300) this.careerEmailLogs.pop();
    this.saveToStorage();
    return newLog;
  }

  // --- POPIA Compliance & Export ---

  public popiaAnonymizeCandidate(applicantId: string, reason: string = 'Candidate requested POPIA data erasure'): void {
    const tech = this.technicians.find(t => t.id === applicantId);
    if (tech) {
      tech.fullName = '[ANONYMIZED CANDIDATE]';
      tech.email = `anonymized_${applicantId}@popia-erased.afe.internal`;
      tech.cellphone = '[ERASED]';
      tech.residentialAddress = '[ERASED]';
      tech.postalCode = '';
      tech.saqccNumber = '[ERASED]';
      tech.sans10139ExperienceSummary = '[ERASED]';
      tech.qualifications = [];
      tech.documents = [];
      tech.updatedAt = new Date().toISOString();
    }

    // Anonymize in applications
    this.applications.forEach(a => {
      if (a.applicantId === applicantId) {
        a.applicantName = '[ANONYMIZED CANDIDATE]';
        a.applicantEmail = `anonymized_${applicantId}@popia-erased.afe.internal`;
        a.applicantPhone = '[ERASED]';
        a.profileSnapshot.residentialAddress = '[ERASED]';
        a.profileSnapshot.saqccNumber = '[ERASED]';
        a.profileSnapshot.sans10139ExperienceSummary = '[ERASED]';
        a.additionalDocuments = [];
      }
    });

    this.logAudit('POPIA_CANDIDATE_ANONYMIZED', 'TechnicianAccount', applicantId, `POPIA data erasure executed for candidate ID ${applicantId}. Reason: ${reason}`);
    this.saveToStorage();
  }

  public exportApplicationsData(format: 'csv' | 'json', filterVacancyId?: string): string {
    const list = filterVacancyId
      ? this.applications.filter(a => a.vacancyId === filterVacancyId)
      : this.applications;

    if (format === 'json') {
      return JSON.stringify(list, null, 2);
    }

    // CSV format
    const headers = [
      'Application Reference',
      'Vacancy Reference',
      'Job Title',
      'Candidate Name',
      'Email',
      'Cellphone',
      'Province',
      'SAQCC Number',
      'SAQCC Expiry',
      'SAQCC Categories',
      'Years Experience',
      'Driver License',
      'Status',
      'Submitted At'
    ];

    const rows = list.map(a => [
      `"${a.referenceNumber}"`,
      `"${a.vacancyRef}"`,
      `"${a.jobTitle}"`,
      `"${a.applicantName}"`,
      `"${a.applicantEmail}"`,
      `"${a.applicantPhone}"`,
      `"${a.profileSnapshot.province}"`,
      `"${a.profileSnapshot.saqccNumber}"`,
      `"${a.profileSnapshot.saqccExpiryDate}"`,
      `"${a.profileSnapshot.saqccCategories.join('; ')}"`,
      a.profileSnapshot.yearsOfExperience,
      `"${a.profileSnapshot.driverLicense}"`,
      `"${a.status}"`,
      `"${a.submittedAt}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  public logAudit(action: string, recordType: string, recordId: string, details: string) {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor: `${this.user.name} (${this.user.role})`,
      actorRole: this.user.role,
      action,
      recordType,
      recordId,
      ipAddress: '105.184.22.14 (South Africa)',
      details
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 200) this.auditLogs.pop();
  }

  // ==========================================
  // SAFETY FILE & IMMUTABLE COMPLIANCE AUDIT
  // SANS 10139:2021 & SANS 10400-T Mandates
  // ==========================================

  public getSafetyFileDossiers(): SafetyFileDossier[] {
    // If customer role, apply project-level isolation
    if (this.user.role === 'customer') {
      return this.safetyFileDossiers.filter(d => 
        d.clientId === this.user.companyName || 
        d.clientName.toLowerCase().includes(this.user.companyName?.toLowerCase() || '') ||
        d.projectContacts.some(c => c.email.toLowerCase() === this.user.email.toLowerCase())
      );
    }
    return this.safetyFileDossiers;
  }

  public getSafetyFileDossierById(id: string): SafetyFileDossier | undefined {
    return this.safetyFileDossiers.find(d => d.id === id);
  }

  public saveSafetyFileDossier(dossier: SafetyFileDossier, auditDescription?: string): void {
    const idx = this.safetyFileDossiers.findIndex(d => d.id === dossier.id);
    const existing = idx >= 0 ? this.safetyFileDossiers[idx] : null;

    if (idx >= 0) {
      this.safetyFileDossiers[idx] = { 
        ...dossier, 
        updatedAt: new Date().toISOString(),
        updatedBy: `${this.user.name} (${this.user.role})`
      };
    } else {
      this.safetyFileDossiers.unshift(dossier);
    }

    // Recalculate compliance and gate commissioner approvals
    this.recalculateDossierCompliance(dossier.id);

    // Audit trail logging
    this.logComplianceAudit({
      projectId: dossier.id,
      projectName: dossier.projectName,
      clientId: dossier.clientId,
      clientName: dossier.clientName,
      dossierId: dossier.id,
      eventType: existing ? 'status_change' : 'document_creation',
      eventDescription: auditDescription || `Safety File dossier ${dossier.dossierNumber} updated (v${dossier.version} ${dossier.revision}).`,
      userEmail: this.user.email,
      userName: this.user.name,
      userRole: this.user.role,
      previousValue: existing ? `Status: ${existing.status}, Score: ${existing.overallComplianceScore}%` : undefined,
      newValue: `Status: ${dossier.status}, Score: ${dossier.overallComplianceScore}%`,
      ipAddress: '105.187.112.55',
      deviceMetadata: 'Desktop Browser (Session Verified)',
      standardsReference: 'SANS 10139:2021 Clause 13.2',
      popiaCategory: 'statutory_record'
    });

    this.saveToStorage();
  }

  public signSafetyFileApproval(
    dossierId: string, 
    roleId: string, 
    approvalData: Partial<SafetyFileApprovalEntry>
  ): void {
    const dossier = this.getSafetyFileDossierById(dossierId);
    if (!dossier) return;

    const matrixIdx = dossier.approvalMatrix.findIndex(a => a.roleId === roleId);
    if (matrixIdx === -1) return;

    const previousEntry = dossier.approvalMatrix[matrixIdx];
    const nowIso = new Date().toISOString();
    const todayDate = nowIso.split('T')[0];

    const updatedEntry: SafetyFileApprovalEntry = {
      ...previousEntry,
      ...approvalData,
      signedDate: approvalData.signedDate || todayDate,
      signedTimestamp: nowIso,
      verificationStatus: approvalData.verificationStatus || 'verified',
      ipAddress: '105.187.112.55'
    };

    dossier.approvalMatrix[matrixIdx] = updatedEntry;

    // Check if this was the Commissioner
    if (roleId === 'commissioner') {
      dossier.isCommissionerApproved = updatedEntry.verificationStatus === 'verified';
    }

    this.recalculateDossierCompliance(dossierId);

    // Audit log
    this.logComplianceAudit({
      projectId: dossier.id,
      projectName: dossier.projectName,
      clientId: dossier.clientId,
      clientName: dossier.clientName,
      dossierId: dossier.id,
      eventType: 'signature_verified',
      eventDescription: `Formal approval sign-off executed by ${updatedEntry.personName} (${updatedEntry.roleTitle}). Registration: ${updatedEntry.registrationNumber || 'N/A'}.`,
      userEmail: this.user.email,
      userName: this.user.name,
      userRole: this.user.role,
      previousValue: `Status: ${previousEntry.verificationStatus} (Signer: ${previousEntry.personName || 'Unassigned'})`,
      newValue: `Status: ${updatedEntry.verificationStatus} (Signer: ${updatedEntry.personName}, Reg: ${updatedEntry.registrationNumber || 'N/A'})`,
      ipAddress: '105.187.112.55',
      deviceMetadata: 'Interactive Signature Canvas (Verified Biometric Track)',
      standardsReference: roleId === 'commissioner' ? 'SANS 10139:2021 Clause 13.2 / SAQCC Mandate' : 'OHS Act Construction Reg 7(1)(b)',
      popiaCategory: 'statutory_record'
    });

    this.saveToStorage();
  }

  public uploadSafetyFileDocument(dossierId: string, docData: Partial<SafetyFileDocument>): void {
    const dossier = this.getSafetyFileDossierById(dossierId);
    if (!dossier) return;

    const docId = docData.id || `sfd-${Date.now()}`;
    const newDoc: SafetyFileDocument = {
      id: docId,
      fileNumber: docData.fileNumber || `SFD-${String(dossier.documents.length + 1).padStart(2, '0')}-GEN`,
      title: docData.title || 'Supporting Evidence Document',
      category: docData.category || 'statutory_certificate',
      applicableStandard: docData.applicableStandard || 'SANS 10139',
      clauseReference: docData.clauseReference || 'SANS 10139:2021 Clause 13.1',
      status: docData.status || 'draft',
      version: docData.version || 1,
      revision: docData.revision || 'Rev 00',
      issueDate: docData.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: docData.expiryDate,
      uploadedAt: new Date().toISOString(),
      uploadedBy: `${this.user.name} (${this.user.role})`,
      fileSizeBytes: docData.fileSizeBytes || 1024000,
      fileName: docData.fileName || 'evidence_document.pdf',
      checksumSha256: docData.checksumSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      downloadUrl: docData.downloadUrl || '#',
      isMandatoryForHandover: docData.isMandatoryForHandover ?? true,
      notes: docData.notes
    };

    dossier.documents.push(newDoc);
    this.recalculateDossierCompliance(dossierId);

    // Audit log
    this.logComplianceAudit({
      projectId: dossier.id,
      projectName: dossier.projectName,
      clientId: dossier.clientId,
      clientName: dossier.clientName,
      dossierId: dossier.id,
      documentId: newDoc.id,
      documentTitle: newDoc.title,
      documentVersion: `v${newDoc.version} (${newDoc.revision})`,
      eventType: 'document_upload',
      eventDescription: `Uploaded safety-file document: ${newDoc.title} (${newDoc.fileName}). Checksum SHA-256 verified.`,
      userEmail: this.user.email,
      userName: this.user.name,
      userRole: this.user.role,
      newValue: `File: ${newDoc.fileName}, Size: ${(newDoc.fileSizeBytes / 1024 / 1024).toFixed(2)} MB, SHA: ${newDoc.checksumSha256.substring(0, 16)}...`,
      ipAddress: '105.187.112.55',
      deviceMetadata: 'Web Client File Transfer Agent',
      fileChecksumSha256: newDoc.checksumSha256,
      standardsReference: newDoc.clauseReference,
      popiaCategory: 'system_metadata'
    });

    this.saveToStorage();
  }

  public updateSafetyFileDocumentStatus(
    dossierId: string, 
    docId: string, 
    newStatus: SafetyFileDocStatus, 
    reason?: string
  ): void {
    const dossier = this.getSafetyFileDossierById(dossierId);
    if (!dossier) return;

    const doc = dossier.documents.find(d => d.id === docId);
    if (!doc) return;

    const oldStatus = doc.status;
    doc.status = newStatus;
    if (reason) doc.notes = (doc.notes ? doc.notes + ' | ' : '') + reason;

    this.recalculateDossierCompliance(dossierId);

    // Audit log
    this.logComplianceAudit({
      projectId: dossier.id,
      projectName: dossier.projectName,
      clientId: dossier.clientId,
      clientName: dossier.clientName,
      dossierId: dossier.id,
      documentId: doc.id,
      documentTitle: doc.title,
      documentVersion: `v${doc.version} (${doc.revision})`,
      eventType: newStatus === 'approved' ? 'approval_granted' : newStatus === 'rejected' ? 'approval_rejected' : 'status_change',
      eventDescription: `Document status changed from ${oldStatus} to ${newStatus}.${reason ? ` Reason: ${reason}` : ''}`,
      userEmail: this.user.email,
      userName: this.user.name,
      userRole: this.user.role,
      previousValue: `Status: ${oldStatus}`,
      newValue: `Status: ${newStatus}`,
      ipAddress: '105.187.112.55',
      deviceMetadata: 'Desktop Browser (Session Verified)',
      fileChecksumSha256: doc.checksumSha256,
      standardsReference: doc.clauseReference,
      popiaCategory: 'statutory_record'
    });

    this.saveToStorage();
  }

  public recalculateDossierCompliance(dossierId: string): void {
    const dossier = this.getSafetyFileDossierById(dossierId);
    if (!dossier) return;

    // Check SANS 10139 items
    const sans10139Docs = dossier.documents.filter(d => d.applicableStandard === 'SANS 10139');
    const sans10139ApprovedDocs = sans10139Docs.filter(d => d.status === 'approved');
    const sans10139Milestones = dossier.milestones.filter(m => m.standard === 'SANS 10139');
    const sans10139CompletedMilestones = sans10139Milestones.filter(m => m.status === 'completed');

    const totalSans10139Points = (sans10139Docs.length * 10) + (sans10139Milestones.length * 10);
    const earnedSans10139Points = (sans10139ApprovedDocs.length * 10) + (sans10139CompletedMilestones.length * 10);
    dossier.sans10139ComplianceScore = totalSans10139Points > 0 
      ? Math.round((earnedSans10139Points / totalSans10139Points) * 100) 
      : 100;

    // Check SANS 10400-T items
    const sans10400TDocs = dossier.documents.filter(d => d.applicableStandard === 'SANS 10400-T');
    const sans10400TApprovedDocs = sans10400TDocs.filter(d => d.status === 'approved');
    const sans10400TMilestones = dossier.milestones.filter(m => m.standard === 'SANS 10400-T');
    const sans10400TCompletedMilestones = sans10400TMilestones.filter(m => m.status === 'completed');

    const totalSans10400TPoints = (sans10400TDocs.length * 10) + (sans10400TMilestones.length * 10);
    const earnedSans10400TPoints = (sans10400TApprovedDocs.length * 10) + (sans10400TCompletedMilestones.length * 10);
    dossier.sans10400TComplianceScore = totalSans10400TPoints > 0 
      ? Math.round((earnedSans10400TPoints / totalSans10400TPoints) * 100) 
      : 100;

    // Total documents & milestones overall
    const totalDocs = dossier.documents.length;
    const approvedDocs = dossier.documents.filter(d => d.status === 'approved').length;
    const totalMilestones = dossier.milestones.length;
    const completedMilestones = dossier.milestones.filter(m => m.status === 'completed').length;
    
    // Overall calculation
    const overallScore = Math.round(
      ((approvedDocs + completedMilestones) / ((totalDocs || 1) + (totalMilestones || 1))) * 100
    );
    dossier.overallComplianceScore = Math.min(overallScore, 100);

    // CRITICAL STATUTORY RULE:
    // "Do not describe a file as 'compliant' solely because it is complete.
    // Commissioner approval must be required before the system marks a dossier as approved."
    const commissionerApproval = dossier.approvalMatrix.find(a => a.roleId === 'commissioner');
    const isCommissionerVerified = commissionerApproval?.verificationStatus === 'verified';
    dossier.isCommissionerApproved = isCommissionerVerified;

    const allApprovalsVerified = dossier.approvalMatrix.every(a => a.verificationStatus === 'verified');
    const hasRejectedDoc = dossier.documents.some(d => d.status === 'rejected');
    const hasExpiredDoc = dossier.documents.some(d => d.status === 'expired');

    if (hasRejectedDoc) {
      dossier.status = 'rejected';
    } else if (allApprovalsVerified && isCommissionerVerified && !hasExpiredDoc && dossier.overallComplianceScore >= 90) {
      dossier.status = 'approved';
    } else {
      // Even if 100% complete, without commissioner verification it remains awaiting_approval!
      dossier.status = 'awaiting_approval';
    }

    dossier.updatedAt = new Date().toISOString();
  }

  public updateMilestoneStatus(
    dossierId: string, 
    milestoneId: string, 
    newStatus: 'completed' | 'in_progress' | 'overdue' | 'pending', 
    notes?: string
  ): void {
    const dossier = this.getSafetyFileDossierById(dossierId);
    if (!dossier) return;
    const ms = dossier.milestones.find(m => m.id === milestoneId);
    if (!ms) return;
    ms.status = newStatus;
    if (newStatus === 'completed') {
      ms.completionDate = new Date().toISOString().split('T')[0];
      ms.isOverdue = false;
    }
    if (notes) {
      ms.notes = notes;
    }
    this.recalculateDossierCompliance(dossierId);
    this.logComplianceAudit({
      projectId: dossier.id,
      projectName: dossier.projectName,
      clientId: dossier.clientId,
      clientName: dossier.clientName,
      dossierId: dossier.id,
      eventType: 'milestone_updated',
      eventDescription: `Statutory milestone "${ms.title}" (${ms.clauseReference}) updated to ${newStatus}. Notes: ${notes || 'Updated via Staff Engineering Console'}.`,
      userEmail: this.user.email,
      userName: this.user.name,
      userRole: this.user.role,
      newValue: `Status: ${newStatus}`,
      ipAddress: '105.187.112.55',
      deviceMetadata: 'Desktop Browser (Session Verified)',
      standardsReference: ms.clauseReference,
      popiaCategory: 'statutory_record'
    });
    this.saveToStorage();
  }

  // ==========================================
  // APPEND-ONLY IMMUTABLE COMPLIANCE AUDIT LOG
  // POPIA Act 4 of 2013 & SANS 10139 Statutory Evidence
  // Ordinary users CANNOT edit or delete records
  // ==========================================

  /**
   * Check if current user has statutory authorization to export the full compliance history per project.
   * Under SANS 10139 Clause 13 & POPIA statutory evidence rules, full project extraction requires
   * registered SAQCC Commissioner, Super Admin, or Operations Admin clearance.
   */
  public isUserAuthorizedToExportProjectHistory(): boolean {
    return this.user.role === 'super_admin' || this.user.role === 'ops_admin';
  }

  public getComplianceAuditLogs(filterProjectId?: string): ComplianceAuditRecord[] {
    let logs = [...this.complianceAuditRecords];

    // Project-level data isolation for customer role
    if (this.user.role === 'customer') {
      logs = logs.filter(l => 
        l.clientId === this.user.companyName || 
        l.clientName.toLowerCase().includes(this.user.companyName?.toLowerCase() || '') ||
        (filterProjectId && l.projectId === filterProjectId)
      );
    } else if (filterProjectId) {
      logs = logs.filter(l => l.projectId === filterProjectId);
    }

    return logs;
  }

  /**
   * Server-side pagination query for Compliance Audit Logs.
   * Enforces role-based data isolation, applies filters, performs server sorting,
   * calculates pagination offsets, and returns exact page window with server execution metadata.
   */
  public getComplianceAuditLogsServerPaginated(
    query: ComplianceAuditLogQuery = {}
  ): PaginatedComplianceAuditLogsResult {
    const startTime = performance.now();

    const page = Math.max(1, query.page || 1);
    const pageSize = Math.max(1, Math.min(100, query.pageSize || 10));
    const { projectId, eventType, searchQuery, sortBy = 'timestamp', sortOrder = 'desc' } = query;

    let logs = [...this.complianceAuditRecords];

    // RBAC & project-level data isolation
    if (this.user.role === 'customer') {
      logs = logs.filter(l => 
        l.clientId === this.user.companyName || 
        l.clientName.toLowerCase().includes(this.user.companyName?.toLowerCase() || '') ||
        (projectId && projectId !== 'all' && l.projectId === projectId)
      );
    } else if (projectId && projectId !== 'all') {
      logs = logs.filter(l => l.projectId === projectId);
    }

    // Event type filter
    if (eventType && eventType !== 'all') {
      logs = logs.filter(l => l.eventType === eventType);
    }

    // Search query filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      logs = logs.filter(l => {
        const matchesDesc = l.eventDescription.toLowerCase().includes(q);
        const matchesUser = l.userName.toLowerCase().includes(q) || l.userEmail.toLowerCase().includes(q);
        const matchesNumber = l.auditNumber.toLowerCase().includes(q);
        const matchesProject = l.projectName.toLowerCase().includes(q) || l.clientName.toLowerCase().includes(q);
        const matchesDoc = l.documentTitle?.toLowerCase().includes(q);
        const matchesHash = l.fileChecksumSha256?.toLowerCase().includes(q);
        const matchesStandards = l.standardsReference?.toLowerCase().includes(q);
        return matchesDesc || matchesUser || matchesNumber || matchesProject || matchesDoc || matchesHash || matchesStandards;
      });
    }

    const filteredCount = logs.length;

    // Server-side sorting
    logs.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'timestamp') {
        comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      } else if (sortBy === 'auditNumber') {
        comparison = a.auditNumber.localeCompare(b.auditNumber);
      } else if (sortBy === 'eventType') {
        comparison = a.eventType.localeCompare(b.eventType);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Pagination window
    const totalPages = Math.ceil(filteredCount / pageSize) || 1;
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const paginatedRecords = logs.slice(startIndex, startIndex + pageSize);

    const endTime = performance.now();
    const serverExecutionTimeMs = Math.round((endTime - startTime) * 100) / 100;

    return {
      records: paginatedRecords,
      totalRecords: this.complianceAuditRecords.length,
      filteredCount,
      totalPages,
      currentPage: safePage,
      pageSize,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1,
      serverExecutionTimeMs: Math.max(1, serverExecutionTimeMs),
      projectIdFilter: projectId
    };
  }

  /**
   * Export the full compliance audit history for a specific project.
   * Strictly enforces that ONLY authorised users (super_admin, ops_admin) can export the full history.
   * Bypasses pagination to return the complete statutory ledger for the project,
   * and automatically logs the export in the immutable audit trail.
   */
  public exportFullProjectAuditHistory(
    projectId: string
  ): ProjectHistoryExportResult {
    const isAuthorized = this.isUserAuthorizedToExportProjectHistory();
    const timestamp = new Date().toISOString();

    if (!isAuthorized) {
      return {
        authorized: false,
        records: [],
        projectName: '',
        projectId,
        totalRecords: 0,
        exportTimestamp: timestamp,
        authorizerName: this.user.name,
        authorizerRole: this.user.role,
        errorMessage: 'Statutory Clearance Denied: Full project compliance history export is legally restricted to accredited SAQCC Commissioners, Operations Admins, or Super Admins under SANS 10139 Clause 13.2 and POPIA Act 4 of 2013.'
      };
    }

    // Retrieve all records for this project without pagination limits
    let projectLogs = this.complianceAuditRecords.filter(l => 
      projectId === 'all' ? true : l.projectId === projectId
    );

    // Sort chronologically for full statutory archive
    projectLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Resolve project name
    const dossier = this.safetyFileDossiers.find(d => d.id === projectId);
    const projectName = projectId === 'all' 
      ? 'All Audrin Fire Engineering Projects (Consolidated Full Ledger)'
      : (dossier?.projectName || projectLogs[0]?.projectName || `Project ${projectId}`);

    // Automatically record an immutable audit event for this export action
    this.logComplianceAudit({
      projectId: projectId === 'all' ? 'all-projects' : projectId,
      projectName,
      clientId: dossier?.clientId || projectLogs[0]?.clientId || 'org-audrin',
      clientName: dossier?.clientName || projectLogs[0]?.clientName || 'Audrin Compliance Governance',
      dossierId: dossier?.id,
      eventType: 'dossier_download',
      eventDescription: `Statutory full project history exported (${projectLogs.length} audit records) into certified PDF ledger by ${this.user.name} (${this.user.role}).`,
      userEmail: this.user.email,
      userName: this.user.name,
      userRole: this.user.role,
      ipAddress: '105.187.112.55',
      deviceMetadata: 'Audrin Compliance Portal (Web Audit Engine)',
      standardsReference: 'SANS 10139:2021 Clause 13.2 & POPIA Act 4 of 2013',
      popiaCategory: 'statutory_record'
    });

    return {
      authorized: true,
      records: projectLogs,
      projectName,
      projectId,
      totalRecords: projectLogs.length,
      exportTimestamp: timestamp,
      authorizerName: this.user.name,
      authorizerRole: this.user.role
    };
  }

  public logComplianceAudit(
    recordData: Omit<ComplianceAuditRecord, 'id' | 'auditNumber' | 'timestamp' | 'isImmutable'>
  ): ComplianceAuditRecord {
    const nextNum = 1000 + this.complianceAuditRecords.length;
    const auditRecord: ComplianceAuditRecord = {
      ...recordData,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      auditNumber: `AUD-2026-${String(nextNum).padStart(5, '0')}`,
      timestamp: new Date().toISOString(),
      isImmutable: true
    };

    // Append-only: always unshift so newest is first, no splice/deletion exposed
    this.complianceAuditRecords.unshift(auditRecord);
    this.saveToStorage();
    return auditRecord;
  }
}

export function useAudrinStore() {
  const store = AudrinStore.getInstance();
  const [, setTick] = useState(0);

  useEffect(() => {
    return store.subscribe(() => setTick(t => t + 1));
  }, [store]);

  return store;
}
