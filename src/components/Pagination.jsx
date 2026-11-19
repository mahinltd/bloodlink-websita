'use client';

import { useRouter } from 'next/navigation';

export default function Pagination({ page = 1, totalPages = 1, basePath, params = {} }) {
  const router = useRouter();
  if (totalPages <= 1) return null;

  const go = (p) => {
    const qs = new URLSearchParams(
      Object.entries({ ...params, page: p }).filter(([, v]) => v)
    ).toString();
    router.push(`${basePath}?${qs}`);
  };

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = [];
  for (let i = start; i <= Math.min(totalPages, start + 4); i++) pages.push(i);

  const btn = 'h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition';

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className={`${btn} border border-ink/10 disabled:opacity-30`}
      >
        ← Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`${btn} ${
            p === page
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'border border-ink/10 hover:border-primary hover:text-primary'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        className={`${btn} border border-ink/10 disabled:opacity-30`}
      >
        Next →
      </button>
    </div>
  );
}