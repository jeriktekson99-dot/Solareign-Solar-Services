import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Upload,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  FileText,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Loader2,
  Plus,
  Zap,
} from 'lucide-react';
import { MultiStepQuoteFormData, UploadedPhotoItem } from '../types';
import { useSolareignData } from '../context/DataContext';
import { uploadImageWithCompression, formatBytes } from '../utils/fileUtils';

interface MultiStepQuoteFormProps {
  initialFocusRef?: React.RefObject<HTMLInputElement>;
}

export default function MultiStepQuoteForm({ initialFocusRef }: MultiStepQuoteFormProps) {
  const { addLead } = useSolareignData();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dossierId, setDossierId] = useState('LEAD-206-991');

  // Photo attachments state
  const [inverterPhotosList, setInverterPhotosList] = useState<UploadedPhotoItem[]>([]);
  const [facilityPhotosList, setFacilityPhotosList] = useState<UploadedPhotoItem[]>([]);
  const [utilityBillPhoto, setUtilityBillPhoto] = useState<UploadedPhotoItem | null>(null);
  const [isUploadingInverter, setIsUploadingInverter] = useState(false);
  const [isUploadingFacility, setIsUploadingFacility] = useState(false);
  const [isUploadingBill, setIsUploadingBill] = useState(false);

  // Multi-step form state
  const [formData, setFormData] = useState<MultiStepQuoteFormData>({
    propertyType: 'Residential',
    fullName: '',
    email: '',
    phone: '',
    installationAddress: '',

    utilityProvider: 'Meralco',
    monthlyBill: '5,000 - 8,000 PHP',
    roofType: 'Rib-type / Corrugated GI Sheet',
    daytimeShading: 'No, clear sunlight all day',

    inverterLocation: 'No designated location yet (site survey needed)',
    panelBoardPhotoName: undefined,
    panelBoardPhotoDataUrl: undefined,
    proposedLocationPhotoName: undefined,
    proposedLocationPhotoDataUrl: undefined,

    primaryGoal: 'Lowering daytime electric bill (Grid-Tied)',
    timeline: 'Immediately (2-3 weeks)',
    ocularDate: '',
    ocularTimeSlot: '9:00 AM - 12:00 PM',
    utilityBillPhotoName: undefined,
    utilityBillPhotoDataUrl: undefined,
  });

  const [step1Error, setStep1Error] = useState('');

  // Handle Step 1 validation
  const handleStep1Continue = () => {
    if (!formData.fullName.trim()) {
      setStep1Error('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      setStep1Error('Please provide an email or phone number.');
      return;
    }
    setStep1Error('');
    setCurrentStep(2);
  };

  // Handle Step 2 continue
  const handleStep2Continue = () => {
    setCurrentStep(3);
  };

  // Handle Step 3 continue
  const handleStep3Continue = () => {
    setCurrentStep(4);
  };

  // Handle final submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const propTypeUpper = (formData.propertyType?.toUpperCase() || 'RESIDENTIAL') as any;

    const inverterPhotoUrls = inverterPhotosList.length > 0
      ? inverterPhotosList.map((p) => p.dataUrl).filter(Boolean)
      : (formData.panelBoardPhotoDataUrl ? [formData.panelBoardPhotoDataUrl] : []);

    const facilityPhotoUrls = facilityPhotosList.length > 0
      ? facilityPhotosList.map((p) => p.dataUrl).filter(Boolean)
      : (formData.proposedLocationPhotoDataUrl ? [formData.proposedLocationPhotoDataUrl] : []);

    const createdLead = addLead(
      {
        name: formData.fullName || 'Inbound Client',
        email: formData.email || 'inquiry@solareign.ph',
        phone: formData.phone || '0908 145 4906',
        address: formData.installationAddress || 'Cavite, Philippines',
        propertyType: propTypeUpper,
        propertyCategory: formData.propertyType,
        utilityPartner: formData.utilityProvider,
        billRange: formData.monthlyBill,
        structuralRoofType: formData.roofType,
        daytimeShading: formData.daytimeShading,
        designatedSafeLocation: formData.inverterLocation,
        solarProjectGoal: formData.primaryGoal,
        commissionTimeline: formData.timeline,
        systemRequested: `${formData.propertyType} Solar Installation (${formData.monthlyBill})`,
        requestedConfig: formData.primaryGoal,
        inverterPhotos: inverterPhotoUrls,
        facilityPhotos: facilityPhotoUrls,
        attachedDocument: utilityBillPhoto ? {
          name: utilityBillPhoto.name,
          typeLabel: 'UTILITY BILL STATEMENT',
          url: utilityBillPhoto.dataUrl
        } : undefined
      },
      {
        scheduleOcular: Boolean(formData.ocularDate),
        ocularDate: formData.ocularDate,
        ocularSlot: formData.ocularTimeSlot
      }
    );

    setDossierId(createdLead.token || `LEAD-206-${Math.floor(100 + Math.random() * 900)}`);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      propertyType: 'Residential',
      fullName: '',
      email: '',
      phone: '',
      installationAddress: '',

      utilityProvider: 'Meralco',
      monthlyBill: '5,000 - 8,000 PHP',
      roofType: 'Rib-type / Corrugated GI Sheet',
      daytimeShading: 'No, clear sunlight all day',

      inverterLocation: 'No designated location yet (site survey needed)',
      panelBoardPhotoName: undefined,
      panelBoardPhotoDataUrl: undefined,
      proposedLocationPhotoName: undefined,
      proposedLocationPhotoDataUrl: undefined,

      primaryGoal: 'Lowering daytime electric bill (Grid-Tied)',
      timeline: 'Immediately (2-3 weeks)',
      ocularDate: '',
      ocularTimeSlot: '9:00 AM - 12:00 PM',
      utilityBillPhotoName: undefined,
      utilityBillPhotoDataUrl: undefined,
    });
    setInverterPhotosList([]);
    setFacilityPhotosList([]);
    setUtilityBillPhoto(null);
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  // Inverter photos upload handler
  const handleInverterPhotosUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploadingInverter(true);
    try {
      const newItems: UploadedPhotoItem[] = [];
      for (const file of Array.from(files)) {
        const processed = await uploadImageWithCompression(file, {
          folder: 'leads/inverter',
          maxDimension: 1080,
          quality: 0.75
        });
        newItems.push({
          name: processed.name,
          dataUrl: processed.dataUrl,
          sizeBytes: processed.sizeBytes,
          originalSizeBytes: processed.originalSizeBytes,
          savingsRatio: processed.savingsPercent,
          isBucketUrl: processed.isBucketUrl
        });
      }
      setInverterPhotosList((prev) => [...prev, ...newItems]);
      if (newItems.length > 0) {
        setFormData((prev) => ({
          ...prev,
          panelBoardPhotoName: newItems[0].name,
          panelBoardPhotoDataUrl: newItems[0].dataUrl
        }));
      }
    } catch (err) {
      console.error('Failed to process and compress inverter photo:', err);
    } finally {
      setIsUploadingInverter(false);
    }
  };

  const removeInverterPhoto = (index: number) => {
    setInverterPhotosList((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setFormData((f) => ({
        ...f,
        panelBoardPhotoName: updated[0]?.name,
        panelBoardPhotoDataUrl: updated[0]?.dataUrl
      }));
      return updated;
    });
  };

  // Facility photos upload handler
  const handleFacilityPhotosUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploadingFacility(true);
    try {
      const newItems: UploadedPhotoItem[] = [];
      for (const file of Array.from(files)) {
        const processed = await uploadImageWithCompression(file, {
          folder: 'leads/facility',
          maxDimension: 1080,
          quality: 0.75
        });
        newItems.push({
          name: processed.name,
          dataUrl: processed.dataUrl,
          sizeBytes: processed.sizeBytes,
          originalSizeBytes: processed.originalSizeBytes,
          savingsRatio: processed.savingsPercent,
          isBucketUrl: processed.isBucketUrl
        });
      }
      setFacilityPhotosList((prev) => [...prev, ...newItems]);
      if (newItems.length > 0) {
        setFormData((prev) => ({
          ...prev,
          proposedLocationPhotoName: newItems[0].name,
          proposedLocationPhotoDataUrl: newItems[0].dataUrl
        }));
      }
    } catch (err) {
      console.error('Failed to process and compress facility photo:', err);
    } finally {
      setIsUploadingFacility(false);
    }
  };

  const removeFacilityPhoto = (index: number) => {
    setFacilityPhotosList((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setFormData((f) => ({
        ...f,
        proposedLocationPhotoName: updated[0]?.name,
        proposedLocationPhotoDataUrl: updated[0]?.dataUrl
      }));
      return updated;
    });
  };

  // Utility bill upload handler
  const handleUtilityBillUpload = async (file: File | null) => {
    if (!file) return;
    setIsUploadingBill(true);
    try {
      const processed = await uploadImageWithCompression(file, {
        folder: 'leads/bills',
        maxDimension: 1200,
        quality: 0.78
      });
      const item: UploadedPhotoItem = {
        name: processed.name,
        dataUrl: processed.dataUrl,
        sizeBytes: processed.sizeBytes,
        originalSizeBytes: processed.originalSizeBytes,
        savingsRatio: processed.savingsPercent,
        isBucketUrl: processed.isBucketUrl
      };
      setUtilityBillPhoto(item);
      setFormData((prev) => ({
        ...prev,
        utilityBillPhotoName: processed.name,
        utilityBillPhotoDataUrl: processed.dataUrl
      }));
    } catch (err) {
      console.error('Failed to process and compress utility bill:', err);
    } finally {
      setIsUploadingBill(false);
    }
  };

  const removeUtilityBill = () => {
    setUtilityBillPhoto(null);
    setFormData((prev) => ({
      ...prev,
      utilityBillPhotoName: undefined,
      utilityBillPhotoDataUrl: undefined
    }));
  };

  return (
    <div
      id="hero-quote-container"
      className="relative w-full max-w-[530px] rounded-2xl sm:rounded-3xl bg-[#061D0F] text-white shadow-2xl border-2 border-[#88D628]/60 p-5 sm:p-6 flex flex-col justify-between text-left overflow-hidden"
    >
      {/* Confirmation / Success Screen (Step 5) */}
      {isSubmitted ? (
        <div className="h-full w-full flex flex-col items-center justify-between text-center py-4 sm:py-6 space-y-5 sm:space-y-6">
          {/* Top Section: Badge, Title & Personalized Intro */}
          <div className="space-y-3.5 flex flex-col items-center w-full">
            {/* Circular Badge with Checkmark */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#031308] border-2 border-[#88D628] flex items-center justify-center">
              <Check className="w-8 h-8 sm:w-9 sm:h-9 text-[#88D628] stroke-[3]" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Assessment Initiated!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Thank you, <strong className="text-[#88D628] font-bold">{formData.fullName || 'Valued Client'}</strong>. Your technical solar assessment dossier has been securely initialized.
              </p>
            </div>
          </div>

          {/* Technical Dossier Card */}
          <div className="w-full bg-[#031308] border border-white/15 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-left">
            {/* Stacked Project ID Track Header */}
            <div className="border-b border-white/10 pb-3 mb-3">
              <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest mb-1">
                PROJECT ID TRACK
              </div>
              <div className="text-lg sm:text-xl font-black text-white tracking-wider font-mono">
                {dossierId}
              </div>
            </div>

            {/* Scope Class & Ocular Schedule Rows */}
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-normal">Scope Class:</span>
                <span className="font-bold text-[#88D628]">
                  {formData.propertyType} Setup
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-normal">Ocular Date:</span>
                <span className="font-medium text-slate-200">
                  {formData.ocularDate || '2026-09-17'} ({formData.ocularTimeSlot})
                </span>
              </div>
            </div>
          </div>

          {/* Engineering Notice & Submit Another Request Link */}
          <div className="space-y-4 w-full max-w-md mx-auto">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our engineering team from <strong className="text-white font-bold">Solareign Solar Services</strong> will review your structural inputs and contact you at <span className="underline underline-offset-2 text-white font-medium">{formData.phone || formData.email || 'your registered contact'}</span> within 2 business hours.
            </p>

            <div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-block text-xs sm:text-sm font-black font-mono uppercase tracking-widest text-[#88D628] hover:text-[#7bc421] underline underline-offset-4 decoration-2 decoration-[#88D628]/60 hover:decoration-[#88D628] cursor-pointer transition-all py-1"
              >
                SUBMIT ANOTHER REQUEST
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Multi-Step Interactive Form */
        <div className="h-full flex flex-col justify-between">
          {/* Top Bar: Title + Step Counter */}
          <div>
            <div className="flex items-center justify-between gap-2 pb-1">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                SEND US A MESSAGE
              </h3>
              <div className="text-xs sm:text-sm font-black text-[#88D628] tracking-wider uppercase font-mono">
                STEP {currentStep} OF 4
              </div>
            </div>

            {/* 4-Segment Progress Bar */}
            <div className="grid grid-cols-4 gap-2 my-2">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= 1 ? 'bg-[#88D628]' : 'bg-white/15'
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-[#88D628]' : 'bg-white/15'
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= 3 ? 'bg-[#88D628]' : 'bg-white/15'
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= 4 ? 'bg-[#88D628]' : 'bg-white/15'
                }`}
              />
            </div>

            {/* Subheader Categorization */}
            <div className="flex items-center gap-3 my-2.5">
              <div className="h-[1px] bg-[#88D628]/35 flex-1" />
              <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-[#88D628] uppercase font-mono">
                {currentStep === 1 && 'IDENTITY & LOCATION'}
                {currentStep === 2 && 'ENERGY & ROOF SPECS'}
                {currentStep === 3 && 'INVERTER & PANEL SETUP'}
                {currentStep === 4 && 'OPTIMIZATION GOALS'}
              </span>
              <div className="h-[1px] bg-[#88D628]/35 flex-1" />
            </div>
          </div>

          {/* Form Step Body */}
          <div className="flex-1 flex flex-col justify-center py-1">
            {/* STEP 1: IDENTITY & LOCATION */}
            {currentStep === 1 && (
              <div className="space-y-3 sm:space-y-3.5">
                {/* 1. Property Type Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                    PROPERTY TYPE
                  </label>
                  <div className="relative">
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white outline-none transition-all cursor-pointer font-medium"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Full Name Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                    FULL NAME
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      ref={initialFocusRef}
                      id="quote-fullname-input"
                      type="text"
                      required
                      placeholder="e.g. Juan dela Cruz"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (step1Error) setStep1Error('');
                      }}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white placeholder:text-slate-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* 3. Email Address & Phone Number (Two Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="e.g. juan@domain.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (step1Error) setStep1Error('');
                        }}
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white placeholder:text-slate-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                      PHONE NUMBER
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        placeholder="e.g. 0917 123 4567"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (step1Error) setStep1Error('');
                        }}
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white placeholder:text-slate-500 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Installation Address Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                    INSTALLATION ADDRESS
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. 45 Solar Way, Quezon City, Metro Manila"
                      value={formData.installationAddress}
                      onChange={(e) => setFormData({ ...formData, installationAddress: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white placeholder:text-slate-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {step1Error && (
                  <p className="text-[11px] text-red-400 font-medium">{step1Error}</p>
                )}
              </div>
            )}

            {/* STEP 2: ENERGY & ROOF SPECS */}
            {currentStep === 2 && (
              <div className="space-y-3 sm:space-y-3.5">
                {/* 1. Utility Provider */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                    UTILITY PROVIDER
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Meralco, VECO, DLPC"
                      value={formData.utilityProvider}
                      onChange={(e) => setFormData({ ...formData, utilityProvider: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white placeholder:text-slate-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* 2. Monthly Electricity Bill Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                    MONTHLY ELECTRICITY BILL
                  </label>
                  <div className="relative">
                    <select
                      value={formData.monthlyBill}
                      onChange={(e) => setFormData({ ...formData, monthlyBill: e.target.value })}
                      className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white outline-none transition-all cursor-pointer font-medium"
                    >
                      <option value="1,000 - 4,000 PHP">1,000 - 4,000 PHP</option>
                      <option value="5,000 - 8,000 PHP">5,000 - 8,000 PHP</option>
                      <option value="9,000 - 12,000 PHP">9,000 - 12,000 PHP</option>
                      <option value="13,000 - 16,000 PHP">13,000 - 16,000 PHP</option>
                      <option value="17,000 - 25,000 PHP">17,000 - 25,000 PHP</option>
                      <option value="26,000 - 40,000 PHP">26,000 - 40,000 PHP</option>
                      <option value="41,000 PHP - Up">41,000 PHP - Up</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Roof Type Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                    ROOF TYPE
                  </label>
                  <div className="relative">
                    <select
                      value={formData.roofType}
                      onChange={(e) => setFormData({ ...formData, roofType: e.target.value })}
                      className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white outline-none transition-all cursor-pointer font-medium"
                    >
                      <option value="Rib-type / Corrugated GI Sheet">Rib-type / Corrugated GI Sheet</option>
                      <option value="Concrete Slab (Flat Roof)">Concrete Slab (Flat Roof)</option>
                      <option value="Tile Roof (Tisa)">Tile Roof (Tisa)</option>
                      <option value="Others / Not Sure">Others / Not Sure</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 4. Daytime Shading Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                    DAYTIME SHADING
                  </label>
                  <div className="relative">
                    <select
                      value={formData.daytimeShading}
                      onChange={(e) => setFormData({ ...formData, daytimeShading: e.target.value })}
                      className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white outline-none transition-all cursor-pointer font-medium"
                    >
                      <option value="No, clear sunlight all day">No, clear sunlight all day</option>
                      <option value="Yes, from nearby trees/buildings">Yes, from nearby trees/buildings</option>
                      <option value="Not Sure">Not Sure</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: INVERTER & PANEL SETUP */}
            {currentStep === 3 && (
              <div className="space-y-3 sm:space-y-3.5">
                {/* 1. Designated Inverter Location */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                    DESIGNATED INVERTER LOCATION
                  </label>
                  <div className="relative">
                    <select
                      value={formData.inverterLocation}
                      onChange={(e) => setFormData({ ...formData, inverterLocation: e.target.value })}
                      className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white outline-none transition-all cursor-pointer font-medium"
                    >
                      <option value="Yes, I have an inverter location selected">
                        Yes, I have an inverter location selected
                      </option>
                      <option value="No designated location yet (site survey needed)">
                        No designated location yet (site survey needed)
                      </option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Suggested Photos Info Box */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#031c0b] border border-[#88D628]/35 text-xs text-slate-200">
                  <p className="font-bold text-[#88D628] text-xs mb-1">Suggested Photos (Optional):</p>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                    Since no safe inverter location is pre-designated, our engineering team suggests uploading 2 photos to verify your layout, though this is completely optional.
                  </p>
                </div>

                {/* 3. Photo 1 & Photo 2 Dropzones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Photo 1: Identified Inverter & Solar Photos */}
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5 leading-tight">
                      PHOTO 1: INVERTER &amp; SOLAR PHOTOS<br />
                      <span className="text-[10px] font-medium text-[#A7C8A0]/80">(OPTIONAL - MAIN PANEL / INVERTER)</span>
                    </label>

                    {inverterPhotosList.length > 0 ? (
                      <div className="bg-[#031308] border border-[#88D628]/60 rounded-xl p-2.5 space-y-2">
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {inverterPhotosList.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-[#06200e] border border-[#88D628]/30 rounded-lg p-1.5 text-xs"
                            >
                              <img
                                src={item.dataUrl}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 object-cover rounded-md border border-[#88D628]/40 shrink-0 bg-black/40"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-[11px] font-medium truncate">{item.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  <span className="text-[10px] text-[#88D628] font-mono">
                                    {item.sizeBytes ? formatBytes(item.sizeBytes) : 'Attached'}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeInverterPhoto(idx)}
                                className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                                title="Remove photo"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <label className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#082a13] hover:bg-[#0c391b] border border-dashed border-[#88D628]/50 rounded-lg text-[11px] font-bold text-[#88D628] cursor-pointer transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add another inverter photo</span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            multiple
                            className="hidden"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              if (e.target.files && e.target.files.length > 0) {
                                handleInverterPhotosUpload(e.target.files);
                              }
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                        onDrop={(e: DragEvent<HTMLDivElement>) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            handleInverterPhotosUpload(e.dataTransfer.files);
                          }
                        }}
                        className="border border-dashed border-[#88D628]/60 hover:border-[#88D628] bg-[#031308] rounded-xl p-3 sm:p-3.5 text-center transition-colors relative min-h-[96px] flex flex-col items-center justify-center cursor-pointer"
                      >
                        {isUploadingInverter ? (
                          <div className="flex flex-col items-center py-2 text-[#88D628]">
                            <Loader2 className="w-5 h-5 animate-spin mb-1.5" />
                            <span className="text-[11px] font-medium">Processing photo...</span>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center w-full py-1">
                            <Upload className="w-5 h-5 text-[#88D628] mb-1.5" />
                            <span className="text-[11px] text-slate-200 text-center leading-snug">
                              Drag &amp; drop or <span className="text-[#88D628] font-bold underline">browse photos</span>
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-1">
                              PNG, JPG, JPEG OR WEBP
                            </span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              multiple
                              className="hidden"
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  handleInverterPhotosUpload(e.target.files);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Photo 2: Proposed Facility Photos */}
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5 leading-tight">
                      PHOTO 2: PROPOSED FACILITY PHOTOS<br />
                      <span className="text-[10px] font-medium text-[#A7C8A0]/80">(OPTIONAL - ROOF / LOCATION)</span>
                    </label>

                    {facilityPhotosList.length > 0 ? (
                      <div className="bg-[#031308] border border-[#88D628]/60 rounded-xl p-2.5 space-y-2">
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {facilityPhotosList.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-[#06200e] border border-[#88D628]/30 rounded-lg p-1.5 text-xs"
                            >
                              <img
                                src={item.dataUrl}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 object-cover rounded-md border border-[#88D628]/40 shrink-0 bg-black/40"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-[11px] font-medium truncate">{item.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  <span className="text-[10px] text-[#88D628] font-mono">
                                    {item.sizeBytes ? formatBytes(item.sizeBytes) : 'Attached'}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFacilityPhoto(idx)}
                                className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                                title="Remove photo"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <label className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#082a13] hover:bg-[#0c391b] border border-dashed border-[#88D628]/50 rounded-lg text-[11px] font-bold text-[#88D628] cursor-pointer transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add another facility photo</span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            multiple
                            className="hidden"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              if (e.target.files && e.target.files.length > 0) {
                                handleFacilityPhotosUpload(e.target.files);
                              }
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                        onDrop={(e: DragEvent<HTMLDivElement>) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            handleFacilityPhotosUpload(e.dataTransfer.files);
                          }
                        }}
                        className="border border-dashed border-[#88D628]/60 hover:border-[#88D628] bg-[#031308] rounded-xl p-3 sm:p-3.5 text-center transition-colors relative min-h-[96px] flex flex-col items-center justify-center cursor-pointer"
                      >
                        {isUploadingFacility ? (
                          <div className="flex flex-col items-center py-2 text-[#88D628]">
                            <Loader2 className="w-5 h-5 animate-spin mb-1.5" />
                            <span className="text-[11px] font-medium">Processing photo...</span>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center w-full py-1">
                            <Upload className="w-5 h-5 text-[#88D628] mb-1.5" />
                            <span className="text-[11px] text-slate-200 text-center leading-snug">
                              Drag &amp; drop or <span className="text-[#88D628] font-bold underline">browse photos</span>
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-1">
                              PNG, JPG, JPEG OR WEBP
                            </span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              multiple
                              className="hidden"
                              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  handleFacilityPhotosUpload(e.target.files);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: OPTIMIZATION GOALS */}
            {currentStep === 4 && (
              <div className="space-y-3 sm:space-y-3.5">
                {/* 1. Primary Goal Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                    PRIMARY GOAL
                  </label>
                  <div className="relative">
                    <select
                      value={formData.primaryGoal}
                      onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                      className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white outline-none transition-all cursor-pointer font-medium"
                    >
                      <option value="Lowering daytime electric bill (Grid-Tied)">
                        Lowering daytime electric bill (Grid-Tied)
                      </option>
                      <option value="Backup power (Hybrid / Battery)">
                        Backup power (Hybrid / Battery)
                      </option>
                      <option value="Going completely off-grid">
                        Going completely off-grid
                      </option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Timeline Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                    TIMELINE
                  </label>
                  <div className="relative">
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full appearance-none pl-3.5 pr-10 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white outline-none transition-all cursor-pointer font-medium"
                    >
                      <option value="Immediately (2-3 weeks)">Immediately (2-3 weeks)</option>
                      <option value="In 1 to 3 months">In 1 to 3 months</option>
                      <option value="Just researching">Just researching</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Preferred Ocular Visit Date & Preferred Visit Time Slot (Two Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                      PREFERRED OCULAR VISIT DATE
                    </label>
                    <input
                      id="quote-ocular-date-picker"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.ocularDate}
                      onChange={(e) => setFormData({ ...formData, ocularDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white outline-none transition-all cursor-pointer font-medium [color-scheme:dark]"
                      aria-label="Select preferred ocular visit date"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1.5">
                      PREFERRED VISIT TIME SLOT
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={formData.ocularTimeSlot}
                        onChange={(e) => setFormData({ ...formData, ocularTimeSlot: e.target.value })}
                        className="w-full appearance-none pl-10 pr-10 py-2.5 rounded-lg bg-[#031308] border border-white/20 focus:border-[#88D628] focus:ring-1 focus:ring-[#88D628] text-sm text-white outline-none transition-all cursor-pointer font-medium"
                      >
                        <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                        <option value="1:00 PM - 4:00 PM">1:00 PM - 4:00 PM</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 4. Upload Latest Bill (Optional) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#A7C8A0] mb-1">
                    UPLOAD LATEST BILL (OPTIONAL)
                  </label>
                  <p className="italic text-[11px] text-slate-400 mb-2 leading-relaxed">
                    Attaching your utility billing history allows engineers to compile simulation projections with 98% accuracy.
                  </p>

                  <div
                    onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
                    onDrop={(e: DragEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      if (e.dataTransfer.files?.[0]) {
                        handleUtilityBillUpload(e.dataTransfer.files[0]);
                      }
                    }}
                    className="border border-dashed border-[#88D628]/60 hover:border-[#88D628] bg-[#031308] rounded-xl p-3 sm:p-3.5 text-center transition-colors relative min-h-[96px] flex flex-col items-center justify-center cursor-pointer"
                  >
                    {isUploadingBill ? (
                      <div className="flex flex-col items-center py-2 text-[#88D628]">
                        <Loader2 className="w-5 h-5 animate-spin mb-1.5" />
                        <span className="text-[11px] font-medium">Processing bill attachment...</span>
                      </div>
                    ) : utilityBillPhoto ? (
                      <div className="flex items-center justify-between w-full bg-[#06200e] border border-[#88D628]/30 rounded-lg p-2 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {utilityBillPhoto.dataUrl?.startsWith('data:image/') ? (
                            <img
                              src={utilityBillPhoto.dataUrl}
                              alt="Utility Bill"
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded-md border border-[#88D628]/40 shrink-0 bg-black/40"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-[#082a13] border border-[#88D628]/40 flex items-center justify-center shrink-0 text-[#88D628]">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                          <div className="text-left min-w-0">
                            <p className="text-white text-xs font-semibold truncate max-w-[200px] sm:max-w-[240px]">
                              {utilityBillPhoto.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <span className="text-[10px] text-[#88D628] font-mono">
                                {utilityBillPhoto.sizeBytes ? formatBytes(utilityBillPhoto.sizeBytes) : 'Attached'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeUtilityBill();
                          }}
                          className="text-slate-400 hover:text-red-400 p-1.5 rounded transition-colors ml-2 shrink-0"
                          title="Remove attached bill"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center w-full py-1">
                        <Upload className="w-5 h-5 text-[#88D628] mb-1.5" />
                        <span className="text-[11px] text-slate-200 text-center leading-snug">
                          Drag and drop statement or <span className="text-[#88D628] font-bold underline">browse files</span>
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-1">
                          PNG, JPG, JPEG, WEBP OR PDF
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,application/pdf"
                          className="hidden"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.files?.[0]) {
                              handleUtilityBillUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls (Bottom Bar) */}
          <div className={`flex items-center gap-3 ${currentStep > 1 ? 'pt-2.5 border-t border-white/10' : 'pt-2 sm:pt-3'}`}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
                className="flex-[0.38] min-w-[105px] flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#031308] hover:bg-white/10 active:bg-white/15 text-white border border-white/20 font-bold text-sm transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1) handleStep1Continue();
                  else if (currentStep === 2) handleStep2Continue();
                  else if (currentStep === 3) handleStep3Continue();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#88D628] hover:bg-[#7bc421] active:bg-[#6eb21c] text-[#0F5A29] font-black text-sm tracking-wide transition-colors duration-150 cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#88D628] hover:bg-[#7bc421] active:bg-[#6eb21c] text-[#0F5A29] font-black text-sm tracking-wide transition-colors duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#0F5A29] border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Application...</span>
                  </span>
                ) : (
                  <span>SUBMIT APPLICATION</span>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
