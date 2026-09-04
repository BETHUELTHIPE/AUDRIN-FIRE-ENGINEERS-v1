import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Presentation, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { PowerPointPresentation } from '../../types';
import { generatePptxFile } from '../../services/pptxGenerator';
import { COMPANY_DETAILS } from '../../data/initialData';

interface PresentationPreviewModalProps {
  presentation: PowerPointPresentation | null;
  onClose: () => void;
}

export const PresentationPreviewModal: React.FC<PresentationPreviewModalProps> = ({
  presentation,
  onClose
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!presentation) return null;

  const currentSlide = presentation.slides[currentSlideIndex] || presentation.slides[0];

  const handleDownloadPptx = () => {
    generatePptxFile(presentation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-[#151518] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-5 bg-[#0A0A0B] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0A0A0B] border border-[#C1A461]/30 flex items-center justify-center text-[#C1A461]">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">{presentation.title}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151518] border border-white/5 text-white/70">
                  {presentation.presentationNumber}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#151518] border border-white/5 text-white/50">
                  v{presentation.version}
                </span>
              </div>
              <p className="text-[11px] text-white/40 font-mono">
                SANS 10139 Executive Briefing Deck (16:9 Landscape)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPptx}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#C1A461] hover:bg-[#D4BC7B] text-black rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .pptx</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/40 hover:text-white rounded-xl hover:bg-white/5 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 16:9 Slide Canvas Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-[#0A0A0B]">
          <div className="w-full max-w-4xl aspect-[16/9] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 transition-all duration-300 bg-[#151518] text-white">
            {/* Top Gold Brand Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C1A461]" />

            {/* Slide Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[2px] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>AUDRIN FIRE ENGINEERS (PTY) LTD</span>
                </div>
                <div className="text-[10px] font-mono text-white/40">
                  Slide {currentSlideIndex + 1} of {presentation.slides.length}
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                {currentSlide.title}
              </h2>

              {currentSlide.subtitle && (
                <p className="text-xs font-semibold text-[#C1A461]">
                  {currentSlide.subtitle}
                </p>
              )}
            </div>

            {/* Slide Body Bullets */}
            <div className="my-auto space-y-3 py-4">
              {currentSlide.bullets.map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-start gap-3 text-xs sm:text-sm text-white/80 leading-relaxed">
                  <div className="w-2 h-2 rounded-full bg-[#C1A461] mt-2 shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Callout Footer Box inside slide */}
            {currentSlide.callout && (
              <div className="p-3.5 rounded-xl bg-[#0A0A0B] border border-[#C1A461]/30 text-xs text-[#C1A461] font-medium">
                {currentSlide.callout}
              </div>
            )}

            {/* Slide Bottom Bar */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-mono">
              <span>SANS 10139 Commercial Fire-Detection Scope</span>
              <span>{COMPANY_DETAILS.phone} | Pretoria West</span>
            </div>
          </div>
        </div>

        {/* Presentation Slide Navigation Bar */}
        <div className="px-6 py-4 bg-[#0A0A0B] border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-xl bg-[#151518] hover:bg-[#1E1E22] text-white/70 disabled:opacity-30 transition cursor-pointer border border-white/5"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs text-white/60 font-mono px-2">
              Slide {currentSlideIndex + 1} / {presentation.slides.length}
            </span>

            <button
              onClick={() => setCurrentSlideIndex(Math.min(presentation.slides.length - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === presentation.slides.length - 1}
              className="p-2 rounded-xl bg-[#151518] hover:bg-[#1E1E22] text-white/70 disabled:opacity-30 transition cursor-pointer border border-white/5"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slide thumb selector pills */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto max-w-md">
            {presentation.slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  idx === currentSlideIndex 
                    ? 'bg-[#C1A461] text-black shadow' 
                    : 'bg-[#151518] text-white/40 hover:text-white border border-white/5'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadPptx}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#C1A461] hover:bg-[#D4BC7B] text-black rounded-xl text-xs uppercase tracking-wider font-bold transition shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Save .pptx</span>
          </button>
        </div>
      </div>
    </div>
  );
};
