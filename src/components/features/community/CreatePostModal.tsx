"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Video,
  ImageIcon,
  FileText,
  Smile,
  Globe,
  ChevronDown,
  Plus,
  Hash,
  Bold,
  Italic,
  List,
  LinkIcon,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";

type PostTab = "text" | "video" | "photo" | "article";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: PostTab;
  userName?: string;
  userAvatar?: string;
  onPost?: (post: {
    content: string;
    media?: File[];
    visibility: string;
    link?: string;
  }) => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  initialTab = "text",
  userName = "User",
  userAvatar = "/images/avatar.png",
  onPost,
}: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [activeTab, setActiveTab] = useState<PostTab>(initialTab);
  const [visibility, setVisibility] = useState("Anyone");
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setContent("");
      setLink("");
      setShowLinkInput(false);
      setMediaFiles([]);
      setMediaPreviews([]);
      setShowVisibilityMenu(false);
      setShowEmojiPicker(false);
      // Focus textarea after animation
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [isOpen, initialTab]);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 300) + "px";
    }
  }, [content]);

  const handleMediaSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const newFiles = Array.from(files);
      setMediaFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMediaPreviews((prev) => [
            ...prev,
            e.target?.result as string,
          ]);
        };
        reader.readAsDataURL(file);
      });
    },
    []
  );

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleMediaSelect(e.dataTransfer.files);
  };

  const handlePost = () => {
    if (!content.trim() && mediaFiles.length === 0 && !link.trim()) return;
    onPost?.({
      content,
      media: mediaFiles.length > 0 ? mediaFiles : undefined,
      visibility,
      link: link.trim() || undefined,
    });
    onClose();
  };

  const canPost = (content.trim().length > 0 || mediaFiles.length > 0 || link.trim().length > 0);

  const visibilityOptions = [
    { label: "Anyone", icon: Globe, desc: "Anyone on the platform" },
    { label: "Connections only", icon: Globe, desc: "Only your connections" },
  ];

  const toolbarButtons: {
    tab: PostTab;
    icon: React.ElementType;
    label: string;
    activeColor: string;
  }[] = [
    { tab: "video", icon: Video, label: "Video", activeColor: "text-red-500" },
    {
      tab: "photo",
      icon: ImageIcon,
      label: "Photo",
      activeColor: "text-teal-600",
    },
    {
      tab: "article",
      icon: FileText,
      label: "Article",
      activeColor: "text-amber-600",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[8vh] px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-[560px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Image
                  src={userAvatar}
                  alt={userName}
                  width={48}
                  height={48}
                  className="w-11 h-11 rounded-full object-cover shadow-sm"
                />
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">
                    {userName}
                  </h3>
                  {/* Visibility selector */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowVisibilityMenu(!showVisibilityMenu)
                      }
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors rounded-full border border-gray-200 px-2.5 py-0.5 mt-0.5 hover:bg-gray-50"
                    >
                      <Globe size={12} />
                      <span>{visibility}</span>
                      <ChevronDown size={12} />
                    </button>

                    <AnimatePresence>
                      {showVisibilityMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[200px]"
                        >
                          {visibilityOptions.map((opt) => (
                            <button
                              key={opt.label}
                              onClick={() => {
                                setVisibility(opt.label);
                                setShowVisibilityMenu(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                                visibility === opt.label
                                  ? "bg-teal-50"
                                  : ""
                              }`}
                            >
                              <opt.icon
                                size={16}
                                className={
                                  visibility === opt.label
                                    ? "text-teal-600"
                                    : "text-gray-400"
                                }
                              />
                              <div>
                                <p
                                  className={`text-sm font-medium ${
                                    visibility === opt.label
                                      ? "text-teal-700"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {opt.label}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {opt.desc}
                                </p>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to talk about?"
                className="w-full resize-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none min-h-[120px] leading-relaxed"
              />

              {/* Link Input Field */}
              <AnimatePresence>
                {showLinkInput && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-teal-200/50 transition-all">
                      <LinkIcon size={16} className="text-gray-400 flex-shrink-0" />
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="Add a link (e.g. https://thalorix-web.vercel.app/)"
                        className="flex-1 bg-transparent text-xs text-gray-700 placeholder-gray-400 focus:outline-none"
                      />
                      {link && (
                        <button
                          type="button"
                          onClick={() => setLink("")}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hashtag suggestion */}
              {content.length === 0 && !showLinkInput && (
                <button className="flex items-center gap-1.5 text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors mt-1">
                  <Hash size={16} />
                  Add hashtag
                </button>
              )}

              {/* Media previews */}
              {mediaPreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {mediaPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}

              {/* Drag & drop overlay */}
              <AnimatePresence>
                {isDragging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-teal-50/90 flex items-center justify-center rounded-xl border-2 border-dashed border-teal-400 z-10"
                  >
                    <div className="text-center">
                      <ImageIcon
                        size={40}
                        className="mx-auto text-teal-500 mb-2"
                      />
                      <p className="text-sm font-medium text-teal-700">
                        Drop files here
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Emoji and Link row */}
            <div className="px-5 py-2 flex items-center gap-3 relative">
              <button 
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${showEmojiPicker ? "text-teal-600 bg-teal-50" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Smile size={20} />
              </button>
              
              {showEmojiPicker && (
                <div className="absolute top-10 left-5 z-[100] shadow-2xl rounded-lg">
                  <EmojiPicker 
                    onEmojiClick={(emojiData) => {
                      setContent(prev => prev + emojiData.emoji);
                      setShowEmojiPicker(false);
                    }} 
                    autoFocusSearch={false}
                  />
                </div>
              )}

              <button 
                type="button"
                onClick={() => setShowLinkInput(!showLinkInput)}
                className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${showLinkInput ? "text-teal-600 bg-teal-50" : "text-gray-400 hover:text-gray-600"}`}
              >
                <LinkIcon size={20} />
              </button>
            </div>

            {/* Bottom toolbar */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <div className="flex items-center gap-1">
                {toolbarButtons.map((btn) => (
                  <motion.button
                    key={btn.tab}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveTab(btn.tab);
                      if (btn.tab === "photo" || btn.tab === "video") {
                        fileInputRef.current?.click();
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      activeTab === btn.tab
                        ? `bg-gray-100 ${btn.activeColor}`
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <btn.icon size={18} />
                    <span className="hidden sm:inline">{btn.label}</span>
                  </motion.button>
                ))}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-500 transition-colors"
                >
                  <Plus size={18} />
                </motion.button>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={!canPost}
                  onClick={() => {
                    handlePost();
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    canPost
                      ? "bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Post
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => handleMediaSelect(e.target.files)}
                className="hidden"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}