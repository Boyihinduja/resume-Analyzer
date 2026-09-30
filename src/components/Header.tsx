import React from 'react';
import { ArrowUpRight, Zap } from 'lucide-react';

interface HeaderProps {
  n8nStatus: 'online' | 'checking' | 'error';
  latencyMs: number | null;
  onOpenInspector: () => void;
  onSubmitScroll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  n8nStatus,
  latencyMs,
  onOpenInspector,
  onSubmitScroll,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#fafbfc]/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight transition-transform group-hover:scale-105">
            CV
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            CVLens
          </span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a
            href="#submit-section"
            className="hover:text-slate-900 transition-colors"
          >
            Submit Resume
          </a>
          <a
            href="#pipeline-section"
            className="hover:text-slate-900 transition-colors"
          >
            Pipeline Architecture
          </a>
          <a
            href="#samples-section"
            className="hover:text-slate-900 transition-colors"
          >
            Sample Candidates
          </a>
          <a
            href="#history-section"
            className="hover:text-slate-900 transition-colors"
          >
            Submission Log
          </a>
          <button
            type="button"
            onClick={onOpenInspector}
            className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Webhook Inspector</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenInspector}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Inspect n8n connection"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                n8nStatus === 'online'
                  ? 'bg-emerald-500'
                  : n8nStatus === 'checking'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <span className="font-mono-code tabular-nums">
              n8n {n8nStatus === 'online' ? `${latencyMs ? `${latencyMs}ms` : 'Ready'}` : n8nStatus}
            </span>
          </button>

          <button
            type="button"
            onClick={onSubmitScroll}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Upload Resume</span>
          </button>
        </div>
      </div>
    </header>
  );
};
