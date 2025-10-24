export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiStats {
  totalUsers: number;
  totalRequests: number;
  uptime: number;
  activeConnections: number;
  responseTime: number;
}

export interface ApiDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  endpoint: string;
  method: string;
  parameters?: ApiParameter[];
  response?: unknown;
  examples?: ApiExample[];
}

export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: unknown;
}

export interface ApiExample {
  request: unknown;
  response: unknown;
  description: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SystemStatus {
  status: string;
  version: string;
  environment: string;
  components: SystemComponent[];
}

export interface SystemComponent {
  name: string;
  status: string;
  message?: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  type: string;
  message: string;
  rating?: number;
  createdAt: string;
  status: string;
}