import { api } from './api';
import type { IConversation } from '../types/conversation';
import type { IMessage } from '../types/message';

export async function getUserConversations(userId: string): Promise<IConversation[]> {
  const { data } = await api.get<IConversation[]>(`/conversations/user/${userId}`);
  return data;
}

export async function createConversation(payload: {
  userId: string;
  title?: string;
}): Promise<IConversation> {
  const { data } = await api.post<IConversation>('/conversations', payload);
  return data;
}

export async function getConversationMessages(conversationId: string): Promise<IMessage[]> {
  const { data } = await api.get<IMessage[]>(
    `/conversations/${conversationId}/messages`
  );
  return data;
}