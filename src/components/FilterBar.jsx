'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DIVISIONS } from '@/constants/locations';
import { BLOOD_GROUPS } from '@/constants/bloodGroups';

export default function FilterBar({
  basePath,
  params = {},
  showBloodGroup = false,
  placeholder = 'Search...',
}) {
  const router = useRouter();
  const [search, setSearch] = useState(params.search || '');

  useEffect(() => setSearch(params.search || ''), [params.search]);

  const apply = (overrides = {}) => {
    const merged = { ...params, ...overrides, page: '' };
    const qs = new URLSearchParams(
      Object.entries(merged).filter(([, v]) => v)
    ).toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  return (
    <div className="card !rounded-2xl p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply({ search });
          }}
          className="flex flex-1 gap-2"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <button type="submit" className="btn-primary !px-6 !py-2.5">
            Search
          </button>
        </form>

        <div className="flex gap-2">
          <select
            value={params.division || ''}
            onChange={(e) => apply({ division: e.target.value })}
            className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="">All Divisions</option>
            {DIVISIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {showBloodGroup && (
            <select
              value={params.bloodGroup || ''}
              onChange={(e) => apply({ bloodGroup: e.target.value })}
              className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="">All Groups</option>
              {BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}