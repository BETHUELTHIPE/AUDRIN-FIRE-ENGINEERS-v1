import React from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Activity, 
  FileSpreadsheet, 
  CheckCircle2, 
  Cpu, 
  Clock, 
  FileCheck,
  AlertOctagon
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../data/initialData';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'SANS 10139 Engineering Rigour',
      description: 'We adhere strictly to SANS 10139 recommendations for system category design (M, L1–L5, P1–P2), cable fire-resistance, device spacing, and audibility decibel levels.'
    },
    {
      icon: AlertOctagon,
      title: 'False-Alarm Mitigation Focus',
      description: 'Unwanted alarms disrupt operations and cause dangerous tenant complacency. We perform root-cause event log analyses, environmental reviews, and multi-criteria sensor tuning.'
    },
    {
      icon: Activity,
      title: '100% Point-to-Point Testing',
      description: 'Zero sampling shortcuts during commissioning. Every smoke detector, thermal sensor, call point, and auxiliary relay output is physically activated and verified.'
    },
    {
      icon: FileCheck,
      title: 'Audited Condition Reports',
      description: 'Automated Pre-Work and Post-Work Condition Reports capture frozen photographic evidence, visible condition assessments, and verified compliance parameters.'
    },
    {
      icon: Cpu,
      title: 'Multi-Protocol Panel Expertise',
      description: 'Deep technical capability across conventional, addressable, and networked platforms including Advanced Electronics, Kentec, Ziton, Morley, and GST systems.'
    },
    {
      icon: Clock,
      title: 'Dedicated Pretoria Operations Desk',
      description: 'Operating Monday to Sunday from 07:00 to 20:00. Rapid diagnostic fault triage and scheduled maintenance coordination across Gauteng and South Africa.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#0A0A0B] text-white border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151518] border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#C1A461]">
            <Flame className="w-3.5 h-3.5" />
            <span>Technical Distinction</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Why Commercial Facilities Trust Audrin Fire Engineers
          </h2>
          <p className="text-sm text-white/50 leading-relaxed font-normal">
            We specialize solely in commercial and non-domestic fire-detection and alarm engineering. Our focus on early detection, clear warning, and strict engineering discipline ensures safer buildings.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="p-7 rounded-3xl bg-[#151518] border border-white/5 hover:border-[#C1A461]/40 transition duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0A0A0B] border border-white/5 flex items-center justify-center text-[#C1A461]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Regulatory Governance Statement */}
        <div className="mt-14 p-7 rounded-3xl bg-[#151518] border border-white/5 text-xs text-white/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h4 className="font-bold text-white text-sm tracking-tight">
              AUDRIN FIRE ENGINEERS (PTY) LTD — Professional Governance
            </h4>
            <p className="text-white/40">
              Registration Number: <span className="font-mono text-white/80">{COMPANY_DETAILS.registrationNumber}</span> | Operating Headquarters: 27 Tshivhase Street, Pretoria West.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0 font-mono">
            <span className="text-white/40 uppercase text-[10px] tracking-wider">Direct Desk:</span>
            <a href={`tel:${COMPANY_DETAILS.phone}`} className="font-bold text-[#C1A461] hover:text-[#D4BC7B] transition">
              {COMPANY_DETAILS.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

