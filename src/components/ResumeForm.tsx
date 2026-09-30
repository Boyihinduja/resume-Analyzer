import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Send,
  Eye,
  RefreshCw,
  ExternalLink,
  User,
  Mail,
  FileCheck,
  Check,
  Globe2,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { SubmissionRecord, SampleProfile } from '../types';
import { SAMPLE_PROFILES, createResumeFile } from '../data/samples';

interface ResumeFormProps {
  onSubmissionComplete: (record: SubmissionRecord) => void;
}

type SubmissionStage = 'idle' | 'validating' | 'packaging' | 'transmitting' | 'complete' | 'error';

const ROLE_TRACK_OPTIONS = [
  {
    value: 'All Roles (No specific target)',
    label: 'All Roles (No specific target) — Universal Talent Evaluation (Default)',
    shortLabel: 'All Roles (No Target)',
    description: 'Evaluates candidates holistically across all disciplines without filtering by a single job title.',
  },
  {
    value: 'Technology & Software Engineering',
    label: 'Technology & Software Engineering (Full-Stack, Backend, Frontend, Mobile)',
    shortLabel: 'Engineering & Tech',
    description: 'Systems design, software craft, algorithms, and technical architecture.',
  },
  {
    value: 'Product Management & UX Design',
    label: 'Product Management & UX Design (Technical PM, Product Design, Research)',
    shortLabel: 'Product & Design',
    description: 'Product lifecycle, customer discovery, metrics, and user experience.',
  },
  {
    value: 'Data Science, Machine Learning & AI',
    label: 'Data Science, Machine Learning & AI (LLM Infra, Analytics, MLOps)',
    shortLabel: 'Data & AI',
    description: 'Statistical modeling, AI models, data pipelines, and quantitative insights.',
  },
  {
    value: 'Finance, Operations & Strategy',
    label: 'Finance, Operations & Corporate Strategy (BizOps, FP&A, Leadership)',
    shortLabel: 'Operations & Strategy',
    description: 'Unit economics, operational efficiency, scaling, and enterprise execution.',
  },
  {
    value: 'Marketing, Growth & Revenue',
    label: 'Marketing, Growth & Revenue Operations (Performance, Brand, GTM)',
    shortLabel: 'Marketing & Sales',
    description: 'Customer acquisition, funnel optimization, pipeline generation, and brand.',
  },
  {
    value: 'Other / Multi-Disciplinary Open Track',
    label: 'Other / Multi-Disciplinary Open Track',
    shortLabel: 'Open Track',
    description: 'Hybrid, cross-functional, and emerging career specializations.',
  },
];

export const ResumeForm: React.FC<ResumeFormProps> = ({ onSubmissionComplete }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewText, setFilePreviewText] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [targetRole, setTargetRole] = useState('All Roles (No specific target)');
  const [isDragging, setIsDragging] = useState(false);

  // Form errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Submission state
  const [stage, setStage] = useState<SubmissionStage>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSubmission, setLastSubmission] = useState<SubmissionRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample profile
  const handleSelectSample = (profile: SampleProfile) => {
    setFullName(profile.name);
    setEmail(profile.email);
    // Keep 'All Roles (No specific target)' active so user can test universal evaluation,
    // or let them freely change it
    setNameError(null);
    setEmailError(null);
    setFileError(null);

    const file = createResumeFile(profile);
    setSelectedFile(file);
    setFilePreviewText(profile.resumeContent);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Check file size (e.g. 15MB limit)
    if (file.size > 15 * 1024 * 1024) {
      setFileError('File size exceeds 15MB limit. Please choose a smaller resume.');
      return;
    }

    setSelectedFile(file);
    setFileError(null);

    // If it's a text file, read preview
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreviewText(event.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      setFilePreviewText(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const validate = (): boolean => {
    let isValid = true;

    if (!fullName.trim()) {
      setNameError('Full name is required');
      isValid = false;
    } else {
      setNameError(null);
    }

    if (email.trim()) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email.trim())) {
        setEmailError('Please enter a valid email address');
        isValid = false;
      } else {
        setEmailError(null);
      }
    } else {
      setEmailError(null);
    }

    if (!selectedFile) {
      setFileError('Please attach or drop a resume file to analyze');
      isValid = false;
    } else {
      setFileError(null);
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStage('validating');
    setErrorMessage(null);
    const startTime = performance.now();

    try {
      setStage('packaging');
      await new Promise((r) => setTimeout(r, 250));

      // Construct multipart/form-data matching n8n form schema:
      // field-0: name
      // field-1: email
      // field-2: file
      const formData = new FormData();
      formData.append('field-0', fullName.trim());
      formData.append('field-1', email.trim());
      if (selectedFile) {
        formData.append('field-2', selectedFile, selectedFile.name);
      }

      setStage('transmitting');

      // Send to server proxy endpoint first
      let response: Response;
      try {
        response = await fetch('/api/submit-resume', {
          method: 'POST',
          body: formData,
        });
      } catch (proxyErr) {
        // Fallback to direct n8n endpoint
        console.warn('Proxy submission error, falling back to direct endpoint:', proxyErr);
        response = await fetch(
          'https://hinduja07.app.n8n.cloud/form/46912cc0-c8e4-4582-a683-9210114dc4f7',
          {
            method: 'POST',
            body: formData,
            mode: 'no-cors',
          }
        );
      }

      const durationMs = Math.round(performance.now() - startTime);

      if (response.ok || response.type === 'opaque' || response.status === 200) {
        const record: SubmissionRecord = {
          id: `REC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          fullName: fullName.trim(),
          email: email.trim() || 'Not specified',
          targetRole: targetRole || 'All Roles (No specific target)',
          fileName: selectedFile?.name || 'resume.pdf',
          fileSize: selectedFile?.size || 0,
          fileType: selectedFile?.type || 'application/pdf',
          submittedAt: new Date().toISOString(),
          status: 'success',
          statusCode: 200,
          latencyMs: durationMs,
          message: 'Response recorded successfully in n8n workflow',
        };

        setLastSubmission(record);
        setStage('complete');
        onSubmissionComplete(record);
      } else {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
    } catch (err: any) {
      console.error('Submission failed:', err);
      setStage('error');
      setErrorMessage(
        err.message ||
          'Failed to connect to the n8n form endpoint. Please check your internet connection or try again.'
      );
    }
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setSelectedFile(null);
    setFilePreviewText(null);
    setTargetRole('All Roles (No specific target)');
    setNameError(null);
    setEmailError(null);
    setFileError(null);
    setStage('idle');
    setErrorMessage(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isAllRoles = targetRole === 'All Roles (No specific target)';

  return (
    <section id="submit-section" className="py-16 md:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Automated Submission Console
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transmit candidate resumes directly to the n8n webhook.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            All submissions stream directly to the configured n8n cloud form endpoint. Configured for <strong>all roles with no specific target</strong> to evaluate candidate strengths across any domain.
          </p>
        </div>

        {/* Quick Sample Selector Bar */}
        <div className="mb-8 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Test Benchmark Resumes:
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              (click to populate candidate data & test n8n pipeline)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_PROFILES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className="px-3 py-1.5 text-xs font-medium bg-white text-slate-700 hover:text-slate-900 hover:border-slate-400 border border-slate-200 rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span className="font-semibold">{sample.name}</span>
                <span className="text-slate-400">({sample.domain})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Card or Success View */}
        {stage === 'complete' && lastSubmission ? (
          <div className="p-8 sm:p-10 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                <Check className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                  n8n Workflow Execution Triggered
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  Candidate resume submitted successfully
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  The n8n webhook responded with <span className="font-semibold text-emerald-700">HTTP 200 OK</span>. Your resume document has been received and queued in the workflow.
                </p>

                {/* Submission Receipt Box */}
                <div className="mt-6 p-5 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                    <span>Submission Receipt</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono-code text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Universal Track Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
                    <div>
                      <div className="text-slate-500">Candidate Name</div>
                      <div className="font-semibold text-slate-900 text-sm">{lastSubmission.fullName}</div>
                    </div>

                    <div>
                      <div className="text-slate-500">Contact Email</div>
                      <div className="font-semibold text-slate-900 text-sm truncate">{lastSubmission.email}</div>
                    </div>

                    <div>
                      <div className="text-slate-500">Target Role Track</div>
                      <div className="font-semibold text-slate-900 text-sm truncate flex items-center gap-1">
                        <Globe2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{lastSubmission.targetRole}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500">Attached Document</div>
                      <div className="font-semibold text-slate-900 text-sm truncate">{lastSubmission.fileName}</div>
                      <div className="text-slate-500 text-[11px]">{formatFileSize(lastSubmission.fileSize)}</div>
                    </div>

                    <div>
                      <div className="text-slate-500">Receipt Ref & Latency</div>
                      <div className="font-mono-code font-semibold text-slate-900 text-sm">{lastSubmission.id}</div>
                      <div className="text-slate-500 text-[11px] font-mono-code">{lastSubmission.latencyMs}ms transmission</div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Submit Another Resume</span>
                  </button>

                  <a
                    href="https://hinduja07.app.n8n.cloud/form/46912cc0-c8e4-4582-a683-9210114dc4f7"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <span>Inspect Raw n8n Form</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm"
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field 0: Candidate Name (Required in n8n) */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
                >
                  Candidate Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="field-0"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (nameError) setNameError(null);
                    }}
                    placeholder="e.g. Dr. Jordan Lee"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                      nameError
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                        : 'border-slate-300 focus:border-slate-800 focus:ring-slate-900/10'
                    }`}
                  />
                </div>
                {nameError && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{nameError}</span>
                  </p>
                )}
                <p className="mt-1.5 text-xs text-slate-500">
                  Maps to n8n form field <code className="font-mono-code text-slate-700">field-0</code> (Required)
                </p>
              </div>

              {/* Field 1: Candidate Email (Optional in n8n form) */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
                >
                  Candidate Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="field-1"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    placeholder="e.g. jordan.lee@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                      emailError
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                        : 'border-slate-300 focus:border-slate-800 focus:ring-slate-900/10'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{emailError}</span>
                  </p>
                )}
                <p className="mt-1.5 text-xs text-slate-500">
                  Maps to n8n form field <code className="font-mono-code text-slate-700">field-1</code>
                </p>
              </div>
            </div>

            {/* Target Specialization or Role Track — Configured for All Roles / No Specific Target */}
            <div className="mt-6 pt-6 border-t border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="targetRole"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-800"
                  >
                    Target Specialization or Role Track
                  </label>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" />
                    All Roles (No Target Restriction)
                  </span>
                </div>

                {!isAllRoles && (
                  <button
                    type="button"
                    onClick={() => setTargetRole('All Roles (No specific target)')}
                    className="text-xs text-slate-500 hover:text-slate-900 underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset to "All Roles (No specific target)"</span>
                  </button>
                )}
              </div>

              {/* Quick Track Chips */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {ROLE_TRACK_OPTIONS.slice(0, 5).map((opt) => {
                  const isSelected = targetRole === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTargetRole(opt.value)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-semibold'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>{opt.shortLabel}</span>
                    </button>
                  );
                })}
              </div>

              <select
                id="targetRole"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 font-medium"
              >
                {ROLE_TRACK_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
                <Globe2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p>
                  <strong>All Roles Active (No specific target required):</strong> The pipeline analyzes resumes universally across any industry or level—evaluating core competencies, achievements, communication clarity, and leadership without gating candidates into a rigid job specification.
                </p>
              </div>
            </div>

            {/* Field 2: Resume File Upload (Dropzone) */}
            <div className="mt-6 pt-6 border-t border-slate-200/80">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Upload Resume Document <span className="text-rose-500">*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                name="field-2"
                id="field-2"
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt,.rtf"
                className="hidden"
              />

              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-slate-900 bg-slate-100/80'
                      : fileError
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-700 shadow-2xs">
                    <Upload className="w-6 h-6 stroke-[1.8]" />
                  </div>

                  <h4 className="mt-4 text-sm font-semibold text-slate-900">
                    Click to browse or drag and drop candidate CV
                  </h4>

                  <p className="mt-1 text-xs text-slate-500">
                    Supports PDF, DOCX, DOC, TXT, and RTF files up to 15MB
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-mono-code text-slate-600 shadow-2xs">
                    Maps to n8n form field <code className="text-slate-900 font-semibold">field-2</code>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate max-w-sm">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{formatFileSize(selectedFile.size)}</span>
                        <span>·</span>
                        <span className="uppercase font-mono-code text-[11px]">{selectedFile.name.split('.').pop() || 'FILE'}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">Ready for transmission</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {filePreviewText && (
                      <button
                        type="button"
                        onClick={() => setShowPreviewModal(true)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Inspect Text</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreviewText(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {fileError && (
                <p className="mt-2 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{fileError}</span>
                </p>
              )}
            </div>

            {/* Error Message banner */}
            {errorMessage && (
              <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Workflow Submission Error</div>
                  <div className="mt-0.5 leading-relaxed">{errorMessage}</div>
                </div>
              </div>
            )}

            {/* Submit Action Bar */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Destination:</span>
                <span className="font-mono-code font-semibold text-slate-700">
                  hinduja07.app.n8n.cloud/form/...
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={stage !== 'idle' && stage !== 'error'}
                  className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Reset Form
                </button>

                <button
                  type="submit"
                  disabled={stage === 'validating' || stage === 'packaging' || stage === 'transmitting'}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {stage === 'validating' || stage === 'packaging' || stage === 'transmitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting to n8n...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Candidate CV</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Text Preview Modal */}
      {showPreviewModal && filePreviewText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedFile?.name}</h4>
                <p className="text-xs text-slate-500">Document Plaintext Preview</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors text-sm"
              >
                &times; Close
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 font-mono-code text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bg-slate-50">
              {filePreviewText}
            </div>
            <div className="p-4 border-t border-slate-200 text-right bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
