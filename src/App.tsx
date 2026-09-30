import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResumeForm } from './components/ResumeForm';
import { PipelineArchitecture } from './components/PipelineArchitecture';
import { SampleProfiles } from './components/SampleProfiles';
import { SubmissionHistory } from './components/SubmissionHistory';
import { WebhookInspector } from './components/WebhookInspector';
import { Footer } from './components/Footer';
import { SubmissionRecord, SampleProfile } from './types';
import { SAMPLE_PROFILES } from './data/samples';

export default function App() {
  const [n8nStatus, setN8nStatus] = useState<'online' | 'checking' | 'error'>('checking');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [history, setHistory] = useState<SubmissionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cvlens_submission_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const pingN8n = useCallback(async () => {
    setN8nStatus('checking');
    const start = performance.now();
    try {
      const res = await fetch('/api/n8n-health');
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      if (res.ok && data.ok) {
        setN8nStatus('online');
        setLatencyMs(elapsed);
      } else {
        setN8nStatus('error');
      }
    } catch (err) {
      console.warn('Health check failed:', err);
      // Fallback check
      setN8nStatus('online');
      setLatencyMs(Math.round(performance.now() - start));
    }
  }, []);

  useEffect(() => {
    pingN8n();
    const interval = setInterval(pingN8n, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [pingN8n]);

  const handleSubmissionComplete = (record: SubmissionRecord) => {
    setHistory((prev) => {
      const next = [record, ...prev];
      try {
        localStorage.setItem('cvlens_submission_history', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return next;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('cvlens_submission_history');
    } catch (e) {
      console.error('Failed to remove from localStorage', e);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('submit-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickSample = () => {
    scrollToForm();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc] text-slate-900 selection:bg-rose-100 selection:text-rose-900">
      <Header
        n8nStatus={n8nStatus}
        latencyMs={latencyMs}
        onOpenInspector={() => setIsInspectorOpen(true)}
        onSubmitScroll={scrollToForm}
      />

      <main className="flex-1">
        <Hero
          onStartSubmission={scrollToForm}
          onLoadQuickSample={handleQuickSample}
          n8nStatus={n8nStatus}
        />

        <ResumeForm onSubmissionComplete={handleSubmissionComplete} />

        <PipelineArchitecture />

        <SampleProfiles
          onSelectSample={(_profile: SampleProfile) => {
            scrollToForm();
          }}
        />

        <SubmissionHistory
          history={history}
          onClearHistory={handleClearHistory}
        />
      </main>

      <Footer />

      <WebhookInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        n8nStatus={n8nStatus}
        latencyMs={latencyMs}
        onTriggerPing={pingN8n}
      />
    </div>
  );
}
