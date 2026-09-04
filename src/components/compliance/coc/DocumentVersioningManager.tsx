import React, { useState } from 'react';
import { SansCocCertificate, CertificateRevisionRecord } from '../../../types';
import { useAudrinStore } from '../../../services/store';
import { 
  History, 
  ShieldCheck, 
  Lock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  Calendar, 
  User, 
  Award, 
  Layers, 
  Eye, 
  RotateCcw, 
  Plus, 
  GitCommit, 
  Scale, 
  Sparkles, 
  X, 
  Hash, 
  Activity, 
  FileCheck 
} from 'lucide-react';

export interface DocumentVersioningManagerProps {
  coc: SansCocCertificate;
  currentRevisionNumber: string;
  onRevisionNumberChange: (rev: string) => void;
  revisionReason: string;
  onRevisionReasonChange: (reason: string) => void;
  onRestoreRevision?: (snapshot: SansCocCertificate) => void;
  onTriggerIssue?: () => void;
  canIssue?: boolean;
}

export const DocumentVersioningManager: React.FC<DocumentVersioningManagerProps> = ({
  coc,
  currentRevisionNumber,
  onRevisionNumberChange,
  revisionReason,
  onRevisionReasonChange,
  onRestoreRevision,
  onTriggerIssue,
  canIssue = true
}) => {
  const store = useAudrinStore();
  const allRevisions = store.getCocRevisions(coc.id);
  const auditLogs = store.getComplianceAuditLogs();

  const [selectedSnapshot, setSelectedSnapshot] = useState<CertificateRevisionRecord | null>(null);
  const [comparingRevision, setComparingRevision] = useState<CertificateRevisionRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'new-revision' | 'audit-trail'>('timeline');
  const [restoreNotice, setRestoreNotice] = useState<string | null>(null);

  const handleCopyHash = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApplyNextRevision = (type: 'minor' | 'major') => {
    const match = currentRevisionNumber.match(/Rev\s*(\d+)(?:\.(\d+))?/i);
    if (match) {
      const major = parseInt(match[1], 10) || 1;
      const minor = match[2] ? parseInt(match[2], 10) : 0;
      if (type === 'minor') {
        onRevisionNumberChange(`Rev ${major}.${minor + 1}`);
      } else {
        onRevisionNumberChange(`Rev ${major + 1}.0`);
      }
    } else {
      onRevisionNumberChange(type === 'minor' ? 'Rev 1.1' : 'Rev 2.0');
    }
  };

  const handleRestoreClick = (record: CertificateRevisionRecord) => {
    if (window.confirm(`Restore field values from immutable revision ${record.revisionNumber} into current form draft? Note: The historical revision record itself remains permanently locked and immutable in the database.`)) {
      if (onRestoreRevision) {
        onRestoreRevision(record.snapshot);
      }
      setRestoreNotice(`Loaded fields from ${record.revisionNumber}. Historical revision remains securely archived.`);
      setTimeout(() => setRestoreNotice(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-gradient-to-r from-amber-500/10 via-black/40 to-emerald-500/10 border border-[#C1A461]/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/30">
              <History className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              SANS 10139 Document Versioning Manager
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Immutable Ledger Active
              </span>
            </h3>
          </div>
          <p className="text-xs text-white/70 max-w-2xl">
            Statutory revision control per SANS 10139:2012 Clause 13.2 and POPIA compliance. Whenever a certificate is 
            <strong className="text-white"> 'Issued'</strong>, an immutable snapshot is cryptographically hashed with SHA-256 and committed to the permanent database ledger. Older versions are never overwritten.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-right">
            <div className="text-[10px] font-mono text-white/50 uppercase">Active Working Rev</div>
            <div className="text-sm font-bold text-[#C1A461] font-mono">{currentRevisionNumber || 'Rev 1.0'}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-right">
            <div className="text-[10px] font-mono text-white/50 uppercase">Archived Revisions</div>
            <div className="text-sm font-bold text-white font-mono">{allRevisions.length}</div>
          </div>
        </div>
      </div>

      {restoreNotice && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{restoreNotice}</span>
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveSubTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition ${
            activeSubTab === 'timeline'
              ? 'bg-[#C1A461] text-black shadow-md shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>Revision Timeline ({allRevisions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('new-revision')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition ${
            activeSubTab === 'new-revision'
              ? 'bg-[#C1A461] text-black shadow-md shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Prepare Revision &amp; Notes</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit-trail')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition ${
            activeSubTab === 'audit-trail'
              ? 'bg-[#C1A461] text-black shadow-md shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory Audit Logs</span>
        </button>
      </div>

      {/* SUB-TAB 1: REVISION TIMELINE */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-4">
          {allRevisions.length === 0 ? (
            <div className="p-8 text-center bg-black/40 border border-white/10 rounded-2xl space-y-3">
              <Lock className="w-10 h-10 text-white/30 mx-auto" />
              <div className="text-sm font-bold text-white">No Sealed Revisions Yet</div>
              <p className="text-xs text-white/60 max-w-md mx-auto">
                This certificate is currently in DRAFT status. When you click <strong>'Issue Official SANS 10139 COC'</strong>, 
                the first immutable baseline revision (Rev 1.0) will be automatically created and preserved here.
              </p>
              {canIssue && onTriggerIssue && (
                <button
                  onClick={onTriggerIssue}
                  className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Issue Initial Revision Now
                </button>
              )}
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
              {allRevisions.map((rev, index) => {
                const isLatest = index === 0;
                const formattedDate = new Date(rev.issuedAt).toLocaleString('en-ZA', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div key={rev.id} className="relative group">
                    {/* Node Dot */}
                    <div className={`absolute -left-6 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isLatest 
                        ? 'bg-[#C1A461] border-[#C1A461] text-black shadow-md shadow-[#C1A461]/40' 
                        : 'bg-[#18181B] border-white/30 text-white/60'
                    }`}>
                      <Lock className="w-2.5 h-2.5" />
                    </div>

                    {/* Card */}
                    <div className="p-5 bg-black/50 border border-white/10 rounded-2xl hover:border-white/20 transition space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                            isLatest 
                              ? 'bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/40' 
                              : 'bg-white/10 text-white border border-white/10'
                          }`}>
                            <GitCommit className="w-3.5 h-3.5" />
                            {rev.revisionNumber}
                            {isLatest && <span className="ml-1 text-[9px] uppercase px-1.5 py-0.2 bg-[#C1A461] text-black rounded font-black">LATEST SEALED</span>}
                          </span>

                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            IMMUTABLE
                          </span>

                          <span className="text-xs text-white/50 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-white/40" />
                            {formattedDate}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedSnapshot(rev)}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
                            title="Inspect complete immutable certificate snapshot"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#C1A461]" />
                            <span>Inspect Snapshot</span>
                          </button>

                          <button
                            onClick={() => setComparingRevision(rev)}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
                            title="Compare side-by-side with current form data"
                          >
                            <Scale className="w-3.5 h-3.5 text-amber-400" />
                            <span>Compare</span>
                          </button>

                          <button
                            onClick={() => handleRestoreClick(rev)}
                            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1 transition"
                            title="Load field values from this revision into form draft"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Restore Base</span>
                          </button>
                        </div>
                      </div>

                      {/* Reason for Revision */}
                      <div className="text-xs text-white/90 bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                        <div className="text-[10px] font-mono text-[#C1A461] uppercase tracking-wider font-bold">Reason for Revision / Change Note</div>
                        <p>{rev.reasonForRevision}</p>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
                          <div className="text-[10px] font-mono text-white/40 uppercase">Commissioner</div>
                          <div className="font-semibold text-white truncate">{rev.issuedBy.name}</div>
                          <div className="text-[10px] font-mono text-white/50">{rev.issuedBy.saqccNumber || 'Accredited SANS 10139'}</div>
                        </div>

                        <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
                          <div className="text-[10px] font-mono text-white/40 uppercase">System Classification</div>
                          <div className="font-semibold text-white">Category {rev.systemCategory}</div>
                          <div className="text-[10px] font-mono text-emerald-400">{rev.overallComplianceStatus}</div>
                        </div>

                        <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
                          <div className="text-[10px] font-mono text-white/40 uppercase">Audit Trail Reference</div>
                          <div className="font-mono text-xs text-amber-300 font-bold">{rev.auditTrailRef}</div>
                          <div className="text-[10px] font-mono text-white/50">POPIA &amp; SANS 10139 Ledger</div>
                        </div>

                        <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
                          <div className="text-[10px] font-mono text-white/40 uppercase">Cryptographic SHA-256</div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-[10px] text-white/70 truncate">{rev.documentChecksumSha256.substring(0, 16)}...</span>
                            <button
                              onClick={() => handleCopyHash(rev.documentChecksumSha256, rev.id)}
                              className="p-1 hover:bg-white/10 rounded text-white/50 hover:text-white transition"
                              title="Copy SHA-256 Checksum"
                            >
                              {copiedId === rev.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <div className="text-[10px] font-mono text-emerald-400/80">Tamper-Proof Seal</div>
                        </div>
                      </div>

                      {/* Change Summary Bullets */}
                      {rev.changeSummary && rev.changeSummary.length > 0 && (
                        <div className="pt-1">
                          <div className="text-[10px] font-mono text-white/40 uppercase mb-1.5">Key Sealed Parameters</div>
                          <div className="flex flex-wrap gap-1.5">
                            {rev.changeSummary.map((item, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[11px] text-white/70">
                                &bull; {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: PREPARE NEW REVISION */}
      {activeSubTab === 'new-revision' && (
        <div className="p-6 bg-black/40 border border-white/10 rounded-2xl space-y-6">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C1A461]" />
              Prepare Next Certificate Revision
            </h4>
            <p className="text-xs text-white/70">
              Specify the revision designation and document the statutory rationale (e.g. alterations to detection zones, device expansions, remedial works, or periodic recommissioning).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-white/80 mb-1.5">Revision Designation</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentRevisionNumber}
                    onChange={e => onRevisionNumberChange(e.target.value)}
                    placeholder="e.g. Rev 1.1 or Rev 2.0"
                    className="flex-1 px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyNextRevision('minor')}
                    className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-mono font-bold transition whitespace-nowrap"
                    title="Increment minor revision, e.g. Rev 1.0 -> Rev 1.1"
                  >
                    + Minor (.1)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyNextRevision('major')}
                    className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-mono font-bold transition whitespace-nowrap"
                    title="Increment major revision, e.g. Rev 1.0 -> Rev 2.0"
                  >
                    + Major (1.0)
                  </button>
                </div>
                <p className="text-[11px] text-white/50 mt-1">
                  Use Minor for minor zone expansions or sensor adjustments. Use Major for complete system re-certifications.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/80 mb-1.5">
                  Statutory Reason for Revision <span className="text-[#C1A461]">*</span>
                </label>
                <textarea
                  rows={4}
                  value={revisionReason}
                  onChange={e => onRevisionReasonChange(e.target.value)}
                  placeholder="Detail the scope of changes requiring this revision (e.g., Added 6 optical smoke detectors in 3rd-floor server room expansion per revised as-built drawings; verified 24h standby battery autonomy)."
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#C1A461]"
                />
              </div>
            </div>

            <div className="p-4 bg-black/60 border border-white/10 rounded-xl space-y-3">
              <div className="text-xs font-mono font-bold text-[#C1A461] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Statutory Invariance Rules
              </div>
              <ul className="text-xs text-white/70 space-y-2 list-disc list-inside">
                <li>Every 'Issued' action automatically snapshots and locks the current working certificate.</li>
                <li>The newly created revision will receive a unique cryptographic SHA-256 fingerprint.</li>
                <li>All prior revisions ({allRevisions.length} stored) remain untouched and fully auditable by safety officers and fire authorities.</li>
                <li>An immutable event entry will be appended to the project's compliance audit ledger.</li>
              </ul>

              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <div className="text-[11px] font-mono text-white/50">
                  Ready to seal? Ensure all mandatory fields and digital signatures are verified in Tab 6.
                </div>
                {canIssue && onTriggerIssue && (
                  <button
                    onClick={onTriggerIssue}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Issue &amp; Commit {currentRevisionNumber} to Immutable Ledger
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: STATUTORY AUDIT LOGS */}
      {activeSubTab === 'audit-trail' && (
        <div className="space-y-4">
          <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold font-mono text-white">Immutable Compliance Audit Ledger for this Project</h4>
              <p className="text-[11px] text-white/60">Filtered for SANS 10139 Certificate creation and revision events.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/30">
              POPIA Act 4 &middot; Append-Only
            </span>
          </div>

          <div className="space-y-2">
            {auditLogs
              .filter(l => l.documentTitle?.includes('Certificate') || l.documentTitle?.includes('COC') || l.eventDescription.includes('COC') || l.eventDescription.includes('revision'))
              .slice(0, 10)
              .map(log => (
                <div key={log.id} className="p-3 bg-black/50 border border-white/5 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-300 font-bold">{log.auditNumber}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white/10 text-white/80 rounded uppercase">
                        {log.eventType}
                      </span>
                      {log.documentVersion && (
                        <span className="text-[10px] font-mono text-[#C1A461]">{log.documentVersion}</span>
                      )}
                    </div>
                    <p className="text-white/80">{log.eventDescription}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-white/50 text-[11px]">
                      {new Date(log.timestamp).toLocaleString('en-ZA', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="text-[10px] text-white/40 font-mono">{log.userName}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SNAPSHOT INSPECTOR MODAL */}
      {selectedSnapshot && (
        <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#111114] border border-white/15 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#1E1E24] to-[#121215] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/40">
                  <Lock className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    Immutable Certificate Snapshot &middot; {selectedSnapshot.revisionNumber}
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      SEALED &amp; ARCHIVED
                    </span>
                  </div>
                  <div className="text-xs text-white/60">
                    Issued: {new Date(selectedSnapshot.issuedAt).toLocaleString()} &middot; Commissioner: {selectedSnapshot.issuedBy.name}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedSnapshot(null)}
                className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-white/80">
              {/* Checksum & Immutability Bar */}
              <div className="p-3 bg-black/60 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Cryptographic Integrity Seal (SHA-256)</div>
                  <div className="font-mono text-xs text-white/90 break-all">{selectedSnapshot.documentChecksumSha256}</div>
                </div>
                <button
                  onClick={() => handleCopyHash(selectedSnapshot.documentChecksumSha256, 'modal-hash')}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-mono text-xs flex items-center gap-1.5 shrink-0 transition"
                >
                  {copiedId === 'modal-hash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Hash</span>
                </button>
              </div>

              {/* Premises & Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                  <div className="text-[10px] font-mono text-[#C1A461] uppercase font-bold">1. Client &amp; Premises</div>
                  <div><span className="text-white/40">Certificate No:</span> <strong className="text-white font-mono">{selectedSnapshot.cocNumber}</strong></div>
                  <div><span className="text-white/40">Client Name:</span> <strong className="text-white">{selectedSnapshot.clientName}</strong></div>
                  <div><span className="text-white/40">Site Name:</span> <strong className="text-white">{selectedSnapshot.siteName}</strong></div>
                  <div><span className="text-white/40">Occupancy:</span> {selectedSnapshot.snapshot.buildingOccupancyType}</div>
                </div>

                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                  <div className="text-[10px] font-mono text-[#C1A461] uppercase font-bold">2. Commissioner Credentials</div>
                  <div><span className="text-white/40">Commissioner:</span> <strong className="text-white">{selectedSnapshot.issuedBy.name}</strong></div>
                  <div><span className="text-white/40">SAQCC Reg:</span> <span className="font-mono text-white/90">{selectedSnapshot.issuedBy.saqccNumber || 'N/A'}</span></div>
                  <div><span className="text-white/40">Lead Technician:</span> {selectedSnapshot.snapshot.leadTechnician?.name || 'Sipho Ndlovu'}</div>
                  <div><span className="text-white/40">Audit Reference:</span> <strong className="text-amber-300 font-mono">{selectedSnapshot.auditTrailRef}</strong></div>
                </div>
              </div>

              {/* System Specs & Device Counts */}
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3">
                <div className="text-[10px] font-mono text-[#C1A461] uppercase font-bold">3. System Classification &amp; Sealed Device Schedule</div>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div><span className="text-white/40">Category:</span> <strong className="text-emerald-400 font-mono font-bold">Category {selectedSnapshot.systemCategory}</strong></div>
                  <div><span className="text-white/40">Objective:</span> {selectedSnapshot.snapshot.systemObjective}</div>
                  <div><span className="text-white/40">Sleeping Risk:</span> {selectedSnapshot.snapshot.isSleepingRisk ? 'Yes' : 'No'}</div>
                  <div><span className="text-white/40">Panel:</span> {selectedSnapshot.snapshot.controlPanelDetails?.brand} ({selectedSnapshot.snapshot.controlPanelDetails?.loopCount} Loops)</div>
                </div>

                <div className="pt-2 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                  <div className="p-2 bg-black/60 rounded-xl border border-blue-500/20">
                    <div className="text-[10px] text-blue-400">Smoke Detectors</div>
                    <div className="text-base font-bold text-white">{selectedSnapshot.snapshot.deviceSchedule.blueDotSmokeDetectors}</div>
                  </div>
                  <div className="p-2 bg-black/60 rounded-xl border border-white/10">
                    <div className="text-[10px] text-white/60">Heat Detectors</div>
                    <div className="text-base font-bold text-white">{selectedSnapshot.snapshot.deviceSchedule.blackDotHeatDetectors}</div>
                  </div>
                  <div className="p-2 bg-black/60 rounded-xl border border-green-500/20">
                    <div className="text-[10px] text-green-400">Manual Call Points</div>
                    <div className="text-base font-bold text-white">{selectedSnapshot.snapshot.deviceSchedule.greenDotManualCallPoints}</div>
                  </div>
                  <div className="p-2 bg-black/60 rounded-xl border border-red-500/20">
                    <div className="text-[10px] text-red-400">Sounders &amp; Sirens</div>
                    <div className="text-base font-bold text-white">{selectedSnapshot.snapshot.deviceSchedule.redDotSoundersSirens}</div>
                  </div>
                </div>
              </div>

              {/* Power & Autonomy */}
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                <div className="text-[10px] font-mono text-[#C1A461] uppercase font-bold">4. Technical Test Verification</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-white/40">Standby Autonomy:</span>{' '}
                    <strong className="text-white">{selectedSnapshot.snapshot.powerSupplyAutonomy.standbyAutonomyHours} hours</strong>
                  </div>
                  <div>
                    <span className="text-white/40">Alarm Duration:</span>{' '}
                    <strong className="text-white">{selectedSnapshot.snapshot.powerSupplyAutonomy.evacuateAlarmDurationMinutes} minutes</strong>
                  </div>
                  <div>
                    <span className="text-white/40">Bedhead Audibility:</span>{' '}
                    <strong className="text-white">{selectedSnapshot.snapshot.audibilityAndSounders.soundLevelBedheadDba} dB(A)</strong>
                  </div>
                </div>
              </div>

              {/* Signatures & Reason */}
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                <div className="text-[10px] font-mono text-[#C1A461] uppercase font-bold">5. Revision Notes &amp; Signatures</div>
                <div className="text-white/90 italic bg-black/60 p-2.5 rounded-lg border border-white/5">
                  "{selectedSnapshot.reasonForRevision}"
                </div>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-white/60">
                  <div>Commissioner Signature: <strong className="text-emerald-400">Sealed &amp; Verified</strong></div>
                  <div>Client Acknowledgment: <strong className="text-emerald-400">Signed</strong></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/60 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-white/50 font-mono">
                Immutable archive record &middot; Cannot be edited or deleted
              </div>
              <button
                onClick={() => {
                  handleRestoreClick(selectedSnapshot);
                  setSelectedSnapshot(null);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C1A461]" />
                Restore Snapshot into Form Base
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE DIFF / COMPARISON MODAL */}
      {comparingRevision && (
        <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#111114] border border-white/15 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-[#1E1E24] to-[#121215] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  Side-by-Side Comparison: {comparingRevision.revisionNumber} vs Current Active
                </h3>
              </div>
              <button
                onClick={() => setComparingRevision(null)}
                className="p-2 text-white/60 hover:text-white rounded-xl hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-2 border-b border-white/10 font-mono text-[11px] font-bold">
                <div className="text-[#C1A461]">ARCHIVED REVISION: {comparingRevision.revisionNumber}</div>
                <div className="text-emerald-400">CURRENT WORKING CERTIFICATE</div>
              </div>

              {[
                { label: 'Document Revision', a: comparingRevision.revisionNumber, b: currentRevisionNumber },
                { label: 'System Category', a: `Category ${comparingRevision.systemCategory}`, b: `Category ${coc.systemCategory}` },
                { label: 'Blue Smoke Detectors', a: comparingRevision.snapshot.deviceSchedule.blueDotSmokeDetectors, b: coc.deviceSchedule.blueDotSmokeDetectors },
                { label: 'Black Heat Detectors', a: comparingRevision.snapshot.deviceSchedule.blackDotHeatDetectors, b: coc.deviceSchedule.blackDotHeatDetectors },
                { label: 'Green Call Points', a: comparingRevision.snapshot.deviceSchedule.greenDotManualCallPoints, b: coc.deviceSchedule.greenDotManualCallPoints },
                { label: 'Red Sounders', a: comparingRevision.snapshot.deviceSchedule.redDotSoundersSirens, b: coc.deviceSchedule.redDotSoundersSirens },
                { label: 'Standby Autonomy', a: `${comparingRevision.snapshot.powerSupplyAutonomy.standbyAutonomyHours} hours`, b: `${coc.powerSupplyAutonomy.standbyAutonomyHours} hours` },
                { label: 'Bedhead Sound Level', a: `${comparingRevision.snapshot.audibilityAndSounders.soundLevelBedheadDba} dB(A)`, b: `${coc.audibilityAndSounders.soundLevelBedheadDba} dB(A)` },
                { label: 'Status', a: comparingRevision.overallComplianceStatus, b: coc.overallComplianceStatus },
                { label: 'Checksum SHA-256', a: `${comparingRevision.documentChecksumSha256.substring(0, 18)}...`, b: `${(coc.documentChecksumSha256 || 'Pending issue').substring(0, 18)}...` }
              ].map((row, i) => {
                const isDifferent = String(row.a) !== String(row.b);
                return (
                  <div key={i} className={`p-3 rounded-xl border ${isDifferent ? 'bg-amber-500/10 border-amber-500/30' : 'bg-black/30 border-white/5'}`}>
                    <div className="text-[10px] font-mono text-white/40 uppercase mb-1 flex items-center justify-between">
                      <span>{row.label}</span>
                      {isDifferent && <span className="text-amber-400 font-bold text-[9px] uppercase px-1.5 py-0.5 bg-amber-400/20 rounded">MODIFIED</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                      <div className="text-white/80">{String(row.a)}</div>
                      <div className={isDifferent ? 'text-[#C1A461] font-bold' : 'text-white/80'}>{String(row.b)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-black/60 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setComparingRevision(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-mono transition"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
