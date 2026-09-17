import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================================
// SUPABASE CLIENT INITIALIZATION & TYPED ACCESSORS
// ============================================================================

export const getSupabaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('solareign_supabase_url') || localStorage.getItem('supabase_url');
    if (stored && stored.trim().startsWith('https://')) return stored.trim();
  }
  return import.meta.env.VITE_SUPABASE_URL || '';
};

export const getSupabaseAnonKey = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('solareign_supabase_anon_key') || localStorage.getItem('supabase_anon_key');
    if (stored && stored.trim().length > 10) return stored.trim();
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
};

export const DEFAULT_STORAGE_BUCKET = 'solareign-media';

export const getStorageBucketName = (): string => {
  return DEFAULT_STORAGE_BUCKET;
};

// Verify if valid URL & Key are provided
export const isSupabaseConfigured = (): boolean => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return (
    typeof url === 'string' &&
    url.trim().length > 0 &&
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    typeof key === 'string' &&
    key.trim().length > 10 &&
    !key.includes('...')
  );
};

let clientInstance: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const currentUrl = getSupabaseUrl();
  const currentKey = getSupabaseAnonKey();

  if (!clientInstance || lastUrl !== currentUrl || lastKey !== currentKey) {
    clientInstance = createClient(currentUrl, currentKey);
    lastUrl = currentUrl;
    lastKey = currentKey;
  }
  return clientInstance;
};

// ============================================================================
// SUPABASE DATABASE ROW SCHEMAS
// ============================================================================

export interface PortfolioProjectRow {
  id?: string;
  project_id: string; // e.g. PROJ-206-01
  project_display_name: string;
  asset_segment: string;
  geographical_location: string;
  lead_token?: string;
  client_full_name?: string;
  status: string;
  property_type?: string;
  primary_contact_endpoint?: string;
  requested_configuration?: string;
  monthly_usage?: string;
  philippine_sub_region?: string;
  system_capacity?: string;
  inverter_brand?: string;
  panel_wattage?: string;
  annual_generation?: string;
  installation_duration?: string;
  image_url?: string;
  gallery_images?: string[];
  project_summary?: string;
  project_highlights?: string[];
  published_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LeadManagerRow {
  id?: string;
  lead_token: string;
  client_full_name: string;
  status: string;
  property_type: string;
  primary_contact_endpoint: string;
  requested_configuration: string;
  monthly_usage: string;
  philippine_sub_region: string;
  project_id?: string;
  project_display_name?: string;
  asset_segment?: string;
  geographical_location?: string;
  phone: string;
  email: string;
  full_address: string;
  bill_range?: string;
  system_requested?: string;
  utility_provider?: string;
  roof_type?: string;
  daytime_shading?: string;
  ocular_date?: string;
  ocular_time_slot?: string;
  inverter_photos?: string[];
  facility_photos?: string[];
  received_date_time?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArchiveTrashRow {
  id?: string;
  archived_item_id: string; // e.g. ARC-206-89
  original_stream_source: string; // Inbound Leads, Portfolio Projects, etc.
  entity_label_name: string; // Title / Name
  deleted_date_time: string; // Deleted timestamp
  entity_subtitle?: string;
  deletion_reason?: string;
  original_data?: Record<string, unknown>;
  is_permanently_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PersonnelSchedulingCheckRow {
  id?: string;
  client_name: string;
  title_of_appointment: string;
  scheduled_date: string;
  time_hour_interval: string;
  appointment_type: string;
  installation_site_location: string;
  assigned_engineer?: string;
  client_phone?: string;
  appointment_status?: string;
  engineering_notes?: string;
  system_size_scope?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SystemConfigurationRow {
  config_key: string;
  config_value: Record<string, unknown>;
  description?: string;
  updated_at?: string;
}

// ============================================================================
// SUPABASE LIVE DATA SERVICE HELPERS (WITH GRACEFUL FALLBACK)
// ============================================================================

/**
 * Fetch or update system configuration in Supabase (Change Password & Integrated URLs)
 */
export async function fetchSystemConfigSupabase<T>(configKey: string, fallback: T): Promise<T> {
  const sb = getSupabase();
  if (!sb) return fallback;
  try {
    const { data, error } = await sb
      .from('system_configuration')
      .select('config_value')
      .eq('config_key', configKey)
      .single();
    if (error || !data) return fallback;
    return (data.config_value as unknown as T) || fallback;
  } catch {
    return fallback;
  }
}

export async function saveSystemConfigSupabase(
  configKey: string,
  configValue: Record<string, unknown>,
  description?: string
): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return true; // Local storage acts as truth if offline
  try {
    const { error } = await sb.from('system_configuration').upsert(
      {
        config_key: configKey,
        config_value: configValue,
        description: description || 'System portal configuration',
        updated_at: new Date().toISOString()
      },
      { onConflict: 'config_key' }
    );
    return !error;
  } catch {
    return false;
  }
}

/**
 * Sync leads to Supabase
 */
export async function syncLeadToSupabase(lead: Partial<LeadManagerRow>): Promise<boolean> {
  const sb = getSupabase();
  if (!sb || !lead.lead_token) return true;
  try {
    const { error } = await sb.from('leads_manager').upsert(lead, { onConflict: 'lead_token' });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetch all portfolio projects from Supabase
 */
export async function fetchPortfolioProjectsSupabase(): Promise<PortfolioProjectRow[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('portfolio_projects')
      .select('*')
      .order('published_date', { ascending: false });

    if (error) {
      console.warn('[Supabase] Error fetching portfolio_projects:', error.message);
      // Fallback try table 'projects' if user used generic name
      const fallback = await sb.from('projects').select('*');
      if (!fallback.error && fallback.data) {
        return fallback.data as PortfolioProjectRow[];
      }
      return null;
    }
    return data as PortfolioProjectRow[];
  } catch (err) {
    console.warn('[Supabase] Exception fetching portfolio projects:', err);
    return null;
  }
}

/**
 * Fetch all leads from Supabase
 */
export async function fetchLeadsSupabase(): Promise<LeadManagerRow[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('leads_manager')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return null;
    return data as LeadManagerRow[];
  } catch {
    return null;
  }
}

/**
 * Sync portfolio project to Supabase
 */
export async function syncProjectToSupabase(project: Partial<PortfolioProjectRow>): Promise<boolean> {
  const sb = getSupabase();
  if (!sb || !project.project_id) return true;
  try {
    const { error } = await sb.from('portfolio_projects').upsert(project, { onConflict: 'project_id' });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Sync archive record to Supabase
 */
export async function syncArchiveRecordToSupabase(rec: Partial<ArchiveTrashRow>): Promise<boolean> {
  const sb = getSupabase();
  if (!sb || !rec.archived_item_id) return true;
  try {
    const { error } = await sb.from('archive_trash').upsert(rec, { onConflict: 'archived_item_id' });
    return !error;
  } catch {
    return false;
  }
}

/**
 * Sync appointment to Supabase
 */
export async function syncAppointmentToSupabase(
  appointment: Partial<PersonnelSchedulingCheckRow>
): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return true;
  try {
    const { error } = await sb.from('personnel_scheduling_check').insert([appointment]);
    return !error;
  } catch {
    return false;
  }
}

// ============================================================================
// SUPABASE STORAGE BUCKET SERVICES (IMAGE STORAGE & COMPRESSION UPLOAD)
// ============================================================================

/**
 * Upload a Blob or File directly to a Supabase Storage bucket
 */
export async function uploadToStorageBucket(
  fileOrBlob: Blob | File,
  destinationPath: string,
  bucketName: string = getStorageBucketName()
): Promise<{ publicUrl: string; path: string } | null> {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const contentType = fileOrBlob.type || 'image/jpeg';
    const cleanPath = destinationPath.replace(/^\/+/, '');

    const { error } = await sb.storage
      .from(bucketName)
      .upload(cleanPath, fileOrBlob, {
        contentType,
        upsert: true
      });

    if (error) {
      console.warn(`[Supabase Storage] Upload error to bucket "${bucketName}":`, error.message);
      return null;
    }

    const { data } = sb.storage.from(bucketName).getPublicUrl(cleanPath);
    if (!data || !data.publicUrl) return null;

    return {
      publicUrl: data.publicUrl,
      path: cleanPath
    };
  } catch (err) {
    console.warn(`[Supabase Storage] Unexpected upload failure:`, err);
    return null;
  }
}

/**
 * Check if the Supabase storage bucket exists and is accessible
 */
export async function checkStorageBucketStatus(
  bucketName: string = getStorageBucketName()
): Promise<{ exists: boolean; isConfigured: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return {
      exists: false,
      isConfigured: false,
      message: 'Supabase credentials not yet configured in environment. Using browser offline storage fallback.'
    };
  }

  const sb = getSupabase();
  if (!sb) {
    return {
      exists: false,
      isConfigured: false,
      message: 'Supabase client instance not initialized.'
    };
  }

  try {
    const { data, error } = await sb.storage.getBucket(bucketName);
    if (error || !data) {
      return {
        exists: false,
        isConfigured: true,
        message: `Bucket "${bucketName}" not found. Please create it in Supabase Dashboard -> Storage.`
      };
    }
    return {
      exists: true,
      isConfigured: true,
      message: `Bucket "${bucketName}" is active and accepting image uploads.`
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown storage connection error';
    return {
      exists: false,
      isConfigured: true,
      message: msg
    };
  }
}

