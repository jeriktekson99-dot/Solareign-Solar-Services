import { useState, useEffect, MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import SolareignLogo from './SolareignLogo';

interface NavbarProps {
  activePage?: string;
  onNavigate?: (page: string) => void;
  onConsultationClick?: () => void;
}

export default function Navbar({ 
  activePage = 'about', 
  onNavigate, 
  onConsultationClick 
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Portfolio', id: 'portfolio' },
  ];

  const handleLinkClick = (e: MouseEvent, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3.5'
          : 'bg-white/85 backdrop-blur-sm border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Solareign Solar Power Services logo */}
          <div className="flex-1 flex items-center justify-start">
            <button
              onClick={(e) => handleLinkClick(e, 'home')}
              id="brand-logo-link"
              className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#88D628] rounded-lg text-left"
            >
              <SolareignLogo />
            </button>
          </div>

          {/* Middle: Four button hyperlinks */}
          <nav
            id="desktop-nav-menu"
            aria-label="Main Navigation"
            className="hidden md:flex items-center justify-center gap-8 lg:gap-10 shrink-0"
          >
            {navLinks.map((link) => {
              const isActive = 
                activePage.toLowerCase() === link.id || 
                (link.id === 'portfolio' && activePage.toLowerCase() === 'portfolio-details');
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className={`text-sm tracking-tight transition-all duration-200 relative py-2 font-bold cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#0F5A29]'
                      : 'text-slate-600 hover:text-[#0F5A29]'
                  }`}
                >
                  <span>{link.label}</span>
                  {/* Active indicator state */}
                  {isActive ? (
                    <span 
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#88D628] rounded-full" 
                    />
                  ) : (
                    <span 
                      aria-hidden="true"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#88D628] rounded-full transition-all duration-200 hover:w-full" 
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Get A Quotation button & Mobile menu toggle */}
          <div className="flex-1 flex items-center justify-end gap-3">
            <button
              type="button"
              id="nav-get-quotation-btn"
              onClick={(e) => handleLinkClick(e, 'quotation')}
              className={`hidden md:inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-black transition-colors duration-150 cursor-pointer select-none ${
                activePage.toLowerCase() === 'quotation'
                  ? 'bg-[#88D628] text-[#0F5A29] ring-2 ring-[#0F5A29]/20 shadow-md'
                  : 'bg-[#88D628] hover:bg-[#7bc421] active:bg-[#6eb21c] text-[#0F5A29] shadow-xs'
              }`}
            >
              Get A Quotation
            </button>

            {/* Mobile menu toggle */}
            <div className="md:hidden flex items-center">
              <button
                id="mobile-menu-toggle-btn"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-[#0F5A29] hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#88D628]"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-panel"
            className="md:hidden pt-4 pb-3 border-t border-slate-100 mt-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {navLinks.map((link) => {
              const isActive = 
                activePage.toLowerCase() === link.id || 
                (link.id === 'portfolio' && activePage.toLowerCase() === 'portfolio-details');
              return (
                <button
                  key={link.id}
                  id={`mobile-nav-link-${link.id}`}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-2 border-[#88D628] bg-[#88D628]/10 text-[#0F5A29] shadow-xs'
                      : 'border-2 border-transparent text-slate-700 hover:text-[#0F5A29] hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
            <div className="pt-2 px-1">
              <button
                type="button"
                id="mobile-nav-get-quotation-btn"
                onClick={(e) => handleLinkClick(e, 'quotation')}
                className={`w-full py-3 px-4 rounded-xl text-center text-sm font-black transition-colors duration-150 cursor-pointer ${
                  activePage.toLowerCase() === 'quotation'
                    ? 'bg-[#88D628] text-[#0F5A29] ring-2 ring-[#0F5A29]/20 shadow-md'
                    : 'bg-[#88D628] hover:bg-[#7bc421] active:bg-[#6eb21c] text-[#0F5A29] shadow-xs'
                }`}
              >
                Get A Quotation
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
