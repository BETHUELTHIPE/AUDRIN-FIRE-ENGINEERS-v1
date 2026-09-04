import crypto from 'crypto';
import { DatabaseDocumentRecord, StatutoryDocumentStatus } from './types';

// In-memory persistent database store initialized with realistic South African statutory compliance records
class ServerDocumentDatabase {
  private documents: Map<string, DatabaseDocumentRecord> = new Map();
  private auditLog: Array<{
    id: string;
    documentId: string;
    documentNumber: string;
    previousStatus: StatutoryDocumentStatus;
    newStatus: StatutoryDocumentStatus;
    changedAt: string;
    actor: string;
    reason: string;
  }> = [];

  constructor() {
    this.seedDatabase();
  }

  private calculateHash(payload: string): string {
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  private seedDatabase() {
    const initialRecords: DatabaseDocumentRecord[] = [
      {
        id: 'coc-01',
        documentNumber: 'COC-SANS10139-2026-0842',
        title: 'SANS 10139 Certificate of Compliance - Menlyn Central Corporate Tower',
        documentType: 'SANS_10139_COC',
        siteName: 'Menlyn Central Corporate Tower',
        clientName: 'Bethuel Moukangwe',
        organisationName: 'Tshivhase Commercial Holdings (Pty) Ltd',
        status: 'Issued',
        isSigned: true,
        revisionNumber: 'Rev 1.0',
        issueDate: '2026-08-20',
        commissionerName: 'Noko Dina Ramphela',
        commissionerSaqccNumber: 'SAQCC-SANS10139-COMM-2022/03/23',
        systemCategory: 'L1',
        checksumSha256: '9f83a21b34e56789acde1234567890abcdef1234567890abcdef1234567890ab',
        updatedAt: '2026-08-20T14:32:00Z',
        createdAt: '2026-08-15T09:00:00Z',
        metadata: {
          buildingOccupancy: 'Commercial Multi-Storey Office & Parking Structure',
          standbyHours: 24.5,
          totalDetectors: 142,
          cablingStandard: 'PH 30 Enhanced Fire Resistant',
          signatureHash: 'AFE-COC-9109170791081-2026-A19F'
        }
      },
      {
        id: 'coc-02',
        documentNumber: 'COC-SANS10139-2026-0914',
        title: 'SANS 10139 Certificate of Compliance - Tshivhase Logistics Hub',
        documentType: 'SANS_10139_COC',
        siteName: 'Tshivhase Logistics Hub & Cold Storage',
        clientName: 'Kagiso Lekota',
        organisationName: 'Apex Industrial Logistics Ltd',
        status: 'Draft',
        isSigned: false,
        revisionNumber: 'Rev 0.2-Draft',
        issueDate: '2026-09-02',
        commissionerName: 'Noko Dina Ramphela',
        commissionerSaqccNumber: 'SAQCC-SANS10139-COMM-2022/03/23',
        systemCategory: 'P1',
        checksumSha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        updatedAt: '2026-09-02T11:15:00Z',
        createdAt: '2026-08-28T08:30:00Z',
        metadata: {
          buildingOccupancy: 'High-Bay Warehousing & Cold Chain Facility',
          standbyHours: 24.0,
          totalDetectors: 86,
          cablingStandard: 'PH 120 Fire Rated Cabling',
          draftReason: 'Awaiting secondary battery discharge test completion and municipal water pressure verification.'
        }
      },
      {
        id: 'coc-03',
        documentNumber: 'COC-SANS10139-2026-1022',
        title: 'SANS 10139 Certificate of Compliance - Sandton Medical Pavilion',
        documentType: 'SANS_10139_COC',
        siteName: 'Sandton Gateway Medical Pavilion',
        clientName: 'Dr. Sarah Van Der Merwe',
        organisationName: 'Life Healthcare Property Group',
        status: 'Draft',
        isSigned: false,
        revisionNumber: 'Rev 0.1-Provisional',
        issueDate: '2026-09-03',
        commissionerName: 'Mpho Sithole',
        commissionerSaqccNumber: 'SAQCC-SANS10139-COMM-2024/07/11',
        systemCategory: 'L2',
        checksumSha256: 'c4d5e6f7a8b90123456789abcdef0123456789abcdef0123456789abcdef0123',
        updatedAt: '2026-09-03T16:45:00Z',
        createdAt: '2026-09-01T10:00:00Z',
        metadata: {
          buildingOccupancy: 'Healthcare & Day Surgery Clinic',
          standbyHours: 48.0,
          totalDetectors: 110,
          cablingStandard: 'PH 120 Enhanced Halogen Free',
          draftReason: 'Pending surgical theatre acoustic sounder dB(A) verification and final client signature.'
        }
      },
      {
        id: 'rep-01',
        documentNumber: 'REP-PRE-2026-0842-V1',
        title: 'Pre-Work Baseline Condition Assessment Report - Menlyn Corporate',
        documentType: 'CONDITION_REPORT',
        siteName: 'Menlyn Central Corporate Tower',
        clientName: 'Bethuel Moukangwe',
        organisationName: 'Tshivhase Commercial Holdings (Pty) Ltd',
        status: 'Issued',
        isSigned: true,
        revisionNumber: 'V1.0-Final',
        issueDate: '2026-08-16',
        commissionerName: 'Thabo Ndlovu (Lead Field Engineer)',
        commissionerSaqccNumber: 'SAQCC-FIRE-TECH-2019/11/04',
        systemCategory: 'L1',
        checksumSha256: '55aa33ff22cc11bb0099887766554433221100ffeeddccbbaa99887766554433',
        updatedAt: '2026-08-16T15:20:00Z',
        createdAt: '2026-08-15T11:00:00Z',
        metadata: {
          inspectionType: 'Pre-Work Baseline Condition',
          photographsAttached: 6,
          defectsIdentified: 0
        }
      },
      {
        id: 'rep-02',
        documentNumber: 'REP-POST-2026-0911-V1',
        title: 'Post-Work Commissioning & Handover Report - Midrand Data Center',
        documentType: 'CONDITION_REPORT',
        siteName: 'Midrand Cloud Hyperscale Facility',
        clientName: 'Tshepo Khumalo',
        organisationName: 'Vanderbijl Telecommunications',
        status: 'Draft',
        isSigned: false,
        revisionNumber: 'V0.9-Review',
        issueDate: '2026-09-04',
        commissionerName: 'Noko Dina Ramphela',
        commissionerSaqccNumber: 'SAQCC-SANS10139-COMM-2022/03/23',
        systemCategory: 'P1',
        checksumSha256: '887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa99',
        updatedAt: '2026-09-04T07:10:00Z',
        createdAt: '2026-09-03T13:00:00Z',
        metadata: {
          inspectionType: 'Post-Work Handover Report',
          photographsAttached: 4,
          defectsIdentified: 1
        }
      },
      {
        id: 'sf-01',
        documentNumber: 'SF-DOSSIER-MENLYN-2026',
        title: 'Statutory Safety File Dossier - Menlyn Corporate Tower Installation',
        documentType: 'SAFETY_DOSSIER',
        siteName: 'Menlyn Central Corporate Tower',
        clientName: 'Bethuel Moukangwe',
        organisationName: 'Tshivhase Commercial Holdings (Pty) Ltd',
        status: 'Issued',
        isSigned: true,
        revisionNumber: 'Dossier V1.0',
        issueDate: '2026-08-22',
        commissionerName: 'Sipho Zuma (SHEQ Officer)',
        commissionerSaqccNumber: 'SACPCMP-CHSO-2020-0441',
        systemCategory: 'L1',
        checksumSha256: '445566778899aabbccddeeff00112233445566778899aabbccddeeff00112233',
        updatedAt: '2026-08-22T17:00:00Z',
        createdAt: '2026-08-18T09:00:00Z',
        metadata: {
          totalSubDocuments: 14,
          sheqCompliancePassed: true
        }
      }
    ];

    initialRecords.forEach(record => {
      this.documents.set(record.id, record);
    });
  }

  public getAllDocuments(): DatabaseDocumentRecord[] {
    return Array.from(this.documents.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public getDocumentById(id: string): DatabaseDocumentRecord | undefined {
    // Check direct ID or documentNumber
    if (this.documents.has(id)) {
      return this.documents.get(id);
    }
    const found = Array.from(this.documents.values()).find(
      doc => doc.documentNumber.toLowerCase() === id.toLowerCase() || doc.id.toLowerCase() === id.toLowerCase()
    );
    return found;
  }

  public updateDocumentStatus(
    id: string,
    newStatus: StatutoryDocumentStatus,
    actor = 'System Administrator',
    reason?: string
  ): DatabaseDocumentRecord | null {
    const doc = this.getDocumentById(id);
    if (!doc) return null;

    const previousStatus = doc.status;
    doc.status = newStatus;
    doc.updatedAt = new Date().toISOString();
    if (newStatus === 'Issued') {
      doc.isSigned = true;
      if (!doc.issueDate) doc.issueDate = new Date().toISOString().split('T')[0];
    }

    // Recompute document hash with updated state
    doc.checksumSha256 = this.calculateHash(`${doc.id}-${doc.documentNumber}-${doc.status}-${doc.updatedAt}`);

    this.documents.set(doc.id, doc);

    // Record audit event
    this.auditLog.unshift({
      id: `audit-status-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      documentId: doc.id,
      documentNumber: doc.documentNumber,
      previousStatus,
      newStatus,
      changedAt: new Date().toISOString(),
      actor,
      reason: reason || `Statutory status transitioned from ${previousStatus} to ${newStatus} via Document Database`
    });

    return doc;
  }

  public upsertDocument(payload: Partial<DatabaseDocumentRecord> & { id: string; documentNumber: string }): DatabaseDocumentRecord {
    const existing = this.getDocumentById(payload.id) || this.getDocumentById(payload.documentNumber);
    const now = new Date().toISOString();

    const record: DatabaseDocumentRecord = {
      id: payload.id,
      documentNumber: payload.documentNumber,
      title: payload.title || existing?.title || `Document ${payload.documentNumber}`,
      documentType: payload.documentType || existing?.documentType || 'SANS_10139_COC',
      siteName: payload.siteName || existing?.siteName || 'Unspecified Site',
      clientName: payload.clientName || existing?.clientName || 'Client',
      organisationName: payload.organisationName || existing?.organisationName || 'Client Organisation',
      status: payload.status || existing?.status || 'Draft',
      isSigned: payload.isSigned ?? existing?.isSigned ?? false,
      revisionNumber: payload.revisionNumber || existing?.revisionNumber || 'Rev 1.0',
      issueDate: payload.issueDate || existing?.issueDate || now.split('T')[0],
      commissionerName: payload.commissionerName || existing?.commissionerName || 'Noko Dina Ramphela',
      commissionerSaqccNumber: payload.commissionerSaqccNumber || existing?.commissionerSaqccNumber || 'SAQCC-SANS10139-COMM-2022/03/23',
      systemCategory: payload.systemCategory || existing?.systemCategory || 'L1',
      checksumSha256: payload.checksumSha256 || this.calculateHash(`${payload.id}-${now}`),
      updatedAt: now,
      createdAt: existing?.createdAt || now,
      metadata: { ...existing?.metadata, ...payload.metadata },
      rawRecord: payload.rawRecord || existing?.rawRecord
    };

    this.documents.set(record.id, record);
    return record;
  }

  public getStats() {
    const all = this.getAllDocuments();
    return {
      total: all.length,
      issued: all.filter(d => d.status === 'Issued').length,
      draft: all.filter(d => d.status === 'Draft').length,
      cocs: all.filter(d => d.documentType === 'SANS_10139_COC').length,
      reports: all.filter(d => d.documentType === 'CONDITION_REPORT').length,
      dossiers: all.filter(d => d.documentType === 'SAFETY_DOSSIER').length,
      recentAuditLogs: this.auditLog.slice(0, 15)
    };
  }
}

export const documentDatabase = new ServerDocumentDatabase();
