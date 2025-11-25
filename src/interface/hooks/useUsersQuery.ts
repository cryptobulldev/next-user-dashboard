import { useQuery } from '@tanstack/react-query';
import { getUsersPage } from '@/core/usecases/users/manageUsers';
import { PaginatedUsersParams, UsersResponse } from '@/core/domain/user';

export const useUsersQuery = ({ page, limit, search }: Required<PaginatedUsersParams>) =>
  useQuery<UsersResponse>({
    queryKey: ['users', page, limit, search],
    queryFn: () => getUsersPage({ page, limit, search }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });

