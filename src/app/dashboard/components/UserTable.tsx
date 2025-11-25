// src/app/dashboard/components/UserTable.tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers, deleteUser } from '@/lib/users';
import TablePagination from './TablePagination';
import UserRow from './UserRow';
import UserFormModal from './UserFormModal';
import { toast } from 'react-hot-toast';
import { UsersResponse, User } from '@/app/types/user';

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

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleDelete = async (id: string) => {
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
    <div className="w-full bg-white shadow-md rounded-2xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
        <button
          onClick={handleCreate}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow focus:ring-4 focus:ring-blue-300"
        >
          + New User
        </button>
      </div>

      {isLoading && users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
