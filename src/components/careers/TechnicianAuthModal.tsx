import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  KeyRound, 
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';

interface TechnicianAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultTab?: 'login' | 'register';
  onOpenPrivacyPolicy?: () => void;
}

export const TechnicianAuthModal: React.FC<TechnicianAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultTab = 'login',
  onOpenPrivacyPolicy
}) => {
  const store = useAudrinStore();
  const [tab, setTab] = useState<'login' | 'register' | 'verify'>(defaultTab);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [popiaConsent, setPopiaConsent] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);

  // Verification state
  const [activeTechId, setActiveTechId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [lastGeneratedCode, setLastGeneratedCode] = useState<string>('');

  // UI state
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim() || !email.trim() || !cellphone.trim() || !password.trim()) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (!popiaConsent || !privacyPolicy) {
      setErrorMessage('You must accept the POPIA consent and Privacy Policy to create an account.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = store.registerTechnician({
        fullName,
        email,
        cellphone,
        password,
        popiaConsent,
        privacyPolicy
      });

      setLoading(false);
      if (res.success && res.technicianId) {
        setActiveTechId(res.technicianId);
        setLastGeneratedCode(res.verificationCode || '');
        setSuccessMessage(res.message);
        setTab('verify');
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!verificationCode.trim() || verificationCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = store.verifyTechnicianEmail(activeTechId, verificationCode.trim());
      setLoading(false);
      if (res.success) {
        setSuccessMessage('Email verified successfully! You are now logged in.');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 800);
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const handleResendCode = () => {
    if (!activeTechId) return;
    setErrorMessage('');
    setLoading(true);
    setTimeout(() => {
      const res = store.resendTechnicianVerificationCode(activeTechId);
      setLoading(false);
      if (res.success) {
        setLastGeneratedCode(res.code);
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
    }, 400);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your email address and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = store.loginTechnician(email, password);
      setLoading(false);
      if (res.success) {
        setSuccessMessage('Welcome back! Logging into your portal...');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 600);
      } else {
        if (res.technician && !res.technician.isEmailVerified) {
          setActiveTechId(res.technician.id);
          setLastGeneratedCode(res.technician.emailVerificationCode || '123456');
          setErrorMessage(res.message);
          setTab('verify');
        } else {
          setErrorMessage(res.message);
        }
      }
    }, 400);
  };

  const handleQuickDemoTech = (techEmail: string) => {
    setEmail(techEmail);
    setPassword('Audrin2026!');
    const tech = store.getTechnicians().find(t => t.email.toLowerCase() === techEmail.toLowerCase());
    if (tech) {
      store.setActiveTechnician(tech.id);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#151518] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1c1c22] to-[#121215] border-b border-white/10 p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[#C1A461] mb-2 font-mono text-xs uppercase tracking-wider font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>SANS 10139 Technician Candidate Portal</span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            {tab === 'register' && 'Technician Registration'}
            {tab === 'login' && 'Technician Sign In'}
            {tab === 'verify' && 'Verify Email Address'}
          </h2>
          <p className="text-xs text-white/60 mt-1">
            {tab === 'register' && 'Create your official profile to apply for SAQCC fire detection roles.'}
            {tab === 'login' && 'Access your active job applications, interview schedules, and SAQCC record.'}
            {tab === 'verify' && 'Enter the 6-digit code sent to your email to activate your account.'}
          </p>

          {/* Tab Switcher (if not in verify mode) */}
          {tab !== 'verify' && (
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 mt-5">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  tab === 'login'
                    ? 'bg-[#C1A461] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  tab === 'register'
                    ? 'bg-[#C1A461] text-black shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="technician@example.co.za"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461] transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-[#C1A461]/20 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Sign In to Portal</span>}
              </button>

              {/* Demo Accounts Quick Fill */}
              <div className="pt-3 border-t border-white/10">
                <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider mb-2">
                  Demo Candidate Profiles (1-Click Fill)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoTech('kagiso.mokoena@firetechnicians.co.za')}
                    className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-left text-[11px] text-white/80 transition"
                  >
                    <div className="font-bold text-[#C1A461]">Kagiso Mokoena</div>
                    <div className="text-white/40 text-[10px]">SAQCC Commissioner (6y exp)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoTech('jaco.vdm@alarmsystems.co.za')}
                    className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-left text-[11px] text-white/80 transition"
                  >
                    <div className="font-bold text-[#C1A461]">Jaco Van Der Merwe</div>
                    <div className="text-white/40 text-[10px]">SAQCC Installer (4y exp)</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                  Full Name & Surname *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Sibusiso Thabo Sithole"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@mail.co.za"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                    Cellphone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="tel"
                      required
                      value={cellphone}
                      onChange={e => setCellphone(e.target.value)}
                      placeholder="+27 82 000 0000"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461] transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#C1A461] transition"
                    />
                  </div>
                </div>
              </div>

              {/* POPIA & Privacy Consent Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-2.5 text-xs text-white/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={popiaConsent}
                    onChange={e => setPopiaConsent(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-[#C1A461] focus:ring-[#C1A461] focus:ring-offset-0"
                  />
                  <span>
                    I consent to Audrin Fire Engineers processing my personal details, SAQCC numbers, and CV documents in strict compliance with the <strong className="text-[#C1A461]">Protection of Personal Information Act (POPIA)</strong>.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-white/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={privacyPolicy}
                    onChange={e => setPrivacyPolicy(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-[#C1A461] focus:ring-[#C1A461] focus:ring-offset-0"
                  />
                  <span>
                    I have read and accept the <button type="button" onClick={onOpenPrivacyPolicy} className="text-[#C1A461] underline hover:text-[#D4BC7B]">Privacy Policy</button> and candidate Terms of Service.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !popiaConsent || !privacyPolicy}
                className="w-full py-3 px-4 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-[#C1A461]/20 disabled:opacity-50 mt-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Create Account & Send Verification Code</span>}
              </button>
            </form>
          )}

          {/* TAB: VERIFY CODE */}
          {tab === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="p-4 rounded-xl bg-[#C1A461]/10 border border-[#C1A461]/30 text-center space-y-1">
                <p className="text-xs font-bold text-[#D4BC7B]">
                  6-Digit Email Verification Code Dispatched
                </p>
                <p className="text-[11px] text-white/70">
                  Please enter the code sent to your registered email address.
                </p>
                {lastGeneratedCode && (
                  <div className="mt-2 py-1.5 px-3 bg-black/40 border border-[#C1A461]/40 rounded-lg inline-flex items-center gap-2 font-mono text-xs text-[#C1A461]">
                    <span>Simulator Inbox Code:</span>
                    <strong className="tracking-widest text-sm text-white">{lastGeneratedCode}</strong>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-2 text-center">
                  Enter 6-Digit Code
                </label>
                <div className="relative max-w-[240px] mx-auto">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C1A461]" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-center text-lg font-mono tracking-widest placeholder-white/20 focus:outline-none focus:border-[#C1A461] transition"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full py-3 px-4 rounded-xl bg-[#C1A461] hover:bg-[#D4BC7B] text-black text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-[#C1A461]/20 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Verify & Access Portal</span>}
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-[#C1A461] hover:underline flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="text-white/50 hover:text-white transition"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
