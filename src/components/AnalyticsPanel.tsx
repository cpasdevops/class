import React from 'react';
import {
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  Clock,
  Laptop,
  Smartphone,
  Tablet,
  RefreshCw,
  Sparkles,
  PieChart
} from 'lucide-react';
import type { AnalyticsSummary, WorkshopResource } from '../types/resources';

interface AnalyticsPanelProps {
  analytics: AnalyticsSummary | null;
  resources: WorkshopResource[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  analytics,
  resources,
  onRefresh,
  isRefreshing
}) => {
  if (!analytics) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
        <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading download analytics...</p>
      </div>
    );
  }

  const total = analytics.totalDownloads || 1;
  const sortedResources = [...resources].sort((a, b) => b.downloadCount - a.downloadCount);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'Mobile':
        return <Smartphone className="w-3.5 h-3.5 text-slate-400" />;
      case 'Tablet':
        return <Tablet className="w-3.5 h-3.5 text-slate-400" />;
      default:
        return <Laptop className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const formatEventTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diff = Math.max(0, Date.now() - date.getTime());
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  return (
    <section id="workshop-analytics" className="mt-12 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            Telemetry & Engagement
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Workshop Resource Download Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time telemetry tracking attendee resource access across all 7 workshop modules.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Main Grid: Per-file Chart & Live Feed */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Per-file Download Ranking & Progress Bars */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Download Volume by File
            </h3>
            <span className="text-xs text-slate-400">
              Sorted by popularity
            </span>
          </div>

          <div className="space-y-4">
            {sortedResources.map((res, index) => {
              const pct = Math.round((res.downloadCount / total) * 100);
              const isXlsx = res.format === 'xlsx';

              return (
                <div
                  key={res.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition"
                >
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-slate-200/80 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                        #{index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate" title={res.title}>
                          {res.title}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400 truncate">
                          {res.filename}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-slate-900">
                        {res.downloadCount}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">({pct}%)</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isXlsx
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                      }`}
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Breakdown & Live Download Event Stream */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Format & Category Split */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-indigo-600" />
              Format Distribution
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1">
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel (.xlsx)
                </div>
                <div className="text-xl font-extrabold text-slate-900">
                  {analytics.byFormat.xlsx}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {Math.round((analytics.byFormat.xlsx / total) * 100)}% of total
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                <div className="flex items-center gap-1.5 text-indigo-700 font-semibold mb-1">
                  <FileText className="w-4 h-4" />
                  Word (.docx)
                </div>
                <div className="text-xl font-extrabold text-slate-900">
                  {analytics.byFormat.docx}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {Math.round((analytics.byFormat.docx / total) * 100)}% of total
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Stream */}
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Download Feed
              </h4>
              <span className="text-[11px] text-slate-400">Latest activity</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-72 pr-1 flex-1">
              {analytics.recentDownloads.slice(0, 8).map(event => (
                <div
                  key={event.id}
                  className="bg-white p-2.5 rounded-xl border border-slate-200/70 text-xs flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center shrink-0">
                      {getDeviceIcon(event.deviceType)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 truncate" title={event.filename}>
                        {event.filename}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {event.deviceType} attendee
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                    {formatEventTime(event.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
