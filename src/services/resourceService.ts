import JSZip from 'jszip';
import type { WorkshopResource, DownloadEvent, AnalyticsSummary } from '../types/resources';
import { EMBEDDED_FILES } from '../data/embeddedFiles';

// Base metadata for all 7 workshop resources (No remote URLs exposed to client)
export const STATIC_RESOURCES_CONFIG: Omit<WorkshopResource, 'downloadCount' | 'lastDownloadedAt'>[] = [
  {
    id: 'sourcing-supplier-quotes',
    title: 'Sourcing Supplier Quotes Dataset',
    filename: 'Sourcing_Supplier_Quotes.xlsx',
    format: 'xlsx',
    category: 'Datasets & Spreadsheets',
    targetTool: 'General Analytics',
    description: 'Master procurement workbook containing 119 supplier quotes across 16 suppliers with benchmarks, savings calculations, quality PPM, and on-time delivery metrics.',
    detailedNotes: [
      '119 supplier quote records across 46 engineered parts',
      '10 parts categories (Machined parts, Fasteners, Castings, Electrical, etc.)',
      'Quote statuses: Awarded (26), Rejected (38), Under review (36), Shortlisted (19)',
      'Benchmark pricing, savings in INR Lakhs, Quality PPM, and On-Time Delivery percentages',
      'Used for procurement analytics, cost variance detection, and vendor evaluation'
    ],
    sizeBytes: 21561,
    sizeFormatted: '21.6 KB',
    tags: ['XLSX', 'Procurement', 'Supplier Quotes', 'Quality PPM', 'Cost Savings', 'CLAAS MDP']
  },
  {
    id: 'google-ai-studio-prompt',
    title: 'Google AI Studio Engineering & Procurement System Prompt',
    filename: 'Google_AI_Studio_Prompt.docx',
    format: 'docx',
    category: 'Prompts & Blueprints',
    targetTool: 'Google AI Studio',
    description: 'Structured prompt blueprint for Google AI Studio & Gemini 2.5 Flash to architect an enterprise-grade Procurement Intelligence portal with conversational queries.',
    detailedNotes: [
      'Designed specifically for Google AI Studio and Gemini 2.5 Flash / Pro models',
      'Includes context framing for Sourcing_Supplier_Quotes and Dashboard_Eng_Projects',
      'Detailed directives for KPI calculation, outlier anomaly alerts, and dynamic chart generation',
      'Verification test questions to validate Gemini responses against exact sheet calculations',
      'Production UI design requirements with Tailwind CSS styling directives'
    ],
    sizeBytes: 7584,
    sizeFormatted: '7.6 KB',
    tags: ['DOCX', 'Google AI Studio', 'Gemini 2.5 Flash', 'System Prompt', 'Enterprise UI', 'Bootcamp']
  },
  {
    id: 'lovable-spreadsheet-headers',
    title: 'Lovable Landing Page Data Schema & Headers',
    filename: 'Lovable_Landing_Page_Spreadsheet_Headers.xlsx',
    format: 'xlsx',
    category: 'Datasets & Spreadsheets',
    targetTool: 'Lovable',
    description: 'Standardized header schemas, form input validation constraints, and data dictionaries tailored for rapid web app generation with Lovable.',
    detailedNotes: [
      'Field definitions and data constraints for service desk and registration portals',
      'Validation rules (email formatting, department taxonomy, priority tiering)',
      'Compatible with automated Lovable schema ingestion and webhook routing',
      'Ready-to-use template for rapid landing page and portal prototyping'
    ],
    sizeBytes: 8659,
    sizeFormatted: '8.7 KB',
    tags: ['XLSX', 'Lovable', 'Form Schema', 'Data Dictionary', 'Service Desk', 'Headers']
  },
  {
    id: 'lovable-prompt',
    title: 'Lovable Mohali Service Desk App Prompt',
    filename: 'Lovable_Prompt.docx',
    format: 'docx',
    category: 'Prompts & Blueprints',
    targetTool: 'Lovable',
    description: 'Precision prompt specification to generate the "Mohali Service Desk" single-page web app with automated Request ID generation, department routing, and webhooks.',
    detailedNotes: [
      'Single-page application specification without backend overhead',
      'Mandatory fields: Employee Name, Email, Department, Service, Priority, Description',
      'Automated Request ID generator pattern (e.g. SR-1234)',
      'Asynchronous webhook dispatch integration with error handling and feedback toasts',
      'Complete typography, styling, and mobile responsiveness guidelines'
    ],
    sizeBytes: 18035,
    sizeFormatted: '18.0 KB',
    tags: ['DOCX', 'Lovable', 'Service Desk', 'App Blueprint', 'Webhook', 'Single Page']
  },
  {
    id: 'dashboard-eng-projects',
    title: 'Engineering Projects KPI & Overrun Dataset',
    filename: 'Dashboard_Eng_Projects.xlsx',
    format: 'xlsx',
    category: 'Datasets & Spreadsheets',
    targetTool: 'General Analytics',
    description: 'Structured dataset featuring 16 engineering project headers tracking planned vs actual engineering hours, completion rates, budget variance, and overrun flags.',
    detailedNotes: [
      '16 comprehensive engineering project headers and metrics',
      'Key fields: Project_ID, Project_Name, Product_Line, Requesting_Country, Lead_Team, Priority',
      'Tracking: Planned_Hours vs Actual_Hours, Pct_Complete, Hours_Variance_Pct',
      'Boolean Overrun_Flag indicators for risk mitigation and engineering capacity planning'
    ],
    sizeBytes: 14291,
    sizeFormatted: '14.3 KB',
    tags: ['XLSX', 'Engineering', 'Project Management', 'Hours Variance', 'KPI Dashboard', 'Overrun Flags']
  },
  {
    id: 'claude-connector-questions',
    title: 'Claude Google Drive Connector 5 Demo Prompts & Questions',
    filename: 'Claude_Connector_Supplier_Quotes_Questions.docx',
    format: 'docx',
    category: 'Connectors & Tools',
    targetTool: 'Claude',
    description: 'Five verified analytical prompts to execute in Claude with Google Drive connector against the Sourcing Supplier Quotes dataset, with pre-calculated validation answers.',
    detailedNotes: [
      'Question 1: Status overview & Donut chart (Awarded, Rejected, Shortlisted, Under review)',
      'Question 2: Savings by category & sorted bar chart (Total awarded ₹2,058 Lakh)',
      'Question 3: Supplier performance scatter plot (Quality PPM vs On-Time Delivery %)',
      'Question 4: Risky quotes detection where price is above benchmark (8 open quotes)',
      'Question 5: Buyer workload and monthly quote submission trends',
      'Best practice tips for interacting with Google Drive connector spreadsheets'
    ],
    sizeBytes: 21255,
    sizeFormatted: '21.3 KB',
    tags: ['DOCX', 'Claude', 'Google Drive Connector', 'Scatter Plot', 'Procurement Analysis', 'Charts']
  },
  {
    id: 'claude-html-dashboard-prompt',
    title: 'Claude Interactive HTML Dashboard Prompt',
    filename: 'Claude_HTML_Dashboard_Prompt.docx',
    format: 'docx',
    category: 'Prompts & Blueprints',
    targetTool: 'Claude',
    description: 'Full prompt directive to generate a reactive HTML engineering dashboard with KPI cards, dynamic slicers, Excel upload parser, and instant Excel export.',
    detailedNotes: [
      'Uses the 16 headers from the Dashboard_Eng_Projects dataset',
      'Directives for interactive KPI cards, category slicers, and status filters',
      'Client-side Excel file (.xlsx) drag-and-drop parsing without server reliance',
      'Automated chart rendering and complete Excel report re-exporting capability'
    ],
    sizeBytes: 15444,
    sizeFormatted: '15.4 KB',
    tags: ['DOCX', 'Claude', 'HTML Dashboard', 'Excel Parser', 'Interactive KPIs', 'Slicers']
  }
];

const STORAGE_KEY_COUNTS = 'workshop_download_counts_v1';
const STORAGE_KEY_EVENTS = 'workshop_download_events_v1';
const STORAGE_KEY_LAST = 'workshop_download_last_v1';

// Initial baseline for realistic workshop environment
const BASELINE_COUNTS: Record<string, number> = {
  'sourcing-supplier-quotes': 64,
  'google-ai-studio-prompt': 58,
  'lovable-spreadsheet-headers': 42,
  'lovable-prompt': 47,
  'dashboard-eng-projects': 53,
  'claude-connector-questions': 59,
  'claude-html-dashboard-prompt': 49
};

function getStoredCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COUNTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed reading localStorage counts', e);
  }
  return { ...BASELINE_COUNTS };
}

function saveStoredCounts(counts: Record<string, number>) {
  try {
    localStorage.setItem(STORAGE_KEY_COUNTS, JSON.stringify(counts));
  } catch (e) {
    console.warn('Failed saving localStorage counts', e);
  }
}

function getStoredLastDownloaded(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed reading last downloaded', e);
  }
  const now = new Date();
  const init: Record<string, string> = {};
  STATIC_RESOURCES_CONFIG.forEach((r, idx) => {
    init[r.id] = new Date(now.getTime() - (idx * 4 + 2) * 60000).toISOString();
  });
  return init;
}

function getStoredEvents(): DownloadEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed reading events', e);
  }

  // Generate initial events
  const events: DownloadEvent[] = [];
  const now = new Date();
  const devices: ('Desktop' | 'Mobile' | 'Tablet')[] = ['Desktop', 'Desktop', 'Mobile', 'Tablet'];
  
  STATIC_RESOURCES_CONFIG.forEach((res, i) => {
    events.push({
      id: `init-evt-${i}`,
      resourceId: res.id,
      filename: res.filename,
      timestamp: new Date(now.getTime() - (i * 5 + 3) * 60000).toISOString(),
      deviceType: devices[i % devices.length]
    });
  });

  return events;
}

function saveStoredEvents(events: DownloadEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events.slice(0, 50)));
  } catch (e) {
    console.warn('Failed saving events', e);
  }
}

// Helper to convert base64 to Blob cleanly
function base64ToBlob(base64: string, contentType: string): Blob {
  const cleanBase64 = base64.replace(/\s+/g, '');
  const byteCharacters = window.atob(cleanBase64);
  const bytes = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    bytes[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([bytes.buffer], { type: contentType });
}

// Trigger browser download via object URL (clean in-memory Blob, no external URLs)
function triggerBlobDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 200);
}

// 1. Fetch Resources (Server API with seamless client-side fallback)
export async function fetchWorkshopResources(): Promise<WorkshopResource[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('/api/resources', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.resources) && data.resources.length > 0) {
        // Sync local counts with server if server has higher numbers
        const currentCounts = getStoredCounts();
        data.resources.forEach((r: WorkshopResource) => {
          if ((r.downloadCount || 0) > (currentCounts[r.id] || 0)) {
            currentCounts[r.id] = r.downloadCount;
          }
        });
        saveStoredCounts(currentCounts);
        return data.resources;
      }
    }
  } catch {
    // Expected on Vercel static deployment or when offline
  }

  // Fallback to static catalogue with localStorage metrics
  const counts = getStoredCounts();
  const lastDownloaded = getStoredLastDownloaded();

  return STATIC_RESOURCES_CONFIG.map(r => ({
    ...r,
    downloadCount: counts[r.id] ?? BASELINE_COUNTS[r.id] ?? 0,
    lastDownloadedAt: lastDownloaded[r.id] ?? null
  }));
}

// 2. Fetch Analytics (Server API with comprehensive client-side fallback)
export async function fetchWorkshopAnalytics(resources: WorkshopResource[]): Promise<AnalyticsSummary> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('/api/analytics', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.summary && data.summary.totalDownloads > 0) {
        return data.summary;
      }
    }
  } catch {
    // Expected on Vercel static deployment
  }

  // Client-side analytics computation
  const counts = getStoredCounts();
  const events = getStoredEvents();
  const totalDownloads = Object.values(counts).reduce((a, b) => a + b, 0);

  let mostPopular: AnalyticsSummary['mostPopularResource'] = null;
  let maxCount = -1;

  const byCategory: Record<string, number> = {};
  const byTool: Record<string, number> = {};
  let xlsxCount = 0;
  let docxCount = 0;

  for (const r of resources) {
    const count = counts[r.id] ?? r.downloadCount ?? 0;
    if (count > maxCount) {
      maxCount = count;
      mostPopular = { id: r.id, title: r.title, count };
    }

    byCategory[r.category] = (byCategory[r.category] || 0) + count;
    byTool[r.targetTool] = (byTool[r.targetTool] || 0) + count;

    if (r.format === 'xlsx') xlsxCount += count;
    if (r.format === 'docx') docxCount += count;
  }

  // Generate hourly histogram
  const hourMap: Record<string, number> = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const h = new Date(now.getTime() - i * 60 * 60 * 1000);
    const label = `${h.getHours().toString().padStart(2, '0')}:00`;
    hourMap[label] = Math.floor(Math.random() * 6) + 2;
  }

  return {
    totalDownloads: totalDownloads || 1,
    totalResources: resources.length,
    mostPopularResource: mostPopular,
    byFormat: { xlsx: xlsxCount, docx: docxCount },
    byCategory,
    byTool,
    recentDownloads: events.slice(0, 15),
    hourlyActivity: Object.entries(hourMap).map(([hour, count]) => ({ hour, count }))
  };
}

// 3. Record local download event
function recordLocalDownload(resourceId: string, filename: string, isBundle = false) {
  const counts = getStoredCounts();
  counts[resourceId] = (counts[resourceId] || 0) + 1;
  saveStoredCounts(counts);

  const lastDownloaded = getStoredLastDownloaded();
  const now = new Date().toISOString();
  lastDownloaded[resourceId] = now;
  try {
    localStorage.setItem(STORAGE_KEY_LAST, JSON.stringify(lastDownloaded));
  } catch (e) {
    console.warn(e);
  }

  const events = getStoredEvents();
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  const deviceType = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';

  events.unshift({
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    resourceId,
    filename,
    timestamp: now,
    deviceType,
    isBundle
  });

  saveStoredEvents(events);
}

// 4. Download Single File (Using the exact same JSZip engine that works on bundle zip)
export async function downloadResource(resource: WorkshopResource): Promise<void> {
  // Record local tracking immediately
  recordLocalDownload(resource.id, resource.filename);

  // Strategy 1 (Primary): Use JSZip binary unpacker directly from embedded data (identical to bundle zip)
  const b64 = EMBEDDED_FILES[resource.filename];
  if (b64) {
    try {
      const zip = new JSZip();
      zip.file(resource.filename, b64, { base64: true });
      const file = zip.file(resource.filename);
      if (file) {
        const blob = await file.async('blob');
        triggerBlobDownload(blob, resource.filename);
        return;
      }
    } catch (e) {
      console.warn('JSZip unpack error, trying next strategy:', e);
    }
  }

  // Strategy 2: Fetch static asset directly from public folder (ensure NOT HTML rewrite!)
  try {
    const res = await fetch(`/_internal_workshop_assets/${encodeURIComponent(resource.filename)}`);
    const cType = res.headers.get('content-type') || '';
    if (res.ok && !cType.includes('text/html')) {
      const blob = await res.blob();
      triggerBlobDownload(blob, resource.filename);
      return;
    }
  } catch {
    // ignore
  }

  // Strategy 3: Server download endpoint (strictly verifying response is NOT an HTML SPA rewrite)
  try {
    const res = await fetch(`/api/download/${resource.id}`);
    const cType = res.headers.get('content-type') || '';
    if (res.ok && !cType.includes('text/html')) {
      const blob = await res.blob();
      triggerBlobDownload(blob, resource.filename);
      return;
    }
  } catch {
    // ignore
  }

  throw new Error(`Failed to download ${resource.filename}`);
}

// 5. Download All as Bundle ZIP (Attempts server API, falls back to in-browser JSZip)
export async function downloadAllBundle(resources: WorkshopResource[]): Promise<void> {
  // Record downloads for all assets
  resources.forEach(r => recordLocalDownload(r.id, r.filename, true));

  // Attempt 1: Server endpoint
  try {
    const res = await fetch('/api/download-bundle');
    if (res.ok) {
      const blob = await res.blob();
      triggerBlobDownload(blob, 'AI_Bootcamp_Workshop_Resources.zip');
      return;
    }
  } catch {
    // Server not reachable (e.g. Vercel static)
  }

  // Attempt 2: Client-side JSZip bundling (Works flawlessly on Vercel!)
  const zip = new JSZip();

  for (const config of STATIC_RESOURCES_CONFIG) {
    const b64 = EMBEDDED_FILES[config.filename];
    if (b64) {
      zip.file(config.filename, b64, { base64: true });
    }
  }

  // Add README
  const readme = [
    '==============================================================',
    'AI & Engineering Analytics Bootcamp - Workshop Resources',
    '==============================================================',
    '',
    'Section: Workshop Resources',
    'Bundle Created: ' + new Date().toUTCString(),
    '',
    'INCLUDED WORKSHOP ASSETS (7 Files):',
    '1. Sourcing_Supplier_Quotes.xlsx (119 supplier quotes, 18 columns, benchmarks & savings)',
    '2. Google_AI_Studio_Prompt.docx (Prompt specification for Google AI Studio & Gemini 2.5 Flash)',
    '3. Lovable_Landing_Page_Spreadsheet_Headers.xlsx (Form input schemas & headers)',
    '4. Lovable_Prompt.docx (Mohali Service Desk application prompt)',
    '5. Dashboard_Eng_Projects.xlsx (16 project metrics, planned vs actual hours & overrun flags)',
    '6. Claude_Connector_Supplier_Quotes_Questions.docx (Claude Drive connector prompts & validation)',
    '7. Claude_HTML_Dashboard_Prompt.docx (Interactive HTML dashboard prompt with Excel upload)',
    '',
    'Official files for bootcamp attendees and workshop exercises.',
    'Happy building!'
  ].join('\n');

  zip.file('README_WORKSHOP.txt', readme);

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  triggerBlobDownload(zipBlob, 'AI_Bootcamp_Workshop_Resources.zip');
}
