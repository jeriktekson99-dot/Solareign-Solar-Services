import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Trash2,
  Image as ImageIcon,
  Pencil,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ProjectItem } from '../data/projectsData';
import RichTextRenderer from './RichTextRenderer';
import ConfirmationActionModal from './ConfirmationActionModal';

interface ProjectDetailsViewProps {
  project: ProjectItem;
  onBack: () => void;
  onDelete: (projectId: string) => void;
  onEdit?: (project: ProjectItem) => void;
}

export default function ProjectDetailsView({
  project,
  onBack,
  onDelete,
  onEdit
}: ProjectDetailsViewProps) {
  // Gallery images with fallbacks
  const availableImages =
    project.galleryImages && project.galleryImages.length > 0
      ? project.galleryImages
      : project.image
      ? [project.image]
      : [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const totalImages = availableImages.length;
  const hasMoreThanFour = totalImages > 4;

  const handlePrevImage = () => {
    if (totalImages <= 1) return;
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1));
  };

  const handleNextImage = () => {
    if (totalImages <= 1) return;
    setActiveImageIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0));
  };

  // Synchronize thumbnailStartIndex so the active thumbnail is always within the 4 visible items
  useEffect(() => {
    if (totalImages <= 4) {
      setThumbnailStartIndex(0);
      return;
    }
    setThumbnailStartIndex((prev) => {
      if (activeImageIndex < prev) {
        return activeImageIndex;
      }
      if (activeImageIndex >= prev + 4) {
        return Math.min(totalImages - 4, activeImageIndex - 3);
      }
      return prev;
    });
  }, [activeImageIndex, totalImages]);

  // Active photo URL
  const activePhoto = availableImages[activeImageIndex] || project.image || '';

  // Case study reference
  const caseStudyRef = project.projectCode
    ? `SPEC-${project.projectCode}`
    : `SPEC-${project.id.toUpperCase()}`;

  // Client Name fallback
  const clientName =
    project.clientName && project.clientName.trim()
      ? project.clientName.trim()
      : (project.title.includes('Mandaluyong')
        ? 'Mandaluyong Penthouse Eco Solar Segment'
        : `${project.title} Client`);

  // Highlights / Bullet points
  const highlightsList =
    project.highlights && project.highlights.length > 0
      ? project.highlights
      : [
          'Premium custom matte rail systems',
          'Integrated smart app performance tracker',
          'Zero-export grid synchronization inverter'
        ];

  // Narrative / Scope Description
  const narrativeDescription =
    project.scopeDetails ||
    project.details ||
    project.summary ||
    'Ultra-low-profile mounting system styled beautifully in matte black structure to preserve architectural skyline views.';

  // Heading for narrative section
  const narrativeHeading =
    project.subtitle || project.title.toUpperCase();

  // 4 Thumbnail slots
  const thumbnailSlots = [0, 1, 2, 3];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-8">
      {/* ===================================================================== */}
      {/* TOP HEADER BAR CARD                                                   */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Back Arrow Button + Title + Status Pill */}
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0F5A29] flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
            title="Return to Projects Portfolio"
            aria-label="Back to projects"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.25]" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase font-mono break-words [overflow-wrap:anywhere]">
              PROJECT: {project.title}
            </h1>
          </div>
        </div>

        {/* Right Side: Action Buttons (Edit + Delete Record) */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(project)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
            >
              <Pencil className="w-3.5 h-3.5 text-[#0F5A29]" />
              <span>EDIT RECORD</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>DELETE RECORD</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2-COLUMN MAIN LAYOUT: LEFT (WIDE) + RIGHT (NARROW)                    */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =================================================================== */}
        {/* LEFT COLUMN: PHOTOS & NARRATIVE (8 of 12 columns)                   */}
        {/* =================================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* CARD 1: PROJECT SETUP & ACTUAL PHOTOS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-wider uppercase font-mono">
                PROJECT SETUP &amp; ACTUAL PHOTOS
              </h2>
              <p className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                INTERACTIVE HIGH-RESOLUTION VISUAL ASSETS OF THE COMMISSIONED SETUP
              </p>
            </div>

            {/* Main Active Angle Display */}
            <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group shadow-inner">
              {activePhoto ? (
                <img
                  src={activePhoto}
                  alt={`${project.title} - Active Angle`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <ImageIcon className="w-10 h-10 text-slate-600 stroke-[1.5]" />
                  <span className="text-xs font-mono uppercase tracking-wider">
                    Project Setup Active Angle
                  </span>
                </div>
              )}

              {/* Angle Tag Overlay */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-3 py-1 rounded-lg border border-white/10 pointer-events-none">
                {activePhoto
                  ? `Angle ${activeImageIndex + 1}: ${project.capacity || 'Commissioned Solar Array'}`
                  : 'Project Setup Active Angle'}
              </div>

              {/* Left and Right navigation symbols on main photo when images > 1 (no container, pure symbols) */}
              {totalImages > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous photo angle"
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-0 bg-transparent border-0 text-white/80 hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all hover:scale-110 active:scale-95 cursor-pointer focus:outline-none z-10"
                  >
                    <ChevronLeft className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next photo angle"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0 bg-transparent border-0 text-white/80 hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all hover:scale-110 active:scale-95 cursor-pointer focus:outline-none z-10"
                  >
                    <ChevronRight className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Row of Cards Carousel with Overlaid Left/Right Chevrons */}
            <div className="relative w-full group/carousel select-none pt-1">
              {hasMoreThanFour && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous carousel image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer focus:outline-none border border-white/25 shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
              )}

              <div
                className={`grid gap-2.5 sm:gap-3 w-full ${
                  totalImages === 1
                    ? 'grid-cols-1 max-w-[200px]'
                    : totalImages === 2
                    ? 'grid-cols-2 max-w-[420px]'
                    : totalImages === 3
                    ? 'grid-cols-3 max-w-[620px]'
                    : 'grid-cols-4'
                }`}
              >
                {(hasMoreThanFour
                  ? availableImages.slice(thumbnailStartIndex, thumbnailStartIndex + 4)
                  : availableImages
                ).map((imgAtSlot, sliceIdx) => {
                  const realIdx = hasMoreThanFour
                    ? thumbnailStartIndex + sliceIdx
                    : sliceIdx;
                  const isSelected = realIdx === activeImageIndex;

                  return (
                    <button
                      key={realIdx}
                      type="button"
                      onClick={() => setActiveImageIndex(realIdx)}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-100 flex items-center justify-center ${
                        isSelected
                          ? 'border-[#88D628] ring-2 ring-[#0F5A29]/25 shadow-md scale-[1.02]'
                          : 'border-slate-200 hover:border-slate-400 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgAtSlot}
                        alt={`Thumbnail Angle ${realIdx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                      <span className="absolute bottom-1 left-1.5 text-[9px] font-mono font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">
                        Angle {realIdx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {hasMoreThanFour && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next carousel image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs transition-all hover:scale-110 active:scale-95 cursor-pointer focus:outline-none border border-white/25 shadow-lg"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>

          {/* CARD 2: PROJECT SCOPE & NARRATIVE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-wider uppercase font-mono">
                PROJECT SCOPE &amp; NARRATIVE
              </h2>
              <p className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                FULL DESCRIPTION AND COMMISSIONING CHALLENGES
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide font-mono">
                {narrativeHeading}
              </h3>

              <div className="text-xs text-slate-600 leading-relaxed">
                <RichTextRenderer content={narrativeDescription} />
              </div>

              {/* Highlights Bullet List */}
              <ul className="space-y-2 pt-2 text-xs text-slate-700">
                {highlightsList.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-slate-900 font-black text-sm leading-none mt-0.5">•</span>
                    <span className="leading-snug">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: PROFILES & TECHNICAL SPECS (4 of 12 columns)          */}
        {/* =================================================================== */}
        <div className="lg:col-span-4 space-y-6">
          {/* CARD 1: PROJECT & CLIENT PROFILE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-wider uppercase font-mono">
                PROJECT &amp; CLIENT PROFILE
              </h2>
              <p className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                CLIENT DETAILS &amp; PROPERTY SEGMENT
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4 text-xs">
              {/* Field 1: CLIENT REPRESENTATIVE (CLIENT NAME) */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  CLIENT REPRESENTATIVE (CLIENT NAME)
                </label>
                <div className="font-bold text-slate-900">{clientName}</div>
              </div>

              {/* Field 2: SECTOR CATEGORIZATION (SECTOR/SEGMENT) */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  SECTOR CATEGORIZATION (SECTOR/SEGMENT)
                </label>
                <div className="font-bold text-slate-900">
                  {project.segment || 'Residential'}
                </div>
              </div>

              {/* Field 3: GEOGRAPHIC LOCATION */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  GEOGRAPHIC LOCATION
                </label>
                <div className="font-bold text-slate-900">{project.location}</div>
              </div>

              {/* Field 4: CASE STUDY REFERENCE */}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  CASE STUDY REFERENCE
                </label>
                <div className="font-bold font-mono text-slate-900">{caseStudyRef}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* CONFIRMATION MODAL: ARCHIVE / DELETE RECORD                           */}
      {/* ===================================================================== */}
      <ConfirmationActionModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete(project.id);
        }}
        actionType="delete"
        customEyebrow="SYSTEM DELETION CONFIRMATION"
        customTitle="CONFIRM DELETION ACTION"
        customMessage={`Are you sure you want to move record ${project.projectCode || project.id.toUpperCase()} to the Archive/Trash?`}
        confirmButtonLabel="YES, CONFIRM ACTION"
        cancelButtonLabel="CANCEL"
      />
    </div>
  );
}
