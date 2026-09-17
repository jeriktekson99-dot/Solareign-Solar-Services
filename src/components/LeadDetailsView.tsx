import React, { useState } from 'react';
import {
  ArrowLeft,
  Trash2,
  Camera,
  Image as ImageIcon,
  Clock,
  CheckCircle2,
  X,
  AlertTriangle,
  ZoomIn,
  Download,
  ExternalLink,
  FileText
} from 'lucide-react';
import { LeadItem } from './AdminDashboard';
import ConfirmationActionModal from './ConfirmationActionModal';

interface LeadDetailsViewProps {
  lead: LeadItem;
  onBack: () => void;
  onUpdateStatus: (newStatus: LeadItem['status']) => void;
  onDelete: (id: string) => void;
}

const STAGE_CONFIG: Record<
  'NEW' | 'CONTACTED' | 'IN PROGRESS' | 'ARCHIVED',
  {
    selectedClass: string;
    unselectedClass: string;
    dotClass: string;
    badgeClass: string;
  }
> = {
  'NEW': {
    selectedClass: 'border-sky-500 bg-sky-50/60 text-sky-950 ring-1 ring-sky-400/40 shadow-2xs',
    unselectedClass: 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50/20 hover:text-sky-900',
    dotClass: 'bg-sky-500',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  'CONTACTED': {
    selectedClass: 'border-amber-500 bg-amber-50/60 text-amber-950 ring-1 ring-amber-400/40 shadow-2xs',
    unselectedClass: 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50/20 hover:text-amber-900',
    dotClass: 'bg-amber-500',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  'IN PROGRESS': {
    selectedClass: 'border-emerald-500 bg-emerald-50/60 text-emerald-950 ring-1 ring-emerald-500/40 shadow-2xs',
    unselectedClass: 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/20 hover:text-emerald-900',
    dotClass: 'bg-emerald-600',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  'ARCHIVED': {
    selectedClass: 'border-rose-500 bg-rose-50/60 text-rose-950 ring-1 ring-rose-400/40 shadow-2xs',
    unselectedClass: 'border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50/20 hover:text-rose-900',
    dotClass: 'bg-rose-500',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
  },
};

export default function LeadDetailsView({
  lead,
  onBack,
  onUpdateStatus,
  onDelete
}: LeadDetailsViewProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    title: string;
    subtitle?: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Status mapping for the 4 status stages
  const getActiveStage = (): 'NEW' | 'CONTACTED' | 'IN PROGRESS' | 'ARCHIVED' => {
    const s = lead.status;
    if (s === 'New') return 'NEW';
    if (s === 'Contacted' || s === 'Ocular Scheduled') return 'CONTACTED';
    if (s === 'In Progress' || s === 'Proposal Sent' || s === 'Contract Signed') return 'IN PROGRESS';
    if (s === 'Archived') return 'ARCHIVED';
    return 'NEW';
  };

  const activeStage = getActiveStage();

  const handleStageSelect = (stage: 'NEW' | 'CONTACTED' | 'IN PROGRESS' | 'ARCHIVED') => {
    if (stage === 'ARCHIVED') {
      onDelete(lead.id);
      return;
    }

    let targetStatus: LeadItem['status'] = 'New';
    if (stage === 'NEW') targetStatus = 'New';
    else if (stage === 'CONTACTED') targetStatus = 'Contacted';
    else if (stage === 'IN PROGRESS') targetStatus = 'In Progress';

    onUpdateStatus(targetStatus);
    showToast(`Status stage updated to ${stage}.`);
  };

  // Derive inspection date or provide defaults matching reference image
  const inspectionInfo = lead.fieldInspectionDate || {
    day: '26',
    month: 'JUL',
    fullDateString: 'Sunday, July 26, 2026',
    slot: '9:00 AM - 12:00 PM'
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-[#88D628]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TOP BAR / HEADER NAVIGATION & CONTROLS                                 */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Back Button + Title + Timestamp */}
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            title="Back to Leads List"
            aria-label="Back to Leads List"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase leading-snug">
              INQUIRY OF {lead.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black font-mono tracking-wider uppercase border ${STAGE_CONFIG[activeStage]?.badgeClass || 'bg-sky-50 text-sky-700 border-sky-200'}`}>
                {activeStage}
              </span>
              <span className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                RECEIVED ON {lead.receivedDateTime || `${lead.date} AT 09:51 AM`}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Delete Record Button */}
        <div>
          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-black tracking-wider uppercase inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>DELETE RECORD</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MAIN TWO-COLUMN LAYOUT                                                */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ------------------------------------------------------------------- */}
        {/* LEFT COLUMN: CLIENT PROFILE, TECHNICAL AUDIT, SITE & HARDWARE       */}
        {/* ------------------------------------------------------------------- */}
        <div className="lg:col-span-8 space-y-5">
          {/* CARD 1: CLIENT CONTACT & PROFILE */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="mb-3">
              <h2 className="text-xs sm:text-sm font-black text-[#0F5A29] uppercase tracking-wider">
                CLIENT CONTACT &amp; PROFILE
              </h2>
              <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mt-0.5">
                CONTACT INFO &amp; PROPERTY CLASSIFICATION
              </p>
            </div>

            <hr className="border-slate-100 my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              {/* Full Name */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                  FULL NAME
                </label>
                <div className="text-sm font-extrabold text-slate-900">
                  {lead.name}
                </div>
              </div>

              {/* Property Category */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                  PROPERTY CATEGORY
                </label>
                <div className="text-sm font-extrabold text-slate-900">
                  {lead.propertyCategory || lead.propertyType || 'Residential'}
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                  EMAIL ADDRESS
                </label>
                <div className="text-sm font-semibold text-slate-800 font-mono truncate">
                  <a
                    href={`mailto:${lead.email}`}
                    className="hover:text-[#0F5A29] hover:underline"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>

              {/* Mobile Phone Number */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                  MOBILE PHONE NUMBER
                </label>
                <div className="text-sm font-bold text-slate-900 font-mono">
                  <a
                    href={`tel:${lead.phone}`}
                    className="hover:text-[#0F5A29] hover:underline"
                  >
                    {lead.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: TECHNICAL AUDIT PARAMETERS */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="mb-3">
              <h2 className="text-xs sm:text-sm font-black text-[#0F5A29] uppercase tracking-wider">
                TECHNICAL AUDIT PARAMETERS
              </h2>
              <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mt-0.5">
                MONTHLY BILLING &amp; SYSTEM INTEGRATION GOALS
              </p>
            </div>

            <hr className="border-slate-100 my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              {/* Monthly Bill Range */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                  MONTHLY BILL RANGE
                </label>
                <div className="text-sm font-extrabold text-slate-900">
                  {lead.billRange.includes('PHP')
                    ? lead.billRange
                    : `${lead.billRange.replace('Bill', '').trim()} PHP`}
                </div>
              </div>

              {/* Utility Partner */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                  UTILITY PARTNER
                </label>
                <div className="text-sm font-extrabold text-slate-900">
                  {lead.utilityPartner || 'meralco'}
                </div>
              </div>

              {/* Structural Roof Type */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                  STRUCTURAL ROOF TYPE
                </label>
                <div className="text-sm font-extrabold text-slate-900">
                  {lead.structuralRoofType || 'Rib-type / Corrugated GI Sheet'}
                </div>
              </div>

              {/* Daytime Shading */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                  DAYTIME SHADING
                </label>
                <div className="text-sm font-extrabold text-slate-900">
                  {lead.daytimeShading || 'No, clear sunlight all day'}
                </div>
              </div>

              {/* Solar Project Goal */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                  SOLAR PROJECT GOAL
                </label>
                <div className="text-sm font-extrabold text-slate-900">
                  {lead.solarProjectGoal || lead.requestedConfig || lead.systemRequested || 'Backup power (Hybrid / Battery)'}
                </div>
              </div>

              {/* Commission Timeline */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                  COMMISSION TIMELINE
                </label>
                <div className="text-sm font-extrabold text-slate-900">
                  {lead.commissionTimeline || 'Immediately (2-3 weeks)'}
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: PHYSICAL SITE & INVERTER SPECIFICATIONS */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <div>
              <h2 className="text-xs sm:text-sm font-black text-[#0F5A29] uppercase tracking-wider">
                PHYSICAL SITE &amp; INVERTER SPECIFICATIONS
              </h2>
              <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mt-0.5">
                PREMISES, AUDIT SCHEDULE, SAFE LOCATION, &amp; PHOTO ASSETS
              </p>
            </div>

            <hr className="border-slate-100" />

            {/* Installation Site Address */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                INSTALLATION SITE ADDRESS
              </label>
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed">
                {lead.address || lead.subRegion}
              </div>
            </div>

            {/* Designated Safe Location */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-1">
                DESIGNATED SAFE LOCATION
              </label>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                {lead.designatedSafeLocation || 'No designated location yet (site survey needed)'}
              </div>
            </div>

            {/* Attached Site Photos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
                  ATTACHED SITE PHOTOS
                </label>
              </div>

              {((lead.inverterPhotos && lead.inverterPhotos.length > 0) || (lead.facilityPhotos && lead.facilityPhotos.length > 0)) ? (
                <div className="space-y-3">
                  {/* Photo 1: Inverter & Solar Photos */}
                  {lead.inverterPhotos && lead.inverterPhotos.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block mb-1.5">
                        PHOTO 1: INVERTER &amp; SOLAR PHOTOS ({lead.inverterPhotos.length})
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {lead.inverterPhotos.map((photo, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              setPreviewImage({
                                url: photo,
                                title: `Photo 1: Inverter & Solar Photo #${idx + 1}`,
                                subtitle: `${lead.name} • ${lead.token || 'LEAD'}`
                              })
                            }
                            className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-2xs hover:border-[#0F5A29] hover:shadow-md transition-all"
                            title="Click to view full size"
                          >
                            <img
                              src={photo}
                              alt={`Inverter Spec ${idx + 1}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold gap-1 backdrop-blur-2xs">
                              <ZoomIn className="w-4 h-4" />
                              <span>Enlarge</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photo 2: Proposed Facility Photos */}
                  {lead.facilityPhotos && lead.facilityPhotos.length > 0 && (
                    <div className={lead.inverterPhotos && lead.inverterPhotos.length > 0 ? "pt-2 border-t border-slate-100" : ""}>
                      <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block mb-1.5">
                        PHOTO 2: PROPOSED FACILITY PHOTOS ({lead.facilityPhotos.length})
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {lead.facilityPhotos.map((p, idx) => (
                          <div
                            key={idx}
                            onClick={() =>
                              setPreviewImage({
                                url: p,
                                title: `Photo 2: Proposed Facility Photo #${idx + 1}`,
                                subtitle: `${lead.name} • ${lead.token || 'LEAD'}`
                              })
                            }
                            className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-2xs hover:border-[#0F5A29] hover:shadow-md transition-all"
                            title="Click to view full size"
                          >
                            <img
                              src={p}
                              alt={`Facility Spec ${idx + 1}`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold gap-1 backdrop-blur-2xs">
                              <ZoomIn className="w-4 h-4" />
                              <span>Enlarge</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-8 px-4 flex flex-col items-center justify-center text-center">
                  <ImageIcon className="w-6 h-6 text-slate-400 mb-1.5" />
                  <span className="text-[10px] sm:text-[11px] font-black text-slate-400 font-mono uppercase tracking-wider">
                    NO VISUAL ATTACHMENTS UPLOADED BY THE CLIENT
                  </span>
                </div>
              )}
            </div>

            {/* Preferred Field Inspection / Site Audit */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block mb-2">
                PREFERRED FIELD INSPECTION / SITE AUDIT
              </label>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 sm:p-4 flex items-center gap-4">
                {/* Date Square Badge */}
                <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <span className="text-base font-extrabold leading-none">
                    {inspectionInfo.day}
                  </span>
                  <span className="text-[9px] font-bold font-mono tracking-widest uppercase text-slate-300 mt-0.5">
                    {inspectionInfo.month}
                  </span>
                </div>

                {/* Day and Slot */}
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {inspectionInfo.fullDateString}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>SELECTED FRAME SLOT: {inspectionInfo.slot}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* RIGHT COLUMN: LEAD STATUS CONTROL & DOCUMENTARY ASSETS              */}
        {/* ------------------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-5">
          {/* CARD 1: LEAD STATUS CONTROL */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="mb-4">
              <h2 className="text-[11px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                LEAD STATUS CONTROL
              </h2>
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mt-3 block">
                SET STATUS STAGE
              </span>
            </div>

            {/* 4 Status Stage Options */}
            <div className="space-y-2">
              {(['NEW', 'CONTACTED', 'IN PROGRESS', 'ARCHIVED'] as const).map((stage) => {
                const isSelected = activeStage === stage;
                const config = STAGE_CONFIG[stage];

                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => handleStageSelect(stage)}
                    className={`w-full px-4 py-3 rounded-xl border text-xs font-black tracking-wider uppercase flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? config.selectedClass
                        : config.unselectedClass
                    }`}
                  >
                    <span>{stage}</span>
                    {isSelected && (
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 animate-in zoom-in-75 duration-150 ${config.dotClass}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 2: ATTACHED IMAGES & DOCUMENTARY ASSETS */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-[11px] font-bold text-slate-700 font-mono uppercase tracking-wider">
                  ATTACHED IMAGES
                </h2>
                <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider mt-0.5">
                  CLIENT VISUAL SUBMISSIONS
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#0F5A29] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 font-mono">
                {((lead.inverterPhotos?.length || 0) + (lead.facilityPhotos?.length || 0) + (lead.attachedDocument ? 1 : 0))} PHOTOS
              </span>
            </div>

            {/* Photo 1: Inverter & Solar Photos */}
            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block">
                  PHOTO 1: INVERTER &amp; SOLAR PHOTOS ({lead.inverterPhotos ? lead.inverterPhotos.length : 0})
                </span>
              </div>

              {lead.inverterPhotos && lead.inverterPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {lead.inverterPhotos.map((photo, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        setPreviewImage({
                          url: photo,
                          title: `Photo 1: Inverter & Solar Photo #${idx + 1}`,
                          subtitle: `${lead.name} • ${lead.token || 'LEAD'}`
                        })
                      }
                      className="group relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-2xs hover:border-[#0F5A29] transition-all"
                      title="Click to view full size"
                    >
                      <img
                        src={photo}
                        alt={`Inverter Spec ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1 backdrop-blur-2xs">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Enlarge</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-3.5 px-3 flex flex-col items-center justify-center text-center">
                  <ImageIcon className="w-4 h-4 text-slate-400 mb-1" />
                  <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                    NO PHOTO 1 ATTACHMENTS (MAIN PANEL / INVERTER)
                  </span>
                </div>
              )}
            </div>

            {/* Photo 2: Proposed Facility Photos */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block">
                  PHOTO 2: PROPOSED FACILITY PHOTOS ({lead.facilityPhotos ? lead.facilityPhotos.length : 0})
                </span>
              </div>

              {lead.facilityPhotos && lead.facilityPhotos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {lead.facilityPhotos.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        setPreviewImage({
                          url: p,
                          title: `Photo 2: Proposed Facility Photo #${idx + 1}`,
                          subtitle: `${lead.name} • ${lead.token || 'LEAD'}`
                        })
                      }
                      className="group relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-2xs hover:border-[#0F5A29] transition-all"
                      title="Click to view full size"
                    >
                      <img
                        src={p}
                        alt={`Facility ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1 backdrop-blur-2xs">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Enlarge</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-3.5 px-3 flex flex-col items-center justify-center text-center">
                  <Camera className="w-4 h-4 text-slate-400 mb-1" />
                  <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                    NO PHOTO 2 ATTACHMENTS (ROOF / LOCATION)
                  </span>
                </div>
              )}
            </div>

            {/* Client Utility Bill / Billing Record (Photo View) */}
            {(() => {
              const hasBillDoc = Boolean(lead.attachedDocument);
              const billPhotoUrl = lead.attachedDocument?.url && lead.attachedDocument.url !== '#'
                ? lead.attachedDocument.url
                : hasBillDoc
                ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'
                : null;

              return (
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider block">
                      UTILITY BILL / BILLING RECORD ({billPhotoUrl ? 1 : 0})
                    </span>
                  </div>

                  {billPhotoUrl ? (
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        onClick={() =>
                          setPreviewImage({
                            url: billPhotoUrl,
                            title: 'Utility Bill / Billing Record',
                            subtitle: `${lead.name} • ${lead.token || 'LEAD'}`
                          })
                        }
                        className="group relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-2xs hover:border-[#0F5A29] transition-all"
                        title="Click to view full size"
                      >
                        <img
                          src={billPhotoUrl}
                          alt="Utility Bill Statement"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1 backdrop-blur-2xs">
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>Enlarge</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-3.5 px-3 flex flex-col items-center justify-center text-center">
                      <Camera className="w-4 h-4 text-slate-400 mb-1" />
                      <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                        NO UTILITY BILL PHOTO PROVIDED
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: CONFIRM ARCHIVE / DELETE RECORD                              */}
      {/* ===================================================================== */}
      <ConfirmationActionModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          setIsDeleteDialogOpen(false);
          onDelete(lead.id);
        }}
        actionType="delete"
        customEyebrow="SYSTEM DELETION CONFIRMATION"
        customTitle="CONFIRM DELETION ACTION"
        customMessage={`Are you sure you want to move record ${lead.token || lead.name} to the Archive/Trash?`}
        confirmButtonLabel="YES, CONFIRM ACTION"
        cancelButtonLabel="CANCEL"
      />

      {/* ===================================================================== */}
      {/* MODAL 2: HIGH-RESOLUTION LIGHTBOX PREVIEW MODAL                       */}
      {/* ===================================================================== */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-slate-950 border border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-white/10 text-white">
              <div className="min-w-0 pr-2">
                <h3 className="text-xs sm:text-sm font-bold truncate text-white">
                  {previewImage.title}
                </h3>
                {previewImage.subtitle && (
                  <p className="text-[10px] sm:text-xs text-emerald-400 font-mono mt-0.5 truncate">
                    {previewImage.subtitle}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewImage.url}
                  download="solar-asset-photo.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs"
                  title="Open / Download full resolution"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline text-[11px] font-medium">Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Preview Area */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center bg-black/50 min-h-[300px]">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                referrerPolicy="no-referrer"
                className="max-h-[72vh] max-w-full object-contain rounded-lg border border-white/10 shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
