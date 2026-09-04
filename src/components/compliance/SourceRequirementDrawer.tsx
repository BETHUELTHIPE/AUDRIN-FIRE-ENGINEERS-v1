import React from 'react';
import { SourceRequirement, ApprovedSourceDocument } from '../../types';
import { useAudrinStore } from '../../services/store';
import { 
  FileText, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  BookOpen, 
  AlertTriangle, 
  ExternalLink,
  Lock,
  Hash,
  Award
} from 'lucide-react';

interface SourceRequirementDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  requirementId?: string;
  sourceDocId?: string;
}

export const SourceRequirementDrawer: React.FC<SourceRequirementDrawerProps> = ({
  isOpen,
  onClose,
  requirementId,
  sourceDocId
}) => {
  const store = useAudrinStore();
  const sourceDocs = store.getApprovedSourceDocuments();
  const sourceRequirements = store.getSourceRequirements();

  if (!isOpen) return null;

  const selectedReq = requirementId 
    ? store.getSourceRequirementById(requirementId) 
    : undefined;

  const selectedDoc = sourceDocId 
    ? sourceDocs.find(d => d.id === sourceDocId) 
    : (selectedReq ? sourceDocs.find(d => d.id === selectedReq.sourceDocId) : sourceDocs[0]);

  const relatedRequirements = selectedDoc 
    ? sourceRequirements.filter(r => r.sourceDocId === selectedDoc.id) 
    : sourceRequirements;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0F0F12] border-l border-white/10 h-full flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="p-6 border-b border-white/10 bg-[#151518] flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C1A461]" />
              <span className="text-[11px] font-mono uppercase font-bold text-[#C1A461] tracking-widest">
                Binding Technical Source Citations
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Approved Technical Source Registry
            </h2>
            <p className="text-xs text-white/50">
              Verified mapping strictly against the two approved controlled attachments.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Documents Switcher */}
        <div className="p-4 bg-[#0A0A0B] border-b border-white/5 flex gap-2 overflow-x-auto shrink-0">
          {sourceDocs.map(doc => (
            <button
              key={doc.id}
              onClick={() => {
                // select this doc
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium border text-left transition flex items-center gap-2.5 ${
                selectedDoc?.id === doc.id
                  ? 'bg-[#C1A461]/15 border-[#C1A461] text-[#C1A461]'
                  : 'bg-[#151518] border-white/5 text-white/70 hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <div className="truncate max-w-[240px]">
                <div className="font-bold truncate">{doc.fileName}</div>
                <div className="text-[10px] opacity-70 truncate">{doc.editionOrDate}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          
          {/* Active Document Metadata Banner */}
          {selectedDoc && (
            <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 uppercase font-mono">
                      {selectedDoc.approvalStatus}
                    </span>
                    <span className="text-xs font-mono text-white/40">
                      {selectedDoc.pageCount} Pages
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-2">
                    {selectedDoc.documentTitle}
                  </h3>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed">
                    {selectedDoc.summaryScope}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 text-[11px] font-mono">
                <div>
                  <span className="text-white/40 block">Approved By:</span>
                  <span className="text-white font-medium">{selectedDoc.approvedBy}</span>
                </div>
                <div>
                  <span className="text-white/40 block">Approval Date:</span>
                  <span className="text-white font-medium">
                    {new Date(selectedDoc.approvalDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-white/40 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-[#C1A461]" /> Content Hash (SHA-256):
                  </span>
                  <span className="text-[10px] text-[#C1A461] break-all font-mono">
                    {selectedDoc.contentHash}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Highlighted Requirement (if passed via props) */}
          {selectedReq && (
            <div className="p-5 rounded-2xl bg-[#C1A461]/10 border border-[#C1A461]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#C1A461] text-black font-bold text-[10px] uppercase font-mono">
                  Active Question Citation
                </span>
                <span className="text-xs font-mono text-[#C1A461] font-bold">
                  PDF Page {selectedReq.pdfPage} &middot; {selectedReq.clauseOrQuestion}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white">
                {selectedReq.requirementTitle}
              </h4>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                  Approved Technical Paraphrase:
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedReq.approvedParaphrase}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                  Verbatim Source Passage:
                </div>
                <p className="text-xs italic text-white/70 leading-relaxed border-l-2 border-[#C1A461] pl-3">
                  "{selectedReq.verbatimQuote}"
                </p>
              </div>
            </div>
          )}

          {/* List of All Controlled Requirements in Selected Document */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">
                Controlled Technical Clauses & Questions ({relatedRequirements.length})
              </h4>
              <span className="text-[11px] font-mono text-[#C1A461]">
                Zero Outside AI RAG Allowed
              </span>
            </div>

            <div className="space-y-3">
              {relatedRequirements.map(req => (
                <div
                  key={req.id}
                  className={`p-4 rounded-xl border transition ${
                    selectedReq?.id === req.id
                      ? 'bg-[#1E1E22] border-[#C1A461]/50'
                      : 'bg-[#151518] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#C1A461]">
                        {req.clauseOrQuestion}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/50">
                        Page {req.pdfPage}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/20">
                      Approved
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white mt-1.5">
                    {req.requirementTitle}
                  </div>

                  <p className="text-xs text-white/60 mt-1 leading-relaxed">
                    {req.approvedParaphrase}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-white/40">
                    <div>Category: <span className="text-white/70">{req.category}</span></div>
                    <div className="flex gap-1">
                      {req.appliesTo.map(app => (
                        <span key={app} className="px-1.5 py-0.2 rounded bg-white/5 text-white/60">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Source Coverage Notice */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-amber-400 uppercase tracking-wide font-mono">
                Mandatory Source-Coverage Gate
              </div>
              <p className="text-amber-200/80 leading-relaxed text-[11px]">
                These approved attachments represent the binding source of truth. As they do not comprise the entire SANS 10139 library, all forms generated from this set are stamped <strong className="text-white">SOURCE-LIMITED DRAFT - NOT AN ISSUABLE CERTIFICATE</strong> until confirmed complete by a competent person.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#151518] border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="text-[11px] font-mono text-white/40">
            Source Control Ver. 2026.09
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase rounded-xl transition"
          >
            Close Citation Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
