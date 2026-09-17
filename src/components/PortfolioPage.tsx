import { useState, useMemo, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Search,
  SlidersHorizontal,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  Briefcase,
  CheckCircle2, 
  X, 
  MapPin, 
  Zap, 
  Calendar, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Award, 
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { COMPANY_INFO } from '../data';
import { PORTFOLIO_PROJECTS, ProjectItem } from '../data/projectsData';
import { useSolareignData } from '../context/DataContext';

export type { ProjectItem };

interface PortfolioPageProps {
  onConsultationClick: (preset?: string) => void;
  onSelectProject?: (projectId: string) => void;
}

export default function PortfolioPage({ onConsultationClick, onSelectProject }: PortfolioPageProps) {
  const { projects } = useSolareignData();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSegment, setSelectedSegment] = useState<string>('All Segments');
  const [sortBy, setSortBy] = useState<string>('Newest to Oldest');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6; // 2 columns x 3 rows = 6 items per page

  // Filter and sort projects based on search query, segment, and sorting selection
  const filteredAndSortedProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Segment filter
        const projSegment = (project.segment || '').toLowerCase();
        const projCategory = (project.category || '').toLowerCase();
        const segFilter = selectedSegment.toLowerCase();
        const matchesSegment =
          selectedSegment === 'All Segments' ||
          projSegment === segFilter ||
          projCategory.includes(segFilter);

        if (!matchesSegment) return false;

        // Search query filter
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          (project.title || '').toLowerCase().includes(q) ||
          (project.location || '').toLowerCase().includes(q) ||
          projSegment.includes(q) ||
          projCategory.includes(q) ||
          (project.details || '').toLowerCase().includes(q) ||
          (project.capacity || '').toLowerCase().includes(q) ||
          (project.inverterBrand || '').toLowerCase().includes(q) ||
          (project.summary || '').toLowerCase().includes(q) ||
          (project.clientName || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const getTime = (p: ProjectItem): number => {
          if (p.publishedDate) {
            const t = new Date(p.publishedDate).getTime();
            if (!isNaN(t)) return t;
          }
          if (p.year) {
            const y = parseInt(p.year, 10);
            if (!isNaN(y)) return new Date(`${y}-01-01`).getTime();
          }
          return 0;
        };

        if (sortBy === 'Oldest to Newest') {
          return getTime(a) - getTime(b);
        }
        if (sortBy === 'Alphabetical: A to Z') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'Alphabetical: Z to A') {
          return (b.title || '').localeCompare(a.title || '');
        }
        // Default: 'Newest to Oldest'
        return getTime(b) - getTime(a);
      });
  }, [projects, searchQuery, selectedSegment, sortBy]);

  // Reset to page 1 whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSegment, sortBy]);

  // Pagination calculations
  const totalProjects = filteredAndSortedProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalProjects / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = useMemo(() => {
    return filteredAndSortedProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedProjects, startIndex]);
  const displayStart = totalProjects === 0 ? 0 : startIndex + 1;
  const displayEnd = Math.min(startIndex + ITEMS_PER_PAGE, totalProjects);

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* 1. Page Hero Banner (matching Reference Structural Flow) */}
      <section
        id="portfolio-hero"
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
              OUR PORTFOLIO
            </h1>
          </div>
        </div>
      </section>

      {/* SECTION 2: Filter, Search & 2-Column Portfolio Grid Layout (matching Reference Structural Flow) */}
      <section id="portfolio-showcase" className="py-12 sm:py-16 lg:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Filter, Search & Sort Toolbar matching Reference Image Structural Flow */}
          <div className="flex flex-col md:flex-row items-stretch gap-3 sm:gap-4 mb-10 lg:mb-12">
            
            {/* 1. SEARCH INPUT */}
            <div className="relative flex-1 flex items-center bg-white border border-slate-300/90 rounded-lg px-4 py-3.5 focus-within:border-[#0F5A29] focus-within:ring-2 focus-within:ring-[#88D628]/30 transition-all shadow-xs">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3 pointer-events-none" />
              <input
                id="portfolio-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-transparent text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 2. CATEGORY / SEGMENT FILTER DROPDOWN */}
            <div className="relative min-w-[210px] lg:min-w-[240px] flex items-center justify-between bg-white border border-slate-300/90 rounded-lg px-4 py-3.5 hover:border-slate-400 focus-within:border-[#0F5A29] focus-within:ring-2 focus-within:ring-[#88D628]/30 transition-all cursor-pointer shadow-xs">
              <div className="flex items-center gap-2.5 truncate mr-3">
                <Filter className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="font-bold text-xs sm:text-sm tracking-wider uppercase text-[#0F172A] truncate">
                  {selectedSegment === 'All Segments' ? 'ALL PROJECTS' : selectedSegment.toUpperCase()}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
              <select
                id="portfolio-segment-select"
                aria-label="Filter projects by category"
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
                <option value="All Segments">ALL PROJECTS</option>
                <option value="Residential">RESIDENTIAL</option>
                <option value="Commercial">COMMERCIAL</option>
                <option value="Industrial">INDUSTRIAL</option>
              </select>
            </div>

            {/* 3. SORT DROPDOWN (Second dropdown box) */}
            <div className="relative min-w-[210px] lg:min-w-[240px] flex items-center justify-between bg-white border border-slate-300/90 rounded-lg px-4 py-3.5 hover:border-slate-400 focus-within:border-[#0F5A29] focus-within:ring-2 focus-within:ring-[#88D628]/30 transition-all cursor-pointer shadow-xs">
              <div className="flex items-center gap-2.5 truncate mr-3">
                <ArrowUpDown className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="font-bold text-xs sm:text-sm tracking-wider uppercase text-[#0F172A] truncate">
                  {sortBy}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
              <select
                id="portfolio-sort-select"
                aria-label="Sort projects"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
                <option value="Newest to Oldest">Newest to Oldest</option>
                <option value="Oldest to Newest">Oldest to Newest</option>
                <option value="Alphabetical: A to Z">Alphabetical: A to Z</option>
                <option value="Alphabetical: Z to A">Alphabetical: Z to A</option>
              </select>
            </div>

          </div>

          {/* 2x3 Grid Layout (2 Columns x 3 Rows = 6 Cards Per Page) */}
          <div id="portfolio-grid-top" className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8 scroll-mt-24">
            {paginatedProjects.map((project) => (
              <div
                key={project.id}
                id={`portfolio-card-${project.id}`}
                onClick={() => {
                  if (onSelectProject) {
                    onSelectProject(project.id);
                  } else {
                    setSelectedProject(project);
                  }
                }}
                className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                {/* Featured Image Frame */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900">
                  <img
                    src={project.image}
                    alt={`${project.title} installation`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle vignette gradient fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Card Information Body matching Reference Structural Flow */}
                <div className="p-5 sm:p-6 text-left flex flex-col justify-between gap-3 flex-grow">
                  {/* Eyebrow: [Building Icon] CATEGORY • [MapPin Icon] LOCATION */}
                  <div className="flex items-center flex-wrap gap-2 text-xs">
                    {/* Category with Building Icon */}
                    <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#0F5A29]">
                      <Building2 className="w-3.5 h-3.5 text-[#0F5A29] shrink-0" />
                      <span>{project.segment || project.category}</span>
                    </span>

                    <span className="text-slate-300 font-normal">•</span>

                    {/* Location with Pin Icon */}
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{project.location}</span>
                    </span>
                  </div>

                  {/* Title & Arrow Action Button Row */}
                  <div className="flex items-start justify-between gap-4 pt-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] group-hover:text-[#0F5A29] transition-colors tracking-tight leading-snug flex-grow min-w-0 break-words [overflow-wrap:anywhere]">
                      {project.title}
                    </h3>

                    <div 
                      className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 mt-0.5 rounded-lg border border-slate-300 bg-white flex items-center justify-center text-slate-800 group-hover:bg-[#0F5A29] group-hover:text-white group-hover:border-[#0F5A29] transition-all shadow-2xs"
                      title="View Project Details"
                    >
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Section matching Reference Image Layout */}
          {totalProjects > 0 && (
            <div className="border-t border-slate-200/90 mt-10 sm:mt-12 pt-6 sm:pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left Side: SHOWING X-Y OF Z PROJECTS */}
              <div className="text-xs sm:text-sm font-mono tracking-wider text-slate-500 uppercase">
                SHOWING <span className="font-bold text-slate-900">{displayStart}-{displayEnd}</span> OF{' '}
                <span className="font-bold text-slate-900">{totalProjects}</span> PROJECTS
              </div>

              {/* Right Side: PREV, Page Number Buttons, NEXT */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* PREV Button */}
                <button
                  type="button"
                  id="portfolio-prev-page-btn"
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    const el = document.getElementById('portfolio-grid-top');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:text-[#0F5A29] hover:border-[#0F5A29] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-700 shadow-2xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>PREV</span>
                </button>

                {/* Numbered Page Buttons */}
                {Array.from({ length: totalPages }, (_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      id={`portfolio-page-btn-${pageNum}`}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        const el = document.getElementById('portfolio-grid-top');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-mono text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer ${
                        isActive
                          ? 'bg-[#0F5A29] text-white border border-[#0F5A29]'
                          : 'bg-white border border-slate-300 text-slate-700 hover:border-[#0F5A29] hover:text-[#0F5A29]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* NEXT Button */}
                <button
                  type="button"
                  id="portfolio-next-page-btn"
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    const el = document.getElementById('portfolio-grid-top');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:text-[#0F5A29] hover:border-[#0F5A29] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-700 shadow-2xs cursor-pointer"
                >
                  <span>NEXT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Empty State if no search matches */}
          {filteredAndSortedProjects.length === 0 && (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <p className="text-slate-500 text-base font-medium">
                No projects found matching &ldquo;{searchQuery}&rdquo; in {selectedSegment}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSegment('All Segments');
                  setSortBy('Latest');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#88D628] text-[#0F5A29] font-bold text-sm hover:bg-[#7bc421] transition-colors duration-150 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Modal / Lightbox Effect: Additional Photos, System Specs, and Project Duration */}
      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 bg-[#0F5A29] text-white border-b border-emerald-700">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#88D628] uppercase">
                  <span>COMMISSION DOSSIER: {selectedProject.id.toUpperCase()}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-emerald-800 transition-colors focus:outline-none"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Photo Gallery Strip */}
              <div className="space-y-2">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  Site Installation Photography
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedProject.galleryImages.map((imgUrl, i) => (
                    <div key={i} className="aspect-16/10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={imgUrl}
                        alt={`${selectedProject.title} view ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="space-y-3">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#0F5A29]">
                  System Engineering Blueprint &amp; Specs
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">System Capacity</span>
                    <span className="text-base font-black text-[#0F5A29] flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#88D628]" />
                      {selectedProject.capacity}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Commission Year</span>
                    <span className="text-base font-black text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#0F5A29]" />
                      {selectedProject.year}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Installation Duration</span>
                    <span className="text-base font-black text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#0F5A29]" />
                      {selectedProject.duration}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2 lg:col-span-1">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Annual Power Harvest</span>
                    <span className="text-base font-black text-emerald-700 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-[#88D628]" />
                      {selectedProject.annualGeneration}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Inverter Model / Brand</span>
                    <span className="text-sm font-bold text-slate-800">
                      {selectedProject.inverterBrand}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Sector Categorization</span>
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#0F5A29]" />
                      {selectedProject.segment}
                    </span>
                  </div>
                  {selectedProject.clientName ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Client Representative</span>
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-[#0F5A29]" />
                        {selectedProject.clientName}
                      </span>
                    </div>
                  ) : null}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-3">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">PV Panel Array Specifications</span>
                    <span className="text-sm font-bold text-slate-800">
                      {selectedProject.panelWattage}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Summary & Highlights */}
              <div className="space-y-2">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  Engineering Scope Summary
                </p>
                <p className="text-sm text-slate-600 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
                  {selectedProject.summary}
                </p>
                
                <div className="pt-2 space-y-2">
                  {selectedProject.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#88D628] flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <MapPin className="w-4 h-4 text-[#0F5A29]" />
                <span>Installed in {selectedProject.location}</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = selectedProject.title;
                    setSelectedProject(null);
                    onConsultationClick(`Inquiry regarding Portfolio project: ${title}`);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#88D628] hover:bg-[#7bc421] text-[#0F5A29] font-extrabold text-xs transition-colors duration-150"
                >
                  <span>Build Similar System</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
