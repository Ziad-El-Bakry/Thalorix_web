'use client';

import React, { useState } from 'react';
import { AIMessage } from '@/types/ai';
import { useAvatar } from '@/store/useAvatarStore';
import Image from 'next/image';
import { Copy, Check, Terminal, Edit2, ExternalLink, Download, CheckCircle2, Folder } from 'lucide-react';
import Editor from '@monaco-editor/react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  message: AIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { avatar } = useAvatar();
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [localContent, setLocalContent] = useState(message.content);

  React.useEffect(() => {
    if (!hasEdited) {
      setLocalContent(message.content);
    }
  }, [message.content, hasEdited]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.isCode ? localContent : message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderMarkdown = (content: string, isUserMessage: boolean) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-3 mt-2" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2 mt-4" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-2 mt-3" {...props} />,
        p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
        a: ({ node, ...props }) => (
          <a className="text-teal-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
        ),
        code: ({ node, inline, className, children, ...props }: any) => {
          if (!inline) {
            return (
              <div className="bg-[#1e1e1e] text-gray-200 p-3 rounded-lg my-3 overflow-x-auto text-[13px] font-mono shadow-inner border border-gray-800">
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            );
          }
          return (
            <code
              className={`${
                isUserMessage ? 'bg-teal-900/50 text-teal-100' : 'bg-gray-100 text-teal-700'
              } px-1.5 py-0.5 rounded text-[13px] font-mono mx-0.5`}
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
              <Image
                src={avatar}
                alt="User"
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#103B40] flex items-center justify-center shadow-sm">
              <Terminal className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          {!isUser && (
            <span className="text-xs font-semibold text-[#103B40] ml-1">
              Thalorix-X Vision
            </span>
          )}

          {isUser ? (
            <div className="bg-[#103B40] text-white px-5 py-3.5 rounded-2xl rounded-tr-md text-sm shadow-sm leading-relaxed overflow-hidden">
              {renderMarkdown(message.content, true)}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3">
              {!message.isCode && message.content && (
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4 text-sm text-gray-700 shadow-sm leading-relaxed overflow-hidden">
                  {renderMarkdown(message.content, false)}
                </div>
              )}

              {/* Build Completed Card */}
              {message.buildCard && (
                <div className="rounded-2xl rounded-tl-md border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm overflow-hidden">
                  {/* Card Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Build Completed</p>
                      <p className="text-sm font-semibold text-[#103B40] truncate">{message.buildCard.projectName}</p>
                    </div>
                  </div>

                  {/* Files count */}
                  {message.buildCard.filesCount !== undefined && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                      <Folder className="w-3.5 h-3.5 text-teal-600" />
                      <span>{message.buildCard.filesCount} files generated</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {message.buildCard.previewUrl && (
                      <a
                        href={message.buildCard.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#103B40] hover:bg-teal-800 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Preview
                      </a>
                    )}
                    {message.buildCard.downloadUrl && (
                      <a
                        href={message.buildCard.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Source
                      </a>
                    )}
                    {message.buildCard.distUrl && (
                      <a
                        href={message.buildCard.distUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Build
                      </a>
                    )}
                  </div>
                </div>
              )}

              {message.isCode && (
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  {/* Code Header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-[#103B40]">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-teal-300" />
                      <span className="text-xs font-medium text-white/90">
                        solution.{message.language === 'javascript' ? 'js' : message.language === 'python' ? 'py' : message.language === 'html' ? 'html' : 'ts'}
                      </span>
                      <span className="text-[10px] text-white/50 ml-1">Generated by Thalorix-X Vision</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors ${isEditing ? 'bg-teal-500/20 text-teal-300' : 'hover:bg-white/10 text-white/70 hover:text-white'}`}
                      >
                        {isEditing ? <Check className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />} 
                        {isEditing ? 'Done' : 'Edit'}
                      </button>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2 py-1 hover:bg-white/10 rounded text-[11px] text-white/70 hover:text-white transition-colors"
                      >
                        {copied ? <Check className="w-3 h-3 text-teal-300" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Code Body */}
                  <div className="bg-[#1e1e1e]">
                    <Editor
                      height={`${Math.min(Math.max(localContent.split('\n').length * 21, 100), 500)}px`}
                      language={message.language || 'javascript'}
                      theme="vs-dark"
                      value={localContent}
                      onChange={(val) => {
                        setLocalContent(val || '');
                        setHasEdited(true);
                      }}
                      options={{
                        readOnly: !isEditing,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 13,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        padding: { top: 12, bottom: 12 },
                        lineHeight: 21,
                        renderLineHighlight: 'none',
                        scrollbar: {
                          vertical: 'hidden',
                          horizontal: 'hidden',
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
