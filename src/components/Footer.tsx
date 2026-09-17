import { useState, MouseEvent } from 'react';
import { Facebook, Instagram, Video, X, ShieldCheck, FileText, Lock, ShieldAlert, ExternalLink } from 'lucide-react';
import SolareignLogo from './SolareignLogo';
import { useSolareignData } from '../context/DataContext';

interface FooterProps {
  onNavigate?: (page: string) => void;
  onGetQuotation?: () => void;
}

export default function Footer({ onNavigate, onGetQuotation }: FooterProps) {
  const { settings, socialLinks } = useSolareignData();
  const [activeModal, setActiveModal] = useState<'admin' | 'privacy' | 'terms' | 'safety' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e: MouseEvent, target: string) => {
    e.preventDefault();
    if (target === 'quote') {
      if (onGetQuotation) {
        onGetQuotation();
      } else {
        const el = document.getElementById('contact') || document.getElementById('home');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          scrollToTop();
        }
      }
      return;
    }

    if (onNavigate) {
      if (target === 'home') {
        onNavigate('home');
        scrollToTop();
      } else if (target === 'about') {
        onNavigate('about');
      } else if (target === 'services' || target === 'products') {
        onNavigate('services');
      } else if (target === 'portfolio' || target === 'gallery') {
        onNavigate('portfolio');
      } else if (target === 'why-choose-us' || target === 'faq') {
        onNavigate('home');
        setTimeout(() => {
          const el = document.getElementById(target);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
      } else {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else scrollToTop();
      }
    } else {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else scrollToTop();
    }
  };

  const servicesList = [
    'Battery Backup Installation',
    'Whole-Home UPS/Inverter Upgrades',
    'Panel Cleaning & Inspection',
    'Performance Monitoring Setup',
    'System Health Checks & Inverter Diagnostics',
    'Net Metering Application Assistance',
  ];

  const quickLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About Us', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Why Choose Us', id: 'why-choose-us' },
    { label: 'FAQs', id: 'faq' },
  ];

  return (
    <footer className="relative bg-white text-slate-800 border-t border-slate-200/90 pt-16 pb-12 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-Column Layout Following Reference Structural Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 text-left">
          
          {/* Column 1: Brand Logo, Narrative Bio, Circular Social Buttons */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <SolareignLogo variant="dark" />
            </div>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm font-normal">
              Solareign Solar Power Services delivers premium, Tier-1 engineered solar power solutions across the Philippines, establishing the absolute gold standard of clean energy performance and structural integrity.
            </p>

            {/* Circular Social Icons */}
            {/* Circular Social & Integrated Channel Icons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={socialLinks.facebookUrl || "https://web.facebook.com/profile.php?id=61566141530365"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Page"
                title="Facebook Page"
                className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-[#0F5A29] hover:border-[#0F5A29] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a
                href={socialLinks.instagramUrl || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                title="Instagram Profile"
                className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-[#0F5A29] hover:border-[#0F5A29] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={socialLinks.tiktokUrl || "https://tiktok.com/@powershift"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Media and Video Showcase"
                title="TikTok Showcase"
                className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-[#0F5A29] hover:border-[#0F5A29] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs"
              >
                <Video className="w-4 h-4" />
              </a>
              {(socialLinks.customUrls || []).map((customUrl) => (
                <a
                  key={customUrl.id}
                  href={customUrl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={customUrl.name}
                  title={`${customUrl.name} (${customUrl.url})`}
                  className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-[#0F5A29] hover:border-[#0F5A29] text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: OUR SERVICES (9 Engineering Capabilities) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#0F5A29]">
              OUR SERVICES
            </h4>
            <ul className="space-y-2.5 text-sm">
              {servicesList.map((service, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    id={`footer-service-link-${idx + 1}`}
                    onClick={(e) => handleNavClick(e, 'services')}
                    className="text-slate-600 hover:text-[#0F5A29] transition-colors text-left cursor-pointer font-normal block hover:translate-x-0.5 transform duration-150"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: QUICK LINKS (Navigation + Distinct Get A Quotation) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#0F5A29]">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    id={`footer-quick-link-${link.id}`}
                    onClick={(e) => handleNavClick(e, link.id)}
                    className="text-slate-600 hover:text-[#0F5A29] transition-colors text-left cursor-pointer font-normal block hover:translate-x-0.5 transform duration-150"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              {/* Highlighted Action: Get A Quotation */}
              <li className="pt-2">
                <button
                  type="button"
                  id="footer-get-quotation-link"
                  onClick={(e) => handleNavClick(e, 'quote')}
                  className="text-sm font-black text-[#0F5A29] hover:text-[#88D628] tracking-wide uppercase transition-colors text-left cursor-pointer block underline decoration-[#88D628] decoration-2 underline-offset-4"
                >
                  Get A Quotation
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: CONTACT DETAILS & ADDRESS */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#0F5A29]">
              CONTACT DETAILS &amp; ADDRESS
            </h4>

            <div className="space-y-4 text-sm">
              {/* Office Address */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  OFFICE ADDRESS
                </div>
                <p className="text-slate-700 mt-1 leading-snug font-normal">
                  Bacoor City, Bacoor, Philippines, 4102
                </p>
              </div>

              {/* Company Number */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  COMPANY NUMBER
                </div>
                <a
                  href={`tel:${(settings.hotline || '09081454906').replace(/\s+/g, '')}`}
                  className="text-slate-800 hover:text-[#0F5A29] transition-colors mt-1 block font-medium"
                >
                  {settings.hotline || '0908 145 4906'}
                </a>
              </div>

              {/* Company Email */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  COMPANY EMAIL
                </div>
                <a
                  href={`mailto:${settings.contactEmail || 'solareignpower09@gmail.com'}`}
                  className="text-slate-800 hover:text-[#0F5A29] transition-colors mt-1 block font-medium break-all"
                >
                  {settings.contactEmail || 'solareignpower09@gmail.com'}
                </a>
              </div>

              {/* Operating Hours */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  OPERATING HOURS
                </div>
                <p className="text-slate-700 mt-1 leading-snug font-normal">
                  Mon - Sat: 8:00 AM - 5:00 PM
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Horizontal Divider Line */}
        <div className="border-t border-slate-200/90 pt-8" />

        {/* Bottom Bar: Copyright on Left, Legal & Compliance on Right */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <p className="leading-relaxed">
            &copy; {new Date().getFullYear()} Solareign Solar Power Services. All engineering assets and system layouts are proprietary.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 gap-y-1 text-xs font-semibold tracking-wider uppercase text-slate-500">
            <button
              type="button"
              id="footer-admin-portal-btn"
              onClick={() => onNavigate && onNavigate('admin')}
              className="hover:text-[#0F5A29] transition-colors cursor-pointer"
            >
              PORTAL
            </button>
            <span className="text-slate-300 select-none" aria-hidden="true">|</span>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('privacy')}
              className="hover:text-[#0F5A29] transition-colors cursor-pointer"
            >
              PRIVACY POLICY
            </button>
            <span className="text-slate-300 select-none" aria-hidden="true">|</span>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('terms')}
              className="hover:text-[#0F5A29] transition-colors cursor-pointer"
            >
              TERMS OF USE
            </button>
            <span className="text-slate-300 select-none" aria-hidden="true">|</span>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('safety')}
              className="hover:text-[#0F5A29] transition-colors cursor-pointer"
            >
              SAFETY STANDARD COMPLIANCE
            </button>
          </div>
        </div>
      </div>

      {/* Legal & Administration Information Modals */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 text-white shadow-2xl text-left">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'admin' && (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F5A29] text-[#88D628] flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white">Authorized Engineering Portal</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Access to the central inverter telemetry database, single-line diagrams (SLD), and field operations scheduling is restricted to certified Solareign Solar field engineers.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-[#88D628]">Support Dispatch:</div>
                  <div>For credentials or portal maintenance, contact <span className="text-white font-medium">solareignpower09@gmail.com</span>.</div>
                </div>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F5A29] text-[#88D628] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white">Privacy Policy &amp; Data Security</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Solareign Solar Power Services strictly adheres to the Philippine Data Privacy Act of 2012 (RA 10173). Electrical utility meter data, roof CAD assessments, and homeowner contact information collected during quotation generation are encrypted and never shared with third parties.
                </p>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                  <li>Utility bill data is analyzed exclusively for photovoltaic kW sizing.</li>
                  <li>Net metering application records are retained securely per ERC compliance rules.</li>
                </ul>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F5A29] text-[#88D628] flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white">Terms of Engineering &amp; Service</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  All solar installations include our standard warranty commitments: 25-year linear solar panel output guarantee, 10-year grid-tie inverter warranty, and 5-year comprehensive workmanship warranty.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Yield predictions are simulated using PVsyst meteorological datasets for Cavite and Greater Manila. Final turnkey installations are subject to structural load inspection.
                </p>
              </div>
            )}

            {activeModal === 'safety' && (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F5A29] text-[#88D628] flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white">Safety Standard Compliance</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Every Solareign Solar project is built strictly to the Philippine Electrical Code (PEC 2017) and IEEE 1547 interconnection standards. Systems include rapid-shutdown DC isolators, class-leading surge protection devices (SPD), and ground-fault protection.
                </p>
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-200">
                  Signed and sealed by Professional Electrical Engineers (PEE) for full Meralco net-metering approval.
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#88D628] hover:bg-[#7bc421] text-[#0F5A29] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
