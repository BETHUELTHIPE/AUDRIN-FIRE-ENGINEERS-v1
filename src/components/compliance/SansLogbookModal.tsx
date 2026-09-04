import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Filter, 
  Download, 
  Search, 
  Trash2,
  FileCheck,
  Activity,
  Layers,
  Zap,
  Volume2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { SansLogbookEntry, LogbookEntryType, SystemCategory } from '../../types';

interface SansLogbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteId?: string;
}

export const SansLogbookModal: React.FC<SansLogbookModalProps> = ({
  isOpen,
  onClose,
  siteId
}) => {
  const store = useAudrinStore();
  const sites = store.getSites();
  const allEntries = store.getSansLogbook();
  const user = store.getUser();

  const [activeTab, setActiveTab] = useState<'register' | 'new_entry' | 'routine_schedule' | 'benchmark_rules'>('register');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>(siteId || 'all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntryDetail, setSelectedEntryDetail] = useState<SansLogbookEntry | null>(null);

  // New Entry Form State
  const [entrySiteId, setEntrySiteId] = useState<string>(siteId || sites[0]?.id || '');
  const [entryType, setEntryType] = useState<LogbookEntryType>('daily');
  const [inspectedBy, setInspectedBy] = useState<string>(user.name);
  const [inspectorIdOrSaqcc, setInspectorIdOrSaqcc] = useState<string>('SAQCC-9109170791081');
  const [notes, setNotes] = useState<string>('');
  const [systemCategory, setSystemCategory] = useState<SystemCategory>('L1');
  const [quiescentOk, setQuiescentOk] = useState(true);
  const [mcpRef, setMcpRef] = useState('');
  const [soundersAudibleOk, setSoundersAudibleOk] = useState(true);
  const [dbMeasured, setDbMeasured] = useState<number>(75);
  const [sounderCount, setSounderCount] = useState<number>(4);
  const [batteryVoltage, setBatteryVoltage] = useState<number>(27.4);
  const [batteryAutonomyVerified, setBatteryAutonomyVerified] = useState(true);
  const [mainsFailTested, setMainsFailTested] = useState(false);
  const [shortCircuitFaultTested, setShortCircuitFaultTested] = useState(false);
  const [classACircuitsVerified, setClassACircuitsVerified] = useState(true);
  const [cableIntegrityVerified, setCableIntegrityVerified] = useState(true);
  const [faultType, setFaultType] = useState<'short_circuit' | 'open_circuit' | 'mains_failure' | 'detector_removed' | 'earth_fault' | 'battery_low'>('short_circuit');
  const [deviceAddress, setDeviceAddress] = useState('');
  const [zone, setZone] = useState('');
  const [faultCleared, setFaultCleared] = useState(false);
  const [falseAlarmCategory, setFalseAlarmCategory] = useState<'environmental_dust_steam' | 'cooking' | 'contractor_work' | 'malicious_mcp' | 'equipment_drift' | 'unknown'>('environmental_dust_steam');
  const [correctiveAction, setCorrectiveAction] = useState('');

  if (!isOpen) return null;

  const filteredEntries = allEntries.filter(entry => {
    if (selectedSiteFilter !== 'all' && entry.siteId !== selectedSiteFilter) return false;
    if (selectedTypeFilter !== 'all' && entry.entryType !== selectedTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        entry.siteName.toLowerCase().includes(q) ||
        entry.notes.toLowerCase().includes(q) ||
        entry.inspectedBy.toLowerCase().includes(q) ||
        (entry.deviceAddress && entry.deviceAddress.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const siteObj = sites.find(s => s.id === entrySiteId) || sites[0];

    const newEntry: SansLogbookEntry = {
      id: `log-${Date.now()}`,
      siteId: siteObj?.id || 'site-menlyn-01',
      siteName: siteObj?.name || 'Commercial Site',
      entryType,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      inspectedBy: inspectedBy || 'Qualified Fire Inspector',
      inspectorIdOrSaqcc: inspectorIdOrSaqcc || 'SAQCC Registered',
      notes: notes || `Routine SANS 10139 ${entryType} inspection completed successfully.`,
      systemCategory,
      quiescentStateOk: quiescentOk,
      mcpTestedRef: mcpRef || undefined,
      soundersAudibleOk,
      dbMeasured: dbMeasured ? Number(dbMeasured) : undefined,
      sounderCountChecked: sounderCount ? Number(sounderCount) : undefined,
      batteryVoltage: batteryVoltage ? Number(batteryVoltage) : undefined,
      batteryAutonomyVerified,
      mainsFailTested,
      shortCircuitFaultTested,
      classACircuitsVerified,
      cableIntegrityVerified,
      faultType: entryType === 'fault' ? faultType : undefined,
      deviceAddress: deviceAddress || undefined,
      zone: zone || undefined,
      faultCleared: entryType === 'fault' ? faultCleared : undefined,
      clearedTimestamp: faultCleared ? new Date().toISOString() : undefined,
      falseAlarmCategory: entryType === 'false_alarm' ? falseAlarmCategory : undefined,
      correctiveAction: correctiveAction || undefined,
      signatureHash: `SIG-${entryType.toUpperCase().slice(0, 3)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    store.addSansLogbookEntry(newEntry);
    setNotes('');
    setDeviceAddress('');
    setZone('');
    setCorrectiveAction('');
    setActiveTab('register');
  };

  const benchmarkRules = store.getSansBenchmarkRules();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#151518] border border-white/10 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/5 bg-[#0D0D0E] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A1A1C] to-[#2A2A2E] border border-[#C1A461]/40 flex items-center justify-center text-[#C1A461] shadow-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
                  SANS 10139 Standard Log Book
                </span>
                <span className="text-[9px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  SAQCC SANS 10139 Compliant
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Fire Detection & Alarm System Digital Log Book
              </h2>
              <p className="text-xs text-white/50">
                Official statutory register for Daily, Weekly, Quarterly, Annual, and Fault inspections.
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

        {/* Navigation Tabs Bar */}
        <div className="px-6 border-b border-white/5 bg-[#111113] flex flex-wrap gap-2 pt-3">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'register'
                ? 'bg-[#151518] text-[#C1A461] border-[#C1A461]'
                : 'text-white/50 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Inspection Register ({allEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new_entry')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'new_entry'
                ? 'bg-[#151518] text-[#C1A461] border-[#C1A461]'
                : 'text-white/50 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Record New Log Entry</span>
          </button>

          <button
            onClick={() => setActiveTab('routine_schedule')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'routine_schedule'
                ? 'bg-[#151518] text-[#C1A461] border-[#C1A461]'
                : 'text-white/50 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>SANS 10139 Routine Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('benchmark_rules')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'benchmark_rules'
                ? 'bg-[#151518] text-[#C1A461] border-[#C1A461]'
                : 'text-white/50 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#C1A461]" />
            <span>SAQCC Rules of Truth ({benchmarkRules.length})</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: REGISTER */}
          {activeTab === 'register' && (
            <div className="space-y-6">
              {/* Filter Row */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#0D0D0E] p-4 rounded-2xl border border-white/5">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  {/* Site Filter */}
                  <select
                    value={selectedSiteFilter}
                    onChange={(e) => setSelectedSiteFilter(e.target.value)}
                    className="bg-[#151518] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C1A461]"
                  >
                    <option value="all">All Registered Sites ({sites.length})</option>
                    {sites.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>

                  {/* Type Filter */}
                  <select
                    value={selectedTypeFilter}
                    onChange={(e) => setSelectedTypeFilter(e.target.value)}
                    className="bg-[#151518] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C1A461]"
                  >
                    <option value="all">All Entry Types</option>
                    <option value="daily">Daily Checks</option>
                    <option value="weekly">Weekly MCP Tests</option>
                    <option value="quarterly">Quarterly Inspections</option>
                    <option value="annual">Annual Servicing</option>
                    <option value="fault">Fault & Incidents</option>
                    <option value="false_alarm">False Alarm Logs</option>
                  </select>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search logs, devices, notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#151518] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C1A461]"
                  />
                </div>
              </div>

              {/* Log Entries Grid / Table */}
              <div className="space-y-3">
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl bg-[#0D0D0E] border border-white/5 space-y-3">
                    <BookOpen className="w-10 h-10 text-white/20 mx-auto" />
                    <p className="text-sm text-white/60">No log book entries match the selected filters.</p>
                    <button
                      onClick={() => setActiveTab('new_entry')}
                      className="px-4 py-2 bg-[#C1A461] text-black text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Record First Entry</span>
                    </button>
                  </div>
                ) : (
                  filteredEntries.map((entry) => {
                    const typeBadgeColors = {
                      daily: 'bg-blue-950/60 text-blue-300 border-blue-500/30',
                      weekly: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
                      quarterly: 'bg-purple-950/60 text-purple-300 border-purple-500/30',
                      annual: 'bg-amber-950/60 text-[#C1A461] border-[#C1A461]/40',
                      fault: 'bg-red-950/60 text-red-300 border-red-500/40',
                      false_alarm: 'bg-orange-950/60 text-orange-300 border-orange-500/40',
                      remedial: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                    };

                    return (
                      <div
                        key={entry.id}
                        className="p-5 rounded-2xl bg-[#0D0D0E] border border-white/5 hover:border-[#C1A461]/30 transition space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${typeBadgeColors[entry.entryType]}`}>
                              {entry.entryType.replace('_', ' ')}
                            </span>
                            <span className="text-sm font-bold text-white">{entry.siteName}</span>
                            {entry.systemCategory && (
                              <span className="text-[10px] bg-white/5 text-[#C1A461] px-2 py-0.5 rounded-md font-mono font-bold">
                                Cat {entry.systemCategory}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-white/50 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {entry.date} at {entry.time}
                            </span>
                            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/60">
                              {entry.signatureHash}
                            </span>
                          </div>
                        </div>

                        {/* Notes and Metrics */}
                        <p className="text-xs text-white/80 leading-relaxed bg-[#151518] p-3 rounded-xl border border-white/5">
                          {entry.notes}
                        </p>

                        {/* Specific SANS 10139 Metrics Highlights */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
                          {entry.quiescentStateOk !== undefined && (
                            <div className="flex items-center gap-1.5 text-white/60">
                              <CheckCircle2 className={`w-3.5 h-3.5 ${entry.quiescentStateOk ? 'text-emerald-400' : 'text-red-400'}`} />
                              <span>Quiescent: {entry.quiescentStateOk ? 'Normal' : 'Fault Active'}</span>
                            </div>
                          )}

                          {entry.mcpTestedRef && (
                            <div className="flex items-center gap-1.5 text-white/60">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                              <span>MCP: {entry.mcpTestedRef}</span>
                            </div>
                          )}

                          {entry.dbMeasured && (
                            <div className="flex items-center gap-1.5 text-white/60">
                              <Volume2 className="w-3.5 h-3.5 text-[#C1A461]" />
                              <span>Audibility: {entry.dbMeasured} dB(A) (Min 65)</span>
                            </div>
                          )}

                          {entry.batteryVoltage && (
                            <div className="flex items-center gap-1.5 text-white/60">
                              <Zap className="w-3.5 h-3.5 text-amber-400" />
                              <span>Battery: {entry.batteryVoltage} V (24h+30m)</span>
                            </div>
                          )}
                        </div>

                        {/* Inspector Signature and Delete */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-white/40">
                          <span>Inspector: <strong className="text-white/70">{entry.inspectedBy}</strong> ({entry.inspectorIdOrSaqcc || 'SAQCC'})</span>
                          <button
                            onClick={() => store.deleteSansLogbookEntry(entry.id)}
                            className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[10px] transition"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove Record</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: RECORD NEW ENTRY */}
          {activeTab === 'new_entry' && (
            <form onSubmit={handleCreateEntry} className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-[#0D0D0E] p-6 rounded-2xl border border-white/5 space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#C1A461]" />
                    <span>Record SANS 10139 Official Log Entry</span>
                  </h3>
                  <p className="text-xs text-white/50">
                    All inputs adhere strictly to SANS 10139 standard recommendations and SAQCC Commissioner criteria.
                  </p>
                </div>

                {/* Row 1: Site & Inspection Type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider">
                      Protected Site
                    </label>
                    <select
                      value={entrySiteId}
                      onChange={(e) => setEntrySiteId(e.target.value)}
                      className="w-full bg-[#151518] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C1A461]"
                    >
                      {sites.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider">
                      Inspection / Event Type
                    </label>
                    <select
                      value={entryType}
                      onChange={(e) => setEntryType(e.target.value as LogbookEntryType)}
                      className="w-full bg-[#151518] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C1A461]"
                    >
                      <option value="daily">Daily Inspection (Quiescent / LED Check)</option>
                      <option value="weekly">Weekly Test (Rotational MCP & Sounders)</option>
                      <option value="quarterly">Quarterly Periodic Service (25% Detectors)</option>
                      <option value="annual">Annual Inspection & Verification (100% Devices)</option>
                      <option value="fault">Fault / Circuit Disablement Incident</option>
                      <option value="false_alarm">False Alarm Investigation</option>
                      <option value="remedial">Remedial Action / Modification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider">
                      SANS 10139 Category
                    </label>
                    <select
                      value={systemCategory}
                      onChange={(e) => setSystemCategory(e.target.value as SystemCategory)}
                      className="w-full bg-[#151518] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C1A461]"
                    >
                      <option value="L1">Category L1 (Total Life Protection - All Areas)</option>
                      <option value="L2">Category L2 (Escape Routes + High Risk / Sleeping)</option>
                      <option value="L3">Category L3 (Escape Routes & Adjoining Rooms)</option>
                      <option value="L4">Category L4 (Escape Routes Only)</option>
                      <option value="L5">Category L5 (Localized Life Safety Engineering)</option>
                      <option value="M">Category M (Manual Only - No Sleeping Risk)</option>
                      <option value="P1">Category P1 (Total Property & Asset Protection)</option>
                      <option value="P2">Category P2 (Defined High-Risk Property Areas)</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Dynamic Inspection Fields based on Type */}
                {entryType === 'daily' && (
                  <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-[#C1A461] uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      <span>Daily Check Parameters (SANS 10139 Clause 11)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0D0E] border border-white/5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={quiescentOk}
                          onChange={(e) => setQuiescentOk(e.target.checked)}
                          className="w-4 h-4 rounded text-[#C1A461] focus:ring-0"
                        />
                        <span>Panel in normal quiescent mode (Green Power LED ON, zero fault/disablement LEDs)</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0D0E] border border-white/5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={soundersAudibleOk}
                          onChange={(e) => setSoundersAudibleOk(e.target.checked)}
                          className="w-4 h-4 rounded text-[#C1A461] focus:ring-0"
                        />
                        <span>No audible internal buzzer or remote fault transmitter active</span>
                      </label>
                    </div>
                  </div>
                )}

                {entryType === 'weekly' && (
                  <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-4">
                    <h4 className="text-xs font-bold text-[#C1A461] uppercase tracking-wider flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      <span>Weekly Rotational Test (SANS 10139 Questions 1r, 1s, 21, 22)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-white/70 mb-1">
                          MCP Tested Identifier (Green Dot at 1.4m height)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. MCP-01 (Ground Floor East)"
                          value={mcpRef}
                          onChange={(e) => setMcpRef(e.target.value)}
                          className="w-full bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C1A461]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-white/70 mb-1">
                          Audibility at Bedhead / Escape (Min 65 dB(A))
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="75.5"
                          value={dbMeasured}
                          onChange={(e) => setDbMeasured(Number(e.target.value))}
                          className="w-full bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C1A461]"
                        />
                        <span className="text-[10px] text-white/40">SANS 10139: ≥ 65 dB(A) bedhead, ≤ 130 dB(A) max</span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-white/70 mb-1">
                          Active Sounders Count (Min 2 Sounders)
                        </label>
                        <input
                          type="number"
                          value={sounderCount}
                          onChange={(e) => setSounderCount(Number(e.target.value))}
                          className="w-full bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C1A461]"
                        />
                        <span className="text-[10px] text-white/40">SANS 10139 Clause 1s: ≥ 2 sounders minimum</span>
                      </div>
                    </div>
                  </div>
                )}

                {(entryType === 'quarterly' || entryType === 'annual') && (
                  <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-4">
                    <h4 className="text-xs font-bold text-[#C1A461] uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span>{entryType === 'quarterly' ? 'Quarterly 25% Audit' : 'Annual 100% Comprehensive Audit'} (POE Rules 1g, 1h, 15, 20)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0D0E] border border-white/5 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={batteryAutonomyVerified}
                          onChange={(e) => setBatteryAutonomyVerified(e.target.checked)}
                          className="w-4 h-4 rounded text-[#C1A461]"
                        />
                        <span>Standby Battery Autonomy Verified: 24h standby + 30 min full evacuation alarm</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0D0E] border border-white/5 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={classACircuitsVerified}
                          onChange={(e) => setClassACircuitsVerified(e.target.checked)}
                          className="w-4 h-4 rounded text-[#C1A461]"
                        />
                        <span>Class A physical conductor circuits verified (Fault disables ≤ 1,000 m²)</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0D0E] border border-white/5 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={mainsFailTested}
                          onChange={(e) => setMainsFailTested(e.target.checked)}
                          className="w-4 h-4 rounded text-[#C1A461]"
                        />
                        <span>Mains Fail electrical disconnection registers at panel within ≤ 30 minutes</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0D0E] border border-white/5 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={cableIntegrityVerified}
                          onChange={(e) => setCableIntegrityVerified(e.target.checked)}
                          className="w-4 h-4 rounded text-[#C1A461]"
                        />
                        <span>PH 30 Enhanced Fire Resistant RED cables (≥1.0mm², segregated conduit)</span>
                      </label>
                    </div>
                  </div>
                )}

                {entryType === 'fault' && (
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 space-y-4">
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Fault & Disablement Incident Parameters (SANS 10139 1g ≤ 200s, 1h ≤ 30m)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-white/70 mb-1">Fault Type</label>
                        <select
                          value={faultType}
                          onChange={(e) => setFaultType(e.target.value as any)}
                          className="w-full bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="short_circuit">Short Circuit (Detected ≤ 200s)</option>
                          <option value="open_circuit">Open Circuit (Detected ≤ 200s)</option>
                          <option value="mains_failure">Mains Supply Failure (Detected ≤ 30m)</option>
                          <option value="detector_removed">Detector Removed from Base</option>
                          <option value="earth_fault">Earth Leakage Fault</option>
                          <option value="battery_low">Standby Battery Low Voltage</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-white/70 mb-1">Device Address</label>
                        <input
                          type="text"
                          placeholder="e.g. Loop 2 / Addr 045"
                          value={deviceAddress}
                          onChange={(e) => setDeviceAddress(e.target.value)}
                          className="w-full bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-white/70 mb-1">Zone Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Zone 3 - 2nd Floor West"
                          value={zone}
                          onChange={(e) => setZone(e.target.value)}
                          className="w-full bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/70 mb-1">Corrective Action Taken</label>
                      <input
                        type="text"
                        placeholder="e.g. Reseated detector head in base, verified Class A return path nominal."
                        value={correctiveAction}
                        onChange={(e) => setCorrectiveAction(e.target.value)}
                        className="w-full bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0D0E] border border-white/5 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={faultCleared}
                        onChange={(e) => setFaultCleared(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-400"
                      />
                      <span>Fault has been fully cleared and verified at main control panel</span>
                    </label>
                  </div>
                )}

                {/* General Notes & Observations */}
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider">
                    Log Entry Details & Engineering Observations
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide specific notes regarding detector cleanliness, audibility levels, MCP rotation, or remedial work..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#151518] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                {/* Inspector Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-1">
                      Inspector Name
                    </label>
                    <input
                      type="text"
                      value={inspectedBy}
                      onChange={(e) => setInspectedBy(e.target.value)}
                      className="w-full bg-[#151518] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-1">
                      SAQCC Registration / Competence ID Number
                    </label>
                    <input
                      type="text"
                      placeholder="SAQCC-9109170791081"
                      value={inspectorIdOrSaqcc}
                      onChange={(e) => setInspectorIdOrSaqcc(e.target.value)}
                      className="w-full bg-[#151518] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold uppercase tracking-wider rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-[1.5px] rounded-xl shadow-lg shadow-black/40 transition flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Commit Log Entry</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 3: ROUTINE SCHEDULE */}
          {activeTab === 'routine_schedule' && (
            <div className="space-y-6">
              <div className="bg-[#0D0D0E] p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#C1A461]" />
                  <h3 className="text-base font-bold text-white">
                    SANS 10139 Mandatory Inspection & Testing Schedule
                  </h3>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  As prescribed under SANS 10139 and SAQCC Fire Commissioner standards, every commercial fire alarm installation must adhere strictly to periodic testing routines to maintain statutory compliance.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Daily */}
                  <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C1A461] uppercase tracking-wider font-mono">1. Daily Inspection</span>
                      <span className="text-[10px] bg-blue-950/60 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Facility Manager</span>
                    </div>
                    <ul className="text-xs text-white/70 space-y-1.5 list-disc list-inside">
                      <li>Check panel displays normal quiescent condition with no fault or disablement LEDs.</li>
                      <li>Verify mains power indicator is healthy (Fault registers ≤ 30 min upon failure).</li>
                      <li>Ensure any recorded faults were communicated to the service provider.</li>
                    </ul>
                  </div>

                  {/* Weekly */}
                  <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C1A461] uppercase tracking-wider font-mono">2. Weekly Inspection</span>
                      <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">Rotational Test</span>
                    </div>
                    <ul className="text-xs text-white/70 space-y-1.5 list-disc list-inside">
                      <li>Actuate at least one Manual Call Point (Green Dot at 1.4m height) during working hours.</li>
                      <li>Rotate tested MCP weekly so all devices are triggered systematically.</li>
                      <li>Confirm ≥ 2 fire alarm sounders activate (≥ 65 dB(A) bedhead, ≤ 130 dB(A) max).</li>
                    </ul>
                  </div>

                  {/* Quarterly */}
                  <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C1A461] uppercase tracking-wider font-mono">3. Quarterly Periodic Inspection</span>
                      <span className="text-[10px] bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">SAQCC Competent Engineer</span>
                    </div>
                    <ul className="text-xs text-white/70 space-y-1.5 list-disc list-inside">
                      <li>Test at least 25% of all point smoke (7.5m) and heat (5.3m) detectors.</li>
                      <li>Inspect control panel internal batteries, charging voltages, and standby capacity.</li>
                      <li>Examine structural changes, partitions, or storage height alterations impacting coverage.</li>
                    </ul>
                  </div>

                  {/* Annual */}
                  <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C1A461] uppercase tracking-wider font-mono">4. Annual Comprehensive Servicing</span>
                      <span className="text-[10px] bg-amber-950/60 text-[#C1A461] px-2 py-0.5 rounded border border-[#C1A461]/40">Full COC Audit</span>
                    </div>
                    <ul className="text-xs text-white/70 space-y-1.5 list-disc list-inside">
                      <li>100% point-to-point device testing across all loops and zones.</li>
                      <li>Verify 24-hour battery standby autonomy + 30-minute full evacuation alarm load.</li>
                      <li>Verify cable segregation (PH 30 RED cables, ≥1.0mm², segregated conduits).</li>
                      <li>Issue updated SANS 10139 Certificate of Compliance.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BENCHMARK RULES OF TRUTH */}
          {activeTab === 'benchmark_rules' && (
            <div className="space-y-6">
              <div className="bg-[#0D0D0E] p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#C1A461]" />
                      <span>SANS 10139 / SAQCC Commissioner Ground Truth Matrix</span>
                    </h3>
                    <p className="text-xs text-white/50">
                      Standard metrics, dimensions, and tolerances strictly derived from the Summative POE Module SANS 10139.
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-[#151518] text-[#C1A461] px-3 py-1 rounded-xl border border-white/10 font-bold">
                    {benchmarkRules.length} Verified Parameters
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {benchmarkRules.map((rule) => (
                    <div
                      key={rule.ruleNumber}
                      className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-2 hover:border-[#C1A461]/30 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#C1A461] bg-[#0D0D0E] px-2 py-0.5 rounded border border-[#C1A461]/30">
                          {rule.ruleNumber} (POE {rule.sourceQuestionId})
                        </span>
                        <span className="text-[10px] uppercase font-bold text-white/40">
                          {rule.category.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{rule.title}</h4>
                      <p className="text-[11px] text-white/60 leading-relaxed">{rule.requirementStatement}</p>
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#C1A461]">
                        <span>Standard Value:</span>
                        <strong>{rule.exactStandardValue}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-white/5 bg-[#0D0D0E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>SANS 10139 Digital Compliance Module &middot; Audrin Fire Engineers (Pty) Ltd</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] transition"
          >
            Close Log Book
          </button>
        </div>

      </div>
    </div>
  );
};
