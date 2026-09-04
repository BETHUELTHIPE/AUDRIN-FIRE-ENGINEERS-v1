import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  PhoneCall, 
  Clock, 
  User as UserIcon, 
  Menu, 
  X, 
  Layers, 
  ChevronRight, 
  FileText, 
  Wrench,
  Radio,
  SlidersHorizontal,
  FolderLock
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../data/initialData';
import { useAudrinStore } from '../../services/store';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onOpenVoiceAi?: () => void;
  onOpenInfra?: () => void;
  onRequestService?: () => void;
  onReportFault?: () => void;
  onOpenLogin?: () => void;
  onOpenVoiceGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenVoiceAi,
  onOpenInfra,
  onRequestService,
  onReportFault,
  onOpenLogin,
  onOpenVoiceGuide
}) => {
  const store = useAudrinStore();
  const user = store.getUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const handleVoice = onOpenVoiceAi || onOpenVoiceGuide || (() => {});
  const handleInfra = onOpenInfra || (() => {});
  const handleRequest = onRequestService || (() => onNavigate('request-service'));
  const handleFault = onReportFault || (() => onNavigate('report-fault'));

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Safety File', view: 'safety-file-dashboard' },
    { label: 'Logbook & COC', view: 'fire-logbook' },
    { label: 'Audit Trail', view: 'compliance-audit-log' },
    { label: 'About Us', view: 'about' },
    { label: 'Careers', view: 'careers' },
    { label: 'Services', view: 'services' },
    { label: 'Contact', view: 'contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-md border-b border-white/5 text-white">
      {/* Top Emergency Fault & Operating Hours Bar */}
      <div className="bg-[#080809] px-4 py-2 border-b border-white/5 text-xs text-white/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 font-medium text-[#C1A461]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C1A461] animate-ping" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">SANS 10139 Fire-Detection Standard</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-white/40 text-[11px]">
              <Clock className="w-3.5 h-3.5" />
              <span>Operations: {COMPANY_DETAILS.operatingHours}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <a 
              href={`tel:${COMPANY_DETAILS.phone}`} 
              className="flex items-center gap-1.5 text-white/80 hover:text-[#C1A461] font-mono text-[11px] font-semibold transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#C1A461]" />
              <span>Emergency 24/7: {COMPANY_DETAILS.phone}</span>
            </a>
            <button
              onClick={handleInfra}
              className="text-[10px] uppercase tracking-widest font-bold bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/5 transition"
              title="View AWS ECS & Terraform IaC Architecture"
            >
              <FolderLock className="w-3 h-3 text-[#C1A461]" />
              <span>AWS Architecture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A1A1C] to-[#2A2A2E] flex items-center justify-center border border-[#C1A461]/30 group-hover:border-[#C1A461] transition shadow-lg">
              <Flame className="w-5 h-5 text-[#C1A461]" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-lg sm:text-xl font-bold tracking-tighter text-white">
                <span>AUDRIN</span>
                <span className="text-[#C1A461]">.</span>
                <span className="text-white/80 font-normal">FIRE ENGINEERS</span>
              </div>
              <p className="text-[9px] text-[#C1A461]/80 font-bold uppercase tracking-[2px]">
                {COMPANY_DETAILS.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-widest font-semibold text-white/50">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => onNavigate(link.view)}
                className={`transition-colors duration-200 cursor-pointer ${
                  currentView === link.view 
                    ? 'text-white border-b border-[#C1A461] pb-1' 
                    : 'hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={handleVoice}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] uppercase tracking-wider font-bold text-[#C1A461] transition"
            >
              <Radio className="w-3 h-3 text-[#C1A461] animate-pulse" />
              <span>Voice AI</span>
            </button>
          </nav>

          {/* Action CTAs and User Profile / Role Control */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Report Fault Button */}
            <button
              onClick={handleFault}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-500/30 text-[11px] uppercase tracking-wider font-bold transition"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Report Fault</span>
            </button>

            {/* Request Service Button (Gold CTA) */}
            <button
              onClick={handleRequest}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-[11px] uppercase tracking-[1.5px] font-bold shadow-lg shadow-black/40 transition transform hover:-translate-y-0.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Request Service</span>
            </button>

            {/* Role & Dashboard Switcher (Aureus Tier Style) */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#151518] hover:bg-[#1E1E22] border border-white/5 transition"
                title="Switch Dashboard Perspective"
              >
                <div className="text-right">
                  <div className="text-[11px] font-bold text-white capitalize leading-tight">
                    {user.role === 'ops_admin' ? 'Operations' : user.role.replace('_', ' ')}
                  </div>
                  <div className="text-[8px] text-[#C1A461] font-bold tracking-tighter uppercase">
                    PORTAL ACCESS
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1A1A1C] to-[#2A2A2E] border border-[#C1A461]/40 flex items-center justify-center text-[10px] font-bold text-[#C1A461]">
                  {user.role.substring(0, 2).toUpperCase()}
                </div>
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-[#151518] border border-white/10 rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/5 text-[9px] font-bold uppercase tracking-[2px] text-white/30">
                    Switch Perspective
                  </div>
                  <button
                    onClick={() => { store.setUserRole('customer'); onNavigate('dashboard'); setRoleSwitcherOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-white/5 transition ${user.role === 'customer' ? 'text-[#C1A461] font-bold bg-white/5' : 'text-white/60'}`}
                  >
                    <span>Customer Dashboard</span>
                    {user.role === 'customer' && <span className="text-[9px] uppercase tracking-wider bg-[#C1A461]/20 text-[#C1A461] px-2 py-0.5 rounded-full font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => { store.setUserRole('staff'); onNavigate('staff-dashboard'); setRoleSwitcherOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-white/5 transition ${user.role === 'staff' ? 'text-[#C1A461] font-bold bg-white/5' : 'text-white/60'}`}
                  >
                    <span>Staff Engineer Hub</span>
                    {user.role === 'staff' && <span className="text-[9px] uppercase tracking-wider bg-[#C1A461]/20 text-[#C1A461] px-2 py-0.5 rounded-full font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => { store.setUserRole('ops_admin'); onNavigate('admin-dashboard'); setRoleSwitcherOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-white/5 transition ${user.role === 'ops_admin' ? 'text-[#C1A461] font-bold bg-white/5' : 'text-white/60'}`}
                  >
                    <span>Executive Operations (Admin)</span>
                    {user.role === 'ops_admin' && <span className="text-[9px] uppercase tracking-wider bg-[#C1A461]/20 text-[#C1A461] px-2 py-0.5 rounded-full font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => { onNavigate('careers'); setRoleSwitcherOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-white/5 transition ${currentView === 'careers' ? 'text-[#C1A461] font-bold bg-white/5' : 'text-white/60'}`}
                  >
                    <span>Careers & Technician Portal</span>
                    <span className="text-[9px] uppercase tracking-wider bg-[#C1A461]/20 text-[#C1A461] px-2 py-0.5 rounded-full font-bold">SAQCC</span>
                  </button>
                  <button
                    onClick={() => { store.setUserRole('super_admin'); onNavigate('admin-dashboard'); setRoleSwitcherOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-white/5 transition ${user.role === 'super_admin' ? 'text-[#C1A461] font-bold bg-white/5' : 'text-white/60'}`}
                  >
                    <span>Director / Lead Engineer</span>
                    {user.role === 'super_admin' && <span className="text-[9px] uppercase tracking-wider bg-[#C1A461]/20 text-[#C1A461] px-2 py-0.5 rounded-full font-bold">Active</span>}
                  </button>
                  <button
                    onClick={() => { onNavigate('certificate-of-compliance'); setRoleSwitcherOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-white/5 transition border-t border-white/5 mt-1 pt-2.5 ${currentView === 'certificate-of-compliance' ? 'text-[#C1A461] font-bold bg-white/5' : 'text-[#C1A461]'}`}
                  >
                    <span className="font-semibold">SANS 10139 COC Form</span>
                    <span className="text-[9px] uppercase tracking-wider bg-[#C1A461]/20 text-[#C1A461] px-2 py-0.5 rounded-full font-bold">Commissioner</span>
                  </button>
                  <button
                    onClick={() => { onNavigate('safety-file-dashboard'); setRoleSwitcherOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-white/5 transition ${currentView === 'safety-file-dashboard' ? 'text-[#C1A461] font-bold bg-white/5' : 'text-slate-300'}`}
                  >
                    <span className="font-semibold">Safety File Dashboard</span>
                    <span className="text-[9px] uppercase tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">Dossier</span>
                  </button>
                  <button
                    onClick={() => { onNavigate('compliance-audit-log'); setRoleSwitcherOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-white/5 transition ${currentView === 'compliance-audit-log' ? 'text-[#C1A461] font-bold bg-white/5' : 'text-slate-300'}`}
                  >
                    <span className="font-semibold">Compliance Audit Ledger</span>
                    <span className="text-[9px] uppercase tracking-wider bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold">POPIA/SANS</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={handleFault}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 text-red-300 text-xs font-bold border border-red-500/30"
            >
              Fault
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#151518] text-white/70 hover:text-white border border-white/5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0B] border-b border-white/5 px-4 pt-3 pb-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => { handleRequest(); setMobileMenuOpen(false); }}
              className="w-full py-3 bg-[#C1A461] text-black rounded-xl text-xs uppercase tracking-wider font-bold text-center"
            >
              Request Service
            </button>
            <button
              onClick={() => { handleFault(); setMobileMenuOpen(false); }}
              className="w-full py-3 bg-[#151518] border border-red-500/30 text-red-300 rounded-xl text-xs uppercase tracking-wider font-bold text-center"
            >
              Report Fault
            </button>
          </div>

          <button
            onClick={() => { handleVoice(); setMobileMenuOpen(false); }}
            className="w-full py-2.5 px-3 bg-[#151518] border border-[#C1A461]/30 text-[#C1A461] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Radio className="w-4 h-4 text-[#C1A461] animate-pulse" />
            <span>Voice AI Walkthrough</span>
          </button>

          <div className="pt-2 border-t border-white/5 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => { onNavigate(link.view); setMobileMenuOpen(false); }}
                className={`w-full text-left py-2.5 px-3 rounded-xl text-xs uppercase tracking-widest font-semibold ${
                  currentView === link.view ? 'bg-[#151518] text-[#C1A461]' : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 space-y-2">
            <div className="text-[9px] text-white/30 px-3 font-bold uppercase tracking-[2px]">Dashboards</div>
            <button
              onClick={() => { store.setUserRole('customer'); onNavigate('dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 text-xs text-white/80 bg-[#151518] rounded-xl flex items-center justify-between border border-white/5"
            >
              <span>Customer Portal</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>
            <button
              onClick={() => { store.setUserRole('staff'); onNavigate('staff-dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 text-xs text-white/80 bg-[#151518] rounded-xl flex items-center justify-between border border-white/5"
            >
              <span>Staff Engineer Hub</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>
            <button
              onClick={() => { store.setUserRole('ops_admin'); onNavigate('admin-dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 text-xs text-white/80 bg-[#151518] rounded-xl flex items-center justify-between border border-white/5"
            >
              <span>Operations & Google Sheets Register</span>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

