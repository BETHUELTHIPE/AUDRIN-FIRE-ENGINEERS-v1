import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  User, 
  LogIn, 
  Sparkles, 
  ChevronRight, 
  FileText, 
  Award, 
  Lock, 
  Layers,
  ArrowRight,
  AlertCircle,
  X
} from 'lucide-react';
import { VacancyRecord, SaqccTechnicianCategory } from '../../types';
import { useAudrinStore } from '../../services/store';
import { PROVINCES_LIST, SAQCC_CATEGORIES_LIST } from '../../data/careersData';
import { VacancyDetailModal } from './VacancyDetailModal';
import { TechnicianAuthModal } from './TechnicianAuthModal';
import { JobApplicationWizardModal } from './JobApplicationWizardModal';
import { TechnicianDashboard } from './TechnicianDashboard';
import { RecruitmentAdminDashboard } from './RecruitmentAdminDashboard';

export const CareersPage: React.FC = () => {
  const store = useAudrinStore();
  const vacancies = store.getVacancies();
  const activeTechnician = store.getActiveTechnician();
  const applications = activeTechnician ? store.getTechnicianApplications(activeTechnician.id) : [];

  // View mode
  const [viewMode, setViewMode] = useState<'vacancies' | 'portal' | 'admin'>('vacancies');

  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedJobType, setSelectedJobType] = useState('all');

  // Modals state
  const [selectedVacancyForDetail, setSelectedVacancyForDetail] = useState<VacancyRecord | null>(null);
  const [selectedVacancyForApply, setSelectedVacancyForApply] = useState<VacancyRecord | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<'login' | 'register'>('login');
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Filtered Vacancies
  const filteredVacancies = vacancies.filter(v => {
    if (selectedProvince !== 'all' && !v.location.toLowerCase().includes(selectedProvince.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'all' && !(v.requiredCategories || []).includes(selectedCategory as SaqccTechnicianCategory)) {
      return false;
    }
    if (selectedJobType !== 'all' && v.employmentType !== selectedJobType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = v.jobTitle.toLowerCase().includes(q);
      const matchRef = v.referenceNumber.toLowerCase().includes(q);
      const matchLoc = v.location.toLowerCase().includes(q);
      const matchDuty = v.duties.some(d => d.toLowerCase().includes(q));
      if (!matchTitle && !matchRef && !matchLoc && !matchDuty) return false;
    }
    return true;
  });

  const hasAppliedForVacancy = (vacancyId: string) => {
    return applications.some(a => a.vacancyId === vacancyId);
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-white py-10 px-4 sm:px-6 lg:px-8 space-y-10 animate-fadeIn">
      {/* Careers Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#C1A461] text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Audrin Fire Engineers Technical Careers &bull; SANS 10139 Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Careers & Technician Vacancies
          </h1>
          <p className="text-xs sm:text-sm text-white/60 max-w-2xl">
            Join South Africa's leading fire-detection engineering practice. We are recruiting qualified SAQCC Cablers, Installers, Designers, and Commissioners committed to statutory excellence under SANS 10139 and SANS 10400-T.
          </p>
        </div>

        {/* View Switcher & Auth Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setViewMode('vacancies')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                viewMode === 'vacancies'
                  ? 'bg-[#C1A461] text-black shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Open Vacancies ({vacancies.filter(v => !v.isClosed).length})
            </button>

            {activeTechnician ? (
              <button
                onClick={() => setViewMode('portal')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                  viewMode === 'portal'
                    ? 'bg-[#C1A461] text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>My Portal ({applications.length})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthDefaultTab('login');
                  setAuthModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-white/70 hover:text-white transition flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Candidate Sign In</span>
              </button>
            )}

            <button
              onClick={() => setViewMode('admin')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                viewMode === 'admin'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>HR Admin</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* VIEW: PORTAL */}
        {viewMode === 'portal' && activeTechnician && (
          <TechnicianDashboard
            technician={activeTechnician}
            onBrowseVacancies={() => setViewMode('vacancies')}
            onApplyVacancy={v => setSelectedVacancyForApply(v)}
          />
        )}

        {/* VIEW: ADMIN */}
        {viewMode === 'admin' && (
          <RecruitmentAdminDashboard
            onViewVacancyDetails={v => setSelectedVacancyForDetail(v)}
          />
        )}

        {/* VIEW: VACANCIES (DEFAULT) */}
        {viewMode === 'vacancies' && (
          <div className="space-y-8">
            {/* Leadership Statement Banner */}
            <div className="bg-gradient-to-r from-[#1c1c22] via-[#16161a] to-[#121215] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C1A461]/10 border border-[#C1A461]/30 text-[#C1A461] text-xs font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  <span>Leadership Commitment &bull; Russia Bethuel Moukangwe (Managing Director)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  High-Integrity Fire Detection & Life Safety Engineering
                </h2>
                <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
                  "At Audrin Fire Engineers, technical precision is non-negotiable. We equip our technicians with the highest-grade addressable test telemetry, continuous SAQCC development, and a culture centered purely on saving lives through SANS 10139 compliance."
                </p>
              </div>

              {!activeTechnician && (
                <div className="shrink-0 flex flex-col sm:flex-row items-stretch gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setAuthDefaultTab('register');
                      setAuthModalOpen(true);
                    }}
                    className="px-6 py-3 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#C1A461]/20 flex items-center justify-center gap-2"
                  >
                    <span>Register Candidate Profile</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Search and Filters Strip */}
            <div className="p-4 rounded-2xl bg-[#151518] border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search title, duties, ref..."
                  className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461] transition"
                />
              </div>

              {/* SAQCC Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461] transition"
                >
                  <option value="all">All SAQCC Categories</option>
                  {SAQCC_CATEGORIES_LIST.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Province Filter */}
              <div>
                <select
                  value={selectedProvince}
                  onChange={e => setSelectedProvince(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461] transition"
                >
                  <option value="all">All Locations / Provinces</option>
                  {PROVINCES_LIST.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Employment Type */}
              <div>
                <select
                  value={selectedJobType}
                  onChange={e => setSelectedJobType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#1a1a1f] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#C1A461] transition"
                >
                  <option value="all">All Employment Types</option>
                  <option value="Full-Time">Full-Time Permanent</option>
                  <option value="Contract">Fixed-Term Contract</option>
                  <option value="Apprenticeship">Apprenticeship / Trainee</option>
                </select>
              </div>
            </div>

            {/* Vacancies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVacancies.length === 0 ? (
                <div className="col-span-full p-12 rounded-2xl bg-[#151518] border border-white/10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5 mx-auto flex items-center justify-center text-white/40">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">No Vacancies Match Your Filters</h3>
                  <p className="text-xs text-white/50 max-w-md mx-auto">
                    Try adjusting your category or province filters, or clear search queries to view all advertised fire-engineering posts.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedProvince('all');
                      setSelectedJobType('all');
                    }}
                    className="text-xs text-[#C1A461] hover:underline font-bold"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredVacancies.map(vacancy => {
                  const applied = hasAppliedForVacancy(vacancy.id);
                  const isClosingSoon = () => {
                    const closing = new Date(vacancy.closingDate).getTime();
                    const now = Date.now();
                    const daysLeft = Math.ceil((closing - now) / (1000 * 60 * 60 * 24));
                    return daysLeft <= 14 && daysLeft >= 0;
                  };

                  return (
                    <div
                      key={vacancy.id}
                      className="p-6 rounded-2xl bg-[#151518] border border-white/10 flex flex-col justify-between space-y-5 hover:border-[#C1A461]/40 transition group"
                    >
                      <div className="space-y-4">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded bg-[#C1A461]/20 border border-[#C1A461]/40 text-[#C1A461] font-mono text-[11px] font-bold">
                            {vacancy.referenceNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 text-[10px] font-medium">
                            {vacancy.department}
                          </span>
                        </div>

                        {/* Title */}
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-[#D4BC7B] transition tracking-tight">
                            {vacancy.jobTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-[#C1A461]" />
                            <span>{vacancy.location}</span>
                            <span>&bull;</span>
                            <span>{vacancy.employmentType}</span>
                          </div>
                        </div>

                        {/* SAQCC Requirements Pills */}
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5">
                            Required SAQCC Categories:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {(vacancy.requiredCategories || []).map(c => (
                              <span key={c} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#C1A461] text-[10px] font-semibold uppercase">
                                {c.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Duties preview */}
                        <div className="space-y-1.5 pt-1">
                          {vacancy.duties.slice(0, 2).map((d, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-white/70 line-clamp-2">
                              <div className="w-1 h-1 rounded-full bg-[#C1A461] shrink-0 mt-2" />
                              <span className="line-clamp-1">{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer & Actions */}
                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-xs text-white/50">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-white/40" />
                            <span>Closes: <strong className="text-white/80">{vacancy.closingDate}</strong></span>
                          </div>
                          {isClosingSoon() && (
                            <span className="text-amber-400 font-bold text-[10px]">Closing Soon</span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => setSelectedVacancyForDetail(vacancy)}
                            className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold transition text-center"
                          >
                            View Job Spec
                          </button>

                          {applied ? (
                            <button
                              disabled
                              className="py-2.5 px-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Applied</span>
                            </button>
                          ) : vacancy.isClosed ? (
                            <button
                              disabled
                              className="py-2.5 px-3 rounded-xl bg-white/5 text-white/40 text-xs font-bold cursor-not-allowed"
                            >
                              Closed
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (!activeTechnician) {
                                  setAuthDefaultTab('login');
                                  setAuthModalOpen(true);
                                } else {
                                  setSelectedVacancyForApply(vacancy);
                                }
                              }}
                              className="py-2.5 px-3 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold transition flex items-center justify-center gap-1 shadow-md shadow-[#C1A461]/20"
                            >
                              <span>Apply Now</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* VACANCY DETAIL MODAL */}
      {selectedVacancyForDetail && (
        <VacancyDetailModal
          vacancy={selectedVacancyForDetail}
          onClose={() => setSelectedVacancyForDetail(null)}
          onApply={v => {
            setSelectedVacancyForDetail(null);
            if (!activeTechnician) {
              setAuthDefaultTab('login');
              setAuthModalOpen(true);
            } else {
              setSelectedVacancyForApply(v);
            }
          }}
          hasApplied={hasAppliedForVacancy(selectedVacancyForDetail.id)}
        />
      )}

      {/* TECHNICIAN AUTH MODAL */}
      <TechnicianAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authDefaultTab}
        onSuccess={() => {
          setViewMode('portal');
        }}
        onOpenPrivacyPolicy={() => setPrivacyModalOpen(true)}
      />

      {/* APPLICATION WIZARD MODAL */}
      {selectedVacancyForApply && (
        <JobApplicationWizardModal
          vacancy={selectedVacancyForApply}
          onClose={() => setSelectedVacancyForApply(null)}
          onSubmitted={() => {
            setViewMode('portal');
          }}
          onOpenAuth={() => {
            setAuthDefaultTab('login');
            setAuthModalOpen(true);
          }}
        />
      )}

      {/* POPIA PRIVACY POLICY MODAL */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#151518] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xl">
            <button
              onClick={() => setPrivacyModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-[#C1A461] font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>POPIA Candidate Privacy Notice</span>
            </div>
            <h3 className="text-lg font-bold text-white">Protection of Personal Information</h3>
            <div className="text-xs text-white/70 space-y-3 leading-relaxed max-h-60 overflow-y-auto custom-scrollbar pr-2">
              <p>
                Audrin Fire Engineers (Pty) Ltd respects candidate privacy and processes all submitted personal information, identity credentials, and SAQCC cards strictly under Section 11 of the Protection of Personal Information Act (POPIA No. 4 of 2013).
              </p>
              <p>
                Candidate data is stored securely in encrypted records and used exclusively for evaluating competence against SANS 10139 standards. Data will never be sold or transferred to third-party commercial entities.
              </p>
            </div>
            <button
              onClick={() => setPrivacyModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold transition"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
