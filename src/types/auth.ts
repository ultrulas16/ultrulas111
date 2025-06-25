export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserModuleAccess {
  userId: string;
  modules: string[];
}

export interface Module {
  id: string;
  name: string;
  path: string;
  description: string;
  icon?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  moduleAccess: string[];
}