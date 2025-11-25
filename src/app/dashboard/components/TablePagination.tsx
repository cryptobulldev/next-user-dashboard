// src/app/dashboard/components/TablePagination.tsx
'use client';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function TablePagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow focus:ring-2 focus:ring-gray-400"
      >
        Prev
      </button>

      <span className="text-sm font-medium text-gray-700">
        Page <strong className="text-gray-900">{page}</strong> of <strong className="text-gray-900">{totalPages}</strong>
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow focus:ring-2 focus:ring-gray-400"
      >
        Next
      </button>
    </div>
  );
}
