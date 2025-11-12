export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
}
