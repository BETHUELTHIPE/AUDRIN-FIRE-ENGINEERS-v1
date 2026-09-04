import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Lock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Eye, 
  EyeOff, 
  Sparkles,
  UserCheck,
  X
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { ComplianceAuditRecord } from '../../types';
import { generateAuditTrailReportPdf } from '../../services/safetyFilePdfGenerator';

interface AuditPdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProjectId?: string;
  currentFilteredRecords: ComplianceAuditRecord[];
  currentQuerySummary?: string;
}

export const AuditPdfExportModal: React.FC<AuditPdfExportModalProps> = ({
  isOpen,
  onClose,
  activeProjectId,
  currentFilteredRecords,
  currentQuerySummary
}) => {
  const store = useAudrinStore();
  const currentUser = store.getUser();
  const dossiers = store.getSafetyFileDossiers();

  const isAuthorized = store.isUserAuthorizedToExportProjectHistory();

  // Export mode: 'full_project' | 'current_view'
  const [exportMode, setExportMode] = useState<'full_project' | 'current_view'>(
    isAuthorized ? 'full_project' : 'current_view'
  );

  // Selected project for full history export
  const initialProjectId = activeProjectId && activeProjectId !== 'all' 
    ? activeProjectId 
    : (dossiers[0]?.id || 'all');
  const [selectedProjectForExport, setSelectedProjectForExport] = useState<string>(initialProjectId);

  // POPIA redaction option
  const [redactPii, setRedactPii] = useState<boolean>(false);

  // Export in progress state
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const [exportErrorMessage, setExportErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Selected project details
  const targetDossier = dossiers.find(d => d.id === selectedProjectForExport);
  const selectedProjectName = targetDossier 
    ? targetDossier.projectName 
    : (selectedProjectForExport === 'all' ? 'All Registered Fire Projects' : 'Selected Project');

  // Count available records in full project history
  const allLogs = store.getComplianceAuditLogs(
    selectedProjectForExport !== 'all' ? selectedProjectForExport : undefined
  );
  const fullProjectRecordCount = allLogs.length;

  const handleExecuteExport = async () => {
    setIsExporting(true);
    setExportErrorMessage(null);
    setExportSuccessMessage(null);

    try {
      if (exportMode === 'full_project') {
        // Enforce server-side authorization check
        if (!isAuthorized) {
          throw new Error(
            'Statutory Access Denied: You do not possess the required security clearance (SAQCC Commissioner or Ops Admin) to export the unclipped project history.'
          );
        }

        const result = store.exportFullProjectAuditHistory(selectedProjectForExport);
        if (!result.authorized) {
          throw new Error(result.errorMessage || 'Export authorization failed.');
        }

        generateAuditTrailReportPdf(result.records, {
          projectName: result.projectName,
          isFullProjectHistory: true,
          redactPii,
          authorizerName: currentUser.name,
          authorizerRole: currentUser.role
        });

        setExportSuccessMessage(
          `Successfully generated certified statutory audit report for ${result.projectName} (${result.records.length} records).`
        );
      } else {
        // Export current filtered view
        const projectName = activeProjectId && activeProjectId !== 'all'
          ? (dossiers.find(d => d.id === activeProjectId)?.projectName || 'Filtered Project Audit')
          : 'Audrin Filtered Audit Subset';

        generateAuditTrailReportPdf(currentFilteredRecords, {
          projectName,
          isFullProjectHistory: false,
          redactPii,
          authorizerName: currentUser.name,
          authorizerRole: currentUser.role
        });

        setExportSuccessMessage(
          `Successfully exported active audit subset (${currentFilteredRecords.length} records).`
        );
      }

      setTimeout(() => {
        setIsExporting(false);
      }, 500);
    } catch (err: any) {
      setExportErrorMessage(err.message || 'Failed to generate PDF report.');
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-950/80 border-b border-slate-800 p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2 font-serif">
                Download Compliance Audit PDF Report
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory SANS 10139 Clause 13.2 & POPIA Act 4 of 2013 Official Ledger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-xs">
          {/* Security Clearance Alert Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isAuthorized 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            {isAuthorized ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-bold flex items-center gap-2">
                <span>Security Clearance: {currentUser.role.toUpperCase()}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700">
                  {isAuthorized ? 'Authorized Auditor' : 'Restricted Access'}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {isAuthorized ? (
                  <span>
                    You have executive clearance to export the <strong>complete immutable project history</strong>. Every export transaction is logged in the permanent statutory register with your digital ID.
                  </span>
                ) : (
                  <span>
                    Full project history extraction is <strong>restricted to accredited SAQCC Commissioners, Super Admins, and Operations Admins</strong> to prevent unauthorized data exfiltration under POPIA & SANS 10139 regulations.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Export Mode Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Select Export Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Full Project History */}
              <div 
                onClick={() => setExportMode('full_project')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  exportMode === 'full_project'
                    ? 'bg-amber-500/15 border-amber-500/60 ring-1 ring-amber-500/40'
                    : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Full Project History
                  </div>
                  {isAuthorized ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Authorized
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Restricted
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-[11px] mt-1.5 leading-normal">
                  Exports the complete chronological audit trail from project inception, unclipped by page size limits.
                </p>
              </div>

              {/* Option 2: Current Filtered View */}
              <div 
                onClick={() => setExportMode('current_view')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  exportMode === 'current_view'
                    ? 'bg-amber-500/15 border-amber-500/60 ring-1 ring-amber-500/40'
                    : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Current Filtered View
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Open Access
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1.5 leading-normal">
                  Exports only records matching your current active page and search parameters ({currentFilteredRecords.length} records).
                </p>
              </div>
            </div>
          </div>

          {/* Project Selector (when Full Project History is active) */}
          {exportMode === 'full_project' && (
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  Target Project Dossier
                </label>
                <span className="text-[10px] text-amber-400 font-mono font-bold">
                  {fullProjectRecordCount} events in ledger
                </span>
              </div>

              <select
                value={selectedProjectForExport}
                onChange={(e) => setSelectedProjectForExport(e.target.value)}
                disabled={!isAuthorized}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg text-xs text-white p-2.5 focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
              >
                {dossiers.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.dossierNumber} — {d.projectName} ({d.siteName})
                  </option>
                ))}
                {currentUser.role === 'super_admin' && (
                  <option value="all">
                    ★ All Registered Projects (Consolidated Statutory Master Ledger)
                  </option>
                )}
              </select>

              {!isAuthorized && (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3 text-[11px] text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Authorization Barrier:</strong> As an unprivileged role ({currentUser.role}), you cannot export full project histories. Please switch to an Administrator role in the top header or select "Current Filtered View".
                  </div>
                </div>
              )}
            </div>
          )}

          {/* POPIA Redaction & Privacy Options */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-slate-200 font-medium">
                <input
                  type="checkbox"
                  checked={redactPii}
                  onChange={(e) => setRedactPii(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
                />
                <span className="flex items-center gap-1.5">
                  {redactPii ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                  Apply POPIA Data Protection Redaction (Act 4 of 2013)
                </span>
              </label>
              <span className="text-[10px] text-slate-500 uppercase font-mono">
                {redactPii ? 'Redacted' : 'Unredacted'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 pl-6">
              When checked, personal email addresses and network IP identifiers will be masked on the exported statutory PDF.
            </p>
          </div>

          {/* Success / Error Messages */}
          {exportSuccessMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{exportSuccessMessage}</span>
            </div>
          )}

          {exportErrorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{exportErrorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950/80 border-t border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Actor: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleExecuteExport}
              disabled={isExporting || (exportMode === 'full_project' && !isAuthorized)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Generating Certified PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {exportMode === 'full_project' ? 'Download Full History PDF' : 'Download Filtered PDF Report'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
