// ===============================
// Core Data Models
// ===============================

export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed";

export type MessageType =
  | "text"
  | "audio"
  | "image"
  | "file"
  | "pdf"
  | "zip";

// -------------------------------

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  avatar?: string;
  logo?: string;
  online?: boolean;
  lastSeen?: string; // ISO date
}

// -------------------------------

export interface Message {
  id: string;

  sender: User;

  type?: MessageType;

  text?: string;

  timestamp: string; // ISO string

  status?: MessageStatus;

  // media
  audioUrl?: string;

  imageUrl?: string;

  fileUrl?: string;

  fileType?: "pdf" | "zip" | "image" | "file";

  fileName?: string;

  // optional extras (future features)
  edited?: boolean;

  replyTo?: string;

  replyToMessage?: Message;

  reactions?: {
    emoji: string;
    users: string[];
  }[];
  attachmentUrl?: string;

  isDeleted?: boolean;
}

// -------------------------------

export interface Conversation {
  id: string;

  participants: User[];

  messages: Message[];

  lastMessage?: Message;

  unreadCount?: number;

  updatedAt?: string;
}

// ===============================
// Component Props
// ===============================

export interface ChatListItemProps {
  conversation: Conversation;
  selected?: boolean;
  onClick?: () => void;
}

export interface MessageBubbleProps {
  message: Message;
  isOwn?: boolean;
  onImageClick?: (url: string) => void;
  onReply?: (message: Message) => void;
}

export interface ChatHeaderProps {
  user: User;
}

export interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: (
    content: string,
    type?: "text" | "audio" | "image" | "file" | "pdf" | "zip",
    fileName?: string
  ) => void;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
}
