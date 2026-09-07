import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Radio, 
  CheckCircle2,
  FileText,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../data/initialData';
import { motion } from 'motion/react';
import { AudrinLogo } from '../common/AudrinLogo';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0A0A0B] pt-12 pb-16 lg:py-24 text-white border-b border-white/5">
      {/* Subtle Background Radial / Grid Accents with subtle float animation */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
      <motion.div 
        animate={{ 
          scale: [1, 1.08, 1],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C1A461]/10 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Content (Left 7 Cols) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-7"
          >
            {/* Official Brand Badge & Standard Alignment */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
              <AudrinLogo variant="badge" />
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#151518] border border-white/10 text-xs font-semibold text-white/80 backdrop-blur-sm shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#C1A461]" />
                <span className="tracking-wide">SANS 10139 Aligned Fire Systems</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={itemVariants} className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-white leading-[1.08]">
                Precision Commercial Fire-Alarm Engineering
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#C1A461] uppercase tracking-widest flex items-center gap-2">
                <span>{COMPANY_DETAILS.tagline}</span>
              </p>
            </motion.div>

            {/* Supporting Copy */}
            <motion.p variants={itemVariants} className="text-sm sm:text-base text-white/60 leading-relaxed max-w-2xl font-normal">
              AUDRIN FIRE ENGINEERS (PTY) LTD delivers precision engineering for commercial, institutional, and industrial facilities across South Africa. From site surveys, category design, and addressable installations to methodical quarterly maintenance and rapid fault troubleshooting.
            </motion.p>

            {/* Primary Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 pt-2">
              <motion.button
                whileHover={{ y: -2, scale: 1.02, boxShadow: '0 12px 28px -6px rgba(193, 164, 97, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onRequestService()}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black font-bold text-xs uppercase tracking-[1.5px] shadow-xl shadow-black/60 transition cursor-pointer"
              >
                <span>Request a Service</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onRequestService('fire-detection-site-surveys')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#151518] hover:bg-[#1E1E22] border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition hover:border-[#C1A461]/50 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#C1A461]" />
                <span>Site Survey Intake</span>
              </motion.button>

              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onReportFault}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Report Alarm Fault</span>
              </motion.button>
            </motion.div>

            {/* Voice AI Trigger & Direct Hotline */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5 text-xs text-white/50">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleVoice}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#151518] hover:bg-[#1E1E22] border border-[#C1A461]/30 text-[#C1A461] font-semibold transition cursor-pointer shadow-sm"
              >
                <Radio className="w-3.5 h-3.5 text-[#C1A461] animate-pulse" />
                <span>Interactive Voice AI Guide</span>
              </motion.button>

              <div className="flex items-center gap-2">
                <span>Emergency Desk:</span>
                <a href={`tel:${COMPANY_DETAILS.phone}`} className="text-white font-mono font-bold hover:text-[#C1A461] transition">
                  {COMPANY_DETAILS.phone}
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Hero Visual Card (5 Cols) with smooth spring-in */}
          <motion.div 
            initial={{ opacity: 0, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl bg-[#151518] border border-white/5 p-7 shadow-2xl space-y-6 hover:border-[#C1A461]/30 transition duration-300">
              {/* Header inside card */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1A1A1C] border border-[#C1A461]/30 flex items-center justify-center shadow-inner">
                    <Activity className="w-5 h-5 text-[#C1A461]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white tracking-tight">
                      Technical Service Intake
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <p className="text-[10px] text-[#C1A461] font-mono uppercase tracking-wider font-semibold">
                        STATUS: STANDBY & OPERATIONAL
                      </p>
                    </div>
                  </div>
                </div>

                <span className="text-[9px] font-bold uppercase tracking-wider bg-[#C1A461]/10 text-[#C1A461] border border-[#C1A461]/30 px-2.5 py-1 rounded-full font-mono">
                  PRETORIA DESK
                </span>
              </div>

              {/* Core Engineering Disciplines Checklist */}
              <div className="space-y-3.5">
                <motion.div 
                  whileHover={{ x: 3 }}
                  className="flex items-start gap-3 text-xs text-white/80 p-2 rounded-xl hover:bg-white/5 transition duration-150"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C1A461] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-semibold">SANS 10139 Categories:</strong>
                    <span className="text-white/50 block text-[11px] mt-0.5">Category M, Life Safety (L1–L5), and Property Protection (P1–P2).</span>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 3 }}
                  className="flex items-start gap-3 text-xs text-white/80 p-2 rounded-xl hover:bg-white/5 transition duration-150"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C1A461] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-semibold">Point-to-Point Testing:</strong>
                    <span className="text-white/50 block text-[11px] mt-0.5">100% loop activation, audibility mapping, and HVAC interface verification.</span>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 3 }}
                  className="flex items-start gap-3 text-xs text-white/80 p-2 rounded-xl hover:bg-white/5 transition duration-150"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C1A461] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white font-semibold">Audited Documentation:</strong>
                    <span className="text-white/50 block text-[11px] mt-0.5">Pre/post-work condition reports, laminated zone charts, and compliance logbooks.</span>
                  </div>
                </motion.div>
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('how-we-work')}
                  className="py-2.5 px-3 bg-[#0D0D0E] hover:bg-[#1E1E22] border border-white/5 text-white/70 hover:text-white text-xs font-semibold rounded-xl text-center transition uppercase tracking-wider text-[10px] cursor-pointer"
                >
                  7-Step Process
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('services')}
                  className="py-2.5 px-3 bg-[#C1A461]/10 hover:bg-[#C1A461]/20 text-[#C1A461] text-xs font-semibold rounded-xl text-center border border-[#C1A461]/30 transition uppercase tracking-wider text-[10px] cursor-pointer"
                >
                  Services Catalogue
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

