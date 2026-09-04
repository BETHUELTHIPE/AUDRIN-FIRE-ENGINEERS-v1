import React, { useState } from 'react';
import { useAudrinStore } from '../../services/store';
import { 
  LogbookEntry, 
  FalseAlarmCategory, 
  RoutineEventCategory,
  PreWorkInspectionRecord,
  PostWorkInspectionRecord
} from '../../types';
import { SourceRequirementDrawer } from './SourceRequirementDrawer';
import { PreWorkInspectionModal } from './PreWorkInspectionModal';
import { PostWorkInspectionModal } from './PostWorkInspectionModal';
import { DefectActionManagerModal } from './DefectActionManagerModal';
import { CocEligibilityGateModal } from './CocEligibilityGateModal';
import { CompanyBrandingManager } from './CompanyBrandingManager';
import { ComplianceStatusWidget } from './ComplianceStatusWidget';
import { CertificateOfComplianceForm } from './CertificateOfComplianceForm';
import { QrCodeUtility } from './QrCodeUtility';
import { 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  Award, 
  AlertTriangle, 
  Plus, 
  RefreshCw, 
  Download, 
  Upload, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Building2, 
  Layers, 
  CheckCircle2, 
  Table, 
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Sparkles,
  Zap,
  Lock,
  Camera,
  QrCode
} from 'lucide-react';

export const FireDetectionLogbookView: React.FC = () => {
  const store = useAudrinStore();
  const sites = store.getSites();
  const logbookEntries = store.getLogbookEntries();
  const preWorkInspections = store.getPreWorkInspections();
  const postWorkInspections = store.getPostWorkInspections();
  const defects = store.getDefects();
  const sourceDocs = store.getSourceDocuments();
  const sourceReqs = store.getSourceRequirements();
  const sheetsState = store.getGoogleSheetsState();
  const exportJobs = store.getExportJobs();
  const currentUser = store.getCurrentUser();
  const branding = store.getCurrentCompanyBranding();

  // Selected site
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || 'site-01');
  const activeSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'logbook' | 'pre_work' | 'post_work' | 'defects' | 'coc' | 'sources' | 'sheets' | 'branding'>('logbook');

  // Modals state
  const [preWorkModalOpen, setPreWorkModalOpen] = useState(false);
  const [selectedPreWorkId, setSelectedPreWorkId] = useState<string | undefined>();

  const [postWorkModalOpen, setPostWorkModalOpen] = useState(false);
  const [selectedPostWorkId, setSelectedPostWorkId] = useState<string | undefined>();

  const [defectsModalOpen, setDefectsModalOpen] = useState(false);
  const [cocModalOpen, setCocModalOpen] = useState(false);
  const [cocFormOpen, setCocFormOpen] = useState(false);
  const [qrModalEntry, setQrModalEntry] = useState<LogbookEntry | null>(null);
  const [brandingModalOpen, setBrandingModalOpen] = useState(false);

  // Citation Drawer
  const [citationDrawerOpen, setCitationDrawerOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | undefined>();

  // Add Event Form inside logbook
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<{
    eventType: 'routine_test' | 'false_alarm' | 'fault' | 'maintenance' | 'disconnection' | 'commissioning';
    eventCategory?: RoutineEventCategory;
    falseAlarmCategory?: FalseAlarmCategory;
    summary: string;
    actionTaken: string;
    remedialActionNeeded: string;
    zoneOrDeviceLocation: string;
    triggeredDeviceAddress: string;
  }>({
    eventType: 'routine_test',
    eventCategory: 'weekly_call_point',
    summary: '',
    actionTaken: '',
    remedialActionNeeded: '',
    zoneOrDeviceLocation: 'Zone 1 - Main Entrance Foyer',
    triggeredDeviceAddress: 'MCP-01'
  });

  // Filtered lists
  const siteLogbookEntries = logbookEntries.filter(e => e.siteId === selectedSiteId);
  const sitePreWork = preWorkInspections.filter(p => p.siteId === selectedSiteId);
  const sitePostWork = postWorkInspections.filter(p => p.siteId === selectedSiteId);
  const siteDefects = defects.filter(d => d.siteId === selectedSiteId);

  const cocEligibility = store.checkCocEligibility(selectedSiteId);

  const handleOpenCitation = (reqId: string) => {
    setSelectedReqId(reqId);
    setCitationDrawerOpen(true);
  };

  const handleAddLogbookEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.summary.trim()) return;

    const entry: LogbookEntry = {
      id: `log-${Date.now()}`,
      siteId: selectedSiteId,
      siteName: activeSite?.name || 'Site',
      clientId: branding.orgId,
      entryTimestamp: new Date().toISOString(),
      eventType: newEvent.eventType,
      eventCategory: newEvent.eventCategory,
      falseAlarmCategory: newEvent.eventType === 'false_alarm' ? newEvent.falseAlarmCategory : undefined,
      zoneOrDeviceLocation: newEvent.zoneOrDeviceLocation,
      triggeredDeviceAddress: newEvent.triggeredDeviceAddress,
      summary: newEvent.summary,
      actionTaken: newEvent.actionTaken,
      remedialActionNeeded: newEvent.remedialActionNeeded || 'None',
      technicianName: currentUser.name,
      technicianSaqccNumber: 'SAQCC-8812040987',
      isSystemFault: newEvent.eventType === 'fault',
      isRoutineTest: newEvent.eventType === 'routine_test',
      sourceCoverageStatus: 'source_limited_draft'
    };

    store.addLogbookEntry(entry);
    setIsAddingEvent(false);
    setNewEvent({
      eventType: 'routine_test',
      eventCategory: 'weekly_call_point',
      summary: '',
      actionTaken: '',
      remedialActionNeeded: '',
      zoneOrDeviceLocation: 'Zone 1 - Main Entrance Foyer',
      triggeredDeviceAddress: 'MCP-01'
    });
  };

  const handleSyncSheets = () => {
    store.triggerGoogleSheetsSync();
    alert('Google Sheets one-way synchronization triggered (App -> Compliance Master Sheet).');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner: Binding Source-of-Truth Enforcement & Site Selector */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#18181D] via-[#141418] to-[#101013] border border-white/10 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/40 font-mono uppercase tracking-wider">
                Audrin Fire Engineers &middot; SANS 10139 Compliance Platform
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-500/30 font-mono uppercase">
                Source-Limited Draft Engine
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Fire Detection &amp; Alarm System Digital Logbook
            </h1>
            <p className="text-xs text-white/60 max-w-3xl">
              Strictly grounded on approved sources: <strong className="text-white">SANS 10400-T:2011 (Ed. 3)</strong> and <strong className="text-white">Summative POE Module SANS 10139 (ND Ramphela)</strong>. Zero extrapolated AI prompts.
            </p>
          </div>

          {/* Site Selector and Quick Launchers */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <select
                value={selectedSiteId}
                onChange={e => setSelectedSiteId(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono font-medium outline-none focus:border-[#C1A461] appearance-none pr-8 cursor-pointer"
              >
                {sites.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.buildingOccupancyClass || s.buildingType})
                  </option>
                ))}
              </select>
              <Building2 className="w-3.5 h-3.5 text-[#C1A461] absolute right-2.5 top-3.5 pointer-events-none" />
            </div>

            <button
              onClick={() => setCocModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-[#C1A461]/20"
            >
              <Award className="w-4 h-4" />
              COC Gate ({cocEligibility.overallScore}%)
            </button>

            <button
              onClick={() => setBrandingModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-[#C1A461]" />
              Branding Profile
            </button>
          </div>

        </div>

        {/* Site Details Pill Strip */}
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-4 text-xs font-mono text-white/50">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C1A461]" />
            <span>{activeSite?.address}</span>
          </div>
          <div>&middot;</div>
          <div>
            System: <strong className="text-white">Category {activeSite?.systemCategory || 'L1'}</strong>
          </div>
          <div>&middot;</div>
          <div>
            Loops/Zones: <strong className="text-white">{activeSite?.loopCount || 4} Loops / {activeSite?.zoneCount || 16} Zones</strong>
          </div>
          <div>&middot;</div>
          <div>
            Open Defects: <strong className={siteDefects.filter(d => d.status === 'open').length > 0 ? 'text-red-400' : 'text-emerald-400'}>{siteDefects.filter(d => d.status === 'open').length}</strong>
          </div>
        </div>
      </div>

      {/* SANS 10139 Compliance Status & Alignment Widget */}
      <ComplianceStatusWidget
        selectedSiteId={selectedSiteId}
        onSelectSite={setSelectedSiteId}
        onOpenLogbook={() => setActiveTab('logbook')}
      />

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-b border-white/10">
        <button
          onClick={() => setActiveTab('logbook')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'logbook'
              ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Section 4: Events Logbook ({siteLogbookEntries.length})
        </button>

        <button
          onClick={() => setActiveTab('pre_work')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'pre_work'
              ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          Section 5: Pre-Work Inspections ({sitePreWork.length})
        </button>

        <button
          onClick={() => setActiveTab('post_work')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'post_work'
              ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Section 6: Post-Work &amp; Tests ({sitePostWork.length})
        </button>

        <button
          onClick={() => setActiveTab('defects')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'defects'
              ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Section 11: Defects &amp; Actions ({siteDefects.length})
        </button>

        <button
          onClick={() => setActiveTab('coc')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'coc'
              ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4" />
          Section 7: COC Eligibility Gate
        </button>

        <button
          onClick={() => setActiveTab('sources')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'sources'
              ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          Source Registry ({sourceDocs.length} PDFs &middot; {sourceReqs.length} Rules)
        </button>

        <button
          onClick={() => setActiveTab('sheets')}
          className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'sheets'
              ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          Section 9/10: Sheets Sync &amp; Exports
        </button>
      </div>

      {/* TAB 1: SECTION 4 LOGBOOK VIEW */}
      {activeTab === 'logbook' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-2xl bg-[#151518] border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#C1A461]" />
                SANS 10139 Daily &amp; Routine Event Logbook
              </h3>
              <p className="text-xs text-white/50">
                Log weekly call point tests, quarterly audits, false alarms by category, and system disconnections per Summative POE Q19.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsAddingEvent(true)}
                className="px-4 py-2 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Record Event / Test
              </button>
              <button
                onClick={() => handleOpenCitation('req-poe-q19')}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#C1A461] text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                POE Q19 Logbook Rule
              </button>
            </div>
          </div>

          {/* Add Event Form Modal / Inline */}
          {isAddingEvent && (
            <form onSubmit={handleAddLogbookEntry} className="p-5 rounded-3xl bg-[#18181D] border border-[#C1A461]/40 space-y-4 text-xs shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#C1A461]" />
                  Log New Fire Detection System Event
                </h4>
                <button type="button" onClick={() => setIsAddingEvent(false)} className="text-white/40 hover:text-white">
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Event Type *
                  </label>
                  <select
                    value={newEvent.eventType}
                    onChange={e => setNewEvent({ ...newEvent, eventType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                  >
                    <option value="routine_test">Routine Inspection / Test</option>
                    <option value="false_alarm">False Alarm Event</option>
                    <option value="fault">System Fault / Disconnection</option>
                    <option value="maintenance">Maintenance Service</option>
                    <option value="commissioning">Commissioning / Modification</option>
                  </select>
                </div>

                {newEvent.eventType === 'routine_test' && (
                  <div>
                    <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                      Routine Test Frequency
                    </label>
                    <select
                      value={newEvent.eventCategory}
                      onChange={e => setNewEvent({ ...newEvent, eventCategory: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                    >
                      <option value="weekly_call_point">Weekly Call Point Test</option>
                      <option value="monthly_battery">Monthly Battery / Charger Check</option>
                      <option value="quarterly_inspection">Quarterly SANS Audit</option>
                      <option value="annual_inspection">Annual Comprehensive Audit</option>
                    </select>
                  </div>
                )}

                {newEvent.eventType === 'false_alarm' && (
                  <div>
                    <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                      False Alarm Categorization (POE Q1(t))
                    </label>
                    <select
                      value={newEvent.falseAlarmCategory}
                      onChange={e => setNewEvent({ ...newEvent, falseAlarmCategory: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                    >
                      <option value="environmental">Environmental / Ambient Activity</option>
                      <option value="user_accidental">User Accidental Operation</option>
                      <option value="malicious">Malicious Intent</option>
                      <option value="equipment_fault">Defective Device / Equipment</option>
                      <option value="unknown">Unknown Cause</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Zone / Device Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.zoneOrDeviceLocation}
                    onChange={e => setNewEvent({ ...newEvent, zoneOrDeviceLocation: e.target.value })}
                    placeholder="e.g. Zone 2 - Level 1 Office"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                  Event Summary &amp; Observation *
                </label>
                <textarea
                  required
                  rows={2}
                  value={newEvent.summary}
                  onChange={e => setNewEvent({ ...newEvent, summary: e.target.value })}
                  placeholder="Record full event description..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Immediate Action Taken
                  </label>
                  <input
                    type="text"
                    value={newEvent.actionTaken}
                    onChange={e => setNewEvent({ ...newEvent, actionTaken: e.target.value })}
                    placeholder="e.g. Reset panel, isolated loop 2 for cleaning"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Outstanding Remedial Action Needed
                  </label>
                  <input
                    type="text"
                    value={newEvent.remedialActionNeeded}
                    onChange={e => setNewEvent({ ...newEvent, remedialActionNeeded: e.target.value })}
                    placeholder="e.g. Replace point smoke detector chamber"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black font-bold"
                >
                  Commit Logbook Entry
                </button>
              </div>
            </form>
          )}

          {/* Table of Logbook Entries */}
          <div className="rounded-3xl bg-[#121215] border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#18181D] border-b border-white/10 text-white/40 font-mono text-[10px] uppercase">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Type / Classification</th>
                    <th className="p-4">Location / Addr</th>
                    <th className="p-4">Event Description &amp; Actions</th>
                    <th className="p-4">Technician</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Audit &amp; Auth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {siteLogbookEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-white/5 transition">
                      <td className="p-4 font-mono text-white/70 whitespace-nowrap">
                        {new Date(entry.entryTimestamp).toLocaleDateString()} {new Date(entry.entryTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          entry.eventType === 'false_alarm'
                            ? 'bg-red-950 text-red-300 border border-red-500/30'
                            : (entry.eventType === 'fault' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' : 'bg-blue-950 text-blue-300 border border-blue-500/30')
                        }`}>
                          {entry.eventType.replace('_', ' ')}
                        </span>
                        {entry.falseAlarmCategory && (
                          <div className="text-[10px] text-red-400 font-mono mt-0.5">
                            Cat: {entry.falseAlarmCategory}
                          </div>
                        )}
                        {entry.eventCategory && (
                          <div className="text-[10px] text-white/40 font-mono mt-0.5">
                            {entry.eventCategory.replace('_', ' ')}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-white font-medium">
                        <div>{entry.zoneOrDeviceLocation}</div>
                        {entry.triggeredDeviceAddress && (
                          <div className="text-[10px] font-mono text-[#C1A461]">{entry.triggeredDeviceAddress}</div>
                        )}
                      </td>
                      <td className="p-4 space-y-1">
                        <div className="text-white leading-relaxed">{entry.summary}</div>
                        {entry.actionTaken && (
                          <div className="text-[11px] text-emerald-400">
                            <strong>Action:</strong> {entry.actionTaken}
                          </div>
                        )}
                        {entry.remedialActionNeeded && entry.remedialActionNeeded !== 'None' && (
                          <div className="text-[11px] text-amber-400">
                            <strong>Remedial:</strong> {entry.remedialActionNeeded}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-mono text-white/70 text-[11px] whitespace-nowrap">
                        {entry.technicianName}
                        <div className="text-[10px] text-white/40">{entry.technicianSaqccNumber}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono">
                          Recorded
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => setQrModalEntry(entry)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C1A461]/20 border border-white/10 hover:border-[#C1A461]/40 text-white hover:text-[#C1A461] text-[10px] font-mono inline-flex items-center gap-1 transition"
                          title="View SANS 10139 read-only authentication URL and QR code"
                        >
                          <QrCode className="w-3 h-3 text-[#C1A461]" />
                          <span>Verify</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PRE-WORK INSPECTIONS */}
      {activeTab === 'pre_work' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#151518] border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C1A461]" />
                Section 5: Pre-Work Baseline Inspection Forms
              </h3>
              <p className="text-xs text-white/50">
                Initial site safety, hazard identification, battery voltage, and existing CIE condition assessment.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedPreWorkId(undefined);
                setPreWorkModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-lg shadow-[#C1A461]/20"
            >
              <Plus className="w-4 h-4" /> Create Pre-Work Record
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sitePreWork.map(record => (
              <div key={record.id} className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4 hover:border-[#C1A461]/40 transition">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#C1A461]">
                        {record.inspectionNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        record.workflowStatus === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}>
                        {record.workflowStatus}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">{record.panelMakeModel}</div>
                    <div className="text-xs text-white/50 font-mono">Category {record.systemCategory} &middot; {record.zoneLoopCount} Loops</div>
                  </div>

                  <div className="text-right text-xs font-mono text-white/40">
                    {new Date(record.inspectionDateTime).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-xs text-white/70 line-clamp-2">
                  {record.proposedWorkScope}
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-white/40 block text-[9px]">Battery VDC:</span>
                    <span className="text-emerald-400 font-bold">{record.batteryVoltageVdc} V</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px]">Hazards:</span>
                    <span className="text-white">{record.siteHazardsIdentified.length}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px]">Dual Signatures:</span>
                    <span className={record.technicianSignature && record.clientSignature ? 'text-emerald-400' : 'text-amber-400'}>
                      {record.technicianSignature && record.clientSignature ? 'Complete' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      setSelectedPreWorkId(record.id);
                      setPreWorkModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <FileText className="w-3.5 h-3.5" /> View / Edit Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: POST-WORK INSPECTIONS */}
      {activeTab === 'post_work' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#151518] border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C1A461]" />
                Section 6: Post-Work &amp; Commissioning Test Verification
              </h3>
              <p className="text-xs text-white/50">
                Sound level dB(A) tests, secondary power autonomy calculations, and restoration handover evidence.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedPostWorkId(undefined);
                setPostWorkModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-lg shadow-[#C1A461]/20"
            >
              <Plus className="w-4 h-4" /> Create Post-Work Record
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sitePostWork.map(record => (
              <div key={record.id} className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4 hover:border-[#C1A461]/40 transition">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#C1A461]">
                        {record.inspectionNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        record.workflowStatus === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}>
                        {record.workflowStatus}
                      </span>
                    </div>
                    <div className="text-xs text-white/60 font-mono">
                      Pre-Work Ref: <strong className="text-white">{record.preWorkInspectionNumber}</strong>
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono text-white/40">
                    {new Date(record.completionDateTime).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-xs text-white/70 line-clamp-2">
                  {record.actualWorkCompleted}
                </p>

                {/* SANS Test Gate Badges */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-white/40 block text-[9px]">Sounder Level:</span>
                    <span className="text-emerald-400 font-bold">{record.alarmSounderTestedDba} dB(A)</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px]">Power Autonomy:</span>
                    <span className="text-emerald-400 font-bold">{record.standbyAutonomyTestedHours} Hours</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px]">Fault Latency:</span>
                    <span className="text-white">{record.detectorFaultResponseSeconds}s (&le;200s)</span>
                  </div>
                  <div>
                    <span className="text-white/40 block text-[9px]">Restoration:</span>
                    <span className={record.systemFullyRestored ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {record.systemFullyRestored ? 'Restored' : 'Impaired'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      setSelectedPostWorkId(record.id);
                      setPostWorkModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> View Commissioning Tests
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DEFECTS REGISTER */}
      {activeTab === 'defects' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#151518] border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Section 11: Non-Conformances &amp; Defects Manager
              </h3>
              <p className="text-xs text-white/50">
                Track compliance defects with automated COC-blocking gates and SANS citations.
              </p>
            </div>

            <button
              onClick={() => setDefectsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Open Full Defect Action Board
            </button>
          </div>

          <div className="space-y-3">
            {siteDefects.map(d => (
              <div key={d.id} className="p-4 rounded-2xl bg-[#151518] border border-white/10 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      d.riskLevel === 'critical' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {d.riskLevel} Risk
                    </span>
                    {d.blocksCocIssuance && (
                      <span className="px-2 py-0.5 rounded bg-red-950 border border-red-500/40 text-red-300 text-[10px] font-mono">
                        Blocks COC
                      </span>
                    )}
                    <span className="font-mono text-xs text-white/40">Target: {d.targetDate}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{d.title}</h4>
                  <p className="text-xs text-white/70">{d.description}</p>
                </div>

                <button
                  onClick={() => setDefectsModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs shrink-0"
                >
                  Manage Defect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COC GATE */}
      {activeTab === 'coc' && (
        <div className="p-6 rounded-3xl bg-[#151518] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C1A461]" />
                Certificate of Compliance Eligibility Matrix
              </h3>
              <p className="text-xs text-white/60">
                Evaluation of all 9 prerequisite gates for site: <strong className="text-white">{activeSite?.name}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCocModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition"
              >
                Inspect Gate Matrix
              </button>
              <button
                onClick={() => setCocFormOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#C1A461]/20 flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                Open SANS 10139 COC Module
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cocEligibility.gates.map((g, i) => (
              <div key={g.id} className={`p-4 rounded-2xl border space-y-2 ${
                g.passed ? 'bg-black/30 border-white/10' : 'bg-amber-950/20 border-amber-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-white/40">Gate {i + 1}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    g.passed ? 'text-emerald-400 bg-emerald-950' : 'text-amber-400 bg-amber-950'
                  }`}>
                    {g.passed ? 'PASSED' : 'LIMITED'}
                  </span>
                </div>
                <div className="text-xs font-bold text-white">{g.label}</div>
                <div className="text-[10px] font-mono text-[#C1A461]">{g.sourceRef}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SOURCE REGISTRY */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#151518] border border-white/10 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C1A461]" />
              Approved Source-of-Truth Document Registry
            </h3>
            <p className="text-xs text-white/50">
              Only technical questions, limits, and declarations mapped to these two verified attachments are executed in the application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sourceDocs.map(doc => (
              <div key={doc.id} className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C1A461]/20 text-[#C1A461] uppercase">
                      {doc.fileName}
                    </span>
                    <h4 className="text-sm font-bold text-white">{doc.documentTitle}</h4>
                    <div className="text-xs text-white/50">{doc.editionOrDate}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-mono">
                    Verified Source
                  </span>
                </div>

                <p className="text-xs text-white/70 leading-relaxed font-sans">
                  {doc.summaryScope}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-white/40">Status: {doc.approvalStatus.toUpperCase()}</span>
                  <button
                    onClick={() => {
                      setSelectedReqId(undefined);
                      setCitationDrawerOpen(true);
                    }}
                    className="text-[#C1A461] font-mono text-xs font-bold hover:underline flex items-center gap-1"
                  >
                    View All Mapped Requirements &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: GOOGLE SHEETS & EXPORTS */}
      {activeTab === 'sheets' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-[#151518] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#C1A461]" />
                  Section 9: Google Sheets Asynchronous One-Way Sync
                </h3>
                <p className="text-xs text-white/50">
                  Compliance data pushes asynchronously from App to Google Sheets. Spreadsheet edits are not ingested into compliance master records.
                </p>
              </div>

              <button
                onClick={handleSyncSheets}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <RefreshCw className="w-4 h-4" /> Trigger Immediate Sync
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-white/40 block text-[10px]">Master Sheet ID:</span>
                <span className="text-white">{sheetsState.spreadsheetId}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">Sync Status:</span>
                <span className="text-emerald-400 font-bold">{sheetsState.syncStatus.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">Last Synced:</span>
                <span className="text-white/70">{new Date(sheetsState.lastSyncTimestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Celery Export Job Queue */}
          <div className="p-5 rounded-3xl bg-[#151518] border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-[#C1A461]" />
              Section 10: Asynchronous Export Worker Queue (PDF / DOCX / XLSX)
            </h3>
            <p className="text-xs text-white/50">
              Celery worker task history with anti-tamper watermark injection.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 font-mono text-[10px] uppercase">
                    <th className="py-2">Job ID</th>
                    <th className="py-2">Document Type</th>
                    <th className="py-2">Format</th>
                    <th className="py-2">Created</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {exportJobs.map(job => (
                    <tr key={job.id} className="hover:bg-white/5">
                      <td className="py-3 text-[#C1A461]">{job.id}</td>
                      <td className="py-3 text-white uppercase">{job.documentType}</td>
                      <td className="py-3 text-white font-bold">{job.format.toUpperCase()}</td>
                      <td className="py-3 text-white/50">{new Date(job.requestedAt).toLocaleTimeString()}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px]">
                          {job.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3">
                        <a
                          href={job.downloadUrl}
                          className="text-[#C1A461] hover:underline flex items-center gap-1 font-sans text-xs"
                        >
                          <Download className="w-3 h-3" /> Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <PreWorkInspectionModal
        isOpen={preWorkModalOpen}
        onClose={() => setPreWorkModalOpen(false)}
        inspectionId={selectedPreWorkId}
        onSaved={() => {}}
      />

      <PostWorkInspectionModal
        isOpen={postWorkModalOpen}
        onClose={() => setPostWorkModalOpen(false)}
        inspectionId={selectedPostWorkId}
        onSaved={() => {}}
      />

      <DefectActionManagerModal
        isOpen={defectsModalOpen}
        onClose={() => setDefectsModalOpen(false)}
        siteId={selectedSiteId}
      />

      <CocEligibilityGateModal
        isOpen={cocModalOpen}
        onClose={() => setCocModalOpen(false)}
        siteId={selectedSiteId}
        onOpenPreWork={() => {
          setCocModalOpen(false);
          setPreWorkModalOpen(true);
        }}
        onOpenPostWork={() => {
          setCocModalOpen(false);
          setPostWorkModalOpen(true);
        }}
        onOpenDefects={() => {
          setCocModalOpen(false);
          setDefectsModalOpen(true);
        }}
        onOpenCocForm={() => {
          setCocModalOpen(false);
          setCocFormOpen(true);
        }}
      />

      <CompanyBrandingManager
        isOpen={brandingModalOpen}
        onClose={() => setBrandingModalOpen(false)}
      />

      {/* SANS 10139 Official Commissioner COC Form Modal */}
      <CertificateOfComplianceForm
        isOpen={cocFormOpen}
        onClose={() => setCocFormOpen(false)}
        siteId={selectedSiteId}
      />

      {/* SANS 10139 Logbook Entry Authentication QR Modal */}
      {qrModalEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#18181D] border border-[#C1A461]/40 rounded-3xl p-6 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#C1A461]/20 text-[#C1A461]">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Authentication &amp; Audit QR</h4>
                  <p className="text-[10px] font-mono text-white/50">SANS 10139 Clause 29 Verification</p>
                </div>
              </div>
              <button
                onClick={() => setQrModalEntry(null)}
                className="text-white/40 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-2xl border border-white/10 space-y-3">
              <QrCodeUtility
                value={`https://audrinfire.co.za/verify/logbook/${qrModalEntry.id}`}
                size={180}
                level="M"
              />
              <div className="text-center space-y-1">
                <div className="text-[11px] font-mono text-[#C1A461] font-bold">
                  {qrModalEntry.id}
                </div>
                <div className="text-[10px] text-white/60">
                  {qrModalEntry.eventType.toUpperCase().replace('_', ' ')} &middot; {new Date(qrModalEntry.entryTimestamp).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono bg-black/60 p-3 rounded-xl border border-white/5 space-y-1 text-white/70">
              <div className="text-white/40 text-[9px] uppercase tracking-wider">Read-Only Auth URL</div>
              <div className="break-all select-all text-[#C1A461] text-[10px]">
                https://audrinfire.co.za/verify/logbook/{qrModalEntry.id}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setQrModalEntry(null)}
                className="px-4 py-2 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <SourceRequirementDrawer
        isOpen={citationDrawerOpen}
        onClose={() => setCitationDrawerOpen(false)}
        requirementId={selectedReqId}
      />

    </div>
  );
};
