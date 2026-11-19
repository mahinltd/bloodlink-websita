import { getBloodBanks } from '@/lib/api';
import FilterBar from '@/components/FilterBar';
import DirectoryCard from '@/components/DirectoryCard';
import Pagination from '@/components/Pagination';

export const metadata = {
  title: 'Blood Banks in Bangladesh',
  description:
    'Find blood banks with available blood groups (A+, B+, O+, AB+ and rare groups) across Bangladesh. Live directory by BloodLink.',
  keywords: ['blood bank bangladesh', 'blood bank dhaka', 'ব্লাড ব্যাংক', 'blood group availability'],
  alternates: { canonical: '/blood-banks' },
  openGraph: {
    title: 'Blood Banks in Bangladesh | BloodLink',
    description: 'Find blood banks with your required blood group.',
    url: '/blood-banks',
  },
};

function EmptyState() {
  return (
    <div className="card mx-auto mt-10 max-w-md p-10 text-center">
      <div className="text-5xl">🩸</div>
      <h3 className="font-display mt-4 text-lg font-bold text-ink">No blood banks found</h3>
      <p className="mt-2 text-sm text-ink/60">
        Try removing filters — or download the app to request blood directly from donors.
      </p>
    </div>
  );
}

export default async function BloodBanksPage({ searchParams }) {
  const sp = await searchParams;
  const params = {
    search: sp.search || '',
    division: sp.division || '',
    bloodGroup: sp.bloodGroup || '',
    page: sp.page || '',
  };
  const { items, pagination } = await getBloodBanks(params);

  return (
    <main>
      <section className="bg-gradient-to-b from-cream to-white">
        <div className="container-x py-16 text-center sm:py-20">
          <span className="eyebrow">🩸 Blood Bank Directory</span>
          <h1 className="section-title mt-4">Find Available Blood</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink/60">
            Filter by blood group to see which banks currently have your required group.
          </p>
        </div>
      </section>

      <section className="container-x pb-20">
        <FilterBar
          basePath="/blood-banks"
          params={params}
          showBloodGroup
          placeholder="Search blood bank..."
        />

        {items.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((b) => (
              <DirectoryCard key={b._id} item={b} type="bloodBank" />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          basePath="/blood-banks"
          params={params}
        />
      </section>
    </main>
  );
}