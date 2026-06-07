import api from '../axios';
import { ENDPOINTS } from '../endpoints';
import { AIProject, DeployedProject } from '@/types/ai';

export const aiService = {
  /**
   * Check AI Builder service health
   */
  async getHealth(): Promise<any> {
    const { data } = await api.get(ENDPOINTS.AI.HEALTH);
    return data.data || data;
  },

  /**
   * Check if AI service is ready
   */
  async getReady(): Promise<any> {
    const { data } = await api.get(ENDPOINTS.AI.READY);
    return data.data || data;
  },

  /**
   * Generate a new AI project from a prompt (asynchronous, queues job)
   * @param prompt The natural language description
   * @param stack Tech stack (e.g. 'React 18+ Vite')
   * @param userId The current user's ID
   */
  async generateProject(
    prompt: string,
    stack?: string,
    userId?: string
  ): Promise<{ projectId: string; sessionId: string; jobId: string | null; status: string }> {
    const payload = { prompt, stack, userId };
    const { data } = await api.post(ENDPOINTS.AI.CHAT, payload);
    return data.data || data;
  },

  /**
   * Upload file to AI Builder for processing
   * @param file File object
   * @param sessionId Optional session ID to attach the file to
   */
  async uploadFile(file: File | Blob, sessionId?: string): Promise<any> {
    const formData = new FormData();
    const filename = file instanceof File ? file.name : 'upload.bin';
    formData.append('file', file, filename);
    if (sessionId) {
      formData.append('session_id', sessionId);
    }

    const { data } = await api.post(ENDPOINTS.AI.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 0, // Disable timeout for large uploads
    });
    return data.data || data;
  },

  /**
   * Fetch all successfully deployed AI projects
   */
  async getDeployedProjects(): Promise<DeployedProject[]> {
    const { data } = await api.get(ENDPOINTS.AI.DEPLOYED);
    return data.data || data;
  },

  /**
   * Fetch project details by ID
   */
  async getProject(id: string): Promise<AIProject> {
    const { data } = await api.get(ENDPOINTS.AI.GET_PROJECT(id));
    return data.data || data;
  },

  /**
   * Edit an existing AI project (asynchronous, queues job)
   */
  async editProject(
    id: string,
    prompt: string
  ): Promise<{ projectId: string; jobId: string | null; status: string }> {
    const { data } = await api.patch(ENDPOINTS.AI.EDIT_PROJECT(id), { prompt });
    return data.data || data;
  },

  /**
   * Fetch project metadata (manifest)
   */
  async getManifest(sessionId: string, projectName: string): Promise<any> {
    const { data } = await api.get(ENDPOINTS.AI.MANIFEST(sessionId, projectName));
    return data.data || data;
  },

  /**
   * Get build/deployment status of running container
   */
  async getStatus(sessionId: string, projectName: string): Promise<any> {
    const { data } = await api.get(ENDPOINTS.AI.STATUS(sessionId, projectName));
    return data.data || data;
  },

  /**
   * Fetch a single project file
   */
  async getFile(sessionId: string, projectName: string, path: string): Promise<any> {
    const { data } = await api.get(ENDPOINTS.AI.FILE(sessionId, projectName), {
      params: { path },
    });
    return data.data || data;
  },

  /**
   * Get live preview URL
   */
  async getPreview(sessionId: string, projectName: string): Promise<any> {
    const { data } = await api.get(ENDPOINTS.AI.PREVIEW(sessionId, projectName));
    return data.data || data;
  },

  /**
   * Download built frontend package (dist.zip)
   */
  async downloadDistZip(sessionId: string, projectName: string): Promise<Blob> {
    const response = await api.get(ENDPOINTS.AI.DIST_ZIP(sessionId, projectName), {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Download full project source code (source.zip)
   */
  async downloadSourceZip(sessionId: string, projectName: string): Promise<Blob> {
    const response = await api.get(ENDPOINTS.AI.SOURCE_ZIP(sessionId, projectName), {
      responseType: 'blob',
    });
    return response.data;
  },
};