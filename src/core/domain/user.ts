export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
}

export interface PaginatedUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

