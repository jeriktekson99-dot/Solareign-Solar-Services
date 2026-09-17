import type { ReactNode } from 'react';
import { 
  Check,
  BatteryCharging, 
  Zap, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  FileCheck, 
  type LucideIcon 
} from 'lucide-react';

interface ServicesPageProps {
  onConsultationClick?: (preset?: string) => void;
}

export default function ServicesPage({ onConsultationClick: _onConsultationClick }: ServicesPageProps) {
  // Service Modules Data matching Reference Structural Flow with all 6 Offered Services
  const serviceModules: Array<{
    id: string;
    specTag: string;
    title: string;
    category: string;
    description: ReactNode;
    image: string;
    imageAlt: string;
    imageLeft: boolean;
    features: string[];
    icon: LucideIcon;
    badgeText: string;
    tiltDirection: 'left' | 'right';
  }> = [
    {
      id: 'module-01',
      specTag: 'Service Module 01',
      title: 'Battery Backup Installation',
      category: 'Energy Storage & Resilience',
      description:
        'Safeguard your entire property from unexpected utility blackouts with advanced lithium storage systems engineered to deliver seamless automated backup power, keeping essential household appliances and delicate smart electronics energized.',
      image: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Solareign technician with LiFePO4 battery backup energy storage system',
      imageLeft: true,
      features: [
        'Size battery capacity carefully.',
        'Mount storage units securely.',
        'Wire battery management.',
        'Program backup discharge.',
        'Test emergency cut-off switches.',
        'Verify full safety codes.',
      ],
      icon: BatteryCharging,
      badgeText: 'Home Battery Storage',
      tiltDirection: 'left',
    },
    {
      id: 'module-02',
      specTag: 'Service Module 02',
      title: 'Whole-Home UPS/Inverter Upgrades',
      category: 'Power Conditioning & Inverters',
      description:
        'Upgrade your existing solar setup with intelligent hybrid inverters that deliver pure sine electricity, rapid automated transfer switching, and superior surge capacity capable of starting heavy motor loads reliably.',
      image: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Modern whole-home smart hybrid inverter and UPS power board installation',
      imageLeft: false,
      features: [
        'Inspect existing home wiring.',
        'Disconnect legacy units safely.',
        'Mount hybrid units firmly.',
        'Configure routing parameters.',
        'Calibrate voltage accurately.',
        'Test systems under load.',
      ],
      icon: Zap,
      badgeText: 'Smart Inverter Upgrade',
      tiltDirection: 'right',
    },
    {
      id: 'module-03',
      specTag: 'Service Module 03',
      title: 'Panel Cleaning & Inspection',
      category: 'Efficiency & Preventive Maintenance',
      description:
        'Restore peak generation efficiency to your photovoltaic modules using spot free deionized water filtration, gentle rotating brushes, and thermal imaging diagnostics to identify microscopic surface defects and hidden faults.',
      image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Professional solar panel cleaning and thermal inspection by Solareign',
      imageLeft: true,
      features: [
        'Check for surface cracks.',
        'Use deionized water safely.',
        'Clean wiring box seals.',
        'Inspect mounting hardware tightly.',
        'Measure electrics accurately.',
        'Measure electrical output.',
      ],
      icon: Sparkles,
      badgeText: 'Routine Maintenance',
      tiltDirection: 'left',
    },
    {
      id: 'module-04',
      specTag: 'Service Module 04',
      title: 'Performance Monitoring Setup',
      category: 'Smart IoT & Telemetry Analytics',
      description:
        'Gain complete visibility over your solar harvest, building consumption, and battery reserves with smart telemetry meters and cloud connected software that streams real time operational statistics directly to smartphones.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Solar real-time performance monitoring dashboard and IoT mobile telemetry',
      imageLeft: false,
      features: [
        'Install data communication gateways.',
        'Connect hardware to Wi-Fi.',
        'Setup client mobile accounts.',
        'Calibrate production meters.',
        'Enable automated system alerts.',
        'Guide clients through navigation.',
      ],
      icon: Activity,
      badgeText: 'Mobile App Monitoring',
      tiltDirection: 'right',
    },
    {
      id: 'module-05',
      specTag: 'Service Module 05',
      title: 'System Health Checks & Inverter Diagnostics',
      category: 'Electrical Audits & Safety Compliance',
      description:
        'Ensure maximum electrical safety and regulatory compliance through certified audits, insulation resistance testing, voltage evaluations, and complete inverter diagnostic checks designed to identify operational hazards before they compromise generation.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Certified engineer testing inverter diagnostics and solar electrical safety',
      imageLeft: true,
      features: [
        'Test string voltage levels.',
        'Scan for thermal hotspots.',
        'Analyze historical generation logs.',
        'Check terminal connections.',
        'Verify grounding system.',
        'Issue detailed repair quotes.',
      ],
      icon: ShieldCheck,
      badgeText: 'Safety & System Audit',
      tiltDirection: 'left',
    },
    {
      id: 'module-06',
      specTag: 'Service Module 06',
      title: 'Net Metering Application Assistance',
      category: 'Utility Interconnection & Grid Monetization',
      description:
        'Monetize your excess solar energy through comprehensive utility documentation, bidirectional meter engineering, and distribution utility coordination designed to credit surplus clean power back into your monthly electric utility bills.',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Utility electric meter and solar net-metering grid interconnection documentation',
      imageLeft: false,
      features: [
        'Compile utility paperwork.',
        'Submit documents to utilities.',
        'Coordinate official site audits.',
        'Track application status closely.',
        'Facilitate bi-directional meter.',
        'Confirm active export credits.',
      ],
      icon: FileCheck,
      badgeText: 'Utility Net Metering',
      tiltDirection: 'right',
    },
  ];

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* 1. Page Hero Banner (matching Reference Structural Flow) */}
      <section
        id="services-hero-header"
        className="relative py-20 sm:py-24 lg:py-28 overflow-hidden bg-gradient-to-r from-[#061B29] via-[#082C1E] to-[#051A10] text-left text-white border-b border-[#0F5A29]/50"
      >
        {/* Atmospheric Background with Dual-Tone Blue & Green Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1800&q=80"
            alt="Commercial and Residential Solar Array Atmosphere"
            className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          {/* Dark Blue-Green Gradient Overlay Fading Left to Right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061B29]/95 via-[#082C1E]/90 to-[#0F5A29]/70" />
          <div className="absolute inset-0 bg-radial-at-c from-sky-950/30 via-[#061B29]/50 to-[#061B29]" />

          {/* Ambient Blue & Green Lighting Orbs */}
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
          <div className="max-w-3xl">
            {/* Main Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight">
              OUR SERVICES
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Alternating Service Sections */}
      <div id="services-modules-list">
        {serviceModules.map((module, idx) => {
          const isWhite = idx % 2 === 0;
          const isImageLeft = module.imageLeft;

          return (
            <section
              key={module.id}
              id={module.id}
              className={`py-20 sm:py-24 lg:py-[100px] border-b border-slate-200/80 transition-colors duration-200 ${
                isWhite ? 'bg-white' : 'bg-slate-100'
              }`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch ${
                    !isImageLeft ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Visual Image Container with Double Frame Offset Outline (Height Aligned to Information) */}
                  <div
                    className={`lg:col-span-6 relative flex flex-col h-full group ${
                      isImageLeft
                        ? 'pt-4 pl-4 sm:pt-5 sm:pl-5 pb-1 pr-1 lg:order-1'
                        : 'pt-4 pr-4 sm:pt-5 sm:pr-5 pb-1 pl-1 lg:order-2'
                    }`}
                  >
                    {/* Ambient Theme Glow */}
                    <div
                      className={`absolute w-28 h-28 bg-[#88D628]/25 rounded-full blur-xl pointer-events-none group-hover:bg-[#88D628]/35 transition-colors duration-500 z-0 ${
                        isImageLeft ? 'top-0 left-0' : 'top-0 right-0'
                      }`}
                    />

                    <div className="relative w-full h-full flex-1 flex flex-col min-h-[340px] lg:min-h-0">
                      {/* Background Outline Frame: Same dimensions as image, offset starting at top-left or top-right */}
                      <div
                        aria-hidden="true"
                        className={`absolute w-full h-full rounded-2xl border-[2.4px] border-[#88D628] pointer-events-none transition-transform duration-300 z-0 ${
                          isImageLeft
                            ? '-top-3.5 -left-3.5 sm:-top-4.5 sm:-left-4.5 group-hover:-translate-x-1 group-hover:-translate-y-1'
                            : '-top-3.5 -right-3.5 sm:-top-4.5 sm:-right-4.5 group-hover:translate-x-1 group-hover:-translate-y-1'
                        }`}
                      />

                      {/* Main Foreground Rounded Image Frame with Deep Navy Outline */}
                      <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden bg-slate-900 border-[2.8px] border-[#0F172A] shadow-md flex-1 flex flex-col">
                        <div className="relative w-full h-full flex-1 min-h-[320px] lg:min-h-0 overflow-hidden">
                          <img
                            src={module.image}
                            alt={module.imageAlt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Block matching Reference Structural Flow */}
                  <div
                    className={`lg:col-span-6 text-left flex flex-col justify-center ${
                      !isImageLeft ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    {/* Structural Placement 1: Eyebrow with Indicator Square + Category */}
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black tracking-widest text-[#0F5A29] uppercase mb-3 sm:mb-4">
                      <span className="w-2.5 h-2.5 bg-[#0F5A29] shrink-0 inline-block" aria-hidden="true" />
                      <span>{module.specTag}</span>
                    </div>

                    {/* Structural Placement 2: High-Contrast Prominent Title-Cased Headline */}
                    <h2 className="text-[33px] font-black text-[#0F172A] tracking-tight leading-tight mb-4 sm:mb-5">
                      {module.title}
                    </h2>

                    {/* Structural Placement 3: Narrative Body Paragraph */}
                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 font-normal">
                      {module.description}
                    </p>

                    {/* Structural Placement 4: Key Capabilities & Standards Subheading */}
                    <div className="space-y-4 pt-1">
                      <h3 className="text-xs sm:text-sm font-black tracking-widest uppercase text-[#0F172A]">
                        KEY CAPABILITIES &amp; STANDARDS
                      </h3>

                      {/* Structural Placement 5: 2-Column Technical Checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3.5 sm:gap-y-4">
                        {module.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                              <Check className="w-3 h-3 text-[#0F5A29]" strokeWidth={2.8} />
                            </div>
                            <span className="text-sm sm:text-[15px] font-semibold text-slate-800 leading-snug">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
