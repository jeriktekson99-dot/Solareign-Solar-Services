import { useState, useRef, useEffect, type FormEvent, type DragEvent, type ChangeEvent } from 'react';
import { 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  X, 
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  Upload,
  Calendar,
  Clock
} from 'lucide-react';

import { getProjectDetailById } from "../data/projectsData";
import { useSolareignData } from '../context/DataContext';
import RichTextRenderer from './RichTextRenderer';

interface PortfolioDetailsPageProps {
  projectId?: string;
  onBackToPortfolio?: () => void;
  onConsultationClick: (preset?: string) => void;
}

export default function PortfolioDetailsPage({
  projectId = "proj-1",
  onBackToPortfolio,
  onConsultationClick
}: PortfolioDetailsPageProps) {
  const { getProjectDetail, addLead } = useSolareignData();
  // Resolve active project data with centralized lookup & fallback
  const project = getProjectDetail(projectId);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState<number>(0);

  const rawGalleryItems = project.gallery && project.gallery.length > 0 ? project.gallery : [];
  
  // Display only the actual gallery images provided for this project
  const galleryItems = (() => {
    if (rawGalleryItems.length > 0) {
      return rawGalleryItems;
    }
    if (project.image) {
      return [{
        url: project.image,
        title: `${project.title} - Main Installation`,
        caption: `Project installation photo for ${project.title}.`
      }];
    }
    return [];
  })();

  const galleryLength = galleryItems.length;
  const hasMoreThanFour = galleryLength > 4;

  const handlePrevImage = () => {
    if (galleryLength <= 1) return;
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryLength - 1));
  };

  const handleNextImage = () => {
    if (galleryLength <= 1) return;
    setActiveImageIndex((prev) => (prev < galleryLength - 1 ? prev + 1 : 0));
  };

  // Synchronize thumbnailStartIndex so the active thumbnail is always within the 4 visible items
  useEffect(() => {
    if (activeImageIndex >= galleryLength && galleryLength > 0) {
      setActiveImageIndex(0);
    }
  }, [activeImageIndex, galleryLength]);

  useEffect(() => {
    if (galleryLength <= 4) {
      setThumbnailStartIndex(0);
      return;
    }
    setThumbnailStartIndex((prev) => {
      if (activeImageIndex < prev) {
        return activeImageIndex;
      }
      if (activeImageIndex >= prev + 4) {
        return Math.min(galleryLength - 4, activeImageIndex - 3);
      }
      return prev;
    });
  }, [activeImageIndex, galleryLength]);

  // Multi-step Inquiry Form State (Step 1 matches reference layout)
  const [inquiryStep, setInquiryStep] = useState<1 | 2 | 3 | 4>(1);
  const [propertyType, setPropertyType] = useState<string>('Residential');
  const [inquiryName, setInquiryName] = useState<string>('');
  const [inquiryContact, setInquiryContact] = useState<string>('');
  const [inquiryEmail, setInquiryEmail] = useState<string>('');
  const [inquiryAddress, setInquiryAddress] = useState<string>('');
  const [step1Error, setStep1Error] = useState<string>('');

  // Subsequent steps state (Step 2 matches reference image)
  const [utilityProvider, setUtilityProvider] = useState<string>('');
  const [monthlyBill, setMonthlyBill] = useState<string>('5,000 - 8,000 PHP');
  const [roofType, setRoofType] = useState<string>('Rib-type / Corrugated GI Sheet');
  const [daytimeShading, setDaytimeShading] = useState<string>('No, clear sunlight all day');

  // Step 3 (Inverter & Panel Setup)
  const [inverterLocation, setInverterLocation] = useState<string>('No designated location yet (site survey needed)');
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [isDraggingPhoto1, setIsDraggingPhoto1] = useState<boolean>(false);
  const [isDraggingPhoto2, setIsDraggingPhoto2] = useState<boolean>(false);
  const photo1InputRef = useRef<HTMLInputElement>(null);
  const photo2InputRef = useRef<HTMLInputElement>(null);

  // Step 4 (Optimization Goals & Ocular Schedule)
  const [primaryGoal, setPrimaryGoal] = useState<string>('Lowering daytime electric bill (Grid-Tied)');
  const [timeline, setTimeline] = useState<string>('Immediately (2-3 weeks)');
  const [preferredOcularDate, setPreferredOcularDate] = useState<string>('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string>('9:00 AM - 12:00 PM');
  const [billFile, setBillFile] = useState<File | null>(null);
  const [isDraggingBill, setIsDraggingBill] = useState<boolean>(false);
  const [leadId, setLeadId] = useState<string>('LEAD-206-513');
  const billFileInputRef = useRef<HTMLInputElement>(null);

  const [inquiryCategory, setInquiryCategory] = useState<string>('Residential Solar Hybrid');
  const [inquiryNotes, setInquiryNotes] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [inquirySubmitted, setInquirySubmitted] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStep1Continue = () => {
    if (!inquiryName.trim()) {
      setStep1Error('Please enter your full name.');
      return;
    }
    if (!inquiryEmail.trim() && !inquiryContact.trim()) {
      setStep1Error('Please provide an email address or phone number.');
      return;
    }
    setStep1Error('');
    setInquiryStep(2);
  };

  const handlePhoto1Drop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingPhoto1(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setPhoto1(e.dataTransfer.files[0]);
    }
  };

  const handlePhoto1Change = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto1(e.target.files[0]);
    }
  };

  const handlePhoto2Drop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingPhoto2(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setPhoto2(e.dataTransfer.files[0]);
    }
  };

  const handlePhoto2Change = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhoto2(e.target.files[0]);
    }
  };

  const handleBillDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingBill(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setBillFile(e.dataTransfer.files[0]);
    }
  };

  const handleBillChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBillFile(e.target.files[0]);
    }
  };

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInquirySubmit = (e: FormEvent) => {
    e.preventDefault();
    const createdLead = addLead(
      {
        name: inquiryName || 'Inbound Client',
        phone: inquiryContact || '0908 145 4906',
        email: inquiryEmail || 'inquiry@solareign.ph',
        address: inquiryAddress || 'Cavite Region',
        propertyType: (propertyType.toUpperCase()) as any,
        propertyCategory: propertyType,
        utilityPartner: utilityProvider,
        billRange: monthlyBill,
        structuralRoofType: roofType,
        daytimeShading: daytimeShading,
        designatedSafeLocation: inverterLocation,
        solarProjectGoal: primaryGoal,
        commissionTimeline: timeline,
        systemRequested: `${project.title} - Custom Inquiry`,
        requestedConfig: primaryGoal
      },
      {
        scheduleOcular: Boolean(preferredOcularDate),
        ocularDate: preferredOcularDate,
        ocularSlot: preferredTimeSlot
      }
    );
    setLeadId(createdLead.token || `LEAD-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`);
    setInquirySubmitted(true);
  };

  const resetInquiry = () => {
    setInquiryStep(1);
    setInquiryName('');
    setInquiryContact('');
    setInquiryEmail('');
    setInquiryAddress('');
    setUtilityProvider('');
    setMonthlyBill('5,000 - 8,000 PHP');
    setRoofType('Rib-type / Corrugated GI Sheet');
    setDaytimeShading('No, clear sunlight all day');
    setInverterLocation('No designated location yet (site survey needed)');
    setPhoto1(null);
    setPhoto2(null);
    setPrimaryGoal('Lowering daytime electric bill (Grid-Tied)');
    setTimeline('Immediately (2-3 weeks)');
    setPreferredOcularDate('');
    setPreferredTimeSlot('9:00 AM - 12:00 PM');
    setBillFile(null);
    setInquiryNotes('');
    setSelectedFile(null);
    setInquirySubmitted(false);
    setStep1Error('');
  };

  return (
    <div className="bg-white text-[#0F172A] font-sans antialiased min-h-screen">
      
      {/* 2. CASE STUDY HEADER SECTION */}
      <section id="case-study-header" className="bg-white pt-8 sm:pt-12 pb-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 min-w-0">
          {/* Large Bold Display Title */}
          <h1 className="text-2xl sm:text-[32px] font-black text-[#0F172A] tracking-tight uppercase leading-tight py-[5px] break-words [overflow-wrap:anywhere]">
            {project.title}
          </h1>
        </div>
      </section>

      {/* 3. KEY METADATA ROW: 3 COLUMNS WITH LEFT INDICATOR BARS */}
      <section id="key-metadata-row" className="bg-white pb-[20px] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2">
            
            {/* Column 1: CLIENT REPRESENTATIVE (CLIENT NAME) */}
            <div className="flex items-start gap-3 pl-3 border-l-2 border-[#0F5A29] min-w-0">
              <div className="space-y-0.5 text-left min-w-0">
                <span className="block text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                  CLIENT REPRESENTATIVE (CLIENT NAME)
                </span>
                <span className="block text-[16px] font-extrabold text-[#0F172A] uppercase leading-snug break-words [overflow-wrap:anywhere]">
                  {project.client}
                </span>
              </div>
            </div>

            {/* Column 2: SECTOR CATEGORIZATION (SECTOR/SEGMENT) */}
            <div className="flex items-start gap-3 pl-3 border-l-2 border-[#0F5A29] min-w-0">
              <div className="space-y-0.5 text-left min-w-0">
                <span className="block text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                  SECTOR CATEGORIZATION (SECTOR/SEGMENT)
                </span>
                <span className="block text-[16px] font-extrabold text-[#0F172A] uppercase leading-snug break-words [overflow-wrap:anywhere]">
                  {project.sector}
                </span>
              </div>
            </div>

            {/* Column 3: MUNICIPAL LOCATION */}
            <div className="flex items-start gap-3 pl-3 border-l-2 border-[#0F5A29] min-w-0">
              <div className="space-y-0.5 text-left min-w-0">
                <span className="block text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                  MUNICIPAL LOCATION
                </span>
                <span className="block text-[16px] font-extrabold text-[#0F172A] uppercase leading-snug break-words [overflow-wrap:anywhere]">
                  {project.location}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MAIN TWO-COLUMN BODY SECTION */}
      <section id="main-content-layout" className="pt-[40px] pb-8 sm:pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ========================================================================= */}
            {/* LEFT COLUMN: Main Image, 5 Thumbnails Strip, Project Scope & Details */}
            {/* (NO outer container cards - directly rendered on the page) */}
            {/* ========================================================================= */}
            <div className="lg:col-span-8 min-w-0 max-w-full w-full space-y-9 overflow-hidden">
              
              {/* Visual Gallery */}
              <div className="space-y-3.5">
                
                {/* Main Featured Photo Frame */}
                <div className="relative aspect-16/10 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/90 shadow-sm group">
                  <img
                    src={galleryItems[activeImageIndex]?.url}
                    alt={galleryItems[activeImageIndex]?.title || project.title}
                    className="w-full h-full object-cover transition-all duration-300 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80';
                    }}
                    referrerPolicy="no-referrer"
                  />

                  {/* Top-Right Badge: Active Photo Count */}
                  <div className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border border-white/10 shadow-sm pointer-events-none">
                    {activeImageIndex + 1} / {galleryLength}
                  </div>

                  {/* Left and Right navigation symbols on main photo when images > 1 */}
                  {galleryLength > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        aria-label="Previous photo"
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white flex items-center justify-center backdrop-blur-xs transition-all hover:scale-105 active:scale-95 cursor-pointer focus:outline-none z-10 border border-white/20 drop-shadow-md"
                      >
                        <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        aria-label="Next photo"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white flex items-center justify-center backdrop-blur-xs transition-all hover:scale-105 active:scale-95 cursor-pointer focus:outline-none z-10 border border-white/20 drop-shadow-md"
                      >
                        <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                      </button>
                    </>
                  )}
                </div>

                {/* THE IMAGE CAROUSEL: Structural flow and section placement matching reference image */}
                {/* 4 Cards in a row with Left & Right arrows directly overlaid on the carousel edges */}
                <div className="relative w-full group/carousel select-none">
                  
                  {/* Left Navigation Arrow: Overlaid on the Left Edge of the Carousel */}
                  {galleryLength > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      aria-label="Previous carousel image"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer focus:outline-none border border-white/25 shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  )}

                  {/* Thumbnail Cards Grid - Spanning Full Width according to actual count */}
                  <div className={`grid gap-2.5 sm:gap-3.5 w-full ${
                    galleryLength === 1
                      ? 'grid-cols-1 max-w-[200px]'
                      : galleryLength === 2
                      ? 'grid-cols-2 max-w-[420px]'
                      : galleryLength === 3
                      ? 'grid-cols-3'
                      : 'grid-cols-4'
                  }`}>
                    {(hasMoreThanFour
                      ? galleryItems.slice(thumbnailStartIndex, thumbnailStartIndex + 4)
                      : galleryItems
                    ).map((item, sliceIdx) => {
                      const realIdx = hasMoreThanFour ? thumbnailStartIndex + sliceIdx : sliceIdx;
                      const isActive = activeImageIndex === realIdx;
                      return (
                        <button
                          key={realIdx}
                          type="button"
                          onClick={() => setActiveImageIndex(realIdx)}
                          aria-label={`View ${item.title || `Photo ${realIdx + 1}`}`}
                          className={`group aspect-4/3 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer relative bg-slate-100 ${
                            isActive
                              ? 'border-[#88D628] ring-2 ring-[#0F5A29]/25 shadow-md scale-[1.02]'
                              : 'border-slate-200 hover:border-slate-400 opacity-85 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.title || `Photo ${realIdx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80';
                            }}
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Navigation Arrow: Overlaid on the Right Edge of the Carousel */}
                  {galleryLength > 1 && (
                    <button
                      type="button"
                      onClick={handleNextImage}
                      aria-label="Next carousel image"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer focus:outline-none border border-white/25 shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>

              {/* PROJECT SCOPE & DETAILS SECTION */}
              <div className="space-y-6 text-left pt-2 min-w-0 max-w-full w-full overflow-hidden">
                
                {/* Header with Divider */}
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight uppercase">
                    PROJECT SCOPE &amp; DETAILS
                  </h2>
                  <div className="border-b-2 border-slate-900" />
                </div>

                {/* Dynamic User Scope Details or Default Fallback Scope Sections */}
                {project.scopeDetails && project.scopeDetails.trim() ? (
                  <div className="pt-2 min-w-0 max-w-full w-full overflow-hidden break-words [overflow-wrap:anywhere] [word-break:break-word]">
                    <RichTextRenderer content={project.scopeDetails} />
                  </div>
                ) : (
                  <div className="space-y-7 min-w-0 max-w-full w-full overflow-hidden">
                    {project.scopeSections.map((section, sIdx) => (
                      <div key={sIdx} className="space-y-3 min-w-0 max-w-full w-full overflow-hidden">
                        <h3 className="text-base sm:text-lg font-black text-[#0F172A] uppercase tracking-wide">
                          {section.title}
                        </h3>
                        
                        <ul className="space-y-2.5 text-sm sm:text-base text-slate-700 leading-relaxed pl-1 min-w-0 max-w-full w-full">
                          {section.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5 min-w-0 max-w-full">
                              <span className="text-slate-400 font-bold select-none">•</span>
                              <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                                <strong className="font-bold text-[#0F172A]">{bullet.label}: </strong>
                                {bullet.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

              </div>

            </div>

            {/* ========================================================================= */}
            {/* RIGHT COLUMN: Managing Engineer Card & Inquire About Similar Builds Form */}
            {/* ========================================================================= */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              
              {/* CARD 1: PROJECT CONTACTS & MEDIA */}
              <div className="bg-[#fcfdfd] p-6 sm:p-7 rounded-xl border border-slate-200/90 shadow-xs space-y-5 text-left">
                
                {/* Section Header: PROJECT CONTACTS & MEDIA */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-wide uppercase">
                    PROJECT CONTACTS &amp; MEDIA
                  </h3>
                  <div className="border-b border-slate-200 mt-3" />
                </div>

                {/* MANAGING ENGINEER */}
                <div className="space-y-1 pt-0.5">
                  <span className="block text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    MANAGING ENGINEER
                  </span>
                  <div className="text-[15px] sm:text-[17px] font-black text-[#0F172A] tracking-tight uppercase leading-snug">
                    {project.managingEngineer}
                  </div>
                  <div className="text-sm text-slate-500 font-medium leading-relaxed">
                    {project.engineerRole}
                  </div>
                </div>

                <div className="border-t border-slate-200" />

                {/* GENERAL CONTRACTOR */}
                <div className="space-y-1">
                  <span className="block text-[11px] font-mono font-bold tracking-widest text-[#0F5A29] uppercase">
                    GENERAL CONTRACTOR
                  </span>
                  <div className="text-[15px] sm:text-[17px] font-black text-[#0F172A] tracking-tight uppercase leading-snug">
                    {project.contractor}
                  </div>
                </div>

                <div className="border-t border-slate-200" />

                {/* COMPANY EMAIL ADDRESS & DESCRIPTION */}
                <div className="space-y-2">
                  <span className="block text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    COMPANY EMAIL ADDRESS:
                  </span>
                  <div>
                    <a
                      href={`mailto:${project.email}`}
                      className="inline-block text-sm sm:text-base font-bold text-[#0F5A29] hover:text-[#7bc421] transition-colors underline break-all"
                    >
                      {project.email}
                    </a>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
                    {project.engineerNote}
                  </p>
                </div>

              </div>

              {/* CARD 2: INQUIRE SERVICE / INQUIRE ABOUT SIMILAR BUILDS */}
              <div className="bg-[#fcfdfd] p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs text-left">
                
                {/* Header: Exact structural flow from reference image */}
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-black text-[#0F5A29] tracking-wide uppercase">
                    INQUIRE SERVICE
                  </h3>
                  <p className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase mt-0.5">
                    SEND US A MESSAGE
                  </p>
                  <div className="border-b border-slate-200 mt-3.5" />
                </div>

                {inquirySubmitted ? (
                  <div className="py-4 text-center space-y-4 animate-in fade-in duration-300">
                    {/* Centered Checkmark Badge */}
                    <div className="w-16 h-16 rounded-full bg-[#88D628]/15 border-2 border-[#88D628] flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-8 h-8 text-[#0F5A29]" />
                    </div>

                    {/* Main Title */}
                    <h4 className="text-2xl font-black text-[#0F172A] tracking-tight">
                      Assessment Initiated!
                    </h4>

                    {/* Thank You & Subtitle */}
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed max-w-xs mx-auto">
                      Thank you,{' '}
                      <span className="text-[#0F5A29] font-bold">
                        {inquiryName || 'Client'}
                      </span>
                      . Your technical solar assessment dossier has been securely initialized.
                    </p>

                    {/* PROJECT ID TRACK CARD */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-left space-y-2.5 shadow-2xs my-4">
                      <div className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                        PROJECT ID TRACK
                      </div>
                      <div className="text-base font-mono font-black text-[#0F172A] tracking-wider">
                        {leadId}
                      </div>
                      <div className="border-b border-slate-200/80 pt-0.5" />
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-500 font-medium">Scope Class:</span>
                        <span className="font-bold text-[#0F5A29]">
                          {propertyType} Setup
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Ocular Date:</span>
                        <span className="text-slate-600 font-medium text-[11px] sm:text-xs">
                          {preferredOcularDate || '2026-09-24'} ({preferredTimeSlot})
                        </span>
                      </div>
                    </div>

                    {/* Engineering Team Notice */}
                    <p className="text-xs text-slate-600 leading-relaxed text-center px-1">
                      Our engineering team from{' '}
                      <strong className="text-slate-900 font-bold">Solareign Solar Power Services</strong>{' '}
                      will review your structural inputs and contact you at{' '}
                      <span className="underline decoration-slate-400 text-slate-900 font-semibold">
                        {inquiryEmail || inquiryContact || 'your contact'}
                      </span>{' '}
                      within 2 business hours.
                    </p>

                    {/* SUBMIT ANOTHER REQUEST */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={resetInquiry}
                        className="text-xs font-mono font-black tracking-widest text-[#0F5A29] hover:text-[#7bc421] uppercase underline underline-offset-4 transition-colors cursor-pointer"
                      >
                        SUBMIT ANOTHER REQUEST
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Step Progress Bar & Sub-header */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider">
                        <span className="text-slate-400">
                          STEP {inquiryStep} OF 4
                        </span>
                        <span className="text-[#0F5A29]">
                          {inquiryStep === 1 && 'IDENTITY & LOCATION'}
                          {inquiryStep === 2 && 'ENERGY & ROOF SPECS'}
                          {inquiryStep === 3 && 'INVERTER & PANEL SETUP'}
                          {inquiryStep === 4 && 'OPTIMIZATION GOALS'}
                        </span>
                      </div>

                      {/* 4-segment Progress Bar matching reference structural flow */}
                      <div className="grid grid-cols-4 gap-1.5 mt-2">
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${inquiryStep >= 1 ? 'bg-[#88D628]' : 'bg-slate-200'}`} />
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${inquiryStep >= 2 ? 'bg-[#88D628]' : 'bg-slate-200'}`} />
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${inquiryStep >= 3 ? 'bg-[#88D628]' : 'bg-slate-200'}`} />
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${inquiryStep >= 4 ? 'bg-[#88D628]' : 'bg-slate-200'}`} />
                      </div>
                    </div>

                    {/* STEP 1: IDENTITY & LOCATION (Exact placement and structural flow from reference image) */}
                    {inquiryStep === 1 && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        {/* PROPERTY TYPE */}
                        <div className="space-y-1.5">
                          <label 
                            htmlFor="inquiry-property-type" 
                            className="block text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase"
                          >
                            PROPERTY TYPE
                          </label>
                          <div className="relative">
                            <select
                              id="inquiry-property-type"
                              value={propertyType}
                              onChange={(e) => setPropertyType(e.target.value)}
                              className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 text-sm font-semibold text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] transition-all cursor-pointer shadow-2xs"
                            >
                              <option value="Residential">Residential</option>
                              <option value="Commercial">Commercial</option>
                              <option value="Industrial">Industrial</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        {/* FULL NAME */}
                        <div className="space-y-1.5">
                          <label 
                            htmlFor="inquiry-full-name" 
                            className="block text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase"
                          >
                            FULL NAME
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              id="inquiry-full-name"
                              type="text"
                              required
                              value={inquiryName}
                              onChange={(e) => {
                                setInquiryName(e.target.value);
                                if (step1Error) setStep1Error('');
                              }}
                              placeholder="e.g. Juan dela Cruz"
                              className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] bg-white transition-all shadow-2xs"
                            />
                          </div>
                        </div>

                        {/* EMAIL ADDRESS & PHONE NUMBER (2 Columns side-by-side) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* EMAIL ADDRESS */}
                          <div className="space-y-1.5">
                            <label 
                              htmlFor="inquiry-email-address" 
                              className="block text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase"
                            >
                              EMAIL ADDRESS
                            </label>
                            <div className="relative">
                              <Mail className="w-4 h-4 text-slate-400 pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" />
                              <input
                                id="inquiry-email-address"
                                type="email"
                                value={inquiryEmail}
                                onChange={(e) => {
                                  setInquiryEmail(e.target.value);
                                  if (step1Error) setStep1Error('');
                                }}
                                placeholder="e.g. juan@don"
                                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] bg-white transition-all shadow-2xs"
                              />
                            </div>
                          </div>

                          {/* PHONE NUMBER */}
                          <div className="space-y-1.5">
                            <label 
                              htmlFor="inquiry-phone-number" 
                              className="block text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase"
                            >
                              PHONE NUMBER
                            </label>
                            <div className="relative">
                              <Phone className="w-4 h-4 text-slate-400 pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" />
                              <input
                                id="inquiry-phone-number"
                                type="tel"
                                value={inquiryContact}
                                onChange={(e) => {
                                  setInquiryContact(e.target.value);
                                  if (step1Error) setStep1Error('');
                                }}
                                placeholder="e.g. 0917 123 4567"
                                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] bg-white transition-all shadow-2xs"
                              />
                            </div>
                          </div>
                        </div>

                        {/* INSTALLATION ADDRESS */}
                        <div className="space-y-1.5">
                          <label 
                            htmlFor="inquiry-installation-address" 
                            className="block text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase"
                          >
                            INSTALLATION ADDRESS
                          </label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-slate-400 pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              id="inquiry-installation-address"
                              type="text"
                              value={inquiryAddress}
                              onChange={(e) => setInquiryAddress(e.target.value)}
                              placeholder="e.g. 45 Solar Way, Quezon City, Metro Manila"
                              className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] bg-white transition-all shadow-2xs"
                            />
                          </div>
                        </div>

                        {/* Error Alert */}
                        {step1Error && (
                          <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                            {step1Error}
                          </div>
                        )}

                        {/* CONTINUE BUTTON (Using our website's existing visual design and button styles) */}
                        <button
                          id="inquiry-step1-continue-btn"
                          type="button"
                          onClick={handleStep1Continue}
                          className="w-full py-3.5 px-4 rounded-xl bg-[#88D628] hover:bg-[#7bc421] active:bg-[#6eb21d] text-[#0F5A29] font-black text-xs uppercase tracking-widest transition-colors duration-150 cursor-pointer flex items-center justify-center gap-2 group mt-2"
                        >
                          <span>CONTINUE</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    )}

                    {/* STEP 2: ENERGY & ROOF SPECS (Matching reference image structural flow) */}
                    {inquiryStep === 2 && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        {/* UTILITY PROVIDER */}
                        <div className="space-y-1.5">
                          <label 
                            htmlFor="inquiry-utility-provider" 
                            className="block text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase"
                          >
                            UTILITY PROVIDER
                          </label>
                          <div className="relative">
                            <Building2 className="w-4 h-4 text-slate-400 pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              id="inquiry-utility-provider"
                              type="text"
                              value={utilityProvider}
                              onChange={(e) => setUtilityProvider(e.target.value)}
                              placeholder="e.g. Meralco, VECO, DLPC"
                              className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] bg-white transition-all shadow-2xs"
                            />
                          </div>
                        </div>

                        {/* MONTHLY ELECTRICITY BILL */}
                        <div className="space-y-1.5">
                          <label 
                            htmlFor="inquiry-monthly-bill" 
                            className="block text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase"
                          >
                            MONTHLY ELECTRICITY BILL
                          </label>
                          <div className="relative">
                            <select
                              id="inquiry-monthly-bill"
                              value={monthlyBill}
                              onChange={(e) => setMonthlyBill(e.target.value)}
                              className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 text-sm font-semibold text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] transition-all cursor-pointer shadow-2xs"
                            >
                              <option value="1,000 - 4,000 PHP">1,000 - 4,000 PHP</option>
                              <option value="5,000 - 8,000 PHP">5,000 - 8,000 PHP</option>
                              <option value="9,000 - 12,000 PHP">9,000 - 12,000 PHP</option>
                              <option value="13,000 - 16,000 PHP">13,000 - 16,000 PHP</option>
                              <option value="17,000 - 25,000 PHP">17,000 - 25,000 PHP</option>
                              <option value="26,000 - 40,000 PHP">26,000 - 40,000 PHP</option>
                              <option value="41,000 PHP - Up">41,000 PHP - Up</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        {/* ROOF TYPE */}
                        <div className="space-y-1.5">
                          <label 
                            htmlFor="inquiry-roof-type" 
                            className="block text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase"
                          >
                            ROOF TYPE
                          </label>
                          <div className="relative">
                            <select
                              id="inquiry-roof-type"
                              value={roofType}
                              onChange={(e) => setRoofType(e.target.value)}
                              className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 text-sm font-semibold text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] transition-all cursor-pointer shadow-2xs"
                            >
                              <option value="Rib-type / Corrugated GI Sheet">Rib-type / Corrugated GI Sheet</option>
                              <option value="Concrete Slab (Flat Roof)">Concrete Slab (Flat Roof)</option>
                              <option value="Tile Roof (Tisa)">Tile Roof (Tisa)</option>
                              <option value="Others / Not Sure">Others / Not Sure</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        {/* DAYTIME SHADING */}
                        <div className="space-y-1.5">
                          <label 
                            htmlFor="inquiry-daytime-shading" 
                            className="block text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase"
                          >
                            DAYTIME SHADING
                          </label>
                          <div className="relative">
                            <select
                              id="inquiry-daytime-shading"
                              value={daytimeShading}
                              onChange={(e) => setDaytimeShading(e.target.value)}
                              className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 text-sm font-semibold text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] transition-all cursor-pointer shadow-2xs"
                            >
                              <option value="No, clear sunlight all day">No, clear sunlight all day</option>
                              <option value="Yes, from nearby trees/buildings">Yes, from nearby trees/buildings</option>
                              <option value="Not Sure">Not Sure</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        {/* Action buttons matching reference image placement and website styles */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setInquiryStep(1)}
                            className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>BACK</span>
                          </button>
                          <button
                            id="inquiry-step2-continue-btn"
                            type="button"
                            onClick={() => setInquiryStep(3)}
                            className="py-3 px-4 rounded-xl bg-[#88D628] hover:bg-[#7bc421] active:bg-[#6eb21d] text-[#0F5A29] font-black text-xs uppercase tracking-widest transition-colors duration-150 cursor-pointer flex items-center justify-center gap-1.5 group"
                          >
                            <span>CONTINUE</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: INVERTER & PANEL SETUP (Matching reference image structural flow) */}
                    {inquiryStep === 3 && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        {/* DESIGNATED INVERTER LOCATION */}
                        <div className="space-y-1.5">
                          <label 
                            htmlFor="inquiry-inverter-location" 
                            className="block text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase"
                          >
                            DESIGNATED INVERTER LOCATION
                          </label>
                          <div className="relative">
                            <select
                              id="inquiry-inverter-location"
                              value={inverterLocation}
                              onChange={(e) => setInverterLocation(e.target.value)}
                              className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 text-sm font-semibold text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] transition-all cursor-pointer shadow-2xs truncate"
                            >
                              <option value="Yes, I have an inverter location selected">
                                Yes, I have an inverter location selected
                              </option>
                              <option value="No designated location yet (site survey needed)">
                                No designated location yet (site survey needed)
                              </option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        {/* SUGGESTED PHOTOS NOTICE BOX */}
                        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-left space-y-1">
                          <div className="text-xs sm:text-[13px] font-bold text-slate-900">
                            Suggested Photos (Optional):
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Since no safe inverter location is pre-designated, our engineering team suggests uploading 2 photos to verify your layout, though this is completely optional.
                          </p>
                        </div>

                        {/* TWO PHOTO UPLOAD BOXES (PHOTO 1 & PHOTO 2) */}
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                          {/* PHOTO 1: MAIN PANEL BOARD */}
                          <div className="space-y-1.5 flex flex-col">
                            <label className="block text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase leading-tight min-h-[2rem] flex items-end">
                              PHOTO 1: MAIN PANEL BOARD (OPTIONAL)
                            </label>
                            <input
                              ref={photo1InputRef}
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              onChange={handlePhoto1Change}
                              className="hidden"
                            />
                            {photo1 ? (
                              <div className="relative rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-center flex flex-col items-center justify-center min-h-[140px] space-y-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPhoto1(null);
                                  }}
                                  className="absolute top-2 right-2 p-1 rounded-full bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 shadow-2xs transition-colors"
                                  aria-label="Remove photo 1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                                <CheckCircle2 className="w-6 h-6 text-[#0F5A29]" />
                                <span className="text-xs font-bold text-[#0F172A] truncate max-w-[120px]">{photo1.name}</span>
                                <span className="text-[10px] font-mono text-slate-500">{(photo1.size / (1024 * 1024)).toFixed(1)} MB</span>
                              </div>
                            ) : (
                              <div
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setIsDraggingPhoto1(true);
                                }}
                                onDragLeave={() => setIsDraggingPhoto1(false)}
                                onDrop={handlePhoto1Drop}
                                onClick={() => photo1InputRef.current?.click()}
                                className={`p-3.5 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center min-h-[140px] space-y-1.5 ${
                                  isDraggingPhoto1
                                    ? 'border-[#88D628] bg-emerald-50/50'
                                    : 'border-slate-300 hover:border-[#88D628] bg-slate-50/60 hover:bg-white'
                                }`}
                              >
                                <Upload className="w-5 h-5 text-amber-600/90" />
                                <div className="text-[11px] font-medium text-slate-600 leading-snug">
                                  Drag and drop image here or{' '}
                                  <span className="text-[#0F5A29] font-bold underline hover:text-[#7bc421]">
                                    browse files
                                  </span>
                                </div>
                                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                  PNG, JPG, JPEG OR WEBP
                                </div>
                              </div>
                            )}
                          </div>

                          {/* PHOTO 2: PROPOSED LOCATION */}
                          <div className="space-y-1.5 flex flex-col">
                            <label className="block text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase leading-tight min-h-[2rem] flex items-end">
                              PHOTO 2: PROPOSED LOCATION (OPTIONAL)
                            </label>
                            <input
                              ref={photo2InputRef}
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp"
                              onChange={handlePhoto2Change}
                              className="hidden"
                            />
                            {photo2 ? (
                              <div className="relative rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-center flex flex-col items-center justify-center min-h-[140px] space-y-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPhoto2(null);
                                  }}
                                  className="absolute top-2 right-2 p-1 rounded-full bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 shadow-2xs transition-colors"
                                  aria-label="Remove photo 2"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                                <CheckCircle2 className="w-6 h-6 text-[#0F5A29]" />
                                <span className="text-xs font-bold text-[#0F172A] truncate max-w-[120px]">{photo2.name}</span>
                                <span className="text-[10px] font-mono text-slate-500">{(photo2.size / (1024 * 1024)).toFixed(1)} MB</span>
                              </div>
                            ) : (
                              <div
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  setIsDraggingPhoto2(true);
                                }}
                                onDragLeave={() => setIsDraggingPhoto2(false)}
                                onDrop={handlePhoto2Drop}
                                onClick={() => photo2InputRef.current?.click()}
                                className={`p-3.5 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center min-h-[140px] space-y-1.5 ${
                                  isDraggingPhoto2
                                    ? 'border-[#88D628] bg-emerald-50/50'
                                    : 'border-slate-300 hover:border-[#88D628] bg-slate-50/60 hover:bg-white'
                                }`}
                              >
                                <Upload className="w-5 h-5 text-amber-600/90" />
                                <div className="text-[11px] font-medium text-slate-600 leading-snug">
                                  Drag and drop image here or{' '}
                                  <span className="text-[#0F5A29] font-bold underline hover:text-[#7bc421]">
                                    browse files
                                  </span>
                                </div>
                                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                  PNG, JPG, JPEG OR WEBP
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setInquiryStep(2)}
                            className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>BACK</span>
                          </button>
                          <button
                            id="inquiry-step3-continue-btn"
                            type="button"
                            onClick={() => setInquiryStep(4)}
                            className="py-3 px-4 rounded-xl bg-[#88D628] hover:bg-[#7bc421] active:bg-[#6eb21d] text-[#0F5A29] font-black text-xs uppercase tracking-widest transition-colors duration-150 cursor-pointer flex items-center justify-center gap-1.5 group"
                          >
                            <span>CONTINUE</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: OPTIMIZATION GOALS (Matching reference image structural flow) */}
                    {inquiryStep === 4 && (
                      <div className="space-y-4 animate-in fade-in duration-200">
                        {/* PRIMARY GOAL */}
                        <div className="space-y-1.5">
                          <label 
                            htmlFor="inquiry-primary-goal" 
                            className="block text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase"
                          >
                            PRIMARY GOAL
                          </label>
                          <div className="relative">
                            <select
                              id="inquiry-primary-goal"
                              value={primaryGoal}
                              onChange={(e) => setPrimaryGoal(e.target.value)}
                              className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 text-sm font-semibold text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] transition-all cursor-pointer shadow-2xs truncate"
                            >
                              <option value="Lowering daytime electric bill (Grid-Tied)">
                                Lowering daytime electric bill (Grid-Tied)
                              </option>
                              <option value="Backup power (Hybrid / Battery)">
                                Backup power (Hybrid / Battery)
                              </option>
                              <option value="Going completely off-grid">
                                Going completely off-grid
                              </option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        {/* TIMELINE */}
                        <div className="space-y-1.5">
                          <label 
                            htmlFor="inquiry-timeline" 
                            className="block text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase"
                          >
                            TIMELINE
                          </label>
                          <div className="relative">
                            <select
                              id="inquiry-timeline"
                              value={timeline}
                              onChange={(e) => setTimeline(e.target.value)}
                              className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 text-sm font-semibold text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] transition-all cursor-pointer shadow-2xs truncate"
                            >
                              <option value="Immediately (2-3 weeks)">Immediately (2-3 weeks)</option>
                              <option value="In 1 to 3 months">In 1 to 3 months</option>
                              <option value="Just researching">Just researching</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        {/* 2-COLUMN ROW: PREFERRED OCULAR VISIT DATE & PREFERRED VISIT TIME SLOT */}
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                          {/* PREFERRED OCULAR VISIT DATE */}
                          <div className="space-y-1.5">
                            <label 
                              htmlFor="inquiry-ocular-date" 
                              className="block text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase leading-tight min-h-[2rem] flex items-end"
                            >
                              PREFERRED OCULAR VISIT DATE
                            </label>
                            <input
                              id="inquiry-ocular-date"
                              type="date"
                              min={new Date().toISOString().split('T')[0]}
                              value={preferredOcularDate}
                              onChange={(e) => setPreferredOcularDate(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] transition-all cursor-pointer shadow-2xs"
                              aria-label="Select preferred ocular visit date"
                            />
                          </div>

                          {/* PREFERRED VISIT TIME SLOT */}
                          <div className="space-y-1.5">
                            <label 
                              htmlFor="inquiry-time-slot" 
                              className="block text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase leading-tight min-h-[2rem] flex items-end"
                            >
                              PREFERRED VISIT TIME SLOT
                            </label>
                            <div className="relative">
                              <Clock className="w-4 h-4 text-slate-400 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
                              <select
                                id="inquiry-time-slot"
                                value={preferredTimeSlot}
                                onChange={(e) => setPreferredTimeSlot(e.target.value)}
                                className="w-full appearance-none pl-9 pr-7 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-[#88D628] focus:border-[#0F5A29] transition-all cursor-pointer shadow-2xs truncate"
                              >
                                <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                                <option value="1:00 PM - 4:00 PM">1:00 PM - 4:00 PM</option>
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>
                        </div>

                        {/* UPLOAD LATEST BILL (OPTIONAL) */}
                        <div className="space-y-1.5">
                          <span className="block text-[11px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                            UPLOAD LATEST BILL (OPTIONAL)
                          </span>
                          <p className="text-xs text-slate-500 italic leading-relaxed">
                            Attaching your utility billing history allows engineers to compile simulation projections with 98% accuracy.
                          </p>

                          <input
                            ref={billFileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                            onChange={handleBillChange}
                            className="hidden"
                          />

                          {billFile ? (
                            <div className="relative rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-center flex flex-col items-center justify-center min-h-[105px] space-y-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBillFile(null);
                                }}
                                className="absolute top-2 right-2 p-1 rounded-full bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 shadow-2xs transition-colors"
                                aria-label="Remove uploaded bill"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <CheckCircle2 className="w-6 h-6 text-[#0F5A29]" />
                              <span className="text-xs font-bold text-[#0F172A] truncate max-w-[200px]">{billFile.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">{(billFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                            </div>
                          ) : (
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDraggingBill(true);
                              }}
                              onDragLeave={() => setIsDraggingBill(false)}
                              onDrop={handleBillDrop}
                              onClick={() => billFileInputRef.current?.click()}
                              className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center min-h-[105px] space-y-1 ${
                                isDraggingBill
                                  ? 'border-[#88D628] bg-emerald-50/50'
                                  : 'border-slate-300 hover:border-[#88D628] bg-slate-50/60 hover:bg-white'
                              }`}
                            >
                              <Upload className="w-5 h-5 text-amber-600/90 mb-0.5" />
                              <div className="text-[11px] font-medium text-slate-600 leading-snug">
                                Drag and drop image here or{' '}
                                <span className="text-[#0F5A29] font-bold underline hover:text-[#7bc421]">
                                  browse files
                                </span>
                              </div>
                              <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                PNG, JPG, JPEG OR WEBP
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setInquiryStep(3)}
                            className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back</span>
                          </button>
                          <button
                            id="submit-inquiry-btn"
                            type="button"
                            onClick={handleInquirySubmit}
                            className="py-3 px-4 rounded-xl bg-[#88D628] hover:bg-[#7bc421] active:bg-[#6eb21d] text-[#0F5A29] font-black text-xs uppercase tracking-widest transition-colors duration-150 cursor-pointer flex items-center justify-center gap-1.5 group"
                          >
                            <span>SUBMIT APPLICATION</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
