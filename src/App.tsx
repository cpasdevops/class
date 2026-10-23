import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Download,
  FolderArchive,
  Layers,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Info
} from 'lucide-react';

import type { WorkshopResource, AnalyticsSummary } from './types/resources';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { ResourceCard } from './components/ResourceCard';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { ResourceDetailModal } from './components/ResourceDetailModal';

export default function App() {
  const [resources, setResources] = useState<WorkshopResource[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState<Record<string, boolean>>({});
  const [isDownloadingBundle, setIsDownloadingBundle] = useState(false);
  const [selectedResource, setSelectedResource] = useState<WorkshopResource | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'size'>('popular');

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Fetch initial data
  const fetchData = async (isBackground = false) => {
    if (!isBackground) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [resRes, resAnalytics] = await Promise.all([
        fetch('/api/resources').then(r => r.json()),
        fetch('/api/analytics').then(r => r.json())
      ]);

      if (resRes.success) {
        setResources(resRes.resources);
      }
      if (resAnalytics.success) {
        setAnalytics(resAnalytics.summary);
      }
    } catch (error) {
      console.error('Failed to fetch workshop data:', error);
      showToast('Error syncing workshop resources', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Single File Download Handler (Pure action - No raw links exposed!)
  const handleDownload = async (resource: WorkshopResource) => {
    if (downloadingIds[resource.id]) return;

    setDownloadingIds(prev => ({ ...prev, [resource.id]: true }));

    // Optimistic counter increment for instantaneous feedback
    setResources(prev =>
      prev.map(r =>
        r.id === resource.id
          ? {
              ...r,
              downloadCount: r.downloadCount + 1,
              lastDownloadedAt: new Date().toISOString()
            }
          : r
      )
    );

    try {
      const response = await fetch(`/api/download/${resource.id}`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = objectUrl;
      tempLink.setAttribute('download', resource.filename);
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(objectUrl);

      // Trigger festive celebration burst
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: resource.format === 'xlsx' ? ['#10b981', '#059669', '#34d399'] : ['#3b82f6', '#6366f1', '#818cf8']
      });

      showToast(`Downloading ${resource.filename} (${resource.sizeFormatted}) — Download logged!`, 'success');

      // Refresh analytics in background to sync state
      setTimeout(() => {
        fetchData(true);
      }, 500);
    } catch (err) {
      console.error('Download error:', err);
      showToast(`Could not download ${resource.filename}`, 'error');
      // Revert optimistic count on error
      fetchData(true);
    } finally {
      setDownloadingIds(prev => ({ ...prev, [resource.id]: false }));
    }
  };

  // Download All as Bundle (.ZIP)
  const handleDownloadAll = async () => {
    if (isDownloadingBundle) return;
    setIsDownloadingBundle(true);

    try {
      const response = await fetch('/api/download-bundle');
      if (!response.ok) throw new Error('Bundle download failed');

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = objectUrl;
      tempLink.setAttribute('download', 'AI_Bootcamp_Workshop_Resources.zip');
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(objectUrl);

      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 }
      });

      showToast('All 7 Workshop Resources bundled and downloaded successfully!', 'success');
      fetchData(true);
    } catch (err) {
      console.error('Bundle error:', err);
      showToast('Could not bundle workshop files', 'error');
    } finally {
      setIsDownloadingBundle(false);
    }
  };

  // Filtered & Sorted Resources
  const filteredResources = useMemo(() => {
    return resources
      .filter(res => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = res.title.toLowerCase().includes(q);
          const matchDesc = res.description.toLowerCase().includes(q);
          const matchFilename = res.filename.toLowerCase().includes(q);
          const matchTool = res.targetTool.toLowerCase().includes(q);
          const matchTags = res.tags.some(t => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchFilename && !matchTool && !matchTags) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && res.category !== selectedCategory) {
          return false;
        }

        // Format filter
        if (selectedFormat !== 'All' && res.format !== selectedFormat) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.downloadCount - a.downloadCount;
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        if (sortBy === 'size') return b.sizeBytes - a.sizeBytes;
        return 0;
      });
  }, [resources, searchQuery, selectedCategory, selectedFormat, sortBy]);

  const categories = ['All', 'Datasets & Spreadsheets', 'Prompts & Blueprints', 'Connectors & Tools'];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-700'
                : toast.type === 'error'
                ? 'bg-red-600 text-white border-red-500'
                : 'bg-blue-600 text-white border-blue-500'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <Header
        totalDownloads={analytics?.totalDownloads ?? 0}
        totalResources={resources.length}
        onDownloadAll={handleDownloadAll}
        isDownloadingBundle={isDownloadingBundle}
        onJumpToAnalytics={() => {
          document.getElementById('workshop-analytics')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Stats Overview */}
        <StatsOverview analytics={analytics} totalResources={resources.length} />

        {/* Section: Workshop Resources */}
        <section id="workshop-resources" className="scroll-mt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Curated Course Assets
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Workshop Resources
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Download verified spreadsheets, prompts, and connectors directly for class exercises.
              </p>
            </div>

            {/* Quick Bundle Trigger */}
            <button
              onClick={handleDownloadAll}
              disabled={isDownloadingBundle}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs transition active:scale-98 cursor-pointer self-start md:self-auto"
            >
              <FolderArchive className="w-4 h-4 text-blue-600" />
              <span>Get All as ZIP</span>
            </button>
          </div>

          {/* Search & Filters Controls */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search resources by title, dataset column, prompt, or tool (e.g. Gemini, Sourcing, PPM)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="popular">Most Downloaded</option>
                  <option value="name">File Title</option>
                  <option value="size">File Size</option>
                </select>
              </div>
            </div>

            {/* Category and Format Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Format Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-medium">Format:</span>
                <button
                  onClick={() => setSelectedFormat('All')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    selectedFormat === 'All'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFormat('xlsx')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 cursor-pointer ${
                    selectedFormat === 'xlsx'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  .XLSX
                </button>
                <button
                  onClick={() => setSelectedFormat('docx')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 cursor-pointer ${
                    selectedFormat === 'docx'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  .DOCX
                </button>
              </div>
            </div>
          </div>

          {/* Resources Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-72 rounded-2xl bg-white animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onDownload={handleDownload}
                  onViewDetails={setSelectedResource}
                  isDownloading={Boolean(downloadingIds[resource.id])}
                  totalDownloads={analytics?.totalDownloads ?? 0}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No matching workshop resources</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No files match "{searchQuery}" under the selected filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedFormat('All');
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Section: Download Analytics */}
        <AnalyticsPanel
          analytics={analytics}
          resources={resources}
          onRefresh={() => fetchData(true)}
          isRefreshing={isRefreshing}
        />

        {/* Workshop Exercise Guide / FAQ */}
        <section className="mt-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-3">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              Bootcamp Instructions
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              How to Use These Files in Class
            </h3>
            <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>1. Sourcing Intelligence Track:</strong> Download <code className="text-emerald-300 font-mono">Sourcing_Supplier_Quotes.xlsx</code> and open <code className="text-indigo-300 font-mono">Claude_Connector_Supplier_Quotes_Questions.docx</code>. Follow the 5 pre-validated prompts with your Claude Google Drive connector to generate instant donut and scatter charts.
              </p>
              <p>
                <strong>2. Rapid App Prototyping Track:</strong> Download <code className="text-emerald-300 font-mono">Lovable_Landing_Page_Spreadsheet_Headers.xlsx</code> and copy prompt specifications from <code className="text-indigo-300 font-mono">Lovable_Prompt.docx</code> to generate the Mohali Service Desk web application.
              </p>
              <p>
                <strong>3. AI Studio & Engineering Dashboard Track:</strong> Use <code className="text-emerald-300 font-mono">Dashboard_Eng_Projects.xlsx</code> alongside <code className="text-indigo-300 font-mono">Google_AI_Studio_Prompt.docx</code> and <code className="text-indigo-300 font-mono">Claude_HTML_Dashboard_Prompt.docx</code> to build responsive engineering overrun tracking interfaces.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">Workshop Resources Portal</span>
            <span>•</span>
            <span>Automated Telemetry & Secure Distribution</span>
          </div>
          <div>
            <span>All 7 resources active • Real-time attendee download tracking enabled</span>
          </div>
        </div>
      </footer>

      {/* Resource Detail Modal */}
      <ResourceDetailModal
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
        onDownload={handleDownload}
        isDownloading={selectedResource ? Boolean(downloadingIds[selectedResource.id]) : false}
      />
    </div>
  );
}
