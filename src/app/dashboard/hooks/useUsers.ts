import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { UsersResponse } from '@/app/types/user';

export const useUsers = (page: number, limit: number, search: string) =>
  useQuery<UsersResponse>({
    queryKey: ['users', page, limit, search],
    queryFn: async () => {
      const { data } = await api.get<UsersResponse>('/users', { params: { page, limit, search } });
      return data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });
