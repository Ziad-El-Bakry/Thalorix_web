// basic data structures used by the messaging UI

export interface User {
    id: string;
    name: string;
    avatarUrl?: string;
    online?: boolean;
}

export interface Message {
    id: string;
    sender: User;
    text?: string;
    timestamp: string; // ISO string
    status?: "sent" | "delivered" | "read" | "failed";
    audioUrl?: string;
    imageUrl?: string;
    fileUrl?: string;
    fileType?: "pdf" | "zip" | "image" | "file";
    fileName?: string;
}

export interface Conversation {
    id: string;
    participants: User[];
    messages: Message[];
    lastMessage?: Message;
}

// props interfaces for components
export interface ChatListItemProps {
    conversation: Conversation;
    selected?: boolean;
    onClick?: () => void;
}

export interface MessageBubbleProps {
    message: Message;
    isOwn?: boolean;
}

export interface ChatHeaderProps {
    user: User;
}

export interface MessageInputProps {
    value: string;
    onChange: (val: string) => void;
    onSend: (content: string, type?: "text" | "audio" | "image" | "file" | "pdf" | "zip", fileName?: string) => void;
}
