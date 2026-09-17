// TermsOfUsePage.tsx
// Solareign Solar Power Services - Terms of Use

interface TermsOfUsePageProps {
  onBackToHome?: () => void;
  onConsultationClick?: () => void;
}

export default function TermsOfUsePage({}: TermsOfUsePageProps) {
  return (
    <div className="bg-white text-[#0F172A] font-sans antialiased min-h-screen">
      {/* 1. Page Hero Banner (Matching Solareign Hero Design with Dark Atmospheric Gradient) */}
      <section
        id="terms-hero-header"
        className="relative py-20 sm:py-24 lg:py-28 overflow-hidden bg-gradient-to-r from-[#061B29] via-[#082C1E] to-[#051A10] text-left text-white border-b border-[#0F5A29]/50"
      >
        {/* Atmospheric Background with Dual-Tone Blue & Green Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1800&q=80"
            alt="Solar Inverter and Structural Engineering Workspace"
            className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          {/* Dark Blue-Green Gradient Overlay Fading Left to Right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061B29]/95 via-[#082C1E]/90 to-[#0F5A29]/70" />
          <div className="absolute inset-0 bg-radial-at-c from-sky-950/30 via-[#061B29]/50 to-[#061B29]" />

          {/* Ambient Lighting Glows */}
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-20 w-96 h-96 bg-sky-500/18 rounded-full blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#88D628]/15 rounded-full blur-3xl pointer-events-none"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Main Display Headline Matching Reference Image */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight">
              TERMS OF USE
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Structured Content Body Matching Reference Image Flow & Section Placement */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="space-y-10 sm:space-y-12 text-[#1E293B]">
            
            {/* 1. Scope of Engineering & Service Undertakings */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                1. Scope of Engineering &amp; Service Undertakings
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Solareign Solar Power Services executes turnkey photovoltaic engineering, including rooftop structural assessments, electrical load auditing, procurement of Tier-1 solar modules and smart inverters, municipal permitting, and utility net-metering interconnection. All proposals and financial yield projections prepared by Solareign reflect verified PVsyst meteorological datasets and local utility billing tariffs applicable at the time of quotation.
              </p>
            </div>

            {/* 2. Performance Projections, Hardware & Linear Warranties */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                2. Performance Projections, Hardware &amp; Linear Warranties
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                When commissioning an installation through Solareign Solar Power Services, client protections and equipment warranties include:
              </p>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-600 pl-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#0F5A29] font-black text-lg leading-none select-none mt-0.5">•</span>
                  <span>
                    <strong className="font-bold text-[#0F172A]">25-Year Linear Output Guarantee:</strong> Guaranteed minimum 84.8% photovoltaic module generation efficiency over 25 years under standard testing conditions (STC).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0F5A29] font-black text-lg leading-none select-none mt-0.5">•</span>
                  <span>
                    <strong className="font-bold text-[#0F172A]">10-Year Inverter &amp; Storage Coverage:</strong> Direct manufacturer replacement coverage for grid-tie and smart hybrid inverters, automatic transfer switches, and lithium battery management systems.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0F5A29] font-black text-lg leading-none select-none mt-0.5">•</span>
                  <span>
                    <strong className="font-bold text-[#0F172A]">5-Year Workmanship &amp; Waterproofing Guarantee:</strong> Comprehensive guarantee covering mounting integrity, cable raceway fittings, DC isolation boxes, and leak-proof roof seal penetrations.
                  </span>
                </li>
              </ul>
            </div>

            {/* 3. Property Owner Prerequisites & Site Access Guidelines */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                3. Property Owner Prerequisites &amp; Site Access Guidelines
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                The property owner agrees to grant certified Solareign engineering personnel unhindered access to roof areas, main distribution electrical service panels (MDP), and internet routers required for smart solar monitoring setup. The owner certifies that the mounting superstructure and roof truss network meet standard structural integrity criteria or agrees to remedial reinforcements prior to panel placement.
              </p>
            </div>

            {/* 4. Grid Interconnection, Net-Metering & Utility Dependency */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                4. Grid Interconnection, Net-Metering &amp; Utility Dependency
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Utility net-metering approval timelines are governed by local distribution utilities (e.g., Meralco, PELCO, FLECO) and the Energy Regulatory Commission (ERC). While Solareign manages all technical documentation, single-line diagrams, and testing coordination, utility meter swap schedules remain subject to utility procedural queues. Standard grid-tied inverters automatically isolate during utility outages per anti-islanding safety codes unless an active battery storage or hybrid backup system is installed.
              </p>
            </div>

            {/* 5. Contractual Governance & Dispute Resolution */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                5. Contractual Governance &amp; Dispute Resolution
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                These terms are governed by and construed in accordance with the laws of the Republic of the Philippines. Any unresolved dispute arising from engineering work or service agreements shall first undergo amicable mediation before the appropriate courts of Cavite or Metro Manila.
              </p>
            </div>

          </div>

          {/* Reference Image Structural Divider */}
          <div className="border-t border-slate-200 mt-14 mb-8" />

          {/* Sub-footer Tagline */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-medium tracking-wider text-slate-400 uppercase">
            <div className="flex flex-wrap items-center gap-2">
              <span>SOLAREIGN SOLAR POWER SERVICES</span>
              <span className="text-slate-300 select-none" aria-hidden="true">•</span>
              <span>LEGAL &amp; CONTRACTUAL GOVERNANCE</span>
            </div>
            <div className="text-slate-400 font-sans normal-case text-xs">
              Last updated: September 2026
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
