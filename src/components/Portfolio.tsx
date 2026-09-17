import { MapPin } from 'lucide-react';
import { ProjectItem } from '../data/projectsData';
import { useSolareignData } from '../context/DataContext';

interface PortfolioProps {
  onSelectProject?: (projectId: string) => void;
  onExplorePortfolio?: () => void;
}

export default function Portfolio({ onSelectProject }: PortfolioProps) {
  // Retrieve the latest published portfolio installations from synchronized store
  const { getNewestProjects } = useSolareignData();
  const newestProjects = getNewestProjects(5);
  const topProjects = newestProjects.slice(0, 2);
  const bottomProjects = newestProjects.slice(2, 5);

  const renderInstallationCard = (project: ProjectItem, indexKey: string, heightClass: string) => (
    <div
      key={project.id}
      id={`featured-installation-${indexKey}`}
      onClick={() => onSelectProject?.(project.id)}
      className={`group relative rounded-2xl overflow-hidden border-2 border-white/90 ring-1 ring-slate-300/80 shadow-md hover:shadow-2xl hover:border-[#88D628] hover:ring-[#88D628]/40 transition-all duration-500 bg-slate-950 cursor-pointer ${heightClass} flex flex-col justify-end p-6 sm:p-8`}
    >
      {/* Background Image with Zoom on Hover */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={project.image}
          alt={`${project.title} - ${project.location}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-95"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Deep bottom gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/15" />
      </div>

      {/* Bottom Content Following Reference Hierarchy */}
      <div className="relative z-10 space-y-2 text-left min-w-0 max-w-full">
        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#88D628] transition-colors tracking-tight leading-tight min-w-0 break-words [overflow-wrap:anywhere]">
          {project.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm font-semibold text-[#88D628] pt-1">
          <MapPin className="w-4 h-4 text-[#88D628] flex-shrink-0" />
          <span>{project.location}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section id="portfolio" className="py-20 bg-slate-100 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Centered Flow Following Reference Layout */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-black tracking-widest uppercase text-[#0F5A29]">
            <span className="w-2.5 h-2.5 bg-[#0F5A29] shrink-0 inline-block" aria-hidden="true" />
            <span>OUR PROFESSIONAL WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            <span className="text-[#0F172A]">Proven Solar Performance. </span>
            <br className="hidden sm:inline" />
            <span className="text-[#0F5A29]">Featured Installations</span>
          </h2>
        </div>

        {/* Top Row: 2 Newest Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
          {topProjects.map((project, index) =>
            renderInstallationCard(project, `top-${index + 1}`, 'h-80 sm:h-96 md:h-[400px]')
          )}
        </div>

        {/* Bottom Row: Next 3 Newest Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {bottomProjects.map((project, index) =>
            renderInstallationCard(project, `bottom-${index + 1}`, 'h-80 sm:h-96 md:h-[380px]')
          )}
        </div>
      </div>
    </section>
  );
}

