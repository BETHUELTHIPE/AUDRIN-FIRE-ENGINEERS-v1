import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  Download,
  ExternalLink,
  RefreshCw,
  Upload,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  Sliders,
  Database,
  ArrowRight,
  Eye,
  FileCheck,
  Server
} from 'lucide-react';
import {
  ServerWatermarkService,
  ServerDocument,
  StatutoryStatus,
  BatchWatermarkResponse
} from '../../services/serverWatermarkService';

interface ServerWatermarkUtilityProps {
  onClose?: () => void;
  initialDocumentId?: string;
}

export const ServerWatermarkUtility: React.FC<ServerWatermarkUtilityProps> = ({
  onClose,
  initialDocumentId
}) => {
  const [documents, setDocuments] = useState<ServerDocument[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    issued: number;
    draft: number;
    cocs: number;
    reports: number;
    dossiers: number;
  }>({ total: 0, issued: 0, draft: 0, cocs: 0, reports: 0, dossiers: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDocId, setSelectedDocId] = useState<string>(initialDocumentId || 'coc-01');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [previewOverrideStatus, setPreviewOverrideStatus] = useState<StatutoryStatus | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'sandbox' | 'batch'>('matrix');

  // Custom PDF Upload Sandbox state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [sandboxStatus, setSandboxStatus] = useState<StatutoryStatus>('Draft');
  const [sandboxProcessing, setSandboxProcessing] = useState<boolean>(false);
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  // Batch Processing state
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [batchProcessing, setBatchProcessing] = useState<boolean>(false);
  const [batchResult, setBatchResult] = useState<BatchWatermarkResponse | null>(null);

  // Health and Diagnostics
  const [serverHealth, setServerHealth] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 29)
    ]);
  };

  const loadDatabaseDocuments = async () => {
    try {
      setLoading(true);
      const data = await ServerWatermarkService.getDocuments();
      setDocuments(data.documents);
      setStats(data.stats);
      addLog(`Loaded ${data.documents.length} compliance documents from server database.`);
      
      const health = await ServerWatermarkService.checkHealth().catch(() => null);
      setServerHealth(health);

      if (!selectedDocId && data.documents.length > 0) {
        setSelectedDocId(data.documents[0].id);
      }
    } catch (err: any) {
      addLog(`ERROR: Failed to connect to server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseDocuments();
  }, []);

  const selectedDocument = documents.find(d => d.id === selectedDocId) || documents[0];

  const handleToggleStatus = async (doc: ServerDocument) => {
    const newStatus: StatutoryStatus = doc.status === 'Draft' ? 'Issued' : 'Draft';
    setUpdatingId(doc.id);
    addLog(`POST /api/documents/${doc.id}/status -> Setting status to '${newStatus}'`);

    try {
      const res = await ServerWatermarkService.updateStatus(
        doc.id,
        newStatus,
        `User toggled status via Server Watermark Utility`
      );

      // Update local state
      setDocuments(prev => prev.map(d => d.id === doc.id ? res.document : d));
      setStats(prev => ({
        ...prev,
        draft: newStatus === 'Draft' ? prev.draft + 1 : prev.draft - 1,
        issued: newStatus === 'Issued' ? prev.issued + 1 : prev.issued - 1
      }));

      addLog(`Document ${doc.documentNumber} updated to '${newStatus}'. Watermark dynamically transitioned to '${newStatus.toUpperCase()}'.`);
      setPreviewOverrideStatus(null);
    } catch (err: any) {
      addLog(`Update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCustomPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a valid PDF file.');
        return;
      }
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        const resultStr = reader.result as string;
        // Strip base64 header if present
        const base64 = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;
        setUploadedBase64(base64);
        addLog(`Loaded local PDF file: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessSandboxWatermark = async () => {
    if (!uploadedBase64) return;
    setSandboxProcessing(true);
    addLog(`POST /api/pdf/watermark -> Applying server-side ${sandboxStatus.toUpperCase()} watermark overlay`);

    try {
      const res = await ServerWatermarkService.requestWatermark({
        pdfBase64: uploadedBase64,
        overrideStatus: sandboxStatus,
        customNote: `Custom Sandbox Stamping • Status: ${sandboxStatus}`
      });

      setSandboxResult(res);
      addLog(`Successfully watermarked "${uploadedFile?.name}" in ${res.result.latencyMs}ms. Checksum: ${res.result.sha256Checksum.slice(0, 16)}...`);
    } catch (err: any) {
      addLog(`Sandbox watermarking failed: ${err.message}`);
    } finally {
      setSandboxProcessing(false);
    }
  };

  const handleRunBatch = async () => {
    const targetIds = selectedBatchIds.length > 0 ? selectedBatchIds : documents.map(d => d.id);
    setBatchProcessing(true);
    addLog(`POST /api/pdf/batch-watermark -> Stamping ${targetIds.length} documents from database`);

    try {
      const res = await ServerWatermarkService.batchWatermark(targetIds);
      setBatchResult(res);
      addLog(`Batch complete! Stamped ${res.totalDocuments} documents (${res.issuedCount} ISSUED, ${res.draftCount} DRAFT)`);
    } catch (err: any) {
      addLog(`Batch watermark failed: ${err.message}`);
    } finally {
      setBatchProcessing(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesType = filterType === 'ALL' || doc.documentType === filterType;
    const matchesSearch =
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const effectiveStatus = previewOverrideStatus || selectedDocument?.status || 'Draft';
  const previewPdfUrl = selectedDocument
    ? ServerWatermarkService.getRenderPdfUrl(selectedDocument.id, previewOverrideStatus || undefined)
    : '';

  return (
    <div className="bg-[#0B1C44] border border-[#C1A461]/30 rounded-xl text-white shadow-2xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#07122E] via-[#0B1C44] to-[#122452] p-6 border-b border-[#C1A461]/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#C1A461]/20 border border-[#C1A461] flex items-center justify-center text-[#C1A461] shadow-inner">
              <Server className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Server-Side PDF Watermarking Engine
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Dynamic DB-Driven
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Automatically inspects document status in the database to stamp authoritative <strong className="text-emerald-400">ISSUED</strong> compliance seals or warning <strong className="text-rose-400">DRAFT</strong> watermarks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadDatabaseDocuments}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync DB
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Total Documents</span>
              <Database className="w-4 h-4 text-[#C1A461]" />
            </div>
            <div className="text-xl font-bold text-white mt-1">{stats.total}</div>
            <span className="text-[10px] text-white/40">Registered in server DB</span>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-300/80">Issued Documents</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-300 mt-1">{stats.issued}</div>
            <span className="text-[10px] text-emerald-400/60">Overlay: ISSUED (Green Seal)</span>
          </div>

          <div className="bg-rose-950/30 border border-rose-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-300/80">Draft Documents</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl font-bold text-rose-300 mt-1">{stats.draft}</div>
            <span className="text-[10px] text-rose-400/60">Overlay: DRAFT (Warning Red)</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Engine Latency</span>
              <Clock className="w-4 h-4 text-[#C1A461]" />
            </div>
            <div className="text-xl font-bold text-[#C1A461] mt-1">~12 ms</div>
            <span className="text-[10px] text-white/40">pdf-lib Vector Stamping</span>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 mt-5 border-b border-white/10 pb-1">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'bg-[#C1A461] text-[#0B1C44]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Database Documents & Live Watermark Matrix
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'sandbox'
                ? 'bg-[#C1A461] text-[#0B1C44]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Custom PDF Upload & Watermark Tester
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'batch'
                ? 'bg-[#C1A461] text-[#0B1C44]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Batch Server Watermarking Utility
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6">
        {activeTab === 'matrix' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Document Register Table */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white/70">Filter:</span>
                  {(['ALL', 'SANS_10139_COC', 'CONDITION_REPORT', 'SAFETY_DOSSIER'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                        filterType === type
                          ? 'bg-[#C1A461] text-[#0B1C44] font-bold'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {type === 'ALL' ? 'All Records' : type.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Search ref or site..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="px-3 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#C1A461]"
                />
              </div>

              {/* Table */}
              <div className="bg-[#07122E]/70 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-white/70 font-semibold border-b border-white/10">
                      <tr>
                        <th className="p-3">Document / Site</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Database Status</th>
                        <th className="p-3">Dynamic Watermark</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredDocuments.map(doc => {
                        const isSelected = selectedDocument?.id === doc.id;
                        const isDocUpdating = updatingId === doc.id;
                        return (
                          <tr
                            key={doc.id}
                            onClick={() => {
                              setSelectedDocId(doc.id);
                              setPreviewOverrideStatus(null);
                            }}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#C1A461]/15 border-l-4 border-[#C1A461]'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <td className="p-3">
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-[#C1A461]" />
                                {doc.documentNumber}
                              </div>
                              <div className="text-[11px] text-white/60 truncate max-w-[220px]">
                                {doc.siteName}
                              </div>
                            </td>
                            <td className="p-3 text-[11px] text-white/70">
                              <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                                {doc.documentType.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStatus(doc);
                                }}
                                disabled={isDocUpdating}
                                title="Click to toggle status in database"
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all flex items-center gap-1.5 ${
                                  doc.status === 'Issued'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                                }`}
                              >
                                {isDocUpdating ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : doc.status === 'Issued' ? (
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                                )}
                                {doc.status.toUpperCase()}
                              </button>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    doc.status === 'Issued' ? 'bg-emerald-400' : 'bg-rose-400'
                                  }`}
                                />
                                <span
                                  className={`font-semibold text-[11px] ${
                                    doc.status === 'Issued' ? 'text-emerald-300' : 'text-rose-300'
                                  }`}
                                >
                                  {doc.status === 'Issued' ? 'ISSUED WATERMARK' : 'DRAFT WATERMARK'}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => {
                                    setSelectedDocId(doc.id);
                                    setPreviewOverrideStatus(null);
                                  }}
                                  className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white"
                                  title="View Live PDF"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <a
                                  href={ServerWatermarkService.getRenderPdfUrl(doc.id)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded hover:bg-white/10 text-[#C1A461] hover:text-white"
                                  title="Open in new tab"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={ServerWatermarkService.getRenderPdfUrl(doc.id)}
                                  download={`${doc.documentNumber}_${doc.status}.pdf`}
                                  className="p-1.5 rounded hover:bg-white/10 text-emerald-400 hover:text-white"
                                  title="Download PDF"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status explanation & Database sync explanation */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/80 space-y-2">
                <div className="flex items-center gap-2 text-[#C1A461] font-semibold">
                  <Database className="w-4 h-4" />
                  Dynamic Server-Side Database Watermark Logic
                </div>
                <p>
                  Clicking the status badge on any row calls <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200">POST /api/documents/:id/status</code>, immediately updating the statutory state. The PDF streaming endpoint (<code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200">/api/pdf/render/:id</code>) and watermarking utility will dynamically overlay:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="bg-rose-950/20 border border-rose-500/20 rounded p-2.5">
                    <div className="font-bold text-rose-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      When Status = 'Draft':
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-white/70 mt-1 space-y-0.5">
                      <li>Prominent 42° diagonal crimson watermark</li>
                      <li>Top warning ribbon: Not valid for occupation</li>
                      <li>Corner unissued provisional badge</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded p-2.5">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      When Status = 'Issued':
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-white/70 mt-1 space-y-0.5">
                      <li>Official 42° emerald green compliance watermark</li>
                      <li>Top SAQCC Commissioner accreditation banner</li>
                      <li>Tamper-protected non-editable digital lock strip</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live PDF Preview & Dynamic Watermark Inspector */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              {selectedDocument ? (
                <div className="bg-[#07122E] border border-[#C1A461]/30 rounded-xl p-4 flex flex-col h-full shadow-lg">
                  {/* Preview Toolbar */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <div className="text-xs text-white/60">Live Server PDF Preview</div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        {selectedDocument.documentNumber}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={previewPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 text-[11px] rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Tab
                      </a>
                      <a
                        href={previewPdfUrl}
                        download={`${selectedDocument.documentNumber}_${effectiveStatus}.pdf`}
                        className="px-2.5 py-1 text-[11px] rounded bg-[#C1A461] hover:bg-[#b09351] text-[#0B1C44] font-bold flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download PDF
                      </a>
                    </div>
                  </div>

                  {/* Active Watermark Indicator Card */}
                  <div className={`my-3 p-3 rounded-lg border ${
                    effectiveStatus === 'Issued'
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {effectiveStatus === 'Issued' ? (
                          <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <ShieldAlert className="w-5 h-5 text-rose-400" />
                        )}
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider">
                            {effectiveStatus === 'Issued'
                              ? 'Active Watermark: OFFICIALLY ISSUED'
                              : 'Active Watermark: DRAFT PROVISIONAL'}
                          </div>
                          <div className="text-[10px] text-white/70">
                            Database Status: <strong className="text-white">{selectedDocument.status}</strong>
                            {previewOverrideStatus && (
                              <span className="ml-1 text-amber-300 font-semibold">
                                (Simulated Override: {previewOverrideStatus})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Simulation Override Button */}
                      <button
                        onClick={() => {
                          setPreviewOverrideStatus(
                            previewOverrideStatus === null
                              ? selectedDocument.status === 'Draft' ? 'Issued' : 'Draft'
                              : null
                          );
                        }}
                        className="px-2 py-1 text-[10px] rounded bg-white/10 hover:bg-white/20 text-white/90 border border-white/20"
                        title="Simulate opposite watermark without updating database"
                      >
                        {previewOverrideStatus ? 'Reset Real DB' : 'Simulate Opposite'}
                      </button>
                    </div>
                  </div>

                  {/* Embedded PDF iframe */}
                  <div className="relative flex-1 min-h-[420px] bg-slate-900 rounded-lg overflow-hidden border border-white/10">
                    <iframe
                      src={previewPdfUrl}
                      title={`Preview ${selectedDocument.documentNumber}`}
                      className="w-full h-full border-0"
                    />
                  </div>

                  {/* Cryptographic Footprint */}
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
                    <span className="truncate max-w-[280px]">
                      SHA-256: <code className="text-[#C1A461]">{selectedDocument.checksumSha256.slice(0, 24)}...</code>
                    </span>
                    <span className="text-emerald-400 font-medium">Valid SANS 10139 PDF</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-white/50 bg-[#07122E] rounded-xl border border-white/10">
                  Select a document from the register to preview its dynamic watermark.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Custom PDF Upload Sandbox */}
        {activeTab === 'sandbox' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#07122E] border border-white/10 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                  <Upload className="w-4 h-4 text-[#C1A461]" />
                  Upload Custom PDF for Server Watermarking
                </h3>
                <p className="text-xs text-white/70 mb-4">
                  Upload any arbitrary PDF file from your system. The server will dynamically overlay the statutory watermark layer based on your chosen status.
                </p>

                {/* File Dropzone */}
                <label className="border-2 border-dashed border-white/20 hover:border-[#C1A461] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/5">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleCustomPdfUpload}
                    className="hidden"
                  />
                  <FileCheck className="w-10 h-10 text-[#C1A461] mb-2" />
                  <span className="text-xs font-semibold text-white">
                    {uploadedFile ? uploadedFile.name : 'Click to select or drop PDF here'}
                  </span>
                  <span className="text-[10px] text-white/50 mt-1">
                    {uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : 'Supports standard PDF documents'}
                  </span>
                </label>

                {/* Status Selection */}
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-semibold text-white/80">Target Statutory Watermark:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSandboxStatus('Draft')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        sandboxStatus === 'Draft'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        DRAFT WATERMARK
                      </div>
                      <div className="text-[10px] text-white/50 mt-0.5">Warning red diagonal & review banner</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSandboxStatus('Issued')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        sandboxStatus === 'Issued'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        ISSUED WATERMARK
                      </div>
                      <div className="text-[10px] text-white/50 mt-0.5">Statutory green compliance seal & lock</div>
                    </button>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={handleProcessSandboxWatermark}
                  disabled={!uploadedBase64 || sandboxProcessing}
                  className="w-full mt-5 py-2.5 px-4 rounded-lg bg-[#C1A461] hover:bg-[#b09351] text-[#0B1C44] font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {sandboxProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Processing via Server Watermark Engine...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Apply Server Watermark ({sandboxStatus.toUpperCase()})
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sandbox Results */}
            <div className="lg:col-span-6">
              {sandboxResult ? (
                <div className="bg-[#07122E] border border-white/10 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Watermark Stamped Successfully</div>
                        <div className="text-[10px] text-white/60">Server processed in {sandboxResult.result.latencyMs} ms</div>
                      </div>
                    </div>

                    <a
                      href={`data:application/pdf;base64,${sandboxResult.pdfBase64}`}
                      download={sandboxResult.result.filename}
                      className="px-3 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Stamped PDF
                    </a>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white/5 p-2 rounded">
                      <span className="text-[10px] text-white/50 block">Status Applied</span>
                      <strong className={sandboxResult.watermarkApplied === 'ISSUED' ? 'text-emerald-400' : 'text-rose-400'}>
                        {sandboxResult.watermarkApplied}
                      </strong>
                    </div>
                    <div className="bg-white/5 p-2 rounded">
                      <span className="text-[10px] text-white/50 block">Pages Stamped</span>
                      <strong className="text-white">{sandboxResult.result.pageCount} Pages</strong>
                    </div>
                    <div className="bg-white/5 p-2 rounded">
                      <span className="text-[10px] text-white/50 block">Size</span>
                      <strong className="text-white">{(sandboxResult.result.fileSizeBytes / 1024).toFixed(1)} KB</strong>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-lg overflow-hidden border border-white/10 h-[360px]">
                    <iframe
                      src={`data:application/pdf;base64,${sandboxResult.pdfBase64}`}
                      title="Watermarked Sandbox Preview"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-[#07122E]/50 border border-white/10 rounded-xl p-12 text-center text-white/50 h-full flex flex-col items-center justify-center">
                  <Upload className="w-12 h-12 text-white/20 mb-3" />
                  <p className="text-sm font-semibold">Ready to Test Custom PDF</p>
                  <p className="text-xs text-white/40 mt-1 max-w-sm">
                    Select a PDF file on the left and click "Apply Server Watermark" to execute the server-side watermark overlay.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Batch Watermarking Utility */}
        {activeTab === 'batch' && (
          <div className="space-y-5">
            <div className="bg-[#07122E] border border-white/10 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#C1A461]" />
                    Batch Server-Side Watermark Processing
                  </h3>
                  <p className="text-xs text-white/70 mt-1">
                    Select compliance documents to batch watermark. The server will resolve each document's database status and stamp the corresponding <strong className="text-rose-300">DRAFT</strong> or <strong className="text-emerald-300">ISSUED</strong> layer with a batch manifest checksum.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBatchIds(documents.map(d => d.id))}
                    className="px-3 py-1.5 text-xs rounded bg-white/10 hover:bg-white/20 text-white"
                  >
                    Select All ({documents.length})
                  </button>
                  <button
                    onClick={() => setSelectedBatchIds([])}
                    className="px-3 py-1.5 text-xs rounded bg-white/10 hover:bg-white/20 text-white/70"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={handleRunBatch}
                    disabled={batchProcessing}
                    className="px-4 py-1.5 rounded bg-[#C1A461] hover:bg-[#b09351] text-[#0B1C44] font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {batchProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Run Batch Watermark
                  </button>
                </div>
              </div>

              {/* Selection Table */}
              <div className="mt-4 border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-white/70 font-semibold">
                    <tr>
                      <th className="p-3 w-10">
                        <input
                          type="checkbox"
                          checked={selectedBatchIds.length === documents.length && documents.length > 0}
                          onChange={e => {
                            if (e.target.checked) setSelectedBatchIds(documents.map(d => d.id));
                            else setSelectedBatchIds([]);
                          }}
                        />
                      </th>
                      <th className="p-3">Document Reference</th>
                      <th className="p-3">Site</th>
                      <th className="p-3">Database Status</th>
                      <th className="p-3">Watermark Target</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {documents.map(doc => {
                      const isChecked = selectedBatchIds.includes(doc.id);
                      return (
                        <tr
                          key={doc.id}
                          onClick={() => {
                            setSelectedBatchIds(prev =>
                              prev.includes(doc.id) ? prev.filter(id => id !== doc.id) : [...prev, doc.id]
                            );
                          }}
                          className={`cursor-pointer hover:bg-white/5 ${isChecked ? 'bg-[#C1A461]/10' : ''}`}
                        >
                          <td className="p-3" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e => {
                                if (e.target.checked) setSelectedBatchIds(prev => [...prev, doc.id]);
                                else setSelectedBatchIds(prev => prev.filter(id => id !== doc.id));
                              }}
                            />
                          </td>
                          <td className="p-3 font-semibold text-white">{doc.documentNumber}</td>
                          <td className="p-3 text-white/70">{doc.siteName}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              doc.status === 'Issued' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {doc.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`text-[11px] font-semibold ${
                              doc.status === 'Issued' ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {doc.status === 'Issued' ? 'ISSUED (Green Seal)' : 'DRAFT (Red Diagonal)'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Batch Result Manifest */}
            {batchResult && (
              <div className="bg-[#07122E] border border-emerald-500/40 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <div className="text-sm font-bold text-white">Batch Manifest Generated</div>
                      <div className="text-xs text-white/60">
                        {batchResult.totalDocuments} total documents ({batchResult.issuedCount} ISSUED, {batchResult.draftCount} DRAFT)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/50">Manifest SHA-256</div>
                    <code className="text-[11px] text-[#C1A461]">{batchResult.manifestHash.slice(0, 24)}...</code>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {batchResult.documents.map((item, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">{item.documentNumber}</div>
                        <div className="text-[10px] text-white/60">
                          Status: <strong className={item.watermarkApplied === 'ISSUED' ? 'text-emerald-400' : 'text-rose-400'}>
                            {item.watermarkApplied}
                          </strong> • {item.pageCount} Pages • {item.latencyMs}ms
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded hover:bg-white/10 text-white/80"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={item.downloadUrl}
                          download={item.filename}
                          className="p-1.5 rounded bg-[#C1A461] text-[#0B1C44] hover:bg-[#b09351]"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Diagnostics & Server Event Log Feed */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white/60 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Server Engine Execution Stream & Audit Events
            </span>
            <span className="text-[10px] text-white/40">
              API Version: {serverHealth?.version || '2.4.0'} | Port: 3000
            </span>
          </div>
          <div className="bg-[#07122E] border border-white/10 rounded-lg p-3 font-mono text-[11px] text-emerald-300/90 h-28 overflow-y-auto space-y-1">
            {logs.length === 0 ? (
              <span className="text-white/40">No activity yet. Ready for operations.</span>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
