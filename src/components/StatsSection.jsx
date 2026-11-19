import { getPublicStats } from '@/lib/api';
import CountUp from './CountUp';

export default async function StatsSection() {
  const stats = await getPublicStats();

  const items = [
    { icon: '🩸', label: 'Registered Donors', value: stats.donors, suffix: '' },
    { icon: '💉', label: 'Successful Donations', value: stats.donations, suffix: '' },
    { icon: '❤️', label: 'Lives Impacted', value: stats.livesImpacted, suffix: '' },
    { icon: '🤝', label: 'Requests Fulfilled', value: stats.requestsFulfilled, suffix: '' },
  ];

  return (
    <section className="bg-ink text-white">
      <div className="container-x section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow !bg-white/10 !text-white">📊 Live Impact</span>
          <h2 className="font-display mt-4 text-3xl font-extrabold sm:text-4xl">
            Every Drop Counts
          </h2>
          <p className="mt-3 text-white/60">
            Real-time numbers from the BloodLink network — updated live from our servers.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur transition hover:bg-white/10 sm:p-8"
            >
              <div className="text-3xl">{item.icon}</div>
              <div className="font-display mt-3 text-3xl font-extrabold text-white sm:text-4xl">
                <CountUp end={item.value} suffix={item.suffix} />
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider text-white/50 sm:text-sm">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}