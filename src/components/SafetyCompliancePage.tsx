// SafetyCompliancePage.tsx
// Solareign Solar Power Services - Safety Standard Compliance

interface SafetyCompliancePageProps {
  onBackToHome?: () => void;
  onConsultationClick?: () => void;
}

export default function SafetyCompliancePage({}: SafetyCompliancePageProps) {
  return (
    <div className="bg-white text-[#0F172A] font-sans antialiased min-h-screen">
      {/* 1. Page Hero Banner (Matching Solareign Hero Design with Dark Atmospheric Gradient) */}
      <section
        id="safety-hero-header"
        className="relative py-20 sm:py-24 lg:py-28 overflow-hidden bg-gradient-to-r from-[#061B29] via-[#082C1E] to-[#051A10] text-left text-white border-b border-[#0F5A29]/50"
      >
        {/* Atmospheric Background with Dual-Tone Blue & Green Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=80"
            alt="Safety Electrical Audit and Inverter Safety Diagnostics"
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
              SAFETY STANDARD COMPLIANCE
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Structured Content Body Matching Reference Image Flow & Section Placement */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="space-y-10 sm:space-y-12 text-[#1E293B]">
            
            {/* 1. Mandatory Electrical & Structural Code Adherence */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                1. Mandatory Electrical &amp; Structural Code Adherence
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Every photovoltaic system deployed by Solareign Solar Power Services is engineered in strict compliance with the Philippine Electrical Code (PEC 2017 Edition), the National Structural Code of the Philippines (NSCP 2015), and IEEE 1547 standards for interconnection and interoperability of distributed energy resources. All electrical layouts, conductor gauge selections, conduit routings, and overcurrent protections exceed standard residential and commercial safety tolerances.
              </p>
            </div>

            {/* 2. Core Hardware Safety Systems & Field Protections */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                2. Core Hardware Safety Systems &amp; Field Protections
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Every Solareign solar power array incorporates multi-tiered hardware protections to safeguard occupants, structural assets, and utility workers:
              </p>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-600 pl-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#0F5A29] font-black text-lg leading-none select-none mt-0.5">•</span>
                  <span>
                    <strong className="font-bold text-[#0F172A]">Rapid Shutdown &amp; DC Isolation:</strong> Certified rooftop rapid shutdown switches and lockable DC disconnect enclosures situated within arm's reach of inverter banks, dropping circuit voltage below 30 volts within 10 seconds during emergency shutoffs.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0F5A29] font-black text-lg leading-none select-none mt-0.5">•</span>
                  <span>
                    <strong className="font-bold text-[#0F172A]">Dual Surge Protection Devices (SPD):</strong> Dedicated Class II Type 2 AC and DC surge arrestors protecting inverters and delicate consumer appliances from indirect lightning transients and utility switching spikes.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0F5A29] font-black text-lg leading-none select-none mt-0.5">•</span>
                  <span>
                    <strong className="font-bold text-[#0F172A]">Solid Grounding &amp; Insulation Verification:</strong> Dedicated solid-copper earth grounding rods (measuring &lt; 5 ohms earth resistance) alongside pre-commissioning megohmmeter insulation resistance tests on all DC string conductors.
                  </span>
                </li>
              </ul>
            </div>

            {/* 3. Roofing Structural Integrity & Wind-Load Engineering */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                3. Roofing Structural Integrity &amp; Wind-Load Engineering
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Rooftop mounting rails utilize corrosion-resistant anodized aluminum (AL6005-T5) paired with marine-grade SS304 stainless steel fasteners. Mounting geometry is engineered to withstand tropical typhoons with wind speeds of up to 260 km/h. Roof penetrations feature industrial EPDM compression gaskets combined with polyurethane sealants, providing a 100% weather-sealed and leak-free structural guarantee.
              </p>
            </div>

            {/* 4. Professional Electrical Engineer (PEE) Sign-Off Cadence */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                4. Professional Electrical Engineer (PEE) Sign-Off Cadence
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Prior to system energization, all single-line diagrams (SLD), structural load calculations, and equipment schedules are reviewed, signed, and dry-sealed by a licensed Professional Electrical Engineer (PEE). This documentation satisfies all requirements for municipal building permits, Bureau of Fire Protection (BFP) clearances, and formal distribution utility (e.g. Meralco) net-metering approvals.
              </p>
            </div>

            {/* 5. Continuous Commissioning Audits & Safety Recertification */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                5. Continuous Commissioning Audits &amp; Safety Recertification
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Following energization, Solareign provides scheduled preventive maintenance checks, including calibrated thermal infrared imaging to detect potential cell micro-cracks or hot spots, terminal torque verifications, and inverter firmware safety updates. Field engineers remain on call 24/7 for urgent technical inspections and electrical safety queries.
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
              <span>ENGINEERING SAFETY &amp; CODE COMPLIANCE</span>
            </div>
            <div className="text-slate-400 font-sans normal-case text-xs">
              PEC 2017 &amp; IEEE 1547 Certified
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
