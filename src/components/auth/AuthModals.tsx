import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Phone, 
  CheckCircle2, 
  KeyRound, 
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { UserRole } from '../../types';

interface AuthModalsProps {
  isOpen: boolean;
  mode: 'login' | 'register' | 'forgot_password';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register' | 'forgot_password') => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  isOpen,
  mode,
  onClose,
  onSwitchMode
}) => {
  const store = useAudrinStore();
  const [email, setEmail] = useState('sarah.ndlovu@apexprop.co.za');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Sarah Ndlovu');
  const [organisation, setOrganisation] = useState('Apex Commercial Properties');
  const [phone, setPhone] = useState('082 345 6789');
  
  // Registration OTP step
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    store.setUserRole('customer');
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpStep(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpVerified(true);
    setTimeout(() => {
      store.setUserRole('customer');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0B]/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#151518] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C1A461]/10 border border-[#C1A461]/30 flex items-center justify-center text-[#C1A461]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {mode === 'login' ? 'Client & Staff Portal Login' : mode === 'register' ? 'Register Facility Account' : 'Reset Password'}
              </h3>
              <p className="text-[10px] text-white/50 font-mono tracking-wider">
                AUDRIN FIRE ENGINEERS (PTY) LTD
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-white/40 hover:text-white p-1 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-white/70 font-semibold mb-1.5">Corporate Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-white/70 font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => onSwitchMode('forgot_password')}
                  className="text-[#C1A461] hover:underline text-[11px]"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#C1A461] hover:bg-[#b09350] text-black font-bold rounded-xl transition shadow-lg text-xs uppercase tracking-wider mt-2"
            >
              Sign In to Portal
            </button>

            <div className="text-center pt-2 text-white/50 text-[11px]">
              Don't have a commercial facility account?{' '}
              <button
                type="button"
                onClick={() => { setIsOtpStep(false); onSwitchMode('register'); }}
                className="text-[#C1A461] font-bold hover:underline"
              >
                Register Site
              </button>
            </div>
          </form>
        )}

        {/* REGISTER MODE */}
        {mode === 'register' && !isOtpStep && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-white/70 font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
              />
            </div>

            <div>
              <label className="block text-white/70 font-semibold mb-1">Company / Property Group *</label>
              <input
                type="text"
                required
                value={organisation}
                onChange={(e) => setOrganisation(e.target.value)}
                className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
              />
            </div>

            <div>
              <label className="block text-white/70 font-semibold mb-1">Corporate Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
              />
            </div>

            <div>
              <label className="block text-white/70 font-semibold mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#C1A461] hover:bg-[#b09350] text-black font-bold rounded-xl transition shadow-lg text-xs uppercase tracking-wider"
            >
              Send 6-Digit Email Verification Code
            </button>

            <div className="text-center pt-1 text-white/50 text-[11px]">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('login')}
                className="text-[#C1A461] font-bold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* REGISTER OTP VERIFICATION */}
        {mode === 'register' && isOtpStep && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs text-center">
            <div className="p-3.5 bg-[#0A0A0B] border border-white/5 rounded-2xl space-y-1">
              <span className="text-[10px] text-[#C1A461] font-bold uppercase tracking-wider">6-Digit Verification Code</span>
              <p className="text-white/70 text-[11px]">
                We sent an OTP code to <strong className="text-white">{email}</strong>. (Simulated code: <strong className="text-[#C1A461]">849201</strong>)
              </p>
            </div>

            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  defaultValue={['8', '4', '9', '2', '0', '1'][idx]}
                  className="w-10 h-12 text-center text-lg font-bold bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461] font-mono"
                />
              ))}
            </div>

            {otpVerified ? (
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Account Verified! Redirecting...</span>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow text-xs tracking-wider uppercase"
              >
                Verify & Activate Account
              </button>
            )}
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot_password' && (
          <div className="space-y-4 text-xs">
            <p className="text-white/70">
              Enter your corporate email address to receive a secure password reset link.
            </p>
            <input
              type="email"
              placeholder="name@company.co.za"
              className="w-full p-3 bg-[#0A0A0B] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#C1A461]"
            />
            <button
              onClick={() => { alert('Password reset token generated and sent to email.'); onSwitchMode('login'); }}
              className="w-full py-3.5 bg-[#C1A461] hover:bg-[#b09350] text-black font-bold rounded-xl transition text-xs tracking-wider uppercase"
            >
              Send Reset Link
            </button>
            <button
              onClick={() => onSwitchMode('login')}
              className="w-full text-white/50 hover:text-white text-center text-[11px] pt-1"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
