export interface UserDTO {
  id: number;
  username: string;
  displayName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  timezone: string;
  createdAt: string;
  lastLoginAt: string | null;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  launchUpdates: boolean;
}
