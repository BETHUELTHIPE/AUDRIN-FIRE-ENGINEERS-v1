import React, { useState } from 'react';
import { useAudrinStore } from '../../services/store';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight, 
  AlertCircle,
  Building2,
  Calendar,
  Layers,
  Wrench,
  Award,
  ChevronDown
} from 'lucide-react';
import { CertificateOfComplianceForm } from './CertificateOfComplianceForm';

interface ComplianceStatusWidgetProps {
  selectedSiteId?: string;
  onSelectSite?: (siteId: string) => void;
  onOpenLogbook?: () => void;
  className?: string;
}

export const ComplianceStatusWidget: React.FC<ComplianceStatusWidgetProps> = ({
  selectedSiteId,
  onSelectSite,
  onOpenLogbook,
  className = ''
}) => {
  const store = useAudrinStore();
  const sites = store.getSites();
  const currentSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  const [activeSiteId, setActiveSiteId] = useState(currentSite?.id || sites[0]?.id || '');
  const [cocFormOpen, setCocFormOpen] = useState(false);

  const site = sites.find(s => s.id === activeSiteId) || currentSite;
  if (!site) return null;

  // Live compliance check from store
  const eligibility = store.checkCocEligibility(site.id);
  const defects = store.getDefects().filter(d => d.siteId === site.id);
  const activeImpairments = defects.filter(d => d.status !== 'resolved');
  const criticalImpairments = activeImpairments.filter(d => d.riskLevel === 'critical' || d.blocksCocIssuance);
  
  const cocs = store.getSansCocs().filter(c => c.siteId === site.id);
  const issuedCoc = cocs.find(c => c.certificateStatus === 'Issued');
  const latestCoc = cocs[0];

  // Inspections & Appointments
  const preWork = store.getPreWorkInspections().find(p => p.siteId === site.id);
  const postWork = store.getPostWorkInspections().find(p => p.siteId === site.id);
  const appointments = store.getAppointments().filter(a => a.siteAddress?.includes(site.name) || a.title?.includes(site.name) || a.locationType === 'on_site');
  const upcomingVisits = appointments.filter(a => a.syncStatus !== 'cancelled');

  // Overall SANS 10139 alignment score
  const passedCriteriaCount = eligibility.gates.filter(c => c.passed).length;
  const totalCriteria = eligibility.gates.length;
  const alignmentPercent = eligibility.overallScore || Math.round((passedCriteriaCount / (totalCriteria || 1)) * 100);

  const getStatusColor = () => {
    if (criticalImpairments.length > 0) return 'text-red-400 bg-red-950/30 border-red-500/30';
    if (issuedCoc) return 'text-emerald-400 bg-emerald-950/30 border-emerald-500/30';
    if (eligibility.canIssueCoc) return 'text-[#C1A461] bg-[#C1A461]/10 border-[#C1A461]/30';
    return 'text-amber-400 bg-amber-950/30 border-amber-500/30';
  };

  const getStatusText = () => {
    if (criticalImpairments.length > 0) return 'Action Required: Active Critical Impairments';
    if (issuedCoc) return 'SANS 10139 COC Issued & Valid';
    if (eligibility.canIssueCoc) return 'Eligible for COC Issuance';
    return 'Inspections & Tests in Progress';
  };

  const handleSiteChange = (id: string) => {
    setActiveSiteId(id);
    if (onSelectSite) onSelectSite(id);
  };

  return (
    <div className={`bg-[#121215] border border-white/10 rounded-2xl p-5 sm:p-6 text-white space-y-5 shadow-xl ${className}`}>
      
      {/* Top Header: Title & Site Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C1A461]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C1A461] font-bold">
              SANS 10139:2012 Compliance Status
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Building Life-Safety Alignment &amp; Audit Status
          </h3>
        </div>

        {/* Site Picker Dropdown */}
        <div className="relative">
          <select
            value={activeSiteId}
            onChange={e => handleSiteChange(e.target.value)}
            className="appearance-none bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 pr-9 text-xs font-mono text-white focus:outline-none focus:border-[#C1A461] cursor-pointer"
          >
            {sites.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.buildingType})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-white/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Score & Alignment Summary Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Score Card */}
        <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-white/60">
            <span>SANS 10139 ALIGNMENT</span>
            <span>{passedCriteriaCount} / {totalCriteria} Gates</span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono text-white">{alignmentPercent}%</span>
            <span className="text-xs font-mono text-white/50">Verified Compliance</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                alignmentPercent === 100 ? 'bg-emerald-500' : alignmentPercent >= 70 ? 'bg-[#C1A461]' : 'bg-amber-500'
              }`}
              style={{ width: `${alignmentPercent}%` }}
            />
          </div>
        </div>

        {/* Status Badge & COC state */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between ${getStatusColor()}`}>
          <div className="flex items-center justify-between text-[11px] font-mono uppercase font-bold">
            <span>Current Alignment State</span>
            {issuedCoc ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          </div>
          <div className="text-sm font-bold mt-1 text-white">
            {getStatusText()}
          </div>
          <div className="text-[11px] font-mono text-white/70 mt-1">
            {latestCoc ? (
              <span>COC: <strong className="text-white">{latestCoc.cocNumber}</strong> ({latestCoc.certificateStatus})</span>
            ) : (
              <span>No Certificate of Compliance issued yet</span>
            )}
          </div>
        </div>

        {/* Action Trigger Card */}
        <div className="p-4 bg-black/40 border border-white/10 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/50 font-bold">
              Statutory Commissioner Action
            </div>
            <div className="text-xs text-white/80 mt-1">
              {eligibility.canIssueCoc 
                ? 'All mandatory test outcomes and inspections verified. Ready for sign-off.' 
                : `${eligibility.openBlockers.length} statutory gate(s) require resolution before issuance.`}
            </div>
          </div>
          <button
            onClick={() => setCocFormOpen(true)}
            className="mt-2 w-full py-2 bg-[#C1A461] hover:bg-[#d4bc7b] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-lg shadow-[#C1A461]/20 font-mono"
          >
            <Award className="w-4 h-4" />
            <span>{latestCoc ? 'Open SANS 10139 COC Form' : 'Generate SANS 10139 COC'}</span>
          </button>
        </div>
      </div>

      {/* 8-Point SANS 10139 Compliance Gates Matrix */}
      <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white/70 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#C1A461]" />
            Official SANS 10139 Gate Verification Matrix
          </span>
          <span className="text-[10px] text-white/40">Grounded in SAQCC Commissioner Module</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {eligibility.gates.map((c, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border text-[11px] font-mono flex items-start gap-2 ${
                c.passed
                  ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                  : 'bg-red-950/20 border-red-500/20 text-red-300'
              }`}
            >
              {c.passed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <div className="font-semibold truncate text-white">{c.label}</div>
                <div className="text-[10px] opacity-70 truncate">{c.sourceRef || c.blockerReason || 'SANS 10139'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Impairments & Pending Inspections Split Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Active Impairments Overview */}
        <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase font-mono text-white">
                Active Impairments &amp; Defects ({activeImpairments.length})
              </h4>
            </div>
            {criticalImpairments.length > 0 && (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/40 rounded text-[9px] font-mono uppercase font-bold">
                {criticalImpairments.length} Critical (Blocks COC)
              </span>
            )}
          </div>

          {activeImpairments.length === 0 ? (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-center text-xs text-emerald-300 font-mono">
              &check; No active impairments. System fully functional.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {activeImpairments.slice(0, 3).map(def => (
                <div 
                  key={def.id}
                  className={`p-2.5 rounded-xl border text-xs font-mono flex items-start justify-between gap-2 ${
                    def.riskLevel === 'critical' || def.blocksCocIssuance
                      ? 'bg-red-950/30 border-red-500/30 text-red-200'
                      : 'bg-black/60 border-white/10 text-white/80'
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${def.riskLevel === 'critical' ? 'bg-red-500' : 'bg-amber-400'}`} />
                      {def.title}
                    </div>
                    <div className="text-[10px] text-white/50 mt-0.5">
                      Priority: {def.riskLevel?.toUpperCase()} &middot; Responsible: {def.responsibleParty || 'Audrin Fire Engineers'}
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/10 uppercase font-bold text-white/70">
                    {def.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Inspections & Site Visits */}
        <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C1A461]" />
              <h4 className="text-xs font-bold uppercase font-mono text-white">
                Inspection &amp; Site Records
              </h4>
            </div>
            {onOpenLogbook && (
              <button
                onClick={onOpenLogbook}
                className="text-[10px] font-mono text-[#C1A461] hover:underline flex items-center gap-1"
              >
                Logbook <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="space-y-2 text-xs font-mono">
            {/* Pre-work status */}
            <div className="p-2.5 bg-black/60 border border-white/10 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Pre-Work Site Inspection</div>
                <div className="text-[10px] text-white/50">
                  {preWork ? `Ref: ${preWork.inspectionNumber} (${new Date(preWork.inspectionDateTime).toLocaleDateString('en-ZA')})` : 'Pending initial survey'}
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                preWork ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {preWork ? 'Completed' : 'Pending'}
              </span>
            </div>

            {/* Post-work status */}
            <div className="p-2.5 bg-black/60 border border-white/10 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Post-Work Commissioning Audit</div>
                <div className="text-[10px] text-white/50">
                  {postWork ? `Ref: ${postWork.inspectionNumber} &middot; Tech: ${postWork.leadTechnicianName}` : 'Pending final commissioning'}
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                postWork ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {postWork ? 'Completed' : 'Pending'}
              </span>
            </div>

            {/* Upcoming site visits */}
            {upcomingVisits.length > 0 && (
              <div className="text-[10px] text-white/50 pt-1 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-[#C1A461]" />
                <span>Next Scheduled Visit: {new Date(upcomingVisits[0].startTime).toLocaleDateString('en-ZA')} ({upcomingVisits[0].title})</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Certificate of Compliance Modal */}
      <CertificateOfComplianceForm
        isOpen={cocFormOpen}
        onClose={() => setCocFormOpen(false)}
        siteId={site.id}
        existingCocId={latestCoc?.id}
      />
    </div>
  );
};
