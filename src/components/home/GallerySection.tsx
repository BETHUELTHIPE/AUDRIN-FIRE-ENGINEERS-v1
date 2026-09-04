import React, { useState } from 'react';
import { 
  Camera, 
  CheckCircle2, 
  Layers, 
  Eye, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Split
} from 'lucide-react';
import { INITIAL_PHOTOS } from '../../data/initialData';
import { PhotoEvidence } from '../../types';

export const GallerySection: React.FC = () => {
  const [filterStage, setFilterStage] = useState<'all' | 'before' | 'during' | 'after' | 'comparison'>('comparison');
  const [activeModalPhoto, setActiveModalPhoto] = useState<PhotoEvidence | null>(null);

  const beforeAfterPairs = [
    {
      title: 'Main Control Panel Quiescent State Restoration',
      location: 'Ground Floor Security Control Room',
      equipment: 'Panel FP-01 (Advanced Axis EN 4-Loop)',
      before: INITIAL_PHOTOS.find(p => p.id === 'pho-01'),
      after: INITIAL_PHOTOS.find(p => p.id === 'pho-05'),
      notes: 'Before: Standby baseline inspection. After: Verified normal quiescent condition with pristine event register and validated power supply output.'
    },
    {
      title: 'Optical Smoke Detector Chamber Decontamination',
      location: 'Level 3 Open-Plan Accounting Wing',
      equipment: 'Detector L2-D042 (Optical Smoke Sensor)',
      before: INITIAL_PHOTOS.find(p => p.id === 'pho-02'),
      after: INITIAL_PHOTOS.find(p => p.id === 'pho-06'),
      notes: 'Before: Airborne dust drift near HVAC return grille causing false alarms. After: Sensor chamber serviced and recalibrated to nominal SANS threshold.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#0A0A0B] text-white border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151518] border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#C1A461]">
              <Camera className="w-3.5 h-3.5" />
              <span>Audited Photographic Evidence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Technical Field Evidence & Before / After Records
            </h2>
            <p className="text-sm text-white/50 leading-relaxed font-normal">
              Real technical evidence captured during commercial fire detection inspections, loop diagnostic testing, and planned preventative maintenance.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-[#151518] p-1.5 rounded-2xl border border-white/5 self-start md:self-auto">
            <button
              onClick={() => setFilterStage('comparison')}
              className={`px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                filterStage === 'comparison' ? 'bg-[#C1A461] text-black shadow-md' : 'text-white/50 hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setFilterStage('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                filterStage === 'all' ? 'bg-[#C1A461] text-black shadow-md' : 'text-white/50 hover:text-white'
              }`}
            >
              All Evidence
            </button>
            <button
              onClick={() => setFilterStage('before')}
              className={`px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                filterStage === 'before' ? 'bg-[#C1A461] text-black shadow-md' : 'text-white/50 hover:text-white'
              }`}
            >
              Pre-Work
            </button>
            <button
              onClick={() => setFilterStage('after')}
              className={`px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                filterStage === 'after' ? 'bg-[#C1A461] text-black shadow-md' : 'text-white/50 hover:text-white'
              }`}
            >
              Post-Work
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison View */}
        {filterStage === 'comparison' ? (
          <div className="space-y-8">
            {beforeAfterPairs.map((pair, idx) => (
              <div 
                key={idx}
                className="p-7 rounded-3xl bg-[#151518] border border-white/5 space-y-6 shadow-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div>
                    <span className="text-[9px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
                      Comparison Pair 0{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                      {pair.title}
                    </h3>
                    <p className="text-xs text-white/50">
                      {pair.location} • <span className="font-mono text-white/70">{pair.equipment}</span>
                    </p>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider bg-[#0A0A0B] px-3 py-1 rounded-full border border-white/5 text-white/50">
                    SANS 10139 Verified
                  </span>
                </div>

                {/* 2-Column Side-by-Side Photos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before */}
                  {pair.before && (
                    <div className="space-y-3">
                      <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#0A0A0B] border border-white/5 group">
                        <img 
                          src={pair.before.imageUrl} 
                          alt="Before condition"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-[#0A0A0B]/90 backdrop-blur-md px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30">
                          PRE-WORK CONDITION
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 text-[9px] font-mono bg-[#0A0A0B]/80 px-2 py-0.5 rounded text-white/40">
                          Hash: {pair.before.hash}
                        </div>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed font-normal">
                        {pair.before.caption}
                      </p>
                    </div>
                  )}

                  {/* After */}
                  {pair.after && (
                    <div className="space-y-3">
                      <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#0A0A0B] border border-white/5 group">
                        <img 
                          src={pair.after.imageUrl} 
                          alt="After condition"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-[#0A0A0B]/90 backdrop-blur-md px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                          POST-WORK COMPLETED
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 text-[9px] font-mono bg-[#0A0A0B]/80 px-2 py-0.5 rounded text-white/40">
                          Hash: {pair.after.hash}
                        </div>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed font-normal">
                        {pair.after.caption}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 text-xs text-white/60">
                  <strong className="text-white/80">Engineering Outcome:</strong> {pair.notes}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid View of Single Photos */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_PHOTOS.filter(p => filterStage === 'all' || p.stage === filterStage).map((photo) => (
              <div 
                key={photo.id}
                className="p-5 rounded-3xl bg-[#151518] border border-white/5 space-y-3 flex flex-col justify-between hover:border-[#C1A461]/30 transition duration-300"
              >
                <div className="space-y-2.5">
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#0A0A0B] border border-white/5">
                    <img 
                      src={photo.imageUrl} 
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                      photo.stage === 'before' ? 'bg-[#0A0A0B]/90 text-amber-300 border border-amber-500/30' :
                      photo.stage === 'during' ? 'bg-[#0A0A0B]/90 text-cyan-300 border border-cyan-500/30' :
                      'bg-[#0A0A0B]/90 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {photo.stage} Work
                    </div>
                  </div>

                  <span className="text-[9px] font-bold text-[#C1A461] uppercase tracking-[1.5px] block">
                    {photo.categoryLabel}
                  </span>

                  <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                    {photo.caption}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-mono">
                  <span>{photo.areaLocation}</span>
                  <span>{photo.hash}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

