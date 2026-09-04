import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Award, 
  Mail, 
  Eye, 
  FileCheck, 
  AlertCircle, 
  LogOut, 
  ChevronRight,
  Printer
} from 'lucide-react';
import { TechnicianAccount, TechnicianJobApplication, VacancyRecord } from '../../types';
import { useAudrinStore } from '../../services/store';
import { TechnicianProfileEditor } from './TechnicianProfileEditor';
import { ApplicationReceiptModal } from './ApplicationReceiptModal';

interface TechnicianDashboardProps {
  technician: TechnicianAccount;
  onBrowseVacancies: () => void;
  onApplyVacancy: (vacancy: VacancyRecord) => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  technician,
  onBrowseVacancies,
  onApplyVacancy
}) => {
  const store = useAudrinStore();
  const [activeTab, setActiveTab] = useState<'applications' | 'profile' | 'messages'>('applications');
  const [selectedReceiptApp, setSelectedReceiptApp] = useState<TechnicianJobApplication | null>(null);

  const applications = store.getTechnicianApplications(technician.id);
  const sentEmails = store.getSentEmails().filter(e => e.recipientEmail.toLowerCase() === technician.email.toLowerCase());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'under_review':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'shortlisted':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'interview_scheduled':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'successful':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'unsuccessful':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      default:
        return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'submitted': return 1;
      case 'under_review': return 2;
      case 'shortlisted': return 3;
      case 'interview_scheduled': return 4;
      case 'successful': return 5;
      case 'unsuccessful': return 0;
      default: return 1;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1c1c22] via-[#16161a] to-[#121215] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#C1A461] text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Technician Candidate Portal &bull; SANS 10139 Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome, {technician.fullName}
          </h1>
          <p className="text-xs text-white/60 max-w-xl">
            Track your job applications, view interview schedules, and keep your SAQCC fire accreditation records current.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onBrowseVacancies}
            className="px-5 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold transition shadow-lg shadow-[#C1A461]/20 flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse Active Vacancies</span>
          </button>
          <button
            onClick={() => store.logoutTechnician()}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'applications'
              ? 'bg-[#C1A461] text-black shadow-md'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'profile'
              ? 'bg-[#C1A461] text-black shadow-md'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>SAQCC Profile & Documents</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'messages'
              ? 'bg-[#C1A461] text-black shadow-md'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email & Dispatch Log ({sentEmails.length})</span>
        </button>
      </div>

      {/* TAB: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {applications.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#151518] border border-white/10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-white/40">
                <Briefcase className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No Submitted Applications Yet</h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto">
                  You have not submitted an application yet. Explore open technician vacancies across Pretoria and Gauteng.
                </p>
              </div>
              <button
                onClick={onBrowseVacancies}
                className="px-6 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold transition inline-flex items-center gap-2"
              >
                <span>Browse Vacancies</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map(app => {
                const stepNum = getStatusStep(app.status);
                return (
                  <div
                    key={app.id}
                    className="p-6 rounded-2xl bg-[#151518] border border-white/10 space-y-5 hover:border-white/20 transition"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-[#C1A461] font-bold">
                            {app.referenceNumber}
                          </span>
                          <span className="text-white/30 text-xs">&bull;</span>
                          <span className="text-xs text-white/50">
                            Applied on {new Date(app.submittedAt).toLocaleDateString('en-ZA')}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight">
                          {app.jobTitle}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => setSelectedReceiptApp(app)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
                          title="View & Print Official SANS 10139 Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Pipeline */}
                    {app.status !== 'Unsuccessful' ? (
                      <div className="pt-2">
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { num: 1, label: 'Submitted' },
                            { num: 2, label: 'In Review' },
                            { num: 3, label: 'Shortlisted' },
                            { num: 4, label: 'Interview' }
                          ].map(s => {
                            const isDone = stepNum >= s.num;
                            const isCurrent = stepNum === s.num;
                            return (
                              <div key={s.num} className="space-y-1.5">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    isDone ? 'bg-[#C1A461]' : 'bg-white/10'
                                  }`}
                                />
                                <div className="flex items-center gap-1 text-[11px]">
                                  {isDone ? (
                                    <CheckCircle2 className="w-3 h-3 text-[#C1A461]" />
                                  ) : (
                                    <div className="w-3 h-3 rounded-full border border-white/20" />
                                  )}
                                  <span className={isCurrent ? 'font-bold text-white' : 'text-white/40'}>
                                    {s.label}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Position closed or candidate pool fulfilled. We invite you to apply for future vacancies.</span>
                      </div>
                    )}

                    {/* Interview Details Card if scheduled */}
                    {app.interviewDetails && (
                      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-3">
                        <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
                          <Calendar className="w-4 h-4" />
                          <span>Official Technical Interview Scheduled</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white/80">
                          <div>
                            <span className="text-white/40 block">Date & Time:</span>
                            <strong className="text-white">
                              {app.interviewDetails.scheduledDateTime 
                                ? new Date(app.interviewDetails.scheduledDateTime).toLocaleString('en-ZA') 
                                : `${app.interviewDetails.date || ''} ${app.interviewDetails.time || ''}`}
                            </strong>
                          </div>
                          <div>
                            <span className="text-white/40 block">Venue / Format:</span>
                            <span className="text-white">{app.interviewDetails.locationOrMeetingUrl || app.interviewDetails.location}</span>
                          </div>
                          <div>
                            <span className="text-white/40 block">Interview Panel:</span>
                            <span className="text-[#C1A461]">{app.interviewDetails.interviewers.join(', ')}</span>
                          </div>
                        </div>
                        {(app.interviewDetails.instructions || app.interviewDetails.notes) && (
                          <div className="text-[11px] text-white/60 pt-2 border-t border-purple-500/20">
                            <strong>Candidate Instructions:</strong> {app.interviewDetails.instructions || app.interviewDetails.notes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer / Snapshot details */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-white/40 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-4">
                        <span>Vacancy Ref: <strong className="text-white/70">{app.vacancyRef}</strong></span>
                        <span>SAQCC Reg: <strong className="text-white/70">{app.profileSnapshot.saqccNumber || 'N/A'}</strong></span>
                      </div>
                      <button
                        onClick={() => setSelectedReceiptApp(app)}
                        className="text-[#C1A461] hover:underline font-mono text-[11px]"
                      >
                        View SANS 10139 Submission Hash & Receipt &rarr;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: PROFILE */}
      {activeTab === 'profile' && (
        <TechnicianProfileEditor technician={technician} />
      )}

      {/* TAB: MESSAGES & DISPATCH HISTORY */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="text-xs text-white/60">
            Audit history of automated confirmation emails and candidate notices sent to <strong>{technician.email}</strong>.
          </div>

          {sentEmails.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#151518] border border-white/10 text-center text-xs text-white/40">
              No emails recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {sentEmails.map(mail => (
                <div
                  key={mail.id}
                  className="p-5 rounded-2xl bg-[#151518] border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Mail className="w-4 h-4 text-[#C1A461]" />
                      <span>{mail.subject}</span>
                    </div>
                    <span className="text-[11px] text-white/40 font-mono">
                      {new Date(mail.sentAt).toLocaleString('en-ZA')}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-white/80 whitespace-pre-wrap font-mono leading-relaxed">
                    {mail.body}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceiptApp && (
        <ApplicationReceiptModal
          application={selectedReceiptApp}
          onClose={() => setSelectedReceiptApp(null)}
        />
      )}
    </div>
  );
};
