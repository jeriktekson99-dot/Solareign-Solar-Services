export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Hybrid';
  location: string;
  systemSize: string;
  image: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  roleLocation: string;
  quote: string;
  rating: number;
  highlight: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface UploadedPhotoItem {
  name: string;
  dataUrl: string;
  sizeBytes?: number;
  originalSizeBytes?: number;
  savingsRatio?: number;
  isBucketUrl?: boolean;
}

export interface MultiStepQuoteFormData {
  // Step 1: Identity & Location
  propertyType: string;
  fullName: string;
  email: string;
  phone: string;
  installationAddress: string;

  // Step 2: Energy & Roof Specs
  utilityProvider: string;
  monthlyBill: string;
  roofType: string;
  daytimeShading: string;

  // Step 3: Inverter & Panel Setup
  inverterLocation: string;
  panelBoardPhotoName?: string;
  panelBoardPhotoDataUrl?: string;
  proposedLocationPhotoName?: string;
  proposedLocationPhotoDataUrl?: string;
  inverterPhotosList?: UploadedPhotoItem[];
  facilityPhotosList?: UploadedPhotoItem[];

  // Step 4: Optimization Goals
  primaryGoal: string;
  timeline: string;
  ocularDate: string;
  ocularTimeSlot: string;
  utilityBillPhotoName?: string;
  utilityBillPhotoDataUrl?: string;
}
