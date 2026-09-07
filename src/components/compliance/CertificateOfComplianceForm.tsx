import React, { useState, useMemo } from 'react';
import { useAudrinStore } from '../../services/store';
import { SansCocCertificate, SystemCategory, DigitalSignatureData } from '../../types';
import { DigitalSignatureCanvas } from './DigitalSignatureCanvas';
import { CocPrintPreview } from './coc/CocPrintPreview';
import { CocEmailModal } from './coc/CocEmailModal';
import { CocPdfExportModal } from './coc/CocPdfExportModal';
import { DocumentVersioningManager } from './coc/DocumentVersioningManager';
import { certificateEmailService } from '../../services/CertificateEmailService';
import { 
  Award, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  User, 
  Layers, 
  Activity, 
  FileCheck, 
  PenTool, 
  Eye, 
  Save, 
  Send, 
  Download, 
  Printer, 
  X,
  HelpCircle,
  Clock,
  Briefcase,
  Sliders,
  ChevronRight,
  ChevronLeft,
  RotateCw,
  History,
  Cpu,
  Database,
  Sparkles,
  Radio
} from 'lucide-react';
import { SyncDeviceInventoryModal, SyncCurrentValues } from './SyncDeviceInventoryModal';

interface CertificateOfComplianceFormProps {
  isOpen: boolean;
  onClose: () => void;
  siteId?: string;
  existingCocId?: string;
  onSaved?: (coc: SansCocCertificate) => void;
}

export const CertificateOfComplianceForm: React.FC<CertificateOfComplianceFormProps> = ({
  isOpen,
  onClose,
  siteId,
  existingCocId,
  onSaved
}) => {
  const store = useAudrinStore();
  const sites = store.getSites();
  const preWorkInspections = store.getPreWorkInspections();
  const postWorkInspections = store.getPostWorkInspections();
  const defects = store.getDefects();
  const existingCocs = store.getSansCocs();
  const branding = store.getCurrentCompanyBranding();

  // Active site resolution
  const activeSite = sites.find(s => s.id === (siteId || sites[0]?.id)) || sites[0];

  // Match existing inspection records for this site to auto-populate
  const sitePreWork = preWorkInspections.find(p => p.siteId === activeSite.id);
  const sitePostWork = postWorkInspections.find(p => p.siteId === activeSite.id);
  const existingCoc = existingCocId === 'new'
    ? undefined
    : existingCocs.find(c => c.id === existingCocId || (Boolean(siteId) && c.siteId === activeSite?.id));

  // Active Tab navigation
  type TabKey = 'details' | 'commissioner' | 'system' | 'tests' | 'records' | 'declarations' | 'preview' | 'versions';
  const [activeTab, setActiveTab] = useState<TabKey>('details');
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [pdfExportModalOpen, setPdfExportModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [revisionReason, setRevisionReason] = useState('Routine statutory SANS 10139 compliance commissioning');

  const archivedRevisions = store.getCocRevisions(existingCoc?.id || existingCocId);

  // Form State: 1. Client & Premises
  const [clientName, setClientName] = useState(existingCoc?.clientName || activeSite.contactPerson || 'Bethuel Moukangwe');
  const [organisationName, setOrganisationName] = useState(existingCoc?.organisationName || branding?.registeredName || 'Tshivhase Commercial Holdings (Pty) Ltd');
  const [siteName, setSiteName] = useState(existingCoc?.siteName || activeSite.name);
  const [siteAddress, setSiteAddress] = useState(existingCoc?.siteAddress || activeSite.address);
  const [occupancyType, setOccupancyType] = useState(existingCoc?.buildingOccupancyType || activeSite.buildingType || 'Commercial Multi-Storey (Class B1)');
  const [safetyOfficerName, setSafetyOfficerName] = useState(existingCoc?.clientSafetyOfficer?.name || 'Bethuel Moukangwe');
  const [safetyOfficerEmail, setSafetyOfficerEmail] = useState(existingCoc?.clientSafetyOfficer?.email || 'safety@tshivhase.co.za');
  const [safetyOfficerPhone, setSafetyOfficerPhone] = useState(existingCoc?.clientSafetyOfficer?.contactNumber || '071 415 6665');
  const [projectRef, setProjectRef] = useState(existingCoc?.projectReference || `PRJ-AFE-${new Date().getFullYear()}-0842`);

  // Form State: 2. Installing Company & Commissioner Credentials
  const [companyName] = useState('Audrin Fire Engineers (Pty) Ltd');
  const [companyReg] = useState('K2026089596');
  const [companyVat] = useState('4920288190');
  const [commissionerName, setCommissionerName] = useState(existingCoc?.commissionerName || 'Noko Dina Ramphela');
  const [commissionerId, setCommissionerId] = useState(existingCoc?.commissionerIdNumber || '9109170791081');
  const [commissionerEmail, setCommissionerEmail] = useState(existingCoc?.commissionerEmail || 'rampheledina@gmail.com');
  const [commissionerSaqcc, setCommissionerSaqcc] = useState(existingCoc?.commissionerSaqccNumber || 'SAQCC-SANS10139-COMM-2022/03/23');
  const [commissionerExpiry, setCommissionerExpiry] = useState(existingCoc?.commissionerSaqccExpiryDate || '2027-12-31');
  const [leadTechName, setLeadTechName] = useState(existingCoc?.leadTechnician?.name || sitePostWork?.leadTechnicianName || 'Sipho Ndlovu');
  const [leadTechSaqcc, setLeadTechSaqcc] = useState(existingCoc?.leadTechnician?.saqccNumber || 'SAQCC-9109170791081');
  const [leadTechExpiry, setLeadTechExpiry] = useState(existingCoc?.leadTechnician?.expiryDate || '2027-08-31');

  // Form State: 3. System Specs & Device Schedule
  const [systemCategory, setSystemCategory] = useState<SystemCategory>(existingCoc?.systemCategory || 'L1');
  const [systemObjective, setSystemObjective] = useState<'Life Protection' | 'Property Protection' | 'Dual Protection (Life & Property)'>(
    existingCoc?.systemObjective || 'Dual Protection (Life & Property)'
  );
  const [isSleepingRisk, setIsSleepingRisk] = useState(existingCoc?.isSleepingRisk ?? false);
  const [panelBrand, setPanelBrand] = useState(existingCoc?.controlPanelDetails?.brand || 'Kentec Syncro AS');
  const [panelModel, setPanelModel] = useState(existingCoc?.controlPanelDetails?.model || 'Syncro AS 4-Loop');
  const [panelSerial, setPanelSerial] = useState(existingCoc?.controlPanelDetails?.serialNumber || 'SN-KNT-889102');
  const [panelLocation, setPanelLocation] = useState(existingCoc?.controlPanelDetails?.location || 'Ground Floor Security Control Centre');
  const [loopCount, setLoopCount] = useState(existingCoc?.controlPanelDetails?.loopCount ?? 4);
  const [zoneCount, setZoneCount] = useState(existingCoc?.controlPanelDetails?.zoneCount ?? 16);

  // Device Schedule (Color-coded dots)
  const [blueDotSmoke, setBlueDotSmoke] = useState(existingCoc?.deviceSchedule.blueDotSmokeDetectors ?? 124);
  const [blackDotHeat, setBlackDotHeat] = useState(existingCoc?.deviceSchedule.blackDotHeatDetectors ?? 18);
  const [redDotSounders, setRedDotSounders] = useState(existingCoc?.deviceSchedule.redDotSoundersSirens ?? 16);
  const [greenDotMcp, setGreenDotMcp] = useState(existingCoc?.deviceSchedule.greenDotManualCallPoints ?? 14);
  const [multiSensors, setMultiSensors] = useState(existingCoc?.deviceSchedule.multiSensorDetectors ?? 22);
  const [beamSensors, setBeamSensors] = useState(existingCoc?.deviceSchedule.opticalBeamDetectors ?? 4);
  const [aspiratingPoints, setAspiratingPoints] = useState(existingCoc?.deviceSchedule.aspiratingSamplingPoints ?? 8);

  // Form State: 4. Commissioning Test Outcomes
  const [standbyHours, setStandbyHours] = useState(existingCoc?.powerSupplyAutonomy.standbyAutonomyHours ?? 24.5);
  const [alarmMinutes, setAlarmMinutes] = useState(existingCoc?.powerSupplyAutonomy.evacuateAlarmDurationMinutes ?? 35);
  const [standbyGenerator, setStandbyGenerator] = useState(existingCoc?.powerSupplyAutonomy.standbyGeneratorPresent ?? true);
  const [mainsFailTimeMinutes, setMainsFailTimeMinutes] = useState(existingCoc?.powerSupplyAutonomy.mainsFailIndicationTimeMinutes ?? 15);
  const [bedheadDba, setBedheadDba] = useState(existingCoc?.audibilityAndSounders.soundLevelBedheadDba ?? 75.4);
  const [maxSoundPressureDba, setMaxSoundPressureDba] = useState(existingCoc?.audibilityAndSounders.maxSoundPressureAccessibleDba ?? 94.0);
  const [smokeRadiusM, setSmokeRadiusM] = useState(existingCoc?.detectorSitingAndSpacing.smokeDetectorSpacingRadiusM ?? 7.2);
  const [heatRadiusM, setHeatRadiusM] = useState(existingCoc?.detectorSitingAndSpacing.heatDetectorSpacingRadiusM ?? 4.8);
  const [mcpHeightM, setMcpHeightM] = useState(existingCoc?.detectorSitingAndSpacing.mcpMountingHeightM ?? 1.4);
  const [shortCircuitSeconds, setShortCircuitSeconds] = useState(existingCoc?.faultResponseTimes.detectorShortOrOpenCircuitFaultSeconds ?? 145);
  const [cableSpecification, setCableSpecification] = useState(existingCoc?.cablingAndCircuits.cableSpecification || 'PH 30 Enhanced Fire Resistant');
  const [conductorCrossSection, setConductorCrossSection] = useState(existingCoc?.cablingAndCircuits.conductorCrossSectionMm2 ?? 1.5);

  // Form State: 5. Deviations & Records
  const [preWorkRef, setPreWorkRef] = useState(existingCoc?.inspectionRecords?.preWorkInspectionNumber || sitePreWork?.inspectionNumber || 'PRE-2026-0041');
  const [postWorkRef, setPostWorkRef] = useState(existingCoc?.inspectionRecords?.postWorkInspectionNumber || sitePostWork?.inspectionNumber || 'POST-2026-0082');
  const [asBuiltRef, setAsBuiltRef] = useState(existingCoc?.inspectionRecords?.asBuiltDrawingsRef || 'DWG-MEN-L1-L4-REV3');
  const [variationsNotes, setVariationsNotes] = useState(existingCoc?.variationsAndExclusions || 'No variations from SANS 10139 recommendations. Total Category L1 coverage verified across all designated spaces.');

  // Form State: 6. Signatures & Status
  const [commissionerSignature, setCommissionerSignature] = useState<DigitalSignatureData | undefined>(existingCoc?.commissionerSignatureData);
  const [clientSignature, setClientSignature] = useState<DigitalSignatureData | undefined>(existingCoc?.clientSignatureData);
  const [certificateStatus, setCertificateStatus] = useState<'Draft' | 'Issued' | 'Revised' | 'Cancelled'>(
    existingCoc?.certificateStatus || (existingCoc?.isSigned ? 'Issued' : 'Draft')
  );
  const [revisionNumber, setRevisionNumber] = useState(existingCoc?.revisionNumber || 'Rev 1.0');
  const [autoEmailOnIssue, setAutoEmailOnIssue] = useState(true);
  const [isIssuingAndEmailing, setIsIssuingAndEmailing] = useState(false);
  const [issueNotice, setIssueNotice] = useState<string | null>(null);

  // Hardware Inventory Sync State
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [lastInventorySyncRef, setLastInventorySyncRef] = useState<string | null>(existingCoc ? 'INV-MEN-2026-0842' : null);
  const [lastInventorySyncTime, setLastInventorySyncTime] = useState<string | null>(existingCoc ? 'Baseline' : null);
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  // Associated Project Hardware Inventory
  const linkedProjectInventory = useMemo(() => {
    return store.getProjectHardwareInventory(projectRef || activeSite.id);
  }, [store, projectRef, activeSite.id]);

  // Direct Auto-Sync Device Inventory Handler
  const handleAutoSyncDeviceInventory = () => {
    const inv = linkedProjectInventory || store.getProjectHardwareInventory();
    if (!inv) {
      setSyncToastMessage('No hardware inventory record found for this project.');
      setTimeout(() => setSyncToastMessage(null), 4000);
      return;
    }

    const panel = inv.panelDetails;
    const summary = inv.deviceScheduleSummary;

    setPanelBrand(panel.brand);
    setPanelModel(panel.model);
    setPanelSerial(panel.serialNumber);
    setPanelLocation(panel.location);
    setLoopCount(panel.loopCount);
    setZoneCount(panel.zoneCount || inv.zones.length);

    setBlueDotSmoke(summary.blueDotSmokeDetectors);
    setBlackDotHeat(summary.blackDotHeatDetectors);
    setRedDotSounders(summary.redDotSoundersSirens);
    setGreenDotMcp(summary.greenDotManualCallPoints);
    setMultiSensors(summary.multiSensorDetectors);
    setBeamSensors(summary.opticalBeamDetectors);
    setAspiratingPoints(summary.aspiratingSamplingPoints);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastInventorySyncRef(inv.inventoryRef);
    setLastInventorySyncTime(now);

    setSyncToastMessage(
      `✓ Successfully synchronized ${panel.loopCount} Loops, ${panel.zoneCount || inv.zones.length} Zones, and ${summary.totalDeviceCount} Devices from ${inv.inventoryRef} (${inv.siteName})`
    );
    setTimeout(() => setSyncToastMessage(null), 6000);

    store.logAudit(
      'SANS_10139_INVENTORY_SYNC',
      'CertificateOfComplianceForm',
      inv.inventoryRef,
      `Hardware Inventory synchronized into COC: ${panel.loopCount} Loops, ${panel.zoneCount} Zones, ${summary.totalDeviceCount} Devices (Ref: ${inv.inventoryRef}).`
    );
  };

  // Modal Sync Callback
  const handleApplyModalSync = (syncedData: SyncCurrentValues & { inventoryRef: string; auditDate: string; auditor: string }) => {
    setPanelBrand(syncedData.panelBrand);
    setPanelModel(syncedData.panelModel);
    setPanelSerial(syncedData.panelSerial);
    setPanelLocation(syncedData.panelLocation);
    setLoopCount(syncedData.loopCount);
    setZoneCount(syncedData.zoneCount);

    setBlueDotSmoke(syncedData.blueDotSmoke);
    setBlackDotHeat(syncedData.blackDotHeat);
    setRedDotSounders(syncedData.redDotSounders);
    setGreenDotMcp(syncedData.greenDotMcp);
    setMultiSensors(syncedData.multiSensors);
    setBeamSensors(syncedData.beamSensors);
    setAspiratingPoints(syncedData.aspiratingPoints);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastInventorySyncRef(syncedData.inventoryRef);
    setLastInventorySyncTime(now);

    const totalDevs = 
      syncedData.blueDotSmoke +
      syncedData.blackDotHeat +
      syncedData.redDotSounders +
      syncedData.greenDotMcp +
      syncedData.multiSensors +
      syncedData.beamSensors +
      syncedData.aspiratingPoints;

    setSyncToastMessage(
      `✓ Applied hardware inventory synchronization: ${syncedData.loopCount} Loops, ${syncedData.zoneCount} Zones & ${totalDevs} Devices from ${syncedData.inventoryRef}`
    );
    setTimeout(() => setSyncToastMessage(null), 6000);

    store.logAudit(
      'SANS_10139_INVENTORY_SYNC',
      'CertificateOfComplianceForm',
      syncedData.inventoryRef,
      `Detailed hardware inventory sync applied to COC from ${syncedData.inventoryRef} (${syncedData.auditor}): ${syncedData.loopCount} Loops, ${syncedData.zoneCount} Zones, ${totalDevs} Devices.`
    );
  };

  // Check Commissioner Registration Expiry
  const isCommissionerExpired = useMemo(() => {
    if (!commissionerExpiry) return false;
    return new Date(commissionerExpiry) < new Date();
  }, [commissionerExpiry]);

  // SANS 10139 Compliance Validations
  const isStandbyAutonomyValid = standbyHours >= 24;
  const isAlarmDurationValid = alarmMinutes >= 30;
  const isAudibilityValid = bedheadDba >= 65;
  const isSmokeRadiusValid = smokeRadiusM <= 7.5;
  const isHeatRadiusValid = heatRadiusM <= 5.3;
  const isMcpHeightValid = mcpHeightM >= 1.2 && mcpHeightM <= 1.6;
  const isSounderCountValid = redDotSounders >= 2;
  const isFaultTimeValid = shortCircuitSeconds <= 200;
  const isConductorValid = conductorCrossSection >= 1.0;
  const isSleepingRiskValid = !(isSleepingRisk && systemCategory === 'M'); // Cat M forbidden for sleeping risk

  // Critical or blocking open defects check
  const openBlockingDefects = defects.filter(d => d.siteId === activeSite.id && (d.blocksCocIssuance || d.riskLevel === 'critical') && d.status !== 'resolved');

  // Overall Issuance Readiness Checklist
  const missingRequirements: string[] = [];
  if (!clientName.trim()) missingRequirements.push('Client Full Name');
  if (!siteAddress.trim()) missingRequirements.push('Premises Physical Address');
  if (!commissionerName.trim()) missingRequirements.push('Commissioner Name');
  if (!commissionerSaqcc.trim()) missingRequirements.push('Commissioner SAQCC Registration Number');
  if (isCommissionerExpired) missingRequirements.push('Active, Unexpired Commissioner SAQCC Registration (Currently Expired)');
  if (!isStandbyAutonomyValid) missingRequirements.push('Secondary Battery Standby Autonomy (Must be >= 24h)');
  if (!isAlarmDurationValid) missingRequirements.push('Full Evacuation Alarm Duration (Must be >= 30 min)');
  if (!isAudibilityValid) missingRequirements.push('Audibility Bedhead Level (Must be >= 65 dB(A))');
  if (!isSounderCountValid) missingRequirements.push('Minimum Sounder Count (At least 2 sounders required)');
  if (!isFaultTimeValid) missingRequirements.push('Fault Response Time (Must be <= 200 seconds)');
  if (!isConductorValid) missingRequirements.push('Conductor Cross-Section (Must be >= 1.0 mm²)');
  if (!isSleepingRiskValid) missingRequirements.push('System Category Selection (Category M is forbidden for sleeping risk)');
  if (openBlockingDefects.length > 0) missingRequirements.push(`${openBlockingDefects.length} Unresolved Defect(s) Blocking COC Issuance`);
  if (!commissionerSignature) missingRequirements.push('Authorised Commissioner Digital Signature');
  if (!clientSignature) missingRequirements.push('Client Handover Acceptance Digital Signature');

  const canOfficiallyIssue = missingRequirements.length === 0;
  const isFormDraft = !canOfficiallyIssue || certificateStatus !== 'Issued';
  const [showDraftChecklist, setShowDraftChecklist] = useState(false);

  // Tab-level status evaluation for live visual progress indicators
  const tabStatus = useMemo(() => {
    const detailsComplete = !!(clientName.trim() && siteAddress.trim() && safetyOfficerName.trim() && safetyOfficerEmail.trim() && safetyOfficerPhone.trim());
    const commissionerComplete = !!(commissionerName.trim() && commissionerSaqcc.trim() && !isCommissionerExpired);
    const systemComplete = !!(systemCategory && isSleepingRiskValid && panelBrand.trim());
    const testsComplete = isStandbyAutonomyValid && isAlarmDurationValid && isAudibilityValid && isSmokeRadiusValid && isHeatRadiusValid && isMcpHeightValid && isSounderCountValid && isFaultTimeValid && isConductorValid;
    const recordsComplete = !!(preWorkRef.trim() && postWorkRef.trim() && asBuiltRef.trim() && openBlockingDefects.length === 0);
    const signaturesComplete = !!(commissionerSignature && clientSignature);

    return {
      details: detailsComplete,
      commissioner: commissionerComplete,
      system: systemComplete,
      tests: testsComplete,
      records: recordsComplete,
      declarations: signaturesComplete,
      preview: canOfficiallyIssue,
      versions: true
    };
  }, [
    clientName, siteAddress, safetyOfficerName, safetyOfficerEmail, safetyOfficerPhone,
    commissionerName, commissionerSaqcc, isCommissionerExpired,
    systemCategory, isSleepingRiskValid, panelBrand,
    isStandbyAutonomyValid, isAlarmDurationValid, isAudibilityValid, isSmokeRadiusValid, isHeatRadiusValid, isMcpHeightValid, isSounderCountValid, isFaultTimeValid, isConductorValid,
    preWorkRef, postWorkRef, asBuiltRef, openBlockingDefects.length,
    commissionerSignature, clientSignature, canOfficiallyIssue
  ]);

  const handleRestoreSnapshot = (snapshot: SansCocCertificate) => {
    if (snapshot.clientName) setClientName(snapshot.clientName);
    if (snapshot.organisationName) setOrganisationName(snapshot.organisationName);
    if (snapshot.siteName) setSiteName(snapshot.siteName);
    if (snapshot.siteAddress) setSiteAddress(snapshot.siteAddress);
    if (snapshot.buildingOccupancyType) setOccupancyType(snapshot.buildingOccupancyType);
    if (snapshot.projectReference) setProjectRef(snapshot.projectReference);
    if (snapshot.clientSafetyOfficer) {
      setSafetyOfficerName(snapshot.clientSafetyOfficer.name);
      setSafetyOfficerEmail(snapshot.clientSafetyOfficer.email);
      setSafetyOfficerPhone(snapshot.clientSafetyOfficer.contactNumber);
    }
    if (snapshot.commissionerName) setCommissionerName(snapshot.commissionerName);
    if (snapshot.commissionerIdNumber) setCommissionerId(snapshot.commissionerIdNumber);
    if (snapshot.commissionerEmail) setCommissionerEmail(snapshot.commissionerEmail);
    if (snapshot.commissionerSaqccNumber) setCommissionerSaqcc(snapshot.commissionerSaqccNumber);
    if (snapshot.commissionerSaqccExpiryDate) setCommissionerExpiry(snapshot.commissionerSaqccExpiryDate);
    if (snapshot.leadTechnician) {
      setLeadTechName(snapshot.leadTechnician.name);
      setLeadTechSaqcc(snapshot.leadTechnician.saqccNumber);
      setLeadTechExpiry(snapshot.leadTechnician.expiryDate);
    }
    if (snapshot.systemCategory) setSystemCategory(snapshot.systemCategory);
    if (snapshot.systemObjective) setSystemObjective(snapshot.systemObjective);
    setIsSleepingRisk(snapshot.isSleepingRisk ?? false);
    if (snapshot.controlPanelDetails) {
      setPanelBrand(snapshot.controlPanelDetails.brand);
      setPanelModel(snapshot.controlPanelDetails.model);
      setPanelSerial(snapshot.controlPanelDetails.serialNumber);
      setPanelLocation(snapshot.controlPanelDetails.location);
      setLoopCount(snapshot.controlPanelDetails.loopCount);
      setZoneCount(snapshot.controlPanelDetails.zoneCount);
    }
    if (snapshot.deviceSchedule) {
      setBlueDotSmoke(snapshot.deviceSchedule.blueDotSmokeDetectors);
      setBlackDotHeat(snapshot.deviceSchedule.blackDotHeatDetectors);
      setRedDotSounders(snapshot.deviceSchedule.redDotSoundersSirens);
      setGreenDotMcp(snapshot.deviceSchedule.greenDotManualCallPoints);
      setMultiSensors(snapshot.deviceSchedule.multiSensorDetectors);
      setBeamSensors(snapshot.deviceSchedule.opticalBeamDetectors);
      setAspiratingPoints(snapshot.deviceSchedule.aspiratingSamplingPoints);
    }
    if (snapshot.powerSupplyAutonomy) {
      setStandbyHours(snapshot.powerSupplyAutonomy.standbyAutonomyHours);
      setAlarmMinutes(snapshot.powerSupplyAutonomy.evacuateAlarmDurationMinutes);
      setStandbyGenerator(snapshot.powerSupplyAutonomy.standbyGeneratorPresent);
      setMainsFailTimeMinutes(snapshot.powerSupplyAutonomy.mainsFailIndicationTimeMinutes);
    }
    if (snapshot.cablingAndCircuits) {
      setCableSpecification(snapshot.cablingAndCircuits.cableSpecification);
      setConductorCrossSection(snapshot.cablingAndCircuits.conductorCrossSectionMm2);
    }
    if (snapshot.detectorSitingAndSpacing) {
      setSmokeRadiusM(snapshot.detectorSitingAndSpacing.smokeDetectorSpacingRadiusM);
      setHeatRadiusM(snapshot.detectorSitingAndSpacing.heatDetectorSpacingRadiusM);
      setMcpHeightM(snapshot.detectorSitingAndSpacing.mcpMountingHeightM);
    }
    if (snapshot.audibilityAndSounders) {
      setBedheadDba(snapshot.audibilityAndSounders.soundLevelBedheadDba);
      setMaxSoundPressureDba(snapshot.audibilityAndSounders.maxSoundPressureAccessibleDba);
    }
    if (snapshot.inspectionRecords) {
      if (snapshot.inspectionRecords.preWorkInspectionNumber) setPreWorkRef(snapshot.inspectionRecords.preWorkInspectionNumber);
      if (snapshot.inspectionRecords.postWorkInspectionNumber) setPostWorkRef(snapshot.inspectionRecords.postWorkInspectionNumber);
      if (snapshot.inspectionRecords.asBuiltDrawingsRef) setAsBuiltRef(snapshot.inspectionRecords.asBuiltDrawingsRef);
    }
    if (snapshot.variationsAndExclusions) setVariationsNotes(snapshot.variationsAndExclusions);
    if (snapshot.commissionerSignatureData) setCommissionerSignature(snapshot.commissionerSignatureData);
    if (snapshot.clientSignatureData) setClientSignature(snapshot.clientSignatureData);
  };

  if (!isOpen) return null;

  // Compile COC Object
  const compileCocObject = (statusToSet: 'Draft' | 'Issued'): SansCocCertificate => {
    const cocNum = existingCoc?.cocNumber || `COC-SANS10139-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const checksum = `sha256-coc-${cocNum.toLowerCase()}-${Date.now().toString(36)}`;

    return {
      id: existingCoc?.id || `coc-${Date.now()}`,
      cocNumber: cocNum,
      issueDate: existingCoc?.issueDate || new Date().toISOString().split('T')[0],
      siteId: activeSite.id,
      siteName,
      siteAddress,
      clientName,
      organisationName,
      projectReference: projectRef,
      buildingOccupancyType: occupancyType,
      systemCategory,
      systemObjective,
      isSleepingRisk,

      clientSafetyOfficer: {
        name: safetyOfficerName,
        email: safetyOfficerEmail,
        contactNumber: safetyOfficerPhone,
        role: 'Designated Client Safety Officer'
      },

      installingCompany: {
        legalName: companyName,
        registrationNumber: companyReg,
        vatNumber: companyVat,
        telephone: '+27 12 880 2930',
        email: 'compliance@audrinfire.co.za',
        physicalAddress: 'Menlyn Corporate Park, Building B, 175 Dallas Ave, Menlyn, Pretoria, 0181'
      },

      commissionerName,
      commissionerIdNumber: commissionerId,
      commissionerEmail,
      commissionerSaqccNumber: commissionerSaqcc,
      commissionerSaqccExpiryDate: commissionerExpiry,
      commissionerRegistrationValid: !isCommissionerExpired,
      companyRegistrationNumber: companyReg,

      leadTechnician: {
        name: leadTechName,
        saqccNumber: leadTechSaqcc,
        expiryDate: leadTechExpiry
      },

      controlPanelDetails: {
        brand: panelBrand,
        model: panelModel,
        serialNumber: panelSerial,
        location: panelLocation,
        loopCount,
        zoneCount
      },

      areasAndZonesCovered: [`${loopCount} Addressable Loops`, `${zoneCount} Detection Zones`],

      powerSupplyAutonomy: {
        mainsVoltage: 230,
        batteryType: 'VRLA Sealed Lead Acid',
        batteryCapacityAh: 17,
        standbyAutonomyHours: standbyHours,
        evacuateAlarmDurationMinutes: alarmMinutes,
        standbyGeneratorPresent: standbyGenerator,
        mainsFailIndicationTimeMinutes: mainsFailTimeMinutes,
        passed: isStandbyAutonomyValid && isAlarmDurationValid
      },

      cablingAndCircuits: {
        cableSpecification,
        conductorCrossSectionMm2: conductorCrossSection,
        cableColour: 'RED',
        conduitSegregationVerified: true,
        classACircuitsPhysicalConductors: true,
        singleFaultDisableLimitM2: 750,
        sounderCircuitsIsolatedInSeparateSheaths: true,
        passed: isConductorValid
      },

      detectorSitingAndSpacing: {
        smokeDetectorSpacingRadiusM: smokeRadiusM,
        heatDetectorSpacingRadiusM: heatRadiusM,
        pitchedRoofSlopeDegrees: 0,
        pitchedRoofSpacingAdjustmentPercent: 0,
        smokeApexRoofHeightThresholdMm: 0,
        heatApexRoofHeightThresholdMm: 0,
        beamDetectorMaxMountingRadiusM: 7.5,
        aspiratingSamplingPointsApexMm: 600,
        wallClearanceMm: 600,
        ceilingClearanceRangeMm: '25 mm min to 600 mm max',
        mcpMountingHeightM: mcpHeightM,
        heatDetectorPlacementRulesCompliant: true,
        passed: isSmokeRadiusValid && isHeatRadiusValid && isMcpHeightValid
      },

      audibilityAndSounders: {
        soundLevelBedheadDba: bedheadDba,
        maxSoundPressureAccessibleDba: maxSoundPressureDba,
        sounderCount: redDotSounders,
        passed: isAudibilityValid && isSounderCountValid
      },

      faultResponseTimes: {
        detectorShortOrOpenCircuitFaultSeconds: shortCircuitSeconds,
        mainsDisconnectionFaultMinutes: mainsFailTimeMinutes,
        passed: isFaultTimeValid
      },

      deviceSchedule: {
        blueDotSmokeDetectors: blueDotSmoke,
        blackDotHeatDetectors: blackDotHeat,
        redDotSoundersSirens: redDotSounders,
        greenDotManualCallPoints: greenDotMcp,
        flameDetectorsIrUv: 0,
        multiSensorDetectors: multiSensors,
        aspiratingSamplingPoints: aspiratingPoints,
        opticalBeamDetectors: beamSensors
      },

      inspectionRecords: {
        preWorkInspectionNumber: preWorkRef,
        postWorkInspectionNumber: postWorkRef,
        asBuiltDrawingsRef: asBuiltRef,
        logbookRef: `LOG-${activeSite.id}`,
        zoneChartVerified: true
      },

      variationsAndExclusions: variationsNotes,
      overallComplianceStatus: statusToSet === 'Issued' ? 'Fully Compliant' : 'Approved with Minor Documented Variations',
      commissionerDeclaration: `I hereby declare that the fire detection and fire alarm system at ${siteName} has been inspected, tested and commissioned in accordance with SANS 10139 and the recommendations of the SAQCC Commissioner Module.`,
      clientDeclaration: `I hereby acknowledge receipt of the fire detection system, as-built drawings, operating instructions, and SANS 10139 fire detection logbook for ${siteName}.`,
      
      commissionerSignatureData: commissionerSignature,
      clientSignatureData: clientSignature,
      isSigned: !!commissionerSignature && !!clientSignature,
      signatureHash: commissionerSignature?.documentSha256Hash || checksum,

      certificateStatus: statusToSet,
      revisionNumber,
      revisionHistory: existingCoc?.revisionHistory || archivedRevisions,
      activeRevisionId: existingCoc?.activeRevisionId,
      applicableStandard: 'SANS 10139:2012 / SANS 10400-T:2020',
      moduleRevisionUsed: 'SAQCC SANS 10139 Commissioner Module (Summative POE Edition)',
      documentChecksumSha256: checksum,
      qrVerificationUrl: `https://audrinfire.co.za/verify/coc/${cocNum}`,
      emailDispatches: existingCoc?.emailDispatches || []
    };
  };

  const handleSaveDraft = () => {
    const draftCoc = compileCocObject('Draft');
    if (existingCoc) {
      store.updateSansCoc(draftCoc);
    } else {
      store.addSansCoc(draftCoc);
    }
    setCertificateStatus('Draft');
    setValidationError(null);
    if (onSaved) onSaved(draftCoc);
    alert('SANS 10139 Certificate of Compliance saved as DRAFT. Marked with statutory DRAFT watermark.');
  };

  const handleIssueFinalCoc = async () => {
    if (!canOfficiallyIssue) {
      setValidationError(`Cannot issue official COC. ${missingRequirements.length} compliance requirement(s) missing: ${missingRequirements.join(', ')}`);
      return;
    }

    setIsIssuingAndEmailing(true);
    setValidationError(null);
    const issuedCoc = compileCocObject('Issued');

    if (autoEmailOnIssue) {
      try {
        const dispatchResult = await certificateEmailService.sendOnOfficialIssuance(issuedCoc, {
          clientEmail: safetyOfficerEmail || 'client@tshivhase.co.za',
          safetyOfficerEmail: safetyOfficerEmail,
          customMessage: variationsNotes
        });

        issuedCoc.documentChecksumSha256 = dispatchResult.documentChecksumSha256;
      } catch (err: any) {
        console.warn('Auto email dispatch warning:', err);
      }
    }

    setIsIssuingAndEmailing(false);

    if (existingCoc) {
      store.updateSansCoc(issuedCoc);
    } else {
      store.addSansCoc(issuedCoc);
    }

    // AUTOMATICALLY CREATE IMMUTABLE REVISION RECORD IN DATABASE
    const revReason = revisionReason.trim() || `Statutory issuance of SANS 10139 Certificate of Compliance ${issuedCoc.revisionNumber || 'Rev 1.0'}`;
    const revisionRecord = store.createCocRevision(
      issuedCoc,
      revReason,
      [
        `System Category: Category ${issuedCoc.systemCategory} (${issuedCoc.systemObjective})`,
        `${issuedCoc.deviceSchedule.blueDotSmokeDetectors} Smoke Detectors, ${issuedCoc.deviceSchedule.blackDotHeatDetectors} Heat Detectors, ${issuedCoc.deviceSchedule.greenDotManualCallPoints} MCPs, ${issuedCoc.deviceSchedule.redDotSoundersSirens} Sounders`,
        `Standby Autonomy: ${issuedCoc.powerSupplyAutonomy.standbyAutonomyHours}h / Alarm Duration: ${issuedCoc.powerSupplyAutonomy.evacuateAlarmDurationMinutes}m verified`,
        `Dual Signatures Sealed: Commissioner ${issuedCoc.commissionerName} & Client Representative`
      ]
    );

    issuedCoc.documentChecksumSha256 = revisionRecord.documentChecksumSha256;
    issuedCoc.activeRevisionId = revisionRecord.id;
    setCertificateStatus('Issued');

    setIssueNotice(
      `Official SANS 10139 COC (${revisionRecord.revisionNumber}) Issued & Sealed. Immutable revision record permanently archived to database ledger (Ref: ${revisionRecord.auditTrailRef}). SHA-256: ${revisionRecord.documentChecksumSha256.substring(0, 16)}...`
    );

    if (onSaved) onSaved(issuedCoc);
    setActiveTab('versions');
  };

  const currentWorkingCoc = compileCocObject(certificateStatus === 'Issued' ? 'Issued' : 'Draft');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-6xl bg-[#111114] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1A1A1E] via-[#141417] to-[#0E0E10] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center flex-wrap gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/40 font-mono uppercase">
                SAQCC SANS 10139 Commissioner Module
              </span>
              {!canOfficiallyIssue ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  DRAFT (INCOMPLETE &middot; {missingRequirements.length} PENDING)
                </span>
              ) : certificateStatus === 'Issued' ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ISSUED &amp; LOCKED
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1.5">
                  DRAFT (COMPLIANT &middot; READY TO ISSUE)
                </span>
              )}
              <button
                type="button"
                onClick={() => setActiveTab('versions')}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 hover:bg-white/20 text-[#C1A461] border border-[#C1A461]/30 flex items-center gap-1.5 transition cursor-pointer"
                title="Open SANS 10139 Document Versioning Manager"
              >
                <History className="w-3 h-3 text-[#C1A461]" />
                <span>{revisionNumber || 'Rev 1.0'} &middot; {archivedRevisions.length} Revisions</span>
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              SANS 10139 Certificate of Compliance (COC) Generator
            </h2>
            <p className="text-xs text-white/60">
              Site: <span className="text-white font-semibold">{activeSite.name}</span> &middot; Occupancy: {activeSite.buildingType}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setPdfExportModalOpen(true)}
              className="px-3.5 py-2 bg-[#C1A461]/10 hover:bg-[#C1A461]/20 border border-[#C1A461]/40 text-[#C1A461] rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Export current state as locked non-editable PDF with DRAFT or ISSUED watermark"
            >
              <Download className="w-4 h-4 text-[#C1A461]" />
              <span className="hidden sm:inline">Export Locked PDF</span>
              <span className="sm:hidden">Export PDF</span>
            </button>
            <button
              onClick={() => setActiveTab(activeTab === 'preview' ? 'details' : 'preview')}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[#C1A461] rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition"
            >
              <Eye className="w-4 h-4" />
              {activeTab === 'preview' ? 'Back to Editor' : 'Print Preview'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Persistent Statutory Draft Notification Banner for Incomplete / Draft Forms */}
        {isFormDraft && (
          <div className="px-5 py-3 bg-gradient-to-r from-amber-950/70 via-amber-900/30 to-black/60 border-b border-amber-500/30 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  DRAFT – NOT A VALID CERTIFICATE
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {missingRequirements.length > 0 ? (
                    <span>
                      This document is in <strong>DRAFT</strong> status because <strong>{missingRequirements.length}</strong> mandatory statutory requirement{missingRequirements.length > 1 ? 's are' : ' is'} incomplete. Under SANS 10139 and SAQCC regulations, it cannot be legally presented as a valid compliance certificate.
                    </span>
                  ) : (
                    <span>
                      All mandatory physical tests and records completed. Awaiting authorised commissioner and client digital signatures to issue the final certificate.
                    </span>
                  )}
                </p>
              </div>

              {missingRequirements.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowDraftChecklist(!showDraftChecklist)}
                  className="px-3 py-1 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  <span>{showDraftChecklist ? 'Hide Checklist' : `View Missing (${missingRequirements.length})`}</span>
                </button>
              )}
            </div>

            {/* Expanded Draft Requirements Checklist */}
            {showDraftChecklist && missingRequirements.length > 0 && (
              <div className="mt-3 pt-3 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {missingRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] font-mono text-amber-200/90 bg-black/40 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                    <span className="truncate">{req}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-[#0A0A0C] border-b border-white/10 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-thin">
          {[
            { id: 'details', label: '1. Client & Premises', icon: Building2 },
            { id: 'commissioner', label: '2. Credentials', icon: Award },
            { id: 'system', label: '3. System & Legend', icon: Layers },
            { id: 'tests', label: '4. Test Outcomes', icon: Activity },
            { id: 'records', label: '5. Deviations & Records', icon: FileCheck },
            { id: 'declarations', label: '6. Signatures', icon: PenTool },
            { id: 'preview', label: '7. Print Preview & Email', icon: Eye },
            { id: 'versions', label: `8. Revisions (${archivedRevisions.length})`, icon: History }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            const isTabComplete = tabStatus[t.id as keyof typeof tabStatus];
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as TabKey)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
                  isActive
                    ? 'bg-[#C1A461] text-black shadow-md shadow-[#C1A461]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                {t.id !== 'preview' && (
                  <span
                    className={`w-2 h-2 rounded-full ${isTabComplete ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}
                    title={isTabComplete ? 'Section Complete' : 'Mandatory fields missing'}
                  />
                )}
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-2 pl-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsSyncModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#C1A461]/15 hover:bg-[#C1A461]/25 text-[#C1A461] border border-[#C1A461]/30 font-mono text-[11px] font-bold whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer"
              title="Open SyncDeviceInventory utility to inspect and pull hardware records"
            >
              <RotateCw className="w-3 h-3" />
              <span>Sync Inventory</span>
              {lastInventorySyncRef ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Synchronized" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" title="Sync Available" />
              )}
            </button>
          </div>
        </div>

        {/* Validation Warning Alert */}
        {validationError && (
          <div className="px-6 py-3 bg-red-950/50 border-b border-red-500/40 text-xs text-red-200 flex items-center gap-3 shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div className="flex-1">{validationError}</div>
            <button onClick={() => setValidationError(null)} className="text-red-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Issuance & Automated Dispatch Success Banner */}
        {issueNotice && (
          <div className="px-6 py-3 bg-emerald-950/60 border-b border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-3 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex-1 font-mono text-[11px] leading-relaxed">{issueNotice}</div>
            <button onClick={() => setIssueNotice(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Hardware Inventory Sync Toast Notification */}
        {syncToastMessage && (
          <div className="px-6 py-3 bg-gradient-to-r from-[#C1A461]/20 via-[#1C1C24] to-black border-b border-[#C1A461]/40 text-xs text-[#C1A461] flex items-center justify-between gap-3 shrink-0 animate-in fade-in">
            <div className="flex items-center gap-2.5 font-mono text-[11px]">
              <Database className="w-4 h-4 text-[#C1A461] shrink-0" />
              <span>{syncToastMessage}</span>
            </div>
            <button 
              onClick={() => setSyncToastMessage(null)} 
              className="text-[#C1A461]/70 hover:text-white font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0E0E11] text-white">
          
          {/* TAB 1: Client & Premises */}
          {activeTab === 'details' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#C1A461]" />
                  Section 1: Client, Premises and Safety Officer Details
                </h3>
                <p className="text-xs text-white/50">
                  Must reproduce all mandatory statutory client identification and occupancy parameters.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Client Legal Name *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Organisation / Property Owner *</label>
                  <input
                    type="text"
                    value={organisationName}
                    onChange={e => setOrganisationName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Premises / Building Name *</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={e => setSiteName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Building Occupancy Classification *</label>
                  <input
                    type="text"
                    value={occupancyType}
                    onChange={e => setOccupancyType(e.target.value)}
                    placeholder="e.g. Commercial Office (Class B1) / Industrial (Class D1)"
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-white/70 mb-1">Premises Physical Street Address *</label>
                  <input
                    type="text"
                    value={siteAddress}
                    onChange={e => setSiteAddress(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Project Internal Reference</label>
                  <input
                    type="text"
                    value={projectRef}
                    onChange={e => setProjectRef(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono text-white/70">Document Revision</label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('versions')}
                      className="text-[10px] font-mono text-[#C1A461] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <History className="w-3 h-3" />
                      Manage Revisions ({archivedRevisions.length})
                    </button>
                  </div>
                  <input
                    type="text"
                    value={revisionNumber}
                    onChange={e => setRevisionNumber(e.target.value)}
                    placeholder="Rev 1.0"
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>
              </div>

              {/* Safety Officer Box */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                <div className="font-bold text-xs text-[#C1A461] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Client Designated Safety Officer Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1">Officer Name *</label>
                    <input
                      type="text"
                      value={safetyOfficerName}
                      onChange={e => setSafetyOfficerName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1">Officer Email *</label>
                    <input
                      type="email"
                      value={safetyOfficerEmail}
                      onChange={e => setSafetyOfficerEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      value={safetyOfficerPhone}
                      onChange={e => setSafetyOfficerPhone(e.target.value)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Installing Company & Commissioner Credentials */}
          {activeTab === 'commissioner' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C1A461]" />
                  Section 2: Installing Company &amp; SAQCC Commissioner Credentials
                </h3>
                <p className="text-xs text-white/50">
                  Strict compliance mandate: Only a currently registered commissioner with valid expiry may issue the final COC.
                </p>
              </div>

              {/* Registration Expiry Notice */}
              {isCommissionerExpired && (
                <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center gap-3 text-red-300 text-xs">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <div>
                    <strong className="text-white">COMMISSIONER REGISTRATION EXPIRED:</strong> The expiry date ({commissionerExpiry}) is in the past. SANS 10139 and SAQCC regulations strictly prohibit issuing a certificate under an expired registration.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 p-3.5 bg-black/40 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="text-[#C1A461] font-bold font-mono text-[11px] uppercase tracking-wider">Installing Organisation</div>
                    <div className="text-white font-bold text-sm">{companyName}</div>
                    <div className="text-white/60 font-mono text-[10px]">
                      Reg: {companyReg} &middot; VAT: {companyVat} &middot; Pretoria, South Africa
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-mono">
                    SAQCC Certified Company
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Lead Fire Commissioner Name *</label>
                  <input
                    type="text"
                    value={commissionerName}
                    onChange={e => setCommissionerName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Commissioner ID Number *</label>
                  <input
                    type="text"
                    value={commissionerId}
                    onChange={e => setCommissionerId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">SAQCC Commissioner Reg Number *</label>
                  <input
                    type="text"
                    value={commissionerSaqcc}
                    onChange={e => setCommissionerSaqcc(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">SAQCC Expiry Date *</label>
                  <input
                    type="date"
                    value={commissionerExpiry}
                    onChange={e => setCommissionerExpiry(e.target.value)}
                    className={`w-full px-3.5 py-2 bg-black/50 border rounded-xl text-xs font-mono text-white focus:outline-none ${
                      isCommissionerExpired ? 'border-red-500 text-red-300' : 'border-white/10 focus:border-[#C1A461]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Lead Installation Technician</label>
                  <input
                    type="text"
                    value={leadTechName}
                    onChange={e => setLeadTechName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Technician SAQCC Reg Number</label>
                  <input
                    type="text"
                    value={leadTechSaqcc}
                    onChange={e => setLeadTechSaqcc(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: System Classification & Device Schedule */}
          {activeTab === 'system' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C1A461]" />
                  Section 3: Fire Alarm System Classification &amp; Device Schedule
                </h3>
                <p className="text-xs text-white/50">
                  Configure Category, Panel details, and device counts per the official color-coded SANS 10139 legend.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">SANS 10139 Category *</label>
                  <select
                    value={systemCategory}
                    onChange={e => setSystemCategory(e.target.value as SystemCategory)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  >
                    {['M', 'L1', 'L2', 'L3', 'L4', 'L5', 'P1', 'P2'].map(cat => (
                      <option key={cat} value={cat}>Category {cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">System Objective *</label>
                  <select
                    value={systemObjective}
                    onChange={e => setSystemObjective(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  >
                    <option value="Life Protection">Life Protection</option>
                    <option value="Property Protection">Property Protection</option>
                    <option value="Dual Protection (Life & Property)">Dual Protection (Life &amp; Property)</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                    <input
                      type="checkbox"
                      checked={isSleepingRisk}
                      onChange={e => setIsSleepingRisk(e.target.checked)}
                      className="rounded border-white/20 text-[#C1A461] bg-black/40"
                    />
                    <span>Premises Incorporates Sleeping Risk</span>
                  </label>
                </div>
              </div>

              {/* Sleeping Risk Warning */}
              {isSleepingRisk && systemCategory === 'M' && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span><strong>COMPLIANCE ERROR:</strong> Category M (manual only) is strictly prohibited where sleeping risk exists under SANS 10139 Question 1(b).</span>
                </div>
              )}

              {/* SyncDeviceInventory Utility Bar */}
              <div className="p-4 bg-gradient-to-r from-black/90 via-[#181824] to-black/90 border border-[#C1A461]/40 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl shadow-black/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#C1A461]/20 text-[#C1A461] rounded-full border border-[#C1A461]/40 flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      SyncDeviceInventory Utility
                    </span>
                    {linkedProjectInventory && (
                      <span className="text-[11px] font-mono text-white/80">
                        Asset Record: <strong className="text-[#C1A461]">{linkedProjectInventory.inventoryRef}</strong> &middot; {linkedProjectInventory.siteName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/60">
                    Pulls addressable loop circuits, detection zone schedules, and 7-category device counts directly from project hardware inventory records.
                  </p>
                  {lastInventorySyncRef && (
                    <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 pt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Hardware data synchronized with {lastInventorySyncRef} {lastInventorySyncTime ? `(${lastInventorySyncTime})` : ''}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleAutoSyncDeviceInventory}
                    className="px-3.5 py-2 bg-gradient-to-r from-[#C1A461] to-[#D4B774] text-black font-mono font-bold text-xs rounded-xl hover:opacity-90 transition flex items-center gap-1.5 shadow-md shadow-[#C1A461]/20 cursor-pointer"
                    title="Automatically pull all hardware inventory loops, zones, and device counts into the form"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Auto-Pull Inventory
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSyncModalOpen(true)}
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    title="Inspect hardware asset inventory, diff against current values, and selective sync"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#C1A461]" />
                    Inspect &amp; Diff Sync...
                  </button>
                </div>
              </div>

              {/* Panel Details & Circuits */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#C1A461] uppercase tracking-wider font-mono flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5" />
                    Control Panel &amp; Circuit Architecture
                  </div>
                  {lastInventorySyncRef && (
                    <span className="text-[10px] font-mono text-white/50">
                      Circuits matched to {lastInventorySyncRef}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1">Make / Brand</label>
                    <input
                      type="text"
                      value={panelBrand}
                      onChange={e => setPanelBrand(e.target.value)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white focus:border-[#C1A461] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1">Model / Firmware</label>
                    <input
                      type="text"
                      value={panelModel}
                      onChange={e => setPanelModel(e.target.value)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white focus:border-[#C1A461] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1">Serial Number</label>
                    <input
                      type="text"
                      value={panelSerial}
                      onChange={e => setPanelSerial(e.target.value)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white focus:border-[#C1A461] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1">Location</label>
                    <input
                      type="text"
                      value={panelLocation}
                      onChange={e => setPanelLocation(e.target.value)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white focus:border-[#C1A461] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-purple-300 mb-1 flex items-center justify-between">
                      <span>Addressable Loops Count</span>
                      <span className="text-[10px] text-white/40 font-normal">Pulled from Inventory</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={32}
                      value={loopCount}
                      onChange={e => setLoopCount(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-purple-500/30 rounded-xl text-xs font-mono text-purple-200 font-bold focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-emerald-300 mb-1 flex items-center justify-between">
                      <span>Detection Zones Count</span>
                      <span className="text-[10px] text-white/40 font-normal">Pulled from Inventory</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={256}
                      value={zoneCount}
                      onChange={e => setZoneCount(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-200 font-bold focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Device Counts per Dot Legend */}
              <div className="space-y-3">
                <div className="font-bold text-xs text-white uppercase tracking-wider font-mono flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>Device Schedule (SANS 10139 Color Coded Legend)</span>
                    <span className="text-[10px] font-normal text-white/50 font-sans">(Question 22)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-white/60">
                      Total Devices: <strong className="text-[#C1A461]">{blueDotSmoke + blackDotHeat + redDotSounders + greenDotMcp + multiSensors + beamSensors + aspiratingPoints}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoSyncDeviceInventory}
                      className="text-[10px] font-mono text-[#C1A461] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCw className="w-2.5 h-2.5" /> Re-sync
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded-xl">
                    <label className="block text-[11px] font-mono text-blue-300 font-bold mb-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      Blue: Optical Smoke
                    </label>
                    <input
                      type="number"
                      value={blueDotSmoke}
                      onChange={e => setBlueDotSmoke(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-blue-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div className="p-3 bg-slate-900 border border-white/20 rounded-xl">
                    <label className="block text-[11px] font-mono text-white/90 font-bold mb-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-white" />
                      Black: Heat Detectors
                    </label>
                    <input
                      type="number"
                      value={blackDotHeat}
                      onChange={e => setBlackDotHeat(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-white/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-white/50"
                    />
                  </div>

                  <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl">
                    <label className="block text-[11px] font-mono text-red-300 font-bold mb-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      Red: Sounders / Sirens
                    </label>
                    <input
                      type="number"
                      value={redDotSounders}
                      onChange={e => setRedDotSounders(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-red-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-red-400"
                    />
                  </div>

                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                    <label className="block text-[11px] font-mono text-emerald-300 font-bold mb-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Green: Manual Call Points
                    </label>
                    <input
                      type="number"
                      value={greenDotMcp}
                      onChange={e => setGreenDotMcp(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-emerald-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl">
                    <label className="block text-[11px] font-mono text-purple-300 font-bold mb-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      Purple: Multi-Sensors
                    </label>
                    <input
                      type="number"
                      value={multiSensors}
                      onChange={e => setMultiSensors(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-purple-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl">
                    <label className="block text-[11px] font-mono text-amber-300 font-bold mb-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Amber: Optical Beams
                    </label>
                    <input
                      type="number"
                      value={beamSensors}
                      onChange={e => setBeamSensors(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-amber-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl">
                    <label className="block text-[11px] font-mono text-cyan-300 font-bold mb-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                      Cyan: Aspirating Points
                    </label>
                    <input
                      type="number"
                      value={aspiratingPoints}
                      onChange={e => setAspiratingPoints(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-cyan-500/20 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="p-3 bg-gradient-to-br from-black/80 to-[#1E1B12] border border-[#C1A461]/40 rounded-xl flex flex-col justify-between">
                    <span className="block text-[11px] font-mono text-[#C1A461] font-bold">
                      Total Schedule Devices
                    </span>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-[10px] font-mono text-white/50">All 7 Categories</span>
                      <span className="text-lg font-bold font-mono text-[#C1A461]">
                        {blueDotSmoke + blackDotHeat + redDotSounders + greenDotMcp + multiSensors + beamSensors + aspiratingPoints}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Commissioning Test Outcomes */}
          {activeTab === 'tests' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#C1A461]" />
                  Section 4: Mandatory Commissioning Test Outcomes
                </h3>
                <p className="text-xs text-white/50">
                  Grounded strictly in official SANS 10139 parameters: 24h battery autonomy, bedhead audibility &ge;65 dB(A), smoke radius &le;7.5m.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Battery Autonomy Box */}
                <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#C1A461] font-mono">Secondary Power Autonomy</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isStandbyAutonomyValid && isAlarmDurationValid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {isStandbyAutonomyValid && isAlarmDurationValid ? 'PASSED' : 'NON-COMPLIANT'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      Quiescent Standby Autonomy (Hours) &middot; <span className="text-slate-400">Min 24h</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={standbyHours}
                      onChange={e => setStandbyHours(parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 bg-black/60 border rounded-xl text-xs font-mono text-white ${
                        isStandbyAutonomyValid ? 'border-white/10' : 'border-red-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      Full Evac Alarm Duration (Minutes) &middot; <span className="text-slate-400">Min 30 min</span>
                    </label>
                    <input
                      type="number"
                      value={alarmMinutes}
                      onChange={e => setAlarmMinutes(parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 bg-black/60 border rounded-xl text-xs font-mono text-white ${
                        isAlarmDurationValid ? 'border-white/10' : 'border-red-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Audibility Box */}
                <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#C1A461] font-mono">Audibility &amp; Sound Pressure</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      isAudibilityValid && isSounderCountValid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {isAudibilityValid && isSounderCountValid ? 'PASSED' : 'NON-COMPLIANT'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      Bedhead / Corridor Sound Level (dB(A)) &middot; <span className="text-slate-400">Min 65 dB(A)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={bedheadDba}
                      onChange={e => setBedheadDba(parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 bg-black/60 border rounded-xl text-xs font-mono text-white ${
                        isAudibilityValid ? 'border-white/10' : 'border-red-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      Max Sound Pressure Accessible (dB(A)) &middot; <span className="text-slate-400">Max 130 dB(A)</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={maxSoundPressureDba}
                      onChange={e => setMaxSoundPressureDba(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white"
                    />
                  </div>
                </div>

                {/* Detector Siting */}
                <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                  <div className="font-bold text-xs text-[#C1A461] font-mono">Detector Siting Radius</div>
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      Smoke Detector Radius (m) &middot; <span className="text-slate-400">&le; 7.5m flat ceiling</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={smokeRadiusM}
                      onChange={e => setSmokeRadiusM(parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 bg-black/60 border rounded-xl text-xs font-mono text-white ${
                        isSmokeRadiusValid ? 'border-white/10' : 'border-red-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      Heat Detector Radius (m) &middot; <span className="text-slate-400">&le; 5.3m flat ceiling</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={heatRadiusM}
                      onChange={e => setHeatRadiusM(parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 bg-black/60 border rounded-xl text-xs font-mono text-white ${
                        isHeatRadiusValid ? 'border-white/10' : 'border-red-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Cabling & Circuit Latency */}
                <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                  <div className="font-bold text-xs text-[#C1A461] font-mono">Cabling &amp; Fault Response</div>
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      Conductor Cross-Section (mm&sup2;) &middot; <span className="text-slate-400">Min 1.0 mm&sup2;</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={conductorCrossSection}
                      onChange={e => setConductorCrossSection(parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 bg-black/60 border rounded-xl text-xs font-mono text-white ${
                        isConductorValid ? 'border-white/10' : 'border-red-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      Fault Response Latency (seconds) &middot; <span className="text-slate-400">&le; 200s</span>
                    </label>
                    <input
                      type="number"
                      value={shortCircuitSeconds}
                      onChange={e => setShortCircuitSeconds(parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 bg-black/60 border rounded-xl text-xs font-mono text-white ${
                        isFaultTimeValid ? 'border-white/10' : 'border-red-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Deviations, Exclusions & Related Records */}
          {activeTab === 'records' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#C1A461]" />
                  Section 5: Inspection Records, Deviations &amp; Exclusions
                </h3>
                <p className="text-xs text-white/50">
                  Cross-link pre-work condition audits, post-work commissioning certificates, and as-built CAD drawings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Pre-Work Inspection Ref *</label>
                  <input
                    type="text"
                    value={preWorkRef}
                    onChange={e => setPreWorkRef(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">Post-Work Commissioning Ref *</label>
                  <input
                    type="text"
                    value={postWorkRef}
                    onChange={e => setPostWorkRef(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1">As-Built CAD Drawing Reference *</label>
                  <input
                    type="text"
                    value={asBuiltRef}
                    onChange={e => setAsBuiltRef(e.target.value)}
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-mono text-white/70 mb-1">
                    Documented Deviations, Exclusions or Agreed Variations
                  </label>
                  <textarea
                    rows={4}
                    value={variationsNotes}
                    onChange={e => setVariationsNotes(e.target.value)}
                    placeholder="Describe any variations from SANS 10139 agreed with the client and building authority..."
                    className="w-full px-3.5 py-2 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Mandatory Declarations & Digital Signatures */}
          {activeTab === 'declarations' && (
            <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-150">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-[#C1A461]" />
                  Section 6: Mandatory Statutory Declarations &amp; Digital Signatures
                </h3>
                <p className="text-xs text-white/50">
                  Electronic sign-off requires validation and approval by the authorised commissioner and client representative.
                </p>
              </div>

              {/* Verbatim Commissioner Module Declarations */}
              <div className="p-4 bg-black/40 border border-[#C1A461]/30 rounded-2xl text-xs space-y-3 text-white/80">
                <div className="font-bold text-[#C1A461] uppercase tracking-wider font-mono">
                  Official SANS 10139 Commissioner Module Declarations
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-white/5 space-y-1">
                  <span className="font-bold text-white font-mono text-[11px]">COMMISSIONER DECLARATION:</span>
                  <p className="italic text-[11px] text-white/70">
                    &ldquo;I hereby declare that the fire detection and fire alarm system at the above premises has been inspected, tested and commissioned in accordance with SANS 10139 and the recommendations of the SAQCC Commissioner Module. I confirm that all variations (if any) have been documented and agreed with the client, and that all mandatory test criteria have been verified.&rdquo;
                  </p>
                </div>
                <div className="p-3 bg-black/60 rounded-xl border border-white/5 space-y-1">
                  <span className="font-bold text-white font-mono text-[11px]">SAQCC NON-ENDORSEMENT NOTICE:</span>
                  <p className="text-[10px] text-white/60 font-mono">
                    This certificate is issued under the professional responsibility of the registered commissioner. The South African Qualification &amp; Certification Committee (SAQCC) has not endorsed or issued this certificate directly, and any certification is solely grounded in the factual physical tests and documented records recorded herein.
                  </p>
                </div>
              </div>

              {/* Commissioner Signature Canvas */}
              <div className="space-y-2">
                <DigitalSignatureCanvas
                  isCommissioner={true}
                  defaultSignerName={commissionerName}
                  defaultSignerRole="Authorised Fire Commissioner"
                  defaultSignerEmail={commissionerEmail}
                  defaultSaqccNumber={commissionerSaqcc}
                  defaultSaqccExpiry={commissionerExpiry}
                  documentTitle="SANS 10139 Certificate of Compliance"
                  documentNumber={currentWorkingCoc.cocNumber}
                  existingSignature={commissionerSignature}
                  onSignatureCapture={sig => setCommissionerSignature(sig)}
                  onClear={() => setCommissionerSignature(undefined)}
                />
              </div>

              {/* Client Handover Signature Canvas */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <DigitalSignatureCanvas
                  isCommissioner={false}
                  defaultSignerName={safetyOfficerName || clientName}
                  defaultSignerRole="Client Designated Safety Officer"
                  defaultSignerEmail={safetyOfficerEmail}
                  documentTitle="SANS 10139 Handover Acceptance"
                  documentNumber={currentWorkingCoc.cocNumber}
                  consentStatement="I hereby acknowledge receipt of the fire detection system, as-built drawings, operating instructions, and SANS 10139 fire detection logbook for the premises."
                  existingSignature={clientSignature}
                  onSignatureCapture={sig => setClientSignature(sig)}
                  onClear={() => setClientSignature(undefined)}
                />
              </div>
            </div>
          )}

          {/* TAB 7: Print Preview */}
          {activeTab === 'preview' && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-150">
              <CocPrintPreview
                coc={currentWorkingCoc}
                isDraft={isFormDraft}
                onBackToEdit={() => setActiveTab('details')}
                onOpenEmailModal={() => setEmailModalOpen(true)}
              />
            </div>
          )}

          {/* TAB 8: Document Versioning & Audit History */}
          {activeTab === 'versions' && (
            <div className="max-w-5xl mx-auto animate-in fade-in duration-150">
              <DocumentVersioningManager
                coc={currentWorkingCoc}
                currentRevisionNumber={revisionNumber}
                onRevisionNumberChange={setRevisionNumber}
                revisionReason={revisionReason}
                onRevisionReasonChange={setRevisionReason}
                onRestoreRevision={handleRestoreSnapshot}
                onTriggerIssue={handleIssueFinalCoc}
                canIssue={canOfficiallyIssue}
              />
            </div>
          )}

        </div>

        {/* Action Controls Footer */}
        <div className="p-4 bg-[#141418] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-white/50">
              Status: {canOfficiallyIssue && certificateStatus === 'Issued' ? (
                <span className="text-emerald-400 font-bold">&check; Fully Compliant &middot; Officially Issued</span>
              ) : canOfficiallyIssue ? (
                <span className="text-blue-400 font-bold">&check; Fully Compliant &middot; Ready for Issuance</span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  DRAFT &middot; {missingRequirements.length} Statutory Requirement(s) Incomplete
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setPdfExportModalOpen(true)}
              className="px-3.5 py-2 bg-[#C1A461]/15 hover:bg-[#C1A461]/25 border border-[#C1A461]/40 text-[#C1A461] rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Export current state as a locked, non-editable PDF with DRAFT or ISSUED watermark"
            >
              <Download className="w-4 h-4 text-[#C1A461]" />
              Export PDF (Locked)
            </button>

            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition"
            >
              <Save className="w-4 h-4 text-[#C1A461]" />
              Save Draft
            </button>

            {certificateStatus === 'Issued' ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('versions')}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  title="Open Document Versioning Manager"
                >
                  <History className="w-4 h-4 text-[#C1A461]" />
                  <span>Versioning ({archivedRevisions.length})</span>
                </button>
                <button
                  onClick={() => setEmailModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#C1A461] hover:bg-[#d4bc7b] text-black font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-[#C1A461]/20"
                >
                  <Send className="w-4 h-4" />
                  Email Certificate
                </button>
                <button
                  onClick={handleIssueFinalCoc}
                  disabled={!canOfficiallyIssue || isIssuingAndEmailing}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition disabled:opacity-40 shadow-lg shadow-emerald-600/20"
                  title="Issue new revision snapshot to immutable ledger"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Issue New Revision</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <label className="flex items-center gap-2 text-xs text-white/80 font-mono cursor-pointer bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 select-none hover:border-white/20 transition">
                  <input
                    type="checkbox"
                    checked={autoEmailOnIssue}
                    onChange={e => setAutoEmailOnIssue(e.target.checked)}
                    className="rounded border-white/20 text-[#C1A461] focus:ring-[#C1A461] bg-black/50"
                  />
                  <span className="hidden sm:inline">Auto-email PDF to Client &amp; Safety Officer on Issuance</span>
                  <span className="sm:hidden">Auto-email PDF</span>
                </label>
                <button
                  onClick={handleIssueFinalCoc}
                  disabled={!canOfficiallyIssue || isIssuingAndEmailing}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
                  title={!canOfficiallyIssue ? `Cannot issue official certificate: ${missingRequirements.join(', ')}` : 'Issue official certificate of compliance'}
                >
                  {isIssuingAndEmailing ? (
                    <RotateCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  {isIssuingAndEmailing
                    ? 'Issuing & Emailing...'
                    : !canOfficiallyIssue
                    ? `Draft Locked (${missingRequirements.length} Pending)`
                    : 'Issue Official SANS 10139 COC'}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Email Dispatch Modal */}
      <CocEmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        coc={currentWorkingCoc}
        onSuccess={() => {}}
      />

      {/* Locked PDF Export Modal */}
      <CocPdfExportModal
        isOpen={pdfExportModalOpen}
        onClose={() => setPdfExportModalOpen(false)}
        coc={currentWorkingCoc}
        defaultIsDraft={isFormDraft}
      />

      {/* Hardware Asset Inventory Sync Utility Modal */}
      <SyncDeviceInventoryModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        activeSiteId={activeSite.id}
        projectRef={projectRef}
        siteName={siteName}
        currentValues={{
          panelBrand,
          panelModel,
          panelSerial,
          panelLocation,
          loopCount,
          zoneCount,
          blueDotSmoke,
          blackDotHeat,
          redDotSounders,
          greenDotMcp,
          multiSensors,
          beamSensors,
          aspiratingPoints
        }}
        onApplySync={handleApplyModalSync}
      />
    </div>
  );
};
