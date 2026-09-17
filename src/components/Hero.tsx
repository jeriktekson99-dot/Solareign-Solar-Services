import { useRef } from 'react';
import { ArrowRight, Phone, Star } from 'lucide-react';
import { motion } from 'motion/react';
import MultiStepQuoteForm from './MultiStepQuoteForm';
import { useSolareignData } from '../context/DataContext';

interface HeroProps {
  onContactClick: () => void;
  onExploreClick: () => void;
}

const SATISFIED_CLIENT_AVATARS = [
  {
    name: 'Ramon S.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    name: 'Michael V.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    name: 'Elena C.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
  },
  {
    name: 'Corazon D.',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
  },
];

export default function Hero({ onContactClick, onExploreClick }: HeroProps) {
  const { settings } = useSolareignData();
  const hotlinePhone = settings.hotline || '0908 145 4906';
  const cleanPhone = hotlinePhone.replace(/\s+/g, '');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const handleGetQuotationClick = () => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      onContactClick();
    }
  };

  return (
    <section
      id="home"
      className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-[#061B29] via-[#052419] to-[#041A0E] text-white overflow-hidden"
    >
      {/* Background Decorative Solar & Clean-Energy Glows (Dual-Tone Blue & Green) */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/18 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/4 -right-20 w-110 h-110 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-1/4 w-120 h-120 bg-[#88D628]/12 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0F5A29]/35 rounded-full blur-2xl pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 right-10 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10"
      />

      {/* Subtle geometric grid backdrop */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"
      />

      {/* Slowly Revealed Monochrome Image (Starts as normal, slowly reveals with no color) */}
      <motion.div
        id="hero-revealed-monochrome-image"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 0.45, scale: 1 }}
        transition={{ duration: 3.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        aria-hidden="true"
      >
        <img
          src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2000&q=80"
          alt=""
          role="presentation"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.failed) {
              target.dataset.failed = 'true';
              target.src = 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=2000&q=80';
            }
          }}
          className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-90 select-none"
          style={{ filter: 'grayscale(100%) contrast(120%) brightness(85%)' }}
          loading="eager"
        />
        {/* Deep neutral vignette to protect text readability while keeping the image crisp & colorless */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#061B29]/95 via-[#061B29]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041A0E] via-transparent to-[#061B29]/80" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-10 lg:gap-12 items-center">
          
          {/* Left Column: 45% Information Section */}
          <div className="w-full space-y-6 lg:space-y-7 text-left">
            
            {/* 1. Subtitle / Eyebrow: Square bullet + Renewable Energy System Specialist */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase text-[#88D628]">
              <span className="w-2.5 h-2.5 bg-[#88D628] shrink-0 inline-block" aria-hidden="true" />
              <span>Renewable Energy System Specialist</span>
            </div>

            {/* 2. Headline: Power Smarter. Save Bigger. */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
                <span className="block text-white">Power Smarter.</span>
                <span className="block text-[#88D628]">Save Bigger.</span>
              </h1>
            </div>

            {/* 3. Description Paragraph */}
            <p className="text-base sm:text-lg font-normal text-slate-200/90 leading-relaxed max-w-xl">
              Driving Global Change through reliable, high-efficiency solar installation services. Unlocking{' '}
              <strong className="text-white font-semibold">100% of your roof&apos;s power potential</strong> to immediately drop electric liabilities.
            </p>

            {/* 4. Social Proof & Ratings Row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1">
              {/* Overlapping Client Avatars */}
              <div className="flex items-center -space-x-2.5 overflow-hidden">
                {SATISFIED_CLIENT_AVATARS.map((avatar, idx) => (
                  <img
                    key={idx}
                    src={avatar.img}
                    alt={avatar.name}
                    className="inline-block h-10 w-10 sm:h-11 sm:w-11 rounded-full ring-2 ring-[#051A0D] object-cover"
                    loading="lazy"
                  />
                ))}
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block h-8 w-px bg-white/20" />

              {/* Star Rating & Count */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-[#88D628]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#88D628] text-[#88D628]" />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-[#88D628] tracking-wide">
                    5.0 Rating
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  Join <span className="text-white font-bold">50+ homes</span>.
                </p>
              </div>
            </div>

            {/* 5. CTA Action Buttons (Side by Side) */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {/* Primary Solid Button: "Get A Quotation" */}
              <button
                id="hero-get-quotation-btn"
                type="button"
                onClick={handleGetQuotationClick}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-[#88D628] hover:bg-[#7bc421] active:bg-[#6eb21c] text-[#0F5A29] font-extrabold text-sm sm:text-base tracking-wide transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <span>Get A Quotation</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Secondary Outline Button: "Call: 0908 145 4906" */}
              <a
                id="hero-call-hotline-btn"
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl bg-transparent hover:bg-white/10 active:bg-white/15 text-white border border-white/80 hover:border-white font-bold text-sm sm:text-base transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 fill-[#88D628] text-[#88D628]" />
                <span>Call: {hotlinePhone}</span>
              </a>
            </div>
          </div>

          {/* Right Column: 55% Form Section (Square Card) */}
          <div className="w-full relative flex items-center justify-center">
            {/* Main Hero Form Card Container - Multi-Step Interactive Quote & Technical Assessment */}
            <MultiStepQuoteForm initialFocusRef={nameInputRef} />
          </div>
        </div>
      </div>
    </section>
  );
}

