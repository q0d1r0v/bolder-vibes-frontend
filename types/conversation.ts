export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  metadata: Record<string, unknown> | null;
  conversationId: string;
  agentTaskId: string | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string | null;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
  _count?: {
    messages: number;
  };
}

export interface CreateConversationRequest {
  title?: string;
}

export interface CreateMessageRequest {
  content: string;
}

export interface AiModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  costTier: 'low' | 'medium' | 'high';
}
