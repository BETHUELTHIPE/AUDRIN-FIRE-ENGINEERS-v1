import React, { useState } from 'react';
import { useAudrinStore } from '../../services/store';
import { PostWorkInspectionRecord, ComponentInstalledItem, TestEquipmentItem, PhotoEvidenceItem } from '../../types';
import { SourceRequirementDrawer } from './SourceRequirementDrawer';
import { DigitalSignatureModal } from './DigitalSignatureModal';
import { 
  FileText, 
  ShieldCheck, 
  X, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Upload, 
  Lock, 
  BookOpen, 
  Volume2, 
  BatteryCharging, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2,
  Cpu,
  Layers,
  Award
} from 'lucide-react';

interface PostWorkInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspectionId?: string;
  onSaved?: () => void;
}

export const PostWorkInspectionModal: React.FC<PostWorkInspectionModalProps> = ({
  isOpen,
  onClose,
  inspectionId,
  onSaved
}) => {
  const store = useAudrinStore();
  const sites = store.getSites();
  const currentUser = store.getCurrentUser();
  const branding = store.getCurrentCompanyBranding();
  const preWorkInspections = store.getPreWorkInspections();

  const existing = inspectionId ? store.getPostWorkInspectionById(inspectionId) : undefined;

  const [activeSection, setActiveSection] = useState<'A' | 'B' | 'C'>('A');

  // Source citation drawer state
  const [citationDrawerOpen, setCitationDrawerOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | undefined>();
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>();

  // Signatures
  const [techSignModalOpen, setTechSignModalOpen] = useState(false);
  const [clientSignModalOpen, setClientSignModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<PostWorkInspectionRecord>(existing || {
    id: `post-${Date.now()}`,
    inspectionNumber: `POST-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    preWorkInspectionId: preWorkInspections[0]?.id || 'pre-01',
    preWorkInspectionNumber: preWorkInspections[0]?.inspectionNumber || 'PRE-2026-0041',
    siteId: sites[0]?.id || 'site-01',
    siteName: sites[0]?.name || 'Menlyn Central Commercial Park - Tower A',
    clientId: branding.orgId,
    clientName: branding.registeredName,
    workOrderNumber: `WO-AFE-2026-${Math.floor(100 + Math.random() * 900)}`,
    completionDateTime: new Date().toISOString(),
    leadTechnicianName: currentUser.name || 'Sipho Ndlovu',
    leadTechnicianSaqcc: 'SAQCC-8812040987',
    
    // Section A
    actualWorkCompleted: 'Full testing of 4 addressable detection loops, acoustic sounder level bedhead verification, secondary standby battery calculation, and restoration of all isolations to quiescent normal status.',
    deviationsFromScope: 'None. All tested elements conform to SANS 10139 and SANS 10400-T specifications.',
    clientExclusions: 'Tenant demised IT server room gaseous suppression discharge testing excluded per client directive.',
    componentsInstalled: [
      {
        itemType: 'optical_smoke',
        make: 'Apollo',
        model: 'Discovery Optical Smoke (58000-600)',
        serialOrAddress: 'Loop 3 / Addr 12-35',
        location: 'Level 3 Commercial Office Suites',
        quantity: 24
      }
    ],
    
    // Section B: Test Results
    visualInspectionPassed: true,
    panelOperationalCheckPassed: true,
    zonesLoopsTestedCount: 4,
    alarmSounderTestedDba: 71.5, // >= 65 dB(A) pass
    sounderLevelPass: true,
    standbyAutonomyTestedHours: 24.5, // >= 24h pass
    evacuationAlarmDurationMinutes: 30, // >= 30m pass
    powerAutonomyPass: true,
    mainsFailFaultNotificationMinutes: 12, // <= 30m pass
    detectorFaultResponseSeconds: 85, // <= 200s pass
    faultResponsePass: true,
    mcpMountingHeightM: 1.4, // 1.4m pass
    mcpMountingPass: true,
    smokeDetectorRadiusM: 7.2, // <= 7.5m pass
    heatDetectorRadiusM: 4.8, // <= 5.3m pass
    detectorSitingPass: true,
    cablingPH30Verified: true,
    cablingPass: true,
    singleFaultAreaM2: 780, // <= 1000m2 pass
    singleFaultPass: true,
    
    testEquipmentUsed: [
      {
        equipmentName: 'Solo 330 Smoke Detector Aerosol Tester',
        serialNumber: 'SOLO-88412-SA',
        calibrationExpiryDate: '2027-04-15'
      },
      {
        equipmentName: 'Testo 815 Type 2 Sound Level Meter',
        serialNumber: 'TESTO-49102-CAL',
        calibrationExpiryDate: '2027-01-20'
      },
      {
        equipmentName: 'Fluke 87V Industrial Multimeter & Battery Tester',
        serialNumber: 'FLUKE-901844-ZA',
        calibrationExpiryDate: '2026-12-10'
      }
    ],
    
    // Section C: Restoration
    isolationsRemovedTimestamp: new Date().toISOString(),
    systemFullyRestored: true,
    outstandingImpairments: 'None. All circuits and output relays returned to normal quiescent state.',
    clientDemonstrationCompleted: true,
    documentsHandedOver: ['SANS 10139 Site Logbook Entry Recorded', 'Sound Level Meter Test Record', 'Zone 3 As-Built CAD Markup'],
    afterPhotos: [
      {
        id: `photo-post-${Date.now()}-1`,
        url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
        caption: 'CIE Main Foyer in Quiescent Healthy State with zero active faults',
        timestamp: new Date().toISOString(),
        location: 'Ground Floor Security Room',
        uploadedBy: currentUser.name,
        tags: ['CIE', 'Quiescent', 'Post-Work'],
        isPreWork: false
      }
    ],
    asBuiltDrawingsAttached: true,
    technicianDeclarationSigned: false,
    clientAcknowledgementSigned: false,
    workflowStatus: 'draft',
    sourceCoverageStatus: 'source_limited_draft',
    sourceCitations: [
      {
        sourceDocId: 'src-doc-02',
        sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
        pdfPage: 4,
        clauseOrQuestion: 'Question 1(r)',
        approvedParaphrase: 'Bedhead sound level ≥ 65 dB(A) with doors closed.'
      },
      {
        sourceDocId: 'src-doc-02',
        sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
        pdfPage: 3,
        clauseOrQuestion: 'Question 1(g)',
        approvedParaphrase: 'Standby power autonomy ≥ 24h quiescent + 30 min full alarm.'
      }
    ],
    locked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [newComp, setNewComp] = useState<ComponentInstalledItem>({
    itemType: 'optical_smoke',
    make: '',
    model: '',
    serialOrAddress: '',
    location: '',
    quantity: 1
  });

  const [photoCaption, setPhotoCaption] = useState('');

  if (!isOpen) return null;

  const handleOpenCitation = (reqId: string, docId?: string) => {
    setSelectedReqId(reqId);
    setSelectedDocId(docId);
    setCitationDrawerOpen(true);
  };

  const handleAddComponent = () => {
    if (newComp.make.trim() && newComp.model.trim()) {
      setFormData(prev => ({
        ...prev,
        componentsInstalled: [...prev.componentsInstalled, newComp]
      }));
      setNewComp({
        itemType: 'optical_smoke',
        make: '',
        model: '',
        serialOrAddress: '',
        location: '',
        quantity: 1
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPhoto: PhotoEvidenceItem = {
        id: `photo-post-${Date.now()}`,
        url: URL.createObjectURL(file),
        caption: photoCaption.trim() || file.name,
        timestamp: new Date().toISOString(),
        location: 'Site Location',
        uploadedBy: currentUser.name,
        tags: ['Post-Work', 'Completion'],
        isPreWork: false
      };

      setFormData(prev => ({
        ...prev,
        afterPhotos: [...prev.afterPhotos, newPhoto]
      }));
      setPhotoCaption('');
    }
  };

  // Live recalculations of SANS thresholds
  const updateSounderDba = (val: number) => {
    const pass = val >= 65.0 && val <= 130.0;
    setFormData(prev => ({
      ...prev,
      alarmSounderTestedDba: val,
      sounderLevelPass: pass
    }));
  };

  const updateAutonomyHours = (val: number) => {
    const pass = val >= 24.0 && formData.evacuationAlarmDurationMinutes >= 30;
    setFormData(prev => ({
      ...prev,
      standbyAutonomyTestedHours: val,
      powerAutonomyPass: pass
    }));
  };

  const updateFaultResponseSec = (val: number) => {
    const pass = val <= 200;
    setFormData(prev => ({
      ...prev,
      detectorFaultResponseSeconds: val,
      faultResponsePass: pass
    }));
  };

  const updateMcpHeight = (val: number) => {
    const pass = val >= 1.2 && val <= 1.6;
    setFormData(prev => ({
      ...prev,
      mcpMountingHeightM: val,
      mcpMountingPass: pass
    }));
  };

  const updateSmokeRadius = (val: number) => {
    const pass = val <= 7.5;
    setFormData(prev => ({
      ...prev,
      smokeDetectorRadiusM: val,
      detectorSitingPass: pass
    }));
  };

  const handleSaveDraft = () => {
    if (existing) {
      store.updatePostWorkInspection(formData);
    } else {
      store.addPostWorkInspection(formData);
    }
    if (onSaved) onSaved();
    onClose();
  };

  const handleApproveAndLock = () => {
    const approvedData: PostWorkInspectionRecord = {
      ...formData,
      workflowStatus: 'approved',
      locked: true,
      updatedAt: new Date().toISOString()
    };
    if (existing) {
      store.updatePostWorkInspection(approvedData);
    } else {
      store.addPostWorkInspection(approvedData);
    }
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-5xl bg-[#121215] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="p-6 bg-gradient-to-r from-[#1E1E24] via-[#16161A] to-[#121215] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/40 font-mono uppercase">
                Section 6 &middot; Post-Work SANS 10139 Verification
              </span>
              <span className="text-xs font-mono text-white/50">
                {formData.inspectionNumber}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                formData.workflowStatus === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
              }`}>
                {formData.workflowStatus}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Post-Work Fire Detection Inspection &amp; Commissioning Verification
            </h2>
            <p className="text-xs text-white/60">
              Pre-Work Ref: <span className="text-[#C1A461] font-mono font-bold">{formData.preWorkInspectionNumber}</span> &middot; Site: <span className="text-white font-medium">{formData.siteName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenCitation('req-poe-q1r-1s', 'src-doc-02')}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#C1A461] text-xs font-bold font-mono flex items-center gap-1.5 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              SANS Tolerances (2 PDFs)
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Source Limited Notice */}
        <div className="px-6 py-2.5 bg-amber-950/40 border-b border-amber-500/30 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-amber-300 font-mono text-[11px]">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>SOURCE-LIMITED DRAFT - NOT AN ISSUABLE CERTIFICATE</strong> &middot; Automated threshold verification against SANS 10400-T &amp; POE module.</span>
          </div>
          <span className="text-[10px] font-mono text-white/40 hidden md:inline">
            Zero Extrapolated AI Rules
          </span>
        </div>

        {/* Section Tabs */}
        <div className="px-6 py-3 bg-[#0A0A0C] border-b border-white/5 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveSection('A')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSection === 'A'
                ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            Section A: Scope Completion &amp; Component Register
          </button>

          <button
            onClick={() => setActiveSection('B')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSection === 'B'
                ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Section B: Commissioning Tests &amp; SANS Tolerance Gates
          </button>

          <button
            onClick={() => setActiveSection('C')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSection === 'C'
                ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Section C: Restoration, Evidence &amp; Handover Sign-off
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow text-xs">
          
          {/* SECTION A */}
          {activeSection === 'A' && (
            <div className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Actual Work Completed *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.actualWorkCompleted}
                    onChange={e => setFormData({ ...formData, actualWorkCompleted: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Deviations from Agreed Work Scope (if any)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.deviationsFromScope || ''}
                    onChange={e => setFormData({ ...formData, deviationsFromScope: e.target.value })}
                    placeholder="Enter any approved design variations or 'None'..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-[#C1A461]"
                  />
                </div>
              </div>

              {/* Component Installed Register */}
              <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#C1A461]" />
                    Components Installed / Replaced Register
                  </h3>
                  <span className="text-[10px] font-mono text-white/40">
                    {formData.componentsInstalled.length} Item(s)
                  </span>
                </div>

                {/* Add new component form row */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
                  <div>
                    <label className="text-white/40 block text-[10px]">Type</label>
                    <select
                      value={newComp.itemType}
                      onChange={e => setNewComp({ ...newComp, itemType: e.target.value as any })}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs"
                    >
                      <option value="optical_smoke">Optical Smoke</option>
                      <option value="heat_detector">Heat Detector</option>
                      <option value="multi_sensor">Multi-Sensor</option>
                      <option value="manual_call_point">Manual Call Point</option>
                      <option value="sounder">Sounder / VAD</option>
                      <option value="interface_module">Interface Module</option>
                      <option value="battery">Standby Battery</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">Make</label>
                    <input
                      type="text"
                      placeholder="e.g. Apollo"
                      value={newComp.make}
                      onChange={e => setNewComp({ ...newComp, make: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">Model</label>
                    <input
                      type="text"
                      placeholder="e.g. Discovery"
                      value={newComp.model}
                      onChange={e => setNewComp({ ...newComp, model: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">Serial / Loop Addr</label>
                    <input
                      type="text"
                      placeholder="e.g. Loop 3 / Addr 24"
                      value={newComp.serialOrAddress}
                      onChange={e => setNewComp({ ...newComp, serialOrAddress: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 block text-[10px]">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Level 3 East"
                      value={newComp.location}
                      onChange={e => setNewComp({ ...newComp, location: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddComponent}
                      className="w-full py-2 rounded-lg bg-[#C1A461] hover:bg-[#d5b976] text-black font-bold text-xs"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>

                {/* Table of installed components */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 text-[10px] font-mono uppercase">
                        <th className="py-2">Type</th>
                        <th className="py-2">Make / Model</th>
                        <th className="py-2">Serial / Loop Address</th>
                        <th className="py-2">Location</th>
                        <th className="py-2">Qty</th>
                        <th className="py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {formData.componentsInstalled.map((comp, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="py-2.5 font-mono text-[#C1A461]">{comp.itemType}</td>
                          <td className="py-2.5 font-medium text-white">{comp.make} {comp.model}</td>
                          <td className="py-2.5 font-mono text-white/70">{comp.serialOrAddress}</td>
                          <td className="py-2.5 text-white/70">{comp.location}</td>
                          <td className="py-2.5 font-mono text-white">{comp.quantity}</td>
                          <td className="py-2.5">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                componentsInstalled: prev.componentsInstalled.filter((_, i) => i !== idx)
                              }))}
                              className="text-red-400 hover:underline text-[11px]"
                            >
                              Remove
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

          {/* SECTION B: SANS TOLERANCE GATES */}
          {activeSection === 'B' && (
            <div className="space-y-5">
              
              <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-[#C1A461]" />
                      1. Sounder Audibility &amp; Acoustic Verification
                    </h3>
                    <p className="text-xs text-white/50">Summative POE Q1(r) &amp; Q1(s) Requirement</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenCitation('req-poe-q1r-1s', 'src-doc-02')}
                    className="text-[10px] font-mono text-[#C1A461] hover:underline flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> View POE Q1(r) Citation
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                      Tested Bedhead Sound Level (dB(A)) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.alarmSounderTestedDba}
                      onChange={e => updateSounderDba(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm font-bold"
                    />
                    <div className="text-[10px] text-white/40 mt-1 font-mono">
                      Pass Rule: &ge; 65.0 dB(A) (Max 130 dB(A))
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className={`p-4 rounded-xl border w-full flex items-center gap-3 ${
                      formData.sounderLevelPass
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                        : 'bg-red-950/40 border-red-500/40 text-red-400'
                    }`}>
                      {formData.sounderLevelPass ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 shrink-0" />
                          <div>
                            <div className="font-bold text-xs">PASS &middot; SANS 10139 Audibility Met</div>
                            <div className="text-[10px] opacity-80">Complies with bedhead waking threshold.</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-5 h-5 shrink-0" />
                          <div>
                            <div className="font-bold text-xs">FAIL &middot; Below 65 dB(A) Limit</div>
                            <div className="text-[10px] opacity-80">Creates automatic critical defect.</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Standby Power Autonomy */}
              <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BatteryCharging className="w-4 h-4 text-[#C1A461]" />
                      2. Secondary Power Autonomy &amp; Mains Fail Latency
                    </h3>
                    <p className="text-xs text-white/50">Summative POE Q1(g) Requirement</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenCitation('req-poe-q1g', 'src-doc-02')}
                    className="text-[10px] font-mono text-[#C1A461] hover:underline flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> View POE Q1(g) Citation
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                      Standby Autonomy Capacity (Hours) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.standbyAutonomyTestedHours}
                      onChange={e => updateAutonomyHours(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm font-bold"
                    />
                    <div className="text-[10px] text-white/40 mt-1 font-mono">
                      Pass Rule: &ge; 24.0 Hours Quiescent
                    </div>
                  </div>

                  <div>
                    <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                      Full Evacuation Alarm Duration (Minutes) *
                    </label>
                    <input
                      type="number"
                      value={formData.evacuationAlarmDurationMinutes}
                      onChange={e => setFormData({ ...formData, evacuationAlarmDurationMinutes: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm font-bold"
                    />
                    <div className="text-[10px] text-white/40 mt-1 font-mono">
                      Pass Rule: &ge; 30 Minutes Alarm
                    </div>
                  </div>

                  <div>
                    <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                      Mains Failure Signal Latency (Minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.mainsFailFaultNotificationMinutes}
                      onChange={e => setFormData({ ...formData, mainsFailFaultNotificationMinutes: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm font-bold"
                    />
                    <div className="text-[10px] text-white/40 mt-1 font-mono">
                      Pass Rule: &le; 30 Minutes
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Fault Latency, Siting, MCP & Cabling */}
              <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white">
                  3. Circuit Diagnostics &amp; Physical Geometry Verification
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  
                  {/* Fault response time */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/40 block text-[10px] font-mono uppercase">
                        Fault Latency (Sec) *
                      </label>
                      <button type="button" onClick={() => handleOpenCitation('req-poe-q1e', 'src-doc-02')} className="text-[9px] text-[#C1A461]">
                        POE Q1(e)
                      </button>
                    </div>
                    <input
                      type="number"
                      value={formData.detectorFaultResponseSeconds}
                      onChange={e => updateFaultResponseSec(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                    />
                    <div className="text-[10px] text-white/40 mt-1 font-mono">&le; 200s Threshold</div>
                  </div>

                  {/* MCP Height */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/40 block text-[10px] font-mono uppercase">
                        MCP Height (M) *
                      </label>
                      <button type="button" onClick={() => handleOpenCitation('req-poe-q21', 'src-doc-02')} className="text-[9px] text-[#C1A461]">
                        POE Q21
                      </button>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.mcpMountingHeightM}
                      onChange={e => updateMcpHeight(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                    />
                    <div className="text-[10px] text-white/40 mt-1 font-mono">1.4m (&plusmn;0.2m)</div>
                  </div>

                  {/* Smoke detector radius */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/40 block text-[10px] font-mono uppercase">
                        Smoke Radius (M) *
                      </label>
                      <button type="button" onClick={() => handleOpenCitation('req-poe-q11', 'src-doc-02')} className="text-[9px] text-[#C1A461]">
                        POE Q11
                      </button>
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.smokeDetectorRadiusM}
                      onChange={e => updateSmokeRadius(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                    />
                    <div className="text-[10px] text-white/40 mt-1 font-mono">&le; 7.5m Radius</div>
                  </div>

                  {/* Single fault limit */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white/40 block text-[10px] font-mono uppercase">
                        Fault Area (m&sup2;) *
                      </label>
                      <button type="button" onClick={() => handleOpenCitation('req-poe-q1n', 'src-doc-02')} className="text-[9px] text-[#C1A461]">
                        POE Q1(n)
                      </button>
                    </div>
                    <input
                      type="number"
                      value={formData.singleFaultAreaM2}
                      onChange={e => setFormData({ ...formData, singleFaultAreaM2: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                    />
                    <div className="text-[10px] text-white/40 mt-1 font-mono">&le; 1,000 m&sup2; Max</div>
                  </div>

                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.cablingPH30Verified}
                      onChange={e => setFormData({ ...formData, cablingPH30Verified: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">PH 30 Enhanced Fire-Resistant Red Cabling Confirmed (POE Q1(d))</span>
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* SECTION C: RESTORATION & SIGNATURES */}
          {activeSection === 'C' && (
            <div className="space-y-5">
              
              {/* Restoration Checklist */}
              <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C1A461]" />
                  System Restoration &amp; Handover Protocols
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.systemFullyRestored}
                      onChange={e => setFormData({ ...formData, systemFullyRestored: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">All Isolations Cleared</span>
                  </label>

                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.clientDemonstrationCompleted}
                      onChange={e => setFormData({ ...formData, clientDemonstrationCompleted: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">Client Handover Demonstrated</span>
                  </label>

                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.asBuiltDrawingsAttached}
                      onChange={e => setFormData({ ...formData, asBuiltDrawingsAttached: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">As-Built Markup Attached</span>
                  </label>
                </div>

                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Outstanding Impairments or Advisory Notes
                  </label>
                  <input
                    type="text"
                    value={formData.outstandingImpairments || ''}
                    onChange={e => setFormData({ ...formData, outstandingImpairments: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-[#C1A461]"
                  />
                </div>
              </div>

              {/* After Photos Upload Box */}
              <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#C1A461]" />
                    Post-Work Completion Photographic Evidence
                  </h3>
                  <span className="text-[10px] font-mono text-white/40">
                    {formData.afterPhotos.length} Photo(s)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={photoCaption}
                    onChange={e => setPhotoCaption(e.target.value)}
                    placeholder="Caption for completion photo (e.g. CIE restored to 0 faults)..."
                    className="flex-grow px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black font-bold text-xs cursor-pointer flex items-center justify-center gap-2 shrink-0">
                    <Upload className="w-4 h-4" />
                    Upload After Photo
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {formData.afterPhotos.map((photo: any, i) => (
                    <div key={photo.id} className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-2">
                      <img src={photo.url || photo.imageUrl} alt={photo.caption} className="w-full h-32 object-cover rounded-lg" />
                      <div className="text-xs font-bold text-white truncate">{photo.caption}</div>
                      <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
                        <span>{photo.timestamp ? new Date(photo.timestamp).toLocaleTimeString() : 'Recorded'}</span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            afterPhotos: prev.afterPhotos.filter((p: any) => p.id !== photo.id)
                          }))}
                          className="text-red-400 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Signatures Box */}
              <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C1A461]" />
                    Dual Digital Signatures &amp; OTP Verification
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Section 8 Cryptographic Sign-off
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Technician Signature */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                    <div className="font-bold text-white text-xs flex items-center justify-between">
                      <span>Lead Technician Declaration</span>
                      {formData.technicianDeclarationSigned ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono">
                          Signed &amp; OTP Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-mono">
                          Signature Pending
                        </span>
                      )}
                    </div>

                    {formData.technicianSignature ? (
                      <div className="space-y-1 text-[11px] font-mono text-white/70">
                        <div>Signer: <strong className="text-white">{formData.technicianSignature.signerName}</strong></div>
                        <div>Timestamp: {new Date(formData.technicianSignature.signatureTimestamp).toLocaleString()}</div>
                        <div className="text-[10px] text-white/40 truncate">Hash: {formData.technicianSignature.documentSha256Hash}</div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setTechSignModalOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black font-bold text-xs"
                      >
                        Sign Technician Declaration (with OTP)
                      </button>
                    )}
                  </div>

                  {/* Client Signature */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                    <div className="font-bold text-white text-xs flex items-center justify-between">
                      <span>Client Acceptance &amp; Handover</span>
                      {formData.clientAcknowledgementSigned ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono">
                          Signed &amp; OTP Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-mono">
                          Signature Pending
                        </span>
                      )}
                    </div>

                    {formData.clientSignature ? (
                      <div className="space-y-1 text-[11px] font-mono text-white/70">
                        <div>Signer: <strong className="text-white">{formData.clientSignature.signerName}</strong></div>
                        <div>Timestamp: {new Date(formData.clientSignature.signatureTimestamp).toLocaleString()}</div>
                        <div className="text-[10px] text-white/40 truncate">Hash: {formData.clientSignature.documentSha256Hash}</div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setClientSignModalOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
                      >
                        Sign Client Acceptance (with OTP)
                      </button>
                    )}
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-[#151518] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] font-mono text-white/40">
            Form Ref: {formData.inspectionNumber} &middot; Status: {formData.workflowStatus.toUpperCase()}
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>

            <button
              type="button"
              onClick={handleApproveAndLock}
              className="px-6 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-[#C1A461]/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve &amp; Lock Post-Work Record
            </button>
          </div>
        </div>

      </div>

      {/* Citation Drawer */}
      <SourceRequirementDrawer
        isOpen={citationDrawerOpen}
        onClose={() => setCitationDrawerOpen(false)}
        requirementId={selectedReqId}
        sourceDocId={selectedDocId}
      />

      {/* Technician Digital Signature Modal */}
      <DigitalSignatureModal
        isOpen={techSignModalOpen}
        onClose={() => setTechSignModalOpen(false)}
        onSignComplete={(sig) => {
          setFormData(prev => ({
            ...prev,
            technicianSignature: sig,
            technicianDeclarationSigned: true
          }));
        }}
        documentTitle="Post-Work Fire Detection Inspection & Completion"
        documentNumber={formData.inspectionNumber}
        defaultSignerName={formData.leadTechnicianName}
        defaultSignerRole="Lead Fire Detection Technician (SAQCC Certified)"
        defaultSignerEmail="technicians@audrinfire.co.za"
        consentStatement="I hereby declare that the fire detection system work, tests, and restoration were conducted in full accordance with SANS 10139 and SANS 10400-T."
      />

      {/* Client Digital Signature Modal */}
      <DigitalSignatureModal
        isOpen={clientSignModalOpen}
        onClose={() => setClientSignModalOpen(false)}
        onSignComplete={(sig) => {
          setFormData(prev => ({
            ...prev,
            clientSignature: sig,
            clientAcknowledgementSigned: true
          }));
        }}
        documentTitle="Post-Work Fire Detection Inspection & Completion"
        documentNumber={formData.inspectionNumber}
        defaultSignerName={branding.primaryContact.name}
        defaultSignerRole="Head of Facilities & Life Safety"
        defaultSignerEmail={branding.primaryContact.email}
        consentStatement="I acknowledge that the system has been restored to fully operational quiescent condition and all handover documents received."
      />

    </div>
  );
};
