export type AIModel = 'Thalorix-X Pro' | 'Thalorix-X Fast' | 'Thalorix-X Mini' | 'Thalorix-X Vision';

export interface AIBuilderResponse {
  ok?: boolean;
  reply_type?: string;
  intent?: string;
  reply?: string;
  session_id?: string;
  job_id?: string;
  projectId?: string;
  status?: string;
  files?: ProjectFile[];
  build_errors?: string[];
  build_duration_seconds?: number;
  message?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isCode?: boolean;
  language?: string;
  timestamp: Date;
  status?: 'building' | 'completed' | 'failed'; // Custom addition for tracing logs
  /** When message type is 'build_completed', this holds the build card data */
  buildCard?: WorkerBuildCard;
}

/** Data used to render the build-completed card inside a chat message */
export interface WorkerBuildCard {
  projectName: string;
  filesCount?: number;
  previewUrl?: string;
  downloadUrl?: string;
  distUrl?: string;
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
  /** Direct download URL for source.zip (from RunPod worker) */
  downloadUrl?: string | null;
  /** Direct download URL for dist.zip (from RunPod worker) */
  distUrl?: string | null;
  files: ProjectFile[];
  stack: string;
  buildErrors: string[];
  projectName: string | null;
  userId: string | null;
  filesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeployedProject {
  projectId: string;
  sessionId?: string;
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