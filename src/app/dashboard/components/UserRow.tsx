// src/app/dashboard/components/UserRow.tsx
'use client';

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export default function UserRow({ user, onEdit, onDelete }: Props) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <button
          onClick={onEdit}
          className="px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow focus:ring-2 focus:ring-yellow-300"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow focus:ring-2 focus:ring-red-300"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
