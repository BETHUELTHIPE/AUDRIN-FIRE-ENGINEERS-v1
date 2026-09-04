import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { APPROVED_SERVICES } from '../../data/initialData';
import { ServiceRecord, ServiceCategory } from '../../types';

interface FeaturedServicesProps {
  onSelectService: (serviceSlug: string) => void;
  onRequestService?: (serviceSlug?: string) => void;
}

export const FeaturedServices: React.FC<FeaturedServicesProps> = ({
  onSelectService,
  onRequestService = (_serviceSlug?: string) => {}
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'consultation_design', label: 'Consultation & Design' },
    { id: 'installation_commissioning', label: 'Installation & Commissioning' },
    { id: 'maintenance_testing', label: 'Maintenance & Service' },
    { id: 'faults_repairs', label: 'Faults & Emergency' },
    { id: 'documentation_training', label: 'Documentation & Training' }
  ];

  const filteredServices = APPROVED_SERVICES.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-20 lg:py-28 bg-[#0A0A0B] text-white border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151518] border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#C1A461]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Approved Fire-Detection Catalogue</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Commercial Fire Detection & Alarm Services
            </h2>
            <p className="text-sm text-white/50 leading-relaxed font-normal">
              Engineered exclusively for non-domestic, commercial, and industrial premises. Fully aligned with SANS 10139 recommendations, project specifications, and local fire authority requirements.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services or scope..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#151518] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#C1A461] transition"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#C1A461] text-black shadow-lg shadow-black/40'
                  : 'bg-[#151518] text-white/60 hover:text-white border border-white/5 hover:border-white/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group relative flex flex-col justify-between rounded-3xl bg-[#151518] border border-white/5 hover:border-[#C1A461]/40 p-7 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="space-y-4">
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded-md bg-[#0A0A0B] border border-white/5 text-white/50">
                    {service.categoryLabel}
                  </span>
                  {service.featured && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C1A461]/10 text-[#C1A461] border border-[#C1A461]/30">
                      Core Discipline
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onSelectService(service.slug)}
                  className="text-lg font-bold text-white group-hover:text-[#C1A461] transition cursor-pointer tracking-tight"
                >
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-white/50 leading-relaxed line-clamp-3">
                  {service.shortDescription}
                </p>

                {/* Key Scope Preview (2 bullets) */}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                    Key Scope:
                  </div>
                  {service.scope.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-white/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C1A461] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectService(service.slug)}
                  className="text-xs text-white/60 hover:text-white font-semibold flex items-center gap-1.5 transition uppercase tracking-wider text-[11px]"
                >
                  <span>Full Scope</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C1A461] group-hover:translate-x-1 transition transform" />
                </button>

                <button
                  onClick={() => onRequestService(service.slug)}
                  className="px-3.5 py-2 bg-[#C1A461] hover:bg-[#D4BC7B] text-black rounded-xl text-[11px] uppercase tracking-wider font-bold transition shadow-sm"
                >
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Exclusions Disclaimer Callout */}
        <div className="mt-14 p-5 rounded-2xl bg-[#0D0D0E] border border-white/5 text-xs text-white/50 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#C1A461] shrink-0" />
            <span>
              <strong className="text-white/80">Scope Notice:</strong> Commercial fire-detection and alarm systems only. We do not provide fire extinguishers, water sprinklers, gas suppression, CCTV, or general security systems.
            </span>
          </div>

          <button
            onClick={() => onRequestService()}
            className="text-xs text-[#C1A461] hover:text-[#D4BC7B] font-bold uppercase tracking-wider"
          >
            Custom Inquiry &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};

