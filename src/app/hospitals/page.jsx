import { getHospitals } from '@/lib/api';
import FilterBar from '@/components/FilterBar';
import DirectoryCard from '@/components/DirectoryCard';
import Pagination from '@/components/Pagination';

export const metadata = {
  title: 'Hospitals in Bangladesh',
  description:
    'Find hospitals across Bangladesh — Dhaka, Chattogram, Rajshahi, Khulna and more. Verified hospital directory by BloodLink.',
  keywords: ['hospitals bangladesh', 'hospital dhaka', 'hospital directory', 'হাসপাতাল'],
  alternates: { canonical: '/hospitals' },
  openGraph: {
    title: 'Hospitals in Bangladesh | BloodLink',
    description: 'Verified hospital directory across Bangladesh.',
    url: '/hospitals',
  },
};

function EmptyState() {
  return (
    <div className="card mx-auto mt-10 max-w-md p-10 text-center">
      <div className="text-5xl">🏥</div>
      <h3 className="font-display mt-4 text-lg font-bold text-ink">No hospitals found</h3>
      <p className="mt-2 text-sm text-ink/60">
        Try a different search or filter — our directory is growing every day.
      </p>
    </div>
  );
}

export default async function HospitalsPage({ searchParams }) {
  const sp = await searchParams;
  const params = {
    search: sp.search || '',
    division: sp.division || '',
    page: sp.page || '',
  };
  const { items, pagination } = await getHospitals(params);

  return (
    <main>
      <section className="bg-gradient-to-b from-cream to-white">
        <div className="container-x py-16 text-center sm:py-20">
          <span className="eyebrow">🏥 Hospital Directory</span>
          <h1 className="section-title mt-4">Find Hospitals Near You</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink/60">
            Verified hospitals across Bangladesh — live from the BloodLink network.
          </p>
        </div>
      </section>

      <section className="container-x pb-20">
        <FilterBar basePath="/hospitals" params={params} placeholder="Search hospital name..." />

        {items.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((h) => (
              <DirectoryCard key={h._id} item={h} type="hospital" />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          basePath="/hospitals"
          params={params}
        />
      </section>
    </main>
  );
}