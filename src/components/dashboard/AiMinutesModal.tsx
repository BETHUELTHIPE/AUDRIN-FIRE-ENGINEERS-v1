import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Users, 
  FileText,
  Radio,
  FileCheck2
} from 'lucide-react';
import { AiMeetingMinutes } from '../../types';
import { generateAiMinutesPdf } from '../../services/pdfGenerator';
import { COMPANY_DETAILS } from '../../data/initialData';

interface AiMinutesModalProps {
  minutes: AiMeetingMinutes | null;
  onClose: () => void;
}

export const AiMinutesModal: React.FC<AiMinutesModalProps> = ({
  minutes,
  onClose
}) => {
  if (!minutes) return null;

  const handleDownloadPdf = () => {
    generateAiMinutesPdf(minutes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#151518] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="px-6 py-5 bg-[#0A0A0B] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A0A0B] border border-[#C1A461]/30 flex items-center justify-center text-[#C1A461]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  AI-Assisted Technical Meeting Minutes
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151518] border border-white/5 text-[#C1A461]">
                  v{minutes.version}
                </span>
              </div>
              <p className="text-[11px] text-white/40 font-mono">
                Extracted from Technical Consultation Audio & Chat Records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
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

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-white/70 text-xs">
          {/* Metadata Card */}
          <div className="p-6 rounded-2xl bg-[#0A0A0B] border border-white/5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
              <h4 className="text-sm font-bold text-white">{minutes.meetingTitle}</h4>
              <span className="text-[11px] font-mono text-white/40">{minutes.dateTime}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Confirmed Attendees</div>
                <div className="text-white font-medium">{minutes.attendees.join(', ')}</div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Apologies</div>
                <div className="text-white/50">{minutes.apologies.join(', ') || 'None recorded'}</div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Next Workflow Stage</div>
                <div className="text-[#C1A461] font-bold">{minutes.nextWorkflowStage}</div>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-[1.5px] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C1A461]" />
              <span>1. Executive Summary</span>
            </h4>
            <div className="p-4 rounded-xl bg-[#0A0A0B] border border-white/5 leading-relaxed text-white/80">
              {minutes.executiveSummary}
            </div>
          </div>

          {/* Section 2: Discussion Points */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-[1.5px] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#C1A461]" />
              <span>2. Technical Discussion Points</span>
            </h4>

            <div className="space-y-2">
              {minutes.discussionPoints.map((point, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0A0A0B] border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{point.topic}</span>
                    <span className="text-[10px] font-mono bg-[#151518] px-2 py-0.5 rounded text-white/50 border border-white/5">
                      Raised By: {point.raisedBy}
                    </span>
                  </div>
                  <p className="text-white/70 leading-relaxed">{point.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Action Items */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-[1.5px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>3. Agreed Action Items & Responsibilities</span>
            </h4>

            <div className="space-y-2">
              {minutes.actionItems.map((action, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0A0A0B] border border-white/5 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white text-xs">{idx + 1}. {action.task}</span>
                    <div className="text-[11px] text-white/50">
                      Owner: <strong className="text-white">{action.owner}</strong> • Due: <span className="font-mono text-[#C1A461]">{action.dueDate}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-[#151518] text-[#C1A461] border border-[#C1A461]/30">
                    {action.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory AI Disclaimer */}
          <div className="p-5 rounded-2xl bg-[#0A0A0B] border border-amber-500/20 text-xs text-white/60 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>AI Transcription & Minutes Disclaimer</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              {minutes.complianceDisclaimer}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#0A0A0B] border-t border-white/5 flex items-center justify-between">
          <div className="text-[11px] text-white/40 font-mono">
            AUDRIN FIRE ENGINEERS (PTY) LTD
          </div>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black rounded-xl text-xs uppercase tracking-[1.5px] font-bold transition shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Generate Official Minutes PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
