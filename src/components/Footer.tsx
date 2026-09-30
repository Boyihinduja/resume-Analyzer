import React from 'react';
import { ArrowUp, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white text-slate-900 flex items-center justify-center font-bold text-xs">
                CV
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CVLens</span>
            </div>
            <p className="mt-2 text-xs text-slate-400 max-w-sm">
              Automated talent screening and resume document processing interface connected to n8n cloud workflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#submit-section" className="hover:text-white transition-colors">
              Submit Resume
            </a>
            <a href="#pipeline-section" className="hover:text-white transition-colors">
              Pipeline Architecture
            </a>
            <a href="#samples-section" className="hover:text-white transition-colors">
              Benchmark Profiles
            </a>
            <a
              href="https://hinduja07.app.n8n.cloud/form/46912cc0-c8e4-4582-a683-9210114dc4f7"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>Hosted n8n Form</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>CVLens Talent Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>n8n Cloud Webhook Pipeline</span>
            <span aria-hidden="true">·</span>
            <span>Enterprise Screening Protocol</span>
          </div>

          <div>
            Connected to <span className="font-mono-code text-slate-400">hinduja07.app.n8n.cloud</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
