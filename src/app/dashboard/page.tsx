'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import UserTable from './components/UserTable';

export default function DashboardPage() {
  const { accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) router.push('/login');
  }, [accessToken, router]);

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => {
            useAuthStore.getState().clear();
            router.push('/login');
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </header>
      <UserTable />
    </div>
  );
}
