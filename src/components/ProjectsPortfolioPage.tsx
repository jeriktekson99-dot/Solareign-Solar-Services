import { useState, useMemo, useEffect, FormEvent } from 'react';
import {
  Search,
  Plus,
  Pencil,
  Eye,
  ExternalLink,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Download,
  MapPin,
  Zap,
  Calendar,
  Layers,
  Image as ImageIcon,
  ImageOff,
  Check,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles
} from 'lucide-react';
import { ProjectItem } from '../data/projectsData';
import AddProjectModal from './AddProjectModal';
import ProjectDetailsView from './ProjectDetailsView';
import ConfirmationActionModal from './ConfirmationActionModal';

interface ProjectsPortfolioPageProps {
  projects: ProjectItem[];
  onAddProject: (project: Partial<ProjectItem>) => void;
  onUpdateProject: (projectId: string, updated: Partial<ProjectItem>) => void;
  onArchiveProject: (projectId: string) => void;
  onViewPublicShowcase?: (projectId: string) => void;
  initialSelectedProjectId?: string | null;
  onClearInitialSelectedProject?: () => void;
  initialSearchTerm?: string;
}

export default function ProjectsPortfolioPage({
  projects,
  onAddProject,
  onUpdateProject,
  onArchiveProject,
  onViewPublicShowcase,
  initialSelectedProjectId,
  onClearInitialSelectedProject,
  initialSearchTerm
}: ProjectsPortfolioPageProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [selectedSegment, setSelectedSegment] = useState<string>('ALL');

  // Multi-selection state
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [archiveTargetProject, setArchiveTargetProject] = useState<ProjectItem | null>(null);
  const [isBulkArchiveModalOpen, setIsBulkArchiveModalOpen] = useState(false);
  const [dossierProject, setDossierProject] = useState<ProjectItem | null>(() => {
    if (initialSelectedProjectId) {
      return projects.find((p) => p.id === initialSelectedProjectId) || null;
    }
    return null;
  });
  const [previewProject, setPreviewProject] = useState<ProjectItem | null>(null);

  // Sync initialSelectedProjectId if passed or changed from outside
  useEffect(() => {
    if (initialSelectedProjectId) {
      const match = projects.find((p) => p.id === initialSelectedProjectId);
      if (match) {
        setDossierProject(match);
      }
    }
  }, [initialSelectedProjectId, projects]);

  // Sync initialSearchTerm if changed from outside
  useEffect(() => {
    if (initialSearchTerm !== undefined) {
      setSearchTerm(initialSearchTerm);
      setCurrentPage(1);
    }
  }, [initialSearchTerm]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Project Form state
  const [addForm, setAddForm] = useState({
    projectCode: '',
    title: '',
    subtitle: '',
    clientName: '',
    segment: 'Residential' as ProjectItem['segment'],
    category: 'Residential Hybrid' as ProjectItem['category'],
    location: '',
    capacity: '15 kWp',
    inverterBrand: 'Deye 15kW Smart 3-Phase Hybrid Inverter',
    panelWattage: '28x 550W Tier-1 N-Type Monocrystalline Panels',
    annualGeneration: '~21,900 kWh / Year',
    image: '',
    status: 'Completed' as ProjectItem['status']
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filter projects based on search query and asset segment
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Segment filter
      if (selectedSegment !== 'ALL') {
        const seg = (project.segment || '').toLowerCase();
        const cat = (project.category || '').toLowerCase();
        const target = selectedSegment.toLowerCase();
        if (seg !== target && !cat.includes(target)) {
          return false;
        }
      }

      // Search filter
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      const code = (project.projectCode || project.id || '').toLowerCase();
      const title = (project.title || '').toLowerCase();
      const subtitle = (project.subtitle || project.details || '').toLowerCase();
      const location = (project.location || '').toLowerCase();
      const capacity = (project.capacity || '').toLowerCase();

      return (
        code.includes(q) ||
        title.includes(q) ||
        subtitle.includes(q) ||
        location.includes(q) ||
        capacity.includes(q)
      );
    });
  }, [projects, selectedSegment, searchTerm]);

  // Paginated records
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProjects = useMemo(() => {
    const start = (validCurrentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, validCurrentPage, itemsPerPage]);

  // Checkbox helpers
  const allCurrentPageSelected =
    paginatedProjects.length > 0 &&
    paginatedProjects.every((p) => selectedProjectIds.includes(p.id));

  const toggleSelectAll = () => {
    if (allCurrentPageSelected) {
      // Unselect all on current page
      setSelectedProjectIds((prev) =>
        prev.filter((id) => !paginatedProjects.some((p) => p.id === id))
      );
    } else {
      // Add all on current page
      const currentIds = paginatedProjects.map((p) => p.id);
      setSelectedProjectIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const toggleSelectProject = (id: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkArchive = () => {
    if (selectedProjectIds.length === 0) return;
    const count = selectedProjectIds.length;
    selectedProjectIds.forEach((id) => onArchiveProject(id));
    setSelectedProjectIds([]);
    showToast(`Archived ${count} project(s) successfully.`);
  };

  const handleBulkChangeSegment = (newSegment: ProjectItem['segment']) => {
    if (selectedProjectIds.length === 0) return;
    selectedProjectIds.forEach((id) => {
      onUpdateProject(id, { segment: newSegment });
    });
    const count = selectedProjectIds.length;
    setSelectedProjectIds([]);
    showToast(`Updated ${count} project(s) to ${newSegment}.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const items = selectedProjectIds.length > 0
      ? projects.filter((p) => selectedProjectIds.includes(p.id))
      : filteredProjects;

    if (items.length === 0) {
      showToast('No projects to export.');
      return;
    }

    const headers = [
      'Project ID',
      'Display Name',
      'Subtitle',
      'Asset Segment',
      'Geographical Location',
      'Capacity',
      'Status',
      'Inverter Brand',
      'Panel Wattage'
    ];

    const rows = items.map((p) => [
      `"${p.projectCode || p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${(p.subtitle || p.details || '').replace(/"/g, '""')}"`,
      `"${p.segment}"`,
      `"${p.location.replace(/"/g, '""')}"`,
      `"${p.capacity}"`,
      `"${p.status}"`,
      `"${p.inverterBrand}"`,
      `"${p.panelWattage}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `solareign_portfolio_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${items.length} project(s) to CSV.`);
  };

  // Add Project Submission
  const handleCreateProject = (e: FormEvent) => {
    e.preventDefault();
    if (!addForm.title.trim() || !addForm.location.trim()) {
      showToast('Please provide a title and location.');
      return;
    }

    // Auto generate project code if blank
    const randomSuffix = String(Math.floor(10 + Math.random() * 90)).padStart(2, '0');
    const assignedCode = addForm.projectCode.trim() || `PROJ-206-${randomSuffix}`;

    onAddProject({
      projectCode: assignedCode,
      title: addForm.title.trim(),
      subtitle: addForm.subtitle.trim() || `${addForm.segment} installation in ${addForm.location}`,
      clientName: addForm.clientName.trim(),
      segment: addForm.segment,
      category: addForm.category,
      location: addForm.location.trim(),
      capacity: addForm.capacity.trim() || '10 kWp',
      inverterBrand: addForm.inverterBrand.trim(),
      panelWattage: addForm.panelWattage.trim(),
      annualGeneration: addForm.annualGeneration.trim(),
      image: addForm.image.trim(),
      galleryImages: addForm.image.trim() ? [addForm.image.trim()] : [],
      status: addForm.status,
      summary: addForm.subtitle.trim() || `Solar photovoltaic system installed in ${addForm.location}.`,
      highlights: [
        'Rapid zero-export grid synchronization',
        'Tier-1 high efficiency photovoltaic modules',
        'Certified structural engineer mounting certification'
      ],
      duration: '2 Weeks',
      year: new Date().getFullYear().toString(),
      publishedDate: new Date().toISOString().split('T')[0]
    });

    setIsAddModalOpen(false);
    setAddForm({
      projectCode: '',
      title: '',
      subtitle: '',
      clientName: '',
      segment: 'Residential',
      category: 'Residential Hybrid',
      location: '',
      capacity: '15 kWp',
      inverterBrand: 'Deye 15kW Smart 3-Phase Hybrid Inverter',
      panelWattage: '28x 550W Tier-1 N-Type Monocrystalline Panels',
      annualGeneration: '~21,900 kWh / Year',
      image: '',
      status: 'Completed'
    });

    showToast(`Project ${assignedCode} created and published.`);
  };

  // Helper for Asset Segment badge styling
  const getSegmentBadge = (segment: string) => {
    switch (segment.toLowerCase()) {
      case 'residential':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
            Residential
          </span>
        );
      case 'commercial':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Commercial
          </span>
        );
      case 'industrial':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Industrial
          </span>
        );
      case 'off-grid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            Off-Grid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {segment}
          </span>
        );
    }
  };

  // If user is viewing project details
  if (dossierProject) {
    const activeProject =
      projects.find((p) => p.id === dossierProject.id) || dossierProject;

    return (
      <div className="space-y-4">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-[#88D628]" />
            <span>{toastMessage}</span>
          </div>
        )}

        <ProjectDetailsView
          project={activeProject}
          onBack={() => {
            setDossierProject(null);
            if (onClearInitialSelectedProject) onClearInitialSelectedProject();
          }}
          onDelete={(id) => {
            onArchiveProject(id);
            showToast(`Project moved to Archive.`);
            setDossierProject(null);
            if (onClearInitialSelectedProject) onClearInitialSelectedProject();
          }}
          onEdit={(proj) => {
            setEditingProject(proj);
          }}
        />

        {/* MODAL 2: EDIT PROJECT (using Add Project modal widget in edit mode) */}
        <AddProjectModal
          isOpen={Boolean(editingProject)}
          projectToEdit={editingProject}
          onClose={() => setEditingProject(null)}
          onUpdateProject={(id, updates) => {
            onUpdateProject(id, updates);
            showToast(`Project ${editingProject?.projectCode || id} updated successfully.`);
            setEditingProject(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-[#88D628]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER - Following the Structural Placement in Reference Image */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F5A29] tracking-tight uppercase">
            PROJECT PORTFOLIO
          </h1>
          <p className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase mt-0.5">
            TRACK AND MANAGE ACTIVE SOLAR INSTALLATIONS.
          </p>
        </div>

        {/* Action Controls maintaining Solareign styling */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#0F5A29] bg-white border border-slate-200 hover:border-[#88D628] shadow-2xs transition-colors cursor-pointer"
            title="Export portfolio records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => {
              // Pre-calculate next project code
              const nextNum = String(projects.length + 1).padStart(2, '0');
              setAddForm((prev) => ({
                ...prev,
                projectCode: `PROJ-206-${nextNum}`
              }));
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-[#0F5A29] hover:bg-[#0b401d] text-white tracking-wide shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#88D628]" />
            <span>+ ADD NEW PROJECT</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER CARD - Reorganized to Match Reference Layout */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* TOP FILTER & SEARCH ROW */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Left: Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search projects by customer or region..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#0F5A29] rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0F5A29] transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right: Asset Segment Filter Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              SEGMENT:
            </span>
            <select
              value={selectedSegment}
              onChange={(e) => {
                setSelectedSegment(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by asset segment"
              className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29] cursor-pointer hover:border-slate-300 transition-colors"
            >
              <option value="ALL">All Segments</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>
        </div>

        {/* SUBBAR: Selection Indicator & Bulk Controls */}
        <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                selectedProjectIds.length > 0 ? 'bg-[#0F5A29]' : 'bg-slate-300'
              }`}
            />
            <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-500">
              {selectedProjectIds.length} ITEMS SELECTED
            </span>
          </div>

          {/* Contextual Bulk Action Buttons when items are selected */}
          {selectedProjectIds.length > 0 && (
            <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 hidden sm:inline">
                Bulk Actions:
              </span>
              <button
                type="button"
                onClick={() => handleBulkChangeSegment('Residential')}
                className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors cursor-pointer"
              >
                Set Residential
              </button>
              <button
                type="button"
                onClick={() => handleBulkChangeSegment('Commercial')}
                className="px-2.5 py-1 text-[11px] font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors cursor-pointer"
              >
                Set Commercial
              </button>
              <button
                type="button"
                onClick={() => setIsBulkArchiveModalOpen(true)}
                className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Archive Selected</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedProjectIds([])}
                className="px-2 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* PROJECTS DATA TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-white text-slate-500 uppercase tracking-wider text-[10px] sm:text-[11px] font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5 sm:px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allCurrentPageSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all projects on current page"
                    className="rounded border-slate-300 text-[#0F5A29] focus:ring-[#0F5A29] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 sm:px-4 font-bold text-slate-600 min-w-[120px]">
                  PROJECT ID
                </th>
                <th className="py-3 px-3 sm:px-4 font-bold text-slate-600 min-w-[260px]">
                  PROJECT DISPLAY NAME
                </th>
                <th className="py-3 px-3 sm:px-4 font-bold text-slate-600 min-w-[120px]">
                  ASSET SEGMENT
                </th>
                <th className="py-3 px-3 sm:px-4 font-bold text-slate-600 min-w-[160px]">
                  GEOGRAPHICAL LOCATION
                </th>
                <th className="py-3 px-3 sm:px-4 font-bold text-slate-600 text-center min-w-[160px]">
                  CONTROL ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-6 h-6 text-slate-300" />
                      <p className="font-semibold text-xs text-slate-600">No projects found</p>
                      <p className="text-[11px] text-slate-400">
                        Try adjusting your search keywords or segment filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project) => {
                  const isSelected = selectedProjectIds.includes(project.id);
                  const displayCode = project.projectCode || project.id.toUpperCase();
                  const hasImage = Boolean(project.image && project.image.trim().length > 0);

                  return (
                    <tr
                      key={project.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3.5 sm:px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectProject(project.id)}
                          aria-label={`Select ${project.title}`}
                          className="rounded border-slate-300 text-[#0F5A29] focus:ring-[#0F5A29] cursor-pointer"
                        />
                      </td>

                      {/* Project ID */}
                      <td className="py-3.5 px-3 sm:px-4">
                        <span className="font-mono text-xs font-bold text-slate-800 tracking-tight">
                          {displayCode}
                        </span>
                      </td>

                      {/* Project Display Name: Media Thumbnail + Title + Subtitle */}
                      <td className="py-3.5 px-3 sm:px-4">
                        <div className="flex items-center gap-3">
                          {/* Media Thumbnail or "No Media" Placeholder */}
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                            {hasImage ? (
                              <img
                                src={project.image}
                                alt={project.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback to placeholder if image fails to load
                                  (e.target as HTMLElement).style.display = 'none';
                                  const parent = (e.target as HTMLElement).parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<span class="text-[9px] font-bold text-slate-400 leading-tight text-center">No<br/>Media</span>';
                                  }
                                }}
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-center p-1">
                                <span className="text-[9px] font-bold text-slate-400 tracking-tight leading-tight">
                                  No<br />Media
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Display Name & Subtitle */}
                          <div className="min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={() => setDossierProject(project)}
                              className="font-bold text-xs sm:text-sm text-slate-900 hover:text-[#0F5A29] transition-colors line-clamp-1 text-left cursor-pointer"
                              title={project.title}
                            >
                              {project.title}
                            </button>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {project.clientName ? (
                                <span className="font-semibold text-slate-700">{project.clientName} · </span>
                              ) : null}
                              {project.subtitle || project.summary || project.details}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Asset Segment */}
                      <td className="py-3.5 px-3 sm:px-4">
                        {getSegmentBadge(project.segment || 'Residential')}
                      </td>

                      {/* Geographical Location */}
                      <td className="py-3.5 px-3 sm:px-4">
                        <span className="text-xs font-semibold text-slate-700">
                          {project.location}
                        </span>
                      </td>

                      {/* Control Actions: 4 Buttons Matching Reference */}
                      <td className="py-3.5 px-3 sm:px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1. Edit Action (Pencil) */}
                          <button
                            type="button"
                            onClick={() => setEditingProject(project)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#0F5A29] hover:border-[#0F5A29]/40 hover:bg-slate-50 transition-colors cursor-pointer"
                            title="Edit Project"
                            aria-label={`Edit ${project.title}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. View Action (Eye) */}
                          <button
                            type="button"
                            onClick={() => setDossierProject(project)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#0F5A29] hover:border-[#0F5A29]/40 hover:bg-slate-50 transition-colors cursor-pointer"
                            title="View Project Dossier & Specs"
                            aria-label={`View details for ${project.title}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. External Link / Public Showcase Action */}
                          <button
                            type="button"
                            onClick={() => {
                              if (onViewPublicShowcase) {
                                onViewPublicShowcase(project.id);
                              } else {
                                setPreviewProject(project);
                              }
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#0F5A29] hover:border-[#0F5A29]/40 hover:bg-slate-50 transition-colors cursor-pointer"
                            title="Preview Public Showcase"
                            aria-label={`Preview public showcase for ${project.title}`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          {/* 4. Delete / Archive Action (Trash) */}
                          <button
                            type="button"
                            onClick={() => setArchiveTargetProject(project)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Archive Project"
                            aria-label={`Archive ${project.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER: Pagination and Record Count */}
        <div className="px-4 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing{' '}
            <span className="font-bold text-slate-800">
              {filteredProjects.length === 0 ? 0 : (validCurrentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-800">
              {Math.min(validCurrentPage * itemsPerPage, filteredProjects.length)}
            </span>{' '}
            of{' '}
            <span className="font-bold text-slate-800">{filteredProjects.length}</span> records
          </div>

          {/* Pagination Controls Matching Reference */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  pageNum === validCurrentPage
                    ? 'bg-[#0F5A29] text-white'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={validCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: ADD NEW PROJECT                                              */}
      {/* ===================================================================== */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProject={(newProj) => {
          onAddProject(newProj);
          showToast(`Project ${newProj.projectCode || 'PROJ'} provisioned and published.`);
        }}
        defaultProjectCode={addForm.projectCode}
      />

      {/* ===================================================================== */}
      {/* MODAL 2: EDIT PROJECT (using Add Project modal widget in edit mode)    */}
      {/* ===================================================================== */}
      <AddProjectModal
        isOpen={Boolean(editingProject)}
        projectToEdit={editingProject}
        onClose={() => setEditingProject(null)}
        onUpdateProject={(id, updates) => {
          onUpdateProject(id, updates);
          showToast(`Project ${editingProject?.projectCode || id} updated successfully.`);
          setEditingProject(null);
        }}
      />

      {/* ===================================================================== */}
      {/* MODAL 3: CONFIRM ARCHIVE PROJECT                                      */}
      {/* ===================================================================== */}
      {archiveTargetProject && (
        <ConfirmationActionModal
          isOpen={Boolean(archiveTargetProject)}
          onClose={() => setArchiveTargetProject(null)}
          onConfirm={() => {
            const code = archiveTargetProject.projectCode || archiveTargetProject.title;
            onArchiveProject(archiveTargetProject.id);
            showToast(`Project ${code} moved to Archive.`);
            setArchiveTargetProject(null);
          }}
          actionType="delete"
          customEyebrow="SYSTEM DELETION CONFIRMATION"
          customTitle="CONFIRM DELETION ACTION"
          customMessage={`Are you sure you want to move record ${archiveTargetProject.projectCode || archiveTargetProject.id.toUpperCase()} to the Archive/Trash?`}
          confirmButtonLabel="YES, CONFIRM ACTION"
          cancelButtonLabel="CANCEL"
        />
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: CONFIRM BULK ARCHIVE PROJECTS                                */}
      {/* ===================================================================== */}
      {isBulkArchiveModalOpen && (
        <ConfirmationActionModal
          isOpen={isBulkArchiveModalOpen}
          onClose={() => setIsBulkArchiveModalOpen(false)}
          onConfirm={() => {
            const count = selectedProjectIds.length;
            handleBulkArchive();
            setIsBulkArchiveModalOpen(false);
          }}
          actionType="delete"
          customEyebrow="SYSTEM DELETION CONFIRMATION"
          customTitle="CONFIRM DELETION ACTION"
          customMessage={`Are you sure you want to move ${selectedProjectIds.length} selected record(s) to the Archive/Trash?`}
          confirmButtonLabel="YES, CONFIRM ACTION"
          cancelButtonLabel="CANCEL"
        />
      )}



      {/* ===================================================================== */}
      {/* MODAL 4: PUBLIC SHOWCASE PREVIEW (EXTERNAL LINK ACTION)              */}
      {/* ===================================================================== */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0F5A29]" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Public Website Preview
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Public Card Representation */}
            <div className="p-6">
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                <div className="h-48 w-full relative bg-slate-100">
                  {previewProject.image ? (
                    <img
                      src={previewProject.image}
                      alt={previewProject.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <ImageOff className="w-8 h-8 mb-1" />
                      <span className="text-xs font-bold">No Media</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#0F5A29] text-[#88D628] shadow-xs">
                    {previewProject.segment}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-black text-slate-900 text-sm leading-snug">
                    {previewProject.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0F5A29]" />
                    <span>{previewProject.location}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">
                        Capacity
                      </span>
                      <span className="font-bold text-slate-900">{previewProject.capacity}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">
                        Inverter
                      </span>
                      <span className="font-bold text-slate-900 truncate block">
                        {previewProject.inverterBrand}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Published on Solareign Showcase
                  </span>
                  <span className="text-slate-400 font-normal">
                    {previewProject.projectCode || previewProject.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="px-4 py-2 bg-[#0F5A29] text-white rounded-lg text-xs font-bold hover:bg-[#0b401d] transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
