import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Upload, 
  FileText, 
  Building2, 
  Calendar, 
  AlertCircle, 
  Flame, 
  Sparkles,
  Paperclip,
  X
} from 'lucide-react';
import { APPROVED_SERVICES, SITES_DATA, COMPANY_DETAILS } from '../../data/initialData';
import { useAudrinStore } from '../../services/store';
import { ServiceRequest, SystemCategory, UrgencyLevel } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface RequestServiceWizardProps {
  initialServiceSlug?: string;
  onCancel: () => void;
  onSuccess: (requestId: string) => void;
}

export const RequestServiceWizard: React.FC<RequestServiceWizardProps> = ({
  initialServiceSlug,
  onCancel,
  onSuccess
}) => {
  const store = useAudrinStore();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);

  // Form State
  const initialService = APPROVED_SERVICES.find(s => s.slug === initialServiceSlug) || APPROVED_SERVICES[0];

  const [formData, setFormData] = useState({
    clientName: 'Sarah Ndlovu',
    organisationName: 'Apex Commercial Properties',
    email: 'sarah.ndlovu@apexprop.co.za',
    phone: '082 345 6789',
    siteName: 'Menlyn Corporate Park - Tower A',
    siteAddress: '175 Corobay Avenue, Waterkloof Glen, Pretoria, 0010',
    buildingType: 'Commercial Office Tower (12 Storeys)',
    existingPanelBrand: 'Advanced Axis EN',
    existingPanelModel: '4-Loop Analogue Addressable',
    loopCount: 4,
    deviceCountEstimate: 280,
    serviceId: initialService.id,
    serviceSlug: initialService.slug,
    systemCategory: 'L2' as SystemCategory,
    urgency: 'routine' as UrgencyLevel,
    preferredDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    preferredTimeSlot: 'morning' as 'morning' | 'afternoon' | 'full_day',
    scopeDescription: 'Requesting formal SANS 10139 compliance audit, loop health diagnostic, and preventative maintenance for Level 3 through Level 8.',
    hasDrawings: true,
    consentScopeExclusions: false,
    consentDataProcessing: true
  });

  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([
    { name: 'Tower_A_Fire_Zone_Layout_2025.pdf', size: '2.4 MB' }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles(prev => [...prev, { name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB` }]);
    }
  };

  const removeFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedService = APPROVED_SERVICES.find(s => s.id === formData.serviceId) || APPROVED_SERVICES[0];

    const newRequest: ServiceRequest = {
      id: `req-${Date.now()}`,
      referenceNumber: `AFE-REQ-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: 'usr-sarah-01',
      clientName: formData.clientName,
      organisationName: formData.organisationName,
      clientEmail: formData.email,
      clientPhone: formData.phone,
      siteId: 'site-menlyn-01',
      siteName: formData.siteName,
      siteAddress: formData.siteAddress,
      buildingType: formData.buildingType,
      serviceId: selectedService.id,
      serviceSlug: selectedService.slug,
      serviceTitle: selectedService.title,
      serviceCategory: selectedService.category,
      systemCategoryTarget: formData.systemCategory,
      existingSystemDetails: {
        panelBrand: formData.existingPanelBrand,
        panelModel: formData.existingPanelModel,
        loopCount: formData.loopCount,
        approximateDeviceCount: formData.deviceCountEstimate,
        installationYear: 2021
      },
      urgency: formData.urgency,
      description: formData.scopeDescription,
      preferredVisitDate: formData.preferredDate,
      preferredDate: formData.preferredDate,
      preferredTimeSlot: formData.preferredTimeSlot,
      status: 'Submitted',
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: 'Submitted',
          actor: formData.clientName,
          actorRole: 'customer',
          notes: 'Formal SANS 10139 commercial service request submitted.',
          isCustomerVisible: true
        }
      ],
      currentStage: 1,
      beforePhotosCount: 0,
      duringPhotosCount: 0,
      afterPhotosCount: 0,
      videosCount: 0,
      documentsCount: uploadedFiles.length,
      hasPreWorkReport: false,
      hasPostWorkReport: false,
      hasPresentation: false,
      hasScheduledVisit: true,
      hasZoomMeeting: false,
      hasAiMinutes: false,
      scopeDescription: formData.scopeDescription,
      hasAsBuiltDrawings: formData.hasDrawings,
      attachedDocumentUrls: uploadedFiles.map(f => f.name),
      photoEvidenceIds: [],
      videoEvidenceIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      consentScopeExclusions: formData.consentScopeExclusions,
      consentDataProcessing: formData.consentDataProcessing
    };

    setTimeout(() => {
      store.addServiceRequest(newRequest);
      setIsSubmitting(false);
      setSubmittedRequest(newRequest);
    }, 600);
  };

  if (submittedRequest) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto rounded-3xl bg-[#151518] border border-white/5 p-8 sm:p-10 shadow-2xl space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[1.5px]">
                Intake Confirmed & Registered
              </span>
              <h2 className="text-2xl font-bold text-white">
                Service Request {submittedRequest.referenceNumber}
              </h2>
            </div>
          </div>

          <p className="text-sm text-white/70 leading-relaxed">
            Thank you, <strong className="text-white">{submittedRequest.clientName}</strong>. Your fire detection service request has been logged in the Audrin engineering queue. A tailored acknowledgement email has been generated and queued for dispatch.
          </p>

          {/* Email Simulation Preview Box */}
          <div className="p-6 rounded-2xl bg-[#0A0A0B] border border-white/5 space-y-3 font-mono text-xs text-white/70">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[11px] text-white/40">
              <span>Auto-Generated Acknowledgement (To: {submittedRequest.clientEmail})</span>
              <span className="text-emerald-400 font-bold">STATUS: QUEUED</span>
            </div>
            <p className="text-white font-semibold">
              Subject: [AUDRIN FIRE] Acknowledged: Request {submittedRequest.referenceNumber} — {submittedRequest.serviceTitle}
            </p>
            <p className="text-white/60 leading-relaxed text-[11px]">
              Dear {submittedRequest.clientName},<br />
              We acknowledge receipt of your service request for {submittedRequest.siteName}. Our engineering desk is reviewing your site parameters and target category ({submittedRequest.systemCategoryTarget}). An engineer will reach out to confirm your scheduled appointment for {submittedRequest.preferredDate}.
            </p>
            <div className="pt-2 text-[10px] text-white/40 border-t border-white/5">
              AUDRIN FIRE ENGINEERS (PTY) LTD | Pretoria West Operations | Tel: {COMPANY_DETAILS.phone}
            </div>
          </div>

          {/* Request Overview Summary */}
          <div className="p-5 rounded-2xl bg-[#0A0A0B] border border-white/5 text-xs text-white/70 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/40">Service Title:</span>
              <span className="text-white font-bold">{submittedRequest.serviceTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Site Location:</span>
              <span className="text-white/90">{submittedRequest.siteName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">Current Workflow:</span>
              <span className="text-[#C1A461] font-semibold">Stage 1 of 7 (Enquiry & Consultation)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuccess(submittedRequest.id)}
              className="flex-1 py-3.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg text-center transition cursor-pointer"
            >
              Open Customer Portal Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="py-3.5 px-6 bg-[#0A0A0B] hover:bg-[#1E1E22] text-white/70 hover:text-white font-bold uppercase tracking-wider text-xs rounded-xl border border-white/5 transition cursor-pointer"
            >
              Back to Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-white/40 hover:text-[#C1A461] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel Request</span>
          </button>

          <div className="text-xs font-mono text-white/40">
            Step <span className="text-[#C1A461] font-bold">{step}</span> of 4
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C1A461]/10 border border-[#C1A461]/30 text-[10px] font-bold text-[#C1A461] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SANS 10139 Commercial Service Intake</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Request Fire-Detection & Alarm Service
          </h1>
          <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
            Provide client, site, and panel details for a rapid engineering consultation and scheduled assessment.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {[
            { num: 1, title: 'Client & Facility' },
            { num: 2, title: 'System Specs' },
            { num: 3, title: 'Scope & Date' },
            { num: 4, title: 'Attestation & Submit' }
          ].map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <div key={s.num} className="space-y-1.5">
                <div className="h-1.5 rounded-full overflow-hidden bg-white/10">
                  <motion.div
                    className="h-full bg-[#C1A461]"
                    initial={false}
                    animate={{ width: isDone ? '100%' : isActive ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className={`text-[10px] hidden sm:block font-semibold uppercase tracking-wider truncate ${isActive ? 'text-[#C1A461]' : isDone ? 'text-white/70' : 'text-white/30'}`}>
                  0{s.num}. {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Stepper Form Container */}
        <form onSubmit={handleSubmit} className="p-7 sm:p-9 rounded-3xl bg-[#151518] border border-white/5 shadow-2xl space-y-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Step 1: Client & Site Contact */}
            {step === 1 && (
              <motion.div 
                key="step-1"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <h3 className="text-base font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#C1A461]" />
                  <span>1. Client & Commercial Facility Details</span>
                </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Organisation / Property Group *</label>
                  <input
                    type="text"
                    required
                    value={formData.organisationName}
                    onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-white/70 font-semibold mb-1.5">Site / Building Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-white/70 font-semibold mb-1.5">Physical Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.siteAddress}
                    onChange={(e) => setFormData({ ...formData, siteAddress: e.target.value })}
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-white/70 font-semibold mb-1.5">Building Type & Occupancy</label>
                  <input
                    type="text"
                    value={formData.buildingType}
                    onChange={(e) => setFormData({ ...formData, buildingType: e.target.value })}
                    placeholder="e.g. 5-Storey Corporate Office, Logistics Warehouse, Medical Clinic"
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Service & Panel Technical Parameters */}
          {step === 2 && (
            <motion.div 
              key="step-2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#C1A461]" />
                <span>2. Service Classification & Existing Fire System</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Required SANS 10139 Service Discipline *</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => {
                      const s = APPROVED_SERVICES.find(srv => srv.id === e.target.value);
                      if (s) {
                        setFormData({ ...formData, serviceId: s.id, serviceSlug: s.slug });
                      }
                    }}
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461] font-semibold"
                  >
                    {APPROVED_SERVICES.map(s => (
                      <option key={s.id} value={s.id} className="bg-[#151518]">
                        {s.title} ({s.categoryLabel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 font-semibold mb-1.5">Target SANS 10139 System Category</label>
                    <select
                      value={formData.systemCategory}
                      onChange={(e) => setFormData({ ...formData, systemCategory: e.target.value as SystemCategory })}
                      className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                    >
                      <option value="M" className="bg-[#151518]">Category M (Manual call points only)</option>
                      <option value="L1" className="bg-[#151518]">Category L1 (Total life safety coverage across all spaces)</option>
                      <option value="L2" className="bg-[#151518]">Category L2 (Escape routes plus high fire risk rooms)</option>
                      <option value="L3" className="bg-[#151518]">Category L3 (Escape routes & adjoining corridors)</option>
                      <option value="L4" className="bg-[#151518]">Category L4 (Escape routes only)</option>
                      <option value="L5" className="bg-[#151518]">Category L5 (Custom engineered specific risk area)</option>
                      <option value="P1" className="bg-[#151518]">Category P1 (Total property protection coverage)</option>
                      <option value="P2" className="bg-[#151518]">Category P2 (Property protection in defined high-risk areas)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1.5">Existing Panel Brand & Model</label>
                    <input
                      type="text"
                      value={formData.existingPanelBrand}
                      onChange={(e) => setFormData({ ...formData, existingPanelBrand: e.target.value })}
                      placeholder="e.g. Advanced Axis EN, Kentec Syncro, Ziton ZP2"
                      className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1.5">Loop Count (if known)</label>
                    <input
                      type="number"
                      min={1}
                      max={16}
                      value={formData.loopCount}
                      onChange={(e) => setFormData({ ...formData, loopCount: parseInt(e.target.value) || 1 })}
                      className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1.5">Approximate Device Count</label>
                    <input
                      type="number"
                      value={formData.deviceCountEstimate}
                      onChange={(e) => setFormData({ ...formData, deviceCountEstimate: parseInt(e.target.value) || 0 })}
                      className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Scope Details / Specific Site Requirements</label>
                  <textarea
                    rows={3}
                    value={formData.scopeDescription}
                    onChange={(e) => setFormData({ ...formData, scopeDescription: e.target.value })}
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461] leading-relaxed"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Scheduling, Urgency & File Upload */}
          {step === 3 && (
            <motion.div 
              key="step-3"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C1A461]" />
                <span>3. Preferred Schedule, Urgency & Document Upload</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Urgency Classification</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461] font-bold"
                  >
                    <option value="routine" className="bg-[#151518]">Routine (Scheduled within 3–7 business days)</option>
                    <option value="urgent" className="bg-[#151518]">Urgent (Within 24–48 hours)</option>
                    <option value="critical_fault" className="bg-[#151518]">Critical Fault (Immediate dispatch desk review)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Preferred Assessment Date</label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-white/70 font-semibold mb-1.5">Preferred Time Window</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'morning', label: 'Morning (07:00 – 12:00)' },
                      { id: 'afternoon', label: 'Afternoon (12:00 – 17:00)' },
                      { id: 'full_day', label: 'Full Day Window' }
                    ].map((slot) => (
                      <button
                        type="button"
                        key={slot.id}
                        onClick={() => setFormData({ ...formData, preferredTimeSlot: slot.id as any })}
                        className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                          formData.preferredTimeSlot === slot.id
                            ? 'bg-[#C1A461]/10 border-[#C1A461] text-[#C1A461] font-bold'
                            : 'bg-[#0A0A0B] border-white/5 text-white/50 hover:text-white'
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Section */}
                <div className="sm:col-span-2 space-y-2 pt-2">
                  <label className="block text-white/70 font-semibold mb-1.5">
                    Attach Site Layout Drawings, Zone Charts, or Panel Photos (Optional)
                  </label>

                  <div className="border border-dashed border-white/10 hover:border-[#C1A461]/40 rounded-2xl p-6 text-center bg-[#0A0A0B] transition">
                    <Upload className="w-8 h-8 text-white/30 mx-auto mb-2" />
                    <p className="text-xs text-white/60 font-medium">
                      Drag & drop PDF drawings, DWG exports, or photos here, or
                    </p>
                    <label className="mt-3 inline-block px-4 py-2 bg-[#1E1E22] hover:bg-[#2A2A30] text-white text-xs font-semibold uppercase tracking-wider rounded-xl cursor-pointer transition border border-white/5">
                      Browse Files
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0B] border border-white/5 text-xs">
                          <div className="flex items-center gap-2 text-white/80">
                            <Paperclip className="w-3.5 h-3.5 text-[#C1A461]" />
                            <span>{file.name}</span>
                            <span className="text-white/40 text-[10px]">({file.size})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="text-white/40 hover:text-red-400 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Consent & Review */}
          {step === 4 && (
            <motion.div 
              key="step-4"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C1A461]" />
                <span>4. Scope Acknowledgment, POPIA Consent & Review</span>
              </h3>

              {/* Review Summary Grid */}
              <div className="p-5 rounded-2xl bg-[#0A0A0B] border border-white/5 text-xs space-y-2">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Client / Contact:</span>
                  <span className="text-white font-semibold">{formData.clientName} ({formData.organisationName})</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Site Address:</span>
                  <span className="text-white/90">{formData.siteName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Selected Service:</span>
                  <span className="text-[#C1A461] font-bold">{APPROVED_SERVICES.find(s => s.id === formData.serviceId)?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Target Category:</span>
                  <span className="text-[#C1A461] font-bold">Category {formData.systemCategory} (SANS 10139)</span>
                </div>
              </div>

              {/* Mandatory Consents */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 text-xs text-white/60 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consentScopeExclusions}
                    onChange={(e) => setFormData({ ...formData, consentScopeExclusions: e.target.checked })}
                    className="mt-0.5 rounded border-white/20 accent-[#C1A461]"
                  />
                  <span className="leading-relaxed">
                    I acknowledge that <strong className="text-white">AUDRIN FIRE ENGINEERS (PTY) LTD</strong> provides commercial fire-detection and alarm engineering only, and does not service sprinklers, extinguishers, hose reels, gas suppression, CCTV, or general security systems.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 text-xs text-white/60 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consentDataProcessing}
                    onChange={(e) => setFormData({ ...formData, consentDataProcessing: e.target.checked })}
                    className="mt-0.5 rounded border-white/20 accent-[#C1A461]"
                  />
                  <span className="leading-relaxed">
                    I consent to the processing of site, contact, and engineering data in accordance with the Protection of Personal Information Act (POPIA).
                  </span>
                </label>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            {step > 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-3 bg-[#0A0A0B] hover:bg-[#1E1E22] text-white/70 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/5 transition cursor-pointer"
              >
                Previous Step
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onCancel}
                className="px-5 py-3 bg-[#0A0A0B] hover:bg-[#1E1E22] text-white/40 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/5 transition cursor-pointer"
              >
                Cancel
              </motion.button>
            )}

            {step < 4 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-6 py-3 bg-[#C1A461] hover:bg-[#D4BC7B] text-black font-bold uppercase tracking-wider text-xs rounded-xl transition shadow-lg cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || !formData.consentScopeExclusions || !formData.consentDataProcessing}
                className="flex items-center gap-2 px-6 py-3.5 bg-[#C1A461] hover:bg-[#D4BC7B] disabled:opacity-40 text-black font-bold uppercase tracking-wider text-xs rounded-xl transition shadow-xl cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Logging Request...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Generate Tailored Acknowledgement</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
