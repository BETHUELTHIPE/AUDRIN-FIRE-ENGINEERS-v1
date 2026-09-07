import React from 'react';
import { Sun, Moon, Sparkles, Eye, ShieldCheck } from 'lucide-react';
import { useAudrinStore } from '../../services/store';
import { GlobalTheme } from '../../types';

interface ThemeSwitcherProps {
  variant?: 'navbar' | 'compact' | 'drawer' | 'card';
  className?: string;
  showLabel?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = 'navbar',
  className = '',
  showLabel = true
}) => {
  const store = useAudrinStore();
  const currentTheme = store.getTheme();
  const isDark = currentTheme === 'dark';

  const handleToggle = () => {
    store.toggleTheme();
  };

  const handleSetTheme = (theme: GlobalTheme) => {
    store.setTheme(theme);
  };

  // Drawer / Card Variant: Segmented selector with descriptive notes
  if (variant === 'drawer' || variant === 'card') {
    return (
      <div className={`p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#0B1C44] text-[#C1A461] border border-[#C1A461]/40' : 'bg-amber-100 text-amber-700'}`}>
              {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-white block">
                Visual Inspection Theme
              </span>
              <span className="text-[10px] text-white/50 block font-sans">
                {isDark ? 'Night Inspection Mode (Brand Navy)' : 'Daylight Mode (Default)'}
              </span>
            </div>
          </div>

          <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full ${
            isDark 
              ? 'bg-[#0B1C44] text-[#C1A461] border border-[#C1A461]/40' 
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {isDark ? 'Navy Low-Glare' : 'Daylight Standard'}
          </span>
        </div>

        {/* Segmented Control */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/60 rounded-xl border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => handleSetTheme('light')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer font-bold ${
              !isDark
                ? 'bg-[#C1A461] text-black shadow-md shadow-black/40'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Daylight (Light)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetTheme('dark')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer font-bold ${
              isDark
                ? 'bg-[#0B1C44] text-[#C1A461] border border-[#C1A461]/50 shadow-md shadow-[#0B1C44]/40'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-[#C1A461]" />
            <span>Night Navy</span>
          </button>
        </div>

        <p className="text-[10px] text-white/40 leading-relaxed font-sans">
          Night Mode applies the signature <strong>Audrin Brand-Navy palette (#0B1C44)</strong> to preserve pupil dark adaptation during night-time site surveys and audibility tests.
        </p>
      </div>
    );
  }

  // Compact Icon-Only Variant
  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        title={isDark ? 'Switch to Default Daylight Theme' : 'Switch to Night Inspection Mode (Brand Navy)'}
        aria-label={isDark ? 'Switch to Default Daylight Theme' : 'Switch to Night Inspection Mode (Brand Navy)'}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition border cursor-pointer ${
          isDark
            ? 'bg-[#0B1C44] hover:bg-[#122452] border-[#C1A461]/40 text-[#C1A461] shadow-lg shadow-[#0B1C44]/30'
            : 'bg-white/10 hover:bg-white/20 border-white/15 text-amber-300 shadow-sm'
        } ${className}`}
      >
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>
    );
  }

  // Navbar Segmented Pill (Default for Header)
  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl border transition-all ${
        isDark
          ? 'bg-[#07122E]/90 border-[#1D3570] shadow-md shadow-[#07122E]/50'
          : 'bg-white/10 border-white/15 backdrop-blur-sm'
      } ${className}`}
      role="radiogroup"
      aria-label="Theme Selection"
    >
      <button
        type="button"
        role="radio"
        aria-checked={!isDark}
        onClick={() => handleSetTheme('light')}
        title="Default Daylight Theme: Crisp high-contrast daylight styling for office reporting and daylight site surveys"
        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
          !isDark
            ? 'bg-[#C1A461] text-black shadow-sm'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
        {showLabel && <span>Daylight</span>}
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={isDark}
        onClick={() => handleSetTheme('dark')}
        title="Night Inspection Mode: Signature Brand-Navy (#0B1C44) low-glare dark mode for nocturnal site surveys and plant-room audits"
        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
          isDark
            ? 'bg-[#0B1C44] text-[#C1A461] border border-[#C1A461]/50 shadow-md shadow-black/40'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }`}
      >
        <Moon className="w-3.5 h-3.5 text-[#C1A461]" />
        {showLabel && <span>Night Navy</span>}
        <span className="w-1.5 h-1.5 rounded-full bg-[#C1A461] animate-pulse" />
      </button>
    </div>
  );
};
