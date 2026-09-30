import React from 'react';
import { SubmissionRecord } from '../types';
import { History, CheckCircle2, Download, Globe2 } from 'lucide-react';

interface SubmissionHistoryProps {
  history: SubmissionRecord[];
  onClearHistory: () => void;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({
  history,
  onClearHistory,
}) => {
  const exportHistoryJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cvlens-submissions-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section id="history-section" className="py-16 md:py-20 bg-[#fafbfc] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Transmission Telemetry
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Session Submission Log
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Live audit record of candidate documents dispatched to the n8n webhook during this session.
            </p>
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={exportHistoryJSON}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export JSON Log</span>
              </button>

              <button
                type="button"
                onClick={onClearHistory}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Clear Log
              </button>
            </div>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-dashed border-slate-300">
            <History className="w-8 h-8 mx-auto text-slate-400 mb-3" />
            <h4 className="text-sm font-semibold text-slate-900">No submissions recorded yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Submit a resume using the form above or pick a sample candidate to trigger the n8n pipeline.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Ref ID</th>
                  <th className="px-5 py-3.5">Candidate</th>
                  <th className="px-5 py-3.5">Role Track</th>
                  <th className="px-5 py-3.5">Document</th>
                  <th className="px-5 py-3.5">Dispatched At</th>
                  <th className="px-5 py-3.5">Response</th>
                  <th className="px-5 py-3.5 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-mono-code font-medium text-slate-900">
                      {record.id}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{record.fullName}</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-[180px]">
                        {record.email}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 max-w-[200px] truncate">
                        <Globe2 className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{record.targetRole || 'All Roles (No specific target)'}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      <div className="font-medium text-slate-900 truncate max-w-[180px]">
                        {record.fileName}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {(record.fileSize / 1024).toFixed(1)} KB
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 tabular-nums">
                      {new Date(record.submittedAt).toLocaleTimeString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold font-mono-code">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        HTTP {record.statusCode} OK
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-mono-code text-slate-600 tabular-nums">
                      {record.latencyMs}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
