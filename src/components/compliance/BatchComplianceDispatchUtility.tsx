import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileCheck, 
  Shield, 
  ShieldCheck, 
  Mail, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Filter, 
  Search, 
  Eye, 
  Download, 
  Copy, 
  Users, 
  Layers, 
  Lock, 
  Check, 
  RefreshCw, 
  Clock, 
  Building2, 
  MapPin, 
  Hash, 
  ExternalLink,
  Plus,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import { AudrinStore } from '../../services/store';
import { 
  batchEmailService, 
  BatchSelectableDocument, 
  PreVerifiedClientSafetyOfficer, 
  BatchDispatchResult,
  BatchComplianceDocType
} from '../../services/BatchEmailService';
import { User, SansCocCertificate, ConditionReport, SafetyFileDossier } from '../../types';

interface BatchComplianceDispatchUtilityProps {
  initialSelectedDocIds?: string[];
  onNavigateToEmailLogs?: () => void;
  onNavigateToAuditTrail?: () => void;
  onClose?: () => void;
  onCancel?: () => void;
}

export const BatchComplianceDispatchUtility: React.FC<BatchComplianceDispatchUtilityProps> = ({
  initialSelectedDocIds = [],
  onNavigateToEmailLogs,
  onNavigateToAuditTrail,
  onClose,
  onCancel
}) => {
  const handleDismiss = onClose || onCancel;
  const store = AudrinStore.getInstance();
  const currentUser = store.getUser();

  // Documents & Officers state
  const [allDocuments, setAllDocuments] = useState<BatchSelectableDocument[]>([]);
  const [verifiedOfficers, setVerifiedOfficers] = useState<PreVerifiedClientSafetyOfficer[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set(initialSelectedDocIds));
  const [selectedOfficerIds, setSelectedOfficerIds] = useState<Set<string>>(new Set());

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | BatchComplianceDocType>('ALL');
  const [clientFilter, setClientFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ISSUED_ONLY' | 'DRAFT_ONLY'>('ALL');

  // Preview Document Modal
  const [previewDoc, setPreviewDoc] = useState<BatchSelectableDocument | null>(null);

  // New Officer Registration Modal
  const [isAddOfficerModalOpen, setIsAddOfficerModalOpen] = useState(false);
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerClient, setNewOfficerClient] = useState('');
  const [newOfficerEmail, setNewOfficerEmail] = useState('');
  const [newOfficerPhone, setNewOfficerPhone] = useState('');
  const [newOfficerDesignation, setNewOfficerDesignation] = useState('Senior Construction Health & Safety Officer');
  const [newOfficerBody, setNewOfficerBody] = useState<'SACPCMP' | 'SAQCC' | 'OHS' | 'ECSA' | 'Saiosh'>('SACPCMP');
  const [newOfficerRegNo, setNewOfficerRegNo] = useState('');
  const [newOfficerSites, setNewOfficerSites] = useState('');

  // Bulk Dispatch Modal & Workflow
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [ccList, setCcList] = useState<string[]>(['compliance@audrinfire.co.za', 'records@audrinfire.co.za']);
  const [customCcInput, setCustomCcInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [dispatchResult, setDispatchResult] = useState<BatchDispatchResult | null>(null);

  // Feedback states
  const [copiedChecksum, setCopiedChecksum] = useState<string | null>(null);

  // Authorisation check: staff / ops_admin / super_admin
  const isAuthorisedStaff = ['staff', 'ops_admin', 'content_admin', 'super_admin', 'recruitment_admin'].includes(currentUser.role);

  // Load data
  const loadData = () => {
    const docs = batchEmailService.getAllSelectableDocuments();
    setAllDocuments(docs);
    const officers = batchEmailService.getPreVerifiedSafetyOfficers();
    setVerifiedOfficers(officers);

    // If initial selection provided, update selection
    if (initialSelectedDocIds.length > 0) {
      setSelectedDocIds(new Set(initialSelectedDocIds));
    }
  };

  useEffect(() => {
    loadData();
  }, [initialSelectedDocIds]);

  // Unique clients list for filtering
  const uniqueClients = useMemo(() => {
    const set = new Set<string>();
    allDocuments.forEach(d => {
      if (d.clientName) set.add(d.clientName);
    });
    return Array.from(set).sort();
  }, [allDocuments]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter(doc => {
      // Type filter
      if (typeFilter !== 'ALL' && doc.documentType !== typeFilter) {
        return false;
      }
      // Client filter
      if (clientFilter !== 'ALL' && doc.clientName !== clientFilter) {
        return false;
      }
      // Status filter
      if (statusFilter === 'ISSUED_ONLY' && !doc.isOfficialOrSigned) {
        return false;
      }
      if (statusFilter === 'DRAFT_ONLY' && doc.isOfficialOrSigned) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNumber = doc.documentNumber.toLowerCase().includes(q);
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesClient = doc.clientName.toLowerCase().includes(q);
        const matchesSite = doc.siteName.toLowerCase().includes(q);
        const matchesStandard = doc.standardRef.toLowerCase().includes(q);
        if (!matchesNumber && !matchesTitle && !matchesClient && !matchesSite && !matchesStandard) {
          return false;
        }
      }
      return true;
    });
  }, [allDocuments, typeFilter, clientFilter, statusFilter, searchQuery]);

  // Selected documents objects
  const selectedDocs = useMemo(() => {
    return allDocuments.filter(d => selectedDocIds.has(d.id));
  }, [allDocuments, selectedDocIds]);

  // Total selected payload size
  const totalSelectedPayloadBytes = useMemo(() => {
    return selectedDocs.reduce((acc, curr) => acc + (curr.fileSizeBytes || 50000), 0);
  }, [selectedDocs]);

  // Clients of selected documents
  const selectedDocumentClients = useMemo(() => {
    return Array.from(new Set(selectedDocs.map(d => d.clientName)));
  }, [selectedDocs]);

  // Officers that match selected documents' clients
  const suggestedOfficers = useMemo(() => {
    if (selectedDocumentClients.length === 0) return verifiedOfficers;
    return verifiedOfficers.filter(o => 
      selectedDocumentClients.some(c => 
        o.clientName.toLowerCase().includes(c.toLowerCase()) || 
        c.toLowerCase().includes(o.clientName.toLowerCase())
      )
    );
  }, [verifiedOfficers, selectedDocumentClients]);

  // Selected officers objects
  const selectedOfficers = useMemo(() => {
    return verifiedOfficers.filter(o => selectedOfficerIds.has(o.id));
  }, [verifiedOfficers, selectedOfficerIds]);

  // Automatically select matching officers when document selection changes and no officers were manually picked
  useEffect(() => {
    if (selectedDocs.length > 0 && selectedOfficerIds.size === 0) {
      const matchIds = new Set<string>();
      suggestedOfficers.forEach(o => matchIds.add(o.id));
      if (matchIds.size > 0) {
        setSelectedOfficerIds(matchIds);
      }
    }
  }, [selectedDocs, suggestedOfficers]);

  // Toggle single document selection
  const handleToggleDoc = (id: string) => {
    setSelectedDocIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle all filtered documents
  const handleToggleSelectAllFiltered = () => {
    const allFilteredIds = filteredDocuments.map(d => d.id);
    const areAllSelected = allFilteredIds.every(id => selectedDocIds.has(id));

    setSelectedDocIds(prev => {
      const next = new Set(prev);
      if (areAllSelected) {
        allFilteredIds.forEach(id => next.delete(id));
      } else {
        allFilteredIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  // Select all issued COCs
  const handleSelectAllIssuedCocs = () => {
    const issuedCocIds = allDocuments
      .filter(d => d.documentType === 'sans10139_coc' && d.isOfficialOrSigned)
      .map(d => d.id);

    setSelectedDocIds(prev => {
      const next = new Set(prev);
      issuedCocIds.forEach(id => next.add(id));
      return next;
    });
  };

  // Clear all selections
  const handleClearSelection = () => {
    setSelectedDocIds(new Set());
    setSelectedOfficerIds(new Set());
  };

  // Toggle safety officer selection
  const handleToggleOfficer = (id: string) => {
    setSelectedOfficerIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Open the Bulk Dispatch Configuration Modal
  const handleOpenDispatchModal = () => {
    if (selectedDocs.length === 0) return;

    const clientsStr = selectedDocumentClients.join(', ');
    const defaultSubject = `Statutory Compliance Batch Transmittal — ${selectedDocs.length} Documents — ${clientsStr || 'Client Life Safety'}`;
    const defaultMsg = `Dear Client Safety Officers,\n\nPlease find attached the official statutory compliance transmittal pack for ${clientsStr}.\n\nThis single bulk dispatch includes ${selectedDocs.length} verified compliance records (SANS 10139 Certificates of Compliance, inspection condition reports, and statutory safety file dossiers) formatted for your facility life-safety records and municipal fire department compliance under SANS 10400-T & OHS Act 85.\n\nAll documents have undergone cryptographic SHA-256 verification and are registered in the immutable Audrin Compliance Ledger.`;

    setEmailSubject(defaultSubject);
    setEmailMessage(defaultMsg);
    setDispatchResult(null);
    setIsDispatchModalOpen(true);
  };

  // Add custom CC
  const handleAddCc = () => {
    if (!customCcInput.trim() || !customCcInput.includes('@')) return;
    if (!ccList.includes(customCcInput.trim())) {
      setCcList([...ccList, customCcInput.trim()]);
    }
    setCustomCcInput('');
  };

  const handleRemoveCc = (emailToRemove: string) => {
    setCcList(ccList.filter(e => e !== emailToRemove));
  };

  // Execute Batch Dispatch
  const handleExecuteBatchDispatch = async () => {
    if (selectedDocs.length === 0 || selectedOfficers.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress(15);
    setProcessingStage('Generating document attachments & cryptographic digests...');

    try {
      await new Promise(r => setTimeout(r, 600));
      setProcessingProgress(45);
      setProcessingStage('Verifying pre-verified client safety officer credentials & POPIA compliance...');

      await new Promise(r => setTimeout(r, 600));
      setProcessingProgress(75);
      setProcessingStage('Packaging transmittal manifest and establishing TLS 1.3 encrypted channel...');

      const result = await batchEmailService.executeBatchDispatch({
        documents: selectedDocs,
        recipients: selectedOfficers,
        ccEmails: ccList,
        subject: emailSubject,
        transmittalMessage: emailMessage,
        authorizerUser: currentUser
      });

      setProcessingProgress(100);
      setProcessingStage('Dispatched successfully! Immutably logged in central compliance ledger.');
      await new Promise(r => setTimeout(r, 400));

      setDispatchResult(result);
      loadData(); // Refresh records
    } catch (err: any) {
      console.error('Batch dispatch failed:', err);
      alert('Batch dispatch failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Register a new pre-verified safety officer
  const handleSaveNewOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerName || !newOfficerEmail || !newOfficerClient || !newOfficerRegNo) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    const officer: PreVerifiedClientSafetyOfficer = {
      id: `so-custom-${Date.now()}`,
      name: newOfficerName.trim(),
      clientName: newOfficerClient.trim(),
      clientId: `CLI-${Date.now().toString().slice(-4)}`,
      email: newOfficerEmail.trim().toLowerCase(),
      phone: newOfficerPhone.trim() || '012 555 0000',
      designation: newOfficerDesignation.trim(),
      registrationBody: newOfficerBody,
      registrationNumber: newOfficerRegNo.trim(),
      verificationStatus: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedByStaffName: `${currentUser.name} (${currentUser.role})`,
      popiaConsentStatus: 'verified_consented',
      designatedSites: newOfficerSites ? newOfficerSites.split(',').map(s => s.trim()) : ['Designated Client Premises']
    };

    batchEmailService.registerVerifiedSafetyOfficer(officer);
    const updatedOfficers = batchEmailService.getPreVerifiedSafetyOfficers();
    setVerifiedOfficers(updatedOfficers);
    setSelectedOfficerIds(prev => new Set(prev).add(officer.id));

    // Reset form
    setNewOfficerName('');
    setNewOfficerClient('');
    setNewOfficerEmail('');
    setNewOfficerPhone('');
    setNewOfficerRegNo('');
    setNewOfficerSites('');
    setIsAddOfficerModalOpen(false);
  };

  // Copy SHA-256 hash helper
  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedChecksum(hash);
    setTimeout(() => setCopiedChecksum(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* AUTHORISED CLEARANCE BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl p-6 text-white border border-slate-700 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg shrink-0">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Batch Compliance Processing & Bulk Email Utility
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SANS 10139 & 10400-T Certified
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Allows authorised staff to select multiple compliance certificates, inspection condition reports, and statutory safety files, packaging them with SHA-256 cryptographic verification for single bulk dispatch to pre-verified client safety officers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Current Staff Clearance Card */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 shrink-0 flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-red-700/40 border border-red-500/50 flex items-center justify-center font-bold text-red-300">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                  {currentUser.name}
                  {isAuthorisedStaff ? (
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                      AUTHORISED STAFF
                    </span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-800 rounded">
                      READ-ONLY
                    </span>
                  )}
                </div>
                <div className="text-slate-400 font-mono text-[11px]">{currentUser.email}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Role: <span className="text-slate-200 capitalize">{currentUser.role.replace('_', ' ')}</span> &middot; Protocol: TLS 1.3</div>
              </div>
            </div>

            {handleDismiss && (
              <button
                onClick={handleDismiss}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                title="Return to Dashboard"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Operational Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-700/80">
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Available Compliance Records</div>
            <div className="text-xl font-bold text-white mt-1">{allDocuments.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">COCs, Reports & Dossiers</div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Pre-Verified Safety Officers</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">{verifiedOfficers.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">SACPCMP / SAQCC Accreditations</div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Selected for Bulk Dispatch</div>
            <div className="text-xl font-bold text-amber-400 mt-1">{selectedDocs.length} Items</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Across {selectedDocumentClients.length || 0} Clients</div>
          </div>
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50">
            <div className="text-xs text-slate-400 font-medium">Estimated Payload Size</div>
            <div className="text-xl font-bold text-cyan-300 mt-1">
              {(totalSelectedPayloadBytes / 1024).toFixed(1)} KB
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">With SHA-256 Digests</div>
          </div>
        </div>
      </div>

      {/* NON-AUTHORISED WARNING IF USER IS NOT STAFF */}
      {!isAuthorisedStaff && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-amber-800 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Authorised Staff Access Required for Bulk Dispatch</div>
            <div>
              Your current active profile has role <span className="font-mono font-bold">{currentUser.role}</span>. You may review compliance documents and inspect safety officer credentials, but executing single bulk email dispatches is restricted to verified statutory compliance officers.
            </div>
          </div>
        </div>
      )}

      {/* MASTER TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: DOCUMENT SELECTION & FILTER ENGINE (7 COLS) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Filter and Search Bar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search input */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search number, site, client, standard..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleSelectAllIssuedCocs}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                  title="Select all official issued COCs across all sites"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Select All Issued COCs
                </button>
                {selectedDocIds.size > 0 && (
                  <button
                    onClick={handleClearSelection}
                    className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                  >
                    Clear Selection ({selectedDocIds.size})
                  </button>
                )}
              </div>
            </div>

            {/* Document Type Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-3 text-xs">
              <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Type:
              </span>
              {[
                { id: 'ALL', label: 'All Documents', count: allDocuments.length },
                { id: 'sans10139_coc', label: 'SANS 10139 COCs', count: allDocuments.filter(d => d.documentType === 'sans10139_coc').length },
                { id: 'condition_report', label: 'Condition Reports', count: allDocuments.filter(d => d.documentType === 'condition_report').length },
                { id: 'safety_file_dossier', label: 'Safety File Packs', count: allDocuments.filter(d => d.documentType === 'safety_file_dossier').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTypeFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    typeFilter === tab.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${typeFilter === tab.id ? 'bg-slate-700 text-slate-200' : 'bg-white text-slate-600'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}

              {/* Client Dropdown */}
              <div className="ml-auto shrink-0 flex items-center gap-1.5">
                <span className="text-slate-500">Client:</span>
                <select
                  value={clientFilter}
                  onChange={e => setClientFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="ALL">All Clients ({uniqueClients.length})</option>
                  {uniqueClients.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Document Table Header with Bulk Checkbox */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-semibold">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={filteredDocuments.length > 0 && filteredDocuments.every(d => selectedDocIds.has(d.id))}
                  onChange={handleToggleSelectAllFiltered}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                  id="select-all-filtered-checkbox"
                />
                <label htmlFor="select-all-filtered-checkbox" className="cursor-pointer">
                  Showing {filteredDocuments.length} Documents ({selectedDocIds.size} Selected)
                </label>
              </div>

              <div className="flex items-center gap-4 text-slate-500">
                <span>Standard Ref</span>
                <span>Checksum</span>
                <span>Actions</span>
              </div>
            </div>

            {/* Document Rows */}
            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
              {filteredDocuments.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  No compliance documents match your selected filters or search query.
                </div>
              ) : (
                filteredDocuments.map(doc => {
                  const isSelected = selectedDocIds.has(doc.id);
                  return (
                    <div 
                      key={doc.id}
                      className={`p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 ${
                        isSelected ? 'bg-red-50/50 border-l-4 border-l-red-600' : ''
                      }`}
                    >
                      {/* Left: Checkbox + Doc details */}
                      <div className="flex items-start gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleDoc(doc.id)}
                          className="w-4 h-4 mt-1 rounded text-red-600 focus:ring-red-500 cursor-pointer shrink-0"
                        />

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              {doc.documentNumber}
                            </span>
                            
                            {/* Type tag */}
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              doc.documentType === 'sans10139_coc'
                                ? 'bg-blue-100 text-blue-800'
                                : doc.documentType === 'condition_report'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {doc.categoryBadge}
                            </span>

                            {/* Status badge */}
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              doc.isOfficialOrSigned 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {doc.isOfficialOrSigned ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3" />}
                              {doc.status}
                            </span>
                          </div>

                          <div className="text-xs font-medium text-slate-700 mt-1 truncate">
                            {doc.title}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <strong className="text-slate-700">{doc.clientName}</strong>
                            </span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {doc.siteName}
                            </span>
                            <span>&bull;</span>
                            <span>Date: {doc.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Metadata & preview action */}
                      <div className="flex items-center gap-3 shrink-0 text-xs">
                        <div className="text-right hidden sm:block">
                          <div className="text-[11px] font-medium text-slate-700">{doc.standardRef}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {doc.checksumSha256 ? (
                              <button 
                                onClick={() => handleCopyHash(doc.checksumSha256!)}
                                className="hover:text-red-600 transition-colors flex items-center gap-1 justify-end"
                                title="Click to copy SHA-256 checksum"
                              >
                                <span>{doc.checksumSha256.substring(0, 8)}...</span>
                                {copiedChecksum === doc.checksumSha256 ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            ) : (
                              'Auto-Computed'
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Preview Document Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRE-VERIFIED SAFETY OFFICERS & DISPATCH CONSOLE (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Pre-Verified Safety Officers Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Pre-Verified Safety Officers</h3>
              </div>
              <button
                onClick={() => setIsAddOfficerModalOpen(true)}
                className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 px-2 py-1 rounded"
              >
                <Plus className="w-3 h-3" /> Add Officer
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Only client safety officers with verified statutory accreditations (SACPCMP, SAQCC, OHS) and POPIA consent on file are eligible for bulk transmittals.
            </p>

            {/* Officer Selection List */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {verifiedOfficers.map(officer => {
                const isSelected = selectedOfficerIds.has(officer.id);
                const isMatching = selectedDocumentClients.some(c => 
                  officer.clientName.toLowerCase().includes(c.toLowerCase()) || 
                  c.toLowerCase().includes(officer.clientName.toLowerCase())
                );

                return (
                  <div
                    key={officer.id}
                    onClick={() => handleToggleOfficer(officer.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs' 
                        : isMatching
                        ? 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                        : 'border-slate-200 hover:bg-slate-50 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by parent onClick
                          className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                            {officer.name}
                            {isMatching && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-semibold">
                                MATCHES CLIENT
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-600 truncate font-medium">{officer.clientName}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{officer.email}</div>
                          <div className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                            {officer.registrationBody}: {officer.registrationNumber}
                          </div>
                        </div>
                      </div>

                      <span className="px-1.5 py-0.5 text-[9px] bg-emerald-100 text-emerald-800 font-bold rounded shrink-0">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Batch Payload Summary & Action Box */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-white">Bulk Transmittal Summary</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {selectedDocs.length} Docs &bull; {selectedOfficers.length} Recipients
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Selected Compliance Docs:</span>
                <span className="font-bold text-white">{selectedDocs.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Recipient Safety Officers:</span>
                <span className="font-bold text-emerald-400">{selectedOfficers.length} Verified</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Estimated Total Payload:</span>
                <span className="font-mono text-cyan-300">{(totalSelectedPayloadBytes / 1024).toFixed(1)} KB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Delivery Security Protocol:</span>
                <span className="text-slate-200">TLS 1.3 / ESMTP Ledger</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Statutory Mandate:</span>
                <span className="text-slate-300">SANS 10139 Cl. 13.2</span>
              </div>
            </div>

            {/* Launch Bulk Dispatch CTA */}
            <button
              onClick={handleOpenDispatchModal}
              disabled={selectedDocs.length === 0 || selectedOfficers.length === 0 || !isAuthorisedStaff}
              className={`w-full py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                selectedDocs.length > 0 && selectedOfficers.length > 0 && isAuthorisedStaff
                  ? 'bg-red-600 hover:bg-red-500 text-white cursor-pointer active:scale-98'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Send className="w-4 h-4" />
              Configure & Execute Bulk Dispatch
            </button>

            {selectedDocs.length === 0 && (
              <p className="text-[11px] text-amber-400 text-center">
                Select at least one compliance document from the left table.
              </p>
            )}
            {selectedDocs.length > 0 && selectedOfficers.length === 0 && (
              <p className="text-[11px] text-amber-400 text-center">
                Select at least one pre-verified safety officer recipient above.
              </p>
            )}
          </div>

        </div>

      </div>

      {/* MODAL 1: PREVIEW COMPLIANCE DOCUMENT DETAILS */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{previewDoc.documentNumber}</h3>
                  <p className="text-xs text-slate-500">{previewDoc.standardRef}</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 font-medium">Document Type</span>
                  <div className="font-semibold text-slate-800 capitalize mt-0.5">
                    {previewDoc.documentType.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Status</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{previewDoc.status}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Client Organisation</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{previewDoc.clientName}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Installation Site</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{previewDoc.siteName}</div>
                </div>
              </div>

              {previewDoc.checksumSha256 && (
                <div className="bg-slate-900 text-white p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] font-mono">SHA-256 Cryptographic Hash</span>
                    <button
                      onClick={() => handleCopyHash(previewDoc.checksumSha256!)}
                      className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-cyan-300 break-all mt-1">
                    {previewDoc.checksumSha256}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER / VERIFY NEW SAFETY OFFICER */}
      {isAddOfficerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Register Pre-Verified Safety Officer</h3>
              </div>
              <button 
                onClick={() => setIsAddOfficerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewOfficer} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newOfficerName}
                  onChange={e => setNewOfficerName(e.target.value)}
                  placeholder="e.g. David van der Merwe"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Client / Organisation *</label>
                  <input
                    type="text"
                    required
                    value={newOfficerClient}
                    onChange={e => setNewOfficerClient(e.target.value)}
                    placeholder="e.g. Sandton City Properties"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corporate Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newOfficerEmail}
                    onChange={e => setNewOfficerEmail(e.target.value)}
                    placeholder="e.g. safety@sandtoncity.co.za"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Accreditation Body *</label>
                  <select
                    value={newOfficerBody}
                    onChange={e => setNewOfficerBody(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="SACPCMP">SACPCMP (Construction Safety)</option>
                    <option value="SAQCC">SAQCC (Fire Protection)</option>
                    <option value="Saiosh">Saiosh (OHS Professional)</option>
                    <option value="ECSA">ECSA (Fire Engineer)</option>
                    <option value="OHS">OHS Act Section 16.2 Officer</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration Number *</label>
                  <input
                    type="text"
                    required
                    value={newOfficerRegNo}
                    onChange={e => setNewOfficerRegNo(e.target.value)}
                    placeholder="e.g. SACPCMP-CHSO-2023-9112"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Contact Phone</label>
                  <input
                    type="text"
                    value={newOfficerPhone}
                    onChange={e => setNewOfficerPhone(e.target.value)}
                    placeholder="e.g. 011 555 4910"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designated Sites (comma separated)</label>
                  <input
                    type="text"
                    value={newOfficerSites}
                    onChange={e => setNewOfficerSites(e.target.value)}
                    placeholder="e.g. Sandton City Mall, Nelson Mandela Square"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-800 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  By adding this safety officer, you confirm their professional accreditation has been validated against statutory registers, and statutory consent has been recorded under POPIA Section 18.
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOfficerModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Confirm & Register Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: BATCH DISPATCH CONFIGURATION & EXECUTION WIZARD */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-150 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-100 rounded-xl text-red-600">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Single Bulk Email Dispatch Console</h3>
                  <p className="text-xs text-slate-500">
                    Transmitting {selectedDocs.length} compliance documents to {selectedOfficers.length} pre-verified safety officers
                  </p>
                </div>
              </div>
              {!isProcessing && (
                <button 
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* If Dispatch is already complete, show Success & Manifest Report */}
            {dispatchResult ? (
              <div className="py-6 space-y-5">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-900">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-base font-bold">Bulk Dispatch Successfully Executed & Sealed!</h4>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Transmittal Reference: <span className="font-mono font-bold">{dispatchResult.batchId}</span> &middot; Dispatched at {dispatchResult.formattedDeliveryDate} SAST
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-emerald-200 text-xs">
                    <div>
                      <span className="text-emerald-700">Documents Attached:</span>
                      <div className="font-bold text-emerald-950">{dispatchResult.processedDocuments.length} Verified Files</div>
                    </div>
                    <div>
                      <span className="text-emerald-700">Pre-Verified Recipients:</span>
                      <div className="font-bold text-emerald-950">{dispatchResult.recipients.safetyOfficers.length} Officers</div>
                    </div>
                    <div>
                      <span className="text-emerald-700">Total Transmitted:</span>
                      <div className="font-bold text-emerald-950">{(dispatchResult.totalPayloadSizeBytes / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                </div>

                {/* Cryptographic Manifest Summary */}
                <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Combined Master SHA-256 Hash Digest:</span>
                    <button
                      onClick={() => handleCopyHash(dispatchResult.masterChecksumSha256)}
                      className="text-cyan-400 hover:text-cyan-300 text-[11px] flex items-center gap-1 font-semibold"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Digest
                    </button>
                  </div>
                  <div className="font-mono text-xs text-cyan-300 break-all bg-slate-950 p-2.5 rounded border border-slate-800">
                    {dispatchResult.masterChecksumSha256}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    A permanent delivery audit trail has been committed to the SANS 10139 Compliance Ledger and Central Email Logs.
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => batchEmailService.exportBatchDeliveryReceiptPdf(dispatchResult)}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    Download Official Transmittal Receipt (PDF)
                  </button>

                  <div className="flex items-center gap-2">
                    {onNavigateToEmailLogs && (
                      <button
                        onClick={() => {
                          setIsDispatchModalOpen(false);
                          onNavigateToEmailLogs();
                        }}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        View in Email Logs
                      </button>
                    )}
                    {onNavigateToAuditTrail && (
                      <button
                        onClick={() => {
                          setIsDispatchModalOpen(false);
                          onNavigateToAuditTrail();
                        }}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Inspect Audit Trail
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsDispatchModalOpen(false);
                        handleClearSelection();
                      }}
                      className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ) : isProcessing ? (
              /* LIVE EXECUTION PROGRESS STATE */
              <div className="py-12 px-6 text-center space-y-5">
                <RefreshCw className="w-10 h-10 text-red-600 animate-spin mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">Executing Single Bulk Email Operation...</h4>
                  <p className="text-xs text-slate-500 mt-1 font-mono">{processingStage}</p>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden max-w-md mx-auto border border-slate-200">
                  <div 
                    className="bg-red-600 h-full transition-all duration-300 ease-out" 
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  Packaging {selectedDocs.length} PDFs &bull; Generating SHA-256 Digests &bull; TLS 1.3 Dispatch
                </div>
              </div>
            ) : (
              /* CONFIGURATION & REVIEW STATE */
              <div className="py-4 space-y-4 text-xs">
                
                {/* Recipients preview pill list */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Pre-Verified Recipient Officers ({selectedOfficers.length}) *
                  </label>
                  <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    {selectedOfficers.map(o => (
                      <span 
                        key={o.id} 
                        className="px-2.5 py-1 bg-white border border-emerald-300 rounded-full text-slate-800 text-[11px] flex items-center gap-1.5 shadow-2xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <strong>{o.name}</strong> ({o.clientName}) &middot; <span className="text-slate-500">{o.email}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* CC list */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    CC Compliance Desks (Audit & Records)
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="email"
                      value={customCcInput}
                      onChange={e => setCustomCcInput(e.target.value)}
                      placeholder="Add another CC email (e.g. site.manager@client.co.za)"
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCc}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 rounded-lg"
                    >
                      Add CC
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ccList.map(cc => (
                      <span key={cc} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] flex items-center gap-1">
                        {cc}
                        <button onClick={() => handleRemoveCc(cc)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Email Subject */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Subject Line *</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Transmittal Message */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Transmittal Cover Note & Statutory Notice</label>
                  <textarea
                    rows={5}
                    value={emailMessage}
                    onChange={e => setEmailMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Attached Documents Manifest Box */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Attached Statutory Documents ({selectedDocs.length})
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-36 overflow-y-auto">
                    {selectedDocs.map(d => (
                      <div key={d.id} className="p-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-mono font-bold text-slate-800">{d.documentNumber}</span>
                          <span className="text-slate-600 truncate max-w-xs">{d.title}</span>
                        </div>
                        <span className="text-slate-400 text-[11px]">
                          {( (d.fileSizeBytes || 50000) / 1024 ).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pre-Flight Confirmation Checklist */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5 text-[11px] text-slate-600">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Pre-Flight Dispatch Authorisation Checklist:
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Authorised Staff: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>All {selectedOfficers.length} recipients have verified statutory accreditations on record</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>SHA-256 cryptographic hashes will be embedded in both email body and transmittal receipt</span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDispatchModalOpen(false)}
                    className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteBatchDispatch}
                    className="px-5 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    Confirm & Send Bulk Transmittal
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default BatchComplianceDispatchUtility;
