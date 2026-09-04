import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Lock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Eye, 
  Clock, 
  Layers, 
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ShieldAlert,
  Info,
  ExternalLink,
  RefreshCw,
  ArrowUpDown,
  Shield,
  ShieldX
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { 
  ComplianceAuditRecord, 
  ComplianceAuditEventType, 
  PaginatedComplianceAuditLogsResult 
} from '../../types';
import { AuditPdfExportModal } from './AuditPdfExportModal';

interface ComplianceAuditLogProps {
  onBack?: () => void;
  onNavigateToSafetyFile?: (dossierId?: string) => void;
}

export const ComplianceAuditLog: React.FC<ComplianceAuditLogProps> = ({
  onBack,
  onNavigateToSafetyFile
}) => {
  const store = useAudrinStore();
  const currentUser = store.getUser();
  const dossiers = store.getSafetyFileDossiers();

  const isAuthorizedToExport = store.isUserAuthorizedToExportProjectHistory();

  // Server Query State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'timestamp' | 'auditNumber' | 'eventType'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // UI State
  const [popiaRedactPii, setPopiaRedactPii] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<ComplianceAuditRecord | null>(null);
  const [isServerLoading, setIsServerLoading] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

  // Jump to page input
  const [jumpToPageInput, setJumpToPageInput] = useState<string>('1');

  // Server-side Paginated Query Result
  const [serverQueryResult, setServerQueryResult] = useState<PaginatedComplianceAuditLogsResult>(() =>
    store.getComplianceAuditLogsServerPaginated({
      page: 1,
      pageSize: 10,
      projectId: 'all',
      eventType: 'all',
      searchQuery: '',
      sortBy: 'timestamp',
      sortOrder: 'desc'
    })
  );

  // Debounce search query to simulate efficient server queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Execute server query
  const executeServerFetch = useCallback(() => {
    setIsServerLoading(true);
    // Simulate server asynchronous pipeline
    const timer = setTimeout(() => {
      const result = store.getComplianceAuditLogsServerPaginated({
        page: currentPage,
        pageSize,
        projectId: selectedProjectId !== 'all' ? selectedProjectId : undefined,
        eventType: selectedEventType !== 'all' ? selectedEventType : undefined,
        searchQuery: debouncedSearch.trim() || undefined,
        sortBy,
        sortOrder
      });

      setServerQueryResult(result);
      setIsServerLoading(false);
      setJumpToPageInput(String(result.currentPage));
    }, 90);

    return () => clearTimeout(timer);
  }, [store, currentPage, pageSize, selectedProjectId, selectedEventType, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    const cancel = executeServerFetch();
    return () => cancel && cancel();
  }, [executeServerFetch]);

  const handleSortToggle = (field: 'timestamp' | 'auditNumber' | 'eventType') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handleJumpToPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpToPageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= serverQueryResult.totalPages) {
      setCurrentPage(target);
    } else {
      setJumpToPageInput(String(serverQueryResult.currentPage));
    }
  };

  const getEventBadge = (type: ComplianceAuditEventType) => {
    switch (type) {
      case 'signature_verified':
      case 'approval_granted':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
          label: type.replace('_', ' ').toUpperCase()
        };
      case 'approval_rejected':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: <AlertCircle className="w-3 h-3 text-rose-400" />,
          label: 'REJECTED'
        };
      case 'email_dispatch':
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: <Mail className="w-3 h-3 text-blue-400" />,
          label: 'EMAIL DISPATCH'
        };
      case 'document_upload':
      case 'document_creation':
        return {
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          icon: <FileText className="w-3 h-3 text-purple-400" />,
          label: type.replace('_', ' ').toUpperCase()
        };
      case 'standards_revision':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <Layers className="w-3 h-3 text-amber-400" />,
          label: 'STANDARDS REVISION'
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          icon: <Clock className="w-3 h-3 text-slate-400" />,
          label: type.replace('_', ' ').toUpperCase()
        };
    }
  };

  const formatPii = (value: string | undefined, category?: string) => {
    if (!value) return '';
    if (popiaRedactPii && category === 'personal_data') {
      if (value.includes('@')) {
        const [user, domain] = value.split('@');
        return `${user.substring(0, 2)}***@${domain}`;
      }
      return `${value.substring(0, 3)}*** [REDACTED POPIA]`;
    }
    return value;
  };

  // Pagination calculation bounds
  const startItem = serverQueryResult.filteredCount === 0 
    ? 0 
    : (serverQueryResult.currentPage - 1) * serverQueryResult.pageSize + 1;
  const endItem = Math.min(
    serverQueryResult.currentPage * serverQueryResult.pageSize, 
    serverQueryResult.filteredCount
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Lock className="w-3 h-3" />
                Immutable Server-Controlled Trail
              </span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs text-slate-400 font-mono">
                POPIA Act 4 of 2013 & SANS 10139 Clause 13.2
              </span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Server-Side Pagination Enabled
              </span>
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5 font-serif">
              <ShieldCheck className="w-7 h-7 text-amber-500" />
              Compliance Audit Trail & Evidence Ledger
            </h1>

            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              Cryptographically timestamped, append-only log of every statutory action, document revision, commissioner signature, and dispatch event across Audrin Fire Engineers projects. Ordinary users are strictly prevented from editing or deleting entries.
            </p>
          </div>

          {/* Quick Actions & Role Authorization Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-end gap-1">
                {isAuthorizedToExport ? (
                  <Shield className="w-3 h-3 text-emerald-400" />
                ) : (
                  <ShieldX className="w-3 h-3 text-amber-400" />
                )}
                <span>Statutory Clearance</span>
              </div>
              <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isAuthorizedToExport ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {isAuthorizedToExport 
                  ? `${currentUser.role.toUpperCase()} (Full History Authorized)` 
                  : `Role: ${currentUser.role.toUpperCase()} (Export Restricted)`}
              </div>
            </div>

            <button
              onClick={() => setExportModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              Download PDF Report
            </button>
          </div>
        </div>

        {/* POPIA & Statutory Notice Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              <strong>Statutory Principle:</strong> Automated outputs represent compliance-support information. Full project history exports are legally restricted to accredited SAQCC Commissioners under SANS 10139 & POPIA.
            </span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 font-medium">
            <input
              type="checkbox"
              checked={popiaRedactPii}
              onChange={(e) => setPopiaRedactPii(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500/20 w-4 h-4"
            />
            <span>Redact Personal Identifiers (POPIA View Mode)</span>
          </label>
        </div>
      </div>

      {/* Filter and Server Query Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Server search: ref, signer, SHA-256 hash, or doc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg text-xs text-white pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-slate-500"
            />
          </div>

          {/* Project Isolation Filter */}
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-500" />
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="all">All Accessible Projects ({dossiers.length})</option>
              {dossiers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.dossierNumber} - {d.siteName}
                </option>
              ))}
            </select>
          </div>

          {/* Event Type Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedEventType}
              onChange={(e) => {
                setSelectedEventType(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="all">All Event Types</option>
              <option value="signature_verified">Signatures Verified</option>
              <option value="signature_requested">Signature Requests</option>
              <option value="approval_granted">Approvals Granted</option>
              <option value="approval_rejected">Approvals Rejected</option>
              <option value="document_upload">Document Uploads</option>
              <option value="status_change">Status Changes</option>
              <option value="email_dispatch">Email Dispatches</option>
              <option value="dossier_download">Downloads & Print</option>
              <option value="standards_revision">Standards Revisions</option>
            </select>
          </div>

          {/* Refresh from Server Button */}
          <button
            onClick={() => executeServerFetch()}
            disabled={isServerLoading}
            title="Refresh from server"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isServerLoading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Server Performance & Metrics Pill */}
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-[11px] text-amber-400">
            ⚡ Server Latency: {serverQueryResult.serverExecutionTimeMs}ms
          </span>
          <span>
            Found <strong className="text-white">{serverQueryResult.filteredCount}</strong> records
          </span>
        </div>
      </div>

      {/* Main Server-Paginated Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl relative">
        {/* Server Loading Overlay */}
        {isServerLoading && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-none">
            <div className="bg-slate-900 border border-amber-500/40 text-amber-400 px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-2xl animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
              <span>Querying Immutable Server Ledger...</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700 text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSortToggle('auditNumber')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Audit Ref & Timestamp</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-4">Actor & Role</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSortToggle('eventType')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Event Type</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-4">Action Summary & Document</th>
                <th className="py-3 px-4">Standards Reference</th>
                <th className="py-3 px-4">Integrity Hash</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {serverQueryResult.records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-50" />
                    <p className="font-medium text-white">No audit records match your active criteria.</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing filters or changing search keywords.</p>
                  </td>
                </tr>
              ) : (
                serverQueryResult.records.map((log) => {
                  const badge = getEventBadge(log.eventType);
                  const isSelected = selectedRecord?.id === log.id;

                  return (
                    <tr 
                      key={log.id}
                      onClick={() => setSelectedRecord(isSelected ? null : log)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-amber-500/10 hover:bg-amber-500/15' 
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Audit Number & Timestamp */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-amber-400">
                          {log.auditNumber}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{log.timestamp.replace('T', ' ').substring(0, 19)}</span>
                        </div>
                      </td>

                      {/* Actor & Role */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">
                          {formatPii(log.userName, log.popiaCategory)}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {log.userRole}
                          </span>
                          <span className="truncate max-w-[140px]">
                            {formatPii(log.userEmail, log.popiaCategory)}
                          </span>
                        </div>
                      </td>

                      {/* Event Type */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      </td>

                      {/* Description & Target */}
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="text-slate-200 line-clamp-1 font-medium">
                          {log.eventDescription}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-slate-300 font-semibold">{log.projectName}</span>
                          {log.documentTitle && (
                            <>
                              <span>•</span>
                              <span className="text-amber-400/90 font-mono truncate max-w-[180px]">
                                {log.documentTitle}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Standards Reference */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-mono font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                          {log.standardsReference || 'SANS 10139'}
                        </span>
                      </td>

                      {/* Integrity Hash */}
                      <td className="py-3.5 px-4">
                        {log.fileChecksumSha256 ? (
                          <div className="font-mono text-[10px] text-slate-400 flex items-center gap-1" title={log.fileChecksumSha256}>
                            <span className="text-emerald-400">✓</span>
                            <span>{log.fileChecksumSha256.substring(0, 10)}...</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[10px] font-mono">N/A</span>
                        )}
                      </td>

                      {/* Details View Indicator */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(isSelected ? null : log);
                          }}
                          className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                        >
                          {isSelected ? 'Close' : 'View'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Controls Footer */}
        <div className="bg-slate-950/80 border-t border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-amber-500/90">
              <Lock className="w-3.5 h-3.5" />
              <span>Append-only mode active. Ledger deletion blocked.</span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>
              Showing <strong className="text-white">{startItem}–{endItem}</strong> of{' '}
              <strong className="text-white">{serverQueryResult.filteredCount}</strong> entries{' '}
              <span className="text-slate-500">(Total Ledger: {serverQueryResult.totalRecords})</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-800 border border-slate-700 rounded-lg text-xs py-1 px-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
            </div>

            {/* Jump to Page Form */}
            <form onSubmit={handleJumpToPageSubmit} className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500">Page:</span>
              <input
                type="number"
                min={1}
                max={serverQueryResult.totalPages}
                value={jumpToPageInput}
                onChange={(e) => setJumpToPageInput(e.target.value)}
                className="w-12 bg-slate-800 border border-slate-700 rounded-lg text-xs text-center py-1 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="text-slate-500">of {serverQueryResult.totalPages}</span>
            </form>

            {/* Pagination Navigation Buttons */}
            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={!serverQueryResult.hasPrevPage}
                title="First page"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors border border-slate-700"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={!serverQueryResult.hasPrevPage}
                title="Previous page"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors border border-slate-700"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Dynamic Page Number Pills */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(5, serverQueryResult.totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (serverQueryResult.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (serverQueryResult.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (serverQueryResult.currentPage >= serverQueryResult.totalPages - 2) {
                    pageNum = serverQueryResult.totalPages - 4 + i;
                  } else {
                    pageNum = serverQueryResult.currentPage - 2 + i;
                  }

                  const isActive = pageNum === serverQueryResult.currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-colors ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Page */}
              <button
                onClick={() => setCurrentPage(p => Math.min(serverQueryResult.totalPages, p + 1))}
                disabled={!serverQueryResult.hasNextPage}
                title="Next page"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors border border-slate-700"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => setCurrentPage(serverQueryResult.totalPages)}
                disabled={!serverQueryResult.hasNextPage}
                title="Last page"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors border border-slate-700"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Audit Record Details Drawer / Panel */}
      {selectedRecord && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {selectedRecord.auditNumber}
                </span>
                <span className="text-xs text-slate-400">
                  Timestamp: {selectedRecord.timestamp} (UTC)
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {selectedRecord.eventDescription}
              </h3>
            </div>
            <button
              onClick={() => setSelectedRecord(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Actor & Session Info</div>
              <div className="text-white font-bold">{selectedRecord.userName}</div>
              <div className="text-slate-300">{selectedRecord.userEmail} ({selectedRecord.userRole})</div>
              <div className="text-slate-400 font-mono text-[11px] pt-1 border-t border-slate-700">
                IP: {popiaRedactPii ? '105.***.*** (POPIA)' : selectedRecord.ipAddress}
              </div>
              <div className="text-slate-400 text-[10px] truncate">
                Agent: {selectedRecord.deviceMetadata}
              </div>
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Project & Document Target</div>
              <div className="text-white font-bold">{selectedRecord.projectName}</div>
              <div className="text-slate-300">Client: {selectedRecord.clientName}</div>
              {selectedRecord.documentTitle && (
                <div className="text-amber-400 font-mono text-[11px] pt-1 border-t border-slate-700 truncate">
                  Doc: {selectedRecord.documentTitle} ({selectedRecord.documentVersion || 'v1.0'})
                </div>
              )}
              {selectedRecord.emailRecipient && (
                <div className="text-blue-400 text-[11px]">
                  Email Dispatched To: {selectedRecord.emailRecipient} ({selectedRecord.emailDeliveryResult || 'delivered'})
                </div>
              )}
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
              <div className="text-slate-400 font-semibold uppercase text-[10px]">Legal Standards & Hash</div>
              <div className="text-amber-400 font-mono font-bold">
                {selectedRecord.standardsReference || 'SANS 10139:2021'}
              </div>
              <div className="text-slate-300">
                POPIA Category: <span className="uppercase text-[10px] font-bold text-slate-200">{selectedRecord.popiaCategory}</span>
              </div>
              {selectedRecord.fileChecksumSha256 && (
                <div className="pt-1 border-t border-slate-700">
                  <div className="text-[10px] text-slate-400">SHA-256 Checksum:</div>
                  <div className="font-mono text-[10px] text-slate-300 break-all bg-slate-950/80 p-1.5 rounded mt-0.5">
                    {selectedRecord.fileChecksumSha256}
                  </div>
                </div>
              )}
            </div>
          </div>

          {(selectedRecord.previousValue || selectedRecord.newValue) && (
            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Previous Value</span>
                <div className="text-rose-400 bg-slate-900/80 p-2 rounded border border-rose-500/20">
                  {selectedRecord.previousValue || '(None / Initial Creation)'}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">New Value</span>
                <div className="text-emerald-400 bg-slate-900/80 p-2 rounded border border-emerald-500/20">
                  {selectedRecord.newValue || '(Unchanged)'}
                </div>
              </div>
            </div>
          )}

          {onNavigateToSafetyFile && selectedRecord.dossierId && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => onNavigateToSafetyFile(selectedRecord.dossierId)}
                className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-amber-500/30 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Associated Safety File Dossier
              </button>
            </div>
          )}
        </div>
      )}

      {/* Download PDF Report Modal with Authorization Guard */}
      <AuditPdfExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        activeProjectId={selectedProjectId}
        currentFilteredRecords={serverQueryResult.records}
        currentQuerySummary={`Page ${serverQueryResult.currentPage} of ${serverQueryResult.totalPages} (${serverQueryResult.filteredCount} records matching filters)`}
      />
    </div>
  );
};
