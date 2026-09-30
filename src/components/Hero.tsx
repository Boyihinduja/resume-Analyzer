import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Cpu, Globe2 } from 'lucide-react';
import heroImage from '../assets/images/hero_resume_analyzer_1790761163321.jpg';

interface HeroProps {
  onStartSubmission: () => void;
  onLoadQuickSample: () => void;
  n8nStatus: 'online' | 'checking' | 'error';
}

export const Hero: React.FC<HeroProps> = ({
  onStartSubmission,
  onLoadQuickSample,
}) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Unboxed Metadata / Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              <span>n8n Workflow Automation</span>
              <span aria-hidden="true">·</span>
              <span>Intelligent Resume Intake</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 flex items-center gap-1 font-mono-code lowercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                all roles · no target restriction
              </span>
            </div>

            {/* Headline with balanced wrap */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] [text-wrap:balance]">
              Resume analysis pipeline engineered for all roles and domains.
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
              Connect candidates directly to your automated screening engine. Ingest resume documents via our high-speed n8n webhook, parse candidate skills, and evaluate qualifications across <strong>all roles with no specific target constraints</strong>.
            </p>

            {/* Key capabilities unboxed list */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 pt-6 border-t border-slate-200">
              <div className="flex items-start gap-2">
                <Globe2 className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">All Roles & Tracks</div>
                  <div className="text-slate-500">Universal holistic screening</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Cpu className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Direct n8n Ingestion</div>
                  <div className="text-slate-500">Cloud webhook multipart handler</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Skill & Impact Scoring</div>
                  <div className="text-slate-500">Quantified career benchmark</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onStartSubmission}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Submit Candidate CV</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onLoadQuickSample}
                className="px-5 py-3.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Load Sample Profile</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100 group">
              <img
                src={heroImage}
                alt="Resume analysis executive workstation with analytics dashboard"
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              {/* In-image quiet detail bar */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-mono-code uppercase tracking-wider">Target Endpoint</div>
                  <div className="text-xs font-mono-code text-slate-200 truncate max-w-[220px] sm:max-w-xs">
                    hinduja07.app.n8n.cloud
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono-code uppercase tracking-wider">Role Filter</div>
                  <div className="text-xs font-semibold text-emerald-400 font-mono-code">
                    None (All Roles)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
