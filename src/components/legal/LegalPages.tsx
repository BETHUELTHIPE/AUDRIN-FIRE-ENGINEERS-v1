import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Mail,
  Building2
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../data/initialData';

interface LegalPagesProps {
  pageType: 'privacy-policy' | 'terms' | 'cookie-policy' | 'popia-notice';
  onBack: () => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({ pageType, onBack }) => {
  const [popiaSubmitted, setPopiaSubmitted] = useState(false);
  const [popiaForm, setPopiaForm] = useState({
    name: '',
    email: '',
    phone: '',
    organisation: '',
    requestType: 'access',
    description: ''
  });

  const handlePopiaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPopiaSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {pageType === 'privacy-policy' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#151518] border border-white/5 space-y-6 text-xs text-white/70 leading-relaxed shadow-xl">
            <div className="space-y-2 border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
                Statutory Governance
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Privacy Policy</h1>
              <p className="text-white/40 font-mono text-[11px]">
                {COMPANY_DETAILS.legalName} (Reg: {COMPANY_DETAILS.registrationNumber})
              </p>
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Commitment to Privacy & POPIA</h3>
              <p>
                {COMPANY_DETAILS.legalName} ("Audrin Fire Engineers", "we", "us", or "our") is committed to protecting the privacy and confidentiality of personal and corporate information collected in the course of providing commercial fire-detection and alarm engineering services in South Africa. We comply strictly with the Protection of Personal Information Act, No. 4 of 2013 (POPIA).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Information We Collect</h3>
              <p>
                We collect information necessary to perform commercial site surveys, system category design (SANS 10139), maintenance, testing, commissioning, and fault diagnostics. This includes contact person details, email addresses, phone numbers, facility addresses, control panel configurations, CAD floor layouts, and audited photographic/video evidence.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Use of Photographic & Video Evidence</h3>
              <p>
                Field photographs and video recordings captured during pre-work surveys, commissioning, or preventative maintenance are processed solely to verify equipment conditions, compile Condition Reports, and maintain auditable baseline records. Photographic evidence is cryptographically hashed for data integrity.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">4. Contact Information Officer</h3>
              <p>
                Information Officer: Bethuel Moukangwe | Email: {COMPANY_DETAILS.email} | Address: 27 Tshivhase Street, Pretoria West, Pretoria, 0008.
              </p>
            </section>
          </div>
        )}

        {pageType === 'terms' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#151518] border border-white/5 space-y-6 text-xs text-white/70 leading-relaxed shadow-xl">
            <div className="space-y-2 border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
                Terms of Service
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Terms and Conditions</h1>
              <p className="text-white/40 font-mono text-[11px]">
                Standard Engineering Terms for Commercial Fire-Detection Services
              </p>
            </div>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Scope of Specialist Services</h3>
              <p>
                AUDRIN FIRE ENGINEERS (PTY) LTD provides engineering, design, installation, commissioning, maintenance, and fault diagnostics exclusively for electronic fire-detection and alarm systems aligned with SANS 10139 recommendations.
              </p>
            </section>

            <section className="space-y-2 p-5 rounded-2xl bg-[#0A0A0B] border border-white/5">
              <h3 className="text-sm font-bold text-[#C1A461] uppercase tracking-wider">2. Express Scope Exclusions</h3>
              <p className="text-white/70">
                Audrin Fire Engineers does not supply, inspect, or service fire extinguishers, hose reels, fire hydrants, water sprinkler systems, gas flood suppression, CCTV, access control, or standalone security alarms. Any fire safety equipment outside electronic fire detection falls outside our contractual scope.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">3. Limitation of Statutory Verification</h3>
              <p>
                Photographic records, video clips, condition reports, and AI meeting minutes generated through our digital platform do not constitute statutory certification or legal compliance certificates. Formal compliance documentation is issued following physical, on-site testing by our certified engineers.
              </p>
            </section>
          </div>
        )}

        {pageType === 'cookie-policy' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#151518] border border-white/5 space-y-6 text-xs text-white/70 leading-relaxed shadow-xl">
            <div className="space-y-2 border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
                Cookies & Web Storage
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Cookie & Local Storage Policy</h1>
            </div>

            <p>
              Our platform uses strictly necessary cookies and browser local storage to maintain session security, role authentication tokens, portal preferences, and cached condition report drafts. We do not use third-party behavioral advertising trackers.
            </p>
          </div>
        )}

        {pageType === 'popia-notice' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#151518] border border-white/5 space-y-6 text-xs text-white/70 leading-relaxed shadow-xl">
            <div className="space-y-2 border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
                Data Subject Rights (POPIA)
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">POPIA Information & Data Subject Request Form</h1>
              <p className="text-white/50">
                Under South Africa's Protection of Personal Information Act, you have the right to request access to, correction of, or deletion of your personal or facility records.
              </p>
            </div>

            {popiaSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Data Subject Request Logged</span>
                </div>
                <p className="text-white/70">
                  Thank you. Your POPIA request has been submitted to our Information Officer ({COMPANY_DETAILS.email}). We will respond within the statutory timeframe (30 days).
                </p>
              </div>
            ) : (
              <form onSubmit={handlePopiaSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 font-semibold mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={popiaForm.name}
                      onChange={(e) => setPopiaForm({ ...popiaForm, name: e.target.value })}
                      className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 font-semibold mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={popiaForm.email}
                      onChange={(e) => setPopiaForm({ ...popiaForm, email: e.target.value })}
                      className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 font-semibold mb-1.5">Contact Phone</label>
                    <input
                      type="tel"
                      value={popiaForm.phone}
                      onChange={(e) => setPopiaForm({ ...popiaForm, phone: e.target.value })}
                      className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 font-semibold mb-1.5">Request Type</label>
                    <select
                      value={popiaForm.requestType}
                      onChange={(e) => setPopiaForm({ ...popiaForm, requestType: e.target.value })}
                      className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                    >
                      <option value="access" className="bg-[#151518]">Access Personal Records</option>
                      <option value="correction" className="bg-[#151518]">Correct or Update Data</option>
                      <option value="deletion" className="bg-[#151518]">Request Data Deletion</option>
                      <option value="objection" className="bg-[#151518]">Objection to Processing</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-white/70 font-semibold mb-1.5">Details of Request *</label>
                    <textarea
                      rows={3}
                      required
                      value={popiaForm.description}
                      onChange={(e) => setPopiaForm({ ...popiaForm, description: e.target.value })}
                      placeholder="Specify the facility, reports, or contact records related to your request..."
                      className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#C1A461] hover:bg-[#b09350] text-black font-bold rounded-xl transition shadow text-xs uppercase tracking-wider"
                >
                  Submit POPIA Data Subject Request
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
