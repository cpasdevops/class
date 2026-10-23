import express from 'express';
import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import type { WorkshopResource, DownloadEvent, AnalyticsSummary } from './src/types/resources.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_DEV = process.env.NODE_ENV !== 'production';

app.use(express.json());

// Directories
const DATA_DIR = path.resolve('server_data');
const FILES_DIR = path.join(DATA_DIR, 'files');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

fs.mkdirSync(FILES_DIR, { recursive: true });

// Initial Resource Definitions (Raw URLs remain strictly server-side and never exposed)
const RESOURCES_CONFIG: Omit<WorkshopResource, 'downloadCount' | 'lastDownloadedAt' | 'sizeBytes' | 'sizeFormatted'>[] = [
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
    tags: ['DOCX', 'Claude', 'HTML Dashboard', 'Excel Parser', 'Interactive KPIs', 'Slicers']
  }
];

// Helper to format file sizes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Analytics Store Interface
interface StoredAnalytics {
  counts: Record<string, number>;
  lastDownloaded: Record<string, string>;
  events: DownloadEvent[];
}

// Initial realistic seed counts for workshop attendees
function getInitialAnalytics(): StoredAnalytics {
  const counts: Record<string, number> = {
    'sourcing-supplier-quotes': 64,
    'google-ai-studio-prompt': 58,
    'lovable-spreadsheet-headers': 42,
    'lovable-prompt': 47,
    'dashboard-eng-projects': 53,
    'claude-connector-questions': 59,
    'claude-html-dashboard-prompt': 49
  };

  const now = new Date();
  const lastDownloaded: Record<string, string> = {};
  const events: DownloadEvent[] = [];

  const deviceTypes: ('Desktop' | 'Mobile' | 'Tablet')[] = ['Desktop', 'Desktop', 'Desktop', 'Mobile', 'Tablet'];
  const resourceKeys = Object.keys(counts);

  // Generate realistic recent download logs
  for (let i = 0; i < 30; i++) {
    const resId = resourceKeys[i % resourceKeys.length];
    const cfg = RESOURCES_CONFIG.find(r => r.id === resId);
    const timeOffset = (i * 3 + Math.floor(Math.random() * 5)) * 60 * 1000;
    const timestamp = new Date(now.getTime() - timeOffset).toISOString();
    
    if (!lastDownloaded[resId]) {
      lastDownloaded[resId] = timestamp;
    }

    events.push({
      id: `evt-${Date.now()}-${i}`,
      resourceId: resId,
      filename: cfg?.filename || 'resource',
      timestamp,
      deviceType: deviceTypes[i % deviceTypes.length]
    });
  }

  return { counts, lastDownloaded, events };
}

// Load or initialize persistent analytics
function loadAnalytics(): StoredAnalytics {
  try {
    if (fs.existsSync(ANALYTICS_FILE)) {
      const data = JSON.parse(fs.readFileSync(ANALYTICS_FILE, 'utf-8'));
      if (data && typeof data.counts === 'object') {
        return data;
      }
    }
  } catch (err) {
    console.warn('Failed reading analytics.json, initializing fresh store:', err);
  }

  const initial = getInitialAnalytics();
  saveAnalytics(initial);
  return initial;
}

function saveAnalytics(data: StoredAnalytics) {
  try {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save analytics.json:', err);
  }
}

let analyticsState = loadAnalytics();

// Get enriched resource list
function getEnrichedResources(): WorkshopResource[] {
  return RESOURCES_CONFIG.map(config => {
    const filePath = path.join(FILES_DIR, config.filename);
    let sizeBytes = 0;
    try {
      if (fs.existsSync(filePath)) {
        sizeBytes = fs.statSync(filePath).size;
      }
    } catch {
      sizeBytes = 15000;
    }

    return {
      ...config,
      sizeBytes,
      sizeFormatted: formatBytes(sizeBytes),
      downloadCount: analyticsState.counts[config.id] || 0,
      lastDownloadedAt: analyticsState.lastDownloaded[config.id] || null
    };
  });
}

// Record a download event
function recordDownload(resourceId: string, filename: string, userAgent = '', isBundle = false) {
  analyticsState.counts[resourceId] = (analyticsState.counts[resourceId] || 0) + 1;
  const now = new Date().toISOString();
  analyticsState.lastDownloaded[resourceId] = now;

  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (/iPad|Tablet/i.test(userAgent)) deviceType = 'Tablet';
  else if (/Mobile|Android|iPhone/i.test(userAgent)) deviceType = 'Mobile';

  analyticsState.events.unshift({
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    resourceId,
    filename,
    timestamp: now,
    deviceType,
    isBundle
  });

  // Keep last 100 events
  if (analyticsState.events.length > 100) {
    analyticsState.events = analyticsState.events.slice(0, 100);
  }

  saveAnalytics(analyticsState);
}

// --- API Endpoints ---

// 1. Get all resources list (Protected: No external URLs exposed)
app.get('/api/resources', (req, res) => {
  const resources = getEnrichedResources();
  res.json({ success: true, resources });
});

// 2. Download specific file by ID
app.get('/api/download/:id', (req, res) => {
  const { id } = req.params;
  const resource = RESOURCES_CONFIG.find(r => r.id === id);

  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  const filePath = path.join(FILES_DIR, resource.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File temporarily unavailable on server' });
  }

  const userAgent = req.headers['user-agent'] || '';
  recordDownload(resource.id, resource.filename, userAgent, false);

  const contentType = resource.format === 'xlsx'
    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  res.setHeader('Content-Disposition', `attachment; filename="${resource.filename}"`);
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// 3. Download All / Bundle as ZIP
app.get('/api/download-bundle', async (req, res) => {
  try {
    const zip = new JSZip();
    const userAgent = req.headers['user-agent'] || '';

    for (const config of RESOURCES_CONFIG) {
      const filePath = path.join(FILES_DIR, config.filename);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath);
        zip.file(config.filename, fileContent);
        recordDownload(config.id, config.filename, userAgent, true);
      }
    }

    // Add a README to the ZIP
    const readmeContent = [
      '==============================================================',
      'AI & Engineering Analytics Bootcamp - Workshop Resources',
      '==============================================================',
      '',
      'Section: Workshop Resources',
      'Downloaded on: ' + new Date().toUTCString(),
      '',
      'INCLUDED FILES:',
      '1. Sourcing_Supplier_Quotes.xlsx (119 supplier quotes, 18 columns, benchmarks & savings)',
      '2. Google_AI_Studio_Prompt.docx (Prompt specification for Google AI Studio & Gemini 2.5 Flash)',
      '3. Lovable_Landing_Page_Spreadsheet_Headers.xlsx (Form input schemas & headers)',
      '4. Lovable_Prompt.docx (Mohali Service Desk application prompt)',
      '5. Dashboard_Eng_Projects.xlsx (16 project metrics, planned vs actual hours & overrun flags)',
      '6. Claude_Connector_Supplier_Quotes_Questions.docx (Claude Drive connector prompts & validation)',
      '7. Claude_HTML_Dashboard_Prompt.docx (Interactive HTML dashboard prompt with Excel upload)',
      '',
      'All files are for official workshop & bootcamp exercise usage.',
      'Enjoy building!'
    ].join('\n');

    zip.file('README_WORKSHOP.txt', readmeContent);

    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    res.setHeader('Content-Disposition', 'attachment; filename="AI_Bootcamp_Workshop_Resources.zip"');
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Length', zipBuffer.length.toString());
    res.end(zipBuffer);
  } catch (error) {
    console.error('Bundle error:', error);
    res.status(500).json({ error: 'Failed to create bundle archive' });
  }
});

// 4. Download Analytics Summary
app.get('/api/analytics', (req, res) => {
  const resources = getEnrichedResources();
  const totalDownloads = Object.values(analyticsState.counts).reduce((a, b) => a + b, 0);

  let mostPopular: AnalyticsSummary['mostPopularResource'] = null;
  let maxCount = -1;

  const byCategory: Record<string, number> = {};
  const byTool: Record<string, number> = {};
  let xlsxCount = 0;
  let docxCount = 0;

  for (const r of resources) {
    if (r.downloadCount > maxCount) {
      maxCount = r.downloadCount;
      mostPopular = { id: r.id, title: r.title, count: r.downloadCount };
    }

    byCategory[r.category] = (byCategory[r.category] || 0) + r.downloadCount;
    byTool[r.targetTool] = (byTool[r.targetTool] || 0) + r.downloadCount;

    if (r.format === 'xlsx') xlsxCount += r.downloadCount;
    if (r.format === 'docx') docxCount += r.downloadCount;
  }

  // Calculate hourly activity distribution
  const hourMap: Record<string, number> = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const h = new Date(now.getTime() - i * 60 * 60 * 1000);
    const label = `${h.getHours().toString().padStart(2, '0')}:00`;
    hourMap[label] = 0;
  }

  for (const evt of analyticsState.events) {
    const evtTime = new Date(evt.timestamp);
    const label = `${evtTime.getHours().toString().padStart(2, '0')}:00`;
    if (hourMap[label] !== undefined) {
      hourMap[label]++;
    }
  }

  const hourlyActivity = Object.entries(hourMap).map(([hour, count]) => ({ hour, count }));

  const summary: AnalyticsSummary = {
    totalDownloads,
    totalResources: resources.length,
    mostPopularResource: mostPopular,
    byFormat: { xlsx: xlsxCount, docx: docxCount },
    byCategory,
    byTool,
    recentDownloads: analyticsState.events.slice(0, 15),
    hourlyActivity
  };

  res.json({ success: true, summary });
});

// 5. Reset / Re-seed Analytics (For demo testing)
app.post('/api/analytics/reset', (req, res) => {
  analyticsState = getInitialAnalytics();
  saveAnalytics(analyticsState);
  res.json({ success: true, message: 'Analytics reset to demo baseline' });
});

// Start dev server with Vite middlewares OR serve production build
async function startServer() {
  if (IS_DEV) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (${IS_DEV ? 'development' : 'production'})`);
  });
}

startServer();
