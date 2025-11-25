'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import {
  createUserEntry,
  updateUserEntry,
} from '@/core/usecases/users/manageUsers';
import { UserPayload } from '@/infrastructure/http/userService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: (UserPayload & { id: string }) | null;
  onSuccess?: () => void;
}

export default function UserFormModal({ isOpen, onClose, initialData, onSuccess }: Props) {
  const [form, setForm] = useState<UserPayload>({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit User' : 'Create User';
  const titleId = useMemo(
    () => (initialData ? 'user-form-modal-title-edit' : 'user-form-modal-title-create'),
    [initialData],
  );

  useEffect(() => {
    if (initialData) {
      setForm({ name: initialData.name, email: initialData.email, password: '' });
    } else {
      setForm({ name: '', email: '', password: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialData) {
        await updateUserEntry(initialData.id, form);
        toast.success('User updated successfully!');
      } else {
        await createUserEntry(form);
        toast.success('User created successfully!');
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      let message = 'Failed to save user';
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: unknown } } }).response?.data?.message ===
          'string'
      ) {
        message = (err as { response?: { data?: { message?: string } } }).response!.data!.message!;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md"
      >
        <h2 id={titleId} className="text-2xl font-bold text-gray-800 mb-6">
          {title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label
              htmlFor="user-form-name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="user-form-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
              placeholder="User name"
              required
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="user-form-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="user-form-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
              placeholder="user@example.com"
              required
            />
          </div>

          {!initialData && (
            <div className="space-y-1">
              <label
                htmlFor="user-form-password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="user-form-password"
                name="password"
                type="password"
                value={form.password ?? ''}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-all shadow-sm hover:shadow focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow focus:ring-4 focus:ring-blue-300"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
