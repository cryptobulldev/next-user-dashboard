'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/state/auth.store';
import UserTable from './components/UserTable';

export default function DashboardPage() {
  const { accessToken, hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!accessToken) router.push('/auth/login');
  }, [accessToken, hydrated, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <button
            onClick={() => {
              useAuthStore.getState().dispatch({ type: 'LOGOUT' });
              router.push('/auth/login');
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all shadow-sm hover:shadow focus:ring-4 focus:ring-red-300"
          >
            Logout
          </button>
        </header>
        <UserTable />
      </div>
    </div>
  );
}
