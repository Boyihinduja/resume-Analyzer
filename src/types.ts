export interface ResumeFormData {
  fullName: string;
  email: string;
  file: File | null;
  targetRole?: string;
  experienceLevel?: string;
}

export interface SubmissionRecord {
  id: string;
  fullName: string;
  email: string;
  targetRole: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  submittedAt: string;
  status: 'success' | 'error';
  statusCode: number;
  latencyMs: number;
  message?: string;
}

export interface SampleProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  domain: string;
  experienceLevel: string;
  fileName: string;
  skills: string[];
  summary: string;
  resumeContent: string;
}

export interface PipelineNode {
  id: string;
  title: string;
  type: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  nodeName: string;
  badge: string;
}
