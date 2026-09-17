import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  Building2,
  Filter,
  Search,
  Check,
  ChevronDown,
  Trash2
} from 'lucide-react';

export type ScheduleStatus = 'Scheduled' | 'Completed' | 'Postponed' | 'Cancelled';

export interface CalendarMeeting {
  id: string;
  clientName: string;
  phone?: string;
  title: string;
  type: 'Ocular Site Audit' | 'Installation Kickoff' | 'Net Metering Survey' | 'Client Consultation' | 'Maintenance Check';
  dateStr: string; // 'YYYY-MM-DD', e.g. '2026-07-24'
  timeSlot: string; // e.g. '9:00 AM - 10:30 AM'
  location: string;
  engineer: string;
  status: ScheduleStatus;
  notes?: string;
  systemSize?: string;

  // Supabase Datatable Schema Fields (Personnel Scheduling Check)
  titleOfAppointment?: string;
  scheduledDate?: string;
  timeHourInterval?: string;
  appointmentType?: string;
  installationSiteLocation?: string;
}

interface CalendarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMeetings?: CalendarMeeting[];
  onAddMeeting?: (meeting: CalendarMeeting) => void;
  onUpdateMeetingStatus?: (id: string, newStatus: ScheduleStatus) => void;
}

const INITIAL_MEETINGS: CalendarMeeting[] = [
  {
    id: 'meet-2026-07-24',
    clientName: 'Don Bosco Agro-Industrial Farms',
    phone: '09204481923',
    title: 'Commercial 50kW Ground Mount Solar Audit',
    type: 'Ocular Site Audit',
    dateStr: '2026-07-24',
    timeSlot: '9:00 AM - 12:00 PM',
    location: 'Brgy. Tartaria, Silang-Tagaytay Corridor, Cavite',
    engineer: 'Engr. J. De Leon',
    status: 'Scheduled',
    notes: 'Structural soil check and 3-phase grid transformer proximity test.',
    systemSize: '50 kWp Ground Mount'
  },
  {
    id: 'meet-2026-07-10',
    clientName: 'Engr. Rodolfo Macaraig',
    phone: '09183349912',
    title: '15kW Hybrid 3-Phase Residential Assessment',
    type: 'Ocular Site Audit',
    dateStr: '2026-07-10',
    timeSlot: '1:00 PM - 4:00 PM',
    location: 'Paliparan Road, Dasmariñas City, Cavite',
    engineer: 'Engr. M. Bautista',
    status: 'Completed',
    notes: 'Standing seam GI metal roof layout verified; 24 panels approved.',
    systemSize: '15 kWp Hybrid'
  },
  {
    id: 'meet-2026-07-17',
    clientName: 'Atty. Maria Santos Villa',
    phone: '09175510429',
    title: 'Net Metering & Battery Storage Expansion',
    type: 'Net Metering Survey',
    dateStr: '2026-07-17',
    timeSlot: '9:00 AM - 12:00 PM',
    location: 'Meadowood Executive Village, Bacoor City, Cavite',
    engineer: 'Engr. J. De Leon',
    status: 'Completed',
    notes: 'Meralco bi-directional meter documentation finalized.',
    systemSize: '10.2 kWp Hybrid + 15kWh LiFePO4'
  },
  {
    id: 'meet-2026-07-28',
    clientName: 'Cavite Cold Chain Terminal',
    phone: '09998812304',
    title: 'Substation Inverter Interconnection Check',
    type: 'Installation Kickoff',
    dateStr: '2026-07-28',
    timeSlot: '9:00 AM - 12:00 PM',
    location: 'Rosario Economic Zone, Cavite',
    engineer: 'Engr. K. Reyes',
    status: 'Postponed',
    notes: 'Customer requested reschedule following typhoon advisory.',
    systemSize: '80 kWp Grid-Tied'
  },
  {
    id: 'meet-2026-09-04',
    clientName: 'Ferdinand NIDOY',
    phone: '09178430001',
    title: 'Residential Hybrid Rooftop Audit',
    type: 'Ocular Site Audit',
    dateStr: '2026-09-04',
    timeSlot: '9:00 AM - 12:00 PM',
    location: 'Noveleta, Cavite',
    engineer: 'Engr. J. De Leon',
    status: 'Scheduled',
    notes: 'Shading analysis of coconut palms on south-facing roof.',
    systemSize: '8 kWp Hybrid'
  },
  {
    id: 'meet-2026-09-17',
    clientName: 'Carlos Mendoza',
    phone: '09192248571',
    title: 'Structural Truss & Inverter Load Survey',
    type: 'Ocular Site Audit',
    dateStr: '2026-09-17',
    timeSlot: '9:00 AM - 12:00 PM',
    location: 'Imus, Cavite',
    engineer: 'Engr. M. Bautista',
    status: 'Scheduled',
    notes: 'Evaluate C-purlin gauge and cable tray routing to garage distribution panel.',
    systemSize: '12 kWp Hybrid'
  },
  {
    id: 'meet-2026-09-22',
    clientName: 'Maria Elena Santos',
    phone: '09287719943',
    title: 'Meralco Net Metering Technical Inspection',
    type: 'Net Metering Survey',
    dateStr: '2026-09-22',
    timeSlot: '1:00 PM - 4:00 PM',
    location: 'Bacoor City, Cavite',
    engineer: 'Engr. J. De Leon',
    status: 'Scheduled',
    notes: 'Verification of anti-islanding protection and dual breaker disconnection box.',
    systemSize: '10 kWp Hybrid'
  }
];

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const FULL_DAY_NAMES = [
  'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
];

export default function CalendarSelectorModal({
  isOpen,
  onClose,
  initialMeetings = INITIAL_MEETINGS,
  onAddMeeting,
  onUpdateMeetingStatus
}: CalendarSelectorModalProps) {
  // Active Header View: 'calendar' (CALENDAR SELECTOR) or 'pipeline' (MASTER SCHEDULE PIPELINE)
  const [activeTab, setActiveTab] = useState<'calendar' | 'pipeline'>('calendar');

  // Filter State: 'ALL' | 'SCHEDULED' | 'COMPLETED' | 'POSTPONED' | 'CANCELLED'
  const [filterState, setFilterState] = useState<'ALL' | 'SCHEDULED' | 'COMPLETED' | 'POSTPONED' | 'CANCELLED'>('ALL');

  // Month & Year state: Default to July 2026 to match reference image perfectly!
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(6); // 0-indexed: 6 is July

  // Selected Day in Calendar: Default to July 1, 2026 (matches reference image screenshot!)
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-07-01');

  // Internal Meetings list
  const [meetings, setMeetings] = useState<CalendarMeeting[]>(initialMeetings);

  // New Meeting Modal Form toggle
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newMeetingForm, setNewMeetingForm] = useState({
    clientName: '',
    phone: '',
    title: '',
    type: 'Ocular Site Audit' as CalendarMeeting['type'],
    dateStr: '2026-07-01',
    timeSlot: '9:00 AM - 12:00 PM',
    location: '',
    engineer: 'Engr. J. De Leon',
    notes: '',
    systemSize: '10 kWp Hybrid'
  });

  // Search query for pipeline view
  const [pipelineSearch, setPipelineSearch] = useState('');

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Navigate Months
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  // Calendar Calculation for the active month
  const calendarData = useMemo(() => {
    const year = currentYear;
    const month = currentMonthIndex;

    // First day of month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();

    // Total days in this month
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    // Build the grid cells
    const cells: Array<{
      dayNumber: number | null;
      dateStr: string | null;
      isCurrentMonth: boolean;
    }> = [];

    // Leading blanks for starting day of week
    for (let i = 0; i < startingDayOfWeek; i++) {
      cells.push({
        dayNumber: null,
        dateStr: null,
        isCurrentMonth: false
      });
    }

    // Days in current month
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const fullDateStr = `${year}-${monthStr}-${dayStr}`;

      cells.push({
        dayNumber: day,
        dateStr: fullDateStr,
        isCurrentMonth: true
      });
    }

    return {
      startingDayOfWeek,
      totalDaysInMonth,
      cells
    };
  }, [currentYear, currentMonthIndex]);

  // Filter meetings according to filterState
  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      if (filterState === 'ALL') return true;
      return m.status.toUpperCase() === filterState;
    });
  }, [meetings, filterState]);

  // Map of dateStr -> array of meetings (for calendar dots)
  const meetingsByDate = useMemo(() => {
    const map: Record<string, CalendarMeeting[]> = {};
    filteredMeetings.forEach((m) => {
      if (!map[m.dateStr]) {
        map[m.dateStr] = [];
      }
      map[m.dateStr].push(m);
    });
    return map;
  }, [filteredMeetings]);

  // Meetings on currently selected date
  const selectedDateMeetings = useMemo(() => {
    return filteredMeetings.filter((m) => m.dateStr === selectedDateStr);
  }, [filteredMeetings, selectedDateStr]);

  // Formatted date string for selected date heading (e.g. "WEDNESDAY, JULY 1, 2026")
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDateStr) return '';
    const [y, m, d] = selectedDateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayName = FULL_DAY_NAMES[dateObj.getDay()];
    const monthName = MONTH_NAMES[dateObj.getMonth()];
    return `${dayName}, ${monthName} ${d}, ${y}`;
  }, [selectedDateStr]);

  // Handle creating a new meeting
  const handleCreateMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingForm.clientName.trim() || !newMeetingForm.location.trim()) {
      return;
    }

    const newMeeting: CalendarMeeting = {
      id: `meet-${Date.now()}`,
      clientName: newMeetingForm.clientName,
      phone: newMeetingForm.phone || '0917-000-0000',
      title: newMeetingForm.title || `${newMeetingForm.type} - ${newMeetingForm.clientName}`,
      type: newMeetingForm.type,
      dateStr: newMeetingForm.dateStr,
      timeSlot: newMeetingForm.timeSlot,
      location: newMeetingForm.location,
      engineer: newMeetingForm.engineer,
      status: 'Scheduled',
      notes: newMeetingForm.notes,
      systemSize: newMeetingForm.systemSize
    };

    setMeetings((prev) => [newMeeting, ...prev]);
    if (onAddMeeting) {
      onAddMeeting(newMeeting);
    }

    // Automatically select the scheduled date in the calendar
    setSelectedDateStr(newMeetingForm.dateStr);

    // Sync month/year view to the scheduled date
    const [y, m] = newMeetingForm.dateStr.split('-').map(Number);
    setCurrentYear(y);
    setCurrentMonthIndex(m - 1);

    setShowCreateModal(false);
    showNotification(`Meeting scheduled successfully for ${newMeeting.clientName}!`);

    // Reset form
    setNewMeetingForm({
      clientName: '',
      phone: '',
      title: '',
      type: 'Ocular Site Audit',
      dateStr: selectedDateStr || '2026-07-01',
      timeSlot: '9:00 AM - 12:00 PM',
      location: '',
      engineer: 'Engr. J. De Leon',
      notes: '',
      systemSize: '10 kWp Hybrid'
    });
  };

  // Handle status update
  const handleUpdateStatus = (id: string, newStatus: ScheduleStatus) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
    if (onUpdateMeetingStatus) {
      onUpdateMeetingStatus(id, newStatus);
    }
    showNotification(`Schedule status updated to ${newStatus}.`);
  };

  // Delete meeting from pipeline
  const handleDeleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    showNotification('Appointment removed from schedule pipeline.');
  };

  // Sorted chronologically by date ascending for the Master Schedule Pipeline
  const sortedAndFilteredPipelineMeetings = useMemo(() => {
    return [...filteredMeetings]
      .filter((m) => {
        if (!pipelineSearch) return true;
        const q = pipelineSearch.toLowerCase();
        return (
          m.clientName.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.engineer.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.dateStr.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        // Compare dateStr 'YYYY-MM-DD'
        const dateDiff = a.dateStr.localeCompare(b.dateStr);
        if (dateDiff !== 0) return dateDiff;
        return a.timeSlot.localeCompare(b.timeSlot);
      });
  }, [filteredMeetings, pipelineSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      {/* Toast alert */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-60 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-[#88D628]/40 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-[#88D628]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Outer Container with exact styling & structural flow */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl overflow-hidden flex flex-col my-auto max-h-[94vh]">
        {/* ===================================================================== */}
        {/* TOP HEADER: Dark Forest Green Bar with Tabs and Close Button          */}
        {/* ===================================================================== */}
        <div className="bg-[#062816] text-white px-5 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#0D3B20]">
          {/* Left Title with Calendar Icon in rounded box */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#88D628]/40 flex items-center justify-center text-[#88D628] shadow-inner shrink-0">
              <CalendarIcon className="w-5 h-5 text-[#88D628]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight uppercase text-white leading-tight">
                PERSONNEL SCHEDULING CHECK
              </h2>
              <p className="text-[10px] sm:text-[11px] font-extrabold text-[#88D628] tracking-wider uppercase mt-0.5">
                OCULAR SITE AUDITS, INSTALLATIONS &amp; CLIENT CONSULTATIONS
              </p>
            </div>
          </div>

          {/* Right Controls: Tab Switcher & Close Icon */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* View Tabs: CALENDAR SELECTOR vs MASTER SCHEDULE PIPELINE */}
            <div className="inline-flex p-1 rounded-xl bg-black/30 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'calendar'
                    ? 'bg-[#0F5A29] text-[#88D628] shadow-sm border border-[#88D628]/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                CALENDAR SELECTOR
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pipeline')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'pipeline'
                    ? 'bg-[#0F5A29] text-[#88D628] shadow-sm border border-[#88D628]/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                MASTER SCHEDULE PIPELINE
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SUBHEADER: FILTER STATE PILLS & + CREATE MEETING BUTTON               */}
        {/* ===================================================================== */}
        <div className="bg-white px-5 sm:px-8 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Left: Filter State */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-[11px] font-black text-slate-400 tracking-wider uppercase">
              FILTER STATE:
            </span>

            {(['ALL', 'SCHEDULED', 'COMPLETED', 'POSTPONED', 'CANCELLED'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterState(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all cursor-pointer ${
                  filterState === st
                    ? 'bg-[#0F5A29] text-[#88D628] shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Right: + CREATE MEETING button */}
          <button
            type="button"
            onClick={() => {
              setShowCreateModal((prev) => {
                if (!prev) {
                  setNewMeetingForm((curr) => ({
                    ...curr,
                    dateStr: selectedDateStr || '2026-07-01'
                  }));
                }
                return !prev;
              });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F5A29] hover:bg-[#0b401d] text-[#88D628] rounded-xl text-xs font-black tracking-wider uppercase transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>CREATE MEETING</span>
          </button>
        </div>

        {/* ===================================================================== */}
        {/* BODY CONTAINER                                                        */}
        {/* ===================================================================== */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8 bg-[#F8FAFC]">
          {/* ================================================================= */}
          {/* POP-UP / INLINE SECTION: ADD CORPORATE SCHEDULE ENTRY            */}
          {/* Matches Structural Flow & Section Placement of Reference Image     */}
          {/* (Link Inbound Lead feature omitted per user instructions)         */}
          {/* ================================================================= */}
          {showCreateModal && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header with Title & Dismiss Button */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <CalendarIcon className="w-4 h-4 text-[#0F5A29]" />
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-wider uppercase font-mono">
                    ADD CORPORATE SCHEDULE ENTRY
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close schedule entry form"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form with 2-row 3-column Layout */}
              <form onSubmit={handleCreateMeetingSubmit} className="pt-4 space-y-4">
                {/* Row 1: 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      CLIENT / CONTACT NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={newMeetingForm.clientName}
                      onChange={(e) =>
                        setNewMeetingForm({ ...newMeetingForm, clientName: e.target.value })
                      }
                      placeholder="e.g. Jerik Benito"
                      className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      TITLE OF APPOINTMENT
                    </label>
                    <input
                      type="text"
                      value={newMeetingForm.title}
                      onChange={(e) =>
                        setNewMeetingForm({ ...newMeetingForm, title: e.target.value })
                      }
                      placeholder="e.g. Ocular Visit"
                      className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      APPOINTMENT TYPE
                    </label>
                    <div className="relative">
                      <select
                        value={newMeetingForm.type}
                        onChange={(e) =>
                          setNewMeetingForm({
                            ...newMeetingForm,
                            type: e.target.value as CalendarMeeting['type']
                          })
                        }
                        className="appearance-none w-full pl-3.5 pr-8 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29] cursor-pointer"
                      >
                        <option value="Ocular Site Audit">Ocular Visit / Site Audit</option>
                        <option value="Installation Kickoff">Installation Kickoff</option>
                        <option value="Net Metering Survey">Net Metering Survey</option>
                        <option value="Client Consultation">Client Consultation</option>
                        <option value="Maintenance Check">Maintenance Check</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 2: 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      SCHEDULED DATE
                    </label>
                    <input
                      type="date"
                      required
                      value={newMeetingForm.dateStr}
                      onChange={(e) =>
                        setNewMeetingForm({ ...newMeetingForm, dateStr: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      TIME / HOUR INTERVAL
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={newMeetingForm.timeSlot}
                        onChange={(e) =>
                          setNewMeetingForm({ ...newMeetingForm, timeSlot: e.target.value })
                        }
                        className="w-full appearance-none pl-3.5 pr-8 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29] cursor-pointer"
                      >
                        <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                        <option value="1:00 PM - 4:00 PM">1:00 PM - 4:00 PM</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      INSTALLATION SITE / LOCATION
                    </label>
                    <input
                      type="text"
                      required
                      value={newMeetingForm.location}
                      onChange={(e) =>
                        setNewMeetingForm({ ...newMeetingForm, location: e.target.value })
                      }
                      placeholder="e.g. Imus, Cavite"
                      className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29]"
                    />
                  </div>
                </div>

                {/* Row 3: Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0F5A29] hover:bg-[#0b401d] text-[#88D628] text-xs font-black uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                  >
                    SAVE APPOINTMENT
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 1: CALENDAR SELECTOR VIEW (Exact Layout in Reference Image)    */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: MONTH NAV + 7-COL CALENDAR GRID (approx 65% width) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                {/* Month Navigator Header */}
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-[#0F5A29]" />
                    <span className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight">
                      {MONTH_NAMES[currentMonthIndex]} {currentYear}
                    </span>
                  </div>

                  {/* Previous / Next Month Arrows */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Next month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid Container */}
                <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs">
                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2">
                    {DAY_NAMES.map((day) => (
                      <div
                        key={day}
                        className="py-1.5 text-center text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Days Grid Cells */}
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {calendarData.cells.map((cell, idx) => {
                      if (!cell.dayNumber || !cell.dateStr) {
                        // Empty cell for offset
                        return (
                          <div
                            key={`empty-${idx}`}
                            className="aspect-square sm:min-h-[70px] rounded-xl bg-slate-50/50 border border-slate-100/60"
                          />
                        );
                      }

                      const isSelected = selectedDateStr === cell.dateStr;
                      const dayEvents = meetingsByDate[cell.dateStr] || [];
                      const hasEvents = dayEvents.length > 0;

                      return (
                        <div
                          key={cell.dateStr}
                          onClick={() => setSelectedDateStr(cell.dateStr!)}
                          className={`aspect-square sm:min-h-[70px] p-2 rounded-xl border flex flex-col justify-between transition-all cursor-pointer select-none group relative ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-[#0F5A29]/30'
                              : hasEvents
                              ? 'bg-white border-slate-200 hover:border-[#0F5A29] text-slate-800'
                              : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          {/* Day Number (top-left) */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs sm:text-sm font-black ${
                                isSelected ? 'text-white' : 'text-slate-800'
                              }`}
                            >
                              {cell.dayNumber}
                            </span>

                            {hasEvents && dayEvents.length > 1 && (
                              <span
                                className={`text-[9px] font-black px-1 rounded-md ${
                                  isSelected
                                    ? 'bg-[#88D628] text-slate-950'
                                    : 'bg-emerald-50 text-[#0F5A29]'
                                }`}
                              >
                                {dayEvents.length}
                              </span>
                            )}
                          </div>

                          {/* Bottom Event Status Dot (Matches green dot in reference screenshot on day 24!) */}
                          <div className="flex items-center justify-center pt-1">
                            {hasEvents && (
                              <span
                                className={`w-2 h-2 rounded-full transition-transform group-hover:scale-125 ${
                                  isSelected
                                    ? 'bg-[#88D628]'
                                    : dayEvents[0].status === 'Completed'
                                    ? 'bg-blue-500'
                                    : dayEvents[0].status === 'Postponed'
                                    ? 'bg-amber-500'
                                    : dayEvents[0].status === 'Cancelled'
                                    ? 'bg-rose-500'
                                    : 'bg-[#0F5A29]'
                                }`}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Calendar Legend */}
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0F5A29]" />
                    <span>Scheduled Visit</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Completed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Postponed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-700" />
                    <span>Active Selected Date</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: DAILY SCHEDULE LOGS (Matches 35% Column in Image) */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-3">
                {/* Header matching reference */}
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    DAILY SCHEDULE LOGS
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight mt-0.5">
                    {formattedSelectedDate}
                  </h3>
                </div>

                {/* Content Box */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 min-h-[380px] shadow-xs flex flex-col justify-between">
                  {selectedDateMeetings.length === 0 ? (
                    // EMPTY STATE (Exact replica of Question Mark + "NO SCHEDULED AGENDA" in Reference)
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
                      {/* Circle with ? Icon */}
                      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-extrabold text-lg mb-3 shadow-inner">
                        ?
                      </div>

                      <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                        NO SCHEDULED AGENDA
                      </h4>
                      <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-[240px] leading-relaxed">
                        Select another day or schedule a new meeting coordinates.
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setNewMeetingForm((prev) => ({
                            ...prev,
                            dateStr: selectedDateStr
                          }));
                          setShowCreateModal(true);
                        }}
                        className="mt-4 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-[#0F5A29] text-slate-700 hover:text-[#88D628] border border-slate-200 hover:border-[#0F5A29] text-xs font-black uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Schedule on this date</span>
                      </button>
                    </div>
                  ) : (
                    // EVENTS LIST for Selected Date
                    <div className="space-y-3.5 overflow-y-auto max-h-[420px] pr-1">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-black text-slate-700 uppercase">
                          {selectedDateMeetings.length} Scheduled Activity
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setNewMeetingForm((prev) => ({
                              ...prev,
                              dateStr: selectedDateStr
                            }));
                            setShowCreateModal(true);
                          }}
                          className="text-[11px] font-bold text-[#0F5A29] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add More</span>
                        </button>
                      </div>

                      {selectedDateMeetings.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#0F5A29] transition-all space-y-2.5"
                        >
                          {/* Top row: Time & Status Badge */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#0F5A29] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                              <Clock className="w-3 h-3 text-[#0F5A29]" />
                              {item.timeSlot}
                            </span>

                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                item.status === 'Scheduled'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'Completed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : item.status === 'Postponed'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          {/* Client & Title */}
                          <div>
                            <div className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                              {item.clientName}
                            </div>
                            <div className="text-[11px] font-bold text-slate-600 mt-0.5">
                              {item.title}
                            </div>
                          </div>

                          {/* Location & Engineer */}
                          <div className="text-[10px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                              <span className="truncate">{item.location}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <User className="w-3 h-3 text-slate-400" />
                                <span className="font-semibold text-slate-700">{item.engineer}</span>
                              </div>
                              {item.systemSize && (
                                <span className="text-[10px] font-extrabold text-[#0F5A29]">
                                  {item.systemSize}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions: Quick Status Change */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[10px]">
                            <span className="font-bold text-slate-400 uppercase">Set Status:</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(item.id, 'Completed')}
                                className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                                  item.status === 'Completed'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-200 hover:bg-blue-100 text-slate-700'
                                }`}
                              >
                                Done
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(item.id, 'Postponed')}
                                className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                                  item.status === 'Postponed'
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-slate-200 hover:bg-amber-100 text-slate-700'
                                }`}
                              >
                                Postpone
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(item.id, 'Cancelled')}
                                className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                                  item.status === 'Cancelled'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-200 hover:bg-rose-100 text-slate-700'
                                }`}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Summary note in card footer */}
                  <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between font-medium">
                    <span>Field operations logged for Cavite corridor</span>
                    <span className="text-[#0F5A29] font-bold">Solareign OS</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 2: MASTER SCHEDULE PIPELINE VIEW (Matches Image Structural Flow) */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'pipeline' && (
            <div className="space-y-4">
              {/* Top Header Strip: MASTER SCHEDULING PIPELINE & Count */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Clock className="w-4 h-4 text-[#88D628]" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight uppercase">
                      MASTER SCHEDULING PIPELINE
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                      SORTED CHRONOLOGICALLY BY DATE ASCENDING
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={pipelineSearch}
                      onChange={(e) => setPipelineSearch(e.target.value)}
                      placeholder="Search pipeline..."
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-[#0F5A29] w-36 sm:w-48"
                    />
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 shadow-xs whitespace-nowrap">
                    {sortedAndFilteredPipelineMeetings.length} Items Total
                  </div>
                </div>
              </div>

              {/* Pipeline Cards List */}
              {sortedAndFilteredPipelineMeetings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-extrabold text-lg mx-auto">
                    ?
                  </div>
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                    NO SCHEDULED PIPELINE AGENDA
                  </h4>
                  <p className="text-[11px] font-medium text-slate-400 max-w-sm mx-auto">
                    No events match the selected status filter. Click &ldquo;+ CREATE MEETING&rdquo; to schedule a new mission.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="mt-2 px-4 py-2 rounded-xl bg-[#0F5A29] text-[#88D628] font-black text-xs uppercase tracking-wider hover:bg-[#0c4620] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Meeting</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {sortedAndFilteredPipelineMeetings.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3.5 hover:border-slate-300 transition-all"
                    >
                      {/* Top Badges Row */}
                      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                        {/* Badge 1: Category/Mission Type */}
                        <span className="px-3 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                          {item.type === 'Ocular Site Audit' ? 'OCULAR VISIT / SITE AUDIT' : item.type.toUpperCase()}
                        </span>

                        {/* Badge 2: Status */}
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase border ${
                            item.status === 'Scheduled'
                              ? 'bg-emerald-100/60 text-emerald-800 border-emerald-200'
                              : item.status === 'Completed'
                              ? 'bg-blue-100/60 text-blue-800 border-blue-200'
                              : item.status === 'Postponed'
                              ? 'bg-amber-100/60 text-amber-800 border-amber-200'
                              : 'bg-rose-100/60 text-rose-800 border-rose-200'
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>

                        {/* Badge 3: Scheduled Date */}
                        <span className="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase bg-slate-50 text-slate-500 border border-slate-200">
                          SCHEDULED: {item.dateStr}
                        </span>
                      </div>

                      {/* Middle Row: Title & Right Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-0.5">
                        <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase">
                          APPOINTMENT – {item.clientName.toUpperCase()}
                        </h4>

                        <div className="flex items-center gap-3 sm:ml-auto shrink-0">
                          {/* Status Dropdown */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                              STATUS:
                            </span>
                            <div className="relative inline-block">
                              <select
                                value={item.status}
                                onChange={(e) => handleUpdateStatus(item.id, e.target.value as ScheduleStatus)}
                                aria-label="Appointment Status"
                                className="appearance-none pl-3 pr-8 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 shadow-xs focus:outline-none focus:border-[#0F5A29] cursor-pointer"
                              >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Postponed">Postponed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>

                          {/* Delete / Trash Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteMeeting(item.id)}
                            title="Delete appointment"
                            className="w-9 h-9 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Details Row */}
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 pt-1">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Client Partner: <strong className="text-slate-900 font-bold">{item.clientName}</strong></span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Period: <strong className="text-slate-900 font-bold">{item.timeSlot}</strong></span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Hub Location: <strong className="text-slate-900 font-bold">{item.location}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* FOOTER BAR (Exact Text and Structure from Reference Image)           */}
        {/* ===================================================================== */}
        <div className="bg-white px-5 sm:px-8 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0">
          <div>© 2026 POWERSHIFT PERSONNEL CONTROL PANEL</div>
          <div>ALL UPDATES ROUTE STATUS FLAGS TO MAIN SERVER FILES DYNAMICALLY.</div>
        </div>
      </div>
    </div>
  );
}
