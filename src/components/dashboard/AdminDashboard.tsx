import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  Download, 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Mail, 
  Activity, 
  Layers, 
  Server, 
  Users, 
  Database,
  SlidersHorizontal,
  FileText,
  AlertTriangle,
  Award,
  Plus,
  ExternalLink,
  FileCheck,
  Eye,
  PenTool,
  Lock
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { COMPANY_DETAILS, GOOGLE_SHEETS_TABS } from '../../data/initialData';
import { CertificateOfComplianceForm } from '../compliance/CertificateOfComplianceForm';
import { CocEmailModal } from '../compliance/coc/CocEmailModal';
import { CocPdfExportModal } from '../compliance/coc/CocPdfExportModal';
import { exportSansCocPdf } from '../../services/pdfGenerator';
import { SansCocCertificate } from '../../types';
import { BatchComplianceDispatchUtility } from '../compliance/BatchComplianceDispatchUtility';
import { ServerWatermarkUtility } from '../compliance/ServerWatermarkUtility';

interface AdminDashboardProps {
  onNavigate?: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const store = useAudrinStore();
  const ADMIN_SHEET_TABS = [
    { tabId: 'requests', tabName: 'Service Requests Register' },
    { tabId: 'coc_certificates', tabName: 'SANS 10139 Certificates of Compliance (COC)' },
    { tabId: 'watermark_utility', tabName: 'Server PDF Watermarking Engine (Dynamic Status)' },
    { tabId: 'batch_dispatch', tabName: 'Batch Document Dispatch Utility' },
    { tabId: 'reports', tabName: 'Condition Reports (Pre & Post)' },
    { tabId: 'email_logs', tabName: 'Automated Dispatch & Email Logs' },
    { tabId: 'audit_trail', tabName: 'Immutable SANS Audit Trail' }
  ];
  const [activeTabId, setActiveTabId] = useState<string>('requests');
  const [selectedDocIdsForBatch, setSelectedDocIdsForBatch] = useState<Set<string>>(new Set());
  const [isSyncing, setIsSyncing] = useState(false);
  const [cocModalOpen, setCocModalOpen] = useState(false);
  const [selectedCocId, setSelectedCocId] = useState<string | undefined>(undefined);
  const [selectedCocForEmail, setSelectedCocForEmail] = useState<SansCocCertificate | null>(null);
  const [selectedCocForExport, setSelectedCocForExport] = useState<SansCocCertificate | null>(null);
  const [syncStatus, setSyncStatus] = useState({
    lastSynced: new Date().toLocaleTimeString(),
    rowCount: 24,
    status: 'Operational & Synchronized'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null);

  const requests = store.getServiceRequests();
  const sites = store.getSites();
  const photos = store.getPhotos();
  const videos = store.getVideos();
  const reports = store.getConditionReports();
  const presentations = store.getPresentations();
  const minutesList = store.getMeetingMinutes();
  const appointments = store.getAppointments();
  const emailLogs = store.getEmailLogs();
  const auditLogs = store.getAuditLogs();
  const cocCertificates = store.getSansCocs();

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus({
        lastSynced: new Date().toLocaleTimeString(),
        rowCount: requests.length + sites.length + photos.length + reports.length + auditLogs.length,
        status: 'Operational & Synchronized'
      });
    }, 800);
  };

  const handleExportCsv = () => {
    let rows: any[] = [];
    if (activeTabId === 'requests') rows = requests;
    else if (activeTabId === 'coc_certificates') rows = cocCertificates;
    else if (activeTabId === 'sites') rows = sites;
    else if (activeTabId === 'reports') rows = reports;
    else if (activeTabId === 'evidence_photos') rows = photos;
    else if (activeTabId === 'email_logs') rows = emailLogs;
    else rows = auditLogs;

    const csvContent = "data:text/csv;charset=utf-8," + 
      (rows.length > 0 ? Object.keys(rows[0]).join(",") + "\n" + rows.map(r => Object.values(r).map(v => typeof v === 'object' ? JSON.stringify(v).replace(/,/g, ';') : `"${v}"`).join(",")).join("\n") : "Empty");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AFE-Sheets-Export-${activeTabId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCocs = cocCertificates.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.cocNumber.toLowerCase().includes(q) ||
      c.siteName.toLowerCase().includes(q) ||
      c.clientName.toLowerCase().includes(q) ||
      c.commissionerName.toLowerCase().includes(q) ||
      c.systemCategory.toLowerCase().includes(q)
    );
  });

  const handleToggleCocForBatch = (cocId: string) => {
    setSelectedDocIdsForBatch(prev => {
      const next = new Set(prev);
      const docId = `coc-${cocId}`;
      if (next.has(docId)) {
        next.delete(docId);
      } else {
        next.add(docId);
      }
      return next;
    });
  };

  const handleToggleSelectAllCocsForBatch = () => {
    const allIds = filteredCocs.map(c => `coc-${c.id}`);
    const allSelected = allIds.every(id => selectedDocIdsForBatch.has(id));
    setSelectedDocIdsForBatch(prev => {
      const next = new Set(prev);
      if (allSelected) {
        allIds.forEach(id => next.delete(id));
      } else {
        allIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-7 rounded-3xl bg-[#151518] border border-white/5 shadow-2xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
                Operations & CMS Administration
              </span>
              <span className="text-[9px] bg-[#0A0A0B] text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                1-Way Live Mirror Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Google Sheets Live Sync & Operations Hub
            </h1>
            <p className="text-xs text-white/50 font-mono">
              14 Synchronised Data Tabs | AWS ECS Fargate & S3 Storage Connected
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* New COC Workflow Action */}
            <button
              onClick={() => {
                setSelectedCocId('new');
                setCocModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-[#C1A461] to-[#A88B46] hover:from-[#D4BC7B] hover:to-[#C1A461] text-black text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#C1A461]/20 transition flex items-center gap-2 cursor-pointer"
              title="Authorized SAQCC SANS 10139 Commissioner Module"
            >
              <Award className="w-4 h-4 text-black" />
              <span>Begin New COC</span>
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('certificate-of-compliance')}
                className="px-3.5 py-2.5 bg-[#0A0A0B] hover:bg-[#1E1E22] text-[#C1A461] border border-[#C1A461]/30 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Navigate directly to SANS 10139 Certificate of Compliance Route"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#C1A461]" />
                <span>COC Route</span>
              </button>
            )}

            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 bg-[#0A0A0B] hover:bg-[#1E1E22] text-white/80 border border-white/5 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#C1A461]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="px-5 py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Live with Google Sheets'}</span>
            </button>
          </div>
        </div>

        {/* SAQCC SANS 10139 Commissioner Portal Banner */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#18181D] via-[#141417] to-[#0E0E11] border border-[#C1A461]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C1A461]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center flex-wrap gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/40 font-mono uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#C1A461]" />
                  SAQCC SANS 10139 Commissioner Module
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono uppercase">
                  Authorized Commissioner Access
                </span>
                <span className="text-white/40 text-xs font-mono">
                  {cocCertificates.length} Total Certificates ({cocCertificates.filter(c => c.certificateStatus === 'Issued').length} Issued &middot; {cocCertificates.filter(c => c.certificateStatus === 'Draft').length} Draft)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>SANS 10139 Certificate of Compliance (COC) Workflows</span>
              </h2>
              <p className="text-xs text-white/60 leading-relaxed font-sans">
                Legally mandated compliance generator mapping client, premises, control panel specs, and physical commissioning test results. Enforces statutory standby battery autonomy (&ge;24h + 30min evacuation), sounder audibility (&ge;65 dB(A)), detector spacing, and dual client handover signatures with automatic DRAFT-state watermarking for incomplete submissions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setSelectedCocId('new');
                  setCocModalOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-xl shadow-[#C1A461]/20 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Begin New Certificate Workflow</span>
              </button>

              {onNavigate && (
                <>
                  <button
                    onClick={() => onNavigate('safety-file-dashboard')}
                    className="px-4 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
                    title="Open Statutory Safety File Dossiers & Approval Matrix"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Safety Files</span>
                  </button>
                  <button
                    onClick={() => onNavigate('compliance-audit-log')}
                    className="px-4 py-3 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/40 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
                    title="Open Immutable SANS 10139 Compliance Audit Ledger"
                  >
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span>Audit Ledger</span>
                  </button>
                  <button
                    onClick={() => onNavigate('certificate-of-compliance')}
                    className="px-4 py-3 rounded-2xl bg-[#151518] hover:bg-[#1E1E22] text-[#C1A461] border border-[#C1A461]/40 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
                    title="Open Dedicated Full-Screen COC Commissioner Route"
                  >
                    <ExternalLink className="w-4 h-4 text-[#C1A461]" />
                    <span>COC Route</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setActiveTabId('coc_certificates')}
                className={`px-4 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider border transition cursor-pointer ${
                  activeTabId === 'coc_certificates'
                    ? 'bg-white/15 text-white border-white/30'
                    : 'bg-[#0E0E11] text-white/70 hover:text-white border-white/10'
                }`}
              >
                <span>View COC Register ({cocCertificates.length})</span>
              </button>

              <button
                onClick={() => setActiveTabId('watermark_utility')}
                className={`px-4 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider border transition cursor-pointer flex items-center gap-2 ${
                  activeTabId === 'watermark_utility'
                    ? 'bg-[#C1A461] text-[#0B1C44] border-[#C1A461] shadow-lg shadow-[#C1A461]/20'
                    : 'bg-[#0B1C44] text-[#C1A461] hover:bg-[#122452] border-[#C1A461]/40'
                }`}
                title="Launch Server-Side PDF Watermarking Engine (Dynamic Status-Driven)"
              >
                <Server className="w-4 h-4 text-[#C1A461]" />
                <span>Watermark Engine</span>
              </button>

              <button
                onClick={() => setActiveTabId('batch_dispatch')}
                className={`px-4 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider border transition cursor-pointer flex items-center gap-2 ${
                  activeTabId === 'batch_dispatch'
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/20'
                    : 'bg-red-950/40 text-red-300 hover:bg-red-900/50 border-red-800/60'
                }`}
                title="Launch Batch Compliance Document Processing & Bulk Email Utility"
              >
                <Mail className="w-4 h-4 text-red-400" />
                <span>Batch Dispatch Utility</span>
                {selectedDocIdsForBatch.size > 0 && (
                  <span className="px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px] font-bold">
                    {selectedDocIdsForBatch.size}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sync Status Banner */}
        <div className="p-4 rounded-2xl bg-[#151518] border border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{syncStatus.status}</span>
            </div>
            <span className="text-white/20">|</span>
            <span className="text-white/60">Last Synced: <strong className="text-white">{syncStatus.lastSynced}</strong></span>
            <span className="text-white/20">|</span>
            <span className="text-white/60">Active Sheets: <strong className="text-[#C1A461]">14 Tabs</strong></span>
          </div>

          <div className="text-white/40 text-[11px]">
            Mirror Direction: Application DB → Google Sheets (Read-Only Mirror)
          </div>
        </div>

        {/* 14 Tabs Navigation Carousel */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-white/40 uppercase tracking-[1.5px]">
            Select Google Sheets Mirror Tab:
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {ADMIN_SHEET_TABS.map((tab) => (
              <button
                key={tab.tabId}
                onClick={() => setActiveTabId(tab.tabId)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                  activeTabId === tab.tabId
                    ? 'bg-[#C1A461] text-black shadow-md'
                    : 'bg-[#151518] text-white/50 hover:text-white border border-white/5'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{tab.tabName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Data Table */}
        <div className="p-7 rounded-3xl bg-[#151518] border border-white/5 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-bold text-sm text-white">
              Tab View: {ADMIN_SHEET_TABS.find(t => t.tabId === activeTabId)?.tabName}
            </h3>

            <div className="w-full sm:w-64 relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter table rows..."
                className="w-full pl-9 pr-3.5 py-2 bg-[#0A0A0B] border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:border-[#C1A461] outline-none"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0A0A0B]">
            {activeTabId === 'requests' && (
              <table className="w-full text-left text-xs text-white/70">
                <thead className="bg-[#151518] text-white/50 uppercase text-[10px] font-mono border-b border-white/5">
                  <tr>
                    <th className="p-3.5">Req ID</th>
                    <th className="p-3.5">Client / Organisation</th>
                    <th className="p-3.5">Site Location</th>
                    <th className="p-3.5">Service</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Stage</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                  {requests.map(r => (
                    <tr key={r.id} className="hover:bg-[#151518] transition">
                      <td className="p-3.5 font-bold text-[#C1A461]">{r.referenceNumber}</td>
                      <td className="p-3.5 text-white">{r.clientName} ({r.organisationName})</td>
                      <td className="p-3.5 text-white/60">{r.siteName}</td>
                      <td className="p-3.5 text-white font-sans">{r.serviceTitle}</td>
                      <td className="p-3.5 text-[#C1A461] font-bold">Category {r.systemCategoryTarget || 'SANS 10139'}</td>
                      <td className="p-3.5 text-white/80 font-bold">Stage {r.currentStage || 1}/7</td>
                      <td className="p-3.5 uppercase text-emerald-400 font-bold">{r.status}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => setSelectedRowData(r)}
                          className="text-[#C1A461] hover:underline text-[10px] cursor-pointer font-bold"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTabId === 'coc_certificates' && (
              <div className="space-y-4">
                <div className="p-3.5 bg-[#0E0E11] border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                    <Award className="w-4 h-4 text-[#C1A461]" />
                    <span>Statutory SANS 10139 Fire Detection Register</span>
                    <span className="text-white/20">&bull;</span>
                    <span className="text-white/50">{filteredCocs.length} records found</span>
                    {selectedDocIdsForBatch.size > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold">
                        {selectedDocIdsForBatch.size} selected for bulk dispatch
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedDocIdsForBatch.size > 0 && (
                      <button
                        onClick={() => setActiveTabId('batch_dispatch')}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-red-600/30 animate-pulse"
                        title="Process selected certificates in Batch Email Utility"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Bulk Email ({selectedDocIdsForBatch.size})</span>
                      </button>
                    )}

                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('certificate-of-compliance')}
                        className="px-3 py-1.5 bg-[#1A1A1E] hover:bg-[#25252A] text-[#C1A461] border border-[#C1A461]/30 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                        title="Open Dedicated Full-Screen COC Commissioner Route"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#C1A461]" />
                        <span>Dedicated Route</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedCocId('new');
                        setCocModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-[#C1A461]/20"
                    >
                      <Plus className="w-3.5 h-3.5 text-black" />
                      <span>Begin New COC</span>
                    </button>
                  </div>
                </div>

                <table className="w-full text-left text-xs text-white/70">
                  <thead className="bg-[#151518] text-white/50 uppercase text-[10px] font-mono border-b border-white/5">
                    <tr>
                      <th className="p-3.5 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={filteredCocs.length > 0 && filteredCocs.every(c => selectedDocIdsForBatch.has(`coc-${c.id}`))}
                          onChange={handleToggleSelectAllCocsForBatch}
                          className="w-4 h-4 rounded bg-[#0A0A0B] border-white/20 text-red-600 focus:ring-red-500 cursor-pointer"
                          title="Select / deselect all filtered certificates"
                        />
                      </th>
                      <th className="p-3.5">COC Number</th>
                      <th className="p-3.5">Premises &amp; Client</th>
                      <th className="p-3.5">Category &amp; Type</th>
                      <th className="p-3.5">Registered Commissioner</th>
                      <th className="p-3.5">Physical Tests</th>
                      <th className="p-3.5">Compliance Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                    {filteredCocs.map(coc => {
                      const isIssued = coc.certificateStatus === 'Issued';
                      const isSelected = selectedDocIdsForBatch.has(`coc-${coc.id}`);
                      return (
                        <tr 
                          key={coc.id} 
                          className={`transition ${isSelected ? 'bg-red-950/20' : 'hover:bg-[#151518]'}`}
                        >
                          <td className="p-3.5 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleCocForBatch(coc.id)}
                              className="w-4 h-4 rounded bg-[#0A0A0B] border-white/20 text-red-600 focus:ring-red-500 cursor-pointer"
                              title={`Select COC ${coc.cocNumber} for bulk email dispatch`}
                            />
                          </td>
                          <td className="p-3.5 font-bold text-[#C1A461]">
                            {coc.cocNumber}
                            <div className="text-[9px] text-white/40 font-mono">
                              {coc.issueDate ? new Date(coc.issueDate).toLocaleDateString() : 'Draft In Progress'}
                            </div>
                          </td>
                          <td className="p-3.5 text-white">
                            <div className="font-bold">{coc.siteName}</div>
                            <div className="text-[10px] text-white/50 truncate max-w-xs">{coc.siteAddress}</div>
                            <div className="text-[9px] text-[#C1A461]/80 mt-0.5">{coc.organisationName || coc.clientName}</div>
                          </td>
                          <td className="p-3.5 text-[#C1A461] font-bold">
                            Category {coc.systemCategory}
                            <div className="text-[9px] text-white/50 font-normal">
                              {coc.systemObjective || 'Life & Property'}
                            </div>
                          </td>
                          <td className="p-3.5 text-white/80">
                            <div>{coc.commissionerName}</div>
                            <div className="text-[9px] text-white/40 font-mono">{coc.commissionerSaqccNumber}</div>
                          </td>
                          <td className="p-3.5 text-white/60">
                            <div className="flex items-center gap-1.5">
                              <span className="text-emerald-400 font-bold">&check;</span>
                              <span>Standby: {coc.powerSupplyAutonomy?.standbyAutonomyHours ?? 24}h</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                              <span className="text-emerald-400 font-bold">&check;</span>
                              <span>Sounder: &ge;65 dB(A)</span>
                            </div>
                          </td>
                          <td className="p-3.5">
                            {isIssued ? (
                              <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                ISSUED &amp; LOCKED
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider inline-flex items-center gap-1 animate-pulse">
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                DRAFT (PENDING)
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedCocId(coc.id);
                                  setCocModalOpen(true);
                                }}
                                className="px-2.5 py-1 bg-[#0A0A0B] hover:bg-[#1E1E22] text-[#C1A461] border border-[#C1A461]/30 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                                title={isIssued ? "Inspect official issued certificate" : "Edit / Resume statutory draft"}
                              >
                                <PenTool className="w-3 h-3" />
                                <span>{isIssued ? 'Inspect' : 'Edit Draft'}</span>
                              </button>
                              <button
                                onClick={() => setSelectedCocForEmail(coc)}
                                className="px-2 py-1 bg-[#0A0A0B] hover:bg-[#1E1E22] text-[#C1A461] border border-[#C1A461]/30 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                                title="Dispatch SANS 10139 COC PDF to Client & Safety Officer via Email"
                              >
                                <Mail className="w-3 h-3" />
                                <span>Email</span>
                              </button>
                              <button
                                onClick={() => setActiveTabId('watermark_utility')}
                                className="px-2 py-1 bg-[#0B1C44] hover:bg-[#122452] text-[#C1A461] border border-[#C1A461]/40 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1"
                                title="Server-Side PDF Watermarking Engine (Dynamic Status)"
                              >
                                <Server className="w-3 h-3 text-[#C1A461]" />
                                <span>Watermark</span>
                              </button>
                              <button
                                onClick={() => setSelectedCocForExport(coc)}
                                className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg text-[10px] transition cursor-pointer"
                                title="Download Locked SANS 10139 PDF with DRAFT or ISSUED watermark"
                              >
                                <Download className="w-3 h-3 text-[#C1A461]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredCocs.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-white/40 font-mono">
                          No certificates match the filter. Click "Begin New COC" above to launch a new SANS 10139 certificate workflow.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {selectedDocIdsForBatch.size > 0 && (
                  <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center justify-between gap-4 font-mono text-xs">
                    <div className="flex items-center gap-2 text-red-200">
                      <Mail className="w-4 h-4 text-red-400" />
                      <span><strong>{selectedDocIdsForBatch.size}</strong> certificates selected for statutory bulk dispatch</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedDocIdsForBatch(new Set())}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded-lg text-xs transition cursor-pointer"
                      >
                        Clear Selection
                      </button>
                      <button
                        onClick={() => setActiveTabId('batch_dispatch')}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-red-600/30"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Launch Batch Email Utility</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTabId === 'watermark_utility' && (
              <div className="p-2 sm:p-4 bg-[#0A0A0B]">
                <ServerWatermarkUtility
                  onClose={() => setActiveTabId('coc_certificates')}
                />
              </div>
            )}

            {activeTabId === 'batch_dispatch' && (
              <div className="p-2 sm:p-4 bg-[#0A0A0B]">
                <BatchComplianceDispatchUtility
                  initialSelectedDocIds={Array.from(selectedDocIdsForBatch)}
                  onNavigateToEmailLogs={() => setActiveTabId('email_logs')}
                  onNavigateToAuditTrail={() => setActiveTabId('audit_trail')}
                  onCancel={() => setActiveTabId('coc_certificates')}
                />
              </div>
            )}

            {activeTabId === 'reports' && (
              <table className="w-full text-left text-xs text-white/70">
                <thead className="bg-[#151518] text-white/50 uppercase text-[10px] font-mono border-b border-white/5">
                  <tr>
                    <th className="p-3.5">Report Number</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Version</th>
                    <th className="p-3.5">Site</th>
                    <th className="p-3.5">Engineer</th>
                    <th className="p-3.5">Generated Date</th>
                    <th className="p-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                  {reports.map(rep => (
                    <tr key={rep.id} className="hover:bg-[#151518] transition">
                      <td className="p-3.5 font-bold text-[#C1A461]">{rep.reportNumber}</td>
                      <td className="p-3.5 uppercase font-bold text-amber-400">{rep.reportType}</td>
                      <td className="p-3.5 text-white/80">v{rep.version}</td>
                      <td className="p-3.5 text-white font-sans">{rep.siteName}</td>
                      <td className="p-3.5 text-white/60">{rep.generatedBy}</td>
                      <td className="p-3.5 text-white/60">{new Date(rep.generatedAt).toLocaleDateString()}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => setSelectedRowData(rep)}
                          className="text-[#C1A461] hover:underline text-[10px] cursor-pointer font-bold"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTabId === 'email_logs' && (
              <table className="w-full text-left text-xs text-white/70">
                <thead className="bg-[#151518] text-white/50 uppercase text-[10px] font-mono border-b border-white/5">
                  <tr>
                    <th className="p-3.5">Log ID</th>
                    <th className="p-3.5">Recipient</th>
                    <th className="p-3.5">Subject</th>
                    <th className="p-3.5">Attachment</th>
                    <th className="p-3.5">Sent Timestamp</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                  {emailLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[#151518] transition">
                      <td className="p-3.5 font-bold text-[#C1A461]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{log.id}</span>
                          {log.correlationId?.startsWith('batch_') && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-600/30 text-red-300 border border-red-500/40 uppercase tracking-wider font-sans font-bold">
                              Batch Bulk
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5 text-white">{log.to || log.recipientEmail}</td>
                      <td className="p-3.5 text-white font-sans">{log.subject}</td>
                      <td className="p-3.5">
                        {log.hasAttachment ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/30 flex items-center gap-1 w-fit">
                            <FileText className="w-3 h-3" />
                            <span className="truncate max-w-[140px]">{log.attachmentName || 'PDF Attachment'}</span>
                          </span>
                        ) : (
                          <span className="text-white/30">—</span>
                        )}
                      </td>
                      <td className="p-3.5 text-white/60">{new Date(log.sentAt).toLocaleTimeString()}</td>
                      <td className="p-3.5 uppercase font-bold text-emerald-400">{log.status || log.deliveryStatus}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedRowData(log)}
                          className="text-[#C1A461] hover:underline text-[10px] cursor-pointer font-bold"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTabId === 'audit_trail' && (
              <table className="w-full text-left text-xs text-white/70">
                <thead className="bg-[#151518] text-white/50 uppercase text-[10px] font-mono border-b border-white/5">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Actor</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Entity</th>
                    <th className="p-3.5">IP / Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                  {auditLogs.map(al => (
                    <tr key={al.id} className="hover:bg-[#151518] transition">
                      <td className="p-3.5 text-white/50">{new Date(al.timestamp).toLocaleTimeString()}</td>
                      <td className="p-3.5 text-white font-bold">{al.actorName || al.actor}</td>
                      <td className="p-3.5 uppercase text-white/50">{al.actorRole}</td>
                      <td className="p-3.5 text-[#C1A461]">{al.action}</td>
                      <td className="p-3.5 text-white/80">{al.entityType || al.recordType} ({al.entityId || al.recordId})</td>
                      <td className="p-3.5 text-white/40">{al.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* System & Architecture Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#C1A461] font-bold">
              <Server className="w-4 h-4" />
              <span>AWS ECS Fargate Cluster</span>
            </div>
            <div className="text-white/60 space-y-1 text-[11px]">
              <div>Region: <span className="text-white">af-south-1 (Cape Town)</span></div>
              <div>Tasks: <span className="text-emerald-400">2 Running (100% Healthy)</span></div>
              <div>CPU / Memory: <span className="text-white">12% / 28% Nominal</span></div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Database className="w-4 h-4" />
              <span>RDS PostgreSQL & Redis</span>
            </div>
            <div className="text-white/60 space-y-1 text-[11px]">
              <div>Engine: <span className="text-white">PostgreSQL 16 (Multi-AZ)</span></div>
              <div>Celery Queue: <span className="text-emerald-400">0 Tasks Pending</span></div>
              <div>Backup Snapshot: <span className="text-white">Automated Daily</span></div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Activity className="w-4 h-4" />
              <span>Prometheus / S3 Metrics</span>
            </div>
            <div className="text-white/60 space-y-1 text-[11px]">
              <div>Uptime: <span className="text-emerald-400">99.98%</span></div>
              <div>Evidence S3 Bucket: <span className="text-white">Encrypted KMS</span></div>
              <div>SANS 10139 Compliance Engine: <span className="text-emerald-400">Active</span></div>
            </div>
          </div>
        </div>

        {/* Official SANS 10139 Commissioner COC Form Modal */}
        <CertificateOfComplianceForm
          isOpen={cocModalOpen}
          onClose={() => {
            setCocModalOpen(false);
            setSelectedCocId(undefined);
          }}
          existingCocId={selectedCocId}
          onSaved={() => {
            setCocModalOpen(false);
            setSelectedCocId(undefined);
          }}
        />

        {/* SANS 10139 COC Email Dispatch Modal */}
        {selectedCocForEmail && (
          <CocEmailModal
            isOpen={!!selectedCocForEmail}
            onClose={() => setSelectedCocForEmail(null)}
            coc={selectedCocForEmail}
            onSuccess={() => setSelectedCocForEmail(null)}
          />
        )}

        {/* Row Detail / Audit Inspection Modal */}
        {selectedRowData && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#151518] border border-white/10 rounded-2xl w-full max-w-2xl text-white shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-[#C1A461] flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>Audit Record Inspection</span>
                </h3>
                <button
                  onClick={() => setSelectedRowData(null)}
                  className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/5"
                >
                  ✕
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto space-y-3 text-xs font-mono">
                {selectedRowData.subject ? (
                  <div className="space-y-2">
                    <div><span className="text-white/40">Subject:</span> <span className="text-white font-bold">{selectedRowData.subject}</span></div>
                    <div><span className="text-white/40">Recipient:</span> <span className="text-emerald-400">{selectedRowData.to || selectedRowData.recipientEmail}</span></div>
                    <div><span className="text-white/40">Delivery Timestamp:</span> <span className="text-white">{selectedRowData.sentAt}</span></div>
                    <div><span className="text-white/40">Status:</span> <span className="text-emerald-400 uppercase font-bold">{selectedRowData.deliveryStatus || selectedRowData.status}</span></div>
                    {selectedRowData.attachmentName && (
                      <div><span className="text-white/40">Attachment:</span> <span className="text-[#C1A461] font-bold">{selectedRowData.attachmentName}</span></div>
                    )}
                    {selectedRowData.correlationId && (
                      <div><span className="text-white/40">Correlation ID:</span> <span className="text-white/60">{selectedRowData.correlationId}</span></div>
                    )}
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-white/40 mb-1">Body / Checksum &amp; Audit Trail:</div>
                      <pre className="p-3 bg-black/50 border border-white/5 rounded-xl text-[11px] text-white/80 whitespace-pre-wrap leading-relaxed font-mono">
                        {selectedRowData.bodyText}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <pre className="p-3 bg-black/50 border border-white/5 rounded-xl text-[11px] text-white/80 whitespace-pre-wrap">
                    {JSON.stringify(selectedRowData, null, 2)}
                  </pre>
                )}
              </div>
              <div className="flex justify-end pt-2 border-t border-white/10">
                <button
                  onClick={() => setSelectedRowData(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-mono font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Locked PDF Export Modal */}
        {selectedCocForExport && (
          <CocPdfExportModal
            isOpen={Boolean(selectedCocForExport)}
            onClose={() => setSelectedCocForExport(null)}
            coc={selectedCocForExport}
            defaultIsDraft={selectedCocForExport.certificateStatus !== 'Issued' || !selectedCocForExport.isSigned}
          />
        )}
      </div>
    </div>
  );
};
