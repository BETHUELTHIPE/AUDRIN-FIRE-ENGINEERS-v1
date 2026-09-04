import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Mail, 
  FileText, 
  Plus, 
  Edit3, 
  Eye, 
  ShieldCheck, 
  Download, 
  Trash2, 
  X, 
  ChevronRight, 
  AlertCircle, 
  Award,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Lock,
  Printer
} from 'lucide-react';
import { VacancyRecord, TechnicianJobApplication, TechnicianAccount, ApplicationStatus, SaqccTechnicianCategory } from '../../types';
import { useAudrinStore } from '../../services/store';
import { SAQCC_CATEGORIES_LIST, PROVINCES_LIST } from '../../data/careersData';
import { ApplicationReceiptModal } from './ApplicationReceiptModal';

interface RecruitmentAdminDashboardProps {
  onViewVacancyDetails?: (vacancy: VacancyRecord) => void;
}

export const RecruitmentAdminDashboard: React.FC<RecruitmentAdminDashboardProps> = () => {
  const store = useAudrinStore();

  const [activeTab, setActiveTab] = useState<'applicants' | 'vacancies' | 'emails' | 'popia'>('applicants');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVacancy, setFilterVacancy] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProvince, setFilterProvince] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Selected Application for Deep Review Drawer
  const [selectedApp, setSelectedApp] = useState<TechnicianJobApplication | null>(null);
  const [newInternalNote, setNewInternalNote] = useState('');

  // Interview Scheduler Modal
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('10:00');
  const [interviewLocation, setInterviewLocation] = useState('Audrin Fire HQ Boardroom (Pretoria)');
  const [interviewPanel, setInterviewPanel] = useState('Russia Bethuel Moukangwe (Managing Director / SAQCC Commissioner), Sipho Ndlovu (Lead Field Engineer)');
  const [interviewNotes, setInterviewNotes] = useState('Please bring your original SAQCC identification card, driver’s licence, and certified academic certificates.');

  // Create / Edit Vacancy Modal
  const [vacancyModalOpen, setVacancyModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<VacancyRecord | null>(null);
  const [vJobTitle, setVJobTitle] = useState('');
  const [vReferenceNumber, setVReferenceNumber] = useState('');
  const [vDepartment, setVDepartment] = useState('Technical Services');
  const [vLocation, setVLocation] = useState('Pretoria & Greater Gauteng');
  const [vEmploymentType, setVEmploymentType] = useState('Full-Time');
  const [vClosingDate, setVClosingDate] = useState('2026-10-31');
  const [vDutiesText, setVDutiesText] = useState('');
  const [vRequirementsText, setVRequirementsText] = useState('');
  const [vCertificationsText, setVCertificationsText] = useState('');
  const [vCategories, setVCategories] = useState<SaqccTechnicianCategory[]>(['commissioner', 'installer']);

  // Receipt Modal
  const [receiptApp, setReceiptApp] = useState<TechnicianJobApplication | null>(null);

  // Stats
  const stats = store.getRecruitmentStats();
  const vacancies = store.getVacancies();
  const allApplications = store.getJobApplications();
  const sentEmails = store.getSentEmails();

  // Filtered Applications
  const filteredApplications = allApplications.filter(app => {
    if (filterVacancy !== 'all' && app.vacancyId !== filterVacancy) return false;
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    if (filterProvince !== 'all' && app.profileSnapshot.province !== filterProvince) return false;
    if (filterCategory !== 'all') {
      if (!app.profileSnapshot.saqccCategories.includes(filterCategory as SaqccTechnicianCategory)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.applicantName.toLowerCase().includes(q);
      const matchEmail = app.applicantEmail.toLowerCase().includes(q);
      const matchRef = app.referenceNumber.toLowerCase().includes(q);
      const matchSaqcc = (app.profileSnapshot.saqccNumber || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchRef && !matchSaqcc) return false;
    }
    return true;
  });

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    store.updateApplicationStatus(appId, newStatus);
    if (selectedApp && selectedApp.id === appId) {
      const updated = store.getJobApplications().find(a => a.id === appId);
      if (updated) setSelectedApp(updated);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !newInternalNote.trim()) return;
    store.addApplicationNote(selectedApp.id, 'Russia Bethuel Moukangwe (Managing Director)', newInternalNote.trim());
    setNewInternalNote('');
    const updated = store.getJobApplications().find(a => a.id === selectedApp.id);
    if (updated) setSelectedApp(updated);
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !interviewDate) return;

    store.scheduleApplicationInterview(selectedApp.id, {
      scheduledDateTime: `${interviewDate}T${interviewTime || '09:00'}:00`,
      locationOrMeetingUrl: interviewLocation,
      interviewType: 'in_person',
      interviewers: interviewPanel.split(',').map(s => s.trim()).filter(Boolean),
      instructions: interviewNotes || 'Please bring your SAQCC card and ID document.',
      date: interviewDate,
      time: interviewTime,
      location: interviewLocation,
      notes: interviewNotes
    });

    setInterviewModalOpen(false);
    const updated = store.getJobApplications().find(a => a.id === selectedApp.id);
    if (updated) setSelectedApp(updated);
  };

  const handleOpenNewVacancy = () => {
    setEditingVacancy(null);
    setVJobTitle('');
    setVReferenceNumber(`AFE-VAC-${Math.floor(1000 + Math.random() * 9000)}`);
    setVDepartment('Technical Services');
    setVLocation('Pretoria & Greater Gauteng');
    setVEmploymentType('Full-Time');
    setVClosingDate('2026-11-30');
    setVDutiesText('Commission addressable fire detection loops per SANS 10139.\nPerform standby battery load calculations and sounder decibel audits.\nLiaise with clients for quarterly statutory logbook handovers.');
    setVRequirementsText('Valid SAQCC Fire certification (Installer / Commissioner).\nMinimum 3 years field experience on addressable fire alarm panels.\nValid Code 8 Driver’s Licence.');
    setVCertificationsText('SAQCC Fire 1475/Detection\nSANS 10139 Course\nFirst Aid & OHS');
    setVCategories(['commissioner', 'installer']);
    setVacancyModalOpen(true);
  };

  const handleOpenEditVacancy = (v: VacancyRecord) => {
    setEditingVacancy(v);
    setVJobTitle(v.jobTitle);
    setVReferenceNumber(v.referenceNumber);
    setVDepartment(v.department);
    setVLocation(v.location);
    setVEmploymentType(v.employmentType);
    setVClosingDate(v.closingDate);
    setVDutiesText(v.duties.join('\n'));
    setVRequirementsText(v.minimumRequirements.join('\n'));
    setVCertificationsText(v.requiredCertifications.join('\n'));
    setVCategories(v.requiredCategories || []);
    setVacancyModalOpen(true);
  };

  const handleSaveVacancy = (e: React.FormEvent) => {
    e.preventDefault();
    const duties = vDutiesText.split('\n').map(s => s.trim()).filter(Boolean);
    const requirements = vRequirementsText.split('\n').map(s => s.trim()).filter(Boolean);
    const certs = vCertificationsText.split('\n').map(s => s.trim()).filter(Boolean);

    if (editingVacancy) {
      store.updateVacancy(editingVacancy.id, {
        jobTitle: vJobTitle,
        department: vDepartment,
        location: vLocation,
        employmentType: vEmploymentType as any,
        closingDate: vClosingDate,
        duties,
        minimumRequirements: requirements,
        requiredCertifications: certs,
        requiredCategories: vCategories
      });
    } else {
      store.addVacancy({
        jobTitle: vJobTitle,
        referenceNumber: vReferenceNumber,
        department: vDepartment,
        location: vLocation,
        province: vLocation.includes('Gauteng') || vLocation.includes('Pretoria') || vLocation.includes('Centurion') || vLocation.includes('Johannesburg') ? 'Gauteng' : 'National',
        employmentType: vEmploymentType as any,
        closingDate: vClosingDate,
        isPublished: true,
        isClosed: false,
        duties,
        minimumRequirements: requirements,
        requiredCertifications: certs,
        requiredCategories: vCategories,
        screeningQuestions: [
          {
            id: 'sq_saqcc',
            question: 'Are you currently registered with SAQCC Fire in good standing?',
            type: 'yes_no',
            required: true
          },
          {
            id: 'sq_exp',
            question: 'How many years of direct SANS 10139 commissioning experience do you hold?',
            type: 'years_number',
            required: true
          }
        ]
      });
    }
    setVacancyModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Reference', 'Applicant Name', 'Email', 'Phone', 'Vacancy Ref', 'Job Title', 'Status', 'SAQCC Number', 'Experience Years', 'Province', 'Driver Licence', 'Submitted At'];
    const rows = filteredApplications.map(a => [
      a.referenceNumber,
      `"${a.applicantName}"`,
      a.applicantEmail,
      a.applicantPhone,
      a.vacancyRef,
      `"${a.jobTitle}"`,
      a.status,
      a.profileSnapshot.saqccNumber || 'N/A',
      a.profileSnapshot.yearsOfExperience,
      a.profileSnapshot.province,
      a.profileSnapshot.driverLicense,
      a.submittedAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audrin_candidates_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#1c1c22] via-[#16161a] to-[#121215] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#C1A461] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>SAQCC Technical Recruitment & HR Ops Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Recruitment & Candidate Management
          </h1>
          <p className="text-xs text-white/60 max-w-xl mt-1">
            Review technician applications, verify SAQCC accreditations, schedule technical interviews, and publish SANS 10139 compliant job adverts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenNewVacancy}
            className="px-5 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold transition shadow-lg shadow-[#C1A461]/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Vacancy</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-1">
          <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Total Applicants</div>
          <div className="text-2xl font-bold text-white">{stats.totalApplicants}</div>
          <div className="text-[10px] text-white/40">Verified POPIA Registrations</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-1">
          <div className="text-[11px] font-bold text-[#C1A461] uppercase tracking-wider">SAQCC Reg %</div>
          <div className="text-2xl font-bold text-[#C1A461]">{stats.saqccCertifiedPercent}%</div>
          <div className="text-[10px] text-white/40">Accredited Fire Technicians</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-1">
          <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Shortlisted</div>
          <div className="text-2xl font-bold text-purple-300">{stats.shortlisted}</div>
          <div className="text-[10px] text-white/40">Technical Vetting Passed</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-1">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Interviews Set</div>
          <div className="text-2xl font-bold text-emerald-300">{stats.interviewsScheduled}</div>
          <div className="text-[10px] text-white/40">Panel Reviews Scheduled</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-1">
          <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Active Adverts</div>
          <div className="text-2xl font-bold text-white">{stats.activeVacancies}</div>
          <div className="text-[10px] text-white/40">Published Positions</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('applicants')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'applicants'
              ? 'bg-[#C1A461] text-black shadow-md'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Applicant Pipeline ({filteredApplications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vacancies')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'vacancies'
              ? 'bg-[#C1A461] text-black shadow-md'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Advertised Vacancies ({vacancies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('emails')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'emails'
              ? 'bg-[#C1A461] text-black shadow-md'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Automated Email Dispatch Log ({sentEmails.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('popia')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'popia'
              ? 'bg-[#C1A461] text-black shadow-md'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>POPIA & Statutory Compliance</span>
        </button>
      </div>

      {/* TAB: APPLICANTS PIPELINE */}
      {activeTab === 'applicants' && (
        <div className="space-y-6">
          {/* Filters Row */}
          <div className="p-4 rounded-2xl bg-[#151518] border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search candidate / SAQCC..."
                className="w-full pl-10 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461]"
              />
            </div>

            {/* Vacancy filter */}
            <div>
              <select
                value={filterVacancy}
                onChange={e => setFilterVacancy(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
              >
                <option value="all">All Vacancies</option>
                {vacancies.map(v => (
                  <option key={v.id} value={v.id}>{v.jobTitle} ({v.referenceNumber})</option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
              >
                <option value="all">All Pipeline Stages</option>
                <option value="submitted">Submitted (New)</option>
                <option value="under_review">Under Review</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="successful">Successful</option>
                <option value="unsuccessful">Unsuccessful</option>
              </select>
            </div>

            {/* Category filter */}
            <div>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
              >
                <option value="all">All SAQCC Categories</option>
                <option value="commissioner">SAQCC Commissioner</option>
                <option value="designer">SAQCC Designer</option>
                <option value="installer">SAQCC Installer</option>
                <option value="servicing_technician">SAQCC Servicing Tech</option>
                <option value="cabler">SAQCC Cabler</option>
              </select>
            </div>

            {/* Province filter */}
            <div>
              <select
                value={filterProvince}
                onChange={e => setFilterProvince(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
              >
                <option value="all">All Provinces</option>
                {PROVINCES_LIST.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="rounded-2xl bg-[#151518] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121215] border-b border-white/10 text-white/50 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Candidate & Contact</th>
                    <th className="p-4">Applied Vacancy</th>
                    <th className="p-4">SAQCC & Years</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Submitted</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-white/40">
                        No candidate applications found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map(app => (
                      <tr key={app.id} className="hover:bg-white/[0.02] transition">
                        <td className="p-4">
                          <div className="font-bold text-white">{app.applicantName}</div>
                          <div className="text-[11px] text-white/50">{app.applicantEmail} &bull; {app.applicantPhone}</div>
                          <div className="text-[10px] text-white/40">{app.profileSnapshot.province}</div>
                        </td>

                        <td className="p-4">
                          <div className="font-medium text-white">{app.jobTitle}</div>
                          <div className="text-[10px] font-mono text-[#C1A461]">{app.vacancyRef}</div>
                        </td>

                        <td className="p-4">
                          <div className="font-mono text-[11px] text-[#C1A461] font-bold">
                            {app.profileSnapshot.saqccNumber || 'No SAQCC Number'}
                          </div>
                          <div className="text-[11px] text-white/60">
                            {app.profileSnapshot.yearsOfExperience} yrs exp &bull; {app.profileSnapshot.driverLicense}
                          </div>
                        </td>

                        <td className="p-4">
                          <select
                            value={app.status}
                            onChange={e => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                            className="px-2.5 py-1 bg-[#1a1a1f] border border-white/10 rounded-lg text-[11px] font-bold text-white focus:outline-none focus:border-[#C1A461]"
                          >
                            <option value="submitted">Submitted</option>
                            <option value="under_review">Under Review</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interview_scheduled">Interview Scheduled</option>
                            <option value="successful">Successful</option>
                            <option value="unsuccessful">Unsuccessful</option>
                          </select>
                        </td>

                        <td className="p-4 text-white/50 text-[11px]">
                          {new Date(app.submittedAt).toLocaleDateString('en-ZA')}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="px-3 py-1.5 rounded-lg bg-[#C1A461]/10 hover:bg-[#C1A461]/20 border border-[#C1A461]/30 text-[#C1A461] text-xs font-bold transition flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Review</span>
                            </button>
                            <button
                              onClick={() => setReceiptApp(app)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
                              title="Print SANS 10139 Receipt"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: VACANCIES */}
      {activeTab === 'vacancies' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-white/60">
              Manage published job advertisements, statutory requirements, and closing dates.
            </p>
            <button
              onClick={handleOpenNewVacancy}
              className="px-4 py-2 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Vacancy
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.map(v => {
              const vApps = allApplications.filter(a => a.vacancyId === v.id);
              return (
                <div
                  key={v.id}
                  className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded bg-[#C1A461]/20 border border-[#C1A461]/40 text-[#C1A461] font-mono text-xs font-bold">
                        {v.referenceNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${v.isClosed ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        {v.isClosed ? 'Closed' : 'Active'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{v.jobTitle}</h3>
                      <p className="text-xs text-white/50">{v.department} &bull; {v.location}</p>
                    </div>

                    <div className="text-xs text-white/70 space-y-1">
                      <div>Closing Date: <strong className="text-white">{v.closingDate}</strong></div>
                      <div>Applicants Received: <strong className="text-[#C1A461]">{vApps.length} Candidates</strong></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => store.toggleVacancyClosed(v.id)}
                      className="text-xs text-white/60 hover:text-white underline"
                    >
                      {v.isClosed ? 'Reopen Vacancy' : 'Close Vacancy'}
                    </button>

                    <button
                      onClick={() => handleOpenEditVacancy(v)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Ad</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: EMAILS DISPATCH LOG */}
      {activeTab === 'emails' && (
        <div className="space-y-4">
          <p className="text-xs text-white/60">
            Audit log of all system emails dispatched to candidates (Verifications, Confirmations, Interview Invitations, Status Updates).
          </p>

          <div className="rounded-2xl bg-[#151518] border border-white/10 overflow-hidden">
            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
              {sentEmails.map(mail => (
                <div key={mail.id} className="p-5 space-y-2 hover:bg-white/[0.01] transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#C1A461]" />
                      <span className="font-bold text-white">{mail.subject}</span>
                    </div>
                    <span className="text-white/40 font-mono text-[11px]">
                      {new Date(mail.sentAt).toLocaleString('en-ZA')}
                    </span>
                  </div>

                  <div className="text-[11px] text-white/50">
                    Recipient: <strong className="text-white">{mail.recipientName}</strong> &lt;{mail.recipientEmail}&gt;
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-white/70 whitespace-pre-wrap leading-relaxed">
                    {mail.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: POPIA COMPLIANCE */}
      {activeTab === 'popia' && (
        <div className="p-8 rounded-2xl bg-[#151518] border border-white/10 space-y-6">
          <div className="flex items-center gap-2 text-[#C1A461] font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5" />
            <span>POPIA & Candidate Privacy Compliance Framework</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-white/70 leading-relaxed">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-sm">Lawful Processing Conditions</h4>
              <p>
                In compliance with the South African <strong>Protection of Personal Information Act (POPIA No. 4 of 2013)</strong>, all candidate CVs, SAQCC cards, identity numbers, and driver's licences are processed solely for determining technical suitability and regulatory compliance under SANS 10139.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-sm">Candidate Rights & Retention</h4>
              <p>
                Candidates retain full rights to request record inspection, profile updates, or formal data anonymization/erasure. Records are preserved in accordance with statutory labour and SAQCC auditing requirements.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#C1A461]/10 border border-[#C1A461]/30 text-xs text-[#D4BC7B]">
            Information Officer: <strong>Russia Bethuel Moukangwe (Managing Director / SAQCC Fire Commissioner)</strong> &bull; Compliance Registered
          </div>
        </div>
      )}

      {/* APPLICANT REVIEW DRAWER / MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#151518] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-[#1c1c22] border-b border-white/10 p-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#C1A461] font-bold">
                    {selectedApp.referenceNumber}
                  </span>
                  <span className="text-white/30 text-xs">&bull;</span>
                  <span className="text-xs text-white/50">{selectedApp.jobTitle}</span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedApp.applicantName}</h2>
                <div className="text-xs text-white/60 flex items-center gap-3 mt-1">
                  <span>{selectedApp.applicantEmail}</span>
                  <span>&bull;</span>
                  <span>{selectedApp.applicantPhone}</span>
                  <span>&bull;</span>
                  <span>{selectedApp.profileSnapshot.province}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              {/* Quick Actions & Status */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white/70">Stage:</span>
                  <select
                    value={selectedApp.status}
                    onChange={e => handleStatusChange(selectedApp.id, e.target.value as ApplicationStatus)}
                    className="px-3 py-1.5 bg-[#1a1a1f] border border-[#C1A461]/40 rounded-lg text-xs font-bold text-[#C1A461]"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview_scheduled">Interview Scheduled</option>
                    <option value="successful">Successful (Offered)</option>
                    <option value="unsuccessful">Unsuccessful</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setInterviewDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
                      setInterviewModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Technical Interview</span>
                  </button>

                  <button
                    onClick={() => setReceiptApp(selectedApp)}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Official Receipt</span>
                  </button>
                </div>
              </div>

              {/* SAQCC Competency & Profile Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">SAQCC Registration</span>
                  <div className="font-mono text-sm font-bold text-[#C1A461]">
                    {selectedApp.profileSnapshot.saqccNumber || 'Not Specified'}
                  </div>
                  <div className="text-[11px] text-white/60">
                    Expiry: {selectedApp.profileSnapshot.saqccExpiryDate || 'N/A'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Field Experience</span>
                  <div className="text-sm font-bold text-white">
                    {selectedApp.profileSnapshot.yearsOfExperience} Years Experience
                  </div>
                  <div className="text-[11px] text-white/60">
                    Driver Licence: {selectedApp.profileSnapshot.driverLicense}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Availability</span>
                  <div className="text-sm font-bold text-emerald-400">
                    {selectedApp.profileSnapshot.availability || 'Immediate'}
                  </div>
                  <div className="text-[11px] text-white/60 truncate">
                    Pref: {selectedApp.profileSnapshot.preferredLocations.join(', ')}
                  </div>
                </div>
              </div>

              {/* SANS 10139 Experience Summary */}
              {selectedApp.profileSnapshot.sans10139ExperienceSummary && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1 text-xs">
                  <span className="font-bold text-[#C1A461] uppercase tracking-wider text-[10px]">
                    SANS 10139 & Panel Background Narrative
                  </span>
                  <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                    {selectedApp.profileSnapshot.sans10139ExperienceSummary}
                  </p>
                </div>
              )}

              {/* Screening Question Responses */}
              {selectedApp.answers.length > 0 && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5 text-xs">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px]">
                    Screening Assessment Responses
                  </span>
                  <div className="space-y-2">
                    {selectedApp.answers.map((ans, idx) => (
                      <div key={idx} className="p-2.5 bg-white/5 rounded-lg">
                        <div className="text-white/60 text-[11px]">{ans.questionText}</div>
                        <div className="text-white font-bold mt-0.5">&bull; {ans.answer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Documents List */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <span className="font-bold text-white uppercase tracking-wider text-[10px]">
                  Uploaded Candidate Documents ({((selectedApp.profileSnapshot as any).documents || []).length})
                </span>

                {((selectedApp.profileSnapshot as any).documents || []).length === 0 ? (
                  <div className="text-xs text-white/40">No documents attached.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {((selectedApp.profileSnapshot as any).documents || []).map((doc: any) => (
                      <div key={doc.id} className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-[#C1A461] shrink-0" />
                          <div className="truncate">
                            <div className="font-bold text-white truncate">{doc.name}</div>
                            <div className="text-[10px] text-white/40 uppercase">{doc.type.replace('_', ' ')} &bull; {(doc.fileSizeBytes / (1024 * 1024)).toFixed(2)}MB</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold ml-2">Clean</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Internal Notes Timeline */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <span className="font-bold text-white uppercase tracking-wider text-[10px]">
                  Internal Interviewer & Review Notes ({selectedApp.internalNotes.length})
                </span>

                <div className="space-y-2">
                  {selectedApp.internalNotes.map(note => (
                    <div key={note.id} className="p-3 rounded-lg bg-white/5 text-xs space-y-1">
                      <div className="flex justify-between text-[10px] text-white/40">
                        <strong className="text-[#C1A461]">{note.author}</strong>
                        <span>{new Date(note.createdAt).toLocaleString('en-ZA')}</span>
                      </div>
                      <p className="text-white/80">{(note as any).content || (note as any).text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newInternalNote}
                    onChange={e => setNewInternalNote(e.target.value)}
                    placeholder="Add technical evaluation note (e.g. verified SAQCC registry, recommended for panel interview)..."
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#C1A461]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold rounded-lg transition"
                  >
                    Add Note
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERVIEW SCHEDULER MODAL */}
      {interviewModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#151518] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl">
            <button
              onClick={() => setInterviewModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Schedule Technical SANS 10139 Interview</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                Interview for {selectedApp.applicantName}
              </h3>
              <p className="text-xs text-white/60">Position: {selectedApp.jobTitle}</p>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">Interview Date *</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={e => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/70 mb-1">Time (SAST) *</label>
                  <input
                    type="time"
                    required
                    value={interviewTime}
                    onChange={e => setInterviewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Location / Format *</label>
                <input
                  type="text"
                  required
                  value={interviewLocation}
                  onChange={e => setInterviewLocation(e.target.value)}
                  placeholder="e.g. Pretoria Head Office Boardroom or Microsoft Teams"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Interview Panel Members *</label>
                <input
                  type="text"
                  required
                  value={interviewPanel}
                  onChange={e => setInterviewPanel(e.target.value)}
                  placeholder="Names separated by comma"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Candidate Preparation Instructions</label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={e => setInterviewNotes(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
                />
              </div>

              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-300">
                An automated email invitation containing calendar details will be sent directly to <strong>{selectedApp.applicantEmail}</strong>.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInterviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white/70 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold transition"
                >
                  Dispatch Invitation & Update Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT VACANCY MODAL */}
      {vacancyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#151518] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <button
              onClick={() => setVacancyModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#C1A461] font-bold text-xs uppercase tracking-wider">
              <Briefcase className="w-4 h-4" />
              <span>{editingVacancy ? 'Edit Advertised Vacancy' : 'Create New Fire Technician Vacancy'}</span>
            </div>

            <form onSubmit={handleSaveVacancy} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-white/70 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={vJobTitle}
                    onChange={e => setVJobTitle(e.target.value)}
                    placeholder="e.g. Senior Fire Detection Technician"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-white/70 mb-1">Reference Number *</label>
                  <input
                    type="text"
                    required
                    value={vReferenceNumber}
                    onChange={e => setVReferenceNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#C1A461]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-white/70 mb-1">Department</label>
                  <input
                    type="text"
                    value={vDepartment}
                    onChange={e => setVDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-white/70 mb-1">Location</label>
                  <input
                    type="text"
                    value={vLocation}
                    onChange={e => setVLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-white/70 mb-1">Closing Date</label>
                  <input
                    type="date"
                    value={vClosingDate}
                    onChange={e => setVClosingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-white/70 mb-1">Duties & Responsibilities (1 per line)</label>
                <textarea
                  rows={3}
                  value={vDutiesText}
                  onChange={e => setVDutiesText(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
                />
              </div>

              <div>
                <label className="block font-bold text-white/70 mb-1">Minimum Requirements (1 per line)</label>
                <textarea
                  rows={3}
                  value={vRequirementsText}
                  onChange={e => setVRequirementsText(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
                />
              </div>

              <div>
                <label className="block font-bold text-white/70 mb-1">Required Certifications (1 per line)</label>
                <textarea
                  rows={2}
                  value={vCertificationsText}
                  onChange={e => setVCertificationsText(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setVacancyModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-white/70 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black font-bold transition"
                >
                  Save & Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {receiptApp && (
        <ApplicationReceiptModal
          application={receiptApp}
          onClose={() => setReceiptApp(null)}
        />
      )}
    </div>
  );
};
