import React, { useState } from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  Camera, 
  Video, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Layers,
  Sparkles,
  AlertTriangle,
  Upload,
  BookOpen,
  FileCheck,
  ClipboardCheck,
  Sliders,
  Volume2,
  Zap,
  BellRing,
  AlertOctagon,
  Flame
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { HOW_WE_WORK_STAGES } from '../../data/initialData';
import { PhotoEvidence, ConditionReport, ServiceRequest, SansCocCertificate } from '../../types';
import { ConditionReportModal } from './ConditionReportModal';
import { SansLogbookModal } from '../compliance/SansLogbookModal';
import { SansCocGeneratorModal } from '../compliance/SansCocGeneratorModal';
import { SansInspectionFormModal } from '../compliance/SansInspectionFormModal';
import { SansDeviceLegendInspector } from '../compliance/SansDeviceLegendInspector';
import { ComplianceStatusBadge } from './ComplianceStatusBadge';
import { StaffNotificationCenter } from './StaffNotificationCenter';

export const StaffDashboard: React.FC = () => {
  const store = useAudrinStore();
  const requests = store.getServiceRequests();
  const photos = store.getPhotos();
  const reports = store.getConditionReports();
  const logbookEntries = store.getSansLogbook();
  const cocs = store.getSansCocs();
  const defects = store.getDefects();
  const dossiers = store.getSafetyFileDossiers();

  const [selectedRequestId, setSelectedRequestId] = useState<string>(requests[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'queue' | 'evidence_manager' | 'reports' | 'sans_compliance' | 'notifications'>('queue');
  const [selectedReport, setSelectedReport] = useState<ConditionReport | null>(null);

  // Quick Notification Counts
  const today = new Date();
  const pendingCocs = cocs.filter(c => c.certificateStatus === 'Draft' || !c.isSigned);
  const openCriticalDefects = defects.filter(d => (d.riskLevel === 'critical' || d.blocksCocIssuance) && d.status !== 'resolved');
  const overdueMilestones = dossiers.flatMap(d => d.milestones).filter(m => m.status === 'overdue' || (m.status !== 'completed' && new Date(m.targetDate) < today));
  const totalAlertsCount = pendingCocs.length + openCriticalDefects.length + overdueMilestones.length;

  // Compliance Modals State
  const [logbookModalOpen, setLogbookModalOpen] = useState(false);
  const [cocModalOpen, setCocModalOpen] = useState(false);
  const [selectedCocForView, setSelectedCocForView] = useState<SansCocCertificate | null>(null);
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [legendInspectorOpen, setLegendInspectorOpen] = useState(false);

  // Quick photo upload state
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoLocation, setNewPhotoLocation] = useState('');
  const [newPhotoStage, setNewPhotoStage] = useState<'before' | 'during' | 'after'>('during');

  const activeRequest = requests.find(r => r.id === selectedRequestId) || requests[0];

  const handleAdvanceStage = (reqId: string, currentStage: number) => {
    if (currentStage < 7) {
      store.updateRequestStage(reqId, currentStage + 1, currentStage + 1 === 7 ? 'completed' : 'in_progress');
    }
  };

  const handleAddEvidencePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoCaption) return;

    const dummyHash = Math.random().toString(36).substring(2, 10).toUpperCase() + 'A9F1';
    const newPhoto: PhotoEvidence = {
      id: `pho-${Date.now()}`,
      requestId: activeRequest?.id || 'req-01',
      siteId: activeRequest?.siteId || 'site-menlyn-01',
      stage: newPhotoStage,
      category: 'detector_inspection',
      categoryLabel: 'Optical Detector Chamber',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      caption: newPhotoCaption,
      areaLocation: newPhotoLocation || 'Level 4 Distribution Corridor',
      equipmentIdentifier: 'L2-D088',
      capturedAt: new Date().toISOString(),
      capturedBy: 'Bethuel Moukangwe (Lead Engineer)',
      hash: dummyHash,
      isCompliantBaseline: true,
      notes: 'Audited chamber sensitivity nominal.'
    };

    store.addPhoto(newPhoto);
    setNewPhotoCaption('');
    setNewPhotoLocation('');
  };

  const handleCreateReport = (type: 'pre_work' | 'post_work') => {
    if (!activeRequest) return;
    const reportNum = `CR-${type === 'pre_work' ? 'PRE' : 'POST'}-${Date.now().toString().slice(-4)}`;

    const newReport: ConditionReport = {
      id: `cr-${Date.now()}`,
      reportNumber: reportNum,
      requestId: activeRequest.id,
      siteId: activeRequest.siteId,
      siteName: activeRequest.siteName,
      siteAddress: activeRequest.siteAddress,
      organisationName: activeRequest.organisationName,
      clientName: activeRequest.clientName,
      serviceTitle: activeRequest.serviceTitle,
      reportType: type,
      version: 1,
      generatedAt: new Date().toISOString(),
      generatedBy: 'Bethuel Moukangwe (Lead Engineer)',
      scopeSummary: `Standardized ${type === 'pre_work' ? 'Pre-Work' : 'Post-Work'} SANS 10139 baseline record for ${activeRequest.siteName}.`,
      visibleConditionNotes: 'System panel operating in normal quiescent mode. Field devices checked for physical damage and environmental contamination.',
      physicalAssessmentRequiredNotes: 'Point-to-point actuation confirmed. Loop health diagnostics nominal.',
      recommendedNextStep: type === 'pre_work' ? 'Commence scheduled loop maintenance and detector calibration.' : 'File quarterly SANS 10139 logbook entry and schedule Q2 inspection.',
      evidenceSnapshot: {
        photographs: photos.filter(p => p.requestId === activeRequest.id),
        videos: []
      },
      limitationsDisclaimer: 'Service delivery and photographic evidence adhere to SANS 10139 recommendations. Output does not constitute statutory verification or a legal certificate of compliance.',
      isLocked: true
    };

    store.addConditionReport(newReport);
    setSelectedReport(newReport);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-7 rounded-3xl bg-[#151518] border border-white/5 shadow-2xl">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
                Staff Engineer Hub
              </span>
              <ComplianceStatusBadge 
                variant="badge"
                onOpenLogbook={() => setLogbookModalOpen(true)}
                onOpenCoc={(coc) => {
                  if (coc) {
                    setSelectedCocForView(coc);
                    setCocModalOpen(true);
                  } else {
                    setActiveTab('sans_compliance');
                  }
                }}
                onOpenDefects={() => setActiveTab('sans_compliance')}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Engineering Triage & Stage Manager
            </h1>
            <p className="text-xs text-white/50 font-mono">
              Lead Engineer: Bethuel Moukangwe | Pretoria West Engineering Desk
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                activeTab === 'queue' ? 'bg-[#C1A461] text-black shadow-md' : 'bg-[#0A0A0B] text-white/50 hover:text-white border border-white/5'
              }`}
            >
              Requests Queue
            </button>
            <button
              onClick={() => setActiveTab('evidence_manager')}
              className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                activeTab === 'evidence_manager' ? 'bg-[#C1A461] text-black shadow-md' : 'bg-[#0A0A0B] text-white/50 hover:text-white border border-white/5'
              }`}
            >
              Upload Evidence
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition cursor-pointer ${
                activeTab === 'reports' ? 'bg-[#C1A461] text-black shadow-md' : 'bg-[#0A0A0B] text-white/50 hover:text-white border border-white/5'
              }`}
            >
              Condition Reports
            </button>
            <button
              onClick={() => setActiveTab('sans_compliance')}
              className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sans_compliance' ? 'bg-[#C1A461] text-black shadow-md' : 'bg-[#0A0A0B] text-[#C1A461] hover:text-white border border-[#C1A461]/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SANS 10139 Suite ({logbookEntries.length + cocs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition cursor-pointer flex items-center gap-2 relative ${
                activeTab === 'notifications'
                  ? 'bg-[#C1A461] text-black shadow-md'
                  : 'bg-[#0A0A0B] text-white/70 hover:text-white border border-white/5'
              }`}
            >
              <BellRing className={`w-3.5 h-3.5 ${totalAlertsCount > 0 ? 'text-[#C1A461]' : 'text-white/40'}`} />
              <span>Alert Center</span>
              {totalAlertsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-600 text-white animate-pulse">
                  {totalAlertsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Persistent Statutory Alert Banner (Visible on all tabs when urgent alerts exist) */}
        {totalAlertsCount > 0 && activeTab !== 'notifications' && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-red-950/70 via-[#1B1412] to-[#151518] border border-red-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center shrink-0 animate-pulse">
                <BellRing className="w-5 h-5 text-red-400" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400">
                    Statutory Compliance Alerts Active
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/40 font-bold">
                    {totalAlertsCount} Items Require Review
                  </span>
                </div>
                <p className="text-xs text-white/90 font-medium">
                  {pendingCocs.length > 0 && <span className="text-[#C1A461] font-bold">{pendingCocs.length} Pending COC(s) &middot; </span>}
                  {overdueMilestones.length > 0 && <span className="text-amber-400 font-bold">{overdueMilestones.length} Missed Milestone(s) &middot; </span>}
                  {openCriticalDefects.length > 0 && <span className="text-red-400 font-bold">{openCriticalDefects.length} Urgent Impairment(s) &middot; </span>}
                  <span className="text-white/60">Blocks certificate issuance and statutory occupancy.</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => setActiveTab('notifications')}
                className="px-4 py-2 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer font-mono"
              >
                <span>Open Alert Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Queue & Stage Progression */}
        {activeTab === 'queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* List (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-[1.5px]">
                Assigned Service Tickets ({requests.length})
              </h3>
              {requests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`p-5 rounded-3xl border cursor-pointer transition ${
                    req.id === selectedRequestId
                      ? 'bg-[#151518] border-[#C1A461]/60 shadow-xl'
                      : 'bg-[#151518]/60 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#C1A461]">{req.referenceNumber}</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold bg-[#0A0A0B] px-2.5 py-0.5 rounded-full text-white/60 border border-white/5">
                      Stage {req.currentStage || 1}/7
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1.5">{req.serviceTitle}</h4>
                  <p className="text-xs text-white/50">{req.siteName}</p>
                </div>
              ))}
            </div>

            {/* Stage Detail & Action Controller (7 cols) */}
            {activeRequest && (
              <div className="lg:col-span-7 p-7 rounded-3xl bg-[#151518] border border-white/5 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#C1A461]">{activeRequest.referenceNumber}</span>
                    <h3 className="text-lg font-bold text-white">{activeRequest.serviceTitle}</h3>
                    <p className="text-xs text-white/50">{activeRequest.clientName} ({activeRequest.organisationName})</p>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0A0A0B] text-[#C1A461] border border-[#C1A461]/30">
                    Stage {activeRequest.currentStage || 1} of 7
                  </span>
                </div>

                {/* Stage Progression Stepper */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-[1.5px]">
                    7-Step SANS 10139 Workflow Progression
                  </h4>

                  <div className="space-y-2">
                    {HOW_WE_WORK_STAGES.map((stage) => {
                      const isCurrent = stage.stepNumber === activeRequest.currentStage;
                      const isPast = stage.stepNumber < activeRequest.currentStage;
                      return (
                        <div
                          key={stage.stepNumber}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition ${
                            isCurrent
                              ? 'bg-[#0A0A0B] border-[#C1A461]/60 text-white font-bold'
                              : isPast
                              ? 'bg-[#0A0A0B]/60 border-white/5 text-white/60'
                              : 'bg-[#0A0A0B]/30 border-white/5 text-white/30'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-white/40">0{stage.stepNumber}</span>
                            <span>{stage.title}</span>
                          </div>

                          {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {isCurrent && (
                            <button
                              onClick={() => handleAdvanceStage(activeRequest.id, activeRequest.currentStage)}
                              className="px-3 py-1.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black font-bold uppercase tracking-wider rounded-xl text-xs transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>Complete Stage</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Report Generation Actions */}
                <div className="pt-4 border-t border-white/5 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleCreateReport('pre_work')}
                    className="flex-1 py-3 bg-[#0A0A0B] hover:bg-[#1E1E22] border border-amber-500/30 text-amber-300 text-xs uppercase tracking-wider font-bold rounded-xl transition text-center cursor-pointer"
                  >
                    Generate Pre-Work Report
                  </button>
                  <button
                    onClick={() => handleCreateReport('post_work')}
                    className="flex-1 py-3 bg-[#0A0A0B] hover:bg-[#1E1E22] border border-emerald-500/30 text-emerald-300 text-xs uppercase tracking-wider font-bold rounded-xl transition text-center cursor-pointer"
                  >
                    Generate Post-Work Report
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Upload Evidence */}
        {activeTab === 'evidence_manager' && (
          <div className="max-w-2xl mx-auto p-7 sm:p-9 rounded-3xl bg-[#151518] border border-white/5 space-y-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#C1A461]" />
              <span>Capture & Hash Field Evidence Photo</span>
            </h3>

            <form onSubmit={handleAddEvidencePhoto} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/70 font-semibold mb-1.5">Target Service Request</label>
                <select
                  value={selectedRequestId}
                  onChange={(e) => setSelectedRequestId(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white font-semibold focus:border-[#C1A461] outline-none"
                >
                  {requests.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.referenceNumber} — {r.siteName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1.5">Evidence Stage</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['before', 'during', 'after'] as const).map(st => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setNewPhotoStage(st)}
                      className={`p-2.5 rounded-xl uppercase font-bold text-center border cursor-pointer transition ${
                        newPhotoStage === st ? 'bg-[#C1A461] text-black border-[#C1A461]' : 'bg-[#0A0A0B] text-white/50 border-white/5 hover:border-white/10'
                      }`}
                    >
                      {st} Work
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1.5">Photo Caption / Observation *</label>
                <input
                  type="text"
                  required
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="e.g. Optical sensor chamber inspected; no thermal deformation"
                  className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:border-[#C1A461] outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 font-semibold mb-1.5">Physical Location on Site</label>
                <input
                  type="text"
                  value={newPhotoLocation}
                  onChange={(e) => setNewPhotoLocation(e.target.value)}
                  placeholder="e.g. Ground Floor Main Entrance Lobby"
                  className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:border-[#C1A461] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black font-bold uppercase tracking-[1.5px] rounded-xl transition shadow-lg cursor-pointer"
              >
                Hash & Register Photographic Evidence
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: SANS 10139 & SAQCC Compliance Suite */}
        {activeTab === 'sans_compliance' && (
          <div className="space-y-8">
            {/* Action Tools Launchpad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Digital Log Book Launcher */}
              <div className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-4 shadow-xl flex flex-col justify-between hover:border-[#C1A461]/40 transition">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Digital Log Book</h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Statutory daily, weekly MCP rotational, quarterly & annual service records.
                  </p>
                </div>
                <button
                  onClick={() => setLogbookModalOpen(true)}
                  className="w-full py-2.5 bg-[#0A0A0B] hover:bg-[#1E1E22] text-[#C1A461] border border-[#C1A461]/30 text-xs uppercase tracking-wider font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open Log Book ({logbookEntries.length})</span>
                </button>
              </div>

              {/* Certificate of Compliance (COC) Launcher */}
              <div className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-4 shadow-xl flex flex-col justify-between hover:border-[#C1A461]/40 transition">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-950/60 border border-[#C1A461]/40 flex items-center justify-center text-[#C1A461]">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Certificate of Compliance (COC)</h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Issue SANS 10139 / SAQCC Commissioner certificate with digital seal.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCocForView(null);
                    setCocModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs uppercase tracking-wider font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Issue New COC</span>
                </button>
              </div>

              {/* 22-Checkpoint Inspection Form Launcher */}
              <div className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-4 shadow-xl flex flex-col justify-between hover:border-emerald-500/40 transition">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Field Inspection Form</h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    22 SANS 10139 technical checkpoints: power, radius, cabling & db audit.
                  </p>
                </div>
                <button
                  onClick={() => setInspectionModalOpen(true)}
                  className="w-full py-2.5 bg-[#0A0A0B] hover:bg-[#1E1E22] text-emerald-400 border border-emerald-500/30 text-xs uppercase tracking-wider font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Launch Inspection</span>
                </button>
              </div>

              {/* Floorplan Dot Legend & Siting Simulator */}
              <div className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-4 shadow-xl flex flex-col justify-between hover:border-purple-500/40 transition">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Device Legend & Siting</h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Simulate 7.5m smoke & 5.3m heat radius with roof pitch calculations.
                  </p>
                </div>
                <button
                  onClick={() => setLegendInspectorOpen(true)}
                  className="w-full py-2.5 bg-[#0A0A0B] hover:bg-[#1E1E22] text-purple-400 border border-purple-500/30 text-xs uppercase tracking-wider font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Siting Simulator</span>
                </button>
              </div>

            </div>

            {/* Issued Certificates of Compliance List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-[1.5px]">
                  Issued SANS 10139 Certificates of Compliance ({cocs.length})
                </h3>
                <span className="text-xs font-mono text-[#C1A461]">
                  Commissioner: Noko Dina Ramphela (SAQCC-9109170791081)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cocs.map((coc) => (
                  <div
                    key={coc.id}
                    className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-4 shadow-xl flex flex-col justify-between hover:border-[#C1A461]/30 transition"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-[#C1A461] font-bold">{coc.cocNumber}</span>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                          {coc.overallComplianceStatus}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-white">{coc.siteName}</h4>
                        <p className="text-xs text-white/50 font-mono">Category {coc.systemCategory} &middot; {coc.systemObjective}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-white/60 bg-[#0D0D0E] p-3 rounded-2xl border border-white/5">
                        <div>Autonomy: <strong className="text-white">{coc.powerSupplyAutonomy.standbyAutonomyHours}h / {coc.powerSupplyAutonomy.evacuateAlarmDurationMinutes}m</strong></div>
                        <div>Audibility: <strong className="text-white">{coc.audibilityAndSounders.soundLevelBedheadDba} dB(A)</strong></div>
                        <div>Cabling: <strong className="text-white">{coc.cablingAndCircuits.cableColour} ({coc.cablingAndCircuits.conductorCrossSectionMm2}mm²)</strong></div>
                        <div>Fault Ind: <strong className="text-white">≤ {coc.faultResponseTimes.detectorShortOrOpenCircuitFaultSeconds}s</strong></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => {
                          setSelectedCocForView(coc);
                          setCocModalOpen(true);
                        }}
                        className="flex-1 py-2.5 bg-[#0A0A0B] hover:bg-[#1E1E22] text-[#C1A461] text-xs font-bold uppercase tracking-wider rounded-xl border border-white/5 transition flex items-center justify-center gap-2"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Inspect Certificate</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCocForView(coc);
                          setCocModalOpen(true);
                        }}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase rounded-xl transition"
                      >
                        Print PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Logbook Activities */}
            <div className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-[1.5px]">
                  Recent SANS 10139 Log Entries
                </h3>
                <button
                  onClick={() => setLogbookModalOpen(true)}
                  className="text-xs text-[#C1A461] hover:underline font-bold"
                >
                  View All Log Entries &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {logbookEntries.slice(0, 3).map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-[#0D0D0E] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-[#C1A461]">
                          {entry.entryType}
                        </span>
                        <span className="font-bold text-white">{entry.siteName}</span>
                      </div>
                      <p className="text-white/60 text-[11px]">{entry.notes}</p>
                    </div>

                    <div className="text-right font-mono text-[10px] text-white/40 shrink-0">
                      <div>{entry.date} at {entry.time}</div>
                      <div className="text-[#C1A461]">{entry.signatureHash}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 5: Centralized Statutory Notification Panel */}
        {activeTab === 'notifications' && (
          <StaffNotificationCenter
            onOpenCoc={(coc) => {
              setSelectedCocForView(coc);
              setCocModalOpen(true);
            }}
            onOpenLogbook={() => setLogbookModalOpen(true)}
            onOpenInspection={() => setInspectionModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
          />
        )}
      </div>

      {/* Modals */}
      <ConditionReportModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />

      <SansLogbookModal
        isOpen={logbookModalOpen}
        onClose={() => setLogbookModalOpen(false)}
        siteId={activeRequest?.siteId}
      />

      <SansCocGeneratorModal
        isOpen={cocModalOpen}
        onClose={() => setCocModalOpen(false)}
        existingCoc={selectedCocForView}
      />

      <SansInspectionFormModal
        isOpen={inspectionModalOpen}
        onClose={() => setInspectionModalOpen(false)}
        siteId={activeRequest?.siteId}
      />

      <SansDeviceLegendInspector
        isOpen={legendInspectorOpen}
        onClose={() => setLegendInspectorOpen(false)}
      />
    </div>
  );
};
