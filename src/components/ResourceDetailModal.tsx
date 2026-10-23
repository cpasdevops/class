import React from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import type { WorkshopResource } from '../types/resources';

interface ResourceDetailModalProps {
  resource: WorkshopResource | null;
  onClose: () => void;
  onDownload: (resource: WorkshopResource) => void;
  isDownloading: boolean;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  onClose,
  onDownload,
  isDownloading
}) => {
  if (!resource) return null;

  const isXlsx = resource.format === 'xlsx';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                isXlsx
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}
            >
              {isXlsx ? <FileSpreadsheet className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {resource.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-medium text-slate-600">
                  {resource.sizeFormatted}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                {resource.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Filename & Target Tool */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-100/70 rounded-2xl">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                File Identifier
              </span>
              <span className="font-mono text-xs sm:text-sm font-semibold text-slate-800">
                {resource.filename}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Target Platform
              </span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {resource.targetTool}
              </span>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              Module Overview
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {resource.description}
            </p>
          </div>

          {/* Key Attributes / Notes */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Dataset & Content Specification
            </h3>
            <ul className="space-y-2">
              {resource.detailedNotes.map((note, index) => (
                <li key={index} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Workshop Metadata Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Privacy & Download Tracking Banner */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3 text-xs text-blue-800">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Secure Workshop Proxy</span>
              Your download is delivered directly through the workshop proxy server with automated attendance & session engagement counting.
            </div>
          </div>
        </div>

        {/* Modal Footer with Direct Download Button */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Currently: <strong>{resource.downloadCount}</strong> total downloads</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              Close
            </button>
            <button
              onClick={() => onDownload(resource)}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 active:scale-98 transition disabled:opacity-50 cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download {resource.filename}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
