export type AIModel = 'Thalorix-X Pro' | 'Thalorix-X Fast' | 'Thalorix-X Mini' | 'Thalorix-X Vision';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isCode?: boolean;
  language?: string;
  timestamp: Date;
  status?: 'building' | 'completed' | 'failed'; // Custom addition for tracing logs
}

export interface ProjectFile {
  path: string;
  content: string;
  language?: string;
}

export interface AIProject {
  id?: string;
  _id: string;
  sessionId: string;
  jobId: string | null;
  status: 'building' | 'completed' | 'failed';
  previewUrl: string | null;
  files: ProjectFile[];
  stack: string;
  buildErrors: string[];
  projectName: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeployedProject {
  projectId: string;
  projectName: string | null;
  templateName: string | null;
  deploymentStatus: 'building' | 'completed' | 'failed';
  deployedAt: string;
  aiModelId: string; // Tech stack used
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}