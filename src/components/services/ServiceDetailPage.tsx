import React from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Clock, 
  AlertTriangle, 
  FileText,
  FileCheck2,
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { APPROVED_SERVICES, COMPANY_DETAILS } from '../../data/initialData';
import { ServiceRecord } from '../../types';

interface ServiceDetailPageProps {
  serviceSlug: string;
  onBack: () => void;
  onRequestService: (serviceSlug: string) => void;
  onSelectService: (serviceSlug: string) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceSlug,
  onBack,
  onRequestService,
  onSelectService
}) => {
  const service = APPROVED_SERVICES.find(s => s.slug === serviceSlug) || APPROVED_SERVICES[0];

  const relatedServices = APPROVED_SERVICES.filter(
    s => s.category === service.category && s.slug !== service.slug
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-white/50">
          <button onClick={onBack} className="hover:text-white flex items-center gap-1 transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Services</span>
          </button>
          <span>/</span>
          <span className="text-white/40">{service.categoryLabel}</span>
          <span>/</span>
          <span className="text-[#C1A461] font-semibold truncate max-w-xs">{service.title}</span>
        </div>

        {/* Hero Section of Service */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#151518] border border-white/5 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="px-3 py-1 rounded-full bg-[#C1A461]/10 border border-[#C1A461]/30 text-xs font-bold text-[#C1A461] uppercase tracking-wider">
              {service.categoryLabel}
            </span>

            <span className="text-xs font-mono text-white/60 bg-[#0A0A0B] px-3.5 py-1.5 rounded-lg border border-white/5">
              SANS Standard: {service.sansStandard}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            {service.title}
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-3xl">
            {service.shortDescription}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/5">
            <button
              onClick={() => onRequestService(service.slug)}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#C1A461] hover:bg-[#b09350] text-black text-xs font-bold rounded-xl shadow-lg transition uppercase tracking-wider"
            >
              <FileText className="w-4 h-4" />
              <span>Request This Fire-Detection Service</span>
            </button>

            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="flex items-center gap-2 px-5 py-3.5 bg-[#0A0A0B] hover:bg-white/5 text-white/90 text-xs font-semibold rounded-xl border border-white/10 transition"
            >
              <PhoneCall className="w-4 h-4 text-[#C1A461]" />
              <span>Call Pretoria Desk: {COMPANY_DETAILS.phone}</span>
            </a>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C1A461]" />
                <span>Technical Scope & Engineering Overview</span>
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {service.fullDescription}
              </p>
            </div>

            {/* Scope Deliverables */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Standard Engineering Inclusions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {service.scope.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-4 rounded-2xl bg-[#151518] border border-white/5 text-xs text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-[#C1A461] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Applicable Buildings */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C1A461]" />
                <span>Applicable Commercial Facility Types</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.applicableBuildingTypes.map((bldg, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-white/70 p-3 rounded-xl bg-[#151518] border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C1A461]" />
                    <span>{bldg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Responsibilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#C1A461]" />
                <span>Client & Site Preparation Responsibilities</span>
              </h3>
              <div className="space-y-2">
                {service.clientResponsibilities.map((resp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#151518] border border-white/5 text-xs text-white/70">
                    • {resp}
                  </div>
                ))}
              </div>
            </div>

            {/* Statutory Disclaimer Box */}
            <div className="p-6 rounded-3xl bg-[#151518] border border-white/5 text-xs text-white/60 space-y-2">
              <div className="flex items-center gap-2 text-[#C1A461] font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Compliance Limitation Notice</span>
              </div>
              <p className="leading-relaxed">
                Service delivery, inspection findings, photographic evidence, and condition reports adhere to SANS 10139 recommended practice. Photographic evidence and digital documentation do not constitute statutory verification or a legal certificate of compliance.
              </p>
            </div>
          </div>

          {/* Sidebar (Right 4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Request Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#151518] border border-white/5 space-y-4">
              <h4 className="font-bold text-sm text-white">
                Initiate Service Intake
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Submit site parameters, upload layout drawings or panel photos, and receive a tailored technical acknowledgement.
              </p>
              <button
                onClick={() => onRequestService(service.slug)}
                className="w-full py-3.5 bg-[#C1A461] hover:bg-[#b09350] text-black text-xs font-bold rounded-xl transition shadow-md uppercase tracking-wider"
              >
                Request Service Online
              </button>
            </div>

            {/* Related Services in Category */}
            {relatedServices.length > 0 && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#151518] border border-white/5 space-y-4">
                <h4 className="font-bold text-sm text-white">
                  Related Fire-Detection Services
                </h4>
                <div className="space-y-2.5">
                  {relatedServices.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => onSelectService(rel.slug)}
                      className="w-full p-3.5 rounded-2xl bg-[#0A0A0B] hover:bg-white/5 border border-white/5 text-left transition flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#C1A461] transition">
                          {rel.title}
                        </div>
                        <div className="text-[10px] text-white/40 font-mono mt-0.5">
                          {rel.sansStandard}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
