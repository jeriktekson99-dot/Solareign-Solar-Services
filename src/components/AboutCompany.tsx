interface AboutCompanyProps {
  onLearnMoreClick?: () => void;
}

export default function AboutCompany({ onLearnMoreClick: _onLearnMoreClick }: AboutCompanyProps) {
  return (
    <section id="about" className="py-20 bg-slate-100 border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Content (50%) */}
          <div className="space-y-6 text-left order-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase text-[#0F5A29]">
              <span className="w-2.5 h-2.5 bg-[#0F5A29] shrink-0 inline-block" aria-hidden="true" />
              <span>GOAL AND VISION</span>
            </div>

            {/* Header */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              <span className="text-[#0F172A]">Powering Tomorrow. </span>
              <br className="hidden sm:inline" />
              <span className="text-[#0F5A29]">Your Solar Partner.</span>
            </h2>

            <p className="text-lg text-slate-700 font-medium leading-relaxed">
              <strong>Solareign Solar Power Services</strong> is a trusted solar energy solutions provider proudly based in <strong>Bacoor City, Cavite</strong>. We design, supply, and commission high-performance renewable power infrastructures for residential rooftops and commercial establishments.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed">
              Founded on the principles of engineering precision, premium hardware standards, and client-first after-sales commitment, Solareign guides clients every step of the way—from initial energy audit and structural rooftop analysis to net-metering utility approvals and long-term preventive maintenance.
            </p>
          </div>

          {/* Right Column: Visual Anchor Image Container (50%) with Alternating Top-Right Double Frame Outline */}
          <div className="relative flex items-center justify-center order-2 w-full group pt-5 pr-5 sm:pt-6 sm:pr-6 pb-2 pl-2">
            {/* Top-Right Ambient Theme Glow */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#88D628]/25 rounded-full blur-xl pointer-events-none group-hover:bg-[#88D628]/35 transition-colors duration-500 z-0" />

            <div className="relative w-full">
              {/* Background Outline Frame: Same dimensions as image, offset starting at top-right (Alternating) */}
              <div
                aria-hidden="true"
                className="absolute -top-3.5 -right-3.5 sm:-top-4.5 sm:-right-4.5 w-full h-full rounded-2xl border-[2.4px] border-[#88D628] pointer-events-none transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 z-0"
              />

              {/* Foreground Image Container (Overlapping the background outline) with Deep Navy Outline */}
              <div className="relative z-10 w-full rounded-2xl overflow-hidden border-[2.8px] border-[#0F172A] shadow-md bg-slate-900">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[10/9] bg-slate-900">
                  <img
                    src="https://cdn.phototourl.com/free/2026-09-17-43fda447-68c3-4284-8cb8-b1f11dbc19c0.png"
                    alt="Solareign Solar Power Services installation team in Cavite"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
