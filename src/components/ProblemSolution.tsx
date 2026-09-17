interface ProblemSolutionProps {
  onConsultClick?: () => void;
}

export default function ProblemSolution({ onConsultClick }: ProblemSolutionProps) {
  const handleAction = () => {
    if (onConsultClick) {
      onConsultClick();
    } else {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="problem-solution" className="py-20 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Anchor Image Container (50%) with Double-Frame Offset Outline */}
          <div className="relative flex items-center justify-center order-2 lg:order-1 w-full group pt-5 pl-5 sm:pt-6 sm:pl-6 pb-2 pr-2">
            {/* Top-Left Ambient Theme Glow */}
            <div className="absolute top-0 left-0 w-28 h-28 bg-[#88D628]/25 rounded-full blur-xl pointer-events-none group-hover:bg-[#88D628]/35 transition-colors duration-500 z-0" />

            <div className="relative w-full">
              {/* Background Outline Frame: Same dimensions as the image, offset starting at top-left */}
              <div
                aria-hidden="true"
                className="absolute -top-3.5 -left-3.5 sm:-top-4.5 sm:-left-4.5 w-full h-full rounded-2xl border-[2.4px] border-[#88D628] pointer-events-none transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 z-0"
              />

              {/* Foreground Image Container (Overlapping the background outline) with Deep Navy Outline */}
              <div className="relative z-10 w-full rounded-2xl overflow-hidden border-[2.8px] border-[#0F172A] shadow-md bg-slate-900">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[10/9] bg-slate-900">
                  <img
                    src="https://cdn.phototourl.com/free/2026-09-17-31803d5e-96a6-47ef-9027-106962ea2d7a.png"
                    alt="High-efficiency residential rooftop solar installation"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content (50%) */}
          <div className="space-y-6 order-1 lg:order-2 text-left">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase text-[#0F5A29]">
              <span className="w-2.5 h-2.5 bg-[#0F5A29] shrink-0 inline-block" aria-hidden="true" />
              <span>THE PROBLEM</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              <span className="text-[#0F172A]">Needing to Lower Your </span>
              <span className="text-[#0F5A29]">Electricity Bill?</span>
            </h2>

            <p className="text-lg text-slate-700 font-medium leading-relaxed">
              <strong>Philippine consumers face some of Southeast Asia's highest electricity rates</strong>, placing a heavy drain on household and business budgets. Solareign solves this by engineering custom, PEC-compliant rooftop solar systems with Tier-1 panels and intelligent hybrid inverters that <strong>slash monthly power bills by 60% to 80%</strong> from day one.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed">
              By producing your own clean energy, earning Net Metering credits on surplus power, and providing reliable blackout protection, Solareign transforms recurring utility expenses into 25 years of property equity.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
