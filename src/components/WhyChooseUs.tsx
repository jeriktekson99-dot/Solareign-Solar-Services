interface WhyChooseUsProps {
  onConsultClick?: () => void;
}

interface StandardCardItem {
  number: string;
  title: string;
  description: string;
}

const STANDARDS_CARDS: StandardCardItem[] = [
  {
    number: '01',
    title: 'Tier-1 Solar Technology',
    description:
      'We deploy exclusively ultra-efficiency mono-crystalline photovoltaic panels paired with industrial-grade micro-inverters. Tested for extreme tropical, maritime, and seismic resilience.',
  },
  {
    number: '02',
    title: 'Certified Master Installers',
    description:
      'Every field technician holds certified professional safety and roofing credentials. We execute clean, worry-free mounting with weather-sealed structural guarantees.',
  },
  {
    number: '03',
    title: 'Guaranteed ROI Tracking',
    description:
      'Monitor live conversion metrics, grid exports, and real-time dollar-savings on our custom mobile dashboard. Transparent diagnostics that prove your investment pays back immediately.',
  },
];

export default function WhyChooseUs({ onConsultClick }: WhyChooseUsProps) {
  return (
    <section id="why-choose-us" className="py-20 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Structural Flow Matching Reference Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Anchor Card with Signature Double-Frame Outline (starts at top-left) */}
          <div className="lg:col-span-5 relative flex flex-col h-full min-h-[480px] group pt-5 pl-5 sm:pt-6 sm:pl-6 pb-2 pr-2">
            {/* Top-Left Ambient Theme Glow */}
            <div className="absolute top-0 left-0 w-28 h-28 bg-[#88D628]/25 rounded-full blur-xl pointer-events-none group-hover:bg-[#88D628]/35 transition-colors duration-500 z-0" />

            <div className="relative w-full h-full flex flex-col flex-1">
              {/* Background Outline Frame: Same dimensions as container, offset starting at top-left */}
              <div
                aria-hidden="true"
                className="absolute -top-3.5 -left-3.5 sm:-top-4.5 sm:-left-4.5 w-full h-full rounded-2xl border-[2.4px] border-[#88D628] pointer-events-none transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 z-0"
              />

              {/* Main Foreground Container with Deep Navy Outline */}
              <div className="relative z-10 w-full h-full bg-white rounded-2xl border-[2.8px] border-[#0F172A] shadow-md p-7 sm:p-8 lg:p-9 flex flex-col justify-between text-left text-slate-800 flex-1 transition-all duration-300 group-hover:shadow-lg">
                <div className="space-y-5 sm:space-y-6">
                  {/* Structural Placement 1: Eyebrow with Indicator Square */}
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-black tracking-widest uppercase text-[#0F5A29]">
                    <span className="w-2.5 h-2.5 bg-[#0F5A29] shrink-0 inline-block" aria-hidden="true" />
                    <span>UNCOMPROMISED INTEGRITY</span>
                  </div>

                  {/* Structural Placement 2: High-Contrast Display Headline with Accent Second Line */}
                  <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#0F172A] tracking-tight leading-[1.18]">
                    Solar Driven. <br />
                    <span className="text-[#0F5A29]">Built Superior.</span>
                  </h3>

                  {/* Structural Placement 3: Comprehensive Narrative Body */}
                  <p className="text-base text-slate-600 leading-relaxed font-normal">
                    At Solareign, we combine years of renewable engineering experience, certified master roof technicians, and uncompromised Tier-1 hardware to deliver solar assets with quality, precision, and integrity. From site planning and blueprint drafting to utility grid synchronization, we are committed to exceeding expectations and building lasting generational value for every client.
                  </p>
                </div>

                {/* Structural Placement 4: Bottom Divider & Two-Column Footer Placement */}
                <div className="pt-6 mt-8 border-t border-slate-100 flex items-center justify-between gap-4">
                  <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-slate-500">
                    SOLAREIGN ENGINEERING
                  </span>
                  <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-[#0F5A29]">
                    QUALITY &amp; INTEGRITY
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Stacked Horizontal Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5">
            {STANDARDS_CARDS.map((card, index) => (
              <div
                key={card.number}
                id={`standard-card-${index + 1}`}
                className="group relative p-6 sm:p-7 rounded-2xl bg-white hover:bg-slate-50/70 border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex items-center gap-5 sm:gap-7 text-left shadow-2xs"
              >
                {/* Large Number */}
                <div className="flex items-baseline shrink-0">
                  <span className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
                    {card.number}
                  </span>
                </div>

                {/* Card Text Content */}
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#0F5A29] transition-colors leading-snug">
                    {card.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
