import { 
  Award, 
  BatteryCharging, 
  Zap, 
  Sun, 
  Building2, 
  Sparkles, 
  Wrench, 
  Target, 
  Eye, 
  HeartHandshake, 
  Sliders, 
  ArrowRight,
  Home,
  Factory,
  ChevronRight,
  Activity,
  ShieldCheck,
  FileCheck,
  type LucideIcon
} from 'lucide-react';

interface AboutPageProps {
  onConsultationClick: () => void;
  onNavigateServices?: () => void;
}

export default function AboutPage({ onConsultationClick, onNavigateServices }: AboutPageProps) {
  // Section 3: Offered Services (Core Capabilities Overview) - 6 Core Services
  const offeredServices: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    icon: LucideIcon;
  }> = [
    {
      id: 'battery-backup-installation',
      title: 'Battery Backup Installation',
      description: 'Engineered lithium iron phosphate (LiFePO4) storage systems providing sub-10ms automatic switchover for continuous power during blackouts.',
      image: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=800&q=80',
      icon: BatteryCharging,
    },
    {
      id: 'ups-inverter-upgrades',
      title: 'Whole-Home UPS/Inverter Upgrades',
      description: 'Smart hybrid inverters and whole-home uninterruptible power supply configurations delivering pure sine-wave energy and heavy surge handling.',
      image: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=800&q=80',
      icon: Zap,
    },
    {
      id: 'panel-cleaning-inspection',
      title: 'Panel Cleaning & Inspection',
      description: 'Deionized water panel washing, thermal infrared hot-spot diagnostics, and electrical testing to restore 15% to 25% lost energy yield.',
      image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=800&q=80',
      icon: Sparkles,
    },
    {
      id: 'performance-monitoring-setup',
      title: 'Performance Monitoring Setup',
      description: 'Enterprise IoT energy meters and cloud monitoring gateways streaming real-time production, grid export, and battery stats to your phone.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      icon: Activity,
    },
    {
      id: 'system-health-checks-inverter-diagnostics',
      title: 'System Health Checks & Inverter Diagnostics',
      description: 'Comprehensive diagnostic audits, I-V curve tracing, insulation resistance testing, and PEC 2017 electrical safety compliance verification.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      icon: ShieldCheck,
    },
    {
      id: 'net-metering-application-assistance',
      title: 'Net Metering Application Assistance',
      description: 'Turnkey Meralco and distribution utility coordination, bi-directional metering compliance, and PEE-signed documentation to monetize surplus solar power.',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
      icon: FileCheck,
    },
  ];

  // Section 4: Organizational DNA - The Principles of Power
  const coreValues = [
    {
      id: 'tier-1-solar-tech',
      num: '01',
      title: 'Tier-1 Solar Technology',
      description:
        'We deploy exclusively ultra-efficiency mono-crystalline photovoltaic panels paired with industrial-grade micro-inverters. Tested for extreme tropical, maritime, and seismic resilience.',
    },
    {
      id: 'certified-master-installers',
      num: '02',
      title: 'Certified Master Installers',
      description:
        'Every field technician holds certified professional safety and roofing credentials. We execute clean, worry-free mounting with weather-sealed structural guarantees.',
    },
    {
      id: 'guaranteed-roi-tracking',
      num: '03',
      title: 'Guaranteed ROI Tracking',
      description:
        'Monitor live conversion metrics, grid exports, and real-time dollar-savings on our custom mobile dashboard. Transparent diagnostics that prove your investment pays back immediately.',
    },
  ];

  return (
    <div className="bg-white text-[#0F172A] font-sans antialiased">
      {/* 1. Page Hero Banner (matching Reference Structural Flow) */}
      <section
        id="about-hero"
        className="relative py-20 sm:py-24 lg:py-28 overflow-hidden bg-gradient-to-r from-[#061B29] via-[#082C1E] to-[#051A10] text-left text-white border-b border-[#0F5A29]/50"
      >
        {/* Atmospheric Background with Dual-Tone Blue & Green Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1800&q=80"
            alt="Solar Rooftop Atmosphere"
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
              ABOUT US
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Company Heritage & Overview (White Section) */}
      <section id="about-overview" className="py-20 bg-white border-b border-slate-200/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Visual Anchor Image Container (50%) with Top-Left Double-Frame Outline */}
            <div className="relative flex items-center justify-center order-2 lg:order-1 w-full group pt-5 pl-5 sm:pt-6 sm:pl-6 pb-2 pr-2">
              {/* Top-Left Ambient Theme Glow */}
              <div className="absolute top-0 left-0 w-28 h-28 bg-[#88D628]/25 rounded-full blur-xl pointer-events-none group-hover:bg-[#88D628]/35 transition-colors duration-500 z-0" />

              <div className="relative w-full">
                {/* Background Outline Frame: Same dimensions as image, offset starting at top-left */}
                <div
                  aria-hidden="true"
                  className="absolute -top-3.5 -left-3.5 sm:-top-4.5 sm:-left-4.5 w-full h-full rounded-2xl border-[2.4px] border-[#88D628] pointer-events-none transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 z-0"
                />

                {/* Foreground Image Container (Overlapping background outline) with Deep Navy Outline */}
                <div className="relative z-10 w-full rounded-2xl overflow-hidden border-[2.8px] border-[#0F172A] shadow-md bg-slate-900">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[10/9] bg-slate-900">
                    <img
                      src="https://cdn.phototourl.com/free/2026-09-17-a079cea0-b252-44b5-a28e-9b9430b0f5cc.png"
                      alt="Completed rooftop solar installation in Cavite by Solareign"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback) {
                          target.dataset.triedFallback = 'true';
                          target.src = 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80';
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
              {/* Header / Sub-tag */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase text-[#0F5A29]">
                <span className="w-2.5 h-2.5 bg-[#0F5A29] shrink-0 inline-block" aria-hidden="true" />
                <span>FOUND IN 2020</span>
              </div>

              {/* Main Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                <span className="text-[#0F172A]">Powering Cavite with </span>
                <br className="hidden sm:block" />
                <span className="text-[#0F5A29]">Sustainable Solar</span>
              </h2>

              {/* Content Narrative */}
              <p className="text-lg text-slate-700 font-medium leading-relaxed">
                <strong>Founded in 2020 in Bacoor City, Cavite</strong>, Solareign provides turnkey solar solutions that protect homes and businesses from rising utility rates and grid blackouts. We deliver high-efficiency systems designed to <strong>maximize savings and ensure true long-term energy independence</strong>.
              </p>

              <p className="text-lg text-slate-600 leading-relaxed">
                From comprehensive load audits to full net-metering utility approvals, our certified team powers your property reliably with sustainable, cost-effective clean energy tailored for your unique operational and household power requirements.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 2b. Company Heritage & Overview - Reversed Layout (Grey Section) */}
      <section id="about-overview-reversed" className="py-20 bg-slate-100 border-b border-slate-200/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Information / Content (50%) */}
            <div className="space-y-6 text-left order-1">
              {/* Header / Sub-tag */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase text-[#0F5A29]">
                <span className="w-2.5 h-2.5 bg-[#0F5A29] shrink-0 inline-block" aria-hidden="true" />
                <span>FOUNDED ON IMPACT</span>
              </div>

              {/* Main Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                <span className="text-[#0F172A]">Clean Energy Built for </span>
                <br className="hidden sm:block" />
                <span className="text-[#0F5A29]">Lasting Savings</span>
              </h2>

              {/* Content Narrative */}
              <p className="text-lg text-slate-700 font-medium leading-relaxed">
                <strong>Our organization is built on genuine economic and environmental impact</strong>—delivering dependable renewable infrastructure that creates generational value. Every kilowatt installed is engineered to yield <strong>immediate, verifiable reductions in your monthly electric expenses</strong>.
              </p>

              <p className="text-lg text-slate-600 leading-relaxed">
                Through uncompromised Tier-1 hardware, strict zero-leak mounting protocols, and client-first after-sales maintenance, Solareign ensures that your transition to solar pays back rapidly and performs reliably for decades.
              </p>
            </div>

            {/* Right Column: Visual Anchor Image Container (50%) with Alternating Top-Right Double-Frame Outline */}
            <div className="relative flex items-center justify-center order-2 w-full group pt-5 pr-5 sm:pt-6 sm:pr-6 pb-2 pl-2">
              {/* Top-Right Ambient Theme Glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#88D628]/25 rounded-full blur-xl pointer-events-none group-hover:bg-[#88D628]/35 transition-colors duration-500 z-0" />

              <div className="relative w-full">
                {/* Background Outline Frame: Same dimensions as image, offset starting at top-right (Alternating) */}
                <div
                  aria-hidden="true"
                  className="absolute -top-3.5 -right-3.5 sm:-top-4.5 sm:-right-4.5 w-full h-full rounded-2xl border-[2.4px] border-[#88D628] pointer-events-none transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 z-0"
                />

                {/* Foreground Image Container (Overlapping background outline) with Deep Navy Outline */}
                <div className="relative z-10 w-full rounded-2xl overflow-hidden border-[2.8px] border-[#0F172A] shadow-md bg-slate-900">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[10/9] bg-slate-900">
                    <img
                      src="https://cdn.phototourl.com/free/2026-09-17-b66f4b5e-f095-489b-b4e0-a8a735f4a4cb.png"
                      alt="Completed rooftop solar installation in Cavite by Solareign"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback) {
                          target.dataset.triedFallback = 'true';
                          target.src = 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80';
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

      {/* SECTION 3: Offered Services (Core Capabilities Overview - White Section) */}
      <section id="offered-services-overview" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header matching Offered Services Layout */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
            {/* Subtitle, Header Title, and Subtext on the Left */}
            <div className="space-y-3 max-w-2xl text-left">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase text-[#0F5A29]">
                <span className="w-2.5 h-2.5 bg-[#0F5A29] shrink-0 inline-block" aria-hidden="true" />
                <span>OUR CORE CAPABILITIES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                <span className="text-[#0F172A]">Solar Infrastructure. </span>
                <br className="hidden sm:block" />
                <span className="text-[#0F5A29]">Integrated End-to-End.</span>
              </h2>
            </div>

            {/* Hyperlink: Explore More on the Right */}
            <div className="flex items-center md:justify-end shrink-0">
              <button
                type="button"
                id="about-explore-services-btn"
                onClick={onNavigateServices || onConsultationClick}
                className="group inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#0F5A29] hover:text-[#0b421e] transition-all cursor-pointer py-1"
              >
                <span className="underline underline-offset-4 decoration-2">Explore More</span>
                <ArrowRight className="w-4 h-4 text-[#0F5A29] group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* 3-Column Responsive Grid matching Offered Services Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offeredServices.map((service, index) => {
              const IconComponent = service.icon;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={service.id}
                  className="group relative flex flex-col h-full"
                >
                  {/* Corner Shine 1: Top-Left (Theme Color - Lime / Green) */}
                  <div
                    className={`absolute -top-1.5 -left-1.5 w-20 h-20 rounded-full blur-md pointer-events-none transition-colors duration-500 ${
                      isEven
                        ? 'bg-[#88D628]/25 group-hover:bg-[#88D628]/40'
                        : 'bg-[#0F5A29]/25 group-hover:bg-[#0F5A29]/40'
                    }`}
                  />

                  {/* Corner Shine 2: Top-Right (Theme Color - Green / Lime) */}
                  <div
                    className={`absolute -top-1.5 -right-1.5 w-20 h-20 rounded-full blur-md pointer-events-none transition-colors duration-500 ${
                      isEven
                        ? 'bg-[#0F5A29]/25 group-hover:bg-[#0F5A29]/40'
                        : 'bg-[#88D628]/25 group-hover:bg-[#88D628]/40'
                    }`}
                  />

                  {/* Outline Container: Gradient highlighting Top-Left and Top-Right corners with theme colors */}
                  <div
                    id={`capability-card-${index + 1}`}
                    className={`relative w-full h-full p-[2.5px] rounded-2xl ${
                      isEven
                        ? 'bg-gradient-to-r from-[#88D628] via-slate-200 to-[#0F5A29]'
                        : 'bg-gradient-to-r from-[#0F5A29] via-slate-200 to-[#88D628]'
                    } shadow-md group-hover:shadow-xl transition-all duration-300 flex flex-col`}
                  >
                    {/* Inner Card Container */}
                    <div className="relative w-full h-full flex flex-col justify-between rounded-[13.5px] bg-[#F8FAFC] hover:bg-white overflow-hidden text-left flex-1">
                      {/* Top Image Container */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Overlapping Floating Icon Badge */}
                      <div className="relative -mt-6 ml-5 z-10 w-12 h-12 rounded-xl bg-white border border-slate-200/90 shadow-md flex items-center justify-center text-[#0F5A29] group-hover:bg-[#0F5A29] group-hover:text-white group-hover:border-[#88D628] transition-colors duration-300">
                        <IconComponent className="w-6 h-6 transition-transform group-hover:scale-110" />
                      </div>

                      {/* Card Body & Text Content */}
                      <div className="p-5 pt-3 flex-grow flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#0F5A29] transition-colors leading-snug">
                            {service.title}
                          </h3>
                        </div>

                        {/* Bottom Action: View Specifications */}
                        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={onConsultationClick}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F5A29] group-hover:text-[#0b421e] hover:underline cursor-pointer"
                          >
                            <span>View Specifications</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#0F5A29]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 4: Our Mission & Vision (Grey Section) */}
      <section id="mission-vision" className="py-20 bg-slate-100 border-b border-slate-200/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Dual Structural Flow Layout with Signature Double-Frame Outline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
            
            {/* Card 1: Our Mission with Signature Double-Frame Outline (Top-Left Offset) */}
            <div className="relative flex flex-col h-full group pt-5 pl-5 sm:pt-6 sm:pl-6 pb-2 pr-2">
              {/* Top-Left Ambient Theme Glow */}
              <div className="absolute top-0 left-0 w-28 h-28 bg-[#88D628]/25 rounded-full blur-xl pointer-events-none group-hover:bg-[#88D628]/35 transition-colors duration-500 z-0" />

              <div className="relative w-full h-full flex flex-col flex-1">
                {/* Background Outline Frame: Offset starting at top-left */}
                <div
                  aria-hidden="true"
                  className="absolute -top-3.5 -left-3.5 sm:-top-4.5 sm:-left-4.5 w-full h-full rounded-2xl border-[2.4px] border-[#88D628] pointer-events-none transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 z-0"
                />

                {/* Main Foreground Container with Deep Navy Outline */}
                <div
                  id="card-our-mission"
                  className="relative z-10 w-full h-full p-8 sm:p-10 lg:p-12 rounded-2xl bg-white border-[2.8px] border-[#0F172A] shadow-md hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between flex-1"
                >
                  <div className="space-y-6">
                    {/* Reference Structural Flow Step 1: Icon + Eyebrow Label */}
                    <div className="flex items-center gap-2.5 text-[#0F5A29]">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0F5A29] group-hover:bg-[#0F5A29] group-hover:text-[#88D628] transition-colors">
                        <Target className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#0F5A29]">
                        OUR MISSION
                      </span>
                    </div>

                    {/* Reference Structural Flow Step 2: High-Impact Display Headline with Accent Line */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
                      To Accelerate Complete <br className="hidden sm:block" />
                      <span className="text-[#0F5A29]">Energy Sovereignty</span>
                    </h3>

                    {/* Reference Structural Flow Step 3: Comprehensive Narrative Paragraph */}
                    <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                      We exist to eliminate grid volatility and overhead reliance for local businesses, agricultural sites, and premium residences. By combining high-integrity engineering design with uncompromised Tier-1 hardware, we deploy assets that protect both operational margins and regional ecosystems for generations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Our Vision with Signature Double-Frame Outline (Top-Left Offset) */}
            <div className="relative flex flex-col h-full group pt-5 pl-5 sm:pt-6 sm:pl-6 pb-2 pr-2">
              {/* Top-Left Ambient Theme Glow */}
              <div className="absolute top-0 left-0 w-28 h-28 bg-[#88D628]/25 rounded-full blur-xl pointer-events-none group-hover:bg-[#88D628]/35 transition-colors duration-500 z-0" />

              <div className="relative w-full h-full flex flex-col flex-1">
                {/* Background Outline Frame: Offset starting at top-left */}
                <div
                  aria-hidden="true"
                  className="absolute -top-3.5 -left-3.5 sm:-top-4.5 sm:-left-4.5 w-full h-full rounded-2xl border-[2.4px] border-[#88D628] pointer-events-none transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 z-0"
                />

                {/* Main Foreground Container with Deep Navy Outline */}
                <div
                  id="card-our-vision"
                  className="relative z-10 w-full h-full p-8 sm:p-10 lg:p-12 rounded-2xl bg-white border-[2.8px] border-[#0F172A] shadow-md hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between flex-1"
                >
                  <div className="space-y-6">
                    {/* Reference Structural Flow Step 1: Icon + Eyebrow Label */}
                    <div className="flex items-center gap-2.5 text-[#0F5A29]">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0F5A29] group-hover:bg-[#0F5A29] group-hover:text-[#88D628] transition-colors">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#0F5A29]">
                        OUR VISION
                      </span>
                    </div>

                    {/* Reference Structural Flow Step 2: High-Impact Display Headline with Accent Line */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
                      To Pioneer Resilient <br className="hidden sm:block" />
                      <span className="text-[#0F5A29]">Energy Independence</span>
                    </h3>

                    {/* Reference Structural Flow Step 3: Comprehensive Narrative Paragraph */}
                    <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                      To become the premier and most trusted solar power integration partner in the region, leading the shift toward clean energy independence and resilient power infrastructure. We forge enduring microgrids and smart battery ecosystems that empower Filipino families and enterprises to achieve total generation autonomy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 5: Organizational DNA - The Principles of Power (White Section) */}
      <section id="organizational-dna" className="py-20 lg:py-24 bg-white relative overflow-hidden border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Two-Column Structured Flow matching height */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            
            {/* Left Column: Visual Anchor Image Container with Top-Left Double Frame Outline */}
            <div className="lg:col-span-5 relative flex flex-col h-full min-h-[480px] group pt-5 pl-5 sm:pt-6 sm:pl-6 pb-2 pr-2">
              {/* Top-Left Ambient Theme Glow */}
              <div className="absolute top-0 left-0 w-28 h-28 bg-[#88D628]/25 rounded-full blur-xl pointer-events-none group-hover:bg-[#88D628]/35 transition-colors duration-500 z-0" />

              <div className="relative w-full h-full flex flex-col flex-1">
                {/* Background Outline Frame: Same dimensions as image, offset starting at top-left */}
                <div
                  aria-hidden="true"
                  className="absolute -top-3.5 -left-3.5 sm:-top-4.5 sm:-left-4.5 w-full h-full rounded-2xl border-[2.4px] border-[#88D628] pointer-events-none transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 z-0"
                />

                {/* Foreground Image Container (Overlapping background outline) with Deep Navy Outline */}
                <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border-[2.8px] border-[#0F172A] shadow-md bg-slate-900 flex flex-col flex-1 min-h-[420px]">
                  <img
                    src="https://cdn.phototourl.com/free/2026-09-17-8edfbd55-ab16-4561-a6be-c6c430ada210.png"
                    alt="High-grade utility scale solar installation representing absolute structural precision"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Right Column: Eyebrow + Display Headline + Lead Text + 3 Numbered Vector Cards */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-7 text-left">
              
              {/* Reference Structural Flow: Eyebrow + Display Headline + Intro Lead Text */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase text-[#0F5A29]">
                  <span className="w-2.5 h-2.5 bg-[#0F5A29] shrink-0 inline-block" aria-hidden="true" />
                  <span>OUR CORE VALUES</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  <span className="text-[#0F172A]">Driven by Quality, </span>
                  <br className="hidden sm:block" />
                  <span className="text-[#0F5A29]">and Performance</span>
                </h2>

                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                  Our field operations, design protocols, and material standards are anchored on three simple, non-negotiable vectors:
                </p>
              </div>

              {/* Reference Structural Flow: 3 Stacked Cards (01, 02, 03) */}
              <div className="space-y-4 sm:space-y-5">
                {coreValues.map((value) => {
                  return (
                    <div
                      key={value.id}
                      id={`dna-vector-${value.num}`}
                      className="group relative p-6 sm:p-7 lg:p-8 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7 text-left"
                    >
                      {/* Left: 2-Digit Numeral */}
                      <div className="flex items-center shrink-0 select-none">
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-none">
                          {value.num}
                        </span>
                      </div>

                      {/* Right: Title & Description */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-snug">
                          {value.title}
                        </h3>

                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
