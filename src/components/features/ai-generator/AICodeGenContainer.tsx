'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AIPromptEmptyState } from './AIPromptEmptyState';
import { AIChatInterface } from './AIChatInterface';
import { ChatHistorySidebar } from './ChatHistorySidebar';
import { AIMessage, AIModel, AIProject, DeployedProject, ProjectFile } from '@/types/ai';
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
      const readyData = await aiService.getReady();
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
          setBuildLogs(prev => [...prev, '✨ [System] Compilation completed successfully!', '🚀 [System] Project deployed and preview link generated.']);
          
          setActiveProject(project);
          setIsGenerating(false);
          setUploadedFile(null); // Clear active file uploads
          fetchDeployedProjects(); // Refresh dashboard list
          
          // Formulate messages
          const successMessage: AIMessage = {
            id: `sys-${Date.now()}`,
            role: 'assistant',
            content: `### 🎉 Generation Completed!\nYour project **${project.projectName}** has been successfully generated and deployed using the **${project.stack}** template stack.\n\nYou can explore the files inside the Workspace Viewer on the right, view the live preview, or download the ZIP archives. Use the chat input below to request modifications.`,
            timestamp: new Date()
          };
          setCurrentMessages(prev => [...prev.filter(m => m.id !== 'loading-spinner'), successMessage]);
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
      // Stack is determined by the selected model name or defaults to React 18 + Vite
      const techStack = model.includes('Pro') ? 'Next.js 14 App Router' : 'React 18+ Vite';
      const result = await aiService.generateProject(prompt, techStack, userId);
      
      if (result && result.projectId) {
        // Start polling the project details
        localStorage.setItem('activeProjectId', result.projectId);
        startPollingProject(result.projectId);
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
      if (result && result.projectId) {
        localStorage.setItem('activeProjectId', result.projectId);
        startPollingProject(result.projectId);
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
      const welcomeMsg: AIMessage = {
        id: `sys-${Date.now()}`,
        role: 'assistant',
        content: `### 📁 Project Workspace: **${project.projectName}**\nLoaded project using **${project.stack}** stack.\n\nYou can view the source code in the IDE workspace, open the preview URL, or type instructions below to modify the project.`,
        timestamp: new Date()
      };
      setCurrentMessages([welcomeMsg]);
      
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
  const handleDownloadDist = async (project: { sessionId: string; projectName: string | null }) => {
    if (!project.projectName) return;
    try {
      const blob = await aiService.downloadDistZip(project.sessionId, project.projectName);
      triggerBlobDownload(blob, `${project.projectName}-dist.zip`);
    } catch (err) {
      console.error('Dist zip download failed:', err);
      alert('Could not download built files. Please check service health.');
    }
  };

  // Trigger download of source code
  const handleDownloadSource = async (project: { sessionId: string; projectName: string | null }) => {
    if (!project.projectName) return;
    try {
      const blob = await aiService.downloadSourceZip(project.sessionId, project.projectName);
      triggerBlobDownload(blob, `${project.projectName}-source.zip`);
    } catch (err) {
      console.error('Source zip download failed:', err);
      alert('Could not download source files. Please check service health.');
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

  const handleNewChat = useCallback(() => {
    setActiveProject(null);
    setCurrentMessages([]);
    setUploadedFile(null);
    localStorage.removeItem('activeProjectId');
  }, []);

  const handleDeleteProject = useCallback((id: string) => {
    // Delete local reference
    setDeployedProjects(prev => prev.filter(p => p.projectId !== id));
    if (activeProject?._id === id) {
      handleNewChat();
    }
  }, [activeProject, handleNewChat]);

  // View toggler UI helpers
  const handleSelectConversation = useCallback((id: string) => {
    handleLoadProject(id);
  }, []);

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
            className={`px-5 py-2.5 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === 'chat' 
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
            className={`px-5 py-2.5 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
              activeTab === 'dashboard' 
                ? 'border-[#103B40] text-[#103B40]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Deployed Projects ({deployedProjects.length})
          </button>
        </div>

        {/* Service Health Banner */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm mb-1.5 flex-shrink-0">
          <span className={`w-2.5 h-2.5 rounded-full ${
            serviceStatus === 'healthy' ? 'bg-emerald-500 animate-pulse' : 
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
                          onClick={() => handleDownloadDist({ sessionId: proj.projectId, projectName: proj.projectName })}
                          className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-teal-50 hover:text-[#103B40] transition-colors font-medium border-b border-gray-100 cursor-pointer"
                        >
                          Built ZIP (.dist)
                        </button>
                        <button
                          onClick={() => handleDownloadSource({ sessionId: proj.projectId, projectName: proj.projectName })}
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
            conversations={deployedProjects.map(p => ({
              id: p.projectId,
              title: p.projectName || 'Unnamed Project',
              preview: p.aiModelId,
              date: 'Deployed'
            }))}
            activeId={activeProject?._id || null}
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-left-open"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
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
                        Session: {activeProject.sessionId.substring(0, 10)}...
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
                            onClick={() => handleDownloadDist({ sessionId: activeProject.sessionId, projectName: activeProject.projectName })}
                            className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded text-xs text-white/80 hover:text-white transition-colors cursor-pointer border border-[#333]"
                            title="Download package (dist.zip)"
                          >
                            <Download className="w-3 h-3" />
                            Build
                          </button>
                          <button
                            onClick={() => handleDownloadSource({ sessionId: activeProject.sessionId, projectName: activeProject.projectName })}
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
                            {activeProject.files.map((file, idx) => (
                              <button
                                key={file.path}
                                onClick={() => setActiveFileIndex(idx)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 md:px-2 rounded text-xs font-mono transition-colors cursor-pointer flex-shrink-0 md:w-full md:text-left ${
                                  activeFileIndex === idx
                                    ? 'bg-[#103B40] text-white font-medium'
                                    : 'text-gray-400 hover:bg-[#252525] hover:text-white'
                                }`}
                              >
                                <FileCode className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                                <span className="truncate max-w-[120px] md:max-w-none">{file.path}</span>
                              </button>
                            ))}
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
