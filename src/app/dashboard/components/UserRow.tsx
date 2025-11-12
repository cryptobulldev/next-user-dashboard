// src/app/dashboard/components/UserRow.tsx
'use client';

interface Props {
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export default function UserRow({ user, onEdit, onDelete }: Props) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{user.name}</td>
      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{user.email}</td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-right space-x-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 text-sm bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
