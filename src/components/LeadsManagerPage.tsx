import { useState, useMemo, useEffect, FormEvent } from 'react';
import {
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  Filter,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Zap,
  ShieldCheck,
  FileText,
  User,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { LeadItem } from './AdminDashboard';
import LeadDetailsView from './LeadDetailsView';
import ConfirmationActionModal from './ConfirmationActionModal';

interface LeadsManagerPageProps {
  leads: LeadItem[];
  onUpdateLeadStatus: (leadId: string, newStatus: LeadItem['status']) => void;
  onArchiveLead: (leadId: string) => void;
  onAddNewLead?: (lead: Partial<LeadItem>) => void;
  initialSelectedLeadId?: string | null;
  onClearInitialSelectedLead?: () => void;
  onNavigateToArchive?: () => void;
  initialSearchTerm?: string;
}

export default function LeadsManagerPage({
  leads,
  onUpdateLeadStatus,
  onArchiveLead,
  onAddNewLead,
  initialSelectedLeadId,
  onClearInitialSelectedLead,
  onNavigateToArchive,
  initialSearchTerm
}: LeadsManagerPageProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Sync initialSearchTerm if changed from outside
  useEffect(() => {
    if (initialSearchTerm !== undefined) {
      setSearchTerm(initialSearchTerm);
      setCurrentPage(1);
    }
  }, [initialSearchTerm]);

  // Multi-selection state
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Modals state
  const [activeDossierLead, setActiveDossierLead] = useState<LeadItem | null>(() => {
    if (initialSelectedLeadId) {
      return leads.find((l) => l.id === initialSelectedLeadId) || null;
    }
    return null;
  });
  const [archiveTargetLead, setArchiveTargetLead] = useState<LeadItem | null>(null);
  const [isBulkArchiveModalOpen, setIsBulkArchiveModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<{
    text: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  // Sync initialSelectedLeadId if passed from outside
  useEffect(() => {
    if (initialSelectedLeadId) {
      const match = leads.find((l) => l.id === initialSelectedLeadId);
      if (match) {
        setActiveDossierLead(match);
      }
    }
  }, [initialSelectedLeadId, leads]);

  // New Lead form state
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    propertyType: 'RESIDENTIAL',
    requestedConfig: 'Backup power (Hybrid / Battery)',
    billRange: '9,000 - 12,000 PHP',
    systemRequested: '8kW Hybrid Solar with 10kWh Battery'
  });

  const showToast = (msg: string, actionLabel?: string, onAction?: () => void) => {
    setToastNotification({ text: msg, actionLabel, onAction });
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  // Helper for normalizing status to 4 canonical categories
  const getNormalizedLeadStatus = (status?: LeadItem['status']): 'New' | 'Contacted' | 'In Progress' | 'Archived' => {
    if (status === 'Archived') return 'Archived';
    if (status === 'Contacted' || status === 'Ocular Scheduled') return 'Contacted';
    if (status === 'In Progress' || status === 'Proposal Sent' || status === 'Contract Signed') return 'In Progress';
    return 'New';
  };

  // Filter leads based on search and property type
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Exclude already archived leads from active pipeline view unless specifically filtering for ARCHIVED
      if (lead.status === 'Archived' && statusFilter !== 'ARCHIVED') return false;

      // Property type filter
      const propType = (lead.propertyType || 'RESIDENTIAL').toUpperCase();
      if (selectedPropertyType !== 'ALL' && propType !== selectedPropertyType.toUpperCase()) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL') {
        const normStatus = getNormalizedLeadStatus(lead.status).toUpperCase();
        if (statusFilter === 'NEW' && normStatus !== 'NEW') return false;
        if (statusFilter === 'CONTACTED' && normStatus !== 'CONTACTED') return false;
        if (statusFilter === 'IN PROGRESS' && normStatus !== 'IN PROGRESS') return false;
        if (statusFilter === 'ARCHIVED' && lead.status !== 'Archived') return false;
      }

      // Search term
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      const token = (lead.token || '').toLowerCase();
      const name = lead.name.toLowerCase();
      const addr = (lead.address || lead.subRegion || '').toLowerCase();
      const phone = lead.phone.toLowerCase();
      const email = lead.email.toLowerCase();
      const config = (lead.requestedConfig || lead.systemRequested || '').toLowerCase();

      return (
        token.includes(q) ||
        name.includes(q) ||
        addr.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        config.includes(q)
      );
    });
  }, [leads, searchTerm, selectedPropertyType, statusFilter]);

  // Paginated records
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / itemsPerPage));
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLeads, currentPage]);

  // Selection handlers
  const isAllCurrentPageSelected =
    paginatedLeads.length > 0 &&
    paginatedLeads.every((lead) => selectedLeadIds.includes(lead.id));

  const toggleSelectAll = () => {
    if (isAllCurrentPageSelected) {
      // Deselect all on current page
      const currentPageIds = paginatedLeads.map((l) => l.id);
      setSelectedLeadIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      // Select all on current page
      const currentPageIds = paginatedLeads.map((l) => l.id);
      setSelectedLeadIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const toggleSelectLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkArchive = () => {
    if (selectedLeadIds.length === 0) return;
    const count = selectedLeadIds.length;
    selectedLeadIds.forEach((id) => {
      onArchiveLead(id);
    });
    setSelectedLeadIds([]);
    showToast(`Archived ${count} lead(s) to vault.`);
  };

  const handleBulkStatusChange = (newStatus: LeadItem['status']) => {
    if (selectedLeadIds.length === 0) return;
    selectedLeadIds.forEach((id) => {
      onUpdateLeadStatus(id, newStatus);
    });
    showToast(`Updated status of ${selectedLeadIds.length} lead(s) to "${newStatus}".`);
    setSelectedLeadIds([]);
  };

  const handleExportCSV = () => {
    const leadsToExport =
      selectedLeadIds.length > 0
        ? leads.filter((l) => selectedLeadIds.includes(l.id))
        : filteredLeads;

    const headers = [
      'Lead Token',
      'Client Name',
      'Property Type',
      'Phone',
      'Email',
      'Requested Configuration',
      'Monthly Usage/Bill',
      'Status Stage',
      'Philippine Sub-Region',
      'Date'
    ];

    const rows = leadsToExport.map((l) => [
      l.token || `LEAD-${l.id}`,
      `"${l.name.replace(/"/g, '""')}"`,
      l.propertyType || 'RESIDENTIAL',
      l.phone,
      l.email,
      `"${(l.solarProjectGoal || l.requestedConfig || l.systemRequested || '').replace(/"/g, '""')}"`,
      `"${l.billRange.replace(/"/g, '""')}"`,
      l.status,
      `"${(l.address || l.subRegion || '').replace(/"/g, '""')}"`,
      l.date
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `solareign_leads_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${leadsToExport.length} lead(s) to CSV.`);
  };

  const handleCreateLead = (e: FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name.trim() || !newLeadForm.phone.trim()) return;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const randomPrefix = Math.floor(100 + Math.random() * 900);
    const generatedToken = `LEAD-${randomPrefix}-${randomSuffix}`;

    if (onAddNewLead) {
      onAddNewLead({
        name: newLeadForm.name,
        phone: newLeadForm.phone,
        email: newLeadForm.email || 'info@client.ph',
        address: newLeadForm.address || 'Bacoor City, Cavite',
        subRegion: newLeadForm.address || 'Bacoor City, Cavite',
        propertyType: newLeadForm.propertyType as any,
        requestedConfig: newLeadForm.requestedConfig,
        systemRequested: newLeadForm.systemRequested,
        billRange: newLeadForm.billRange,
        token: generatedToken,
        status: 'New',
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        week: `Week ${Math.min(4, Math.max(1, Math.ceil(new Date().getDate() / 7)))}` as any
      });
    }

    setIsAddLeadModalOpen(false);
    setNewLeadForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      propertyType: 'RESIDENTIAL',
      requestedConfig: 'Backup power (Hybrid / Battery)',
      billRange: '9,000 - 12,000 PHP',
      systemRequested: '8kW Hybrid Solar with 10kWh Battery'
    });
    showToast(`Lead ${generatedToken} successfully registered.`);
  };

  // Helper for Status Badge styling matching Solareign visual brand
  const getStatusBadge = (status: LeadItem['status']) => {
    switch (status) {
      case 'New':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black font-mono tracking-wider uppercase bg-sky-50 text-sky-800 border border-sky-200">
            NEW
          </span>
        );
      case 'Contacted':
      case 'Ocular Scheduled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black font-mono tracking-wider uppercase bg-amber-50 text-amber-800 border border-amber-200">
            CONTACTED
          </span>
        );
      case 'In Progress':
      case 'Proposal Sent':
      case 'Contract Signed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black font-mono tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
            IN PROGRESS
          </span>
        );
      case 'Archived':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black font-mono tracking-wider uppercase bg-rose-50 text-rose-800 border border-rose-200">
            ARCHIVED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black font-mono tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  // Helper for Property Type badge styling
  const getPropertyTypeBadge = (type?: string) => {
    const pType = type || 'RESIDENTIAL';
    switch (pType.toUpperCase()) {
      case 'RESIDENTIAL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200">
            RESIDENTIAL
          </span>
        );
      case 'COMMERCIAL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200">
            COMMERCIAL
          </span>
        );
      case 'INDUSTRIAL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase bg-purple-50 text-purple-700 border border-purple-200">
            INDUSTRIAL
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            {pType}
          </span>
        );
    }
  };

  // Full-page Lead Details View matching the reference structural flow and section placement
  if (activeDossierLead) {
    const currentLead =
      leads.find((l) => l.id === activeDossierLead.id) || activeDossierLead;

    return (
      <div className="space-y-4">
        {toastNotification && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-[#88D628] shrink-0" />
            <span>{toastNotification.text}</span>
            {toastNotification.actionLabel && toastNotification.onAction && (
              <button
                type="button"
                onClick={toastNotification.onAction}
                className="ml-1 px-2.5 py-1 bg-[#88D628] text-slate-950 hover:bg-[#76bf1f] rounded-md text-[11px] font-black uppercase tracking-wider cursor-pointer transition-colors"
              >
                {toastNotification.actionLabel}
              </button>
            )}
          </div>
        )}

        <LeadDetailsView
          lead={currentLead}
          onBack={() => {
            setActiveDossierLead(null);
            if (onClearInitialSelectedLead) onClearInitialSelectedLead();
          }}
          onUpdateStatus={(newStatus) => {
            if (newStatus === 'Archived') {
              onArchiveLead(currentLead.id);
              setActiveDossierLead(null);
              if (onClearInitialSelectedLead) onClearInitialSelectedLead();
              showToast(
                `Lead inquiry moved straight towards Archive / Trash.`,
                onNavigateToArchive ? 'View Trash' : undefined,
                onNavigateToArchive
              );
            } else {
              onUpdateLeadStatus(currentLead.id, newStatus);
              setActiveDossierLead((prev) => (prev ? { ...prev, status: newStatus } : null));
            }
          }}
          onDelete={(id) => {
            onArchiveLead(id);
            setActiveDossierLead(null);
            if (onClearInitialSelectedLead) onClearInitialSelectedLead();
            showToast(
              `Lead inquiry moved straight towards Archive / Trash.`,
              onNavigateToArchive ? 'View Trash' : undefined,
              onNavigateToArchive
            );
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-[#88D628] shrink-0" />
          <span>{toastNotification.text}</span>
          {toastNotification.actionLabel && toastNotification.onAction && (
            <button
              type="button"
              onClick={toastNotification.onAction}
              className="ml-1 px-2.5 py-1 bg-[#88D628] text-slate-950 hover:bg-[#76bf1f] rounded-md text-[11px] font-black uppercase tracking-wider cursor-pointer transition-colors"
            >
              {toastNotification.actionLabel}
            </button>
          )}
        </div>
      )}

      {/* TOP HEADER - Matching Reference Image Section Placement & Structural Flow */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F5A29] tracking-tight uppercase">
            INBOUND LEADS &amp; QUERIES
          </h1>
          <p className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase mt-0.5">
            PUBLIC QUOTE ESTIMATIONS AND CONTACT SUBMISSIONS.
          </p>
        </div>

        {/* Quick action buttons maintaining Solareign design */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#0F5A29] bg-white border border-slate-200 hover:border-[#88D628] shadow-2xs transition-colors cursor-pointer"
            title="Export filtered records to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER CARD - Following the Reference Image Placement */}
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
              placeholder="Search prospective pipeline leads..."
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

          {/* Right: Status & Property Type Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 self-end md:self-auto shrink-0">
            {/* Status Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                STATUS:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by lead status"
                className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29] cursor-pointer hover:border-slate-300 transition-colors"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="IN PROGRESS">In Progress</option>
              </select>
            </div>

            {/* Property Type Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                PROPERTY TYPE:
              </span>
              <select
                value={selectedPropertyType}
                onChange={(e) => {
                  setSelectedPropertyType(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by property type"
                className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29] cursor-pointer hover:border-slate-300 transition-colors"
              >
                <option value="ALL">All Property Types</option>
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="INDUSTRIAL">Industrial</option>
              </select>
            </div>
          </div>
        </div>

        {/* SUBBAR: Selection Indicator & Bulk Controls */}
        <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                selectedLeadIds.length > 0 ? 'bg-[#0F5A29]' : 'bg-slate-300'
              }`}
            />
            <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-500">
              {selectedLeadIds.length} ITEMS SELECTED
            </span>
          </div>

          {/* Contextual Bulk Action Buttons when items are selected */}
          {selectedLeadIds.length > 0 && (
            <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 hidden sm:inline">
                Bulk Actions:
              </span>
              <button
                type="button"
                onClick={() => handleBulkStatusChange('New')}
                className="px-2.5 py-1 text-[11px] font-bold text-sky-800 bg-sky-100/70 hover:bg-sky-200 rounded-md transition-colors cursor-pointer"
              >
                Mark New
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange('Contacted')}
                className="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-100/70 hover:bg-amber-200 rounded-md transition-colors cursor-pointer"
              >
                Mark Contacted
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange('In Progress')}
                className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200 rounded-md transition-colors cursor-pointer"
              >
                Mark In Progress
              </button>
              <button
                type="button"
                onClick={() => setIsBulkArchiveModalOpen(true)}
                className="px-2.5 py-1 text-[11px] font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Archive (Trash)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLeadIds([])}
                className="px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* INBOUND LEADS DATA TABLE - Exact Structural Columns & Placement */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-black border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllCurrentPageSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all leads on this page"
                    className="rounded border-slate-300 text-[#0F5A29] focus:ring-[#0F5A29] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 font-bold whitespace-nowrap">LEAD TOKEN</th>
                <th className="py-3 px-3 font-bold whitespace-nowrap">CLIENT FULL NAME</th>
                <th className="py-3 px-3 font-bold whitespace-nowrap">STATUS</th>
                <th className="py-3 px-3 font-bold whitespace-nowrap">PROPERTY TYPE</th>
                <th className="py-3 px-3 font-bold whitespace-nowrap">PRIMARY CONTACT ENDPOINT</th>
                <th className="py-3 px-3 font-bold whitespace-nowrap">REQUESTED CONFIGURATION</th>
                <th className="py-3 px-3 font-bold whitespace-nowrap">MONTHLY USAGE (KWH)</th>
                <th className="py-3 px-3 font-bold whitespace-nowrap">PHILIPPINE SUB-REGION</th>
                <th className="py-3 px-3.5 text-center font-bold whitespace-nowrap">CONTROL ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <Search className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-slate-600 text-xs">No matching pipeline leads found</p>
                      <p className="text-[11px] text-slate-400">
                        Try adjusting your search keywords or change the property type filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead) => {
                  const isSelected = selectedLeadIds.includes(lead.id);
                  const token = lead.token || `LEAD-${lead.id.toUpperCase().replace('LEAD-', '')}`;
                  const config = lead.requestedConfig || lead.systemRequested;
                  const region = lead.subRegion || lead.address;
                  const propertyType = lead.propertyType || 'RESIDENTIAL';

                  return (
                    <tr
                      key={lead.id}
                      className={`transition-colors hover:bg-slate-50/80 ${
                        isSelected ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectLead(lead.id)}
                          aria-label={`Select lead ${lead.name}`}
                          className="rounded border-slate-300 text-[#0F5A29] focus:ring-[#0F5A29] cursor-pointer"
                        />
                      </td>

                      {/* Lead Token */}
                      <td className="py-3.5 px-3 font-mono text-[11px] font-bold text-slate-800 whitespace-nowrap">
                        {token}
                      </td>

                      {/* Client Full Name */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setActiveDossierLead(lead)}
                          className="flex items-center gap-2.5 text-left group cursor-pointer hover:opacity-80 transition-opacity"
                          title="View lead details"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#0F5A29]/10 text-[#0F5A29] border border-[#0F5A29]/20 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#0F5A29] group-hover:text-white transition-colors">
                            {lead.name.charAt(0)}
                          </div>
                          <span className="font-extrabold text-slate-900 text-xs group-hover:text-[#0F5A29] group-hover:underline transition-colors">
                            {lead.name}
                          </span>
                        </button>
                      </td>

                      {/* Status Dropdown Category - Right Before Property Type */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            value={getNormalizedLeadStatus(lead.status)}
                            onChange={(e) => {
                              const newStatus = e.target.value as 'New' | 'Contacted' | 'In Progress';
                              onUpdateLeadStatus(lead.id, newStatus);
                              showToast(`Updated "${lead.name}" status to ${newStatus}.`);
                            }}
                            aria-label={`Status for lead ${lead.name}`}
                            className={`text-[10px] sm:text-[11px] font-black font-mono tracking-wider uppercase rounded-lg px-2.5 py-1 border cursor-pointer focus:outline-none focus:ring-1 transition-all ${
                              getNormalizedLeadStatus(lead.status) === 'New'
                                ? 'bg-sky-50 text-sky-800 border-sky-200 hover:border-sky-300 focus:ring-sky-400'
                                : getNormalizedLeadStatus(lead.status) === 'Contacted'
                                ? 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-300 focus:ring-amber-400'
                                : getNormalizedLeadStatus(lead.status) === 'In Progress'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-300 focus:ring-emerald-400'
                                : 'bg-rose-50 text-rose-800 border-rose-200 hover:border-rose-300 focus:ring-rose-400'
                            }`}
                          >
                            <option value="New" className="bg-white text-slate-900 font-sans font-semibold">
                              NEW
                            </option>
                            <option value="Contacted" className="bg-white text-slate-900 font-sans font-semibold">
                              CONTACTED
                            </option>
                            <option value="In Progress" className="bg-white text-slate-900 font-sans font-semibold">
                              IN PROGRESS
                            </option>
                          </select>
                        </div>
                      </td>

                      {/* Property Type */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getPropertyTypeBadge(propertyType)}
                      </td>

                      {/* Primary Contact Endpoint */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="text-slate-800 font-medium text-[11px]">
                          {lead.phone} <span className="text-slate-300 mx-1">/</span> {lead.email}
                        </span>
                      </td>

                      {/* Requested Configuration */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="text-slate-700 font-semibold text-xs">
                          {lead.solarProjectGoal || lead.requestedConfig || lead.systemRequested}
                        </span>
                      </td>

                      {/* Monthly Usage (kWh / Bill) */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-mono font-medium text-slate-800 text-[11px]">
                          {lead.billRange}
                        </span>
                      </td>

                      {/* Philippine Sub-Region */}
                      <td className="py-3.5 px-3 max-w-xs truncate text-[11px] text-slate-600" title={region}>
                        {region}
                      </td>

                      {/* Control Actions: Eye & Trash */}
                      <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1.5">
                          {/* View Dossier Button */}
                          <button
                            type="button"
                            onClick={() => setActiveDossierLead(lead)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#0F5A29] hover:border-[#88D628] hover:bg-emerald-50/50 transition-colors cursor-pointer"
                            title="View Lead Dossier"
                            aria-label={`View dossier for ${lead.name}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Archive/Trash Button */}
                          <button
                            type="button"
                            onClick={() => setArchiveTargetLead(lead)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-colors cursor-pointer"
                            title="Archive Lead to Vault"
                            aria-label={`Archive lead ${lead.name}`}
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

        {/* TABLE FOOTER & PAGINATION - Matching Reference Image */}
        <div className="p-3 sm:px-4 py-3 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing{' '}
            <strong className="font-bold text-slate-800">
              {filteredLeads.length === 0
                ? '0'
                : `${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(
                    currentPage * itemsPerPage,
                    filteredLeads.length
                  )}`}
            </strong>{' '}
            of <strong className="font-bold text-slate-800">{filteredLeads.length}</strong> records
          </div>

          {/* Pagination buttons */}
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`min-w-[28px] h-7 px-2 text-xs font-bold rounded-md border transition-colors cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#0F5A29] text-white border-[#0F5A29]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD LEAD MODAL                                                            */}
      {/* ========================================================================= */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">
                  Add Inbound Solar Lead
                </h3>
                <p className="text-xs text-slate-500">
                  Register walk-in, phone, or referral customer inquiries
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddLeadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  placeholder="e.g. Ferdinand NIDOY"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-[#0F5A29] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="0917 123 4567"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-[#0F5A29] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    placeholder="client@gmail.com"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-[#0F5A29] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={newLeadForm.propertyType}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, propertyType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-[#0F5A29] focus:outline-none bg-white"
                  >
                    <option value="RESIDENTIAL">Residential</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="INDUSTRIAL">Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Monthly Electricity Bill
                  </label>
                  <select
                    value={newLeadForm.billRange}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, billRange: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-[#0F5A29] focus:outline-none bg-white"
                  >
                    <option value="1,000 - 4,000 PHP">1,000 - 4,000 PHP</option>
                    <option value="5,000 - 8,000 PHP">5,000 - 8,000 PHP</option>
                    <option value="9,000 - 12,000 PHP">9,000 - 12,000 PHP</option>
                    <option value="13,000 - 16,000 PHP">13,000 - 16,000 PHP</option>
                    <option value="17,000 - 25,000 PHP">17,000 - 25,000 PHP</option>
                    <option value="26,000 - 40,000 PHP">26,000 - 40,000 PHP</option>
                    <option value="41,000 PHP - Up">41,000 PHP - Up</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Philippine Sub-Region / Address *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadForm.address}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, address: e.target.value })}
                  placeholder="Lot / Blk / Subd / City / Cavite"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-[#0F5A29] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requested Configuration / Primary Goal
                </label>
                <select
                  value={newLeadForm.requestedConfig}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, requestedConfig: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:border-[#0F5A29] focus:outline-none bg-white"
                >
                  <option value="Lowering daytime electric bill (Grid-Tied)">Lowering daytime electric bill (Grid-Tied)</option>
                  <option value="Backup power (Hybrid / Battery)">Backup power (Hybrid / Battery)</option>
                  <option value="Going completely off-grid">Going completely off-grid</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-[#0F5A29] text-white hover:bg-[#0b401d] rounded-lg cursor-pointer shadow-xs"
                >
                  Save Lead Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* CONFIRM ARCHIVE SINGLE LEAD MODAL                                         */}
      {/* ========================================================================= */}
      {archiveTargetLead && (
        <ConfirmationActionModal
          isOpen={Boolean(archiveTargetLead)}
          onClose={() => setArchiveTargetLead(null)}
          onConfirm={() => {
            const tokenOrName = archiveTargetLead.token || archiveTargetLead.name;
            onArchiveLead(archiveTargetLead.id);
            showToast(`Lead "${archiveTargetLead.name}" moved to archive.`);
            setArchiveTargetLead(null);
          }}
          actionType="delete"
          customEyebrow="SYSTEM DELETION CONFIRMATION"
          customTitle="CONFIRM DELETION ACTION"
          customMessage={`Are you sure you want to move record ${archiveTargetLead.token || archiveTargetLead.name} to the Archive/Trash?`}
          confirmButtonLabel="YES, CONFIRM ACTION"
          cancelButtonLabel="CANCEL"
        />
      )}

      {/* ========================================================================= */}
      {/* CONFIRM BULK ARCHIVE LEADS MODAL                                          */}
      {/* ========================================================================= */}
      {isBulkArchiveModalOpen && (
        <ConfirmationActionModal
          isOpen={isBulkArchiveModalOpen}
          onClose={() => setIsBulkArchiveModalOpen(false)}
          onConfirm={() => {
            handleBulkArchive();
            setIsBulkArchiveModalOpen(false);
          }}
          actionType="delete"
          customEyebrow="SYSTEM DELETION CONFIRMATION"
          customTitle="CONFIRM DELETION ACTION"
          customMessage={`Are you sure you want to move ${selectedLeadIds.length} selected record(s) to the Archive/Trash?`}
          confirmButtonLabel="YES, CONFIRM ACTION"
          cancelButtonLabel="CANCEL"
        />
      )}
    </div>
  );
}
