import {
  userService,
  UserPayload,
  UserService,
} from '@/infrastructure/http/userService';
import { PaginatedUsersParams } from '@/core/domain/user';

interface Dependencies {
  gateway: UserService;
}

export const createGetUsersPage =
  ({ gateway }: Dependencies) =>
  async (params: PaginatedUsersParams = {}) =>
    gateway.getUsers(params);

export const createCreateUser =
  ({ gateway }: Dependencies) =>
  async (payload: UserPayload) =>
    gateway.createUser(payload);

export const createUpdateUser =
  ({ gateway }: Dependencies) =>
  async (id: string, payload: Partial<UserPayload>) =>
    gateway.updateUser(id, payload);

export const createDeleteUser =
  ({ gateway }: Dependencies) =>
  async (id: string) =>
    gateway.deleteUser(id);

const defaultDeps = { gateway: userService };

export const getUsersPage = createGetUsersPage(defaultDeps);
export const createUserEntry = createCreateUser(defaultDeps);
export const updateUserEntry = createUpdateUser(defaultDeps);
export const deleteUserEntry = createDeleteUser(defaultDeps);

