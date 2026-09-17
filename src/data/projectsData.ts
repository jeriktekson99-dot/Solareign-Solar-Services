export interface ProjectItem {
  id: string;
  projectCode?: string;
  title: string;
  subtitle?: string;
  category: 'Residential Hybrid' | 'Commercial Microgrids' | 'Industrial Arrays';
  segment: 'Residential' | 'Commercial' | 'Industrial';
  location: string;
  details: string;
  image: string;
  galleryImages: string[];
  capacity: string;
  year: string;
  duration: string;
  inverterBrand: string;
  panelWattage: string;
  annualGeneration: string;
  summary: string;
  highlights: string[];
  status: 'Ongoing' | 'Completed';
  publishedDate: string; // ISO format date string for chronological sorting (newest first)
  clientName?: string;
  roiYieldTargets?: string;
  scopeDetails?: string;

  // Supabase Datatable Schema Fields (Portfolio Projects)
  leadToken?: string;
  clientFullName?: string;
  propertyType?: string;
  primaryContactEndpoint?: string;
  requestedConfiguration?: string;
  monthlyUsage?: string;
  philippineSubRegion?: string;
  projectId?: string;
  projectDisplayName?: string;
  assetSegment?: string;
  geographicalLocation?: string;
}

export interface GalleryImage {
  url: string;
  title: string;
  caption: string;
}

export interface ScopeBullet {
  label: string;
  text: string;
}

export interface ScopeSection {
  title: string;
  bullets: ScopeBullet[];
}

export interface ProjectDetail {
  id: string;
  eyebrow: string;
  title: string;
  client: string;
  sector: string;
  location: string;
  managingEngineer: string;
  engineerRole: string;
  contractor: string;
  email: string;
  engineerNote: string;
  gallery: GalleryImage[];
  image?: string;
  scopeSections: ScopeSection[];
  scopeDetails?: string;
}

export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-206-04',
    projectCode: 'PROJ-206-04',
    title: 'Mandaluyong Penthouse Eco Array / HIGH-RISE LUXURY',
    subtitle: 'Urban penthouse aesthetic rooftop microgrid with energy storage',
    clientName: 'Mandaluyong Penthouse Eco Solar Segment',
    category: 'Residential Hybrid',
    segment: 'Residential',
    location: 'Mandaluyong, Metro Manila',
    status: 'Completed',
    details: 'Luxury Rooftop Array',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '18 kWp',
    year: '2026',
    duration: '2 Weeks',
    inverterBrand: 'Deye 18kW 3-Phase Smart Hybrid',
    panelWattage: '32x 565W Tier-1 All-Black N-Type Panels',
    annualGeneration: '~26,500 kWh / Year',
    summary: 'Ultra-modern rooftop photovoltaic system integrated into a high-rise penthouse in Mandaluyong, featuring low-profile structural racking, architectural perimeter shielding, and a 20kWh lithium storage bank.',
    highlights: [
      'Aero-dynamic ballasted racking certified for wind loads exceeding 250 km/h',
      'Zero-export smart metering with critical load priority switching',
      'Remote telemetry & app monitoring with automated storm protection mode'
    ],
    publishedDate: '2026-07-28'
  },
  {
    id: 'proj-206-03',
    projectCode: 'PROJ-206-03',
    title: 'St. Jude Specialized Solar Setup / CLINICAL CARE',
    subtitle: 'Commercial medical facility uninterruptible power system',
    clientName: 'St. Jude Medical Care Facility',
    category: 'Commercial Microgrids',
    segment: 'Commercial',
    location: 'St. Jude, PH',
    status: 'Ongoing',
    details: 'Critical Healthcare Microgrid',
    image: '', // Demonstrates the reference "No Media" box
    galleryImages: [],
    capacity: '45 kWp',
    year: '2026',
    duration: '3 Weeks',
    inverterBrand: 'Huawei Commercial 3-Phase Multi-MPPT',
    panelWattage: '80x 560W Bifacial Dual-Glass Panels',
    annualGeneration: '~65,000 kWh / Year',
    summary: 'Specialized high-reliability commercial rooftop array designed for a specialized medical and diagnostic center in St. Jude, guaranteeing uninterruptible diagnostic and laboratory power.',
    highlights: [
      'Sub-20 millisecond automatic grid transfer for clinical instruments',
      'Non-penetrating clamp mounting preserving sterile roof envelope',
      'Over ₱52,000 monthly utility overhead reduction'
    ],
    publishedDate: '2026-07-15'
  },
  {
    id: 'proj-206-02',
    projectCode: 'PROJ-206-02',
    title: 'Cavite Cold Storage Solar Grid / MULTI-MW SCALE',
    subtitle: 'Industrial cold storage facility with net-metering export',
    clientName: 'Imus Logistics & Cold Chain Corp.',
    category: 'Industrial Arrays',
    segment: 'Industrial',
    location: 'Imus, Cavite',
    status: 'Completed',
    details: 'Cold Storage Microgrid',
    image: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '250 kWp',
    year: '2026',
    duration: '4 Weeks',
    inverterBrand: 'Huawei Commercial 3-Phase String Inverters',
    panelWattage: '455x 550W Bifacial High-Efficiency PV Modules',
    annualGeneration: '~365,000 kWh / Year',
    summary: 'Heavy-duty commercial rooftop solar microgrid engineered for an intensive temperature-controlled cold storage warehouse in Imus, Cavite, reducing peak-demand charges.',
    highlights: [
      'Non-penetrating standing seam clamp mounts protecting roof warranty',
      'Direct net-metering export monetization with local distribution utility',
      'Levelized cost of electricity (LCOE) projected sub ₱3.20/kWh'
    ],
    publishedDate: '2026-07-05'
  },
  {
    id: 'proj-206-01',
    projectCode: 'PROJ-206-01',
    title: 'Quezon City Residential Array / HIGH EFFICIENCY',
    subtitle: 'High-efficiency residential PV with hybrid lithium backup',
    clientName: 'Bernardo Family Estate',
    category: 'Residential Hybrid',
    segment: 'Residential',
    location: 'Quezon City, Metro Manila',
    status: 'Completed',
    details: 'High-Efficiency Residential PV',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '12 kWp',
    year: '2026',
    duration: '5 Days',
    inverterBrand: 'Deye 12kW Hybrid Single-Phase Inverter',
    panelWattage: '22x 550W Tier-1 N-Type Monocrystalline Panels',
    annualGeneration: '~17,500 kWh / Year',
    summary: 'Custom high-efficiency residential array in Quezon City designed to eliminate 90%+ of daytime power draw with automated battery discharge during peak evening tariff windows.',
    highlights: [
      'Pre-assembled smart distribution board with surge protection devices (SPDs)',
      '15kWh LiFePO4 rack storage with 6,000 cycle lifespan',
      'Full Meralco net-metering compliance and bi-directional meter installation'
    ],
    publishedDate: '2026-06-25'
  },
  {
    id: 'proj-1',
    projectCode: 'PROJ-206-05',
    title: 'Proposed Renovation of 3-Storey Town House',
    subtitle: 'Interior construction & architectural solar integration',
    clientName: 'Ms. Janice Azul',
    category: 'Residential Hybrid',
    segment: 'Residential',
    location: 'Bayan Luma 2, Imus Cavite',
    status: 'Ongoing',
    details: 'Interior Construction & Solar',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '15 kWp',
    year: '2024',
    duration: '4 Weeks',
    inverterBrand: 'Deye 15kW Smart 3-Phase Hybrid Inverter',
    panelWattage: '28x 550W Tier-1 N-Type Monocrystalline Panels',
    annualGeneration: '~21,900 kWh / Year',
    summary: 'Complete architectural renovation and hybrid solar integration with sub-panel distribution and acoustic drywall partitions in Imus, Cavite.',
    highlights: [
      'Corporate fit-out and architectural drywall partitions with acoustic insulation',
      'Pre-installed UV-rated solar raceway and 15kW hybrid electrical distribution',
      'Sub-10ms brownout failover with integrated lithium storage capacity'
    ],
    publishedDate: '2024-11-20'
  },
  {
    id: 'proj-2',
    title: 'Cavite Cold Storage Solar Grid',
    clientName: 'Imus Logistics & Cold Chain Corp.',
    category: 'Industrial Arrays',
    segment: 'Industrial',
    location: 'Anabu II, Imus, Cavite',
    status: 'Completed',
    details: 'Cold Storage Microgrid',
    image: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '250 kWp',
    year: '2024',
    duration: '3 Weeks',
    inverterBrand: 'Huawei Commercial 3-Phase String Inverters',
    panelWattage: '455x 550W Bifacial High-Efficiency PV Modules',
    annualGeneration: '~365,000 kWh / Year',
    summary: 'Heavy-duty commercial rooftop solar microgrid engineered for an intensive temperature-controlled cold storage warehouse in Imus, Cavite, reducing peak-demand charges.',
    highlights: [
      'Non-penetrating standing seam clamp mounts protecting roof warranty',
      'Direct net-metering export monetization with local distribution utility',
      'Levelized cost of electricity (LCOE) projected sub ₱3.20/kWh'
    ],
    publishedDate: '2024-10-15'
  },
  {
    id: 'proj-3',
    title: 'Dasmariñas Commercial Microgrid',
    clientName: 'Dasmariñas Multi-Tenant Plaza',
    category: 'Commercial Microgrids',
    segment: 'Commercial',
    location: 'Dasmariñas, Cavite',
    status: 'Completed',
    details: 'Commercial Rooftop',
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '50 kWp',
    year: '2024',
    duration: '2 Weeks',
    inverterBrand: 'Huawei Commercial 3-Phase String Inverters',
    panelWattage: '92x 550W Monocrystalline High-Efficiency Panels',
    annualGeneration: '~73,000 kWh / Year',
    summary: 'Engineered for a commercial multi-tenant establishment in Dasmariñas to offset intensive daytime HVAC energy demand and reduce baseline electricity rates.',
    highlights: [
      'Non-penetrating standing seam clamp mounts protecting roof warranty',
      'Direct net-metering export monetization with local distribution utility',
      'Peak load shaving algorithms reducing high-tier tariff charges'
    ],
    publishedDate: '2024-09-10'
  },
  {
    id: 'proj-4',
    title: 'General Trias Industrial Solar Array',
    clientName: 'Cavite Manufacturing & Logistics Corp.',
    category: 'Industrial Arrays',
    segment: 'Industrial',
    location: 'General Trias, Cavite',
    status: 'Completed',
    details: 'High-Voltage Sync',
    image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '200 kWp',
    year: '2024',
    duration: '1 Month',
    inverterBrand: 'Sungrow High-Voltage Industrial Central Inverters',
    panelWattage: '364x 550W Bifacial Dual-Glass PV Modules',
    annualGeneration: '~292,000 kWh / Year',
    summary: 'High-voltage synchronized multi-megawatt tier installation for a major manufacturing warehouse in General Trias to suppress peak demand penalties.',
    highlights: [
      'Dedicated step-up transformer integration & substation-grade safety breakers',
      'SCADA telemetry monitoring with remote curtailment controls',
      'Drastic carbon emissions offset of over 190 metric tons annually'
    ],
    publishedDate: '2024-08-05'
  },
  {
    id: 'proj-5',
    title: 'Tagaytay Autonomous Residential Solar',
    clientName: 'Highland Private Residence & Retreat',
    category: 'Residential Hybrid',
    segment: 'Residential',
    location: 'Tagaytay City, Cavite',
    status: 'Ongoing',
    details: 'Full Autonomy',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '12 kWp',
    year: '2024',
    duration: '6 Days',
    inverterBrand: 'Victron Energy Dual Quattro Inverter Stack',
    panelWattage: '22x 550W Tier-1 All-Black Solar Panels',
    annualGeneration: '~17,500 kWh / Year',
    summary: 'Designed for a private villa in Tagaytay with complete autonomy from the main power grid, supported by a 25kWh LiFePO4 rack battery bank and smart generator auto-start.',
    highlights: [
      '100% self-sufficient energy loop independent of local power grid stability',
      'Victron Color Control GX cloud monitoring and diagnostics',
      'High-elevation wind load reinforced brackets'
    ],
    publishedDate: '2024-07-12'
  },
  {
    id: 'proj-7',
    title: 'Bacoor Smart Hybrid Residence',
    clientName: 'Bacoor Homeowner Estate',
    category: 'Residential Hybrid',
    segment: 'Residential',
    location: 'Bacoor City, Cavite',
    status: 'Completed',
    details: 'Lithium Battery Backup',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '10 kWp',
    year: '2024',
    duration: '4 Days',
    inverterBrand: 'Growatt SPH Smart Hybrid Series',
    panelWattage: '18x 550W High-Efficiency Monocrystalline Panels',
    annualGeneration: '~14,600 kWh / Year',
    summary: 'Equipped with a 15kWh modular battery reserve to power essential residential circuits during regional outages.',
    highlights: [
      'Dedicated critical load sub-panel for uninterrupted living',
      'Aesthetics-first concealed conduit runs preserving home curb appeal',
      'Complete Cavite LGU & distribution utility net-metering approval'
    ],
    publishedDate: '2024-06-25'
  },
  {
    id: 'proj-6',
    title: 'Silang Commercial Peak-Shaving Grid',
    clientName: 'Silang Agri-Commercial Hub',
    category: 'Commercial Microgrids',
    segment: 'Commercial',
    location: 'Silang, Cavite',
    status: 'Completed',
    details: 'Peak Shaving System',
    image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '30 kWp',
    year: '2023',
    duration: '10 Days',
    inverterBrand: 'Deye 3-Phase Smart Commercial Inverter',
    panelWattage: '55x 550W Monocrystalline PV Modules',
    annualGeneration: '~43,800 kWh / Year',
    summary: 'Smart hybrid solar microgrid installed on a retail center in Silang, Cavite, incorporating scheduled peak-shaving algorithms.',
    highlights: [
      'Intelligent load management for commercial refrigeration & lighting',
      '30kWh energy storage module for business continuity during typhoons',
      'Full PEC-compliant fire-safety shutdown compliance'
    ],
    publishedDate: '2023-11-18'
  },
  {
    id: 'proj-8',
    title: 'Trece Martires Agro-Industrial Array',
    clientName: 'Trece Agro-Industrial Corporation',
    category: 'Industrial Arrays',
    segment: 'Industrial',
    location: 'Trece Martires, Cavite',
    status: 'Completed',
    details: 'Ground-Mounted Array',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80'
    ],
    capacity: '150 kWp',
    year: '2023',
    duration: '3 Weeks',
    inverterBrand: 'Huawei String Inverters with Smart IV Curve Diagnosis',
    panelWattage: '272x 550W Bifacial High-Efficiency Panels',
    annualGeneration: '~220,000 kWh / Year',
    summary: 'Heavy-duty ground-mounted solar power plant built for an agro-industrial processing plant in Trece Martires, Cavite.',
    highlights: [
      'Engineered for 250 km/h wind load resistance against super typhoons',
      'Bifacial solar technology capturing reflected ground albedo radiation',
      'Automated string-level fault detection and cloud maintenance dispatch'
    ],
    publishedDate: '2023-08-04'
  }
];

export const PROJECTS_DATA_MAP: Record<string, ProjectDetail> = {
  'proj-1': {
    id: 'proj-1',
    eyebrow: 'PROJECT BUILD',
    title: 'PROPOSED RENOVATION OF 3-STOREY TOWN HOUSE',
    client: 'MS. JANICE AZUL',
    sector: 'INTERIOR CONSTRUCTION & SOLAR',
    location: 'BAYAN LUMA 2, IMUS CAVITE',
    managingEngineer: 'JERNALD DIVINA MESINA',
    engineerRole: 'Founder & General Manager, Solareign Services',
    contractor: 'SOLAREIGN CONSTRUCTION & INSTALLATION TEAM',
    email: 'solareignpower09@gmail.com',
    engineerNote: 'Professional engineers coordinating architectural finishes, structural components, electrical and plumbing plans.',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        title: 'Interior Wall Metal Framing',
        caption: 'Interior steel stud partitioning and electrical raceway installation on the 2nd level.'
      },
      {
        url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
        title: 'Plastered Interior Bedroom',
        caption: 'Finished gypsum skim coat and natural daylighting assessment.'
      },
      {
        url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80',
        title: 'Corridor & Utility Box',
        caption: 'Electrical sub-panel junction drops and acoustic drywall insulation alignment.'
      },
      {
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
        title: 'Structural Steel Corridor Framing',
        caption: 'Ceiling runner channels and stud spacing verified according to structural load requirements.'
      },
      {
        url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        title: 'Architectural Blueprint Inspection',
        caption: 'On-site engineering coordination for MEP rough-ins and solar rooftop conduits.'
      }
    ],
    scopeSections: [
      {
        title: '1. PRE-CONSTRUCTION & DEMOLITION',
        bullets: [
          {
            label: 'Site Assessment & Structural Verification',
            text: 'Detailed load-bearing calculations of existing concrete slabs, roof purlins, and wall framing.'
          },
          {
            label: 'Selective Interior Demolition',
            text: 'Careful removal of degraded masonry partitions, redundant wiring raceways, and damaged subfloor assemblies.'
          }
        ]
      },
      {
        title: '2. STRUCTURAL STEEL & ARCHITECTURAL DRYWALL',
        bullets: [
          {
            label: 'Light Gauge Metal Framing (LGMF)',
            text: 'Installation of zinc-coated steel tracks and C-studs spaced at 400mm centers with reinforced lintels.'
          },
          {
            label: 'Acoustic & Thermal Insulation',
            text: 'High-density mineral rockwool batt insulation placed between stud cavities to minimize thermal transfer.'
          }
        ]
      },
      {
        title: '3. HYBRID ELECTRICAL & SOLAR INTEGRATION',
        bullets: [
          {
            label: 'Sub-Panel Segregation',
            text: 'Dedicated solar emergency sub-panel isolating heavy loads from essential household circuits during grid brownouts.'
          },
          {
            label: 'PEC Compliance & Commissioning',
            text: 'Full grounding rod verification, thermal scans of breaker busbars, and submission of net-metering documents.'
          }
        ]
      }
    ]
  },
  'proj-2': {
    id: 'proj-2',
    eyebrow: 'PROJECT BUILD',
    title: 'CAVITE COLD STORAGE SOLAR MICROGRID',
    client: 'IMUS LOGISTICS & COLD CHAIN CORP.',
    sector: 'INDUSTRIAL SOLAR ARRAYS',
    location: 'ANABU II, IMUS, CAVITE',
    managingEngineer: 'JERNALD DIVINA MESINA',
    engineerRole: 'Lead Power Systems Engineer, Solareign Energy',
    contractor: 'SOLAREIGN INDUSTRIAL EPC DIVISION',
    email: 'solareignpower09@gmail.com',
    engineerNote: 'Licensed electrical engineers managing heavy commercial string inverters, transformer step-ups, and net-metering synchronization.',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80',
        title: 'Industrial Rooftop Array',
        caption: '250 kWp bifacial monocrystalline array mounted on non-penetrating standing seam clamp mounts.'
      },
      {
        url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
        title: 'Commercial String Inverters',
        caption: 'High-voltage 3-phase commercial string inverters with integrated smart telemetry.'
      },
      {
        url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80',
        title: 'Transformer Interconnection',
        caption: 'Medium voltage utility interconnection synchronization and protection relays.'
      },
      {
        url: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80',
        title: 'Cold Storage Facility Overview',
        caption: 'Rooftop layout minimizing thermal absorption on cold warehouse chambers.'
      },
      {
        url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
        title: 'Quality Compliance Handover',
        caption: 'Utility bi-directional meter commission and final engineering sign-off.'
      }
    ],
    scopeSections: [
      {
        title: '1. PRE-CONSTRUCTION & FEASIBILITY AUDIT',
        bullets: [
          {
            label: 'Structural Load Analysis',
            text: 'Engineered wind tunnel calculations and roof purlin structural certification.'
          },
          {
            label: 'Utility Interconnection Clearance',
            text: 'Coordination of distribution impact studies (DIS) and interconnection clearance.'
          }
        ]
      },
      {
        title: '2. PHOTOVOLTAIC & INVERTER INFRASTRUCTURE',
        bullets: [
          {
            label: 'Standing Seam Clamps',
            text: 'Zero-penetration anodized aluminum clamps preserving 25-year roof waterproofing.'
          },
          {
            label: 'Bifacial Solar Modules',
            text: '455x 550W Tier-1 bifacial panels harvesting reflective irradiance from metal roof sheets.'
          }
        ]
      },
      {
        title: '3. GRID SYNCHRONIZATION & TELEMETRY',
        bullets: [
          {
            label: 'Zero-Export & Peak Shaving',
            text: 'Dynamic power curtailment controllers preventing reverse power flow until formal net-metering approval.'
          },
          {
            label: 'SCADA Telemetry Integration',
            text: 'Cloud-connected telemetry monitoring individual string performance and DC health.'
          }
        ]
      }
    ]
  },
  'proj-3': {
    id: 'proj-3',
    eyebrow: 'PROJECT BUILD',
    title: 'DASMARIÑAS COMMERCIAL MICROGRID',
    client: 'DASMARIÑAS MULTI-TENANT PLAZA',
    sector: 'COMMERCIAL MICROGRIDS',
    location: 'DASMARIÑAS, CAVITE',
    managingEngineer: 'JERNALD DIVINA MESINA',
    engineerRole: 'Project Director & Solar Systems Specialist',
    contractor: 'SOLAREIGN COMMERCIAL EPC TEAM',
    email: 'solareignpower09@gmail.com',
    engineerNote: 'Designed to offset high-tier commercial electricity tariffs during peak daylight commercial business hours.',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80',
        title: 'Commercial Plaza Rooftop Array',
        caption: '50 kWp grid-tied solar system delivering power directly to commercial tenants.'
      },
      {
        url: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80',
        title: 'Inverter Enclosure & Breakers',
        caption: 'Weatherproof NEMA-4X commercial inverter enclosure with DC surge suppressors.'
      },
      {
        url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80',
        title: 'Conduit Routing Along Parapet',
        caption: 'Clean, color-coded EMT conduit runs aligned with architectural aesthetics.'
      },
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        title: 'Pre-Commissioning Testing',
        caption: 'String open-circuit voltage (Voc) and short-circuit current (Isc) logging.'
      },
      {
        url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
        title: 'Aerial Solar Layout',
        caption: 'Even weight distribution over reinforced concrete commercial roof decking.'
      }
    ],
    scopeSections: [
      {
        title: '1. SYSTEM DESIGN & SHADING SIMULATION',
        bullets: [
          {
            label: '3D LiDAR Shading Study',
            text: 'Modeled surrounding parapets and HVAC chillers to eliminate hotspot degradations.'
          },
          {
            label: 'Tenant Sub-Metering Integration',
            text: 'Engineered multi-channel sub-metering allowing landlord billing reconciliation.'
          }
        ]
      },
      {
        title: '2. MECHANICAL & ELECTRICAL INSTALLATION',
        bullets: [
          {
            label: 'Corrosion-Resistant Racking',
            text: 'Marine-grade AL6005-T5 aluminum rails with stainless steel SUS304 hardware.'
          },
          {
            label: 'High-Efficiency Monocrystalline Panels',
            text: '92 units of 550W Tier-1 modules optimized for tropical high-irradiance conditions.'
          }
        ]
      },
      {
        title: '3. COMMISSIONING & UTILITY HANDOVER',
        bullets: [
          {
            label: 'Meralco DIS & Net Metering',
            text: 'Completed distribution impact study and installed bi-directional export meter.'
          },
          {
            label: 'Live Mobile Dashboard Access',
            text: 'Tenant management dashboard displaying live kWh savings and ROI payback.'
          }
        ]
      }
    ]
  },
  'proj-4': {
    id: 'proj-4',
    eyebrow: 'PROJECT BUILD',
    title: 'GENERAL TRIAS INDUSTRIAL SOLAR ARRAY',
    client: 'CAVITE MANUFACTURING & LOGISTICS CORP.',
    sector: 'INDUSTRIAL ARRAYS',
    location: 'GENERAL TRIAS, CAVITE',
    managingEngineer: 'JERNALD DIVINA MESINA',
    engineerRole: 'Industrial EPC Principal Engineer',
    contractor: 'SOLAREIGN INDUSTRIAL EPC DIVISION',
    email: 'solareignpower09@gmail.com',
    engineerNote: 'High-voltage industrial grid synchronization engineered for high-draw manufacturing machinery and automated lines.',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
        title: 'Manufacturing Warehouse Rooftop',
        caption: '200 kWp rooftop array reducing facility grid demand by over 40%.'
      },
      {
        url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
        title: 'Central Inverter Room',
        caption: 'High-efficiency industrial inverters with smart temperature-controlled ventilation.'
      },
      {
        url: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80',
        title: 'Cable Tray Network',
        caption: 'Heavy-duty galvanized cable trays running along the building exterior spine.'
      },
      {
        url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80',
        title: 'Substation Interconnection',
        caption: 'Medium-voltage synchronization and motorized circuit breaker interlocks.'
      },
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        title: 'Safety Inspection Sign-Off',
        caption: 'BFP and municipal electrical safety code compliance certification.'
      }
    ],
    scopeSections: [
      {
        title: '1. INDUSTRIAL LOAD PROFILE & PEAK SHAVING',
        bullets: [
          {
            label: '15-Minute Interval Demand Analysis',
            text: 'Logged historical factory machinery power peaks to calibrate inverter ramp rates.'
          },
          {
            label: 'Power Factor Optimization',
            text: 'Integrated automatic capacitor bank controls maintaining PF above 0.95.'
          }
        ]
      },
      {
        title: '2. DC STRINGING & STRUCTURAL INTEGRATION',
        bullets: [
          {
            label: 'Dual-Glass Bifacial PV Modules',
            text: '364 units of 550W bifacial modules delivering superior resistance to microcracks.'
          },
          {
            label: 'Wind Load Engineering (250 km/h)',
            text: 'Engineered specifically for Philippine super typhoons with wind tunnel verification.'
          }
        ]
      },
      {
        title: '3. AUTOMATED TELEMETRY & SUBSTATION COMMISSIONING',
        bullets: [
          {
            label: 'Industrial SCADA Protocol',
            text: 'Modbus TCP telemetry reporting real-time generation into the plant control room.'
          },
          {
            label: 'Utility Interconnection Sign-Off',
            text: 'Seamless synchronization with Cavite electric distribution network.'
          }
        ]
      }
    ]
  },
  'proj-5': {
    id: 'proj-5',
    eyebrow: 'PROJECT BUILD',
    title: 'TAGAYTAY AUTONOMOUS RESIDENTIAL SOLAR',
    client: 'HIGHLAND PRIVATE RESIDENCE & RETREAT',
    sector: 'RESIDENTIAL HYBRID',
    location: 'TAGAYTAY CITY, CAVITE',
    managingEngineer: 'JERNALD DIVINA MESINA',
    engineerRole: 'Senior Residential Solar Lead Specialist',
    contractor: 'SOLAREIGN RESIDENTIAL INSTALLATION TEAM',
    email: 'solareignpower09@gmail.com',
    engineerNote: 'Autonomous high-elevation energy system engineered for damp, misty climates with zero dependence on the municipal grid.',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        title: 'Highland Villa Solar Array',
        caption: '12 kWp all-black solar array tailored to steep residential roof pitch.'
      },
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        title: 'Victron MultiPlus Inverter Wall',
        caption: 'Dual Quattro inverter stack delivering clean pure sine wave power.'
      },
      {
        url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80',
        title: 'LiFePO4 Modular Battery Bank',
        caption: '25 kWh lithium iron phosphate energy storage rack with integrated BMS.'
      },
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        title: 'Auto-Start Generator Integration',
        caption: 'Dry contact automated backup diesel generator triggering during prolonged rainfall.'
      },
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        title: 'Finished Installation & Monitoring',
        caption: 'Color Control GX touchscreen and mobile telemetry active.'
      }
    ],
    scopeSections: [
      {
        title: '1. LOAD AUDIT & ENERGY BUDGETING',
        bullets: [
          {
            label: 'Highland Autonomy Sizing',
            text: 'Designed for 3 consecutive cloudy days without running generator backups.'
          },
          {
            label: 'HVAC & Inverter Load Balancing',
            text: 'Calculated inrush currents for water pumps, air conditioners, and kitchen equipment.'
          }
        ]
      },
      {
        title: '2. DC BATTERY STORAGE & PROTECTION',
        bullets: [
          {
            label: '25 kWh LiFePO4 Energy Bank',
            text: 'Grade-A prismatic lithium cells rated for over 6,000 cycles at 90% depth of discharge.'
          },
          {
            label: 'High-Elevation Wind Load Brackets',
            text: 'Custom stainless steel brackets engineered to withstand Tagaytay ridge wind gusting.'
          }
        ]
      },
      {
        title: '3. CLOUD TELEMETRY & REMOTE ASSISTANCE',
        bullets: [
          {
            label: 'Victron VRM Cloud Integration',
            text: 'Real-time telemetry and battery state-of-charge tracking accessible worldwide.'
          },
          {
            label: 'Fail-Safe Automatic Generator Relay',
            text: 'Automated exercise cycles keeping backup generators in peak working order.'
          }
        ]
      }
    ]
  },
  'proj-7': {
    id: 'proj-7',
    eyebrow: 'PROJECT BUILD',
    title: 'BACOOR SMART HYBRID RESIDENCE',
    client: 'BACOOR HOMEOWNER ESTATE',
    sector: 'RESIDENTIAL HYBRID',
    location: 'BACOOR CITY, CAVITE',
    managingEngineer: 'JERNALD DIVINA MESINA',
    engineerRole: 'Founder & Solar Systems Specialist',
    contractor: 'SOLAREIGN RESIDENTIAL INSTALLATION TEAM',
    email: 'solareignpower09@gmail.com',
    engineerNote: 'Aesthetic-first residential hybrid installation featuring concealed conduit paths and immediate emergency power failover.',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        title: 'Modern Two-Storey Rooftop Array',
        caption: '10 kWp Tier-1 monocrystalline panels installed on asphalt shingle roof.'
      },
      {
        url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
        title: 'Smart Hybrid Inverter Wall',
        caption: 'Wall-mounted hybrid inverter and modular 15 kWh battery cabinet.'
      },
      {
        url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80',
        title: 'Critical Load Sub-Panel',
        caption: 'Dedicated sub-panel providing zero-interruption power to home appliances.'
      },
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        title: 'Under-Tile Flashing & Leak Protection',
        caption: 'EPDM rubber waterproof boots and stainless steel mounting fasteners.'
      },
      {
        url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80',
        title: 'Net-Metering Sign-Off',
        caption: 'Bi-directional utility meter commissioning completed with Meralco Bacoor.'
      }
    ],
    scopeSections: [
      {
        title: '1. RESIDENTIAL LOAD ANALYSIS & ROOF AUDIT',
        bullets: [
          {
            label: 'Home Energy Audit',
            text: 'Evaluated nighttime air-conditioning demand to size battery storage precisely.'
          },
          {
            label: 'Roof Truss & Tile Assessment',
            text: 'Inspected timber trusses and installed zero-leak penetration flashings.'
          }
        ]
      },
      {
        title: '2. HYBRID STORAGE & CONCEALED WIRING',
        bullets: [
          {
            label: '15 kWh Wall-Mount Battery',
            text: 'Safe lithium iron phosphate chemistry with rapid sub-10ms automatic transfer switch.'
          },
          {
            label: 'Concealed Cable Raceways',
            text: 'Concealed wiring routed through ceiling cavities preserving home interior aesthetics.'
          }
        ]
      },
      {
        title: '3. NET METERING & LGU PERMITTING',
        bullets: [
          {
            label: 'Turnkey Utility Processing',
            text: 'Complete documentation submission and bi-directional meter release in Bacoor.'
          },
          {
            label: 'Mobile Monitoring Walkthrough',
            text: 'Client orientation on solar mobile tracking app and energy saving strategies.'
          }
        ]
      }
    ]
  },
  'proj-6': {
    id: 'proj-6',
    eyebrow: 'PROJECT BUILD',
    title: 'SILANG COMMERCIAL PEAK-SHAVING GRID',
    client: 'SILANG AGRI-COMMERCIAL HUB',
    sector: 'COMMERCIAL MICROGRIDS',
    location: 'SILANG, CAVITE',
    managingEngineer: 'JERNALD DIVINA MESINA',
    engineerRole: 'Lead Commercial Power Engineer',
    contractor: 'SOLAREIGN COMMERCIAL EPC TEAM',
    email: 'solareignpower09@gmail.com',
    engineerNote: 'Intelligent peak load shaving solar grid deployed to lower commercial demand surcharges for a fresh produce packing plant.',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
        title: 'Agri-Commercial Solar Facility',
        caption: '30 kWp commercial solar installation mounted on industrial standing seam roof.'
      },
      {
        url: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80',
        title: '3-Phase Smart Commercial Inverter',
        caption: 'High-efficiency inverter configured for automated load dispatch.'
      },
      {
        url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80',
        title: 'Commercial Energy Storage',
        caption: '30 kWh battery bank for power stabilization during grid voltage sags.'
      },
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        title: 'Surge Protection & Switchgear',
        caption: 'Heavy-duty Type 1+2 surge arresters protecting sensitive chilling compressors.'
      },
      {
        url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80',
        title: 'Production Handover',
        caption: 'Full documentation and commercial warranty handover ceremony.'
      }
    ],
    scopeSections: [
      {
        title: '1. TARIFF AUDIT & SIZING',
        bullets: [
          {
            label: 'Commercial Time-Of-Use Analysis',
            text: 'Mapped daily chilling cycles against peak commercial utility electricity tariffs.'
          },
          {
            label: 'Microgrid Architecture',
            text: 'Configured automated zero-export protection until utility inspection completion.'
          }
        ]
      },
      {
        title: '2. ENGINEERING EXECUTION & INSTALLATION',
        bullets: [
          {
            label: '55x 550W High-Efficiency Modules',
            text: 'Tier-1 monocrystalline panels installed with corrosion-resistant clamping.'
          },
          {
            label: 'Fast-Acting Surge Protection',
            text: 'Substation-grade circuit protection insulating facility against lightning surges.'
          }
        ]
      },
      {
        title: '3. NET METERING & TELEMETRY',
        bullets: [
          {
            label: 'Net-Metering Commissioning',
            text: 'Bi-directional meter installation facilitating excess daytime energy credits.'
          },
          {
            label: 'Continuous Cloud Diagnostics',
            text: '24/7 cloud diagnostics monitoring string health and energy production metrics.'
          }
        ]
      }
    ]
  },
  'proj-8': {
    id: 'proj-8',
    eyebrow: 'PROJECT BUILD',
    title: 'TRECE MARTIRES AGRO-INDUSTRIAL ARRAY',
    client: 'TRECE AGRO-INDUSTRIAL CORPORATION',
    sector: 'INDUSTRIAL ARRAYS',
    location: 'TRECE MARTIRES, CAVITE',
    managingEngineer: 'JERNALD DIVINA MESINA',
    engineerRole: 'Industrial EPC Principal Engineer',
    contractor: 'SOLAREIGN INDUSTRIAL EPC DIVISION',
    email: 'solareignpower09@gmail.com',
    engineerNote: 'Ground-mounted multi-string solar field engineered for agricultural processing and food preservation loads.',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
        title: 'Ground-Mounted Solar Field',
        caption: '150 kWp ground-mounted solar installation with reinforced helical piles.'
      },
      {
        url: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80',
        title: 'Helical Ground Mount Foundations',
        caption: 'Hot-dip galvanized steel foundations driven 2.5 meters into firm subsoil.'
      },
      {
        url: 'https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&w=1200&q=80',
        title: 'Underground DC Feeder Runs',
        caption: 'Heavy-gauge armored solar cables buried inside concrete-encased duct banks.'
      },
      {
        url: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?auto=format&fit=crop&w=1200&q=80',
        title: 'Industrial Combiner Boxes',
        caption: 'NEMA-4X combiner boxes equipped with string fuses and remote disconnects.'
      },
      {
        url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
        title: 'Plant Commissioning Sign-Off',
        caption: 'Final commissioning and IV curve diagnostic validation.'
      }
    ],
    scopeSections: [
      {
        title: '1. GEOTECHNICAL & FOUNDATION ENGINEERING',
        bullets: [
          {
            label: 'Soil Borehole Testing',
            text: 'Determined soil resistivity and load-bearing parameters for helical piles.'
          },
          {
            label: 'Drainage & Erosion Control',
            text: 'Engineered swales and crushed rock ground cover preventing muddy runoff.'
          }
        ]
      },
      {
        title: '2. PHOTOVOLTAIC ASSEMBLY & STRINGING',
        bullets: [
          {
            label: '272x 550W Bifacial Modules',
            text: 'Dual-glass design maximizing solar absorption from both direct and ground-reflected albedo.'
          },
          {
            label: 'Reinforced 250 km/h Racking',
            text: 'Hot-dip galvanized steel framework engineered for maximum Philippine typhoon survivability.'
          }
        ]
      },
      {
        title: '3. GRID SYNCHRONIZATION & SUBSTATION COMMISSIONING',
        bullets: [
          {
            label: 'Substation Interconnection',
            text: 'Direct connection into industrial facility step-up substation with synchronized breakers.'
          },
          {
            label: 'Automated String Fault Telemetry',
            text: 'Continuous IV curve scanning identifying localized panel or connector anomalies automatically.'
          }
        ]
      }
    ]
  }
};

/**
 * Returns the newest published projects, sorted by publication date descending.
 */
export function getNewestProjects(limit: number = 5): ProjectItem[] {
  return [...PORTFOLIO_PROJECTS]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, limit);
}

/**
 * Retrieve a project by its unique ID.
 */
export function getProjectById(id: string): ProjectItem | undefined {
  return PORTFOLIO_PROJECTS.find((p) => p.id === id);
}

/**
 * Retrieve rich project details by ID with fallback.
 */
export function getProjectDetailById(id: string): ProjectDetail {
  if (PROJECTS_DATA_MAP[id]) {
    return PROJECTS_DATA_MAP[id];
  }
  const fallback = PORTFOLIO_PROJECTS.find((p) => p.id === id) || PORTFOLIO_PROJECTS[0];
  return {
    id: fallback.id,
    eyebrow: 'PROJECT BUILD',
    title: fallback.title.toUpperCase(),
    client: fallback.clientName?.trim().toUpperCase() || 'CONFIDENTIAL CLIENT',
    sector: fallback.segment ? fallback.segment.toUpperCase() : fallback.category.toUpperCase(),
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
      },
      {
        title: '2. ENGINEERING INSTALLATION & SPECIFICATIONS',
        bullets: [
          {
            label: 'Hardware Specification',
            text: `${fallback.panelWattage} coupled with ${fallback.inverterBrand}.`
          },
          {
            label: 'Capacity & Output',
            text: `System capacity of ${fallback.capacity} delivering estimated ${fallback.annualGeneration}.`
          }
        ]
      },
      {
        title: '3. QUALITY COMMISSIONING & UTILITY INTEGRATION',
        bullets: [
          {
            label: 'Key Engineering Highlights',
            text: fallback.highlights.join('; ')
          }
        ]
      }
    ]
  };
}
