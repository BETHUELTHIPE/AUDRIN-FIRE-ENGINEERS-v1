import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  FileText, 
  Building2, 
  Calendar, 
  Clock, 
  Download, 
  Printer, 
  Phone, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  PenTool, 
  X, 
  ArrowLeft,
  ChevronRight,
  Lock,
  ExternalLink,
  Info
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { SafetyFileDossier, SafetyFileApprovalEntry } from '../../types';
import { COMPANY_DETAILS } from '../../data/initialData';
import { DigitalSignatureCanvas } from './DigitalSignatureCanvas';
import { generateSafetyFileCompletePdf } from '../../services/safetyFilePdfGenerator';
import { AudrinLogo } from '../common/AudrinLogo';

interface SafetyFileCoverProps {
  dossierId?: string;
  onBack?: () => void;
  onNavigateToAudit?: () => void;
}

export const SafetyFileCover: React.FC<SafetyFileCoverProps> = ({
  dossierId,
  onBack,
  onNavigateToAudit
}) => {
  const store = useAudrinStore();
  const dossiers = store.getSafetyFileDossiers();
  const currentUser = store.getUser();
  const brandings = store.getCompanyBrandings();

  const [selectedDossierId, setSelectedDossierId] = useState<string>(
    dossierId || dossiers[0]?.id || ''
  );
  const [activeSigningRole, setActiveSigningRole] = useState<SafetyFileApprovalEntry | null>(null);

  const currentDossier = dossiers.find(d => d.id === selectedDossierId) || dossiers[0];
  const clientBranding = brandings.find(b => b.orgId === currentDossier?.clientId) || brandings[0];

  if (!currentDossier) {
    return (
      <div className="p-8 text-center bg-slate-900 text-slate-300 rounded-xl border border-slate-800">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Safety File Dossiers Found</h3>
        <p className="text-sm text-slate-400 mt-1">Please select or register a safety file project.</p>
      </div>
    );
  }

  const handleOpenSigningModal = (approval: SafetyFileApprovalEntry) => {
    setActiveSigningRole(approval);
  };

  const handleSaveSignature = (sigData: any) => {
    if (!activeSigningRole) return;
    store.signSafetyFileApproval(currentDossier.id, activeSigningRole.roleId, {
      personName: sigData.signerName || activeSigningRole.personName,
      designation: sigData.signerRole || activeSigningRole.designation,
      registrationNumber: sigData.saqccNumber || activeSigningRole.registrationNumber,
      signatureDataUrl: sigData.signatureImage,
      signedDate: sigData.timestamp ? sigData.timestamp.split('T')[0] : new Date().toISOString().split('T')[0],
      signedTimestamp: sigData.timestamp || new Date().toISOString(),
      verificationStatus: 'verified',
      verificationNotes: `Verified by ${currentUser.name} (${currentUser.role}). Method: Biometric Touch/Mouse Pad Seal.`
    });
    setActiveSigningRole(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    generateSafetyFileCompletePdf(currentDossier, clientBranding);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-sm print:hidden">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                Statutory Safety File Cover & Approval Matrix
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-300 font-mono">
                {currentDossier.dossierNumber}
              </span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {currentDossier.projectName}
            </h1>
          </div>
        </div>

        {/* Dossier Selector & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={currentDossier.id}
            onChange={(e) => setSelectedDossierId(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
          >
            {dossiers.map(d => (
              <option key={d.id} value={d.id}>
                {d.dossierNumber} - {d.siteName}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            Print Cover
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            Download Dossier PDF
          </button>

          {onNavigateToAudit && (
            <button
              onClick={onNavigateToAudit}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-amber-500/30 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Audit Log
            </button>
          )}
        </div>
      </div>

      {/* Main Printable Document Canvas */}
      <div 
        id="printable-safety-file-cover"
        className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:m-0"
      >
        {/* Official Header Banner */}
        <div className="bg-[#0B1C44] text-white px-8 py-7 border-b-4 border-[#C1A461] relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-4">
                <AudrinLogo variant="full" themeMode="dark" size="md" />
                <span className="hidden sm:inline-block w-px h-6 bg-white/20" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#C1A461]">
                  Official Statutory Life-Safety Documentation
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white/90 font-sans">
                {COMPANY_DETAILS.legalName}
              </h2>
              <p className="text-xs text-slate-300">
                {COMPANY_DETAILS.tagline}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-300 pt-1">
                <span>Reg: <strong>{COMPANY_DETAILS.registrationNumber}</strong></span>
                <span>•</span>
                <span>SAQCC Fire Registration: <strong>SAQCC-9109170791081</strong></span>
                <span>•</span>
                <span>Pretoria West, Gauteng</span>
              </div>
            </div>

            {/* Dossier Identification Stamp */}
            <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-4 text-right min-w-[220px]">
              <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Controlled Safety Dossier
              </div>
              <div className="text-xl font-black font-mono text-white mt-0.5">
                {currentDossier.dossierNumber}
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Version <strong className="text-white">{currentDossier.version}</strong> ({currentDossier.revision})
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Issue Date: {currentDossier.issueDate}
              </div>
            </div>
          </div>
        </div>

        {/* Document Content Body */}
        <div className="p-8 space-y-8">
          {/* Statutory Notice Strip */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold">Compliance-Support Information Notice:</strong> This dossier reflects automated tracking under SANS 10139:2021, SANS 10400-T, and OHS Act Construction Regulations 2014 Reg 7(1)(b). Automated data alone does not substitute for accredited SAQCC Commissioner on-site inspection and formal physical seal.
            </div>
          </div>

          {/* Section 1: Client & Principal Contractor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Profile */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  Client & Principal Appointment
                </h3>
                {clientBranding?.logoUrl && (
                  <img 
                    src={clientBranding.logoUrl} 
                    alt="Client Logo" 
                    className="h-7 w-auto object-contain rounded"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              <dl className="space-y-2 text-xs">
                <div>
                  <dt className="text-slate-700 text-[11px] font-medium">Registered Client Entity</dt>
                  <dd className="font-bold text-slate-900 text-sm">
                    {clientBranding?.registeredName || currentDossier.clientName}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <dt className="text-slate-700 text-[11px] font-medium">Registration No</dt>
                    <dd className="font-medium text-slate-800">{clientBranding?.registrationNumber || '2018/489201/07'}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-700 text-[11px] font-medium">VAT Number</dt>
                    <dd className="font-medium text-slate-800">{clientBranding?.vatNumber || '4820199481'}</dd>
                  </div>
                </div>
                <div>
                  <dt className="text-slate-700 text-[11px] font-medium">Site Address</dt>
                  <dd className="font-medium text-slate-800">{currentDossier.siteAddress}</dd>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                  <div>
                    <dt className="text-slate-700 text-[11px] font-medium">Contract Ref</dt>
                    <dd className="font-mono font-bold text-slate-900">{currentDossier.contractNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-700 text-[11px] font-medium">Purchase Order</dt>
                    <dd className="font-mono font-bold text-slate-900">{currentDossier.purchaseOrderNumber}</dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Principal Contractor Profile */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-900" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Specialist Fire Engineering Contractor
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <img 
                    src="/audrin-logo.svg" 
                    alt="Audrin Fire Engineers" 
                    className="h-6 w-auto object-contain" 
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                    SAQCC Accredited
                  </span>
                </div>
              </div>

              <dl className="space-y-2 text-xs">
                <div>
                  <dt className="text-slate-700 text-[11px] font-medium">Company Name</dt>
                  <dd className="font-bold text-slate-900 text-sm">{COMPANY_DETAILS.legalName}</dd>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <dt className="text-slate-700 text-[11px] font-medium">Company Reg</dt>
                    <dd className="font-medium text-slate-800">{COMPANY_DETAILS.registrationNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-700 text-[11px] font-medium">SAQCC Reg</dt>
                    <dd className="font-medium text-slate-800 font-mono">9109170791081</dd>
                  </div>
                </div>
                <div>
                  <dt className="text-slate-700 text-[11px] font-medium">Head Office & Workshop</dt>
                  <dd className="font-medium text-slate-800">{COMPANY_DETAILS.address}</dd>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                  <div>
                    <dt className="text-slate-700 text-[11px] font-medium">24/7 Telephone</dt>
                    <dd className="font-medium text-slate-800">{COMPANY_DETAILS.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-700 text-[11px] font-medium">Direct Email</dt>
                    <dd className="font-medium text-slate-800 truncate">{COMPANY_DETAILS.email}</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          {/* Section 2: Project Specifications & Fire Alarm CIE Specs */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              Project Parameters & Fire Detection Equipment Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-[11px] font-medium text-slate-700">Project Name</div>
                <div className="font-bold text-slate-900 mt-0.5">{currentDossier.projectName}</div>
                <div className="text-[11px] font-medium text-slate-700 mt-2">Commencement & Completion</div>
                <div className="font-medium text-slate-800 mt-0.5">
                  {currentDossier.projectCommencementDate} to {currentDossier.projectCompletionDate}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-[11px] font-medium text-slate-700">Building Classification (Part T)</div>
                <div className="font-bold text-slate-900 mt-0.5">{currentDossier.buildingClassification}</div>
                <div className="text-[11px] font-medium text-slate-700 mt-2">System Category (SANS 10139)</div>
                <div className="font-medium text-slate-800 mt-0.5">{currentDossier.systemType}</div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-[11px] font-medium text-slate-700">Fire Alarm Panel (CIE)</div>
                <div className="font-bold text-slate-900 mt-0.5">
                  {currentDossier.fireAlarmPanelDetails.make} {currentDossier.fireAlarmPanelDetails.model}
                </div>
                <div className="text-[11px] text-slate-700 font-mono mt-1">
                  S/N: {currentDossier.fireAlarmPanelDetails.serialNumber} | FW: {currentDossier.fireAlarmPanelDetails.firmwareVersion}
                </div>
                <div className="text-[11px] text-slate-700 mt-0.5">
                  Capacity: {currentDossier.fireAlarmPanelDetails.loopsCount} Loops / {currentDossier.fireAlarmPanelDetails.deviceCount} Devices
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs">
              <span className="font-bold text-slate-800">Scope of Work: </span>
              <span className="text-slate-700">{currentDossier.scopeOfWork}</span>
            </div>
          </div>

          {/* Section 3: Statutory Multi-Disciplinary Approval Matrix (5 Roles) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 font-serif">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  Statutory Approval Matrix (5-Role Verification)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mandatory sign-off pursuant to SANS 10139:2021 Clause 13.2, SANS 10400-T Table C.1, and OHS Act Construction Regulations.
                </p>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  currentDossier.status === 'approved' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {currentDossier.status === 'approved' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Statutory Dossier Approved
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      Awaiting Sign-off ({currentDossier.approvalMatrix.filter(a => a.verificationStatus === 'verified').length} of 5 Signed)
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Matrix Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentDossier.approvalMatrix.map((appr) => {
                const isVerified = appr.verificationStatus === 'verified';
                const isCommissioner = appr.roleId === 'commissioner';

                return (
                  <div 
                    key={appr.roleId}
                    className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                      isVerified 
                        ? 'bg-slate-50/80 border-slate-300' 
                        : isCommissioner 
                          ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-300'
                          : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      {/* Role Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                          {appr.roleTitle}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isVerified 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {appr.verificationStatus.toUpperCase()}
                        </span>
                      </div>

                      {/* Person Name & Role */}
                      <div className="text-sm font-bold text-slate-900">
                        {appr.personName || 'Designated Representative'}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {appr.designation}
                      </div>

                      {/* Registration Number */}
                      <div className="mt-2 text-[11px] font-mono bg-white/80 p-1.5 rounded border border-slate-200">
                        <span className="text-slate-500">Reg #: </span>
                        <span className="font-bold text-slate-800">
                          {appr.registrationNumber || 'N/A (Declared)'}
                        </span>
                      </div>
                    </div>

                    {/* Signature Area */}
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      {isVerified && appr.signatureDataUrl ? (
                        <div className="space-y-1.5">
                          <div className="h-14 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1">
                            <img 
                              src={appr.signatureDataUrl} 
                              alt="Signature" 
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>Signed: {appr.signedDate}</span>
                            <span className="font-mono text-emerald-700 font-medium">✓ Cryptographic Hash</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="h-14 bg-slate-100/70 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-xs text-slate-400">
                            Awaiting Digital Signature
                          </div>
                          <button
                            onClick={() => handleOpenSigningModal(appr)}
                            className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors print:hidden"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                            Sign As {appr.roleTitle}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Emergency Contacts & Life Safety Desk */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-600" />
              Emergency & Project Life-Safety Contacts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {currentDossier.emergencyContacts.map((contact, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-900">{contact.name}</div>
                  <div className="text-[11px] text-slate-500">{contact.role}</div>
                  <div className="mt-1.5 font-mono text-slate-800 font-semibold">
                    Tel: {contact.telephone}
                  </div>
                  <div className="font-mono text-slate-600 text-[11px]">
                    Mobile: {contact.mobile}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Compliance Footer Declaration */}
          <div className="pt-4 border-t border-slate-200 text-center space-y-1">
            <div className="text-[11px] font-bold text-slate-700">
              AUDITED LIFE-SAFETY SAFETY FILE DOSSIER · CONFORMS TO SANS 10139:2021 & SANS 10400-T
            </div>
            <div className="text-[10px] text-slate-500">
              This document forms an integral part of the building safety register. Unauthorized alteration, removal of pages, or falsification of commissioner signatures constitutes an offense under the Occupational Health and Safety Act (Act 85 of 1993).
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Signing Modal using DigitalSignatureCanvas */}
      {activeSigningRole && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Statutory Sign-Off: {activeSigningRole.roleTitle}
                </h3>
              </div>
              <button
                onClick={() => setActiveSigningRole(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <DigitalSignatureCanvas
                defaultSignerName={activeSigningRole.personName || currentUser.name}
                defaultSignerRole={activeSigningRole.designation}
                defaultSaqccNumber={activeSigningRole.registrationNumber || (activeSigningRole.roleId === 'commissioner' ? 'SAQCC-9109170791081' : '')}
                documentTitle={`Safety File Cover Sign-Off: ${currentDossier.dossierNumber}`}
                documentNumber={currentDossier.dossierNumber}
                signerType={activeSigningRole.roleId === 'commissioner' ? 'commissioner' : activeSigningRole.roleId === 'audrin_technician' ? 'technician' : 'client'}
                onSignatureCapture={handleSaveSignature}
                onClear={() => {}}
                formType="coc"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
