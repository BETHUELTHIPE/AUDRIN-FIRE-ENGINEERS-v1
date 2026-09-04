import React, { useState } from 'react';
import { 
  Video, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Users,
  Clock,
  Radio
} from 'lucide-react';
import { ZOOM_ROOM_CONFIG } from '../../data/initialData';

interface ZoomMeetingCardProps {
  onOpenAiMinutes?: () => void;
}

export const ZoomMeetingCard: React.FC<ZoomMeetingCardProps> = ({
  onOpenAiMinutes
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyInvitation = () => {
    const inviteText = `AUDRIN FIRE ENGINEERS — Technical Consultation
Room: ${ZOOM_ROOM_CONFIG.title}
Meeting Link: ${ZOOM_ROOM_CONFIG.joinUrl}
Meeting ID: ${ZOOM_ROOM_CONFIG.meetingId}
Passcode: ${ZOOM_ROOM_CONFIG.passcode}
Dial-in: ${ZOOM_ROOM_CONFIG.dialInNumbers.join(' | ')}
Security: Waiting Room Enabled | AI Minutes Consent Required`;

    navigator.clipboard.writeText(inviteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-7 rounded-3xl bg-[#151518] border border-white/5 space-y-5 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#0A0A0B] border border-white/5 flex items-center justify-center text-[#C1A461]">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
              <span>{ZOOM_ROOM_CONFIG.title}</span>
              <span className="text-[9px] uppercase tracking-wider bg-[#0A0A0B] text-[#C1A461] border border-[#C1A461]/30 px-2 py-0.5 rounded-full font-semibold">
                Protected Room
              </span>
            </h4>
            <p className="text-[11px] text-white/40 font-mono mt-0.5">
              Lead Engineer: {ZOOM_ROOM_CONFIG.hostName}
            </p>
          </div>
        </div>

        {/* Reveal / Hide Toggle */}
        <button
          onClick={() => setIsRevealed(!isRevealed)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0A0A0B] hover:bg-[#1E1E22] text-white/60 hover:text-white rounded-xl text-xs uppercase tracking-wider font-semibold border border-white/5 transition cursor-pointer"
          title={isRevealed ? 'Mask credentials' : 'Reveal credentials'}
        >
          {isRevealed ? <EyeOff className="w-3.5 h-3.5 text-[#C1A461]" /> : <Eye className="w-3.5 h-3.5 text-white/40" />}
          <span>{isRevealed ? 'Mask' : 'Reveal Details'}</span>
        </button>
      </div>

      {/* Masked / Revealed Credentials Box */}
      <div className="p-5 rounded-2xl bg-[#0A0A0B] border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-1">
          <div className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Meeting ID</div>
          <div className="text-white font-bold text-sm tracking-wider">
            {isRevealed ? ZOOM_ROOM_CONFIG.meetingId : '•••• •••• ••••'}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Passcode</div>
          <div className="text-[#C1A461] font-bold text-sm tracking-wider">
            {isRevealed ? ZOOM_ROOM_CONFIG.passcode : '••••••••'}
          </div>
        </div>

        <div className="sm:col-span-2 space-y-1 pt-3 border-t border-white/5">
          <div className="text-[9px] text-white/30 font-bold uppercase tracking-wider">Direct Video URL</div>
          <div className="text-white/60 truncate text-[11px]">
            {isRevealed ? (
              <a href={ZOOM_ROOM_CONFIG.joinUrl} target="_blank" rel="noopener noreferrer" className="text-[#C1A461] hover:underline">
                {ZOOM_ROOM_CONFIG.joinUrl}
              </a>
            ) : (
              'https://zoom.us/j/•••••••••••?pwd=••••••••••'
            )}
          </div>
        </div>
      </div>

      {/* Security & Waiting Room Notes */}
      <div className="flex items-center justify-between text-[11px] text-white/40 px-1">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Host Waiting Room Enabled</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/30 font-mono text-[10px]">
          <Clock className="w-3.5 h-3.5" />
          <span>Available Mon–Sun 07:00–20:00</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-3 border-t border-white/5">
        <a
          href={ZOOM_ROOM_CONFIG.joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 bg-[#C1A461] hover:bg-[#D4BC7B] text-black rounded-xl text-xs uppercase tracking-[1.5px] font-bold transition shadow-lg shadow-black/40"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Join Room</span>
        </a>

        <button
          onClick={handleCopyInvitation}
          className="px-4 py-3 bg-[#0A0A0B] hover:bg-[#1E1E22] border border-white/5 text-white/70 hover:text-white rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Invite'}</span>
        </button>

        {onOpenAiMinutes && (
          <button
            onClick={onOpenAiMinutes}
            className="px-4 py-3 bg-[#0A0A0B] hover:bg-[#1E1E22] border border-[#C1A461]/30 text-[#C1A461] rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C1A461]" />
            <span>AI Minutes</span>
          </button>
        )}
      </div>
    </div>
  );
};

