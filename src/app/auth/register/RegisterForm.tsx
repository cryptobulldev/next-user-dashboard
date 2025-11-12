'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export default function RegisterForm() {
  const router = useRouter();
  const setTokens = useAuthStore((state) => state.setTokens);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', form);
      const { accessToken, refreshToken } = res.data;
      setTokens(accessToken, refreshToken || '');
      document.cookie = `accessToken=${accessToken}; path=/;`;
      router.replace('/dashboard');
    } catch (err: unknown) {
      let message = 'Registration failed';
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: unknown } } }).response?.data?.message ===
          'string'
      ) {
        message = (err as { response?: { data?: { message?: string } } }).response!.data!.message!;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
          placeholder="Your name"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 transition-all shadow-sm hover:shadow focus:ring-4 focus:ring-blue-300"
      >
        {loading ? 'Creating Account…' : 'Sign Up'}
      </button>

      <p className="text-sm text-center text-gray-600">
        Already have an account?{' '}
        <a href="/auth/login" className="text-blue-600 font-medium hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
}
