import React, { useState } from 'react';
import { Network, Database, Layers, CheckCircle, Code, Workflow, ArrowRight } from 'lucide-react';
import bentoImage from '../assets/images/resume_analysis_bento_1790761179058.jpg';

interface PipelineStep {
  id: string;
  stepNumber: string;
  name: string;
  n8nNode: string;
  type: string;
  description: string;
  samplePayload: Record<string, any>;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'step-1',
    stepNumber: '01',
    name: 'Form Trigger Ingestion',
    n8nNode: 'n8n-nodes-base.formTrigger',
    type: 'Trigger Node',
    description: 'Receives multipart/form-data payload containing candidate name (field-0), email (field-1), and binary resume stream (field-2).',
    samplePayload: {
      headers: {
        'content-type': 'multipart/form-data; boundary=...',
        'user-agent': 'CVLens-Client/2.0',
      },
      body: {
        'field-0': 'Elena Vance',
        'field-1': 'elena.vance@staff-engineering.io',
      },
      files: {
        'field-2': {
          filename: 'Elena_Vance_Staff_AI_Engineer_Resume.txt',
          mimetype: 'text/plain',
          size: 1942,
        },
      },
    },
  },
  {
    id: 'step-2',
    stepNumber: '02',
    name: 'Binary Extraction & OCR',
    n8nNode: 'n8n-nodes-base.extractFromFile',
    type: 'Document Transformer',
    description: 'Converts unstructured PDF, Word, or Text buffers into normalized UTF-8 text strings with layout preservation.',
    samplePayload: {
      documentType: 'PDF/Text Document',
      extractedTextLength: 1845,
      sectionsDetected: ['SUMMARY', 'EXPERIENCE', 'EDUCATION', 'PUBLICATIONS'],
      checksum: 'sha256:7b92f019...',
    },
  },
  {
    id: 'step-3',
    stepNumber: '03',
    name: 'Structured Entity Extraction',
    n8nNode: 'n8n-nodes-langchain.agent',
    type: 'LLM Extraction Agent',
    description: 'Uses zero-shot structured prompts to parse years of experience, core hard skills, education credentials, and leadership signals.',
    samplePayload: {
      candidate: {
        yearsOfExperience: 8.5,
        seniorityLevel: 'Staff / Principal',
        topSkills: ['PyTorch', 'vLLM', 'Distributed Systems', 'CUDA', 'Python'],
        degree: 'M.S. Computer Science, Stanford University',
      },
    },
  },
  {
    id: 'step-4',
    stepNumber: '04',
    name: 'Evaluation & ATS Scoring',
    n8nNode: 'n8n-nodes-base.code',
    type: 'Scoring Engine',
    description: 'Computes quantifiable metric density, active verb distribution, and ATS keyword relevance against high-growth tech benchmarks.',
    samplePayload: {
      atsScore: 94,
      metricsFound: 6,
      quantifiedImpactRatio: '83%',
      recommendation: 'STRONG ADVANCE TO TECHNICAL SCREEN',
    },
  },
  {
    id: 'step-5',
    stepNumber: '05',
    name: 'Downstream Sync & Notifications',
    n8nNode: 'n8n-nodes-base.respondToWebhook',
    type: 'Delivery Channel',
    description: 'Dispatches instant confirmation to candidate, posts structured dossier into hiring Slack channel, and returns HTTP 200.',
    samplePayload: {
      status: 200,
      notificationSent: true,
      channel: '#talent-engineering-screen',
      executionId: 'n8n-exec-9921',
    },
  },
];

export const PipelineArchitecture: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<PipelineStep>(PIPELINE_STEPS[0]);

  return (
    <section id="pipeline-section" className="py-16 md:py-24 bg-[#fafbfc] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Automated Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight [text-wrap:balance]">
            How the n8n Resume Analyzer processes each candidate submission.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            From the initial form submission webhook on hinduja07.app.n8n.cloud through binary file parsing, entity extraction, and automated scoring.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Asymmetric 5-Step Pipeline Stepper */}
          <div className="lg:col-span-7 space-y-3">
            {PIPELINE_STEPS.map((step) => {
              const isSelected = selectedStep.id === step.id;
              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStep(step)}
                  className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-slate-900 shadow-sm'
                      : 'bg-white/60 hover:bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <span className="font-mono-code text-xs font-bold text-slate-400 mt-0.5">
                        {step.stepNumber}.
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{step.name}</h4>
                          <span className="text-[11px] font-mono-code text-slate-500 hidden sm:inline">
                            · {step.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                        <div className="mt-2 text-[11px] font-mono-code text-slate-400">
                          Node: {step.n8nNode}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 mt-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isSelected
                            ? 'bg-slate-900 text-white'
                            : 'border border-slate-200 text-slate-400'
                        }`}
                      >
                        {isSelected ? '→' : ''}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Bento Card + Schema Inspector */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Bento Asset Card */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <img
                src={bentoImage}
                alt="Document evaluation interface and structured data analytics"
                className="w-full h-48 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">Live n8n Cloud Execution</span>
                  <span className="font-mono-code text-slate-500">Node Pipeline 5/5 Active</span>
                </div>
              </div>
            </div>

            {/* Interactive Schema & Contract Inspector */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Step {selectedStep.stepNumber} Data Contract
                  </span>
                </div>
                <span className="text-[11px] font-mono-code text-slate-400">
                  {selectedStep.n8nNode.split('.').pop()}
                </span>
              </div>

              <div className="text-xs text-slate-400 mb-2 font-mono-code">
                Node Name: <span className="text-emerald-300 font-semibold">{selectedStep.name}</span>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 font-mono-code text-xs text-emerald-400 overflow-x-auto leading-relaxed border border-slate-800">
                {JSON.stringify(selectedStep.samplePayload, null, 2)}
              </pre>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Deterministic Execution</span>
                <span className="font-mono-code text-slate-300">n8n Cloud Engine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
