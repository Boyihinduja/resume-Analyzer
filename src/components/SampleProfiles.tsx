import React, { useState } from 'react';
import { SAMPLE_PROFILES, createResumeFile } from '../data/samples';
import { SampleProfile } from '../types';
import { FileText, ArrowRight, Download, Eye, Globe2 } from 'lucide-react';

interface SampleProfilesProps {
  onSelectSample: (profile: SampleProfile) => void;
}

export const SampleProfiles: React.FC<SampleProfilesProps> = ({ onSelectSample }) => {
  const [activeProfile, setActiveProfile] = useState<SampleProfile>(SAMPLE_PROFILES[0]);

  const handleDownload = (profile: SampleProfile) => {
    const file = createResumeFile(profile);
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = profile.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadAndScroll = (profile: SampleProfile) => {
    onSelectSample(profile);
    const el = document.getElementById('submit-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="samples-section" className="py-16 md:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            <span>Multi-Discipline Profiles</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5" />
              All Roles Supported
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Curated benchmark resumes across technical & business domains.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            The n8n pipeline evaluates candidates with <strong>no specific role target required</strong>. Test engineering, product, cloud infrastructure, or corporate operations resumes to verify how the workflow adapts.
          </p>
        </div>

        {/* 4 Candidate Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_PROFILES.map((profile) => {
            const isSelected = activeProfile.id === profile.id;
            return (
              <div
                key={profile.id}
                onClick={() => setActiveProfile(profile)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50/70 shadow-sm ring-1 ring-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                    <span className="font-semibold text-slate-800 text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                      {profile.domain}
                    </span>
                    <span className="font-mono-code text-[11px]">TXT</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{profile.name}</h3>
                  <div className="text-xs font-medium text-slate-600 mt-0.5">{profile.role}</div>

                  <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {profile.summary}
                  </p>

                  {/* Skills unboxed list */}
                  <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-600">
                    {profile.skills.slice(0, 4).map((skill, idx) => (
                      <span key={skill} className="flex items-center">
                        <span className="text-slate-800 font-medium">{skill}</span>
                        {idx < 3 && idx < profile.skills.length - 1 && (
                          <span className="text-slate-300 ml-2" aria-hidden="true">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(profile);
                    }}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Download resume file"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadAndScroll(profile);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>Use in Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Profile Detailed Preview Drawer */}
        <div className="mt-10 p-6 rounded-2xl bg-slate-900 text-white border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                <span>Inspecting Benchmark Document</span>
                <span>·</span>
                <span className="text-emerald-400 font-mono-code lowercase">track: all roles</span>
              </div>
              <h4 className="text-base font-bold text-white mt-0.5">
                {activeProfile.fileName}
              </h4>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleDownload(activeProfile)}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Text File</span>
              </button>

              <button
                type="button"
                onClick={() => handleLoadAndScroll(activeProfile)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Load Into Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-4 max-h-60 overflow-y-auto font-mono-code text-xs text-slate-300 leading-relaxed whitespace-pre-wrap pr-2">
            {activeProfile.resumeContent}
          </div>
        </div>
      </div>
    </section>
  );
};
