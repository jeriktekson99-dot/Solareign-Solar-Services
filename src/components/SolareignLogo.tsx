export const SOLAREIGN_LOGO_URL = 'https://cdn.phototourl.com/free/2026-09-13-c94af964-6f09-4262-8f91-fa6da37e47ea.png';

interface SolareignLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function SolareignLogo({ className = '', variant = 'dark' }: SolareignLogoProps) {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Company Official Logo Mark */}
      <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center">
        <img
          src={SOLAREIGN_LOGO_URL}
          alt="Solareign Solar Power Services Logo"
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight font-extrabold text-xl leading-none">
          <span className={isDark ? 'text-[#0F5A29]' : 'text-white'}>SOLA</span>
          <span className="text-[#88D628]">REIGN</span>
        </div>
        <span
          className={`text-[9px] font-bold tracking-widest uppercase mt-0.5 ${
            isDark ? 'text-slate-600' : 'text-slate-300'
          }`}
        >
          Solar Power Services
        </span>
      </div>
    </div>
  );
}
