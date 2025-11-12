// src/app/dashboard/components/UserTable.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers, deleteUser } from '@/lib/users';
import TablePagination from './TablePagination';
import UserRow from './UserRow';
import UserFormModal from './UserFormModal';
import { toast } from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface UsersResponse {
  data: User[];
  meta: {
    total: number;
  };
}

export default function UserTable() {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const limit = 10;

  const { data, isLoading, refetch } = useQuery<UsersResponse>({
    queryKey: ['users', page],
    queryFn: async () => getUsers(page, limit),
    placeholderData: (previousData) => previousData,
  });

  const users = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      refetch();
    } catch (error: unknown) {
      let message = 'Failed to delete user';
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: unknown } } }).response?.data
          ?.message === 'string'
      ) {
        message = (error as { response?: { data?: { message?: string } } }).response!.data!
          .message!;
      }
      toast.error(message);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">User Management</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + New User
        </button>
      </div>

      {isLoading && users.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No users found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onEdit={() => handleEdit(user)}
                  onDelete={() => handleDelete(user.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedUser}
        onSuccess={refetch}
      />
    </div>
  );
}
