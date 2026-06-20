import { useState, useCallback } from "react";
import { aiService } from "@/lib/api/services/ai.service";
import { DeployedProject, AIProject } from "@/types/ai";

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<DeployedProject[]>([]);
  const [currentProject, setCurrentProject] = useState<AIProject | null>(null);

  const generateProject = useCallback(async (prompt: string, stack?: string, userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.generateProject(prompt, stack, userId);
      return response;
    } catch (err: any) {
      setError(err.message || "Failed to generate project");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeployedProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiService.getDeployedProjects();
      setProjects(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch deployed projects");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjectDetails = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiService.getProject(id);
      setCurrentProject(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch project details");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    projects,
    currentProject,
    generateProject,
    fetchDeployedProjects,
    fetchProjectDetails,
  };
};