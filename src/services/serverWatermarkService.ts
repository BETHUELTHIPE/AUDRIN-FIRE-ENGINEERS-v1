export type StatutoryStatus = 'Draft' | 'Issued';

export interface ServerDocument {
  id: string;
  documentNumber: string;
  title: string;
  documentType: 'SANS_10139_COC' | 'CONDITION_REPORT' | 'SAFETY_DOSSIER' | string;
  siteName: string;
  clientName: string;
  organisationName: string;
  status: StatutoryStatus;
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
}

export interface WatermarkApiResult {
  success: boolean;
  documentId: string;
  resolvedDatabaseStatus: StatutoryStatus;
  watermarkApplied: 'DRAFT' | 'ISSUED';
  result: {
    success: boolean;
    documentId: string;
    documentNumber: string;
    status: StatutoryStatus;
    watermarkApplied: 'DRAFT' | 'ISSUED';
    pageCount: number;
    fileSizeBytes: number;
    sha256Checksum: string;
    processedAt: string;
    latencyMs: number;
    filename: string;
  };
  renderUrl?: string;
  pdfBase64?: string;
}

export interface BatchWatermarkResponse {
  success: boolean;
  batchId: string;
  processedAt: string;
  totalDocuments: number;
  draftCount: number;
  issuedCount: number;
  manifestHash: string;
  documents: Array<{
    documentId: string;
    documentNumber: string;
    status: StatutoryStatus;
    watermarkApplied: 'DRAFT' | 'ISSUED';
    pageCount: number;
    fileSizeBytes: number;
    sha256Checksum: string;
    latencyMs: number;
    filename: string;
    downloadUrl: string;
  }>;
}

export class ServerWatermarkService {
  /**
   * Fetches all registered compliance documents and stats from the server database.
   */
  public static async getDocuments(): Promise<{
    success: boolean;
    stats: {
      total: number;
      issued: number;
      draft: number;
      cocs: number;
      reports: number;
      dossiers: number;
    };
    documents: ServerDocument[];
  }> {
    const res = await fetch('/api/documents');
    if (!res.ok) {
      throw new Error(`Failed to fetch documents: ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * Fetches single document by ID or documentNumber from the database.
   */
  public static async getDocument(id: string): Promise<ServerDocument> {
    const res = await fetch(`/api/documents/${encodeURIComponent(id)}`);
    if (!res.ok) {
      throw new Error(`Document ${id} not found: ${res.statusText}`);
    }
    const data = await res.json();
    return data.document;
  }

  /**
   * Updates document statutory status in the server database (Draft <-> Issued).
   */
  public static async updateStatus(
    id: string,
    status: StatutoryStatus,
    reason?: string
  ): Promise<{ success: boolean; document: ServerDocument; renderPdfUrl: string }> {
    const res = await fetch(`/api/documents/${encodeURIComponent(id)}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason, actor: 'Authorized Compliance Officer' })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to update status: ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * Generates a dynamic server-rendered watermarked PDF URL for direct viewing or downloading.
   */
  public static getRenderPdfUrl(documentId: string, overrideStatus?: StatutoryStatus): string {
    const base = `/api/pdf/render/${encodeURIComponent(documentId)}`;
    const params = new URLSearchParams();
    params.set('t', Date.now().toString());
    if (overrideStatus) {
      params.set('overrideStatus', overrideStatus);
    }
    return `${base}?${params.toString()}`;
  }

  /**
   * Calls the POST /api/pdf/watermark endpoint to dynamically overlay watermarks.
   */
  public static async requestWatermark(params: {
    documentId?: string;
    pdfBase64?: string;
    overrideStatus?: StatutoryStatus;
    customNote?: string;
  }): Promise<WatermarkApiResult> {
    const res = await fetch('/api/pdf/watermark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to watermark PDF: ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * Batch watermarks multiple documents according to their database status.
   */
  public static async batchWatermark(documentIds: string[]): Promise<BatchWatermarkResponse> {
    const res = await fetch('/api/pdf/batch-watermark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentIds })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Batch watermark failed: ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * Verifies server watermarking health and version.
   */
  public static async checkHealth(): Promise<any> {
    const res = await fetch('/api/health');
    return res.json();
  }
}
