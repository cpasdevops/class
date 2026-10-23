import React from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  Eye,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import type { WorkshopResource } from '../types/resources';

interface ResourceCardProps {
  resource: WorkshopResource;
  onDownload: (resource: WorkshopResource) => void;
  onViewDetails: (resource: WorkshopResource) => void;
  isDownloading: boolean;
  totalDownloads: number;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onDownload,
  onViewDetails,
  isDownloading,
  totalDownloads
}) => {
  const isXlsx = resource.format === 'xlsx';
  const downloadSharePct = totalDownloads > 0
    ? Math.round((resource.downloadCount / totalDownloads) * 100)
    : 0;

  // Relative time helper
  const getRelativeTime = (timestamp: string | null) => {
    if (!timestamp) return 'No recent downloads';
    const diff = Math.max(0, Date.now() - new Date(timestamp).getTime());
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getToolColor = (tool: string) => {
    switch (tool) {
      case 'Google AI Studio':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Claude':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Lovable':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top Header / Badges */}
        <div className="p-5 pb-3 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                isXlsx
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}
            >
              {isXlsx ? <FileSpreadsheet className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                    isXlsx
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  .{resource.format.toUpperCase()}
                </span>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getToolColor(
                    resource.targetTool
                  )}`}
                >
                  {resource.targetTool}
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-1 block">
                {resource.sizeFormatted} • {resource.category}
              </span>
            </div>
          </div>

          <button
            onClick={() => onViewDetails(resource)}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg transition"
            title="View Details & Instructions"
            aria-label="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
            {resource.title}
          </h3>

          <div className="mt-1 font-mono text-xs text-slate-500 bg-slate-100/70 px-2 py-1 rounded inline-block">
            {resource.filename}
          </div>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {resource.description}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {resource.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
              >
                #{tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded text-slate-400 font-medium">
                +{resource.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Analytics & Download Action Area */}
      <div className="p-5 pt-3 bg-slate-50/70 border-t border-slate-100">
        {/* Analytics bar for this resource */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span className="flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              <strong className="text-slate-900 font-bold">{resource.downloadCount}</strong> downloads
            </span>
            <span className="text-slate-400 text-[11px] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {getRelativeTime(resource.lastDownloadedAt)}
            </span>
          </div>

          {/* Mini progress bar of share */}
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isXlsx ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.max(8, downloadSharePct)}%` }}
            />
          </div>
        </div>

        {/* Click-to-Download Action Button (Strictly No exposed URLs!) */}
        <button
          onClick={() => onDownload(resource)}
          disabled={isDownloading}
          className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition shadow-xs active:scale-98 cursor-pointer ${
            isDownloading
              ? 'bg-blue-100 text-blue-700 cursor-wait'
              : 'bg-slate-900 hover:bg-blue-600 text-white shadow-slate-900/10 hover:shadow-blue-600/20'
          }`}
        >
          {isDownloading ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              <span>Fetching & Counting...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
