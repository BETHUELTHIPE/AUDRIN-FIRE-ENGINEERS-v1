import React from 'react';
import { 
  X, 
  Download, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Camera,
  Calendar,
  Building2,
  Printer
} from 'lucide-react';
import { ConditionReport } from '../../types';
import { generateConditionReportPdf } from '../../services/pdfGenerator';
import { COMPANY_DETAILS } from '../../data/initialData';

interface ConditionReportModalProps {
  report: ConditionReport | null;
  onClose: () => void;
}

export const ConditionReportModal: React.FC<ConditionReportModalProps> = ({
  report,
  onClose
}) => {
  if (!report) return null;

  const isPreWork = report.reportType === 'pre_work';

  const handleDownload = () => {
    generateConditionReportPdf(report);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#151518] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="px-6 py-5 bg-[#0A0A0B] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isPreWork ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  {isPreWork ? 'Pre-Work Condition Report' : 'Post-Work Condition Report'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151518] border border-white/5 text-white/70">
                  {report.reportNumber}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#151518] border border-white/5 text-white/50">
                  v{report.version}
                </span>
              </div>
              <p className="text-[11px] text-white/40 font-mono">
                SANS 10139 Aligned Digital Documentation Archive
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#C1A461] hover:bg-[#D4BC7B] text-black rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-white/70 text-xs">
          {/* Metadata Banner Box */}
          <div className="p-6 rounded-2xl bg-[#0A0A0B] border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Organisation & Client</div>
              <div className="text-white font-bold text-sm">{report.organisationName}</div>
              <div className="text-white/50">Client Rep: {report.clientName}</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Site & Facility</div>
              <div className="text-white font-bold text-sm">{report.siteName}</div>
              <div className="text-white/50">{report.siteAddress}</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Service Classification</div>
              <div className="text-[#C1A461] font-semibold">{report.serviceTitle}</div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Record Date & Engineering Desk</div>
              <div className="text-white/80 font-mono">{new Date(report.generatedAt).toLocaleDateString()} — Pretoria West</div>
            </div>
          </div>

          {/* Section 1: Scope */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-[1.5px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C1A461]" />
              <span>1. Scope Summary & Baseline Record</span>
            </h4>
            <p className="leading-relaxed p-4 rounded-xl bg-[#0A0A0B] border border-white/5 text-white/80">
              {report.scopeSummary}
            </p>
          </div>

          {/* Section 2: Visible Observations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-[1.5px] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#C1A461]" />
              <span>2. Visible Equipment Condition Observations</span>
            </h4>
            <p className="leading-relaxed p-4 rounded-xl bg-[#0A0A0B] border border-white/5 text-white/80">
              {report.visibleConditionNotes}
            </p>
          </div>

          {/* Section 3: Recommendations / Next step */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-[1.5px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>3. Physical Assessment Findings & Next Action</span>
            </h4>
            <div className="p-4 rounded-xl bg-[#0A0A0B] border border-white/5 space-y-2 text-white/80">
              <p><strong className="text-white">Assessment:</strong> {report.physicalAssessmentRequiredNotes}</p>
              <p><strong className="text-[#C1A461]">Recommended Next Step:</strong> {report.recommendedNextStep}</p>
            </div>
          </div>

          {/* Section 4: Snapshot Photos */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-[1.5px] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#C1A461]" />
              <span>4. Audited Photographic Evidence Snapshot ({report.evidenceSnapshot.photographs.length} Items)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.evidenceSnapshot.photographs.map((photo, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 space-y-2.5">
                  <div className="aspect-video rounded-xl overflow-hidden bg-[#151518] border border-white/5">
                    <img src={photo.imageUrl} alt={photo.caption} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
                    <span className="uppercase text-[#C1A461] font-bold">{photo.stage} Work</span>
                    <span>{photo.hash}</span>
                  </div>
                  <div className="text-white font-medium text-xs">{photo.caption}</div>
                  <div className="text-white/40 text-[11px]">{photo.location}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Statutory Disclaimer */}
          <div className="p-5 rounded-2xl bg-[#0A0A0B] border border-amber-500/20 text-xs text-white/60 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Compliance Limitations Notice</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              {report.limitationsDisclaimer}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#0A0A0B] border-t border-white/5 flex items-center justify-between">
          <div className="text-[11px] text-white/40 font-mono">
            {COMPANY_DETAILS.legalName} • Pretoria West Desk
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black rounded-xl text-xs uppercase tracking-[1.5px] font-bold transition shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Generate Official PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
