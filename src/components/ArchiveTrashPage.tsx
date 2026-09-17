import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Download,
  FolderPlus,
  AlertTriangle,
  Clock,
  Layers,
  FileText,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { ArchivedRecord } from './AdminDashboard';
import ConfirmationActionModal from './ConfirmationActionModal';

interface ArchiveTrashPageProps {
  records: ArchivedRecord[];
  onRestoreRecord: (recordId: string) => void;
  onPermanentDelete: (recordId: string) => void;
  onBulkRestore?: (recordIds: string[]) => void;
  onBulkPermanentDelete?: (recordIds: string[]) => void;
  onPurgeAll?: () => void;
  initialSearchTerm?: string;
  initialInspectRecordId?: string | null;
  onClearInitialInspectRecord?: () => void;
}

export default function ArchiveTrashPage({
  records,
  onRestoreRecord,
  onPermanentDelete,
  onBulkRestore,
  onBulkPermanentDelete,
  onPurgeAll,
  initialSearchTerm,
  initialInspectRecordId,
  onClearInitialInspectRecord
}: ArchiveTrashPageProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('ALL');

  // Multi-selection state
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Inspect Modal & Confirm Purge/Restore Modals
  const [inspectRecord, setInspectRecord] = useState<ArchivedRecord | null>(() => {
    if (initialInspectRecordId) {
      return records.find((r) => r.id === initialInspectRecordId) || null;
    }
    return null;
  });
  const [purgeTargetRecord, setPurgeTargetRecord] = useState<ArchivedRecord | null>(null);
  const [restoreTargetRecord, setRestoreTargetRecord] = useState<ArchivedRecord | null>(null);
  const [isPurgeAllModalOpen, setIsPurgeAllModalOpen] = useState(false);
  const [isBulkPurgeModalOpen, setIsBulkPurgeModalOpen] = useState(false);
  const [isBulkRestoreModalOpen, setIsBulkRestoreModalOpen] = useState(false);

  // Sync initialInspectRecordId
  useEffect(() => {
    if (initialInspectRecordId) {
      const match = records.find((r) => r.id === initialInspectRecordId);
      if (match) {
        setInspectRecord(match);
      }
    }
  }, [initialInspectRecordId, records]);

  // Sync initialSearchTerm
  useEffect(() => {
    if (initialSearchTerm !== undefined) {
      setSearchTerm(initialSearchTerm);
      setCurrentPage(1);
    }
  }, [initialSearchTerm]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Helper to normalize origin string
  const getOriginStream = (rec: ArchivedRecord): string => {
    if (rec.originalStream === 'Inbound Leads' || rec.originalStream === 'Portfolio Projects') {
      return rec.originalStream;
    }
    if (rec.type === 'Portfolio Project' || rec.type === 'Portfolio Draft') {
      return 'Portfolio Projects';
    }
    return 'Inbound Leads';
  };

  // Helper to normalize item ID
  const getDisplayId = (rec: ArchivedRecord, index: number): string => {
    if (rec.archiveCode) return rec.archiveCode;
    const num = String(index + 10).padStart(3, '0');
    return `ARC-206-${num}`;
  };

  // Helper to normalize deleted date/time
  const getDisplayDateTime = (rec: ArchivedRecord): string => {
    if (rec.deletedDateTime) return rec.deletedDateTime;
    if (!rec.archivedDate) return 'July 28, 2026 14:22 PM';
    try {
      const d = new Date(rec.archivedDate);
      if (!isNaN(d.getTime())) {
        return `${d.toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        })} 11:30 AM`;
      }
    } catch {
      // fallback
    }
    return `${rec.archivedDate} 10:00 AM`;
  };

  // Filter records based on search query and origin dropdown
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const origin = getOriginStream(rec);

      // Origin filter
      if (selectedOrigin !== 'ALL') {
        if (origin !== selectedOrigin) {
          return false;
        }
      }

      // Search query
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      const code = (rec.archiveCode || rec.id).toLowerCase();
      const title = (rec.title || '').toLowerCase();
      const subtitle = (rec.subtitle || '').toLowerCase();
      const stream = origin.toLowerCase();

      return (
        code.includes(q) ||
        title.includes(q) ||
        subtitle.includes(q) ||
        stream.includes(q)
      );
    });
  }, [records, selectedOrigin, searchTerm]);

  // Paginated records
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRecords = useMemo(() => {
    const start = (validCurrentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, validCurrentPage, itemsPerPage]);

  // Checkbox helpers
  const allCurrentPageSelected =
    paginatedRecords.length > 0 &&
    paginatedRecords.every((r) => selectedRecordIds.includes(r.id));

  const toggleSelectAll = () => {
    if (allCurrentPageSelected) {
      setSelectedRecordIds((prev) =>
        prev.filter((id) => !paginatedRecords.some((r) => r.id === id))
      );
    } else {
      const currentIds = paginatedRecords.map((r) => r.id);
      setSelectedRecordIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const toggleSelectRecord = (id: string) => {
    setSelectedRecordIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkRestore = () => {
    if (selectedRecordIds.length === 0) return;
    const count = selectedRecordIds.length;
    if (onBulkRestore) {
      onBulkRestore(selectedRecordIds);
    } else {
      selectedRecordIds.forEach((id) => onRestoreRecord(id));
    }
    setSelectedRecordIds([]);
    showToast(`Restored ${count} record(s) to active streams.`);
  };

  const handleBulkPurge = () => {
    if (selectedRecordIds.length === 0) return;
    const count = selectedRecordIds.length;
    if (onBulkPermanentDelete) {
      onBulkPermanentDelete(selectedRecordIds);
    } else {
      selectedRecordIds.forEach((id) => onPermanentDelete(id));
    }
    setSelectedRecordIds([]);
    showToast(`Permanently purged ${count} record(s) from vault.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const items = selectedRecordIds.length > 0
      ? records.filter((r) => selectedRecordIds.includes(r.id))
      : filteredRecords;

    if (items.length === 0) {
      showToast('No archived records to export.');
      return;
    }

    const headers = [
      'Archived Item ID',
      'Original Stream Source',
      'Entity Label Name',
      'Deleted Date/Time'
    ];

    const rows = items.map((r, idx) => [
      `"${getDisplayId(r, idx)}"`,
      `"${getOriginStream(r)}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${getDisplayDateTime(r)}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `solareign_archive_trash_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${items.length} archived record(s) to CSV.`);
  };

  // Badge styling for original stream source
  const getStreamBadge = (stream: string) => {
    const s = stream.toLowerCase();
    if (s.includes('lead')) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          Inbound Leads
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
        Portfolio Projects
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-[#88D628]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER - Following the Structural Flow in Reference Image */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F5A29] tracking-tight uppercase">
            ARCHIVE / TRASH REPOSITORY
          </h1>
          <p className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase mt-0.5">
            REVIEW, RESTORE, OR PURGE DELETED RECORDS.
          </p>
        </div>

        {/* Action Controls in Solareign's visual style */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#0F5A29] bg-white border border-slate-200 hover:border-[#88D628] shadow-2xs transition-colors cursor-pointer"
            title="Export archive audit report to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Audit Log</span>
          </button>
          {records.length > 0 && (
            <button
              type="button"
              onClick={() => setIsPurgeAllModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 shadow-2xs transition-colors cursor-pointer"
              title="Purge all records in repository"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Empty Repository</span>
            </button>
          )}
        </div>
      </div>

      {/* MAIN CONTAINER CARD - Reorganized to Follow Reference Flow */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* TOP FILTER & SEARCH ROW */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Left: Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search archived items by ID, name, or metadata..."
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

          {/* Right: Origin Dropdown matching reference image */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              ORIGIN:
            </span>
            <select
              value={selectedOrigin}
              onChange={(e) => {
                setSelectedOrigin(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by original stream origin"
              className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29] cursor-pointer hover:border-slate-300 transition-colors"
            >
              <option value="ALL">All Origins</option>
              <option value="Inbound Leads">Inbound Leads</option>
              <option value="Portfolio Projects">Portfolio Projects</option>
            </select>
          </div>
        </div>

        {/* SUBBAR: Selection Indicator & Bulk Controls */}
        <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                selectedRecordIds.length > 0 ? 'bg-[#0F5A29]' : 'bg-slate-300'
              }`}
            />
            <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-500">
              {selectedRecordIds.length} ITEMS SELECTED
            </span>
          </div>

          {/* Contextual Bulk Action Buttons when items are selected */}
          {selectedRecordIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in duration-150">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 hidden sm:inline">
                Bulk Actions:
              </span>
              <button
                type="button"
                onClick={() => setIsBulkRestoreModalOpen(true)}
                className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restore Selected ({selectedRecordIds.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setIsBulkPurgeModalOpen(true)}
                className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-md transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Purge Selected ({selectedRecordIds.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRecordIds([])}
                className="px-2 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* ARCHIVED DATA TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-white text-slate-500 uppercase tracking-wider text-[10px] sm:text-[11px] font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3.5 sm:px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allCurrentPageSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all archived records on current page"
                    className="rounded border-slate-300 text-[#0F5A29] focus:ring-[#0F5A29] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 sm:px-4 font-bold text-slate-600 min-w-[140px]">
                  ARCHIVED ITEM ID
                </th>
                <th className="py-3 px-3 sm:px-4 font-bold text-slate-600 min-w-[150px]">
                  ORIGINAL STREAM SOURCE
                </th>
                <th className="py-3 px-3 sm:px-4 font-bold text-slate-600 min-w-[280px]">
                  ENTITY LABEL NAME
                </th>
                <th className="py-3 px-3 sm:px-4 font-bold text-slate-600 min-w-[170px]">
                  DELETED DATE/TIME
                </th>
                <th className="py-3 px-3 sm:px-4 font-bold text-slate-600 text-center min-w-[140px]">
                  CONTROL ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
              {filteredRecords.length === 0 ? (
                /* EXACT EMPTY STATE MATCHING REFERENCE IMAGE */
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
                        <FolderPlus className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase mb-1">
                        NO OPERATIONAL RECORDS MATCH
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-tight max-w-xs leading-relaxed">
                        NO ITEMS CORRESPOND TO ACTIVE QUERY PATTERNS IN THIS STREAM.
                      </p>
                      {(searchTerm || selectedOrigin !== 'ALL') && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedOrigin('ALL');
                          }}
                          className="mt-4 px-3 py-1.5 text-[11px] font-bold text-[#0F5A29] hover:text-[#0b401d] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Clear Active Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((rec, index) => {
                  const isSelected = selectedRecordIds.includes(rec.id);
                  const displayId = getDisplayId(rec, index);
                  const streamSource = getOriginStream(rec);
                  const displayDateTime = getDisplayDateTime(rec);

                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3.5 sm:px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRecord(rec.id)}
                          aria-label={`Select ${rec.title}`}
                          className="rounded border-slate-300 text-[#0F5A29] focus:ring-[#0F5A29] cursor-pointer"
                        />
                      </td>

                      {/* Archived Item ID */}
                      <td className="py-3.5 px-3 sm:px-4">
                        <span className="font-mono text-xs font-bold text-slate-800 tracking-tight">
                          {displayId}
                        </span>
                      </td>

                      {/* Original Stream Source */}
                      <td className="py-3.5 px-3 sm:px-4">
                        {getStreamBadge(streamSource)}
                      </td>

                      {/* Entity Label Name */}
                      <td className="py-3.5 px-3 sm:px-4">
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => setInspectRecord(rec)}
                            className="font-bold text-xs sm:text-sm text-slate-900 hover:text-[#0F5A29] transition-colors line-clamp-1 text-left cursor-pointer"
                            title={rec.title}
                          >
                            {rec.title}
                          </button>
                        </div>
                      </td>

                      {/* Deleted Date/Time */}
                      <td className="py-3.5 px-3 sm:px-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{displayDateTime}</span>
                        </div>
                      </td>

                      {/* Control Actions */}
                      <td className="py-3.5 px-3 sm:px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1. Restore Action */}
                          <button
                            type="button"
                            onClick={() => setRestoreTargetRecord(rec)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Restore Record to Live Stream"
                            aria-label={`Restore ${rec.title}`}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. View Metadata Action */}
                          <button
                            type="button"
                            onClick={() => setInspectRecord(rec)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#0F5A29] hover:border-[#0F5A29]/40 hover:bg-slate-50 transition-colors cursor-pointer"
                            title="Inspect Archived Record Metadata"
                            aria-label={`Inspect ${rec.title}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. Delete Permanently Action */}
                          <button
                            type="button"
                            onClick={() => setPurgeTargetRecord(rec)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Purge Permanently from Database"
                            aria-label={`Purge ${rec.title}`}
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
              {filteredRecords.length === 0 ? 0 : (validCurrentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-800">
              {Math.min(validCurrentPage * itemsPerPage, filteredRecords.length)}
            </span>{' '}
            of{' '}
            <span className="font-bold text-slate-800">{filteredRecords.length}</span> records
          </div>

          {/* Pagination Controls */}
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
      {/* MODAL: INSPECT ARCHIVED RECORD DOSSIER                                */}
      {/* ===================================================================== */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0F5A29] flex items-center justify-center border border-emerald-200">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">
                    ARCHIVED RECORD AUDIT DOSSIER
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID: {inspectRecord.archiveCode || inspectRecord.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInspectRecord(null);
                  if (onClearInitialInspectRecord) onClearInitialInspectRecord();
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                  Entity Label Name
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {inspectRecord.title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Original Stream
                  </span>
                  <div>{getStreamBadge(getOriginStream(inspectRecord))}</div>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Archived Timestamp
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {getDisplayDateTime(inspectRecord)}
                  </span>
                </div>
              </div>

              {inspectRecord.subtitle && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                    System Specification / Details
                  </span>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                    {inspectRecord.subtitle}
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="font-bold">Vault Governance:</strong> Restoring this item will re-inject it back into its original live stream. Permanently purging it will wipe it from the audit table.
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setPurgeTargetRecord(inspectRecord);
                  setInspectRecord(null);
                }}
                className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge Record</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectRecord(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRestoreTargetRecord(inspectRecord);
                    setInspectRecord(null);
                  }}
                  className="px-4 py-2 text-xs font-black bg-[#0F5A29] hover:bg-[#0b401d] text-white rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#88D628]" />
                  <span>Restore Record</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: CONFIRM PERMANENT PURGE OF SINGLE RECORD                       */}
      {/* ===================================================================== */}
      {purgeTargetRecord && (
        <ConfirmationActionModal
          isOpen={Boolean(purgeTargetRecord)}
          onClose={() => setPurgeTargetRecord(null)}
          onConfirm={() => {
            const title = purgeTargetRecord.title;
            onPermanentDelete(purgeTargetRecord.id);
            setPurgeTargetRecord(null);
            showToast(`Permanently deleted "${title}" from repository.`);
          }}
          actionType="delete"
          customEyebrow="SYSTEM DELETION CONFIRMATION"
          customTitle="CONFIRM DELETION ACTION"
          customMessage={`Are you sure you want to permanently delete record ${purgeTargetRecord.archiveCode || purgeTargetRecord.title} from the system? This action cannot be undone.`}
          confirmButtonLabel="YES, CONFIRM ACTION"
          cancelButtonLabel="CANCEL"
        />
      )}

      {/* ===================================================================== */}
      {/* MODAL: CONFIRM BULK PURGE OF SELECTED RECORDS                         */}
      {/* ===================================================================== */}
      {isBulkPurgeModalOpen && (
        <ConfirmationActionModal
          isOpen={isBulkPurgeModalOpen}
          onClose={() => setIsBulkPurgeModalOpen(false)}
          onConfirm={() => {
            const count = selectedRecordIds.length;
            handleBulkPurge();
            setIsBulkPurgeModalOpen(false);
          }}
          actionType="delete"
          customEyebrow="SYSTEM DELETION CONFIRMATION"
          customTitle="CONFIRM DELETION ACTION"
          customMessage={`Are you sure you want to permanently delete ${selectedRecordIds.length} selected record(s) from the system? This action cannot be undone.`}
          confirmButtonLabel="YES, CONFIRM ACTION"
          cancelButtonLabel="CANCEL"
        />
      )}

      {/* ===================================================================== */}
      {/* MODAL: CONFIRM PURGE ALL RECORDS                                      */}
      {/* ===================================================================== */}
      {isPurgeAllModalOpen && (
        <ConfirmationActionModal
          isOpen={isPurgeAllModalOpen}
          onClose={() => setIsPurgeAllModalOpen(false)}
          onConfirm={() => {
            if (onPurgeAll) {
              onPurgeAll();
            }
            setIsPurgeAllModalOpen(false);
            showToast('Repository emptied successfully.');
          }}
          actionType="delete"
          customEyebrow="SYSTEM DELETION CONFIRMATION"
          customTitle="CONFIRM DELETION ACTION"
          customMessage={`Are you sure you want to permanently purge all ${records.length} archived record(s) from the repository? All historical trash items will be erased.`}
          confirmButtonLabel="YES, CONFIRM ACTION"
          cancelButtonLabel="CANCEL"
        />
      )}

      {/* ===================================================================== */}
      {/* MODAL: CONFIRM RECOVERY / RESTORE OF SINGLE RECORD                    */}
      {/* ===================================================================== */}
      {restoreTargetRecord && (
        <ConfirmationActionModal
          isOpen={Boolean(restoreTargetRecord)}
          onClose={() => setRestoreTargetRecord(null)}
          onConfirm={() => {
            const title = restoreTargetRecord.title;
            onRestoreRecord(restoreTargetRecord.id);
            setRestoreTargetRecord(null);
            showToast(`Restored "${title}" to active stream.`);
          }}
          actionType="recovery"
          customEyebrow="SYSTEM RECOVERY CONFIRMATION"
          customTitle="CONFIRM RECOVERY ACTION"
          customMessage={`Are you sure you want to recover record ${restoreTargetRecord.archiveCode || restoreTargetRecord.title} and restore it to the active stream?`}
          confirmButtonLabel="YES, CONFIRM ACTION"
          cancelButtonLabel="CANCEL"
        />
      )}

      {/* ===================================================================== */}
      {/* MODAL: CONFIRM BULK RECOVERY / RESTORE OF SELECTED RECORDS            */}
      {/* ===================================================================== */}
      {isBulkRestoreModalOpen && (
        <ConfirmationActionModal
          isOpen={isBulkRestoreModalOpen}
          onClose={() => setIsBulkRestoreModalOpen(false)}
          onConfirm={() => {
            const count = selectedRecordIds.length;
            handleBulkRestore();
            setIsBulkRestoreModalOpen(false);
          }}
          actionType="recovery"
          customEyebrow="SYSTEM RECOVERY CONFIRMATION"
          customTitle="CONFIRM RECOVERY ACTION"
          customMessage={`Are you sure you want to recover ${selectedRecordIds.length} selected record(s) and restore them to active streams?`}
          confirmButtonLabel="YES, CONFIRM ACTION"
          cancelButtonLabel="CANCEL"
        />
      )}
    </div>
  );
}
