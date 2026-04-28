export type AIModel = 'Thalorix-X Pro' | 'Thalorix-X Fast' | 'Thalorix-X Mini' | 'Thalorix-X Vision';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isCode?: boolean;
  language?: string;
  timestamp: Date;
}

export interface AIResult {}