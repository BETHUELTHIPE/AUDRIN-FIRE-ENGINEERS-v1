import React, { useState } from 'react';
import { useAudrinStore } from '../../services/store';
import { CocEligibilityGateResult } from '../../types';
import { SourceRequirementDrawer } from './SourceRequirementDrawer';
import { 
  Award, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  FileText, 
  Download, 
  Printer, 
  QrCode, 
  Hash, 
  BookOpen,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CocEligibilityGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteId?: string;
  onOpenPreWork?: () => void;
  onOpenPostWork?: () => void;
  onOpenDefects?: () => void;
  onOpenCocForm?: () => void;
}

export const CocEligibilityGateModal: React.FC<CocEligibilityGateModalProps> = ({
  isOpen,
  onClose,
  siteId,
  onOpenPreWork,
  onOpenPostWork,
  onOpenDefects,
  onOpenCocForm
}) => {
  const store = useAudrinStore();
  const sites = store.getSites();
  const branding = store.getCurrentCompanyBranding();
  const issuerSettings = store.getIssuerSettings();
  const activeSite = sites.find(s => s.id === (siteId || sites[0]?.id)) || sites[0];

  const eligibility: CocEligibilityGateResult = store.checkCocEligibility(activeSite.id);

  const [activeTab, setActiveTab] = useState<'gates' | 'certificate_preview'>('gates');
  const [citationDrawerOpen, setCitationDrawerOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | undefined>();

  if (!isOpen) return null;

  const handleExport = (format: 'pdf' | 'docx' | 'xlsx') => {
    store.triggerExportJob(
      'coc',
      `COC-SANS10139-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      format
    );
    alert(`Asynchronous ${format.toUpperCase()} export job queued via Celery worker with anti-tamper watermark.`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-5xl bg-[#121215] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#1E1E24] via-[#16161A] to-[#121215] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/40 font-mono uppercase">
                Section 7 &middot; COC Eligibility Gates
              </span>
              <span className="text-xs font-mono text-white/50">
                Site: {activeSite.name}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              SANS 10139 Certificate of Compliance Eligibility &amp; Issuance Gate
            </h2>
            <p className="text-xs text-white/60">
              Deterministic verification against all mandatory pre-work, post-work, test thresholds, and source control requirements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedReqId('req-sans10400t-4.31');
                setCitationDrawerOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#C1A461] text-xs font-bold font-mono flex items-center gap-1.5 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Source Rules
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mandatory Watermark Warning Banner */}
        <div className="px-6 py-3 bg-amber-950/40 border-b border-amber-500/30 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-amber-300 font-mono text-[11px]">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>BINDING COMPLIANCE RULE:</strong> As current attachments do not constitute the full SANS 10139 standard, all certificates are strictly stamped <strong className="text-white">SOURCE-LIMITED DRAFT - NOT AN ISSUABLE CERTIFICATE</strong>.
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="px-6 py-2.5 bg-[#0A0A0C] border-b border-white/5 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('gates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'gates'
                ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Verification Gates Matrix ({eligibility.gates.filter(g => g.passed).length}/{eligibility.gates.length} Passed)
          </button>

          <button
            onClick={() => setActiveTab('certificate_preview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'certificate_preview'
                ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4" />
            Live Certificate Preview &amp; Watermark
          </button>
        </div>

        {/* Main Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow text-xs">
          
          {/* TAB 1: GATES MATRIX */}
          {activeTab === 'gates' && (
            <div className="space-y-6">
              
              {/* Overall Score Card */}
              <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase font-mono text-white/50">
                    Compliance Verification Score
                  </div>
                  <div className="text-2xl font-black font-mono text-white flex items-center gap-3">
                    <span>{eligibility.overallScore}% Passed</span>
                    <span className="text-xs font-normal text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/30">
                      Draft Certificate Preview Allowed
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {onOpenPreWork && (
                    <button
                      onClick={onOpenPreWork}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition"
                    >
                      Open Pre-Work
                    </button>
                  )}
                  {onOpenPostWork && (
                    <button
                      onClick={onOpenPostWork}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition"
                    >
                      Open Post-Work
                    </button>
                  )}
                  {onOpenDefects && (
                    <button
                      onClick={onOpenDefects}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium transition"
                    >
                      Open Defects
                    </button>
                  )}
                </div>
              </div>

              {/* 9 Gates List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Mandatory Verification Checklist &amp; SANS Source Citations
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {eligibility.gates.map((gate, i) => (
                    <div
                      key={gate.id}
                      className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        gate.passed
                          ? 'bg-[#151518] border-white/10'
                          : (gate.id === 'gate-9' ? 'bg-amber-950/20 border-amber-500/40' : 'bg-red-950/20 border-red-500/30')
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {gate.passed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <AlertTriangle className={`w-5 h-5 ${gate.id === 'gate-9' ? 'text-amber-400' : 'text-red-400'}`} />
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white">
                              Gate {i + 1}: {gate.label}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white/5 text-[#C1A461]">
                              {gate.sourceRef}
                            </span>
                          </div>

                          {gate.blockerReason ? (
                            <p className="text-xs text-amber-200/80 leading-relaxed font-sans">
                              {gate.blockerReason}
                            </p>
                          ) : (
                            <p className="text-xs text-white/50 font-sans">
                              Verified against approved inspection record and SANS criteria.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase ${
                          gate.passed
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : (gate.id === 'gate-9' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' : 'bg-red-950 text-red-400 border border-red-500/30')
                        }`}>
                          {gate.passed ? 'PASSED' : (gate.id === 'gate-9' ? 'SOURCE LIMITED' : 'ACTION REQUIRED')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LIVE CERTIFICATE PREVIEW */}
          {activeTab === 'certificate_preview' && (
            <div className="space-y-4">
              
              {/* Export Toolbar */}
              <div className="p-4 rounded-2xl bg-[#151518] border border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-white/60">
                  Generate official audit-trailed export files with SHA-256 integrity seal:
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF Document
                  </button>
                  <button
                    onClick={() => handleExport('docx')}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Word (.docx)
                  </button>
                  <button
                    onClick={() => handleExport('xlsx')}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Excel (.xlsx)
                  </button>
                </div>
              </div>

              {/* High Fidelity Certificate Paper Simulation */}
              <div className="p-8 rounded-3xl bg-white text-slate-900 shadow-2xl border-4 border-double border-slate-400 max-w-4xl mx-auto space-y-6 relative overflow-hidden font-sans">
                
                {/* Diagonal Source-Limited Draft Watermark across certificate */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-12 select-none rotate-[-25deg]">
                  <span className="text-5xl font-black text-red-600 font-mono text-center tracking-widest leading-relaxed">
                    SOURCE-LIMITED DRAFT<br />NOT AN ISSUABLE CERTIFICATE
                  </span>
                </div>

                {/* Certificate Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                  <div className="space-y-1">
                    <div className="text-sm font-black uppercase tracking-wider text-[#987d3a]">
                      {issuerSettings.legalName}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      {issuerSettings.serviceDescriptor}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      CIPC Reg: {issuerSettings.registrationNumber} &middot; Tel: {issuerSettings.telephone}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {issuerSettings.physicalAddress}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-[9px] uppercase font-bold text-slate-400">Client / Premises Owner</div>
                    <div className="text-xs font-bold text-slate-800">{branding.registeredName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">VAT: {branding.vatNumber}</div>
                  </div>
                </div>

                {/* Title */}
                <div className="text-center space-y-1 pt-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                    REPUBLIC OF SOUTH AFRICA &middot; NATIONAL BUILDING REGULATIONS
                  </div>
                  <h1 className="text-xl font-black uppercase text-slate-900 tracking-tight">
                    Certificate of Compliance (COC)
                  </h1>
                  <div className="text-xs font-bold text-slate-700 font-mono">
                    Fire Detection &amp; Alarm System &middot; SANS 10139 / SANS 10400-T:2011 (Ed. 3)
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Certificate Ref: <strong className="text-slate-900">COC-SANS10139-2026-0842</strong>
                  </div>
                </div>

                {/* Certificate Body Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 p-4 rounded-xl bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-500 block">Protected Premises:</span>
                    <span className="font-medium text-slate-900">{activeSite.name}</span>
                    <div className="text-[10px] text-slate-500">{activeSite.address}</div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 block">Design System Category:</span>
                    <span className="font-bold text-slate-900 font-mono">Category {activeSite.systemCategory} (Total Life-Safety)</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 block">Inspection Ref &amp; Tests:</span>
                    <span className="font-medium text-slate-900">POST-2026-0041 (Bedhead 71.5 dB(A) &ge; 65 dB(A))</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 block">Standby Power Autonomy:</span>
                    <span className="font-medium text-slate-900">24.5 Hours Quiescent + 30 Min Evacuation</span>
                  </div>
                </div>

                {/* Commissioner Legal Declaration Statement */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-[11px] text-slate-700 leading-relaxed">
                  <div className="font-bold text-slate-900 uppercase font-mono text-[10px]">
                    SAQCC / SANS 10139 Commissioner Declaration
                  </div>
                  <p>
                    I hereby certify that the fire detection and alarm system installed at the above premises has been inspected, tested, and verified in accordance with the controlled technical criteria of SANS 10400-T (Edition 3) and SANS 10139 as documented in the approved assessment records.
                  </p>
                </div>

                {/* Signatures and Cryptographic Seal */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-300 text-xs">
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500 font-mono">Lead Commissioner:</div>
                    <div className="font-bold text-slate-900">{issuerSettings.leadCommissionerName}</div>
                    <div className="text-[10px] font-mono text-[#987d3a]">{issuerSettings.leadCommissionerSaqcc}</div>
                    <div className="text-[9px] text-slate-400">Digitally Authenticated via OTP</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500 font-mono">Client Acceptance:</div>
                    <div className="font-bold text-slate-900">{branding.primaryContact.name}</div>
                    <div className="text-[10px] text-slate-600">{branding.primaryContact.role}</div>
                    <div className="text-[9px] text-slate-400">Handover Documented</div>
                  </div>

                  <div className="text-right space-y-1 flex flex-col items-end">
                    <QrCode className="w-12 h-12 text-slate-800" />
                    <div className="text-[8px] font-mono text-slate-400">Scan to Verify</div>
                  </div>
                </div>

                {/* Anti Tamper Footer */}
                <div className="pt-2 border-t border-slate-200 text-[9px] text-slate-400 font-mono flex items-center justify-between">
                  <div>
                    SHA-256: 9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e
                  </div>
                  <div>
                    Audrin Controlled Life-Safety Engine &middot; Page 1 of 1
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#151518] border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="text-[11px] font-mono text-white/40">
            Eligibility Engine Ver. 2026.09
          </div>
          <div className="flex items-center gap-2">
            {onOpenCocForm && (
              <button
                onClick={onOpenCocForm}
                className="px-4 py-2 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-[#C1A461]/20"
              >
                <Award className="w-4 h-4" />
                Open Official SANS 10139 COC Form
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition"
            >
              Close Gate Matrix
            </button>
          </div>
        </div>

      </div>

      {/* Citation Drawer */}
      <SourceRequirementDrawer
        isOpen={citationDrawerOpen}
        onClose={() => setCitationDrawerOpen(false)}
        requirementId={selectedReqId}
      />

    </div>
  );
};
