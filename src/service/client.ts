import BaseService, { ApiResponse } from './base';
import {
  User,
  ApiStats,
  ApiDocument,
  ApiKey,
  PaginatedResponse,
  SystemStatus,
  Feedback
} from './types';

export class ClientService extends BaseService {
  async getStats(): Promise<ApiResponse<ApiStats>> {
    return this.get<ApiStats>('/stats');
  }

  async getDocuments(): Promise<ApiResponse<ApiDocument[]>> {
    return this.get<ApiDocument[]>('/docs');
  }

  async getDocumentById(id: string): Promise<ApiResponse<ApiDocument>> {
    return this.get<ApiDocument>(`/docs/${id}`);
  }

  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.get<User>('/user/profile');
  }

  async getApiKeys(): Promise<ApiResponse<ApiKey[]>> {
    return this.get<ApiKey[]>('/api-keys');
  }

  async getUsers(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<User>>> {
    return this.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.get<User>(`/users/${id}`);
  }

  async getSystemStatus(): Promise<ApiResponse<SystemStatus>> {
    return this.get<SystemStatus>('/system/status');
  }

  async testConnection(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.get<{ status: string; timestamp: string }>('/health');
  }

  async searchDocuments(query: string): Promise<ApiResponse<ApiDocument[]>> {
    return this.get<ApiDocument[]>(`/docs/search?q=${encodeURIComponent(query)}`);
  }

  async getFeedback(): Promise<ApiResponse<Feedback[]>> {
    return this.get<Feedback[]>('/feedback');
  }
}

export const clientService = new ClientService();