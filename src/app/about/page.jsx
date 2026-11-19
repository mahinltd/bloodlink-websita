import StatsSection from '@/components/StatsSection';
import DownloadCTA from '@/components/DownloadCTA';

export const metadata = {
  title: 'About Us — Our Mission',
  description:
    'BloodLink is a voluntary, non-profit blood donation ecosystem built for Bangladesh. Learn about our mission, values, and technology.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About BloodLink',
    description: 'No one should die waiting for blood. Learn about our mission.',
    url: '/about',
  },
};

const values = [
  {
    icon: '🎗️',
    title: '100% Voluntary',
    text: 'Every donation on BloodLink is voluntary. Blood buying or selling is strictly prohibited — violators are banned permanently.',
  },
  {
    icon: '💚',
    title: 'Non-Profit Forever',
    text: 'No commissions, no ads, no premium tiers. We exist to save lives, not to make money.',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    text: 'NID documents are stored privately and permanently deleted after verification. Your data is never sold.',
  },
  {
    icon: '🇧🇩',
    title: 'Built for Bangladesh',
    text: 'Designed for Bangladeshi donors and patients — from division-level search to Bengali-first experience.',
  },
];

const features = [
  { icon: '🎯', title: 'Smart Matching', text: 'Compatible donors matched by blood group, location and availability.' },
  { icon: '🆘', title: 'SOS Alerts', text: 'Critical requests reach nearby donors in seconds via push notification.' },
  { icon: '💬', title: 'Real-Time Chat', text: 'Requesters and donors coordinate directly with live location sharing.' },
  { icon: '🪪', title: 'NID Verification', text: 'Verified donors carry a trust badge — safety for everyone.' },
  { icon: '🏅', title: 'Badges & History', text: 'Donation milestones from First Drop to Legend, with certificates.' },
  { icon: '⏳', title: '90-Day Cooldown', text: 'Automatic eligibility tracking protects donor health.' },
];

export default function AboutPage() {
  return (
    <main>
      <section className="bg-gradient-to-b from-cream to-white">
        <div className="container-x py-16 text-center sm:py-24">
          <span className="eyebrow">❤️ About BloodLink</span>
          <h1 className="font-display mx-auto mt-4 max-w-3xl text-4xl font-extrabold text-ink sm:text-5xl">
            We Believe No One Should Die Waiting for Blood
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-ink/60 sm:text-lg">
            Every year, thousands of patients in Bangladesh struggle to find blood
            in time. BloodLink was built to change that — connecting voluntary
            donors with patients through technology, in minutes.
          </p>
        </div>
      </section>

      <section className="container-x section-pad">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">🧭 Our Values</span>
          <h2 className="section-title mt-4">What We Stand For</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="card p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                {v.icon}
              </div>
              <h3 className="font-display mt-4 font-bold text-ink">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="container-x section-pad">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">⚙️ The Platform</span>
            <h2 className="section-title mt-4">Technology That Saves Lives</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card p-7">
                <div className="text-3xl">{f.icon}</div>
                <h3 className="font-display mt-3 font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm text-ink/60">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />
      <DownloadCTA />
    </main>
  );
}