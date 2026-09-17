import { useState, FormEvent } from 'react';
import { Send, CheckCircle2, ArrowRight, X, Phone, Mail } from 'lucide-react';
import { COMPANY_INFO, SERVICES_DATA } from '../data';
import { ContactFormData } from '../types';
import { useSolareignData } from '../context/DataContext';

interface ContactCTAProps {
  selectedServicePreset?: string;
  onExploreServices?: () => void;
  onGetStarted?: () => void;
}

export default function ContactCTA({ selectedServicePreset = '', onExploreServices, onGetStarted }: ContactCTAProps) {
  const { addLead } = useSolareignData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    service: selectedServicePreset || SERVICES_DATA[0].title,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update if parent passes a preset
  if (selectedServicePreset && formData.service !== selectedServicePreset && !isSubmitted) {
    setFormData((prev) => ({ ...prev, service: selectedServicePreset }));
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    addLead({
      name: formData.fullName || 'Inbound Consultation Client',
      email: formData.email || 'client@solareign.ph',
      phone: formData.phone || '0908 145 4906',
      propertyType: 'RESIDENTIAL',
      propertyCategory: 'Residential',
      systemRequested: formData.service || 'Direct Engineering Consultation',
      requestedConfig: formData.message || formData.service || 'Consultation Request',
      address: 'Cavite Province',
      billRange: 'Direct Engineering Consultation Inquiry',
      solarProjectGoal: formData.service
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      service: SERVICES_DATA[0].title,
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <section id="contact" className="relative bg-white">
      {/* 1. Cinematic "Ready to Work Together?" Banner (LET'S PARTNER) */}
      <div className="relative py-[64px] sm:py-[76px] lg:py-[84px] overflow-hidden bg-[#082D1F] text-left">
        {/* Background: Starts with normal solid brand color on left, slowly reveals solar image on right in the same color */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Base Solid Brand Color (Normal Color) */}
          <div className="absolute inset-0 bg-[#082D1F]" />

          {/* Right-Aligned Revealed Image Container: Transitions smoothly from left to right */}
          <div className="absolute top-0 bottom-0 right-0 w-full sm:w-[75%] lg:w-[60%] h-full overflow-hidden">
            {/* The Solar Image: Verified high-res commercial solar installation */}
            <img
              src="https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1600&q=80"
              alt="Solar Energy Rooftop Installation Array"
              className="w-full h-full object-cover object-center brightness-105 contrast-125"
              loading="eager"
              referrerPolicy="no-referrer"
            />

            {/* Same Color Duotone / Tint: Renders the revealed solar installation in the website's brand emerald tone */}
            <div className="absolute inset-0 bg-[#082D1F] mix-blend-color" />
            <div className="absolute inset-0 bg-[#0F5A29]/30 mix-blend-multiply" />

            {/* Slow Smooth Horizontal Fade: 100% solid brand color at start (left), slowly revealing the solar array to the right */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#082D1F] from-0% via-[#082D1F] via-15% via-[#082D1F]/80 via-40% via-[#082D1F]/25 via-75% to-transparent to-100%" />

            {/* Top and Bottom edge softening */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#082D1F]/70 via-transparent to-[#082D1F]/70" />
          </div>

          {/* Additional gradient bridge from left ensuring left content area stays 100% solid brand color */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#082D1F] via-[#082D1F]/90 via-35% to-transparent pointer-events-none" />

          {/* Subtle brand ambient accents strictly in website colors (#0F5A29 / #88D628) */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 right-12 -translate-y-1/2 w-80 h-80 bg-[#88D628]/12 rounded-full blur-3xl pointer-events-none"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-[22px]">
          {/* Main Display Headline (Reduced by 20%) */}
          <h2 className="text-2xl sm:text-[38px] lg:text-[48px] font-black text-white tracking-tight uppercase leading-tight max-w-4xl">
            READY TO WORK TOGETHER?
          </h2>

          {/* Subtitle Statement (Reduced by 20%) */}
          <p className="text-sm sm:text-[15px] lg:text-base text-emerald-100/90 max-w-3xl leading-relaxed font-normal">
            Whether it's a complete rooftop solar installation or an advanced battery backup system, our team delivers absolute mathematical and electrical precision to power your home.
          </p>

          {/* Action Buttons: Side-by-Side Following Reference Layout (Increased by 15%) */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
            <button
              type="button"
              id="cta-get-started-btn"
              onClick={() => {
                if (onGetStarted) {
                  onGetStarted();
                } else {
                  const formContainer = document.getElementById('hero-quote-container') || document.getElementById('home');
                  if (formContainer) {
                    formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                  const nameInput = document.getElementById('quote-fullname-input') as HTMLInputElement | null;
                  if (nameInput) {
                    nameInput.focus();
                  }
                }
              }}
              className="inline-flex items-center gap-3 px-[26px] py-[13px] rounded-xl bg-[#88D628] hover:bg-[#7ac222] text-[#0F5A29] font-black text-sm tracking-wider uppercase transition-colors duration-150 group cursor-pointer"
            >
              <span>GET STARTED NOW</span>
              <ArrowRight className="w-4 h-4 text-[#0F5A29] group-hover:translate-x-1.5 transition-transform" />
            </button>

            <button
              type="button"
              id="cta-explore-services-btn"
              onClick={() => {
                if (onExploreServices) {
                  onExploreServices();
                } else {
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center justify-center px-[26px] py-[13px] rounded-xl bg-transparent hover:bg-white/10 text-white border-2 border-white/90 hover:border-white font-extrabold text-sm tracking-wider uppercase transition-colors duration-150 cursor-pointer"
            >
              <span>EXPLORE OUR SERVICES</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Consultation & Quote Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
        >
          {/* Backdrop dismiss */}
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 text-left z-10 my-8">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#0F5A29] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-[#0F5A29]" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0F172A]">Request Sent Successfully!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-800">{formData.fullName}</strong>. Our Bacoor solar engineering specialist will review your request for <strong>{formData.service}</strong> and contact you shortly at <strong>{formData.phone || formData.email}</strong>.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Send Another Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#0F5A29] text-white font-bold text-xs hover:bg-[#0c4720] transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} id="quote-modal-form" className="space-y-4">
                <div className="border-b border-slate-200/80 pb-4 pr-8">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0F5A29] text-[11px] font-black uppercase tracking-wider mb-2">
                    Direct Engineering Support
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0F172A]">Request a Free Solar Quote</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the details below to receive tailored system pricing &amp; ROI projection.
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="modal-fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="modal-fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="e.g., Juan Dela Cruz"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#0F5A29] focus:ring-2 focus:ring-[#88D628]/40 text-sm text-[#0F172A] placeholder:text-slate-400 outline-none transition-all"
                  />
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="modal-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="modal-email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g., juan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#0F5A29] focus:ring-2 focus:ring-[#88D628]/40 text-sm text-[#0F172A] placeholder:text-slate-400 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="modal-phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="e.g., 0917 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#0F5A29] focus:ring-2 focus:ring-[#88D628]/40 text-sm text-[#0F172A] placeholder:text-slate-400 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Service Interested In */}
                <div>
                  <label htmlFor="modal-service" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Service Interested In <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="modal-service"
                      name="service"
                      required
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#0F5A29] focus:ring-2 focus:ring-[#88D628]/40 text-sm text-[#0F172A] outline-none transition-all cursor-pointer appearance-none"
                    >
                      {SERVICES_DATA.map((service) => (
                        <option key={service.id} value={service.title}>
                          {service.title}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="modal-message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Message / Rooftop Details (Optional)
                  </label>
                  <textarea
                    id="modal-message"
                    name="message"
                    rows={2}
                    placeholder="Rooftop type, average monthly bill, or location in Cavite..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:border-[#0F5A29] focus:ring-2 focus:ring-[#88D628]/40 text-sm text-[#0F172A] placeholder:text-slate-400 outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  id="submit-modal-quote-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#88D628] hover:bg-[#7bc421] active:bg-[#6eb21c] text-[#0F5A29] font-black text-sm tracking-wide transition-colors duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#0F5A29] border-t-transparent rounded-full animate-spin" />
                      <span>Sending Request...</span>
                    </span>
                  ) : (
                    <>
                      <span>Send Quote Request</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Quick Help Channels */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
                  <a
                    href={`tel:${COMPANY_INFO.phone.replace(/[^0-9+]/g, '')}`}
                    className="inline-flex items-center gap-1.5 hover:text-[#0F5A29] font-medium"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#0F5A29]" />
                    <span>{COMPANY_INFO.phone}</span>
                  </a>
                  <span className="text-slate-300">|</span>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-[#0F5A29] font-medium"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#0F5A29]" />
                    <span>{COMPANY_INFO.email}</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
