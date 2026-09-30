import React, { useState } from 'react';
import {
  Activity,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  X,
  Server,
} from 'lucide-react';

interface WebhookInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  n8nStatus: 'online' | 'checking' | 'error';
  latencyMs: number | null;
  onTriggerPing: () => void;
}

export const WebhookInspector: React.FC<WebhookInspectorProps> = ({
  isOpen,
  onClose,
  n8nStatus,
  latencyMs,
  onTriggerPing,
}) => {
  const [copied, setCopied] = useState(false);
  const n8nUrl = 'https://hinduja07.app.n8n.cloud/form/46912cc0-c8e4-4582-a683-9210114dc4f7';

  const curlCommand = `curl -X POST \\
  -F "field-0=Elena Vance" \\
  -F "field-1=elena.vance@staff-engineering.io" \\
  -F "field-2=@resume.pdf;type=application/pdf" \\
  "${n8nUrl}"`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">n8n Webhook & Endpoint Inspector</h3>
              <p className="text-xs text-slate-500">Live configuration and connectivity diagnostics</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Status & Ping Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  n8nStatus === 'online'
                    ? 'bg-emerald-500 ring-4 ring-emerald-100'
                    : n8nStatus === 'checking'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-rose-500'
                }`}
              />
              <div>
                <div className="font-semibold text-slate-900 text-sm">
                  {n8nStatus === 'online'
                    ? 'Active · Ready for Submissions'
                    : n8nStatus === 'checking'
                    ? 'Testing connection...'
                    : 'Endpoint Unreachable'}
                </div>
                <div className="text-slate-500 font-mono-code mt-0.5">
                  Target latency: {latencyMs ? `${latencyMs}ms` : 'checking...'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onTriggerPing}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Ping Now</span>
            </button>
          </div>

          {/* Connected Webhook URL */}
          <div>
            <div className="font-semibold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
              Configured Target URL
            </div>
            <div className="p-3 rounded-lg bg-slate-900 text-emerald-400 font-mono-code text-xs break-all flex items-center justify-between gap-3">
              <span>{n8nUrl}</span>
              <a
                href={n8nUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 p-1 text-slate-400 hover:text-white transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Form Field Schema Mapping */}
          <div>
            <div className="font-semibold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
              Form Input Schema
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                  <tr>
                    <th className="px-4 py-2">Field ID</th>
                    <th className="px-4 py-2">Label</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-code">
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-900">field-0</td>
                    <td className="px-4 py-2.5 text-slate-700 font-sans">name</td>
                    <td className="px-4 py-2.5 text-slate-500">text</td>
                    <td className="px-4 py-2.5 text-rose-600 font-sans font-medium">Required</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-900">field-1</td>
                    <td className="px-4 py-2.5 text-slate-700 font-sans">email</td>
                    <td className="px-4 py-2.5 text-slate-500">email</td>
                    <td className="px-4 py-2.5 text-slate-500 font-sans">Optional / Validated</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-semibold text-slate-900">field-2</td>
                    <td className="px-4 py-2.5 text-slate-700 font-sans">upload resume</td>
                    <td className="px-4 py-2.5 text-slate-500">file (multipart)</td>
                    <td className="px-4 py-2.5 text-slate-500 font-sans">Binary Payload</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Curl Command Snippet */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                Terminal Verification (cURL)
              </div>
              <button
                type="button"
                onClick={handleCopyCurl}
                className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy cURL</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-300 font-mono-code text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
              {curlCommand}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <a
            href={n8nUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1.5"
          >
            <span>Open Original n8n Form Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
