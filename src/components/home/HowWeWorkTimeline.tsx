import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Radio, 
  Play, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { HOW_WE_WORK_STAGES } from '../../data/initialData';
import { VoiceAiEngine } from '../../services/voiceAi';

interface HowWeWorkTimelineProps {
  onOpenVoiceAi?: () => void;
  onOpenVoiceGuide?: () => void;
  onRequestService?: () => void;
}

export const HowWeWorkTimeline: React.FC<HowWeWorkTimelineProps> = ({
  onOpenVoiceAi,
  onOpenVoiceGuide,
  onRequestService = () => {}
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const voiceEngine = VoiceAiEngine.getInstance();
  const handleVoice = onOpenVoiceAi || onOpenVoiceGuide || (() => {});

  const handlePlaySingleStep = (stepIdx: number) => {
    voiceEngine.playStep(stepIdx);
    handleVoice();
  };

  return (
    <section className="py-20 lg:py-28 bg-[#0D0D0E] text-white border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151518] border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#C1A461]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SANS 10139 Standardised Lifecycle</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Seven-Step Engineering Workflow
            </h2>
            <p className="text-sm text-white/50 leading-relaxed font-normal">
              Every fire detection project—from initial consultation to quarterly maintenance—follows our rigorous seven-stage quality and safety process.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleVoice}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#151518] hover:bg-[#1E1E22] border border-[#C1A461]/30 text-[#C1A461] text-xs font-bold uppercase tracking-wider transition shadow-sm"
            >
              <Radio className="w-4 h-4 text-[#C1A461] animate-pulse" />
              <span>Voice AI Walkthrough</span>
            </button>
          </div>
        </div>

        {/* Desktop Horizontal Stepper Bar */}
        <div className="hidden lg:block mb-10">
          <div className="relative flex items-center justify-between">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />

            {HOW_WE_WORK_STAGES.map((stage, idx) => (
              <button
                key={stage.stepNumber}
                onClick={() => setActiveStep(idx)}
                className="relative z-10 flex flex-col items-center group transition focus:outline-none cursor-pointer"
              >
                <div 
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs border transition duration-300 ${
                    idx === activeStep 
                      ? 'bg-[#C1A461] border-[#D4BC7B] text-black shadow-xl shadow-black/60 scale-110' 
                      : 'bg-[#151518] border-white/5 text-white/50 group-hover:border-white/20 group-hover:text-white'
                  }`}
                >
                  0{stage.stepNumber}
                </div>
                <span className={`mt-3 text-[11px] uppercase tracking-wider font-semibold text-center max-w-[120px] line-clamp-1 ${
                  idx === activeStep ? 'text-[#C1A461] font-bold' : 'text-white/40 group-hover:text-white/70'
                }`}>
                  {stage.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Stage Detail Card (Desktop) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 p-9 rounded-3xl bg-[#151518] border border-white/5 shadow-2xl items-center">
          <div className="col-span-8 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#C1A461] uppercase tracking-widest">
                Stage 0{HOW_WE_WORK_STAGES[activeStep].stepNumber} of 07
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-[#0A0A0B] text-white/50 px-3 py-1 rounded-full font-mono border border-white/5">
                {HOW_WE_WORK_STAGES[activeStep].sansStandardNote}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              {HOW_WE_WORK_STAGES[activeStep].title}
            </h3>

            <p className="text-sm text-white/60 leading-relaxed font-normal">
              {HOW_WE_WORK_STAGES[activeStep].fullDescription}
            </p>

            {/* Deliverables List */}
            <div className="pt-2">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">
                Mandatory Stage Deliverables:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {HOW_WE_WORK_STAGES[activeStep].deliverables.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-white/80 bg-[#0A0A0B] px-3.5 py-2.5 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C1A461] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-4 p-7 rounded-2xl bg-[#0A0A0B] border border-white/5 space-y-5 flex flex-col justify-between h-full">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C1A461]">
                <Radio className="w-4 h-4" />
                <span>Audio Stage Narration</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed italic">
                "{HOW_WE_WORK_STAGES[activeStep].narrationScript}"
              </p>
            </div>

            <div className="space-y-2.5 pt-5 border-t border-white/5">
              <button
                onClick={() => handlePlaySingleStep(activeStep)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#151518] hover:bg-[#1E1E22] text-[#C1A461] border border-[#C1A461]/30 rounded-xl text-xs uppercase tracking-wider font-bold transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Listen to Stage 0{HOW_WE_WORK_STAGES[activeStep].stepNumber}</span>
              </button>

              <button
                onClick={onRequestService}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#C1A461] hover:bg-[#D4BC7B] text-black rounded-xl text-xs uppercase tracking-[1.5px] font-bold transition shadow-lg shadow-black/40"
              >
                <span>Initiate Stage Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Vertical Stepper (Visible on Mobile & Tablet) */}
        <div className="lg:hidden space-y-3">
          {HOW_WE_WORK_STAGES.map((stage, idx) => {
            const isExpanded = activeStep === idx;
            return (
              <div 
                key={stage.stepNumber}
                className={`rounded-2xl border transition overflow-hidden ${
                  isExpanded ? 'bg-[#151518] border-[#C1A461]/40 shadow-xl' : 'bg-[#151518]/60 border-white/5'
                }`}
              >
                <button
                  onClick={() => setActiveStep(isExpanded ? -1 : idx)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isExpanded ? 'bg-[#C1A461] text-black' : 'bg-[#0A0A0B] text-white/50 border border-white/5'
                    }`}>
                      0{stage.stepNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{stage.title}</h4>
                      <p className="text-[11px] text-white/40 line-clamp-1">{stage.shortDescription}</p>
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#C1A461] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 space-y-3 border-t border-white/5 text-xs text-white/60">
                    <p className="leading-relaxed">{stage.fullDescription}</p>

                    <div className="text-[10px] font-mono text-white/50 bg-[#0A0A0B] p-2.5 rounded-xl border border-white/5">
                      Standard: {stage.sansStandardNote}
                    </div>

                    <div className="space-y-1.5">
                      <div className="font-semibold text-white/80 text-[11px]">Stage Deliverables:</div>
                      {stage.deliverables.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-white/50">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C1A461] shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handlePlaySingleStep(idx)}
                        className="flex-1 py-2.5 bg-[#0A0A0B] text-[#C1A461] border border-[#C1A461]/30 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Listen</span>
                      </button>
                      <button
                        onClick={onRequestService}
                        className="flex-1 py-2.5 bg-[#C1A461] text-black rounded-xl text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5"
                      >
                        <span>Start Stage</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

