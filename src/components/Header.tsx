import React from 'react';
import { Download, Sparkles, FolderArchive, Shield, Activity } from 'lucide-react';

interface HeaderProps {
  totalDownloads: number;
  totalResources: number;
  onDownloadAll: () => void;
  isDownloadingBundle: boolean;
  onJumpToAnalytics: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalDownloads,
  totalResources,
  onDownloadAll,
  isDownloadingBundle,
  onJumpToAnalytics
}) => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-b border-slate-800">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Workshop Portal • Engineering & AI Bootcamp
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Executive AI & Engineering Bootcamp
            </h1>
            <p className="mt-2 text-base sm:text-lg text-slate-300 max-w-2xl">
              Official participant repository for Google AI Studio, Gemini, Lovable, and Claude masterclass sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onJumpToAnalytics}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800/90 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition shadow-sm cursor-pointer"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Live Analytics</span>
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-slate-900 rounded font-semibold text-emerald-300">
                {totalDownloads}
              </span>
            </button>

            <button
              onClick={onDownloadAll}
              disabled={isDownloadingBundle}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/20 active:scale-98 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDownloadingBundle ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Packaging All {totalResources} Files...</span>
                </>
              ) : (
                <>
                  <FolderArchive className="w-4 h-4" />
                  <span>Download All as Bundle (ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Secure internal proxy (no raw file paths exposed)</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Includes 7 curated datasets, prompts, and connectors</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-400" />
            <span>Real-time per-file download counter</span>
          </div>
        </div>
      </div>
    </header>
  );
};
