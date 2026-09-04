import React, { useState } from 'react';
import { SansCocCertificate } from '../../../types';
import { exportCocToLockedPdf, CocPdfExportOptions } from '../../../services/cocPdfService';
import { 
  FileCheck, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  X, 
  Loader2, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Info
} from 'lucide-react';

interface CocPdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  coc: SansCocCertificate;
  defaultIsDraft?: boolean;
}

export const CocPdfExportModal: React.FC<CocPdfExportModalProps> = ({
  isOpen,
  onClose,
  coc,
  defaultIsDraft
}) => {
  const isActuallyIssued = coc.certificateStatus === 'Issued' && coc.isSigned;
  const initialDraft = defaultIsDraft !== undefined ? defaultIsDraft : !isActuallyIssued;

  const [watermarkMode, setWatermarkMode] = useState<'DRAFT' | 'ISSUED' | 'AUTO'>('AUTO');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const effectiveIsDraft = watermarkMode === 'AUTO' 
    ? initialDraft 
    : watermarkMode === 'DRAFT';

  const handleStartExport = async () => {
    setIsExporting(true);
    setExportProgress(10);
    setCurrentStep('Preparing document structure...');
    setExportSuccess(null);
    setExportError(null);

    try {
      // Find visible DOM element if available
      const previewEl = document.getElementById('sans-coc-printable-document');

      const options: CocPdfExportOptions = {
        coc,
        element: previewEl,
        isDraft: effectiveIsDraft,
        watermarkType: effectiveIsDraft ? 'DRAFT' : 'ISSUED',
        onProgress: (step, percent) => {
          setCurrentStep(step);
          setExportProgress(percent);
        }
      };

      const result = await exportCocToLockedPdf(options);
      setExportSuccess(result.filename);
      setIsExporting(false);
    } catch (err: any) {
      console.error('Export failed:', err);
      setExportError(err?.message || 'Failed to export locked PDF. Please check your browser permissions.');
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#141417] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1E1E24] to-[#141418] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C1A461]/20 border border-[#C1A461]/30 flex items-center justify-center text-[#C1A461]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Export Locked SANS 10139 PDF
              </h3>
              <p className="text-xs text-white/50 font-mono">
                {coc.cocNumber} &middot; {coc.siteName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-1.5 text-white/50 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Information box */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2 text-white/80">
            <div className="flex items-center gap-2 font-mono font-bold text-[#C1A461] uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#C1A461]" />
              Locked &amp; Non-Editable Document Engine
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              This service renders the Certificate of Compliance through <strong>html2canvas</strong> and <strong>jsPDF</strong>. All form inputs, vector geometry, test tables, and electronic signatures are rasterized into tamper-proof image layers with cryptographic SHA-256 validation.
            </p>
          </div>

          {/* Watermark Selection */}
          <div className="space-y-2.5">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white/70">
              Required Statutory Watermark:
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Draft Option */}
              <button
                type="button"
                onClick={() => setWatermarkMode('DRAFT')}
                disabled={isExporting}
                className={`p-3.5 rounded-2xl border text-left transition relative cursor-pointer ${
                  effectiveIsDraft
                    ? 'bg-amber-500/15 border-amber-500/60 ring-2 ring-amber-500/20'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                    DRAFT
                  </span>
                  {effectiveIsDraft && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="font-bold text-xs text-white">DRAFT Watermark</div>
                <div className="text-[10px] text-white/50 font-mono mt-0.5">
                  "DRAFT – NOT A VALID CERTIFICATE"
                </div>
              </button>

              {/* Issued Option */}
              <button
                type="button"
                onClick={() => setWatermarkMode('ISSUED')}
                disabled={isExporting}
                className={`p-3.5 rounded-2xl border text-left transition relative cursor-pointer ${
                  !effectiveIsDraft
                    ? 'bg-emerald-500/15 border-emerald-500/60 ring-2 ring-emerald-500/20'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                    ISSUED
                  </span>
                  {!effectiveIsDraft && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="font-bold text-xs text-white">ISSUED Watermark</div>
                <div className="text-[10px] text-white/50 font-mono mt-0.5">
                  "OFFICIALLY ISSUED &amp; LOCKED"
                </div>
              </button>
            </div>

            <div className="text-[10px] font-mono text-white/40 flex items-center gap-1.5 pt-1">
              <Info className="w-3.5 h-3.5 shrink-0 text-[#C1A461]" />
              <span>Current Form Status: <strong>{coc.certificateStatus}</strong> &middot; Co-Signed: <strong>{coc.isSigned ? 'Yes' : 'No'}</strong></span>
            </div>
          </div>

          {/* Progress Indicator */}
          {isExporting && (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/80 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#C1A461] animate-spin" />
                  {currentStep || 'Processing...'}
                </span>
                <span className="text-[#C1A461] font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#C1A461] to-emerald-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Message */}
          {exportSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs space-y-1.5 animate-in fade-in">
              <div className="font-bold font-mono flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                Locked PDF Downloaded Successfully!
              </div>
              <div className="text-[11px] text-emerald-200/90 font-mono break-all">
                Filename: <strong>{exportSuccess}</strong>
              </div>
              <div className="text-[10px] text-emerald-300/70 font-mono">
                Watermark applied: <strong>{effectiveIsDraft ? 'DRAFT – NOT A VALID CERTIFICATE' : 'OFFICIALLY ISSUED & LOCKED'}</strong>
              </div>
            </div>
          )}

          {/* Error Message */}
          {exportError && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs space-y-1 animate-in fade-in">
              <div className="font-bold font-mono flex items-center gap-2 text-red-300">
                <AlertTriangle className="w-4 h-4" />
                PDF Generation Failed
              </div>
              <p className="text-[11px] text-red-200/80 font-mono">{exportError}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-[#101014] border-t border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono transition disabled:opacity-40"
          >
            {exportSuccess ? 'Close' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleStartExport}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#d4bc7b] text-black font-bold text-xs font-mono flex items-center gap-2 transition disabled:opacity-40 shadow-lg shadow-[#C1A461]/20 cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Locked PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Locked PDF Now</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
