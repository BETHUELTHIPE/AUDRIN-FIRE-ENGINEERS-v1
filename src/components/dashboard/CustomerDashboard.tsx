import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Camera, 
  Video, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Download, 
  Presentation, 
  Sparkles, 
  Plus, 
  Layers, 
  ChevronRight, 
  ArrowUpRight,
  Eye,
  AlertTriangle,
  BookOpen,
  FileCheck,
  ShieldCheck,
  Sliders
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { ZoomMeetingCard } from './ZoomMeetingCard';
import { ConditionReportModal } from './ConditionReportModal';
import { PresentationPreviewModal } from './PresentationPreviewModal';
import { AiMinutesModal } from './AiMinutesModal';
import { SansLogbookModal } from '../compliance/SansLogbookModal';
import { SansCocGeneratorModal } from '../compliance/SansCocGeneratorModal';
import { SansDeviceLegendInspector } from '../compliance/SansDeviceLegendInspector';
import { ComplianceStatusBadge } from './ComplianceStatusBadge';
import { ConditionReport, PowerPointPresentation, AiMeetingMinutes, ServiceRequest, SansCocCertificate } from '../../types';
import { HOW_WE_WORK_STAGES } from '../../data/initialData';

interface CustomerDashboardProps {
  onRequestService: () => void;
  onReportFault: () => void;
  onSelectService: (slug: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onRequestService,
  onReportFault,
  onSelectService
}) => {
  const store = useAudrinStore();
  const requests = store.getServiceRequests();
  const sites = store.getSites();
  const photos = store.getPhotos();
  const videos = store.getVideos();
  const reports = store.getConditionReports();
  const presentations = store.getPresentations();
  const minutesList = store.getMeetingMinutes();
  const appointments = store.getAppointments();
  const logbookEntries = store.getSansLogbook();
  const cocs = store.getSansCocs();

  const [activeTab, setActiveTab] = useState<'requests' | 'sites' | 'evidence' | 'reports' | 'calendar' | 'sans_compliance'>('requests');
  const [selectedReport, setSelectedReport] = useState<ConditionReport | null>(null);
  const [selectedPresentation, setSelectedPresentation] = useState<PowerPointPresentation | null>(null);
  const [selectedMinutes, setSelectedMinutes] = useState<AiMeetingMinutes | null>(null);
  const [selectedRequestDetail, setSelectedRequestDetail] = useState<ServiceRequest | null>(null);

  // SANS Compliance Modals
  const [logbookModalOpen, setLogbookModalOpen] = useState(false);
  const [cocModalOpen, setCocModalOpen] = useState(false);
  const [selectedCoc, setSelectedCoc] = useState<SansCocCertificate | null>(null);
  const [legendInspectorOpen, setLegendInspectorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-7 rounded-3xl bg-[#151518] border border-white/5 shadow-2xl">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
                Client Portal
              </span>
              <ComplianceStatusBadge 
                variant="badge"
                onOpenLogbook={() => setLogbookModalOpen(true)}
                onOpenCoc={(coc) => {
                  if (coc) {
                    setSelectedCoc(coc);
                    setCocModalOpen(true);
                  } else {
                    setActiveTab('sans_compliance');
                  }
                }}
                onOpenDefects={() => setActiveTab('sans_compliance')}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Apex Commercial Properties — Fire Safety Dashboard
            </h1>
            <p className="text-xs text-white/50 font-mono">
              Account: Sarah Ndlovu | 3 Registered Sites | Pretoria & Centurion Region
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onReportFault}
              className="px-4 py-2.5 bg-[#0A0A0B] hover:bg-[#1E1E22] border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Report Fault</span>
            </button>
            <button
              onClick={onRequestService}
              className="px-5 py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-[1.5px] rounded-xl shadow-lg shadow-black/40 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Request</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bento Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-[#151518] border border-white/5 space-y-1">
            <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Active Requests</div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{requests.length}</div>
            <div className="text-[10px] text-[#C1A461] font-mono">1 Scheduled • 1 Completed</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#151518] border border-white/5 space-y-1">
            <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Registered Facilities</div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{sites.length}</div>
            <div className="text-[10px] text-white/40 font-mono">Commercial Towers & Hubs</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#151518] border border-white/5 space-y-1">
            <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Audited Reports</div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{reports.length}</div>
            <div className="text-[10px] text-emerald-400 font-mono">Pre & Post Condition PDFs</div>
          </div>

          <div className="p-5 rounded-3xl bg-[#151518] border border-white/5 space-y-1">
            <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">Field Evidence</div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{photos.length}</div>
            <div className="text-[10px] text-cyan-400 font-mono">Hashed Photos & Videos</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5 overflow-x-auto pb-3">
          {[
            { id: 'requests', label: 'Service Requests & Workflow', icon: FileText },
            { id: 'sans_compliance', label: `SANS 10139 & COCs (${cocs.length})`, icon: ShieldCheck },
            { id: 'sites', label: 'Registered Sites & Panels', icon: Building2 },
            { id: 'evidence', label: 'Photo & Video Evidence', icon: Camera },
            { id: 'reports', label: 'Condition Reports & Decks', icon: Layers },
            { id: 'calendar', label: 'Visits & Zoom Room', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold whitespace-nowrap transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#C1A461] text-black shadow-md'
                    : 'bg-[#151518] text-white/50 hover:text-white hover:bg-[#1E1E22] border border-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Requests & Workflow */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {requests.map((req) => {
                const currentStageInfo = HOW_WE_WORK_STAGES[(req.currentStage || 1) - 1] || HOW_WE_WORK_STAGES[0];
                const statusLower = req.status.toLowerCase();
                return (
                  <div 
                    key={req.id}
                    className="p-7 rounded-3xl bg-[#151518] border border-white/5 space-y-6 shadow-xl"
                  >
                    {/* Card Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#C1A461]">{req.referenceNumber}</span>
                          <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-[#0A0A0B] text-white/60 border border-white/5">
                            {(req.serviceCategory || 'fire_alarm').replace('_', ' ')}
                          </span>
                          <span className={`text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full ${
                            statusLower.includes('complete') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            statusLower.includes('progress') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          }`}>
                            {req.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1.5">{req.serviceTitle}</h3>
                        <p className="text-xs text-white/50">{req.siteName} • {req.siteAddress}</p>
                      </div>

                      <div className="text-right sm:self-center">
                        <span className="text-[10px] font-mono text-white/40 uppercase">Target Category:</span>
                        <div className="text-sm font-bold text-[#C1A461]">Category {req.systemCategoryTarget || 'SANS 10139'}</div>
                      </div>
                    </div>

                    {/* 7-Stage Workflow Progress Stepper */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white/80">
                          Current Stage: <span className="text-[#C1A461]">Stage {req.currentStage} of 7 ({currentStageInfo.title})</span>
                        </span>
                        <span className="font-mono text-white/40">
                          {Math.round((req.currentStage / 7) * 100)}% Completed
                        </span>
                      </div>

                      {/* Bar */}
                      <div className="h-2 w-full bg-[#0A0A0B] rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-[#C1A461] to-[#D4BC7B] transition-all duration-500"
                          style={{ width: `${(req.currentStage / 7) * 100}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-white/50 italic font-normal">
                        "{currentStageInfo.shortDescription}"
                      </p>
                    </div>

                    {/* Technical Parameters Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 rounded-2xl bg-[#0A0A0B] border border-white/5 text-xs font-mono">
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase tracking-wider">Control Panel</span>
                        <span className="text-white/80">{req.existingSystemDetails?.panelBrand} ({req.existingSystemDetails?.loopCount} Loops)</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase tracking-wider">Preferred Date</span>
                        <span className="text-white/80">{req.preferredDate} ({req.preferredTimeSlot})</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase tracking-wider">Created</span>
                        <span className="text-white/80">{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-white/50">
                        Scope: <span className="text-white/70">{req.scopeDescription}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {reports.filter(r => r.requestId === req.id).map((rep) => (
                          <button
                            key={rep.id}
                            onClick={() => setSelectedReport(rep)}
                            className="px-3.5 py-2 bg-[#0A0A0B] hover:bg-[#1E1E22] border border-white/10 text-xs font-semibold rounded-xl text-white/80 flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#C1A461]" />
                            <span>{rep.reportType === 'pre_work' ? 'Pre-Work Report' : 'Post-Work Report'}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Registered Sites */}
        {activeTab === 'sites' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sites.map((site) => (
              <div key={site.id} className="p-7 rounded-3xl bg-[#151518] border border-white/5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0A0A0B] border border-white/5 flex items-center justify-center text-[#C1A461]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{site.name}</h3>
                      <p className="text-[11px] text-white/40 font-mono">{site.buildingType}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C1A461]">
                    Category {site.systemCategory}
                  </span>
                </div>

                <div className="text-xs text-white/60 space-y-2">
                  <div className="text-white/50">{site.address}</div>
                  <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-white/40">Panel Architecture:</span>
                      <span className="text-white/80">{site.panelDetails.brand} {site.panelDetails.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Loop / Zone Configuration:</span>
                      <span className="text-white/80">{site.panelDetails.loops} Loops • {site.panelDetails.zones} Zones</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Device Count:</span>
                      <span className="text-white/80">{site.panelDetails.totalDevices} Addressable Points</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Last Service Date:</span>
                      <span className="text-emerald-400">{site.lastServiceDate || 'Pending Schedule'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onRequestService}
                    className="w-full py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black rounded-xl text-xs uppercase tracking-[1.5px] font-bold transition text-center shadow-md"
                  >
                    Request SANS 10139 Service for Site
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Photo & Video Evidence */}
        {activeTab === 'evidence' && (
          <div className="space-y-8">
            {/* Photos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#C1A461]" />
                  <span>Audited Photographic Library ({photos.length} Captured Points)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div key={photo.id} className="p-5 rounded-3xl bg-[#151518] border border-white/5 space-y-3">
                    <div className="aspect-video rounded-2xl overflow-hidden bg-[#0A0A0B] border border-white/5 relative group">
                      <img src={photo.imageUrl} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                        photo.stage === 'before' ? 'bg-[#0A0A0B]/90 text-amber-300 border border-amber-500/30' :
                        photo.stage === 'during' ? 'bg-[#0A0A0B]/90 text-cyan-300 border border-cyan-500/30' :
                        'bg-[#0A0A0B]/90 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {photo.stage} Work
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#C1A461]">
                        {photo.categoryLabel}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{photo.caption}</h4>
                      <p className="text-[11px] text-white/50">{photo.areaLocation}</p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                      <span>Hash: {photo.hash}</span>
                      <span>{new Date(photo.capturedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-[#C1A461]" />
                <span>Operational Video Records & Sounder Audibility Clips</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((vid) => (
                  <div key={vid.id} className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-3">
                    <div className="aspect-video rounded-2xl overflow-hidden bg-[#0A0A0B] border border-white/5 relative flex items-center justify-center">
                      <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-[#0A0A0B]/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#C1A461] text-black flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition">
                          <Video className="w-5 h-5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2.5 right-2.5 bg-[#0A0A0B]/80 px-2 py-0.5 rounded text-[10px] font-mono text-white/60">
                        {vid.durationSeconds}s • {vid.resolution}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-white">{vid.title}</h4>
                      <p className="text-[11px] text-white/50">{vid.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pt-3 border-t border-white/5">
                      <span>Location: {vid.areaLocation}</span>
                      <span>Hash: {vid.hash}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Condition Reports & PowerPoint Decks */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            {/* Condition Reports */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C1A461]" />
                <span>Audited Condition Reports (SANS 10139 Standard)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-7 rounded-3xl bg-[#151518] border border-white/5 space-y-4 flex flex-col justify-between shadow-xl">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          rep.reportType === 'pre_work' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        }`}>
                          {rep.reportType === 'pre_work' ? 'Pre-Work Report' : 'Post-Work Report'}
                        </span>
                        <span className="text-xs font-mono text-white/40">{rep.reportNumber} (v{rep.version})</span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{rep.serviceTitle}</h4>
                      <p className="text-xs text-white/50">{rep.siteName}</p>
                      <p className="text-xs text-white/60 line-clamp-2">{rep.scopeSummary}</p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReport(rep)}
                        className="flex-1 py-2.5 bg-[#0A0A0B] hover:bg-[#1E1E22] text-white/80 text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer border border-white/5"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#C1A461]" />
                        <span>Preview & PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PowerPoint Presentations */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Presentation className="w-4 h-4 text-[#C1A461]" />
                <span>Executive PowerPoint Briefing Decks (.pptx)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {presentations.map((pres) => (
                  <div key={pres.id} className="p-7 rounded-3xl bg-[#151518] border border-white/5 space-y-4 flex flex-col justify-between shadow-xl">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-[#0A0A0B] text-[#C1A461] border border-[#C1A461]/30 px-2.5 py-0.5 rounded-full">
                          16:9 Master Deck
                        </span>
                        <span className="text-xs font-mono text-white/40">{pres.presentationNumber} (v{pres.version})</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{pres.title}</h4>
                      <p className="text-xs text-white/50">{pres.slides.length} Master Slides included with SANS 10139 compliance layout</p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPresentation(pres)}
                        className="flex-1 py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs uppercase tracking-[1.5px] font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
                      >
                        <Presentation className="w-3.5 h-3.5" />
                        <span>Slide Viewer & Export</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Meeting Minutes Hub */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C1A461]" />
                <span>AI Technical Consultation Minutes Archive</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {minutesList.map((min) => (
                  <div key={min.id} className="p-7 rounded-3xl bg-[#151518] border border-white/5 space-y-3 flex flex-col justify-between shadow-xl">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-[#0A0A0B] text-[#C1A461] border border-white/5 px-2.5 py-0.5 rounded-full">
                          AI Extracted
                        </span>
                        <span className="text-xs font-mono text-white/40">{min.dateTime}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{min.meetingTitle}</h4>
                      <p className="text-xs text-white/60 line-clamp-2">{min.executiveSummary}</p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedMinutes(min)}
                        className="flex-1 py-2.5 bg-[#0A0A0B] hover:bg-[#1E1E22] text-white/80 text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer border border-white/5"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#C1A461]" />
                        <span>View Minutes & Action Items</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Calendar & Zoom Room */}
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Scheduled Appointments (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C1A461]" />
                <span>Confirmed Engineering Visits & Google Calendar Schedule</span>
              </h3>

              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-3 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <h4 className="font-bold text-sm text-white">{apt.title}</h4>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-[#0A0A0B] text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        {apt.status}
                      </span>
                    </div>

                    <div className="text-xs text-white/60 space-y-1.5">
                      <p className="text-white/50">{apt.description}</p>
                      <div className="flex flex-wrap gap-4 pt-1 font-mono text-[11px] text-white/40">
                        <span>Date: {apt.date} ({apt.startTime} – {apt.endTime})</span>
                        <span>Site: {apt.siteName}</span>
                      </div>
                      <div className="text-[11px] text-[#C1A461] font-mono">
                        Assigned Engineer: {apt.engineerName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protected Zoom Card (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-[#C1A461]" />
                <span>Virtual Consultation Room</span>
              </h3>
              <ZoomMeetingCard onOpenAiMinutes={() => setSelectedMinutes(minutesList[0])} />
            </div>
          </div>
        )}

        {/* Tab 6: SANS 10139 Compliance & Certificates */}
        {activeTab === 'sans_compliance' && (
          <div className="space-y-8">
            {/* Real-time SANS 10139 Alignment Status Card */}
            <ComplianceStatusBadge
              variant="card"
              onOpenLogbook={() => setLogbookModalOpen(true)}
              onOpenCoc={(coc) => {
                if (coc) {
                  setSelectedCoc(coc);
                  setCocModalOpen(true);
                }
              }}
              onOpenDefects={() => {}}
              onRequestAudit={onRequestService}
            />

            {/* Quick Hero Banner */}
            <div className="p-7 rounded-3xl bg-[#151518] border border-white/5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C1A461]" />
                  <span className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
                    Statutory Life-Safety Verification
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  SANS 10139 Digital Compliance Vault
                </h3>
                <p className="text-xs text-white/50 max-w-2xl leading-relaxed">
                  Every building system installed or serviced by Audrin Fire Engineers is certified under SANS 10139 code with SAQCC-registered Commissioner signatures, tamper-evident cryptographic hashes, and permanent digital log book archiving.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setLogbookModalOpen(true)}
                  className="px-4 py-2.5 bg-[#0A0A0B] hover:bg-[#1E1E22] border border-[#C1A461]/30 text-[#C1A461] text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open Site Log Book</span>
                </button>
                <button
                  onClick={() => setLegendInspectorOpen(true)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Coverage Radiuses</span>
                </button>
              </div>
            </div>

            {/* Issued Certificates of Compliance Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-[1.5px]">
                Statutory Certificates of Compliance ({cocs.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cocs.map((coc) => (
                  <div
                    key={coc.id}
                    className="p-7 rounded-3xl bg-[#151518] border border-white/5 space-y-5 shadow-xl flex flex-col justify-between hover:border-[#C1A461]/30 transition"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-[#C1A461] font-bold">{coc.cocNumber}</span>
                        <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                          {coc.overallComplianceStatus}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white">{coc.siteName}</h4>
                        <p className="text-xs text-white/50">{coc.siteAddress}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#0D0D0E] border border-white/5 space-y-2 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-white/50">System Category:</span>
                          <span className="text-[#C1A461] font-bold">Category {coc.systemCategory}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Standby Autonomy:</span>
                          <span className="text-white">{coc.powerSupplyAutonomy.standbyAutonomyHours}h Quiescent + {coc.powerSupplyAutonomy.evacuateAlarmDurationMinutes}m Evac</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Bedhead Sounder Level:</span>
                          <span className="text-white">{coc.audibilityAndSounders.soundLevelBedheadDba} dB(A)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">SAQCC Commissioner:</span>
                          <span className="text-white">{coc.commissionerName} ({coc.commissionerSaqccNumber})</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCoc(coc);
                        setCocModalOpen(true);
                      }}
                      className="w-full py-3 bg-[#0A0A0B] hover:bg-[#1E1E22] text-[#C1A461] border border-[#C1A461]/30 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>View Official Certificate & PDF</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Log Book Summary Preview */}
            <div className="p-7 rounded-3xl bg-[#151518] border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">SANS 10139 Site Log Book Records</h3>
                  <p className="text-xs text-white/50">Mandatory routine tests, sounder actuations, and detector calibrations.</p>
                </div>
                <button
                  onClick={() => setLogbookModalOpen(true)}
                  className="px-4 py-2 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase rounded-xl transition"
                >
                  View Full Logbook &rarr;
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {logbookEntries.slice(0, 4).map((entry) => (
                  <div key={entry.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-[#C1A461]">
                          {entry.entryType}
                        </span>
                        <span className="font-bold text-white">{entry.siteName}</span>
                      </div>
                      <p className="text-white/60 text-[11px] mt-1">{entry.notes}</p>
                    </div>

                    <div className="font-mono text-[10px] text-white/40 sm:text-right shrink-0">
                      <div>{entry.date} &middot; {entry.time}</div>
                      <div className="text-white/30">{entry.inspectedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Modals */}
      <ConditionReportModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />

      <PresentationPreviewModal
        presentation={selectedPresentation}
        onClose={() => setSelectedPresentation(null)}
      />

      <AiMinutesModal
        minutes={selectedMinutes}
        onClose={() => setSelectedMinutes(null)}
      />

      <SansLogbookModal
        isOpen={logbookModalOpen}
        onClose={() => setLogbookModalOpen(false)}
      />

      <SansCocGeneratorModal
        isOpen={cocModalOpen}
        onClose={() => setCocModalOpen(false)}
        existingCoc={selectedCoc}
      />

      <SansDeviceLegendInspector
        isOpen={legendInspectorOpen}
        onClose={() => setLegendInspectorOpen(false)}
      />
    </div>
  );
};

