interface PartnerLogo {
  id: string;
  name: string;
  logoUrl: string;
}

const TIER1_PARTNERS: PartnerLogo[] = [
  {
    id: 'aiko',
    name: 'Aiko Solar',
    logoUrl: 'https://cdn.phototourl.com/free/2026-09-19-edacdf7c-6931-4f3a-86d6-6e7d9d399966.png',
  },
  {
    id: 'deye',
    name: 'Deye Inverters',
    logoUrl: 'https://cdn.phototourl.com/free/2026-09-19-41bf0b9f-1388-4078-af60-d6e85082d74c.png',
  },
  {
    id: 'jasolar',
    name: 'JA Solar',
    logoUrl: 'https://cdn.phototourl.com/free/2026-09-19-dde9cbe4-f0a7-45dc-bc51-e55940194c22.png',
  },
  {
    id: 'jinko',
    name: 'JinkoSolar',
    logoUrl: 'https://cdn.phototourl.com/free/2026-09-19-ba1ce53c-9648-4fd2-8379-6095da7bfbd7.png',
  },
  {
    id: 'solis',
    name: 'Solis Inverters',
    logoUrl: 'https://cdn.phototourl.com/free/2026-09-19-964913e7-fdde-4a45-8d01-bef787695da6.png',
  },
  {
    id: 'trina',
    name: 'Trina Solar',
    logoUrl: 'https://cdn.phototourl.com/free/2026-09-19-b8707094-b8b0-492c-bb42-4c52870ee703.png',
  },
];

interface PartnerLogoMarqueeProps {
  className?: string;
  title?: string;
}

export default function PartnerLogoMarquee({
  className = '',
  title = 'TOP INDUSTRY PARTNERS',
}: PartnerLogoMarqueeProps) {
  // Repeating 4 times with -50% translateX guarantees a mathematically seamless infinite loop on any screen width
  const marqueeItems = [
    ...TIER1_PARTNERS,
    ...TIER1_PARTNERS,
    ...TIER1_PARTNERS,
    ...TIER1_PARTNERS,
  ];

  return (
    <section
      id="top-industry-partners-marquee-section"
      className={`w-full bg-[#F4F5F7] border-y border-slate-200/80 py-9 sm:py-12 relative overflow-hidden select-none ${className}`}
      aria-label={title}
    >
      {/* Eyebrow Header: TOP INDUSTRY PARTNERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6 sm:mb-9">
        <h2 className="text-[12px] sm:text-[13px] font-bold tracking-[0.26em] text-slate-500 uppercase">
          {title}
        </h2>
      </div>

      {/* Marquee Track: Unboxed raw symbols directly on light gray with 50% increased size */}
      <div className="group-marquee relative w-full overflow-hidden">
        {/* Soft edge gradient fade vignettes matching the light gray background */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-[#F4F5F7] via-[#F4F5F7]/80 to-transparent z-10 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-[#F4F5F7] via-[#F4F5F7]/80 to-transparent z-10 pointer-events-none"
        />

        {/* Continuously Animated Infinite Marquee (paused on hover) */}
        <div className="animate-marquee-scroll flex items-center py-2">
          {marqueeItems.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              id={`partner-symbol-${partner.id}-${index}`}
              className="mx-8 sm:mx-12 md:mx-16 shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-105 cursor-pointer"
              title={partner.name}
            >
              {/* Raw unboxed logo with 50% increased dimensions */}
              <img
                src={partner.logoUrl}
                alt={partner.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="h-[58px] sm:h-[72px] md:h-[84px] w-auto max-w-[270px] sm:max-w-[340px] md:max-w-[390px] object-contain drop-shadow-none filter select-none transition-all duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
