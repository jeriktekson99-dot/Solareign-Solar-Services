-- ============================================================================
-- SOLAREIGN SOLAR POWER SERVICES - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Generated for Solareign Solar Management Portal
-- Includes:
--   1. portfolio_projects
--   2. leads_manager
--   3. archive_trash
--   4. personnel_scheduling_check
--   5. system_configuration (Change Password & Integrated URLs & Channels)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- HELPER: AUTOMATIC TIMESTAMPS TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 1. PORTFOLIO PROJECTS TABLE
-- Requirements:
--   - Lead Token (lead_token)
--   - Client Full Name (client_full_name)
--   - Status (status)
--   - Property Type (property_type)
--   - Primary Contact Endpoint (primary_contact_endpoint)
--   - Requested Configuration (requested_configuration)
--   - Monthly Usage (monthly_usage)
--   - Philippine Sub-Region (philippine_sub_region)
-- Also includes primary project portfolio attributes for full display & filtering:
--   - Project ID (project_id)
--   - Project Display Name (project_display_name)
--   - Asset Segment (asset_segment)
--   - GEOGRAPHICAL LOCATION (geographical_location)
-- ============================================================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(50) NOT NULL UNIQUE, -- e.g. PROJ-206-01
    project_display_name VARCHAR(255) NOT NULL,
    asset_segment VARCHAR(100) NOT NULL DEFAULT 'Residential', -- Residential, Commercial, Industrial, Hybrid
    geographical_location TEXT NOT NULL, -- e.g. Dasmariñas City, Cavite
    
    -- Explicit User Requirements
    lead_token VARCHAR(50), -- e.g. LEAD-2026-901
    client_full_name VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'Completed', -- Completed, In Progress, Commissioned, Planning
    property_type VARCHAR(100) DEFAULT 'Residential',
    primary_contact_endpoint VARCHAR(255), -- Phone / Email
    requested_configuration TEXT, -- e.g. Hybrid Solar with Battery Backup
    monthly_usage VARCHAR(100), -- e.g. 1,200 kWh / 12,000 - 15,000 PHP
    philippine_sub_region VARCHAR(100),
    
    -- Technical Specifications & Media
    system_capacity VARCHAR(50),
    inverter_brand VARCHAR(100),
    panel_wattage VARCHAR(100),
    annual_generation VARCHAR(100),
    installation_duration VARCHAR(50),
    image_url TEXT,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    project_summary TEXT,
    project_highlights JSONB DEFAULT '[]'::jsonb,
    published_date DATE DEFAULT CURRENT_DATE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_portfolio_projects
    BEFORE UPDATE ON portfolio_projects
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp_column();

-- ============================================================================
-- 2. LEADS MANAGER TABLE
-- Requirements:
--   - Project ID (project_id)
--   - Project Display Name (project_display_name)
--   - Asset Segment (asset_segment)
--   - GEOGRAPHICAL LOCATION (geographical_location)
-- Also includes comprehensive lead inquiry columns:
--   - Lead Token (lead_token)
--   - Client Full Name (client_full_name)
--   - Status (status)
--   - Property Type (property_type)
--   - Primary Contact Endpoint (primary_contact_endpoint)
--   - Requested Configuration (requested_configuration)
--   - Monthly Usage (monthly_usage)
--   - Philippine Sub-Region (philippine_sub_region)
-- ============================================================================
CREATE TABLE IF NOT EXISTS leads_manager (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_token VARCHAR(50) NOT NULL UNIQUE, -- e.g. LEAD-2026-001
    client_full_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'New', -- New, Contacted, In Progress, Ocular Scheduled, Proposal Sent, Contract Signed, Archived
    property_type VARCHAR(100) NOT NULL DEFAULT 'RESIDENTIAL', -- RESIDENTIAL, COMMERCIAL, INDUSTRIAL
    primary_contact_endpoint VARCHAR(255) NOT NULL, -- Phone or Email
    requested_configuration TEXT NOT NULL, -- e.g. Backup power (Hybrid / Battery)
    monthly_usage VARCHAR(100), -- e.g. 9,000 - 12,000 PHP / 850 kWh
    philippine_sub_region VARCHAR(100),
    
    -- Explicit User Requirements
    project_id VARCHAR(50), -- Associated project code if converted
    project_display_name VARCHAR(255),
    asset_segment VARCHAR(100) DEFAULT 'Residential',
    geographical_location TEXT,
    
    -- Additional Contact & Inspection Details
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    full_address TEXT NOT NULL,
    bill_range VARCHAR(100),
    system_requested TEXT,
    utility_provider VARCHAR(100),
    roof_type VARCHAR(100),
    daytime_shading VARCHAR(100),
    ocular_date DATE,
    ocular_time_slot VARCHAR(50),
    inverter_photos JSONB DEFAULT '[]'::jsonb,
    facility_photos JSONB DEFAULT '[]'::jsonb,
    received_date_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_leads_manager
    BEFORE UPDATE ON leads_manager
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp_column();

-- ============================================================================
-- 3. ARCHIVE / TRASH REPOSITORY TABLE
-- Requirements:
--   - ARCHIVED ITEM ID (archived_item_id)
--   - ORIGINAL STREAM SOURCE (original_stream_source)
--   - ENTITY LABEL NAME (entity_label_name)
--   - DELETED DATE/TIME (deleted_date_time)
-- ============================================================================
CREATE TABLE IF NOT EXISTS archive_trash (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    archived_item_id VARCHAR(100) NOT NULL UNIQUE, -- e.g. ARC-206-89 or proj-104
    original_stream_source VARCHAR(100) NOT NULL, -- Inbound Leads, Portfolio Projects, Appointments, etc.
    entity_label_name VARCHAR(255) NOT NULL, -- Title or Name of the deleted record
    deleted_date_time TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Timestamp when moved to trash
    
    -- Extended Record Context
    entity_subtitle TEXT,
    deletion_reason TEXT,
    original_data JSONB DEFAULT '{}'::jsonb, -- Preserved payload for 100% loss-free recovery
    is_permanently_deleted BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_archive_trash
    BEFORE UPDATE ON archive_trash
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp_column();

-- ============================================================================
-- 4. PERSONNEL SCHEDULING CHECK TABLE
-- Requirements:
--   - Client Name (client_name)
--   - Title of Appointment (title_of_appointment)
--   - Scheduled Date (scheduled_date)
--   - Time / Hour Interval (time_hour_interval)
--   - Appointment Type (appointment_type)
--   - Installation Site / Location (installation_site_location)
-- ============================================================================
CREATE TABLE IF NOT EXISTS personnel_scheduling_check (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    title_of_appointment VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL,
    time_hour_interval VARCHAR(100) NOT NULL, -- e.g. 9:00 AM - 12:00 PM
    appointment_type VARCHAR(100) NOT NULL DEFAULT 'Ocular Site Audit', -- Ocular Site Audit, Installation Kickoff, Net Metering Survey, Client Consultation, Maintenance Check
    installation_site_location TEXT NOT NULL,
    
    -- Personnel & Status Details
    assigned_engineer VARCHAR(255),
    client_phone VARCHAR(50),
    appointment_status VARCHAR(50) NOT NULL DEFAULT 'Scheduled', -- Scheduled, Completed, Postponed, Cancelled
    engineering_notes TEXT,
    system_size_scope VARCHAR(100),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_personnel_scheduling_check
    BEFORE UPDATE ON personnel_scheduling_check
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp_column();

-- ============================================================================
-- 5. SYSTEM CONFIGURATION TABLE
-- Requirements:
--   - Change Password functional credential store
--   - Integrated URLS & Channels functional links & webhooks store
--   - Operational parameters & rate configurations
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_configuration (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp_system_configuration
    BEFORE UPDATE ON system_configuration
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp_column();

-- ============================================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_portfolio_project_id ON portfolio_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_segment ON portfolio_projects(asset_segment);
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio_projects(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_lead_token ON portfolio_projects(lead_token);

CREATE INDEX IF NOT EXISTS idx_leads_token ON leads_manager(lead_token);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads_manager(status);
CREATE INDEX IF NOT EXISTS idx_leads_property_type ON leads_manager(property_type);
CREATE INDEX IF NOT EXISTS idx_leads_sub_region ON leads_manager(philippine_sub_region);
CREATE INDEX IF NOT EXISTS idx_leads_received ON leads_manager(received_date_time DESC);

CREATE INDEX IF NOT EXISTS idx_archive_item_id ON archive_trash(archived_item_id);
CREATE INDEX IF NOT EXISTS idx_archive_source ON archive_trash(original_stream_source);
CREATE INDEX IF NOT EXISTS idx_archive_deleted_time ON archive_trash(deleted_date_time DESC);

CREATE INDEX IF NOT EXISTS idx_sched_date ON personnel_scheduling_check(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_sched_status ON personnel_scheduling_check(appointment_status);
CREATE INDEX IF NOT EXISTS idx_sched_engineer ON personnel_scheduling_check(assigned_engineer);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Configured for seamless operation with Supabase Public Anon & Authenticated Keys
-- ============================================================================
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads_manager ENABLE ROW LEVEL SECURITY;
ALTER TABLE archive_trash ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel_scheduling_check ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_configuration ENABLE ROW LEVEL SECURITY;

-- Allow public/anon client read and write for applet integration
CREATE POLICY "Allow public read portfolio_projects" ON portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert portfolio_projects" ON portfolio_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update portfolio_projects" ON portfolio_projects FOR UPDATE USING (true);
CREATE POLICY "Allow public delete portfolio_projects" ON portfolio_projects FOR DELETE USING (true);

CREATE POLICY "Allow public read leads_manager" ON leads_manager FOR SELECT USING (true);
CREATE POLICY "Allow public insert leads_manager" ON leads_manager FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update leads_manager" ON leads_manager FOR UPDATE USING (true);
CREATE POLICY "Allow public delete leads_manager" ON leads_manager FOR DELETE USING (true);

CREATE POLICY "Allow public read archive_trash" ON archive_trash FOR SELECT USING (true);
CREATE POLICY "Allow public insert archive_trash" ON archive_trash FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update archive_trash" ON archive_trash FOR UPDATE USING (true);
CREATE POLICY "Allow public delete archive_trash" ON archive_trash FOR DELETE USING (true);

CREATE POLICY "Allow public read personnel_scheduling_check" ON personnel_scheduling_check FOR SELECT USING (true);
CREATE POLICY "Allow public insert personnel_scheduling_check" ON personnel_scheduling_check FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update personnel_scheduling_check" ON personnel_scheduling_check FOR UPDATE USING (true);
CREATE POLICY "Allow public delete personnel_scheduling_check" ON personnel_scheduling_check FOR DELETE USING (true);

CREATE POLICY "Allow public read system_configuration" ON system_configuration FOR SELECT USING (true);
CREATE POLICY "Allow public insert system_configuration" ON system_configuration FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update system_configuration" ON system_configuration FOR UPDATE USING (true);

-- ============================================================================
-- 6. SUPABASE STORAGE BUCKET CONFIGURATION (solareign-media)
-- Image compression pipeline uploads media to this public storage bucket
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'solareign-media',
    'solareign-media',
    true,
    15728640, -- 15MB maximum file size limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to media assets
CREATE POLICY "Public Access solareign-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'solareign-media');

-- Allow authenticated and anon uploads to the bucket
CREATE POLICY "Public Upload solareign-media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'solareign-media');

-- Allow updating and replacing media objects
CREATE POLICY "Public Update solareign-media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'solareign-media');

-- Allow deleting media objects
CREATE POLICY "Public Delete solareign-media"
ON storage.objects FOR DELETE
USING (bucket_id = 'solareign-media');

