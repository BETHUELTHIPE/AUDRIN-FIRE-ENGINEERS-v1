import React from 'react';
import { 
  Flame, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight,
  Lock,
  FileCheck2
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../data/initialData';
import { AudrinLogo } from '../common/AudrinLogo';

interface FooterProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenInfra?: () => void;
  onSelectService?: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenInfra, onSelectService }) => {
  const handleService = (slug: string) => {
    if (onSelectService) {
      onSelectService(slug);
    } else {
      onNavigate('service-detail', slug);
    }
  };

  const handleInfra = onOpenInfra || (() => {});

  return (
    <footer className="bg-[#080809] border-t border-white/5 text-white/60 text-sm">
      {/* SANS 10139 Regulatory Alignment Callout Banner */}
      <div className="bg-[#0D0D0E] border-b border-white/5 px-4 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#151518] border border-[#C1A461]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#C1A461]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm tracking-tight">
                SANS 10139 Fire-Detection & Alarm Engineering Standards
              </h4>
              <p className="text-xs text-white/50 mt-0.5">
                All fire detection surveys, category design (M, L1–L5, P1–P2), installation, commissioning, and maintenance adhere to SANS 10139 recommended practice.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('request-service')}
              className="px-5 py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-[11px] uppercase tracking-[1.5px] font-bold rounded-xl transition shadow-lg shadow-black/50"
            >
              Request Site Survey
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <div 
              onClick={() => onNavigate('home')} 
              className="cursor-pointer inline-block"
              title="AUDRIN FIRE ENGINEERS"
            >
              <AudrinLogo variant="full" size="md" />
            </div>
            <p className="text-xs text-[#C1A461] font-semibold uppercase tracking-wider">
              {COMPANY_DETAILS.tagline}
            </p>
            <p className="text-xs text-white/50 leading-relaxed">
              Specialist commercial and non-domestic fire-detection and alarm engineering. Delivering precise category specification, rapid fault troubleshooting, and methodical maintenance across South Africa.
            </p>
            <div className="text-xs text-white/40 space-y-1 pt-1">
              <p className="font-mono text-[11px] text-white/60">
                Reg: <span className="text-white">{COMPANY_DETAILS.registrationNumber}</span>
              </p>
              <p className="text-[11px]">
                Trading: {COMPANY_DETAILS.legalName}
              </p>
            </div>
          </div>

          {/* Column 2: Approved Service Areas */}
          <div className="space-y-3">
            <h4 className="text-white/80 font-bold text-[11px] uppercase tracking-[2px]">
              SANS 10139 Services
            </h4>
            <ul className="space-y-2.5 text-xs text-white/50">
              <li>
                <button onClick={() => handleService('fire-detection-site-surveys')} className="hover:text-white transition cursor-pointer text-left">
                  Site Surveys & System Assessments
                </button>
              </li>
              <li>
                <button onClick={() => handleService('system-assessment-and-design')} className="hover:text-white transition cursor-pointer text-left">
                  System Category & Design (M, L1–L5, P1–P2)
                </button>
              </li>
              <li>
                <button onClick={() => handleService('fire-alarm-installation')} className="hover:text-white transition cursor-pointer text-left">
                  Conventional & Addressable Installation
                </button>
              </li>
              <li>
                <button onClick={() => handleService('testing-and-commissioning')} className="hover:text-white transition cursor-pointer text-left">
                  Point-to-Point Testing & Commissioning
                </button>
              </li>
              <li>
                <button onClick={() => handleService('planned-preventative-maintenance')} className="hover:text-white transition cursor-pointer text-left">
                  Quarterly SANS 10139 Maintenance
                </button>
              </li>
              <li>
                <button onClick={() => handleService('fault-finding-and-emergency-faults')} className="hover:text-red-400 transition cursor-pointer text-left text-red-400/90 font-medium">
                  Fault Finding & Emergency Support
                </button>
              </li>
              <li>
                <button onClick={() => handleService('false-alarm-investigation')} className="hover:text-white transition cursor-pointer text-left">
                  False-Alarm Mitigation & Investigation
                </button>
              </li>
              <li>
                <button onClick={() => handleService('zoning-and-as-built-records')} className="hover:text-white transition cursor-pointer text-left">
                  Zone Charts & As-Built Documentation
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Facility Hours */}
          <div className="space-y-3">
            <h4 className="text-white/80 font-bold text-[11px] uppercase tracking-[2px]">
              Pretoria Operations
            </h4>
            <div className="space-y-3 text-xs text-white/60">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C1A461] shrink-0 mt-0.5" />
                <span>{COMPANY_DETAILS.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C1A461] shrink-0" />
                <a href={`tel:${COMPANY_DETAILS.phone}`} className="hover:text-white font-mono font-semibold">
                  {COMPANY_DETAILS.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C1A461] shrink-0" />
                <a href={`mailto:${COMPANY_DETAILS.email}`} className="hover:text-white font-mono text-[11px]">
                  {COMPANY_DETAILS.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C1A461] shrink-0 mt-0.5" />
                <span>{COMPANY_DETAILS.operatingHours} (Mon–Sun)</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleInfra}
                className="text-[11px] text-[#C1A461] hover:text-[#D4BC7B] flex items-center gap-1.5 font-bold uppercase tracking-wider"
              >
                <span>AWS ECS Architecture & IaC</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 4: Scope Exclusions & Compliance Notice */}
          <div className="space-y-3">
            <h4 className="text-white/80 font-bold text-[11px] uppercase tracking-[2px]">
              Scope & POPIA Notice
            </h4>
            <div className="p-4 rounded-2xl bg-[#151518] border border-white/5 text-[11px] space-y-2 leading-relaxed">
              <div className="flex items-center gap-1.5 text-[#C1A461] font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider text-[10px]">Strict Scope Exclusions</span>
              </div>
              <p className="text-white/50">
                Audrin Fire Engineers specialises strictly in electronic fire-detection and alarms. We do not service or supply fire extinguishers, hose reels, hydrants, sprinklers, gas suppression, CCTV, or general security systems.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] pt-1">
              <button onClick={() => onNavigate('careers')} className="hover:text-[#C1A461] underline text-[#C1A461] font-bold">Careers</button>
              <span className="text-white/20">•</span>
              <button onClick={() => onNavigate('privacy-policy')} className="hover:text-white underline">Privacy</button>
              <span className="text-white/20">•</span>
              <button onClick={() => onNavigate('terms')} className="hover:text-white underline">Terms</button>
              <span className="text-white/20">•</span>
              <button onClick={() => onNavigate('cookie-policy')} className="hover:text-white underline">Cookies</button>
              <span className="text-white/20">•</span>
              <button onClick={() => onNavigate('popia-notice')} className="hover:text-[#C1A461] underline text-[#C1A461]">POPIA Request</button>
            </div>
          </div>
        </div>

        {/* Bottom Bar styled like Elegant Dark footer */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[9px] font-bold text-white/30 tracking-[2px] uppercase">
          <div>AUDRIN FIRE ENGINEERS (PTY) LTD &bull; EST. 2026 &bull; PRETORIA &bull; GAUTENG &bull; SANS 10139</div>
          <div className="flex flex-wrap items-center gap-6">
            <span>SANS Compliance: 100%</span>
            <span>Central Dispatch: Online</span>
            <span>Last Sync: {new Date().toLocaleDateString('en-ZA')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

