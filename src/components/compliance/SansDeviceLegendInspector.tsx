import React, { useState } from 'react';
import { 
  Layers, 
  X, 
  ShieldCheck, 
  Info, 
  Maximize2, 
  Sliders, 
  Volume2, 
  Flame, 
  Zap, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface SansDeviceLegendInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SansDeviceLegendInspector: React.FC<SansDeviceLegendInspectorProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedDevice, setSelectedDevice] = useState<'blue_smoke' | 'black_heat' | 'red_sounder' | 'green_mcp' | 'flame_ir_uv' | 'beam_detector' | 'aspirating'>('blue_smoke');
  const [roofSlope, setRoofSlope] = useState<number>(15);
  const [scaleFactor, setScaleFactor] = useState<number>(1);

  if (!isOpen) return null;

  // Pitch calculation rule: +1% per degree of slope, max +25% (POE Question 9)
  const pitchSpacingIncrease = Math.min(25, roofSlope * 1);
  const baseSmokeRadius = 7.5;
  const pitchedSmokeRadius = (baseSmokeRadius * (1 + pitchSpacingIncrease / 100)).toFixed(2);

  const baseHeatRadius = 5.3;
  const pitchedHeatRadius = (baseHeatRadius * (1 + pitchSpacingIncrease / 100)).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#151518] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-[#0D0D0E] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A1A1C] to-[#2A2A2E] border border-[#C1A461]/40 flex items-center justify-center text-[#C1A461] shadow-lg">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
                  SANS 10139 Standard
                </span>
                <span className="text-[9px] bg-blue-950/80 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono font-bold uppercase">
                  Floorplan Dot Legend (POE Pg 9/10)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Device Legend & Siting Geometry Simulator
              </h2>
              <p className="text-xs text-white/50">
                Official floorplan dot colour conventions and spatial radiuses derived from POE Questions 4, 8, 9, 10, 11, 14, 21, and 22.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Quick Legend Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Blue Dot: Smoke */}
            <button
              onClick={() => setSelectedDevice('blue_smoke')}
              className={`p-4 rounded-2xl border text-left transition relative ${
                selectedDevice === 'blue_smoke'
                  ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10'
                  : 'bg-[#0D0D0E] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-md ring-2 ring-blue-400/40" />
                <span className="text-xs font-bold text-white">Blue Dot</span>
              </div>
              <div className="text-[11px] text-blue-300 font-bold">Smoke Detectors</div>
              <div className="text-[10px] text-white/40 font-mono mt-1">Radius: ≤ 7.5 m (POE 11)</div>
            </button>

            {/* Black Dot: Heat */}
            <button
              onClick={() => setSelectedDevice('black_heat')}
              className={`p-4 rounded-2xl border text-left transition relative ${
                selectedDevice === 'black_heat'
                  ? 'bg-zinc-900 border-white/40 shadow-lg'
                  : 'bg-[#0D0D0E] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-4 h-4 rounded-full bg-zinc-950 border-2 border-white/60 shadow-md" />
                <span className="text-xs font-bold text-white">Black Dot</span>
              </div>
              <div className="text-[11px] text-zinc-300 font-bold">Heat Detectors</div>
              <div className="text-[10px] text-white/40 font-mono mt-1">Radius: ≤ 5.3 m (POE 11)</div>
            </button>

            {/* Red Dot: Sounders */}
            <button
              onClick={() => setSelectedDevice('red_sounder')}
              className={`p-4 rounded-2xl border text-left transition relative ${
                selectedDevice === 'red_sounder'
                  ? 'bg-red-950/40 border-red-500 shadow-lg shadow-red-500/10'
                  : 'bg-[#0D0D0E] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-4 h-4 rounded-full bg-red-500 shadow-md ring-2 ring-red-400/40" />
                <span className="text-xs font-bold text-white">Red Dot</span>
              </div>
              <div className="text-[11px] text-red-300 font-bold">Sounders & Sirens</div>
              <div className="text-[10px] text-white/40 font-mono mt-1">≥ 65 dB(A) (POE 1r, 1s)</div>
            </button>

            {/* Green Dot: MCP */}
            <button
              onClick={() => setSelectedDevice('green_mcp')}
              className={`p-4 rounded-2xl border text-left transition relative ${
                selectedDevice === 'green_mcp'
                  ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'bg-[#0D0D0E] border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-md ring-2 ring-emerald-400/40" />
                <span className="text-xs font-bold text-white">Green Dot</span>
              </div>
              <div className="text-[11px] text-emerald-300 font-bold">Manual Call Point</div>
              <div className="text-[10px] text-white/40 font-mono mt-1">Height: 1.4 m (POE 21)</div>
            </button>

          </div>

          {/* Device Detail & Simulator Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Visual Coverage Simulator */}
            <div className="bg-[#0D0D0E] p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#C1A461] uppercase tracking-wider">
                    SANS 10139 Coverage Diagram
                  </h3>
                  <span className="text-[10px] font-mono text-white/50">Scale: 1m = 20px</span>
                </div>

                {/* SVG Visual Canvas */}
                <div className="relative h-64 bg-[#151518] rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden mt-3">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />

                  {/* SVG Circles */}
                  <svg className="w-full h-full" viewBox="-150 -150 300 300">
                    {/* Wall Boundary Simulation */}
                    <rect x="-130" y="-130" width="260" height="260" fill="none" stroke="#ffffff15" strokeWidth="2" strokeDasharray="4,4" />
                    
                    {/* Smoke Circle (7.5m = 150px) */}
                    {selectedDevice === 'blue_smoke' && (
                      <g>
                        <circle cx="0" cy="0" r="110" fill="#3b82f615" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2,2" />
                        <circle cx="0" cy="0" r="6" fill="#3b82f6" />
                        <text x="10" y="-15" fill="#93c5fd" fontSize="10" fontFamily="monospace">Smoke Coverage (7.5m Radius)</text>
                      </g>
                    )}

                    {/* Heat Circle (5.3m = 106px) */}
                    {selectedDevice === 'black_heat' && (
                      <g>
                        <circle cx="0" cy="0" r="78" fill="#ffffff08" stroke="#ffffff" strokeWidth="2" strokeDasharray="2,2" />
                        <circle cx="0" cy="0" r="6" fill="#09090b" stroke="#ffffff" strokeWidth="2" />
                        <text x="10" y="-15" fill="#e4e4e7" fontSize="10" fontFamily="monospace">Heat Coverage (5.3m Radius)</text>
                      </g>
                    )}

                    {/* Sounder Acoustic Isobars */}
                    {selectedDevice === 'red_sounder' && (
                      <g>
                        <circle cx="0" cy="0" r="130" fill="#ef444410" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                        <circle cx="0" cy="0" r="85" fill="#ef444420" stroke="#ef4444" strokeWidth="1.5" />
                        <circle cx="0" cy="0" r="6" fill="#ef4444" />
                        <text x="10" y="-20" fill="#fca5a5" fontSize="9" fontFamily="monospace">≥ 65 dB(A) Bedhead</text>
                        <text x="10" y="-5" fill="#f87171" fontSize="9" fontFamily="monospace">≤ 130 dB(A) Max</text>
                      </g>
                    )}

                    {/* Green MCP */}
                    {selectedDevice === 'green_mcp' && (
                      <g>
                        <rect x="-10" y="-10" width="20" height="20" rx="3" fill="#10b981" />
                        <line x1="0" y1="10" x2="0" y2="80" stroke="#10b981" strokeWidth="2" />
                        <text x="15" y="0" fill="#6ee7b7" fontSize="10" fontFamily="monospace">1.4m Above Floor</text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              {/* Slope Adjuster Tool for Pitched Roofs (POE Question 9) */}
              <div className="bg-[#151518] p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70 font-bold uppercase">Pitched Roof Slope Angle:</span>
                  <strong className="text-[#C1A461] font-mono">{roofSlope}° (+{pitchSpacingIncrease}% Spacing)</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={roofSlope}
                  onChange={(e) => setRoofSlope(Number(e.target.value))}
                  className="w-full accent-[#C1A461] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/40 font-mono">
                  <span>0° (Flat Ceiling)</span>
                  <span>Rule: +1% per deg, max 25%</span>
                  <span>35° (Max +25%)</span>
                </div>
              </div>
            </div>

            {/* Technical Specification Box */}
            <div className="bg-[#0D0D0E] p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                
                {selectedDevice === 'blue_smoke' && (
                  <>
                    <div className="flex items-center gap-2 text-blue-400">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <h4 className="text-sm font-bold text-white">Optical Point Smoke Detector (Blue Dot)</h4>
                    </div>
                    <ul className="text-xs text-white/70 space-y-2 font-mono">
                      <li>• <strong>Standard Horizontal Radius:</strong> 7.5 metres (POE Question 11).</li>
                      <li>• <strong>With {roofSlope}° Roof Pitch:</strong> {pitchedSmokeRadius} metres radius.</li>
                      <li>• <strong>Apex Height Threshold:</strong> Roof apex difference &lt; 600 mm is treated as flat ceiling (POE 10).</li>
                      <li>• <strong>Wall Clearance:</strong> Min 500 mm from any wall or partition.</li>
                      <li>• <strong>Wall Mounting Height:</strong> 25 mm min to 600 mm max from ceiling (POE 20).</li>
                    </ul>
                  </>
                )}

                {selectedDevice === 'black_heat' && (
                  <>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <div className="w-3 h-3 rounded-full bg-zinc-950 border border-white/50" />
                      <h4 className="text-sm font-bold text-white">Point Heat Detector (Black Dot)</h4>
                    </div>
                    <ul className="text-xs text-white/70 space-y-2 font-mono">
                      <li>• <strong>Standard Horizontal Radius:</strong> 5.3 metres (POE Question 11).</li>
                      <li>• <strong>With {roofSlope}° Roof Pitch:</strong> {pitchedHeatRadius} metres radius.</li>
                      <li>• <strong>Apex Height Threshold:</strong> Roof apex difference &lt; 150 mm is treated as flat ceiling (POE 12).</li>
                      <li>• <strong>CRITICAL PROHIBITION:</strong> Prohibited in Category P smouldering fire risk areas and Category L escape routes (POE Question 8).</li>
                    </ul>
                  </>
                )}

                {selectedDevice === 'red_sounder' && (
                  <>
                    <div className="flex items-center gap-2 text-red-400">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <h4 className="text-sm font-bold text-white">Fire Alarm Sounder / Siren (Red Dot)</h4>
                    </div>
                    <ul className="text-xs text-white/70 space-y-2 font-mono">
                      <li>• <strong>Minimum Sound Level at Bedhead:</strong> ≥ 65 dB(A) in sleeping areas (POE Question 1r).</li>
                      <li>• <strong>Maximum Sound Pressure Level:</strong> ≤ 130 dB(A) at accessible point (POE Question 1r).</li>
                      <li>• <strong>Minimum Redundancy:</strong> ≥ 2 sounders installed per system (POE Question 1s).</li>
                      <li>• <strong>Cable Sheath Segregation:</strong> Dual sounder circuits must NOT share a common cable sheath (POE Question 1j).</li>
                    </ul>
                  </>
                )}

                {selectedDevice === 'green_mcp' && (
                  <>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <h4 className="text-sm font-bold text-white">Manual Call Point (Green Dot)</h4>
                    </div>
                    <ul className="text-xs text-white/70 space-y-2 font-mono">
                      <li>• <strong>Mounting Height:</strong> 1.4 metres from finished floor level (± 0.2 m tolerance / 1.2m to 1.6m) (POE Question 21).</li>
                      <li>• <strong>Location:</strong> Exit doorways, escape routes, stairwell landings.</li>
                      <li>• <strong>Category M Compliance:</strong> Manual call points alone are NOT acceptable in buildings where occupants sleep (POE Question 1b).</li>
                    </ul>
                  </>
                )}

              </div>

              {/* Footer Quote */}
              <div className="p-3 rounded-xl bg-[#151518] border border-white/5 text-[11px] text-white/50 font-mono">
                Source of Truth: SANS 10139 & Summative POE Module Fire Detection & Alarm Systems.
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-white/5 bg-[#0D0D0E] flex items-center justify-between text-xs">
          <span className="text-white/40">Audrin Fire Engineers &middot; SANS 10139 Siting Simulator</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] transition"
          >
            Close Siting Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
