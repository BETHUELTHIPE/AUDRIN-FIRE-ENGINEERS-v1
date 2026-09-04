import React, { useState } from 'react';
import { useAudrinStore } from '../../services/store';
import { DefectRecord, SourceCitation } from '../../types';
import { SourceRequirementDrawer } from './SourceRequirementDrawer';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  X, 
  Plus, 
  Filter, 
  ShieldAlert, 
  User, 
  BookOpen, 
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface DefectActionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteId?: string;
}

export const DefectActionManagerModal: React.FC<DefectActionManagerModalProps> = ({
  isOpen,
  onClose,
  siteId
}) => {
  const store = useAudrinStore();
  const defects = store.getDefects();
  const sites = store.getSites();
  const branding = store.getCurrentCompanyBranding();
  const currentUser = store.getCurrentUser();

  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'major' | 'minor'>('all');
  
  // Resolve defect dialog
  const [resolvingDefect, setResolvingDefect] = useState<DefectRecord | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Add new defect dialog
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDefect, setNewDefect] = useState<Partial<DefectRecord>>({
    siteId: sites[0]?.id || 'site-01',
    siteName: sites[0]?.name || 'Menlyn Central Commercial Park - Tower A',
    title: '',
    description: '',
    riskLevel: 'critical',
    blocksCocIssuance: true,
    remedialAction: '',
    responsibleParty: 'Audrin Fire Engineers',
    targetDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  });

  // Source drawer state
  const [citationDrawerOpen, setCitationDrawerOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | undefined>();

  if (!isOpen) return null;

  const filteredDefects = defects.filter(d => {
    if (siteId && d.siteId !== siteId) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (riskFilter !== 'all' && d.riskLevel !== riskFilter) return false;
    return true;
  });

  const handleOpenCitation = (reqId: string) => {
    setSelectedReqId(reqId);
    setCitationDrawerOpen(true);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resolvingDefect && resolutionNotes.trim()) {
      store.resolveDefect(resolvingDefect.id, resolutionNotes.trim());
      setResolvingDefect(null);
      setResolutionNotes('');
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDefect.title && newDefect.description) {
      const selectedSite = sites.find(s => s.id === newDefect.siteId);
      const created: DefectRecord = {
        id: `def-${Date.now()}`,
        siteId: newDefect.siteId || 'site-01',
        siteName: selectedSite ? selectedSite.name : 'Menlyn Central Commercial Park',
        clientId: branding.orgId,
        title: newDefect.title,
        description: newDefect.description,
        riskLevel: newDefect.riskLevel || 'critical',
        blocksCocIssuance: newDefect.riskLevel === 'critical',
        status: 'open',
        remedialAction: newDefect.remedialAction || '',
        responsibleParty: newDefect.responsibleParty || 'Audrin Fire Engineers',
        targetDate: newDefect.targetDate || new Date().toISOString().split('T')[0],
        sourceCitation: {
          sourceDocId: 'src-doc-01',
          sourceDocTitle: 'SANS 10400-T:2011 (Edition 3)',
          pdfPage: 50,
          clauseOrQuestion: 'Clause 4.32',
          approvedParaphrase: 'Equipment readiness, visibility, and unobstructed accessibility.'
        },
        createdAt: new Date().toISOString()
      };

      store.addDefect(created);
      setIsAddingNew(false);
      setNewDefect({
        siteId: sites[0]?.id || 'site-01',
        title: '',
        description: '',
        riskLevel: 'critical',
        blocksCocIssuance: true,
        remedialAction: '',
        responsibleParty: 'Audrin Fire Engineers',
        targetDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-5xl bg-[#121215] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="p-6 bg-gradient-to-r from-[#1E1E24] via-[#16161A] to-[#121215] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-500/30 font-mono uppercase">
                Section 11 &middot; Life-Safety Non-Conformances
              </span>
              <span className="text-xs font-mono text-white/50">
                {filteredDefects.length} Record(s) Filtered
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Defects, Impairments &amp; Corrective Action Register
            </h2>
            <p className="text-xs text-white/60">
              Track statutory non-conformances with mandatory COC-blocking gates and SANS citation links.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingNew(true)}
              className="px-4 py-2 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow-lg shadow-[#C1A461]/20"
            >
              <Plus className="w-4 h-4" /> Log Defect
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="px-6 py-3 bg-[#0A0A0C] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-white/40 font-mono uppercase text-[10px] flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#C1A461]" /> Status:
            </span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === 'all' ? 'bg-white/20 text-white font-bold' : 'text-white/50 hover:text-white'
              }`}
            >
              All ({defects.length})
            </button>
            <button
              onClick={() => setStatusFilter('open')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === 'open' ? 'bg-red-950 text-red-300 font-bold border border-red-500/30' : 'text-white/50 hover:text-white'
              }`}
            >
              Open ({defects.filter(d => d.status === 'open').length})
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === 'resolved' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30' : 'text-white/50 hover:text-white'
              }`}
            >
              Resolved ({defects.filter(d => d.status === 'resolved').length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/40 font-mono uppercase text-[10px]">Risk Level:</span>
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 text-white text-xs outline-none"
            >
              <option value="all">All Risk Levels</option>
              <option value="critical">Critical (Blocks COC)</option>
              <option value="major">Major Risk</option>
              <option value="minor">Minor Observation</option>
            </select>
          </div>
        </div>

        {/* Scrollable Defect Cards List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-grow text-xs">
          
          {filteredDefects.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Defects Found in this View</h3>
              <p className="text-xs text-white/50">All registered fire safety items conform to SANS 10139 standards.</p>
            </div>
          ) : (
            filteredDefects.map(defect => (
              <div
                key={defect.id}
                className={`p-5 rounded-2xl border transition space-y-4 ${
                  defect.status === 'open'
                    ? (defect.riskLevel === 'critical' ? 'bg-red-950/20 border-red-500/40' : 'bg-[#151518] border-amber-500/30')
                    : 'bg-[#121215] border-white/5 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        defect.riskLevel === 'critical'
                          ? 'bg-red-600 text-white'
                          : (defect.riskLevel === 'major' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-white')
                      }`}>
                        {defect.riskLevel} Risk
                      </span>

                      {defect.blocksCocIssuance && (
                        <span className="px-2 py-0.5 rounded bg-red-950 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-red-400" /> Blocks COC
                        </span>
                      )}

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                        defect.status === 'resolved'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-950 text-red-300'
                      }`}>
                        {defect.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1">
                      {defect.title}
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {defect.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-mono text-white/40">Target Date:</div>
                    <div className="text-xs font-mono font-bold text-white">{defect.targetDate}</div>
                  </div>
                </div>

                {/* SANS Citation Banner if attached */}
                {defect.sourceCitation && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#C1A461]" />
                      <span className="text-[#C1A461] font-mono font-bold">
                        {defect.sourceCitation.sourceDocTitle} &middot; {defect.sourceCitation.clauseOrQuestion}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenCitation('req-sans10400t-4.32')}
                      className="text-[#C1A461] hover:underline text-[10px] font-mono"
                    >
                      View Source
                    </button>
                  </div>
                )}

                {/* Remedial Action & Status Details */}
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-white/40 block font-mono text-[10px]">Proposed Remedial Action:</span>
                    <span className="text-slate-300">{defect.remedialAction}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block font-mono text-[10px]">Responsible Party:</span>
                    <span className="text-white font-medium">{defect.responsibleParty}</span>
                  </div>

                  {defect.status === 'resolved' && (
                    <div className="col-span-2 pt-2 border-t border-white/5 text-emerald-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Resolved on {new Date(defect.resolvedDate || '').toLocaleDateString()} by {defect.resolvedBy}:</strong>
                        <p className="text-xs text-white/70 mt-0.5">{defect.resolutionNotes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                {defect.status === 'open' && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setResolvingDefect(defect)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Sign-off Remedial Action &amp; Resolve
                    </button>
                  </div>
                )}
              </div>
            ))
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-[#151518] border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="text-[11px] font-mono text-white/40">
            SANS 10139 Non-Conformance Engine
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition"
          >
            Close Defect Manager
          </button>
        </div>

      </div>

      {/* Resolve Defect Sub-Modal */}
      {resolvingDefect && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleResolveSubmit} className="w-full max-w-lg bg-[#18181C] border border-white/10 rounded-3xl p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Resolve Life-Safety Defect
            </h3>
            <p className="text-white/60">
              Defect: <strong className="text-white">{resolvingDefect.title}</strong>
            </p>

            <div>
              <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                Remedial Action Verification Notes *
              </label>
              <textarea
                required
                rows={4}
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
                placeholder="Describe the physical work done, tests performed, and confirmation that SANS requirements are satisfied..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResolvingDefect(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Confirm Resolution
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Defect Sub-Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubmit} className="w-full max-w-lg bg-[#18181C] border border-white/10 rounded-3xl p-6 space-y-4 text-xs shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Log SANS 10139 Non-Conformance / Defect
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                  Site Facility *
                </label>
                <select
                  value={newDefect.siteId}
                  onChange={e => setNewDefect({ ...newDefect, siteId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                >
                  {sites.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                  Defect Title *
                </label>
                <input
                  type="text"
                  required
                  value={newDefect.title}
                  onChange={e => setNewDefect({ ...newDefect, title: e.target.value })}
                  placeholder="e.g. Point smoke detector obstructed by storage rack"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Risk Severity
                  </label>
                  <select
                    value={newDefect.riskLevel}
                    onChange={e => setNewDefect({ ...newDefect, riskLevel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                  >
                    <option value="critical">Critical (Blocks COC)</option>
                    <option value="major">Major Risk</option>
                    <option value="minor">Minor Observation</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Target Rectification Date
                  </label>
                  <input
                    type="date"
                    value={newDefect.targetDate}
                    onChange={e => setNewDefect({ ...newDefect, targetDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                  Detailed Observation Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDefect.description}
                  onChange={e => setNewDefect({ ...newDefect, description: e.target.value })}
                  placeholder="Provide exact physical location, loop address and observed condition..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                  Required Remedial Action
                </label>
                <input
                  type="text"
                  value={newDefect.remedialAction}
                  onChange={e => setNewDefect({ ...newDefect, remedialAction: e.target.value })}
                  placeholder="e.g. Relocate detector to maintain min 500mm wall clearance"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black font-bold"
              >
                Create Defect Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Citation Drawer */}
      <SourceRequirementDrawer
        isOpen={citationDrawerOpen}
        onClose={() => setCitationDrawerOpen(false)}
        requirementId={selectedReqId}
      />

    </div>
  );
};
