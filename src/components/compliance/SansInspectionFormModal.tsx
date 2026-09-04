import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Download, 
  Printer, 
  ShieldCheck,
  Check,
  Search,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { SansInspectionItem } from '../../types';

interface InspectionStatusItem {
  status: 'pass' | 'fail' | 'na';
  measuredValue: string;
  notes: string;
}

interface SansInspectionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteId?: string;
}

export const SansInspectionFormModal: React.FC<SansInspectionFormModalProps> = ({
  isOpen,
  onClose,
  siteId
}) => {
  const store = useAudrinStore();
  const sites = store.getSites();
  const benchmarkRules = store.getSansBenchmarkRules();

  const [selectedSiteId, setSelectedSiteId] = useState<string>(siteId || sites[0]?.id || '');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Inspection checklist state populated from SANS 10139 rules
  const [checklist, setChecklist] = useState<Record<string, { status: 'pass' | 'fail' | 'na'; measuredValue: string; notes: string }>>(() => {
    const initial: Record<string, { status: 'pass' | 'fail' | 'na'; measuredValue: string; notes: string }> = {};
    benchmarkRules.forEach(rule => {
      initial[rule.ruleNumber] = {
        status: 'pass',
        measuredValue: rule.exactStandardValue,
        notes: 'Compliant with SANS 10139 specification.'
      };
    });
    return initial;
  });

  const [inspectorName, setInspectorName] = useState<string>('Noko Dina Ramphela');
  const [inspectorSaqcc, setInspectorSaqcc] = useState<string>('SAQCC-9109170791081');
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  const handleStatusChange = (ruleNumber: string, status: 'pass' | 'fail' | 'na') => {
    setChecklist(prev => ({
      ...prev,
      [ruleNumber]: {
        ...prev[ruleNumber],
        status
      }
    }));
  };

  const handleValueChange = (ruleNumber: string, measuredValue: string) => {
    setChecklist(prev => ({
      ...prev,
      [ruleNumber]: {
        ...prev[ruleNumber],
        measuredValue
      }
    }));
  };

  const handleNotesChange = (ruleNumber: string, notes: string) => {
    setChecklist(prev => ({
      ...prev,
      [ruleNumber]: {
        ...prev[ruleNumber],
        notes
      }
    }));
  };

  const filteredRules = benchmarkRules.filter(rule => {
    if (activeCategory !== 'all' && rule.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rule.title.toLowerCase().includes(q) ||
        rule.requirementStatement.toLowerCase().includes(q) ||
        rule.ruleNumber.toLowerCase().includes(q) ||
        rule.sourceQuestionId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const checklistValues = Object.values(checklist) as InspectionStatusItem[];
  const totalItems = checklistValues.length;
  const passedItems = checklistValues.filter(i => i.status === 'pass').length;
  const failedItems = checklistValues.filter(i => i.status === 'fail').length;
  const compliancePercentage = totalItems > 0 ? Math.round((passedItems / totalItems) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#151518] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-[#0D0D0E] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A1A1C] to-[#2A2A2E] border border-[#C1A461]/40 flex items-center justify-center text-[#C1A461] shadow-lg">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
                  SANS 10139 Standard
                </span>
                <span className="text-[9px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  22 Statutory Checkpoints
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                SANS 10139 / SAQCC Field Inspection Form
              </h2>
              <p className="text-xs text-white/50">
                Mandatory engineering audit covering power supplies, detector radius, cabling, and decibel audibility.
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

        {/* Top Control & Metrics Bar */}
        <div className="p-4 px-6 bg-[#111113] border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="bg-[#151518] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C1A461]"
            >
              {sites.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <div className="flex items-center gap-2 bg-[#151518] p-1 rounded-xl border border-white/5 text-xs">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition ${activeCategory === 'all' ? 'bg-[#C1A461] text-black' : 'text-white/60 hover:text-white'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveCategory('system_scope')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition ${activeCategory === 'system_scope' ? 'bg-[#C1A461] text-black' : 'text-white/60 hover:text-white'}`}
              >
                Scope & Categories
              </button>
              <button
                onClick={() => setActiveCategory('fault_indication')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition ${activeCategory === 'fault_indication' ? 'bg-[#C1A461] text-black' : 'text-white/60 hover:text-white'}`}
              >
                Fault Times
              </button>
              <button
                onClick={() => setActiveCategory('cabling_and_circuits')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition ${activeCategory === 'cabling_and_circuits' ? 'bg-[#C1A461] text-black' : 'text-white/60 hover:text-white'}`}
              >
                Cabling
              </button>
              <button
                onClick={() => setActiveCategory('detector_siting')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition ${activeCategory === 'detector_siting' ? 'bg-[#C1A461] text-black' : 'text-white/60 hover:text-white'}`}
              >
                Siting & Spacing
              </button>
              <button
                onClick={() => setActiveCategory('audibility')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition ${activeCategory === 'audibility' ? 'bg-[#C1A461] text-black' : 'text-white/60 hover:text-white'}`}
              >
                Audibility
              </button>
            </div>
          </div>

          {/* Compliance Score Gauge */}
          <div className="flex items-center gap-3 font-mono">
            <div className="text-right">
              <div className="text-[10px] text-white/40 uppercase">Compliance Index</div>
              <div className={`text-sm font-bold ${compliancePercentage >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {compliancePercentage}% ({passedItems}/{totalItems} Passed)
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-400 bg-emerald-950/40">
              {passedItems}
            </div>
          </div>
        </div>

        {/* Form Body Checklist */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-3">
            {filteredRules.map((rule) => {
              const current = checklist[rule.ruleNumber] || {
                status: 'pass',
                measuredValue: rule.exactStandardValue,
                notes: ''
              };

              return (
                <div
                  key={rule.ruleNumber}
                  className={`p-5 rounded-2xl border transition space-y-3 ${
                    current.status === 'pass'
                      ? 'bg-[#0D0D0E] border-white/5 hover:border-emerald-500/30'
                      : current.status === 'fail'
                      ? 'bg-red-950/20 border-red-500/30'
                      : 'bg-[#0D0D0E] border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-[#C1A461] bg-[#151518] px-2 py-0.5 rounded border border-white/10">
                        {rule.ruleNumber} (POE {rule.sourceQuestionId})
                      </span>
                      <h4 className="text-xs font-bold text-white">{rule.title}</h4>
                    </div>

                    {/* Status Button Toggle */}
                    <div className="flex items-center gap-1.5 bg-[#151518] p-1 rounded-xl border border-white/5">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rule.ruleNumber, 'pass')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1 ${
                          current.status === 'pass'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'text-white/40 hover:text-white'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>Pass</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rule.ruleNumber, 'fail')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1 ${
                          current.status === 'fail'
                            ? 'bg-red-600 text-white shadow'
                            : 'text-white/40 hover:text-white'
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>Fail</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rule.ruleNumber, 'na')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                          current.status === 'na'
                            ? 'bg-white/20 text-white'
                            : 'text-white/40 hover:text-white'
                        }`}
                      >
                        N/A
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed font-sans">
                    {rule.requirementStatement}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-[#C1A461] uppercase font-bold block mb-1">
                        SANS 10139 Standard Benchmark:
                      </span>
                      <div className="bg-[#151518] p-2 rounded-lg border border-white/5 text-white/90 text-[11px]">
                        {rule.exactStandardValue}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-white/50 uppercase font-bold block mb-1">
                        Measured Field Value & Site Condition:
                      </span>
                      <input
                        type="text"
                        value={current.measuredValue}
                        onChange={(e) => handleValueChange(rule.ruleNumber, e.target.value)}
                        className="w-full bg-[#151518] border border-white/10 rounded-lg p-2 text-xs text-white focus:border-[#C1A461]"
                      />
                    </div>
                  </div>

                  {current.status === 'fail' && (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-xs text-red-300 font-mono space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-red-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Mandatory Remedial Engineering Action Required:</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Specify remedial work required to meet SANS 10139 standard..."
                        value={current.notes}
                        onChange={(e) => handleNotesChange(rule.ruleNumber, e.target.value)}
                        className="w-full bg-[#151518] border border-red-500/30 rounded-lg p-2 text-xs text-white mt-1"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/5 bg-[#0D0D0E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-white/50 font-mono text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#C1A461]" />
            <span>Audited for: {activeSite.name} &middot; Inspector: {inspectorName} ({inspectorSaqcc})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                store.addSansLogbookEntry({
                  id: `log-audit-${Date.now()}`,
                  siteId: activeSite.id,
                  siteName: activeSite.name,
                  entryType: 'annual',
                  timestamp: new Date().toISOString(),
                  date: new Date().toISOString().split('T')[0],
                  time: new Date().toTimeString().slice(0, 5),
                  inspectedBy: inspectorName,
                  inspectorIdOrSaqcc: inspectorSaqcc,
                  notes: `Completed comprehensive SANS 10139 22-checkpoint audit. Compliance Score: ${compliancePercentage}%. Passed: ${passedItems}/${totalItems}.`,
                  systemCategory: 'L1',
                  quiescentStateOk: true,
                  soundersAudibleOk: true,
                  batteryAutonomyVerified: true,
                  cableIntegrityVerified: true,
                  signatureHash: `SIG-AUD-${Date.now().toString(36).toUpperCase()}`
                });
                onClose();
              }}
              className="px-6 py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-[1.5px] rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save & Log Inspection Audit</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
