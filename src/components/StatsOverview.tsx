import React from 'react';
import { Download, FileSpreadsheet, FileText, TrendingUp, Users } from 'lucide-react';
import type { AnalyticsSummary } from '../types/resources';

interface StatsOverviewProps {
  analytics: AnalyticsSummary | null;
  totalResources: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ analytics, totalResources }) => {
  const totalDownloads = analytics?.totalDownloads ?? 0;
  const xlsxDownloads = analytics?.byFormat.xlsx ?? 0;
  const docxDownloads = analytics?.byFormat.docx ?? 0;
  const topResource = analytics?.mostPopularResource;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {/* Total Downloads */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Downloads
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalDownloads.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            Live
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Across {totalResources} workshop assets
        </p>
      </div>

      {/* Datasets Downloaded */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Excel Datasets
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {xlsxDownloads.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 font-medium">downloads</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          3 workbooks (Sourcing & Engineering)
        </p>
      </div>

      {/* Prompts & Blueprints */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Prompts & Guides
          </span>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {docxDownloads.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 font-medium">downloads</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          4 Word documents (.docx)
        </p>
      </div>

      {/* Most Popular Asset */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Most Popular Asset
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 truncate">
          <div className="text-base font-bold text-slate-900 truncate" title={topResource?.title}>
            {topResource ? topResource.title.split(' ')[0] + ' ' + (topResource.title.split(' ')[1] || '') : 'Loading...'}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs font-semibold text-amber-600">
              {topResource?.count ?? 0} downloads
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-400">Leader</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Top choice for bootcamp attendees
        </p>
      </div>
    </div>
  );
};
