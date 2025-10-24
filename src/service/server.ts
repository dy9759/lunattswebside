import BaseService, { ApiResponse } from './base';
import {
  User,
  AuthResponse,
  Feedback
} from './types';

export class ServerService extends BaseService {
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/auth/login', { email, password });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/auth/register', userData);
  }

  async createApiKey(name: string): Promise<ApiResponse<{ apiKey: string }>> {
    return this.post<{ apiKey: string }>('/api-keys', { name });
  }

  async revokeApiKey(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/api-keys/${id}`);
  }

  async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.post<User>('/users', userData);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.put<User>(`/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/users/${id}`);
  }

  async sendMessage(conversationId: string, message: string): Promise<ApiResponse<{ id: string; content: string }>> {
    return this.post<{ id: string; content: string }>(`/conversations/${conversationId}/messages`, { message });
  }

  async createDocument(documentData: {
    title: string;
    content: string;
    category: string;
  }): Promise<ApiResponse<{ id: string; title: string }>> {
    return this.post<{ id: string; title: string }>('/documents', documentData);
  }

  async updateDocument(id: string, documentData: Partial<{
    title: string;
    content: string;
    category: string;
  }>): Promise<ApiResponse<void>> {
    return this.put<void>(`/documents/${id}`, documentData);
  }

  async deleteDocument(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/documents/${id}`);
  }

  async submitFeedback(feedbackData: {
    type: string;
    message: string;
    rating?: number;
  }): Promise<ApiResponse<Feedback>> {
    return this.post<Feedback>('/feedback', feedbackData);
  }

  async updateFeedbackStatus(id: string, status: string): Promise<ApiResponse<Feedback>> {
    return this.put<Feedback>(`/feedback/${id}/status`, { status });
  }

  async resetPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/auth/reset-password', { email });
  }

  async changePassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return this.post<{ message: string }>('/auth/change-password', { token, newPassword });
  }
}

export const serverService = new ServerService();