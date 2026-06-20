'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AIPromptEmptyState } from './AIPromptEmptyState';
import { AIChatInterface } from './AIChatInterface';
import { ChatHistorySidebar } from './ChatHistorySidebar';
import { AIMessage, AIModel, AIProject, DeployedProject, ProjectFile } from '@/types/ai';

// Locally-persisted conversation snapshot
interface SavedConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  model: AIModel;
  projectId?: string; // linked deployed project id, if any
  createdAt: string;
}
import UserHeader from '@/components/ui/UserHeader';
import { authService } from '@/lib/api/services/auth.service';
import { aiService } from '@/lib/api/services/ai.service';
import {
  Terminal,
  Sparkles,
  ExternalLink,
  Download,
  Folder,
  FileCode,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertTriangle,
  UploadCloud,
  Layers,
  Calendar,
  User as UserIcon,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';

export function AICodeGenContainer() {
  // Navigation / View Tabs
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard'>('chat');

  // Deployed Projects State
  const [deployedProjects, setDeployedProjects] = useState<DeployedProject[]>([]);
  const [isLoadingDeployed, setIsLoadingDeployed] = useState(false);

  // Active Project & Generation State
  const [activeProject, setActiveProject] = useState<AIProject | null>(null);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [currentMessages, setCurrentMessages] = useState<AIMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<AIModel>('Thalorix-X Vision');

  // Service Health State
  const [serviceStatus, setServiceStatus] = useState<'healthy' | 'loading' | 'offline'>('healthy');
  const [serviceMessage, setServiceMessage] = useState<string>('');

  // User/Credits Info
  const [userName, setUserName] = useState('User');
  const [userId, setUserId] = useState<string>('');
  const [credits, setCredits] = useState(50);

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string; sessionId?: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Sidebar Open State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Saved Conversations (local history)
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Polling Reference
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);



  const apiGetCredits = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response && typeof response.credits === 'number') {
        setCredits(response.credits);
      }
    } catch (err) {
      console.warn('Could not load user credits, using fallback:', err);
    }
  };

  const checkServiceHealth = async () => {
    try {
      // Check ready status
      await aiService.getReady();
      setServiceStatus('healthy');
      setServiceMessage('AI Builder Service Online');
    } catch (err: any) {
      if (err.response?.status === 503) {
        setServiceStatus('loading');
        setServiceMessage('Models loading (1-3 min cold start)...');
      } else {
        setServiceStatus('offline');
        setServiceMessage('AI Builder Service Offline');
      }
    }
  };

  const fetchDeployedProjects = async () => {
    setIsLoadingDeployed(true);
    try {
      const projects = await aiService.getDeployedProjects();
      setDeployedProjects(projects || []);
    } catch (err) {
      console.error('Failed to load deployed projects:', err);
    } finally {
      setIsLoadingDeployed(false);
    }
  };

  // Poll Project Build Status
  const startPollingProject = (projectId: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    let logsList = [
      '⚡ [System] Build job queued successfully.',
      '🤖 [AI Builder] Spawning code generation agent...',
      '📁 [System] Creating workspace directory structure...',
    ];
    setBuildLogs(logsList);

    let attempts = 0;
    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      try {
        const project = await aiService.getProject(projectId);

        // Progressively add mock logs to look extremely realistic
        if (attempts === 2) {
          setBuildLogs(prev => [...prev, '📝 [AI Builder] Generation in progress. Analyzing prompt...', '⚙️ [AI Builder] Formulating tech stack config...']);
        } else if (attempts === 4) {
          setBuildLogs(prev => [...prev, '📦 [System] Synthesizing component directory tree...', '💻 [AI Builder] Writing src code files...']);
        } else if (attempts === 6) {
          setBuildLogs(prev => [...prev, '🔧 [System] Generating manifest files & dependencies...', '🔨 [System] Spawning compilation sub-process...']);
        }

        if (project.status === 'completed') {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setIsGenerating(false);
          setUploadedFile(null);
          fetchDeployedProjects();

          // Check if this is a chat reply (not a real project build)
          const chatReplyFile = project.files?.find((f: any) => f.path === '_chat_reply.md');
          if (chatReplyFile || project.projectName === 'Chat Response') {
            // Display AI reply as a chat message — don't load workspace
            const replyContent = chatReplyFile?.content || 'The AI responded but no text was returned.';
            const aiMessage: AIMessage = {
              id: `ai-${Date.now()}`,
              role: 'assistant',
              content: replyContent,
              timestamp: new Date()
            };
            setCurrentMessages(prev => [...prev.filter(m => m.id !== 'loading-spinner'), aiMessage]);
          } else {
            // Real project with files — load workspace
            setBuildLogs(prev => [...prev, '✨ [System] Compilation completed successfully!', '🚀 [System] Project deployed and preview link generated.']);
            setActiveProject(project);

            // Add the UI Card for the completed project
            const aiReplyFile = project.files?.find((f: any) => f.path === '_ai_reply.md' || f.path === '_chat_reply.md');
            const cardMsg: AIMessage = {
              id: `build-${Date.now()}`,
              role: 'assistant',
              content: aiReplyFile?.content || '',
              buildCard: {
                projectName: project.projectName || 'My Project',
                filesCount: project.filesCount || project.files?.length,
                previewUrl: project.previewUrl ?? undefined,
                downloadUrl: project.downloadUrl ?? undefined,
                distUrl: project.distUrl ?? undefined,
              },
              timestamp: new Date()
            };
            setCurrentMessages(prev => [...prev.filter(m => m.id !== 'loading-spinner'), cardMsg]);
          }
        } else if (project.status === 'failed') {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          const errors = project.buildErrors || ['Unknown build error'];
          setBuildLogs(prev => [...prev, `❌ [System] Build failed!`, ...errors.map(e => `[Error] ${e}`)]);

          setActiveProject(project);
          setIsGenerating(false);

          const failureMessage: AIMessage = {
            id: `sys-${Date.now()}`,
            role: 'assistant',
            content: `### ❌ Build Failed\nWe encountered compile/generation errors during the build process:\n\n\`\`\`\n${errors.join('\n')}\n\`\`\`\n\nPlease describe what to fix in the prompt below.`,
            timestamp: new Date()
          };
          setCurrentMessages(prev => [...prev.filter(m => m.id !== 'loading-spinner'), failureMessage]);
        }
      } catch (err) {
        console.error('Error polling project status:', err);
      }
    }, 3000);
  };

  // Generate Project
  const handleGenerate = async (prompt: string, model: AIModel) => {
    if (credits <= 0) return;

    setIsGenerating(true);
    setSelectedModel(model);
    setCredits(prev => Math.max(0, prev - 1));

    // Assign a conversation ID if this is a brand-new chat
    if (!activeConversationId) {
      setActiveConversationId(`conv_${Date.now()}`);
    }

    // Formulate User Message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };

    const newMessages = [...currentMessages, userMessage];
    setCurrentMessages(newMessages);

    // Render loading indicator message
    const loadingMsg: AIMessage = {
      id: 'loading-spinner',
      role: 'assistant',
      content: 'Building project...',
      timestamp: new Date()
    };
    setCurrentMessages(prev => [...prev, loadingMsg]);

    try {
      // Call Chat generation endpoint
      const techStack = model.includes('Pro') ? 'Next.js 14 App Router' : 'React 18+ Vite';
      const result = await aiService.generateProject(prompt, techStack, userId);

      if (result && result.reply_type === 'chat') {
        setIsGenerating(false);
        const aiMessage: AIMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: result.reply || 'No reply generated.',
          timestamp: new Date()
        };
        setCurrentMessages(prev => [...prev.filter(m => m.id !== 'loading-spinner'), aiMessage]);
        return;
      }

      const pid = (result as any).projectId || (result as any)._id;
      if (pid) {
        localStorage.setItem('activeProjectId', pid);
        startPollingProject(pid);
      } else {
        throw new Error('No projectId returned from server');
      }
    } catch (err: any) {
      console.error('Generation Error:', err);
      setIsGenerating(false);

      const errorMessage: AIMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `❌ **Failed to queue build job**: ${err.message || 'API is unreachable.'}`,
        timestamp: new Date()
      };
      setCurrentMessages(prev => [...prev.filter(m => m.id !== 'loading-spinner'), errorMessage]);
    }
  };

  // Edit Existing Project
  const handleEditProject = async (prompt: string, model: AIModel) => {
    if (!activeProject) return;

    setIsGenerating(true);
    setCredits(prev => Math.max(0, prev - 1));

    // Formulate User Message
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };

    setCurrentMessages(prev => [...prev, userMessage]);

    // Render loading indicator message
    const loadingMsg: AIMessage = {
      id: 'loading-spinner',
      role: 'assistant',
      content: 'Building updates...',
      timestamp: new Date()
    };
    setCurrentMessages(prev => [...prev, loadingMsg]);

    try {
      const result = await aiService.editProject(activeProject._id, prompt);

      if (result && result.reply_type === 'chat') {
        setIsGenerating(false);
        const aiMessage: AIMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: result.reply || 'No reply generated.',
          timestamp: new Date()
        };
        setCurrentMessages(prev => [...prev.filter(m => m.id !== 'loading-spinner'), aiMessage]);
        return;
      }

      const pid = (result as any).projectId || (result as any)._id;
      if (pid) {
        localStorage.setItem('activeProjectId', pid);
        startPollingProject(pid);
      } else {
        throw new Error('No projectId returned from edit request');
      }
    } catch (err: any) {
      console.error('Edit Error:', err);
      setIsGenerating(false);

      const errorMessage: AIMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `❌ **Failed to queue edit job**: ${err.message || 'API is unreachable.'}`,
        timestamp: new Date()
      };
      setCurrentMessages(prev => [...prev.filter(m => m.id !== 'loading-spinner'), errorMessage]);
    }
  };

  // Load a project into active workspace
  const handleLoadProject = async (projectId: string) => {
    setActiveTab('chat');
    setIsGenerating(true);
    localStorage.setItem('activeProjectId', projectId);

    // Reset message logs
    setCurrentMessages([
      {
        id: 'loading-details',
        role: 'assistant',
        content: 'Loading project workspace...',
        timestamp: new Date()
      }
    ]);

    try {
      const project = await aiService.getProject(projectId);
      setActiveProject(project);
      setActiveFileIndex(0);
      setIsGenerating(false);

      // Populate messages
      const initialMessages: AIMessage[] = [
        {
          id: `sys-${Date.now()}`,
          role: 'assistant',
          content: `### 📁 Project Workspace: **${project.projectName || 'My Project'}**\nLoaded project using **${project.stack}** stack.\n\nYou can view the source code in the IDE workspace, open the preview URL, or type instructions below to modify the project.`,
          timestamp: new Date()
        }
      ];

      // Add original prompt if available
      if ((project as any).prompt) {
        initialMessages.push({
          id: `user-${Date.now()}`,
          role: 'user',
          content: (project as any).prompt,
          timestamp: new Date(project.createdAt || Date.now())
        });
      }

      // Add AI reply / build card if completed
      if (project.status === 'completed') {
        const aiReplyFile = project.files?.find((f: any) => f.path === '_ai_reply.md' || f.path === '_chat_reply.md');
        const cardMsg: AIMessage = {
          id: `build-${Date.now()}`,
          role: 'assistant',
          content: aiReplyFile?.content || '',
          buildCard: {
            projectName: project.projectName || 'My Project',
            filesCount: project.filesCount || project.files?.length,
            previewUrl: project.previewUrl ?? undefined,
            downloadUrl: project.downloadUrl ?? undefined,
            distUrl: project.distUrl ?? undefined,
          },
          timestamp: new Date(project.updatedAt || Date.now())
        };
        initialMessages.push(cardMsg);
      }

      setCurrentMessages(initialMessages);

      // If it is somehow stuck in building state, resume polling
      if (project.status === 'building') {
        setIsGenerating(true);
        startPollingProject(project._id);
      }
    } catch (err: any) {
      console.error('Failed to load project details:', err);
      setIsGenerating(false);
      setCurrentMessages([
        {
          id: `sys-${Date.now()}`,
          role: 'assistant',
          content: `❌ **Failed to load project workspace**: ${err.message || 'API is offline'}`,
          timestamp: new Date()
        }
      ]);
    }
  };

  // File Upload Handler
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const sessionId = activeProject?.sessionId || undefined;
      const result = await aiService.uploadFile(file, sessionId);
      setUploadedFile({
        name: file.name,
        url: result.url || '',
        sessionId: result.session_id || sessionId
      });
      // Show local confirmation
    } catch (err: any) {
      console.error('File upload failed:', err);
      alert(`Upload failed: ${err.message || 'Error uploading file'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger download of built package
  const handleDownloadDist = async (project: { sessionId: string; projectName: string | null; distUrl?: string }) => {
    if (project.distUrl) {
      window.open(project.distUrl, '_blank');
      return;
    }
    if (!project.projectName) return;
    try {
      const blob = await aiService.downloadDistZip(project.sessionId, project.projectName);
      triggerBlobDownload(blob, `${project.projectName}-dist.zip`);
    } catch (err: any) {
      console.error('Dist zip download failed:', err);
      let errMsg = err.message || 'Could not download built files.';
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          errMsg = json.message || text;
        } catch (e) {}
      }
      const errorMessage: AIMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `❌ **Download Failed**: ${errMsg}`,
        timestamp: new Date()
      };
      setCurrentMessages(prev => [...prev, errorMessage]);
    }
  };

  // Trigger download of source code
  const handleDownloadSource = async (project: { sessionId: string; projectName: string | null; downloadUrl?: string }) => {
    if (project.downloadUrl) {
      window.open(project.downloadUrl, '_blank');
      return;
    }
    if (!project.projectName) return;
    try {
      const blob = await aiService.downloadSourceZip(project.sessionId, project.projectName);
      triggerBlobDownload(blob, `${project.projectName}-source.zip`);
    } catch (err: any) {
      console.error('Source zip download failed:', err);
      let errMsg = err.message || 'Could not download source files.';
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          errMsg = json.message || text;
        } catch (e) {}
      }
      const errorMessage: AIMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `❌ **Download Failed**: ${errMsg}`,
        timestamp: new Date()
      };
      setCurrentMessages(prev => [...prev, errorMessage]);
    }
  };

  const triggerBlobDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Helper: derive a title from the first user message
  const deriveChatTitle = (messages: AIMessage[]): string => {
    const firstUserMsg = messages.find(m => m.role === 'user');
    if (firstUserMsg) {
      const text = firstUserMsg.content.trim();
      return text.length > 50 ? text.slice(0, 50) + '…' : text;
    }
    return 'Untitled Chat';
  };

  // Helper: persist saved conversations to localStorage
  const persistConversations = (convs: SavedConversation[]) => {
    try {
      localStorage.setItem('ai_saved_conversations', JSON.stringify(convs));
    } catch (e) {
      console.warn('Failed to persist conversations:', e);
    }
  };

  const handleNewChat = useCallback(() => {
    // Stop any ongoing generation / polling
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsGenerating(false);
    setBuildLogs([]);

    // Save the current conversation if it has messages
    setCurrentMessages(prevMessages => {
      if (prevMessages.length > 0) {
        const convId = activeConversationId || `conv_${Date.now()}`;
        const newSaved: SavedConversation = {
          id: convId,
          title: deriveChatTitle(prevMessages),
          messages: prevMessages.filter(m => m.id !== 'loading-spinner'),
          model: selectedModel,
          projectId: activeProject?._id || undefined,
          createdAt: new Date().toISOString(),
        };

        setSavedConversations(prev => {
          // Update existing or prepend new
          const exists = prev.findIndex(c => c.id === convId);
          let updated: SavedConversation[];
          if (exists > -1) {
            updated = [...prev];
            updated[exists] = newSaved;
          } else {
            updated = [newSaved, ...prev];
          }
          persistConversations(updated);
          return updated;
        });
      }
      return []; // clear messages
    });

    // Reset chat state
    setActiveProject(null);
    setActiveConversationId(null);
    setUploadedFile(null);
    localStorage.removeItem('activeProjectId');
  }, [activeConversationId, selectedModel, activeProject]);

  const handleDeleteProject = useCallback((id: string) => {
    // Check if it's a saved conversation
    setSavedConversations(prev => {
      const updated = prev.filter(c => c.id !== id);
      persistConversations(updated);
      return updated;
    });

    // Also remove from deployed projects
    setDeployedProjects(prev => prev.filter(p => p.projectId !== id));

    if (activeProject?._id === id || activeConversationId === id) {
      // Stop generation and clear state without re-saving
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      setIsGenerating(false);
      setBuildLogs([]);
      setActiveProject(null);
      setActiveConversationId(null);
      setCurrentMessages([]);
      setUploadedFile(null);
      localStorage.removeItem('activeProjectId');
    }
  }, [activeProject, activeConversationId]);

  // View toggler UI helpers
  const handleSelectConversation = useCallback((id: string) => {
    // Check if it's a locally saved conversation first
    const saved = savedConversations.find(c => c.id === id);
    if (saved) {
      // Stop any ongoing generation
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      setIsGenerating(false);
      setBuildLogs([]);

      setActiveConversationId(saved.id);
      setCurrentMessages(saved.messages.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })));
      setSelectedModel(saved.model);
      setUploadedFile(null);

      // If the saved conversation had a linked project, load it
      if (saved.projectId) {
        handleLoadProject(saved.projectId);
      } else {
        setActiveProject(null);
        localStorage.removeItem('activeProjectId');
      }
      return;
    }

    // Otherwise it's a deployed project — load from API
    handleLoadProject(id);
  }, [savedConversations]);

  // Load User Info & Deployed Projects on Mount
  useEffect(() => {
    const user = authService.getStoredUser() as any;
    if (user) {
      setUserName((user?.name || user?.username)?.split(' ')[0] || 'User');
      setUserId(user.id || user._id || '');
      // Fetch credits if endpoint exists, otherwise fallback to default
      apiGetCredits();
    }

    checkServiceHealth();
    fetchDeployedProjects();

    // Load saved conversations from localStorage
    try {
      const stored = localStorage.getItem('ai_saved_conversations');
      if (stored) {
        setSavedConversations(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load saved conversations:', e);
    }

    const storedProjectId = localStorage.getItem('activeProjectId');
    if (storedProjectId) {
      handleLoadProject(storedProjectId);
    }

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-140px)] relative">
      {/* Header */}
      <UserHeader name={userName} compact />
      <div className="h-px bg-gray-300 mb-6 md:mb-8 flex-shrink-0" />

      {/* Primary Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 mb-6 flex-shrink-0 gap-4 pb-2 sm:pb-0">
        <div className="flex">
          <button
            onClick={() => {
              setActiveTab('chat');
              fetchDeployedProjects();
            }}
            className={`px-5 py-2.5 font-semibold text-sm transition-all border-b-2 cursor-pointer ${activeTab === 'chat'
                ? 'border-[#103B40] text-[#103B40]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            AI Generator
          </button>
          <button
            onClick={() => {
              setActiveTab('dashboard');
              fetchDeployedProjects();
            }}
            className={`px-5 py-2.5 font-semibold text-sm transition-all border-b-2 cursor-pointer ${activeTab === 'dashboard'
                ? 'border-[#103B40] text-[#103B40]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Deployed Projects ({deployedProjects.length})
          </button>
        </div>

        {/* Service Health Banner */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm mb-1.5 flex-shrink-0">
          <span className={`w-2.5 h-2.5 rounded-full ${serviceStatus === 'healthy' ? 'bg-emerald-500 animate-pulse' :
              serviceStatus === 'loading' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
            }`} />
          <span className="text-gray-600">{serviceMessage}</span>
          <button
            onClick={checkServiceHealth}
            className="ml-1.5 p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-[#103B40] transition-colors cursor-pointer"
            title="Refresh status"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* View Switch */}
      {activeTab === 'dashboard' ? (
        // ============================================
        // DEPLOYED PROJECTS DASHBOARD
        // ============================================
        <div className="flex-1 w-full pb-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-[#103B40]">Deployed Dashboard</h3>
            <p className="text-sm text-gray-500">Manage all AI-generated systems deployed to active preview runtimes.</p>
          </div>

          {isLoadingDeployed ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <RefreshCw className="w-10 h-10 animate-spin text-[#103B40] mb-4" />
              <p className="text-sm">Fetching projects...</p>
            </div>
          ) : deployedProjects.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm max-w-2xl mx-auto mt-8">
              <UploadCloud className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-md font-bold text-gray-700 mb-1">No Deployed Projects</h4>
              <p className="text-sm text-gray-400 mb-6">You haven't generated any systems yet. Head over to the AI Generator to build your first template.</p>
              <button
                onClick={() => setActiveTab('chat')}
                className="bg-[#103B40] hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Go to AI Generator
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deployedProjects.map((proj) => (
                <motion.div
                  key={proj.projectId}
                  whileHover={{ y: -4, boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)' }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[230px]"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Ready
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(proj.deployedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#103B40] truncate mb-1">
                        {proj.projectName || 'Unnamed Project'}
                      </h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1 truncate mb-3">
                        <Layers className="w-3.5 h-3.5" />
                        {proj.aiModelId || 'React 18+ Vite'}
                      </p>
                    </div>

                    {proj.user && (
                      <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                        <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium truncate">
                          {proj.user.name || proj.user.email}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="grid grid-cols-4 border-t border-gray-100 p-2.5 bg-white gap-2">
                    <button
                      onClick={() => handleLoadProject(proj.projectId)}
                      className="flex items-center justify-center p-2 rounded-lg bg-teal-50 text-[#103B40] hover:bg-teal-100 transition-colors text-xs font-semibold col-span-2 gap-1 cursor-pointer"
                      title="Load project files and edit"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Workspace
                    </button>

                    <button
                      onClick={() => {
                        // Look up URL details by loading first if not set
                        handleLoadProject(proj.projectId);
                      }}
                      className="flex items-center justify-center p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200 text-xs font-medium cursor-pointer"
                      title="Open Live Preview"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    {/* Downloads Menu */}
                    <div className="relative group col-span-1">
                      <button
                        className="w-full flex items-center justify-center p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200 text-xs font-medium cursor-pointer"
                        title="Download options"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block z-50 w-[150px] overflow-hidden">
                        <button
                          onClick={() => handleDownloadDist({ sessionId: proj.sessionId || proj.projectId, projectName: proj.projectName, distUrl: (proj as any).distUrl ?? undefined })}
                          className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-teal-50 hover:text-[#103B40] transition-colors font-medium border-b border-gray-100 cursor-pointer"
                        >
                          Built ZIP (.dist)
                        </button>
                        <button
                          onClick={() => handleDownloadSource({ sessionId: proj.sessionId || proj.projectId, projectName: proj.projectName, downloadUrl: (proj as any).downloadUrl ?? undefined })}
                          className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-teal-50 hover:text-[#103B40] transition-colors font-medium cursor-pointer"
                        >
                          Source ZIP (.src)
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // ============================================
        // AI GENERATOR VIEW (Chat + Workspace)
        // ============================================
        <div className="flex flex-1 relative gap-0 md:gap-5 pb-6">
          {/* History Sidebar */}
          <ChatHistorySidebar
            conversations={[
              // Saved local conversations first
              ...savedConversations.map(c => ({
                id: c.id,
                title: c.title,
                preview: c.model,
                date: new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
              })),
              // Then deployed projects (exclude any that are already in saved conversations)
              ...deployedProjects
                .filter(p => !savedConversations.some(c => c.projectId === p.projectId))
                .map(p => ({
                  id: p.projectId,
                  title: p.projectName || 'Unnamed Project',
                  preview: p.aiModelId,
                  date: 'Deployed',
                })),
            ]}
            activeId={activeConversationId || activeProject?._id || null}
            onSelect={handleSelectConversation}
            onNewChat={handleNewChat}
            onDelete={handleDeleteProject}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Main workspace layout */}
          <div className="flex-1 min-w-0 flex flex-col relative min-h-[calc(100vh-200px)]">
            {!isSidebarOpen && (
              <div className="sticky top-6 z-20 w-0 h-0">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="absolute top-0 left-0 md:-left-5 p-1.5 text-gray-400 hover:text-[#103B40] hover:bg-gray-100 rounded-r-lg border border-l-0 border-gray-200 bg-white transition-colors shadow-sm cursor-pointer"
                  title="Open sidebar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-left-open"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /><path d="m14 9 3 3-3 3" /></svg>
                </button>
              </div>
            )}

            {/* If there is no active project and we aren't generating, show empty state */}
            {currentMessages.length === 0 && !isGenerating ? (
              <div className="flex-1 flex items-center justify-center py-10">
                <AIPromptEmptyState
                  onGenerate={handleGenerate}
                  selectedModel={selectedModel}
                  onModelSelect={setSelectedModel}
                  credits={credits}
                  onFileUpload={handleFileUpload}
                  uploadedFile={uploadedFile}
                  isUploadingFile={isUploading}
                />
              </div>
            ) : (
              // Split Layout: Chat Left, IDE Workspace Right (if project exists)
              <div className="flex-1 flex flex-col lg:flex-row gap-5 items-stretch min-h-0">
                {/* Chat Column */}
                <div className={`flex flex-col border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden flex-1 h-[500px] lg:h-auto ${activeProject?.status === 'completed' ? 'lg:max-w-md' : 'w-full'}`}>
                  {/* Chat Header */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <span className="text-xs font-bold text-[#103B40]">AI Generation Thread</span>
                    {activeProject && (
                      <span className="text-[10px] font-medium text-gray-400">
                        Session: {activeProject.sessionId ? `${activeProject.sessionId.substring(0, 10)}...` : 'N/A'}
                      </span>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
                    <AIChatInterface
                      messages={currentMessages}
                      isGenerating={isGenerating}
                      onGenerate={activeProject ? (prompt) => handleEditProject(prompt, selectedModel) : handleGenerate}
                      selectedModel={selectedModel}
                      onModelSelect={setSelectedModel}
                      onReset={handleNewChat}
                      credits={credits}
                      onFileUpload={handleFileUpload}
                      uploadedFile={uploadedFile}
                      isUploadingFile={isUploading}
                    />
                  </div>
                </div>

                {/* IDE Workspace / Build Logs Column (Only if project loaded/building) */}
                {(isGenerating || activeProject) && (
                  <div className="flex-1 flex flex-col border border-gray-200 rounded-xl bg-[#1e1e1e] shadow-lg overflow-hidden text-white min-h-[450px] h-[550px] lg:h-auto">
                    {/* IDE Header */}
                    <div className="px-4 py-3 bg-[#181818] border-b border-[#2d2d2d] flex items-center justify-between flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-teal-400" />
                        <span className="text-xs font-bold font-mono tracking-wider">
                          WORKSPACE EDITOR: {activeProject?.projectName || 'INITIALIZING'}
                        </span>
                      </div>

                      {activeProject?.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          {activeProject.previewUrl && (
                            <button
                              onClick={() => window.open(activeProject.previewUrl!, '_blank')}
                              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#103B40] hover:bg-teal-800 transition-colors text-xs font-medium text-white shadow-sm cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Preview
                            </button>
                          )}
                          <button
                            onClick={() => handleDownloadDist({ sessionId: activeProject.sessionId, projectName: activeProject.projectName, distUrl: activeProject.distUrl ?? undefined })}
                            className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded text-xs text-white/80 hover:text-white transition-colors cursor-pointer border border-[#333]"
                            title="Download package (dist.zip)"
                          >
                            <Download className="w-3 h-3" />
                            Build
                          </button>
                          <button
                            onClick={() => handleDownloadSource({ sessionId: activeProject.sessionId, projectName: activeProject.projectName, downloadUrl: activeProject.downloadUrl ?? undefined })}
                            className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded text-xs text-white/80 hover:text-white transition-colors cursor-pointer border border-[#333]"
                            title="Download source code"
                          >
                            <Download className="w-3 h-3" />
                            Source
                          </button>
                        </div>
                      )}
                    </div>

                    {/* IDE Body */}
                    {isGenerating && activeProject?.status !== 'completed' ? (
                      // Show build logs console during compilation
                      <div className="flex-1 p-5 font-mono text-xs text-gray-300 overflow-y-auto space-y-1 bg-[#151515] select-text">
                        <div className="flex items-center gap-2 text-amber-500 mb-4 animate-pulse">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>PROJECT IS BUILDING IN CONTAINER... POLLING REAL-TIME AGENT LOGS</span>
                        </div>
                        {buildLogs.map((log, index) => (
                          <div key={index} className="leading-relaxed whitespace-pre-wrap">
                            {log}
                          </div>
                        ))}
                      </div>
                    ) : activeProject?.status === 'completed' && activeProject.files?.length > 0 ? (
                      // Show Workspace: Files explorer on the left, Monaco Editor on the right
                      <div className="flex-1 flex flex-col md:flex-row min-h-0">
                        {/* File Tree Sidebar */}
                        <div className="w-full md:w-[180px] bg-[#181818] border-b md:border-b-0 md:border-r border-[#2d2d2d] flex flex-row md:flex-col min-h-0 flex-shrink-0 overflow-x-auto md:overflow-x-visible md:overflow-y-auto">
                          <div className="hidden md:flex p-2 border-b border-[#2d2d2d] text-[10px] uppercase font-bold tracking-widest text-gray-500 items-center gap-1">
                            <Folder className="w-3 h-3 text-amber-500" />
                            Project Files
                          </div>
                          <div className="flex flex-row md:flex-col p-1.5 md:space-y-1 gap-2 md:gap-0 flex-1 overflow-x-auto md:overflow-y-auto whitespace-nowrap md:whitespace-normal">
                            {activeProject.files.map((file, idx) => {
                              if (!file) return null;
                              return (
                                <button
                                  key={file.path || `file-${idx}`}
                                  onClick={() => setActiveFileIndex(idx)}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 md:px-2 rounded text-xs font-mono transition-colors cursor-pointer flex-shrink-0 md:w-full md:text-left ${activeFileIndex === idx
                                      ? 'bg-[#103B40] text-white font-medium'
                                      : 'text-gray-400 hover:bg-[#252525] hover:text-white'
                                    }`}
                                >
                                  <FileCode className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                                  <span className="truncate max-w-[120px] md:max-w-none">{file.path || `File ${idx}`}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Editor viewport */}
                        <div className="flex-1 bg-[#1e1e1e] flex flex-col min-h-0 relative">
                          <div className="bg-[#151515] px-4 py-1.5 border-b border-[#2d2d2d] text-xs font-mono text-gray-400 flex items-center justify-between flex-shrink-0">
                            <span>{activeProject.files[activeFileIndex]?.path}</span>
                            <span className="text-[10px] uppercase text-teal-600 bg-teal-950/40 px-2 py-0.5 rounded border border-teal-900/30">
                              {activeProject.files[activeFileIndex]?.language || 'javascript'}
                            </span>
                          </div>

                          <div className="flex-1 min-h-0">
                            <Editor
                              theme="vs-dark"
                              language={activeProject.files[activeFileIndex]?.language || 'javascript'}
                              value={activeProject.files[activeFileIndex]?.content || ''}
                              options={{
                                readOnly: true,
                                minimap: { enabled: false },
                                fontSize: 13,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                padding: { top: 12, bottom: 12 },
                                scrollbar: {
                                  vertical: 'auto',
                                  horizontal: 'auto',
                                },
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : activeProject?.status === 'completed' && activeProject.previewUrl ? (
                      // No files but preview URL available — show preview iframe
                      <div className="flex-1 flex flex-col min-h-0">
                        <div className="bg-[#151515] px-4 py-2 border-b border-[#2d2d2d] flex items-center gap-2 text-xs font-mono text-gray-400 flex-shrink-0">
                          <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                          <span className="truncate">{activeProject.previewUrl}</span>
                          <button
                            onClick={() => window.open(activeProject.previewUrl!, '_blank')}
                            className="ml-auto shrink-0 px-2 py-0.5 bg-teal-900/40 hover:bg-teal-800 text-teal-300 rounded text-[10px] transition-colors cursor-pointer border border-teal-800/50"
                          >
                            Open ↗
                          </button>
                        </div>
                        <iframe
                          src={activeProject.previewUrl}
                          className="flex-1 w-full border-0 bg-white"
                          title="Project Preview"
                          sandbox="allow-scripts allow-same-origin allow-forms"
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-10 bg-[#1e1e1e]">
                        <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
                        <p className="text-sm font-mono">No workspace files generated.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
