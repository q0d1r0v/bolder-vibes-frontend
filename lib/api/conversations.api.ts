import api from './axios';
import type {
  Conversation,
  Message,
  CreateConversationRequest,
  CreateMessageRequest,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export async function getConversations(
  projectId: string,
  params?: PaginationParams
): Promise<PaginatedResponse<Conversation>> {
  const res = await api.get<PaginatedResponse<Conversation>>(
    `/projects/${projectId}/conversations`,
    { params }
  );
  return res.data;
}

export async function getConversation(id: string): Promise<Conversation> {
  const res = await api.get<Conversation>(`/conversations/${id}`);
  return res.data;
}

export async function createConversation(
  projectId: string,
  data?: CreateConversationRequest
): Promise<Conversation> {
  const res = await api.post<Conversation>(`/projects/${projectId}/conversations`, data || {});
  return res.data;
}

export async function sendMessage(
  conversationId: string,
  data: CreateMessageRequest
): Promise<Message> {
  if (!conversationId) {
    throw new Error('conversationId is required to send a message');
  }

  const res = await api.post<Message>(`/conversations/${conversationId}/messages`, data);
  return res.data;
}

export async function deleteConversation(id: string): Promise<void> {
  await api.delete(`/conversations/${id}`);
}
