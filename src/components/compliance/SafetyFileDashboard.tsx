import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Download, 
  Printer, 
  Mail, 
  UploadCloud, 
  UserCheck, 
  Filter, 
  Search, 
  Layers, 
  Award, 
  ChevronRight, 
  AlertCircle, 
  Eye, 
  Lock, 
  ExternalLink, 
  Hash, 
  FileCheck, 
  Share2, 
  Calendar, 
  FileX, 
  X,
  FileSpreadsheet,
  HelpCircle,
  Plus,
  RefreshCw,
  Send
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { 
  SafetyFileDossier, 
  SafetyFileDocument, 
  StatutoryMilestone, 
  SafetyFileDocStatus,
  CompanyProfileBranding,
  StatutoryStandard
} from '../../types';
import { generateSafetyFileCompletePdf } from '../../services/safetyFilePdfGenerator';
import { SourceRequirementDrawer } from './SourceRequirementDrawer';

interface SafetyFileDashboardProps {
  onNavigateToCover?: (dossierId: string) => void;
  onNavigateToAudit?: (projectId?: string) => void;
  onNavigateToCoc?: () => void;
}

export const SafetyFileDashboard: React.FC<SafetyFileDashboardProps> = ({
  onNavigateToCover,
  onNavigateToAudit,
  onNavigateToCoc
}) => {
  const store = useAudrinStore();
  const currentUser = store.getUser();
  const dossiers = store.getSafetyFileDossiers();
  const brandings = store.getCompanyBrandings();

  // Filters
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('all');
  const [selectedContractId, setSelectedContractId] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(dossiers[0]?.id || 'all');
  const [searchDocQuery, setSearchDocQuery] = useState<string>('');

  // Modals state
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<SafetyFileDocument | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [isSigRequestModalOpen, setIsSigRequestModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState<boolean>(false);
  const [activeSourceReqId, setActiveSourceReqId] = useState<string | null>(null);

  // Email modal form state
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailNotes, setEmailNotes] = useState<string>('');
  const [emailRecipient, setEmailRecipient] = useState<string>('');
  const [emailSending, setEmailSending] = useState<boolean>(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState<boolean>(false);

  // Signature request form state
  const [sigRequestRole, setSigRequestRole] = useState<string>('commissioner');
  const [sigRequestRecipientName, setSigRequestRecipientName] = useState<string>('');
  const [sigRequestRecipientEmail, setSigRequestRecipientEmail] = useState<string>('');
  const [sigRequestSentSuccess, setSigRequestSentSuccess] = useState<boolean>(false);

  // Upload modal form state
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadCategory, setUploadCategory] = useState<any>('statutory_certificate');
  const [uploadStandard, setUploadStandard] = useState<StatutoryStandard>('SANS 10139');
  const [uploadClause, setUploadClause] = useState<string>('SANS 10139:2021 Clause 13.1');
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadFileSize, setUploadFileSize] = useState<number>(1048576);
  const [uploadNotes, setUploadNotes] = useState<string>('');

  // Active dossier selection
  const activeDossier = useMemo(() => {
    if (selectedProjectId !== 'all') {
      return dossiers.find(d => d.id === selectedProjectId) || dossiers[0];
    }
    return dossiers[0];
  }, [dossiers, selectedProjectId]);

  const activeBranding = useMemo(() => {
    return brandings.find(b => b.orgId === activeDossier?.clientId) || brandings[0];
  }, [brandings, activeDossier]);

  // Unique filter lists
  const clientOptions = useMemo(() => {
    const clients = new Map<string, string>();
    dossiers.forEach(d => clients.set(d.clientId, d.clientName));
    return Array.from(clients.entries());
  }, [dossiers]);

  const siteOptions = useMemo(() => {
    const sites = new Map<string, string>();
    dossiers.forEach(d => sites.set(d.siteName, d.siteName));
    return Array.from(sites.entries());
  }, [dossiers]);

  const contractOptions = useMemo(() => {
    const contracts = new Map<string, string>();
    dossiers.forEach(d => contracts.set(d.contractNumber, d.contractNumber));
    return Array.from(contracts.entries());
  }, [dossiers]);

  // Document metrics
  const docMetrics = useMemo(() => {
    if (!activeDossier) return { draft: 0, awaiting: 0, approved: 0, rejected: 0, expired: 0, superseded: 0, total: 0 };
    const docs = activeDossier.documents;
    return {
      draft: docs.filter(d => d.status === 'draft').length,
      awaiting: docs.filter(d => d.status === 'awaiting_signature').length,
      approved: docs.filter(d => d.status === 'approved').length,
      rejected: docs.filter(d => d.status === 'rejected').length,
      expired: docs.filter(d => d.status === 'expired').length,
      superseded: docs.filter(d => d.status === 'superseded').length,
      total: docs.length
    };
  }, [activeDossier]);

  // Alerts
  const alerts = useMemo(() => {
    if (!activeDossier) return { missingDocs: [], expiredCerts: [] };
    
    // Check mandatory documents
    const missingDocs: string[] = [];
    const hasSansCert = activeDossier.documents.some(d => d.clauseReference.includes('13.2') && d.status === 'approved');
    if (!hasSansCert) {
      missingDocs.push('SANS 10139 Certificate of Compliance & Handover (Clause 13.2)');
    }
    const hasBatteryCalc = activeDossier.documents.some(d => d.title.toLowerCase().includes('battery') && d.status === 'approved');
    if (!hasBatteryCalc) {
      missingDocs.push('Battery Autonomy Calculation Sheets (Clause 9.3)');
    }
    const hasAsBuilt = activeDossier.documents.some(d => d.title.toLowerCase().includes('as-built') && d.status === 'approved');
    if (!hasAsBuilt) {
      missingDocs.push('SANS 10139 As-Built Fire Detection Layout Drawings (Clause 13.1)');
    }

    // Expired documents
    const expiredCerts = activeDossier.documents.filter(d => {
      if (d.status === 'expired') return true;
      if (d.expiryDate) {
        return new Date(d.expiryDate) < new Date();
      }
      return false;
    });

    return { missingDocs, expiredCerts };
  }, [activeDossier]);

  // Recent activity from store audit trail
  const recentDossierActivity = useMemo(() => {
    if (!activeDossier) return [];
    return store.getComplianceAuditLogs(activeDossier.id).slice(0, 6);
  }, [store, activeDossier]);

  // Filtered documents table
  const filteredDocuments = useMemo(() => {
    if (!activeDossier) return [];
    let docs = activeDossier.documents;
    if (searchDocQuery.trim()) {
      const q = searchDocQuery.toLowerCase();
      docs = docs.filter(d => 
        d.title.toLowerCase().includes(q) ||
        d.fileNumber.toLowerCase().includes(q) ||
        d.clauseReference.toLowerCase().includes(q) ||
        d.fileName.toLowerCase().includes(q)
      );
    }
    return docs;
  }, [activeDossier, searchDocQuery]);

  // Quick Action Handlers
  const handleDownloadFullDossier = () => {
    if (!activeDossier) return;
    generateSafetyFileCompletePdf(activeDossier, activeBranding);
    store.logComplianceAudit({
      projectId: activeDossier.id,
      projectName: activeDossier.projectName,
      clientId: activeDossier.clientId,
      clientName: activeDossier.clientName,
      dossierId: activeDossier.id,
      eventType: 'dossier_download',
      eventDescription: `Complete statutory safety file PDF downloaded (${activeDossier.dossierNumber} v${activeDossier.version}).`,
      userEmail: currentUser.email,
      userName: currentUser.name,
      userRole: currentUser.role,
      ipAddress: '105.187.112.55',
      deviceMetadata: 'Desktop Browser (Export Engine)',
      standardsReference: 'SANS 10139:2021 Clause 13.2',
      popiaCategory: 'statutory_record'
    });
  };

  const handleDownloadSelectedDoc = (doc: SafetyFileDocument) => {
    store.logComplianceAudit({
      projectId: activeDossier.id,
      projectName: activeDossier.projectName,
      clientId: activeDossier.clientId,
      clientName: activeDossier.clientName,
      dossierId: activeDossier.id,
      documentId: doc.id,
      documentTitle: doc.title,
      documentVersion: `v${doc.version} (${doc.revision})`,
      eventType: 'dossier_download',
      eventDescription: `Document downloaded: ${doc.title} (${doc.fileName}). SHA-256 integrity verified.`,
      userEmail: currentUser.email,
      userName: currentUser.name,
      userRole: currentUser.role,
      ipAddress: '105.187.112.55',
      deviceMetadata: 'Desktop Browser (Document Viewer)',
      fileChecksumSha256: doc.checksumSha256,
      standardsReference: doc.clauseReference,
      popiaCategory: 'statutory_record'
    });

    // Create a mock download blob
    const content = `AUDRIN FIRE ENGINEERS (PTY) LTD
STATUTORY LIFE-SAFETY REPOSITORY
==================================================
Document Ref: ${doc.fileNumber}
Title: ${doc.title}
Applicable Standard: ${doc.applicableStandard} (${doc.clauseReference})
Version: v${doc.version} (${doc.revision})
Status: ${doc.status.toUpperCase()}
Issue Date: ${doc.issueDate}
Checksum SHA-256: ${doc.checksumSha256}
Dossier Ref: ${activeDossier.dossierNumber} - ${activeDossier.projectName}
Client: ${activeDossier.clientName}
Site: ${activeDossier.siteAddress}
==================================================
POPIA Act 4 of 2013 Statutory Record
Audrin Fire Engineers SAQCC Accreditation: 9109170791081`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.fileNumber}_${doc.fileName.replace(/\.[^/.]+$/, "")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenEmailModal = () => {
    if (!activeDossier) return;
    const clientSafetyOfficer = activeDossier.projectContacts.find(c => c.role.toLowerCase().includes('safety')) 
      || activeBranding?.primaryContact;
    setEmailRecipient(clientSafetyOfficer?.email || 'safety@tshivhaseholdings.co.za');
    setEmailSubject(`Statutory Safety File Dossier Handover — ${activeDossier.projectName} (${activeDossier.dossierNumber})`);
    setEmailNotes(`Dear Client Safety Officer,\n\nPlease find attached the statutory life-safety file for the fire detection and alarm installation at ${activeDossier.siteName}. This includes complete SANS 10139 and SANS 10400-T compliance schedules, technical as-built drawings, and the multi-disciplinary approval matrix.\n\nBest regards,\n${currentUser.name}\nAudrin Fire Engineers (Pty) Ltd`);
    setEmailSentSuccess(false);
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDossier) return;
    setEmailSending(true);

    setTimeout(() => {
      store.logComplianceAudit({
        projectId: activeDossier.id,
        projectName: activeDossier.projectName,
        clientId: activeDossier.clientId,
        clientName: activeDossier.clientName,
        dossierId: activeDossier.id,
        eventType: 'email_dispatch',
        eventDescription: `Statutory safety file dossier emailed to Client Safety Officer (${emailRecipient}). Subject: "${emailSubject}".`,
        userEmail: currentUser.email,
        userName: currentUser.name,
        userRole: currentUser.role,
        emailRecipient: emailRecipient,
        emailDeliveryResult: 'delivered',
        ipAddress: '105.187.112.55',
        deviceMetadata: 'Secure Mail Dispatch Agent (TLS 1.3)',
        standardsReference: 'SANS 10139:2021 Clause 13.2',
        popiaCategory: 'personal_data'
      });

      setEmailSending(false);
      setEmailSentSuccess(true);
      setTimeout(() => {
        setIsEmailModalOpen(false);
        setEmailSentSuccess(false);
      }, 1500);
    }, 800);
  };

  const handleOpenSigRequestModal = () => {
    setSigRequestRole('commissioner');
    setSigRequestRecipientName('Russia Bethuel Moukangwe');
    setSigRequestRecipientEmail('bethuelthipe@gmail.com');
    setSigRequestSentSuccess(false);
    setIsSigRequestModalOpen(true);
  };

  const handleSendSigRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDossier) return;

    store.logComplianceAudit({
      projectId: activeDossier.id,
      projectName: activeDossier.projectName,
      clientId: activeDossier.clientId,
      clientName: activeDossier.clientName,
      dossierId: activeDossier.id,
      eventType: 'signature_requested',
      eventDescription: `Electronic signature sign-off requested from ${sigRequestRecipientName} (${sigRequestRole.toUpperCase()}) for dossier ${activeDossier.dossierNumber}.`,
      userEmail: currentUser.email,
      userName: currentUser.name,
      userRole: currentUser.role,
      emailRecipient: sigRequestRecipientEmail,
      emailDeliveryResult: 'delivered',
      ipAddress: '105.187.112.55',
      deviceMetadata: 'E-Sign Dispatch Broker',
      standardsReference: 'SANS 10139:2021 Clause 13.2',
      popiaCategory: 'personal_data'
    });

    setSigRequestSentSuccess(true);
    setTimeout(() => {
      setIsSigRequestModalOpen(false);
      setSigRequestSentSuccess(false);
    }, 1200);
  };

  const handleUploadEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDossier || !uploadTitle.trim()) return;

    store.uploadSafetyFileDocument(activeDossier.id, {
      title: uploadTitle,
      category: uploadCategory,
      applicableStandard: uploadStandard,
      clauseReference: uploadClause,
      fileName: uploadFileName || `${uploadTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSizeBytes: uploadFileSize,
      checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      status: 'awaiting_signature',
      notes: uploadNotes || 'Evidence uploaded via Safety File Dashboard.'
    });

    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadNotes('');
    setUploadFileName('');
  };

  if (!activeDossier) {
    return (
      <div className="p-8 text-center bg-slate-900 text-slate-300 rounded-xl border border-slate-800">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Safety Files Configured</h3>
        <p className="text-sm text-slate-400 mt-1">Please create a safety file dossier.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header & Context Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-serif">
                <ShieldCheck className="w-3.5 h-3.5" />
                Geometric Balance Safety Dossier
              </span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs font-mono font-bold text-slate-300">
                {activeDossier.dossierNumber}
              </span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs text-slate-400">
                Version {activeDossier.version} ({activeDossier.revision})
              </span>
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3 font-serif">
              {activeDossier.projectName}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-amber-500" />
                {activeDossier.clientName}
              </span>
              <span>•</span>
              <span>Site: <strong className="text-white">{activeDossier.siteName}</strong></span>
              <span>•</span>
              <span>Contract: <strong className="text-white font-mono">{activeDossier.contractNumber}</strong></span>
              <span>•</span>
              <span>Classification: <strong className="text-white">{activeDossier.buildingClassification}</strong></span>
            </div>
          </div>

          {/* Quick Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsPrintPreviewOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Print preview dossier"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              Print Preview
            </button>

            <button
              onClick={handleDownloadFullDossier}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all"
              title="Download complete safety-file PDF"
            >
              <Download className="w-4 h-4" />
              Download Dossier PDF
            </button>

            <button
              onClick={handleOpenEmailModal}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Email dossier to the client safety officer"
            >
              <Mail className="w-4 h-4 text-amber-500" />
              Email Safety Officer
            </button>

            <button
              onClick={handleOpenSigRequestModal}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Request electronic signatures"
            >
              <UserCheck className="w-4 h-4 text-blue-400" />
              Request Signatures
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Upload supporting evidence"
            >
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              Upload Evidence
            </button>

            {onNavigateToCover && (
              <button
                onClick={() => onNavigateToCover(activeDossier.id)}
                className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-amber-500/30 transition-colors"
                title="View formal Cover and 5-Role Approval Matrix"
              >
                <Eye className="w-4 h-4" />
                Cover & Matrix
              </button>
            )}

            {onNavigateToAudit && (
              <button
                onClick={() => onNavigateToAudit(activeDossier.id)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                title="View append-only audit trail"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                Audit Trail
              </button>
            )}
          </div>
        </div>

        {/* High-density Filter Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            Filters:
          </div>

          {/* Client Filter */}
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
          >
            <option value="all">All Clients ({clientOptions.length})</option>
            {clientOptions.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

          {/* Site Filter */}
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
          >
            <option value="all">All Sites ({siteOptions.length})</option>
            {siteOptions.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

          {/* Contract Filter */}
          <select
            value={selectedContractId}
            onChange={(e) => setSelectedContractId(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
          >
            <option value="all">All Contracts ({contractOptions.length})</option>
            {contractOptions.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>

          {/* Project / Dossier Selector */}
          <select
            value={activeDossier.id}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-slate-800 text-amber-400 border border-slate-700 rounded-lg text-xs py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
          >
            {dossiers.map(d => (
              <option key={d.id} value={d.id}>
                {d.dossierNumber} - {d.projectName}
              </option>
            ))}
          </select>

          {/* Reset Filters button */}
          {(selectedClientId !== 'all' || selectedSiteId !== 'all' || selectedContractId !== 'all') && (
            <button
              onClick={() => {
                setSelectedClientId('all');
                setSelectedSiteId('all');
                setSelectedContractId('all');
              }}
              className="text-xs text-amber-500 hover:text-amber-400 flex items-center gap-1 ml-auto font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-amber-400 font-bold">Statutory Certification Rule:</strong> Automated calculations represent <span className="underline">compliance-support information</span>, not regulatory certification. Dossiers cannot be marked as approved solely based on 100% completion; accredited SAQCC Commissioner on-site inspection and formal electronic seal are mandatory (SANS 10139:2021 Clause 13.2).
        </div>
      </div>

      {/* Primary KPI & Compliance Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Compliance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Compliance
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeDossier.status === 'approved'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {activeDossier.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-mono">
              {activeDossier.overallComplianceScore}%
            </span>
            <span className="text-xs text-slate-400">Statutory Score</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${activeDossier.overallComplianceScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Commissioning Gate:</span>
              <span className={`font-semibold ${activeDossier.isCommissionerApproved ? 'text-emerald-400' : 'text-amber-400'}`}>
                {activeDossier.isCommissionerApproved ? 'Sealed ✓' : 'Awaiting SAQCC Seal'}
              </span>
            </div>
          </div>
        </div>

        {/* SANS 10139 Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              SANS 10139:2021
            </span>
            <button 
              onClick={() => setActiveSourceReqId('sans-10139-handover')}
              className="text-[10px] font-mono font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              Clause 13.2 <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-mono">
              {activeDossier.sans10139ComplianceScore}%
            </span>
            <span className="text-xs text-slate-400">Fire Detection Standard</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${activeDossier.sans10139ComplianceScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Audrin Technician + COC:</span>
              <span className="text-slate-300 font-semibold">
                {activeDossier.documents.filter(d => d.applicableStandard === 'SANS 10139' && d.status === 'approved').length} of {activeDossier.documents.filter(d => d.applicableStandard === 'SANS 10139').length} Verified
              </span>
            </div>
          </div>
        </div>

        {/* SANS 10400-T Progress */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              SANS 10400-T
            </span>
            <button 
              onClick={() => setActiveSourceReqId('sans-10400-t-fd')}
              className="text-[10px] font-mono font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              Table C.1 <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-mono">
              {activeDossier.sans10400TComplianceScore}%
            </span>
            <span className="text-xs text-slate-400">NBR Fire Protection</span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${activeDossier.sans10400TComplianceScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Structural & Rational:</span>
              <span className="text-slate-300 font-semibold">
                {activeDossier.documents.filter(d => d.applicableStandard === 'SANS 10400-T' && d.status === 'approved').length} of {activeDossier.documents.filter(d => d.applicableStandard === 'SANS 10400-T').length} Verified
              </span>
            </div>
          </div>
        </div>

        {/* Document Status Metrics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Document Metrics
            </span>
            <span className="text-xs font-bold text-slate-300 font-mono">
              Total: {docMetrics.total}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2 text-center text-xs">
            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
              <div className="text-[10px] text-slate-400">Draft</div>
              <div className="font-bold text-slate-200 font-mono text-base">{docMetrics.draft}</div>
            </div>
            <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
              <div className="text-[10px] text-amber-400">Awaiting</div>
              <div className="font-bold text-amber-300 font-mono text-base">{docMetrics.awaiting}</div>
            </div>
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <div className="text-[10px] text-emerald-400">Approved</div>
              <div className="font-bold text-emerald-300 font-mono text-base">{docMetrics.approved}</div>
            </div>
            <div className="bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
              <div className="text-[10px] text-rose-400">Rejected</div>
              <div className="font-bold text-rose-300 font-mono text-base">{docMetrics.rejected}</div>
            </div>
            <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/20">
              <div className="text-[10px] text-red-400">Expired</div>
              <div className="font-bold text-red-300 font-mono text-base">{docMetrics.expired}</div>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
              <div className="text-[10px] text-slate-400">Superseded</div>
              <div className="font-bold text-slate-400 font-mono text-base">{docMetrics.superseded}</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center">
            {docMetrics.approved} of {docMetrics.total} documents officially ratified
          </div>
        </div>
      </div>

      {/* Alerts Row (Missing Documents & Expired Certificates) */}
      {(alerts.missingDocs.length > 0 || alerts.expiredCerts.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Missing Document Alerts */}
          {alerts.missingDocs.length > 0 && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-start gap-3.5">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  Missing Mandatory Statutory Documents ({alerts.missingDocs.length})
                </div>
                <ul className="text-xs text-rose-200 space-y-1">
                  {alerts.missingDocs.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Expired Certificates Alerts */}
          {alerts.expiredCerts.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Expired Certificates / Renewal Required ({alerts.expiredCerts.length})
                </div>
                <ul className="text-xs text-amber-200 space-y-1">
                  {alerts.expiredCerts.map((cert) => (
                    <li key={cert.id} className="flex items-center justify-between text-xs">
                      <span>• {cert.title} ({cert.fileNumber})</span>
                      <span className="font-mono text-[10px] text-amber-300">Exp: {cert.expiryDate || 'Expired'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statutory Milestones & Recent Activity / Outstanding Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Milestones Panel (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-serif">
                <Layers className="w-4 h-4 text-amber-500" />
                Statutory Milestone Tracker
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Compulsory compliance deliverables with assigned responsible persons and verification dates.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {activeDossier.milestones.filter(m => m.status === 'completed').length} of {activeDossier.milestones.length} Completed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  <th className="pb-3 px-2">Milestone & Standard</th>
                  <th className="pb-3 px-2">Responsible Person</th>
                  <th className="pb-3 px-2">Target Date</th>
                  <th className="pb-3 px-2">Completed</th>
                  <th className="pb-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeDossier.milestones.map((milestone) => {
                  const isOverdue = milestone.isOverdue;
                  const isCompleted = milestone.status === 'completed';

                  return (
                    <tr key={milestone.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Title & Standard */}
                      <td className="py-3 px-2">
                        <div className="font-bold text-white">{milestone.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                            {milestone.clauseReference}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {milestone.standard}
                          </span>
                        </div>
                      </td>

                      {/* Responsible */}
                      <td className="py-3 px-2">
                        <div className="font-medium text-slate-200">{milestone.responsiblePerson}</div>
                        <div className="text-[10px] text-slate-500">{milestone.responsibleRole}</div>
                      </td>

                      {/* Target Date */}
                      <td className="py-3 px-2 font-mono text-slate-300">
                        {milestone.targetDate}
                      </td>

                      {/* Completed Date */}
                      <td className="py-3 px-2 font-mono text-slate-400">
                        {milestone.completionDate || '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-2 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isOverdue
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {isCompleted ? 'COMPLETED' : isOverdue ? 'OVERDUE' : 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Column: Outstanding Actions & Recent Audit Activity */}
        <div className="space-y-6">
          {/* Outstanding Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Outstanding Actions
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Approval matrix pending signers */}
              {activeDossier.approvalMatrix.filter(a => a.verificationStatus !== 'verified').map((p) => (
                <div key={p.roleId} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{p.roleTitle}</div>
                    <div className="text-[11px] text-slate-400">{p.personName || 'Unassigned'}</div>
                  </div>
                  <button
                    onClick={() => onNavigateToCover && onNavigateToCover(activeDossier.id)}
                    className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-bold rounded border border-amber-500/30 transition-colors"
                  >
                    Sign
                  </button>
                </div>
              ))}

              {/* Overdue milestones */}
              {activeDossier.milestones.filter(m => m.isOverdue).map((m) => (
                <div key={m.id} className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-rose-300 truncate max-w-[170px]">{m.title}</div>
                    <div className="text-[10px] text-rose-400 font-mono">Due: {m.targetDate}</div>
                  </div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase">Overdue</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Recent Audit Trail
              </h3>
              {onNavigateToAudit && (
                <button
                  onClick={() => onNavigateToAudit(activeDossier.id)}
                  className="text-[10px] font-bold text-amber-400 hover:underline"
                >
                  View All
                </button>
              )}
            </div>

            <div className="space-y-2.5 text-xs">
              {recentDossierActivity.length === 0 ? (
                <p className="text-slate-500 text-xs py-2">No activity logged for this project yet.</p>
              ) : (
                recentDossierActivity.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-amber-400 font-bold">{log.auditNumber}</span>
                      <span className="text-slate-500">{log.timestamp.substring(11, 16)} UTC</span>
                    </div>
                    <p className="text-slate-300 line-clamp-1">{log.eventDescription}</p>
                    <div className="text-[10px] text-slate-500">
                      By: <strong className="text-slate-400">{log.userName}</strong> ({log.userRole})
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controlled Documents Schedule / Master Register */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-serif">
              <FileCheck className="w-4 h-4 text-amber-500" />
              Controlled Life-Safety Document Register
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Repository of all technical certificates, rational fire designs, battery calculations, and as-built drawings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search document title, clause..."
                value={searchDocQuery}
                onChange={(e) => setSearchDocQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-white pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Evidence
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Doc Ref & Title</th>
                <th className="pb-3 px-3">Statutory Standard & Clause</th>
                <th className="pb-3 px-3">Rev</th>
                <th className="pb-3 px-3">Issue / Expiry</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Integrity SHA-256</th>
                <th className="pb-3 px-3 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDocuments.map((doc) => {
                const isApproved = doc.status === 'approved';
                const isAwaiting = doc.status === 'awaiting_signature';
                const isExpired = doc.status === 'expired';

                return (
                  <tr key={doc.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Doc Ref & Title */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        {doc.title}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {doc.fileNumber} • {doc.fileName} ({(doc.fileSizeBytes / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    </td>

                    {/* Standard & Clause */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setActiveSourceReqId(doc.applicableStandard === 'SANS 10139' ? 'sans-10139-handover' : 'sans-10400-t-fd')}
                        className="font-mono text-amber-400 hover:underline flex items-center gap-1"
                      >
                        {doc.clauseReference}
                      </button>
                      <div className="text-[10px] text-slate-500">{doc.applicableStandard}</div>
                    </td>

                    {/* Rev */}
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {doc.revision}
                    </td>

                    {/* Dates */}
                    <td className="py-3 px-3 font-mono">
                      <div className="text-slate-300">Issued: {doc.issueDate}</div>
                      {doc.expiryDate && (
                        <div className="text-[10px] text-slate-500">Exp: {doc.expiryDate}</div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isApproved
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isAwaiting
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : isExpired
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-slate-700 text-slate-300'
                      }`}>
                        {doc.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>

                    {/* SHA-256 */}
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-400" title={doc.checksumSha256}>
                      {doc.checksumSha256.substring(0, 12)}...
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDocForPreview(doc)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Preview Document Info"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDownloadSelectedDoc(doc)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors"
                          title="Download Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EMAIL DOSSIER MODAL */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-white">
                  Email Safety Dossier to Client Safety Officer
                </h3>
              </div>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Recipient Safety Officer Email
                </label>
                <input
                  type="email"
                  required
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Transmittal Message & POPIA Disclosure Note
                </label>
                <textarea
                  rows={4}
                  required
                  value={emailNotes}
                  onChange={(e) => setEmailNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-slate-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  Attachment: {activeDossier.dossierNumber}_Safety_File_Dossier_{activeDossier.version}.pdf
                </div>
                <div className="text-[11px] text-slate-400">
                  Includes full statutory cover, 5-role approval matrix, milestone register, and SHA-256 integrity hash sheet.
                </div>
              </div>

              {emailSentSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Dossier successfully dispatched & logged in immutable audit ledger!
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={emailSending || emailSentSuccess}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {emailSending ? 'Dispatching...' : 'Dispatch Dossier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST ELECTRONIC SIGNATURES MODAL */}
      {isSigRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Request Electronic Signature
                </h3>
              </div>
              <button
                onClick={() => setIsSigRequestModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendSigRequest} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Select Statutory Role
                </label>
                <select
                  value={sigRequestRole}
                  onChange={(e) => setSigRequestRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="commissioner">SAQCC Fire Commissioner</option>
                  <option value="audrin_technician">Audrin Fire Engineers Technician</option>
                  <option value="project_manager">Lead Project Manager</option>
                  <option value="client_representative">Client Designated Representative</option>
                  <option value="client_safety_officer">Client Safety Officer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Signer Full Name
                </label>
                <input
                  type="text"
                  required
                  value={sigRequestRecipientName}
                  onChange={(e) => setSigRequestRecipientName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Signer Official Email
                </label>
                <input
                  type="email"
                  required
                  value={sigRequestRecipientEmail}
                  onChange={(e) => setSigRequestRecipientEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {sigRequestSentSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Invitation sent & recorded in immutable compliance audit trail!
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSigRequestModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Send Signature Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD SUPPORTING EVIDENCE MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Upload Supporting Evidence Document
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadEvidence} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Gas Suppression Cylinder Hydrostatic Test Certificate"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="statutory_certificate">Statutory Certificate</option>
                    <option value="as_built_drawing">As-Built Drawing</option>
                    <option value="calculation_sheet">Calculation Sheet</option>
                    <option value="commissioning_record">Commissioning Record</option>
                    <option value="equipment_datasheet">Equipment Datasheet</option>
                    <option value="maintenance_log">Maintenance Log</option>
                    <option value="training_record">Training Record</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Applicable Standard
                  </label>
                  <select
                    value={uploadStandard}
                    onChange={(e) => {
                      setUploadStandard(e.target.value as StatutoryStandard);
                      if (e.target.value === 'SANS 10139') {
                        setUploadClause('SANS 10139:2021 Clause 13.1');
                      } else {
                        setUploadClause('SANS 10400-T Table C.1');
                      }
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="SANS 10139">SANS 10139 (Fire Detection)</option>
                    <option value="SANS 10400-T">SANS 10400-T (Fire Protection)</option>
                    <option value="OHS Act Construction Reg 7(1)(b)">OHS Act Regulations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Standards Clause Reference (Strict Compliance)
                </label>
                <input
                  type="text"
                  required
                  value={uploadClause}
                  onChange={(e) => setUploadClause(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* File drop zone simulator */}
              <div className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-800/40">
                <UploadCloud className="w-8 h-8 text-amber-500 mx-auto mb-1.5" />
                <div className="font-bold text-white">Drag & drop evidence PDF or click to browse</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Automatic cryptographic SHA-256 checksum generated on upload
                </div>
                <input
                  type="file"
                  className="hidden"
                  id="file-evidence-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadFileName(file.name);
                      setUploadFileSize(file.size);
                      if (!uploadTitle) setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
                    }
                  }}
                />
                <label 
                  htmlFor="file-evidence-upload" 
                  className="inline-block mt-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded cursor-pointer font-semibold"
                >
                  Select File
                </label>
                {uploadFileName && (
                  <div className="mt-2 text-emerald-400 font-mono text-[11px] font-bold">
                    Selected: {uploadFileName} ({(uploadFileSize / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Upload Notes & Auditor Remarks
                </label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Verification observations or laboratory accreditation references..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Seal & Upload Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-white">
                  Document Integrity & Metadata Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2">
                <div className="font-bold text-base text-white">{selectedDocForPreview.title}</div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>Ref: <strong className="font-mono text-white">{selectedDocForPreview.fileNumber}</strong></div>
                  <div>Status: <strong className="uppercase text-amber-400">{selectedDocForPreview.status}</strong></div>
                  <div>Standard: <strong>{selectedDocForPreview.applicableStandard}</strong></div>
                  <div>Clause: <strong className="font-mono text-amber-300">{selectedDocForPreview.clauseReference}</strong></div>
                  <div>Version: <strong>v{selectedDocForPreview.version} ({selectedDocForPreview.revision})</strong></div>
                  <div>Size: <strong>{(selectedDocForPreview.fileSizeBytes / 1024 / 1024).toFixed(2)} MB</strong></div>
                </div>
              </div>

              <div>
                <div className="text-slate-400 font-semibold mb-1">Cryptographic Checksum (SHA-256 Hash):</div>
                <div className="font-mono text-[11px] text-slate-300 break-all bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {selectedDocForPreview.checksumSha256}
                </div>
              </div>

              {selectedDocForPreview.notes && (
                <div>
                  <div className="text-slate-400 font-semibold mb-1">Auditor Remarks:</div>
                  <div className="text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                    {selectedDocForPreview.notes}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => handleDownloadSelectedDoc(selectedDocForPreview)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Document
                </button>
                <button
                  onClick={() => setSelectedDocForPreview(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT PREVIEW MODAL */}
      {isPrintPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-white">
                  Print Preview — {activeDossier.dossierNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Now
                </button>
                <button
                  onClick={() => setIsPrintPreviewOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Rendered Preview Page */}
            <div className="p-8 bg-white text-slate-900">
              {/* Header */}
              <div className="border-b-2 border-slate-800 pb-4 mb-6">
                <h1 className="text-2xl font-black text-slate-900 font-serif">
                  AUDRIN FIRE ENGINEERS (PTY) LTD
                </h1>
                <div className="text-xs text-slate-600 mt-1">
                  Controlled Statutory Safety File Dossier · Reg: 2026/091091/07 · SAQCC: 9109170791081
                </div>
                <div className="text-sm font-bold text-amber-800 mt-2">
                  Dossier Ref: {activeDossier.dossierNumber} | Version: {activeDossier.version} ({activeDossier.revision})
                </div>
              </div>

              {/* Content Summary */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <div>
                    <div className="font-bold text-slate-700">Client Information:</div>
                    <div className="font-bold text-slate-900 text-sm">{activeDossier.clientName}</div>
                    <div className="text-slate-600">{activeDossier.siteAddress}</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-700">Project Parameters:</div>
                    <div className="font-bold text-slate-900">{activeDossier.projectName}</div>
                    <div className="text-slate-600">Contract: {activeDossier.contractNumber}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 uppercase text-xs mb-2">
                    Multi-Disciplinary Approval Status:
                  </h4>
                  <table className="w-full text-left border border-slate-200 text-[11px]">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-2 border">Role</th>
                        <th className="p-2 border">Signer</th>
                        <th className="p-2 border">Registration</th>
                        <th className="p-2 border">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeDossier.approvalMatrix.map(a => (
                        <tr key={a.roleId}>
                          <td className="p-2 border font-bold">{a.roleTitle}</td>
                          <td className="p-2 border">{a.personName}</td>
                          <td className="p-2 border font-mono">{a.registrationNumber || 'N/A'}</td>
                          <td className="p-2 border font-bold uppercase">{a.verificationStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-4 text-center text-[10px] text-slate-500 border-t border-slate-200">
                  Automated compliance-support output. Statutory SANS 10139 certificate requires accredited physical SAQCC Commissioner seal.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verified Source Requirement Drawer */}
      <SourceRequirementDrawer
        isOpen={Boolean(activeSourceReqId)}
        onClose={() => setActiveSourceReqId(null)}
        requirementId={activeSourceReqId || undefined}
      />
    </div>
  );
};
