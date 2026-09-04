import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle, 
  FileText, 
  Award, 
  Upload, 
  Mail, 
  ExternalLink,
  Lock,
  Sparkles,
  QrCode
} from 'lucide-react';
import { VacancyRecord, TechnicianAccount, TechnicianJobApplication, DocumentUploadRecord } from '../../types';
import { useAudrinStore } from '../../services/store';

interface JobApplicationWizardModalProps {
  vacancy: VacancyRecord;
  onClose: () => void;
  onSubmitted: (application: TechnicianJobApplication) => void;
  onOpenAuth: () => void;
}

export const JobApplicationWizardModal: React.FC<JobApplicationWizardModalProps> = ({
  vacancy,
  onClose,
  onSubmitted,
  onOpenAuth
}) => {
  const store = useAudrinStore();
  const technician = store.getActiveTechnician();

  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [coverNote, setCoverNote] = useState('');
  const [accuracyConfirmed, setAccuracyConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdApp, setCreatedApp] = useState<TechnicianJobApplication | null>(null);

  // Quick document upload state if candidate is missing CV
  const [quickDocType, setQuickDocType] = useState<'cv' | 'saqcc_certificate'>('cv');
  const [quickUploadMsg, setQuickUploadMsg] = useState('');

  if (!technician) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-md bg-[#151518] border border-white/10 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 rounded-2xl bg-[#C1A461]/10 border border-[#C1A461]/30 mx-auto flex items-center justify-center text-[#C1A461]">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Technician Sign In Required</h3>
            <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
              To apply for <strong className="text-white">{vacancy.jobTitle}</strong>, please create a registered technician account or sign in.
            </p>
          </div>
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#C1A461]/20"
            >
              Sign In / Register Account
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cvDoc = technician.documents.find(d => d.type === 'cv');
  const saqccDoc = technician.documents.find(d => d.type === 'saqcc_certificate');

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleQuickUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    store.uploadTechnicianDocument(technician.id, {
      name: file.name,
      type: quickDocType,
      fileSizeBytes: file.size,
      mimeType: file.type || 'application/pdf',
      malwareScanStatus: 'clean'
    });

    setQuickUploadMsg(`"${file.name}" uploaded successfully.`);
    setTimeout(() => setQuickUploadMsg(''), 3000);
    e.target.value = '';
  };

  const validateStep1 = () => {
    if (!technician.isEmailVerified) {
      setErrorMessage('Your email must be verified before submitting an application.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const validateStep2 = () => {
    for (const sq of vacancy.screeningQuestions) {
      if (sq.required && (!answers[sq.id] || !answers[sq.id].trim())) {
        setErrorMessage(`Please answer the required question: "${sq.question}"`);
        return false;
      }
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmitApplication = () => {
    setErrorMessage('');
    if (!accuracyConfirmed) {
      setErrorMessage('You must confirm the Declaration of Accuracy and SANS 10139 Compliance.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const answersList = vacancy.screeningQuestions.map(sq => ({
        questionId: sq.id,
        questionText: sq.question,
        answer: answers[sq.id] || 'Not answered'
      }));

      const res = store.submitJobApplication({
        vacancyId: vacancy.id,
        applicantId: technician.id,
        answers: answersList,
        accuracyConfirmed: true
      });

      setSubmitting(false);
      if (res.success && res.application) {
        setCreatedApp(res.application);
        setStep(5);
        onSubmitted(res.application);
      } else {
        setErrorMessage(res.message);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#151518] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header with Step indicator */}
        <div className="bg-gradient-to-r from-[#1c1c22] to-[#121215] border-b border-white/10 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[#C1A461] mb-1 font-mono text-xs uppercase tracking-wider font-bold">
            <span>Vacancy Reference: {vacancy.referenceNumber}</span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            Application: {vacancy.jobTitle}
          </h2>

          {/* Steps Progress Bar */}
          {step < 5 && (
            <div className="flex items-center gap-2 mt-4">
              {[
                { num: 1, label: 'Candidate Profile' },
                { num: 2, label: 'Screening Questions' },
                { num: 3, label: 'Cover Note' },
                { num: 4, label: 'Declaration' }
              ].map(s => (
                <div key={s.num} className="flex-1">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step >= s.num ? 'bg-[#C1A461]' : 'bg-white/10'
                    }`}
                  />
                  <div className="text-[10px] text-white/50 mt-1 truncate">
                    Step {s.num}: {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: CANDIDATE PROFILE VERIFICATION */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#C1A461]">
                  Applicant Snapshot
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-white/40 block">Full Name:</span>
                    <strong className="text-white">{technician.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-white/40 block">Contact:</span>
                    <span className="text-white">{technician.email} | {technician.cellphone}</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Location:</span>
                    <span className="text-white">{technician.province} ({technician.residentialAddress || 'Address on file'})</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">SAQCC Registration:</span>
                    <span className="text-[#C1A461] font-mono font-bold">
                      {technician.saqccNumber || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Experience:</span>
                    <span className="text-white">{technician.yearsOfExperience} Years Field Experience</span>
                  </div>
                  <div>
                    <span className="text-white/40 block">Driver’s Licence:</span>
                    <span className="text-white">{technician.driverLicense}</span>
                  </div>
                </div>
              </div>

              {/* Document Status */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center justify-between">
                  <span>Attached Profile Documents ({technician.documents.length})</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#C1A461]" />
                      <span>Curriculum Vitae (CV)</span>
                    </div>
                    {cvDoc ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Attached ({cvDoc.name})
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium">Missing - Recommended</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 text-xs">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#C1A461]" />
                      <span>SAQCC Card / Certificate</span>
                    </div>
                    {saqccDoc ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Attached ({saqccDoc.name})
                      </span>
                    ) : (
                      <span className="text-white/40">Optional at submission</span>
                    )}
                  </div>
                </div>

                {/* Quick Upload Form if Missing */}
                {!cvDoc && (
                  <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                    <label className="flex-1 py-2 px-3 bg-[#C1A461]/10 hover:bg-[#C1A461]/20 border border-[#C1A461]/40 border-dashed rounded-lg text-[#C1A461] text-xs font-bold text-center cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5 inline mr-1" />
                      <span>Quick Attach CV (PDF/Doc)</span>
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleQuickUpload} className="hidden" />
                    </label>
                  </div>
                )}
                {quickUploadMsg && (
                  <div className="text-[11px] text-emerald-400">{quickUploadMsg}</div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: SCREENING QUESTIONS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-xs text-white/60">
                Please provide accurate technical answers for the vacancy screening assessment:
              </div>

              {vacancy.screeningQuestions.map((sq, idx) => (
                <div key={sq.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
                  <label className="block text-xs font-bold text-white/90">
                    <span className="text-[#C1A461] font-mono mr-1.5">{idx + 1}.</span>
                    {sq.question}
                    {sq.required && <span className="text-red-400 ml-1">*</span>}
                  </label>

                  {sq.type === 'yes_no' && (
                    <div className="flex gap-3">
                      {['Yes', 'No'].map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleAnswerChange(sq.id, opt)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold border transition ${
                            answers[sq.id] === opt
                              ? 'bg-[#C1A461] text-black border-[#C1A461]'
                              : 'bg-white/5 text-white/70 border-white/10 hover:border-white/20'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {sq.type === 'years_number' && (
                    <input
                      type="number"
                      min={0}
                      max={40}
                      value={answers[sq.id] || ''}
                      onChange={e => handleAnswerChange(sq.id, e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#C1A461]"
                    />
                  )}

                  {sq.type === 'text' && (
                    <textarea
                      rows={2}
                      value={answers[sq.id] || ''}
                      onChange={e => handleAnswerChange(sq.id, e.target.value)}
                      placeholder="Enter detailed technical background..."
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-[#C1A461]"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: COVER NOTE */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/80 uppercase tracking-wider mb-1.5">
                  Applicant Motivational Note / Key Achievements (Optional)
                </label>
                <textarea
                  rows={5}
                  value={coverNote}
                  onChange={e => setCoverNote(e.target.value)}
                  placeholder="Highlight key fire-detection projects, commissioning highlights, specific panel experience, and your motivation for joining Audrin Fire Engineers..."
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461] leading-relaxed"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#C1A461]/10 border border-[#C1A461]/30 text-xs text-white/80 space-y-1">
                <p className="font-bold text-[#D4BC7B]">SANS 10139 Focus</p>
                <p className="text-[11px] leading-relaxed">
                  Audrin Fire Engineers values integrity, meticulous logbook keeping, accurate loop wiring verification, and exemplary life-safety standards.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: DECLARATION & POPIA */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-[#C1A461] font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Statutory & Ethics Declaration</span>
                </div>

                <div className="space-y-3 text-xs text-white/70 leading-relaxed">
                  <p>
                    1. <strong>Accuracy of Qualifications:</strong> I hereby certify that all information, SAQCC numbers, experience durations, and uploaded certificates provided in this application are authentic, accurate, and up to date.
                  </p>
                  <p>
                    2. <strong>SANS 10139 Standard Commitment:</strong> I acknowledge that Audrin Fire Engineers operates strictly under SANS 10139, SANS 10400-T, and SAQCC regulations. Any deliberate misrepresentation of competency or false commissioning records constitutes immediate disqualification.
                  </p>
                  <p>
                    3. <strong>POPIA Compliance:</strong> I understand that my details will be stored securely and evaluated exclusively for recruitment and regulatory accreditation purposes.
                  </p>
                </div>

                <label className="flex items-start gap-3 pt-3 border-t border-white/10 text-xs text-white cursor-pointer select-none font-medium">
                  <input
                    type="checkbox"
                    checked={accuracyConfirmed}
                    onChange={e => setAccuracyConfirmed(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-[#C1A461] focus:ring-[#C1A461]"
                  />
                  <span>
                    I solemnly declare that the statements made herein are true and correct, and I consent to SAQCC qualification registry verification.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: SUBMISSION SUCCESS & RECEIPT */}
          {step === 5 && createdApp && (
            <div className="text-center space-y-6 py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="px-3 py-1 rounded-full bg-[#C1A461]/20 border border-[#C1A461]/40 text-[#C1A461] text-xs font-mono font-bold">
                  {createdApp.referenceNumber}
                </span>
                <h3 className="text-xl font-bold text-white pt-2">Application Submitted Successfully</h3>
                <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
                  Your application for <strong className="text-white">{vacancy.jobTitle}</strong> has been logged into the Audrin Fire Engineers candidate registry.
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-left text-xs space-y-2 max-w-md mx-auto font-mono">
                <div className="flex justify-between border-b border-white/10 pb-1.5 text-[11px] text-white/50">
                  <span>TIMESTAMP:</span>
                  <span className="text-white">{new Date(createdApp.submittedAt).toLocaleString('en-ZA')}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5 text-[11px] text-white/50">
                  <span>APPLICANT:</span>
                  <span className="text-white">{createdApp.applicantName}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1.5 text-[11px] text-white/50">
                  <span>STATUS:</span>
                  <span className="text-emerald-400 font-bold">SUBMITTED (IN REVIEW)</span>
                </div>
                <div className="text-[10px] text-white/40 pt-1 truncate">
                  INTEGRITY HASH: {createdApp.receiptHashSha256}
                </div>
              </div>

              {/* Automated Email Notice */}
              <div className="p-3.5 rounded-xl bg-[#C1A461]/10 border border-[#C1A461]/30 text-xs text-[#D4BC7B] flex items-center justify-center gap-2 max-w-md mx-auto">
                <Mail className="w-4 h-4 shrink-0" />
                <span>An automated confirmation email has been dispatched to {createdApp.applicantEmail}.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-[#121215] border-t border-white/10 flex items-center justify-between gap-4">
          {step < 5 ? (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition"
                >
                  Cancel
                </button>
              )}

              {step === 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-[#C1A461]/20"
                >
                  <span>Next: Screening</span> <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-[#C1A461]/20"
                >
                  <span>Next: Cover Note</span> <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-[#C1A461]/20"
                >
                  <span>Next: Declaration</span> <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {step === 4 && (
                <button
                  type="button"
                  disabled={submitting || !accuracyConfirmed}
                  onClick={handleSubmitApplication}
                  className="px-8 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-[#C1A461]/20 disabled:opacity-50"
                >
                  {submitting ? 'Submitting Application...' : 'Confirm & Submit Application'}
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-2.5 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#C1A461]/20"
              >
                Close & View in Portal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
