import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Radio, 
  X, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Gauge,
  Sparkles
} from 'lucide-react';
import { HOW_WE_WORK_STAGES, COMPANY_DETAILS } from '../../data/initialData';
import { VoiceAiEngine, VoicePlaybackState } from '../../services/voiceAi';

interface VoiceAiGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestService: () => void;
}

export const VoiceAiGuide: React.FC<VoiceAiGuideProps> = ({
  isOpen,
  onClose,
  onRequestService
}) => {
  const engine = VoiceAiEngine.getInstance();
  const [playbackState, setPlaybackState] = useState<VoicePlaybackState>({
    isPlaying: false,
    isPaused: false,
    currentStepIndex: 0,
    speechRate: 1.0,
    volume: 1.0,
    pitch: 1.0,
    isMuted: false
  });

  useEffect(() => {
    return engine.subscribe((state) => {
      setPlaybackState(state);
    });
  }, [engine]);

  if (!isOpen) return null;

  const currentStage = HOW_WE_WORK_STAGES[playbackState.currentStepIndex] || HOW_WE_WORK_STAGES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0B]/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#151518] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0A0A0B] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C1A461]/10 border border-[#C1A461]/30 flex items-center justify-center">
              <Radio className={`w-4 h-4 text-[#C1A461] ${playbackState.isPlaying ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Audrin Voice AI — How Our Process Works</span>
                <span className="text-[10px] bg-[#C1A461]/10 text-[#C1A461] border border-[#C1A461]/30 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                  Voice Guide
                </span>
              </h3>
              <p className="text-[11px] text-white/50">
                Synchronised technical walkthrough of our 7-step SANS 10139 engineering workflow
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              engine.stop();
              onClose();
            }}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Stage Narration Card */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Step Progress Pills */}
          <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-2 border-b border-white/5">
            {HOW_WE_WORK_STAGES.map((stage, idx) => (
              <button
                key={stage.stepNumber}
                onClick={() => engine.playStep(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
                  idx === playbackState.currentStepIndex
                    ? 'bg-[#C1A461] text-black shadow-md'
                    : idx < playbackState.currentStepIndex
                    ? 'bg-[#0A0A0B] text-white/80 border border-white/10 hover:bg-white/5'
                    : 'bg-[#0A0A0B] text-white/40 border border-white/5 hover:text-white'
                }`}
              >
                <span>Step {stage.stepNumber}</span>
                {idx < playbackState.currentStepIndex && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </button>
            ))}
          </div>

          {/* Current Stage Spotlight */}
          <div className="p-6 rounded-2xl bg-[#0A0A0B] border border-white/5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#C1A461] uppercase tracking-wider">
                Stage {currentStage.stepNumber} of 7
              </span>
              <span className="text-[11px] font-mono text-white/40">
                SANS 10139 Standard Aligned
              </span>
            </div>

            <h4 className="text-lg font-bold text-white tracking-tight">
              {currentStage.title}
            </h4>

            {/* Synchronised Live Transcript */}
            <div className="p-4 rounded-xl bg-[#151518] border border-white/5 text-sm text-white/90 leading-relaxed font-sans shadow-inner">
              <div className="text-[11px] font-semibold text-[#C1A461] mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C1A461]" />
                <span className="uppercase tracking-wider">Live Audio Transcript:</span>
              </div>
              <p className="italic text-white/90">
                "{currentStage.narrationScript}"
              </p>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              {currentStage.fullDescription}
            </p>

            {/* Deliverables */}
            <div className="pt-3 border-t border-white/5">
              <div className="text-[11px] font-semibold text-white/80 mb-2">
                Key Stage Deliverables:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentStage.deliverables.map((deliv, i) => (
                  <span key={i} className="text-[11px] bg-[#151518] text-white/80 px-2.5 py-1 rounded-lg border border-white/5">
                    {deliv}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Audio Controls Bar */}
          <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              {/* Playback Transport Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => engine.prevStep()}
                  disabled={playbackState.currentStepIndex === 0}
                  className="p-2 rounded-xl bg-[#151518] hover:bg-white/10 text-white/70 disabled:opacity-30 transition border border-white/5"
                  title="Previous Step"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {playbackState.isPlaying ? (
                  <button
                    onClick={() => engine.pause()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C1A461] hover:bg-[#b09350] text-black font-bold text-xs transition shadow-lg uppercase tracking-wider"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                ) : playbackState.isPaused ? (
                  <button
                    onClick={() => engine.resume()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C1A461] hover:bg-[#b09350] text-black font-bold text-xs transition shadow-lg uppercase tracking-wider"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Resume</span>
                  </button>
                ) : (
                  <button
                    onClick={() => engine.playStep(playbackState.currentStepIndex)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C1A461] hover:bg-[#b09350] text-black font-bold text-xs transition shadow-lg uppercase tracking-wider"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Play Stage {currentStage.stepNumber}</span>
                  </button>
                )}

                <button
                  onClick={() => engine.nextStep()}
                  disabled={playbackState.currentStepIndex === HOW_WE_WORK_STAGES.length - 1}
                  className="p-2 rounded-xl bg-[#151518] hover:bg-white/10 text-white/70 disabled:opacity-30 transition border border-white/5"
                  title="Next Step"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={() => engine.playAllFromStart()}
                  className="p-2 rounded-xl bg-[#151518] hover:bg-white/10 text-white/70 transition border border-white/5"
                  title="Restart from Step 1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed & Volume Controls */}
              <div className="flex items-center gap-3">
                {/* Speed selector */}
                <div className="flex items-center gap-1 bg-[#151518] px-2 py-1 rounded-xl border border-white/5 text-xs">
                  <Gauge className="w-3.5 h-3.5 text-white/50" />
                  {[0.85, 1.0, 1.25].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => engine.setSpeed(rate)}
                      className={`px-1.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition ${
                        playbackState.speechRate === rate ? 'bg-[#C1A461] text-black' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Mute button */}
                <button
                  onClick={() => engine.toggleMute()}
                  className="p-2 rounded-xl bg-[#151518] hover:bg-white/10 text-white/70 transition border border-white/5"
                  title={playbackState.isMuted ? 'Unmute' : 'Mute'}
                >
                  {playbackState.isMuted ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white/70" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Action CTA */}
        <div className="p-4 sm:p-6 bg-[#0A0A0B] border-t border-white/5 flex items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            Ready to initiate a technical assessment or site survey?
          </p>

          <button
            onClick={() => {
              engine.stop();
              onClose();
              onRequestService();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#b09350] text-black text-xs font-bold transition shadow-lg uppercase tracking-wider"
          >
            <span>Request a Fire-Detection Service</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
