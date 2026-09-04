import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Flame, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  FileCheck, 
  Clock, 
  AlertTriangle,
  GraduationCap,
  Briefcase,
  Cpu,
  Binary,
  Database,
  LineChart,
  ExternalLink,
  Linkedin,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../data/initialData';

interface AboutUsPageProps {
  onRequestService: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onRequestService }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C1A461]/10 border border-[#C1A461]/30 text-[#C1A461] text-[10px] font-bold uppercase tracking-[1.5px]">
          <Flame className="w-3.5 h-3.5" />
          <span>SANS 10139 & SANS 10400-T Specialist Fire Engineering</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          About AUDRIN FIRE ENGINEERS (PTY) LTD
        </h1>
        <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Pioneering mathematical precision, data-driven system verification, and code-mandated fire detection engineering across South African commercial and industrial infrastructure.
        </p>
      </div>

      {/* Managing Director Executive Section */}
      <div id="managing-director" className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#C1A461]/20 border border-[#C1A461]/40 text-[#C1A461] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3 h-3" />
              <span>Executive Leadership Profile</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Managing Director & Lead Systems Engineer
            </h2>
            <p className="text-white/50 text-xs sm:text-sm mt-1">
              Guiding technical strategy, quantitative verification, and SANS 10139 compliance integrity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="https://www.linkedin.com/in/bethuel-moukangwe" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#C1A461]/20 border border-white/10 hover:border-[#C1A461]/40 text-white hover:text-[#C1A461] transition-all text-xs font-mono"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#C1A461]" />
              <span>LinkedIn Profile</span>
              <ExternalLink className="w-3 h-3 text-white/40" />
            </a>
            <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Gauteng Office</span>
            </div>
          </div>
        </div>

        {/* Primary Executive Card */}
        <div className="rounded-3xl bg-[#151518] border border-white/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C1A461]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Left Column: Portrait, Identity & Direct Contact */}
            <div className="lg:col-span-4 space-y-5">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#0A0A0B] border border-white/10 relative shadow-inner group">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
                  alt="Russia Bethuel Moukangwe"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C1A461]/20 border border-[#C1A461]/40 text-[#C1A461] text-[10px] font-mono font-bold uppercase">
                    <ShieldCheck className="w-3 h-3" />
                    Managing Director & SAQCC Commissioner
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Russia Bethuel Moukangwe
                  </h3>
                  <p className="text-white/80 text-xs font-mono">
                    Registered SAQCC Fire Technician & Commissioner
                  </p>
                  <p className="text-white/50 text-[11px] font-mono">
                    BSc (Maths & Applied Maths) &middot; Data Engineer
                  </p>
                </div>
              </div>

              {/* Direct Channels */}
              <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 space-y-3 font-mono text-xs">
                <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Executive Office Channels</div>
                
                <a 
                  href="mailto:bethuelthipe@gmail.com" 
                  className="flex items-center gap-3 text-white/70 hover:text-[#C1A461] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#C1A461] group-hover:bg-[#C1A461]/20">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">bethuelthipe@gmail.com</span>
                </a>

                <a 
                  href="tel:+27714156665" 
                  className="flex items-center gap-3 text-white/70 hover:text-[#C1A461] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#C1A461] group-hover:bg-[#C1A461]/20">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span>071 415 6665 / 072 037 8471</span>
                </a>

                <div className="flex items-center gap-3 text-white/70">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#C1A461]">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] leading-tight text-white/60">
                    02 Erasmus, Norkem Park, Kempton Park / Pretoria West, Gauteng
                  </span>
                </div>
              </div>

              {/* Quick Credentials Summary */}
              <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 space-y-2">
                <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold font-mono">Accreditation & Institutional Pedigree</div>
                <div className="space-y-1.5 text-xs text-white/80">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C1A461] shrink-0 mt-0.5" />
                    <span className="font-semibold text-white">Registered SAQCC Fire Commissioner</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C1A461] shrink-0 mt-0.5" />
                    <span>UNISA BSc in Mathematics & Applied Mathematics</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C1A461] shrink-0 mt-0.5" />
                    <span>EXPLOREAI Data Engineering Specialist</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C1A461] shrink-0 mt-0.5" />
                    <span>17+ Yrs Physical Sciences & Mathematics Pedagogy</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C1A461] shrink-0 mt-0.5" />
                    <span>Umalusi Quality Council Subject Evaluator</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: In-Depth Biography, Qualifications, & SANS 10139 Statement */}
            <div className="lg:col-span-8 space-y-8">
              {/* 1. Professional Biography */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#C1A461] font-mono text-xs font-bold uppercase tracking-wider">
                  <Briefcase className="w-4 h-4" />
                  <span>1. Professional Biography</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Bridging Quantitative Mathematics, Sensor Dynamics & Fire Safety
                </h3>
                <div className="text-xs sm:text-sm text-white/70 space-y-3 leading-relaxed">
                  <p>
                    <strong className="text-white">Russia Bethuel Moukangwe</strong> is the Managing Director, Lead Systems Engineer, and <strong className="text-white">Registered SAQCC Fire Detection & Alarm Systems Commissioner</strong> of <strong className="text-white">AUDRIN FIRE ENGINEERS (PTY) LTD</strong>. His career unites over seventeen years of advanced mathematical modeling, physical sciences instruction, educational standards governance, and enterprise data engineering.
                  </p>
                  <p>
                    As an officially <strong className="text-white">Registered SAQCC Fire Technician Commissioner</strong>, Bethuel possesses statutory authority and technical competence under South African National Standards to inspect, verify, commission, and issue binding Certificates of Compliance (COC) for Category M, L1–L5, and P1–P2 fire detection installations.
                  </p>
                  <p>
                    Bethuel has served with distinction as a <strong className="text-white">Mathematics and Physical Sciences Lecturer</strong> in the Department of Higher Education and Training (2008–2025) and as an appointed <strong className="text-white">Evaluator, Subject Specialist, and Team Leader</strong> for the <strong className="text-white">Umalusi Quality Council</strong> since 2014. His specialization in rigorous quantitative analysis and quality assurance directly informs Audrin’s zero-tolerance policy for life-safety non-conformances.
                  </p>
                  <p>
                    Building upon his physics training at the <strong className="text-white">University of Pretoria</strong>, full degree completion in Mathematics & Applied Mathematics at <strong className="text-white">UNISA</strong>, and data architecture mastery at <strong className="text-white">EXPLOREAI Academy</strong>, he leads the development of Audrin’s proprietary digital engineering workflows, cryptographic SHA-256 evidence hashing, and automated SANS compliance auditing systems.
                  </p>
                </div>
              </div>

              {/* 2. Formal Qualifications & Certifications */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-[#C1A461] font-mono text-xs font-bold uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>2. Qualifications & Professional Appointments</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 space-y-2">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#C1A461]" />
                      <span>Academic & Statutory Accreditations</span>
                    </div>
                    <ul className="space-y-2 text-xs text-white/70">
                      <li>
                        <div className="text-[#C1A461] font-bold">Registered SAQCC Fire Technician Commissioner</div>
                        <div className="text-white/40 font-mono text-[11px]">SAQCC Fire (Detection & Alarm Systems Competent Person)</div>
                      </li>
                      <li>
                        <div className="text-white font-semibold">BSc in Mathematics and Applied Mathematics</div>
                        <div className="text-white/40 font-mono text-[11px]">University of South Africa (2012–2019 Fully Completed)</div>
                      </li>
                      <li>
                        <div className="text-white font-semibold">Data Engineering Immersive Course</div>
                        <div className="text-white/40 font-mono text-[11px]">EXPLOREAI Academy, South Africa (2023)</div>
                      </li>
                      <li>
                        <div className="text-white font-semibold">BSc Physics Program</div>
                        <div className="text-white/40 font-mono text-[11px]">University of Pretoria (2005–2007)</div>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0A0A0B] border border-white/5 space-y-2">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#C1A461]" />
                      <span>Institutional Governance & Leadership</span>
                    </div>
                    <ul className="space-y-2 text-xs text-white/70">
                      <li>
                        <div className="text-white font-semibold">Managing Director & Systems Commissioner</div>
                        <div className="text-white/40 font-mono text-[11px]">AUDRIN FIRE ENGINEERS (PTY) LTD (Current)</div>
                      </li>
                      <li>
                        <div className="text-white font-semibold">Evaluator & Subject Specialist Team Leader</div>
                        <div className="text-white/40 font-mono text-[11px]">Umalusi Quality Council (2014–Present)</div>
                      </li>
                      <li>
                        <div className="text-white font-semibold">Physical Sciences & Mathematics Lecturer</div>
                        <div className="text-white/40 font-mono text-[11px]">Dept. of Higher Education & Training (2008–2025)</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. Dedicated SANS 10139 Leadership Commitment Statement */}
              <div className="p-6 rounded-2xl bg-[#0A0A0B] border-l-4 border-l-[#C1A461] border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#C1A461] font-mono text-xs font-bold uppercase tracking-wider">
                    <Flame className="w-4 h-4" />
                    <span>3. Leadership Statement: SANS 10139 Commitment</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C1A461]/20 text-[#C1A461] font-bold">
                    Institutional Code Pledge
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                  <p>
                    "Fire detection and alarm engineering is fundamentally an exact mathematical discipline grounded in the physics of thermodynamics, optical obscuration, and acoustic wave propagation. When human lives in commercial and industrial buildings depend on early smoke warning and clear egress annunciation, <strong className="text-white">there is zero room for subjective compromise, counterfeit documentation, or generic checklists</strong>."
                  </p>
                  <p>
                    "As Managing Director of AUDRIN FIRE ENGINEERS, I mandate that every fire detection system we survey, commission, or service adheres unreservedly to <strong className="text-white">SANS 10139:2012 (Code of Practice for Fire Detection and Alarm Systems in Buildings)</strong> and the deemed-to-satisfy mandates of <strong className="text-white">SANS 10400-T</strong>."
                  </p>
                  <p>
                    "We do not sign off on compliant certificates unless all quantitative engineering thresholds are verified through empirical testing:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs text-white/90">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2">
                      <span className="text-[#C1A461] font-bold">&bull;</span>
                      <span><strong>Battery Autonomy:</strong> Guaranteed &ge; 24h quiescent standby + 30min full alarm.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2">
                      <span className="text-[#C1A461] font-bold">&bull;</span>
                      <span><strong>Sounder Audibility:</strong> Verified &ge; 65 dB(A) or &ge; 75 dB(A) at bedheads.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2">
                      <span className="text-[#C1A461] font-bold">&bull;</span>
                      <span><strong>MCP Ergonomics:</strong> Positioned exactly at 1.4m &plusmn; 0.2m along escape routes.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2">
                      <span className="text-[#C1A461] font-bold">&bull;</span>
                      <span><strong>Fault Annunciation:</strong> Response time &le; 200 seconds at the CIE panel.</span>
                    </div>
                  </div>

                  <p className="pt-2">
                    "Through transparent, cryptographically hashed photographic audit trails and real-time digital logbooks, we ensure that building owners, facilities executives, and municipal authorities hold an incontrovertible record of life safety readiness."
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs text-white/50">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">Russia Bethuel Moukangwe</span>
                    <span>&mdash; Managing Director, Lead Systems Engineer & Registered SAQCC Commissioner</span>
                  </div>
                  <div className="text-[#C1A461] font-bold">
                    SAQCC Fire Registered &middot; AUDRIN FIRE ENGINEERS
                  </div>
                </div>
              </div>

              {/* Quantitative Core Competencies */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider font-mono">
                  <Cpu className="w-4 h-4 text-[#C1A461]" />
                  <span>Technical Specializations & Quantitative Competencies</span>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-[#C1A461]/15 border border-[#C1A461]/40 text-[#C1A461] font-bold">
                    Registered SAQCC Fire Systems Commissioner
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                    SANS 10139:2012 Category Design (M, L1–L5, P1–P2)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                    SANS 10400-T Statutory Compliance
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                    Mathematical & Physical Sizing Models
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                    Statistical Data Profiling & Quality Testing
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                    ETL Data Pipelines & Cloud Architecture
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                    Cryptographic SHA-256 Audit Verification
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                    National Curriculum Standards Evaluation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Governance & Engineering Pillars */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#C1A461]/10 border border-[#C1A461]/30 flex items-center justify-center text-[#C1A461]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Mathematical Rigor</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            All system sizing, loop voltage drop limits, battery standby autonomy (≥ 24h + 30min alarm), and acoustic audibility (≥ 65 dB(A) or 75 dB(A) at bedheads) are derived through precise engineering formulas.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Cryptographic Audit Trails</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            Every pre-work baseline, post-work commissioning test, and defect rectification is recorded with SHA-256 digital hashing, geotagged photos, and tamper-resistant digital certificates.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#151518] border border-white/5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">SANS 10139 Code Compliance</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            Strict adherence to Categories M, L1 through L5, and P1 through P2, ensuring local municipality approval, insurer compliance, and uncompromised life safety for building occupants.
          </p>
        </div>
      </div>

      {/* Scope Clarity & Exclusions Notice */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#151518] border border-white/5 text-xs text-white/70 space-y-2">
        <div className="flex items-center gap-2 text-[#C1A461] font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Specialist Scope Clarity & Strict Exclusions</span>
        </div>
        <p className="leading-relaxed">
          AUDRIN FIRE ENGINEERS specializes strictly in electronic fire-detection and alarm systems (Categories M, L1–L5, P1–P2). In order to maintain uncompromising engineering depth, <strong className="text-white">we do NOT supply, inspect, or service fire extinguishers, hose reels, fire hydrants, sprinkler pipework, gas suppression flooding systems, CCTV, or standalone intruder alarms.</strong>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5 font-mono text-[11px] text-white/50">
          <div>
            <span className="text-white/30 block text-[9px] uppercase tracking-wider">Registration No.</span>
            <span className="text-white font-bold">{COMPANY_DETAILS.registrationNumber}</span>
          </div>
          <div>
            <span className="text-white/30 block text-[9px] uppercase tracking-wider">Managing Director</span>
            <span className="text-white font-bold">R.B. Moukangwe</span>
          </div>
          <div>
            <span className="text-white/30 block text-[9px] uppercase tracking-wider">Primary Office</span>
            <span className="text-white font-bold">Gauteng, SA</span>
          </div>
          <div>
            <span className="text-white/30 block text-[9px] uppercase tracking-wider">Standards Base</span>
            <span className="text-white font-bold">SANS 10139:2012</span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto text-center space-y-4 pt-4">
        <button
          onClick={onRequestService}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#C1A461] hover:bg-[#b09350] text-black font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-[#C1A461]/20"
        >
          <span>Request Technical Consultation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

