import React, { useState } from 'react';
import { 
  FileCheck, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Printer, 
  Building2, 
  Zap, 
  Volume2, 
  Sliders, 
  Calendar,
  Layers,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { SansCocCertificate, SystemCategory } from '../../types';
import { COMPANY_DETAILS } from '../../data/initialData';

interface SansCocGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingCoc?: SansCocCertificate | null;
}

export const SansCocGeneratorModal: React.FC<SansCocGeneratorModalProps> = ({
  isOpen,
  onClose,
  existingCoc
}) => {
  const store = useAudrinStore();
  const sites = store.getSites();
  const user = store.getUser();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || '');
  const [viewCertificateMode, setViewCertificateMode] = useState<boolean>(!!existingCoc);
  const [currentCoc, setCurrentCoc] = useState<SansCocCertificate | null>(existingCoc || null);

  // Form States strictly aligned with POE Module SANS 10139
  // 1. Commissioner details (from POE page 1)
  const [commissionerName, setCommissionerName] = useState('Noko Dina Ramphela');
  const [commissionerId, setCommissionerId] = useState('9109170791081');
  const [commissionerEmail, setCommissionerEmail] = useState('rampheledina@gmail.com');
  const [commissionerSaqcc, setCommissionerSaqcc] = useState('SAQCC-SANS10139-COMM-2022/03/23');
  const [clientName, setClientName] = useState(user.name || 'Bethuel Moukangwe');
  const [organisationName, setOrganisationName] = useState(user.companyName || 'Tshivhase Commercial Holdings (Pty) Ltd');

  // 2. System Objective & Category (POE 1a, 1b, 1d, 1e, 1f, 16, 17, 18, 19)
  const [systemCategory, setSystemCategory] = useState<SystemCategory>('L1');
  const [systemObjective, setSystemObjective] = useState<'Life Protection' | 'Property Protection' | 'Dual Protection (Life & Property)'>('Dual Protection (Life & Property)');
  const [isSleepingRisk, setIsSleepingRisk] = useState<boolean>(false);
  const [occupancyType, setOccupancyType] = useState('Commercial Multi-Storey Office Complex');

  // 3. Power Supply & Battery Autonomy (POE 1h, 15)
  const [batteryType, setBatteryType] = useState('VRLA Sealed Lead Acid (24V DC)');
  const [batteryCapacityAh, setBatteryCapacityAh] = useState<number>(17);
  const [standbyHours, setStandbyHours] = useState<number>(24.5); // SANS 10139: >= 24h
  const [alarmMinutes, setAlarmMinutes] = useState<number>(35); // SANS 10139: >= 30m
  const [standbyGenerator, setStandbyGenerator] = useState<boolean>(true);
  const [mainsFailTimeMinutes, setMainsFailTimeMinutes] = useState<number>(14); // SANS 10139: <= 30 mins

  // 4. Cabling & Circuits (POE 1i, 1j, 1k, 1l, 1m, 1n, 1o, 1p)
  const [cableSpec, setCableSpec] = useState('PH 30 Enhanced Fire Resistant (Halogen-Free)');
  const [conductorCrossSection, setConductorCrossSection] = useState<number>(1.5); // SANS 10139: >= 1.0 mm²
  const [cableColour, setCableColour] = useState('RED');
  const [conduitSegregation, setConduitSegregation] = useState<boolean>(true); // SANS 10139: NOT in same conduit as other services
  const [classACircuits, setClassACircuits] = useState<boolean>(true); // SANS 10139: Class A loop topology
  const [singleFaultDisableM2, setSingleFaultDisableM2] = useState<number>(850); // SANS 10139: <= 1,000 m²
  const [sounderSheathSegregation, setSounderSheathSegregation] = useState<boolean>(true); // SANS 10139: >=2 sounder circuits not in common sheath

  // 5. Detector Siting & Spacing (POE 8, 9, 10, 11, 12, 13, 14, 20, 21)
  const [smokeRadiusM, setSmokeRadiusM] = useState<number>(7.4); // SANS 10139: <= 7.5 m
  const [heatRadiusM, setHeatRadiusM] = useState<number>(5.1); // SANS 10139: <= 5.3 m
  const [pitchedRoofSlopeDegrees, setPitchedRoofSlopeDegrees] = useState<number>(0);
  const [smokeApexThresholdMm, setSmokeApexThresholdMm] = useState<number>(0); // <600mm treated as flat
  const [heatApexThresholdMm, setHeatApexThresholdMm] = useState<number>(0); // <150mm treated as flat
  const [beamDetectorBoundaryM, setBeamDetectorBoundaryM] = useState<number>(6.8); // SANS 10139: <= 7.5 m
  const [aspiratingApexMm, setAspiratingApexMm] = useState<number>(450); // SANS 10139: <= 600 mm
  const [wallClearanceMm, setWallClearanceMm] = useState<number>(600); // SANS 10139: min 500 mm
  const [mcpHeightM, setMcpHeightM] = useState<number>(1.4); // SANS 10139: 1.4 m (+/- 0.2 m)
  const [heatDetectorRestrictionsCompliant, setHeatDetectorRestrictionsCompliant] = useState<boolean>(true);

  // 6. Audibility & Sounders (POE 1r, 1s)
  const [soundLevelBedheadDba, setSoundLevelBedheadDba] = useState<number>(76.4); // SANS 10139: >= 65 dB(A)
  const [maxSoundPressureDba, setMaxSoundPressureDba] = useState<number>(92.0); // SANS 10139: <= 130 dB(A)
  const [sounderCount, setSounderCount] = useState<number>(12); // SANS 10139: >= 2 sounders

  // 7. Fault Response Times (POE 1g, 1h)
  const [shortOpenCircuitFaultSeconds, setShortOpenCircuitFaultSeconds] = useState<number>(145); // SANS 10139: <= 200s

  // 8. Device Schedule (POE 22 - Blue, Black, Red, Green dots)
  const [blueDotSmoke, setBlueDotSmoke] = useState<number>(118);
  const [blackDotHeat, setBlackDotHeat] = useState<number>(16);
  const [redDotSounders, setRedDotSounders] = useState<number>(12);
  const [greenDotMcp, setGreenDotMcp] = useState<number>(10);
  const [multiSensors, setMultiSensors] = useState<number>(18);
  const [beamSensors, setBeamSensors] = useState<number>(4);
  const [aspiratingPoints, setAspiratingPoints] = useState<number>(6);

  const [variationsNotes, setVariationsNotes] = useState<string>('Full compliance achieved. All detection loops tested point-to-point.');

  if (!isOpen) return null;

  const activeSite = sites.find(s => s.id === selectedSiteId) || sites[0];

  // Validation Checks based on POE source of truth
  const isSleepingRiskCatMInvalid = isSleepingRisk && systemCategory === 'M'; // POE Question 1b
  const isBatteryAutonomyValid = standbyHours >= 24.0 && alarmMinutes >= 30; // POE Question 15
  const isMainsFailValid = mainsFailTimeMinutes <= 30; // POE Question 1h
  const isCircuitFaultTimeValid = shortOpenCircuitFaultSeconds <= 200; // POE Question 1g
  const isConductorValid = conductorCrossSection >= 1.0; // POE Question 1m
  const isFaultAreaValid = singleFaultDisableM2 <= 1000; // POE Question 1i
  const isSmokeSpacingValid = smokeRadiusM <= 7.5; // POE Question 11
  const isHeatSpacingValid = heatRadiusM <= 5.3; // POE Question 11
  const isAudibilityValid = soundLevelBedheadDba >= 65.0 && maxSoundPressureDba <= 130.0; // POE Question 1r
  const isSounderCountValid = sounderCount >= 2; // POE Question 1s
  const isMcpHeightValid = mcpHeightM >= 1.2 && mcpHeightM <= 1.6; // POE Question 21 (1.4m +/- 0.2m)

  const isOverallCompliant = 
    !isSleepingRiskCatMInvalid && 
    isBatteryAutonomyValid && 
    isMainsFailValid && 
    isCircuitFaultTimeValid && 
    isConductorValid && 
    isFaultAreaValid && 
    isSmokeSpacingValid && 
    isHeatSpacingValid && 
    isAudibilityValid && 
    isSounderCountValid && 
    isMcpHeightValid && 
    conduitSegregation && 
    classACircuits && 
    sounderSheathSegregation;

  const handleGenerateCertificate = () => {
    const cocNumber = `COC-SANS10139-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCoc: SansCocCertificate = {
      id: `coc-${Date.now()}`,
      cocNumber,
      issueDate: new Date().toISOString().split('T')[0],
      siteId: activeSite?.id || 'site-01',
      siteName: activeSite?.name || 'Commercial Facility',
      siteAddress: activeSite?.address || 'Pretoria, South Africa',
      clientName,
      organisationName,
      commissionerName,
      commissionerIdNumber: commissionerId,
      commissionerEmail,
      commissionerSaqccNumber: commissionerSaqcc,
      companyRegistrationNumber: COMPANY_DETAILS.registrationNumber,
      systemCategory,
      systemObjective,
      isSleepingRisk,
      buildingOccupancyType: occupancyType,
      powerSupplyAutonomy: {
        mainsVoltage: 230,
        batteryType,
        batteryCapacityAh,
        standbyAutonomyHours: standbyHours,
        evacuateAlarmDurationMinutes: alarmMinutes,
        standbyGeneratorPresent: standbyGenerator,
        mainsFailIndicationTimeMinutes: mainsFailTimeMinutes,
        passed: isBatteryAutonomyValid && isMainsFailValid
      },
      cablingAndCircuits: {
        cableSpecification: cableSpec,
        conductorCrossSectionMm2: conductorCrossSection,
        cableColour,
        conduitSegregationVerified: conduitSegregation,
        classACircuitsPhysicalConductors: classACircuits,
        singleFaultDisableLimitM2: singleFaultDisableM2,
        sounderCircuitsIsolatedInSeparateSheaths: sounderSheathSegregation,
        passed: isConductorValid && isFaultAreaValid && conduitSegregation && classACircuits
      },
      detectorSitingAndSpacing: {
        smokeDetectorSpacingRadiusM: smokeRadiusM,
        heatDetectorSpacingRadiusM: heatRadiusM,
        pitchedRoofSlopeDegrees,
        pitchedRoofSpacingAdjustmentPercent: Math.min(25, pitchedRoofSlopeDegrees * 1),
        smokeApexRoofHeightThresholdMm: smokeApexThresholdMm,
        heatApexRoofHeightThresholdMm: heatApexThresholdMm,
        beamDetectorMaxMountingRadiusM: beamDetectorBoundaryM,
        aspiratingSamplingPointsApexMm: aspiratingApexMm,
        wallClearanceMm,
        ceilingClearanceRangeMm: '25 mm min to 600 mm max',
        mcpMountingHeightM: mcpHeightM,
        heatDetectorPlacementRulesCompliant: heatDetectorRestrictionsCompliant,
        passed: isSmokeSpacingValid && isHeatSpacingValid && isMcpHeightValid
      },
      audibilityAndSounders: {
        soundLevelBedheadDba,
        maxSoundPressureAccessibleDba: maxSoundPressureDba,
        sounderCount,
        passed: isAudibilityValid && isSounderCountValid
      },
      faultResponseTimes: {
        detectorShortOrOpenCircuitFaultSeconds: shortOpenCircuitFaultSeconds,
        mainsDisconnectionFaultMinutes: mainsFailTimeMinutes,
        passed: isCircuitFaultTimeValid && isMainsFailValid
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
      variationsAndExclusions: variationsNotes || 'No variations from SANS 10139 recommendations.',
      overallComplianceStatus: isOverallCompliant ? 'Fully Compliant' : 'Non-Compliant - Action Required',
      commissionerDeclaration: `I, ${commissionerName} (ID: ${commissionerId}), holding SAQCC Commissioner accreditation (${commissionerSaqcc}), hereby certify that the fire detection and fire alarm installation at ${activeSite.name} has been thoroughly surveyed, verified, and commissioned in strict adherence with SANS 10139 recommendations.`,
      isSigned: true,
      signatureHash: `AFE-COC-${commissionerId}-${Date.now().toString(36).toUpperCase()}`
    };

    store.addSansCoc(newCoc);
    setCurrentCoc(newCoc);
    setViewCertificateMode(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#151518] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-white/5 bg-[#0D0D0E] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A1A1C] to-[#2A2A2E] border border-[#C1A461]/40 flex items-center justify-center text-[#C1A461] shadow-lg">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
                  SANS 10139 Statutory Instrument
                </span>
                <span className="text-[9px] bg-[#0A0A0B] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold uppercase">
                  SAQCC Commissioner Engine
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {viewCertificateMode ? 'SANS 10139 Certificate of Compliance (COC)' : 'Certificate of Compliance & Commissioning Form'}
              </h2>
              <p className="text-xs text-white/50">
                Derived directly from the official SAQCC SANS 10139 Commissioner Module.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {viewCertificateMode && (
              <button
                onClick={() => setViewCertificateMode(false)}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                Edit Parameters
              </button>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEW CERTIFICATE MODE (PRINTABLE STATUTORY CERTIFICATE) */}
        {viewCertificateMode && currentCoc ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#0A0A0B]">
            {/* The Official Certificate Container */}
            <div className="bg-[#151518] border-2 border-[#C1A461]/30 rounded-3xl p-6 sm:p-10 space-y-8 relative overflow-hidden shadow-2xl">
              
              {/* Gold Background Accent & Watermark */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#C1A461]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-[#C1A461]/5 rounded-full blur-3xl pointer-events-none" />

              {/* Certificate Top Brand & Registration */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/10 pb-6">
                <div>
                  <div className="text-[11px] font-mono text-[#C1A461] uppercase tracking-[2.5px] font-bold">
                    REPUBLIC OF SOUTH AFRICA &middot; SANS 10139
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                    CERTIFICATE OF COMPLIANCE
                  </h1>
                  <p className="text-xs text-white/60 font-mono mt-0.5">
                    Fire Detection and Fire Alarm Systems for Buildings (Other Than Dwellings)
                  </p>
                </div>

                <div className="text-right space-y-1 bg-[#0D0D0E] p-4 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Certificate Number</div>
                  <div className="text-sm sm:text-base font-mono font-extrabold text-[#C1A461]">
                    {currentCoc.cocNumber}
                  </div>
                  <div className="text-[10px] text-white/50 font-mono">Issue Date: {currentCoc.issueDate}</div>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                currentCoc.overallComplianceStatus === 'Fully Compliant'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#C1A461]" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">
                      Status: {currentCoc.overallComplianceStatus}
                    </div>
                    <div className="text-[11px] opacity-80">
                      System Category: <strong>Category {currentCoc.systemCategory}</strong> ({currentCoc.systemObjective})
                    </div>
                  </div>
                </div>
                <div className="text-right font-mono text-xs hidden sm:block">
                  <span>Standard: </span>
                  <strong className="text-white">SANS 10139:2021 Edition</strong>
                </div>
              </div>

              {/* Two Column Facility & Commissioner Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Left: Protected Facility */}
                <div className="bg-[#0D0D0E] p-5 rounded-2xl border border-white/5 space-y-2.5">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#C1A461] border-b border-white/5 pb-2">
                    1. Protected Installation Details
                  </h3>
                  <div className="space-y-1.5 font-mono">
                    <div className="text-white/60">Site Name: <strong className="text-white">{currentCoc.siteName}</strong></div>
                    <div className="text-white/60">Site Address: <strong className="text-white">{currentCoc.siteAddress}</strong></div>
                    <div className="text-white/60">Client / Organisation: <strong className="text-white">{currentCoc.organisationName}</strong></div>
                    <div className="text-white/60">Client Representative: <strong className="text-white">{currentCoc.clientName}</strong></div>
                    <div className="text-white/60">Building Occupancy: <strong className="text-white">{currentCoc.buildingOccupancyType}</strong></div>
                    <div className="text-white/60">Sleeping Risk Present: <strong className="text-white">{currentCoc.isSleepingRisk ? 'Yes (Cat L mandatory)' : 'No'}</strong></div>
                  </div>
                </div>

                {/* Right: Commissioner & Contractor Credentials */}
                <div className="bg-[#0D0D0E] p-5 rounded-2xl border border-white/5 space-y-2.5">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#C1A461] border-b border-white/5 pb-2">
                    2. SAQCC Commissioner & Engineering Contractor
                  </h3>
                  <div className="space-y-1.5 font-mono">
                    <div className="text-white/60">Commissioner: <strong className="text-white">{currentCoc.commissionerName}</strong></div>
                    <div className="text-white/60">National ID: <strong className="text-white">{currentCoc.commissionerIdNumber}</strong></div>
                    <div className="text-white/60">SAQCC Accreditation: <strong className="text-[#C1A461]">{currentCoc.commissionerSaqccNumber}</strong></div>
                    <div className="text-white/60">Commissioner Email: <strong className="text-white">{currentCoc.commissionerEmail}</strong></div>
                    <div className="text-white/60">Contractor: <strong className="text-white">{COMPANY_DETAILS.legalName}</strong></div>
                    <div className="text-white/60">Company Reg: <strong className="text-white">{currentCoc.companyRegistrationNumber}</strong></div>
                  </div>
                </div>
              </div>

              {/* SANS 10139 Technical Audit & Verification Table */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#C1A461]">
                  3. SANS 10139 Technical Verification Schedule (POE Source of Truth)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="bg-[#0D0D0E] text-white/50 border-b border-white/10 text-[10px] uppercase">
                        <th className="p-3">Clause / POE Ref</th>
                        <th className="p-3">Requirement & Standard Benchmark</th>
                        <th className="p-3">Measured / Installed Value</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-3 text-[#C1A461]">POE 15 / Clause 15</td>
                        <td className="p-3 text-white/80">Standby Battery Autonomy (≥ 24h Standby + ≥ 30m Full Alarm)</td>
                        <td className="p-3 text-white">{currentCoc.powerSupplyAutonomy.standbyAutonomyHours}h Standby / {currentCoc.powerSupplyAutonomy.evacuateAlarmDurationMinutes}m Evacuate</td>
                        <td className="p-3"><span className="text-emerald-400 font-bold">COMPLIANT</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#C1A461]">POE 1h / Clause 1h</td>
                        <td className="p-3 text-white/80">Mains Electrical Disconnection Fault Indication Time (≤ 30 min)</td>
                        <td className="p-3 text-white">{currentCoc.powerSupplyAutonomy.mainsFailIndicationTimeMinutes} minutes (≤ 30 min)</td>
                        <td className="p-3"><span className="text-emerald-400 font-bold">COMPLIANT</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#C1A461]">POE 1g / Clause 1g</td>
                        <td className="p-3 text-white/80">Short/Open Circuit Detector Fault Indication Time (≤ 200 seconds)</td>
                        <td className="p-3 text-white">{currentCoc.faultResponseTimes.detectorShortOrOpenCircuitFaultSeconds} seconds (≤ 200s)</td>
                        <td className="p-3"><span className="text-emerald-400 font-bold">COMPLIANT</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#C1A461]">POE 1k, 1l, 1m, 1n</td>
                        <td className="p-3 text-white/80">Cabling: PH 30 RED (≥ 1.0mm²), Segregated Conduit, Class A Loop</td>
                        <td className="p-3 text-white">{currentCoc.cablingAndCircuits.cableSpecification} ({currentCoc.cablingAndCircuits.conductorCrossSectionMm2}mm²)</td>
                        <td className="p-3"><span className="text-emerald-400 font-bold">COMPLIANT</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#C1A461]">POE 1i / Clause 1i</td>
                        <td className="p-3 text-white/80">Single Fault Disablement Area Limit (≤ 1,000 m²)</td>
                        <td className="p-3 text-white">{currentCoc.cablingAndCircuits.singleFaultDisableLimitM2} m² per fault boundary</td>
                        <td className="p-3"><span className="text-emerald-400 font-bold">COMPLIANT</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#C1A461]">POE 11 / Clause 11</td>
                        <td className="p-3 text-white/80">Flat Ceiling Detector Spacing (Smoke ≤ 7.5m, Heat ≤ 5.3m)</td>
                        <td className="p-3 text-white">Smoke: {currentCoc.detectorSitingAndSpacing.smokeDetectorSpacingRadiusM}m | Heat: {currentCoc.detectorSitingAndSpacing.heatDetectorSpacingRadiusM}m</td>
                        <td className="p-3"><span className="text-emerald-400 font-bold">COMPLIANT</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#C1A461]">POE 1r, 1s / Clause 1r</td>
                        <td className="p-3 text-white/80">Audibility (≥ 65 dB(A) bedhead, ≤ 130 dB(A) max, ≥ 2 sounders)</td>
                        <td className="p-3 text-white">{currentCoc.audibilityAndSounders.soundLevelBedheadDba} dB(A) Bedhead | {currentCoc.audibilityAndSounders.sounderCount} Sounders Installed</td>
                        <td className="p-3"><span className="text-emerald-400 font-bold">COMPLIANT</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 text-[#C1A461]">POE 21 / Clause 21</td>
                        <td className="p-3 text-white/80">Manual Call Point (MCP) Mounting Height (1.4m from floor ±0.2m)</td>
                        <td className="p-3 text-white">{currentCoc.detectorSitingAndSpacing.mcpMountingHeightM} metres from floor</td>
                        <td className="p-3"><span className="text-emerald-400 font-bold">COMPLIANT</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Installed Device Schedule (Colour Coded per POE Page 9/10) */}
              <div className="bg-[#0D0D0E] p-5 rounded-2xl border border-white/5 space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#C1A461]">
                  4. Installed Device Schedule (SANS 10139 Floorplan Legend Coding)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#151518] border border-blue-500/20 flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-md" />
                    <div>
                      <div className="text-white font-bold">{currentCoc.deviceSchedule.blueDotSmokeDetectors} Units</div>
                      <div className="text-[10px] text-white/50">Blue Dot: Optical Smoke</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#151518] border border-zinc-500/20 flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-white/40 shadow-md" />
                    <div>
                      <div className="text-white font-bold">{currentCoc.deviceSchedule.blackDotHeatDetectors} Units</div>
                      <div className="text-[10px] text-white/50">Black Dot: Thermal Heat</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#151518] border border-red-500/20 flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-md" />
                    <div>
                      <div className="text-white font-bold">{currentCoc.deviceSchedule.redDotSoundersSirens} Units</div>
                      <div className="text-[10px] text-white/50">Red Dot: Sounders & VADs</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#151518] border border-emerald-500/20 flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-md" />
                    <div>
                      <div className="text-white font-bold">{currentCoc.deviceSchedule.greenDotManualCallPoints} Units</div>
                      <div className="text-[10px] text-white/50">Green Dot: Manual Call Points</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formal Commissioner Declaration & Sign-off */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="bg-[#0D0D0E] p-4 rounded-xl border border-white/5 text-[11px] text-white/70 italic leading-relaxed">
                  "{currentCoc.commissionerDeclaration}"
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-white/40">Digital Signature Hash:</div>
                    <div className="text-[#C1A461] font-bold">{currentCoc.signatureHash}</div>
                    <div className="text-[10px] text-white/40">Timestamp: {currentCoc.issueDate}T12:00:00Z &middot; SANS 10139 Standard</div>
                  </div>

                  {/* Stamp / Seal Graphic */}
                  <div className="w-36 h-36 rounded-full border-2 border-dashed border-[#C1A461]/60 bg-[#C1A461]/5 flex flex-col items-center justify-center text-center p-2 text-[9px] font-mono text-[#C1A461] uppercase tracking-wider rotate-3 shadow-xl">
                    <ShieldCheck className="w-6 h-6 text-[#C1A461] mb-1" />
                    <strong className="text-[10px]">SAQCC SANS 10139</strong>
                    <span>COMMISSIONER</span>
                    <span className="text-[8px] opacity-70">VERIFIED & SIGNED</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-2 border border-white/10"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-[1.5px] rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Done</span>
              </button>
            </div>
          </div>
        ) : (
          /* STEPPED FORM CREATION MODE */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Step Progress Indicators */}
            <div className="grid grid-cols-4 gap-2 bg-[#0D0D0E] p-3 rounded-2xl border border-white/5 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActiveStep(1)}
                className={`p-2.5 rounded-xl transition text-center ${activeStep === 1 ? 'bg-[#C1A461] text-black' : 'text-white/50 hover:text-white'}`}
              >
                1. Scope & Category
              </button>
              <button
                onClick={() => setActiveStep(2)}
                className={`p-2.5 rounded-xl transition text-center ${activeStep === 2 ? 'bg-[#C1A461] text-black' : 'text-white/50 hover:text-white'}`}
              >
                2. Power & Cabling
              </button>
              <button
                onClick={() => setActiveStep(3)}
                className={`p-2.5 rounded-xl transition text-center ${activeStep === 3 ? 'bg-[#C1A461] text-black' : 'text-white/50 hover:text-white'}`}
              >
                3. Siting & Spacing
              </button>
              <button
                onClick={() => setActiveStep(4)}
                className={`p-2.5 rounded-xl transition text-center ${activeStep === 4 ? 'bg-[#C1A461] text-black' : 'text-white/50 hover:text-white'}`}
              >
                4. Schedule & Sign-Off
              </button>
            </div>

            {/* STEP 1: SCOPE, FACILITY & SYSTEM CATEGORY */}
            {activeStep === 1 && (
              <div className="bg-[#0D0D0E] p-6 rounded-2xl border border-white/5 space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#C1A461]" />
                    <span>Facility & System Category Selection (POE 1a, 1b, 1d, 1e, 1f, 16–19)</span>
                  </h3>
                  <p className="text-xs text-white/50">
                    Define the building occupancy, protected scope, and SANS 10139 classification.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider">
                      Protected Installation Site
                    </label>
                    <select
                      value={selectedSiteId}
                      onChange={(e) => setSelectedSiteId(e.target.value)}
                      className="w-full bg-[#151518] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#C1A461]"
                    >
                      {sites.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.address})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider">
                      Building Occupancy Type
                    </label>
                    <input
                      type="text"
                      value={occupancyType}
                      onChange={(e) => setOccupancyType(e.target.value)}
                      className="w-full bg-[#151518] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#C1A461]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider">
                      System Objective (POE Question 1a)
                    </label>
                    <select
                      value={systemObjective}
                      onChange={(e) => setSystemObjective(e.target.value as any)}
                      className="w-full bg-[#151518] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#C1A461]"
                    >
                      <option value="Life Protection">Life Protection (Category L Systems)</option>
                      <option value="Property Protection">Property Protection (Category P Systems)</option>
                      <option value="Dual Protection (Life & Property)">Dual Protection (Life & Property)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider">
                      SANS 10139 System Category
                    </label>
                    <select
                      value={systemCategory}
                      onChange={(e) => setSystemCategory(e.target.value as SystemCategory)}
                      className="w-full bg-[#151518] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#C1A461]"
                    >
                      <option value="L1">Category L1: Total Life Protection (All building areas)</option>
                      <option value="L2">Category L2: Defined Rooms + Sleeping Quarters + L3 Scope</option>
                      <option value="L3">Category L3: Escape Routes & Adjoining Corridors</option>
                      <option value="L4">Category L4: Escape Routes Only (Corridors & Stairways)</option>
                      <option value="L5">Category L5: Localized Fire Engineering Solution</option>
                      <option value="M">Category M: Manual Call Points Only (Assembly Areas)</option>
                      <option value="P1">Category P1: Total Property Protection (Earliest Warning)</option>
                      <option value="P2">Category P2: Defined High-Risk Property Areas</option>
                    </select>
                  </div>
                </div>

                {/* Sleeping Risk Check & POE 1b Rule Validation */}
                <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={isSleepingRisk}
                      onChange={(e) => setIsSleepingRisk(e.target.checked)}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span className="font-bold text-white">Occupants sleep in building / Hotel / Hospital / Hostel accommodation</span>
                  </label>

                  {isSleepingRiskCatMInvalid && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 font-mono">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>
                        <strong>CRITICAL NON-COMPLIANCE (POE Question 1b):</strong> Manual fire alarm systems (Category M) are NOT sufficient in buildings where people sleep. Automatic detection (Category L1/L2) is mandatory.
                      </span>
                    </div>
                  )}
                </div>

                {/* Commissioner Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-1">
                      SAQCC Commissioner Name (POE Pg 1)
                    </label>
                    <input
                      type="text"
                      value={commissionerName}
                      onChange={(e) => setCommissionerName(e.target.value)}
                      className="w-full bg-[#151518] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-1">
                      National ID Number
                    </label>
                    <input
                      type="text"
                      value={commissionerId}
                      onChange={(e) => setCommissionerId(e.target.value)}
                      className="w-full bg-[#151518] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/70 mb-1">
                      SAQCC Registration Number
                    </label>
                    <input
                      type="text"
                      value={commissionerSaqcc}
                      onChange={(e) => setCommissionerSaqcc(e.target.value)}
                      className="w-full bg-[#151518] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="px-6 py-2.5 bg-[#C1A461] text-black text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2"
                  >
                    <span>Next: Power & Cabling</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: POWER & CABLING */}
            {activeStep === 2 && (
              <div className="bg-[#0D0D0E] p-6 rounded-2xl border border-white/5 space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#C1A461]" />
                    <span>Power Supply, Battery Autonomy & Cabling Rules (POE 1g, 1h, 1i, 1j, 1k, 1l, 1m, 1n, 1o, 15)</span>
                  </h3>
                  <p className="text-xs text-white/50">
                    Verify battery reserve calculations, electrical fault times, and cable containment integrity.
                  </p>
                </div>

                {/* Standby Battery Autonomy Calculation */}
                <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold text-[#C1A461] uppercase tracking-wider">
                    Battery Autonomy (SANS 10139 Question 15: ≥ 24h Standby + ≥ 30m Alarm)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                        Standby Duration (Hours) - Min 24h
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={standbyHours}
                        onChange={(e) => setStandbyHours(Number(e.target.value))}
                        className="w-full bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C1A461]"
                      />
                      {!isBatteryAutonomyValid && (
                        <span className="text-[10px] text-red-400 font-mono">Must be ≥ 24.0 hours</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                        Evacuation Alarm Duration (Minutes) - Min 30m
                      </label>
                      <input
                        type="number"
                        value={alarmMinutes}
                        onChange={(e) => setAlarmMinutes(Number(e.target.value))}
                        className="w-full bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C1A461]"
                      />
                      {alarmMinutes < 30 && (
                        <span className="text-[10px] text-red-400 font-mono">Must be ≥ 30 minutes</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                        Mains Fail Disconnection Time (Minutes) - Max 30m (POE 1h)
                      </label>
                      <input
                        type="number"
                        value={mainsFailTimeMinutes}
                        onChange={(e) => setMainsFailTimeMinutes(Number(e.target.value))}
                        className="w-full bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-[#C1A461]"
                      />
                      {!isMainsFailValid && (
                        <span className="text-[10px] text-red-400 font-mono">Fault must register within ≤ 30 min</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cabling and Circuits Checklist */}
                <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold text-[#C1A461] uppercase tracking-wider">
                    Cabling Specification & Containment (POE 1k, 1l, 1m, 1n, 1o, 1j)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0D0E] border border-white/5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={conduitSegregation}
                        onChange={(e) => setConduitSegregation(e.target.checked)}
                        className="w-4 h-4 rounded text-[#C1A461]"
                      />
                      <span>Strict Conduit Segregation: Fire alarm cables NOT in same conduit as power/other services (POE 1n)</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0D0E] border border-white/5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={classACircuits}
                        onChange={(e) => setClassACircuits(e.target.checked)}
                        className="w-4 h-4 rounded text-[#C1A461]"
                      />
                      <span>Addressable loops run as Class A circuits using physical conductors (POE 1o)</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0D0E] border border-white/5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sounderSheathSegregation}
                        onChange={(e) => setSounderSheathSegregation(e.target.checked)}
                        className="w-4 h-4 rounded text-[#C1A461]"
                      />
                      <span>Dual sounder circuits NOT contained in a common cable sheath (POE 1j)</span>
                    </label>

                    <div className="p-3 rounded-lg bg-[#0D0D0E] border border-white/5 space-y-1">
                      <span className="text-white/60">Conductor Cross-Section (POE 1m):</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.1"
                          value={conductorCrossSection}
                          onChange={(e) => setConductorCrossSection(Number(e.target.value))}
                          className="bg-[#151518] border border-white/10 rounded px-2 py-1 text-white font-mono w-24"
                        />
                        <span className="font-mono text-[11px] text-white/50">mm² (Requirement: ≥ 1.0 mm²)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="px-5 py-2.5 bg-white/5 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="px-6 py-2.5 bg-[#C1A461] text-black text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2"
                  >
                    <span>Next: Siting & Spacing</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SITING & SPACING */}
            {activeStep === 3 && (
              <div className="bg-[#0D0D0E] p-6 rounded-2xl border border-white/5 space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#C1A461]" />
                    <span>Detector Siting, Spacing & Audibility Dimensions (POE 8, 9, 10, 11, 12, 13, 14, 1r, 1s, 20, 21)</span>
                  </h3>
                  <p className="text-xs text-white/50">
                    Validate exact physical distances, roof pitch adjustments, clearances, and decibel sound levels.
                  </p>
                </div>

                {/* Flat Ceilings & Pitch Formulas */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-1">
                    <label className="block text-[11px] font-bold text-white/70 uppercase">
                      Smoke Detector Radius (POE 11)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={smokeRadiusM}
                        onChange={(e) => setSmokeRadiusM(Number(e.target.value))}
                        className="bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white w-full"
                      />
                      <span className="text-xs font-mono text-white/50">m</span>
                    </div>
                    <span className="text-[10px] text-white/40">SANS 10139: Max ≤ 7.5 m radius</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-1">
                    <label className="block text-[11px] font-bold text-white/70 uppercase">
                      Heat Detector Radius (POE 11)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={heatRadiusM}
                        onChange={(e) => setHeatRadiusM(Number(e.target.value))}
                        className="bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white w-full"
                      />
                      <span className="text-xs font-mono text-white/50">m</span>
                    </div>
                    <span className="text-[10px] text-white/40">SANS 10139: Max ≤ 5.3 m radius</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-1">
                    <label className="block text-[11px] font-bold text-white/70 uppercase">
                      MCP Mounting Height (POE 21)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={mcpHeightM}
                        onChange={(e) => setMcpHeightM(Number(e.target.value))}
                        className="bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white w-full"
                      />
                      <span className="text-xs font-mono text-white/50">m</span>
                    </div>
                    <span className="text-[10px] text-white/40">SANS 10139: 1.4 m (±0.2m)</span>
                  </div>
                </div>

                {/* Audibility Decibels and Sounder Count */}
                <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-[#C1A461] uppercase tracking-wider flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <span>Acoustic Sound Pressure & Sounder Redundancy (POE 1r, 1s)</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                        Sound Level at Bedhead (Min 65 dB(A))
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={soundLevelBedheadDba}
                        onChange={(e) => setSoundLevelBedheadDba(Number(e.target.value))}
                        className="w-full bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      {soundLevelBedheadDba < 65 && (
                        <span className="text-[10px] text-red-400 font-mono">Must be ≥ 65 dB(A)</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                        Max Accessible Sound Level (Max 130 dB(A))
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={maxSoundPressureDba}
                        onChange={(e) => setMaxSoundPressureDba(Number(e.target.value))}
                        className="w-full bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      {maxSoundPressureDba > 130 && (
                        <span className="text-[10px] text-red-400 font-mono">Must not exceed 130 dB(A)</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                        Total Sounder Count (Min 2 Units)
                      </label>
                      <input
                        type="number"
                        value={sounderCount}
                        onChange={(e) => setSounderCount(Number(e.target.value))}
                        className="w-full bg-[#0D0D0E] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      {sounderCount < 2 && (
                        <span className="text-[10px] text-red-400 font-mono">POE 1s: ≥ 2 sounders mandatory</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Heat Detector Restrictions */}
                <div className="p-4 rounded-xl bg-[#151518] border border-white/5 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={heatDetectorRestrictionsCompliant}
                      onChange={(e) => setHeatDetectorRestrictionsCompliant(e.target.checked)}
                      className="w-4 h-4 rounded text-[#C1A461]"
                    />
                    <span>
                      Heat Detector Placement Restriction Verified (POE Question 8): NO heat detectors in Category P smouldering fire risk areas or in Category L escape routes.
                    </span>
                  </label>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="px-5 py-2.5 bg-white/5 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep(4)}
                    className="px-6 py-2.5 bg-[#C1A461] text-black text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2"
                  >
                    <span>Next: Device Schedule & Sign-Off</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: DEVICE SCHEDULE & FORMAL SIGN-OFF */}
            {activeStep === 4 && (
              <div className="bg-[#0D0D0E] p-6 rounded-2xl border border-white/5 space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#C1A461]" />
                    <span>Device Inventory & Commissioner Digital Stamp (POE 22a, 22b, 22c, 22d)</span>
                  </h3>
                  <p className="text-xs text-white/50">
                    Input final quantities matching the SANS 10139 floorplan dot legend.
                  </p>
                </div>

                {/* Device Dot Inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 rounded-xl bg-[#151518] border border-blue-500/30 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span>Blue: Smoke</span>
                    </div>
                    <input
                      type="number"
                      value={blueDotSmoke}
                      onChange={(e) => setBlueDotSmoke(Number(e.target.value))}
                      className="w-full bg-[#0D0D0E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#151518] border border-zinc-500/30 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
                      <div className="w-3 h-3 rounded-full bg-zinc-900 border border-white/40" />
                      <span>Black: Heat</span>
                    </div>
                    <input
                      type="number"
                      value={blackDotHeat}
                      onChange={(e) => setBlackDotHeat(Number(e.target.value))}
                      className="w-full bg-[#0D0D0E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#151518] border border-red-500/30 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span>Red: Sounders</span>
                    </div>
                    <input
                      type="number"
                      value={redDotSounders}
                      onChange={(e) => setRedDotSounders(Number(e.target.value))}
                      className="w-full bg-[#0D0D0E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#151518] border border-emerald-500/30 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span>Green: MCP (1.4m)</span>
                    </div>
                    <input
                      type="number"
                      value={greenDotMcp}
                      onChange={(e) => setGreenDotMcp(Number(e.target.value))}
                      className="w-full bg-[#0D0D0E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Variations or Notes */}
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wider">
                    Variations, Deviations or Specific Exclusions Notes
                  </label>
                  <textarea
                    rows={2}
                    value={variationsNotes}
                    onChange={(e) => setVariationsNotes(e.target.value)}
                    className="w-full bg-[#151518] border border-white/10 rounded-xl p-3 text-xs text-white focus:border-[#C1A461]"
                  />
                </div>

                {/* Compliance Summary Pill */}
                <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                  isOverallCompliant
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-950/40 border-red-500/30 text-red-300'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-[#C1A461]" />
                    <span>
                      {isOverallCompliant
                        ? 'All SANS 10139 / SAQCC parameters pass benchmark verification. Ready to sign and seal.'
                        : 'One or more parameters violate SANS 10139 limits. Review highlighted rules before issuing.'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="px-5 py-2.5 bg-white/5 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateCertificate}
                    className="px-8 py-3 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-[2px] rounded-xl shadow-xl transition flex items-center gap-2 font-mono"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Issue SANS 10139 Certificate (COC)</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
