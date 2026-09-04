import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ArrowLeft, 
  PhoneCall, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Cpu, 
  Clock,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { COMPANY_DETAILS } from '../../data/initialData';
import { ServiceRequest } from '../../types';

interface ReportFaultWizardProps {
  onCancel: () => void;
  onSuccess: (requestId: string) => void;
}

export const ReportFaultWizard: React.FC<ReportFaultWizardProps> = ({
  onCancel,
  onSuccess
}) => {
  const store = useAudrinStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedFault, setSubmittedFault] = useState<ServiceRequest | null>(null);

  const [formData, setFormData] = useState({
    clientName: 'Michael Van Der Merwe',
    organisationName: 'Centurion Logistics Park',
    email: 'm.vandermerwe@centurionlp.co.za',
    phone: '083 987 6543',
    siteName: 'Centurion Distribution Hub - Block C',
    siteAddress: '42 John Vorster Drive, Centurion, Gauteng, 0157',
    panelBrand: 'Kentec Syncro AS',
    panelDisplayStatus: 'EARTH FAULT & LOOP 2 OPEN CCT',
    isBuzzerSounding: true,
    areSoundersActive: false,
    falseAlarmFrequency: 'Twice daily, primarily between 06:00 and 08:00',
    faultDescription: 'Continuous yellow fault LED with buzzer sounding. Zone 4 optical smoke sensor displaying recurring fault code. Loop 2 isolator open circuit indicated on LCD screen.',
    immediateSafetyRisk: 'Low immediate occupant danger, but fire detection zone is partially disabled.',
    consentExclusions: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const faultRequest: ServiceRequest = {
      id: `fault-${Date.now()}`,
      referenceNumber: `AFE-FLT-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: 'usr-client-01',
      clientName: formData.clientName,
      organisationName: formData.organisationName,
      clientEmail: formData.email,
      clientPhone: formData.phone,
      siteId: 'site-centurion-02',
      siteName: formData.siteName,
      siteAddress: formData.siteAddress,
      buildingType: 'Industrial Logistics Warehouse',
      serviceId: 'srv-06',
      serviceSlug: 'fault-finding-and-emergency-faults',
      serviceTitle: 'Fire Alarm Fault Finding and Emergency Fault Support',
      serviceCategory: 'faults_repairs',
      systemCategoryTarget: 'P1',
      existingSystemDetails: {
        panelBrand: formData.panelBrand,
        panelModel: 'Syncro AS 2-Loop',
        loopCount: 2,
        approximateDeviceCount: 140,
        installationYear: 2020
      },
      urgency: 'critical_fault',
      description: `[CRITICAL FAULT REPORT] Display: ${formData.panelDisplayStatus}. Buzzer Active: ${formData.isBuzzerSounding}. False Alarms: ${formData.falseAlarmFrequency}. Details: ${formData.faultDescription}`,
      preferredVisitDate: new Date().toISOString().split('T')[0],
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTimeSlot: 'morning',
      status: 'Submitted',
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: 'Submitted',
          actor: formData.clientName,
          actorRole: 'customer',
          notes: 'Critical fault report logged via Emergency Fault Portal.',
          isCustomerVisible: true
        }
      ],
      currentStage: 1,
      beforePhotosCount: 1,
      duringPhotosCount: 0,
      afterPhotosCount: 0,
      videosCount: 0,
      documentsCount: 0,
      hasPreWorkReport: false,
      hasPostWorkReport: false,
      hasPresentation: false,
      hasScheduledVisit: true,
      hasZoomMeeting: false,
      hasAiMinutes: false,
      scopeDescription: `[CRITICAL FAULT REPORT] Display: ${formData.panelDisplayStatus}. Buzzer Active: ${formData.isBuzzerSounding}. False Alarms: ${formData.falseAlarmFrequency}. Details: ${formData.faultDescription}`,
      hasAsBuiltDrawings: false,
      attachedDocumentUrls: ['Panel_Fault_LCD_Photo.jpg'],
      photoEvidenceIds: [],
      videoEvidenceIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      consentScopeExclusions: formData.consentExclusions,
      consentDataProcessing: true
    };

    setTimeout(() => {
      store.addServiceRequest(faultRequest);
      setIsSubmitting(false);
      setSubmittedFault(faultRequest);
    }, 600);
  };

  if (submittedFault) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#151518] border border-red-500/30 p-8 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-[1.5px]">
                Emergency Fault Logged & Triaged
              </span>
              <h2 className="text-2xl font-bold text-white">
                Fault Ticket {submittedFault.referenceNumber}
              </h2>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-red-500/20 text-xs text-red-200/90 space-y-2">
            <div className="font-bold flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Immediate Diagnostic Desk Notification</span>
            </div>
            <p className="leading-relaxed">
              Your urgent fault report has been priority-flagged at the Pretoria West operations desk. An engineer is reviewing the reported panel fault ({submittedFault.existingSystemDetails?.panelBrand}) for rapid field deployment.
            </p>
          </div>

          {/* Direct Hotline Contact Box */}
          <div className="p-6 rounded-2xl bg-[#0A0A0B] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">
                Need Immediate Verbal Triage?
              </h4>
              <p className="text-xs text-white/50">
                Call our technical desk directly quoting ref: <span className="font-mono text-[#C1A461]">{submittedFault.referenceNumber}</span>
              </p>
            </div>

            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="flex items-center gap-2 px-5 py-3 bg-[#C1A461] hover:bg-[#D4BC7B] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition shrink-0 shadow-lg cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{COMPANY_DETAILS.phone}</span>
            </a>
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button
              onClick={() => onSuccess(submittedFault.id)}
              className="flex-1 py-3.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg text-center transition cursor-pointer"
            >
              Open Fault Tracker in Customer Portal
            </button>
            <button
              onClick={onCancel}
              className="py-3.5 px-6 bg-[#0A0A0B] hover:bg-[#1E1E22] text-white/70 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/5 transition cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-white/40 hover:text-[#C1A461] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-bold text-red-400 uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Emergency Fire-Alarm Fault Intake</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Report a Fire-Alarm Fault or False Alarm
          </h1>
          <p className="text-xs sm:text-sm text-white/50 leading-relaxed">
            Rapid technical triage for active panel buzzers, yellow fault LEDs, loop breaks, earth faults, and persistent detector nuisance triggers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-7 sm:p-9 rounded-3xl bg-[#151518] border border-white/5 shadow-2xl space-y-6">
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
              <label className="block text-white/70 font-semibold mb-1.5">Direct Phone / Mobile *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-white/70 font-semibold mb-1.5">Site & Building Name *</label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-white/70 font-semibold mb-1.5">Exact Physical Address *</label>
              <input
                type="text"
                required
                value={formData.siteAddress}
                onChange={(e) => setFormData({ ...formData, siteAddress: e.target.value })}
                className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
              />
            </div>

            <div>
              <label className="block text-white/70 font-semibold mb-1.5">Control Panel Brand / Model</label>
              <input
                type="text"
                value={formData.panelBrand}
                onChange={(e) => setFormData({ ...formData, panelBrand: e.target.value })}
                placeholder="e.g. Advanced, Kentec, Ziton, Morley, GST"
                className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
              />
            </div>

            <div>
              <label className="block text-white/70 font-semibold mb-1.5">Exact LCD / Display Text</label>
              <input
                type="text"
                value={formData.panelDisplayStatus}
                onChange={(e) => setFormData({ ...formData, panelDisplayStatus: e.target.value })}
                placeholder="e.g. 'Fault Zone 3' or 'Loop 1 Open Cct'"
                className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461] font-mono"
              />
            </div>

            {/* Radio options for current audible status */}
            <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 space-y-2">
              <label className="block text-white/70 font-semibold">Is the Internal Panel Buzzer Sounding?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="radio"
                    name="buzzer"
                    checked={formData.isBuzzerSounding}
                    onChange={() => setFormData({ ...formData, isBuzzerSounding: true })}
                    className="accent-[#C1A461]"
                  />
                  <span>Yes (Continuous / Beeping)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-white/50">
                  <input
                    type="radio"
                    name="buzzer"
                    checked={!formData.isBuzzerSounding}
                    onChange={() => setFormData({ ...formData, isBuzzerSounding: false })}
                    className="accent-[#C1A461]"
                  />
                  <span>No / Silenced</span>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 space-y-2">
              <label className="block text-white/70 font-semibold">Are Building Sounders / Bells Ringing?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-red-400">
                  <input
                    type="radio"
                    name="sounders"
                    checked={formData.areSoundersActive}
                    onChange={() => setFormData({ ...formData, areSoundersActive: true })}
                    className="accent-red-500"
                  />
                  <span>Yes (Active Evacuation Tone)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-white/50">
                  <input
                    type="radio"
                    name="sounders"
                    checked={!formData.areSoundersActive}
                    onChange={() => setFormData({ ...formData, areSoundersActive: false })}
                    className="accent-red-500"
                  />
                  <span>No (Silent)</span>
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-white/70 font-semibold mb-1.5">False Alarm History & Nuisance Triggers</label>
              <input
                type="text"
                value={formData.falseAlarmFrequency}
                onChange={(e) => setFormData({ ...formData, falseAlarmFrequency: e.target.value })}
                placeholder="e.g. Alarms go off every morning when heating turns on"
                className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-white/70 font-semibold mb-1.5">Fault Description & Affected Zones / Devices *</label>
              <textarea
                rows={3}
                required
                value={formData.faultDescription}
                onChange={(e) => setFormData({ ...formData, faultDescription: e.target.value })}
                className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 text-xs text-white/60 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.consentExclusions}
              onChange={(e) => setFormData({ ...formData, consentExclusions: e.target.checked })}
              className="mt-0.5 rounded border-white/20 accent-[#C1A461]"
            />
            <span className="leading-relaxed">
              I understand that Audrin Fire Engineers diagnoses electronic fire detection & alarm systems, and does not provide water sprinkler, fire extinguisher, or CCTV security repair.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#C1A461] hover:bg-[#D4BC7B] text-black font-bold uppercase tracking-[1.5px] text-xs rounded-xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isSubmitting ? 'Logging Fault Ticket...' : 'Submit Emergency Fault Report'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
