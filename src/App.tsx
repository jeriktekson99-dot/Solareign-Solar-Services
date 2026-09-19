import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import PortfolioPage from './components/PortfolioPage';
import PortfolioDetailsPage from './components/PortfolioDetailsPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfUsePage from './components/TermsOfUsePage';
import SafetyCompliancePage from './components/SafetyCompliancePage';
import AdminLoginPage from './components/AdminLoginPage';
import Hero from './components/Hero';
import PartnerLogoMarquee from './components/PartnerLogoMarquee';
import ProblemSolution from './components/ProblemSolution';
import AboutCompany from './components/AboutCompany';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import FAQSection from './components/FAQSection';
import ContactCTA from './components/ContactCTA';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import { DataProvider, useOptionalSolareignData } from './context/DataContext';

function AppContent() {
  // Default to 'home' page so the updated hero section is immediately visible

  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1');
  const [selectedServicePreset, setSelectedServicePreset] = useState<string>('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHomeMultiform = () => {
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        const formContainer = document.getElementById('hero-quote-container') || document.getElementById('home');
        if (formContainer) {
          formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        const nameInput = document.getElementById('quote-fullname-input') as HTMLInputElement | null;
        if (nameInput) {
          nameInput.focus();
        }
      }, 100);
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
  };

  const handleNavigate = (pageId: string) => {
    if (pageId === 'portfolio') {
      setActivePage('portfolio');
    } else if (pageId === 'portfolio-details') {
      setActivePage('portfolio-details');
    } else if (pageId === 'services') {
      setActivePage('services');
    } else if (pageId === 'about') {
      setActivePage('about');
    } else if (pageId === 'privacy') {
      setActivePage('privacy');
    } else if (pageId === 'terms') {
      setActivePage('terms');
    } else if (pageId === 'safety') {
      setActivePage('safety');
    } else if (pageId === 'admin') {
      setActivePage('admin');
    } else if (pageId === 'home') {
      setActivePage('home');
    }
  };

  const handleSelectServiceFromCard = (serviceTitle: string) => {
    setSelectedServicePreset(serviceTitle);
    scrollToContact();
  };

  const handleSelectPortfolioProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setActivePage('portfolio-details');
  };

  // Dedicated Admin Portal Screen with matching reference structural split flow
  if (activePage === 'admin') {
    return (
      <AdminLoginPage 
        onBackToHome={() => handleNavigate('home')} 
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#88D628] selection:text-[#0F5A29]">
      {/* Sticky Header & Navigation Bar with Active Indicator State & Free Consultation CTA */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onConsultationClick={scrollToHomeMultiform}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {activePage === 'privacy' ? (
          <PrivacyPolicyPage
            onBackToHome={() => handleNavigate('home')}
            onConsultationClick={scrollToContact}
          />
        ) : activePage === 'terms' ? (
          <TermsOfUsePage
            onBackToHome={() => handleNavigate('home')}
            onConsultationClick={scrollToContact}
          />
        ) : activePage === 'safety' ? (
          <SafetyCompliancePage
            onBackToHome={() => handleNavigate('home')}
            onConsultationClick={scrollToContact}
          />
        ) : activePage === 'portfolio-details' ? (
          <>
            {/* The Dedicated Solareign "Portfolio Details" Case Study Page */}
            <PortfolioDetailsPage
              projectId={selectedProjectId}
              onBackToPortfolio={() => setActivePage('portfolio')}
              onConsultationClick={(preset?: string) => {
                if (preset) setSelectedServicePreset(preset);
                scrollToContact();
              }}
            />

            {/* Lead Generation / Consultation Form */}
            <ContactCTA
              selectedServicePreset={selectedServicePreset}
              onGetStarted={scrollToHomeMultiform}
            />
          </>
        ) : activePage === 'portfolio' ? (
          <>
            {/* The Dedicated Solareign "Portfolio" Page */}
            <PortfolioPage
              onConsultationClick={(preset?: string) => {
                if (preset) setSelectedServicePreset(preset);
                scrollToContact();
              }}
              onSelectProject={(projectId: string) => {
                setSelectedProjectId(projectId);
                setActivePage('portfolio-details');
              }}
            />

            {/* Lead Generation / Consultation Form */}
            <ContactCTA
              selectedServicePreset={selectedServicePreset}
              onGetStarted={scrollToHomeMultiform}
            />
          </>
        ) : activePage === 'services' ? (
          <>
            {/* The Dedicated Solareign "Services" Page */}
            <ServicesPage
              onConsultationClick={(preset?: string) => {
                if (preset) setSelectedServicePreset(preset);
                scrollToContact();
              }}
            />

            {/* Lead Generation / Consultation Form */}
            <ContactCTA
              selectedServicePreset={selectedServicePreset}
              onGetStarted={scrollToHomeMultiform}
            />
          </>
        ) : activePage === 'about' ? (
          <>
            {/* The Dedicated Solareign "About Us" Page */}
            <AboutPage
              onConsultationClick={scrollToContact}
              onNavigateServices={() => handleNavigate('services')}
            />

            {/* Lead Generation / Consultation Form */}
            <ContactCTA
              selectedServicePreset={selectedServicePreset}
              onExploreServices={() => handleNavigate('services')}
              onGetStarted={scrollToHomeMultiform}
            />
          </>
        ) : (
          <>
            {/* Home Landing Page */}
            <Hero
              onContactClick={scrollToContact}
              onExploreClick={() => {
                const el = document.getElementById('services');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            {/* Dedicated Light-Gray Authorized Tier-1 Technology Integration Partners Logo Marquee */}
            <PartnerLogoMarquee />
            <ProblemSolution />
            <AboutCompany onLearnMoreClick={() => setActivePage('about')} />
            <Services
              onSelectService={handleSelectServiceFromCard}
              onExploreMore={() => handleNavigate('services')}
            />
            <Portfolio
              onSelectProject={handleSelectPortfolioProject}
            />
            <WhyChooseUs onConsultClick={scrollToContact} />
            <Testimonials />
            <FAQSection />
            <ContactCTA
              selectedServicePreset={selectedServicePreset}
              onExploreServices={() => handleNavigate('services')}
              onGetStarted={scrollToHomeMultiform}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onGetQuotation={scrollToHomeMultiform} />

      {/* Floating Chatbot Widget matching reference layout */}
      <ChatbotWidget
        onOpenQuotation={scrollToContact}
        onNavigateServices={() => handleNavigate('services')}
      />
    </div>
  );
}

export default function App() {
  const existingContext = useOptionalSolareignData();
  if (!existingContext) {
    return (
      <DataProvider>
        <AppContent />
      </DataProvider>
    );
  }
  return <AppContent />;
}

