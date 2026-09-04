import React, { useState } from 'react';
import { useAudrinStore } from '../../services/store';
import { PreWorkInspectionRecord, PhotoEvidenceItem, SourceCitation } from '../../types';
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
  MapPin, 
  Calendar, 
  User, 
  Zap, 
  Clock, 
  Eye, 
  Plus, 
  Trash2,
  HelpCircle,
  Award
} from 'lucide-react';

interface PreWorkInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspectionId?: string;
  onSaved?: () => void;
}

export const PreWorkInspectionModal: React.FC<PreWorkInspectionModalProps> = ({
  isOpen,
  onClose,
  inspectionId,
  onSaved
}) => {
  const store = useAudrinStore();
  const sites = store.getSites();
  const currentUser = store.getCurrentUser();
  const issuerSettings = store.getIssuerSettings();
  const branding = store.getCurrentCompanyBranding();

  const existing = inspectionId ? store.getPreWorkInspectionById(inspectionId) : undefined;

  // Active section tab inside modal
  const [activeSection, setActiveSection] = useState<'A' | 'B' | 'C' | 'D'>('A');

  // Source drawer state
  const [citationDrawerOpen, setCitationDrawerOpen] = useState(false);
  const [selectedReqId, setSelectedReqId] = useState<string | undefined>();
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>();

  // Signature modal state
  const [techSignModalOpen, setTechSignModalOpen] = useState(false);
  const [clientSignModalOpen, setClientSignModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<PreWorkInspectionRecord>(existing || {
    id: `pre-${Date.now()}`,
    inspectionNumber: `PRE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    siteId: sites[0]?.id || 'site-01',
    siteName: sites[0]?.name || 'Menlyn Central Commercial Park - Tower A',
    clientId: branding.orgId,
    clientName: branding.registeredName,
    workOrderNumber: `WO-AFE-2026-${Math.floor(100 + Math.random() * 900)}`,
    purchaseOrderNumber: branding.purchaseOrderReference || 'PO-2026-8841',
    inspectionDateTime: new Date().toISOString(),
    leadTechnicianName: currentUser.name || 'Sipho Ndlovu',
    leadTechnicianSaqcc: 'SAQCC-8812040987',
    clientRepresentativeName: branding.primaryContact.name,
    personsPresent: [currentUser.name, branding.primaryContact.name],
    reasonForInspection: 'Quarterly SANS 10139 routine audit and pre-work baseline condition survey.',
    proposedWorkScope: 'Comprehensive inspection of 4 addressable loops, standby power discharge calculation, and loop isolation protocol prior to hot work fitout.',
    
    // Safety & Access
    accessPermissionGranted: true,
    siteInductionCompleted: true,
    siteHazardsIdentified: ['Live 230V AC DB panel', 'Working at height (> 3m)', 'Tenant occupied premises'],
    riskControlsInPlace: true,
    ppeCompliant: true,
    permitToWorkRequired: true,
    permitNumber: `PTW-MEN-2026-${Math.floor(100 + Math.random() * 900)}`,
    highRiskAreaNotes: 'Server Room has gaseous suppression; manual hold-off pins inserted during loop test.',
    plannedImpairmentsAgreed: true,
    escalationContactsRecorded: `${branding.emergencyContact.name}: ${branding.emergencyContact.telephone}`,
    
    // Existing System Condition
    panelMakeModel: 'Advanced Electronics MxPro 5 (4-Loop)',
    systemCategory: 'L1',
    panelLocation: 'Ground Floor Security Control Room',
    mainsSupplyNormal: true,
    batteryVoltageVdc: 27.4,
    batteryChargerOperational: true,
    activeFaultIndicators: [],
    zoneLoopCount: 4,
    disabledIsolatedPoints: [],
    detectorsPhysicalCondition: 'intact',
    manualCallPointsCondition: 'normal',
    soundersCondition: 'verified_audible',
    interfacesCondition: 'HVAC trip & BMS interface relays operational',
    cablingCondition: 'ph30_compliant_red',
    containmentFireStoppingOk: true,
    existingLogbookAvailable: true,
    asBuiltDrawingsAvailable: true,
    zoneChartAvailable: true,
    priorCocAvailable: true,
    
    // Baseline evidence
    beforePhotos: [
      {
        id: `photo-pre-${Date.now()}-1`,
        url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        caption: 'CIE Main Display in Quiescent state prior to work commencement',
        timestamp: new Date().toISOString(),
        location: 'Ground Floor Security Foyer',
        uploadedBy: currentUser.name,
        tags: ['CIE', 'Quiescent', 'Pre-Work'],
        isPreWork: true
      }
    ],
    defectsFound: [],
    agreedIsolationsStartTimestamp: new Date().toISOString(),
    temporaryMeasuresInPlace: 'Dedicated manual security fire watch assigned during loop isolation window.',
    affectedPartiesNotified: true,
    scopeConfirmationNotes: 'Work scope reviewed and acknowledged by building life safety officer.',
    clientExclusions: 'Tenant demised IT server room gaseous suppression discharge testing excluded.',
    
    workflowStatus: 'draft',
    sourceCoverageStatus: 'source_limited_draft',
    sourceCitations: [
      {
        sourceDocId: 'src-doc-01',
        sourceDocTitle: 'SANS 10400-T:2011 (Edition 3)',
        pdfPage: 50,
        clauseOrQuestion: 'Clause 4.32',
        approvedParaphrase: 'Equipment readiness, visibility, and unobstructed access for maintenance.'
      },
      {
        sourceDocId: 'src-doc-02',
        sourceDocTitle: 'Summative POE Module SANS 10139 (ND Ramphela)',
        pdfPage: 3,
        clauseOrQuestion: 'Question 1(g)',
        approvedParaphrase: 'Secondary battery standby capacity and charger operational check.'
      }
    ],
    locked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [hazardInput, setHazardInput] = useState('');
  const [personInput, setPersonInput] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');

  if (!isOpen) return null;

  const handleOpenCitation = (reqId: string, docId?: string) => {
    setSelectedReqId(reqId);
    setSelectedDocId(docId);
    setCitationDrawerOpen(true);
  };

  const handleAddHazard = () => {
    if (hazardInput.trim()) {
      setFormData(prev => ({
        ...prev,
        siteHazardsIdentified: [...prev.siteHazardsIdentified, hazardInput.trim()]
      }));
      setHazardInput('');
    }
  };

  const handleRemoveHazard = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      siteHazardsIdentified: prev.siteHazardsIdentified.filter((_, i) => i !== idx)
    }));
  };

  const handleAddPerson = () => {
    if (personInput.trim()) {
      setFormData(prev => ({
        ...prev,
        personsPresent: [...prev.personsPresent, personInput.trim()]
      }));
      setPersonInput('');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPhoto: PhotoEvidenceItem = {
        id: `photo-pre-${Date.now()}`,
        url: URL.createObjectURL(file),
        caption: photoCaption.trim() || file.name,
        timestamp: new Date().toISOString(),
        location: 'Site Location',
        uploadedBy: currentUser.name,
        tags: ['Pre-Work', 'Baseline'],
        isPreWork: true
      };

      setFormData(prev => ({
        ...prev,
        beforePhotos: [...prev.beforePhotos, newPhoto]
      }));
      setPhotoCaption('');
    }
  };

  const handleSaveDraft = () => {
    if (existing) {
      store.updatePreWorkInspection(formData);
    } else {
      store.addPreWorkInspection(formData);
    }
    if (onSaved) onSaved();
    onClose();
  };

  const handleApproveAndLock = () => {
    const approvedData: PreWorkInspectionRecord = {
      ...formData,
      workflowStatus: 'approved',
      locked: true,
      updatedAt: new Date().toISOString()
    };
    if (existing) {
      store.updatePreWorkInspection(approvedData);
    } else {
      store.addPreWorkInspection(approvedData);
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
                Section 5 &middot; Pre-Work SANS 10139 Inspection
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
              Pre-Work Fire Detection Inspection & Baseline Survey
            </h2>
            <p className="text-xs text-white/60">
              Site: <span className="text-white font-medium">{formData.siteName}</span> &middot; Client: <span className="text-white font-medium">{formData.clientName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenCitation('req-sans10400t-4.32', 'src-doc-01')}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#C1A461] text-xs font-bold font-mono flex items-center gap-1.5 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Source Citations (2 PDFs)
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mandatory Source Limited Watermark Banner */}
        <div className="px-6 py-2.5 bg-amber-950/40 border-b border-amber-500/30 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-amber-300 font-mono text-[11px]">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>SOURCE-LIMITED DRAFT - NOT AN ISSUABLE CERTIFICATE</strong> &middot; Controlled SANS 10400-T Edition 3 &amp; Summative POE sources.</span>
          </div>
          <span className="text-[10px] font-mono text-white/40 hidden md:inline">
            Zero Extrapolated AI Prompts
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
            Section A: Project &amp; Scope Details
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
            Section B: Safety, Access &amp; Impairments
          </button>

          <button
            onClick={() => setActiveSection('C')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSection === 'C'
                ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-4 h-4" />
            Section C: Existing System Condition &amp; SANS Benchmarks
          </button>

          <button
            onClick={() => setActiveSection('D')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeSection === 'D'
                ? 'bg-[#C1A461] text-black shadow-lg shadow-[#C1A461]/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-4 h-4" />
            Section D: Baseline Photos &amp; Digital Signatures
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow text-xs">
          
          {/* SECTION A */}
          {activeSection === 'A' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Site Selection *
                  </label>
                  <select
                    value={formData.siteId}
                    onChange={e => {
                      const selected = sites.find(s => s.id === e.target.value);
                      setFormData({
                        ...formData,
                        siteId: e.target.value,
                        siteName: selected ? selected.name : formData.siteName
                      });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-[#C1A461]"
                  >
                    {sites.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Work Order Reference
                  </label>
                  <input
                    type="text"
                    value={formData.workOrderNumber}
                    onChange={e => setFormData({ ...formData, workOrderNumber: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Purchase Order Reference
                  </label>
                  <input
                    type="text"
                    value={formData.purchaseOrderNumber}
                    onChange={e => setFormData({ ...formData, purchaseOrderNumber: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Lead Technician Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.leadTechnicianName}
                    onChange={e => setFormData({ ...formData, leadTechnicianName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Technician SAQCC Registration No. *
                  </label>
                  <input
                    type="text"
                    value={formData.leadTechnicianSaqcc}
                    onChange={e => setFormData({ ...formData, leadTechnicianSaqcc: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-emerald-400 outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Client Representative Name
                  </label>
                  <input
                    type="text"
                    value={formData.clientRepresentativeName}
                    onChange={e => setFormData({ ...formData, clientRepresentativeName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-[#C1A461]"
                  />
                </div>
              </div>

              {/* Persons Present */}
              <div className="p-4 rounded-2xl bg-[#151518] border border-white/10 space-y-3">
                <label className="text-white/60 font-bold uppercase text-[10px] font-mono block">
                  Persons Present on Site During Pre-Work Inspection
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={personInput}
                    onChange={e => setPersonInput(e.target.value)}
                    placeholder="Add attendee name and role..."
                    className="flex-grow px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-[#C1A461]"
                  />
                  <button
                    type="button"
                    onClick={handleAddPerson}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
                  >
                    Add Person
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.personsPresent.map((person, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-black/50 border border-white/10 text-white/80 text-xs flex items-center gap-2">
                      <User className="w-3 h-3 text-[#C1A461]" />
                      {person}
                      <button type="button" onClick={() => setFormData(prev => ({
                        ...prev,
                        personsPresent: prev.personsPresent.filter((_, i) => i !== idx)
                      }))} className="hover:text-red-400">
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Scope & Reason */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Reason for Inspection *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.reasonForInspection}
                    onChange={e => setFormData({ ...formData, reasonForInspection: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    Proposed Scope of Work *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.proposedWorkScope}
                    onChange={e => setFormData({ ...formData, proposedWorkScope: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-[#C1A461]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION B */}
          {activeSection === 'B' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C1A461]" />
                  Safety, Induction &amp; Access Permits
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accessPermissionGranted}
                      onChange={e => setFormData({ ...formData, accessPermissionGranted: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">Access Permission Granted</span>
                  </label>

                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.siteInductionCompleted}
                      onChange={e => setFormData({ ...formData, siteInductionCompleted: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">Site Induction Done</span>
                  </label>

                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.riskControlsInPlace}
                      onChange={e => setFormData({ ...formData, riskControlsInPlace: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">Risk Controls Active</span>
                  </label>

                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ppeCompliant}
                      onChange={e => setFormData({ ...formData, ppeCompliant: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">PPE Full Compliance</span>
                  </label>
                </div>

                {/* Permit to work */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                      Permit to Work (PTW) Number
                    </label>
                    <input
                      type="text"
                      value={formData.permitNumber || ''}
                      onChange={e => setFormData({ ...formData, permitNumber: e.target.value })}
                      placeholder="e.g. PTW-MEN-2026-041"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                      Escalation &amp; Control Room Contact
                    </label>
                    <input
                      type="text"
                      value={formData.escalationContactsRecorded}
                      onChange={e => setFormData({ ...formData, escalationContactsRecorded: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>
                </div>

                {/* High Risk Area Notes */}
                <div>
                  <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                    High Risk / Critical Area Precautions (e.g. FM200 Gaseous Suppression Hold-off)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.highRiskAreaNotes || ''}
                    onChange={e => setFormData({ ...formData, highRiskAreaNotes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Hazards Tagging */}
              <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-3">
                <label className="text-white/60 font-bold uppercase text-[10px] font-mono block">
                  Identified Site Hazards
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={hazardInput}
                    onChange={e => setHazardInput(e.target.value)}
                    placeholder="e.g. Working at height (> 3m), Confined riser shaft..."
                    className="flex-grow px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-[#C1A461]"
                  />
                  <button
                    type="button"
                    onClick={handleAddHazard}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
                  >
                    Add Hazard
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.siteHazardsIdentified.map((h, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      {h}
                      <button type="button" onClick={() => handleRemoveHazard(i)} className="hover:text-white">
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION C */}
          {activeSection === 'C' && (
            <div className="space-y-5">
              
              {/* CIE Panel Baseline */}
              <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#C1A461]" />
                    Control &amp; Indicating Equipment (CIE) Baseline
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleOpenCitation('req-sans10400t-4.31', 'src-doc-01')}
                    className="text-[10px] font-mono text-[#C1A461] hover:underline flex items-center gap-1"
                  >
                    <BookOpen className="w-3 h-3" /> View SANS 10400-T Cl. 4.31
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                      CIE Make &amp; Model
                    </label>
                    <input
                      type="text"
                      value={formData.panelMakeModel}
                      onChange={e => setFormData({ ...formData, panelMakeModel: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                      Design System Category
                    </label>
                    <select
                      value={formData.systemCategory}
                      onChange={e => setFormData({ ...formData, systemCategory: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white"
                    >
                      <option value="L1">Category L1 (Total Coverage)</option>
                      <option value="L2">Category L2 (Defined Areas)</option>
                      <option value="L3">Category L3 (Escape Routes)</option>
                      <option value="L4">Category L4 (Escape Paths Only)</option>
                      <option value="L5">Category L5 (Special Risks)</option>
                      <option value="P1">Category P1 (Property Total)</option>
                      <option value="P2">Category P2 (Property Defined)</option>
                      <option value="M">Category M (Manual Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                      Standby Battery Voltage (VDC) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={formData.batteryVoltageVdc}
                        onChange={e => setFormData({ ...formData, batteryVoltageVdc: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleOpenCitation('req-poe-q1g', 'src-doc-02')}
                        className="absolute right-2 top-2 text-[10px] text-[#C1A461]"
                      >
                        POE Q1(g)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-white/40 block text-[10px] font-mono uppercase mb-1">
                      Active Loop / Zone Count
                    </label>
                    <input
                      type="number"
                      value={formData.zoneLoopCount}
                      onChange={e => setFormData({ ...formData, zoneLoopCount: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.mainsSupplyNormal}
                      onChange={e => setFormData({ ...formData, mainsSupplyNormal: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">230V AC Mains Healthy</span>
                  </label>

                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.batteryChargerOperational}
                      onChange={e => setFormData({ ...formData, batteryChargerOperational: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">Charger Operational</span>
                  </label>

                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.containmentFireStoppingOk}
                      onChange={e => setFormData({ ...formData, containmentFireStoppingOk: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">Fire Stopping Intact</span>
                  </label>
                </div>
              </div>

              {/* SANS 10139 Statutory Documentation Verification */}
              <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#C1A461]" />
                    On-Site SANS 10139 Compliance Records Check
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleOpenCitation('req-poe-q19', 'src-doc-02')}
                    className="text-[10px] font-mono text-[#C1A461] hover:underline"
                  >
                    POE Q19 (Logbook Mandate)
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.existingLogbookAvailable}
                      onChange={e => setFormData({ ...formData, existingLogbookAvailable: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">Site Logbook on Site</span>
                  </label>

                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.asBuiltDrawingsAvailable}
                      onChange={e => setFormData({ ...formData, asBuiltDrawingsAvailable: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">As-Built CAD Drawings</span>
                  </label>

                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.zoneChartAvailable}
                      onChange={e => setFormData({ ...formData, zoneChartAvailable: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">Zone Chart at CIE</span>
                  </label>

                  <label className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.priorCocAvailable}
                      onChange={e => setFormData({ ...formData, priorCocAvailable: e.target.checked })}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="text-white text-xs font-medium">Prior SANS COC on File</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION D */}
          {activeSection === 'D' && (
            <div className="space-y-5">
              
              {/* Photo Evidence Upload Box */}
              <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#C1A461]" />
                    Baseline Before-Work Photographic Evidence
                  </h3>
                  <span className="text-[10px] font-mono text-white/40">
                    {formData.beforePhotos.length} Photo(s) Attached
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={photoCaption}
                    onChange={e => setPhotoCaption(e.target.value)}
                    placeholder="Enter caption for new photo (e.g. CIE Display Quiescent status)..."
                    className="flex-grow px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#d5b976] text-black font-bold text-xs cursor-pointer flex items-center justify-center gap-2 shrink-0">
                    <Upload className="w-4 h-4" />
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>

                {/* Photos Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    {formData.beforePhotos.map((photo: any, i) => (
                      <div key={photo.id} className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-2">
                        <img src={photo.url || photo.imageUrl} alt={photo.caption} className="w-full h-32 object-cover rounded-lg" />
                        <div className="text-xs font-bold text-white truncate">{photo.caption}</div>
                        <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
                          <span>{photo.timestamp ? new Date(photo.timestamp).toLocaleTimeString() : 'Recorded'}</span>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              beforePhotos: prev.beforePhotos.filter((p: any) => p.id !== photo.id)
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
                      <span>Lead Technician Sign-off</span>
                      {formData.technicianSignature?.otpVerified ? (
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
                        Sign as Technician (with OTP)
                      </button>
                    )}
                  </div>

                  {/* Client Signature */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                    <div className="font-bold text-white text-xs flex items-center justify-between">
                      <span>Client Representative Acceptance</span>
                      {formData.clientSignature?.otpVerified ? (
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
                        Sign as Client Rep (with OTP)
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
              Approve &amp; Lock Inspection
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
            technicianSignature: sig
          }));
        }}
        documentTitle="Pre-Work Fire Detection Inspection"
        documentNumber={formData.inspectionNumber}
        defaultSignerName={formData.leadTechnicianName}
        defaultSignerRole="Lead Fire Detection Technician (SAQCC Certified)"
        defaultSignerEmail="technicians@audrinfire.co.za"
        consentStatement="I hereby declare that this pre-work site inspection and existing system assessment was conducted personally in strict accordance with SANS 10139 and SANS 10400-T."
      />

      {/* Client Digital Signature Modal */}
      <DigitalSignatureModal
        isOpen={clientSignModalOpen}
        onClose={() => setClientSignModalOpen(false)}
        onSignComplete={(sig) => {
          setFormData(prev => ({
            ...prev,
            clientSignature: sig
          }));
        }}
        documentTitle="Pre-Work Fire Detection Inspection"
        documentNumber={formData.inspectionNumber}
        defaultSignerName={formData.clientRepresentativeName}
        defaultSignerRole="Head of Facilities & Life Safety"
        defaultSignerEmail={branding.primaryContact.email}
        consentStatement="I acknowledge the pre-work condition, agreed isolations, risk mitigation controls, and authorize Audrin Fire Engineers to commence work."
      />

    </div>
  );
};
