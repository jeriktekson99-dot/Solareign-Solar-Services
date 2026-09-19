import React, { useState, useEffect, useRef, ChangeEvent, DragEvent, FormEvent } from 'react';
import {
  X,
  Plus,
  Pencil,
  Check,
  Image as ImageIcon,
  ChevronDown,
  Trash2,
  Loader2
} from 'lucide-react';
import { ProjectItem } from '../data/projectsData';
import RichTextEditor from './RichTextEditor';
import { uploadImageWithCompression, formatBytes } from '../utils/fileUtils';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject?: (project: Partial<ProjectItem>) => void;
  onUpdateProject?: (id: string, updates: Partial<ProjectItem>) => void;
  projectToEdit?: ProjectItem | null;
  defaultProjectCode?: string;
}

interface ImageUploadMeta {
  url: string;
  name?: string;
  sizeBytes?: number;
  originalSizeBytes?: number;
  savingsPercent?: number;
  isBucketUrl?: boolean;
}

export default function AddProjectModal({
  isOpen,
  onClose,
  onAddProject,
  onUpdateProject,
  projectToEdit,
  defaultProjectCode
}: AddProjectModalProps) {
  const isEditMode = Boolean(projectToEdit);

  // Form Fields matching Reference Layout
  const [displayName, setDisplayName] = useState('');
  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('');
  const [segment, setSegment] = useState<ProjectItem['segment']>('Residential');
  const [scopeDetails, setScopeDetails] = useState('');

  // Media Gallery Upload State
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imagesMeta, setImagesMeta] = useState<Record<string, ImageUploadMeta>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize form fields whenever modal opens or projectToEdit changes
  useEffect(() => {
    if (isOpen && projectToEdit) {
      setDisplayName(projectToEdit.title || '');
      setClientName(projectToEdit.clientName || '');
      setLocation(projectToEdit.location || '');
      setSegment(projectToEdit.segment || 'Residential');
      setScopeDetails(projectToEdit.scopeDetails || projectToEdit.details || '');

      const images: string[] = [];
      if (projectToEdit.galleryImages && projectToEdit.galleryImages.length > 0) {
        images.push(...projectToEdit.galleryImages);
      } else if (projectToEdit.image) {
        images.push(projectToEdit.image);
      }
      setUploadedImages(images);
    } else if (isOpen && !projectToEdit) {
      setDisplayName('');
      setClientName('');
      setLocation('');
      setSegment('Residential');
      setScopeDetails('');
      setUploadedImages([]);
      setImagesMeta({});
    }
  }, [isOpen, projectToEdit]);

  if (!isOpen) return null;

  // Handle local file uploads with automatic image compression and storage bucket upload
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    setIsCompressing(true);
    setCompressionStatus(`Compressing & uploading ${fileArray.length} image(s)...`);
    try {
      const settled = await Promise.allSettled(
        fileArray.map((f) =>
          uploadImageWithCompression(f, {
            folder: 'projects',
            maxDimension: 1280,
            quality: 0.78
          })
        )
      );

      const newUrls: string[] = [];
      const newMeta: Record<string, ImageUploadMeta> = {};

      settled.forEach((res) => {
        if (res.status === 'fulfilled' && res.value?.dataUrl) {
          const item = res.value;
          newUrls.push(item.dataUrl);
          newMeta[item.dataUrl] = {
            url: item.dataUrl,
            name: item.name,
            sizeBytes: item.sizeBytes,
            originalSizeBytes: item.originalSizeBytes,
            savingsPercent: item.savingsPercent,
            isBucketUrl: item.isBucketUrl
          };
        }
      });

      if (newUrls.length > 0) {
        setUploadedImages((prev) => [...prev, ...newUrls]);
        setImagesMeta((prev) => ({ ...prev, ...newMeta }));
      }
    } catch (err) {
      console.warn('Error processing, compressing, and uploading images:', err);
    } finally {
      setIsCompressing(false);
      setCompressionStatus('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle Form Submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) return;

    // Determine category based on segment
    let category: ProjectItem['category'] = 'Residential Hybrid';
    if (segment === 'Commercial') category = 'Commercial Microgrids';
    if (segment === 'Industrial') category = 'Industrial Arrays';

    const fallbackImage =
      uploadedImages[0] ||
      (projectToEdit?.image ||
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80');

    if (isEditMode && projectToEdit) {
      const updates: Partial<ProjectItem> = {
        title: displayName.trim(),
        subtitle: clientName.trim()
          ? `Designed for ${clientName.trim()} in ${location.trim() || projectToEdit.location || 'Cavite'}`
          : `${segment} solar array installation in ${location.trim() || projectToEdit.location || 'Cavite'}`,
        clientName: clientName.trim(),
        segment,
        category,
        location: location.trim() || projectToEdit.location || 'Cavite, Philippines',
        scopeDetails: scopeDetails.trim(),
        details: scopeDetails.trim() || projectToEdit.details || `${segment} Photovoltaic Installation`,
        image: fallbackImage,
        galleryImages: uploadedImages.length > 0 ? uploadedImages : [fallbackImage]
      };

      if (onUpdateProject) {
        onUpdateProject(projectToEdit.id, updates);
      } else if (onAddProject) {
        onAddProject({ ...projectToEdit, ...updates });
      }
    } else {
      if (onAddProject) {
        onAddProject({
          projectCode: defaultProjectCode || `PROJ-206-${Math.floor(10 + Math.random() * 90)}`,
          title: displayName.trim(),
          subtitle: clientName.trim()
            ? `Designed for ${clientName.trim()} in ${location.trim() || 'Cavite'}`
            : `${segment} solar array installation in ${location.trim() || 'Cavite'}`,
          clientName: clientName.trim(),
          segment,
          category,
          location: location.trim() || 'Cavite, Philippines',
          panelWattage: 'Tier-1 Monocrystalline PV Panels',
          inverterBrand: 'Hybrid Smart Inverter',
          roiYieldTargets: '',
          scopeDetails: scopeDetails.trim(),
          details: scopeDetails.trim() || `${segment} Photovoltaic Installation`,
          summary: `Solar array installation engineered for ${location.trim() || 'Cavite'}.`,
          capacity: '10 kWp',
          annualGeneration: '~15,000 kWh / Year',
          image: fallbackImage,
          galleryImages: uploadedImages.length > 0 ? uploadedImages : [fallbackImage],
          status: 'Completed',
          year: new Date().getFullYear().toString(),
          duration: '2 Weeks',
          publishedDate: new Date().toISOString().split('T')[0],
          highlights: [
            'High-efficiency photovoltaic modules',
            'Intelligent hybrid inverter with mobile telemetry',
            'Zero-export grid synchronization engineered for optimal reliability'
          ]
        });
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* ===================================================================== */}
        {/* MODAL HEADER: Dark Green Bar with Icon and Title                      */}
        {/* ===================================================================== */}
        <div className="bg-[#0b3818] px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#88D628] text-slate-950 flex items-center justify-center shadow-xs shrink-0">
              {isEditMode ? (
                <Pencil className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Plus className="w-5 h-5 stroke-[3]" />
              )}
            </div>
            <h2 className="text-sm sm:text-base font-black text-white tracking-wider uppercase font-mono">
              {isEditMode
                ? `EDIT PROJECT: ${projectToEdit?.projectCode || projectToEdit?.id}`
                : 'ADD NEW PROJECT'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===================================================================== */}
        {/* FORM BODY: Exact Structural Flow and Section Placement                */}
        {/* ===================================================================== */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-5">
          {/* ROW 1: 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Name of the Project (Project Display) */}
            <div>
              <label className="block text-[10px] sm:text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Name of the Project (Project Display) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., Mandaluyong Penthouse Eco Array / PREMIUM"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29]"
              />
            </div>

            {/* Client Representative (Client Name) */}
            <div>
              <label className="block text-[10px] sm:text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Client Representative (Client Name)
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g., Bernardo Family"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29]"
              />
            </div>
          </div>

          {/* ROW 2: 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Sector Categorization (Sector/Segment) */}
            <div>
              <label className="block text-[10px] sm:text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Sector Categorization (Sector/Segment) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={segment}
                  onChange={(e) => setSegment(e.target.value as ProjectItem['segment'])}
                  className="appearance-none w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29] cursor-pointer"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Municipal Location (Geograhic Location) */}
            <div>
              <label className="block text-[10px] sm:text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Municipal Location (Geograhic Location)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Mandaluyong, Metro Manila"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#0F5A29] focus:ring-1 focus:ring-[#0F5A29]"
              />
            </div>
          </div>

          {/* SECTION: ASSET MEDIA GALLERY (UNLIMITED IMAGES) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] sm:text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider">
                ASSET MEDIA GALLERY (UNLIMITED IMAGES)
              </label>
              {isCompressing && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-600 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {compressionStatus || 'OPTIMIZING IMAGES...'}
                </span>
              )}
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-[#0F5A29] bg-emerald-50/50'
                  : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onClick={(e) => e.stopPropagation()}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleFiles(e.target.files);
                  e.target.value = '';
                }}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs mb-3">
                {isCompressing ? (
                  <Loader2 className="w-6 h-6 stroke-[1.75] text-[#0F5A29] animate-spin" />
                ) : (
                  <ImageIcon className="w-6 h-6 stroke-[1.75]" />
                )}
              </div>

              <div className="text-xs font-black font-mono text-slate-800 uppercase tracking-wider">
                DRAG &amp; DROP MULTIPLE MEDIA FILES HERE
              </div>
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide mt-1">
                PNG, JPG, WEBP SUPPORTED
              </div>
            </div>

            {/* Thumbnail Previews if images are attached */}
            {uploadedImages.length > 0 && (
              <div className="mt-3.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono">
                  <span>ATTACHED MEDIA ({uploadedImages.length})</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedImages([]);
                      setImagesMeta({});
                    }}
                    className="text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {uploadedImages.map((imgSrc, idx) => {
                    const meta = imagesMeta[imgSrc];
                    return (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100 flex flex-col justify-between"
                      >
                        <img
                          src={imgSrc}
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* File size footer label */}
                        {meta?.sizeBytes ? (
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-2xs text-[8px] text-white font-mono px-1 py-0.5 text-center truncate pointer-events-none">
                            {formatBytes(meta.sizeBytes)}
                          </div>
                        ) : null}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(idx);
                          }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-md bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6: PROJECT SCOPE & DETAILS (RICH TEXT) * */}
          <div>
            <label className="block text-[10px] sm:text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              PROJECT SCOPE &amp; DETAILS (RICH TEXT) <span className="text-rose-500">*</span>
            </label>

            <RichTextEditor
              value={scopeDetails}
              onChange={setScopeDetails}
              placeholder="Provide detailed technical scope of work, structural mounting specifications, electrical schematics summary, and milestone schedules..."
            />
          </div>

          {/* ===================================================================== */}
          {/* FOOTER: CANCEL and PROVISION ASSET Action Buttons                     */}
          {/* ===================================================================== */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0F5A29] hover:bg-[#0b401d] text-[#88D628] text-xs font-black uppercase tracking-wider shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {isEditMode ? (
                <>
                  <Check className="w-4 h-4 text-[#88D628]" />
                  <span>SAVE CHANGES</span>
                </>
              ) : (
                <span>PROVISION ASSET</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
