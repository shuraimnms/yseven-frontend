import { api } from './api';

export interface ChatInitResponse {
  sessionId: string;
  welcomeMessage: string;
  quickReplies: string[];
}

export interface ChatMessageResponse {
  response: string;
  intent: string;
  confidence: number;
  quickReplies?: string[];
  requiresData?: boolean;
}

export interface ChatMessage {
  userId?: string;
  sessionId: string;
  message: string;
  sender: 'user' | 'bot';
  intent?: string;
  confidence?: number;
  createdAt: string;
}

export interface LeadData {
  name: string;
  phone?: string;
  email?: string;
  country?: string;
  interest: string;
  message: string;
  sessionId: string;
}

class ChatAPI {
  private baseURL = '/chat';

  async initialize(): Promise<ChatInitResponse> {
    const response = await api.get(`${this.baseURL}/init`);
    return response.data.data;
  }

  async sendMessage(sessionId: string, message: string, userId?: string): Promise<ChatMessageResponse> {
    const response = await api.post(`${this.baseURL}/message`, {
      sessionId,
      message,
      userId
    });
    return response.data.data;
  }

  async submitLead(leadData: LeadData): Promise<{ message: string; leadId: string }> {
    const response = await api.post(`${this.baseURL}/lead`, leadData);
    return response.data.data;
  }

  async getChatHistory(sessionId: string, limit?: number): Promise<ChatMessage[]> {
    const response = await api.get(`${this.baseURL}/history/${sessionId}`, {
      params: { limit }
    });
    return response.data.data;
  }
}

export const chatAPI = new ChatAPI();