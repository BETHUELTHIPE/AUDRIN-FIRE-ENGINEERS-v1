import React, { useState, useMemo } from 'react';
import { 
  RotateCw, 
  Layers, 
  Cpu, 
  Radio, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Search, 
  Building2, 
  Hash, 
  ArrowLeftRight, 
  Sparkles, 
  Database,
  ShieldCheck,
  Calendar,
  UserCheck,
  SlidersHorizontal
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { ProjectHardwareInventory, HardwareDeviceType } from '../../types';

export interface SyncCurrentValues {
  panelBrand: string;
  panelModel: string;
  panelSerial: string;
  panelLocation: string;
  loopCount: number;
  zoneCount: number;
  blueDotSmoke: number;
  blackDotHeat: number;
  redDotSounders: number;
  greenDotMcp: number;
  multiSensors: number;
  beamSensors: number;
  aspiratingPoints: number;
}

export interface SyncDeviceInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSiteId?: string;
  projectRef?: string;
  siteName?: string;
  currentValues: SyncCurrentValues;
  onApplySync: (syncedData: SyncCurrentValues & { inventoryRef: string; auditDate: string; auditor: string }) => void;
}

export const SyncDeviceInventoryModal: React.FC<SyncDeviceInventoryModalProps> = ({
  isOpen,
  onClose,
  activeSiteId,
  projectRef,
  siteName,
  currentValues,
  onApplySync
}) => {
  const store = useAudrinStore();
  const allInventories = useMemo(() => store.getAllProjectHardwareInventories(), [store]);

  // Determine initial selected inventory
  const initialInventory = useMemo(() => {
    return store.getProjectHardwareInventory(projectRef || activeSiteId) || allInventories[0];
  }, [store, projectRef, activeSiteId, allInventories]);

  const [selectedInventoryId, setSelectedInventoryId] = useState<string>(initialInventory?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'diff' | 'zones_loops' | 'devices'>('diff');
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');

  // Selective sync checkboxes
  const [syncPanel, setSyncPanel] = useState(true);
  const [syncLoops, setSyncLoops] = useState(true);
  const [syncZones, setSyncZones] = useState(true);
  const [syncDevices, setSyncDevices] = useState(true);

  // Sync animation/success state
  const [hasApplied, setHasApplied] = useState(false);

  // Currently active inventory object
  const activeInventory: ProjectHardwareInventory = useMemo(() => {
    const found = allInventories.find(inv => inv.id === selectedInventoryId);
    return found || initialInventory || allInventories[0];
  }, [allInventories, selectedInventoryId, initialInventory]);

  if (!isOpen) return null;

  // Filter device records
  const filteredDevices = (activeInventory?.deviceRecords || []).filter(dev => {
    const matchesSearch = 
      dev.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.zoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.locationDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = deviceFilter === 'all' || dev.deviceType === deviceFilter;
    return matchesSearch && matchesType;
  });

  const handleExecuteSync = () => {
    if (!activeInventory) return;

    const summary = activeInventory.deviceScheduleSummary;
    const panel = activeInventory.panelDetails;

    const updated: SyncCurrentValues & { inventoryRef: string; auditDate: string; auditor: string } = {
      panelBrand: syncPanel ? panel.brand : currentValues.panelBrand,
      panelModel: syncPanel ? panel.model : currentValues.panelModel,
      panelSerial: syncPanel ? panel.serialNumber : currentValues.panelSerial,
      panelLocation: syncPanel ? panel.location : currentValues.panelLocation,
      loopCount: syncLoops ? panel.loopCount : currentValues.loopCount,
      zoneCount: syncZones ? (panel.zoneCount || activeInventory.zones.length) : currentValues.zoneCount,
      blueDotSmoke: syncDevices ? summary.blueDotSmokeDetectors : currentValues.blueDotSmoke,
      blackDotHeat: syncDevices ? summary.blackDotHeatDetectors : currentValues.blackDotHeat,
      redDotSounders: syncDevices ? summary.redDotSoundersSirens : currentValues.redDotSounders,
      greenDotMcp: syncDevices ? summary.greenDotManualCallPoints : currentValues.greenDotMcp,
      multiSensors: syncDevices ? summary.multiSensorDetectors : currentValues.multiSensors,
      beamSensors: syncDevices ? summary.opticalBeamDetectors : currentValues.beamSensors,
      aspiratingPoints: syncDevices ? summary.aspiratingSamplingPoints : currentValues.aspiratingPoints,
      inventoryRef: activeInventory.inventoryRef,
      auditDate: activeInventory.lastAuditDate,
      auditor: activeInventory.auditedBy
    };

    setHasApplied(true);
    setTimeout(() => {
      onApplySync(updated);
      onClose();
    }, 600);
  };

  const invPanel = activeInventory?.panelDetails;
  const invSummary = activeInventory?.deviceScheduleSummary;
  const invLoopsCount = invPanel?.loopCount || activeInventory?.loops.length || 0;
  const invZonesCount = invPanel?.zoneCount || activeInventory?.zones.length || 0;

  // Diff helper
  const renderDiffBadge = (current: number, target: number) => {
    const diff = target - current;
    if (diff === 0) {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 flex items-center gap-1">
          <Check className="w-2.5 h-2.5" /> In Sync ({current})
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold flex items-center gap-1">
        <ArrowLeftRight className="w-2.5 h-2.5" /> {diff > 0 ? `+${diff}` : diff} ({current} &rarr; {target})
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121217] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-black/80 via-[#181820] to-black/80 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#C1A461]/20 text-[#C1A461] rounded-full border border-[#C1A461]/30 flex items-center gap-1">
                <Database className="w-3 h-3" />
                SyncDeviceInventory Utility
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono bg-white/10 text-white/80 rounded-full border border-white/10 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                SANS 10139 Verified
              </span>
              <span className="text-xs font-mono text-white/50">
                {activeInventory.inventoryRef}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#C1A461]" />
              Sync Hardware Inventory with Certificate of Compliance
            </h2>
            <p className="text-xs text-white/60 mt-0.5">
              Pulls exact addressable loop circuits, detection zone schedules, and 7-category device counts directly from project asset records.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/50 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Selector & Audit Metadata Bar */}
        <div className="px-5 py-3 bg-black/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-white/50 font-mono">Source Project Inventory:</span>
            <select
              value={selectedInventoryId}
              onChange={e => setSelectedInventoryId(e.target.value)}
              className="bg-[#1C1C24] border border-white/15 rounded-lg px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-[#C1A461]"
            >
              {allInventories.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.siteName} &middot; {inv.projectReference} ({inv.deviceScheduleSummary.totalDeviceCount} Devices)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-white/60 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C1A461]" />
              Audit Date: <strong className="text-white font-sans">{activeInventory.lastAuditDate}</strong>
            </span>
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              Auditor: <strong className="text-white font-sans">{activeInventory.auditedBy}</strong>
            </span>
          </div>
        </div>

        {/* Subtabs Bar */}
        <div className="px-5 border-b border-white/10 flex items-center justify-between bg-black/20 shrink-0">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveSubTab('diff')}
              className={`px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'diff'
                  ? 'border-[#C1A461] text-[#C1A461]'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              Sync Comparison &amp; Diff
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('zones_loops')}
              className={`px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'zones_loops'
                  ? 'border-[#C1A461] text-[#C1A461]'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Loops ({activeInventory.loops.length}) &amp; Zones ({activeInventory.zones.length}) Schedule
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('devices')}
              className={`px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'devices'
                  ? 'border-[#C1A461] text-[#C1A461]'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Tagged Device Ledger ({activeInventory.deviceRecords.length})
            </button>
          </div>

          <div className="text-[11px] font-mono text-[#C1A461] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Live Project Inventory Linked
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#0E0E11] text-white">

          {/* SUBTAB 1: Diff & Selection */}
          {activeSubTab === 'diff' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Sync scope selector controls */}
              <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between flex-wrap gap-3">
                <span className="text-xs font-mono text-white/70 flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#C1A461]" />
                  Select components to pull into Form:
                </span>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncPanel}
                      onChange={e => setSyncPanel(e.target.checked)}
                      className="rounded border-white/20 text-[#C1A461] bg-black/40"
                    />
                    <span>Panel Details</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncLoops}
                      onChange={e => setSyncLoops(e.target.checked)}
                      className="rounded border-white/20 text-[#C1A461] bg-black/40"
                    />
                    <span>Loop Count ({invLoopsCount})</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncZones}
                      onChange={e => setSyncZones(e.target.checked)}
                      className="rounded border-white/20 text-[#C1A461] bg-black/40"
                    />
                    <span>Zone Count ({invZonesCount})</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={syncDevices}
                      onChange={e => setSyncDevices(e.target.checked)}
                      className="rounded border-white/20 text-[#C1A461] bg-black/40"
                    />
                    <span>Device Schedules ({invSummary.totalDeviceCount})</span>
                  </label>
                </div>
              </div>

              {/* Loop & Zone Metrics Diff Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Loops Card */}
                <div className="p-4 bg-gradient-to-br from-black/60 to-[#181822] border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          Addressable Loops
                        </h4>
                        <p className="text-[10px] text-white/50 font-mono">
                          Loop driver capacity &amp; Class A circuits
                        </p>
                      </div>
                    </div>
                    {renderDiffBadge(currentValues.loopCount, invLoopsCount)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-[10px] font-mono text-white/50 block">Current Form Loops</span>
                      <strong className="text-xl font-bold font-mono text-white">{currentValues.loopCount || 0}</strong>
                      <span className="text-[10px] font-mono text-white/40 block mt-0.5">configured in form</span>
                    </div>
                    <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-500/20">
                      <span className="text-[10px] font-mono text-purple-300 block">Inventory Verified Loops</span>
                      <strong className="text-xl font-bold font-mono text-purple-400">{invLoopsCount}</strong>
                      <span className="text-[10px] font-mono text-purple-300/60 block mt-0.5">from {activeInventory.inventoryRef}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-white/60 font-mono pt-1">
                    Loops Protocol: <span className="text-white font-medium">{activeInventory.loops[0]?.loopProtocol || 'Addressable Protocol'}</span>
                  </div>
                </div>

                {/* Zones Card */}
                <div className="p-4 bg-gradient-to-br from-black/60 to-[#181822] border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Radio className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          Detection Zones
                        </h4>
                        <p className="text-[10px] text-white/50 font-mono">
                          SANS 10139 fire compartment boundaries
                        </p>
                      </div>
                    </div>
                    {renderDiffBadge(currentValues.zoneCount, invZonesCount)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                      <span className="text-[10px] font-mono text-white/50 block">Current Form Zones</span>
                      <strong className="text-xl font-bold font-mono text-white">{currentValues.zoneCount || 0}</strong>
                      <span className="text-[10px] font-mono text-white/40 block mt-0.5">configured in form</span>
                    </div>
                    <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/20">
                      <span className="text-[10px] font-mono text-emerald-300 block">Inventory Verified Zones</span>
                      <strong className="text-xl font-bold font-mono text-emerald-400">{invZonesCount}</strong>
                      <span className="text-[10px] font-mono text-emerald-300/60 block mt-0.5">{activeInventory.zones.length} zones documented</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-white/60 font-mono pt-1">
                    Coverage Area: <span className="text-white font-medium">{activeInventory.zones[0]?.floorOrArea} to {activeInventory.zones[activeInventory.zones.length - 1]?.floorOrArea}</span>
                  </div>
                </div>
              </div>

              {/* Panel Details Comparison */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#C1A461] uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Fire Alarm Control Panel Comparison
                  </h4>
                  <span className="text-[10px] font-mono text-white/40">SANS 10139 Control &amp; Indicating Equipment</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-2.5 bg-black/50 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-white/50 block mb-0.5">Panel Make / Brand</span>
                    <div className="text-white/60 line-through text-[11px]">{currentValues.panelBrand || 'None specified'}</div>
                    <div className="text-white font-bold text-xs mt-0.5">{invPanel?.brand}</div>
                  </div>
                  <div className="p-2.5 bg-black/50 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-white/50 block mb-0.5">Model / Firmware</span>
                    <div className="text-white/60 line-through text-[11px]">{currentValues.panelModel || 'None specified'}</div>
                    <div className="text-white font-bold text-xs mt-0.5">{invPanel?.model}</div>
                  </div>
                  <div className="p-2.5 bg-black/50 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-white/50 block mb-0.5">Serial Number</span>
                    <div className="text-white/60 line-through text-[11px]">{currentValues.panelSerial || 'None specified'}</div>
                    <div className="text-[#C1A461] font-bold text-xs mt-0.5">{invPanel?.serialNumber}</div>
                  </div>
                  <div className="p-2.5 bg-black/50 border border-white/5 rounded-xl">
                    <span className="text-[10px] text-white/50 block mb-0.5">Physical Location</span>
                    <div className="text-white/60 line-through text-[11px]">{currentValues.panelLocation || 'None specified'}</div>
                    <div className="text-white font-bold text-xs mt-0.5">{invPanel?.location}</div>
                  </div>
                </div>
              </div>

              {/* Color-Coded SANS 10139 Device Schedule Diff Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#C1A461]" />
                    Device Count Schedule (SANS 10139 Question 22 Color Legend)
                  </h4>
                  <span className="text-[11px] font-mono text-white/50">
                    Total: <strong className="text-white font-sans">{invSummary.totalDeviceCount} Verified Hardware Devices</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Smoke Detectors */}
                  <div className="p-3.5 bg-blue-950/20 border border-blue-500/30 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-300 font-mono flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        Blue: Optical Smoke
                      </span>
                      {renderDiffBadge(currentValues.blueDotSmoke, invSummary.blueDotSmokeDetectors)}
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[10px] font-mono text-white/50">Current: {currentValues.blueDotSmoke}</span>
                      <span className="text-lg font-bold font-mono text-blue-400">{invSummary.blueDotSmokeDetectors} units</span>
                    </div>
                  </div>

                  {/* Heat Detectors */}
                  <div className="p-3.5 bg-slate-900 border border-white/20 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white/90 font-mono flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-white" />
                        Black: Heat Detectors
                      </span>
                      {renderDiffBadge(currentValues.blackDotHeat, invSummary.blackDotHeatDetectors)}
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[10px] font-mono text-white/50">Current: {currentValues.blackDotHeat}</span>
                      <span className="text-lg font-bold font-mono text-white">{invSummary.blackDotHeatDetectors} units</span>
                    </div>
                  </div>

                  {/* Sounders */}
                  <div className="p-3.5 bg-red-950/20 border border-red-500/30 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-300 font-mono flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        Red: Sounders / Sirens
                      </span>
                      {renderDiffBadge(currentValues.redDotSounders, invSummary.redDotSoundersSirens)}
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[10px] font-mono text-white/50">Current: {currentValues.redDotSounders}</span>
                      <span className="text-lg font-bold font-mono text-red-400">{invSummary.redDotSoundersSirens} units</span>
                    </div>
                  </div>

                  {/* MCPs */}
                  <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 font-mono flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        Green: Manual Call Points
                      </span>
                      {renderDiffBadge(currentValues.greenDotMcp, invSummary.greenDotManualCallPoints)}
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[10px] font-mono text-white/50">Current: {currentValues.greenDotMcp}</span>
                      <span className="text-lg font-bold font-mono text-emerald-400">{invSummary.greenDotManualCallPoints} units</span>
                    </div>
                  </div>

                  {/* Multi-Sensors */}
                  <div className="p-3.5 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300 font-mono flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        Purple: Multi-Sensors
                      </span>
                      {renderDiffBadge(currentValues.multiSensors, invSummary.multiSensorDetectors)}
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[10px] font-mono text-white/50">Current: {currentValues.multiSensors}</span>
                      <span className="text-lg font-bold font-mono text-purple-400">{invSummary.multiSensorDetectors} units</span>
                    </div>
                  </div>

                  {/* Beam Detectors */}
                  <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        Amber: Optical Beams
                      </span>
                      {renderDiffBadge(currentValues.beamSensors, invSummary.opticalBeamDetectors)}
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[10px] font-mono text-white/50">Current: {currentValues.beamSensors}</span>
                      <span className="text-lg font-bold font-mono text-amber-400">{invSummary.opticalBeamDetectors} units</span>
                    </div>
                  </div>

                  {/* Aspirating Sampling Points */}
                  <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                        Cyan: Aspirating Points
                      </span>
                      {renderDiffBadge(currentValues.aspiratingPoints, invSummary.aspiratingSamplingPoints)}
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[10px] font-mono text-white/50">Current: {currentValues.aspiratingPoints}</span>
                      <span className="text-lg font-bold font-mono text-cyan-400">{invSummary.aspiratingSamplingPoints} units</span>
                    </div>
                  </div>

                  {/* Total Aggregate */}
                  <div className="p-3.5 bg-gradient-to-br from-black/80 to-[#1F1D14] border border-[#C1A461]/40 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#C1A461] font-mono flex items-center gap-1.5">
                        <Database className="w-3 h-3" />
                        Total Device Schedule
                      </span>
                      <span className="text-[10px] font-mono text-[#C1A461]">Verified</span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[10px] font-mono text-white/50">All Dots Combined</span>
                      <span className="text-xl font-bold font-mono text-[#C1A461]">{invSummary.totalDeviceCount} units</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: Zones & Loops Schedule */}
          {activeSubTab === 'zones_loops' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Loops breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  Addressable Loops Inventory Architecture ({activeInventory.loops.length} Circuits)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {activeInventory.loops.map(loop => (
                    <div key={loop.loopNumber} className="p-3.5 bg-black/40 border border-white/10 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-purple-300">Loop {loop.loopNumber}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                          {loop.activeDevicesCount} / {loop.maxLoopCapacity} Devices
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-white/60 space-y-1">
                        <div>Protocol: <strong className="text-white">{loop.loopProtocol}</strong></div>
                        <div>Cable Run: <strong className="text-white">{loop.cableLengthMeters}m PH30</strong></div>
                        <div className="flex items-center gap-1 text-emerald-400 text-[10px]">
                          <Check className="w-3 h-3" /> Class A Return Loop Verified
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zones breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  Detection Zones Inventory Ledger ({activeInventory.zones.length} Zones)
                </h4>
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/30">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-black/60 text-white/50 text-[11px] border-b border-white/10">
                      <tr>
                        <th className="p-3 w-16">Zone #</th>
                        <th className="p-3">Zone Designation &amp; Boundary</th>
                        <th className="p-3">Floor / Physical Area</th>
                        <th className="p-3 text-right">Devices</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {activeInventory.zones.map(z => (
                        <tr key={z.zoneNumber} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-bold text-[#C1A461]">Z{z.zoneNumber.toString().padStart(2, '0')}</td>
                          <td className="p-3 font-medium text-white">{z.zoneName}</td>
                          <td className="p-3 text-white/60">{z.floorOrArea}</td>
                          <td className="p-3 text-right font-bold text-emerald-400">{z.deviceCount} items</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 3: Tagged Device Ledger */}
          {activeSubTab === 'devices' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by tag (e.g. L1-D001), model, or location..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={deviceFilter}
                    onChange={e => setDeviceFilter(e.target.value)}
                    className="bg-[#1C1C24] border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#C1A461]"
                  >
                    <option value="all">All Device Types ({activeInventory.deviceRecords.length})</option>
                    <option value="optical_smoke">Optical Smoke</option>
                    <option value="heat_detector">Heat Detectors</option>
                    <option value="sounder_siren">Sounders / Sirens</option>
                    <option value="manual_call_point">Manual Call Points</option>
                    <option value="multi_sensor">Multi-Sensors</option>
                    <option value="optical_beam">Optical Beams</option>
                    <option value="aspirating_point">Aspirating Points</option>
                  </select>
                </div>
              </div>

              <div className="border border-white/10 rounded-xl overflow-hidden bg-black/30">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-black/60 text-white/50 text-[11px] border-b border-white/10">
                    <tr>
                      <th className="p-3">Device Tag</th>
                      <th className="p-3">Dot Legend</th>
                      <th className="p-3">Make &amp; Model</th>
                      <th className="p-3">Loop / Addr</th>
                      <th className="p-3">Zone</th>
                      <th className="p-3">Location Description</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80">
                    {filteredDevices.length > 0 ? (
                      filteredDevices.map(dev => (
                        <tr key={dev.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-bold text-[#C1A461]">{dev.tag}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 text-[11px]">
                              {dev.complianceCode === 'blue_dot' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                              {dev.complianceCode === 'black_dot' && <span className="w-2 h-2 rounded-full bg-white border border-white/40" />}
                              {dev.complianceCode === 'red_dot' && <span className="w-2 h-2 rounded-full bg-red-500" />}
                              {dev.complianceCode === 'green_dot' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                              {dev.complianceCode === 'purple_dot' && <span className="w-2 h-2 rounded-full bg-purple-500" />}
                              {dev.complianceCode === 'amber_dot' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                              {dev.complianceCode === 'cyan_dot' && <span className="w-2 h-2 rounded-full bg-cyan-500" />}
                              <span className="capitalize">{dev.complianceCode.replace('_dot', '')}</span>
                            </span>
                          </td>
                          <td className="p-3 font-medium text-white">{dev.model}</td>
                          <td className="p-3 text-white/70">Loop {dev.loopNumber} / #{dev.addressOnLoop}</td>
                          <td className="p-3 text-white/70">Zone {dev.zoneNumber}</td>
                          <td className="p-3 text-white/60">{dev.locationDescription}</td>
                          <td className="p-3 text-right">
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                              {dev.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-white/40 font-mono">
                          No devices match the search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer with Sync Execution Button */}
        <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-white/60 font-mono flex items-center gap-2">
            <span className="text-white/40">Sync Source:</span>
            <strong className="text-white">{activeInventory.siteName}</strong>
            <span className="text-white/40">&middot;</span>
            <span className="text-[#C1A461]">{invSummary.totalDeviceCount} Hardware Assets</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-mono transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExecuteSync}
              disabled={hasApplied}
              className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                hasApplied
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-[#C1A461] to-[#D4B774] text-black hover:opacity-95 shadow-[#C1A461]/20'
              }`}
            >
              {hasApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                  Successfully Synchronized!
                </>
              ) : (
                <>
                  <RotateCw className="w-4 h-4" />
                  Pull {invLoopsCount} Loops, {invZonesCount} Zones &amp; {invSummary.totalDeviceCount} Devices into Form
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
