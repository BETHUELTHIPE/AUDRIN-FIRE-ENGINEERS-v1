import React from 'react';
import { 
  Building2, 
  Warehouse, 
  Factory, 
  Hospital, 
  GraduationCap, 
  ShoppingBag, 
  Cpu, 
  Network, 
  Sliders, 
  RadioTower,
  ShieldCheck,
  Check
} from 'lucide-react';
import { INDUSTRIES_SERVED } from '../../data/initialData';

export const SystemsAndIndustries: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    Building2: <Building2 className="w-5 h-5 text-[#C1A461]" />,
    Warehouse: <Warehouse className="w-5 h-5 text-[#C1A461]" />,
    Factory: <Factory className="w-5 h-5 text-[#C1A461]" />,
    Hospital: <Hospital className="w-5 h-5 text-[#C1A461]" />,
    GraduationCap: <GraduationCap className="w-5 h-5 text-[#C1A461]" />,
    ShoppingBag: <ShoppingBag className="w-5 h-5 text-[#C1A461]" />
  };

  const systemArchitectures = [
    {
      title: 'Conventional Fire Systems',
      description: 'Zoned radial circuits ideal for smaller commercial buildings, standalone retail units, and uncomplicated floor layouts.',
      features: ['Zone-based status mapping', 'Cost-effective deployment', 'Standard 24V sounders & beacons']
    },
    {
      title: 'Analogue Addressable Systems',
      description: 'Point-specific monitoring for multi-storey office towers, corporate parks, and medium-to-large non-domestic facilities.',
      features: ['Individual device identification (e.g. Loop 2, Dev 42)', 'Configurable sensitivity chambers', 'Precision cause-and-effect matrix']
    },
    {
      title: 'Networked Multi-Panel Systems',
      description: 'Synchronised master-slave panel networks communicating over fault-tolerant copper or optical fibre ring topologies.',
      features: ['Campus-wide alarm propagation', 'Distributed power supplies', 'Centralised graphical workstation integration']
    },
    {
      title: 'Approved Hybrid Wireless Detection',
      description: 'EN 54-25 compliant radio mesh links for heritage structures or buildings with architectural cable routing restrictions.',
      features: ['Dual-frequency radio communication', 'Rapid installation without conduit', 'Full panel loop integration']
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#0D0D0E] text-white border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Top: Industries Served */}
        <div>
          <div className="max-w-2xl space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151518] border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#C1A461]">
              <Building2 className="w-3.5 h-3.5" />
              <span>Commercial & Non-Domestic Sectors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Sectors and Facility Environments Served
            </h2>
            <p className="text-sm text-white/50 leading-relaxed font-normal">
              Every facility type presents unique false-alarm risks, acoustic challenges, and occupant evacuation profiles. We engineer bespoke SANS 10139 solutions tailored to your occupancy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRIES_SERVED.map((ind, i) => (
              <div 
                key={i}
                className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-3 hover:border-[#C1A461]/40 transition duration-300"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#0A0A0B] border border-white/5 flex items-center justify-center">
                  {iconMap[ind.icon] || <Building2 className="w-5 h-5 text-[#C1A461]" />}
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">{ind.name}</h3>
                <p className="text-xs text-white/50 leading-relaxed font-normal">{ind.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: System Topologies */}
        <div className="pt-12 border-t border-white/5">
          <div className="max-w-2xl space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151518] border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#C1A461]">
              <Cpu className="w-3.5 h-3.5" />
              <span>Engineered Topologies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Supported Fire-Alarm Architectures
            </h2>
            <p className="text-sm text-white/50 leading-relaxed font-normal">
              From standalone conventional panels to complex multi-panel networked topologies with fibre optic loops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemArchitectures.map((sys, idx) => (
              <div 
                key={idx}
                className="p-7 rounded-3xl bg-[#151518] border border-white/5 flex flex-col justify-between space-y-6 hover:border-[#C1A461]/40 transition duration-300"
              >
                <div className="space-y-3.5">
                  <h3 className="text-sm font-bold text-white tracking-tight">{sys.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-normal">{sys.description}</p>
                  
                  <div className="space-y-2 pt-3 border-t border-white/5">
                    {sys.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-[11px] text-white/70">
                        <Check className="w-3.5 h-3.5 text-[#C1A461] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <span className="text-[9px] font-mono uppercase tracking-wider text-white/30">
                  SANS 10139 Engineered
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

