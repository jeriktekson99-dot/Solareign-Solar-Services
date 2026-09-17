import { useState, useMemo, useRef, useEffect, useCallback, FormEvent } from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Trash2,
  Settings,
  LogOut,
  Search,
  Bell,
  Calendar,
  Globe,
  ChevronRight,
  Plus,
  Check,
  CheckCircle2,
  Clock,
  Building2,
  X,
  FileText,
  RefreshCw,
  ArchiveRestore,
  ExternalLink,
  ShieldCheck,
  Zap,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Sliders,
  Filter
} from 'lucide-react';
import { PORTFOLIO_PROJECTS, ProjectItem } from '../data/projectsData';
import { SOLAREIGN_LOGO_URL } from './SolareignLogo';
import { useSolareignData, ArchivedRecord, SYNC_EVENT_NAME } from '../context/DataContext';
import LeadsManagerPage from './LeadsManagerPage';
import ProjectsPortfolioPage from './ProjectsPortfolioPage';
import ArchiveTrashPage from './ArchiveTrashPage';
import SystemSettingsPage, { SocialLinksConfig, OperationalSettingsConfig } from './SystemSettingsPage';
import CalendarSelectorModal, { CalendarMeeting } from './CalendarSelectorModal';
import AddProjectModal from './AddProjectModal';

export type { ArchivedRecord };
export type AdminTab = 'overview' | 'leads' | 'portfolio' | 'archive' | 'settings';

export interface LeadItem {
  id: string;
  token?: string;
  name: string;
  propertyType?: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL';
  propertyCategory?: string;
  address: string;
  subRegion?: string;
  billRange: string;
  monthlyUsage?: string;
  phone: string;
  email: string;
  systemRequested: string;
  requestedConfig?: string;
  status: 'New' | 'Ocular Scheduled' | 'Proposal Sent' | 'Contract Signed' | 'Archived' | 'Contacted' | 'In Progress';
  date: string;
  week: 'Week 1' | 'Week 2' | 'Week 3' | 'Week 4';
  receivedDateTime?: string;
  utilityPartner?: string;
  structuralRoofType?: string;
  daytimeShading?: string;
  solarProjectGoal?: string;
  commissionTimeline?: string;
  designatedSafeLocation?: string;
  inverterPhotos?: string[];
  fieldInspectionDate?: {
    day: string;
    month: string;
    fullDateString: string;
    slot: string;
  };
  attachedDocument?: {
    name: string;
    typeLabel: string;
    url: string;
  };
  facilityPhotos?: string[];

  // Supabase Datatable Schema Fields (Leads Manager)
  projectId?: string;
  projectDisplayName?: string;
  assetSegment?: string;
  geographicalLocation?: string;
  leadToken?: string;
  clientFullName?: string;
  primaryContactEndpoint?: string;
  requestedConfiguration?: string;
  philippineSubRegion?: string;
}

export interface OcularTrip {
  id: string;
  dateMonth: string;
  dateDay: string;
  clientName: string;
  locationDetails: string;
  timeString: string;
  engineer: string;

  // Supabase Datatable Schema Fields (Personnel Scheduling Check)
  titleOfAppointment?: string;
  scheduledDate?: string;
  timeHourInterval?: string;
  appointmentType?: string;
  installationSiteLocation?: string;
}

interface AdminDashboardProps {
  onBackToHome: () => void;
  onLogout: () => void;
}

const DASHBOARD_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DASHBOARD_MONTH_ABBRS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function AdminDashboard({ onBackToHome, onLogout }: AdminDashboardProps) {
  // Navigation State - defaults to 'overview' to view dashboard & calendar selector widget
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Overview Filters matching the reference layout - initialized dynamically to current date
  const currentMonthName = DASHBOARD_MONTH_NAMES[new Date().getMonth()] || 'September';
  const currentYearStr = String(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthName);
  const [selectedYear, setSelectedYear] = useState<string>(currentYearStr);
  const [timeframeMode, setTimeframeMode] = useState<'monthly' | 'yearly'>('yearly');
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);
  const [hoveredWeekIndex, setHoveredWeekIndex] = useState<number | null>(null);
  const scrollMonthsRef = useRef<HTMLDivElement>(null);
  const hasAutoSelectedRef = useRef(false);

  // Unified Navbar Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchCategoryFilter, setSearchCategoryFilter] = useState<'ALL' | 'LEADS' | 'PROJECTS' | 'ARCHIVE'>('ALL');
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Selected records for navigation / dossiers
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [selectedLeadIdForDossier, setSelectedLeadIdForDossier] = useState<string | null>(null);
  const [selectedProjectIdForDossier, setSelectedProjectIdForDossier] = useState<string | null>(null);
  const [selectedArchiveIdForInspect, setSelectedArchiveIdForInspect] = useState<string | null>(null);

  // Child tab filters
  const [leadsInitialSearch, setLeadsInitialSearch] = useState<string>('');
  const [portfolioInitialSearch, setPortfolioInitialSearch] = useState<string>('');
  const [archiveInitialSearch, setArchiveInitialSearch] = useState<string>('');

  // Connect to live synchronized data store
  const {
    leads,
    projects: projectsList,
    ocularTrips,
    archivedRecords,
    settings: settingsForm,
    socialLinks: socialLinksState,
    systemAlerts,
    unreadCount,
    addLead,
    updateLeadStatus,
    addProject: handleAddPortfolioProject,
    updateProject: handleUpdatePortfolioProject,
    archiveProject: handleArchivePortfolioProject,
    restoreRecord: handleRestoreRecord,
    deletePermanently: handleDeletePermanently,
    bulkRestore: handleBulkRestore,
    bulkPermanentDelete: handleBulkPermanentDelete,
    purgeAllArchive: handlePurgeAllArchive,
    addOcularTrip,
    saveSettings: handleSaveSettingsStore,
    saveSocialLinks: handleSaveSocialLinksStore,
    changeAdminPassword,
    dismissAlert,
    dismissAllAlerts
  } = useSolareignData();

  // Notifications Popover & System Alerts
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Modals & Details Drawers
  const [newOcularModalOpen, setNewOcularModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);

  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // New Ocular Form
  const [newOcular, setNewOcular] = useState({
    dateMonth: 'SEP',
    dateDay: '28',
    clientName: '',
    locationDetails: '',
    timeString: '9:00 AM - 12:00 PM',
    engineer: 'Engr. J. De Leon'
  });

  // Calculate stats
  const activeLeadsCount = leads.filter(l => l.status !== 'Archived').length;
  const publishedProjectsCount = projectsList.length;
  const ocularTripsCount = ocularTrips.length;
  const archiveCount = archivedRecords.length;

  // Chart data calculation
  const weekLabels = useMemo(() => ['Week 1', 'Week 2', 'Week 3', 'Week 4'], []);
  const monthNames = DASHBOARD_MONTH_NAMES;
  const monthAbbrs = DASHBOARD_MONTH_ABBRS;

  // Universal lead date & timeline parser supporting real-time submissions & historical records
  const parseLeadDate = useCallback((lead: LeadItem) => {
    let year = '';
    let monthIndex = -1;
    let day = 1;
    let weekIndex = -1;

    // 1. Try receivedDateTime (e.g., "7/25/2026 AT 09:51 AM", "9/17/2026 AT 01:23 PM")
    if (lead.receivedDateTime) {
      const slashMatch = lead.receivedDateTime.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (slashMatch) {
        const m = parseInt(slashMatch[1], 10) - 1;
        const d = parseInt(slashMatch[2], 10);
        const y = slashMatch[3];
        if (m >= 0 && m < 12) {
          monthIndex = m;
          day = d;
          year = y;
        }
      }
    }

    // 2. Try date string (e.g. "July 28, 2026", "September 17, 2026", "2026-09-17")
    if (monthIndex === -1 && lead.date) {
      const parsedDate = new Date(lead.date);
      if (!isNaN(parsedDate.getTime())) {
        monthIndex = parsedDate.getMonth();
        year = String(parsedDate.getFullYear());
        day = parsedDate.getDate();
      } else {
        const dLower = lead.date.toLowerCase();
        monthNames.forEach((mName, idx) => {
          if (dLower.includes(mName.toLowerCase())) {
            monthIndex = idx;
          }
        });
        const yMatch = lead.date.match(/20\d\d/);
        if (yMatch) year = yMatch[0];
        const dayMatch = lead.date.match(/\b([1-9]|[12]\d|3[01])\b/);
        if (dayMatch) day = parseInt(dayMatch[1], 10);
      }
    }

    // 3. Try field inspection date
    if (monthIndex === -1 && lead.fieldInspectionDate?.month) {
      const mUpper = lead.fieldInspectionDate.month.toUpperCase();
      monthAbbrs.forEach((abbr, idx) => {
        if (mUpper === abbr.toUpperCase()) {
          monthIndex = idx;
        }
      });
      if (lead.fieldInspectionDate.day) {
        day = parseInt(lead.fieldInspectionDate.day, 10) || 1;
      }
      if (lead.fieldInspectionDate.fullDateString) {
        const yMatch = lead.fieldInspectionDate.fullDateString.match(/20\d\d/);
        if (yMatch) year = yMatch[0];
      }
    }

    // 4. Determine week (0 = Week 1, 1 = Week 2, 2 = Week 3, 3 = Week 4)
    if (lead.week) {
      if (lead.week === 'Week 1') weekIndex = 0;
      else if (lead.week === 'Week 2') weekIndex = 1;
      else if (lead.week === 'Week 3') weekIndex = 2;
      else if (lead.week === 'Week 4') weekIndex = 3;
    }
    if (weekIndex === -1) {
      weekIndex = Math.min(3, Math.max(0, Math.ceil(day / 7) - 1));
    }

    // Fallbacks
    if (!year) year = selectedYear || '2026';
    if (monthIndex === -1) monthIndex = new Date().getMonth();

    return {
      year,
      monthIndex,
      monthName: monthNames[monthIndex] || 'September',
      monthAbbr: monthAbbrs[monthIndex] || 'Sep',
      day,
      weekIndex,
      weekLabel: (weekLabels[weekIndex] || 'Week 1') as 'Week 1' | 'Week 2' | 'Week 3' | 'Week 4'
    };
  }, [monthNames, monthAbbrs, weekLabels, selectedYear]);

  // Real-time synchronization state & toast telemetry
  const [lastReceivedLead, setLastReceivedLead] = useState<LeadItem | null>(null);
  const [showRealtimeToast, setShowRealtimeToast] = useState(false);

  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ action?: string; payload?: unknown }>;
      if (customEvent.detail?.action === 'NEW_LEAD' && customEvent.detail.payload) {
        const newLead = customEvent.detail.payload as LeadItem;
        setLastReceivedLead(newLead);
        setShowRealtimeToast(true);
        const parsed = parseLeadDate(newLead);
        if (parsed.monthName) setSelectedMonth(parsed.monthName);
        if (parsed.year) setSelectedYear(parsed.year);
        const timer = setTimeout(() => {
          setShowRealtimeToast(false);
        }, 8000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener(SYNC_EVENT_NAME, handleSync);
    return () => window.removeEventListener(SYNC_EVENT_NAME, handleSync);
  }, [parseLeadDate]);

  // Auto-focus on the month and year of the latest lead on initial mount
  useEffect(() => {
    if (!hasAutoSelectedRef.current && leads.length > 0) {
      hasAutoSelectedRef.current = true;
      const parsed = parseLeadDate(leads[0]);
      if (parsed.monthName && parsed.year) {
        setSelectedMonth(parsed.monthName);
        setSelectedYear(parsed.year);
      }
    }
  }, [leads, parseLeadDate]);

  // Dynamically extract all years with records
  const availableYears = useMemo(() => {
    const set = new Set<string>(['2026', '2025', '2024']);
    set.add(String(new Date().getFullYear()));
    leads.forEach((l) => {
      const parsed = parseLeadDate(l);
      if (parsed.year) set.add(parsed.year);
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [leads, parseLeadDate]);

  // Real-time aggregate count for the 12 months of selectedYear
  const yearlyMonthCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    leads.forEach((l) => {
      if (l.status === 'Archived') return;
      const parsed = parseLeadDate(l);
      if (parsed.year === selectedYear && parsed.monthIndex >= 0 && parsed.monthIndex < 12) {
        counts[parsed.monthIndex] += 1;
      }
    });

    return counts;
  }, [leads, selectedYear, parseLeadDate]);

  // Real-time aggregate count for the 4 weeks of selectedMonth in selectedYear
  const monthlyWeekCounts = useMemo(() => {
    const counts = [0, 0, 0, 0];
    const selectedMonthIdx = monthNames.findIndex(
      (m) => m.toLowerCase() === selectedMonth.toLowerCase()
    );

    leads.forEach((l) => {
      if (l.status === 'Archived') return;
      const parsed = parseLeadDate(l);
      if (
        parsed.year === selectedYear &&
        parsed.monthIndex === selectedMonthIdx &&
        parsed.weekIndex >= 0 &&
        parsed.weekIndex < 4
      ) {
        counts[parsed.weekIndex] += 1;
      }
    });

    return counts;
  }, [leads, selectedMonth, selectedYear, monthNames, parseLeadDate]);

  // Quick lookup of lead counts per month for the Month dropdown options
  const monthLeadCounts = useMemo(() => {
    const map: Record<string, number> = {};
    monthNames.forEach((m, idx) => {
      map[m] = yearlyMonthCounts[idx] || 0;
    });
    return map;
  }, [monthNames, yearlyMonthCounts]);

  const yearlyTotalLeads = useMemo(
    () => yearlyMonthCounts.reduce((acc, val) => acc + val, 0),
    [yearlyMonthCounts]
  );

  const monthlyTotalLeads = useMemo(
    () => monthlyWeekCounts.reduce((acc, val) => acc + val, 0),
    [monthlyWeekCounts]
  );

  // Dynamic Y-axis scale computation for Yearly view
  const maxYearlyVal = useMemo(
    () => Math.max(5, ...yearlyMonthCounts),
    [yearlyMonthCounts]
  );

  const yearlyGuideLevels = useMemo(() => {
    if (maxYearlyVal <= 5) return [5, 4, 3, 1, 0];
    const step = maxYearlyVal / 4;
    return [
      maxYearlyVal,
      Math.round(step * 3),
      Math.round(step * 2),
      Math.round(step * 1),
      0
    ];
  }, [maxYearlyVal]);

  // Dynamic Y-axis scale computation for Monthly view
  const maxMonthlyVal = useMemo(
    () => Math.max(5, ...monthlyWeekCounts),
    [monthlyWeekCounts]
  );

  const monthlyGuideLevels = useMemo(() => {
    if (maxMonthlyVal <= 5) return [5, 4, 3, 1, 0];
    const step = maxMonthlyVal / 4;
    return [
      maxMonthlyVal,
      Math.round(step * 3),
      Math.round(step * 2),
      Math.round(step * 1),
      0
    ];
  }, [maxMonthlyVal]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    const q = searchQuery.toLowerCase();
    return leads.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.address.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      l.systemRequested.toLowerCase().includes(q)
    );
  }, [leads, searchQuery]);

  // Handlers for Lead Management
  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadItem['status']) => {
    updateLeadStatus(leadId, newStatus);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(null);
    }
  };

  const handleAddNewLead = (newLeadData: Partial<LeadItem>) => {
    addLead(newLeadData);
  };

  const handleAddOcularTrip = (e: FormEvent) => {
    e.preventDefault();
    if (!newOcular.clientName.trim() || !newOcular.locationDetails.trim()) return;
    addOcularTrip({
      id: `oc-${Date.now()}`,
      dateMonth: newOcular.dateMonth.toUpperCase(),
      dateDay: newOcular.dateDay,
      clientName: newOcular.clientName,
      locationDetails: newOcular.locationDetails,
      timeString: newOcular.timeString,
      engineer: newOcular.engineer
    });
    setNewOcularModalOpen(false);
    setNewOcular({
      dateMonth: 'SEP',
      dateDay: '28',
      clientName: '',
      locationDetails: '',
      timeString: '9:00 AM - 12:00 PM',
      engineer: 'Engr. J. De Leon'
    });
  };

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  const handleCalendarAddMeeting = (meeting: CalendarMeeting) => {
    const parts = meeting.dateStr.split('-');
    const mNum = parseInt(parts[1], 10);
    const dNum = parseInt(parts[2], 10);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthAbbr = months[mNum - 1] || 'JUL';

    addOcularTrip({
      id: `trip-${Date.now()}`,
      dateMonth: monthAbbr,
      dateDay: String(dNum),
      clientName: meeting.clientName,
      locationDetails: meeting.location,
      timeString: meeting.timeSlot,
      engineer: meeting.engineer
    });
  };

  // Click outside and escape key listener for global search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Compute unified multi-category search results
  const trimmedSearchQuery = searchQuery.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!trimmedSearchQuery) {
      return {
        leads: [],
        projects: [],
        archives: [],
        total: 0
      };
    }

    const matchingLeads = leads.filter((lead) => {
      return (
        Boolean(lead.name?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(lead.token?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(lead.email?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(lead.phone?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(lead.address?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(lead.subRegion?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(lead.systemRequested?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(lead.requestedConfig?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(lead.propertyType?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(lead.status?.toLowerCase().includes(trimmedSearchQuery))
      );
    });

    const matchingProjects = projectsList.filter((proj) => {
      return (
        Boolean(proj.title?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(proj.projectCode?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(proj.clientName?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(proj.location?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(proj.capacity?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(proj.category?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(proj.segment?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(proj.inverterBrand?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(proj.summary?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(proj.details?.toLowerCase().includes(trimmedSearchQuery))
      );
    });

    const matchingArchives = archivedRecords.filter((rec) => {
      return (
        Boolean(rec.title?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(rec.subtitle?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(rec.archiveCode?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(rec.type?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(rec.originalStream?.toLowerCase().includes(trimmedSearchQuery)) ||
        Boolean(rec.reason?.toLowerCase().includes(trimmedSearchQuery))
      );
    });

    return {
      leads: matchingLeads,
      projects: matchingProjects,
      archives: matchingArchives,
      total: matchingLeads.length + matchingProjects.length + matchingArchives.length
    };
  }, [trimmedSearchQuery, leads, projectsList, archivedRecords]);

  // Jump handlers for search results
  const handleJumpToLead = (lead: LeadItem) => {
    if (lead.status === 'Archived') {
      setSelectedArchiveIdForInspect(lead.id);
      setArchiveInitialSearch(lead.name || lead.token || '');
      setActiveTab('archive');
    } else {
      setSelectedLeadIdForDossier(lead.id);
      setLeadsInitialSearch('');
      setActiveTab('leads');
    }
    setIsSearchOpen(false);
  };

  const handleJumpToProject = (project: ProjectItem) => {
    setSelectedProjectIdForDossier(project.id);
    setPortfolioInitialSearch('');
    setActiveTab('portfolio');
    setIsSearchOpen(false);
  };

  const handleJumpToArchive = (record: ArchivedRecord) => {
    setSelectedArchiveIdForInspect(record.id);
    setArchiveInitialSearch(record.archiveCode || record.title || '');
    setActiveTab('archive');
    setIsSearchOpen(false);
  };

  const handleViewAllLeads = () => {
    setLeadsInitialSearch(searchQuery.trim());
    setSelectedLeadIdForDossier(null);
    setActiveTab('leads');
    setIsSearchOpen(false);
  };

  const handleViewAllProjects = () => {
    setPortfolioInitialSearch(searchQuery.trim());
    setSelectedProjectIdForDossier(null);
    setActiveTab('portfolio');
    setIsSearchOpen(false);
  };

  const handleViewAllArchive = () => {
    setArchiveInitialSearch(searchQuery.trim());
    setSelectedArchiveIdForInspect(null);
    setActiveTab('archive');
    setIsSearchOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-row text-[#0F172A] font-sans antialiased selection:bg-[#88D628] selection:text-[#0F5A29]">
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR NAVIGATION: Strict list as requested                         */}
      {/* Overview, Leads Manager, Project Portfolio, Archive / Trash, Settings,    */}
      {/* and Logout                                                                */}
      {/* ========================================================================= */}
      <aside className="w-64 md:w-72 bg-[#062816] text-white flex flex-col justify-between shrink-0 border-r border-[#0D3B20] sticky top-0 h-screen z-40 select-none">
        <div>
          {/* Top Brand Header matching reference position */}
          <div className="p-6 border-b border-[#0D3B20]/80">
            <div className="flex items-center gap-3">
              <img
                src={SOLAREIGN_LOGO_URL}
                alt="Solareign"
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-contain drop-shadow-md shrink-0"
              />
              <div>
                <div className="font-extrabold text-base tracking-tight text-white leading-tight">
                  SOLAREIGN
                </div>
                <div className="text-[10px] font-extrabold tracking-widest text-[#88D628] uppercase">
                  CONTROL PANEL
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links: Exactly the requested set */}
          <nav className="p-4 space-y-1.5">
            {/* 1. OVERVIEW */}
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-2 border-[#88D628] bg-[#88D628]/15 text-[#88D628] shadow-sm shadow-[#88D628]/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>OVERVIEW</span>
            </button>

            {/* 2. LEADS MANAGER */}
            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'border-2 border-[#88D628] bg-[#88D628]/15 text-[#88D628] shadow-sm shadow-[#88D628]/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>LEADS MANAGER</span>
            </button>

            {/* 3. PROJECT PORTFOLIO */}
            <button
              type="button"
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'border-2 border-[#88D628] bg-[#88D628]/15 text-[#88D628] shadow-sm shadow-[#88D628]/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <FolderKanban className="w-4 h-4 shrink-0" />
              <span>PROJECT PORTFOLIO</span>
            </button>

            {/* 4. ARCHIVE / TRASH */}
            <button
              type="button"
              onClick={() => setActiveTab('archive')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'archive'
                  ? 'border-2 border-[#88D628] bg-[#88D628]/15 text-[#88D628] shadow-sm shadow-[#88D628]/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              <span>ARCHIVE / TRASH</span>
            </button>
          </nav>
        </div>

        {/* Bottom Pinned Controls: System Settings & Logout */}
        <div className="p-4 border-t border-[#0D3B20]/80 space-y-1.5">
          {/* 5. SYSTEM SETTINGS */}
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'border-2 border-[#88D628] bg-[#88D628]/15 text-[#88D628] shadow-sm shadow-[#88D628]/10'
                : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>SYSTEM SETTINGS</span>
          </button>

          {/* 6. LOGOUT */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide uppercase text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>SECURE LOGOUT</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP HEADER BAR matching reference placement */}
        <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Search Streams Input with Functional Dropdown */}
          <div ref={searchContainerRef} className="relative w-full max-w-lg">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim()) {
                    setIsSearchOpen(true);
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  setIsSearchOpen(Boolean(val.trim()));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && trimmedSearchQuery) {
                    if (searchCategoryFilter === 'LEADS' || (searchCategoryFilter === 'ALL' && searchResults.leads.length > 0 && searchResults.projects.length === 0 && searchResults.archives.length === 0)) {
                      handleViewAllLeads();
                    } else if (searchCategoryFilter === 'PROJECTS' || (searchCategoryFilter === 'ALL' && searchResults.projects.length > 0 && searchResults.leads.length === 0 && searchResults.archives.length === 0)) {
                      handleViewAllProjects();
                    } else if (searchCategoryFilter === 'ARCHIVE' || (searchCategoryFilter === 'ALL' && searchResults.archives.length > 0 && searchResults.leads.length === 0 && searchResults.projects.length === 0)) {
                      handleViewAllArchive();
                    }
                  }
                }}
                placeholder="Search leads, project portfolios, archives/trash..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F5A29] focus:bg-white focus:ring-2 focus:ring-[#0F5A29]/10 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* UNIFIED SEARCH DROPDOWN: Only shown when typing search keywords */}
            {isSearchOpen && Boolean(trimmedSearchQuery) && (
              <div className="absolute left-0 top-full mt-2 w-[calc(100vw-3rem)] sm:w-[560px] md:w-[620px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* 1. Header with Category Filters */}
                <div className="p-3 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2 overflow-x-auto">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
                      FILTER:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSearchCategoryFilter('ALL')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        searchCategoryFilter === 'ALL'
                          ? 'bg-[#0F5A29] text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      All ({searchResults.total})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchCategoryFilter('LEADS')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        searchCategoryFilter === 'LEADS'
                          ? 'bg-[#0F5A29] text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      Leads ({searchResults.leads.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchCategoryFilter('PROJECTS')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        searchCategoryFilter === 'PROJECTS'
                          ? 'bg-[#0F5A29] text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      Projects ({searchResults.projects.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchCategoryFilter('ARCHIVE')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        searchCategoryFilter === 'ARCHIVE'
                          ? 'bg-[#0F5A29] text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      Archive / Trash ({searchResults.archives.length})
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60 transition-colors shrink-0"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 2. Results Body */}
                <div className="max-h-[460px] overflow-y-auto divide-y divide-slate-100">
                  {/* No matches found */}
                  {searchResults.total === 0 && (
                    <div className="p-8 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Search className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          No matches found for "{searchQuery}"
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                          Searched across leads, project portfolios, and archives/trash. Try searching by client name, token, capacity (kW), or location.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        <button
                          type="button"
                          onClick={handleViewAllLeads}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-[#0F5A29] transition-colors cursor-pointer"
                        >
                          Search in Leads Manager
                        </button>
                        <button
                          type="button"
                          onClick={handleViewAllProjects}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-[#0F5A29] transition-colors cursor-pointer"
                        >
                          Search in Portfolio
                        </button>
                        <button
                          type="button"
                          onClick={handleViewAllArchive}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-[#0F5A29] transition-colors cursor-pointer"
                        >
                          Search in Archive
                        </button>
                      </div>
                    </div>
                  )}

                  {/* State C: LEADS MATCHES */}
                  {trimmedSearchQuery &&
                    (searchCategoryFilter === 'ALL' || searchCategoryFilter === 'LEADS') &&
                    searchResults.leads.length > 0 && (
                      <div className="p-3">
                        <div className="flex items-center justify-between px-2 py-1.5 mb-1 text-[11px] font-black uppercase tracking-wider text-slate-500">
                          <div className="flex items-center gap-1.5 text-sky-800">
                            <Users className="w-3.5 h-3.5 text-sky-600" />
                            <span>Leads Manager ({searchResults.leads.length})</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleViewAllLeads}
                            className="text-[#0F5A29] hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            Open in Leads Manager <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          {(searchCategoryFilter === 'ALL'
                            ? searchResults.leads.slice(0, 4)
                            : searchResults.leads
                          ).map((lead) => (
                            <button
                              key={lead.id}
                              type="button"
                              onClick={() => handleJumpToLead(lead)}
                              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-colors cursor-pointer group"
                            >
                              <div className="min-w-0 flex-1 pr-3">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                                    {lead.token || 'LEAD'}
                                  </span>
                                  <span className="text-xs font-black text-slate-900 truncate group-hover:text-[#0F5A29]">
                                    {lead.name}
                                  </span>
                                  {(() => {
                                    const displayStatus =
                                      lead.status === 'Contacted' || lead.status === 'Ocular Scheduled'
                                        ? 'Contacted'
                                        : lead.status === 'In Progress' || lead.status === 'Proposal Sent' || lead.status === 'Contract Signed'
                                        ? 'In Progress'
                                        : lead.status === 'Archived'
                                        ? 'Archived'
                                        : 'New';
                                    return (
                                      <span
                                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                                          displayStatus === 'New'
                                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                            : displayStatus === 'Contacted'
                                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                            : displayStatus === 'In Progress'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                                        }`}
                                      >
                                        {displayStatus}
                                      </span>
                                    );
                                  })()}
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-500 truncate">
                                  <span>{lead.propertyType || 'Residential'}</span>
                                  {lead.phone && <span>• {lead.phone}</span>}
                                  {lead.address && <span className="truncate">• {lead.address}</span>}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0F5A29] group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* State D: PROJECT PORTFOLIO MATCHES */}
                  {trimmedSearchQuery &&
                    (searchCategoryFilter === 'ALL' || searchCategoryFilter === 'PROJECTS') &&
                    searchResults.projects.length > 0 && (
                      <div className="p-3">
                        <div className="flex items-center justify-between px-2 py-1.5 mb-1 text-[11px] font-black uppercase tracking-wider text-slate-500">
                          <div className="flex items-center gap-1.5 text-amber-800">
                            <FolderKanban className="w-3.5 h-3.5 text-amber-600" />
                            <span>Project Portfolio ({searchResults.projects.length})</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleViewAllProjects}
                            className="text-[#0F5A29] hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            Open in Portfolio <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          {(searchCategoryFilter === 'ALL'
                            ? searchResults.projects.slice(0, 4)
                            : searchResults.projects
                          ).map((proj) => (
                            <button
                              key={proj.id}
                              type="button"
                              onClick={() => handleJumpToProject(proj)}
                              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-colors cursor-pointer group"
                            >
                              <div className="min-w-0 flex-1 pr-3">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold">
                                    {proj.projectCode || 'PRJ'}
                                  </span>
                                  <span className="text-xs font-black text-slate-900 truncate group-hover:text-[#0F5A29]">
                                    {proj.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-500 truncate">
                                  <span>{proj.segment}</span>
                                  <span>• {proj.location}</span>
                                  {proj.clientName && <span>• Client: {proj.clientName}</span>}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0F5A29] group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* State E: ARCHIVE / TRASH MATCHES */}
                  {trimmedSearchQuery &&
                    (searchCategoryFilter === 'ALL' || searchCategoryFilter === 'ARCHIVE') &&
                    searchResults.archives.length > 0 && (
                      <div className="p-3">
                        <div className="flex items-center justify-between px-2 py-1.5 mb-1 text-[11px] font-black uppercase tracking-wider text-slate-500">
                          <div className="flex items-center gap-1.5 text-rose-800">
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Archive / Trash ({searchResults.archives.length})</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleViewAllArchive}
                            className="text-[#0F5A29] hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            Open in Archive <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          {(searchCategoryFilter === 'ALL'
                            ? searchResults.archives.slice(0, 4)
                            : searchResults.archives
                          ).map((rec) => (
                            <button
                              key={rec.id}
                              type="button"
                              onClick={() => handleJumpToArchive(rec)}
                              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-colors cursor-pointer group"
                            >
                              <div className="min-w-0 flex-1 pr-3">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-mono font-bold">
                                    {rec.archiveCode || 'ARC'}
                                  </span>
                                  <span className="text-xs font-black text-slate-900 truncate group-hover:text-[#0F5A29]">
                                    {rec.title}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                                    {rec.originalStream || rec.type}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-500 truncate">
                                  <span>Archived: {rec.deletedDateTime || rec.archivedDate}</span>
                                  {rec.reason && <span className="truncate">• {rec.reason}</span>}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0F5A29] group-hover:translate-x-0.5 transition-all shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* 3. Footer Bar */}
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-600">Esc</kbd> to close</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleViewAllLeads}
                      className="text-slate-600 hover:text-[#0F5A29] font-bold cursor-pointer"
                    >
                      Leads
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleViewAllProjects}
                      className="text-slate-600 hover:text-[#0F5A29] font-bold cursor-pointer"
                    >
                      Portfolio
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleViewAllArchive}
                      className="text-slate-600 hover:text-[#0F5A29] font-bold cursor-pointer"
                    >
                      Archive / Trash
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-[#0F5A29] hover:bg-slate-100 transition-colors relative cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <>
                  {/* Outside click backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />

                  <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Chat bubble triangle pointing to the bell icon */}
                    <div className="flex justify-end pr-3">
                      <div
                        className="w-0 h-0"
                        style={{
                          borderLeft: '10px solid transparent',
                          borderRight: '10px solid transparent',
                          borderBottom: '10px solid #062816',
                          marginBottom: '-1px',
                        }}
                      />
                    </div>

                    {/* Chat bubble container */}
                    <div className="w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                      {/* Section 1: Header (Dark Green with Operational Control and Dismiss All) */}
                      <div className="bg-[#062816] px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[10px] font-mono font-bold tracking-widest text-[#88D628] uppercase">
                            OPERATIONAL CONTROL
                          </div>
                          <h3 className="text-sm font-black text-white tracking-wider uppercase mt-0.5">
                            ACTIVE SYSTEM ALERTS
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => dismissAllAlerts()}
                          className="px-3 py-1 rounded-md bg-[#0F5A29] hover:bg-[#146e34] text-[#88D628] text-[10px] font-black uppercase tracking-wider transition-colors border border-[#88D628]/30 cursor-pointer shrink-0"
                        >
                          DISMISS ALL
                        </button>
                      </div>
                    </div>

                    {/* Gold Accent Divider Bar */}
                    <div className="h-[2px] w-full bg-[#E5B54F]" />

                    {/* Section 2: Content Body */}
                    <div className="bg-white">
                      {systemAlerts.length === 0 ? (
                        <div className="py-9 px-6 text-center">
                          <div className="w-11 h-11 rounded-full border-2 border-slate-300 flex items-center justify-center mx-auto text-slate-400 mb-3">
                            <Check className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div className="font-bold text-slate-800 text-sm sm:text-base">
                            All Systems Nominal
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase mt-1">
                            NO ACTIVE NOTIFICATIONS AT THIS TIME
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 space-y-2.5 max-h-72 overflow-y-auto">
                          {systemAlerts.map((alert) => (
                            <div
                              key={alert.id}
                              className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-700 flex items-start justify-between gap-3"
                            >
                              <div>
                                <div className="font-bold text-xs text-slate-900">{alert.title}</div>
                                <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{alert.message}</div>
                                {alert.timestamp && (
                                  <div className="text-[10px] font-mono text-slate-400 mt-1">{alert.timestamp}</div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => dismissAlert(alert.id)}
                                className="text-slate-400 hover:text-slate-600 p-0.5"
                                title="Dismiss"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Section 3: Footer */}
                    <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-end bg-slate-50/40">
                      <button
                        type="button"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs font-mono font-bold text-slate-500 hover:text-slate-900 tracking-wider uppercase transition-colors cursor-pointer"
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

            {/* Calendar Selector Popup Trigger */}
            <button
              type="button"
              onClick={() => setCalendarModalOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:text-[#0F5A29] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Calendar Selector"
              aria-label="Calendar Selector"
            >
              <Calendar className="w-4 h-4" />
            </button>

            {/* Return to Public Website Button (matching previous icon buttons) */}
            <button
              type="button"
              id="header-return-public-website-btn"
              onClick={onBackToHome}
              className="p-2 rounded-xl text-slate-600 hover:text-[#0F5A29] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Return to Public Website"
              aria-label="Return to Public Website"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ===================================================================== */}
        {/* VIEW ROUTER                                                           */}
        {/* ===================================================================== */}
        <main className="p-6 sm:p-8 space-y-8 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* PAGE HEADER: "OPERATIONS OVERVIEW" with Month/Year/Toggle */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                    OPERATIONS OVERVIEW
                  </h1>
                  <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mt-1">
                    PERFORMANCE METRICS &amp; INTERACTIVE OUTREACH ANALYTICS.
                  </p>
                </div>

                {/* Right filters: Month / Year / Monthly-Yearly Toggle */}
                <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
                  {/* Month Selector - visible only in monthly mode */}
                  {timeframeMode === 'monthly' && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase">
                      <span>MONTH:</span>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        aria-label="Filter by month"
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0F5A29]"
                      >
                        {monthNames.map((month) => {
                          const count = monthLeadCounts[month] || 0;
                          return (
                            <option key={month} value={month}>
                              {month} {count > 0 ? `(${count})` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}

                  {/* Year Selector - visible in both yearly and monthly */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold uppercase">
                    <span>YEAR:</span>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      aria-label="Filter by year"
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0F5A29]"
                    >
                      {availableYears.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Monthly / Yearly Toggle */}
                  <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-[11px] font-black uppercase">
                    <button
                      type="button"
                      onClick={() => setTimeframeMode('monthly')}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                        timeframeMode === 'monthly'
                          ? 'bg-[#0F5A29] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      MONTHLY
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeframeMode('yearly')}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                        timeframeMode === 'yearly'
                          ? 'bg-[#0F5A29] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      YEARLY
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 1: 4 STAT METRIC CARDS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* 1. TOTAL LEADS */}
                <div
                  onClick={() => setActiveTab('leads')}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#88D628] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        TOTAL LEADS
                      </div>
                      <div className="text-3xl font-black text-slate-900 mt-2">
                        {activeLeadsCount}
                      </div>
                      <div className="text-[11px] font-bold text-[#0F5A29] mt-1 tracking-tight uppercase">
                        INQUIRIES REGISTERED
                      </div>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0F5A29] border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* 2. PUBLISHED PROJECTS */}
                <div
                  onClick={() => setActiveTab('portfolio')}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#88D628] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        PUBLISHED PROJECTS
                      </div>
                      <div className="text-3xl font-black text-slate-900 mt-2">
                        {publishedProjectsCount}
                      </div>
                      <div className="text-[11px] font-bold text-amber-700 mt-1 tracking-tight uppercase">
                        LIVE ARRAYS
                      </div>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* 3. OCULAR ASSESSMENTS */}
                <div
                  onClick={() => setNewOcularModalOpen(true)}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#88D628] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        OCULAR ASSESSMENTS
                      </div>
                      <div className="text-3xl font-black text-slate-900 mt-2">
                        {ocularTripsCount}
                      </div>
                      <div className="text-[11px] font-bold text-blue-700 mt-1 tracking-tight uppercase">
                        SCHEDULED FIELD AUDITS
                      </div>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* 4. TRASH AT VAULT */}
                <div
                  onClick={() => setActiveTab('archive')}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-red-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        TRASH AT VAULT
                      </div>
                      <div className="text-3xl font-black text-slate-900 mt-2">
                        {archiveCount}
                      </div>
                      <div className="text-[11px] font-bold text-rose-700 mt-1 tracking-tight uppercase">
                        ARCHIVED RECORDS
                      </div>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Trash2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PERFORMANCE CHART & HISTORICAL OUTREACH */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    PERFORMANCE CHART &amp; HISTORICAL OUTREACH
                  </h2>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                    INTERACTIVE DATA RENDERING FOR THE SELECTED TRACKING TIMEFRAME.
                  </p>
                </div>

                {/* Real-time lead capture banner */}
                {showRealtimeToast && lastReceivedLead && (
                  <div className="flex items-center justify-between p-3 px-4 rounded-xl bg-gradient-to-r from-emerald-50 to-lime-50 border border-emerald-300 text-slate-800 text-xs shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-[#0F5A29] animate-pulse"></span>
                      <div>
                        <span className="font-black text-[#0F5A29] uppercase">NEW INBOUND LEAD RECORDED: </span>
                        <span className="font-bold text-slate-800">{lastReceivedLead.name}</span>
                        <span className="text-slate-500 ml-1.5">
                          ({lastReceivedLead.propertyType || 'INQUIRY'} &bull; {lastReceivedLead.receivedDateTime || 'Just now'})
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const parsed = parseLeadDate(lastReceivedLead);
                        setSelectedYear(parsed.year);
                        setSelectedMonth(parsed.monthName);
                        setTimeframeMode('monthly');
                        setShowRealtimeToast(false);
                      }}
                      className="px-3 py-1 rounded-md bg-[#0F5A29] text-white text-[11px] font-black uppercase hover:bg-[#0c4620] cursor-pointer transition-colors shadow-2xs"
                    >
                      VIEW IN CHART
                    </button>
                  </div>
                )}

                <div className="border-b border-slate-100" />

                {timeframeMode === 'yearly' ? (
                  /* YEARLY PERFORMANCE VIEW (12 MONTHS) MATCHING REFERENCE IMAGE */
                  <>
                    {/* SVG Curve Chart for 12 Months */}
                    <div className="w-full relative pt-2">
                      <div className="w-full h-56 sm:h-64 relative">
                        {/* Interactive Tooltip on Hover */}
                        {hoveredMonthIndex !== null && (
                          <div
                            className="absolute -top-3 z-30 pointer-events-none -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 whitespace-nowrap"
                            style={{
                              left: `${((50 + hoveredMonthIndex * (915 / 11)) / 1000) * 100}%`
                            }}
                          >
                            <span>{monthNames[hoveredMonthIndex]}:</span>
                            <span className="text-[#88D628]">
                              {yearlyMonthCounts[hoveredMonthIndex]} {yearlyMonthCounts[hoveredMonthIndex] === 1 ? 'Lead' : 'Leads'}
                            </span>
                          </div>
                        )}

                        <svg
                          viewBox="0 0 1000 240"
                          className="w-full h-full overflow-visible z-10"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient id="yearlyChartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0F5A29" stopOpacity="0.25" />
                              <stop offset="60%" stopColor="#88D628" stopOpacity="0.10" />
                              <stop offset="100%" stopColor="#88D628" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Dynamic Horizontal Dashed Guide Lines & Y-Axis Scale */}
                          {yearlyGuideLevels.map((val) => {
                            const yPos = 200 - (val / maxYearlyVal) * 175;
                            return (
                              <g key={`guide-yearly-${val}`}>
                                <text
                                  x="22"
                                  y={yPos + 4}
                                  textAnchor="end"
                                  className="text-[10px] font-mono fill-slate-400 font-medium"
                                >
                                  {val}
                                </text>
                                <line
                                  x1="32"
                                  y1={yPos}
                                  x2="980"
                                  y2={yPos}
                                  stroke="#E2E8F0"
                                  strokeDasharray="4 4"
                                  strokeWidth="1"
                                />
                              </g>
                            );
                          })}

                          {/* Calculate Coordinates for 12 months with dynamic max scale */}
                          {(() => {
                            const pts = monthAbbrs.map((abbr, i) => {
                              const x = 50 + i * (915 / 11);
                              const count = yearlyMonthCounts[i];
                              const y = 200 - (count / maxYearlyVal) * 175;
                              return { x, y, count, abbr, index: i };
                            });

                            const linePath = `M ${pts.map(p => `${p.x} ${p.y}`).join(' L ')}`;
                            const areaPath = `M ${pts[0].x} 200 L ${pts.map(p => `${p.x} ${p.y}`).join(' L ')} L ${pts[pts.length - 1].x} 200 Z`;

                            return (
                              <>
                                {/* Shaded Area under curve */}
                                <path d={areaPath} fill="url(#yearlyChartGradient)" />

                                {/* Primary Curve Line */}
                                <path
                                  d={linePath}
                                  fill="none"
                                  stroke="#0F5A29"
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                                {/* Data point nodes for each of 12 months */}
                                {pts.map((pt) => {
                                  const isHovered = hoveredMonthIndex === pt.index;
                                  const hasData = pt.count > 0;
                                  return (
                                    <g
                                      key={pt.abbr}
                                      className="cursor-pointer group"
                                      onMouseEnter={() => setHoveredMonthIndex(pt.index)}
                                      onMouseLeave={() => setHoveredMonthIndex(null)}
                                      onClick={() => {
                                        setSelectedMonth(monthNames[pt.index]);
                                        setTimeframeMode('monthly');
                                      }}
                                    >
                                      {/* Invisible wider hover hit-area */}
                                      <rect
                                        x={pt.x - 25}
                                        y={15}
                                        width={50}
                                        height={195}
                                        fill="transparent"
                                      />

                                      {/* Point circles */}
                                      <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r={isHovered ? 6 : 4.5}
                                        fill={hasData ? '#88D628' : '#0F5A29'}
                                        stroke="#0F5A29"
                                        strokeWidth={hasData ? 2.5 : 0}
                                        className="transition-all"
                                      />

                                      {/* Glow ring on points with leads or on hover */}
                                      {(hasData || isHovered) && (
                                        <circle
                                          cx={pt.x}
                                          cy={pt.y}
                                          r={isHovered ? 12 : 9}
                                          fill="#88D628"
                                          opacity={isHovered ? 0.4 : 0.25}
                                          className="animate-pulse"
                                        />
                                      )}
                                    </g>
                                  );
                                })}
                              </>
                            );
                          })()}
                        </svg>
                      </div>

                      {/* X-axis labels matching reference: Jan, Feb, Mar... */}
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 pt-2 border-t border-slate-100">
                        {monthAbbrs.map((abbr, i) => (
                          <div
                            key={abbr}
                            onMouseEnter={() => setHoveredMonthIndex(i)}
                            onMouseLeave={() => setHoveredMonthIndex(null)}
                            onClick={() => {
                              setSelectedMonth(monthNames[i]);
                              setTimeframeMode('monthly');
                            }}
                            className={`w-[8.33%] text-center cursor-pointer transition-colors ${
                              hoveredMonthIndex === i ? 'text-[#0F5A29] font-black' : 'text-slate-500'
                            }`}
                          >
                            {abbr}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sub-strip: PERIOD BREAKDOWN */}
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                            PERIOD BREAKDOWN
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-[#0F5A29] border border-emerald-200 uppercase tracking-wider">
                            ACTIVE PERIOD: YEAR {selectedYear}
                          </span>
                        </div>

                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                          CLICK ANY MONTH TO VIEW DETAILED WEEKLY OUTREACH.
                        </span>
                      </div>

                      {/* 12 Month Cards matching reference in horizontal scrollable carousel */}
                      <div
                        ref={scrollMonthsRef}
                        className="flex gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth no-scrollbar select-none"
                      >
                        {monthNames.map((monthName, idx) => {
                          const count = yearlyMonthCounts[idx];
                          const isHovered = hoveredMonthIndex === idx;
                          return (
                            <div
                              key={monthName}
                              onMouseEnter={() => setHoveredMonthIndex(idx)}
                              onMouseLeave={() => setHoveredMonthIndex(null)}
                              onClick={() => {
                                setSelectedMonth(monthName);
                                setTimeframeMode('monthly');
                              }}
                              title={`Click to view detailed weekly breakdown for ${monthName} ${selectedYear}`}
                              className={`min-w-[135px] sm:min-w-[155px] rounded-xl p-3.5 border transition-all cursor-pointer shrink-0 ${
                                isHovered
                                  ? 'bg-emerald-50/70 border-[#88D628] shadow-xs'
                                  : 'bg-slate-50/70 border-slate-100 hover:bg-white hover:border-slate-200'
                              }`}
                            >
                              <div className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                {monthName.toUpperCase()}
                              </div>
                              <div className="flex items-center justify-between mt-2.5">
                                <span className="text-xs font-medium text-slate-600">Leads</span>
                                <span
                                  className={`w-7 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                                    count > 0
                                      ? 'bg-[#88D628] text-[#062816] shadow-2xs font-black'
                                      : 'bg-[#EDF7EE] border border-[#C8E6C9] text-[#1B5E20]'
                                  }`}
                                >
                                  {count}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  /* MONTHLY PERFORMANCE VIEW (4 WEEKS) */
                  <>
                    {/* SVG Chart for 4 Weeks matching Yearly chart design exactly */}
                    <div className="w-full relative pt-2">
                      <div className="w-full h-56 sm:h-64 relative">
                        {/* Interactive Tooltip on Hover matching Yearly */}
                        {hoveredWeekIndex !== null && (
                          <div
                            className="absolute -top-3 z-30 pointer-events-none -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 whitespace-nowrap"
                            style={{
                              left: `${((50 + hoveredWeekIndex * (915 / 3)) / 1000) * 100}%`
                            }}
                          >
                            <span>{weekLabels[hoveredWeekIndex]}:</span>
                            <span className="text-[#88D628]">
                              {monthlyWeekCounts[hoveredWeekIndex]} {monthlyWeekCounts[hoveredWeekIndex] === 1 ? 'Lead' : 'Leads'}
                            </span>
                          </div>
                        )}

                        <svg
                          viewBox="0 0 1000 240"
                          className="w-full h-full overflow-visible z-10"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient id="monthlyChartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#0F5A29" stopOpacity="0.25" />
                              <stop offset="60%" stopColor="#88D628" stopOpacity="0.10" />
                              <stop offset="100%" stopColor="#88D628" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Dynamic Horizontal Dashed Guide Lines & Y-Axis Scale matching Yearly */}
                          {monthlyGuideLevels.map((val) => {
                            const yPos = 200 - (val / maxMonthlyVal) * 175;
                            return (
                              <g key={`guide-monthly-${val}`}>
                                <text
                                  x="22"
                                  y={yPos + 4}
                                  textAnchor="end"
                                  className="text-[10px] font-mono fill-slate-400 font-medium"
                                >
                                  {val}
                                </text>
                                <line
                                  x1="32"
                                  y1={yPos}
                                  x2="980"
                                  y2={yPos}
                                  stroke="#E2E8F0"
                                  strokeDasharray="4 4"
                                  strokeWidth="1"
                                />
                              </g>
                            );
                          })}

                          {/* Calculate Coordinates for 4 weeks using exact Yearly chart design */}
                          {(() => {
                            const pts = weekLabels.map((name, i) => {
                              const x = 50 + i * (915 / 3);
                              const count = monthlyWeekCounts[i];
                              const y = 200 - (count / maxMonthlyVal) * 175;
                              return { x, y, count, name, index: i };
                            });

                            const linePath = `M ${pts.map(p => `${p.x} ${p.y}`).join(' L ')}`;
                            const areaPath = `M ${pts[0].x} 200 L ${pts.map(p => `${p.x} ${p.y}`).join(' L ')} L ${pts[pts.length - 1].x} 200 Z`;

                            return (
                              <>
                                {/* Shaded Area under curve matching Yearly */}
                                <path d={areaPath} fill="url(#monthlyChartGradient)" />

                                {/* Primary Line matching Yearly design */}
                                <path
                                  d={linePath}
                                  fill="none"
                                  stroke="#0F5A29"
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />

                                {/* Data point nodes for each of the 4 weeks */}
                                {pts.map((pt) => {
                                  const isHovered = hoveredWeekIndex === pt.index;
                                  const hasData = pt.count > 0;
                                  return (
                                    <g
                                      key={pt.name}
                                      className="cursor-pointer group"
                                      onMouseEnter={() => setHoveredWeekIndex(pt.index)}
                                      onMouseLeave={() => setHoveredWeekIndex(null)}
                                    >
                                      {/* Invisible wider hover hit-area */}
                                      <rect
                                        x={pt.x - 35}
                                        y={15}
                                        width={70}
                                        height={195}
                                        fill="transparent"
                                      />

                                      {/* Point circles matching Yearly */}
                                      <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r={isHovered ? 6 : 4.5}
                                        fill={hasData ? '#88D628' : '#0F5A29'}
                                        stroke="#0F5A29"
                                        strokeWidth={hasData ? 2.5 : 0}
                                        className="transition-all"
                                      />

                                      {/* Glow ring on points with leads or on hover matching Yearly */}
                                      {(hasData || isHovered) && (
                                        <circle
                                          cx={pt.x}
                                          cy={pt.y}
                                          r={isHovered ? 12 : 9}
                                          fill="#88D628"
                                          opacity={isHovered ? 0.4 : 0.25}
                                          className="animate-pulse"
                                        />
                                      )}
                                    </g>
                                  );
                                })}
                              </>
                            );
                          })()}
                        </svg>
                      </div>

                      {/* X-axis labels matching Yearly exact horizontal positioning */}
                      <div className="relative w-full h-8 pt-2 border-t border-slate-100">
                        {weekLabels.map((weekName, i) => {
                          const xPos = 50 + i * (915 / 3);
                          const isHovered = hoveredWeekIndex === i;
                          return (
                            <div
                              key={weekName}
                              onMouseEnter={() => setHoveredWeekIndex(i)}
                              onMouseLeave={() => setHoveredWeekIndex(null)}
                              style={{ left: `${(xPos / 1000) * 100}%` }}
                              className={`absolute -translate-x-1/2 text-[11px] font-bold cursor-pointer transition-colors ${
                                isHovered ? 'text-[#0F5A29] font-black' : 'text-slate-500'
                              }`}
                            >
                              {weekName}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sub-strip: PERIOD BREAKDOWN */}
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                            PERIOD BREAKDOWN
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-[#0F5A29] border border-emerald-200 uppercase tracking-wider">
                            ACTIVE PERIOD: {selectedMonth.toUpperCase()} {selectedYear}
                          </span>
                        </div>

                        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                          SUBMITTED LEADS PROCESSED IN THIS PERIOD.
                        </span>
                      </div>

                      {/* 4 Week Cards matching yearly card styling */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {weekLabels.map((weekName, idx) => {
                          const count = monthlyWeekCounts[idx];
                          const isHovered = hoveredWeekIndex === idx;
                          return (
                            <div
                              key={weekName}
                              onMouseEnter={() => setHoveredWeekIndex(idx)}
                              onMouseLeave={() => setHoveredWeekIndex(null)}
                              className={`rounded-xl p-3.5 border transition-all cursor-pointer ${
                                isHovered
                                  ? 'bg-emerald-50/70 border-[#88D628] shadow-xs'
                                  : 'bg-slate-50/70 border-slate-100 hover:bg-white hover:border-slate-200'
                              }`}
                            >
                              <div className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                {weekName.toUpperCase()}
                              </div>
                              <div className="flex items-center justify-between mt-2.5">
                                <span className="text-xs font-medium text-slate-600">Leads</span>
                                <span
                                  className={`w-7 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                                    count > 0
                                      ? 'bg-[#88D628] text-[#062816] shadow-2xs font-black'
                                      : 'bg-[#EDF7EE] border border-[#C8E6C9] text-[#1B5E20]'
                                  }`}
                                >
                                  {count}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* SECTION 3: BOTTOM SPLIT (RECENT FORUM INQUIRIES & OCULAR TRIPS) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT: RECENT FORUM INQUIRIES (approx 65% width = 8 cols) */}
                <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                      <div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                          RECENT FORUM INQUIRIES
                        </h2>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                          LATEST LEADS SUBMITTED VIA PUBLIC INTAKE PORTAL.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('leads')}
                        className="text-xs font-bold text-[#0F5A29] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>View All Leads</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Inquiries List matching reference row card styling */}
                    <div className="space-y-3">
                      {filteredLeads.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <p className="text-xs font-semibold text-slate-500">No customer inquiries found.</p>
                          <p className="text-[11px] text-slate-400 mt-1">Form submissions from the website will automatically appear here in real-time.</p>
                        </div>
                      ) : (
                        filteredLeads.slice(0, 5).map((lead) => (
                          <div
                            key={lead.id}
                            onClick={() => {
                              setSelectedLeadIdForDossier(lead.id);
                              setActiveTab('leads');
                            }}
                            className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#88D628] hover:bg-slate-50/80 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Avatar box with @ symbol */}
                              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#0F5A29] flex items-center justify-center font-black text-sm shrink-0">
                                @
                              </div>

                              {/* Main Info */}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-sm text-slate-900 truncate">
                                    {lead.name}
                                  </span>
                                  {(() => {
                                    const displayStatus =
                                      lead.status === 'Contacted' || lead.status === 'Ocular Scheduled'
                                        ? 'Contacted'
                                        : lead.status === 'In Progress' || lead.status === 'Proposal Sent' || lead.status === 'Contract Signed'
                                        ? 'In Progress'
                                        : lead.status === 'Archived'
                                        ? 'Archived'
                                        : 'New';
                                    return (
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                        displayStatus === 'New' ? 'bg-sky-100 text-sky-800' :
                                        displayStatus === 'Contacted' ? 'bg-amber-100 text-amber-800' :
                                        displayStatus === 'In Progress' ? 'bg-emerald-100 text-emerald-800' :
                                        'bg-rose-100 text-rose-800'
                                      }`}>
                                        {displayStatus === 'New' && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />}
                                        {displayStatus}
                                      </span>
                                    );
                                  })()}
                                </div>
                                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-tight truncate mt-1">
                                  {lead.address} • USAGE: {lead.billRange} • CONTACT: {lead.phone} / {lead.email}
                                </div>
                              </div>
                            </div>

                            {/* Right Chevron */}
                            <div className="w-7 h-7 rounded-lg text-slate-400 group-hover:text-[#0F5A29] group-hover:translate-x-0.5 transition-all flex items-center justify-center shrink-0">
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 text-center">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Syncing real-time from Bacoor, Imus, and Cavite consultation intake modules.
                    </span>
                  </div>
                </div>

                {/* RIGHT: OCULAR TRIPS (approx 35% width = 4-5 cols) */}
                <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                      <div>
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                          OCULAR TRIPS
                        </h2>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">
                          SCHEDULED CLIENT PROPERTY ASSESSMENTS.
                        </p>
                      </div>

                      {/* "+ CALENDAR" Button matching reference visual structure */}
                      <button
                        type="button"
                        onClick={() => setCalendarModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F5A29] hover:bg-[#0b401d] text-[#88D628] rounded-xl text-xs font-black tracking-wide uppercase transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>CALENDAR</span>
                      </button>
                    </div>

                    {/* Scheduled Trip List */}
                    <div className="space-y-3">
                      {ocularTrips.slice(0, 5).map((trip) => (
                        <div
                          key={trip.id}
                          className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all flex items-start gap-3.5"
                        >
                          {/* Date Badge */}
                          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center text-[#0F5A29] shrink-0 font-black">
                            <span className="text-[9px] uppercase tracking-wider text-amber-700 leading-none">
                              {trip.dateMonth}
                            </span>
                            <span className="text-base leading-tight">
                              {trip.dateDay}
                            </span>
                          </div>

                          {/* Trip Details */}
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-slate-900 truncate">
                              {trip.clientName}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate mt-0.5">
                              {trip.locationDetails}
                            </div>
                            <div className="text-[10px] font-black text-slate-700 mt-1 uppercase tracking-wider flex items-center justify-between">
                              <span>TIME: {trip.timeString}</span>
                              <span className="text-slate-400 font-normal">{trip.engineer}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: INBOUND LEADS & QUERIES (LEADS MANAGER)                        */}
          {/* ===================================================================== */}
          {activeTab === 'leads' && (
            <LeadsManagerPage
              leads={leads}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onArchiveLead={(id) => handleUpdateLeadStatus(id, 'Archived')}
              onAddNewLead={handleAddNewLead}
              initialSelectedLeadId={selectedLeadIdForDossier}
              onClearInitialSelectedLead={() => setSelectedLeadIdForDossier(null)}
              onNavigateToArchive={() => setActiveTab('archive')}
              initialSearchTerm={leadsInitialSearch}
            />
          )}

          {/* ===================================================================== */}
          {/* TAB 3: PROJECT PORTFOLIO                                              */}
          {/* ===================================================================== */}
          {activeTab === 'portfolio' && (
            <ProjectsPortfolioPage
              projects={projectsList}
              onAddProject={handleAddPortfolioProject}
              onUpdateProject={handleUpdatePortfolioProject}
              onArchiveProject={handleArchivePortfolioProject}
              initialSelectedProjectId={selectedProjectIdForDossier}
              onClearInitialSelectedProject={() => setSelectedProjectIdForDossier(null)}
              initialSearchTerm={portfolioInitialSearch}
            />
          )}

          {/* ===================================================================== */}
          {/* TAB 4: ARCHIVE / TRASH                                                */}
          {/* ===================================================================== */}
          {activeTab === 'archive' && (
            <ArchiveTrashPage
              records={archivedRecords}
              onRestoreRecord={handleRestoreRecord}
              onPermanentDelete={handleDeletePermanently}
              onBulkRestore={handleBulkRestore}
              onBulkPermanentDelete={handleBulkPermanentDelete}
              onPurgeAll={handlePurgeAllArchive}
              initialInspectRecordId={selectedArchiveIdForInspect}
              onClearInitialInspectRecord={() => setSelectedArchiveIdForInspect(null)}
              initialSearchTerm={archiveInitialSearch}
            />
          )}

          {/* ===================================================================== */}
          {/* TAB 5: SYSTEM SETTINGS                                                */}
          {/* ===================================================================== */}
          {activeTab === 'settings' && (
            <SystemSettingsPage
              initialSocialLinks={socialLinksState}
              initialOperations={settingsForm}
              onSaveSocialLinks={(links) => handleSaveSocialLinksStore(links)}
              onSaveOperations={(ops) => handleSaveSettingsStore(ops)}
              onSavePassword={(oldPass, newPass) => changeAdminPassword(oldPass, newPass)}
            />
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW OCULAR TRIP                                                */}
      {/* ========================================================================= */}
      {newOcularModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setNewOcularModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">
              Schedule Client Ocular Assessment
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Assign a Solareign field engineering team to audit roof orientation and electrical service entrances.
            </p>

            <form onSubmit={handleAddOcularTrip} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Month (e.g. SEP)</label>
                  <input
                    type="text"
                    value={newOcular.dateMonth}
                    onChange={(e) => setNewOcular({ ...newOcular, dateMonth: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Day of Month</label>
                  <input
                    type="text"
                    value={newOcular.dateDay}
                    onChange={(e) => setNewOcular({ ...newOcular, dateDay: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Client Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ferdinand NIDOY"
                  value={newOcular.clientName}
                  onChange={(e) => setNewOcular({ ...newOcular, clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Site Location &amp; System Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Noveleta, Cavite • 8kW Hybrid Rooftop"
                  value={newOcular.locationDetails}
                  onChange={(e) => setNewOcular({ ...newOcular, locationDetails: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Time Slot</label>
                  <select
                    value={newOcular.timeString}
                    onChange={(e) => setNewOcular({ ...newOcular, timeString: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                    required
                  >
                    <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                    <option value="1:00 PM - 4:00 PM">1:00 PM - 4:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Lead Engineer</label>
                  <input
                    type="text"
                    value={newOcular.engineer}
                    onChange={(e) => setNewOcular({ ...newOcular, engineer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setNewOcularModalOpen(false)}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0F5A29] text-[#88D628] rounded-xl font-black uppercase tracking-wider hover:bg-[#0b401d]"
                >
                  Book Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POP-UP WIDGET: CALENDAR SELECTOR & PERSONNEL SCHEDULING CHECK             */}
      {/* ========================================================================= */}
      <CalendarSelectorModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        onAddMeeting={handleCalendarAddMeeting}
      />


      {/* ========================================================================= */}
      {/* MODAL: NEW INSTALLATION / PROJECT                                         */}
      {/* ========================================================================= */}
      <AddProjectModal
        isOpen={newProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
        onAddProject={handleAddPortfolioProject}
      />
    </div>
  );
}
