import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import MultiStepQuoteForm from './MultiStepQuoteForm';
import SolarCalculator from './SolarCalculator';
import FAQSection from './FAQSection';
import { useSolareignData } from '../context/DataContext';

interface GetQuotationPageProps {
  onBackToHome?: () => void;
}

export default function GetQuotationPage({ onBackToHome }: GetQuotationPageProps) {
  const { settings } = useSolareignData();
  const rawHotline = settings.hotline;
  const phoneNumber = (!rawHotline || rawHotline.includes('843') || rawHotline.includes('+63'))
    ? '0908 145 4906'
    : rawHotline;
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');

  const companyEmail = 'c2r2gsm@gmail.com';
  const companyAddress = 'Dasmarinas Cavite, Cavite, Philippines, 4114';
  const operatingHours = 'Monday – Saturday, 8:00 AM - 5:00 PM';

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* 1. Page Hero Banner (Structured exactly like the Portfolio Page) */}
      <section
        id="quotation-hero"
        className="relative py-20 sm:py-24 lg:py-28 overflow-hidden bg-gradient-to-r from-[#061B29] via-[#082C1E] to-[#051A10] text-left text-white border-b border-[#0F5A29]/50"
      >
        {/* Atmospheric Background with Dual-Tone Blue & Green Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1800&q=80"
            alt="Aerial view of completed solar power installations"
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
              GET A QUOTATION
            </h1>
          </div>
        </div>
      </section>

      {/* 2. Split-Screen Section: Contact Details (Left) & Hero Multi-Step Form (Right) */}
      <section id="quotation-form-section" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            
            {/* Left Column: Direct Channels & Corporate Contact Details - Aligned to Form Size */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full text-left py-0.5">
              
              {/* Top Block: Eyebrow, Headline, Description, Divider */}
              <div className="space-y-4">
                {/* Eyebrow / Subtitle */}
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase text-[#0F5A29]">
                  <span className="w-2.5 h-2.5 bg-[#88D628] shrink-0 inline-block" aria-hidden="true" />
                  <span>DIRECT CHANNELS</span>
                </div>

                {/* Main Headline */}
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F5A29] tracking-tight leading-[1.12]">
                  Your Dream Project Starts With Us!
                </h2>

                {/* Description Paragraph */}
                <p className="text-base sm:text-lg font-normal text-slate-600 leading-relaxed max-w-xl">
                  Our engineers analyze your site structure and energy patterns for exact savings simulations. Contact us directly below.
                </p>

                {/* Horizontal Divider */}
                <div className="border-t border-slate-200/90 pt-1" />
              </div>

              {/* Contact Detail Rows - Distributed to match form height */}
              <div className="flex flex-col justify-between flex-1 pt-5 lg:pt-6 space-y-5 lg:space-y-0">
                
                {/* 1. Company Number */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-[#061B29] border border-[#0F5A29]/30 flex items-center justify-center shrink-0 shadow-sm text-[#88D628] group-hover:scale-105 transition-transform duration-200">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-widest text-slate-400 font-mono">
                      COMPANY NUMBER
                    </span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-lg sm:text-xl font-extrabold text-[#0F172A] hover:text-[#0F5A29] transition-colors"
                    >
                      {phoneNumber}
                    </a>
                  </div>
                </div>

                {/* 2. Company Email */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-[#061B29] border border-[#0F5A29]/30 flex items-center justify-center shrink-0 shadow-sm text-[#88D628] group-hover:scale-105 transition-transform duration-200">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-widest text-slate-400 font-mono">
                      COMPANY EMAIL
                    </span>
                    <a
                      href={`mailto:${companyEmail}`}
                      className="text-base sm:text-lg font-extrabold text-[#0F172A] hover:text-[#0F5A29] transition-colors break-all"
                    >
                      {companyEmail}
                    </a>
                  </div>
                </div>

                {/* 3. Office Address */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-[#061B29] border border-[#0F5A29]/30 flex items-center justify-center shrink-0 shadow-sm text-[#88D628] group-hover:scale-105 transition-transform duration-200">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-widest text-slate-400 font-mono">
                      OFFICE ADDRESS
                    </span>
                    <p className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug">
                      {companyAddress}
                    </p>
                  </div>
                </div>

                {/* 4. Operating Hours */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-[#061B29] border border-[#0F5A29]/30 flex items-center justify-center shrink-0 shadow-sm text-[#88D628] group-hover:scale-105 transition-transform duration-200">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-black uppercase tracking-widest text-slate-400 font-mono">
                      OPERATING HOURS
                    </span>
                    <p className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug">
                      {operatingHours}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Multi-Step Interactive Quote Form (Increased by 15%) */}
            <div className="lg:col-span-7 flex justify-center lg:justify-end w-full">
              <div className="w-full max-w-[620px]">
                <MultiStepQuoteForm size="large" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Solar ROI & Capacity Calculator Section */}
      <SolarCalculator />

      {/* 4. FAQs Section (Moved from Home Page) */}
      <FAQSection />
    </div>
  );
}
