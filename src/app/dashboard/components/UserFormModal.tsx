'use client';

import { useState, useEffect, useMemo } from 'react';
import { createUser, updateUser, UserPayload } from '@/lib/users';
import { toast } from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: (UserPayload & { id: number }) | null;
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
        await updateUser(initialData.id, form);
        toast.success('User updated successfully!');
      } else {
        await createUser(form);
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
        className="bg-white dark:bg-gray-900 w-full max-w-md p-6 rounded-2xl shadow-lg"
      >
        <h2 id={titleId} className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="user-form-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              id="user-form-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="user-form-email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="user-form-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {!initialData && (
            <div>
              <label
                htmlFor="user-form-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="user-form-password"
                name="password"
                type="password"
                value={form.password ?? ''}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
