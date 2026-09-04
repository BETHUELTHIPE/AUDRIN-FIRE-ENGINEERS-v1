import React from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  ArrowRight, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  CheckCircle2
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../data/initialData';

interface EmergencyFaultBannerProps {
  onReportFault: () => void;
}

export const EmergencyFaultBanner: React.FC<EmergencyFaultBannerProps> = ({
  onReportFault
}) => {
  return (
    <section className="bg-[#0D0D0E] border-y border-white/5 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        <div className="space-y-3.5 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider text-red-300">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Commercial Fire-Alarm Fault Resolution Desk</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Experiencing a Critical Fire-Alarm Fault, Continuous Buzzer, or Persistent False Alarm?
          </h3>

          <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-normal">
            Unresolved faults compromise life safety and create severe liability risks under SANS 10139. Our Pretoria West engineering desk coordinates rapid diagnosis for earth faults, open circuits, loop corruption, battery failures, and detector drift.
          </p>

          <div className="flex flex-wrap items-center gap-5 text-xs text-white/50 pt-2 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-white/70">
              <Clock className="w-3.5 h-3.5 text-[#C1A461]" />
              <span>Desk: {COMPANY_DETAILS.operatingHours} (Mon–Sun)</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/70">
              <Cpu className="w-3.5 h-3.5 text-[#C1A461]" />
              <span>Multi-Protocol Conventional & Addressable Panels</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={onReportFault}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-200 font-bold text-xs uppercase tracking-[1.5px] rounded-xl shadow-xl transition transform hover:-translate-y-0.5"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Report Fire-Alarm Fault</span>
          </button>

          <a
            href={`tel:${COMPANY_DETAILS.phone}`}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#151518] hover:bg-[#1E1E22] border border-white/10 text-white font-mono font-semibold text-xs uppercase tracking-wider rounded-xl transition"
          >
            <PhoneCall className="w-4 h-4 text-[#C1A461]" />
            <span>Call {COMPANY_DETAILS.phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

