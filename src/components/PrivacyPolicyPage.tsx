// PrivacyPolicyPage.tsx
// Solareign Solar Power Services - Privacy Policy

interface PrivacyPolicyPageProps {
  onBackToHome?: () => void;
  onConsultationClick?: () => void;
}

export default function PrivacyPolicyPage({}: PrivacyPolicyPageProps) {
  return (
    <div className="bg-white text-[#0F172A] font-sans antialiased min-h-screen">
      {/* 1. Page Hero Banner (Matching Solareign Hero Design with Dark Atmospheric Gradient) */}
      <section
        id="privacy-hero-header"
        className="relative py-20 sm:py-24 lg:py-28 overflow-hidden bg-gradient-to-r from-[#061B29] via-[#082C1E] to-[#051A10] text-left text-white border-b border-[#0F5A29]/50"
      >
        {/* Atmospheric Background with Dual-Tone Blue & Green Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1800&q=80"
            alt="Solar Panels Rooftop Array Atmosphere"
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
              PRIVACY POLICY
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Structured Content Body Matching Reference Image Flow & Section Placement */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          
          <div className="space-y-10 sm:space-y-12 text-[#1E293B]">
            
            {/* 1. Core Commitment to Information Security */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                1. Core Commitment to Information Security
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                At Solareign Solar Power Services, we prioritize the secure handling of your private telemetry and structural energy data. We are dedicated to ensuring that your details—such as rooftop solar blueprints, active electrical loads, grid offset data, and digital consult metadata—are safeguarded using state-of-the-art encryption layers. No telemetry is shared with uncertified or unvetted external utility contractors without direct manual consent from the primary account supervisor.
              </p>
            </div>

            {/* 2. Types of Telemetry & Core Data Collected */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                2. Types of Telemetry &amp; Core Data Collected
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                When utilizing the Solareign Solar ecosystem, we collect data to provide, audit, and improve solar installations:
              </p>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-600 pl-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#0F5A29] font-black text-lg leading-none select-none mt-0.5">•</span>
                  <span>
                    <strong className="font-bold text-[#0F172A]">Identity Parameters:</strong> Your full name, contact information, billing records, and structural property location parameters.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0F5A29] font-black text-lg leading-none select-none mt-0.5">•</span>
                  <span>
                    <strong className="font-bold text-[#0F172A]">Solar Telemetry Data:</strong> Real-time PV generation stats, load profiles, inverter battery capacities, and ambient temperature readouts.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0F5A29] font-black text-lg leading-none select-none mt-0.5">•</span>
                  <span>
                    <strong className="font-bold text-[#0F172A]">Consultation Metadata:</strong> Your inputs to the dynamic ROI calculators, design preferences, and communication records with our engineering staff.
                  </span>
                </li>
              </ul>
            </div>

            {/* 3. Data Retention, Processing & Storage Limits */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                3. Data Retention, Processing &amp; Storage Limits
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We process information in accordance with national Data Privacy legislation (RA 10173). Standard operational telemetry (e.g., historical PV yield data) is archived for up to 10 years to support structural solar asset warranties. Personal identifiers are heavily sandboxed and can be permanently purged upon verified account closure requests, unless required otherwise for building-permit compliance or municipal net-metering legal frameworks.
              </p>
            </div>

            {/* 4. Encryption Protocols & Security Safeguards */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                4. Encryption Protocols &amp; Security Safeguards
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                All customer telemetry transit is encrypted under TLS 1.3 protocols, and stationary server databases are fortified with 256-bit AES encryption. Access permissions are closely audited, restricting entry only to certified field specialists and system administrators.
              </p>
            </div>

            {/* 5. Regulatory Compliance and Data Portability */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                5. Regulatory Compliance and Data Portability
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Account holders maintain absolute rights to inspect, download, correct, or request the erasure of personal telemetry arrays. Any formal request submitted to our operations desk will be resolved within 14 business days.
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
              <span>REGULATORY LEGAL DEPARTMENT</span>
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
