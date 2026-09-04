export type StatutoryDocumentStatus = 'Draft' | 'Issued';

export type ComplianceDocumentType = 
  | 'SANS_10139_COC' 
  | 'CONDITION_REPORT' 
  | 'SAFETY_DOSSIER' 
  | 'AUDIT_REPORT'
  | 'COMMISSIONING_LOG';

export interface DatabaseDocumentRecord {
  id: string;
  documentNumber: string;
  title: string;
  documentType: ComplianceDocumentType;
  siteName: string;
  clientName: string;
  organisationName: string;
  status: StatutoryDocumentStatus;
  isSigned: boolean;
  revisionNumber?: string;
  issueDate?: string;
  commissionerName?: string;
  commissionerSaqccNumber?: string;
  systemCategory?: string;
  checksumSha256: string;
  updatedAt: string;
  createdAt: string;
  metadata?: Record<string, any>;
  rawRecord?: any;
}

export interface WatermarkOptions {
  status: 'Draft' | 'Issued' | 'DRAFT' | 'ISSUED';
  documentNumber?: string;
  documentType?: string;
  siteName?: string;
  organisationName?: string;
  commissionerName?: string;
  commissionerSaqccNumber?: string;
  checksum?: string;
  timestamp?: string;
  customNote?: string;
  applyDiagonalWatermark?: boolean;
  applyTopBanner?: boolean;
  applyBottomFooter?: boolean;
  applyCornerBadge?: boolean;
}

export interface WatermarkResult {
  success: boolean;
  documentId: string;
  documentNumber: string;
  status: StatutoryDocumentStatus;
  watermarkApplied: 'DRAFT' | 'ISSUED';
  pageCount: number;
  fileSizeBytes: number;
  sha256Checksum: string;
  processedAt: string;
  latencyMs: number;
  filename: string;
  pdfBase64?: string;
}

export interface BatchWatermarkSummary {
  batchId: string;
  totalDocuments: number;
  draftCount: number;
  issuedCount: number;
  processedAt: string;
  manifestHash: string;
  items: WatermarkResult[];
}
