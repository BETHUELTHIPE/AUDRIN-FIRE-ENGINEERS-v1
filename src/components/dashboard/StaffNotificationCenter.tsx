import React, { useState, useMemo } from 'react';
import {
  Bell,
  BellRing,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  Wrench,
  Flame,
  Zap,
  BatteryWarning,
  Volume2,
  Search,
  Filter,
  RefreshCw,
  X,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Download,
  Copy,
  Plus,
  Send,
  Eye,
  Check,
  Building2,
  FileText,
  Sliders,
  CheckCheck,
  BookOpen
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { SansCocCertificate, DefectRecord, StatutoryMilestone, SafetyFileDossier } from '../../types';

export type AlertCategory = 'all' | 'coc_approval' | 'statutory_milestone' | 'system_impairment';
export type AlertSeverity = 'all' | 'critical' | 'high' | 'medium';

export interface UnifiedAlertItem {
  id: string;
  category: 'coc_approval' | 'statutory_milestone' | 'system_impairment';
  severity: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  siteId: string;
  siteName: string;
  standardReference: string; // e.g., "SANS 10139:2021 Cl. 13.2"
  statutoryImpact: string;
  timestamp: string;
  daysOverdueOrPending?: number;
  assignedTo?: string;
  metadata?: Record<string, any>;
  isAcknowledged: boolean;
  // Source entities
  cocSource?: SansCocCertificate;
  defectSource?: DefectRecord;
  milestoneSource?: {
    milestone: StatutoryMilestone;
    dossierId: string;
    dossierNumber: string;
  };
}

export interface StaffNotificationCenterProps {
  onOpenCoc?: (coc: SansCocCertificate) => void;
  onOpenLogbook?: () => void;
  onOpenInspection?: () => void;
  onNavigateTab?: (tab: string) => void;
  className?: string;
}

export const StaffNotificationCenter: React.FC<StaffNotificationCenterProps> = ({
  onOpenCoc,
  onOpenLogbook,
  onOpenInspection,
  onNavigateTab,
  className = ''
}) => {
  const store = useAudrinStore();
  const cocs = store.getSansCocs();
  const defects = store.getDefects();
  const dossiers = store.getSafetyFileDossiers();
  const logbook = store.getSansLogbook();
  const sites = store.getSites();

  // Local state for filters and interactive modals
  const [activeCategory, setActiveCategory] = useState<AlertCategory>('all');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity>('all');
  const [siteFilter, setSiteFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [acknowledgedAlertIds, setAcknowledgedAlertIds] = useState<Set<string>>(new Set());
  const [hideAcknowledged, setHideAcknowledged] = useState<boolean>(false);

  // Modals for actions
  const [selectedCocForApproval, setSelectedCocForApproval] = useState<SansCocCertificate | null>(null);
  const [approvalNotes, setApprovalNotes] = useState<string>('');
  const [selectedDefectForResolve, setSelectedDefectForResolve] = useState<DefectRecord | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [selectedMilestoneForAction, setSelectedMilestoneForAction] = useState<{
    milestone: StatutoryMilestone;
    dossierId: string;
    dossierNumber: string;
  } | null>(null);
  const [milestoneActionNotes, setMilestoneActionNotes] = useState<string>('');

  // Tool modals
  const [simulateModalOpen, setSimulateModalOpen] = useState(false);
  const [exportBriefingOpen, setExportBriefingOpen] = useState(false);
  const [copiedBriefing, setCopiedBriefing] = useState(false);
  const [dispatchSuccessToast, setDispatchSuccessToast] = useState<string | null>(null);

  // New simulated impairment form
  const [simTitle, setSimTitle] = useState('Optical Sensor Chamber Saturation Drift > 85%');
  const [simSiteId, setSimSiteId] = useState(sites[0]?.id || 'site-menlyn-01');
  const [simRisk, setSimRisk] = useState<'critical' | 'major'>('critical');
  const [simDesc, setSimDesc] = useState('Addressable sensor L2-D114 chamber obscuration at 88.4%. Exceeds SANS 10139 false alarm prevention drift compensation limit.');

  // Today reference
  const today = new Date();

  // Aggregate Unified Alerts
  const allAlerts: UnifiedAlertItem[] = useMemo(() => {
    const list: UnifiedAlertItem[] = [];

    // 1. PENDING COC APPROVALS
    cocs.forEach((coc) => {
      const isDraft = coc.certificateStatus === 'Draft' || !coc.isSigned;
      if (isDraft) {
        const createdDate = new Date(coc.issueDate || '2026-09-01');
        const diffDays = Math.max(1, Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));

        list.push({
          id: `alert-coc-${coc.id}`,
          category: 'coc_approval',
          severity: 'high',
          title: `Pending COC Approval: ${coc.cocNumber}`,
          description: coc.commissionerDeclaration || 'Provisional draft certificate awaiting secondary verification and Commissioner digital signature.',
          siteId: coc.siteId,
          siteName: coc.siteName,
          standardReference: 'SANS 10139:2021 Clause 13.2',
          statutoryImpact: 'Blocks formal building occupancy and municipal SANS 10400-T sign-off until officially issued.',
          timestamp: coc.issueDate || '2026-09-02',
          daysOverdueOrPending: diffDays,
          assignedTo: coc.commissionerName || 'Registered SAQCC Commissioner',
          metadata: {
            category: coc.systemCategory,
            standbyAutonomy: `${coc.powerSupplyAutonomy.standbyAutonomyHours}h standby + ${coc.powerSupplyAutonomy.evacuateAlarmDurationMinutes}m alarm`,
            cabling: coc.cablingAndCircuits.cableSpecification,
            sounderDba: `${coc.audibilityAndSounders.soundLevelBedheadDba} dB(A)`
          },
          isAcknowledged: acknowledgedAlertIds.has(`alert-coc-${coc.id}`),
          cocSource: coc
        });
      }
    });

    // 2. MISSED STATUTORY MILESTONES
    // Check milestones inside Safety File Dossiers
    dossiers.forEach((dossier) => {
      dossier.milestones.forEach((ms) => {
        const isMsOverdue = ms.status === 'overdue' || (ms.status !== 'completed' && new Date(ms.targetDate) < today);
        if (isMsOverdue) {
          const targetDateObj = new Date(ms.targetDate);
          const diffDays = Math.max(1, Math.floor((today.getTime() - targetDateObj.getTime()) / (1000 * 60 * 60 * 24)));

          list.push({
            id: `alert-ms-${dossier.id}-${ms.id}`,
            category: 'statutory_milestone',
            severity: diffDays > 5 ? 'critical' : 'high',
            title: `Missed Statutory Milestone: ${ms.title}`,
            description: ms.notes || `Target completion date of ${ms.targetDate} has elapsed without verified sign-off in safety dossier ${dossier.dossierNumber}.`,
            siteId: dossier.siteId,
            siteName: dossier.siteName,
            standardReference: ms.clauseReference || 'SANS 10139:2021 / SANS 10400-T',
            statutoryImpact: `Statutory milestone elapsed by ${diffDays} day(s). Non-compliance exposes facility to municipal notice of defect.`,
            timestamp: ms.targetDate,
            daysOverdueOrPending: diffDays,
            assignedTo: `${ms.responsiblePerson} (${ms.responsibleRole})`,
            metadata: {
              standard: ms.standard,
              dossierNumber: dossier.dossierNumber,
              currentStatus: ms.status
            },
            isAcknowledged: acknowledgedAlertIds.has(`alert-ms-${dossier.id}-${ms.id}`),
            milestoneSource: {
              milestone: ms,
              dossierId: dossier.id,
              dossierNumber: dossier.dossierNumber
            }
          });
        }
      });
    });

    // Check Logbook required tests: Weekly MCP Rotational test (> 7 days)
    const recentWeeklyLog = logbook
      .filter((l) => l.entryType === 'weekly')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (recentWeeklyLog) {
      const lastWeeklyDate = new Date(recentWeeklyLog.date);
      const daysSinceWeekly = Math.floor((today.getTime() - lastWeeklyDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceWeekly > 7) {
        list.push({
          id: 'alert-log-weekly-overdue',
          category: 'statutory_milestone',
          severity: 'high',
          title: 'Overdue SANS 10139 Weekly MCP Rotational Test',
          description: `Last recorded Manual Call Point key test was executed ${daysSinceWeekly} days ago (${recentWeeklyLog.date}). SANS 10139 Clause 13 mandates weekly rotational testing.`,
          siteId: recentWeeklyLog.siteId,
          siteName: recentWeeklyLog.siteName,
          standardReference: 'SANS 10139:2021 Clause 13.2',
          statutoryImpact: 'Insurance breach & statutory non-conformance if weekly testing cycle exceeds 7 consecutive days.',
          timestamp: recentWeeklyLog.date,
          daysOverdueOrPending: daysSinceWeekly - 7,
          assignedTo: 'Lead Fire Engineer / On-Site Facility Supervisor',
          isAcknowledged: acknowledgedAlertIds.has('alert-log-weekly-overdue')
        });
      }
    }

    // 3. URGENT SYSTEM IMPAIRMENTS REPORTED BY PLATFORM
    defects.forEach((def) => {
      const isUnresolved = def.status !== 'resolved';
      const isCriticalOrMajor = def.riskLevel === 'critical' || def.riskLevel === 'major' || def.blocksCocIssuance;

      if (isUnresolved && isCriticalOrMajor) {
        const createdDate = new Date(def.createdAt || '2026-09-02');
        const diffDays = Math.max(1, Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));

        list.push({
          id: `alert-defect-${def.id}`,
          category: 'system_impairment',
          severity: def.riskLevel === 'critical' ? 'critical' : 'high',
          title: `Urgent System Impairment: ${def.title}`,
          description: def.description,
          siteId: def.siteId,
          siteName: def.siteName,
          standardReference: def.sourceCitation ? `${def.sourceCitation.sourceDocTitle} ${def.sourceCitation.clauseOrQuestion}` : 'SANS 10139:2021 Cl. 6 & 8',
          statutoryImpact: def.blocksCocIssuance
            ? 'BLOCKS COC ISSUANCE: Statutory certificate cannot be issued while this critical defect remains open.'
            : 'Operational impairment compromising rapid life-safety detection and notification response.',
          timestamp: def.targetDate || def.createdAt,
          daysOverdueOrPending: diffDays,
          assignedTo: def.responsibleParty,
          metadata: {
            remedialAction: def.remedialAction,
            riskLevel: def.riskLevel,
            blocksCoc: def.blocksCocIssuance
          },
          isAcknowledged: acknowledgedAlertIds.has(`alert-defect-${def.id}`),
          defectSource: def
        });
      }
    });

    // Sort by Severity (critical first, then high, then medium)
    return list.sort((a, b) => {
      const weight = { critical: 3, high: 2, medium: 1 };
      return weight[b.severity] - weight[a.severity];
    });
  }, [cocs, dossiers, defects, logbook, acknowledgedAlertIds]);

  // Filtered Alert List
  const filteredAlerts = useMemo(() => {
    return allAlerts.filter((alert) => {
      if (activeCategory !== 'all' && alert.category !== activeCategory) return false;
      if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
      if (siteFilter !== 'all' && alert.siteId !== siteFilter) return false;
      if (hideAcknowledged && alert.isAcknowledged) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          alert.title.toLowerCase().includes(q) ||
          alert.description.toLowerCase().includes(q) ||
          alert.siteName.toLowerCase().includes(q) ||
          alert.standardReference.toLowerCase().includes(q) ||
          (alert.assignedTo && alert.assignedTo.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [allAlerts, activeCategory, severityFilter, siteFilter, hideAcknowledged, searchQuery]);

  // Metrics
  const metrics = useMemo(() => {
    const total = allAlerts.length;
    const critical = allAlerts.filter((a) => a.severity === 'critical').length;
    const cocPending = allAlerts.filter((a) => a.category === 'coc_approval').length;
    const milestonesMissed = allAlerts.filter((a) => a.category === 'statutory_milestone').length;
    const impairments = allAlerts.filter((a) => a.category === 'system_impairment').length;
    const unacknowledged = allAlerts.filter((a) => !a.isAcknowledged).length;

    return { total, critical, cocPending, milestonesMissed, impairments, unacknowledged };
  }, [allAlerts]);

  // Toggle Acknowledge Alert
  const handleToggleAcknowledge = (id: string) => {
    setAcknowledgedAlertIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Acknowledge All
  const handleAcknowledgeAll = () => {
    setAcknowledgedAlertIds(new Set(allAlerts.map((a) => a.id)));
  };

  // Approve COC
  const handleConfirmCocApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCocForApproval) return;

    store.approveSansCoc(selectedCocForApproval.id, approvalNotes || 'Approved via Staff Statutory Notification Center');
    setSelectedCocForApproval(null);
    setApprovalNotes('');
    setDispatchSuccessToast(`Certificate ${selectedCocForApproval.cocNumber} officially approved & issued!`);
    setTimeout(() => setDispatchSuccessToast(null), 5000);
  };

  // Resolve Impairment
  const handleConfirmResolveDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDefectForResolve) return;

    store.resolveDefect(
      selectedDefectForResolve.id,
      resolutionNotes || 'Remedial action verified on site by Lead Engineer. Restored to SANS 10139 compliant operation.'
    );
    setSelectedDefectForResolve(null);
    setResolutionNotes('');
    setDispatchSuccessToast(`Impairment "${selectedDefectForResolve.title}" marked resolved!`);
    setTimeout(() => setDispatchSuccessToast(null), 5000);
  };

  // Update Milestone
  const handleConfirmMilestoneCompletion = (newStatus: 'completed' | 'in_progress') => {
    if (!selectedMilestoneForAction) return;

    store.updateMilestoneStatus(
      selectedMilestoneForAction.dossierId,
      selectedMilestoneForAction.milestone.id,
      newStatus,
      milestoneActionNotes || `Statutory milestone updated by Lead Engineer Bethuel Moukangwe.`
    );
    setSelectedMilestoneForAction(null);
    setMilestoneActionNotes('');
    setDispatchSuccessToast(`Statutory milestone updated to ${newStatus}!`);
    setTimeout(() => setDispatchSuccessToast(null), 5000);
  };

  // Simulate new impairment
  const handleCreateSimulatedImpairment = (e: React.FormEvent) => {
    e.preventDefault();
    const siteObj = sites.find((s) => s.id === simSiteId) || sites[0];
    const newDefect: DefectRecord = {
      id: `def-sim-${Date.now()}`,
      siteId: siteObj.id,
      siteName: siteObj.name,
      clientId: 'org-tshivhase-01',
      title: simTitle,
      description: simDesc,
      riskLevel: simRisk,
      blocksCocIssuance: simRisk === 'critical',
      status: 'open',
      remedialAction: 'Dispatch certified SAQCC technician for detector calibration or loop megger re-test.',
      responsibleParty: 'Audrin Fire Engineers',
      targetDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    store.addDefect(newDefect);
    setSimulateModalOpen(false);
    setDispatchSuccessToast(`Reported new urgent impairment for ${siteObj.name}!`);
    setTimeout(() => setDispatchSuccessToast(null), 5000);
  };

  // Dispatch emergency technician
  const handleDispatchTechnician = (alert: UnifiedAlertItem) => {
    const dispatchRef = `DISP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setDispatchSuccessToast(
      `Emergency SAQCC Technician Dispatched: Ref #${dispatchRef} assigned to Sipho Ndlovu for ${alert.siteName}.`
    );
    setTimeout(() => setDispatchSuccessToast(null), 6000);
  };

  // Generate Export Briefing Text
  const exportBriefingText = useMemo(() => {
    return [
      `========================================================================`,
      `AUDRIN FIRE ENGINEERS - STATUTORY COMPLIANCE & IMPAIRMENT BRIEFING`,
      `Standard: SANS 10139:2021 & SANS 10400-T:2011 | POPIA Act 4 of 2013`,
      `Generated: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}`,
      `Officer: Bethuel Moukangwe (Lead Fire Engineer / SAQCC Commissioner Desk)`,
      `========================================================================`,
      ``,
      `EXECUTIVE ALERT SUMMARY:`,
      `• Total Active Alerts: ${metrics.total}`,
      `• Critical Severe Level: ${metrics.critical}`,
      `• Pending COC Approvals: ${metrics.cocPending}`,
      `• Missed Statutory Milestones: ${metrics.milestonesMissed}`,
      `• Urgent System Impairments: ${metrics.impairments}`,
      ``,
      `------------------------------------------------------------------------`,
      `DETAILED STATUTORY NOTIFICATIONS:`,
      ...allAlerts.map((a, i) => [
        `[${i + 1}] ${a.severity.toUpperCase()} | ${a.category.toUpperCase().replace('_', ' ')}`,
        `Title: ${a.title}`,
        `Site: ${a.siteName} (Ref: ${a.siteId})`,
        `Statutory Reference: ${a.standardReference}`,
        `Impact: ${a.statutoryImpact}`,
        `Responsible: ${a.assignedTo || 'Unassigned'}`,
        `Details: ${a.description}`,
        `Status: ${a.isAcknowledged ? 'Acknowledged' : 'ACTION REQUIRED'}`,
        `---`
      ].join('\n')),
      ``,
      `End of statutory incident manifest. Encrypted non-repudiation log filed.`
    ].join('\n');
  }, [allAlerts, metrics]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Toast Notification */}
      {dispatchSuccessToast && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-2xl animate-fade-in text-xs font-semibold">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{dispatchSuccessToast}</span>
          </div>
          <button
            onClick={() => setDispatchSuccessToast(null)}
            className="text-emerald-400/60 hover:text-emerald-300 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Console Header & Live Ticker */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#151518] border border-white/5 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[1.5px] px-2.5 py-0.5 rounded-full bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/40">
                Central Statutory Notification Panel
              </span>
              {metrics.critical > 0 ? (
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-red-950/70 text-red-400 border border-red-500/40 animate-pulse">
                  <Flame className="w-3 h-3 text-red-400" />
                  <span>{metrics.critical} Critical Statutory Action(s) Required</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/40">
                  Platform Systems Quiescent
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <BellRing className="w-6 h-6 text-[#C1A461]" />
              <span>Compliance, Milestone & Impairment Control</span>
            </h2>
            <p className="text-xs text-white/50 max-w-2xl leading-relaxed">
              Real-time statutory alerting hub for SANS 10139 & SANS 10400-T governance. Direct administrative action triggers for pending COC issuances, missed timeline clauses, and critical fire alarm impairments.
            </p>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSimulateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0A0A0B] hover:bg-[#1E1E22] text-[#C1A461] border border-[#C1A461]/30 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Simulate or manually report an urgent fire alarm impairment"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Impairment</span>
            </button>
            <button
              onClick={() => setExportBriefingOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0A0A0B] hover:bg-[#1E1E22] text-white/70 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
              title="Generate a printable SANS 10139 executive incident briefing"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Briefing</span>
            </button>
            <button
              onClick={handleAcknowledgeAll}
              disabled={metrics.unacknowledged === 0}
              className="px-3.5 py-2 rounded-xl bg-[#0A0A0B] hover:bg-[#1E1E22] text-white/50 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
              title="Mark all current alerts as acknowledged"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Acknowledge All</span>
            </button>
          </div>
        </div>

        {/* 4 Stat KPI Metric Chips */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Tile 1: All Alerts */}
          <div
            onClick={() => {
              setActiveCategory('all');
              setSeverityFilter('all');
            }}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#1E1E22] border-[#C1A461]/60 shadow-lg'
                : 'bg-[#0D0D0E] border-white/5 hover:border-white/15'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-white/50 mb-1">
              <span className="font-mono uppercase">Total Alerts</span>
              <Bell className="w-4 h-4 text-white/40" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-white">{metrics.total}</span>
              <span className="text-[10px] text-white/40">({metrics.unacknowledged} unread)</span>
            </div>
            <p className="text-[10px] text-white/40 mt-1 font-mono">Aggregated platform log</p>
          </div>

          {/* Tile 2: Pending COCs */}
          <div
            onClick={() => setActiveCategory('coc_approval')}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              activeCategory === 'coc_approval'
                ? 'bg-[#1E1E22] border-[#C1A461] shadow-lg shadow-[#C1A461]/10'
                : 'bg-[#0D0D0E] border-white/5 hover:border-[#C1A461]/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-[#C1A461] mb-1">
              <span className="font-mono font-bold uppercase">Pending COCs</span>
              <FileCheck className="w-4 h-4 text-[#C1A461]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[#C1A461]">{metrics.cocPending}</span>
              <span className="text-[10px] text-[#C1A461]/60">awaiting sign-off</span>
            </div>
            <p className="text-[10px] text-white/40 mt-1 font-mono">SANS 10139 draft certificates</p>
          </div>

          {/* Tile 3: Missed Statutory Milestones */}
          <div
            onClick={() => setActiveCategory('statutory_milestone')}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              activeCategory === 'statutory_milestone'
                ? 'bg-[#1E1E22] border-amber-500 shadow-lg shadow-amber-500/10'
                : 'bg-[#0D0D0E] border-white/5 hover:border-amber-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
              <span className="font-mono font-bold uppercase">Missed Milestones</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-amber-400">{metrics.milestonesMissed}</span>
              <span className="text-[10px] text-amber-400/60">overdue schedule</span>
            </div>
            <p className="text-[10px] text-white/40 mt-1 font-mono">SANS 10139 / 10400-T gates</p>
          </div>

          {/* Tile 4: Urgent System Impairments */}
          <div
            onClick={() => setActiveCategory('system_impairment')}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              activeCategory === 'system_impairment'
                ? 'bg-[#1E1E22] border-red-500 shadow-lg shadow-red-500/10'
                : 'bg-[#0D0D0E] border-white/5 hover:border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-red-400 mb-1">
              <span className="font-mono font-bold uppercase">Impairments</span>
              <AlertOctagon className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-red-400">{metrics.impairments}</span>
              <span className="text-[10px] text-red-400/60">critical faults</span>
            </div>
            <p className="text-[10px] text-white/40 mt-1 font-mono">Battery, loop & siting defects</p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="pt-2 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-white text-black font-mono shadow'
                  : 'bg-[#0A0A0B] text-white/50 hover:text-white border border-white/5'
              }`}
            >
              All ({metrics.total})
            </button>
            <button
              onClick={() => setActiveCategory('coc_approval')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'coc_approval'
                  ? 'bg-[#C1A461] text-black font-mono shadow'
                  : 'bg-[#0A0A0B] text-[#C1A461]/70 hover:text-[#C1A461] border border-[#C1A461]/30'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Pending COCs ({metrics.cocPending})</span>
            </button>
            <button
              onClick={() => setActiveCategory('statutory_milestone')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'statutory_milestone'
                  ? 'bg-amber-500 text-black font-mono shadow'
                  : 'bg-[#0A0A0B] text-amber-400/70 hover:text-amber-400 border border-amber-500/30'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Milestones ({metrics.milestonesMissed})</span>
            </button>
            <button
              onClick={() => setActiveCategory('system_impairment')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                activeCategory === 'system_impairment'
                  ? 'bg-red-500 text-white font-mono shadow'
                  : 'bg-[#0A0A0B] text-red-400/70 hover:text-red-400 border border-red-500/30'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Impairments ({metrics.impairments})</span>
            </button>
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Site selector */}
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#0A0A0B] border border-white/10 rounded-xl text-white font-mono text-[11px] focus:border-[#C1A461] outline-none"
            >
              <option value="all">All Sites ({sites.length})</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Severity selector */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as AlertSeverity)}
              className="px-2.5 py-1.5 bg-[#0A0A0B] border border-white/10 rounded-xl text-white font-mono text-[11px] focus:border-[#C1A461] outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>

            {/* Toggle acknowledged */}
            <button
              onClick={() => setHideAcknowledged(!hideAcknowledged)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono transition cursor-pointer ${
                hideAcknowledged
                  ? 'bg-[#C1A461]/20 text-[#C1A461] border-[#C1A461]/40'
                  : 'bg-[#0A0A0B] text-white/50 border-white/10 hover:text-white'
              }`}
            >
              {hideAcknowledged ? 'Hiding Acked' : 'Show All'}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by clause (e.g. 13.2), building name, certificate number, or responsible engineer..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0B] border border-white/10 rounded-xl text-xs text-white placeholder:text-white/30 focus:border-[#C1A461] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Alert Feed Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-white/50 px-2">
          <span>Showing {filteredAlerts.length} matching statutory alerts</span>
          <span>Sorted by priority SLA</span>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#151518] border border-white/5 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-70" />
            <h3 className="text-base font-bold text-white">No Matching Statutory Alerts</h3>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              All compliance gates, SANS 10139 logbook inspection milestones, and system impairments in the selected category are acknowledged or cleared.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSeverityFilter('all');
                setSiteFilter('all');
                setSearchQuery('');
                setHideAcknowledged(false);
              }}
              className="px-4 py-2 bg-[#0A0A0B] hover:bg-[#1E1E22] text-[#C1A461] border border-[#C1A461]/30 rounded-xl text-xs font-bold uppercase transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredAlerts.map((alert) => {
              const isCoc = alert.category === 'coc_approval';
              const isMilestone = alert.category === 'statutory_milestone';
              const isImpairment = alert.category === 'system_impairment';

              return (
                <div
                  key={alert.id}
                  className={`p-5 sm:p-6 rounded-3xl border transition shadow-xl space-y-4 ${
                    alert.severity === 'critical'
                      ? 'bg-[#170E10] border-red-500/50 hover:border-red-500'
                      : alert.severity === 'high'
                      ? 'bg-[#16130D] border-amber-500/40 hover:border-amber-500/70'
                      : 'bg-[#151518] border-white/5 hover:border-white/15'
                  } ${alert.isAcknowledged ? 'opacity-65' : 'opacity-100'}`}
                >
                  {/* Card Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Severity Pill */}
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                          alert.severity === 'critical'
                            ? 'bg-red-950/80 text-red-400 border-red-500/50 animate-pulse'
                            : alert.severity === 'high'
                            ? 'bg-amber-950/80 text-amber-400 border-amber-500/50'
                            : 'bg-blue-950/80 text-blue-400 border-blue-500/50'
                        }`}
                      >
                        {alert.severity} priority
                      </span>

                      {/* Category Pill */}
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                          isCoc
                            ? 'bg-[#C1A461]/20 text-[#C1A461] border-[#C1A461]/40'
                            : isMilestone
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                            : 'bg-red-950/60 text-red-300 border-red-500/40'
                        }`}
                      >
                        {isCoc
                          ? 'Pending COC Approval'
                          : isMilestone
                          ? 'Missed Statutory Milestone'
                          : 'Urgent System Impairment'}
                      </span>

                      {/* Standard Reference */}
                      <span className="text-[10px] font-mono text-white/50 bg-[#0A0A0B] px-2 py-0.5 rounded border border-white/5">
                        {alert.standardReference}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-white/40">
                        {alert.daysOverdueOrPending !== undefined && (
                          <span
                            className={
                              alert.severity === 'critical'
                                ? 'text-red-400 font-bold'
                                : 'text-amber-400 font-bold'
                            }
                          >
                            {alert.daysOverdueOrPending}d overdue / pending
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => handleToggleAcknowledge(alert.id)}
                        className={`text-[10px] font-mono uppercase px-2 py-1 rounded-lg border transition cursor-pointer ${
                          alert.isAcknowledged
                            ? 'bg-white/10 text-white/70 border-white/20'
                            : 'bg-[#0A0A0B] text-white/40 hover:text-white border-white/5'
                        }`}
                      >
                        {alert.isAcknowledged ? 'Acked' : 'Ack'}
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {isCoc && <FileCheck className="w-4 h-4 text-[#C1A461] shrink-0" />}
                      {isMilestone && <Clock className="w-4 h-4 text-amber-400 shrink-0" />}
                      {isImpairment && <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />}
                      <span>{alert.title}</span>
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed">{alert.description}</p>
                  </div>

                  {/* Location & Statutory Impact Box */}
                  <div className="p-3 rounded-2xl bg-[#0D0D0E]/80 border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
                        <Building2 className="w-3.5 h-3.5 text-[#C1A461]" />
                        <span className="font-bold text-white">{alert.siteName}</span>
                      </div>
                      {alert.assignedTo && (
                        <div className="text-[11px] text-white/50 font-mono">
                          Assignee: <span className="text-white/80">{alert.assignedTo}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-bold">
                        Statutory Consequence:
                      </div>
                      <p className="text-[11px] text-white/60 leading-snug">{alert.statutoryImpact}</p>
                    </div>
                  </div>

                  {/* Metadata Chips if present */}
                  {alert.metadata && (
                    <div className="flex flex-wrap gap-2 text-[10px] font-mono text-white/60">
                      {Object.entries(alert.metadata).map(([key, val]) => (
                        <span key={key} className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                          <strong className="text-white/40 uppercase">{key}: </strong>
                          <span className="text-white/80">{String(val)}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Administrative Action Footer */}
                  <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-white/40 font-mono">
                      Timestamp: {alert.timestamp}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Action 1: Pending COC Handlers */}
                      {isCoc && alert.cocSource && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedCocForApproval(alert.cocSource || null);
                              setApprovalNotes('');
                            }}
                            className="px-3.5 py-1.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Review & Approve COC</span>
                          </button>
                          {onOpenCoc && (
                            <button
                              onClick={() => onOpenCoc(alert.cocSource)}
                              className="px-3 py-1.5 bg-[#0A0A0B] hover:bg-[#1E1E22] text-[#C1A461] border border-[#C1A461]/30 text-xs font-bold uppercase rounded-xl transition flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect PDF</span>
                            </button>
                          )}
                        </>
                      )}

                      {/* Action 2: Missed Milestone Handlers */}
                      {isMilestone && alert.milestoneSource && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedMilestoneForAction(alert.milestoneSource || null);
                              setMilestoneActionNotes('');
                            }}
                            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Complete Milestone</span>
                          </button>
                          {onOpenLogbook && (
                            <button
                              onClick={onOpenLogbook}
                              className="px-3 py-1.5 bg-[#0A0A0B] hover:bg-[#1E1E22] text-amber-400 border border-amber-500/30 text-xs font-bold uppercase rounded-xl transition flex items-center gap-1 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Open Logbook</span>
                            </button>
                          )}
                        </>
                      )}

                      {/* Action 3: Urgent Impairment Handlers */}
                      {isImpairment && alert.defectSource && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedDefectForResolve(alert.defectSource || null);
                              setResolutionNotes('');
                            }}
                            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Resolve Impairment</span>
                          </button>
                          <button
                            onClick={() => handleDispatchTechnician(alert)}
                            className="px-3 py-1.5 bg-[#0A0A0B] hover:bg-[#1E1E22] text-red-400 border border-red-500/30 text-xs font-bold uppercase rounded-xl transition flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Dispatch Tech</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: REVIEW & APPROVE COC                                            */}
      {/* ========================================================================= */}
      {selectedCocForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#151518] border border-[#C1A461]/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/40">
                  SAQCC Commissioner Verification
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Approve Certificate of Compliance
                </h3>
                <p className="text-xs font-mono text-[#C1A461]">{selectedCocForApproval.cocNumber}</p>
              </div>
              <button
                onClick={() => setSelectedCocForApproval(null)}
                className="p-2 text-white/40 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#0D0D0E] border border-white/5 space-y-2">
                <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                  <div>
                    Site: <strong className="text-white">{selectedCocForApproval.siteName}</strong>
                  </div>
                  <div>
                    System Category: <strong className="text-[#C1A461]">Category {selectedCocForApproval.systemCategory}</strong>
                  </div>
                  <div>
                    Commissioner: <strong className="text-white">{selectedCocForApproval.commissionerName}</strong>
                  </div>
                  <div>
                    SAQCC Reg: <strong className="text-white">{selectedCocForApproval.commissionerSaqccNumber}</strong>
                  </div>
                  <div>
                    Standby Autonomy: <strong className="text-white">{selectedCocForApproval.powerSupplyAutonomy.standbyAutonomyHours}h</strong>
                  </div>
                  <div>
                    Sounder dB(A): <strong className="text-white">{selectedCocForApproval.audibilityAndSounders.soundLevelBedheadDba} dB(A)</strong>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] space-y-1">
                <div className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Draft Review Condition</span>
                </div>
                <p>{selectedCocForApproval.commissionerDeclaration}</p>
              </div>

              <form onSubmit={handleConfirmCocApproval} className="space-y-4">
                <div>
                  <label className="block text-white/80 font-bold mb-1.5">
                    Commissioner Approval & Final Verification Endorsement *
                  </label>
                  <textarea
                    rows={3}
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    placeholder="e.g. Point-to-point actuation confirmed. Battery autonomy discharge tested. Issued under SANS 10139 / SAQCC Commissioner authority."
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:border-[#C1A461] outline-none font-sans"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCocForApproval(null)}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-bold uppercase transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Officially Sign & Issue COC</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RESOLVE SYSTEM IMPAIRMENT                                       */}
      {/* ========================================================================= */}
      {selectedDefectForResolve && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#151518] border border-red-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/50">
                  Critical Remediation Closeout
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Resolve System Impairment
                </h3>
              </div>
              <button
                onClick={() => setSelectedDefectForResolve(null)}
                className="p-2 text-white/40 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#0D0D0E] border border-white/5 space-y-2">
                <h4 className="font-bold text-sm text-white">{selectedDefectForResolve.title}</h4>
                <p className="text-white/60 leading-relaxed">{selectedDefectForResolve.description}</p>
                <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-white/50">
                  Site: <strong className="text-white">{selectedDefectForResolve.siteName}</strong> &middot; Party: <strong className="text-white">{selectedDefectForResolve.responsibleParty}</strong>
                </div>
              </div>

              <form onSubmit={handleConfirmResolveDefect} className="space-y-4">
                <div>
                  <label className="block text-white/80 font-bold mb-1.5">
                    Field Remedial Close-Out Notes *
                  </label>
                  <textarea
                    rows={3}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="e.g. Battery pack replaced with 2x 12V 24Ah Yuasa VRLA cells. Terminal voltage 27.3V quiescent; 24.2V after 30min evacuation test. Impairment cleared."
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:border-red-500 outline-none font-sans"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDefectForResolve(null)}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-bold uppercase transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm Impairment Cleared</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: COMPLETE STATUTORY MILESTONE                                    */}
      {/* ========================================================================= */}
      {selectedMilestoneForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#151518] border border-amber-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-500/50">
                  Statutory Milestone Governance
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Update Statutory Milestone
                </h3>
              </div>
              <button
                onClick={() => setSelectedMilestoneForAction(null)}
                className="p-2 text-white/40 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#0D0D0E] border border-white/5 space-y-2">
                <h4 className="font-bold text-sm text-white">{selectedMilestoneForAction.milestone.title}</h4>
                <div className="text-[11px] font-mono text-white/60 space-y-1">
                  <div>Clause: <strong className="text-amber-400">{selectedMilestoneForAction.milestone.clauseReference}</strong></div>
                  <div>Standard: <strong className="text-white">{selectedMilestoneForAction.milestone.standard}</strong></div>
                  <div>Target Date: <strong className="text-red-400">{selectedMilestoneForAction.milestone.targetDate}</strong></div>
                  <div>Assignee: <strong className="text-white">{selectedMilestoneForAction.milestone.responsiblePerson} ({selectedMilestoneForAction.milestone.responsibleRole})</strong></div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-white/80 font-bold mb-1">
                  Execution & Verification Notes
                </label>
                <textarea
                  rows={3}
                  value={milestoneActionNotes}
                  onChange={(e) => setMilestoneActionNotes(e.target.value)}
                  placeholder="e.g. Quarterly sound level grid and 25% detector rotational checks executed. Certified compliant with SANS 10139 Cl. 13."
                  className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:border-amber-500 outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMilestoneForAction(null)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-bold uppercase transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmMilestoneCompletion('in_progress')}
                  className="px-4 py-2.5 bg-[#0A0A0B] hover:bg-[#1E1E22] text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold uppercase transition cursor-pointer"
                >
                  Mark In Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmMilestoneCompletion('completed')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer font-bold"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark Milestone Completed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: SIMULATE / REPORT IMPAIRMENT                                    */}
      {/* ========================================================================= */}
      {simulateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#151518] border border-[#C1A461]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-[#C1A461]/20 text-[#C1A461] border border-[#C1A461]/40">
                  Diagnostic Alert Simulator
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Report Urgent Fire Alarm Impairment
                </h3>
              </div>
              <button
                onClick={() => setSimulateModalOpen(false)}
                className="p-2 text-white/40 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSimulatedImpairment} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/80 font-bold mb-1.5">Target Building / Site *</label>
                <select
                  value={simSiteId}
                  onChange={(e) => setSimSiteId(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white font-semibold focus:border-[#C1A461] outline-none"
                >
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.address})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1.5">Impairment Title *</label>
                <input
                  type="text"
                  required
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:border-[#C1A461] outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1.5">Risk Level *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSimRisk('critical')}
                    className={`p-2.5 rounded-xl uppercase font-bold text-center border cursor-pointer transition ${
                      simRisk === 'critical'
                        ? 'bg-red-950/80 text-red-400 border-red-500'
                        : 'bg-[#0A0A0B] text-white/50 border-white/10'
                    }`}
                  >
                    Critical (Blocks COC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimRisk('major')}
                    className={`p-2.5 rounded-xl uppercase font-bold text-center border cursor-pointer transition ${
                      simRisk === 'major'
                        ? 'bg-amber-950/80 text-amber-400 border-amber-500'
                        : 'bg-[#0A0A0B] text-white/50 border-white/10'
                    }`}
                  >
                    Major (Operational)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-bold mb-1.5">Technical Observation *</label>
                <textarea
                  rows={3}
                  required
                  value={simDesc}
                  onChange={(e) => setSimDesc(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:border-[#C1A461] outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSimulateModalOpen(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl text-xs font-bold uppercase transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Dispatch Platform Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: EXPORT STATUTORY BRIEFING                                       */}
      {/* ========================================================================= */}
      {exportBriefingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-[#151518] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">
                  SANS 10139 Clause 13 Briefing Export
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Executive Statutory Incident & Compliance Briefing
                </h3>
              </div>
              <button
                onClick={() => setExportBriefingOpen(false)}
                className="p-2 text-white/40 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#0A0A0B] p-4 rounded-2xl border border-white/5 font-mono text-[11px] text-white/80 leading-relaxed whitespace-pre-wrap selection:bg-[#C1A461] selection:text-black">
              {exportBriefingText}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono text-white/40">
                Ready for municipal fire department or building insurance submission
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(exportBriefingText);
                    setCopiedBriefing(true);
                    setTimeout(() => setCopiedBriefing(false), 3000);
                  }}
                  className="px-4 py-2.5 bg-[#C1A461] hover:bg-[#D4BC7B] text-black rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer font-bold shadow-md"
                >
                  {copiedBriefing ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedBriefing ? 'Copied to Clipboard' : 'Copy Briefing Text'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
