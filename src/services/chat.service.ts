import { api } from './api';
import type { IMessage } from '../types/message';

interface ISendMessagePayload {
  conversationId: string;
  content: string;
}

interface ISendMessageResponse {
  userMessage: IMessage;
  assistantMessage: IMessage;
}

export async function sendMessage(
  payload: ISendMessagePayload
): Promise<ISendMessageResponse> {
  const { data } = await api.post<ISendMessageResponse>('/chat/message', payload);
  return data;
}