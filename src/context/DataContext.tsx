import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode
} from 'react';
import {
  PORTFOLIO_PROJECTS,
  ProjectItem,
  ProjectDetail,
  PROJECTS_DATA_MAP
} from '../data/projectsData';
import { SocialLinksConfig, OperationalSettingsConfig } from '../components/SystemSettingsPage';
import {
  saveSystemConfigSupabase,
  syncLeadToSupabase,
  syncProjectToSupabase,
  syncArchiveRecordToSupabase,
  syncAppointmentToSupabase,
  fetchPortfolioProjectsSupabase,
  PortfolioProjectRow,
  getSupabase,
  isSupabaseConfigured
} from '../lib/supabase';

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

export interface ArchivedRecord {
  id: string;
  archiveCode?: string;
  type: 'Lead Inquiry' | 'Portfolio Project' | 'Portfolio Draft' | string;
  originalStream: 'Inbound Leads' | 'Portfolio Projects' | string;
  title: string;
  subtitle?: string;
  archivedDate: string;
  deletedDateTime?: string;
  reason?: string;

  // Supabase Datatable Schema Fields (Archive/Trash)
  archivedItemId?: string;
  originalStreamSource?: string;
  entityLabelName?: string;
}

export interface SystemAlertItem {
  id: string;
  title: string;
  message: string;
  timestamp?: string;
}

const STORAGE_KEYS = {
  PROJECTS: 'solareign_projects_v2',
  LEADS: 'solareign_leads_v2',
  OCULAR_TRIPS: 'solareign_ocular_trips_v2',
  ARCHIVED_RECORDS: 'solareign_archived_records_v2',
  SETTINGS: 'solareign_settings_v2',
  SOCIAL_LINKS: 'solareign_social_links_v2',
  ALERTS: 'solareign_alerts_v2',
  UNREAD_COUNT: 'solareign_unread_count_v2',
  ADMIN_PASSWORD: 'solareign_admin_password_v2',
  ADMIN_AUTH_SESSION: 'solareign_admin_authenticated_v2'
};

export const SYNC_EVENT_NAME = 'solareign_bidirectional_sync';

// Initial default state seeds
const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    token: 'LEAD-206-764',
    name: 'Ferdinand NIDOY',
    propertyType: 'RESIDENTIAL',
    propertyCategory: 'Residential',
    address: 'Lot 4 I Francisco compd 1 vfl subd San Rafael 3 noveleta cavite',
    subRegion: 'Lot 4 I Francisco compd 1 vfl subd San Rafael 3 noveleta cavite',
    billRange: '9,000 - 12,000 PHP',
    phone: '09178434018',
    email: 'captnidoy@yahoo.com',
    systemRequested: '8kW Hybrid Solar with 10kWh Battery',
    requestedConfig: 'Backup power (Hybrid / Battery)',
    status: 'New',
    date: 'July 28, 2026',
    week: 'Week 4',
    receivedDateTime: '7/25/2026 AT 09:51 AM',
    utilityPartner: 'meralco',
    structuralRoofType: 'Rib-type / Corrugated GI Sheet',
    daytimeShading: 'No, clear sunlight all day',
    solarProjectGoal: 'Backup power (Hybrid / Battery)',
    commissionTimeline: 'Immediately (2-3 weeks)',
    designatedSafeLocation: 'No designated location yet (site survey needed)',
    fieldInspectionDate: {
      day: '26',
      month: 'JUL',
      fullDateString: 'Sunday, July 26, 2026',
      slot: '9:00 AM - 12:00 PM'
    },
    attachedDocument: {
      name: 'Meralco_Billing_Statement_Jul2026.jpg',
      typeLabel: 'MERALCO BILLING STATEMENT',
      url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'
    },
    inverterPhotos: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    ],
    facilityPhotos: [
      'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'lead-2',
    token: 'LEAD-318-904',
    name: 'Carlos Mendoza',
    propertyType: 'RESIDENTIAL',
    propertyCategory: 'Residential',
    address: 'Phase 2 Blk 14, Bayan Luma 2, Imus, Cavite',
    subRegion: 'Phase 2 Blk 14, Bayan Luma 2, Imus, Cavite',
    billRange: '17,000 - 25,000 PHP',
    phone: '09175824419',
    email: 'c.mendoza@gmail.com',
    systemRequested: '10kW Hybrid 3-Storey Townhouse',
    requestedConfig: 'Backup power (Hybrid / Battery)',
    status: 'Contacted',
    date: 'July 21, 2026',
    week: 'Week 3',
    receivedDateTime: '7/21/2026 AT 02:15 PM',
    utilityPartner: 'meralco',
    structuralRoofType: 'Concrete Slab (Flat Roof)',
    daytimeShading: 'Yes, from nearby trees/buildings',
    solarProjectGoal: 'Backup power (Hybrid / Battery)',
    commissionTimeline: 'In 1 to 3 months',
    designatedSafeLocation: 'Yes, I have an inverter location selected',
    fieldInspectionDate: {
      day: '28',
      month: 'JUL',
      fullDateString: 'Tuesday, July 28, 2026',
      slot: '1:00 PM - 4:00 PM'
    },
    attachedDocument: {
      name: 'Electric_Utility_Record_Cavite.jpg',
      typeLabel: 'MERALCO BILLING STATEMENT',
      url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'
    },
    inverterPhotos: [
      'https://images.unsplash.com/photo-1559302504-64aae7ca6b6d?auto=format&fit=crop&w=800&q=80'
    ],
    facilityPhotos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'lead-3',
    token: 'LEAD-482-119',
    name: 'Maria Elena Santos',
    propertyType: 'RESIDENTIAL',
    propertyCategory: 'Residential',
    address: 'Meadowood Executive Village, Bacoor City, Cavite',
    subRegion: 'Meadowood Executive Village, Bacoor City, Cavite',
    billRange: '9,000 - 12,000 PHP',
    phone: '09283198812',
    email: 'maria.santos@yahoo.com',
    systemRequested: '5kW Grid-Tied Rooftop System',
    requestedConfig: 'Lowering daytime electric bill (Grid-Tied)',
    status: 'In Progress',
    date: 'July 14, 2026',
    week: 'Week 2',
    receivedDateTime: '7/14/2026 AT 11:30 AM',
    utilityPartner: 'meralco',
    structuralRoofType: 'Tile Roof (Tisa)',
    daytimeShading: 'No, clear sunlight all day',
    solarProjectGoal: 'Lowering daytime electric bill (Grid-Tied)',
    commissionTimeline: 'In 1 to 3 months',
    designatedSafeLocation: 'Yes, I have an inverter location selected',
    fieldInspectionDate: {
      day: '18',
      month: 'JUL',
      fullDateString: 'Saturday, July 18, 2026',
      slot: '9:00 AM - 12:00 PM'
    },
    attachedDocument: {
      name: 'Electric_Consumption_Record_Bacoor.jpg',
      typeLabel: 'MERALCO BILLING STATEMENT',
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
    },
    facilityPhotos: []
  },
  {
    id: 'lead-4',
    token: 'LEAD-734-290',
    name: 'Engr. Roberto Cruz (Cruz Cold Storage)',
    propertyType: 'COMMERCIAL',
    address: "Governor's Drive, Manggahan, General Trias, Cavite",
    subRegion: "Governor's Drive, Manggahan, General Trias, Cavite",
    billRange: '41,000 PHP - Up',
    phone: '09189023341',
    email: 'cruz.coldstorage@cruzlogistics.ph',
    systemRequested: '30kW Commercial Cold Storage Microgrid',
    requestedConfig: 'Lowering daytime electric bill (Grid-Tied)',
    status: 'In Progress',
    date: 'July 05, 2026',
    week: 'Week 1'
  },
  {
    id: 'lead-5',
    token: 'LEAD-519-338',
    name: 'Dra. Angela Villanueva',
    propertyType: 'COMMERCIAL',
    address: 'Aguinaldo Highway, Salitran 3, Dasmariñas City, Cavite',
    subRegion: 'Aguinaldo Highway, Salitran 3, Dasmariñas City, Cavite',
    billRange: '17,000 - 25,000 PHP',
    phone: '09176329014',
    email: 'a.villanueva.md@clinica.ph',
    systemRequested: '12kW Hybrid Solar - Clinic & Residence',
    requestedConfig: 'Backup power (Hybrid / Battery)',
    status: 'Contacted',
    date: 'July 02, 2026',
    week: 'Week 1'
  },
  {
    id: 'lead-6',
    token: 'LEAD-641-802',
    name: 'Don Bosco Agrivet Farms',
    propertyType: 'INDUSTRIAL',
    address: 'Brgy. Tartaria, Silang-Tagaytay Corridor, Cavite',
    subRegion: 'Brgy. Tartaria, Silang-Tagaytay Corridor, Cavite',
    billRange: '41,000 PHP - Up',
    phone: '09204481923',
    email: 'logistics@donbosco-farms.com',
    systemRequested: '50kW Ground Mount Solar System',
    requestedConfig: 'Going completely off-grid',
    status: 'New',
    date: 'June 29, 2026',
    week: 'Week 4'
  }
];

const INITIAL_OCULAR_TRIPS: OcularTrip[] = [
  {
    id: 'oc-1',
    dateMonth: 'SEP',
    dateDay: '4',
    clientName: 'Ferdinand NIDOY',
    locationDetails: 'Noveleta, Cavite • Residential Hybrid Rooftop Audit',
    timeString: '9:00 AM - 12:00 PM',
    engineer: 'Engr. J. De Leon'
  },
  {
    id: 'oc-2',
    dateMonth: 'SEP',
    dateDay: '17',
    clientName: 'Carlos Mendoza',
    locationDetails: 'Imus, Cavite • Structural Truss & Inverter Load Survey',
    timeString: '9:00 AM - 12:00 PM',
    engineer: 'Engr. M. Bautista'
  },
  {
    id: 'oc-3',
    dateMonth: 'SEP',
    dateDay: '22',
    clientName: 'Maria Elena Santos',
    locationDetails: 'Bacoor City, Cavite • Meralco Net Metering Inspection',
    timeString: '1:00 PM - 4:00 PM',
    engineer: 'Engr. J. De Leon'
  }
];

const INITIAL_ARCHIVED_RECORDS: ArchivedRecord[] = [
  {
    id: 'arc-1',
    archiveCode: 'ARC-206-819',
    type: 'Lead Inquiry',
    originalStream: 'Inbound Leads',
    title: 'Danilo Ramos - Kawit, Cavite',
    subtitle: '8kW Hybrid Solar with 10kWh Battery',
    archivedDate: '2026-07-25',
    deletedDateTime: 'July 25, 2026 14:22 PM',
    reason: ''
  },
  {
    id: 'arc-2',
    archiveCode: 'ARC-206-812',
    type: 'Portfolio Project',
    originalStream: 'Portfolio Projects',
    title: 'Silang Eco Farm Agrivoltaic System (8 kWp)',
    subtitle: 'Agricultural Off-Grid Solar Installation',
    archivedDate: '2026-07-22',
    deletedDateTime: 'July 22, 2026 09:15 AM',
    reason: ''
  },
  {
    id: 'arc-3',
    archiveCode: 'ARC-206-798',
    type: 'Lead Inquiry',
    originalStream: 'Inbound Leads',
    title: 'Grace Tan - Molino 3, Bacoor',
    subtitle: '5kW Grid-Tied Rooftop System',
    archivedDate: '2026-07-18',
    deletedDateTime: 'July 18, 2026 16:45 PM',
    reason: ''
  },
  {
    id: 'arc-4',
    archiveCode: 'ARC-206-775',
    type: 'Portfolio Project',
    originalStream: 'Portfolio Projects',
    title: 'Tagaytay Highlands Villa Solar Array (12 kWp)',
    subtitle: 'Residential Hybrid Energy Storage System',
    archivedDate: '2026-07-15',
    deletedDateTime: 'July 15, 2026 11:10 AM',
    reason: ''
  },
  {
    id: 'arc-5',
    archiveCode: 'ARC-206-742',
    type: 'Portfolio Project',
    originalStream: 'Portfolio Projects',
    title: 'Dasmariñas Logistics Warehouse Microgrid (25 kWp)',
    subtitle: 'Commercial Three-Phase Grid-Tied Array',
    archivedDate: '2026-07-10',
    deletedDateTime: 'July 10, 2026 13:05 PM',
    reason: ''
  },
  {
    id: 'arc-6',
    archiveCode: 'ARC-206-711',
    type: 'Lead Inquiry',
    originalStream: 'Inbound Leads',
    title: 'Vicente Alcantara - Imus, Cavite',
    subtitle: '10kW Hybrid Solar with 15kWh Battery',
    archivedDate: '2026-07-04',
    deletedDateTime: 'July 04, 2026 10:20 AM',
    reason: ''
  },
  {
    id: 'arc-7',
    archiveCode: 'ARC-206-703',
    type: 'Lead Inquiry',
    originalStream: 'Inbound Leads',
    title: 'Alfonso Vacation Villa - Alfonso, Cavite',
    subtitle: '8kW Hybrid Solar with Backup Battery',
    archivedDate: '2026-07-01',
    deletedDateTime: 'July 01, 2026 08:30 AM',
    reason: ''
  }
];

const INITIAL_SOCIAL_LINKS: SocialLinksConfig = {
  facebookUrl: 'https://web.facebook.com/profile.php?id=61566141530365',
  instagramUrl: 'https://web.facebook.com',
  tiktokUrl: 'https://tiktok.com/@powershift',
  websiteUrl: 'https://solareign.ph',
  webhookUrl: 'https://api.solareign.ph/webhooks/v1/inbound-leads',
  customUrls: []
};

const INITIAL_SETTINGS: OperationalSettingsConfig = {
  branchName: 'Solareign Solar Power Services - Cavite Operations',
  contactEmail: 'engineering@solareign.ph',
  hotline: '+63 917 843 4018',
  meralcoRate: '12.50',
  netMeteringExportRate: '5.20',
  defaultInverterBrand: 'Deye Hybrid / Growatt SPF Series',
  defaultBatteryWarrantyYears: '10',
  notifyOnNewInquiry: true,
  autoAssignEngineer: true,
  webhookEndpointUrl: 'https://api.solareign.ph/webhooks/v1/inbound-leads',
  webhookSecretKey: 'whsec_slr_live_8849206b9941a'
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function sanitizePayloadForQuota<T>(value: T): T {
  if (!value) return value;
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (item && typeof item === 'object') {
        const copy = { ...item } as Record<string, unknown>;
        // If image is a massive data URL (> 80KB), substitute with high-reliability CDN fallback
        if (typeof copy.image === 'string' && copy.image.startsWith('data:') && copy.image.length > 80000) {
          copy.image = 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1000&q=80';
        }
        if (Array.isArray(copy.galleryImages)) {
          copy.galleryImages = copy.galleryImages.map((gImg) => {
            if (typeof gImg === 'string' && gImg.startsWith('data:') && gImg.length > 80000) {
              return 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1000&q=80';
            }
            return gImg;
          });
        }
        if (Array.isArray(copy.facilityPhotos)) {
          copy.facilityPhotos = copy.facilityPhotos.filter((p) => typeof p !== 'string' || !p.startsWith('data:') || p.length <= 300000);
        }
        if (Array.isArray(copy.inverterPhotos)) {
          copy.inverterPhotos = copy.inverterPhotos.filter((p) => typeof p !== 'string' || !p.startsWith('data:') || p.length <= 300000);
        }
        return copy;
      }
      return item;
    }) as unknown as T;
  }
  return value;
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err: unknown) {
    const error = err as { name?: string; code?: number; message?: string };
    const isQuotaError =
      error?.name === 'QuotaExceededError' ||
      error?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error?.code === 22 ||
      error?.code === 1014 ||
      (typeof error?.message === 'string' && error.message.toLowerCase().includes('quota'));

    if (isQuotaError) {
      console.warn(`Storage quota exceeded for "${key}". Sanitizing high-resolution media payloads to fit storage limits...`);
      try {
        const sanitized = sanitizePayloadForQuota(value);
        localStorage.setItem(key, JSON.stringify(sanitized));
        console.info(`Successfully preserved "${key}" within storage limits.`);
        return;
      } catch (recoveryErr) {
        console.warn(`Storage quota exhausted on browser. State remains fully active in memory for this session.`);
      }
    } else {
      console.error(`Error writing ${key} to storage:`, err);
    }
  }
}

function dispatchSyncEvent(action: string, payload?: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(
      new CustomEvent(SYNC_EVENT_NAME, { detail: { action, payload, timestamp: Date.now() } })
    );
  } catch (err) {
    console.error('Error dispatching sync event:', err);
  }
}

export function convertSupabaseProjectToProjectItem(row: PortfolioProjectRow | Record<string, any>): ProjectItem {
  const r = row as any;
  const code = (r.project_id || r.projectCode || r.id || `PROJ-${Date.now()}`).toString().trim();
  const id = code;
  const title = (r.project_display_name || r.title || r.name || 'Solar Installation Project').toString().trim();

  const rawSegment = (r.asset_segment || r.segment || r.property_type || 'Residential').toString().trim();
  let segment: 'Residential' | 'Commercial' | 'Industrial' = 'Residential';
  if (/commercial/i.test(rawSegment)) segment = 'Commercial';
  else if (/industrial/i.test(rawSegment)) segment = 'Industrial';

  let category: 'Residential Hybrid' | 'Commercial Microgrids' | 'Industrial Arrays' = 'Residential Hybrid';
  if (segment === 'Commercial') category = 'Commercial Microgrids';
  else if (segment === 'Industrial') category = 'Industrial Arrays';
  else if (r.category) category = r.category;

  const location = (r.geographical_location || r.location || r.philippine_sub_region || 'Cavite, Philippines').toString().trim();
  const capacity = (r.system_capacity || r.capacity || '10 kWp').toString().trim();
  const image = r.image_url || r.image || 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80';

  let galleryImages: string[] = [];
  if (Array.isArray(r.gallery_images) && r.gallery_images.length > 0) {
    galleryImages = r.gallery_images;
  } else if (Array.isArray(r.galleryImages) && r.galleryImages.length > 0) {
    galleryImages = r.galleryImages;
  } else if (typeof r.gallery_images === 'string') {
    try {
      const parsed = JSON.parse(r.gallery_images);
      if (Array.isArray(parsed)) galleryImages = parsed;
    } catch {}
  }
  if (galleryImages.length === 0 && image) {
    galleryImages = [image];
  }

  let highlights: string[] = [];
  if (Array.isArray(r.project_highlights) && r.project_highlights.length > 0) {
    highlights = r.project_highlights;
  } else if (Array.isArray(r.highlights) && r.highlights.length > 0) {
    highlights = r.highlights;
  } else if (typeof r.project_highlights === 'string') {
    try {
      const parsed = JSON.parse(r.project_highlights);
      if (Array.isArray(parsed)) highlights = parsed;
    } catch {}
  }
  if (highlights.length === 0) {
    highlights = [
      'Tier-1 Monocrystalline Photovoltaic Array',
      'Net-Metering Interconnection Ready',
      'Remote Smart Hybrid Inverter Telemetry'
    ];
  }

  const publishedDate = r.published_date || r.publishedDate || (r.created_at ? r.created_at.split('T')[0] : '2026-09-17');
  const duration = (r.installation_duration || r.duration || '2-3 Weeks').toString().trim();
  const inverterBrand = (r.inverter_brand || r.inverterBrand || 'Hybrid Smart Inverter').toString().trim();
  const panelWattage = (r.panel_wattage || r.panelWattage || 'Tier-1 Mono PERC Panels').toString().trim();
  const annualGeneration = (r.annual_generation || r.annualGeneration || '~15,000 kWh / Year').toString().trim();
  const summary = (r.project_summary || r.summary || r.details || `Solar installation engineered for ${location}.`).toString().trim();
  const status: 'Ongoing' | 'Completed' = (r.status && /ongoing/i.test(r.status)) ? 'Ongoing' : 'Completed';
  const year = r.year || (publishedDate ? new Date(publishedDate).getFullYear().toString() : '2026');

  return {
    id,
    projectCode: code,
    title,
    subtitle: r.subtitle || r.client_full_name || '',
    category,
    segment,
    location,
    details: summary,
    image,
    galleryImages,
    capacity,
    year,
    duration,
    inverterBrand,
    panelWattage,
    annualGeneration,
    summary,
    highlights,
    status,
    publishedDate,
    clientName: r.client_full_name || r.clientName,
    roiYieldTargets: r.roi_yield_targets || r.roiYieldTargets,
    scopeDetails: r.scope_details || r.scopeDetails || r.requested_configuration || '',
    leadToken: r.lead_token || r.leadToken,
    clientFullName: r.client_full_name || r.clientFullName,
    propertyType: r.property_type || r.propertyType,
    primaryContactEndpoint: r.primary_contact_endpoint || r.primaryContactEndpoint,
    requestedConfiguration: r.requested_configuration || r.requestedConfiguration,
    monthlyUsage: r.monthly_usage || r.monthlyUsage,
    philippineSubRegion: r.philippine_sub_region || r.philippineSubRegion,
    projectId: code,
    projectDisplayName: title,
    assetSegment: segment,
    geographicalLocation: location
  };
}

function mergeProjectsWithSupabase(localList: ProjectItem[], sbRows: PortfolioProjectRow[]): ProjectItem[] {
  if (!sbRows || sbRows.length === 0) return localList;

  const sbProjects = sbRows.map(convertSupabaseProjectToProjectItem);
  const sbIds = new Set(sbProjects.map((p) => p.id));
  const sbCodes = new Set(sbProjects.map((p) => p.projectCode || p.id));

  // Keep local items that are not overridden by Supabase
  const remainingLocal = localList.filter((p) => !sbIds.has(p.id) && !sbCodes.has(p.projectCode || p.id));

  // Supabase items take priority at the top, followed by remaining local items
  return [...sbProjects, ...remainingLocal];
}

interface AddLeadOptions {
  scheduleOcular?: boolean;
  ocularDate?: string;
  ocularSlot?: string;
}

export interface DataContextType {
  // Live State
  projects: ProjectItem[];
  leads: LeadItem[];
  ocularTrips: OcularTrip[];
  archivedRecords: ArchivedRecord[];
  settings: OperationalSettingsConfig;
  socialLinks: SocialLinksConfig;
  systemAlerts: SystemAlertItem[];
  unreadCount: number;

  // Actions: Leads
  addLead: (leadData: Partial<LeadItem>, options?: AddLeadOptions) => LeadItem;
  updateLeadStatus: (leadId: string, newStatus: LeadItem['status']) => void;
  archiveLead: (leadId: string) => void;

  // Actions: Projects
  addProject: (newProj: Partial<ProjectItem>) => ProjectItem;
  updateProject: (projectId: string, updated: Partial<ProjectItem>) => void;
  archiveProject: (projectId: string) => void;

  // Actions: Archive Vault
  restoreRecord: (recordId: string) => void;
  deletePermanently: (recordId: string) => void;
  bulkRestore: (recordIds: string[]) => void;
  bulkPermanentDelete: (recordIds: string[]) => void;
  purgeAllArchive: () => void;

  // Actions: Field Trips & Calendar
  addOcularTrip: (trip: OcularTrip) => void;

  // Actions: System Configuration
  saveSettings: (newSettings: OperationalSettingsConfig) => void;
  saveSocialLinks: (newLinks: SocialLinksConfig) => void;

  // Security & Administrative Credentials and Session
  adminPassword: string;
  isAdminAuthenticated: boolean;
  verifyAdminPassword: (pass: string) => boolean;
  changeAdminPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  loginAdmin: () => void;
  logoutAdmin: () => void;

  // Supabase Live Connectivity & Manual Refresh
  isSupabaseConnected: boolean;
  refreshProjectsFromSupabase: () => Promise<void>;

  // Actions: Alerts
  dismissAlert: (alertId: string) => void;
  dismissAllAlerts: () => void;

  // Query Helpers
  getProjectDetail: (projectId: string) => ProjectDetail;
  getNewestProjects: (limit?: number) => ProjectItem[];
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage or initial seed arrays
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const rawProjects = readStorage<ProjectItem[]>(STORAGE_KEYS.PROJECTS, PORTFOLIO_PROJECTS);
    return rawProjects.map((p) => {
      if ((p.segment as string) === 'Off-Grid' || (p.category as string) === 'Off-Grid Systems') {
        return {
          ...p,
          segment: 'Residential' as const,
          category: 'Residential Hybrid' as const
        };
      }
      return p;
    });
  });

  const [leads, setLeads] = useState<LeadItem[]>(() => {
    const rawLeads = readStorage<LeadItem[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    return rawLeads.map((l) => {
      let status = l.status;
      if (status === 'Ocular Scheduled') status = 'Contacted';
      else if (status === 'Proposal Sent' || status === 'Contract Signed') status = 'In Progress';
      return { ...l, status };
    });
  });

  const [ocularTrips, setOcularTrips] = useState<OcularTrip[]>(() => {
    const raw = readStorage<OcularTrip[]>(STORAGE_KEYS.OCULAR_TRIPS, INITIAL_OCULAR_TRIPS);
    return raw.map((t) => {
      if (t.timeString === '9:00 AM' || t.timeString === '10:30 AM' || t.timeString === '8:30 AM') {
        return { ...t, timeString: '9:00 AM - 12:00 PM' };
      }
      if (t.timeString === '1:00 PM' || t.timeString === '2:00 PM' || t.timeString === '3:30 PM') {
        return { ...t, timeString: '1:00 PM - 4:00 PM' };
      }
      return t;
    });
  });

  const [archivedRecords, setArchivedRecords] = useState<ArchivedRecord[]>(() =>
    readStorage<ArchivedRecord[]>(STORAGE_KEYS.ARCHIVED_RECORDS, INITIAL_ARCHIVED_RECORDS)
  );

  const [settings, setSettings] = useState<OperationalSettingsConfig>(() =>
    readStorage<OperationalSettingsConfig>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS)
  );

  const [socialLinks, setSocialLinks] = useState<SocialLinksConfig>(() =>
    readStorage<SocialLinksConfig>(STORAGE_KEYS.SOCIAL_LINKS, INITIAL_SOCIAL_LINKS)
  );

  const [systemAlerts, setSystemAlerts] = useState<SystemAlertItem[]>(() =>
    readStorage<SystemAlertItem[]>(STORAGE_KEYS.ALERTS, [])
  );

  const [unreadCount, setUnreadCount] = useState<number>(() =>
    readStorage<number>(STORAGE_KEYS.UNREAD_COUNT, 0)
  );

  const [adminPassword, setAdminPassword] = useState<string>(() =>
    readStorage<string>(STORAGE_KEYS.ADMIN_PASSWORD, 'solareign2026')
  );

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    readStorage<boolean>(STORAGE_KEYS.ADMIN_AUTH_SESSION, false)
  );

  // Cross-Tab Synchronization Listener (Reacts when another tab/window updates localStorage)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Only reload if the updated storage key belongs to Solareign state
      if (e.key && !Object.values(STORAGE_KEYS).includes(e.key)) {
        return;
      }
      setProjects(readStorage<ProjectItem[]>(STORAGE_KEYS.PROJECTS, PORTFOLIO_PROJECTS));
      setLeads(readStorage<LeadItem[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS));
      setOcularTrips(readStorage<OcularTrip[]>(STORAGE_KEYS.OCULAR_TRIPS, INITIAL_OCULAR_TRIPS));
      setArchivedRecords(readStorage<ArchivedRecord[]>(STORAGE_KEYS.ARCHIVED_RECORDS, INITIAL_ARCHIVED_RECORDS));
      setSettings(readStorage<OperationalSettingsConfig>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS));
      setSocialLinks(readStorage<SocialLinksConfig>(STORAGE_KEYS.SOCIAL_LINKS, INITIAL_SOCIAL_LINKS));
      setSystemAlerts(readStorage<SystemAlertItem[]>(STORAGE_KEYS.ALERTS, []));
      setUnreadCount(readStorage<number>(STORAGE_KEYS.UNREAD_COUNT, 0));
      setAdminPassword(readStorage<string>(STORAGE_KEYS.ADMIN_PASSWORD, 'solareign2026'));
      setIsAdminAuthenticated(readStorage<boolean>(STORAGE_KEYS.ADMIN_AUTH_SESSION, false));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const isSupabaseConnected = isSupabaseConfigured();

  // Supabase Live Synchronization
  const refreshProjectsFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const rows = await fetchPortfolioProjectsSupabase();
      if (rows && rows.length > 0) {
        setProjects((prev) => {
          const merged = mergeProjectsWithSupabase(prev, rows);
          writeStorage(STORAGE_KEYS.PROJECTS, merged);
          return merged;
        });
      }
    } catch (err) {
      console.warn('[DataContext] Failed to fetch Supabase projects:', err);
    }
  }, []);

  // Fetch Supabase projects on mount and whenever sync event occurs
  useEffect(() => {
    refreshProjectsFromSupabase();

    const handleSync = () => {
      refreshProjectsFromSupabase();
    };
    window.addEventListener(SYNC_EVENT_NAME, handleSync);

    // Setup Supabase Realtime channel if available
    const sb = getSupabase();
    let channel: any = null;
    if (sb) {
      try {
        channel = sb
          .channel('public:portfolio_projects')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'portfolio_projects' },
            () => {
              refreshProjectsFromSupabase();
            }
          )
          .subscribe();
      } catch (subErr) {
        console.warn('[DataContext] Supabase Realtime subscription notice:', subErr);
      }
    }

    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, handleSync);
      if (sb && channel) {
        try {
          sb.removeChannel(channel);
        } catch {}
      }
    };
  }, [refreshProjectsFromSupabase]);

  // -------------------------------------------------------------
  // LEADS ACTIONS
  // -------------------------------------------------------------
  const addLead = useCallback((leadData: Partial<LeadItem>, options?: AddLeadOptions): LeadItem => {
    const d = new Date();
    const dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = `${d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })} AT ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const dayOfMonth = d.getDate();
    const weekNum = Math.min(4, Math.ceil(dayOfMonth / 7));
    const weekLabel: 'Week 1' | 'Week 2' | 'Week 3' | 'Week 4' = `Week ${weekNum}` as 'Week 1' | 'Week 2' | 'Week 3' | 'Week 4';

    const randomPrefix = Math.floor(100 + Math.random() * 900);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const token = leadData.token || `LEAD-${randomPrefix}-${randomSuffix}`;

    const newLead: LeadItem = {
      id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      token,
      name: leadData.name || 'Inbound Client',
      propertyType: leadData.propertyType || 'RESIDENTIAL',
      propertyCategory: leadData.propertyCategory || (leadData.propertyType ? (leadData.propertyType.charAt(0) + leadData.propertyType.slice(1).toLowerCase()) : 'Residential'),
      address: leadData.address || 'Cavite, Philippines',
      subRegion: leadData.subRegion || leadData.address || 'Cavite, Philippines',
      billRange: leadData.billRange || '9,000 - 12,000 PHP',
      monthlyUsage: leadData.monthlyUsage || 'Standard Solar Assessment',
      phone: leadData.phone || '0908 145 4906',
      email: leadData.email || 'client@solareign.ph',
      systemRequested: leadData.systemRequested || 'Hybrid Solar Energy System',
      requestedConfig: leadData.requestedConfig || leadData.solarProjectGoal || 'Backup power (Hybrid / Battery)',
      status: leadData.status || 'New',
      date: leadData.date || dateStr,
      week: leadData.week || weekLabel,
      receivedDateTime: leadData.receivedDateTime || timeStr,
      utilityPartner: leadData.utilityPartner || 'Meralco',
      structuralRoofType: leadData.structuralRoofType || 'Rib-type / Corrugated GI Sheet',
      daytimeShading: leadData.daytimeShading || 'No, clear sunlight all day',
      solarProjectGoal: leadData.solarProjectGoal || 'Lowering daytime electric bill',
      commissionTimeline: leadData.commissionTimeline || 'Immediately (2-3 weeks)',
      designatedSafeLocation: leadData.designatedSafeLocation || 'Site survey required',
      inverterPhotos: leadData.inverterPhotos || [],
      facilityPhotos: leadData.facilityPhotos || [],
      attachedDocument: leadData.attachedDocument || {
        name: `Solar_Assessment_${token}.pdf`,
        typeLabel: 'SOLAR CALCULATOR REPORT',
        url: '#'
      }
    };

    // If an ocular date was requested during quote booking, create an Ocular Trip entry
    if (options?.scheduleOcular && options.ocularDate) {
      const parts = options.ocularDate.split('-');
      const mNum = parseInt(parts[1] || '1', 10);
      const dNum = parseInt(parts[2] || '1', 10);
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const monthAbbr = months[mNum - 1] || 'SEP';

      const trip: OcularTrip = {
        id: `oc-${Date.now()}`,
        dateMonth: monthAbbr,
        dateDay: String(dNum),
        clientName: newLead.name,
        locationDetails: `${newLead.address} • Public Inbound Consultation Booking`,
        timeString: options.ocularSlot ? options.ocularSlot.split('-')[0].trim() : '9:00 AM',
        engineer: 'Engr. J. De Leon'
      };

      newLead.fieldInspectionDate = {
        day: String(dNum),
        month: monthAbbr,
        fullDateString: options.ocularDate,
        slot: options.ocularSlot || '9:00 AM - 12:00 PM'
      };

      const currentTrips = readStorage<OcularTrip[]>(STORAGE_KEYS.OCULAR_TRIPS, INITIAL_OCULAR_TRIPS);
      const updatedTrips = [trip, ...currentTrips.filter((t) => t.id !== trip.id)];
      writeStorage(STORAGE_KEYS.OCULAR_TRIPS, updatedTrips);
      setOcularTrips(updatedTrips);
    }

    // Synchronously write and update System Alerts
    const alert: SystemAlertItem = {
      id: `alert-${Date.now()}`,
      title: `New Lead: ${newLead.name}`,
      message: `${newLead.systemRequested} • ${newLead.address} (${newLead.billRange})`,
      timestamp: 'Just now'
    };
    const currentAlerts = readStorage<SystemAlertItem[]>(STORAGE_KEYS.ALERTS, []);
    const updatedAlerts = [alert, ...currentAlerts];
    writeStorage(STORAGE_KEYS.ALERTS, updatedAlerts);
    setSystemAlerts(updatedAlerts);

    // Synchronously write and update Unread Count
    const currentUnread = readStorage<number>(STORAGE_KEYS.UNREAD_COUNT, 0);
    const updatedUnread = currentUnread + 1;
    writeStorage(STORAGE_KEYS.UNREAD_COUNT, updatedUnread);
    setUnreadCount(updatedUnread);

    // Synchronously write and update Leads in local storage and React state
    const currentLeads = readStorage<LeadItem[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    const updatedLeads = [newLead, ...currentLeads.filter((l) => l.id !== newLead.id)];
    writeStorage(STORAGE_KEYS.LEADS, updatedLeads);
    setLeads(updatedLeads);

    // Dispatch custom broadcast event for immediate in-app notifications/banners
    dispatchSyncEvent('NEW_LEAD', newLead);

    // Sync to Supabase if configured
    syncLeadToSupabase({
      lead_token: newLead.token || `LEAD-${Date.now()}`,
      client_full_name: newLead.name,
      status: newLead.status,
      property_type: newLead.propertyType || 'RESIDENTIAL',
      primary_contact_endpoint: newLead.phone || newLead.email,
      requested_configuration: newLead.requestedConfig || newLead.systemRequested || 'Solar Package',
      monthly_usage: newLead.monthlyUsage || newLead.billRange || 'N/A',
      philippine_sub_region: newLead.subRegion || 'Cavite, CALABARZON',
      project_id: newLead.projectId,
      project_display_name: newLead.projectDisplayName,
      asset_segment: newLead.assetSegment || (newLead.propertyType === 'COMMERCIAL' ? 'Commercial' : 'Residential'),
      geographical_location: newLead.geographicalLocation || newLead.address,
      phone: newLead.phone,
      email: newLead.email,
      full_address: newLead.address,
      bill_range: newLead.billRange,
      system_requested: newLead.systemRequested
    });

    return newLead;
  }, []);

  const updateLeadStatus = useCallback((leadId: string, newStatus: LeadItem['status']) => {
    const currentLeads = readStorage<LeadItem[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    const targetLead = currentLeads.find((l) => l.id === leadId);

    if (newStatus === 'Archived') {
      if (targetLead) {
        const d = new Date();
        const dateStr = d.toISOString().split('T')[0];
        const timeStr = `${d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

        const currentArc = readStorage<ArchivedRecord[]>(STORAGE_KEYS.ARCHIVED_RECORDS, INITIAL_ARCHIVED_RECORDS);
        const newArc: ArchivedRecord = {
          id: `arc-${Date.now()}`,
          archiveCode: `ARC-206-${Math.floor(100 + Math.random() * 900)}`,
          type: 'Lead Inquiry',
          originalStream: 'Inbound Leads',
          title: `${targetLead.name} - ${targetLead.address.split(',')[0] || 'Cavite'}`,
          subtitle: targetLead.systemRequested || targetLead.billRange,
          archivedDate: dateStr,
          deletedDateTime: timeStr,
          reason: ''
        };
        const updatedArc = [newArc, ...currentArc];
        writeStorage(STORAGE_KEYS.ARCHIVED_RECORDS, updatedArc);
        setArchivedRecords(updatedArc);

        syncArchiveRecordToSupabase({
          archived_item_id: newArc.archiveCode || newArc.id,
          original_stream_source: newArc.originalStream,
          entity_label_name: newArc.title,
          deleted_date_time: new Date().toISOString(),
          entity_subtitle: newArc.subtitle,
          deletion_reason: newArc.reason
        });
      }
      const updated = currentLeads.filter((l) => l.id !== leadId);
      writeStorage(STORAGE_KEYS.LEADS, updated);
      setLeads(updated);
    } else {
      const updated = currentLeads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l));
      writeStorage(STORAGE_KEYS.LEADS, updated);
      setLeads(updated);
    }
    dispatchSyncEvent('UPDATE_LEAD_STATUS', { leadId, newStatus });
  }, []);

  const archiveLead = useCallback((leadId: string) => {
    updateLeadStatus(leadId, 'Archived');
  }, [updateLeadStatus]);

  // -------------------------------------------------------------
  // PROJECTS ACTIONS (BIDIRECTIONAL)
  // -------------------------------------------------------------
  const addProject = useCallback((newProj: Partial<ProjectItem>): ProjectItem => {
    const id = newProj.id || `proj-${Date.now()}`;
    const project: ProjectItem = {
      id,
      projectCode: newProj.projectCode || `PROJ-206-${Math.floor(10 + Math.random() * 90)}`,
      title: newProj.title || 'New Solar Installation',
      subtitle: newProj.subtitle || '',
      clientName: newProj.clientName?.trim() || '',
      scopeDetails: newProj.scopeDetails || '',
      roiYieldTargets: newProj.roiYieldTargets || '',
      category: newProj.category || (newProj.segment === 'Commercial' ? 'Commercial Microgrids' : newProj.segment === 'Industrial' ? 'Industrial Arrays' : 'Residential Hybrid'),
      segment: (newProj.segment === ('Off-Grid' as any) ? 'Residential' : newProj.segment) || 'Residential',
      location: newProj.location || 'Cavite, Philippines',
      details: newProj.scopeDetails || newProj.subtitle || newProj.details || 'Solar Installation',
      image: newProj.image || 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
      galleryImages: newProj.galleryImages || (newProj.image ? [newProj.image] : []),
      capacity: newProj.capacity || '10 kWp',
      year: newProj.year || new Date().getFullYear().toString(),
      duration: newProj.duration || '2 Weeks',
      inverterBrand: newProj.inverterBrand || 'Smart Hybrid Inverter',
      panelWattage: newProj.panelWattage || 'Tier-1 Mono Solar Modules',
      annualGeneration: newProj.annualGeneration || '~15,000 kWh / Year',
      summary: newProj.summary || newProj.subtitle || 'High-efficiency solar array installation.',
      highlights: newProj.highlights || ['Turnkey engineering and commissioning'],
      status: newProj.status || 'Completed',
      publishedDate: newProj.publishedDate || new Date().toISOString().split('T')[0]
    };

    setProjects((prev) => {
      const updated = [project, ...prev];
      writeStorage(STORAGE_KEYS.PROJECTS, updated);
      return updated;
    });

    dispatchSyncEvent('ADD_PROJECT', project);

    syncProjectToSupabase({
      project_id: project.projectCode || project.id,
      project_display_name: project.title,
      asset_segment: project.segment,
      geographical_location: project.location,
      lead_token: project.leadToken,
      client_full_name: project.clientFullName || project.clientName,
      status: project.status,
      property_type: project.propertyType || project.segment,
      primary_contact_endpoint: project.primaryContactEndpoint,
      requested_configuration: project.requestedConfiguration || project.details,
      monthly_usage: project.monthlyUsage,
      philippine_sub_region: project.philippineSubRegion || project.location,
      system_capacity: project.capacity,
      inverter_brand: project.inverterBrand,
      panel_wattage: project.panelWattage,
      annual_generation: project.annualGeneration,
      installation_duration: project.duration,
      image_url: project.image,
      project_summary: project.summary
    });

    return project;
  }, []);

  const updateProject = useCallback((projectId: string, updated: Partial<ProjectItem>) => {
    setProjects((prev) => {
      const updatedList = prev.map((p) => (p.id === projectId ? { ...p, ...updated } : p));
      writeStorage(STORAGE_KEYS.PROJECTS, updatedList);
      return updatedList;
    });
    dispatchSyncEvent('UPDATE_PROJECT', { projectId, updated });
  }, []);

  const archiveProject = useCallback((projectId: string) => {
    setProjects((prev) => {
      const proj = prev.find((p) => p.id === projectId);
      if (proj) {
        const d = new Date();
        const dateStr = d.toISOString().split('T')[0];
        const timeStr = `${d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

        setArchivedRecords((arcPrev) => {
          const updatedArc: ArchivedRecord[] = [
            {
              id: `arc-${Date.now()}`,
              archiveCode: `ARC-206-${Math.floor(100 + Math.random() * 900)}`,
              type: 'Portfolio Project',
              originalStream: 'Portfolio Projects',
              title: `${proj.title} (${proj.capacity})`,
              subtitle: `${proj.segment} • ${proj.location}`,
              archivedDate: dateStr,
              deletedDateTime: timeStr,
              reason: ''
            },
            ...arcPrev
          ];
          writeStorage(STORAGE_KEYS.ARCHIVED_RECORDS, updatedArc);

          syncArchiveRecordToSupabase({
            archived_item_id: updatedArc[0].archiveCode || updatedArc[0].id,
            original_stream_source: updatedArc[0].originalStream,
            entity_label_name: updatedArc[0].title,
            deleted_date_time: new Date().toISOString(),
            entity_subtitle: updatedArc[0].subtitle,
            deletion_reason: updatedArc[0].reason
          });

          return updatedArc;
        });
      }
      const updatedList = prev.filter((p) => p.id !== projectId);
      writeStorage(STORAGE_KEYS.PROJECTS, updatedList);
      return updatedList;
    });
    dispatchSyncEvent('ARCHIVE_PROJECT', { projectId });
  }, []);

  // -------------------------------------------------------------
  // ARCHIVE & RESTORE ACTIONS
  // -------------------------------------------------------------
  const restoreRecord = useCallback((recordId: string) => {
    setArchivedRecords((arcPrev) => {
      const rec = arcPrev.find((r) => r.id === recordId);
      if (!rec) return arcPrev;

      if (rec.originalStream === 'Inbound Leads' || rec.type === 'Lead Inquiry') {
        const clientName = rec.title.split('(')[0].split('-')[0].trim();
        const location = rec.title.includes('-') ? rec.title.split('-')[1].split('(')[0].trim() : 'Cavite Province';
        const restoredLead: LeadItem = {
          id: `lead-${Date.now()}`,
          token: `LEAD-206-${Math.floor(100 + Math.random() * 900)}`,
          name: clientName || 'Restored Lead',
          address: location || 'Cavite Province',
          billRange: '10,000 - 15,000 PHP BILL',
          phone: '09170000000',
          email: 'restored@solareign.ph',
          systemRequested: rec.subtitle || (rec.title.includes('(') ? rec.title.split('(')[1].replace(')', '') : '8kW Hybrid Solar System'),
          status: 'New',
          date: 'Restored Record',
          week: 'Week 4'
        };
        setLeads((leadPrev) => {
          const updatedLeads = [restoredLead, ...leadPrev];
          writeStorage(STORAGE_KEYS.LEADS, updatedLeads);
          return updatedLeads;
        });
      } else if (rec.originalStream === 'Portfolio Projects' || rec.type === 'Portfolio Project' || rec.type === 'Portfolio Draft') {
        const codeNum = Math.floor(10 + Math.random() * 90);
        const restoredProj: ProjectItem = {
          id: `proj-${Date.now()}`,
          projectCode: `PROJ-206-${codeNum}`,
          title: rec.title.split('(')[0].trim(),
          subtitle: rec.subtitle || 'Restored project from archive',
          category: 'Residential Hybrid',
          segment: 'Residential',
          location: rec.subtitle?.includes('•') ? rec.subtitle.split('•')[1].trim() : 'Cavite, Philippines',
          details: 'Restored Installation',
          image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
          galleryImages: [],
          capacity: rec.title.includes('(') ? rec.title.split('(')[1].replace(')', '') : '10 kWp',
          year: new Date().getFullYear().toString(),
          duration: '2 Weeks',
          inverterBrand: 'Smart Hybrid Inverter',
          panelWattage: 'Tier-1 Mono PV Modules',
          annualGeneration: '~14,000 kWh / Year',
          summary: 'Solar array restored from archive vault.',
          highlights: ['Restored installation record'],
          status: 'Completed',
          publishedDate: new Date().toISOString().split('T')[0]
        };
        setProjects((projPrev) => {
          const updatedProjects = [restoredProj, ...projPrev];
          writeStorage(STORAGE_KEYS.PROJECTS, updatedProjects);
          return updatedProjects;
        });
      }

      const updatedArc = arcPrev.filter((r) => r.id !== recordId);
      writeStorage(STORAGE_KEYS.ARCHIVED_RECORDS, updatedArc);
      return updatedArc;
    });
    dispatchSyncEvent('RESTORE_RECORD', { recordId });
  }, []);

  const deletePermanently = useCallback((recordId: string) => {
    setArchivedRecords((prev) => {
      const updated = prev.filter((r) => r.id !== recordId);
      writeStorage(STORAGE_KEYS.ARCHIVED_RECORDS, updated);
      return updated;
    });
    dispatchSyncEvent('DELETE_PERMANENTLY', { recordId });
  }, []);

  const bulkRestore = useCallback((recordIds: string[]) => {
    recordIds.forEach((id) => restoreRecord(id));
  }, [restoreRecord]);

  const bulkPermanentDelete = useCallback((recordIds: string[]) => {
    setArchivedRecords((prev) => {
      const updated = prev.filter((r) => !recordIds.includes(r.id));
      writeStorage(STORAGE_KEYS.ARCHIVED_RECORDS, updated);
      return updated;
    });
    dispatchSyncEvent('BULK_PERMANENT_DELETE', { recordIds });
  }, []);

  const purgeAllArchive = useCallback(() => {
    setArchivedRecords([]);
    writeStorage(STORAGE_KEYS.ARCHIVED_RECORDS, []);
    dispatchSyncEvent('PURGE_ARCHIVE');
  }, []);

  // -------------------------------------------------------------
  // OCULAR TRIPS
  // -------------------------------------------------------------
  const addOcularTrip = useCallback((trip: OcularTrip) => {
    setOcularTrips((prev) => {
      const updated = [trip, ...prev];
      writeStorage(STORAGE_KEYS.OCULAR_TRIPS, updated);
      return updated;
    });
    dispatchSyncEvent('ADD_OCULAR_TRIP', trip);

    syncAppointmentToSupabase({
      client_name: trip.clientName,
      title_of_appointment: trip.titleOfAppointment || `Ocular Site Audit - ${trip.clientName}`,
      scheduled_date: trip.scheduledDate || new Date().toISOString().split('T')[0],
      time_hour_interval: trip.timeString || '9:00 AM - 12:00 PM',
      appointment_type: trip.appointmentType || 'Ocular Site Audit',
      installation_site_location: trip.locationDetails,
      assigned_engineer: trip.engineer
    });
  }, []);

  // -------------------------------------------------------------
  // SYSTEM CONFIGURATION
  // -------------------------------------------------------------
  const saveSettings = useCallback((newSettings: OperationalSettingsConfig) => {
    setSettings(newSettings);
    writeStorage(STORAGE_KEYS.SETTINGS, newSettings);
    dispatchSyncEvent('SAVE_SETTINGS', newSettings);
    saveSystemConfigSupabase('operational_settings', newSettings as unknown as Record<string, unknown>);
  }, []);

  const saveSocialLinks = useCallback((newLinks: SocialLinksConfig) => {
    setSocialLinks(newLinks);
    writeStorage(STORAGE_KEYS.SOCIAL_LINKS, newLinks);
    dispatchSyncEvent('SAVE_SOCIAL_LINKS', newLinks);
    saveSystemConfigSupabase('integrated_urls_channels', newLinks as unknown as Record<string, unknown>);
  }, []);

  // -------------------------------------------------------------
  // ADMINISTRATIVE SECURITY & PASSWORD ACTIONS
  // -------------------------------------------------------------
  const verifyAdminPassword = useCallback((pass: string): boolean => {
    return pass.trim() === adminPassword.trim();
  }, [adminPassword]);

  const changeAdminPassword = useCallback((oldPass: string, newPass: string): { success: boolean; message: string } => {
    if (oldPass.trim() !== adminPassword.trim()) {
      return {
        success: false,
        message: 'Current password does not match your active administrative credentials.'
      };
    }
    if (newPass.trim().length < 6) {
      return {
        success: false,
        message: 'New password must be at least 6 characters in length.'
      };
    }
    const sanitized = newPass.trim();
    setAdminPassword(sanitized);
    writeStorage(STORAGE_KEYS.ADMIN_PASSWORD, sanitized);
    dispatchSyncEvent('CHANGE_ADMIN_PASSWORD', sanitized);

    saveSystemConfigSupabase('admin_credentials', {
      password_hash: sanitized,
      last_updated: new Date().toISOString(),
      role: 'Super Admin'
    });

    return {
      success: true,
      message: 'Administrative password updated successfully.'
    };
  }, [adminPassword]);

  const loginAdmin = useCallback(() => {
    setIsAdminAuthenticated(true);
    writeStorage(STORAGE_KEYS.ADMIN_AUTH_SESSION, true);
    dispatchSyncEvent('LOGIN_ADMIN', true);
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    writeStorage(STORAGE_KEYS.ADMIN_AUTH_SESSION, false);
    dispatchSyncEvent('LOGOUT_ADMIN', false);
  }, []);

  // -------------------------------------------------------------
  // ALERTS ACTIONS
  // -------------------------------------------------------------
  const dismissAlert = useCallback((alertId: string) => {
    setSystemAlerts((prev) => {
      const updated = prev.filter((a) => a.id !== alertId);
      writeStorage(STORAGE_KEYS.ALERTS, updated);
      return updated;
    });
  }, []);

  const dismissAllAlerts = useCallback(() => {
    setSystemAlerts([]);
    setUnreadCount(0);
    writeStorage(STORAGE_KEYS.ALERTS, []);
    writeStorage(STORAGE_KEYS.UNREAD_COUNT, 0);
  }, []);

  // -------------------------------------------------------------
  // QUERY HELPERS
  // -------------------------------------------------------------
  const getNewestProjects = useCallback((limit: number = 5): ProjectItem[] => {
    return [...projects]
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      .slice(0, limit);
  }, [projects]);

  const getProjectDetail = useCallback((projectId: string): ProjectDetail => {
    // If exact map match exists in PROJECTS_DATA_MAP, use it as baseline
    const mapItem = PROJECTS_DATA_MAP[projectId];
    // Find item from live dynamic projects list
    const liveItem = projects.find(
      (p) =>
        p.id === projectId ||
        p.projectCode === projectId ||
        p.projectId === projectId ||
        (p.projectCode && projectId && p.projectCode.toLowerCase() === projectId.toLowerCase()) ||
        (p.id && projectId && p.id.toLowerCase() === projectId.toLowerCase())
    );

    if (liveItem) {
      return {
        id: liveItem.id,
        eyebrow: 'PROJECT BUILD',
        title: liveItem.title.toUpperCase(),
        client: liveItem.clientName && liveItem.clientName.trim()
          ? liveItem.clientName.trim().toUpperCase()
          : (mapItem?.client || 'CONFIDENTIAL CLIENT'),
        sector: liveItem.segment
          ? liveItem.segment.toUpperCase()
          : (mapItem?.sector || liveItem.category.toUpperCase()),
        location: liveItem.location.toUpperCase(),
        managingEngineer: 'JERNALD DIVINA MESINA',
        engineerRole: 'Founder & General Manager, Solareign Services',
        contractor: 'SOLAREIGN ENGINEERING & INSTALLATION TEAM',
        email: 'solareignpower09@gmail.com',
        engineerNote: liveItem.summary || liveItem.details,
        scopeDetails: liveItem.scopeDetails || liveItem.details || '',
        image: liveItem.image,
        gallery: (liveItem.galleryImages && liveItem.galleryImages.length > 0
          ? liveItem.galleryImages
          : [liveItem.image]
        ).map((url, idx) => ({
          url,
          title: `${liveItem.title} - View ${idx + 1}`,
          caption: `Technical documentation photo for ${liveItem.title}.`
        })),
        scopeSections: mapItem?.scopeSections || [
          {
            title: '1. PRE-CONSTRUCTION & FEASIBILITY AUDIT',
            bullets: [
              {
                label: 'Site Assessment & Structural Load Calculations',
                text: `Detailed assessment of electrical loads and structural installation surfaces in ${liveItem.location}.`
              }
            ]
          },
          {
            title: '2. ENGINEERING INSTALLATION & SPECIFICATIONS',
            bullets: [
              {
                label: 'Hardware Specification',
                text: `${liveItem.panelWattage} coupled with ${liveItem.inverterBrand}.`
              },
              {
                label: 'Capacity & Output',
                text: `System capacity of ${liveItem.capacity} delivering estimated ${liveItem.annualGeneration}.`
              }
            ]
          },
          {
            title: '3. QUALITY COMMISSIONING & UTILITY INTEGRATION',
            bullets: [
              {
                label: 'Key Engineering Highlights',
                text: (liveItem.highlights && liveItem.highlights.length > 0)
                  ? liveItem.highlights.join('; ')
                  : 'Turnkey engineering and quality safety compliance'
              }
            ]
          }
        ]
      };
    }

    if (mapItem) {
      return mapItem;
    }

    // Ultimate fallback
    const fallback = projects[0] || PORTFOLIO_PROJECTS[0];
    return {
      id: fallback.id,
      eyebrow: 'PROJECT BUILD',
      title: fallback.title.toUpperCase(),
      client: 'CONFIDENTIAL CLIENT',
      sector: fallback.category.toUpperCase(),
      location: fallback.location.toUpperCase(),
      managingEngineer: 'JERNALD DIVINA MESINA',
      engineerRole: 'Founder & General Manager, Solareign Services',
      contractor: 'SOLAREIGN ENGINEERING & INSTALLATION TEAM',
      email: 'solareignpower09@gmail.com',
      engineerNote: fallback.summary,
      gallery: fallback.galleryImages.map((url, idx) => ({
        url,
        title: `${fallback.title} - View ${idx + 1}`,
        caption: `Technical documentation photo for ${fallback.title}.`
      })),
      scopeSections: [
        {
          title: '1. PRE-CONSTRUCTION & FEASIBILITY AUDIT',
          bullets: [
            {
              label: 'Site Assessment & Load Calculations',
              text: `Detailed assessment of electrical loads and structural installation surfaces in ${fallback.location}.`
            }
          ]
        }
      ]
    };
  }, [projects]);

  const value = useMemo(
    () => ({
      projects,
      leads,
      ocularTrips,
      archivedRecords,
      settings,
      socialLinks,
      systemAlerts,
      unreadCount,

      addLead,
      updateLeadStatus,
      archiveLead,

      addProject,
      updateProject,
      archiveProject,

      restoreRecord,
      deletePermanently,
      bulkRestore,
      bulkPermanentDelete,
      purgeAllArchive,

      addOcularTrip,

      saveSettings,
      saveSocialLinks,

      adminPassword,
      isAdminAuthenticated,
      verifyAdminPassword,
      changeAdminPassword,
      loginAdmin,
      logoutAdmin,

      dismissAlert,
      dismissAllAlerts,

      isSupabaseConnected,
      refreshProjectsFromSupabase,

      getProjectDetail,
      getNewestProjects
    }),
    [
      projects,
      leads,
      ocularTrips,
      archivedRecords,
      settings,
      socialLinks,
      systemAlerts,
      unreadCount,
      addLead,
      updateLeadStatus,
      archiveLead,
      addProject,
      updateProject,
      archiveProject,
      restoreRecord,
      deletePermanently,
      bulkRestore,
      bulkPermanentDelete,
      purgeAllArchive,
      addOcularTrip,
      saveSettings,
      saveSocialLinks,
      adminPassword,
      isAdminAuthenticated,
      verifyAdminPassword,
      changeAdminPassword,
      loginAdmin,
      logoutAdmin,
      dismissAlert,
      dismissAllAlerts,
      isSupabaseConnected,
      refreshProjectsFromSupabase,
      getProjectDetail,
      getNewestProjects
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useOptionalSolareignData(): DataContextType | null {
  return useContext(DataContext);
}

export function useSolareignData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useSolareignData must be used within a DataProvider');
  }
  return context;
}

