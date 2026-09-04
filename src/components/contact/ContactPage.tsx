import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../data/initialData';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organisation: '',
    subject: 'General Technical Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] font-bold text-[#C1A461] uppercase tracking-[1.5px]">
            Engineering Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Contact AUDRIN FIRE ENGINEERS
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            Reach our registered fire-detection engineering team for technical consultations, system category design, and emergency fault triage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Details (5 cols) */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-[#151518] border border-white/5 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white">Office & Workshop Location</h3>

              <div className="space-y-4 text-xs text-white/70">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#C1A461]/10 text-[#C1A461] flex items-center justify-center shrink-0 border border-[#C1A461]/20">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Physical Address</div>
                    <div className="text-white/50">{COMPANY_DETAILS.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#C1A461]/10 text-[#C1A461] flex items-center justify-center shrink-0 border border-[#C1A461]/20">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Telephone / WhatsApp</div>
                    <div className="text-white/50">{COMPANY_DETAILS.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#C1A461]/10 text-[#C1A461] flex items-center justify-center shrink-0 border border-[#C1A461]/20">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Engineering Inquiries</div>
                    <div className="text-white/50">{COMPANY_DETAILS.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#C1A461]/10 text-[#C1A461] flex items-center justify-center shrink-0 border border-[#C1A461]/20">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Operating Hours</div>
                    <div className="text-white/50">{COMPANY_DETAILS.operatingHours}</div>
                    <div className="text-[#C1A461] text-[11px] font-mono mt-0.5">24/7 Critical Fault Support for Contracted Facilities</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 text-[11px] font-mono text-white/50 space-y-1">
              <div>Legal Entity: <span className="text-white">{COMPANY_DETAILS.legalName}</span></div>
              <div>Registration No: <span className="text-white">{COMPANY_DETAILS.registrationNumber}</span></div>
              <div>Director: <span className="text-white">{COMPANY_DETAILS.director}</span></div>
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-[#151518] border border-white/5 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white">Send a Technical Message</h3>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Message Transmitted Successfully</span>
                </div>
                <p className="text-xs text-white/70">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Your inquiry has been forwarded to our Lead Fire Engineer. We will respond shortly at <strong className="text-white">{formData.email}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 font-semibold mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Johan van der Merwe"
                      className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1.5">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. johan@commercialprop.co.za"
                      className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="082 123 4567"
                      className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1.5">Company / Facility</label>
                    <input
                      type="text"
                      value={formData.organisation}
                      onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                      placeholder="e.g. Menlyn Business Hub"
                      className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                  >
                    <option value="General Technical Inquiry" className="bg-[#151518]">General Technical Inquiry</option>
                    <option value="SANS 10139 Category Consultation" className="bg-[#151518]">SANS 10139 Category Consultation</option>
                    <option value="Preventative Maintenance Contract" className="bg-[#151518]">Preventative Maintenance Contract</option>
                    <option value="Critical System Fault Escalation" className="bg-[#151518]">Critical System Fault Escalation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 font-semibold mb-1.5">Message / Scope Details *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your facility, panel type, or maintenance requirements..."
                    className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#C1A461] hover:bg-[#b09350] text-black font-bold rounded-xl transition shadow-lg text-xs tracking-wider uppercase"
                >
                  Transmit Message to Engineering Desk
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
