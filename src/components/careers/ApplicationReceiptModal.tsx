import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  QrCode, 
  Calendar, 
  User, 
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { TechnicianJobApplication } from '../../types';
import { COMPANY_DETAILS } from '../../data/initialData';

interface ApplicationReceiptModalProps {
  application: TechnicianJobApplication;
  onClose: () => void;
}

export const ApplicationReceiptModal: React.FC<ApplicationReceiptModalProps> = ({
  application,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-200 print:m-0 print:border-none print:shadow-none">
        {/* Top Action Bar (hidden when printing) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C1A461] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Application Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Receipt Printable Content */}
        <div className="p-8 space-y-6 bg-white">
          {/* Company & Verification Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                AUDRIN FIRE ENGINEERS
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                (Pty) Ltd &bull; Registration No. 2026/084921/07 &bull; Pretoria
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                SANS 10139 &bull; SANS 10400-T &bull; SAQCC Life-Safety Regulatory Division
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded font-mono text-xs font-bold">
                {application.referenceNumber}
              </span>
              <div className="text-[10px] text-slate-500 mt-1">
                Issued: {new Date(application.submittedAt).toLocaleDateString('en-ZA')}
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-900">Application Registered & Timestamped</div>
                <div className="text-[11px] text-emerald-700">Status: {application.status.toUpperCase()}</div>
              </div>
            </div>
            <div className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-2 py-1 rounded">
              POPIA COMPLIANT
            </div>
          </div>

          {/* Job & Candidate Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Position Applied For</span>
              <div className="font-bold text-slate-900">{application.jobTitle}</div>
              <div className="text-slate-500 text-[11px]">Ref: {application.vacancyRef}</div>
            </div>

            <div className="space-y-1 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Candidate Details</span>
              <div className="font-bold text-slate-900">{application.applicantName}</div>
              <div className="text-slate-500 text-[11px]">{application.applicantEmail}</div>
              <div className="text-slate-500 text-[11px]">{application.applicantPhone}</div>
            </div>
          </div>

          {/* SAQCC Competency Snapshot */}
          <div className="border border-slate-200 rounded-xl p-4 text-xs space-y-3">
            <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#C1A461]" />
              <span>Accreditation Snapshot at Lodgement</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">SAQCC Reg No:</span>
                <strong className="font-mono text-slate-800">{application.profileSnapshot.saqccNumber || 'Not provided'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Experience:</span>
                <strong className="text-slate-800">{application.profileSnapshot.yearsOfExperience} Years</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Driver Licence:</span>
                <strong className="text-slate-800">{application.profileSnapshot.driverLicense}</strong>
              </div>
            </div>

            {application.profileSnapshot.saqccCategories.length > 0 && (
              <div className="text-[11px] pt-1">
                <span className="text-slate-500 block mb-1">Registered Categories:</span>
                <div className="flex flex-wrap gap-1">
                  {application.profileSnapshot.saqccCategories.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium uppercase">
                      {c.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Screening Summary */}
          {application.answers.length > 0 && (
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Screening Assessment Responses
              </div>
              <div className="space-y-1.5">
                {application.answers.map((ans, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg text-[11px] border border-slate-100">
                    <div className="font-medium text-slate-700">{ans.questionText}</div>
                    <div className="font-bold text-slate-900 mt-0.5">&bull; {ans.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cryptographic Integrity Footer */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[9px] text-slate-400 font-mono">
            <div className="space-y-0.5">
              <div>TAMPER-EVIDENT SHA256 RECORD HASH:</div>
              <div className="text-slate-600 select-all">{application.receiptHashSha256}</div>
            </div>
            <div className="text-right">
              <div>CENTRAL DISPATCH: VERIFIED</div>
              <div>POPIA REGISTRY: ACTIVE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
