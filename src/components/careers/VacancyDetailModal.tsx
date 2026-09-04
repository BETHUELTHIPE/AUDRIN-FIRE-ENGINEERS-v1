import React from 'react';
import { 
  X, 
  Briefcase, 
  MapPin, 
  Clock, 
  Award, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  ChevronRight, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { VacancyRecord } from '../../types';

interface VacancyDetailModalProps {
  vacancy: VacancyRecord;
  onClose: () => void;
  onApply: (vacancy: VacancyRecord) => void;
  hasApplied?: boolean;
}

export const VacancyDetailModal: React.FC<VacancyDetailModalProps> = ({
  vacancy,
  onClose,
  onApply,
  hasApplied = false
}) => {
  const isClosingSoon = () => {
    const closing = new Date(vacancy.closingDate).getTime();
    const now = Date.now();
    const daysLeft = Math.ceil((closing - now) / (1000 * 60 * 60 * 24));
    return daysLeft <= 14 && daysLeft >= 0;
  };

  const isExpired = new Date(vacancy.closingDate).getTime() < Date.now();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#151518] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#1c1c22] to-[#121215] border-b border-white/10 p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-md bg-[#C1A461]/20 border border-[#C1A461]/40 text-[#C1A461] text-xs font-mono font-bold tracking-wider">
              {vacancy.referenceNumber}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 text-white/80 text-xs font-medium">
              {vacancy.department}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              {vacancy.employmentType}
            </span>
            {isClosingSoon() && !vacancy.isClosed && (
              <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Closing Soon
              </span>
            )}
            {vacancy.isClosed && (
              <span className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-300 text-xs font-bold">
                Applications Closed
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pr-8">
            {vacancy.jobTitle}
          </h2>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/60">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C1A461]" />
              <span>{vacancy.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#C1A461]" />
              <span>Closing Date: <strong className="text-white">{vacancy.closingDate}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C1A461]" />
              <span>SANS 10139 & SAQCC Regulated</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {/* SANS 10139 Compliance Scope Note */}
          <div className="p-4 rounded-xl bg-[#C1A461]/10 border border-[#C1A461]/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#C1A461] shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-[#D4BC7B] uppercase tracking-wider text-[11px]">
                Audrin Technical Standards Requirement
              </p>
              <p className="text-white/80 leading-relaxed">
                Audrin Fire Engineers specialises strictly in electronic fire-detection, addressable loop telemetry, and life-safety alarm engineering. Candidates must hold valid SAQCC Fire certification and uphold strict statutory SANS 10139 commissioning ethics.
              </p>
            </div>
          </div>

          {/* Key Duties & Scope */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#C1A461] mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Key Responsibilities & Operational Scope</span>
            </h3>
            <ul className="space-y-2.5">
              {vacancy.duties.map((duty, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-white/80 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{duty}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Minimum Requirements */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#C1A461] mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Minimum Qualifications & Competencies</span>
            </h3>
            <ul className="space-y-2.5">
              {vacancy.minimumRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-white/80 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C1A461] shrink-0 mt-2" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Certifications */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C1A461]" />
              <span>Mandatory Professional Accreditations</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {vacancy.requiredCertifications.map((cert, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/90 text-xs font-medium">
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Screening Overview */}
          {vacancy.screeningQuestions && vacancy.screeningQuestions.length > 0 && (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                Screening Assessment Preview ({vacancy.screeningQuestions.length} Questions)
              </h4>
              <p className="text-xs text-white/50">
                During the application process, you will be asked to confirm your SAQCC registration status, panel architecture familiarity, and years of SANS 10139 field experience.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#121215] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/50">
            Reference: <span className="font-mono text-white/80 font-bold">{vacancy.referenceNumber}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition"
            >
              Close
            </button>
            {hasApplied ? (
              <button
                disabled
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" /> Already Applied
              </button>
            ) : vacancy.isClosed || isExpired ? (
              <button
                disabled
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-white/10 text-white/40 text-xs font-bold cursor-not-allowed"
              >
                Applications Closed
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onApply(vacancy);
                }}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold tracking-wide transition flex items-center justify-center gap-2 shadow-lg shadow-[#C1A461]/20"
              >
                <span>Apply For Position</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
