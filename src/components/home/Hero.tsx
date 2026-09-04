import React from 'react';
import { 
  ShieldCheck, 
  Flame, 
  ShieldAlert, 
  ArrowRight, 
  Radio, 
  PhoneCall, 
  Building2, 
  CheckCircle2,
  FileText,
  Activity
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../data/initialData';

interface HeroProps {
  onRequestService: (serviceSlug?: string) => void;
  onReportFault: () => void;
  onOpenVoiceAi?: () => void;
  onOpenVoiceGuide?: () => void;
  onNavigate?: (view: string, param?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onRequestService,
  onReportFault,
  onOpenVoiceAi,
  onOpenVoiceGuide,
  onNavigate = (_view?: string, _param?: string) => {}
}) => {
  const handleVoice = onOpenVoiceAi || onOpenVoiceGuide || (() => {});

  return (
    <section className="relative overflow-hidden bg-[#0A0A0B] pt-12 pb-16 lg:py-24 text-white border-b border-white/5">
      {/* Subtle Background Radial / Grid Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C1A461]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Content (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-7">
            {/* Standard Alignment Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151518] border border-white/10 text-xs font-semibold text-white/70 backdrop-blur-sm shadow-inner">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C1A461]" />
              <span className="tracking-wide">SANS 10139 Aligned Fire-Detection & Alarm Systems</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white leading-[1.08]">
                Precision Commercial Fire-Alarm Engineering
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#C1A461] uppercase tracking-widest">
                {COMPANY_DETAILS.tagline}
              </p>
            </div>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-2xl font-normal">
              AUDRIN FIRE ENGINEERS (PTY) LTD delivers precision engineering for commercial, institutional, and industrial facilities across South Africa. From site surveys, category design, and addressable installations to methodical quarterly maintenance and rapid fault troubleshooting.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onRequestService()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black font-bold text-xs uppercase tracking-[1.5px] shadow-xl shadow-black/60 transition transform hover:-translate-y-0.5"
              >
                <span>Request a Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onRequestService('fire-detection-site-surveys')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#151518] hover:bg-[#1E1E22] border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition hover:border-[#C1A461]/50"
              >
                <FileText className="w-4 h-4 text-[#C1A461]" />
                <span>Site Survey Intake</span>
              </button>

              <button
                onClick={onReportFault}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-300 font-bold text-xs uppercase tracking-wider transition"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Report Alarm Fault</span>
              </button>
            </div>

            {/* Voice AI Trigger & Direct Hotline */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5 text-xs text-white/50">
              <button
                onClick={handleVoice}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#151518] hover:bg-[#1E1E22] border border-[#C1A461]/30 text-[#C1A461] font-semibold transition"
              >
                <Radio className="w-3.5 h-3.5 text-[#C1A461] animate-pulse" />
                <span>Interactive Voice AI Guide</span>
              </button>

              <div className="flex items-center gap-2">
                <span>Emergency Desk:</span>
                <a href={`tel:${COMPANY_DETAILS.phone}`} className="text-white font-mono font-bold hover:text-[#C1A461] transition">
                  {COMPANY_DETAILS.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-[#151518] border border-white/5 p-7 shadow-2xl space-y-6">
              {/* Header inside card */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A1C] border border-[#C1A461]/30 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#C1A461]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white tracking-tight">
                      Technical Service Intake
                    </h3>
                    <p className="text-[10px] text-[#C1A461] font-mono uppercase tracking-wider">
                      STATUS: STANDBY & OPERATIONAL
                    </p>
                  </div>
                </div>

                <span className="text-[9px] font-bold uppercase tracking-wider bg-[#C1A461]/10 text-[#C1A461] border border-[#C1A461]/30 px-2.5 py-1 rounded-full">
                  PRETORIA DESK
                </span>
              </div>

              {/* Core Engineering Disciplines Checklist */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3 text-xs text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#C1A461] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-semibold">SANS 10139 Categories:</strong>
                    <span className="text-white/50 block text-[11px] mt-0.5">Category M, Life Safety (L1–L5), and Property Protection (P1–P2).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#C1A461] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-semibold">Point-to-Point Testing:</strong>
                    <span className="text-white/50 block text-[11px] mt-0.5">100% loop activation, audibility mapping, and HVAC interface verification.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#C1A461] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-semibold">Audited Documentation:</strong>
                    <span className="text-white/50 block text-[11px] mt-0.5">Pre/post-work condition reports, laminated zone charts, and compliance logbooks.</span>
                  </div>
                </div>
              </div>

              {/* Verified Business Parameters */}
              <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 text-[11px] text-white/50 space-y-2 font-mono">
                <div className="flex justify-between items-center">
                  <span>Registration Number:</span>
                  <span className="text-white font-semibold">{COMPANY_DETAILS.registrationNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Coverage Area:</span>
                  <span className="text-white font-semibold">{COMPANY_DETAILS.serviceArea}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Operating Desk:</span>
                  <span className="text-white font-semibold">{COMPANY_DETAILS.operatingHours}</span>
                </div>
              </div>

              {/* Fast-track Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => onNavigate('how-we-work')}
                  className="py-2.5 px-3 bg-[#0D0D0E] hover:bg-[#1E1E22] border border-white/5 text-white/70 hover:text-white text-xs font-semibold rounded-xl text-center transition uppercase tracking-wider text-[10px]"
                >
                  7-Step Process
                </button>
                <button
                  onClick={() => onNavigate('services')}
                  className="py-2.5 px-3 bg-[#C1A461]/10 hover:bg-[#C1A461]/20 text-[#C1A461] text-xs font-semibold rounded-xl text-center border border-[#C1A461]/30 transition uppercase tracking-wider text-[10px]"
                >
                  Services Catalogue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

